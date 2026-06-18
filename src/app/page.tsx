import Link from "next/link";
import { ArrowRight, Building2, ExternalLink } from "lucide-react";

import { StartupBrowser } from "@/components/startup-browser";
import { StartupLogo } from "@/components/startup-logo";
import { SubmitStartupForm } from "@/components/submit-startup-form";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getLandingPageData,
  normalizeCategory,
  normalizeSearchQuery,
  normalizeStartupSort,
} from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
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
  const activeQuery = normalizeSearchQuery(params.q);
  const activeSort = normalizeStartupSort(params.sort);
  const data = await getLandingPageData({
    category: activeCategory,
    query: activeQuery,
    sort: activeSort,
  });
  const featuredStartup = data.startups[0] ?? null;

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
      value: data.stats.newDropCadence ?? "weekly",
      label: "new drops",
    },
  ];

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <nav className="animate-enter absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-border px-6 py-5">
        <Link href="/" className="font-mono text-[15px] font-medium">
          fork<span className="text-muted-foreground">it</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/startups"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            startups
          </Link>
          <Link
            href="/startups"
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

      <section className="flex min-h-screen flex-col justify-center border-b border-border px-6 pb-8 pt-26 md:pt-32">
        <div className="grid w-full items-center gap-8 md:grid-cols-[minmax(0,0.92fr)_minmax(520px,0.72fr)] lg:gap-4">
          <div className="animate-enter motion-delay-1">
            <div className="font-mono text-[13px] uppercase text-muted-foreground">
              for solo founders
            </div>
            <h1 className="animate-enter motion-delay-2 mt-4 text-[44px] font-semibold leading-[1.05] tracking-[-1.5px] md:text-[72px]">
              Their billion-dollar idea,
              <br />
              <em className="font-normal text-muted-foreground">
                your vertical niche.
              </em>
            </h1>
            <p className="animate-enter motion-delay-3 mt-4 max-w-[500px] text-lg leading-[1.8] text-muted-foreground">
              We take VC-backed horizontal startups and find the smaller,
              focused versions a solo founder can actually build and own.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {heroTags.map((tag, index) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn(
                    "animate-enter rounded-full border border-border bg-secondary px-3 py-1 font-mono text-[11px] font-normal text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground",
                    index === 0 && "motion-delay-2",
                    index === 1 && "motion-delay-3",
                    index === 2 && "motion-delay-4",
                    index > 2 && "motion-delay-5",
                  )}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {featuredStartup ? (
            <Link
              href={`/startups/${featuredStartup.slug}`}
              aria-label={`View ${featuredStartup.name} detail page`}
              className="animate-rise motion-delay-3 group hidden w-full self-start -translate-y-8 rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:block"
            >
              <Card className="animate-grid-drift animate-sheen animate-soft-pulse relative min-h-[520px] w-full overflow-hidden gap-0 rounded-lg border-border/80 bg-[linear-gradient(135deg,hsl(var(--card))_0%,hsl(var(--secondary))_100%)] p-10 pt-7 shadow-none transition-all duration-500 before:absolute before:inset-x-0 before:-top-4 before:bottom-0 before:bg-[linear-gradient(to_right,hsl(var(--border)/0.45)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] before:bg-[size:48px_48px] before:opacity-30 after:absolute after:inset-y-[-20%] after:left-0 after:w-1/2 after:bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--primary)_18%,transparent),transparent)] after:content-[''] group-hover:cursor-pointer group-hover:border-foreground/30 group-hover:shadow-[0_22px_80px_-56px_color-mix(in_oklab,var(--ring)_65%,transparent)] xl:p-12 xl:pt-9">
                <CardHeader className="relative gap-7 p-0">
                  <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase text-muted-foreground">
                    <Building2 className="size-3.5" aria-hidden="true" />
                    featured company
                  </div>

                  <div className="flex items-center gap-4">
                    <StartupLogo
                      slug={featuredStartup.slug}
                      name={featuredStartup.name}
                      size="lg"
                      className="bg-background/50"
                    />
                    <CardTitle className="min-w-0 text-[48px] font-semibold leading-none xl:text-[56px]">
                      {featuredStartup.name}
                    </CardTitle>
                  </div>
                  <p className="max-w-[420px] text-base leading-7 text-muted-foreground">
                    {featuredStartup.description}
                  </p>
                </CardHeader>

                <CardContent className="relative p-0 pt-8">
                  <div className="grid border-y border-border/70 sm:grid-cols-2">
                    <div className="border-b border-border/60 py-7 sm:border-b-0 sm:border-r sm:pr-7">
                      <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                        valuation
                      </div>
                      <div className="mt-2 text-[28px] font-medium leading-none">
                        {featuredStartup.amountRaised}
                      </div>
                    </div>
                    <div className="py-7 sm:pl-7">
                      <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                        category
                      </div>
                      <div className="mt-2 text-[28px] font-medium leading-none">
                        {featuredStartup.category.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 space-y-6">
                    <div className="border-b border-border/70 pb-6">
                      <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                        company pattern
                      </div>
                      <p className="mt-2 text-[17px] leading-7">
                        {featuredStartup.pattern ?? featuredStartup.description}
                      </p>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                          signal
                        </div>
                        <p className="mt-2 max-w-[360px] text-sm leading-6 text-muted-foreground">
                          {featuredStartup.roundLabel} in{" "}
                          {featuredStartup.category.toUpperCase()}.
                        </p>
                      </div>
                      <div className="inline-flex shrink-0 items-center gap-2 font-mono text-[11px] text-foreground">
                        open company
                        <ArrowRight
                          className="size-3.5 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="grid border-b border-border sm:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "animate-enter border-b border-border px-6 py-5 sm:border-b-0",
              index !== stats.length - 1 && "sm:border-r",
              index === 0 && "motion-delay-1",
              index === 1 && "motion-delay-2",
              index === 2 && "motion-delay-3",
            )}
          >
            <div className="text-[32px] font-medium leading-tight">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      <section id="startups" className="px-6 py-6">
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
          actionPath="/"
          browsePath="/#startups"
          heading="latest startups"
        />

        <section
          id="suggest"
          className="animate-enter motion-delay-2 mt-6 flex flex-col gap-4 rounded-lg border border-border bg-secondary p-6 transition-colors hover:border-foreground/30 sm:flex-row sm:items-center sm:justify-between"
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
