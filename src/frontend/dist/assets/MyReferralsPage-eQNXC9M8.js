import { u as useTranslation, a as useAuth, c as useBackend, e as useQuery, j as jsxRuntimeExports, L as LoadingSpinner, U as Users } from "./index-Dw-TU7ma.js";
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}
function formatDate(timestamp, language) {
  return new Date(Number(timestamp)).toLocaleDateString(language, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function ReferralCard({
  entry,
  index
}) {
  const { t, i18n } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "card bg-base-100 border border-base-300 shadow-sm",
      "data-ocid": `referrals.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "avatar placeholder", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-neutral text-neutral-content rounded-full w-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold truncate", children: [
              entry.referredPrincipal.toText().slice(0, 14),
              "…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-base-content/60", children: [
              t("referrals.referredAt"),
              ":",
              " ",
              formatDate(entry.referredAt, i18n.language)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divider my-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-base-content/60", children: t("referrals.adsPublished") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-lg", children: Number(entry.adsPublished) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-base-content/60", children: t("referrals.earned") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-lg text-success", children: formatCurrency(entry.totalEarned) })
          ] })
        ] })
      ] })
    }
  );
}
function MyReferralsPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const backend = useBackend();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myReferrals"],
    queryFn: async () => {
      const result = await backend.getMyReferrals();
      return result;
    },
    enabled: isAuthenticated
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-[60vh]",
        "data-ocid": "referrals.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" })
      }
    );
  }
  if (isError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-[60vh]",
        "data-ocid": "referrals.error_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "alert alert-error max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("common.error") }) })
      }
    );
  }
  const referrals = data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "container mx-auto px-4 py-8 max-w-2xl",
      "data-ocid": "referrals.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-7 h-7 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: t("referrals.title") })
        ] }),
        referrals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16 gap-4 text-center",
            "data-ocid": "referrals.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-16 h-16 text-base-content/20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base-content/60 max-w-sm", children: t("referrals.empty") })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", "data-ocid": "referrals.list", children: referrals.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReferralCard,
          {
            entry,
            index: idx
          },
          entry.referredPrincipal.toText()
        )) })
      ]
    }
  );
}
export {
  MyReferralsPage as default
};
