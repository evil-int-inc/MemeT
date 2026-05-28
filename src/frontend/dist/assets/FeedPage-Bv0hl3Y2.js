import { Q as QueryObserver, k as infiniteQueryBehavior, l as hasPreviousPage, m as hasNextPage, n as useBaseQuery, o as createLucideIcon, u as useTranslation, a as useAuth, c as useBackend, d as useQueryClient, r as reactExports, e as useQuery, M as MAX_FEED_PAGE_SIZE, j as jsxRuntimeExports, p as MapPin, X, E as EventTypeIcon, q as EVENT_TYPES, S as SEX_OPTIONS, s as EXPECTED_COMPANION_SEX_OPTIONS, t as SUPPORTED_LOCALES, v as SortBy, w as MeetType, b as useNavigate, g as getProfileAvatarUrl, f as useMutation, G as Globe, U as Users, x as Star, H as Heart } from "./index-CynHsLMD.js";
import { R as RefreshCw } from "./refresh-cw-Ut7SIZ8I.js";
import { W as Wallet } from "./wallet-DC73PwK7.js";
import { C as Calendar } from "./calendar-BXuPvEg3.js";
var InfiniteQueryObserver = class extends QueryObserver {
  constructor(client, options) {
    super(client, options);
  }
  bindMethods() {
    super.bindMethods();
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
  }
  setOptions(options) {
    super.setOptions({
      ...options,
      behavior: infiniteQueryBehavior()
    });
  }
  getOptimisticResult(options) {
    options.behavior = infiniteQueryBehavior();
    return super.getOptimisticResult(options);
  }
  fetchNextPage(options) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: { direction: "forward" }
      }
    });
  }
  fetchPreviousPage(options) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: { direction: "backward" }
      }
    });
  }
  createResult(query, options) {
    var _a, _b;
    const { state } = query;
    const parentResult = super.createResult(query, options);
    const { isFetching, isRefetching, isError, isRefetchError } = parentResult;
    const fetchDirection = (_b = (_a = state.fetchMeta) == null ? void 0 : _a.fetchMore) == null ? void 0 : _b.direction;
    const isFetchNextPageError = isError && fetchDirection === "forward";
    const isFetchingNextPage = isFetching && fetchDirection === "forward";
    const isFetchPreviousPageError = isError && fetchDirection === "backward";
    const isFetchingPreviousPage = isFetching && fetchDirection === "backward";
    const result = {
      ...parentResult,
      fetchNextPage: this.fetchNextPage,
      fetchPreviousPage: this.fetchPreviousPage,
      hasNextPage: hasNextPage(options, state.data),
      hasPreviousPage: hasPreviousPage(options, state.data),
      isFetchNextPageError,
      isFetchingNextPage,
      isFetchPreviousPageError,
      isFetchingPreviousPage,
      isRefetchError: isRefetchError && !isFetchNextPageError && !isFetchPreviousPageError,
      isRefetching: isRefetching && !isFetchingNextPage && !isFetchingPreviousPage
    };
    return result;
  }
};
function useInfiniteQuery(options, queryClient) {
  return useBaseQuery(
    options,
    InfiniteQueryObserver
  );
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
];
const ArrowUp = createLucideIcon("arrow-up", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
const LS_FILTERS_KEY = "memet-feed-filters";
const LS_SAVE_ENABLED_KEY = "memet-save-filters-enabled";
const FIRST_PAGE_SCROLL_THRESHOLD = 240;
const SCROLL_TOP_VISIBILITY_THRESHOLD = 480;
const FEED_REFRESH_INTERVAL_MS = 6e4;
const EMPTY_FILTER_VALUES = {
  searchText: "",
  eventType: "",
  creatorSex: "",
  companionSex: "",
  ageMin: "",
  ageMax: "",
  city: "",
  language: "",
  sortBy: "",
  meetType: "all"
};
function loadSavedFilters() {
  try {
    const enabled = localStorage.getItem(LS_SAVE_ENABLED_KEY);
    if (enabled !== "true") return null;
    const raw = localStorage.getItem(LS_FILTERS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function persistFilters(filters) {
  try {
    localStorage.setItem(LS_FILTERS_KEY, JSON.stringify(filters));
  } catch {
  }
}
function buildFeedFilter(values) {
  const f = {};
  if (values.searchText.trim()) f.searchText = values.searchText.trim();
  if (values.eventType) f.eventType = values.eventType;
  if (values.creatorSex) f.creatorSex = values.creatorSex;
  if (values.companionSex) f.expectedCompanionSex = values.companionSex;
  if (values.ageMin) f.ageMin = BigInt(values.ageMin);
  if (values.ageMax) f.ageMax = BigInt(values.ageMax);
  if (values.city.trim()) f.city = values.city.trim();
  if (values.language) f.language = values.language;
  if (values.sortBy) f.sortBy = values.sortBy;
  if (values.meetType === "inPerson") f.meetType = MeetType.inPerson;
  else if (values.meetType === "online") f.meetType = MeetType.online;
  return f;
}
function AdCard({ ad }) {
  var _a;
  const { t } = useTranslation();
  const { isAuthenticated, principal } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const profile = ad.creatorProfile;
  const avatarUrl = getProfileAvatarUrl(profile);
  const adPhotos = ad.photos ?? [];
  const truncate = (str, max) => str.length > max ? `${str.slice(0, max)}…` : str;
  const publishedDate = ad.publishedAt ? new Date(Number(ad.publishedAt) / 1e6).toLocaleDateString() : null;
  const isOwner = isAuthenticated && principal === ad.creatorPrincipal.toText();
  const [isFav, setIsFav] = reactExports.useState(false);
  const { data: isFavouritedData } = useQuery({
    queryKey: ["isFavourited", ad.id],
    queryFn: () => backend.isFavourited(ad.id),
    enabled: isAuthenticated && !isOwner
  });
  reactExports.useEffect(() => {
    if (isFavouritedData != null) setIsFav(isFavouritedData);
  }, [isFavouritedData]);
  const favMutation = useMutation({
    mutationFn: async () => isFav ? backend.removeFromFavourites(ad.id) : backend.addToFavourites(ad.id),
    onSuccess: () => {
      setIsFav((v) => !v);
      queryClient.invalidateQueries({ queryKey: ["favouriteCount", ad.id] });
    }
  });
  const { data: favCount, isLoading: favCountLoading } = useQuery({
    queryKey: ["favouriteCount", ad.id],
    queryFn: () => backend.getFavouriteCount(ad.id)
  });
  const creatorText = ad.creatorPrincipal.toText();
  const userId = isAuthenticated ? principal : void 0;
  const [isLiked, setIsLiked] = reactExports.useState(false);
  const { data: isLikedData } = useQuery({
    queryKey: ["profileLike", creatorText, userId ?? ""],
    queryFn: () => backend.isProfileLikedByMe(ad.creatorPrincipal),
    enabled: isAuthenticated
  });
  reactExports.useEffect(() => {
    if (isLikedData != null) setIsLiked(isLikedData);
  }, [isLikedData]);
  const likeMutation = useMutation({
    mutationFn: async () => isLiked ? backend.removeProfileLike(ad.creatorPrincipal) : backend.addProfileLike(ad.creatorPrincipal),
    onSuccess: () => {
      setIsLiked((v) => !v);
      queryClient.invalidateQueries({
        queryKey: ["profileLikeCount", creatorText]
      });
      queryClient.invalidateQueries({
        queryKey: ["profileLike", creatorText, userId ?? ""]
      });
    }
  });
  const { data: likeCount, isLoading: likeCountLoading } = useQuery({
    queryKey: ["profileLikeCount", creatorText],
    queryFn: () => backend.getProfileLikeCount(ad.creatorPrincipal)
  });
  const { data: hasRequest, isLoading: hasRequestLoading } = useQuery({
    queryKey: ["hasJoinRequest", ad.id],
    queryFn: () => backend.hasJoinRequest(ad.id),
    enabled: isAuthenticated && !isOwner
  });
  const { data: myRequests } = useQuery({
    queryKey: ["myJoinRequests"],
    queryFn: () => backend.getMyJoinRequests(),
    enabled: isAuthenticated && !isOwner
  });
  const requestId = (_a = myRequests == null ? void 0 : myRequests.find(
    (r) => {
      var _a2;
      return r.request.adId === ad.id || ((_a2 = r.ad) == null ? void 0 : _a2.id) === ad.id;
    }
  )) == null ? void 0 : _a.request.id;
  const sendMutation = useMutation({
    mutationFn: () => backend.sendJoinRequest(ad.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hasJoinRequest", ad.id] });
      queryClient.invalidateQueries({ queryKey: ["myJoinRequests"] });
    }
  });
  const cancelMutation = useMutation({
    mutationFn: () => {
      if (!requestId) throw new Error("Request not found");
      return backend.cancelJoinRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hasJoinRequest", ad.id] });
      queryClient.invalidateQueries({ queryKey: ["myJoinRequests"] });
    }
  });
  const handleJoinClick = (e) => {
    e.stopPropagation();
    sendMutation.mutate();
  };
  const handleCancelClick = (e) => {
    e.stopPropagation();
    cancelMutation.mutate();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "card bg-base-100 shadow hover:shadow-lg transition-shadow border border-base-200",
      "data-ocid": `feed.ad_card.${ad.id}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body p-4 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "avatar flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "w-12 h-12 rounded-full bg-base-300 overflow-hidden flex items-center justify-center p-0 border-0 bg-transparent cursor-pointer",
              onClick: (e) => {
                e.stopPropagation();
                navigate({
                  to: "/user/$principal",
                  params: { principal: ad.creatorPrincipal.toText() }
                });
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: avatarUrl,
                  alt: "",
                  className: "w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer",
                  loading: "lazy"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm truncate", children: (profile == null ? void 0 : profile.fullName) ?? t("common.unknown") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mt-0.5", children: [
              (profile == null ? void 0 : profile.sex) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-ghost badge-xs", children: t(`sex.${profile.sex}`) }),
              (profile == null ? void 0 : profile.dateOfBirth) != null && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-ghost badge-xs", children: Math.floor(
                (Date.now() - Number(profile.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1e3)
              ) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-base leading-tight", children: ad.eventName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-primary badge-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(EventTypeIcon, { eventType: ad.eventType, className: "w-3 h-3 mr-1" }),
            t(`eventType.${ad.eventType}`)
          ] }),
          ad.isVirtual ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-secondary badge-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3 mr-1" }),
            t("common.virtualEvent")
          ] }) : ad.city ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-outline badge-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 mr-1" }),
            ad.city
          ] }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-accent badge-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3 mr-1" }),
            t(`companionSex.${ad.expectedCompanionSex}`)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-outline badge-sm gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-3 h-3" }),
            t(`createAd.howPays.${ad.howPaysForEvent}`)
          ] })
        ] }),
        adPhotos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: adPhotos.map((photo, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-14 h-14 rounded-lg overflow-hidden shrink-0",
            "data-ocid": `feed.ad_card.${ad.id}.photo.${idx + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: photo.blob.getDirectURL(),
                alt: `${ad.eventName} ${idx + 1}`,
                className: "w-full h-full object-cover",
                loading: "lazy"
              }
            )
          },
          idx
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-base-content/80", children: truncate(ad.description, 120) }),
        ad.linkPreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-base-200 p-2 bg-base-200/50 text-xs", children: [
          ad.linkPreview.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: ad.linkPreview.image,
              alt: "",
              className: "w-full h-20 object-cover rounded mb-1",
              loading: "lazy"
            }
          ),
          ad.linkPreview.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: ad.linkPreview.title }),
          ad.linkPreview.domain && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base-content/50", children: ad.linkPreview.domain })
        ] }),
        publishedDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-base-content/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
          publishedDate
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-base-200 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "btn btn-neutral btn-sm",
              onClick: (e) => {
                e.stopPropagation();
                navigate({ to: "/ad/$id", params: { id: ad.id } });
              },
              "data-ocid": `feed.ad_card.${ad.id}.view_button`,
              children: t("feed.viewAd")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "btn btn-neutral btn-sm",
              onClick: (e) => {
                e.stopPropagation();
                navigate({
                  to: "/user/$principal",
                  params: { principal: ad.creatorPrincipal.toText() }
                });
              },
              "data-ocid": `feed.ad_card.${ad.id}.view_user_button`,
              children: t("feed.viewUser")
            }
          ),
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: `btn btn-ghost btn-sm p-1 ${isOwner ? "opacity-50 cursor-not-allowed" : ""}`,
                onClick: isOwner ? void 0 : (e) => {
                  e.stopPropagation();
                  favMutation.mutate();
                },
                disabled: isOwner || favMutation.isPending,
                title: t("favourites.addButton"),
                "aria-label": t("favourites.addButton"),
                "data-ocid": `feed.ad_card.${ad.id}.favourite_button`,
                children: favMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Star,
                  {
                    size: 16,
                    className: isFav && !isOwner ? "text-warning fill-current" : ""
                  }
                )
              }
            ),
            favCountLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-base-content/70 tabular-nums", children: favCount ?? 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "btn btn-neutral btn-sm btn-square",
                onClick: (e) => {
                  e.stopPropagation();
                  likeMutation.mutate();
                },
                disabled: likeMutation.isPending,
                title: t("likes.likeUser"),
                "aria-label": t("likes.likeUser"),
                "data-ocid": `feed.ad_card.${ad.id}.like_button`,
                children: likeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Heart,
                  {
                    size: 16,
                    className: isLiked ? "text-error fill-current" : ""
                  }
                )
              }
            ),
            likeCountLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-base-content/70 tabular-nums", children: likeCount ?? 0 })
          ] }),
          !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "btn btn-neutral btn-sm btn-square opacity-50 cursor-not-allowed",
                disabled: true,
                title: t("likes.likeUser"),
                "aria-label": t("likes.likeUser"),
                "data-ocid": `feed.ad_card.${ad.id}.like_button`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 16 })
              }
            ),
            likeCountLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-base-content/70 tabular-nums", children: likeCount ?? 0 })
          ] })
        ] }),
        isAuthenticated && !isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1 flex flex-wrap gap-2", children: hasRequestLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "btn btn-neutral btn-sm w-full",
            disabled: true,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" })
          }
        ) : hasRequest ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "btn btn-neutral btn-sm w-full gap-2",
            onClick: handleCancelClick,
            disabled: cancelMutation.isPending || !requestId,
            "data-ocid": `feed.ad_card.${ad.id}.cancel_request_button`,
            children: [
              cancelMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4 fill-current" }),
              t("joinRequests.cancelRequest")
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "btn btn-neutral btn-sm w-full gap-2",
            onClick: handleJoinClick,
            disabled: sendMutation.isPending,
            "data-ocid": `feed.ad_card.${ad.id}.request_to_join_button`,
            children: [
              sendMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4" }),
              t("joinRequests.requestToJoin")
            ]
          }
        ) })
      ] })
    }
  );
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card bg-base-100 shadow border border-base-200 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton w-12 h-12 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-4 w-32 mb-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-3 w-20" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-5 w-3/4 mb-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-5 w-16 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-5 w-20 rounded-full" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-10 w-full" })
  ] });
}
function FeedPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const [filter, setFilter] = reactExports.useState(() => ({
    ...EMPTY_FILTER_VALUES,
    ...loadSavedFilters() ?? {}
  }));
  const [defaultFiltersApplied, setDefaultFiltersApplied] = reactExports.useState(false);
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const [saveFilters, setSaveFilters] = reactExports.useState(
    () => localStorage.getItem(LS_SAVE_ENABLED_KEY) === "true"
  );
  const [showScrollTop, setShowScrollTop] = reactExports.useState(false);
  const [isOnFirstPage, setIsOnFirstPage] = reactExports.useState(true);
  const [isRefreshingFirstPage, setIsRefreshingFirstPage] = reactExports.useState(false);
  const loadMoreRef = reactExports.useRef(null);
  const refreshingFirstPageRef = reactExports.useRef(false);
  const feedFilter = reactExports.useMemo(() => buildFeedFilter(filter), [filter]);
  const { data: myProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => backend.getMyProfile(),
    enabled: isAuthenticated && !isAuthLoading
  });
  const profileCity = (myProfile == null ? void 0 : myProfile.city) ?? "";
  const myCity = profileCity;
  const isMyCityFilterActive = Boolean(myCity && filter.city === myCity);
  const updateFilter = reactExports.useCallback((updates) => {
    setFilter((currentFilter) => ({
      ...currentFilter,
      ...updates
    }));
  }, []);
  const persistFiltersIfEnabled = reactExports.useCallback(
    (filters) => {
      if (saveFilters) persistFilters(filters);
    },
    [saveFilters]
  );
  reactExports.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsOnFirstPage(scrollY <= FIRST_PAGE_SCROLL_THRESHOLD);
      setShowScrollTop(scrollY > SCROLL_TOP_VISIBILITY_THRESHOLD);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  reactExports.useEffect(() => {
    if (defaultFiltersApplied || isAuthLoading) return;
    setDefaultFiltersApplied(true);
  }, [defaultFiltersApplied, isAuthLoading]);
  const applyMyCityFilter = reactExports.useCallback(() => {
    if (!myCity) return;
    updateFilter({ city: myCity });
  }, [myCity, updateFilter]);
  const clearFilters = () => {
    setFilter({ ...EMPTY_FILTER_VALUES });
  };
  const clearFilter = reactExports.useCallback(
    (key) => {
      const nextValue = key === "meetType" ? "all" : "";
      updateFilter({ [key]: nextValue });
    },
    [updateFilter]
  );
  reactExports.useEffect(() => {
    persistFiltersIfEnabled(filter);
  }, [filter, persistFiltersIfEnabled]);
  reactExports.useEffect(() => {
    localStorage.setItem(LS_SAVE_ENABLED_KEY, saveFilters ? "true" : "false");
  }, [saveFilters]);
  const activeFilterEntries = Object.entries(filter).filter(
    ([, value]) => Boolean(value && value !== "all")
  );
  const hasActiveFilters = activeFilterEntries.length > 0;
  const feedQueryKey = reactExports.useMemo(() => ["feed", filter], [filter]);
  const {
    data: feedData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage: hasNextPage2,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: feedQueryKey,
    queryFn: ({ pageParam }) => backend.getFeed(feedFilter, Number(pageParam), MAX_FEED_PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => lastPage.length === MAX_FEED_PAGE_SIZE ? allPages.length * MAX_FEED_PAGE_SIZE : void 0,
    enabled: defaultFiltersApplied
  });
  reactExports.useEffect(() => {
    if (!defaultFiltersApplied) return;
    queryClient.setQueryData(
      feedQueryKey,
      (currentData) => {
        if (!currentData || currentData.pages.length <= 1) return currentData;
        return {
          pages: [currentData.pages[0]],
          pageParams: [currentData.pageParams[0] ?? 0]
        };
      }
    );
  }, [defaultFiltersApplied, feedQueryKey, queryClient]);
  const ads = reactExports.useMemo(() => {
    const seenAdIds = /* @__PURE__ */ new Set();
    return (feedData == null ? void 0 : feedData.pages.flat().filter((ad) => {
      if (seenAdIds.has(ad.id)) return false;
      seenAdIds.add(ad.id);
      return true;
    })) ?? [];
  }, [feedData]);
  const refreshFirstPage = reactExports.useCallback(async () => {
    if (!defaultFiltersApplied || refreshingFirstPageRef.current) return;
    refreshingFirstPageRef.current = true;
    setIsRefreshingFirstPage(true);
    try {
      const firstPage = await backend.getFeed(
        feedFilter,
        0,
        MAX_FEED_PAGE_SIZE
      );
      queryClient.setQueryData(
        feedQueryKey,
        {
          pages: [firstPage],
          pageParams: [0]
        }
      );
    } finally {
      refreshingFirstPageRef.current = false;
      setIsRefreshingFirstPage(false);
    }
  }, [backend, defaultFiltersApplied, feedFilter, feedQueryKey, queryClient]);
  const handleRefreshClick = reactExports.useCallback(() => {
    persistFiltersIfEnabled(filter);
    void refreshFirstPage();
  }, [filter, persistFiltersIfEnabled, refreshFirstPage]);
  reactExports.useEffect(() => {
    if (!defaultFiltersApplied || !isOnFirstPage) return;
    const intervalId = window.setInterval(() => {
      void refreshFirstPage();
    }, FEED_REFRESH_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [defaultFiltersApplied, isOnFirstPage, refreshFirstPage]);
  reactExports.useEffect(() => {
    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement || !defaultFiltersApplied || !hasNextPage2) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage2 && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "480px 0px" }
    );
    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, [defaultFiltersApplied, fetchNextPage, hasNextPage2, isFetchingNextPage]);
  const scrollToTopAndRefresh = reactExports.useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const startedAt = Date.now();
    const refreshAfterScroll = () => {
      if (window.scrollY <= 8 || Date.now() - startedAt > 1500) {
        void refreshFirstPage();
        return;
      }
      window.requestAnimationFrame(refreshAfterScroll);
    };
    window.requestAnimationFrame(refreshAfterScroll);
  }, [refreshFirstPage]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-6 max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: `btn btn-neutral ${showFilters ? "" : "btn-outline"} gap-2`,
          onClick: () => setShowFilters((v) => !v),
          "data-ocid": "feed.filter_toggle",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4" }),
            t("feed.filters.title"),
            showFilters ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: `btn btn-neutral ${isMyCityFilterActive ? "" : "btn-outline"} gap-2`,
          onClick: applyMyCityFilter,
          disabled: !myCity,
          "data-ocid": "feed.by_my_city",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4" }),
            t("feed.filters.byMyCity")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "btn btn-neutral btn-outline gap-2",
          onClick: handleRefreshClick,
          disabled: !defaultFiltersApplied || isRefreshingFirstPage,
          "data-ocid": "feed.refetch",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RefreshCw,
              {
                className: `w-4 h-4 ${isRefreshingFirstPage ? "animate-spin" : ""}`
              }
            ),
            t("feed.refresh")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm cursor-pointer select-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            className: "checkbox checkbox-sm",
            checked: saveFilters,
            onChange: (e) => setSaveFilters(e.target.checked),
            "aria-label": t("feed.filters.saveFilters"),
            "data-ocid": "feed.save_filters_toggle"
          }
        ),
        t("feed.filters.saveFilters")
      ] })
    ] }),
    hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [
      activeFilterEntries.map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-primary gap-1", children: [
        key,
        ": ",
        String(value),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => clearFilter(key),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
          }
        )
      ] }, key)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "badge badge-ghost gap-1 cursor-pointer",
          onClick: clearFilters,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }),
            t("feed.filters.clearAll")
          ]
        }
      )
    ] }),
    showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card bg-base-200 p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "filter-event-type",
            className: "block text-sm font-medium",
            children: t("feed.filters.eventType")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            EventTypeIcon,
            {
              eventType: filter.eventType,
              className: "pointer-events-none absolute left-3 top-1/2 z-10 w-4 h-4 -translate-y-1/2 text-base-content/60"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              id: "filter-event-type",
              className: `select select-bordered w-full ${filter.eventType ? "pl-10" : ""}`,
              value: filter.eventType,
              onChange: (e) => updateFilter({ eventType: e.target.value }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("feed.filters.allTypes") }),
                EVENT_TYPES.map((et) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: et.value, children: t(`eventType.${et.value}`) }, et.value))
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "filter-creator-sex",
            className: "block text-sm font-medium",
            children: t("feed.filters.creatorSex")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "filter-creator-sex",
            className: "select select-bordered",
            value: filter.creatorSex,
            onChange: (e) => updateFilter({ creatorSex: e.target.value }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("feed.filters.any") }),
              SEX_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.value, children: t(`sex.${s.value}`) }, s.value))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "filter-companion-sex",
            className: "block text-sm font-medium",
            children: t("feed.filters.companionSex")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "filter-companion-sex",
            className: "select select-bordered",
            value: filter.companionSex,
            onChange: (e) => updateFilter({
              companionSex: e.target.value
            }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("feed.filters.any") }),
              EXPECTED_COMPANION_SEX_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.value, children: t(`companionSex.${s.value}`) }, s.value))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "filter-city", className: "block text-sm font-medium", children: t("feed.filters.city") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "filter-city",
            type: "text",
            className: "input input-bordered",
            value: filter.city,
            onChange: (e) => updateFilter({ city: e.target.value }),
            placeholder: t("feed.filters.cityPlaceholder")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "filter-language",
            className: "block text-sm font-medium",
            children: t("feed.filters.language")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "filter-language",
            className: "select select-bordered",
            value: filter.language,
            onChange: (e) => updateFilter({ language: e.target.value }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("feed.filters.any") }),
              SUPPORTED_LOCALES.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: l.code, children: l.nativeName }, l.code))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            className: "block text-sm font-medium",
            htmlFor: "filter-age-min",
            children: t("feed.filters.ageRange")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "filter-age-min",
              type: "number",
              className: "input input-bordered w-1/2",
              placeholder: t("feed.filters.ageMin"),
              value: filter.ageMin,
              onChange: (e) => updateFilter({ ageMin: e.target.value }),
              min: "13",
              max: "120"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "filter-age-max",
              type: "number",
              className: "input input-bordered w-1/2",
              placeholder: t("feed.filters.ageMax"),
              value: filter.ageMax,
              onChange: (e) => updateFilter({ ageMax: e.target.value }),
              min: "13",
              max: "120"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "filter-sort", className: "block text-sm font-medium", children: t("feed.filters.sort") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "filter-sort",
            className: "select select-bordered",
            value: filter.sortBy,
            onChange: (e) => updateFilter({ sortBy: e.target.value }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("feed.filters.defaultSort") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: SortBy.newest, children: t("feed.sortOptions.newest") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: SortBy.oldest, children: t("feed.sortOptions.oldest") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: SortBy.city, children: t("feed.sortOptions.cityRelevance") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: SortBy.eventType, children: t("feed.sortOptions.eventType") })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-medium", children: t("meetType.label") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4 pt-1", children: ["all", "inPerson", "online"].map((val) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "flex items-center gap-2 cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "radio",
                  className: "radio radio-sm",
                  name: "filter-meet-type",
                  value: val,
                  checked: filter.meetType === val,
                  onChange: () => updateFilter({ meetType: val }),
                  "data-ocid": `feed.filters.meet_type_${val}_radio`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-text", children: val === "all" ? t("meetType.all") : t(`meetType.${val}`) })
            ]
          },
          val
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 lg:col-span-3 flex items-center gap-3 pt-2 border-t border-base-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "filter-save",
            type: "checkbox",
            className: "checkbox checkbox-sm",
            checked: saveFilters,
            onChange: (e) => setSaveFilters(e.target.checked),
            "aria-label": t("feed.filters.saveFilters"),
            "data-ocid": "feed.filters.save_checkbox"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "filter-save",
            className: "text-sm cursor-pointer select-none",
            children: t("feed.filters.saveFilters")
          }
        )
      ] })
    ] }),
    !defaultFiltersApplied || isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: Array.from({ length: 6 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static list
      /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i)
    )) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "alert alert-error", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("common.error") }) }) : ads.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-base-content/50",
        "data-ocid": "feed.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-16 h-16 mb-4 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: t("feed.noAds") }),
          hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "btn btn-neutral btn-outline mt-4",
              onClick: clearFilters,
              children: t("feed.filters.clearAll")
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
          "data-ocid": "feed.ad_grid",
          children: ads.map((ad) => /* @__PURE__ */ jsxRuntimeExports.jsx(AdCard, { ad }, ad.id))
        }
      ),
      hasNextPage2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: loadMoreRef,
          className: "h-10",
          "aria-hidden": "true",
          "data-ocid": "feed.load_more_sentinel"
        }
      ),
      isFetchingNextPage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4", children: Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static list
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i)
      )) })
    ] }),
    showScrollTop && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "btn btn-neutral btn-circle fixed bottom-6 right-6 z-40 shadow-lg",
        onClick: scrollToTopAndRefresh,
        "aria-label": t("feed.scrollToTop"),
        "data-ocid": "feed.scroll_to_top",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "w-5 h-5" })
      }
    )
  ] });
}
export {
  FeedPage as default
};
