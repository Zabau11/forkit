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

import { IdeaPromptActions } from "@/components/idea-prompt-actions";
import { StartupLogo } from "@/components/startup-logo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getStartupDetailBySlug,
  type StartupDetail,
  type StartupDetailForkIdea,
} from "@/lib/supabase";
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
            href="/startups"
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

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <StartupLogo
                slug={startup.slug}
                name={startup.name}
                size="lg"
                className="hidden sm:flex"
              />
              <h1 className="min-w-0 text-[48px] font-semibold leading-[1] md:text-[84px]">
                {startup.name}
              </h1>
            </div>
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
            <div className="mb-4 grid gap-4 rounded-lg border border-border bg-secondary/50 p-5 md:grid-cols-[minmax(0,1fr)_240px]">
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                  recommended starting point
                </div>
                <h3 className="mt-2 text-2xl font-medium leading-tight">
                  {bestIdea.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {createShortDescription(bestIdea)}
                </p>
              </div>
              <div className="border-t border-border pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                  explore next
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Copy the full prompt, open Claude, and paste it in to unpack
                  the business.
                </p>
                <div className="mt-4">
                  <IdeaPromptActions
                    prompt={createClaudePrompt(startup, bestIdea)}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 xl:grid-cols-2">
            {forkIdeas.map((idea, index) => (
              <Card
                key={idea.id}
                className="min-h-[230px] gap-0 rounded-lg border-border/80 py-0 shadow-none"
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
                  <p className="text-sm leading-6 text-muted-foreground">
                    {createShortDescription(idea)}
                  </p>
                  <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                        pricing
                      </div>
                      <p className="mt-1 text-sm leading-6">
                        {createShortText(idea.pricing)}
                      </p>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                        next step
                      </div>
                      <div className="mt-2">
                        <IdeaPromptActions
                          prompt={createClaudePrompt(startup, idea)}
                        />
                      </div>
                    </div>
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
            Browse the startup library or suggest the next one.
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/startups"
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

function createShortDescription(idea: StartupDetailForkIdea): string {
  return createShortText(idea.problem ?? idea.whyItWorks);
}

function createShortText(value: string): string {
  const firstSentence = value.match(/.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? value;

  if (firstSentence.length <= 150) {
    return firstSentence;
  }

  return `${firstSentence.slice(0, 147).trim()}...`;
}

function createClaudePrompt(
  startup: StartupDetail,
  idea: StartupDetailForkIdea,
): string {
  const evidence = idea.evidence?.length
    ? idea.evidence
        .map((item) => `- ${item.source}: ${item.snippet}`)
        .join("\n")
    : "- No external evidence snippets provided.";

  return `I want to explore this startup fork idea deeply.

Source company: ${startup.name}
Source company description: ${startup.description}
Source pattern: ${startup.pattern}
Funding / scale signal: ${startup.amountRaised} (${startup.roundLabel})

Fork idea: ${idea.title}
Target niche: ${idea.niche}
Viability score: ${idea.viabilityScore ?? "not scored"}/5

Problem:
${idea.problem ?? "Not provided."}

Why it works:
${idea.whyItWorks}

MVP:
${idea.mvp}

Go-to-market:
${idea.goToMarket}

Pricing:
${idea.pricing}

Evidence:
${evidence}

Help me evaluate whether this is viable for a solo founder. Break it down into:
1. the exact target customer and buyer persona
2. the painful workflow this replaces
3. the smallest useful MVP
4. the first 10 customer acquisition plan
5. realistic pricing and packaging
6. risks and reasons this might fail
7. a 30-day build plan
8. what I should validate before writing code

Be concrete, skeptical, and practical.`;
}
