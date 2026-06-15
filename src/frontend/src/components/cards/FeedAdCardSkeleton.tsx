import { AppCard } from "@/components/cards/AppCard";
import { Skeleton } from "@/components/ui/skeleton";

function FeedAdCardSkeleton() {
  return (
    <AppCard className="shadow border border-base-200 p-4">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-5 w-3/4 mb-2" />
      <div className="flex gap-1 mb-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </AppCard>
  );
}

export default FeedAdCardSkeleton;
