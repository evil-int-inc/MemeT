import { DEFAULT_LOCALE, SUPPORTED_LOCALE_CODES } from "@/constants";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import ar from "./locales/ar";
import en from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";
import hi from "./locales/hi";
import pt from "./locales/pt";
import ru from "./locales/ru";
import zh from "./locales/zh";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, es, zh, hi, ar, pt, fr, ru },
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALE_CODES,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
