import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../api/auth.api.ts";
import { auditApi } from "../api/audit.api.ts";
import { courseApi } from "../api/course.api.ts";
import { enrollmentApi } from "../api/enrollment.api.ts";
import { configReducer } from "./slices/config.slice.ts";
import { layoutReducer } from "./slices/layout.slice.ts";

export const rootReducer = combineReducers({
  config: configReducer,
  layout: layoutReducer,
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [auditApi.reducerPath]: auditApi.reducer,
  [enrollmentApi.reducerPath]: enrollmentApi.reducer,
});
