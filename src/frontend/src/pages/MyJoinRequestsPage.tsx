import { useAuth } from "@/hooks/useAuth";
import { AppCard, AppCardBody } from "@/components/cards/AppCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useBackend } from "@/services/backend";
import type { JoinRequestWithAd } from "@/types";
import { EventTypeIcon } from "@/utils/eventTypeIcon";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Bookmark, MapPin, User, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function MyJoinRequestsPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getMyJoinRequests, cancelJoinRequest } = useBackend();
  const queryClient = useQueryClient();

  const { data: joinRequests = [], isLoading } = useQuery({
    queryKey: ["myJoinRequests"],
    queryFn: getMyJoinRequests,
    enabled: isAuthenticated,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelJoinRequest,
    onSuccess: () => {
      toast.success(t("joinRequests.requestCancelled"));
      queryClient.invalidateQueries({ queryKey: ["myJoinRequests"] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    },
    onError: () => {
      toast.error(t("joinRequests.cancelError"));
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Bookmark className="w-8 h-8" />
        {t("joinRequests.myJoinRequests")}
      </h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : joinRequests.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg opacity-70">
            {t("joinRequests.noMyJoinRequests")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {joinRequests.map((jr: JoinRequestWithAd) => (
            <AppCard
              key={jr.request.id}
              className="shadow-xl border border-base-300"
              data-ocid={`joinRequest.item.${jr.request.id}`}
            >
              <AppCardBody>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <button
                      type="button"
                      className="text-xl font-bold cursor-pointer hover:underline text-left bg-transparent border-none p-0"
                      onClick={() =>
                        navigate({
                          to: "/ad/$id",
                          params: { id: jr.request.adId },
                        })
                      }
                      data-ocid={`joinRequest.ad_link.${jr.request.id}`}
                    >
                      {jr.ad?.eventName || t("common.unknown")}
                    </button>
                    <div className="flex flex-wrap gap-2 mt-2 text-sm opacity-70">
                      <span className="flex items-center gap-1">
                        <EventTypeIcon
                          eventType={jr.ad?.eventType}
                          className="w-4 h-4"
                        />
                        {jr.ad
                          ? t(`eventType.${jr.ad.eventType}`)
                          : t("common.unknown")}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {jr.ad?.isVirtual
                          ? t("common.virtualEvent")
                          : jr.ad?.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {t("joinRequests.joinedOn")}:{" "}
                        {new Date(
                          Number(jr.request.createdAt),
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    {jr.ad?.description && (
                      <p className="mt-2 text-sm opacity-80 line-clamp-2">
                        {jr.ad.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-neutral btn-sm btn-square"
                    onClick={() => cancelMutation.mutate(jr.request.id)}
                    disabled={cancelMutation.isPending}
                    data-ocid={`joinRequest.cancel_button.${jr.request.id}`}
                    aria-label={t("joinRequests.cancelRequest")}
                  >
                    {cancelMutation.isPending ? (
                      <LoadingSpinner size="xs" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </AppCardBody>
            </AppCard>
          ))}
        </div>
      )}
    </div>
  );
}
