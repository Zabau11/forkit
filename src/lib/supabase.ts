import { createClient } from "@supabase/supabase-js";

import { featuredStartupDetails } from "@/data/featured-startups";

export const categoryFilters = ["all", "saas", "ai", "marketplace"] as const;

export type CategoryFilter = (typeof categoryFilters)[number];

export type ForkIdea = {
  id: string;
  title: string;
  niche: string;
  sortOrder: number;
  problem?: string | null;
  whyItWorks?: string | null;
  mvp?: string | null;
  goToMarket?: string | null;
  pricing?: string | null;
  viabilityScore?: number | null;
  evidence?: IdeaEvidence[];
};

export type IdeaEvidence = {
  source: string;
  snippet: string;
};

export type StartupDetailForkIdea = ForkIdea & {
  whyItWorks: string;
  mvp: string;
  goToMarket: string;
  pricing: string;
};

export type Startup = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Exclude<CategoryFilter, "all">;
  amountRaised: string;
  roundLabel: string;
  sortOrder: number;
  createdAt: string;
  forkIdeas: ForkIdea[];
};

export type StartupDetail = Omit<Startup, "forkIdeas"> & {
  pattern: string;
  buildAngle: string;
  targetCustomer: string;
  starterStack: string[];
  forkIdeas: StartupDetailForkIdea[];
};

export type LandingStats = {
  startupCount: number;
  forkIdeaCount: number;
  newDropCadence: string | null;
};

export type LandingPageData = {
  startups: Startup[];
  stats: LandingStats;
  error: string | null;
};

type StartupRow = {
  id: string;
  slug?: string | null;
  name: string;
  description: string;
  category: Exclude<CategoryFilter, "all">;
  amount_raised: string;
  round_label: string;
  sort_order: number;
  created_at: string;
  pattern?: string | null;
  build_angle?: string | null;
  target_customer?: string | null;
  starter_stack?: string[] | null;
  fork_ideas?: ForkIdeaRow[] | null;
};

type ForkIdeaRow = {
  id: string;
  title: string;
  niche: string;
  sort_order: number;
  problem?: string | null;
  why_it_works?: string | null;
  mvp?: string | null;
  go_to_market?: string | null;
  pricing?: string | null;
  viability_score?: number | null;
  evidence?: IdeaEvidence[] | null;
};

type LandingSettingRow = {
  value: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createStartupSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeCategory(value: string | undefined): CategoryFilter {
  if (value && categoryFilters.includes(value as CategoryFilter)) {
    return value as CategoryFilter;
  }

  return "all";
}

export function getFeaturedStartupPageSlugs(): string[] {
  return featuredStartupDetails.map((startup) => startup.slug);
}

export function getFeaturedStartupDetailBySlug(
  slug: string,
): StartupDetail | null {
  return (
    featuredStartupDetails.find((startup) => startup.slug === slug) ?? null
  );
}

export function createSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function getLandingPageData(
  category: CategoryFilter,
): Promise<LandingPageData> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return {
      startups: [],
      stats: {
        startupCount: 0,
        forkIdeaCount: 0,
        newDropCadence: null,
      },
      error: "Supabase environment variables are missing.",
    };
  }

  let startupQuery = supabase
    .from("startups")
    .select(
      `
        id,
        slug,
        name,
        description,
        category,
        amount_raised,
        round_label,
        sort_order,
        created_at,
        fork_ideas:startup_fork_ideas (
          id,
          title,
          niche,
          sort_order
        )
      `,
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(6);

  if (category !== "all") {
    startupQuery = startupQuery.eq("category", category);
  }

  const [startupResult, startupCountResult, forkIdeaCountResult, cadenceResult] =
    await Promise.all([
      startupQuery,
      supabase
        .from("startups")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true),
      supabase
        .from("startup_fork_ideas")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("landing_settings")
        .select("value")
        .eq("key", "new_drop_cadence")
        .maybeSingle(),
    ]);

  const firstError =
    startupResult.error ??
    startupCountResult.error ??
    forkIdeaCountResult.error ??
    cadenceResult.error;

  const startupRows = (startupResult.data ?? []) as unknown as StartupRow[];
  const cadenceRow = cadenceResult.data as LandingSettingRow | null;
  const databaseStartups = startupRows.map(mapStartupRow);
  const startups = mergeFeaturedStartups(databaseStartups, category);

  return {
    startups,
    stats: {
      startupCount: startups.length,
      forkIdeaCount: startups.reduce(
        (count, startup) => count + startup.forkIdeas.length,
        0,
      ),
      newDropCadence: cadenceRow?.value ?? null,
    },
    error: firstError?.message ?? null,
  };
}

