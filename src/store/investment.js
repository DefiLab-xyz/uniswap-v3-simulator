import { createSlice } from "@reduxjs/toolkit";

export const setDefaultInvestment = currentPrice => {
  return (dispatch, getState) => {
    const price = currentPrice ? currentPrice : getState().pool.value.baseToken.currentPrice;
    const factor = String(parseInt(price)).length - 1;
    dispatch(setInvestment(Math.pow(10, factor)));
  }
}

export const investmentSlice = createSlice({
  name: "investment",
  initialState: { value: 1000 },
  reducers: {
    setInvestment: (state, action) => {
      if (state.value !== action.payload) {
        state.value = parseFloat(action.payload);
      }
    }
  }
});

export const selectInvestment = state => state.investment.value;
export const { setInvestment } = investmentSlice.actions;
export default investmentSlice.reducer