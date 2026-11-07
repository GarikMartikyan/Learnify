import enFlag from "../assets/flags/gb.svg";
import amFlag from "../assets/flags/am.svg";
import ruFlag from "../assets/flags/ru.svg";
import type { Locale } from "./types/index.types.ts";

/** UI languages with their names written in that language. */
export const localeOptions: { value: Locale; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: enFlag },
  { value: "am", label: "Հայերեն", flag: amFlag },
  { value: "ru", label: "Русский", flag: ruFlag },
];
