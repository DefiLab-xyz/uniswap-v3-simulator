import { logWithBase, round, sumArray, parsePrice } from "../numbers";

export const roundToNearestTick = (value, feeTier, baseDecimal, quoteDecimal) => {

  const divider = feeTier / 50;
  const valToLog = parseFloat(value) * Math.pow(10, parseInt(baseDecimal) - parseInt(quoteDecimal));
  const tickIDXRaw = logWithBase(valToLog,  1.0001);
  const tickIDX = round(tickIDXRaw / divider, 0) * divider;
  const tick = Math.pow(1.0001, tickIDX) / Math.pow(10, parseInt(baseDecimal) - parseInt(quoteDecimal));
  console.log(value, tickIDXRaw)
  // div= vertier/50
// TickIDXraw=log(priceinput *(10^(abs(decimal0-decimal1),1.0001)
// TickIDX=round(TickIDXraw/div) * div
// Pricetick = 1.0001^TickIDX/(10^(abs(decimal0-decimal1)

  const m = -Math.floor( Math.log(tick) / Math.log(10) + 1);
  return round(tick, m + 6);
  
}

export const calcLiquidity0 = (sqrtA, sqrtB, amount, decimals) => {
 
  const lowest = Math.min(sqrtA, sqrtB);
  const highest = Math.max(sqrtA, sqrtB);
  return amount / (((highest - lowest) / highest / lowest) / Math.pow(10, decimals));
}

export const calcLiquidity1 =(sqrtA, sqrtB, amount, decimals) => {   

  const lowest = Math.min(sqrtA, sqrtB);
  const highest = Math.max(sqrtA, sqrtB);
  return amount / ((highest - lowest) / Math.pow(10, decimals));
}

export const calc24HrFee = (priceData, pool) => {


  if (priceData && pool) {
    const priceToken0usd = parseFloat(priceData.volumeUSD) / parseFloat(priceData.volumeToken0)
    const priceToken1usd = parseFloat(priceData.volumeUSD) / parseFloat(priceData.volumeToken1)
  
    const decimal0 = pool.token0.decimals;
    const decimal1 = pool.token1.decimals;
    const decimal = decimal1 - decimal0;
  
    const sqrtHigh = Math.sqrt(parseFloat(priceData.high));  //SqrtA
    const sqrtLow = Math.sqrt(parseFloat(priceData.low)); //SQRTB
    const sqrtClose = Math.sqrt(parseFloat(priceData.close)); // sqrt
  
    const target = 1;
    const delta = target / (((sqrtClose - sqrtLow) * priceToken0usd) + (((1 / sqrtClose) - (1 / sqrtHigh)) * priceToken1usd));
    const amount1 = delta * (sqrtClose - sqrtLow);
    const amount0 = delta * ((1 / sqrtClose) - (1 / sqrtHigh));
  
    const sqrtHighDec = Math.sqrt(priceData.high * Math.pow(10, decimal) );
    const sqrtLowDec = Math.sqrt(priceData.low * Math.pow(10, decimal) );
    const sqrtCloseDec = Math.sqrt(priceData.close * Math.pow(10, decimal));
  
    let liquidity;
    const lowest = Math.min(sqrtHighDec, sqrtLowDec);
    const highest = Math.max(sqrtHighDec, sqrtLowDec);
  
    if (sqrtCloseDec <= lowest) {
  
      liquidity =  calcLiquidity0(lowest, highest, amount0, decimal0);
  
    } else if (sqrtCloseDec > lowest && sqrtCloseDec < highest) {
  
      const liquidity0 = calcLiquidity0(sqrtCloseDec, highest, amount0, decimal0);
      const liquidity1 = calcLiquidity1(lowest, sqrtCloseDec, amount1, decimal1);
      liquidity = liquidity0 < liquidity1 ? liquidity0 : liquidity1;
  
    } else {
      liquidity =  calcLiquidity1(lowest, highest, amount1, decimal1);
    }
  
    const fee = (parseFloat(priceData.feesUSD) * (liquidity / (liquidity + parseFloat(priceData.liquidity)))) * 100;
    return isNaN(fee) ? 0 : fee;
  }
  else {
    return 0;
  }


}

export const getTickFromPrice = (val, pool, baseSelected) => {

  const decimal0 = baseSelected && baseSelected === 1 ? parseInt(pool.token1.decimals) : parseInt(pool.token0.decimals);
  const decimal1 = baseSelected && baseSelected === 1 ? parseInt(pool.token0.decimals) : parseInt(pool.token1.decimals);

  const valToLog = parseFloat(val) * Math.pow(10, (decimal0 - decimal1));
  const tickIDXRaw = logWithBase(valToLog,  1.0001);
  return round(tickIDXRaw, 0);
}

