import {
  type EventType,
  type ExpectedCompanionSex,
  MeetType,
  type Sex,
  SortBy,
} from "@/backend";
import type { AdvertisementPublic, FeedFilter } from "@/backend";
import {
  EVENT_TYPES,
  EXPECTED_COMPANION_SEX_OPTIONS,
  MAX_FEED_PAGE_SIZE,
  SEX_OPTIONS,
  SUPPORTED_LOCALES,
} from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/services/backend";
import { getProfileAvatarUrl } from "@/utils/avatar";
import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  Globe,
  Heart,
  MapPin,
  RefreshCw,
  Search,
  Star,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LS_FILTERS_KEY = "memet-feed-filters";
const LS_SAVE_ENABLED_KEY = "memet-save-filters-enabled";
const FIRST_PAGE_SCROLL_THRESHOLD = 240;
const SCROLL_TOP_VISIBILITY_THRESHOLD = 480;
const FEED_REFRESH_INTERVAL_MS = 60_000;

type SavedFilters = {
  searchText: string;
  eventType: EventType | "";
  creatorSex: Sex | "";
  companionSex: ExpectedCompanionSex | "";
  ageMin: string;
  ageMax: string;
  city: string;
  language: string;
  sortBy: SortBy | "";
  meetType: "inPerson" | "online" | "all";
};

const EMPTY_FILTER_VALUES: SavedFilters = {
  searchText: "",
  eventType: "",
  creatorSex: "",
  companionSex: "",
  ageMin: "",
  ageMax: "",
  city: "",
  language: "",
  sortBy: "",
  meetType: "all",
};

