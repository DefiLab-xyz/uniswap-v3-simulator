import { createSlice } from "@reduxjs/toolkit";

import {setDefaultStrategyRangeInputVals, toggleStrategyRangeInputVals} from "./strategyRanges";

import { stdSample } from "../helpers/std";
import { sumArray } from "../helpers/numbers";
import { tokensForStrategy, liquidityForStrategy } from "../helpers/uniswap/liquidity";
import { updatePoolStrategyNames } from "./strategies";

import {liquidityByPoolId} from '../api/thegraph/uniTicks'
import {getPoolDayData} from '../api/thegraph/uniPoolDayDatas'



const initialState = {
id: "", 
feeTier: 0, 
name: "",
price_base: "",
price_quote: "",
baseToken: {id: 0, symbol: "", name: "", decimals: "", currentPrice: ""},
quoteToken: {id: 1, symbol: "", name: "", decimals: "", currentPrice: ""},
loading: true, std: "", mean: "", normStd: "", liquidity: ""};

const genDailyStats = (dailyPoolData) => {

  if (!dailyPoolData || !dailyPoolData[0] || !dailyPoolData[0].close) return { std: "", mean: "",  normStd: ""}
  if (!dailyPoolData.length || dailyPoolData.length <= 10) return {std: 1, mean: 1, normStd: "Not enough data"};

  const closePrices = Array.from(dailyPoolData, d => parseFloat(d.close));
  const std = stdSample(closePrices);
  const mean = sumArray(closePrices) / closePrices.length;
  return {std: std, mean: mean, normStd: (std / mean) * 100};

}

const genLiquidityData = (data, feeTier) => {

  const calcTvl = (liquidity, feeTier, price, decimals) => {

    const multiplier = 1 + (feeTier / 500000);
    const T = liquidity * Math.sqrt(price);
    const H = liquidity / Math.sqrt(price * multiplier);

    const amount0 = ((Math.pow(liquidity, 2) / T) - H)  / Math.pow(10, decimals[1]);
    const amount1 = ((Math.pow(liquidity, 2 ) / H) - T) / Math.pow(10, decimals[0]);

    return [amount0, amount1];

  }

  let cumsum = 0;
  const multiplier = 1 + (feeTier / 500000);
  if (data && data.length && data.length > 0) {
    let len = data.length;

  return data.map((d, i) => {

    cumsum += parseFloat(d.liquidityNet);
    const T = cumsum * Math.sqrt(d.price0);
    const H = cumsum / Math.sqrt(d.price0 * multiplier);
    const nextRecord = Math.min((len - 1), (i + 1));
    const width = Math.abs(parseInt(data[nextRecord].tickIdx)  - parseInt(d.tickIdx))

    return {
      ...d, 
      decimal: parseInt(d.pool.token0.decimals) - parseInt(d.pool.token1.decimals),
      liquidity: cumsum,
      width: parseFloat(width),
      tvlAmount0: ((Math.pow(cumsum, 2) / T) - H) / Math.pow(10, d.pool.token0.decimals),
      tvlAmount1: ((Math.pow(cumsum, 2 ) / H) - T) / Math.pow(10, d.pool.token1.decimals),
      price0: parseFloat(d.price0),
      price1: parseFloat(d.price1),
      price0N: Math.pow(1.0001, d.tickIdx) / Math.pow(10, (d.pool.token1.decimals - d.pool.token0.decimals)),
      price1N: Math.pow(1.0001, d.tickIdx * -1) / Math.pow(10, (d.pool.token0.decimals - d.pool.token1.decimals)),
      tickIdx0: parseInt(d.tickIdx),
      tickIdx1: parseInt((d.tickIdx * -1) - width)
    }
  });
  }
  
}

