import { AppCard, AppCardBody, AppCardTitle } from "@/components/cards/AppCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/services/backend";
import { getProfileAvatarUrl } from "@/utils/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Globe, Heart, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

function calcAge(dob: bigint | number | null | undefined): number | null {
  if (dob == null) return null;
  return Math.floor(
    (Date.now() - Number(dob)) / (365.25 * 24 * 60 * 60 * 1000),
  );
}

export default function PublicProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { principal } = useParams({ strict: false }) as { principal: string };
  const backend = useBackend();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["publicProfile", principal],
    queryFn: () => backend.getPublicProfile(principal),
    enabled: !!principal,
  });

  const { isAuthenticated, identity } = useAuth();
  const queryClient = useQueryClient();

  const profilePrincipal = profile?.principal;

  const { data: isProfileLiked } = useQuery({
    queryKey: [
      "profileLike",
      profilePrincipal?.toText() ?? "",
      isAuthenticated,
    ],
    queryFn: () => backend.isProfileLikedByMe(profilePrincipal!),
    enabled: isAuthenticated && !!profilePrincipal,
  });
  const { data: profileLikeCount = 0 } = useQuery({
    queryKey: ["profileLikeCount", profilePrincipal?.toText() ?? ""],
    queryFn: () => backend.getProfileLikeCount(profilePrincipal!),
    enabled: !!profilePrincipal,
  });
  const { data: hasJoinRelationship } = useQuery({
    queryKey: [
      "hasJoinRequestRelationship",
      identity?.getPrincipal().toText() ?? "",
      profilePrincipal?.toText() ?? "",
    ],
    queryFn: () =>
      backend.hasJoinRequestRelationship(
        identity!.getPrincipal(),
        profilePrincipal!,
      ),
    enabled: isAuthenticated && !!identity && !!profilePrincipal,
  });

  const showContactsDueToJoinRequest = hasJoinRelationship === true;

  const { data: contactProfile } = useQuery({
    queryKey: [
      "publicProfileWithContact",
      principal,
      showContactsDueToJoinRequest,
    ],
    queryFn: () => backend.getPublicProfileWithContact(principal),
    enabled: showContactsDueToJoinRequest,
  });

  const profileLikeMutation = useMutation({
    mutationFn: async () => {
      if (!profilePrincipal) return;
      if (isProfileLiked) {
        await backend.removeProfileLike(profilePrincipal);
      } else {
        await backend.addProfileLike(profilePrincipal);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileLike", profilePrincipal?.toText()],
      });
      queryClient.invalidateQueries({
        queryKey: ["profileLikeCount", profilePrincipal?.toText()],
      });
    },
  });

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/" });
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="public_profile.loading_state"
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        data-ocid="public_profile.not_found_state"
      >
        <div className="text-6xl">😕</div>
        <h2 className="text-2xl font-bold">{t("profile.publicNotFound")}</h2>
        <p className="text-base-content/60">
          {t("profile.publicNotFoundHint")}
        </p>
        <button
          type="button"
          className="btn btn-neutral"
          onClick={handleBack}
          data-ocid="public_profile.back_button"
        >
          <ArrowLeft size={16} />
          {t("common.back")}
        </button>
      </div>
    );
  }

  const avatarUrl = getProfileAvatarUrl(profile);
  const age = calcAge(profile.dateOfBirth);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <button
        type="button"
        className="btn btn-neutral btn-sm gap-2"
        onClick={handleBack}
        data-ocid="public_profile.back_button"
      >
        <ArrowLeft size={16} />
        {t("common.back")}
      </button>

      {/* Profile header card */}
      <AppCard
        className="shadow-lg"
        data-ocid="public_profile.card"
      >
        <AppCardBody className="gap-5">
          <h1 className="text-xl font-bold">{t("profile.publicTitle")}</h1>

          {/* Avatar + name row */}
          <div className="flex gap-5 items-start">
            <div className="avatar flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-base-300 overflow-hidden ring ring-primary ring-offset-2">
                <img
                  src={avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <p className="font-bold text-2xl break-words">
                {profile.fullName}
              </p>
              {profile.username && (
                <p className="text-base-content/60 text-sm">
                  @{profile.username}
                </p>
              )}

              {/* Sex badge + Bio */}
              <div className="flex flex-wrap gap-2 pt-1">
                {profile.sex && (
                  <Badge variant="outline">
                    {t(`sex.${profile.sex}`)}
                  </Badge>
                )}
              </div>
              {profile.bio && (
                <div className="pt-1">
                  <p className="text-base-content/80 whitespace-pre-wrap text-sm">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Like button */}
              <div className="flex items-center gap-1 mt-2">
                <button
                  type="button"
                  className={`btn btn-neutral btn-sm btn-square${!isAuthenticated ? " opacity-50" : ""}`}
                  onClick={() => {
                    if (isAuthenticated) profileLikeMutation.mutate();
                  }}
                  disabled={!isAuthenticated || profileLikeMutation.isPending}
                  title={
                    isProfileLiked
                      ? t("likes.unlikeButton")
                      : t("likes.likeButton")
                  }
                  data-ocid="public_profile.like_button"
                >
                  {profileLikeMutation.isPending ? (
                    <LoadingSpinner size="xs" />
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
              <div className="flex flex-wrap gap-2 pt-1">
                {age !== null && (
                  <Badge variant="outline">
                    {age} {t("common.yearsOld")}
                  </Badge>
                )}
                {profile.city && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin size={10} />
                    {profile.city}
                  </Badge>
                )}
                {profile.hideContactsInAds && (
                  <Badge variant="accent" className="gap-1">
                    <Globe size={10} />
                    {t("profile.hideContactsInAds")}
                  </Badge>
                )}
                {profile.language && (
                  <Badge variant="outline">
                    {profile.language}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Contacts section — visible when viewer has a join request relationship */}
          {showContactsDueToJoinRequest && contactProfile && (
            <div
              className="pt-2 space-y-1"
              data-ocid="public_profile.contacts_section"
            >
              <h3 className="text-sm font-semibold text-base-content/70">
                {t("profile.contacts")}
              </h3>
              <div className="flex flex-col gap-1 text-sm">
                {contactProfile.phoneNumber && (
                  <span>📞 {contactProfile.phoneNumber}</span>
                )}
                {contactProfile.telegram && (
                  <span>✈️ {contactProfile.telegram}</span>
                )}
                {contactProfile.instagram && (
                  <span>📸 {contactProfile.instagram}</span>
                )}
              </div>
            </div>
          )}

          {/* Photo thumbnails */}
          {profile.photos && profile.photos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.photos.map((photo, idx) => (
                <div
                  key={`${String(photo.size)}-${photo.contentType}-${String(photo.createdAt)}`}
                  className="w-14 h-14 rounded-lg overflow-hidden shrink-0"
                  data-ocid={`public_profile.thumbnail.${idx + 1}`}
                >
                  <img
                    src={photo.blob.getDirectURL()}
                    alt={`${profile.fullName} ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </AppCardBody>
      </AppCard>

      {/* Extra photos grid */}
      {profile.photos && profile.photos.length > 1 && (
        <AppCard
          className="shadow-sm"
          data-ocid="public_profile.photos_section"
        >
          <AppCardBody className="gap-3">
            <AppCardTitle className="text-base">{t("profile.photos")}</AppCardTitle>
            <div className="grid grid-cols-3 gap-2">
              {profile.photos.map((photo, idx) => (
                <div
                  key={`${String(photo.size)}-${photo.contentType}-${String(photo.createdAt)}`}
                  className="aspect-square rounded-lg overflow-hidden"
                  data-ocid={`public_profile.photo.${idx + 1}`}
                >
                  <img
                    src={photo.blob.getDirectURL()}
                    alt={`${profile.fullName} ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </AppCardBody>
        </AppCard>
      )}
    </div>
  );
}
