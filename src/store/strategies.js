import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {name: `HODL 100% USDC`, id: "hodl1", color: "#eeaff6", selected: false}, 
  {name: `HODL 100% WETH`, id: "hodl2", color: "#E784BA", selected: false}, 
  {name: "HODL 50/50", id: "hodl5050", color: "#F9C1A0", selected: false}, 
  {name: "Unbounded (V2)", id: "v2", color: "#80E8DD", selected: true},  
  {name: "V3 Strategy 2", id: "v32", color: "#AF81E4", selected: true}, 
  {name: "V3 Strategy 1", id: "v31", color: "#7CC2F6", selected: true}];

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