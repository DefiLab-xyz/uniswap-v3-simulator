import { createSlice } from "@reduxjs/toolkit";

const initialState = {
id: "", 
feeTier: 0, 
baseToken: {id: 0, symbol: "", name: "", decimals: "", currentPrice: ""},
quoteToken: {id: 1, symbol: "", name: "", decimals: "", currentPrice: ""}};

export const poolSlice = createSlice({
  name: "pool",
  initialState: { value: initialState },
  reducers: {
    setPool: {
      reducer(state, action) {
        state.value = action.payload;
      },
      prepare(pool) {
        return {
          payload: {
            ...pool,
            baseToken: {id: 0, symbol: pool.token0.symbol, name: pool.token0.name, decimals: pool.token0.decimals, currentPrice: pool.token0Price},
            quoteToken: {id: 1, symbol: pool.token1.symbol, name: pool.token1.name, decimals: pool.token1.decimals, currentPrice: pool.token1Price}
          }
        }
      }
    },
    toggleBaseToken: (state, action) => {
      const oldbase = state.value.baseToken;
      const oldquote = state.value.quoteToken;

      state.value.baseToken = oldquote; 
      state.value.quoteToken = oldbase;
    },
    refreshCurrentPrices: (state, action) => {
      const basePriceField = "token" + state.value.baseToken.id + "Price";
      const quotePriceField = "token" + state.value.quoteToken.id + "Price";

      if (state.value.baseToken.currentPrice !== action.payload[basePriceField]) state.value.baseToken.currentPrice = action.payload[basePriceField]; 
      if (state.value.quoteToken.currentPrice !== action.payload[quotePriceField]) state.value.quoteToken.currentPrice = action.payload[quotePriceField];      
    }
  }
});

export const selectPool = state => state.pool.value;
export const selectPoolID = state => state.pool.value.id;
export const selectBaseToken = state => state.pool.value.baseToken;
export const selectFeeTier = state => state.pool.value.feeTier;
export const selectCurrentPrice = state => state.pool.value.baseToken.currentPrice;

export const { setPool, toggleBaseToken, refreshCurrentPrices } = poolSlice.actions;
export default poolSlice.reducer