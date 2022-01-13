import { logWithBase, round, sumArray } from "../numbers";

export const roundToNearestTick = (value, feeTier, baseDecimal, quoteDecimal) => {
  const divider = feeTier / 50;
  const valToLog = parseFloat(value) * Math.pow(10, (quoteDecimal - baseDecimal));
  const tickIDXRaw = logWithBase(valToLog,  1.0001);
  const tickIDX = round(tickIDXRaw / divider, 0) * divider;
  const tick = Math.pow(1.0001, tickIDX) / Math.pow(10, (quoteDecimal - baseDecimal));
  return tick;
  
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

const getTickFromPrice = (val, pool, baseSelected) => {

  const decimal0 = baseSelected && baseSelected === 1 ? parseInt(pool.token1.decimals) : parseInt(pool.token0.decimals);
  const decimal1 = baseSelected && baseSelected === 1 ? parseInt(pool.token0.decimals) : parseInt(pool.token1.decimals);

  const valToLog = parseFloat(val) * Math.pow(10, (decimal0 - decimal1));
  const tickIDXRaw = logWithBase(valToLog,  1.0001);
  return round(tickIDXRaw, 0) * -1;
}

const getTickDiff = (currentTick, refPrices, poolSelected) => {

  const refTicks = refPrices.map(d => {
    return !d || d === 0 ? 0  : getTickFromPrice(d, poolSelected);
  });

  let refTick = 0;

  refTicks.forEach(d => {
    refTick = d !== 0 && Math.abs(currentTick - d) > refTick ? Math.abs(currentTick - d) : refTick
  });

  return refTick;
}

const filterTicks = (data, currentTick, refPrices, poolSelected, zoomLevel) => {

  const delta = getTickDiff(currentTick, refPrices, poolSelected);
  const zoom = zoomLevel ? parseFloat(zoomLevel) : 1;
  const min = parseInt(parseFloat(currentTick) - (1 * delta * zoom));
  const max = parseInt(parseFloat(currentTick) + (1 * delta * zoom));

   const filteredData = [...data].filter((d, i) => {
    return parseFloat(d.tickIdx) + parseFloat(d.width) > min && parseFloat(d.tickIdx) < max;
  });  

  if (filteredData && filteredData.length > 1) {

   
    const firstRecord = {...filteredData[0]};
    const lastRecord = {...filteredData[(filteredData.length - 1)]};
    const firstTick = Math.max(min, firstRecord);
    
    firstRecord.tickIdx = firstTick;
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


