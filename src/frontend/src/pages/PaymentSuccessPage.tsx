import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/services/backend";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Eye, Home, List, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function PaymentSuccessPage() {
  const { t } = useTranslation();
  const { isReady, confirmPayment } = useBackend();
  const { isLoading } = useAuth();

  const search = Object.fromEntries(
    new URLSearchParams(window.location.search),
  ) as Record<string, string>;
  // Stripe returns session_id; ad_id is appended by buildSuccessUrl
  const adId = search.ad_id ?? search.adId ?? null;
  const sessionId = search.session_id ?? search.session ?? null;

  const [confirming, setConfirming] = useState(true);
  const [confirmedAdId, setConfirmedAdId] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const hasRun = useRef(false);

  const confirmMutation = useMutation({
    mutationFn: ({ adId, sessionId }: { adId: string; sessionId: string }) =>
      confirmPayment(adId, sessionId),
  });

  // confirmMutation.mutate and t are stable references; hasRun ref prevents double-fire
  useEffect(() => {
    if (hasRun.current) return;
    if (isLoading || !isReady) return; // auth not settled yet — wait

    hasRun.current = true;

    if (!adId || !sessionId) {
      setConfirming(false);
      setConfirmError(t("payment.missingParams"));
      return;
    }

    confirmMutation.mutate(
      { adId, sessionId },
      {
        onSuccess: (confirmedAd) => {
          setConfirming(false);
          setConfirmedAdId(confirmedAd.id);
          // Auto-redirect to feed after 4s when this is a new-tab Stripe redirect
          setTimeout(() => {
            window.location.href = "/";
          }, 4000);
        },
        onError: (err) => {
          setConfirming(false);
          setConfirmError(
            err instanceof Error ? err.message : t("error.unknown"),
          );
        },
      },
    );
  }, [adId, sessionId, isReady, isLoading, confirmMutation.mutate, t]);

  // Show a spinner while auth is still settling — not an error state
  if (isLoading || (!hasRun.current && !isReady)) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        data-ocid="payment-success.loading_state"
      >
        <span className="loading loading-infinity loading-lg" />
        <p className="text-lg font-medium">{t("payment.confirming")}</p>
      </div>
    );
  }

  if (confirming) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        data-ocid="payment-success.loading_state"
      >
        <span className="loading loading-infinity loading-lg" />
        <p className="text-lg font-medium">{t("payment.confirming")}</p>
      </div>
    );
  }

  if (confirmError) {
    return (
      <div className="max-w-lg mx-auto mt-12 px-4">
        <div
          className="card bg-base-100 shadow-xl border border-error/20"
          data-ocid="payment-success.error_state"
        >
          <div className="card-body items-center text-center gap-4">
            <XCircle className="w-16 h-16 text-error" />
            <h2 className="card-title text-2xl">{t("payment.confirmError")}</h2>
            <p className="text-base-content/70">{confirmError}</p>
            <div className="card-actions flex-col w-full gap-2 mt-2">
              {adId && (
                <a
                  href="/my-ads"
                  className="btn btn-neutral w-full gap-2"
                  data-ocid="payment-success.my_ads_link"
                >
                  <List className="w-5 h-5" />
                  {t("nav.myAds")}
                </a>
              )}
              <a
                href="/"
                className="btn btn-ghost w-full gap-2"
                data-ocid="payment-success.home_link"
              >
                <Home className="w-5 h-5" />
                {t("nav.feed")}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-12 px-4">
      <div
        className="card bg-base-100 shadow-xl border border-success/20"
        data-ocid="payment-success.success_state"
      >
        <div className="card-body items-center text-center gap-4">
          <CheckCircle2 className="w-16 h-16 text-success" />
          <h2 className="card-title text-2xl">{t("payment.success")}</h2>
          <p className="text-base-content/70">{t("payment.successDesc")}</p>
          <p className="text-sm text-base-content/50">
            {t("payment.successRedirect")}
          </p>
          <div className="card-actions flex-col w-full gap-2 mt-2">
            {confirmedAdId && (
              <a
                href={`/ad/${confirmedAdId}`}
                className="btn btn-neutral w-full gap-2"
                data-ocid="payment-success.view_ad_button"
              >
                <Eye className="w-5 h-5" />
                {t("payment.viewAd")}
              </a>
            )}
            <a
              href="/my-ads"
              className="btn btn-neutral btn-outline w-full gap-2"
              data-ocid="payment-success.my_ads_link"
            >
              <List className="w-5 h-5" />
              {t("nav.myAds")}
            </a>
            <a
              href="/"
              className="btn btn-ghost w-full gap-2"
              data-ocid="payment-success.home_link"
            >
              <Home className="w-5 h-5" />
              {t("nav.feed")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
