import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { roundToNearestTick } from "../helpers/uniswap/liquidity";
import chartColors from "../data/colors.json";
import { parsePrice } from "../helpers/numbers";

const initialState = [
{id: "S1", name: "Strategy 1", color: chartColors['uniswap'].S1, 
  inputs: { min: { value: 1, name: "Min", label: "Min Range S1" }, max: {value: 1, name: "Max", label: "Max Range S1" } },
  liquidityMultiplier: 1, selected: true, leverage: 1, rangesEditable: true, tokenratio: {token0: 0.5, token1: 0.5}
}, 
{id: "S2", name: "Strategy 2", color: chartColors['uniswap'].S2, 
  inputs:  { min: { value: 1, name: "Min", label: "Min Range S1" }, max: {value: 1, name: "Max", label: "Max Range S2" } },
  liquidityMultiplier: 1, selected: false, leverage: 1, rangesEditable: true, tokenratio: {token0: 0.5, token1: 0.5}
},
{id: "v2", name: "Unbounded", color: chartColors['uniswap'].v2, 
  inputs:  { min: { value: Math.pow(1.0001, -887220), name: "Min", label: "Min Range V2" }, max: {value: Math.pow(1.0001, 887220), name: "Max", label: "Max Range V2" } },
  liquidityMultiplier: 1, selected: true, leverage: 1, rangesEditable: false, tokenratio: {token0: 0.5, token1: 0.5}
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

        state[0].inputs["min"].value = parsePrice(roundToNearestTick(min1, feeTier, baseDecimal, quoteDecimal));
        state[0].inputs["max"].value = parsePrice(roundToNearestTick(max1, feeTier, baseDecimal, quoteDecimal));
        state[1].inputs["min"].value = parsePrice(roundToNearestTick(min2, feeTier, baseDecimal, quoteDecimal));
        state[1].inputs["max"].value = parsePrice(roundToNearestTick(max2, feeTier, baseDecimal, quoteDecimal));


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
          state[0].inputs["min"].value = parsePrice(roundToNearestTick(currentPrice * 0.9, feeTier, baseDecimal, quoteDecimal));
          state[0].inputs["max"].value = parsePrice(roundToNearestTick(currentPrice * 1.1, feeTier, baseDecimal, quoteDecimal));
          state[1].inputs["min"].value = parsePrice(roundToNearestTick(currentPrice * 1.1, feeTier, baseDecimal, quoteDecimal));
          state[1].inputs["max"].value = parsePrice(roundToNearestTick(currentPrice * 1.2, feeTier, baseDecimal, quoteDecimal));
        }
        else {
          const stdP = (std / currentPrice) * 100;
          const multiplier = stdP < 2 ? 8 : 1;
     
          state[0].inputs["min"].value = parsePrice(roundToNearestTick(currentPrice - (multiplier * std), feeTier, baseDecimal, quoteDecimal));
          state[0].inputs["max"].value = parsePrice(roundToNearestTick(currentPrice + (multiplier * std), feeTier, baseDecimal, quoteDecimal));
          state[1].inputs["min"].value = parsePrice(roundToNearestTick(currentPrice - ((multiplier * 2) * std), feeTier, baseDecimal, quoteDecimal));
          state[1].inputs["max"].value = parsePrice(roundToNearestTick(currentPrice + ((multiplier * 2)  * std), feeTier, baseDecimal, quoteDecimal));
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
        state[index].inputs[key].value = parsePrice(parseFloat(value));
        state[index].liquidityMultiplier = calcContrentratedLiquidityMultiplier(state[index].inputs['min'].value, state[index].inputs['max'].value);
      }
      
    },
    setStrategyRangeSelected: (state, action) => {
      const index = state.findIndex(i => i.id === action.payload);
      if (index >=0) {
        state[index].selected = state[index].selected === true ? false : true;
      }
    },
    setStrategyLeverage: (state, action) => {
      const index = state.findIndex(i => i.id === action.payload.id);
      if (index >=0) {
        state[index].leverage = parseFloat(action.payload.leverage);
      }
    },
    setTokenRatio: (state, action) => {
      const index = state.findIndex(i => i.id === action.payload.id);
      if (index >=0) {
        state[index].tokenratio = action.payload.tokenratio;
      }
    },
    setStrategyRangeColors: (state, action) => {
      state.forEach((d, i) => {
         state[i].color = chartColors[action.payload][d.id];
      });
    }
  }
});

export const selectStrategyRanges = state => state.strategyRanges;

export const selectStrategyRangeById = createSelector([strategies => strategies, (strategies, id) => id], (strategies, id) => {
  return strategies.find(d => d.id === id);
});

export const selectStrategyRangeTokenRatioById = createSelector([strategies => strategies, (strategies, id) => id], (strategies, id) => {
  const strategy = strategies.find(d => d.id === id);
  if (strategy) return strategy.tokenratio;
});

export const selectSelectedStrategyRanges = state => {
  const selectedStrategies = [];
  state.strategyRanges.forEach(d => {
    if (d.selected) { selectedStrategies.push(d) }
  });
  
  return selectedStrategies;
}

export const selectSelectedEditableStrategyRanges = state => {
  const selectedStrategies = [];
  state.strategyRanges.forEach(d => {
    if (d.selected && d.rangesEditable) { selectedStrategies.push(d) }
  });
  
  return selectedStrategies;
}

export const selectSelectedEditableTokenRatios = state => {
  const selectedStrategies = [];
  state.strategyRanges.forEach(d => {
    if (d.selected && d.rangesEditable) { selectedStrategies.push(d.tokenratio) }
  });
  
  return selectedStrategies;
}

export const selectEditableStrategyRanges = state => {
  const strategies = [];
  state.strategyRanges.forEach(d => {
    if (d.rangesEditable) { strategies.push(d) }
  });
  
  return strategies;
}

export const selectStrategyRangeMinValues = state => {
  const strategyVals = [];
  state.strategyRanges.forEach(d => {
    if (d.selected && d.rangesEditable) strategyVals.push(d.inputs["min"].value);
  });
  
  return strategyVals;
}

export const selectStrategyRangeMaxValues = state => {
  const strategyVals = [];
  state.strategyRanges.forEach(d => {
    if (d.selected && d.rangesEditable) strategyVals.push(d.inputs["max"].value);
  });
  
  return strategyVals;
}

export const selectStrategyRangeMinMaxValues = state => {
  const strategyVals = [];
  state.strategyRanges.forEach(d => {
    if (d.selected && d.rangesEditable) strategyVals.push({id: d.id, min: d.inputs["min"].value, max: d.inputs["max"].value});
  });
  
  return strategyVals;
}

export const { setStrategyRangeInputVal, setDefaultStrategyRangeInputVals, setStrategyLeverage,
  crementStrategyRangeInputVal, toggleStrategyRangeInputVals, setStrategyRangeSelected, setTokenRatio, setStrategyRangeColors} = strategyRanges.actions;

export default strategyRanges.reducer;