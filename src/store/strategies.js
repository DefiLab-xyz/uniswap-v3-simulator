import { createSlice, createSelector } from "@reduxjs/toolkit";
import { chartColors } from "../data/colorsUniswap";
import { strategyV3, hodlToken1, hodlToken2, hodl5050, V2Unbounded } from "../helpers/uniswap/strategies"
import { setStrategyRangeSelected } from './strategyRanges'


const initialState = [
  {name: `HODL 100% USDC`, id: "hodl1", style: { color: chartColors.lightPink }, selected: false, genData: (inputs) => { return hodlToken1(inputs)}}, 
  {name: `HODL 100% WETH`, id: "hodl2", style: { color: chartColors.darkPink }, selected: false, genData: (inputs) => { return hodlToken2(inputs)}}, 
  {name: "HODL 50/50", id: "hodl5050", style: { color: chartColors.orange }, selected: false, genData: (inputs) => { return hodl5050(inputs)}}, 
  {name: "Unbounded (V2)", id: "v2", style: { color: chartColors.green }, selected: true, genData: (inputs) => { return V2Unbounded(inputs)}},  
  {name: "V3 Strategy 2", id: "S2", style: { color: chartColors.purple }, selected: true, genData: (inputs) => { return strategyV3(inputs)}}, 
  {name: "V3 Strategy 1", id: "S1", style: { color: chartColors.blue }, selected: true, genData: (inputs) => { return strategyV3(inputs)}}];


export const toggleSelectedStrategy = action => {
  return (dispatch, getState) => {
    dispatch(setSelectedStrategy(action));
    dispatch(setStrategyRangeSelected(action));
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
    setSelectedStrategy: (state, action) => {
      const index = state.findIndex(i => i.id === action.payload);
      state[index].selected = state[index].selected === true ? false : true;
    }
  }
});


export const selectCompareStrategies = state => state.strategies.filter( s => s.id !== 'S1' && s.id !== 'S2');
export const selectStrategies = state => state.strategies;
export const selectStrategiesByIds = createSelector([strategies => strategies, (strategies, ids) => ids], (strategies, ids) => {
  return strategies.filter(d => ids.includes(d.id));
});
export const { updatePoolStrategyNames, setSelectedStrategy } = strategies.actions;
export default strategies.reducer