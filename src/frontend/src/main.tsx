import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { THEME_STORAGE_KEY } from "./constants";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Bootstrap theme before first paint:
// stored theme choice > operating system preference > time-based fallback.
(() => {
  function applySystemThemeChoice() {
    try {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      document.documentElement.setAttribute(
        "data-theme",
        mq.matches ? "black" : "lofi",
      );
    } catch {
      // matchMedia unavailable — fall back to time-based
      const hour = new Date().getHours();
      document.documentElement.setAttribute(
        "data-theme",
        hour >= 7 && hour < 20 ? "lofi" : "black",
      );
    }
  }

  const storedThemeChoice = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedThemeChoice === "lofi" || storedThemeChoice === "black") {
    document.documentElement.setAttribute("data-theme", storedThemeChoice);
    return;
  }
  if (storedThemeChoice === "system" || storedThemeChoice === null) {
    applySystemThemeChoice();
    return;
  }

  applySystemThemeChoice();
})();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    {/* TODO: maxTimeToLive (30-day session) cannot be set here — InternetIdentityProvider only
         accepts AuthClientCreateOptions (idle config), not login options. The platform's login()
         function accepts 0 arguments so session duration uses the platform default (~8 days).
         To extend sessions, a future version of @caffeineai/core-infrastructure would need to
         expose loginOptions or accept maxTimeToLive in the provider. */}
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
