import { AdStatus } from "@/backend";
import { Badge } from "@/components/ui/badge";
import type * as React from "react";
import { useTranslation } from "react-i18next";

function AdStatusBadge({ status }: { status: AdStatus }) {
  const { t } = useTranslation();
  const map: Record<string, React.ComponentProps<typeof Badge>["variant"]> = {
    draft: "ghost",
    pending_payment: "warning",
    published: "success",
    rejected: "destructive",
    deleted: "neutral",
  };
  const statusLabel = t(`adStatus.${status}`);

  return (
    <Badge
      variant={map[status] ?? "ghost"}
      size="sm"
      className="font-medium"
      title={`${t("myAds.status")}: ${statusLabel}`}
    >
      {statusLabel}
    </Badge>
  );
}

export default AdStatusBadge;
