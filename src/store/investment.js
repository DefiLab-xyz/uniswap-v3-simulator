import { createSlice } from "@reduxjs/toolkit";


export const investmentSlice = createSlice({
  name: "investment",
  initialState: { value: 1000 },
  reducers: {
    setDefaultInvestment: (state, action) => {
      const factor = String(parseInt(action.payload)).length - 1;
      state.value = Math.pow(10, factor);
    },
    setInvestment: (state, action) => {
      if (state.value !== action.payload) {
        state.value = action.payload;
      }
    }
  }
});

export const selectInvestment = state => state.investment.value;
export const { setDefaultInvestment, setInvestment } = investmentSlice.actions;
export default investmentSlice.reducer