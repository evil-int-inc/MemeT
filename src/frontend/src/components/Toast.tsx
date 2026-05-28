import { X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose: () => void;
  duration?: number;
}

const alertClassMap = {
  success: "alert-success",
  error: "alert-error",
  info: "alert-info",
  warning: "alert-warning",
};

export default function Toast({
  type,
  message,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      role="alert"
      className={`alert ${alertClassMap[type]} shadow-lg flex items-center gap-3 min-w-64 max-w-sm`}
      data-ocid="toast"
    >
      <span className="flex-1 text-sm">{message}</span>
      <button
        type="button"
        className="btn btn-ghost btn-xs btn-circle flex-shrink-0"
        onClick={onClose}
        aria-label="Close notification"
        data-ocid="toast.close_button"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
