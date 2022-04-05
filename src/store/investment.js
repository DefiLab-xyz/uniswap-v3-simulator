import { createSlice } from "@reduxjs/toolkit";

export const setDefaultInvestment = currentPrice => {
  return (dispatch, getState) => {
    if (getState().pool.value.baseToken.symbol === "vUSD") {
      dispatch(setInvestment(1000));
    }
    else {
      const price = currentPrice ? currentPrice : getState().pool.value.baseToken.currentPrice;
      const factor = String(parseInt(price)).length - 1;
      dispatch(setInvestment(Math.pow(10, factor)));
    }
  
  }
}

export const investmentSlice = createSlice({
  name: "investment",
  initialState: { value: 1000 },
  reducers: {
    setInvestment: (state, action) => {
      if (state.value !== action.payload) {
        const value = parseFloat(action.payload);
        state.value = value;
      }
    }
  }
});

export const selectInvestment = state => state.investment.value;
export const { setInvestment,  setLeverage} = investmentSlice.actions;
export default investmentSlice.reducer