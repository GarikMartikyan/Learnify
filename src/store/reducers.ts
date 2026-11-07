import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../api/auth.api.ts";
import { auditApi } from "../api/audit.api.ts";
import { configReducer } from "./slices/config.slice.ts";
import { layoutReducer } from "./slices/layout.slice.ts";

export const rootReducer = combineReducers({
  config: configReducer,
  layout: layoutReducer,
  [authApi.reducerPath]: authApi.reducer,
  [auditApi.reducerPath]: auditApi.reducer,
});
