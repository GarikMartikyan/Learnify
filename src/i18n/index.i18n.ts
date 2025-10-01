import enMessages from "./locales/en.json";
import hyMessages from "./locales/am.json";
import type { Locale } from "../constants/types/index.types.ts";

type LocaleMessage = Record<keyof typeof enMessages, string>;

export const messages: Record<Locale, LocaleMessage> = {
  en: enMessages,
  am: hyMessages,
};
