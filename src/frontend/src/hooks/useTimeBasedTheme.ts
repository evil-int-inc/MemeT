import { useEffect, useState } from "react";

type Theme = "lofi" | "black";

/** Day: 07:00–19:59 local time → lofi (light). Night: 20:00–06:59 → black (dark). */
function getTimeBasedTheme(): Theme {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 20 ? "lofi" : "black";
}

export function useTimeBasedTheme() {
  const [timeBasedTheme, setTimeBasedTheme] =
    useState<Theme>(getTimeBasedTheme);

  useEffect(() => {
    const tick = () => setTimeBasedTheme(getTimeBasedTheme());
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return {
    isDaytime: timeBasedTheme === "lofi",
    timeBasedTheme,
  };
}
