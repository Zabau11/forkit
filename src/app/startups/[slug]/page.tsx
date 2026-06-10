import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  ExternalLink,
  Layers3,
  Route,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getFeaturedStartupDetailBySlug,
  getFeaturedStartupPageSlugs,
  getStartupDetailBySlug,
} from "@/lib/supabase";
import { cn } from "@/lib/utils";

type StartupPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getFeaturedStartupPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: StartupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const startup =
    getFeaturedStartupDetailBySlug(slug) ?? (await getStartupDetailBySlug(slug));

  if (!startup) {
    return {
      title: "Startup not found | forkit",
    };
  }

  return {
    title: `${startup.name} fork ideas | forkit`,
    description: startup.description,
  };
}

export default async function StartupPage({ params }: StartupPageProps) {
  const { slug } = await params;
  const startup =
    getFeaturedStartupDetailBySlug(slug) ?? (await getStartupDetailBySlug(slug));

  if (!startup) {
    notFound();
  }

  const highlights = [
    {
      label: "source pattern",
      value: startup.roundLabel,
      icon: Sparkles,
    },
    {
      label: "best buyer",
      value: startup.targetCustomer,
      icon: Banknote,
    },
    {
      label: "build path",
      value: startup.buildAngle,
      icon: Route,
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
        <div className="flex items-center gap-5">
          <Link
            href="/#startups"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
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

      <section className="grid border-b border-border lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="px-6 py-10 md:py-14">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="rounded-full border border-border bg-secondary px-3 py-1 font-mono text-[11px] font-normal text-muted-foreground"
            >
              {startup.category}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 font-mono text-[11px] font-normal text-muted-foreground"
            >
              {startup.roundLabel}
            </Badge>
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:gap-6">
            <h1 className="max-w-4xl text-[48px] font-semibold leading-[1] md:text-[84px]">
              {startup.name}
            </h1>
            <div className="text-[30px] font-medium leading-none text-muted-foreground/80 md:pb-2 md:text-[44px]">
              {startup.amountRaised}
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            {startup.description}
          </p>
        </div>

        <aside className="border-t border-border px-8 py-10 lg:border-l lg:border-t-0 lg:px-10 lg:py-12">
          <div className="font-mono text-[11px] uppercase text-muted-foreground">
            pattern to fork
          </div>
          <p className="mt-5 text-[15px] leading-[1.8]">{startup.pattern}</p>
          <div className="mt-6 border-t border-border pt-5">
            <div className="font-mono text-[11px] text-muted-foreground">
              {startup.amountRaised}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              backing signal
            </div>
          </div>
        </aside>
      </section>

      <section className="grid border-b border-border md:grid-cols-3">
        {highlights.map((highlight, index) => {
          const Icon = highlight.icon;

          return (
            <div
              key={highlight.label}
              className={cn(
                "border-b border-border p-7 md:border-b-0",
                index !== highlights.length - 1 && "md:border-r",
              )}
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-md border border-border bg-secondary text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[1.5px] text-muted-foreground">
                {highlight.label}
              </div>
              <p className="mt-3 text-[14px] leading-[1.7] text-card-foreground">
                {highlight.value}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid border-b border-border lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="border-b border-border px-6 py-8 lg:border-b-0 lg:border-r">
          <div className="font-mono text-[11px] uppercase text-muted-foreground">
            starter stack
          </div>
          <div className="mt-5 space-y-3">
            {startup.starterStack.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span className="text-sm leading-6">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase text-muted-foreground">
                all fork ideas
              </div>
              <h2 className="mt-2 text-2xl font-semibold leading-tight">
                Pick a niche with repeated, expensive pain.
              </h2>
            </div>
            <div className="hidden items-center gap-2 font-mono text-[11px] text-muted-foreground sm:flex">
              <Layers3 className="size-3" aria-hidden="true" />
              {startup.forkIdeas.length} ideas
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-2">
            {startup.forkIdeas.map((idea) => (
              <Card
                key={idea.id}
                className="min-h-[120px] gap-0 rounded-lg border-border/80 py-0 shadow-none"
              >
                <CardHeader className="gap-3 p-7 pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg font-medium leading-6">
                      {idea.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-normal text-muted-foreground"
                    >
                      {idea.niche}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 p-7 pt-5">
                  <ForkNote label="why" value={idea.whyItWorks} />
                  <ForkNote label="mvp" value={idea.mvp} />
                  <ForkNote label="gtm" value={idea.goToMarket} />
                  <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      pricing
                    </span>
                    <span className="text-right text-sm leading-6">
                      {idea.pricing}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium">Want another startup?</div>
          <div className="mt-1 text-xs leading-6 text-muted-foreground">
            Browse the landing page list or suggest the next one.
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/#startups"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "font-mono text-xs",
            )}
          >
            all startups
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
          <Link
            href="/#suggest"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "font-mono text-xs",
            )}
          >
            suggest one
            <ExternalLink className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function ForkNote({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase text-muted-foreground">
        {label}
      </div>
      <p className="mt-1 text-sm leading-6 text-card-foreground">{value}</p>
    </div>
  );
}
