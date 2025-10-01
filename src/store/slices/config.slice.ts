import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store.ts";
import type { Locale, ThemeMode } from "../../constants/types/index.types.ts";
import {
  getLocaleLS,
  getThemeModeLS,
  setLocaleLS,
  setThemeModeLS,
} from "../../services/localStorage.service.ts";

interface ConfigState {
  themeMode: ThemeMode;
  locale: Locale;
}

const initialState: ConfigState = {
  themeMode: getThemeModeLS() || "light",
  locale: getLocaleLS() || "am",
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
  },
});

export const { setThemeMode, setLocale } = configSlice.actions;
export const configReducer = configSlice.reducer;

export const selectThemeMode = (state: RootState) => state.config.themeMode;
export const selectLocale = (state: RootState) => state.config.locale;
