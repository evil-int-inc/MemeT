import { u as useTranslation, c as useBackend, r as reactExports, f as useMutation, j as jsxRuntimeExports, a4 as List, a5 as House } from "./index-NWVy8DzM.js";
import { C as CircleAlert, b as buildSuccessUrl, a as buildCancelUrl } from "./stripe-CrUDsM7W.js";
import { E as ExternalLink } from "./external-link-Bom0G68b.js";
import { R as RefreshCw } from "./refresh-cw-CVOLM0gt.js";
function PaymentCancelPage() {
  const { t } = useTranslation();
  const backend = useBackend();
  const [retryError, setRetryError] = reactExports.useState(null);
  const search = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
  const adId = search.ad_id ?? search.adId ?? null;
  const [tabBlocked, setTabBlocked] = reactExports.useState(false);
  const [tabOpened, setTabOpened] = reactExports.useState(false);
  const retryMutation = useMutation({
    mutationFn: (adId2) => backend.createStripeSession(
      adId2,
      buildSuccessUrl(adId2),
      buildCancelUrl(adId2)
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
    }
  });
  const handleRetry = () => {
    if (!adId) return;
    setRetryError(null);
    retryMutation.mutate(adId);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-lg mx-auto mt-12 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "card bg-base-100 shadow-xl border border-warning/20",
      "data-ocid": "payment-cancel.card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body items-center text-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-16 h-16 text-warning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "card-title text-2xl", children: t("payment.cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base-content/70", children: t("payment.cancelDesc") }),
        retryError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "alert alert-error w-full text-sm",
            "data-ocid": "payment-cancel.error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: retryError })
            ]
          }
        ),
        tabBlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "alert alert-warning w-full text-sm",
            "data-ocid": "payment-cancel.tab_blocked_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("payment.tabBlocked") })
            ]
          }
        ),
        tabOpened && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "alert alert-info w-full text-sm",
            "data-ocid": "payment-cancel.tab_opened_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("payment.newTabDesc") })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-actions flex-col w-full gap-2 mt-2", children: [
          adId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "btn btn-neutral w-full gap-2",
              disabled: retryMutation.isPending,
              onClick: handleRetry,
              "data-ocid": "payment-cancel.retry_button",
              children: [
                retryMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-5 h-5" }),
                retryMutation.isPending ? t("payment.retrying") : t("payment.retry")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "/my-ads",
              className: "btn btn-neutral w-full gap-2",
              "data-ocid": "payment-cancel.my_ads_link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "w-5 h-5" }),
                t("nav.myAds")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "/",
              className: "btn btn-ghost w-full gap-2",
              "data-ocid": "payment-cancel.home_link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-5 h-5" }),
                t("nav.feed")
              ]
            }
          )
        ] })
      ] })
    }
  ) });
}
export {
  PaymentCancelPage as default
};
