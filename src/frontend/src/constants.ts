// Application constants — change these values to rebrand or reconfigure the app

export const APP_NAME = "EverTwo";

// Stripe payment price in USD
export const AD_PUBLISH_PRICE_USD = 4.99;

// Profile photo limits
export const MAX_PROFILE_PHOTOS = 7;
export const MAX_PHOTO_SIZE_MB = 5;

// Supported locales with metadata
export interface LocaleInfo {
  code: string;
  name: string;
  nativeName: string;
  rtl?: boolean;
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
];

export const SUPPORTED_LOCALE_CODES = SUPPORTED_LOCALES.map((l) => l.code);
export const DEFAULT_LOCALE = "en";

// Theme
export const THEME_STORAGE_KEY = `${APP_NAME}_theme`;

// Event types — objects with { value } for use in <option> loops
export const EVENT_TYPES = [
  { value: "restaurant" },
  { value: "cinema" },
  { value: "coffee" },
  { value: "walking" },
  { value: "sport" },
  { value: "gaming" },
  { value: "study" },
  { value: "concert" },
  { value: "travel" },
  { value: "other" },
] as const;
export type EventTypeValue = (typeof EVENT_TYPES)[number]["value"];

// Sex options
export const SEX_OPTIONS = [
  { value: "male" },
  { value: "female" },
  { value: "other" },
] as const;
export type SexValue = (typeof SEX_OPTIONS)[number]["value"];

// Expected companion sex options
export const EXPECTED_COMPANION_SEX_OPTIONS = [
  { value: "male" },
  { value: "female" },
  { value: "both" },
] as const;
export type ExpectedCompanionSexValue =
  (typeof EXPECTED_COMPANION_SEX_OPTIONS)[number]["value"];

// Who pays for the event
export const HOW_PAYS_OPTIONS = ["me", "you", "split", "free"] as const;
export type HowPaysOption = (typeof HOW_PAYS_OPTIONS)[number];
// Meet type options
export const MEET_TYPE_OPTIONS = [
  { value: "inPerson" },
  { value: "online" },
] as const;
export type MeetTypeValue = (typeof MEET_TYPE_OPTIONS)[number]["value"];

// Feed
export const MAX_FEED_PAGE_SIZE = 20;

// Geocoding — OpenStreetMap Nominatim (no API key required, respect usage policy)
export const NOMINATIM_URL = "https://nominatim.openstreetmap.org";
