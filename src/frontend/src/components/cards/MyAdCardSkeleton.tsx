import { AppCard, AppCardBody } from "@/components/cards/AppCard";
import { Skeleton } from "@/components/ui/skeleton";

function MyAdCardSkeleton() {
  return (
    <AppCard className="shadow-sm border border-base-200 animate-pulse">
      <AppCardBody className="gap-3">
        <Skeleton className="h-5 w-2/3 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/3 rounded" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      </AppCardBody>
    </AppCard>
  );
}

export default MyAdCardSkeleton;
