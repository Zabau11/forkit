import { createClient } from "@supabase/supabase-js";

export const categoryFilters = ["all", "saas", "ai", "marketplace"] as const;

export type CategoryFilter = (typeof categoryFilters)[number];

export type ForkIdea = {
  id: string;
  title: string;
  niche: string;
  sortOrder: number;
};

export type Startup = {
  id: string;
  name: string;
  description: string;
  category: Exclude<CategoryFilter, "all">;
  amountRaised: string;
  roundLabel: string;
  sortOrder: number;
  createdAt: string;
  forkIdeas: ForkIdea[];
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
  name: string;
  description: string;
  category: Exclude<CategoryFilter, "all">;
  amount_raised: string;
  round_label: string;
  sort_order: number;
  created_at: string;
  fork_ideas?: ForkIdeaRow[] | null;
};

type ForkIdeaRow = {
  id: string;
  title: string;
  niche: string;
  sort_order: number;
};

type LandingSettingRow = {
  value: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function normalizeCategory(value: string | undefined): CategoryFilter {
  if (value && categoryFilters.includes(value as CategoryFilter)) {
    return value as CategoryFilter;
  }

  return "all";
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

  return {
    startups: startupRows.map(mapStartupRow),
    stats: {
      startupCount: startupCountResult.count ?? 0,
      forkIdeaCount: forkIdeaCountResult.count ?? 0,
      newDropCadence: cadenceRow?.value ?? null,
    },
    error: firstError?.message ?? null,
  };
}

function mapStartupRow(row: StartupRow): Startup {
  const forkIdeaRows = Array.isArray(row.fork_ideas) ? row.fork_ideas : [];

  return {
    id: row.id,
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
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}
