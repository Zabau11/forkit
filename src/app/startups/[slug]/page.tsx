import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BadgeDollarSign,
  CheckCircle2,
  ExternalLink,
  Layers3,
  Lightbulb,
  Megaphone,
  Route,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStartupDetailBySlug } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type StartupPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: StartupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const startup = await getStartupDetailBySlug(slug);

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
  const startup = await getStartupDetailBySlug(slug);

  if (!startup) {
    notFound();
  }

  const forkIdeas = [...startup.forkIdeas].sort(
    (a, b) =>
      (b.viabilityScore ?? 0) - (a.viabilityScore ?? 0) ||
      a.sortOrder - b.sortOrder,
  );
  const bestIdea = forkIdeas[0] ?? null;
  const bestScore = bestIdea?.viabilityScore ?? null;

  const highlights = [
    {
      label: "source signal",
      value: `${startup.amountRaised} · ${startup.roundLabel}`,
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
        <aside className="border-b border-border px-6 py-8 lg:border-b-0 lg:border-r">
          <div className="sticky top-6 space-y-8">
            {bestIdea ? (
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[1.5px] text-muted-foreground">
                  best first fork
                </div>
                <div className="mt-4 border-l border-foreground pl-4">
                  <div className="text-lg font-medium leading-6">
                    {bestIdea.title}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {bestIdea.niche}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {bestScore ? (
                      <Badge
                        variant="secondary"
                        className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] font-normal text-muted-foreground"
                      >
                        {bestScore}/5 viability
                      </Badge>
                    ) : null}
                    <Badge
                      variant="outline"
                      className="rounded-full px-2.5 py-1 font-mono text-[10px] font-normal text-muted-foreground"
                    >
                      rank #1
                    </Badge>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="border-t border-border pt-8">
              <div className="font-mono text-[11px] uppercase tracking-[1.5px] text-muted-foreground">
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
          </div>
        </aside>

        <div className="px-6 py-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase text-muted-foreground">
                ranked fork ideas
              </div>
              <h2 className="mt-2 text-2xl font-semibold leading-tight">
                Pick the wedge with the clearest buyer pain.
              </h2>
            </div>
            <div className="hidden items-center gap-2 font-mono text-[11px] text-muted-foreground sm:flex">
              <Layers3 className="size-3" aria-hidden="true" />
              {forkIdeas.length} ideas
            </div>
          </div>

          {bestIdea ? (
            <div className="mb-4 grid gap-4 rounded-lg border border-border bg-secondary/50 p-5 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                  recommended starting point
                </div>
                <h3 className="mt-2 text-2xl font-medium leading-tight">
                  {bestIdea.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {bestIdea.problem ?? bestIdea.whyItWorks}
                </p>
              </div>
              <div className="border-t border-border pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                  why this first
                </div>
                <p className="mt-2 text-sm leading-6">
                  {bestIdea.whyItWorks}
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 xl:grid-cols-2">
            {forkIdeas.map((idea, index) => (
              <Card
                key={idea.id}
                className="min-h-[360px] gap-0 rounded-lg border-border/80 py-0 shadow-none"
              >
                <CardHeader className="gap-3 p-7 pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-2 font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                        #{index + 1} fork idea
                      </div>
                      <CardTitle className="text-xl font-medium leading-7">
                        {idea.title}
                      </CardTitle>
                    </div>
                    {idea.viabilityScore ? (
                      <div className="shrink-0 rounded-full border border-border bg-secondary px-3 py-1 text-right font-mono text-[11px] text-muted-foreground">
                        {idea.viabilityScore}/5
                      </div>
                    ) : null}
                  </div>
                  <Badge
                    variant="outline"
                    className="w-fit max-w-full whitespace-normal rounded-full px-2.5 py-1 text-left font-mono text-[10px] font-normal leading-4 text-muted-foreground"
                  >
                    {idea.niche}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-5 p-7 pt-5">
                  {idea.problem ? (
                    <ForkNote icon={Target} label="problem" value={idea.problem} />
                  ) : null}
                  <ForkNote
                    icon={Lightbulb}
                    label="why it works"
                    value={idea.whyItWorks}
                  />
                  <ForkNote icon={Wrench} label="mvp" value={idea.mvp} />
                  <ForkNote
                    icon={Megaphone}
                    label="go to market"
                    value={idea.goToMarket}
                  />
                  <ForkNote
                    icon={BadgeDollarSign}
                    label="pricing"
                    value={idea.pricing}
                  />
                  {idea.evidence?.length ? (
                    <div className="border-t border-border pt-5">
                      <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                        evidence
                      </div>
                      <div className="mt-3 space-y-2">
                        {idea.evidence.slice(0, 2).map((evidence, evidenceIndex) => (
                          <p
                            key={`${idea.id}-${evidence.source}-${evidenceIndex}`}
                            className="text-xs leading-5 text-muted-foreground"
                          >
                            <span className="text-foreground">
                              {evidence.source}
                            </span>
                            : {evidence.snippet}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : null}
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

function ForkNote({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Lightbulb;
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[24px_minmax(0,1fr)]">
      <div className="flex size-6 items-center justify-center rounded-md border border-border bg-secondary text-primary">
        <Icon className="size-3.5" aria-hidden="true" />
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
          {label}
        </div>
        <p className="mt-1 text-sm leading-6 text-card-foreground">{value}</p>
      </div>
    </div>
  );
}
