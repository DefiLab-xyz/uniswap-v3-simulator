import { createSlice } from "@reduxjs/toolkit";
import { chartColors } from "../data/colorsUniswap";

const initialState = [
  {id: "S1", name: "Strategy 1", color: chartColors.blue, token0: "", token1: ""}, 
  {id: "S2", name: "Strategy 2", color: chartColors.purple, token0: "", token1: ""}];

export const tokenRatios = createSlice({
  name: "tokenRatios",
  initialState: initialState,
  reducers: {
    setTokenRatio: (state, action) => {
      const index = state.findIndex(i => i.id === action.payload.id);
      if (index >=0) {
        state[index].token0 = action.payload.token0;
        state[index].token1 = action.payload.token1;
      }
    }
  }
});

export const selectTokenRatios = state => state.tokenRatios;
export const { setTokenRatio } = tokenRatios.actions;
export default tokenRatios.reducer