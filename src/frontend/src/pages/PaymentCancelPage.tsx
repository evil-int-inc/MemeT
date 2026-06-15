import { AppCard, AppCardActions, AppCardBody, AppCardTitle } from "@/components/cards/AppCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { buildCancelUrl, buildSuccessUrl } from "@/lib/stripe";
import { useBackend } from "@/services/backend";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ExternalLink, Home, List, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PaymentCancelPage() {
  const { t } = useTranslation();
  const backend = useBackend();
  const [retryError, setRetryError] = useState<string | null>(null);

  const search = Object.fromEntries(
    new URLSearchParams(window.location.search),
  ) as Record<string, string>;
  // ad_id is appended by buildCancelUrl; fall back to legacy adId param
  const adId = search.ad_id ?? search.adId ?? null;

  const [tabBlocked, setTabBlocked] = useState(false);
  const [tabOpened, setTabOpened] = useState(false);

  const retryMutation = useMutation({
    mutationFn: (adId: string) =>
      backend.createStripeSession(
        adId,
        buildSuccessUrl(adId),
        buildCancelUrl(adId),
      ),
    onSuccess: (checkoutUrl) => {
      const newTab = window.open(checkoutUrl, "_blank");
      if (!newTab) {
        setTabBlocked(true);
        window.location.href = checkoutUrl;
      } else {
        setTabOpened(true);
      }
    },
    onError: (err) => {
      setRetryError(err instanceof Error ? err.message : t("error.unknown"));
    },
  });

  const handleRetry = () => {
    if (!adId) return;
    setRetryError(null);
    retryMutation.mutate(adId);
  };

  return (
    <div className="max-w-lg mx-auto mt-12 px-4">
      <AppCard
        className="shadow-xl border border-warning/20"
        data-ocid="payment-cancel.card"
      >
        <AppCardBody className="items-center text-center gap-4">
          <AlertCircle className="w-16 h-16 text-warning" />
          <AppCardTitle className="text-2xl">{t("payment.cancel")}</AppCardTitle>
          <p className="text-base-content/70">{t("payment.cancelDesc")}</p>

          {retryError && (
            <div
              className="alert alert-error w-full text-sm"
              data-ocid="payment-cancel.error_state"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{retryError}</span>
            </div>
          )}

          {tabBlocked && (
            <div
              className="alert alert-warning w-full text-sm"
              data-ocid="payment-cancel.tab_blocked_state"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{t("payment.tabBlocked")}</span>
            </div>
          )}

          {tabOpened && (
            <div
              className="alert alert-info w-full text-sm"
              data-ocid="payment-cancel.tab_opened_state"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t("payment.newTabDesc")}</span>
            </div>
          )}

          <AppCardActions className="flex-col w-full gap-2 mt-2">
            {adId && (
              <button
                type="button"
                className="btn btn-neutral w-full gap-2"
                disabled={retryMutation.isPending}
                onClick={handleRetry}
                data-ocid="payment-cancel.retry_button"
              >
                {retryMutation.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
                {retryMutation.isPending
                  ? t("payment.retrying")
                  : t("payment.retry")}
              </button>
            )}
            <a
              href="/my-ads"
              className="btn btn-neutral w-full gap-2"
              data-ocid="payment-cancel.my_ads_link"
            >
              <List className="w-5 h-5" />
              {t("nav.myAds")}
            </a>
            <a
              href="/"
              className="btn btn-ghost w-full gap-2"
              data-ocid="payment-cancel.home_link"
            >
              <Home className="w-5 h-5" />
              {t("nav.feed")}
            </a>
          </AppCardActions>
        </AppCardBody>
      </AppCard>
    </div>
  );
}
