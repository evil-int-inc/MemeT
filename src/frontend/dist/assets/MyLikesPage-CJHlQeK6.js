import { u as useTranslation, a as useAuth, b as useNavigate, c as useBackend, d as useQueryClient, e as useQuery, f as useMutation, j as jsxRuntimeExports, H as Heart, g as getProfileAvatarUrl, h as ue, P as Principal } from "./index-DIVa5zae.js";
function MyLikesPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getMyProfileLikes, getPublicProfile, removeProfileLike } = useBackend();
  const queryClient = useQueryClient();
  const { data: likedProfiles = [], isLoading } = useQuery({
    queryKey: ["myProfileLikes"],
    queryFn: async () => {
      const principals = await getMyProfileLikes();
      if (principals.length === 0) return [];
      const profiles = await Promise.all(
        principals.map(async (p) => {
          const profile = await getPublicProfile(p);
          return { principalStr: p, profile };
        })
      );
      return profiles.filter((item) => item.profile !== null);
    },
    enabled: isAuthenticated
  });
  const unlikeMutation = useMutation({
    mutationFn: (principalStr) => removeProfileLike(Principal.fromText(principalStr)),
    onSuccess: () => {
      ue.success(t("likes.unlikeButton"));
      queryClient.invalidateQueries({ queryKey: ["myProfileLikes"] });
      queryClient.invalidateQueries({ queryKey: ["profileLike"] });
      queryClient.invalidateQueries({ queryKey: ["profileLikeCount"] });
    },
    onError: () => {
      ue.error(t("likes.error"));
    }
  });
  if (!isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold mb-8 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-8 h-8" }),
      t("likes.pageTitle")
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-lg" }) }) : likedProfiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", "data-ocid": "likes.empty_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-16 h-16 mx-auto mb-4 opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg opacity-70", children: t("likes.empty") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-50 mt-1", children: t("likes.emptySubtext") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: likedProfiles.map(({ principalStr, profile }, index) => {
      const avatarSrc = getProfileAvatarUrl(profile);
      const isPending = unlikeMutation.isPending && unlikeMutation.variables === principalStr;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "card bg-base-100 shadow border border-base-300",
          "data-ocid": `likes.item.${index + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body gap-3 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: avatarSrc,
                  alt: profile.fullName,
                  className: "w-16 h-16 rounded-full object-cover shrink-0",
                  loading: "lazy"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-base truncate", children: profile.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mt-1", children: [
                  profile.sex && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-neutral badge-sm", children: profile.sex }),
                  profile.city && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-outline badge-sm truncate max-w-[120px]", children: profile.city })
                ] })
              ] })
            ] }),
            profile.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-70 line-clamp-3", children: profile.bio.length > 100 ? `${profile.bio.slice(0, 100)}…` : profile.bio }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-auto pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "btn btn-neutral btn-sm flex-1",
                  onClick: () => navigate({
                    to: `/user/${principalStr}`,
                    params: { principal: principalStr }
                  }),
                  "data-ocid": `likes.view_profile.${index + 1}`,
                  children: t("likes.viewProfile")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "btn btn-neutral btn-sm",
                  onClick: () => unlikeMutation.mutate(principalStr),
                  disabled: isPending,
                  "aria-label": t("likes.unlikeButton"),
                  "data-ocid": `likes.remove_button.${index + 1}`,
                  children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4 fill-current" })
                }
              )
            ] })
          ] })
        },
        principalStr
      );
    }) })
  ] });
}
export {
  MyLikesPage as default
};
