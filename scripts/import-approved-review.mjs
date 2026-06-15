import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_REVIEW_FILE = "generated/startups-review.json";
const VALID_CATEGORIES = new Set(["saas", "ai", "marketplace"]);
const VALID_REVIEW_STATUSES = new Set(["pending", "approved"]);

function parseArgs(argv) {
  const args = {
    reviewFile: DEFAULT_REVIEW_FILE,
    reviewStatus: "approved",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--review-status" && next) {
      if (!VALID_REVIEW_STATUSES.has(next)) {
        throw new Error("--review-status must be pending or approved.");
      }

      args.reviewStatus = next;
      index += 1;
      continue;
    }

    if (!arg.startsWith("--") && args.reviewFile === DEFAULT_REVIEW_FILE) {
      args.reviewFile = arg;
      continue;
    }

    throw new Error(`Unknown or incomplete argument: ${arg}`);
  }

  return args;
}

function loadLocalEnv() {
  try {
    const envText = readFileSync(".env.local", "utf8");

    for (const rawLine of envText.split(/\r?\n/)) {
      const line = rawLine.trim();

      if (!line || line.startsWith("#")) {
        continue;
      }

      const equalsIndex = line.indexOf("=");

      if (equalsIndex === -1) {
        continue;
      }

      const key = line.slice(0, equalsIndex).trim();
      const value = line.slice(equalsIndex + 1).trim();

      if (key && process.env[key] === undefined) {
        process.env[key] = value.replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // The script can also run with environment variables provided by the shell.
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getString(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value.trim();
}

function getOptionalNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getOptionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getOptionalStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item) => typeof item === "string" && item.trim());
}

function getOptionalEvidence(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item) =>
        item &&
        typeof item.source === "string" &&
        item.source.trim() &&
        typeof item.snippet === "string" &&
        item.snippet.trim(),
    )
    .map((item) => ({
      source: item.source.trim(),
      snippet: item.snippet.trim(),
    }));
}

function getOptionalViabilityScore(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error("viabilityScore must be an integer from 1 to 5.");
  }

  return value;
}

function normalizeReviewData(data, importReviewStatus) {
  if (!data || !Array.isArray(data.startups)) {
    throw new Error("Review file must contain a top-level startups array.");
  }

  return data.startups.map((startup, startupIndex) => {
    const name = getString(startup.name, `startups[${startupIndex}].name`);
    const category = getString(
      startup.category,
      `startups[${startupIndex}].category`,
    );

    if (!VALID_CATEGORIES.has(category)) {
      throw new Error(
        `startups[${startupIndex}].category must be one of: ${Array.from(
          VALID_CATEGORIES,
        ).join(", ")}.`,
      );
    }

    const ideas = Array.isArray(startup.ideas) ? startup.ideas : [];
    const importableIdeas = ideas
      .filter((idea) =>
        importReviewStatus === "approved"
          ? idea.status === "approved"
          : idea.status !== "rejected",
      )
      .map((idea, ideaIndex) => ({
        title: getString(
          idea.title,
          `startups[${startupIndex}].ideas[${ideaIndex}].title`,
        ),
        niche: getString(
          idea.niche,
          `startups[${startupIndex}].ideas[${ideaIndex}].niche`,
        ),
        sort_order: getOptionalNumber(idea.sortOrder, (ideaIndex + 1) * 10),
        sourceIdea: idea,
      }));

    return {
      startup: {
        name,
        description: getString(
          startup.description,
          `startups[${startupIndex}].description`,
        ),
        category,
        slug: slugify(name),
        amount_raised: getString(
          startup.amountRaised,
          `startups[${startupIndex}].amountRaised`,
        ),
        round_label: getString(
          startup.roundLabel,
          `startups[${startupIndex}].roundLabel`,
        ),
        sort_order: getOptionalNumber(
          startup.sortOrder,
          (startupIndex + 1) * 10,
        ),
        website_url: getOptionalString(startup.websiteUrl),
        source_urls: getOptionalStringArray(startup.sourceUrls),
        source_summary: getOptionalString(startup.sourceSummary),
        pattern: getOptionalString(startup.pattern),
        build_angle: getOptionalString(startup.buildAngle),
        target_customer: getOptionalString(startup.targetCustomer),
        starter_stack: getOptionalStringArray(startup.starterStack),
        enriched_at: startup.sourceSummary ? new Date().toISOString() : null,
        is_published: importReviewStatus === "approved",
      },
      slug: slugify(name),
      importableIdeas: importableIdeas.map((idea) => {
        const sourceIdea = idea.sourceIdea;
        return {
          ...idea,
          sourceIdea: undefined,
          problem: getOptionalString(sourceIdea.problem),
          why_it_works: getOptionalString(sourceIdea.whyItWorks),
          mvp: getOptionalString(sourceIdea.mvp),
          go_to_market: getOptionalString(sourceIdea.goToMarket),
          pricing: getOptionalString(sourceIdea.pricing),
          viability_score: getOptionalViabilityScore(sourceIdea.viabilityScore),
          evidence: getOptionalEvidence(sourceIdea.evidence),
          generation_model: getOptionalString(sourceIdea.generationModel),
          generated_at: sourceIdea.generationModel
            ? new Date().toISOString()
            : null,
          review_status: importReviewStatus,
          is_published: importReviewStatus === "approved",
          reviewed_at:
            importReviewStatus === "approved" ? new Date().toISOString() : null,
        };
      }),
    };
  });
}

