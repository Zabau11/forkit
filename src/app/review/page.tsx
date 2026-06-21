import type { Metadata } from "next";
import Link from "next/link";
import { Lock, LogOut, ShieldCheck } from "lucide-react";

import {
  loginReviewAdmin,
  logoutReviewAdmin,
  quickReviewIdea,
  updateReviewIdea,
} from "@/app/review/actions";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getReviewIdeas,
  isReviewAdminAuthenticated,
  isReviewConfigured,
  normalizeReviewStatusFilter,
  reviewStatuses,
  type ReviewIdea,
  type ReviewStatusFilter,
} from "@/lib/review-admin";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review",
  robots: {
    index: false,
    follow: false,
  },
};

type ReviewPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  const status = params.status
    ? normalizeReviewStatusFilter(params.status)
    : "pending";

  if (!isReviewConfigured()) {
    return (
      <ReviewShell>
        <div className="animate-page-enter max-w-xl border border-border p-6">
          <div className="font-mono text-[11px] uppercase text-muted-foreground">
            setup required
          </div>
          <h1 className="mt-3 text-3xl font-semibold">Review is locked.</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Add <code>FORKIT_REVIEW_PASSWORD</code> to{" "}
            <code>.env.local</code> to enable this private area.
          </p>
        </div>
      </ReviewShell>
    );
  }

  if (!(await isReviewAdminAuthenticated())) {
    return (
      <ReviewShell>
        <form
          action={loginReviewAdmin}
          className="animate-page-enter max-w-md border border-border bg-secondary/40 p-6"
        >
          <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-primary">
            <Lock className="size-5" aria-hidden="true" />
          </div>
          <div className="mt-5 font-mono text-[11px] uppercase text-muted-foreground">
            private review
          </div>
          <h1 className="mt-2 text-3xl font-semibold">Admin only</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This page is not linked publicly. Enter your review password to
            approve, hide, reject, or edit generated ideas.
          </p>
          {params.error === "invalid" ? (
            <div className="mt-4 border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
              Invalid password.
            </div>
          ) : null}
          <Input
            name="password"
            type="password"
            placeholder="Review password"
            className="mt-5 h-11 rounded-lg"
            autoComplete="current-password"
            required
          />
          <Button type="submit" className="mt-3 w-full font-mono text-xs">
            unlock review
          </Button>
        </form>
      </ReviewShell>
    );
  }

  const ideas = await getReviewIdeas(status);
  const visibleIdeas = ideas.filter((idea) => idea.isPublished).length;

  return (
    <ReviewShell>
      <header className="animate-page-enter border-b border-border px-6 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase text-muted-foreground">
              <ShieldCheck className="size-3" aria-hidden="true" />
              private review
            </div>
            <h1 className="mt-3 text-[42px] font-semibold leading-none">
              Idea queue
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Edit generated ideas before they appear publicly, or hide ideas
              that are already live.
            </p>
          </div>
          <form action={logoutReviewAdmin}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="font-mono text-xs"
            >
              logout
              <LogOut className="size-3" aria-hidden="true" />
            </Button>
          </form>
        </div>
      </header>

      <section className="animate-page-enter motion-delay-1 grid border-b border-border sm:grid-cols-3">
        <ReviewStat label="loaded ideas" value={String(ideas.length)} />
        <ReviewStat label="visible" value={String(visibleIdeas)} />
        <ReviewStat label="filter" value={status} />
      </section>

      <section className="animate-page-enter motion-delay-2 px-6 py-5">
        <div className="mb-5 flex flex-wrap gap-1.5">
          {(["all", ...reviewStatuses] as ReviewStatusFilter[]).map((item) => (
            <Link
              key={item}
              href={item === "pending" ? "/review" : `/review?status=${item}`}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
                status === item
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
              )}
            >
              {item}
            </Link>
          ))}
          <Link
            href="/startups"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "ml-auto font-mono text-xs",
            )}
          >
            public library
          </Link>
        </div>

        <div className="grid gap-4">
          {ideas.map((idea) => (
            <ReviewIdeaCard key={idea.id} idea={idea} />
          ))}
        </div>

        {!ideas.length ? (
          <div className="border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No ideas found for this filter.
          </div>
        ) : null}
      </section>
    </ReviewShell>
  );
}

