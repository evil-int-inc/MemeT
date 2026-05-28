import { APP_NAME, SUPPORTED_LOCALES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useBackend } from "@/services/backend";
import { getDefaultAvatarUrl, getProfileAvatarUrl } from "@/utils/avatar";
import { calcProfileCompleteness } from "@/utils/profileCompleteness";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  Check,
  CheckCircle2,
  Globe,
  Heart,
  Home,
  List,
  LogIn,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Plus,
  Share2,
  Star,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t, i18n } = useTranslation();
  const { theme, themeChoice, setThemeChoice } = useTheme();
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerCheckboxRef = useRef<HTMLInputElement>(null);
  const backend = useBackend();

  const { data: profile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => backend.getMyProfile(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  const completeness = isAuthenticated
    ? calcProfileCompleteness(profile)
    : null;

  const currentLocale =
    SUPPORTED_LOCALES.find((l) => l.code === i18n.language) ??
    SUPPORTED_LOCALES[0];

  function changeLanguage(code: string) {
    i18n.changeLanguage(code);
    document.documentElement.setAttribute("lang", code);
    document.documentElement.setAttribute("dir", code === "ar" ? "rtl" : "ltr");
  }

  const referralCode =
    isAuthenticated && profile ? (profile.referralCode ?? null) : null;

  async function handleCopyReferralLink() {
    if (!referralCode) return;
    const url = `${window.location.origin}/referral/${referralCode}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("referral.copied"));
    } catch {
      // Fallback: prompt
      prompt(t("referral.copied"), url);
    }
  }

  const ThemeTriggerIcon =
    themeChoice === "system" ? Monitor : theme === "black" ? Moon : Sun;

  function chooseTheme(choice: "system" | "lofi" | "black") {
    setThemeChoice(choice);
  }

  function closeSidebar() {
    setDrawerOpen(false);
    if (drawerCheckboxRef.current) drawerCheckboxRef.current.checked = false;
  }

  function handleNavClick(path: string, requiresAuth = false) {
    closeSidebar();
    if (requiresAuth && isLoading) {
      return; // auth not settled yet — do not navigate
    }
    if (requiresAuth && !isAuthenticated) {
      login();
      return;
    }
    navigate({ to: path });
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerCheckboxRef}
        checked={drawerOpen}
        onChange={(e) => setDrawerOpen(e.target.checked)}
      />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <nav className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-30 shadow-sm px-4">
          {/* Left: hamburger (mobile) + logo */}
          <div className="flex-1 flex items-center gap-3">
            <label
              htmlFor="sidebar-drawer"
              className="btn btn-ghost btn-square lg:hidden"
              aria-label="Open sidebar"
              data-ocid="layout.sidebar_toggle"
            >
              <Menu className="w-5 h-5" />
            </label>
            {!isAuthenticated && (
              <a
                href="/"
                className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
                data-ocid="layout.home_link"
              >
                <span>{APP_NAME}</span>
              </a>
            )}
            {/* User avatar + name (authenticated only) */}
            {isAuthenticated && profile && (
              <div
                className="flex items-center gap-2 ml-2"
                data-ocid="layout.user_identity"
              >
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring ring-base-300 ring-offset-1">
                    <img
                      src={getProfileAvatarUrl(profile)}
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          getDefaultAvatarUrl();
                      }}
                    />
                  </div>
                </div>
                <span
                  className="text-sm font-medium text-base-content max-w-[10rem] truncate hidden sm:inline"
                  data-ocid="layout.user_name"
                >
                  {profile.fullName}
                </span>
              </div>
            )}
            <span
              className="text-[0.65rem] leading-none text-base-content/50 italic whitespace-nowrap"
              style={{
                fontFamily: '"Apple Chancery", "Comic Sans MS", cursive',
              }}
              data-ocid="layout.alpha_version"
            >
              alpha version
            </span>
          </div>

          {/* Right: theme + lang + auth */}
          <div className="flex-none flex items-center gap-1">
            {/* Referral copy button — visible only when authenticated and referralCode exists */}
            {isAuthenticated && referralCode && (
              <button
                type="button"
                className="btn btn-ghost btn-square btn-sm"
                onClick={handleCopyReferralLink}
                aria-label={t("referral.copied")}
                title={t("referral.copied")}
                data-ocid="layout.referral_copy_button"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            {/* Theme selector */}
            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost btn-square btn-sm"
                aria-label="Theme selector"
                title="Theme selector"
                data-ocid="layout.theme_toggle"
              >
                <ThemeTriggerIcon className="w-4 h-4" />
              </button>
              <ul
                className="dropdown-content menu bg-base-100 rounded-box shadow-lg border border-base-300 z-50 w-80 max-w-[calc(100vw-1rem)] p-1 mt-1"
                data-ocid="layout.theme_dropdown"
              >
                {[
                  {
                    choice: "system" as const,
                    label: "Follow operating system by default",
                    Icon: Monitor,
                  },
                  { choice: "lofi" as const, label: "Light", Icon: Sun },
                  { choice: "black" as const, label: "Dark", Icon: Moon },
                ].map(({ choice, label, Icon }) => (
                  <li key={choice}>
                    <button
                      type="button"
                      className={`flex items-center gap-2 ${
                        themeChoice === choice ? "active" : ""
                      }`}
                      onClick={() => chooseTheme(choice)}
                      data-ocid={`layout.theme_option.${choice}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 text-left whitespace-normal leading-tight">
                        {label}
                      </span>
                      {themeChoice === choice && (
                        <Check
                          className="w-4 h-4 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Language dropdown */}
            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost btn-square btn-sm"
                aria-label="Language selector"
                data-ocid="layout.language_button"
              >
                <Globe className="w-4 h-4" />
              </button>
              <ul
                className="dropdown-content menu bg-base-100 rounded-box shadow-lg border border-base-300 z-50 w-48 p-1 mt-1"
                data-ocid="layout.language_dropdown"
              >
                {SUPPORTED_LOCALES.map((locale) => (
                  <li key={locale.code}>
                    <button
                      type="button"
                      className={`flex items-center gap-2 ${
                        currentLocale.code === locale.code ? "active" : ""
                      }`}
                      onClick={() => changeLanguage(locale.code)}
                      data-ocid={`layout.lang_option.${locale.code}`}
                    >
                      <span className="text-xs text-base-content/60">
                        {locale.code.toUpperCase()}
                      </span>
                      <span>{locale.nativeName}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Auth button */}
            {isAuthenticated ? (
              <button
                type="button"
                className="btn btn-neutral btn-sm gap-2"
                onClick={() => logout()}
                disabled={isLoading}
                data-ocid="layout.logout_button"
              >
                {isLoading ? (
                  <span className="loading loading-infinity loading-xs" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{t("nav.logout")}</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-neutral btn-sm gap-2"
                onClick={() => login()}
                data-ocid="layout.login_button"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">{t("nav.login")}</span>
              </button>
            )}
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-1 bg-base-200 min-h-[calc(100vh-4rem)]">
          {children}
        </main>

        {/* Footer */}
        <footer className="footer footer-center bg-base-100 border-t border-base-300 py-4 px-6 text-base-content/60 text-sm">
          <p>
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      {/* Sidebar drawer */}
      <div className="drawer-side z-40">
        <label
          htmlFor="sidebar-drawer"
          aria-label="Close sidebar"
          className="drawer-overlay"
        />
        <aside className="bg-base-100 min-h-full w-64 flex flex-col border-r border-base-300">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 border-b border-base-300 h-16">
            <span className="flex items-center">
              {/* Light theme logo (lofi) */}
              <img
                src="/assets/evertwo-logo-light-2-019e6f67-0ad7-75ef-8326-d99b8ab241c6.png"
                alt="EverTwo"
                className="h-full w-auto object-contain [[data-theme=black]_&]:hidden"
              />
              {/* Dark theme logo (black) */}
              <img
                src="/assets/evertwo-logo-dark-2-019e6f67-08ad-70b8-a1d8-a2f12a753cd2.png"
                alt="EverTwo"
                className="h-full w-auto w-auto object-contain hidden [[data-theme=black]_&]:block"
              />
            </span>
            <div className="flex items-center justify-between py-4">
              <button
                type="button"
                className="btn btn-ghost btn-square btn-sm lg:hidden"
                onClick={closeSidebar}
                aria-label="Close sidebar"
                data-ocid="layout.sidebar_close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-3">
            <ul className="menu menu-lg gap-1 w-full p-0">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("/")}
                  className="flex items-center gap-3"
                  data-ocid="layout.nav_feed"
                >
                  <Home className="w-5 h-5" />
                  {t("nav.feed")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("/profile", true)}
                  className="flex items-center gap-3"
                  data-ocid="layout.nav_profile"
                  disabled={isLoading}
                >
                  <User className="w-5 h-5" />
                  <span className="flex-1">{t("nav.profile")}</span>
                  {!isAuthenticated && (
                    <span className="opacity-40">
                      <LogIn className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {completeness && completeness.percent === 100 && (
                    <CheckCircle2
                      className="w-6 h-6 flex-shrink-0 text-success"
                      aria-label="Profile complete"
                    />
                  )}
                  {completeness && completeness.percent < 100 && (
                    <svg
                      className="w-6 h-6 flex-shrink-0 -rotate-90"
                      viewBox="0 0 24 24"
                      aria-label={`Profile ${completeness.percent}% complete`}
                      data-ocid="layout.profile_completeness"
                    >
                      <title>Profile {completeness.percent}% complete</title>
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeOpacity="0.2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${2 * Math.PI * 9}`}
                        strokeDashoffset={`${2 * Math.PI * 9 * (1 - completeness.percent / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("/create-ad", true)}
                  className="flex items-center gap-3"
                  data-ocid="layout.nav_create_ad"
                  disabled={isLoading}
                >
                  <Plus className="w-5 h-5" />
                  {t("nav.createAd")}
                  {!isAuthenticated && (
                    <span className="ml-auto opacity-40">
                      <LogIn className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("/my-ads", true)}
                  className="flex items-center gap-3"
                  data-ocid="layout.nav_my_ads"
                  disabled={isLoading}
                >
                  <List className="w-5 h-5" />
                  {t("nav.myAds")}
                  {!isAuthenticated && (
                    <span className="ml-auto opacity-40">
                      <LogIn className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("/my-join-requests", true)}
                  className="flex items-center gap-3"
                  data-ocid="layout.nav_my_join_requests"
                  disabled={isLoading}
                >
                  <Bookmark className="w-5 h-5" />
                  {t("nav.myJoinRequests")}
                  {!isAuthenticated && (
                    <span className="ml-auto opacity-40">
                      <LogIn className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("/my-favourites", true)}
                  className="flex items-center gap-3"
                  data-ocid="layout.nav_my_favourites"
                  disabled={isLoading}
                >
                  <Star className="w-5 h-5" />
                  {t("nav.myFavourites")}
                  {!isAuthenticated && (
                    <span className="ml-auto opacity-40">
                      <LogIn className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("/my-likes", true)}
                  className="flex items-center gap-3"
                  data-ocid="layout.nav_my_likes"
                  disabled={isLoading}
                >
                  <Heart className="w-5 h-5" />
                  {t("nav.myLikes")}
                  {!isAuthenticated && (
                    <span className="ml-auto opacity-40">
                      <LogIn className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("/my-referrals", true)}
                  className="flex items-center gap-3"
                  data-ocid="layout.nav_my_referrals"
                  disabled={isLoading}
                >
                  <Users className="w-5 h-5" />
                  {t("nav.myReferrals")}
                  {!isAuthenticated && (
                    <span className="ml-auto opacity-40">
                      <LogIn className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </nav>

          {/* Sidebar footer auth */}
          <div className="p-4 border-t border-base-300">
            {isAuthenticated ? (
              <button
                type="button"
                className="btn btn-neutral btn-sm w-full gap-2"
                onClick={() => {
                  logout();
                  closeSidebar();
                }}
                disabled={isLoading}
                data-ocid="layout.sidebar_logout"
              >
                {isLoading ? (
                  <span className="loading loading-infinity loading-xs" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                {t("nav.logout")}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-neutral btn-sm w-full gap-2"
                onClick={() => {
                  login();
                  closeSidebar();
                }}
                data-ocid="layout.sidebar_login"
              >
                <LogIn className="w-4 h-4" />
                {t("nav.login")}
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
