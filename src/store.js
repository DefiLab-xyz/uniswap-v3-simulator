import { configureStore } from "@reduxjs/toolkit";
import poolReducer from "./store/pool";
import protocolReducer from "./store/protocol"
import investmentReducer from "./store/investment"
import strategyRangesReducer from "./store/strategyRanges";
import strategies from "./store/strategies";

export const Store = configureStore({
    reducer: {
      pool: poolReducer,
      protocol: protocolReducer,
      investment: investmentReducer,
      strategyRanges: strategyRangesReducer,
      strategies: strategies
    }
});