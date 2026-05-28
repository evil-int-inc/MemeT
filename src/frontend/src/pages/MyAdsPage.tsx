import { AdStatus, PaymentStatus } from "@/backend";
import type { Advertisement } from "@/backend";
import { useAuth } from "@/hooks/useAuth";
import i18n from "@/i18n";
import { useBackend } from "@/services/backend";
import { EventTypeIcon } from "@/utils/eventTypeIcon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  CreditCard,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Plus,
  RefreshCw,
  Trash2,
  Wallet,
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

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: AdStatus }) {
  const { t } = useTranslation();
  const map: Record<string, string> = {
    draft: "badge-ghost",
    pending_payment: "badge-warning",
    published: "badge-success",
    rejected: "badge-error",
    deleted: "badge-neutral",
  };
  const cls = map[status] ?? "badge-ghost";
  return (
    <span className={`badge ${cls} badge-sm font-medium`}>
      {t(`adStatus.${status}`)}
    </span>
  );
}

function PaymentBadge({ paymentStatus }: { paymentStatus: PaymentStatus }) {
  const { t } = useTranslation();
  const map: Record<string, string> = {
    unpaid: "badge-ghost",
    pending: "badge-warning",
    paid: "badge-success",
    failed: "badge-error",
  };
  const cls = map[paymentStatus] ?? "badge-ghost";
  return (
    <span className={`badge ${cls} badge-sm`}>
      {t(`paymentStatus.${paymentStatus}`)}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 animate-pulse">
      <div className="card-body gap-3">
        <div className="skeleton h-5 w-2/3 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-4 w-16 rounded-full" />
          <div className="skeleton h-4 w-16 rounded-full" />
        </div>
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="flex gap-2 mt-2">
          <div className="skeleton h-8 w-16 rounded" />
          <div className="skeleton h-8 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

interface DeleteModalProps {
  adId: string;
  adName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function DeleteModal({
  adName,
  onConfirm,
  onCancel,
  isPending,
}: DeleteModalProps) {
  const { t } = useTranslation();
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{t("myAds.deleteModal.title")}</h3>
        <p className="py-4">
          {t("myAds.deleteModal.message", { name: adName })}
        </p>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={isPending}
            data-ocid="my-ads.delete_modal.cancel_button"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={onConfirm}
            disabled={isPending}
            data-ocid="my-ads.delete_modal.confirm_button"
          >
            {isPending ? (
              <span className="loading loading-infinity loading-sm" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {t("common.delete")}
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={onCancel}
        onKeyDown={(e) => e.key === "Escape" && onCancel()}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      />
    </div>
  );
}

interface AdCardProps {
  ad: Advertisement;
  onDeleteRequest: (ad: Advertisement) => void;
  isRetrying: boolean;
  onRetryPayment: (ad: Advertisement) => void;
}

function AdCard({
  ad,
  onDeleteRequest,
  isRetrying,
  onRetryPayment,
}: AdCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const statusKind = ad.status;
  const paymentKind = ad.paymentStatus;
  const canRetry =
    statusKind === AdStatus.pending_payment ||
    paymentKind === PaymentStatus.failed;
  const isDeleted = statusKind === AdStatus.deleted;

  return (
    <div
      className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow duration-200"
      data-ocid={`my-ads.ad_card.${ad.id}`}
    >
      <div className="card-body gap-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="card-title text-base font-semibold truncate max-w-xs">
            {ad.eventName}
          </h3>
          <div className="flex gap-1.5 flex-wrap">
            <StatusBadge status={ad.status} />
            <PaymentBadge paymentStatus={ad.paymentStatus} />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="badge badge-outline badge-sm gap-1">
            <EventTypeIcon eventType={ad.eventType} className="w-3 h-3" />
            {t(`eventType.${ad.eventType}`)}
          </span>
          <span className="badge badge-outline badge-sm">
            {ad.isVirtual
              ? t("common.virtual")
              : (ad.city ?? t("common.noCity"))}
          </span>
          <span className="badge badge-outline badge-sm gap-1">
            <Wallet className="w-3 h-3" />
            {t(`createAd.howPays.${ad.howPaysForEvent}`)}
          </span>
        </div>

        <p className="text-xs text-base-content/60">
          {t("myAds.createdAt", { date: formatDate(ad.createdAt) })}
        </p>

        {!isDeleted && (
          <div className="card-actions justify-end mt-1 flex-wrap gap-2">
            {statusKind === AdStatus.draft && (
              <>
                <button
                  type="button"
                  className="btn btn-xs btn-neutral btn-outline gap-1"
                  onClick={() =>
                    navigate({ to: "/create-ad", search: { edit: ad.id } })
                  }
                  data-ocid={`my-ads.edit_button.${ad.id}`}
                >
                  <Edit className="w-3 h-3" />
                  {t("common.edit")}
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-outline btn-error gap-1"
                  onClick={() => onDeleteRequest(ad)}
                  data-ocid={`my-ads.delete_button.${ad.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                  {t("common.delete")}
                </button>
              </>
            )}

            {statusKind === AdStatus.published && (
              <>
                <button
                  type="button"
                  className="btn btn-xs btn-outline gap-1"
                  onClick={() => navigate({ to: `/ad/${ad.id}` })}
                  data-ocid={`my-ads.view_button.${ad.id}`}
                >
                  <Eye className="w-3 h-3" />
                  {t("common.view")}
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-outline btn-error gap-1"
                  onClick={() => onDeleteRequest(ad)}
                  data-ocid={`my-ads.delete_button.${ad.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                  {t("common.delete")}
                </button>
              </>
            )}
          </div>
        )}

        {isDeleted && (
          <p className="text-xs text-base-content/40 italic mt-1">
            {t("adStatus.deleted")}
          </p>
        )}
      </div>
    </div>
  );
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
            <SkeletonCard key={i} />
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
              <AdCard
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
          <span className="loading loading-infinity loading-sm ml-auto" />
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
        <DeleteModal
          adId={deleteTarget.id}
          adName={deleteTarget.eventName}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
