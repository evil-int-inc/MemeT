import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/services/backend";
import type { FavouriteWithAd } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, MapPin, Star, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function MyFavouritesPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getMyFavourites, removeFromFavourites } = useBackend();
  const queryClient = useQueryClient();

  const { data: favourites = [], isLoading } = useQuery({
    queryKey: ["myFavourites"],
    queryFn: getMyFavourites,
    enabled: isAuthenticated,
  });

  const removeMutation = useMutation({
    mutationFn: removeFromFavourites,
    onSuccess: () => {
      toast.success(t("favourites.removeTooltip"));
      queryClient.invalidateQueries({ queryKey: ["myFavourites"] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    },
    onError: () => {
      toast.error(t("favourites.error"));
    },
  });

  if (!isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Star className="w-8 h-8" />
        {t("favourites.title")}
      </h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-infinity loading-lg" />
        </div>
      ) : favourites.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg opacity-70">{t("favourites.empty")}</p>
          <p className="text-sm opacity-50 mt-1">
            {t("favourites.emptySubtext")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favourites.map((fav: FavouriteWithAd, index: number) => (
            <div
              key={fav.favourite.adId}
              className="card bg-base-100 shadow-xl border border-base-300"
              data-ocid={`favourite.item.${index + 1}`}
            >
              <div className="card-body">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      className="card-title text-xl cursor-pointer hover:underline text-left bg-transparent border-none p-0"
                      onClick={() =>
                        navigate({
                          to: "/ad/$id",
                          params: { id: fav.favourite.adId },
                        })
                      }
                      data-ocid={`favourite.ad_link.${index + 1}`}
                    >
                      {fav.ad?.eventName || t("common.unknown")}
                    </button>
                    <div className="flex flex-wrap gap-2 mt-2 text-sm opacity-70">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {fav.ad?.eventType}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {fav.ad?.isVirtual
                          ? t("common.virtualEvent")
                          : fav.ad?.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {fav.ad?.creatorProfile?.fullName ||
                          t("common.unknown")}
                      </span>
                    </div>
                    {fav.ad?.description && (
                      <p className="mt-2 text-sm opacity-80 line-clamp-2">
                        {fav.ad.description}
                      </p>
                    )}
                    {fav.ad?.publishedAt && (
                      <p className="mt-2 text-xs opacity-50">
                        {new Date(
                          Number(fav.ad.publishedAt),
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-neutral btn-sm gap-1 shrink-0"
                    onClick={() => removeMutation.mutate(fav.favourite.adId)}
                    disabled={removeMutation.isPending}
                    data-ocid={`favourite.remove_button.${index + 1}`}
                    aria-label={t("favourites.removeTooltip")}
                  >
                    {removeMutation.isPending ? (
                      <span className="loading loading-infinity loading-xs" />
                    ) : (
                      <Star className="w-4 h-4" />
                    )}
                    {t("favourites.removeButton")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
