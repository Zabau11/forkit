import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_REVIEW_FILE = "generated/startups-review.json";
const VALID_CATEGORIES = new Set(["saas", "ai", "marketplace"]);

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

function normalizeReviewData(data) {
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
    const approvedIdeas = ideas
      .filter((idea) => idea.status === "approved")
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
        is_published: true,
      },
      slug: slugify(name),
      approvedIdeas: approvedIdeas.map((idea, ideaIndex) => {
        const sourceIdea = ideas.filter((item) => item.status === "approved")[
          ideaIndex
        ];

        return {
          ...idea,
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
        };
      }),
    };
  });
}

async function main() {
  loadLocalEnv();

  const reviewFile = process.argv[2] ?? DEFAULT_REVIEW_FILE;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    );
  }

  const reviewText = await readFile(reviewFile, "utf8");
  const reviewData = normalizeReviewData(JSON.parse(reviewText));

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  let importedStartupCount = 0;
  let importedIdeaCount = 0;

  for (const item of reviewData) {
    if (!item.approvedIdeas.length) {
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
        item.approvedIdeas.map((idea) => idea.title),
      );

    if (existingIdeasError) {
      throw new Error(
        `Failed to look up ideas for "${item.startup.name}": ${existingIdeasError.message}`,
      );
    }

    const existingIdeaTitles = new Set(
      (existingIdeas ?? []).map((idea) => idea.title),
    );

    const forkIdeaRows = item.approvedIdeas
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
    `Imported ${importedStartupCount} startups and ${importedIdeaCount} approved ideas.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
