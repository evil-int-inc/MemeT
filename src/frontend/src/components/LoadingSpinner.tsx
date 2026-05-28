interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
};

export default function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  return (
    <span
      className={`loading loading-infinity text-primary ${sizeMap[size]}`}
      role="status"
      aria-label="Loading"
    />
  );
}