async function main() {
  loadLocalEnv();

  const args = parseArgs(process.argv.slice(2));
  const reviewFile = args.reviewFile;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    );
  }

  const reviewText = await readFile(reviewFile, "utf8");
  const reviewData = normalizeReviewData(JSON.parse(reviewText), args.reviewStatus);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  let importedStartupCount = 0;
  let importedIdeaCount = 0;

  for (const item of reviewData) {
    if (!item.importableIdeas.length) {
      continue;
    }

    const { data: existingStartup, error: lookupError } = await supabase
      .from("startups")
      .select("id")
      .eq("slug", item.slug)
      .maybeSingle();

    if (lookupError) {
      throw new Error(
        `Failed to look up startup "${item.startup.name}": ${lookupError.message}`,
      );
    }

    let startup = existingStartup;

    if (!startup) {
      const { data: insertedStartup, error: startupError } = await supabase
        .from("startups")
        .insert(item.startup)
        .select("id")
        .single();

      if (startupError) {
        throw new Error(
          `Failed to insert startup "${item.startup.name}": ${startupError.message}`,
        );
      }

      startup = insertedStartup;
      importedStartupCount += 1;
    }

    const { data: existingIdeas, error: existingIdeasError } = await supabase
      .from("startup_fork_ideas")
      .select("title")
      .eq("startup_id", startup.id)
      .in(
        "title",
        item.importableIdeas.map((idea) => idea.title),
      );

    if (existingIdeasError) {
      throw new Error(
        `Failed to look up ideas for "${item.startup.name}": ${existingIdeasError.message}`,
      );
    }

    const existingIdeaTitles = new Set(
      (existingIdeas ?? []).map((idea) => idea.title),
    );

    const forkIdeaRows = item.importableIdeas
      .filter((idea) => !existingIdeaTitles.has(idea.title))
      .map((idea) => ({
        startup_id: startup.id,
        title: idea.title,
        niche: idea.niche,
        sort_order: idea.sort_order,
        problem: idea.problem,
        why_it_works: idea.why_it_works,
        mvp: idea.mvp,
        go_to_market: idea.go_to_market,
        pricing: idea.pricing,
        viability_score: idea.viability_score,
        evidence: idea.evidence,
        generation_model: idea.generation_model,
        generated_at: idea.generated_at,
        review_status: idea.review_status,
        is_published: idea.is_published,
        reviewed_at: idea.reviewed_at,
      }));

    if (!forkIdeaRows.length) {
      continue;
    }

    const { error: ideasError } = await supabase
      .from("startup_fork_ideas")
      .insert(forkIdeaRows);

    if (ideasError) {
      throw new Error(
        `Failed to insert ideas for "${item.startup.name}": ${ideasError.message}`,
      );
    }

    importedIdeaCount += forkIdeaRows.length;
  }

  console.log(
    `Imported ${importedStartupCount} startups and ${importedIdeaCount} ${args.reviewStatus} ideas.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
