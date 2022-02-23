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
  initialState: { value: 1000, leverage: 1, leveraged_value: 1000 },
  reducers: {
    setInvestment: (state, action) => {
      if (state.value !== action.payload) {
        const value = parseFloat(action.payload);
        state.value = value;
        state.leveraged_value = value * state.leverage;
      }
    }, 
    setLeverage: (state, action) => {
      if (state.leverage !== action.payload) {
        const leverage = parseFloat(action.payload);
        state.leverage = leverage;
        state.leveraged_value = state.value * leverage;
      }
    }
  }
});

export const selectInvestment = state => state.investment.value;
export const selectLeverage = state => state.investment.leverage;
export const selectLeveragedValue = state => state.investment.leveraged_value;
export const { setInvestment,  setLeverage} = investmentSlice.actions;
export default investmentSlice.reducer