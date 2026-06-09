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
        is_published: true,
      },
      slug: slugify(name),
      approvedIdeas,
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
      .eq("name", item.startup.name)
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
