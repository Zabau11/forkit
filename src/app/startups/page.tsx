import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Layers3 } from "lucide-react";

import { StartupBrowser } from "@/components/startup-browser";
import { SubmitStartupForm } from "@/components/submit-startup-form";
import { buttonVariants } from "@/components/ui/button";
import {
  getLandingPageData,
  normalizeCategory,
  normalizeSearchQuery,
  normalizeStartupSort,
} from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Startup library | forkit",
  description:
    "Browse startup patterns and vertical fork ideas for solo founders.",
};

type StartupsPageProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
  }>;
};

export default async function StartupsPage({
  searchParams,
}: StartupsPageProps) {
  const params = await searchParams;
  const activeCategory = normalizeCategory(params.category);
  const activeQuery = normalizeSearchQuery(params.q);
  const activeSort = normalizeStartupSort(params.sort);
  const data = await getLandingPageData({
    category: activeCategory,
    query: activeQuery,
    sort: activeSort,
  });

  const stats = [
    {
      value: String(data.stats.startupCount),
      label: "startups",
    },
    {
      value: String(data.stats.forkIdeaCount),
      label: "fork ideas",
    },
    {
      value: data.stats.newDropCadence ?? "weekly",
      label: "new drops",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="flex items-center justify-between border-b border-border px-6 py-5">
        <div className="flex items-center gap-5">
          <Link href="/" className="font-mono text-[15px] font-medium">
            fork<span className="text-muted-foreground">it</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
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

      <section className="grid border-b border-border lg:grid-cols-[minmax(0,1fr)_360px]">
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
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-border pt-4">
                <div className="text-[32px] font-medium leading-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="px-6 py-6">
        {data.error ? (
          <div className="mb-3 rounded-lg border border-border bg-secondary px-4 py-3 text-xs text-muted-foreground">
            {data.error}
          </div>
        ) : null}

        <StartupBrowser
          startups={data.startups}
          activeCategory={activeCategory}
          activeQuery={activeQuery}
          activeSort={activeSort}
          actionPath="/startups"
          browsePath="/startups"
          heading="all startups"
        />
      </section>

      <section className="flex flex-col gap-4 border-t border-border px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium">Want another startup?</div>
          <div className="mt-1 text-xs leading-6 text-muted-foreground">
            Drop the name and it can go into the next generation batch.
          </div>
        </div>
        <SubmitStartupForm />
      </section>
    </main>
  );
}
