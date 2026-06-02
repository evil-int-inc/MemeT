import { u as useTranslation, a as useAuth, b as useNavigate, c as useBackend, d as useQueryClient, e as useQuery, f as useMutation, j as jsxRuntimeExports, a5 as Bookmark, E as EventTypeIcon, p as MapPin, y as User, X, h as ue } from "./index-BwyFodb0.js";
function MyJoinRequestsPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getMyJoinRequests, cancelJoinRequest } = useBackend();
  const queryClient = useQueryClient();
  const { data: joinRequests = [], isLoading } = useQuery({
    queryKey: ["myJoinRequests"],
    queryFn: getMyJoinRequests,
    enabled: isAuthenticated
  });
  const cancelMutation = useMutation({
    mutationFn: cancelJoinRequest,
    onSuccess: () => {
      ue.success(t("joinRequests.requestCancelled"));
      queryClient.invalidateQueries({ queryKey: ["myJoinRequests"] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    },
    onError: () => {
      ue.error(t("joinRequests.cancelError"));
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold mb-8 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-8 h-8" }),
      t("joinRequests.myJoinRequests")
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-lg" }) }) : joinRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-16 h-16 mx-auto mb-4 opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg opacity-70", children: t("joinRequests.noMyJoinRequests") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: joinRequests.map((jr) => {
      var _a, _b, _c, _d, _e;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "card bg-base-100 shadow-xl border border-base-300",
          "data-ocid": `joinRequest.item.${jr.request.id}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-body", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "card-title text-xl cursor-pointer hover:underline text-left bg-transparent border-none p-0",
                  onClick: () => navigate({
                    to: "/ad/$id",
                    params: { id: jr.request.adId }
                  }),
                  "data-ocid": `joinRequest.ad_link.${jr.request.id}`,
                  children: ((_a = jr.ad) == null ? void 0 : _a.eventName) || t("common.unknown")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-2 text-sm opacity-70", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    EventTypeIcon,
                    {
                      eventType: (_b = jr.ad) == null ? void 0 : _b.eventType,
                      className: "w-4 h-4"
                    }
                  ),
                  jr.ad ? t(`eventType.${jr.ad.eventType}`) : t("common.unknown")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4" }),
                  ((_c = jr.ad) == null ? void 0 : _c.isVirtual) ? t("common.virtualEvent") : (_d = jr.ad) == null ? void 0 : _d.city
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
                  t("joinRequests.joinedOn"),
                  ":",
                  " ",
                  new Date(
                    Number(jr.request.createdAt)
                  ).toLocaleDateString()
                ] })
              ] }),
              ((_e = jr.ad) == null ? void 0 : _e.description) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm opacity-80 line-clamp-2", children: jr.ad.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "btn btn-neutral btn-sm btn-square",
                onClick: () => cancelMutation.mutate(jr.request.id),
                disabled: cancelMutation.isPending,
                "data-ocid": `joinRequest.cancel_button.${jr.request.id}`,
                "aria-label": t("joinRequests.cancelRequest"),
                children: cancelMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
              }
            )
          ] }) })
        },
        jr.request.id
      );
    }) })
  ] });
}
export {
  MyJoinRequestsPage as default
};
