import { AdStatus } from "@/backend";
import type { Advertisement } from "@/backend";
import DeleteAdDialog from "@/components/cards/DeleteAdDialog";
import MyAdCard from "@/components/cards/MyAdCard";
import MyAdCardSkeleton from "@/components/cards/MyAdCardSkeleton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/services/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const STATUS_ORDER: Record<string, number> = {
  published: 0,
  pending_payment: 1,
  draft: 2,
  rejected: 3,
  deleted: 4,
};

function sortAds(ads: Advertisement[]): Advertisement[] {
  return [...ads].sort((a, b) => {
    const aOrder = STATUS_ORDER[a.status] ?? 99;
    const bOrder = STATUS_ORDER[b.status] ?? 99;
    return aOrder - bOrder;
  });
}

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_MS = 5 * 60 * 1000;

export default function MyAdsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, login } = useAuth();
  const backend = useBackend();

  const [deleteTarget, setDeleteTarget] = useState<Advertisement | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [pollingAdId, setPollingAdId] = useState<string | null>(null);
  const [pollSuccessId, setPollSuccessId] = useState<string | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollStartRef = useRef<number>(0);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const { data: rawAds = [], isLoading } = useQuery<Advertisement[]>({
    queryKey: ["myAds"],
    queryFn: () => backend.getMyAds(),
    enabled: isAuthenticated && backend.isReady,
  });

  const ads = sortAds(rawAds);
  const showLoading = isAuthenticated && (!backend.isReady || isLoading);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => backend.deleteAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAds"] });
      setDeleteTarget(null);
    },
  });

  const retryPaymentMutation = useMutation({
    mutationFn: async (ad: Advertisement) => {
      setRetryingId(ad.id);
      setPollError(null);
      const successUrl = `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&ad_id=${encodeURIComponent(ad.id)}`;
      const cancelUrl = `${window.location.origin}/payment-cancel?ad_id=${encodeURIComponent(ad.id)}`;
      const rawCheckoutUrl = await backend.createStripeSession(
        ad.id,
        successUrl,
        cancelUrl,
      );

      // The backend returns a JSON string — parse it and extract the url field
      let checkoutUrl: string;
      try {
        const parsed = JSON.parse(rawCheckoutUrl) as { url?: string };
        if (!parsed.url) {
          throw new Error("Missing url field in Stripe session response");
        }
        checkoutUrl = parsed.url;
      } catch {
        setPollError(t("payment.invalidCheckoutUrl"));
        setRetryingId(null);
        return;
      }

      // Open Stripe payment page in a new tab
      window.open(checkoutUrl, "_blank");

      setPollingAdId(ad.id);
      stopPolling();
      pollStartRef.current = Date.now();
      pollTimerRef.current = setInterval(async () => {
        if (Date.now() - pollStartRef.current > POLL_MAX_MS) {
          stopPolling();
          setPollingAdId(null);
          setPollError(t("payment.pollTimeout"));
          return;
        }
        try {
          const myAds = await backend.getMyAds();
          const target = myAds.find((a) => a.id === ad.id);
          if (
            target &&
            (target.status === "published" || target.paymentStatus === "paid")
          ) {
            stopPolling();
            setPollingAdId(null);
            setPollSuccessId(ad.id);
            queryClient.invalidateQueries({ queryKey: ["myAds"] });
          }
        } catch {
          // keep polling silently
        }
      }, POLL_INTERVAL_MS);
    },
    onSettled: () => setRetryingId(null),
  });

  if (!isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8"
        data-ocid="my-ads.auth_gate"
      >
        <FileText className="w-16 h-16 text-base-content/20" />
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">
            {t("myAds.loginRequired.title")}
          </h2>
          <p className="text-base-content/60 mb-6">
            {t("myAds.loginRequired.message")}
          </p>
          <button
            type="button"
            className="btn btn-neutral gap-2"
            onClick={login}
            data-ocid="my-ads.login_button"
          >
            {t("common.login")}
          </button>
        </div>
      </div>
    );
  }

  const total = ads.length;
  const publishedCount = ads.filter(
    (a) => a.status === AdStatus.published,
  ).length;
  const pendingCount = ads.filter(
    (a) => a.status === AdStatus.pending_payment,
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-ocid="my-ads.page">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("myAds.title")}</h1>
          <p className="text-base-content/60 text-sm mt-1">
            {t("myAds.subtitle")}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-neutral gap-2"
          onClick={() => navigate({ to: "/create-ad" })}
          data-ocid="my-ads.create_ad_button"
        >
          <Plus className="w-4 h-4" />
          {t("myAds.createAd")}
        </button>
      </div>

      {/* Stats bar */}
      {!showLoading && total > 0 && (
        <div
          className="stats stats-horizontal shadow w-full mb-6 bg-base-100 border border-base-200"
          data-ocid="my-ads.stats_bar"
        >
          <div className="stat">
            <div className="stat-title">{t("myAds.stats.total")}</div>
            <div className="stat-value text-2xl">{total}</div>
          </div>
          <div className="stat">
            <div className="stat-title">{t("myAds.stats.published")}</div>
            <div className="stat-value text-2xl text-success">
              {publishedCount}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">{t("myAds.stats.pending")}</div>
            <div className="stat-value text-2xl text-warning">
              {pendingCount}
            </div>
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {showLoading && (
        <div className="grid gap-4" data-ocid="my-ads.loading_state">
          {[1, 2, 3].map((i) => (
            <MyAdCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!showLoading && total === 0 && (
        <div
          className="flex flex-col items-center justify-center min-h-[40vh] gap-6 text-center"
          data-ocid="my-ads.empty_state"
        >
          <div className="bg-base-200 rounded-full p-6">
            <FileText className="w-12 h-12 text-base-content/30" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {t("myAds.empty.title")}
            </h2>
            <p className="text-base-content/60 mb-6">
              {t("myAds.empty.message")}
            </p>
            <button
              type="button"
              className="btn btn-neutral gap-2"
              onClick={() => navigate({ to: "/create-ad" })}
              data-ocid="my-ads.empty_create_button"
            >
              <Plus className="w-4 h-4" />
              {t("myAds.empty.cta")}
            </button>
          </div>
        </div>
      )}

      {/* Ad list */}
      {!showLoading && total > 0 && (
        <div className="grid gap-4" data-ocid="my-ads.ad_list">
          {ads.map((ad, idx) => (
            <div key={ad.id} data-ocid={`my-ads.item.${idx + 1}`}>
              <MyAdCard
                ad={ad}
                onDeleteRequest={setDeleteTarget}
                isRetrying={retryingId === ad.id}
                onRetryPayment={(a) => retryPaymentMutation.mutate(a)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Retry payment — new tab opened banner */}
      {pollingAdId && (
        <div className="alert alert-info mt-4" data-ocid="my-ads.polling_state">
          <ExternalLink className="w-4 h-4" />
          <div>
            <p className="font-semibold">{t("payment.newTabOpened")}</p>
            <p className="text-sm">{t("payment.newTabDesc")}</p>
          </div>
          <LoadingSpinner size="sm" className="ml-auto" />
        </div>
      )}

      {/* Poll success banner */}
      {pollSuccessId && (
        <div
          className="alert alert-success mt-4"
          data-ocid="my-ads.poll_success_state"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{t("payment.pollSuccess")}</span>
        </div>
      )}

      {/* Poll timeout / error */}
      {pollError && (
        <div
          className="alert alert-warning mt-4"
          data-ocid="my-ads.poll_error_state"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{pollError}</span>
        </div>
      )}

      {/* Retry payment error */}
      {retryPaymentMutation.isError && (
        <div
          className="alert alert-error mt-4"
          data-ocid="my-ads.retry_payment.error_state"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t("myAds.retryPaymentError")}</span>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteAdDialog
          adName={deleteTarget.eventName}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