function QuickActionButton({
  action,
  label,
  variant = "outline",
}: {
  action: "approve" | "reject" | "hide";
  label: string;
  variant?: "default" | "outline" | "secondary";
}) {
  return (
    <Button
      type="submit"
      name="action"
      value={action}
      formAction={quickReviewIdea}
      variant={variant}
      size="sm"
      className="w-full font-mono text-[11px]"
    >
      {label}
    </Button>
  );
}

function ReviewShell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-background text-foreground">{children}</main>;
}

function ReviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border px-6 py-5 sm:border-b-0 sm:border-r">
      <div className="text-[30px] font-medium leading-tight">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function ReviewIdeaCard({ idea }: { idea: ReviewIdea }) {
  return (
    <form
      action={updateReviewIdea}
      className="grid gap-4 rounded-lg border border-border bg-card p-5 lg:grid-cols-[minmax(0,1fr)_280px]"
    >
      <input type="hidden" name="ideaId" value={idea.id} />
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge
            variant={idea.reviewStatus === "approved" ? "secondary" : "outline"}
            className="rounded-full px-2.5 py-1 font-mono text-[10px] font-normal text-muted-foreground"
          >
            {idea.reviewStatus}
          </Badge>
          <Badge
            variant={idea.isPublished ? "secondary" : "outline"}
            className="rounded-full px-2.5 py-1 font-mono text-[10px] font-normal text-muted-foreground"
          >
            {idea.isPublished ? "public" : "hidden"}
          </Badge>
          {idea.startup ? (
            <Link
              href={`/startups/${idea.startup.slug}`}
              className="font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {idea.startup.name}
            </Link>
          ) : null}
        </div>

        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
            title
          </span>
          <Input
            name="title"
            defaultValue={idea.title}
            className="mt-2 h-10 rounded-lg text-base"
            required
          />
        </label>

        <label className="mt-4 block">
          <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
            niche
          </span>
          <Input
            name="niche"
            defaultValue={idea.niche}
            className="mt-2 h-10 rounded-lg"
            required
          />
        </label>

        <label className="mt-4 block">
          <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
            short problem
          </span>
          <textarea
            name="problem"
            defaultValue={idea.problem ?? ""}
            className="mt-2 min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </label>

        <label className="mt-4 block">
          <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
            pricing
          </span>
          <Input
            name="pricing"
            defaultValue={idea.pricing ?? ""}
            className="mt-2 h-10 rounded-lg"
          />
        </label>
      </div>

      <div className="space-y-4 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
            status
          </span>
          <select
            name="reviewStatus"
            defaultValue={idea.reviewStatus}
            className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {reviewStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
            viability
          </span>
          <Input
            name="viabilityScore"
            type="number"
            min={1}
            max={5}
            defaultValue={idea.viabilityScore ?? ""}
            className="mt-2 h-10 rounded-lg"
          />
        </label>

        <div className="grid gap-2">
          <QuickActionButton
            action="approve"
            label="approve + publish"
            variant="default"
          />
          <div className="grid grid-cols-2 gap-2">
            <QuickActionButton action="reject" label="reject" />
            <QuickActionButton action="hide" label="hide" />
          </div>
        </div>

        <div className="grid gap-2 border-t border-border pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              name="isPublished"
              type="checkbox"
              defaultChecked={idea.isPublished}
              className="size-4 accent-primary"
            />
            public
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              name="isFeatured"
              type="checkbox"
              defaultChecked={idea.isFeatured}
              className="size-4 accent-primary"
            />
            featured
          </label>
        </div>

        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-foreground">
            private notes
          </span>
          <textarea
            name="reviewNotes"
            defaultValue={idea.reviewNotes ?? ""}
            className="mt-2 min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </label>

        <Button type="submit" className="w-full font-mono text-xs">
          save review
        </Button>
      </div>
    </form>
  );
}
