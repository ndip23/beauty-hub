import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector"; // 1. Added this

import enTranslation from "./locales/en/translation.json";
import frTranslation from "./locales/fr/translation.json";

const defaultLang = "en";

i18n
  .use(LanguageDetector) // 2. Added this to the chain
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
    },
    // 3. Removed 'lng' so the detector can do its job
    fallbackLng: defaultLang,
    detection: {
      order: ["path", "cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
export const supportedLanguages = ["en", "fr"];