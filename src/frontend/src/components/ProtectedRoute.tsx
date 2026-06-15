import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "@tanstack/react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show spinner while auth client is still initializing or logging in.
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[50vh]"
        data-ocid="protected.loading_state"
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Auth fully resolved — synchronously redirect instead of useEffect so
  // TanStack Router never sees a null component output (which triggers Not Found).
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
