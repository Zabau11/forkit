import Link from "next/link";
import { ArrowLeft, ExternalLink, Layers3, Search } from "lucide-react";

import { StartupGridSkeleton } from "@/components/startup-card-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const filterWidths = ["w-9", "w-16", "w-14", "w-[72px]", "w-20"];

export default function StartupsLoading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
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
      </nav>

      <section className="animate-page-enter motion-delay-1 grid border-b border-border lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="px-6 py-10 md:py-14">
          <div className="font-mono text-[13px] uppercase text-muted-foreground">
            startup library
          </div>
          <h1 className="mt-4 max-w-4xl text-[46px] font-semibold leading-[1.04] md:text-[76px]">
            Find a source pattern worth forking.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            Search companies, vertical niches, markets, and generated fork ideas.
            Use this as the working catalog once the landing page gets too small.
          </p>
        </div>

        <aside className="border-t border-border px-6 py-8 lg:border-l lg:border-t-0 lg:px-8 lg:py-10">
          <div className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase text-muted-foreground">
            <Layers3 className="size-3" aria-hidden="true" />
            catalog
          </div>
          <div className="grid gap-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="border-t border-border pt-4">
                <div className="skeleton-shimmer h-8 w-20 rounded-full bg-muted" />
                <div className="skeleton-shimmer mt-2 h-3 w-24 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="animate-page-enter motion-delay-2 px-6 py-6">
        <div className="mb-5 grid gap-4 border-b border-border pb-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <div className="font-mono text-[11px] uppercase text-muted-foreground">
              all startups
            </div>
            <div className="relative mt-2 h-11 rounded-lg border border-input">
              <Search
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="skeleton-shimmer absolute left-9 top-1/2 h-2.5 w-52 -translate-y-1/2 rounded-full bg-muted" />
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap gap-1.5">
              {filterWidths.map((width, index) => (
                <div
                  key={index}
                  className={cn(
                    "skeleton-shimmer h-7 rounded-full border border-border bg-muted",
                    width,
                  )}
                />
              ))}
            </div>
            <div className="flex gap-1.5">
              {["w-14", "w-12", "w-20"].map((width, index) => (
                <div
                  key={index}
                  className={cn(
                    "skeleton-shimmer h-7 rounded-full border border-border bg-muted",
                    width,
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="skeleton-shimmer h-3 w-32 rounded-full bg-muted" />
        </div>

        <StartupGridSkeleton />
      </section>
    </main>
  );
}
