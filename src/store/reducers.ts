import { combineReducers } from "@reduxjs/toolkit";
import { api } from "../api/index.api.ts";
import { configReducer } from "./slices/config.slice.ts";
import { layoutReducer } from "./slices/layout.slice.ts";

export const rootReducer = combineReducers({
  config: configReducer,
  layout: layoutReducer,
  [api.reducerPath]: api.reducer,
});
