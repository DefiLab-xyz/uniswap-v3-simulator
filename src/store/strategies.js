import { createSlice } from "@reduxjs/toolkit";
import { chartColors } from "../data/colorsUniswap";
import { strategyV3, hodlToken1, hodlToken2, hodl5050, V2Unbounded } from "../helpers/uniswap/strategies"

const initialState = [
  {name: `HODL 100% USDC`, id: "hodl1", color: chartColors.lightPink, selected: false, genData: (inputs) => { return hodlToken1(inputs)}}, 
  {name: `HODL 100% WETH`, id: "hodl2", color: chartColors.darkPink, selected: false, genData: (inputs) => { return hodlToken2(inputs)}}, 
  {name: "HODL 50/50", id: "hodl5050", color: chartColors.orange, selected: false, genData: (inputs) => { return hodl5050(inputs)}}, 
  {name: "Unbounded (V2)", id: "v2", color: chartColors.green, selected: true, genData: (inputs) => { return V2Unbounded(inputs)}},  
  {name: "V3 Strategy 2", id: "S2", color: chartColors.purple, selected: true, genData: (inputs) => { return strategyV3(inputs)}}, 
  {name: "V3 Strategy 1", id: "S1", color: chartColors.blue, selected: true, genData: (inputs) => { return strategyV3(inputs)}}];


  // const range1Inputs = { minPrice: strategyRanges[0].inputs.min.value, maxPrice: strategyRanges[0].inputs.max.value };
  // const range2Inputs = { minPrice: strategyRanges[1].inputs.min.value, maxPrice: strategyRanges[1].inputs.max.value };

  // const step = Math.max(currentPrice, (range1Inputs.maxPrice * 1.1) / 2, (range2Inputs.maxPrice * 1.1) / 2);
  // const inputsAll = { investment: investment, currentPrice: currentPrice, step: step };

  // return strategies.map(d => {
  //   const inputs = d.id === 'v31' ? {...range1Inputs, ...inputsAll} : d.id === 'v32' ? {...range2Inputs, ...inputsAll} : {...inputsAll};
  //   return {id: d.id, data: d.genData(inputs)};
  // });

export const genStrategyData = () => {
  return (dispatch, getState) => {
    // const strategyRange1 = getState().strategyRanges[0].inputs;
    // const strategyRange2 = getState().strategyRanges[1].inputs;
    // const currentPrice = getState().pool.baseToken.currentPrice;
    // const investment = getState().investment.value;
    // const step = Math.max(currentPrice, (strategyRange1.max.value * 1.1) / 2, (strategyRange2.max.value * 1.1) / 2);
  }
}

export const strategies = createSlice({
  name: "strategies",
  initialState: initialState,
  reducers: {
    updatePoolStrategyNames: (state, action) => {
      const base = state.findIndex(i => i.id === "hodl1");
      const quote = state.findIndex(i => i.id === "hodl2");
      state[base].name = `HODL 100% ${action.payload.base}`;
      state[quote].name = `HODL 100% ${action.payload.quote}`;
    },
    toggleSelectedStrategy: (state, action) => {
      const index = state.findIndex(i => i.id === action.payload);
      state[index].selected = state[index].selected === true ? false : true;
    }
  }
});

export const selectStrategies = state => state.strategies;
export const { updatePoolStrategyNames,  toggleSelectedStrategy } = strategies.actions;
export default strategies.reducer