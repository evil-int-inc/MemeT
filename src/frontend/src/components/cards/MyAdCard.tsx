import { AdStatus, PaymentStatus } from "@/backend";
import type { Advertisement } from "@/backend";
import { AppCard, AppCardActions, AppCardBody, AppCardTitle } from "@/components/cards/AppCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import i18n from "@/i18n";
import { EventTypeIcon } from "@/utils/eventTypeIcon";
import { useNavigate } from "@tanstack/react-router";
import { CreditCard, Edit, Eye, Trash2, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

import AdStatusBadge from "./AdStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface MyAdCardProps {
  ad: Advertisement;
  onDeleteRequest: (ad: Advertisement) => void;
  isRetrying: boolean;
  onRetryPayment: (ad: Advertisement) => void;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function MyAdCard({
  ad,
  onDeleteRequest,
  isRetrying,
  onRetryPayment,
}: MyAdCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const statusKind = ad.status;
  const paymentKind = ad.paymentStatus;
  const canRetry =
    statusKind === AdStatus.pending_payment ||
    paymentKind === PaymentStatus.failed;
  const isDeleted = statusKind === AdStatus.deleted;
  const eventTypeLabel = t(`eventType.${ad.eventType}`);
  const locationLabel = ad.isVirtual
    ? t("common.virtual")
    : (ad.city ?? t("common.noCity"));
  const howPaysLabel = t(`createAd.howPays.${ad.howPaysForEvent}`);

  return (
    <AppCard
      className="shadow-sm border border-base-200 hover:shadow-md transition-shadow duration-200"
      data-ocid={`my-ads.ad_card.${ad.id}`}
    >
      <AppCardBody className="gap-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <AppCardTitle as="h3" className="text-base font-semibold truncate max-w-xs">
            {ad.eventName}
          </AppCardTitle>
          <div className="flex gap-1.5 flex-wrap">
            <AdStatusBadge status={ad.status} />
            <PaymentStatusBadge paymentStatus={ad.paymentStatus} />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge
            variant="outline"
            size="sm"
            className="gap-1"
            title={`${t("createAd.eventType")}: ${eventTypeLabel}`}
          >
            <EventTypeIcon eventType={ad.eventType} className="w-3 h-3" />
            {eventTypeLabel}
          </Badge>
          <Badge
            variant="outline"
            size="sm"
            title={
              ad.isVirtual
                ? `${t("meetType.label")}: ${t("meetType.online")}`
                : `${t("createAd.city")}: ${locationLabel}`
            }
          >
            {locationLabel}
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

        <p className="text-xs text-base-content/60">
          {t("myAds.createdAt", { date: formatDate(ad.createdAt) })}
        </p>

        {!isDeleted && (
          <AppCardActions className="justify-end mt-1 flex-wrap gap-2">
            {statusKind === AdStatus.draft && (
              <>
                <button
                  type="button"
                  className="btn btn-xs btn-neutral btn-outline gap-1"
                  onClick={() =>
                    navigate({ to: "/create-ad", search: { edit: ad.id } })
                  }
                  data-ocid={`my-ads.edit_button.${ad.id}`}
                >
                  <Edit className="w-3 h-3" />
                  {t("common.edit")}
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-outline btn-error gap-1"
                  onClick={() => onDeleteRequest(ad)}
                  data-ocid={`my-ads.delete_button.${ad.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                  {t("common.delete")}
                </button>
              </>
            )}

            {canRetry && (
              <button
                type="button"
                className="btn btn-xs btn-neutral gap-1"
                onClick={() => onRetryPayment(ad)}
                disabled={isRetrying}
                data-ocid={`my-ads.retry_payment_button.${ad.id}`}
              >
                {isRetrying ? (
                  <LoadingSpinner size="xs" />
                ) : (
                  <CreditCard className="w-3 h-3" />
                )}
                {t("myAds.retryPayment")}
              </button>
            )}

            {statusKind === AdStatus.published && (
              <>
                <button
                  type="button"
                  className="btn btn-xs btn-outline gap-1"
                  onClick={() => navigate({ to: `/ad/${ad.id}` })}
                  data-ocid={`my-ads.view_button.${ad.id}`}
                >
                  <Eye className="w-3 h-3" />
                  {t("common.view")}
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-outline btn-error gap-1"
                  onClick={() => onDeleteRequest(ad)}
                  data-ocid={`my-ads.delete_button.${ad.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                  {t("common.delete")}
                </button>
              </>
            )}
          </AppCardActions>
        )}

        {isDeleted && (
          <p className="text-xs text-base-content/40 italic mt-1">
            {t("adStatus.deleted")}
          </p>
        )}
      </AppCardBody>
    </AppCard>
  );
}

export default MyAdCard;