function mapStartupRow(row: StartupRow): Startup {
  const forkIdeaRows = Array.isArray(row.fork_ideas) ? row.fork_ideas : [];

  return {
    id: row.id,
    slug: row.slug ?? createStartupSlug(row.name),
    name: row.name,
    description: row.description,
    category: row.category,
    amountRaised: row.amount_raised,
    roundLabel: row.round_label,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    forkIdeas: forkIdeaRows
      .map((idea) => ({
        id: idea.id,
        title: idea.title,
        niche: idea.niche,
        sortOrder: idea.sort_order,
        problem: idea.problem ?? null,
        whyItWorks: idea.why_it_works ?? null,
        mvp: idea.mvp ?? null,
        goToMarket: idea.go_to_market ?? null,
        pricing: idea.pricing ?? null,
        viabilityScore: idea.viability_score ?? null,
        evidence: Array.isArray(idea.evidence) ? idea.evidence : [],
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

function mergeFeaturedStartups(
  databaseStartups: Startup[],
  category: CategoryFilter,
): Startup[] {
  const databaseSlugs = new Set(databaseStartups.map((startup) => startup.slug));
  const localStartups = featuredStartupDetails
    .filter(
      (startup) =>
        !databaseSlugs.has(startup.slug) &&
        (category === "all" || startup.category === category),
    )
    .map(toLandingStartup);

  return [...localStartups, ...databaseStartups].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

function toLandingStartup(startup: StartupDetail): Startup {
  return {
    id: startup.id,
    slug: startup.slug,
    name: startup.name,
    description: startup.description,
    category: startup.category,
    amountRaised: startup.amountRaised,
    roundLabel: startup.roundLabel,
    sortOrder: startup.sortOrder,
    createdAt: startup.createdAt,
    forkIdeas: startup.forkIdeas,
  };
}

function mapStartupDetailRow(row: StartupRow): StartupDetail {
  const startup = mapStartupRow(row);

  return {
    ...startup,
    pattern:
      row.pattern ??
      "A horizontal startup workflow repackaged for a narrower customer with sharper defaults, simpler language, and fewer integration assumptions.",
    buildAngle:
      row.build_angle ??
      "Start with the repeated operational pain behind the original product, then remove everything the niche buyer does not need in week one.",
    targetCustomer:
      row.target_customer ??
      "A specific operator who already pays for workarounds, spreadsheets, consultants, or brittle generic software.",
    starterStack:
      Array.isArray(row.starter_stack) && row.starter_stack.length
        ? row.starter_stack
        : [
            "Focused onboarding",
            "Niche templates",
            "Simple approval workflow",
            "Exportable reports",
            "Manual concierge setup",
          ],
    forkIdeas: startup.forkIdeas.map((idea) => ({
      ...idea,
      whyItWorks:
        idea.whyItWorks ??
        "The niche has a familiar workflow, but the generic category leader speaks to a broader buyer and leaves setup work to the customer.",
      mvp:
        idea.mvp ??
        `A focused ${idea.niche} workflow around ${idea.title.toLowerCase()}, with templates, reminders, and clean exports.`,
      goToMarket:
        idea.goToMarket ??
        "Find operators in the niche, offer a concierge setup, and turn their repeated spreadsheet into the first product workflow.",
      pricing:
        idea.pricing ??
        "Price as an operating tool, not a utility: start with a monthly team plan and charge more for done-with-you setup.",
    })),
  };
}

export async function getStartupDetailBySlug(
  slug: string,
): Promise<StartupDetail | null> {
  const supabase = createSupabaseServerClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("startups")
      .select(
        `
          id,
          slug,
          name,
          description,
          category,
          amount_raised,
          round_label,
          sort_order,
          created_at,
          pattern,
          build_angle,
          target_customer,
          starter_stack,
          fork_ideas:startup_fork_ideas (
            id,
            title,
            niche,
            sort_order,
            problem,
            why_it_works,
            mvp,
            go_to_market,
            pricing,
            viability_score,
            evidence
          )
        `,
      )
      .eq("is_published", true)
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return mapStartupDetailRow(data as unknown as StartupRow);
    }
  }

  return getFeaturedStartupDetailBySlug(slug);
}
