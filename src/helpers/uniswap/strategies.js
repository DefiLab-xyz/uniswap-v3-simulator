import { round} from "../numbers";

export const genTokenRatios = (strategyData, currentPrice) => {

  const getRatioIndsForPrice = (strategyData, currentPrice) =>  {
    return strategyData.reduce((acc, obj) =>
       Math.abs(currentPrice - obj.x) < Math.abs(currentPrice - acc.x) ? obj : acc
     );
   }

  const genRatioIndicators = (strategyData, currentPrice) => {
    const ratioVals = getRatioIndsForPrice(strategyData, currentPrice);
    if (ratioVals) {
      const token0 = round((ratioVals.base / ratioVals.y) * 100, 2);
      const token1 = round(100 - token0, 2);
      return {token0: token0, token1: token1 };
    }
  };

  return genRatioIndicators(strategyData, currentPrice);
}

export const strategyV3 = (inputs) => {

  const token1V2 = inputs.investment / 2;
  const token2V2 = token1V2 / inputs.currentPrice;
  const L = Math.sqrt((token1V2 * token2V2));
  const L2 = token1V2 * token2V2;
  const T = L * Math.sqrt(inputs.minPrice);
  const H = L / Math.sqrt(inputs.maxPrice);
  const maxToken2 = (L2 / H) - T;
  const maxToken1 = (L2 / T) - H;

  const LP_a = inputs.currentPrice > inputs.maxPrice ? 0 : ((L / Math.sqrt(inputs.currentPrice) - H) * inputs.currentPrice);
  const LP_b = inputs.currentPrice > inputs.maxPrice ? maxToken2 : (L * Math.sqrt(inputs.currentPrice) - T);
  const LP = LP_a + LP_b;
  const multiplier = inputs.currentPrice > inputs.minPrice ? inputs.investment / LP : inputs.investment / (inputs.currentPrice * maxToken1);
  
  const step = inputs.step ? inputs.step / 100 : inputs.currentPrice / 100;
  const from = 0;

  const data = [...Array(200)].map((_, i) => {
   
    const price = from + i * step;
    let x, y, value;

    if (price < inputs.minPrice) {
       x = (maxToken1) * multiplier
       y = 0;
       value = x * price;
    }
    else if ((price >= inputs.minPrice) && (price <= inputs.maxPrice)) {
      x = (L / Math.sqrt(price) - H) * multiplier;
      y = (L * Math.sqrt(price) - T) * multiplier;
      value = (x * price) + y;
    }
    else if (price > inputs.maxPrice) {
      x = 0;
      y = maxToken2 * multiplier;
      value = y;
    }

     return {x: price, y: value, token: x, base: y }
  });

  return data;
}

export const finalPrinciple = (inputs) => {

  const token1V2 = inputs.investment / 2;
  const token2V2 = token1V2 / inputs.currentPrice;
  const L = Math.sqrt((token1V2 * token2V2));
  const L2 = token1V2 * token2V2;
  const T = L * Math.sqrt(inputs.minPrice);
  const H = L / Math.sqrt(inputs.maxPrice);
  const maxToken2 = (L2 / H) - T;
  const maxToken1 = (L2 / T) - H;

  const LP_a = inputs.currentPrice > inputs.maxPrice ? 0 : ((L / Math.sqrt(inputs.currentPrice) - H) * inputs.currentPrice);
  const LP_b = inputs.currentPrice > inputs.maxPrice ? maxToken2 : (L * Math.sqrt(inputs.currentPrice) - T);
  const LP = LP_a + LP_b;
  const multiplier = inputs.currentPrice > inputs.minPrice ? inputs.investment / LP : inputs.investment / (inputs.currentPrice * maxToken1);

    if (inputs.forecastedPrice < inputs.minPrice) {

       let x = (maxToken1) * multiplier
       return (maxToken1 * multiplier) * inputs.forecastedPrice;
    }
    else if ((inputs.forecastedPrice >= inputs.minPrice) && (inputs.forecastedPrice <= inputs.maxPrice)) {
      let x = (L / Math.sqrt(inputs.forecastedPrice) - H) * multiplier;
      let y = (L * Math.sqrt(inputs.forecastedPrice) - T) * multiplier;
      return (x * inputs.forecastedPrice) + y;
    }
    else if (inputs.forecastedPrice > inputs.maxPrice) {
      return maxToken2 * multiplier;
    }

}

export const hodlToken2 = (inputs) => {

  const step = inputs.step ? inputs.step / 100 : inputs.currentPrice / 100;
  const from = 0;

  const data = [...Array(200)].map((_, i) => { 
    const price = from + i * step;
    const value = (inputs.investment / inputs.currentPrice) * price;
    return {x: price, y: value};
  });

  return data;

}

