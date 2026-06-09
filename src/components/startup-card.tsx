import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Startup } from "@/lib/supabase";

type StartupCardProps = {
  startup: Startup;
};

export function StartupCard({ startup }: StartupCardProps) {
  const visibleForkIdeas = startup.forkIdeas.slice(0, 4);

  return (
    <Card className="gap-0 rounded-lg border-border/80 py-0 shadow-none transition-colors hover:border-foreground/40">
      <CardHeader className="flex grid-cols-none flex-row items-start justify-between gap-4 p-5 pb-0">
        <CardTitle className="text-lg font-medium leading-tight">
          {startup.name}
        </CardTitle>
        <div className="shrink-0 text-right">
          <div className="font-mono text-[13px] font-medium">
            {startup.amountRaised}
          </div>
          <Badge
            variant="outline"
            className="mt-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-normal text-muted-foreground"
          >
            {startup.roundLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-3">
        <p className="max-w-3xl text-[13px] leading-6 text-muted-foreground">
          {startup.description}
        </p>

        <div className="mt-4 border-t border-border/80 pt-3">
          <div className="mb-2 font-mono text-[10px] uppercase text-muted-foreground">
            fork ideas
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {visibleForkIdeas.map((idea) => (
              <div
                key={idea.id}
                className="rounded-md border border-border/70 bg-secondary px-3 py-2.5"
              >
                <div className="text-xs font-medium leading-5">
                  {idea.title}
                </div>
                <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {idea.niche}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-4 px-5 pb-5 pt-0">
        <span className="font-mono text-[11px] text-muted-foreground">
          {startup.forkIdeas.length} fork ideas total
        </span>
        <Link
          href={`/startups/${startup.slug}`}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-foreground transition-colors hover:text-ring"
        >
          see all forks
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
