// Import locale JSON files containing the translation strings
import enMessages from "./locales/en.json";
import hyMessages from "./locales/am.json";
import type { Locale } from "../constants/types/index.types.ts";

// Define the type for the locale messages based on the keys in the English translation file.
// This ensures type safety and that all keys present in 'en' are expected in other locales.
type LocaleMessage = Record<keyof typeof enMessages, string>;

// Export the messages object, which maps each supported locale to its corresponding translation messages.
export const messages: Record<Locale, LocaleMessage> = {
  en: enMessages,
  am: hyMessages,
};
