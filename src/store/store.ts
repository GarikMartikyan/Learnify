import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "./reducers.ts";
import { api } from "../api/index.api.ts";
import { isDevMode } from "../utils/index.utils.ts";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: isDevMode,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
