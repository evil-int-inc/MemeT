import { o as createLucideIcon, u as useTranslation, b as useNavigate, d as useQueryClient, a as useAuth, c as useBackend, r as reactExports, e as useQuery, f as useMutation, j as jsxRuntimeExports, a0 as AdStatus, R as Plus, I as CircleCheck, a1 as PaymentStatus, a2 as instance } from "./index-BFTCPkdC.js";
import { E as ExternalLink } from "./external-link-Brrc1cp_.js";
import { R as RefreshCw } from "./refresh-cw-BM_cAkUR.js";
import { W as Wallet } from "./wallet-D7KieR-K.js";
import { S as SquarePen } from "./square-pen-DafQjD_i.js";
import { T as Trash2 } from "./trash-2-CUY6f-1h.js";
import { C as CreditCard } from "./credit-card-DdGt8NeC.js";
import { E as Eye } from "./eye-CGlTDaCm.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode);
const STATUS_ORDER = {
  published: 0,
  pending_payment: 1,
  draft: 2,
  rejected: 3,
  deleted: 4
};
function sortAds(ads) {
  return [...ads].sort((a, b) => {
    const aOrder = STATUS_ORDER[a.status] ?? 99;
    const bOrder = STATUS_ORDER[b.status] ?? 99;
    return aOrder - bOrder;
  });
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString(instance.language, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function StatusBadge({ status }) {
  const { t } = useTranslation();
  const map = {
    draft: "badge-ghost",
    pending_payment: "badge-warning",
    published: "badge-success",
    rejected: "badge-error",
    deleted: "badge-neutral"
  };
  const cls = map[status] ?? "badge-ghost";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${cls} badge-sm font-medium`, children: t(`myAds.status.${status}`) });
}
function PaymentBadge({ paymentStatus }) {
  const { t } = useTranslation();
  const map = {
    unpaid: "badge-ghost",
    pending: "badge-warning",
    paid: "badge-success",
    failed: "badge-error"
  };
  const cls = map[paymentStatus] ?? "badge-ghost";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${cls} badge-sm`, children: t(`myAds.paymentStatus.${paymentStatus}`) });
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card bg-base-100 shadow-sm border border-base-200 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-5 w-2/3 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-4 w-16 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-4 w-16 rounded-full" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-4 w-1/3 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-8 w-16 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-8 w-16 rounded" })
    ] })
  ] }) });
}
function DeleteModal({
  adName,
  onConfirm,
  onCancel,
  isPending
}) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal modal-open", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-box", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg", children: t("myAds.deleteModal.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-4", children: t("myAds.deleteModal.message", { name: adName }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-action", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "btn btn-ghost",
            onClick: onCancel,
            disabled: isPending,
            "data-ocid": "my-ads.delete_modal.cancel_button",
            children: t("common.cancel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "btn btn-error",
            onClick: onConfirm,
            disabled: isPending,
            "data-ocid": "my-ads.delete_modal.confirm_button",
            children: [
              isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
              t("common.delete")
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "modal-backdrop",
        onClick: onCancel,
        onKeyDown: (e) => e.key === "Escape" && onCancel(),
        role: "button",
        tabIndex: -1,
        "aria-label": "Close modal"
      }
    )
  ] });
}
function AdCard({
  ad,
  onDeleteRequest,
  isRetrying,
  onRetryPayment
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const statusKind = ad.status;
  const paymentKind = ad.paymentStatus;
  const canRetry = statusKind === AdStatus.pending_payment || paymentKind === PaymentStatus.failed;
  const isDeleted = statusKind === AdStatus.deleted;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow duration-200",
      "data-ocid": `my-ads.ad_card.${ad.id}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "card-title text-base font-semibold truncate max-w-xs", children: ad.eventName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: ad.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentBadge, { paymentStatus: ad.paymentStatus })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-outline badge-sm", children: t(`eventType.${ad.eventType}`) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-outline badge-sm", children: ad.isVirtual ? t("common.virtual") : ad.city ?? t("common.noCity") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-outline badge-sm gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-3 h-3" }),
            t(`createAd.howPays.${ad.howPaysForEvent}`)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-base-content/60", children: t("myAds.createdAt", { date: formatDate(ad.createdAt) }) }),
        !isDeleted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-actions justify-end mt-1 flex-wrap gap-2", children: [
          statusKind === AdStatus.draft && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "btn btn-xs btn-neutral btn-outline gap-1",
                onClick: () => navigate({ to: "/create-ad", search: { edit: ad.id } }),
                "data-ocid": `my-ads.edit_button.${ad.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-3 h-3" }),
                  t("common.edit")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "btn btn-xs btn-outline btn-error gap-1",
                onClick: () => onDeleteRequest(ad),
                "data-ocid": `my-ads.delete_button.${ad.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                  t("common.delete")
                ]
              }
            )
          ] }),
          canRetry && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "btn btn-xs btn-neutral gap-1",
              onClick: () => onRetryPayment(ad),
              disabled: isRetrying,
              "data-ocid": `my-ads.retry_payment_button.${ad.id}`,
              children: [
                isRetrying ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-3 h-3" }),
                t("myAds.retryPayment")
              ]
            }
          ),
          statusKind === AdStatus.published && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "btn btn-xs btn-outline gap-1",
                onClick: () => navigate({ to: `/ad/${ad.id}` }),
                "data-ocid": `my-ads.view_button.${ad.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
                  t("common.view")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "btn btn-xs btn-outline btn-error gap-1",
                onClick: () => onDeleteRequest(ad),
                "data-ocid": `my-ads.delete_button.${ad.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                  t("common.delete")
                ]
              }
            )
          ] })
        ] }),
        isDeleted && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-base-content/40 italic mt-1", children: t("myAds.status.deleted") })
      ] })
    }
  );
}
const POLL_INTERVAL_MS = 3e3;
const POLL_MAX_MS = 5 * 60 * 1e3;
function MyAdsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, login } = useAuth();
  const backend = useBackend();
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [retryingId, setRetryingId] = reactExports.useState(null);
  const [pollingAdId, setPollingAdId] = reactExports.useState(null);
  const [pollSuccessId, setPollSuccessId] = reactExports.useState(null);
  const [pollError, setPollError] = reactExports.useState(null);
  const pollTimerRef = reactExports.useRef(null);
  const pollStartRef = reactExports.useRef(0);
  const stopPolling = reactExports.useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);
  const { data: rawAds = [], isLoading } = useQuery({
    queryKey: ["myAds"],
    queryFn: () => backend.getMyAds(),
    enabled: isAuthenticated && backend.isReady
  });
  const ads = sortAds(rawAds);
  const showLoading = isAuthenticated && (!backend.isReady || isLoading);
  const deleteMutation = useMutation({
    mutationFn: (id) => backend.deleteAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAds"] });
      setDeleteTarget(null);
    }
  });
  const retryPaymentMutation = useMutation({
    mutationFn: async (ad) => {
      setRetryingId(ad.id);
      setPollError(null);
      const successUrl = `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&ad_id=${encodeURIComponent(ad.id)}`;
      const cancelUrl = `${window.location.origin}/payment-cancel?ad_id=${encodeURIComponent(ad.id)}`;
      const rawCheckoutUrl = await backend.createStripeSession(
        ad.id,
        successUrl,
        cancelUrl
      );
      let checkoutUrl;
      try {
        const parsed = JSON.parse(rawCheckoutUrl);
        if (!parsed.url) {
          throw new Error("Missing url field in Stripe session response");
        }
        checkoutUrl = parsed.url;
      } catch {
        setPollError(t("payment.invalidCheckoutUrl"));
        setRetryingId(null);
        return;
      }
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
          if (target && (target.status === "published" || target.paymentStatus === "paid")) {
            stopPolling();
            setPollingAdId(null);
            setPollSuccessId(ad.id);
            queryClient.invalidateQueries({ queryKey: ["myAds"] });
          }
        } catch {
        }
      }, POLL_INTERVAL_MS);
    },
    onSettled: () => setRetryingId(null)
  });
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8",
        "data-ocid": "my-ads.auth_gate",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-16 h-16 text-base-content/20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold mb-2", children: t("myAds.loginRequired.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base-content/60 mb-6", children: t("myAds.loginRequired.message") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "btn btn-neutral gap-2",
                onClick: login,
                "data-ocid": "my-ads.login_button",
                children: t("common.login")
              }
            )
          ] })
        ]
      }
    );
  }
  const total = ads.length;
  const publishedCount = ads.filter(
    (a) => a.status === AdStatus.published
  ).length;
  const pendingCount = ads.filter(
    (a) => a.status === AdStatus.pending_payment
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", "data-ocid": "my-ads.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6 flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: t("myAds.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base-content/60 text-sm mt-1", children: t("myAds.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "btn btn-neutral gap-2",
          onClick: () => navigate({ to: "/create-ad" }),
          "data-ocid": "my-ads.create_ad_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            t("myAds.createAd")
          ]
        }
      )
    ] }),
    !showLoading && total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "stats stats-horizontal shadow w-full mb-6 bg-base-100 border border-base-200",
        "data-ocid": "my-ads.stats_bar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-title", children: t("myAds.stats.total") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-value text-2xl", children: total })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-title", children: t("myAds.stats.published") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-value text-2xl text-success", children: publishedCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-title", children: t("myAds.stats.pending") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-value text-2xl text-warning", children: pendingCount })
          ] })
        ]
      }
    ),
    showLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", "data-ocid": "my-ads.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i)) }),
    !showLoading && total === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[40vh] gap-6 text-center",
        "data-ocid": "my-ads.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-base-200 rounded-full p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-12 h-12 text-base-content/30" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-2", children: t("myAds.empty.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base-content/60 mb-6", children: t("myAds.empty.message") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "btn btn-neutral gap-2",
                onClick: () => navigate({ to: "/create-ad" }),
                "data-ocid": "my-ads.empty_create_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  t("myAds.empty.cta")
                ]
              }
            )
          ] })
        ]
      }
    ),
    !showLoading && total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", "data-ocid": "my-ads.ad_list", children: ads.map((ad, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `my-ads.item.${idx + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      AdCard,
      {
        ad,
        onDeleteRequest: setDeleteTarget,
        isRetrying: retryingId === ad.id,
        onRetryPayment: (a) => retryPaymentMutation.mutate(a)
      }
    ) }, ad.id)) }),
    pollingAdId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "alert alert-info mt-4", "data-ocid": "my-ads.polling_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: t("payment.newTabOpened") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: t("payment.newTabDesc") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-sm ml-auto" })
    ] }),
    pollSuccessId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "alert alert-success mt-4",
        "data-ocid": "my-ads.poll_success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("payment.pollSuccess") })
        ]
      }
    ),
    pollError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "alert alert-warning mt-4",
        "data-ocid": "my-ads.poll_error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: pollError })
        ]
      }
    ),
    retryPaymentMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "alert alert-error mt-4",
        "data-ocid": "my-ads.retry_payment.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("myAds.retryPaymentError") })
        ]
      }
    ),
    deleteTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteModal,
      {
        adId: deleteTarget.id,
        adName: deleteTarget.eventName,
        onConfirm: () => deleteMutation.mutate(deleteTarget.id),
        onCancel: () => setDeleteTarget(null),
        isPending: deleteMutation.isPending
      }
    )
  ] });
}
export {
  MyAdsPage as default
};
