import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/services/backend";
import { getProfileAvatarUrl } from "@/utils/avatar";
import { EventTypeIcon } from "@/utils/eventTypeIcon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  AtSign,
  Calendar,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Trash2,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// ─── helpers ────────────────────────────────────────────────────────────────

// Enums from backend.d.ts are plain string enums — just return the value
function enumLabel(val: string): string {
  return val;
}

function formatDate(ns: bigint): string {
  return new Date(Number(ns / 1_000_000n)).toLocaleDateString();
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

// ─── sub-components ─────────────────────────────────────────────────────────

function AdDetailSkeleton() {
  return (
    <div
      className="animate-pulse space-y-4 p-6"
      data-ocid="ad_detail.loading_state"
    >
      <div className="h-8 bg-base-300 rounded w-2/3" />
      <div className="h-4 bg-base-300 rounded w-1/3" />
      <div className="h-32 bg-base-300 rounded" />
      <div className="h-24 bg-base-300 rounded" />
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────────────────

export default function AdDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, principal, login } = useAuth();
  const backend = useBackend();

  const [contactVisible, setContactVisible] = useState(false);
  const [contactValue, setContactValue] = useState<{
    phoneNumber?: string;
    telegram?: string;
    instagram?: string;
  } | null>(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeAdPhotoIdx, setActiveAdPhotoIdx] = useState(0);

  // ── fetch ad ──
  const {
    data: ad,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ad", id],
    queryFn: () => backend.getAdById(id),
    enabled: !!id,
  });

  // ── delete mutation ──
  const deleteMutation = useMutation({
    mutationFn: () => backend.deleteAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      navigate({ to: "/my-ads" });
    },
  });

  // ── join requests (owner only) ──
  const { data: joinRequests, isLoading: joinRequestsLoading } = useQuery({
    queryKey: ["joinRequestsForAdWithContacts", id],
    queryFn: () => backend.getJoinRequestsForAdWithContacts(id),
    enabled:
      isAuthenticated && !!ad && principal === ad.creatorPrincipal.toText(),
  });

  // ── profile like ──
  const { data: isProfileLiked } = useQuery({
    queryKey: [
      "profileLike",
      ad?.creatorPrincipal?.toText() ?? "",
      isAuthenticated,
    ],
    queryFn: () => backend.isProfileLikedByMe(ad!.creatorPrincipal),
    enabled: isAuthenticated && !!ad?.creatorPrincipal,
  });
  const { data: profileLikeCount = 0 } = useQuery({
    queryKey: ["profileLikeCount", ad?.creatorPrincipal?.toText() ?? ""],
    queryFn: () => backend.getProfileLikeCount(ad!.creatorPrincipal),
    enabled: !!ad?.creatorPrincipal,
  });
  const profileLikeMutation = useMutation({
    mutationFn: async () => {
      if (!ad?.creatorPrincipal) return;
      if (isProfileLiked) {
        await backend.removeProfileLike(ad.creatorPrincipal);
      } else {
        await backend.addProfileLike(ad.creatorPrincipal);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileLike", ad?.creatorPrincipal?.toText()],
      });
      queryClient.invalidateQueries({
        queryKey: ["profileLikeCount", ad?.creatorPrincipal?.toText()],
      });
    },
  });

  // ── contact reveal ──
  const handleRevealContact = async () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (contactVisible) {
      setContactVisible(false);
      return;
    }
    if (contactValue) {
      setContactVisible(true);
      return;
    }
    setContactLoading(true);
    setContactError(null);
    try {
      const profileWithContact = await backend.getPublicProfileWithContact(
        ad!.creatorPrincipal.toText(),
      );
      setContactValue({
        phoneNumber: profileWithContact.phoneNumber?.[0],
        telegram: profileWithContact.telegram?.[0],
        instagram: profileWithContact.instagram?.[0],
      });
      setContactVisible(true);
    } catch {
      setContactError(t("adDetail.contactFetchError"));
    } finally {
      setContactLoading(false);
    }
  };

  // ── guards ──
  if (isLoading) return <AdDetailSkeleton />;

  if (isError || !ad) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        data-ocid="ad_detail.error_state"
      >
        <div className="text-6xl">😕</div>
        <h2 className="text-2xl font-bold">{t("adDetail.notFound")}</h2>
        <button
          type="button"
          className="btn btn-neutral"
          onClick={() => navigate({ to: "/" })}
          data-ocid="ad_detail.back_button"
        >
          <ArrowLeft size={16} />
          {t("adDetail.backToFeed")}
        </button>
      </div>
    );
  }

  if (enumLabel(ad.status) !== "published") {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        data-ocid="ad_detail.not_published_state"
      >
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-bold">{t("adDetail.notPublished")}</h2>
        <button
          type="button"
          className="btn btn-neutral"
          onClick={() => navigate({ to: "/" })}
          data-ocid="ad_detail.back_button"
        >
          <ArrowLeft size={16} />
          {t("adDetail.backToFeed")}
        </button>
      </div>
    );
  }

  const isOwner = isAuthenticated && principal === ad.creatorPrincipal.toText();
  const creator = ad.creatorProfile;
  const creatorPhotos = creator?.photos ?? [];
  const avatarUrl = getProfileAvatarUrl(creator);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* ── back button ── */}
      <button
        type="button"
        className="btn btn-ghost btn-sm gap-2"
        onClick={() => navigate({ to: "/" })}
        data-ocid="ad_detail.back_button"
      >
        <ArrowLeft size={16} />
        {t("adDetail.backToFeed")}
      </button>

      {/* ── ad photos gallery ── */}
      {ad.photos && ad.photos.length > 0 && (
        <div
          className="card bg-base-100 shadow-sm"
          data-ocid="ad_detail.photos_gallery"
        >
          <div className="card-body gap-3">
            {ad.photos.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {ad.photos.map((photo, idx) => (
                  <button
                    // biome-ignore lint/suspicious/noArrayIndexKey: photos have no stable unique ID
                    key={idx}
                    type="button"
                    className={`aspect-square rounded-lg overflow-hidden ring-2 transition-all ${
                      activeAdPhotoIdx === idx
                        ? "ring-primary"
                        : "ring-transparent hover:ring-primary/50"
                    }`}
                    onClick={() => setActiveAdPhotoIdx(idx)}
                    data-ocid={`ad_detail.ad_photo.${idx + 1}`}
                  >
                    <img
                      src={photo.blob.getDirectURL()}
                      alt={`${ad.eventName} ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="rounded-xl overflow-hidden">
              <img
                src={ad.photos[activeAdPhotoIdx].blob.getDirectURL()}
                alt={`${ad.eventName} - ${activeAdPhotoIdx + 1}`}
                className="w-full max-h-80 object-contain bg-base-200"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── header card ── */}
      <div className="card bg-base-100 shadow-lg" data-ocid="ad_detail.card">
        <div className="card-body gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h1 className="text-2xl font-bold break-words flex-1">
              {ad.eventName}
            </h1>

            {/* owner controls */}
            {isOwner && (
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  className="btn btn-sm btn-neutral btn-outline gap-1"
                  onClick={() =>
                    navigate({ to: "/create-ad", search: { edit: id } })
                  }
                  data-ocid="ad_detail.edit_button"
                >
                  <Edit size={14} />
                  {t("common.edit")}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline btn-error gap-1"
                  onClick={() => setShowDeleteModal(true)}
                  data-ocid="ad_detail.delete_button"
                >
                  <Trash2 size={14} />
                  {t("common.delete")}
                </button>
              </div>
            )}
          </div>

          {/* badges */}
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-primary badge-lg gap-1">
              <EventTypeIcon eventType={ad.eventType} className="w-3.5 h-3.5" />
              {t(`eventType.${enumLabel(ad.eventType)}`)}
            </span>
            {ad.meetType === "online" ? (
              <span className="badge badge-accent badge-lg gap-1">
                <Globe size={12} />
                {t("meetType.online")}
              </span>
            ) : (
              <>
                {ad.city && (
                  <span className="badge badge-secondary badge-lg gap-1">
                    <MapPin size={12} />
                    {ad.city}
                  </span>
                )}
                {ad.address && (
                  <span className="badge badge-secondary badge-lg gap-1">
                    <MapPin size={12} />
                    {ad.address}
                  </span>
                )}
              </>
            )}
            <span className="badge badge-outline badge-lg gap-1">
              <Users size={12} />
              {t(`companionSex.${enumLabel(ad.expectedCompanionSex)}`)}
            </span>
            <span className="badge badge-outline badge-lg gap-1">
              <Wallet size={12} />
              {t(`createAd.howPays.${ad.howPaysForEvent}`)}
            </span>
          </div>

          {/* dates */}
          {ad.publishedAt && (
            <div className="text-sm text-base-content/60 flex items-center gap-1">
              <Calendar size={14} />
              {t("adDetail.publishedAt")}: {formatDate(ad.publishedAt)}
            </div>
          )}
        </div>
      </div>

      {/* ── description ── */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-lg">{t("adDetail.description")}</h2>
          <p className="whitespace-pre-wrap text-base-content/80">
            {ad.description}
          </p>
        </div>
      </div>

      {/* ── link preview ── */}
      {ad.eventLink && (
        <div
          className="card bg-base-100 shadow-sm"
          data-ocid="ad_detail.link_preview"
        >
          <div className="card-body gap-3">
            <h2 className="card-title text-lg">
              <ExternalLink size={16} />
              {t("adDetail.eventLink")}
            </h2>
            {ad.linkPreview ? (
              <a
                href={ad.eventLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 rounded-xl border border-base-300 hover:border-primary transition-colors overflow-hidden"
              >
                {ad.linkPreview.image && (
                  <img
                    src={ad.linkPreview.image}
                    alt={ad.linkPreview.title ?? ""}
                    className="w-24 h-24 object-cover shrink-0"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div className="p-3 min-w-0">
                  {ad.linkPreview.title && (
                    <p className="font-semibold truncate">
                      {ad.linkPreview.title}
                    </p>
                  )}
                  {ad.linkPreview.description && (
                    <p className="text-sm text-base-content/60 line-clamp-2">
                      {ad.linkPreview.description}
                    </p>
                  )}
                  {ad.linkPreview.domain && (
                    <p className="text-xs text-base-content/40 mt-1">
                      {ad.linkPreview.domain}
                    </p>
                  )}
                </div>
              </a>
            ) : (
              <a
                href={ad.eventLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline break-all"
              >
                <ExternalLink size={14} />
                {extractDomain(ad.eventLink)}
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── creator card ── */}
      {creator && (
        <div
          className="card bg-base-100 shadow-sm"
          data-ocid="ad_detail.creator_card"
        >
          <div className="card-body gap-4">
            <h2 className="card-title text-lg">
              <User size={16} />
              {t("adDetail.aboutCreator")}
            </h2>

            <div className="flex gap-4 items-start">
              {/* avatar */}
              <img
                src={avatarUrl}
                alt={creator.fullName}
                className="w-20 h-20 rounded-full object-cover shrink-0 ring ring-primary ring-offset-2"
                loading="lazy"
              />

              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-bold text-lg break-words">
                  {creator.fullName}
                </p>

                {/* Sex badge */}
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-outline">
                    {t(`sex.${enumLabel(creator.sex)}`)}
                  </span>
                </div>

                {/* Bio right under sex */}
                {creator.bio && (
                  <p className="text-base-content/70 text-sm whitespace-pre-wrap">
                    {creator.bio}
                  </p>
                )}

                {/* Like button */}
                <div className="flex items-center gap-1 mt-2">
                  <button
                    type="button"
                    className={`btn btn-neutral btn-sm btn-square${!isAuthenticated ? " opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => {
                      if (isAuthenticated) profileLikeMutation.mutate();
                    }}
                    disabled={!isAuthenticated || profileLikeMutation.isPending}
                    title={
                      isProfileLiked
                        ? t("likes.unlikeButton")
                        : t("likes.likeButton")
                    }
                    data-ocid="ad_detail.creator_like_button"
                  >
                    {profileLikeMutation.isPending ? (
                      <span className="loading loading-infinity loading-xs" />
                    ) : (
                      <Heart
                        size={16}
                        style={isProfileLiked ? { fill: "currentColor" } : {}}
                      />
                    )}
                  </button>
                  <span className="text-sm">{Number(profileLikeCount)}</span>
                </div>

                {/* Other badges */}
                <div className="flex flex-wrap gap-2">
                  {creator.age !== undefined && creator.age !== null && (
                    <span className="badge badge-outline">
                      {Number(creator.age)} {t("common.yearsOld")}
                    </span>
                  )}
                  {creator.city && (
                    <span className="badge badge-outline gap-1">
                      <MapPin size={10} />
                      {creator.city}
                    </span>
                  )}
                  {creator.language && (
                    <span className="badge badge-outline">
                      {creator.language}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Photo thumbnails */}
            {creatorPhotos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {creatorPhotos.map((photo, idx) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: photos have no stable unique ID
                    key={idx}
                    className="w-14 h-14 rounded-lg overflow-hidden shrink-0"
                    data-ocid={`ad_detail.creator_thumbnail.${idx + 1}`}
                  >
                    <img
                      src={photo.blob.getDirectURL()}
                      alt={`${creator.fullName} ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* extra photos grid */}
            {creatorPhotos.length > 1 && (
              <div>
                <p className="text-sm font-medium mb-2">
                  {t("adDetail.photos")}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {creatorPhotos.map((photo, idx) => (
                    <button
                      // biome-ignore lint/suspicious/noArrayIndexKey: photos have no stable unique ID
                      key={idx}
                      type="button"
                      className={`aspect-square rounded-lg overflow-hidden ring-2 transition-all ${
                        activePhotoIdx === idx
                          ? "ring-primary"
                          : "ring-transparent hover:ring-primary/50"
                      }`}
                      onClick={() => setActivePhotoIdx(idx)}
                      data-ocid={`ad_detail.photo.${idx + 1}`}
                    >
                      <img
                        src={photo.blob.getDirectURL()}
                        alt={`${creator.fullName} ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
                {/* lightbox preview */}
                <div className="mt-3 rounded-xl overflow-hidden">
                  <img
                    src={creatorPhotos[activePhotoIdx].blob.getDirectURL()}
                    alt={`${creator.fullName} - ${activePhotoIdx + 1}`}
                    className="w-full max-h-80 object-contain bg-base-200"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* contact reveal */}
            <div className="divider" />
            <div className="space-y-2" data-ocid="ad_detail.contact_section">
              <h3 className="font-semibold flex items-center gap-1">
                <Heart size={14} className="text-primary" />
                {t("adDetail.contact")}
              </h3>

              {creator?.hideContactsInAds === true ? (
                <p className="text-sm opacity-70">
                  {t("adDetail.contactHidden")}
                </p>
              ) : contactVisible && contactValue ? (
                <div className="flex items-start gap-3">
                  <div className="space-y-1">
                    {contactValue.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 opacity-60" />
                        <span className="font-mono text-sm">
                          {contactValue.phoneNumber}
                        </span>
                      </div>
                    )}
                    {contactValue.telegram && (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 opacity-60" />
                        <span className="font-mono text-sm">
                          {contactValue.telegram}
                        </span>
                      </div>
                    )}
                    {contactValue.instagram && (
                      <div className="flex items-center gap-2">
                        <AtSign className="w-4 h-4 opacity-60" />
                        <span className="font-mono text-sm">
                          {contactValue.instagram}
                        </span>
                      </div>
                    )}
                    {!contactValue.phoneNumber &&
                      !contactValue.telegram &&
                      !contactValue.instagram && (
                        <span className="text-sm opacity-70">
                          {t("adDetail.contactUnavailable")}
                        </span>
                      )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs gap-1"
                    onClick={() => setContactVisible(false)}
                    data-ocid="ad_detail.hide_contact_button"
                  >
                    <EyeOff size={14} />
                    {t("adDetail.hide")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {!isAuthenticated && (
                    <p className="text-sm text-base-content/60">
                      {t("adDetail.loginToSeeContact")}
                    </p>
                  )}
                  {contactError && (
                    <p
                      className="text-sm text-error"
                      data-ocid="ad_detail.contact_error"
                    >
                      {contactError}
                    </p>
                  )}
                  <button
                    type="button"
                    className="btn btn-neutral btn-sm gap-2 w-fit"
                    onClick={handleRevealContact}
                    disabled={contactLoading}
                    data-ocid="ad_detail.show_contact_button"
                  >
                    {contactLoading ? (
                      <span className="loading loading-infinity loading-xs" />
                    ) : (
                      <Eye size={14} />
                    )}
                    {isAuthenticated
                      ? t("adDetail.showContact")
                      : t("adDetail.loginToContact")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── interested users (owner only) ── */}
      {isOwner && (
        <div
          className="card bg-base-100 shadow-sm"
          data-ocid="ad_detail.interested_users_section"
        >
          <div className="card-body gap-4">
            <h2 className="card-title text-lg">
              <Users size={16} />
              {t("joinRequests.interestedUsers")}
            </h2>

            {joinRequestsLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-infinity loading-md" />
              </div>
            ) : !joinRequests || joinRequests.length === 0 ? (
              <div className="text-center py-6 text-base-content/50">
                <p>{t("joinRequests.noInterestedUsers")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {joinRequests.map((item, idx) => {
                  const req = item.request;
                  const profile = item.profile;
                  const reqAvatarUrl = getProfileAvatarUrl(profile);
                  const reqAge =
                    profile?.dateOfBirth != null
                      ? Math.floor(
                          (Date.now() - Number(profile.dateOfBirth)) /
                            (365.25 * 24 * 60 * 60 * 1000),
                        )
                      : null;
                  const reqDate = req.createdAt
                    ? new Date(
                        Number(req.createdAt) / 1_000_000,
                      ).toLocaleDateString()
                    : null;
                  const requesterPrincipal = req.requesterPrincipal.toText();
                  const viewRequesterProfile = () =>
                    navigate({
                      to: "/user/$principal",
                      params: { principal: requesterPrincipal },
                    });

                  return (
                    <div
                      key={req.id}
                      className="card bg-base-200 shadow-md"
                      data-ocid={`ad_detail.interested_user.${idx + 1}`}
                    >
                      <div className="card-body p-4 gap-3">
                        <div className="flex gap-3 items-start">
                          <div className="avatar flex-shrink-0">
                            <button
                              type="button"
                              className="w-14 h-14 rounded-full bg-base-300 overflow-hidden cursor-pointer border-0 p-0"
                              onClick={viewRequesterProfile}
                              aria-label={t("feed.viewUser")}
                              data-ocid={`ad_detail.interested_user.${idx + 1}.avatar_button`}
                            >
                              <img
                                src={reqAvatarUrl}
                                alt={profile?.fullName ?? ""}
                                className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                                loading="lazy"
                              />
                            </button>
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="font-semibold text-lg break-words">
                              {profile?.fullName ?? t("common.unknown")}
                            </p>
                            {profile?.bio && (
                              <p className="text-sm text-base-content/70 line-clamp-2">
                                {profile.bio}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {profile?.sex && (
                                <span className="badge badge-outline badge-sm">
                                  {t(`sex.${profile.sex}`)}
                                </span>
                              )}
                              {reqAge != null && (
                                <span className="badge badge-outline badge-sm">
                                  {reqAge} {t("common.yearsOld")}
                                </span>
                              )}
                              {profile?.city && (
                                <span className="badge badge-outline badge-sm gap-1">
                                  <MapPin size={10} />
                                  {profile.city}
                                </span>
                              )}
                            </div>
                            <div className="space-y-0.5 text-sm text-base-content/70">
                              {profile?.phoneNumber && (
                                <div className="flex items-center gap-1">
                                  <Phone size={12} />
                                  {profile.phoneNumber}
                                </div>
                              )}
                              {profile?.telegram && (
                                <div className="flex items-center gap-1">
                                  <Send size={12} />
                                  {profile.telegram}
                                </div>
                              )}
                              {profile?.instagram && (
                                <div className="flex items-center gap-1">
                                  <AtSign size={12} />
                                  {profile.instagram}
                                </div>
                              )}
                            </div>
                            {reqDate && (
                              <div className="flex items-center gap-1 text-xs text-base-content/50">
                                <Calendar size={12} />
                                {t("joinRequests.joinedOn")}: {reqDate}
                              </div>
                            )}
                            <div className="pt-2">
                              <button
                                type="button"
                                className="btn btn-neutral btn-sm gap-2"
                                onClick={viewRequesterProfile}
                                data-ocid={`ad_detail.interested_user.${idx + 1}.view_user_button`}
                              >
                                <User size={14} />
                                {t("feed.viewUser")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── delete modal ── */}
      {showDeleteModal && (
        <dialog
          className="modal modal-open"
          data-ocid="ad_detail.dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteModal(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowDeleteModal(false);
          }}
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {t("adDetail.deleteConfirmTitle")}
            </h3>
            <p className="py-4 text-base-content/70">
              {t("adDetail.deleteConfirmBody")}
            </p>
            {deleteMutation.isError && (
              <p className="text-error text-sm mb-2">
                {t("adDetail.deleteFailed")}
              </p>
            )}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowDeleteModal(false)}
                data-ocid="ad_detail.cancel_button"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                className="btn btn-error gap-2"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                data-ocid="ad_detail.confirm_button"
              >
                {deleteMutation.isPending ? (
                  <span className="loading loading-infinity loading-xs" />
                ) : (
                  <Trash2 size={14} />
                )}
                {t("common.delete")}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
