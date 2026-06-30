import { createClient } from "@supabase/supabase-js";

export const categoryFilters = [
  "all",
  "finance",
  "productivity",
  "devtools",
  "workforce",
  "data",
  "automation",
  "commerce",
  "marketplaces",
  "logistics",
  "ai-ops",
  "communications",
  "education",
  "real-estate",
] as const;

export type CategoryFilter = (typeof categoryFilters)[number];

export const startupSortOptions = ["latest", "name", "ideas"] as const;

export type StartupSort = (typeof startupSortOptions)[number];

export const opportunityFilters = [
  "b2b",
  "low-code",
  "high-ticket",
  "local-services",
  "regulated",
  "workflow-automation",
] as const;

export type OpportunityFilter = (typeof opportunityFilters)[number];

export const categoryLabels: Record<CategoryFilter, string> = {
  all: "all",
  finance: "finance",
  productivity: "productivity",
  devtools: "devtools",
  workforce: "workforce",
  data: "data",
  automation: "automation",
  commerce: "commerce",
  marketplaces: "marketplaces",
  logistics: "logistics",
  "ai-ops": "AI ops",
  communications: "communications",
  education: "education",
  "real-estate": "real estate",
};

export function formatCategoryLabel(category: CategoryFilter): string {
  return categoryLabels[category];
}

export const opportunityFilterLabels: Record<OpportunityFilter, string> = {
  b2b: "B2B",
  "low-code": "low-code",
  "high-ticket": "high-ticket",
  "local-services": "local services",
  regulated: "regulated",
  "workflow-automation": "workflow automation",
};

export function formatOpportunityFilterLabel(
  filter: OpportunityFilter,
): string {
  return opportunityFilterLabels[filter];
}

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
  upvotes: number;
  downvotes: number;
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
  ycBatch?: string | null;
  ycUrl?: string | null;
  pattern?: string | null;
  sortOrder: number;
  createdAt: string;
  opportunityFilters: OpportunityFilter[];
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

export type LandingPageFilters = {
  category: CategoryFilter;
  opportunityFilters: OpportunityFilter[];
  query: string;
  sort: StartupSort;
};

export type SitemapStartup = {
  slug: string;
  createdAt: string;
};