export const getPriceFromTick = (tick, pool, baseSelected) => {
  const decimal0 = baseSelected && baseSelected === 1 ? parseInt(pool.token1.decimals) : parseInt(pool.token0.decimals);
  const decimal1 = baseSelected && baseSelected === 1 ? parseInt(pool.token0.decimals) : parseInt(pool.token1.decimals);
  return parsePrice( Math.pow(1.0001, tick) / Math.pow(10, (decimal0 - decimal1)));
  
}

const getTickDiff = (currentTick, refPrices, poolSelected) => {

  const refTicks = refPrices.map(d => {
    return !d || d === 0 ? 0  : getTickFromPrice(d, poolSelected) * -1;
  });

  let refTick = 0;

  refTicks.forEach(d => {
    refTick = d !== 0 && Math.abs(currentTick - d) > refTick ? Math.abs(currentTick - d) : refTick
  });

  return refTick;
}

// Filters liquidity tick data by zoomLevel, the data is filtered from the pool's current price. 
// Controlled by Zoom controls on liquidity density chart. 
export const filterTicks = (data, currentTick, refPrices, poolSelected, zoomLevel) => {

  const delta = getTickDiff(currentTick, refPrices, poolSelected);
  const zoom = zoomLevel ? parseFloat(zoomLevel) : 1;
  const min = parseInt(parseFloat(currentTick) - (1 * delta * zoom));
  const max = parseInt(parseFloat(currentTick) + (1 * delta * zoom));

  const filteredData = [...data].filter((d, i) => {
    return ( parseFloat(d.tickIdx) + parseFloat(d.width) > min && parseFloat(d.tickIdx) < max );
  });  

  if (filteredData && filteredData.length > 1) {

    const firstRecord = {...filteredData[0]};
    const lastRecord = {...filteredData[(filteredData.length - 1)]};
    const firstTick = Math.max(min, firstRecord.tickIdx);
    
    firstRecord.tickIdx = parseInt(firstTick);
    firstRecord.tickIdx0 = firstTick;
    firstRecord.tickIdx1 = firstTick * -1;
    firstRecord.width = filteredData[1].tickIdx0 - firstTick;
    lastRecord.width = max - lastRecord.tickIdx0;
    lastRecord.tickIdx1 = parseFloat(lastRecord.tickIdx0 * -1) - (max - lastRecord.tickIdx0);

    filteredData[0] = firstRecord;
    filteredData[(filteredData.length - 1)] = lastRecord;
    return filteredData;
  }
  else {
    return data; 
  }

}

// Concentrated Liquidity Index //
export const calcCLI = (data, normStd, pool, basePrice) => {

  if (data && data.length) {
    const CLIdata = [...data];

    const percent = (100 - normStd) / 100;
    const price = basePrice * percent;
  
    const liquidity = Array.from(CLIdata, d => d.liquidity);
    const totalSum = sumArray(liquidity);
  
    const filteredData = filterTicks(CLIdata, parseFloat(CLIdata[0].pool.tick), [price], pool, 1); 
    const filteredLiquidity = Array.from(filteredData, d => d.liquidity);
    const filteredSum = sumArray(filteredLiquidity);
  
    return (filteredSum / totalSum) * 100;
  }
  else {
    return 0;
  }
  
}

// Calculate the liquidity share for a strategy based on the number of tokens owned 
export const liquidityForStrategy = (price, low, high, tokens0, tokens1, decimal0, decimal1) => {
  
  const decimal = decimal1 - decimal0;
  const lowHigh = [(Math.sqrt(low * Math.pow(10, decimal))) * Math.pow(2, 96), (Math.sqrt(high * Math.pow(10, decimal))) * Math.pow(2, 96)];

  const sPrice = (Math.sqrt(price * Math.pow(10, decimal))) * Math.pow(2, 96);
  const sLow = Math.min(...lowHigh);
  const sHigh =  Math.max(...lowHigh);
  
  if (sPrice <= sLow) {

    return tokens0 / (( Math.pow(2, 96) * (sHigh-sLow) / sHigh / sLow) / Math.pow(10, decimal0));
    
  } else if (sPrice <= sHigh && sPrice > sLow) {

    const liq0 = tokens0 / (( Math.pow(2, 96) * (sHigh - sPrice) / sHigh / sPrice) / Math.pow(10, decimal0));
    const liq1 = tokens1 / ((sPrice - sLow) / Math.pow(2, 96) / Math.pow(10, decimal1));
    return Math.min(liq1, liq0);
  }
  else {

   return tokens1 / ((sHigh - sLow) / Math.pow(2, 96) / Math.pow(10, decimal1));
  }

}

