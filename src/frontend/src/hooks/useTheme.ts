import { THEME_STORAGE_KEY } from "@/constants";
import { useCallback, useEffect, useState } from "react";
import { useTimeBasedTheme } from "./useTimeBasedTheme";

type Theme = "lofi" | "black";
type ThemeChoice = "system" | Theme;

/**
 * Returns true if window.matchMedia is available and the
 * prefers-color-scheme query can be evaluated without throwing.
 */
function detectSystemAvailable(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)") instanceof
        MediaQueryList
    );
  } catch {
    return false;
  }
}

function getSystemTheme(): Theme {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "black"
      : "lofi";
  } catch {
    return "lofi";
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function getTimeBasedTheme(): Theme {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 20 ? "lofi" : "black";
}

function getStoredThemeChoice(): ThemeChoice {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "system" || stored === "lofi" || stored === "black") {
    return stored;
  }
  return "system";
}

const isSystemDetectionAvailable = detectSystemAvailable();

function resolveTheme(choice: ThemeChoice): Theme {
  if (choice !== "system") return choice;
  if (isSystemDetectionAvailable) return getSystemTheme();
  return getTimeBasedTheme();
}

function getInitialTheme(): { theme: Theme; themeChoice: ThemeChoice } {
  const themeChoice = getStoredThemeChoice();
  return { theme: resolveTheme(themeChoice), themeChoice };
}

export function useTheme() {
  const [state, setState] = useState<{
    theme: Theme;
    themeChoice: ThemeChoice;
  }>(() => {
    const init = getInitialTheme();
    applyTheme(init.theme);
    return init;
  });

  const { timeBasedTheme } = useTimeBasedTheme();

  // Apply time-based fallback when system detection is unavailable.
  useEffect(() => {
    if (!isSystemDetectionAvailable && state.themeChoice === "system") {
      applyTheme(timeBasedTheme);
      setState((prev) => ({ ...prev, theme: timeBasedTheme }));
    }
  }, [timeBasedTheme, state.themeChoice]);

  // Listen for operating system theme changes while following the system.
  useEffect(() => {
    if (!isSystemDetectionAvailable) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (getStoredThemeChoice() === "system") {
        const newTheme: Theme = e.matches ? "black" : "lofi";
        applyTheme(newTheme);
        setState({ theme: newTheme, themeChoice: "system" });
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle RTL for Arabic
  useEffect(() => {
    const lang = document.documentElement.getAttribute("lang") ?? "en";
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, []);

  const setThemeChoice = useCallback((choice: ThemeChoice) => {
    localStorage.setItem(THEME_STORAGE_KEY, choice);
    const resolvedTheme = resolveTheme(choice);
    applyTheme(resolvedTheme);
    setState({ theme: resolvedTheme, themeChoice: choice });
  }, []);

  const setTheme = useCallback(
    (t: Theme) => setThemeChoice(t),
    [setThemeChoice],
  );

  return {
    theme: state.theme,
    themeChoice: state.themeChoice,
    setTheme,
    setThemeChoice,
  };
}
