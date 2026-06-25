import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Layers3,
  Route,
  Sparkles,
} from "lucide-react";

import { IdeaPromptActions } from "@/components/idea-prompt-actions";
import { JsonLd } from "@/components/json-ld";
import { StartupLogo } from "@/components/startup-logo";
import { YcBadge } from "@/components/yc-badge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getStartupDetailBySlug,
  type StartupDetail,
  type StartupDetailForkIdea,
} from "@/lib/supabase";
import { absoluteUrl, siteConfig } from "@/lib/site";
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
      title: "Startup not found | forkitt",
    };
  }

  return {
    title: `${startup.name} fork ideas`,
    description: startup.description,
    alternates: {
      canonical: `/startups/${startup.slug}`,
    },
    openGraph: {
      type: "article",
      url: `/startups/${startup.slug}`,
      title: `${startup.name} fork ideas | ${siteConfig.name}`,
      description: startup.description,
      images: [
        {
          url: `/startups/${startup.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${startup.name} fork ideas`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${startup.name} fork ideas | ${siteConfig.name}`,
      description: startup.description,
      images: [`/startups/${startup.slug}/opengraph-image`],
    },
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${startup.name} fork ideas`,
          description: startup.description,
          url: absoluteUrl(`/startups/${startup.slug}`),
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: absoluteUrl("/"),
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: absoluteUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Startups",
                item: absoluteUrl("/startups"),
              },
              {
                "@type": "ListItem",
                position: 3,
                name: startup.name,
                item: absoluteUrl(`/startups/${startup.slug}`),
              },
            ],
          },
          mainEntity: {
            "@type": "ItemList",
            name: `${startup.name} fork ideas`,
            numberOfItems: forkIdeas.length,
            itemListElement: forkIdeas.map((idea, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: idea.title,
              description: createShortDescription(idea),
            })),
          },
        }}
      />
      <nav className="animate-page-enter flex items-center justify-between border-b border-border px-6 py-5">
        <div className="flex items-center gap-5">
          <Link href="/" className="font-mono text-[15px] font-medium">
            fork<span className="text-muted-foreground">itt</span>
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

      <section className="animate-page-enter motion-delay-1 grid border-b border-border lg:grid-cols-[minmax(0,1fr)_360px]">
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
            {startup.ycBatch ? (
              <YcBadge
                batch={startup.ycBatch}
                url={startup.ycUrl}
                className="px-3 py-1 text-[11px]"
              />
            ) : null}
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
              {startup.ycBatch
                ? `YC ${startup.ycBatch} - ${startup.amountRaised}`
                : startup.amountRaised}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              backing signal
            </div>
          </div>
        </aside>
      </section>

      <section className="animate-page-enter motion-delay-2 grid border-b border-border md:grid-cols-3">
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

      <section className="animate-page-enter motion-delay-3 grid border-b border-border lg:grid-cols-[320px_minmax(0,1fr)]">
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
                className="gap-0 rounded-lg border-border/80 py-0 shadow-none"
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
                        ideal customer
                      </div>
                      <p className="mt-1 text-sm leading-6">
                        {idea.niche}
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

                  <details className="group border-t border-border pt-1">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md py-3 font-mono text-[11px] uppercase tracking-[1.2px] text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                      <span>more information</span>
                      <ChevronDown
                        className="size-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>

                    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
                      <ForkDetailSection
                        label="ICP"
                        value={createIcpDescription(idea)}
                      />
                      <ForkDetailSection
                        label="problem"
                        value={
                          idea.problem ??
                          "The target customer is relying on a broad tool or manual workaround that does not match their workflow."
                        }
                      />
                      <ForkDetailSection
                        label="why it works"
                        value={idea.whyItWorks}
                      />
                      <ForkDetailSection label="MVP" value={idea.mvp} />
                      <ForkDetailSection
                        label="go-to-market"
                        value={idea.goToMarket}
                      />
                      <ForkDetailSection
                        label="pricing"
                        value={idea.pricing}
                      />
                    </div>

                    {idea.evidence?.length ? (
                      <div className="mt-3 rounded-lg border border-border bg-background/40 p-4">
                        <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
                          supporting evidence
                        </div>
                        <div className="mt-3 space-y-3">
                          {idea.evidence.map((item, evidenceIndex) => (
                            <div
                              key={`${item.source}-${evidenceIndex}`}
                              className="text-xs leading-5 text-muted-foreground"
                            >
                              <div className="text-foreground">
                                {isExternalSource(item.source) ? (
                                  <a
                                    href={item.source}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                                  >
                                    source {evidenceIndex + 1}
                                    <ExternalLink
                                      className="size-3"
                                      aria-hidden="true"
                                    />
                                  </a>
                                ) : (
                                  item.source
                                )}
                              </div>
                              <p className="mt-1">{item.snippet}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="animate-page-enter motion-delay-4 flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
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

function ForkDetailSection({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <section className="bg-card p-4">
      <h4 className="font-mono text-[10px] uppercase tracking-[1.5px] text-primary">
        {label}
      </h4>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
    </section>
  );
}

function createIcpDescription(idea: StartupDetailForkIdea): string {
  return `${idea.niche}. The strongest early customer already feels this problem, uses a workaround today, and can approve a focused tool without a long enterprise buying process.`;
}

function isExternalSource(source: string): boolean {
  return source.startsWith("https://") || source.startsWith("http://");
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
