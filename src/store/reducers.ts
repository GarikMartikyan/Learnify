import { combineReducers } from "@reduxjs/toolkit";
import { api } from "../api/index.api.ts";
import { configReducer } from "./slices/config.slice.ts";

export const rootReducer = combineReducers({
  config: configReducer,
  [api.reducerPath]: api.reducer,
});
