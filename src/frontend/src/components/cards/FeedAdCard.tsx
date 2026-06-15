import type { AdvertisementPublic } from "@/backend";
import { AppCard, AppCardBody } from "@/components/cards/AppCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/services/backend";
import { getProfileAvatarUrl } from "@/utils/avatar";
import { EventTypeIcon } from "@/utils/eventTypeIcon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Globe, Heart, MapPin, Star, Users, Wallet } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function FeedAdCard({ ad }: { ad: AdvertisementPublic }) {
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
  const creatorSexLabel = profile?.sex ? t(`sex.${profile.sex}`) : null;
  const creatorAge =
    profile?.dateOfBirth != null
      ? Math.floor(
          (Date.now() - Number(profile.dateOfBirth)) /
            (365.25 * 24 * 60 * 60 * 1000),
        )
      : null;
  const eventTypeLabel = t(`eventType.${ad.eventType}`);
  const companionSexLabel = t(`companionSex.${ad.expectedCompanionSex}`);
  const howPaysLabel = t(`createAd.howPays.${ad.howPaysForEvent}`);

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
    <AppCard
      className="shadow hover:shadow-lg transition-shadow border border-base-200"
      data-ocid={`feed.ad_card.${ad.id}`}
    >
      <AppCardBody className="p-4 gap-2">
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
              {creatorSexLabel && (
                <Badge
                  variant="ghost"
                  size="xs"
                  title={`${t("profile.sex")}: ${creatorSexLabel}`}
                >
                  {creatorSexLabel}
                </Badge>
              )}
              {creatorAge != null && (
                <Badge
                  variant="ghost"
                  size="xs"
                  title={`${t("profile.age")}: ${creatorAge} ${t("common.yearsOld")}`}
                >
                  {creatorAge}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <h3 className="font-bold text-base leading-tight">{ad.eventName}</h3>
        <div className="flex flex-wrap gap-1">
          <Badge
            variant="default"
            size="sm"
            title={`${t("createAd.eventType")}: ${eventTypeLabel}`}
          >
            <EventTypeIcon eventType={ad.eventType} className="w-3 h-3 mr-1" />
            {eventTypeLabel}
          </Badge>
          {ad.isVirtual ? (
            <Badge
              variant="secondary"
              size="sm"
              title={`${t("meetType.label")}: ${t("meetType.online")}`}
            >
              <Globe className="w-3 h-3 mr-1" />
              {t("common.virtualEvent")}
            </Badge>
          ) : ad.city ? (
            <Badge
              variant="outline"
              size="sm"
              title={`${t("createAd.city")}: ${ad.city}`}
            >
              <MapPin className="w-3 h-3 mr-1" />
              {ad.city}
            </Badge>
          ) : null}
          <Badge
            variant="accent"
            size="sm"
            title={`${t("createAd.expectedCompanionSex")}: ${companionSexLabel}`}
          >
            <Users className="w-3 h-3 mr-1" />
            {companionSexLabel}
          </Badge>
          <Badge
            variant="outline"
            size="sm"
            className="gap-1"
            title={`${t("createAd.howPaysForEvent")}: ${howPaysLabel}`}
          >
            <Wallet className="w-3 h-3" />
            {howPaysLabel}
          </Badge>
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
            <span>{t("adCard.publishedAt")}</span>
            {publishedDate}
          </div>
        )}

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
                  <LoadingSpinner size="xs" />
                ) : (
                  <Star
                    size={16}
                    className={isFav && !isOwner ? "text-warning fill-current" : ""}
                  />
                )}
              </button>
              {favCountLoading ? (
                <LoadingSpinner size="xs" />
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
                  <LoadingSpinner size="xs" />
                ) : (
                  <Heart
                    size={16}
                    className={isLiked ? "text-error fill-current" : ""}
                  />
                )}
              </button>
              {likeCountLoading ? (
                <LoadingSpinner size="xs" />
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
                <LoadingSpinner size="xs" />
              ) : (
                <span className="text-sm text-base-content/70 tabular-nums">
                  {likeCount ?? 0}
                </span>
              )}
            </div>
          )}
        </div>
        {isAuthenticated && !isOwner && (
          <div className="pt-1 flex flex-wrap gap-2">
            {hasRequestLoading ? (
              <button
                type="button"
                className="btn btn-neutral btn-sm w-full"
                disabled
              >
                <LoadingSpinner size="xs" />
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
                  <LoadingSpinner size="xs" />
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
                  <LoadingSpinner size="xs" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
                {t("joinRequests.requestToJoin")}
              </button>
            )}
          </div>
        )}
      </AppCardBody>
    </AppCard>
  );
}

export default FeedAdCard;
