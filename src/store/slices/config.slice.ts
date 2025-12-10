import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store.ts";
import type { Locale, ThemeMode } from "../../constants/types/index.types.ts";
import {
  getAccessTokenLS,
  getLocaleLS,
  getThemeModeLS,
  removeAccessTokenLS,
  setAccessTokenLS,
  setLocaleLS,
  setThemeModeLS,
} from "../../services/localStorage.service.ts";

interface ConfigState {
  themeMode: ThemeMode;
  locale: Locale;
  accessToken?: string | null;
}

const initialState: ConfigState = {
  themeMode: getThemeModeLS() || "light",
  locale: getLocaleLS() || "am",
  accessToken: getAccessTokenLS(),
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      setThemeModeLS(action.payload);
      state.themeMode = action.payload;
    },
    setLocale: (state, action: PayloadAction<Locale>) => {
      setLocaleLS(action.payload);
      state.locale = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        setAccessTokenLS(action.payload);
      }
      state.accessToken = action.payload;
    },
    removeAccessToken: (state) => {
      removeAccessTokenLS();
      state.accessToken = null;
    },
  },
  selectors: {
    selectLocale: (state: RootState) => state.locale,
    selectThemeMode: (state: RootState) => state.themeMode,
    selectAccessToken: (state: RootState) => state.accessToken,
  },
});

export const { setThemeMode, setLocale, setAccessToken, removeAccessToken } =
  configSlice.actions;
export const { selectLocale, selectAccessToken, selectThemeMode } =
  configSlice.selectors;

export const configReducer = configSlice.reducer;
