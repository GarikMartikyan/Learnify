import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "./reducers.ts";
import { authApi } from "../api/auth.api.ts";
import { isDevMode } from "../utils/index.utils.ts";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
  devTools: isDevMode,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