export const hodlToken1 = (inputs) => {

  const step = inputs.step ? inputs.step / 100 : inputs.currentPrice / 100;
  const from = 0;

  const data = [...Array(200)].map((_, i) => { 
    const price = from + i * step;
    const value = inputs.investment;
    return {x: price, y: value};
  });

  return data;

}

export const hodl5050 = (inputs) => {

  const step = inputs.step ? inputs.step / 100 : inputs.currentPrice / 100;
  const from = 0;

  const data = [...Array(200)].map((_, i) => { 
    const price = from + i * step;
    const x = inputs.investment / inputs.currentPrice / 2;
    const y = inputs.investment / 2;
    const value = (x * price) + y;

    return {x: price, y: value};
  });

  return data;

}

export const V2Unbounded = (inputs) => {

  const token1V2 = inputs.investment / 2;
  const token2V2 = token1V2 / inputs.currentPrice;
  const L = Math.sqrt((token1V2 * token2V2));

  const step = inputs.step ? inputs.step / 100 : inputs.currentPrice / 100;
  const from = 0;

  const data = [...Array(200)].map((_, i) => { 
    const price = from + i * step;
    const x = isNaN(L / Math.sqrt(price)) ?  0 : L / Math.sqrt(price) ; 
    const y = isNaN(L * Math.sqrt(price)) ?  0 : L * Math.sqrt(price) ; 
    const value = isNaN((x * price) + y) ? 0 : (x * price) + y;

    return {x: price, y: value};
  });

  return data;

}

export const V3MinLimit = (inputs) => {

  const token1V2 = inputs.investment / 2;
  const token2V2 = token1V2 / inputs.currentPrice;
  const L = Math.sqrt((token1V2 * token2V2));
  const L2 = token1V2 * token2V2;
  const H = L / Math.sqrt(inputs.maxPrice);
  const T = L * Math.sqrt(inputs.minPrice);
  const maxToken1 = ((L2 / T) - H);
  const maxToken2 = (L2 / H) - T;
  const LP_a = inputs.currentPrice > inputs.maxPrice ? 0 : ((L / Math.sqrt(inputs.currentPrice) - H) * inputs.currentPrice);
  const LP_b = inputs.currentPrice > inputs.maxPrice ? maxToken2 : (L * Math.sqrt(inputs.currentPrice) - T);
  const LP = LP_a + LP_b;

  const multiplier = inputs.currentPrice > inputs.minPrice ? inputs.investment / LP : inputs.investment / (inputs.currentPrice * maxToken1);
  let cy;

  if(inputs.minPrice === 0) {
    cy = 0;
  }
  else if (inputs.currentPrice > inputs.minPrice) {
    cy = (maxToken1) * multiplier * inputs.minPrice;
  }
  else if (inputs.currentPrice <= inputs.minPrice) {
  
   let x = (L / Math.sqrt(inputs.minPrice) - H) * multiplier;
   let y = (L * Math.sqrt(inputs.minPrice) - T) * multiplier;
   cy = (x * inputs.minPrice) + y;
  }

  return {cx: inputs.minPrice, cy: cy, x1: inputs.minPrice, y1: 0, x2: inputs.minPrice, y2: cy, y3: inputs.y2 }
}

export const V3MaxLimit = (inputs) => {

  const token1V2 = inputs.investment / 2;
  const token2V2 = token1V2 / inputs.currentPrice;
  const L = Math.sqrt((token1V2 * token2V2));
  const L2 = token1V2 * token2V2;
  const H = L / Math.sqrt(inputs.maxPrice);
  const T = L * Math.sqrt(inputs.minPrice);
  const maxToken1 = ((L2 / T) - H);
  const maxToken2 = (L2 / H) - T;
  const LP_a = inputs.currentPrice > inputs.maxPrice ? 0 : ((L / Math.sqrt(inputs.currentPrice) - H) * inputs.currentPrice);
  const LP_b = inputs.currentPrice > inputs.maxPrice ? maxToken2 : (L * Math.sqrt(inputs.currentPrice) - T);
  const LP = LP_a + LP_b;
  const multiplier = inputs.currentPrice > inputs.minPrice ? inputs.investment / LP : inputs.investment / (inputs.currentPrice * maxToken1);

return {cx: inputs.maxPrice, cy: (maxToken2 * multiplier), x1: inputs.maxPrice, y1: 0, x2: inputs.maxPrice, y2: (maxToken2 * multiplier), y3: inputs }
}

export const V3ImpLossData = (strategy1, strategy2) => {

  let data = [];

  strategy1.forEach((d, i) => {
    const x = d.x;
    const y = ((d.y - strategy2[i].y) / strategy2[i].y) ;
    if(!isNaN(y)) {
      data.push({x: x, y: y});
    }
  });

  return data;
}

export const timeSpendInRange = (inputs) => {
  
  const data = [...Array(100)].map((_, i) => { 
    const y = i * inputs.v3FeeMultiplier * inputs.v2Fee;
    return {x: i, y: y / 100}
  });

  return data;
}
