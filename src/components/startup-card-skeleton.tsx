import { cn } from "@/lib/utils";

type StartupCardSkeletonProps = {
  className?: string;
};

function SkeletonLine({ className }: { className: string }) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-full bg-muted", className)}
      aria-hidden="true"
    />
  );
}

export function StartupCardSkeleton({
  className,
}: StartupCardSkeletonProps) {
  return (
    <div
      className={cn(
        "min-h-[267px] rounded-lg border border-border/80 bg-card p-5",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="skeleton-shimmer size-9 shrink-0 rounded-md bg-muted" />
          <div className="min-w-0 pt-0.5">
            <SkeletonLine className="h-2 w-14" />
            <SkeletonLine className="mt-3 h-5 w-28" />
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <SkeletonLine className="h-3 w-14" />
          <SkeletonLine className="mt-2 h-5 w-16" />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <SkeletonLine className="h-2.5 w-full" />
        <SkeletonLine className="h-2.5 w-[92%]" />
        <SkeletonLine className="h-2.5 w-[68%]" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 border-t border-border/80 pt-4">
        <div>
          <SkeletonLine className="h-2 w-14" />
          <SkeletonLine className="mt-3 h-3 w-20" />
        </div>
        <div>
          <SkeletonLine className="h-2 w-12" />
          <SkeletonLine className="mt-3 h-3 w-24" />
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <SkeletonLine className="h-2.5 w-20" />
        <SkeletonLine className="h-2.5 w-24" />
      </div>
    </div>
  );
}

export function StartupGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid gap-3 lg:grid-cols-2"
      role="status"
      aria-label="Loading startups"
    >
      <span className="sr-only">Loading startups…</span>
      {Array.from({ length: count }, (_, index) => (
        <StartupCardSkeleton key={index} className="animate-enter" />
      ))}
    </div>
  );
}
