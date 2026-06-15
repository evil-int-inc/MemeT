import {
  type EventType,
  type ExpectedCompanionSex,
  MeetType,
  type Sex,
  SortBy,
} from "@/backend";
import type { AdvertisementPublic, FeedFilter } from "@/backend";
import { AppCard } from "@/components/cards/AppCard";
import FeedAdCard from "@/components/cards/FeedAdCard";
import FeedAdCardSkeleton from "@/components/cards/FeedAdCardSkeleton";
import { Badge, BadgeButton } from "@/components/ui/badge";
import {
  APP_NAME,
  EVENT_TYPES,
  EXPECTED_COMPANION_SEX_OPTIONS,
  MAX_FEED_PAGE_SIZE,
  SEX_OPTIONS,
  SUPPORTED_LOCALES,
} from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/services/backend";
import { EventTypeIcon } from "@/utils/eventTypeIcon";
import {
  type InfiniteData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LS_FILTERS_KEY = `${APP_NAME}_feed-filters`;
const LS_SAVE_ENABLED_KEY = `${APP_NAME}_save-filters-enabled`;
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
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={saveFilters}
            onChange={(e) => setSaveFilters(e.target.checked)}
            aria-label={t("feed.filters.saveFilters")}
            data-ocid="feed.save_filters_toggle"
          />
          {t("feed.filters.saveFilters")}
        </label>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilterEntries.map(([key, value]) => (
            <Badge key={key} className="gap-1">
              {key}: {String(value)}
              <button
                type="button"
                onClick={() => clearFilter(key as keyof SavedFilters)}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <BadgeButton
            variant="ghost"
            className="gap-1 cursor-pointer"
            onClick={clearFilters}
          >
            <X className="w-3 h-3" />
            {t("feed.filters.clearAll")}
          </BadgeButton>
        </div>
      )}

      {showFilters && (
        <AppCard className="bg-base-200 p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Event type */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="filter-event-type"
              className="block text-sm font-medium"
            >
              {t("feed.filters.eventType")}
            </label>
            <div className="relative">
              <EventTypeIcon
                eventType={filter.eventType}
                className="pointer-events-none absolute left-3 top-1/2 z-10 w-4 h-4 -translate-y-1/2 text-base-content/60"
              />
              <select
                id="filter-event-type"
                className={`select select-bordered w-full ${filter.eventType ? "pl-10" : ""}`}
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
        </AppCard>
      )}

      {!defaultFiltersApplied || isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <FeedAdCardSkeleton key={i} />
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
              <FeedAdCard key={ad.id} ad={ad} />
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
                <FeedAdCardSkeleton key={i} />
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
