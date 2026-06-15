import { useAuth } from "@/hooks/useAuth";
import { AppCard, AppCardBody } from "@/components/cards/AppCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { useBackend } from "@/services/backend";
import { getProfileAvatarUrl } from "@/utils/avatar";
import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function MyLikesPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getMyProfileLikes, getPublicProfile, removeProfileLike } =
    useBackend();
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
        }),
      );
      return profiles.filter((item) => item.profile !== null) as Array<{
        principalStr: string;
        profile: NonNullable<Awaited<ReturnType<typeof getPublicProfile>>>;
      }>;
    },
    enabled: isAuthenticated,
  });

  const unlikeMutation = useMutation({
    mutationFn: (principalStr: string) =>
      removeProfileLike(Principal.fromText(principalStr)),
    onSuccess: () => {
      toast.success(t("likes.unlikeButton"));
      queryClient.invalidateQueries({ queryKey: ["myProfileLikes"] });
      queryClient.invalidateQueries({ queryKey: ["profileLike"] });
      queryClient.invalidateQueries({ queryKey: ["profileLikeCount"] });
    },
    onError: () => {
      toast.error(t("likes.error"));
    },
  });

  if (!isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Heart className="w-8 h-8" />
        {t("likes.pageTitle")}
      </h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : likedProfiles.length === 0 ? (
        <div className="text-center py-12" data-ocid="likes.empty_state">
          <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg opacity-70">{t("likes.empty")}</p>
          <p className="text-sm opacity-50 mt-1">{t("likes.emptySubtext")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {likedProfiles.map(({ principalStr, profile }, index) => {
            const avatarSrc = getProfileAvatarUrl(profile);
            const isPending =
              unlikeMutation.isPending &&
              unlikeMutation.variables === principalStr;

            return (
              <AppCard
                key={principalStr}
                className="shadow border border-base-300"
                data-ocid={`likes.item.${index + 1}`}
              >
                <AppCardBody className="gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarSrc}
                      alt={profile.fullName}
                      className="w-16 h-16 rounded-full object-cover shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-base truncate">
                        {profile.fullName}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profile.sex && (
                          <Badge variant="neutral" size="sm">
                            {profile.sex}
                          </Badge>
                        )}
                        {profile.city && (
                          <Badge
                            variant="outline"
                            size="sm"
                            className="truncate max-w-[120px]"
                          >
                            {profile.city}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-sm opacity-70 line-clamp-3">
                      {profile.bio.length > 100
                        ? `${profile.bio.slice(0, 100)}…`
                        : profile.bio}
                    </p>
                  )}

                  <div className="flex gap-2 mt-auto pt-2">
                    <button
                      type="button"
                      className="btn btn-neutral btn-sm flex-1"
                      onClick={() =>
                        navigate({
                          to: `/user/${principalStr}` as "/user/$principal",
                          params: { principal: principalStr },
                        })
                      }
                      data-ocid={`likes.view_profile.${index + 1}`}
                    >
                      {t("likes.viewProfile")}
                    </button>
                    <button
                      type="button"
                      className="btn btn-neutral btn-sm"
                      onClick={() => unlikeMutation.mutate(principalStr)}
                      disabled={isPending}
                      aria-label={t("likes.unlikeButton")}
                      data-ocid={`likes.remove_button.${index + 1}`}
                    >
                      {isPending ? (
                        <LoadingSpinner size="xs" />
                      ) : (
                        <Heart className="w-4 h-4 fill-current" />
                      )}
                    </button>
                  </div>
                </AppCardBody>
              </AppCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