type StartupRow = {
  id: string;
  slug?: string | null;
  name: string;
  description: string;
  category: Exclude<CategoryFilter, "all">;
  amount_raised: string;
  round_label: string;
  yc_batch?: string | null;
  yc_url?: string | null;
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
  upvotes?: number | null;
  downvotes?: number | null;
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

export function normalizeSearchQuery(value: string | undefined): string {
  return typeof value === "string" ? value.trim().slice(0, 80) : "";
}

export function normalizeOpportunityFilters(
  value: string | string[] | undefined,
): OpportunityFilter[] {
  const values = Array.isArray(value) ? value : value?.split(",");

  if (!values) {
    return [];
  }

  return values
    .map((item) => item.trim())
    .filter((item): item is OpportunityFilter =>
      opportunityFilters.includes(item as OpportunityFilter),
    )
    .filter((item, index, items) => items.indexOf(item) === index);
}

export function normalizeStartupSort(value: string | undefined): StartupSort {
  if (value && startupSortOptions.includes(value as StartupSort)) {
    return value as StartupSort;
  }

  return "latest";
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

export async function getLandingPageData({
  category,
  opportunityFilters: activeOpportunityFilters,
  query,
  sort,
}: LandingPageFilters): Promise<LandingPageData> {
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
        yc_batch,
        yc_url,
        pattern,
        sort_order,
        created_at,
        fork_ideas:startup_fork_ideas (
          id,
          title,
          niche,
          sort_order,
          problem,
          why_it_works,
          mvp,
          go_to_market,
          pricing
        )
      `,
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(120);

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
  const startups = sortStartups(
    filterStartups(
      filterStartupsByOpportunity(
        startupRows.map(mapStartupRow),
        activeOpportunityFilters,
      ),
      query,
    ),
    sort,
  );

  return {
    startups,
    stats: {
      startupCount: startupCountResult.count ?? startups.length,
      forkIdeaCount: forkIdeaCountResult.count ?? 0,
      newDropCadence: cadenceRow?.value ?? null,
    },
    error: firstError?.message ?? null,
  };
}

function filterStartupsByOpportunity(
  startups: Startup[],
  activeFilters: OpportunityFilter[],
): Startup[] {
  if (!activeFilters.length) {
    return startups;
  }

  return startups.filter((startup) =>
    activeFilters.every((filter) => startup.opportunityFilters.includes(filter)),
  );
}

function filterStartups(startups: Startup[], query: string): Startup[] {
  if (!query) {
    return startups;
  }

  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

  return startups.filter((startup) => {
    const searchableText = [
      startup.name,
      startup.description,
      startup.category,
      startup.roundLabel,
      startup.amountRaised,
      startup.ycBatch ?? "",
      startup.pattern ?? "",
      ...startup.forkIdeas.flatMap((idea) => [idea.title, idea.niche]),
    ]
      .join(" ")
      .toLowerCase();

    return tokens.every((token) => searchableText.includes(token));
  });
}

function sortStartups(startups: Startup[], sort: StartupSort): Startup[] {
  return [...startups].sort((a, b) => {
    if (sort === "name") {
      return a.name.localeCompare(b.name);
    }

    if (sort === "ideas") {
      return (
        b.forkIdeas.length - a.forkIdeas.length || a.sortOrder - b.sortOrder
      );
    }

    return b.createdAt.localeCompare(a.createdAt) || a.sortOrder - b.sortOrder;
  });
}

function mapStartupRow(row: StartupRow): Startup {
  const forkIdeaRows = Array.isArray(row.fork_ideas) ? row.fork_ideas : [];
  const forkIdeas = forkIdeaRows
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
      upvotes: idea.upvotes ?? 0,
      downvotes: idea.downvotes ?? 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const startup = {
    id: row.id,
    slug: row.slug ?? createStartupSlug(row.name),
    name: row.name,
    description: row.description,
    category: row.category,
    amountRaised: row.amount_raised,
    roundLabel: row.round_label,
    ycBatch: row.yc_batch ?? null,
    ycUrl: row.yc_url ?? null,
    pattern: row.pattern ?? null,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    forkIdeas,
  };

  return {
    ...startup,
    opportunityFilters: inferOpportunityFilters(startup),
  };
}

function inferOpportunityFilters(
  startup: Omit<Startup, "opportunityFilters">,
): OpportunityFilter[] {
  const searchableText = [
    startup.name,
    startup.description,
    startup.category,
    startup.roundLabel,
    startup.pattern ?? "",
    ...startup.forkIdeas.flatMap((idea) => [
      idea.title,
      idea.niche,
      idea.problem ?? "",
      idea.whyItWorks ?? "",
      idea.mvp ?? "",
      idea.goToMarket ?? "",
      idea.pricing ?? "",
    ]),
  ]
    .join(" ")
    .toLowerCase();

  const filters = new Set<OpportunityFilter>();

  if (
    [
      "firm",
      "company",
      "companies",
      "business",
      "operator",
      "operators",
      "teams",
      "office",
      "agency",
      "clinics",
      "retailers",
      "vendors",
    ].some((term) => searchableText.includes(term))
  ) {
    filters.add("b2b");
  }

  if (
    startup.category === "automation" ||
    ["template", "templates", "no-code", "low-code", "spreadsheet"].some(
      (term) => searchableText.includes(term),
    )
  ) {
    filters.add("low-code");
  }

  if (
    /\$[3-9]\d{2}|\$[1-9][,\d]{3,}/.test(searchableText) ||
    ["enterprise", "compliance", "procurement", "finance owner"].some((term) =>
      searchableText.includes(term),
    )
  ) {
    filters.add("high-ticket");
  }

  if (
    [
      "local",
      "clinic",
      "dental",
      "restaurant",
      "hotel",
      "property",
      "contractor",
      "construction",
      "franchise",
      "salon",
      "real estate",
      "retailer",
      "shop",
    ].some((term) => searchableText.includes(term))
  ) {
    filters.add("local-services");
  }

  if (
    startup.category === "finance" ||
    startup.category === "workforce" ||
    [
      "compliance",
      "regulated",
      "audit",
      "legal",
      "healthcare",
      "clinic",
      "insurance",
      "payroll",
      "tax",
      "banking",
      "payments",
      "immigration",
      "nonprofit",
    ].some((term) => searchableText.includes(term))
  ) {
    filters.add("regulated");
  }

  if (
    startup.category === "automation" ||
    [
      "workflow",
      "workflows",
      "approval",
      "approvals",
      "checklist",
      "intake",
      "operations",
      "reminders",
      "tracker",
      "dashboard",
    ].some((term) => searchableText.includes(term))
  ) {
    filters.add("workflow-automation");
  }

  return opportunityFilters.filter((filter) => filters.has(filter));
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
          yc_batch,
          yc_url,
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
            evidence,
            upvotes,
            downvotes
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

  return null;
}

export async function getPublishedStartupsForSitemap(): Promise<
  SitemapStartup[]
> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("startups")
    .select("slug, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((startup) => ({
    slug: startup.slug,
    createdAt: startup.created_at,
  }));
}