export const fetchPoolData = pool => {

  return async (dispatch, getState) => {

    dispatch(setLoading(true));

    const protocol = pool.protocol ? pool.protocol : getState().protocol.value.id;
    const ticks = await liquidityByPoolId(pool.id, null, protocol);
    const dailyPrices = await getPoolDayData(pool.id, null, protocol);
    const poolStats = genDailyStats(dailyPrices);

    const payload = {
      ...pool,
      name: pool.token1.symbol + " / " + pool.token0.symbol,
      price_base: pool.token0.symbol,
      price_token: pool.token1.symbol,
      baseToken: {id: 0, tokenId: pool.token0.id, symbol: pool.token0.symbol, name: pool.token0.name, decimals: pool.token0.decimals, currentPrice: parseFloat(pool.token0Price)},
      quoteToken: { id: 1, tokenId: pool.token1.id, symbol: pool.token1.symbol, name: pool.token1.name, decimals: pool.token1.decimals, currentPrice: parseFloat(pool.token1Price)},
      loading: false,
      std: poolStats.std,
      mean: poolStats.mean,
      normStd: poolStats.normStd,
      ticks: ticks,
      liquidity: genLiquidityData(ticks, pool.feeTier)
    }

    payload.poolDayData = dailyPrices;
    dispatch(setPool(payload));
    dispatch(setDefaultStrategyRangeInputVals(payload));
    dispatch(updatePoolStrategyNames({base: payload.baseToken.symbol, quote: payload.quoteToken.symbol}));
    

    if (payload.toggleBase === true) {
      dispatch(toggleBaseToken());
    }
  }
};

export const toggleBaseToken = () => {
  return (dispatch, getState) => {
    dispatch(setToggleBaseToken());
    dispatch(updatePoolStrategyNames({base: getState().pool.value.baseToken.symbol, quote: getState().pool.value.quoteToken.symbol}));
    dispatch(toggleStrategyRangeInputVals(getState().pool.value));
  }
}

export const poolSlice = createSlice({
  name: "pool",
  initialState: { value: initialState },
  reducers: {
    setPool: (state, action) => {
      state.value = action.payload;
    },
    setLoading: (state, action) => {
      state.value.loading = action.payload;
    },
    setToggleBaseToken: (state, action) => {
      const oldbase = state.value.baseToken;
      const oldquote = state.value.quoteToken;

      state.value.baseToken = oldquote; 
      state.value.quoteToken = oldbase;
      state.value.name = oldbase.symbol + " / " + oldquote.symbol;
      
    },
    setCurrentPrice: (state, action) => {
      if (action.payload && action.payload > 0) {
        state.value.baseToken.currentPrice = action.payload;
        state.value.quoteToken.currentPrice = 1 / action.payload
      }
    },
    refreshCurrentPrices: (state, action) => {
      const basePriceField = "token" + state.value.baseToken.id + "Price";
      const quotePriceField = "token" + state.value.quoteToken.id + "Price";

      if (state.value.baseToken.currentPrice !== action.payload[basePriceField]) state.value.baseToken.currentPrice = action.payload[basePriceField]; 
      if (state.value.quoteToken.currentPrice !== action.payload[quotePriceField]) state.value.quoteToken.currentPrice = action.payload[quotePriceField];   
      
      state.value.loading = false;
    }
  }
});

export const selectPool = state => state.pool.value;
export const selectPoolID = state => state.pool.value.id;
export const selectBaseToken = state => state.pool.value.baseToken;
export const selectQuoteToken = state => state.pool.value.quoteToken;
export const selectBaseTokenId = state => state.pool.value.baseToken.id;
export const selectFeeTier = state => state.pool.value.feeTier;
export const selectCurrentPrice = state => parseFloat(state.pool.value.baseToken.currentPrice);
export const selectPoolDayData = state => state.pool.value.poolDayData;
export const selectLoading = state => state.pool.value.loading;
export const selectNormStd = state => parseFloat(state.pool.value.normStd);
export const selectLiquidity = state => state.pool.value.liquidity;
export const selectPoolName = state => state.pool.value.name;
export const selectPriceBase = state => state.pool.value.price_base;
export const selectPriceToken = state => state.pool.value.price_token;

export const selectYesterdaysPriceData = state => {
  if (state.pool.value.poolDayData && state.pool.value.poolDayData.length &&
    state.pool.value.poolDayData.length > 2) {
      return state.pool.value.poolDayData[1];
  }
  else {
    return null;
  }
}


export const { setPool, refreshCurrentPrices, setLoading, setToggleBaseToken, setCurrentPrice } = poolSlice.actions;
export default poolSlice.reducer