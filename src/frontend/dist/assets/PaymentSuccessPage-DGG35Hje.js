import { o as createLucideIcon, u as useTranslation, c as useBackend, a as useAuth, r as reactExports, f as useMutation, j as jsxRuntimeExports, a3 as List, a4 as House, I as CircleCheck } from "./index-BFTCPkdC.js";
import { E as Eye } from "./eye-CGlTDaCm.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode);
function PaymentSuccessPage() {
  const { t } = useTranslation();
  const { isReady, confirmPayment } = useBackend();
  const { isLoading } = useAuth();
  const search = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
  const adId = search.ad_id ?? search.adId ?? null;
  const sessionId = search.session_id ?? search.session ?? null;
  const [confirming, setConfirming] = reactExports.useState(true);
  const [confirmedAdId, setConfirmedAdId] = reactExports.useState(null);
  const [confirmError, setConfirmError] = reactExports.useState(null);
  const hasRun = reactExports.useRef(false);
  const confirmMutation = useMutation({
    mutationFn: ({ adId: adId2, sessionId: sessionId2 }) => confirmPayment(adId2, sessionId2)
  });
  reactExports.useEffect(() => {
    if (hasRun.current) return;
    if (isLoading || !isReady) return;
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
          setTimeout(() => {
            window.location.href = "/";
          }, 4e3);
        },
        onError: (err) => {
          setConfirming(false);
          setConfirmError(
            err instanceof Error ? err.message : t("error.unknown")
          );
        }
      }
    );
  }, [adId, sessionId, isReady, isLoading, confirmMutation.mutate, t]);
  if (isLoading || !hasRun.current && !isReady) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-4",
        "data-ocid": "payment-success.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: t("payment.confirming") })
        ]
      }
    );
  }
  if (confirming) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-4",
        "data-ocid": "payment-success.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: t("payment.confirming") })
        ]
      }
    );
  }
  if (confirmError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-lg mx-auto mt-12 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "card bg-base-100 shadow-xl border border-error/20",
        "data-ocid": "payment-success.error_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body items-center text-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-16 h-16 text-error" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "card-title text-2xl", children: t("payment.confirmError") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base-content/70", children: confirmError }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-actions flex-col w-full gap-2 mt-2", children: [
            adId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: "/my-ads",
                className: "btn btn-neutral w-full gap-2",
                "data-ocid": "payment-success.my_ads_link",
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
                "data-ocid": "payment-success.home_link",
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-lg mx-auto mt-12 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "card bg-base-100 shadow-xl border border-success/20",
      "data-ocid": "payment-success.success_state",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body items-center text-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-16 h-16 text-success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "card-title text-2xl", children: t("payment.success") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base-content/70", children: t("payment.successDesc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-base-content/50", children: t("payment.successRedirect") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-actions flex-col w-full gap-2 mt-2", children: [
          confirmedAdId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `/ad/${confirmedAdId}`,
              className: "btn btn-neutral w-full gap-2",
              "data-ocid": "payment-success.view_ad_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-5 h-5" }),
                t("payment.viewAd")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "/my-ads",
              className: "btn btn-neutral btn-outline w-full gap-2",
              "data-ocid": "payment-success.my_ads_link",
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
              "data-ocid": "payment-success.home_link",
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
  PaymentSuccessPage as default
};
