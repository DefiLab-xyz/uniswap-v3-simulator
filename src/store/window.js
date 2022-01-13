import { createSlice } from "@reduxjs/toolkit";

export const windowSlice = createSlice({
  name: "window",
  initialState: { value: { width: window.innerWidth, height: window.innerHeight } },
  reducers: {
    setWindowDimensions: (state, action) => {
      state.value = action.payload;
    }
  }
});

export const selectWindowDimensions = state => state.window.value;
export const { setWindowDimensions } = windowSlice.actions;
export default windowSlice.reducer;