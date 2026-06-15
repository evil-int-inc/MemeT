import type { ReferralEntry } from "@/backend";
import { AppCard, AppCardBody } from "@/components/cards/AppCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/services/backend";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function formatDate(timestamp: bigint, language: string): string {
  return new Date(Number(timestamp)).toLocaleDateString(language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ReferralCard({
  entry,
  index,
}: { entry: ReferralEntry; index: number }) {
  const { t, i18n } = useTranslation();
  return (
    <AppCard
      className="border border-base-300 shadow-sm"
      data-ocid={`referrals.item.${index + 1}`}
    >
      <AppCardBody className="p-5">
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-12">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">
              {entry.referredPrincipal.toText().slice(0, 14)}…
            </p>
            <p className="text-sm text-base-content/60">
              {t("referrals.referredAt")}:{" "}
              {formatDate(entry.referredAt, i18n.language)}
            </p>
          </div>
        </div>
        <div className="divider my-2" />
        <div className="flex gap-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-base-content/60">
              {t("referrals.adsPublished")}
            </span>
            <span className="font-semibold text-lg">
              {Number(entry.adsPublished)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-base-content/60">
              {t("referrals.earned")}
            </span>
            <span className="font-semibold text-lg text-success">
              {formatCurrency(entry.totalEarned)}
            </span>
          </div>
        </div>
      </AppCardBody>
    </AppCard>
  );
}

export default function MyReferralsPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const backend = useBackend();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myReferrals"],
    queryFn: async () => {
      const result = await backend.getMyReferrals();
      return result;
    },
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="referrals.loading_state"
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="referrals.error_state"
      >
        <div className="alert alert-error max-w-md">
          <span>{t("common.error")}</span>
        </div>
      </div>
    );
  }

  const referrals = data ?? [];

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-2xl"
      data-ocid="referrals.page"
    >
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-bold">{t("referrals.title")}</h1>
      </div>

      {referrals.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 gap-4 text-center"
          data-ocid="referrals.empty_state"
        >
          <Users className="w-16 h-16 text-base-content/20" />
          <p className="text-base-content/60 max-w-sm">
            {t("referrals.empty")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4" data-ocid="referrals.list">
          {referrals.map((entry, idx) => (
            <ReferralCard
              key={entry.referredPrincipal.toText()}
              entry={entry}
              index={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
}
