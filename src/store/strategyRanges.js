import { createSlice } from "@reduxjs/toolkit";

const initialState = [
{id: "S1", name: "Strategy 1", color: "rgb(124, 194, 246)", 
  inputs: { min: { value: 1, name: "Min", label: "Min Range S1" }, max: {value: 1, name: "Max", label: "Max Range S1" } }}, 
{id: "S2", name: "Strategy 2", color: "rgb(175, 129, 228)", 
  inputs:  { min: { value: 1, name: "Min", label: "Min Range S1" }, max: {value: 1, name: "Max", label: "Max Range S1" } }}];


export const strategyRanges = createSlice({
  name: "strategyRanges",
  initialState: initialState,
  reducers: {
    crementStrategyRangeInputVal: (state, action) => {
      const index = state.findIndex(i => i.id === action.payload.strategyId);
      const key = action.payload.InputValueKey;
      const crement = action.payload.crement;

      state[index].inputs[key].value = parseFloat(state[index].inputs[key].value) + parseFloat(crement);
    },
    setStrategyRangeInputVal: (state, action) => {
      const index = state.findIndex(i => i.id === action.payload.strategyId);
      const key = action.payload.InputValueKey;
      const value = action.payload.value;

      state[index].inputs[key].value = parseFloat(value);
    }
  }
});

export const selectStrategyRanges = state => state.strategyRanges;
export const { setStrategyRangeInputVal, crementStrategyRangeInputVal} = strategyRanges.actions;
export default strategyRanges.reducer;