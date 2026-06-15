interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
}

const sizeMap = {
  xs: "loading-xs",
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
};

export default function LoadingSpinner({
  size = "md",
  className = "",
  ariaLabel = "Loading",
}: LoadingSpinnerProps) {
  return (
    <span
      className={`loading loading-infinity text-primary ${sizeMap[size]} ${className}`}
      role="status"
      aria-label={ariaLabel}
    />
  );
}
