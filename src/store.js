import { configureStore } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';
import poolReducer from "./store/pool";
import protocolReducer from "./store/protocol"
import investmentReducer from "./store/investment"
import strategyRangesReducer from "./store/strategyRanges";
import strategiesReducer from "./store/strategies";
import windowReducer from "./store/window"
import tokenRatiosReducer from "./store/tokenRatios";

export const Store = configureStore({
    reducer: {
      pool: poolReducer,
      protocol: protocolReducer,
      investment: investmentReducer,
      strategyRanges: strategyRangesReducer,
      strategies: strategiesReducer,
      window: windowReducer,
      tokenRatios: tokenRatiosReducer
    },
    middleware: [thunk]
});