// Calculate the number of Tokens a strategy owns at a specific price 
export const tokensForStrategy = (minRange, maxRange, investment, price, decimal) => {

  const sqrtPrice = Math.sqrt(price * (Math.pow(10, decimal)));
  const sqrtLow = Math.sqrt(minRange * (Math.pow(10, decimal)));
  const sqrtHigh = Math.sqrt(maxRange * (Math.pow(10, decimal)));

  let delta, amount0, amount1;

  if ( sqrtPrice > sqrtLow && sqrtPrice < sqrtHigh) {
     delta = investment / (((sqrtPrice - sqrtLow)) + (((1 / sqrtPrice) - (1 / sqrtHigh)) * (price * Math.pow(10, decimal))));
     amount1 = delta * (sqrtPrice - sqrtLow);
     amount0 = delta * ((1 / sqrtPrice) - (1 / sqrtHigh)) * Math.pow(10, decimal);
  }
  else if (sqrtPrice < sqrtLow) {
    delta = investment / ((((1 / sqrtLow) - (1 / sqrtHigh)) * price));
    amount1 = 0;
    amount0 = delta * ((1 / sqrtLow) - (1 / sqrtHigh));
  }
  else {
    delta = investment / ((sqrtHigh - sqrtLow)) ;
    amount1 = delta * (sqrtHigh - sqrtLow);
    amount0 = 0;
  }
  return [amount0, amount1];

}

// calculate the amount of fees earned in 1 period by 1 unit of unbounded liquidity //
// fg0 represents the amount of token 0, fg1 represents the amount of token1 //

export const calcUnboundedFees = (globalfee0, prevGlobalfee0, globalfee1, prevGlobalfee1, poolSelected) => {

  const fg0_0 = ((parseInt(globalfee0)) / Math.pow(2, 128)) / (Math.pow(10, poolSelected.token0.decimals));
  const fg0_1 = (((parseInt(prevGlobalfee0))) / Math.pow(2, 128)) / (Math.pow(10, poolSelected.token0.decimals));

  const fg1_0 = ((parseInt(globalfee1)) / Math.pow(2, 128)) / (Math.pow(10, poolSelected.token1.decimals));
  const fg1_1 = (((parseInt(prevGlobalfee1))) / Math.pow(2, 128)) / (Math.pow(10, poolSelected.token1.decimals));

  const fg0 = (fg0_0 - fg0_1); // fee of token 0 earned in 1 period by 1 unit of unbounded liquidity
  const fg1 = (fg1_0 - fg1_1); // fee of token 1 earned in 1 period by 1 unit of unbounded liquidity

  return [fg0, fg1];
}

// estimate the percentage of active liquidity for 1 period for a strategy based on min max bounds 
// low and high are the period's candle low / high values

export const activeLiquidityForCandle = (min, max, low, high) => {

  const divider = (high - low) !== 0 ? (high - low) : 1;
  const ratioTrue = (high - low) !== 0 ? (Math.min(max, high) - Math.max(min, low)) / divider : 1;
  let ratio = high > min && low < max ? ratioTrue * 100 : 0;

  return isNaN(ratio) || !ratio ? 0 : ratio;

}

// Calculate the number of tokens for a Strategy at a specific amount of liquidity & price
export const tokensFromLiquidity = (price, low, high, liquidity, decimal0, decimal1) => {

  const decimal = decimal1 - decimal0;
  const lowHigh = [(Math.sqrt(low * Math.pow(10, decimal))) * Math.pow(2, 96), (Math.sqrt(high * Math.pow(10, decimal))) * Math.pow(2, 96)];

  const sPrice = (Math.sqrt(price * Math.pow(10, decimal))) * Math.pow(2, 96);
  const sLow = Math.min(...lowHigh);
  const sHigh =  Math.max(...lowHigh);
  
  if (sPrice <= sLow) {

    const amount1 = ((liquidity * Math.pow(2, 96) * (sHigh -  sLow) / sHigh / sLow ) / Math.pow(10, decimal0) );
    return [0, amount1];

  } else if (sPrice < sHigh && sPrice > sLow) {
    const amount0 = liquidity * (sPrice - sLow) / Math.pow(2, 96) / Math.pow(10, decimal1);
    const amount1 = ((liquidity * Math.pow(2, 96) * (sHigh -  sPrice) / sHigh / sPrice ) / Math.pow(10, decimal0) );
    return [amount0, amount1];
  }
  else {
    const amount0 = liquidity * (sHigh - sLow) / Math.pow(2, 96) / Math.pow(10, decimal1);
    return [amount0, 0];
  }

}

