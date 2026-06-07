import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { StartupCard } from "@/components/startup-card";
import { SubmitStartupForm } from "@/components/submit-startup-form";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  categoryFilters,
  getLandingPageData,
  normalizeCategory,
} from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

const heroTags = [
  "bootstrappable",
  "no-code friendly",
  "real revenue",
  "solo founder",
  "niche markets",
];

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const activeCategory = normalizeCategory(params.category);
  const data = await getLandingPageData(activeCategory);

  const stats = [
    {
      value: String(data.stats.startupCount),
      label: "startups covered",
    },
    {
      value: String(data.stats.forkIdeaCount),
      label: "fork ideas",
    },
    {
      value: data.stats.newDropCadence ?? "pending",
      label: "new drops",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="flex items-center justify-between border-b border-border px-6 py-5">
        <Link href="/" className="font-mono text-[15px] font-medium">
          fork<span className="text-muted-foreground">it</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="#startups"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            startups
          </Link>
          <Link
            href="#startups"
            className="hidden text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            all forks
          </Link>
          <Link
            href="#suggest"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 font-mono text-xs",
            )}
          >
            suggest a startup
            <ExternalLink className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </nav>

      <section className="border-b border-border px-6 py-12">
        <div className="font-mono text-[11px] uppercase text-muted-foreground">
          for solo founders
        </div>
        <h1 className="mt-4 max-w-[540px] text-[38px] font-medium leading-[1.15] tracking-normal">
          Their billion-dollar idea,
          <br />
          <em className="font-normal text-muted-foreground">
            your vertical niche.
          </em>
        </h1>
        <p className="mt-4 max-w-[430px] text-sm leading-7 text-muted-foreground">
          We take VC-backed horizontal startups and find the smaller, focused
          versions a solo founder can actually build and own.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {heroTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-full border border-border bg-secondary px-3 py-1 font-mono text-[11px] font-normal text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </section>

      <section className="grid border-b border-border sm:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "border-b border-border px-6 py-5 sm:border-b-0",
              index !== stats.length - 1 && "sm:border-r",
            )}
          >
            <div className="text-[26px] font-medium leading-tight">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      <section id="startups" className="px-6 py-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-mono text-[11px] uppercase text-muted-foreground">
            latest startups
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categoryFilters.map((filter) => (
              <Link
                key={filter}
                href={filter === "all" ? "/" : `/?category=${filter}`}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
                  activeCategory === filter
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                )}
              >
                {filter}
              </Link>
            ))}
          </div>
        </div>

        {data.error ? (
          <div className="mb-3 rounded-lg border border-border bg-secondary px-4 py-3 text-xs text-muted-foreground">
            {data.error}
          </div>
        ) : null}

        <div className="space-y-3">
          {data.startups.map((startup) => (
            <div key={startup.id} id={startup.id}>
              <StartupCard startup={startup} />
            </div>
          ))}
        </div>

        {!data.startups.length ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No startups found for this filter.
          </div>
        ) : null}

        <section
          id="suggest"
          className="mt-6 flex flex-col gap-4 rounded-lg border border-border bg-secondary p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="text-sm font-medium">
              Know a startup we should fork?
            </div>
            <div className="mt-1 text-xs leading-6 text-muted-foreground">
              Drop the name and we'll cover it in an upcoming issue.
            </div>
          </div>
          <SubmitStartupForm />
        </section>
      </section>
    </main>
  );
}
