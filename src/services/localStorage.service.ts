import type { Locale, ThemeMode } from "../constants/types/index.types.ts";

export const getAccessTokenLS = () => {
  return localStorage.getItem("access_token");
};

export const setAccessTokenLS = (token: string) => {
  localStorage.setItem("access_token", token);
};

export const removeAccessTokenLS = () => {
  localStorage.removeItem("access_token");
};

export const getThemeModeLS = () => {
  return localStorage.getItem("theme_mode") as ThemeMode | null;
};

export const setThemeModeLS = (mode: ThemeMode) => {
  localStorage.setItem("theme_mode", mode);
};

export const removeThemeModeLS = () => {
  localStorage.removeItem("theme_mode");
};

export const getLocaleLS = () => {
  return localStorage.getItem("locale") as Locale | null;
};

export const setLocaleLS = (locale: Locale) => {
  localStorage.setItem("locale", locale);
};

export const removeLocaleLS = () => {
  localStorage.removeItem("locale");
};
