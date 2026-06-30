import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { StartupCard } from "@/components/startup-card";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  categoryFilters,
  formatCategoryLabel,
  formatOpportunityFilterLabel,
  opportunityFilters,
  startupSortOptions,
  type CategoryFilter,
  type OpportunityFilter,
  type Startup,
  type StartupSort,
} from "@/lib/supabase";
import { cn } from "@/lib/utils";

type StartupBrowserProps = {
  startups: Startup[];
  activeCategory: CategoryFilter;
  activeOpportunityFilters: OpportunityFilter[];
  activeQuery: string;
  activeSort: StartupSort;
  actionPath: string;
  browsePath: string;
  heading?: string;
  gridClassName?: string;
};

const sortLabels: Record<StartupSort, string> = {
  latest: "latest",
  name: "A-Z",
  ideas: "most ideas",
};

function createBrowseHref({
  browsePath,
  category,
  opportunityFilters,
  query,
  sort,
}: {
  browsePath: string;
  category: CategoryFilter;
  opportunityFilters: OpportunityFilter[];
  query: string;
  sort: StartupSort;
}) {
  const params = new URLSearchParams();

  if (category !== "all") {
    params.set("category", category);
  }

  if (query) {
    params.set("q", query);
  }

  if (opportunityFilters.length) {
    params.set("fit", opportunityFilters.join(","));
  }

  if (sort !== "latest") {
    params.set("sort", sort);
  }

  const queryString = params.toString();

  if (!queryString) {
    return browsePath;
  }

  const [path, hash] = browsePath.split("#");

  return hash ? `${path}?${queryString}#${hash}` : `${path}?${queryString}`;
}

export function StartupBrowser({
  startups,
  activeCategory,
  activeOpportunityFilters,
  activeQuery,
  activeSort,
  actionPath,
  browsePath,
  heading = "browse startups",
  gridClassName,
}: StartupBrowserProps) {
  const hasActiveFilters =
    activeCategory !== "all" ||
    activeOpportunityFilters.length > 0 ||
    activeQuery ||
    activeSort !== "latest";

  return (
    <>
      <div className="mb-5 grid gap-4 border-b border-border pb-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <div className="font-mono text-[11px] uppercase text-muted-foreground">
            {heading}
          </div>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <form action={actionPath} className="relative flex-1">
              <input type="hidden" name="category" value={activeCategory} />
              <input
                type="hidden"
                name="fit"
                value={activeOpportunityFilters.join(",")}
              />
              <input type="hidden" name="sort" value={activeSort} />
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                name="q"
                defaultValue={activeQuery}
                placeholder="Search companies, niches, markets..."
                className="h-11 rounded-lg pl-9 pr-11 text-[14px]"
              />
              {activeQuery ? (
                <Link
                  href={createBrowseHref({
                    browsePath,
                    category: activeCategory,
                    opportunityFilters: activeOpportunityFilters,
                    query: "",
                    sort: activeSort,
                  })}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" aria-hidden="true" />
                </Link>
              ) : null}
            </form>

            {hasActiveFilters ? (
              <Link
                href={browsePath}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-11 shrink-0 rounded-lg font-mono text-[11px]",
                )}
              >
                clear filters
              </Link>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex flex-wrap gap-1.5">
            {categoryFilters.map((filter) => (
              <Link
                key={filter}
                href={createBrowseHref({
                  browsePath,
                  category: filter,
                  opportunityFilters: activeOpportunityFilters,
                  query: activeQuery,
                  sort: activeSort,
                })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
                  activeCategory === filter
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                )}
              >
                {formatCategoryLabel(filter)}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="mr-1 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase text-muted-foreground">
              fit
            </div>
            {opportunityFilters.map((filter) => {
              const isActive = activeOpportunityFilters.includes(filter);
              const nextOpportunityFilters = isActive
                ? activeOpportunityFilters.filter((item) => item !== filter)
                : [...activeOpportunityFilters, filter];

              return (
                <Link
                  key={filter}
                  href={createBrowseHref({
                    browsePath,
                    category: activeCategory,
                    opportunityFilters: nextOpportunityFilters,
                    query: activeQuery,
                    sort: activeSort,
                  })}
                  className={cn(
                    "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  {formatOpportunityFilterLabel(filter)}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="mr-1 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase text-muted-foreground">
              <SlidersHorizontal className="size-3" aria-hidden="true" />
              sort
            </div>
            {startupSortOptions.map((sort) => (
              <Link
                key={sort}
                href={createBrowseHref({
                  browsePath,
                  category: activeCategory,
                  opportunityFilters: activeOpportunityFilters,
                  query: activeQuery,
                  sort,
                })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
                  activeSort === sort
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                )}
              >
                {sortLabels[sort]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{startups.length}</span>{" "}
          {startups.length === 1 ? "startup" : "startups"}
        </div>
        {activeQuery ? (
          <div className="hidden max-w-[360px] truncate font-mono text-[11px] text-muted-foreground sm:block">
            query: {activeQuery}
          </div>
        ) : activeOpportunityFilters.length ? (
          <div className="hidden max-w-[420px] truncate font-mono text-[11px] text-muted-foreground sm:block">
            fit:{" "}
            {activeOpportunityFilters.map(formatOpportunityFilterLabel).join(", ")}
          </div>
        ) : null}
      </div>

      <div className={cn("grid gap-3 lg:grid-cols-2", gridClassName)}>
        {startups.map((startup) => (
          <div key={startup.id} id={startup.id}>
            <StartupCard startup={startup} />
          </div>
        ))}
      </div>

      {!startups.length ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No startups found for this search.
        </div>
      ) : null}
    </>
  );
}
