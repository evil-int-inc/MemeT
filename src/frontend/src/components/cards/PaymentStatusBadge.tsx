import { PaymentStatus } from "@/backend";
import { Badge } from "@/components/ui/badge";
import type * as React from "react";
import { useTranslation } from "react-i18next";

function PaymentStatusBadge({
  paymentStatus,
}: {
  paymentStatus: PaymentStatus;
}) {
  const { t } = useTranslation();
  const map: Record<string, React.ComponentProps<typeof Badge>["variant"]> = {
    unpaid: "ghost",
    pending: "warning",
    paid: "success",
    failed: "destructive",
  };
  const paymentLabel = t(`paymentStatus.${paymentStatus}`);

  return (
    <Badge
      variant={map[paymentStatus] ?? "ghost"}
      size="sm"
      title={`${t("myAds.paymentStatus")}: ${paymentLabel}`}
    >
      {paymentLabel}
    </Badge>
  );
}

export default PaymentStatusBadge;
