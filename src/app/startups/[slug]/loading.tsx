import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  rounded = "rounded-full",
}: {
  className: string;
  rounded?: string;
}) {
  return (
    <div
      className={cn("skeleton-shimmer bg-muted", rounded, className)}
      aria-hidden="true"
    />
  );
}

function ForkIdeaSkeleton() {
  return (
    <div className="min-h-[300px] rounded-lg border border-border/80 bg-card p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-2 w-20" />
          <Skeleton className="mt-3 h-5 w-2/3" />
        </div>
        <Skeleton className="h-7 w-12" />
      </div>
      <Skeleton className="mt-4 h-6 w-3/5" />

      <div className="mt-6 space-y-2.5">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-[94%]" />
        <Skeleton className="h-2.5 w-3/4" />
      </div>

      <div className="mt-6 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <div>
          <Skeleton className="h-2 w-20" />
          <Skeleton className="mt-3 h-3 w-4/5" />
          <Skeleton className="mt-2 h-3 w-3/5" />
        </div>
        <div>
          <Skeleton className="h-2 w-16" />
          <Skeleton className="mt-3 h-8 w-28" rounded="rounded-md" />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <Skeleton className="h-2.5 w-28" />
        <Skeleton className="size-4" />
      </div>
    </div>
  );
}

export default function StartupDetailLoading() {
  return (
    <main
      className="min-h-screen bg-background text-foreground"
      aria-busy="true"
    >
      <span className="sr-only" role="status">
        Loading startup details…
      </span>

      <nav className="animate-page-enter flex items-center justify-between border-b border-border px-6 py-5">
        <div className="flex items-center gap-5">
          <Link href="/" className="font-mono text-[15px] font-medium">
            fork<span className="text-muted-foreground">itt</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground"
          >
            <ArrowLeft className="size-3" aria-hidden="true" />
            back
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/startups" className="text-[13px] text-muted-foreground">
            startups
          </Link>
          <Link
            href="/#suggest"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 font-mono text-xs",
            )}
          >
            suggest
            <ExternalLink className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </nav>

      <section className="animate-page-enter motion-delay-1 grid border-b border-border lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="px-6 py-10 md:py-14">
          <div className="flex gap-2">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-24" />
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            <div className="flex items-center gap-4">
              <Skeleton
                className="hidden size-16 sm:block"
                rounded="rounded-lg"
              />
              <Skeleton className="h-12 w-56 md:h-20 md:w-80" rounded="rounded-md" />
            </div>
            <Skeleton className="h-8 w-28 md:mb-2 md:h-11 md:w-36" />
          </div>

          <div className="mt-6 max-w-2xl space-y-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[88%]" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>

        <aside className="border-t border-border px-8 py-10 lg:border-l lg:border-t-0 lg:px-10 lg:py-12">
          <Skeleton className="h-2.5 w-24" />
          <div className="mt-6 space-y-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[92%]" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <div className="mt-7 border-t border-border pt-5">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="mt-3 h-3 w-24" />
          </div>
        </aside>
      </section>

      <section className="animate-page-enter motion-delay-2 grid border-b border-border md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className={cn(
              "border-b border-border p-7 md:border-b-0",
              index < 2 && "md:border-r",
            )}
          >
            <Skeleton className="size-12" rounded="rounded-md" />
            <Skeleton className="mt-5 h-2.5 w-24" />
            <div className="mt-4 space-y-2.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-[82%]" />
            </div>
          </div>
        ))}
      </section>

      <section className="animate-page-enter motion-delay-3 grid border-b border-border lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-b border-border px-6 py-8 lg:border-b-0 lg:border-r">
          <Skeleton className="h-2.5 w-24" />
          <div className="mt-5 border-l border-foreground/40 pl-4">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="mt-4 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-3/4" />
            <div className="mt-5 flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-8">
            <Skeleton className="h-2.5 w-20" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="size-4 shrink-0" />
                  <Skeleton
                    className={cn("h-3", index % 2 ? "w-3/5" : "w-4/5")}
                  />
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="px-6 py-8">
          <div className="mb-5">
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="mt-3 h-6 w-80 max-w-full" />
          </div>

          <div className="mb-4 grid gap-4 rounded-lg border border-border bg-secondary/50 p-5 md:grid-cols-[minmax(0,1fr)_240px]">
            <div>
              <Skeleton className="h-2 w-36" />
              <Skeleton className="mt-3 h-6 w-3/5" />
              <Skeleton className="mt-4 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-4/5" />
            </div>
            <div className="border-t border-border pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
              <Skeleton className="h-2 w-20" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-3/4" />
              <Skeleton className="mt-4 h-8 w-28" rounded="rounded-md" />
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <ForkIdeaSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
