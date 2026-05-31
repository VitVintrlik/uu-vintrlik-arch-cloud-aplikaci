import { Skeleton } from '../ui/Skeleton';

/** Loading skeleton for the SessionDetail page. */
export const SessionDetailSkeleton = () => (
  <div className="space-y-10 max-w-4xl mx-auto">
    <div className="flex justify-between items-end border-b border-outline-variant/10 pb-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-12 w-40" />
    </div>
    <div className="space-y-6">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  </div>
);