function loadSavedFilters(): SavedFilters | null {
  try {
    const enabled = localStorage.getItem(LS_SAVE_ENABLED_KEY);
    if (enabled !== "true") return null;
    const raw = localStorage.getItem(LS_FILTERS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedFilters;
  } catch {
    return null;
  }
}

function persistFilters(filters: SavedFilters) {
  try {
    localStorage.setItem(LS_FILTERS_KEY, JSON.stringify(filters));
  } catch {
    // ignore storage errors
  }
}

function buildFeedFilter(values: SavedFilters): FeedFilter {
  const f: FeedFilter = {};
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

function AdCard({ ad }: { ad: AdvertisementPublic }) {
  const { t } = useTranslation();
  const { isAuthenticated, principal } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const profile = ad.creatorProfile;
  const avatarUrl = getProfileAvatarUrl(profile);
  const adPhotos = ad.photos ?? [];
  const truncate = (str: string, max: number) =>
    str.length > max ? `${str.slice(0, max)}\u2026` : str;
  const publishedDate = ad.publishedAt
    ? new Date(Number(ad.publishedAt) / 1_000_000).toLocaleDateString()
    : null;

  const isOwner = isAuthenticated && principal === ad.creatorPrincipal.toText();

  const [isFav, setIsFav] = useState(false);
  const { data: isFavouritedData } = useQuery({
    queryKey: ["isFavourited", ad.id],
    queryFn: () => backend.isFavourited(ad.id),
    enabled: isAuthenticated && !isOwner,
  });

  useEffect(() => {
    if (isFavouritedData != null) setIsFav(isFavouritedData);
  }, [isFavouritedData]);

  const favMutation = useMutation({
    mutationFn: async () =>
      isFav
        ? backend.removeFromFavourites(ad.id)
        : backend.addToFavourites(ad.id),
    onSuccess: () => {
      setIsFav((v) => !v);
      queryClient.invalidateQueries({ queryKey: ["favouriteCount", ad.id] });
    },
  });

  const { data: favCount, isLoading: favCountLoading } = useQuery({
    queryKey: ["favouriteCount", ad.id],
    queryFn: () => backend.getFavouriteCount(ad.id),
  });

  const creatorText = ad.creatorPrincipal.toText();
  const userId = isAuthenticated ? principal : undefined;

  const [isLiked, setIsLiked] = useState(false);
  const { data: isLikedData } = useQuery({
    queryKey: ["profileLike", creatorText, userId ?? ""],
    queryFn: () => backend.isProfileLikedByMe(ad.creatorPrincipal),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (isLikedData != null) setIsLiked(isLikedData);
  }, [isLikedData]);

  const likeMutation = useMutation({
    mutationFn: async () =>
      isLiked
        ? backend.removeProfileLike(ad.creatorPrincipal)
        : backend.addProfileLike(ad.creatorPrincipal),
    onSuccess: () => {
      setIsLiked((v) => !v);
      queryClient.invalidateQueries({
        queryKey: ["profileLikeCount", creatorText],
      });
      queryClient.invalidateQueries({
        queryKey: ["profileLike", creatorText, userId ?? ""],
      });
    },
  });

  const { data: likeCount, isLoading: likeCountLoading } = useQuery({
    queryKey: ["profileLikeCount", creatorText],
    queryFn: () => backend.getProfileLikeCount(ad.creatorPrincipal),
  });

  const { data: hasRequest, isLoading: hasRequestLoading } = useQuery({
    queryKey: ["hasJoinRequest", ad.id],
    queryFn: () => backend.hasJoinRequest(ad.id),
    enabled: isAuthenticated && !isOwner,
  });

  const { data: myRequests } = useQuery({
    queryKey: ["myJoinRequests"],
    queryFn: () => backend.getMyJoinRequests(),
    enabled: isAuthenticated && !isOwner,
  });

  const requestId = myRequests?.find(
    (r) => r.request.adId === ad.id || r.ad?.id === ad.id,
  )?.request.id;

  const sendMutation = useMutation({
    mutationFn: () => backend.sendJoinRequest(ad.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hasJoinRequest", ad.id] });
      queryClient.invalidateQueries({ queryKey: ["myJoinRequests"] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => {
      if (!requestId) throw new Error("Request not found");
      return backend.cancelJoinRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hasJoinRequest", ad.id] });
      queryClient.invalidateQueries({ queryKey: ["myJoinRequests"] });
    },
  });

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sendMutation.mutate();
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cancelMutation.mutate();
  };

  return (
    <div
      className="card bg-base-100 shadow hover:shadow-lg transition-shadow border border-base-200"
      data-ocid={`feed.ad_card.${ad.id}`}
    >
      <div className="card-body p-4 gap-2">
        <div className="flex items-start gap-3">
          <div className="avatar flex-shrink-0">
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-base-300 overflow-hidden flex items-center justify-center p-0 border-0 bg-transparent cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate({
                  to: "/user/$principal",
                  params: { principal: ad.creatorPrincipal.toText() },
                });
              }}
            >
              <img
                src={avatarUrl}
                alt=""
                className="w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                loading="lazy"
              />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {profile?.fullName ?? t("common.unknown")}
            </p>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {profile?.sex && (
                <span className="badge badge-ghost badge-xs">
                  {t(`sex.${profile.sex}`)}
                </span>
              )}
              {profile?.dateOfBirth != null && (
                <span className="badge badge-ghost badge-xs">
                  {Math.floor(
                    (Date.now() - Number(profile.dateOfBirth)) /
                      (365.25 * 24 * 60 * 60 * 1000),
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
        <h3 className="font-bold text-base leading-tight">{ad.eventName}</h3>
        <div className="flex flex-wrap gap-1">
          <span className="badge badge-primary badge-sm">
            {t(`eventType.${ad.eventType}`)}
          </span>
          {ad.isVirtual ? (
            <span className="badge badge-secondary badge-sm">
              <Globe className="w-3 h-3 mr-1" />
              {t("common.virtualEvent")}
            </span>
          ) : ad.city ? (
            <span className="badge badge-outline badge-sm">
              <MapPin className="w-3 h-3 mr-1" />
              {ad.city}
            </span>
          ) : null}
          <span className="badge badge-accent badge-sm">
            <Users className="w-3 h-3 mr-1" />
            {t(`companionSex.${ad.expectedCompanionSex}`)}
          </span>
          <span className="badge badge-outline badge-sm gap-1">
            <Wallet className="w-3 h-3" />
            {t(`createAd.howPays.${ad.howPaysForEvent}`)}
          </span>
        </div>
        {adPhotos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {adPhotos.map((photo, idx) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: photos have no stable unique ID
                key={idx}
                className="w-14 h-14 rounded-lg overflow-hidden shrink-0"
                data-ocid={`feed.ad_card.${ad.id}.photo.${idx + 1}`}
              >
                <img
                  src={photo.blob.getDirectURL()}
                  alt={`${ad.eventName} ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
        <p className="text-sm text-base-content/80">
          {truncate(ad.description, 120)}
        </p>
        {ad.linkPreview && (
          <div className="rounded-lg border border-base-200 p-2 bg-base-200/50 text-xs">
            {ad.linkPreview.image && (
              <img
                src={ad.linkPreview.image}
                alt=""
                className="w-full h-20 object-cover rounded mb-1"
                loading="lazy"
              />
            )}
            {ad.linkPreview.title && (
              <p className="font-medium truncate">{ad.linkPreview.title}</p>
            )}
            {ad.linkPreview.domain && (
              <p className="text-base-content/50">{ad.linkPreview.domain}</p>
            )}
          </div>
        )}
        {publishedDate && (
          <div className="flex items-center gap-1 text-xs text-base-content/50">
            <Calendar className="w-3 h-3" />
            {publishedDate}
          </div>
        )}

        {/* Action buttons */}
        <div className="pt-2 border-t border-base-200 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-neutral btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: "/ad/$id", params: { id: ad.id } });
            }}
            data-ocid={`feed.ad_card.${ad.id}.view_button`}
          >
            {t("feed.viewAd")}
          </button>
          <button
            type="button"
            className="btn btn-neutral btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate({
                to: "/user/$principal",
                params: { principal: ad.creatorPrincipal.toText() },
              });
            }}
            data-ocid={`feed.ad_card.${ad.id}.view_user_button`}
          >
            {t("feed.viewUser")}
          </button>
          {isAuthenticated && (
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                className={`btn btn-ghost btn-sm p-1 ${isOwner ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={
                  isOwner
                    ? undefined
                    : (e) => {
                        e.stopPropagation();
                        favMutation.mutate();
                      }
                }
                disabled={isOwner || favMutation.isPending}
                title={t("favourites.addButton")}
                aria-label={t("favourites.addButton")}
                data-ocid={`feed.ad_card.${ad.id}.favourite_button`}
              >
                {favMutation.isPending ? (
                  <span className="loading loading-infinity loading-xs" />
                ) : (
                  <Star
                    size={16}
                    className={
                      isFav && !isOwner ? "text-warning fill-current" : ""
                    }
                  />
                )}
              </button>
              {favCountLoading ? (
                <span className="loading loading-infinity loading-xs" />
              ) : (
                <span className="text-sm text-base-content/70 tabular-nums">
                  {favCount ?? 0}
                </span>
              )}
              <button
                type="button"
                className="btn btn-neutral btn-sm btn-square"
                onClick={(e) => {
                  e.stopPropagation();
                  likeMutation.mutate();
                }}
                disabled={likeMutation.isPending}
                title={t("likes.likeUser")}
                aria-label={t("likes.likeUser")}
                data-ocid={`feed.ad_card.${ad.id}.like_button`}
              >
                {likeMutation.isPending ? (
                  <span className="loading loading-infinity loading-xs" />
                ) : (
                  <Heart
                    size={16}
                    className={isLiked ? "text-error fill-current" : ""}
                  />
                )}
              </button>
              {likeCountLoading ? (
                <span className="loading loading-infinity loading-xs" />
              ) : (
                <span className="text-sm text-base-content/70 tabular-nums">
                  {likeCount ?? 0}
                </span>
              )}
            </div>
          )}
          {!isAuthenticated && (
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                className="btn btn-neutral btn-sm btn-square opacity-50 cursor-not-allowed"
                disabled
                title={t("likes.likeUser")}
                aria-label={t("likes.likeUser")}
                data-ocid={`feed.ad_card.${ad.id}.like_button`}
              >
                <Heart size={16} />
              </button>
              {likeCountLoading ? (
                <span className="loading loading-infinity loading-xs" />
              ) : (
                <span className="text-sm text-base-content/70 tabular-nums">
                  {likeCount ?? 0}
                </span>
              )}
            </div>
          )}
        </div>
        {/* Join request button */}
        {isAuthenticated && !isOwner && (
          <div className="pt-1 flex flex-wrap gap-2">
            {hasRequestLoading ? (
              <button
                type="button"
                className="btn btn-neutral btn-sm w-full"
                disabled
              >
                <span className="loading loading-infinity loading-xs" />
              </button>
            ) : hasRequest ? (
              <button
                type="button"
                className="btn btn-neutral btn-sm w-full gap-2"
                onClick={handleCancelClick}
                disabled={cancelMutation.isPending || !requestId}
                data-ocid={`feed.ad_card.${ad.id}.cancel_request_button`}
              >
                {cancelMutation.isPending ? (
                  <span className="loading loading-infinity loading-xs" />
                ) : (
                  <Heart className="w-4 h-4 fill-current" />
                )}
                {t("joinRequests.cancelRequest")}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-neutral btn-sm w-full gap-2"
                onClick={handleJoinClick}
                disabled={sendMutation.isPending}
                data-ocid={`feed.ad_card.${ad.id}.request_to_join_button`}
              >
                {sendMutation.isPending ? (
                  <span className="loading loading-infinity loading-xs" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
                {t("joinRequests.requestToJoin")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card bg-base-100 shadow border border-base-200 p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="skeleton h-4 w-32 mb-1" />
          <div className="skeleton h-3 w-20" />
        </div>
      </div>
      <div className="skeleton h-5 w-3/4 mb-2" />
      <div className="flex gap-1 mb-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="skeleton h-10 w-full" />
    </div>
  );
}

export default function FeedPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<SavedFilters>(() => ({
    ...EMPTY_FILTER_VALUES,
    ...(loadSavedFilters() ?? {}),
  }));
  const [defaultFiltersApplied, setDefaultFiltersApplied] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [saveFilters, setSaveFilters] = useState<boolean>(
    () => localStorage.getItem(LS_SAVE_ENABLED_KEY) === "true",
  );
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOnFirstPage, setIsOnFirstPage] = useState(true);
  const [isRefreshingFirstPage, setIsRefreshingFirstPage] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const refreshingFirstPageRef = useRef(false);
  const feedFilter = useMemo(() => buildFeedFilter(filter), [filter]);

  // Load user profile for the explicit "By my city" shortcut.
  const { data: myProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => backend.getMyProfile(),
    enabled: isAuthenticated && !isAuthLoading,
  });
  const profileCity = myProfile?.city ?? "";
  const myCity = profileCity;
  const isMyCityFilterActive = Boolean(myCity && filter.city === myCity);

  const updateFilter = useCallback((updates: Partial<SavedFilters>) => {
    setFilter((currentFilter) => ({
      ...currentFilter,
      ...updates,
    }));
  }, []);

  const persistFiltersIfEnabled = useCallback(
    (filters: SavedFilters) => {
      if (saveFilters) persistFilters(filters);
    },
    [saveFilters],
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsOnFirstPage(scrollY <= FIRST_PAGE_SCROLL_THRESHOLD);
      setShowScrollTop(scrollY > SCROLL_TOP_VISIBILITY_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Apply only saved filters before enabling the initial feed request.
  useEffect(() => {
    if (defaultFiltersApplied || isAuthLoading) return;
    setDefaultFiltersApplied(true);
  }, [defaultFiltersApplied, isAuthLoading]);

  const applyMyCityFilter = useCallback(() => {
    if (!myCity) return;
    updateFilter({ city: myCity });
  }, [myCity, updateFilter]);

  const clearFilters = () => {
    setFilter({ ...EMPTY_FILTER_VALUES });
  };

  const clearFilter = useCallback(
    (key: keyof SavedFilters) => {
      const nextValue = key === "meetType" ? "all" : "";
      updateFilter({ [key]: nextValue } as Partial<SavedFilters>);
    },
    [updateFilter],
  );

  // Persist filters to localStorage whenever the single filter object changes.
  useEffect(() => {
    persistFiltersIfEnabled(filter);
  }, [filter, persistFiltersIfEnabled]);

  // Persist saveFilters flag to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(LS_SAVE_ENABLED_KEY, saveFilters ? "true" : "false");
  }, [saveFilters]);

  const activeFilterEntries = Object.entries(filter).filter(([, value]) =>
    Boolean(value && value !== "all"),
  );
  const hasActiveFilters = activeFilterEntries.length > 0;
  const feedQueryKey = useMemo(() => ["feed", filter] as const, [filter]);

  const {
    data: feedData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: feedQueryKey,
    queryFn: ({ pageParam }) =>
      backend.getFeed(feedFilter, Number(pageParam), MAX_FEED_PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === MAX_FEED_PAGE_SIZE
        ? allPages.length * MAX_FEED_PAGE_SIZE
        : undefined,
    enabled: defaultFiltersApplied,
  });

  useEffect(() => {
    if (!defaultFiltersApplied) return;

    queryClient.setQueryData<InfiniteData<AdvertisementPublic[], number>>(
      feedQueryKey,
      (currentData) => {
        if (!currentData || currentData.pages.length <= 1) return currentData;

        return {
          pages: [currentData.pages[0]],
          pageParams: [currentData.pageParams[0] ?? 0],
        };
      },
    );
  }, [defaultFiltersApplied, feedQueryKey, queryClient]);

  const ads = useMemo(() => {
    const seenAdIds = new Set<string>();
    return (
      feedData?.pages.flat().filter((ad) => {
        if (seenAdIds.has(ad.id)) return false;
        seenAdIds.add(ad.id);
        return true;
      }) ?? []
    );
  }, [feedData]);

  const refreshFirstPage = useCallback(async () => {
    if (!defaultFiltersApplied || refreshingFirstPageRef.current) return;

    refreshingFirstPageRef.current = true;
    setIsRefreshingFirstPage(true);

    try {
      const firstPage = await backend.getFeed(
        feedFilter,
        0,
        MAX_FEED_PAGE_SIZE,
      );
      queryClient.setQueryData<InfiniteData<AdvertisementPublic[], number>>(
        feedQueryKey,
        {
          pages: [firstPage],
          pageParams: [0],
        },
      );
    } finally {
      refreshingFirstPageRef.current = false;
      setIsRefreshingFirstPage(false);
    }
  }, [backend, defaultFiltersApplied, feedFilter, feedQueryKey, queryClient]);

  const handleRefreshClick = useCallback(() => {
    persistFiltersIfEnabled(filter);
    void refreshFirstPage();
  }, [filter, persistFiltersIfEnabled, refreshFirstPage]);

  useEffect(() => {
    if (!defaultFiltersApplied || !isOnFirstPage) return;

    const intervalId = window.setInterval(() => {
      void refreshFirstPage();
    }, FEED_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [defaultFiltersApplied, isOnFirstPage, refreshFirstPage]);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement || !defaultFiltersApplied || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "480px 0px" },
    );

    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, [defaultFiltersApplied, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const scrollToTopAndRefresh = useCallback(() => {
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          type="button"
          className={`btn btn-neutral ${showFilters ? "" : "btn-outline"} gap-2`}
          onClick={() => setShowFilters((v) => !v)}
          data-ocid="feed.filter_toggle"
        >
          <Filter className="w-4 h-4" />
          {t("feed.filters.title")}
          {showFilters ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <button
          type="button"
          className={`btn btn-neutral ${isMyCityFilterActive ? "" : "btn-outline"} gap-2`}
          onClick={applyMyCityFilter}
          disabled={!myCity}
          data-ocid="feed.by_my_city"
        >
          <MapPin className="w-4 h-4" />
          {t("feed.filters.byMyCity")}
        </button>
        <button
          type="button"
          className="btn btn-neutral btn-outline gap-2"
          onClick={handleRefreshClick}
          disabled={!defaultFiltersApplied || isRefreshingFirstPage}
          data-ocid="feed.refetch"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshingFirstPage ? "animate-spin" : ""}`}
          />
          {t("feed.refresh")}
        </button>
        <div
          className="tooltip tooltip-bottom"
          data-tip={t("feed.filters.saveFilters")}
        >
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={saveFilters}
            onChange={(e) => setSaveFilters(e.target.checked)}
            title={t("feed.filters.saveFilters")}
            aria-label={t("feed.filters.saveFilters")}
            data-ocid="feed.save_filters_toggle"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilterEntries.map(([key, value]) => (
            <span key={key} className="badge badge-primary gap-1">
              {key}: {String(value)}
              <button
                type="button"
                onClick={() => clearFilter(key as keyof SavedFilters)}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            className="badge badge-ghost gap-1 cursor-pointer"
            onClick={clearFilters}
          >
            <X className="w-3 h-3" />
            {t("feed.filters.clearAll")}
          </button>
        </div>
      )}

      {showFilters && (
        <div className="card bg-base-200 p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Event type */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="filter-event-type"
              className="block text-sm font-medium"
            >
              {t("feed.filters.eventType")}
            </label>
            <select
              id="filter-event-type"
              className="select select-bordered"
              value={filter.eventType}
              onChange={(e) =>
                updateFilter({ eventType: e.target.value as EventType | "" })
              }
            >
              <option value="">{t("feed.filters.allTypes")}</option>
              {EVENT_TYPES.map((et) => (
                <option key={et.value} value={et.value}>
                  {t(`eventType.${et.value}`)}
                </option>
              ))}
            </select>
          </div>
          {/* Creator sex */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="filter-creator-sex"
              className="block text-sm font-medium"
            >
              {t("feed.filters.creatorSex")}
            </label>
            <select
              id="filter-creator-sex"
              className="select select-bordered"
              value={filter.creatorSex}
              onChange={(e) =>
                updateFilter({ creatorSex: e.target.value as Sex | "" })
              }
            >
              <option value="">{t("feed.filters.any")}</option>
              {SEX_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {t(`sex.${s.value}`)}
                </option>
              ))}
            </select>
          </div>
          {/* Expected companion sex */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="filter-companion-sex"
              className="block text-sm font-medium"
            >
              {t("feed.filters.companionSex")}
            </label>
            <select
              id="filter-companion-sex"
              className="select select-bordered"
              value={filter.companionSex}
              onChange={(e) =>
                updateFilter({
                  companionSex: e.target.value as ExpectedCompanionSex | "",
                })
              }
            >
              <option value="">{t("feed.filters.any")}</option>
              {EXPECTED_COMPANION_SEX_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {t(`companionSex.${s.value}`)}
                </option>
              ))}
            </select>
          </div>
          {/* City */}
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-city" className="block text-sm font-medium">
              {t("feed.filters.city")}
            </label>
            <input
              id="filter-city"
              type="text"
              className="input input-bordered"
              value={filter.city}
              onChange={(e) => updateFilter({ city: e.target.value })}
              placeholder={t("feed.filters.cityPlaceholder")}
            />
          </div>
          {/* Language */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="filter-language"
              className="block text-sm font-medium"
            >
              {t("feed.filters.language")}
            </label>
            <select
              id="filter-language"
              className="select select-bordered"
              value={filter.language}
              onChange={(e) => updateFilter({ language: e.target.value })}
            >
              <option value="">{t("feed.filters.any")}</option>
              {SUPPORTED_LOCALES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName}
                </option>
              ))}
            </select>
          </div>
          {/* Age range — label on its own line above both inputs */}
          <div className="flex flex-col gap-1">
            <label
              className="block text-sm font-medium"
              htmlFor="filter-age-min"
            >
              {t("feed.filters.ageRange")}
            </label>
            <div className="flex gap-2">
              <input
                id="filter-age-min"
                type="number"
                className="input input-bordered w-1/2"
                placeholder={t("feed.filters.ageMin")}
                value={filter.ageMin}
                onChange={(e) => updateFilter({ ageMin: e.target.value })}
                min="13"
                max="120"
              />
              <input
                id="filter-age-max"
                type="number"
                className="input input-bordered w-1/2"
                placeholder={t("feed.filters.ageMax")}
                value={filter.ageMax}
                onChange={(e) => updateFilter({ ageMax: e.target.value })}
                min="13"
                max="120"
              />
            </div>
          </div>
          {/* Sort */}
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-sort" className="block text-sm font-medium">
              {t("feed.filters.sort")}
            </label>
            <select
              id="filter-sort"
              className="select select-bordered"
              value={filter.sortBy}
              onChange={(e) =>
                updateFilter({ sortBy: e.target.value as SortBy | "" })
              }
            >
              <option value="">{t("feed.filters.defaultSort")}</option>
              <option value={SortBy.newest}>
                {t("feed.sortOptions.newest")}
              </option>
              <option value={SortBy.oldest}>
                {t("feed.sortOptions.oldest")}
              </option>
              <option value={SortBy.city}>
                {t("feed.sortOptions.cityRelevance")}
              </option>
              <option value={SortBy.eventType}>
                {t("feed.sortOptions.eventType")}
              </option>
            </select>
          </div>
          {/* Meet Type */}
          <div className="flex flex-col gap-1">
            <span className="block text-sm font-medium">
              {t("meetType.label")}
            </span>
            <div className="flex flex-wrap gap-4 pt-1">
              {(["all", "inPerson", "online"] as const).map((val) => (
                <label
                  key={val}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    className="radio radio-sm"
                    name="filter-meet-type"
                    value={val}
                    checked={filter.meetType === val}
                    onChange={() => updateFilter({ meetType: val })}
                    data-ocid={`feed.filters.meet_type_${val}_radio`}
                  />
                  <span className="label-text">
                    {val === "all" ? t("meetType.all") : t(`meetType.${val}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>
          {/* Save filters checkbox — spans full width */}
          <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-3 pt-2 border-t border-base-300">
            <input
              id="filter-save"
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={saveFilters}
              onChange={(e) => setSaveFilters(e.target.checked)}
              title={t("feed.filters.saveFilters")}
              aria-label={t("feed.filters.saveFilters")}
              data-ocid="feed.filters.save_checkbox"
            />
            <label
              htmlFor="filter-save"
              className="text-sm cursor-pointer select-none"
            >
              {t("feed.filters.saveFilters")}
            </label>
          </div>
        </div>
      )}

      {!defaultFiltersApplied || isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="alert alert-error">
          <span>{t("common.error")}</span>
        </div>
      ) : ads.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-base-content/50"
          data-ocid="feed.empty_state"
        >
          <Search className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-medium">{t("feed.noAds")}</p>
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-neutral btn-outline mt-4"
              onClick={clearFilters}
            >
              {t("feed.filters.clearAll")}
            </button>
          )}
        </div>
      ) : (
        <>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="feed.ad_grid"
          >
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
          {hasNextPage && (
            <div
              ref={loadMoreRef}
              className="h-10"
              aria-hidden="true"
              data-ocid="feed.load_more_sentinel"
            />
          )}
          {isFetchingNextPage && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                <SkeletonCard key={i} />
              ))}
            </div>
          )}
        </>
      )}
      {showScrollTop && (
        <button
          type="button"
          className="btn btn-neutral btn-circle fixed bottom-6 right-6 z-40 shadow-lg"
          onClick={scrollToTopAndRefresh}
          aria-label={t("feed.scrollToTop")}
          data-ocid="feed.scroll_to_top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
