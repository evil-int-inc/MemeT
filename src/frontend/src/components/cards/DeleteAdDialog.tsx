import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeleteAdDialogProps {
  adName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function DeleteAdDialog({
  adName,
  onConfirm,
  onCancel,
  isPending,
}: DeleteAdDialogProps) {
  const { t } = useTranslation();

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{t("myAds.deleteModal.title")}</h3>
        <p className="py-4">{t("myAds.deleteModal.message", { name: adName })}</p>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={isPending}
            data-ocid="my-ads.delete_modal.cancel_button"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={onConfirm}
            disabled={isPending}
            data-ocid="my-ads.delete_modal.confirm_button"
          >
            {isPending ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {t("common.delete")}
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={onCancel}
        onKeyDown={(e) => e.key === "Escape" && onCancel()}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      />
    </div>
  );
}

export default DeleteAdDialog;
