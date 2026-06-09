import { createClient } from "@supabase/supabase-js";

export const categoryFilters = ["all", "saas", "ai", "marketplace"] as const;

export type CategoryFilter = (typeof categoryFilters)[number];

export type ForkIdea = {
  id: string;
  title: string;
  niche: string;
  sortOrder: number;
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
    slug: createStartupSlug(row.name),
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

const featuredStartupDetails: StartupDetail[] = [
  {
    id: "mercury",
    slug: "mercury",
    name: "Mercury",
    description:
      "Modern banking for startups, reworked for overlooked niches that need cash visibility, approvals, and lightweight financial operations more than another generic business account.",
    category: "saas",
    amountRaised: "VC-backed",
    roundLabel: "Series C",
    sortOrder: 0,
    createdAt: "2026-06-08T00:00:00.000Z",
    pattern:
      "A clean financial command center that wraps banking, cards, transfers, permissions, and cash reporting into one calm operating surface.",
    buildAngle:
      "Do not try to become a bank first. Start as the workflow layer around existing accounts: import balances and transactions, route approvals, forecast cash, and export accountant-ready reports.",
    targetCustomer:
      "Small operators with real money movement, recurring reconciliation pain, and no in-house finance team.",
    starterStack: [
      "Plaid or bank CSV import",
      "Role-based approvals",
      "Cash runway dashboard",
      "Invoice and bill tracker",
      "Monthly close export",
    ],
    forkIdeas: [
      {
        id: "mercury-accounting-firms",
        title: "Banking dashboard for boutique accounting firms",
        niche: "accounting",
        sortOrder: 10,
        whyItWorks:
          "Small firms manage cash questions across many client accounts, but the work still happens in spreadsheets, email, and screenshots.",
        mvp: "Client balance snapshots, transaction review queues, monthly close checklists, and one-click accountant packets.",
        goToMarket:
          "Start with two to five boutique firms that already sell monthly advisory retainers.",
        pricing: "$99-$399 per firm per month, plus client account tiers.",
      },
      {
        id: "mercury-film-crews",
        title: "Cashflow command center for indie film crews",
        niche: "film production",
        sortOrder: 20,
        whyItWorks:
          "Productions burn cash quickly, involve temporary vendors, and need fast visibility by shoot, department, and location.",
        mvp: "Budget envelopes, crew spend approvals, petty cash logs, vendor payout tracking, and daily burn reports.",
        goToMarket:
          "Partner with production accountants and indie producer communities before festival and grant cycles.",
        pricing: "$299-$999 per production, based on budget size and crew seats.",
      },
      {
        id: "mercury-franchise-owners",
        title: "Operating account tools for local franchise owners",
        niche: "local franchise",
        sortOrder: 30,
        whyItWorks:
          "Owners run several locations with separate managers, recurring payroll, vendor bills, and franchise reporting requirements.",
        mvp: "Location-level cash dashboards, bill approvals, vendor payment calendars, and royalty report exports.",
        goToMarket:
          "Pick one franchise category and sell through owner groups, accountants, and local operator meetups.",
        pricing: "$49-$149 per location per month.",
      },
      {
        id: "mercury-clinics",
        title: "Cash controls for independent clinics",
        niche: "healthcare",
        sortOrder: 40,
        whyItWorks:
          "Clinics juggle insurance delays, patient payments, payroll, and vendor bills with limited administrative staff.",
        mvp: "Receivables aging, payment deposit matching, bill reminders, and owner approval flows.",
        goToMarket:
          "Lead with cash visibility for practice managers who already feel the reimbursement lag every week.",
        pricing: "$199-$499 per clinic per month.",
      },
      {
        id: "mercury-nonprofits",
        title: "Restricted-fund banking view for small nonprofits",
        niche: "nonprofits",
        sortOrder: 50,
        whyItWorks:
          "Small nonprofits need to track what cash can actually be spent without hiring a finance director.",
        mvp: "Fund buckets, grant spend tracking, approval trails, board-ready cash reports, and donor restriction notes.",
        goToMarket:
          "Sell through nonprofit bookkeepers, grant writers, and local foundation networks.",
        pricing: "$79-$249 per organization per month.",
      },
    ],
  },
];

function expandStartupDetail(startup: Startup): StartupDetail {
  return {
    ...startup,
    pattern:
      "A horizontal startup workflow repackaged for a narrower customer with sharper defaults, simpler language, and fewer integration assumptions.",
    buildAngle:
      "Start with the repeated operational pain behind the original product, then remove everything the niche buyer does not need in week one.",
    targetCustomer:
      "A specific operator who already pays for workarounds, spreadsheets, consultants, or brittle generic software.",
    starterStack: [
      "Focused onboarding",
      "Niche templates",
      "Simple approval workflow",
      "Exportable reports",
      "Manual concierge setup",
    ],
    forkIdeas: startup.forkIdeas.map((idea) => ({
      ...idea,
      whyItWorks:
        "The niche has a familiar workflow, but the generic category leader speaks to a broader buyer and leaves setup work to the customer.",
      mvp: `A focused ${idea.niche} workflow around ${idea.title.toLowerCase()}, with templates, reminders, and clean exports.`,
      goToMarket:
        "Find operators in the niche, offer a concierge setup, and turn their repeated spreadsheet into the first product workflow.",
      pricing:
        "Price as an operating tool, not a utility: start with a monthly team plan and charge more for done-with-you setup.",
    })),
  };
}

export async function getStartupDetailBySlug(
  slug: string,
): Promise<StartupDetail | null> {
  const featuredStartup = featuredStartupDetails.find(
    (startup) => startup.slug === slug,
  );

  if (featuredStartup) {
    return featuredStartup;
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
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
    .order("created_at", { ascending: false });

  if (error) {
    return null;
  }

  const startupRows = (data ?? []) as unknown as StartupRow[];
  const startup = startupRows
    .map(mapStartupRow)
    .find((row) => row.slug === slug);

  return startup ? expandStartupDetail(startup) : null;
}
