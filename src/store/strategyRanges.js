import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { roundToNearestTick } from "../helpers/uniswap/liquidity";

const initialState = [
{id: "S1", name: "V3 Strategy 1", color: "rgb(124, 194, 246)", 
  inputs: { min: { value: 1, name: "Min", label: "Min Range S1" }, max: {value: 1, name: "Max", label: "Max Range S1" } },
  liquidityMultiplier: 1, selected: true, leverage: 1
}, 
{id: "S2", name: "V3 Strategy 2", color: "rgb(175, 129, 228)", 
  inputs:  { min: { value: 1, name: "Min", label: "Min Range S1" }, max: {value: 1, name: "Max", label: "Max Range S1" } },
  liquidityMultiplier: 1, selected: true, leverage: 1
}];

const calcContrentratedLiquidityMultiplier = (min, max) => {
  return Math.round((1 / (1 - Math.pow((min / max), 0.25))) * 100) / 100;
}

export const validateStrategyRangeValue = (strategy, key, value) => {
  if (key === 'min') {
    return strategy.inputs["max"].value > value ? true : false;
  }
  else if (key === 'max') {
    return strategy.inputs["min"].value < value ? true : false;
  }

  return false;
}

export const updateStrategyRangeInputVal = (range) => {
  return (dispatch, getState) => {
    const baseDecimal = getState().pool.value.baseToken.decimals;
    const quoteDecimal = getState().pool.value.quoteToken.decimals;
    const feeTier = getState().pool.value.feeTier;
    dispatch(setStrategyRangeInputVal({key: range.key, id: range.id, value: roundToNearestTick(range.value, feeTier, baseDecimal, quoteDecimal)}));
  }
}

export const strategyRanges = createSlice({
  name: "strategyRanges",
  initialState: initialState,
  reducers: {
    crementStrategyRangeInputVal: (state, action) => {
      const index = state.findIndex(i => i.id === action.payload.id);
      if (index >= 0) {
        const key = action.payload.key;
        const crement = action.payload.crement;
        const newValue = parseFloat(state[index].inputs[key].value) + parseFloat(crement);

        if (validateStrategyRangeValue(state[index], key, newValue)) {
          state[index].inputs[key].value = newValue;
          state[index].liquidityMultiplier = calcContrentratedLiquidityMultiplier(state[index].inputs['min'].value, state[index].inputs['max'].value);
        }
        
      }
    
    },
    toggleStrategyRangeInputVals: (state, action) => {

      if (action.payload.baseToken) {

        const baseDecimal = action.payload.baseToken.decimals;
        const quoteDecimal = action.payload.quoteToken.decimals;
        const feeTier = action.payload.feeTier;

        const max1 = 1 / state[0].inputs["min"].value;
        const min1 = 1 / state[0].inputs["max"].value;
        const max2 = 1 / state[1].inputs["min"].value;
        const min2 = 1 / state[1].inputs["max"].value;

        state[0].inputs["min"].value = roundToNearestTick(min1, feeTier, baseDecimal, quoteDecimal);
        state[0].inputs["max"].value = roundToNearestTick(max1, feeTier, baseDecimal, quoteDecimal);
        state[1].inputs["min"].value = roundToNearestTick(min2, feeTier, baseDecimal, quoteDecimal);
        state[1].inputs["max"].value = roundToNearestTick(max2, feeTier, baseDecimal, quoteDecimal);


        state[0].liquidityMultiplier = calcContrentratedLiquidityMultiplier(state[0].inputs['min'].value, state[0].inputs['max'].value);
        state[1].liquidityMultiplier = calcContrentratedLiquidityMultiplier(state[1].inputs['min'].value, state[1].inputs['max'].value);
      }

    },
    setDefaultStrategyRangeInputVals: (state, action) => {

      if (action.payload.baseToken) {

        const currentPrice = action.payload.baseToken.currentPrice;
        const baseDecimal = action.payload.baseToken.decimals;
        const quoteDecimal = action.payload.quoteToken.decimals;
        const std = action.payload.std;
        const feeTier = action.payload.feeTier;

        if (!isNaN(std) && std === 1) { 
          state[0].inputs["min"].value = roundToNearestTick(currentPrice * 0.9, feeTier, baseDecimal, quoteDecimal);
          state[0].inputs["max"].value = roundToNearestTick(currentPrice * 1.1, feeTier, baseDecimal, quoteDecimal);
          state[1].inputs["min"].value = roundToNearestTick(currentPrice * 1.1, feeTier, baseDecimal, quoteDecimal);
          state[1].inputs["max"].value = roundToNearestTick(currentPrice * 1.2, feeTier, baseDecimal, quoteDecimal);
        }
        else {
          const stdP = (std / currentPrice) * 100;
          const multiplier = stdP < 2 ? 8 : 1;
     
          state[0].inputs["min"].value = roundToNearestTick(currentPrice - (multiplier * std), feeTier, baseDecimal, quoteDecimal);
          state[0].inputs["max"].value = roundToNearestTick(currentPrice + (multiplier * std), feeTier, baseDecimal, quoteDecimal);
          state[1].inputs["min"].value = roundToNearestTick(currentPrice - ((multiplier * 2) * std), feeTier, baseDecimal, quoteDecimal);
          state[1].inputs["max"].value = roundToNearestTick(currentPrice + ((multiplier * 2)  * std), feeTier, baseDecimal, quoteDecimal);
        }

        state[0].liquidityMultiplier = calcContrentratedLiquidityMultiplier(state[0].inputs['min'].value, state[0].inputs['max'].value);
        state[1].liquidityMultiplier = calcContrentratedLiquidityMultiplier(state[1].inputs['min'].value, state[1].inputs['max'].value);
      }

    },
    setStrategyRangeInputVal: (state, action) => {
      const index = state.findIndex(i => i.id === action.payload.id);
      if (index >= 0) {
        const key = action.payload.key;
        const value = parseFloat(action.payload.value);

        if (validateStrategyRangeValue(state[index], key, value)) { 
          state[index].inputs[key].value = parseFloat(value);
          state[index].liquidityMultiplier = calcContrentratedLiquidityMultiplier(state[index].inputs['min'].value, state[index].inputs['max'].value);
        }
        
      }
      
    },
    setStrategyRangeSelected: (state, action) => {
      const index = state.findIndex(i => i.id === action.payload);
      if (index >=0) {
        state[index].selected = state[index].selected === true ? false : true;
      }
    }
  }
});

export const selectStrategyRanges = state => state.strategyRanges;

export const selectStrategyRangeById = createSelector([strategies => strategies, (strategies, id) => id], (strategies, id) => {
  return strategies.find(d => d.id === id);
});

export const selectSelectedStrategyRanges = state => {
  const selectedStrategies = [];
  state.strategyRanges.forEach(d => {
    if (d.selected) { selectedStrategies.push(d) }
  });
  
  return selectedStrategies;
}

export const { setStrategyRangeInputVal, setDefaultStrategyRangeInputVals, 
  crementStrategyRangeInputVal, toggleStrategyRangeInputVals, setStrategyRangeSelected} = strategyRanges.actions;
export default strategyRanges.reducer;