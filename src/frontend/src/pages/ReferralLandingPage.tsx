import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { APP_NAME } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/services/backend";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

const PENDING_REFERRAL_KEY = `${APP_NAME}_pendingReferralCode`;

export default function ReferralLandingPage() {
  const params = useParams({ from: "/referral/$code" });
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth();
  const backend = useBackend();
  const processedRef = useRef(false);

  // On mount, store the referral code and trigger login
  useEffect(() => {
    const code = params.code;
    if (code) {
      localStorage.setItem(PENDING_REFERRAL_KEY, code);
    }
    if (!isLoading && !isAuthenticated) {
      login();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.code, isLoading, isAuthenticated, login]);

  // After login completes, call setReferredBy and redirect to feed
  useEffect(() => {
    if (!isAuthenticated || isLoading || processedRef.current) return;
    processedRef.current = true;

    const code = localStorage.getItem(PENDING_REFERRAL_KEY);
    if (code) {
      // Fire-and-forget — silently ignore errors
      backend.setReferredBy(code).catch(() => {});
      localStorage.removeItem(PENDING_REFERRAL_KEY);
    }

    navigate({ to: "/" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading, backend.setReferredBy, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );
}
