import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useCallback } from "react";

export function useAuth() {
  const {
    isAuthenticated,
    isInitializing,
    loginStatus,
    login,
    clear,
    identity,
  } = useInternetIdentity();

  // isAuthenticated from the hook is the authoritative flag — it is true for
  // BOTH interactive logins and restored sessions on page reload.
  // isInitializing is true while the AuthClient is loading from storage;
  // we must wait for it to settle before gating UI or redirecting.
  const isLoading = isInitializing || loginStatus === "logging-in";

  const principal: string | null = isAuthenticated
    ? (identity?.getPrincipal().toText() ?? null)
    : null;

  // Stabilise references so useEffect deps in consumers don't re-fire on
  // every render when the hook is re-instantiated by the provider.
  const stableLogin = useCallback(() => login(), [login]);
  const stableLogout = useCallback(() => clear(), [clear]);

  return {
    isAuthenticated,
    principal,
    login: stableLogin,
    logout: stableLogout,
    isLoading,
    identity,
  };
}
