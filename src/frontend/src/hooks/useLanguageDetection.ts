import { DEFAULT_LOCALE, SUPPORTED_LOCALE_CODES } from "@/constants";
import { useCallback, useState } from "react";

function mapLocaleToSupported(rawLocale: string): string | null {
  const base = rawLocale.split("-")[0].toLowerCase();
  if (SUPPORTED_LOCALE_CODES.includes(base)) return base;
  return null;
}

function detectFromNavigator(): string | null {
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const lang of langs) {
    const mapped = mapLocaleToSupported(lang);
    if (mapped) return mapped;
  }
  return null;
}

export function useLanguageDetection() {
  const [detectedLocale, setDetectedLocale] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectLanguage = useCallback((): string | null => {
    setError(null);
    const locale = detectFromNavigator();
    if (locale) {
      setDetectedLocale(locale);
      return locale;
    }
    setDetectedLocale(DEFAULT_LOCALE);
    setError("Could not detect your language. Please select it manually.");
    return null;
  }, []);

  return { detectedLocale, error, detectLanguage };
}
