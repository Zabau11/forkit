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
  return (
    <Link
      href={`/startups/${startup.slug}`}
      className="group block h-full rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      aria-label={`View all ${startup.name} fork ideas`}
    >
      <Card className="flex h-full gap-0 rounded-lg border-border/80 py-0 shadow-none transition-colors group-hover:border-foreground/40 group-hover:bg-secondary/60">
        <CardHeader className="flex grid-cols-none flex-row items-start justify-between gap-4 p-5 pb-0">
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase text-muted-foreground">
              company
            </div>
            <CardTitle className="text-xl font-medium leading-tight">
              {startup.name}
            </CardTitle>
          </div>
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

        <CardContent className="grow p-5 pt-3">
          <p className="max-w-3xl text-[13px] leading-6 text-muted-foreground">
            {startup.description}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border/80 pt-4">
            <div>
              <div className="font-mono text-[10px] uppercase text-muted-foreground">
                category
              </div>
              <div className="mt-1 text-sm leading-6">{startup.category}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-muted-foreground">
                signal
              </div>
              <div className="mt-1 text-sm leading-6">{startup.roundLabel}</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-between gap-4 px-5 pb-5 pt-0">
          <span className="font-mono text-[11px] text-muted-foreground">
            {startup.forkIdeas.length} ideas inside
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-foreground transition-colors group-hover:text-ring">
            open company
            <ArrowRight
              className="size-3 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
