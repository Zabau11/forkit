import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const DEFAULT_INPUT_FILE = "inputs/startups.json";
const DEFAULT_OUTPUT_FILE = "generated/startups-review.json";
const DEFAULT_PROVIDER = "anthropic";
const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-6";
const DEFAULT_OPENAI_MODEL = "gpt-5.5";
const DEFAULT_IDEAS_PER_STARTUP = 5;
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

function parseArgs(argv) {
  const args = {
    input: DEFAULT_INPUT_FILE,
    output: DEFAULT_OUTPUT_FILE,
    limit: null,
    ideas: DEFAULT_IDEAS_PER_STARTUP,
    provider: null,
    model: null,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }

    if (arg === "--input" && next) {
      args.input = next;
      index += 1;
      continue;
    }

    if (arg === "--output" && next) {
      args.output = next;
      index += 1;
      continue;
    }

    if (arg === "--limit" && next) {
      args.limit = parsePositiveInteger(next, "--limit");
      index += 1;
      continue;
    }

    if (arg === "--ideas" && next) {
      args.ideas = parsePositiveInteger(next, "--ideas");
      index += 1;
      continue;
    }

    if (arg === "--provider" && next) {
      args.provider = next;
      index += 1;
      continue;
    }

    if (arg === "--model" && next) {
      args.model = next;
      index += 1;
      continue;
    }

    throw new Error(`Unknown or incomplete argument: ${arg}`);
  }

  return args;
}

function parsePositiveInteger(value, label) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    throw new Error(`${label} must be a positive integer.`);
  }

  return number;
}

function printHelp() {
  console.log(`Generate a local startup review file from an input list.

Usage:
  npm run generate:review
  node scripts/generate-startup-review.mjs --input inputs/startups.json --output generated/startups-review.json

Options:
  --input <path>   Startup input JSON. Default: ${DEFAULT_INPUT_FILE}
  --output <path>  Review output JSON. Default: ${DEFAULT_OUTPUT_FILE}
  --limit <n>      Generate only the first n startups.
  --ideas <n>      Ideas per startup. Default: ${DEFAULT_IDEAS_PER_STARTUP}
  --provider <p>   anthropic or openai. Default: FORKIT_LLM_PROVIDER or auto
  --model <model>  Provider model override.
`);
}

function resolveGenerationConfig(args) {
  const provider = normalizeProvider(
    args.provider ??
      process.env.FORKIT_LLM_PROVIDER ??
      inferProviderFromEnv() ??
      DEFAULT_PROVIDER,
  );

  if (provider === "anthropic") {
    return {
      provider,
      model:
        args.model ??
        process.env.FORKIT_ANTHROPIC_MODEL ??
        process.env.CLAUDE_MODEL ??
        process.env.ANTHROPIC_MODEL ??
        DEFAULT_ANTHROPIC_MODEL,
      apiKey: process.env.CLAUDE_API_KEY ?? process.env.ANTHROPIC_API_KEY,
    };
  }

  return {
    provider,
    model:
      args.model ??
      process.env.FORKIT_OPENAI_MODEL ??
      process.env.OPENAI_MODEL ??
      DEFAULT_OPENAI_MODEL,
    apiKey: process.env.OPENAI_API_KEY,
  };
}

function inferProviderFromEnv() {
  if (process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY) {
    return "anthropic";
  }

  if (process.env.OPENAI_API_KEY) {
    return "openai";
  }

  return null;
}

function normalizeProvider(value) {
  const provider = String(value).trim().toLowerCase();

  if (provider !== "anthropic" && provider !== "openai") {
    throw new Error("--provider must be either anthropic or openai.");
  }

  return provider;
}

function getString(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value.trim();
}

function getOptionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function getOptionalStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item) => typeof item === "string" && item.trim());
}

function normalizeInputData(data) {
  if (!data || !Array.isArray(data.startups)) {
    throw new Error("Input file must contain a top-level startups array.");
  }

  return data.startups.map((startup, startupIndex) => {
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

    return {
      name: getString(startup.name, `startups[${startupIndex}].name`),
      description: getString(
        startup.description,
        `startups[${startupIndex}].description`,
      ),
      category,
      amountRaised: getString(
        startup.amountRaised,
        `startups[${startupIndex}].amountRaised`,
      ),
      roundLabel: getString(
        startup.roundLabel,
        `startups[${startupIndex}].roundLabel`,
      ),
      websiteUrl: getOptionalString(startup.websiteUrl),
      sourceUrls: getOptionalStringArray(startup.sourceUrls),
      sourceNotes: getOptionalStringArray(startup.sourceNotes),
    };
  });
}

function createReviewSchema(ideasPerStartup) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["startup"],
    properties: {
      startup: {
        type: "object",
        additionalProperties: false,
        required: [
          "name",
          "description",
          "category",
          "amountRaised",
          "roundLabel",
          "websiteUrl",
          "sourceUrls",
          "sourceSummary",
          "pattern",
          "buildAngle",
          "targetCustomer",
          "starterStack",
          "ideas",
        ],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          category: { type: "string", enum: ["saas", "ai", "marketplace"] },
          amountRaised: { type: "string" },
          roundLabel: { type: "string" },
          websiteUrl: { type: "string" },
          sourceUrls: {
            type: "array",
            items: { type: "string" },
          },
          sourceSummary: { type: "string" },
          pattern: { type: "string" },
          buildAngle: { type: "string" },
          targetCustomer: { type: "string" },
          starterStack: {
            type: "array",
            items: { type: "string" },
          },
          ideas: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "status",
                "title",
                "niche",
                "sortOrder",
                "problem",
                "whyItWorks",
                "mvp",
                "goToMarket",
                "pricing",
                "viabilityScore",
                "evidence",
                "generationModel",
              ],
              properties: {
                status: { type: "string", enum: ["pending"] },
                title: { type: "string" },
                niche: { type: "string" },
                sortOrder: { type: "integer" },
                problem: { type: "string" },
                whyItWorks: { type: "string" },
                mvp: { type: "string" },
                goToMarket: { type: "string" },
                pricing: { type: "string" },
                viabilityScore: { type: "integer" },
                evidence: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["source", "snippet"],
                    properties: {
                      source: { type: "string" },
                      snippet: { type: "string" },
                    },
                  },
                },
                generationModel: { type: "string" },
              },
            },
          },
        },
      },
    },
  };
}

function buildPromptParts(startup, ideasPerStartup, model) {
  return {
    system: [
      "You generate startup fork ideas for Forkit.",
      "The goal is viable solo-founder SaaS or AI opportunities, not generic brainstorming.",
      "Each idea must be a narrower, buildable fork of the startup pattern.",
      "Prefer boring niches with clear budgets, repeated pain, and an MVP that avoids regulated or capital-heavy requirements.",
      "Use only the supplied facts, source URLs, and source notes as evidence handles.",
      "Do not claim you visited URLs. Do not invent funding facts or source URLs.",
      "Every idea starts with status pending because a human reviewer approves it later.",
    ].join(" "),
    user: JSON.stringify(
      {
        requiredOutcome: `Return exactly ${ideasPerStartup} pending ideas for this startup.`,
        successCriteria: [
          "Each idea has a specific buyer or niche.",
          "Each MVP can be built by one technical founder in roughly 2-6 weeks.",
          "Each idea includes a concrete go-to-market path and pricing hypothesis.",
          "Viability score is 1-5, where 5 means clearest buyer, budget, wedge, and low execution risk.",
          "Evidence snippets should summarize the provided source URL or note, not quote long passages.",
        ],
        generationModel: model,
        startup,
      },
      null,
      2,
    ),
  };
}

function buildOpenAIInput(startup, ideasPerStartup, model) {
  const prompt = buildPromptParts(startup, ideasPerStartup, model);

  return [
    {
      role: "system",
      content: prompt.system,
    },
    {
      role: "user",
      content: prompt.user,
    },
  ];
}

async function callLlm({ provider, apiKey, model, startup, ideasPerStartup }) {
  if (provider === "anthropic") {
    return callAnthropic({ apiKey, model, startup, ideasPerStartup });
  }

  return callOpenAI({ apiKey, model, startup, ideasPerStartup });
}

async function callAnthropic({ apiKey, model, startup, ideasPerStartup }) {
  const prompt = buildPromptParts(startup, ideasPerStartup, model);
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 7000,
      system: prompt.system,
      messages: [
        {
          role: "user",
          content: prompt.user,
        },
      ],
      tools: [
        {
          name: "record_startup_review",
          description:
            "Record one startup profile and its generated Forkit review ideas.",
          input_schema: createReviewSchema(ideasPerStartup),
          strict: true,
        },
      ],
      tool_choice: {
        type: "tool",
        name: "record_startup_review",
      },
    }),
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      responseBody?.error?.message ??
      `Anthropic request failed with status ${response.status}.`;
    throw new Error(message);
  }

  const toolUse = responseBody?.content?.find(
    (contentItem) =>
      contentItem?.type === "tool_use" &&
      contentItem?.name === "record_startup_review",
  );

  if (!toolUse?.input) {
    throw new Error("Anthropic response did not include the review tool output.");
  }

  return toolUse.input;
}

async function callOpenAI({ apiKey, model, startup, ideasPerStartup }) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: buildOpenAIInput(startup, ideasPerStartup, model),
      reasoning: { effort: "low" },
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "forkit_startup_review",
          strict: true,
          schema: createReviewSchema(ideasPerStartup),
        },
      },
    }),
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      responseBody?.error?.message ??
      `OpenAI request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return JSON.parse(extractResponseText(responseBody));
}

function extractResponseText(responseBody) {
  if (typeof responseBody?.output_text === "string") {
    return responseBody.output_text;
  }

  const textParts = [];

  for (const outputItem of responseBody?.output ?? []) {
    for (const contentItem of outputItem?.content ?? []) {
      if (typeof contentItem?.text === "string") {
        textParts.push(contentItem.text);
      }
    }
  }

  if (!textParts.length) {
    throw new Error("OpenAI response did not include output text.");
  }

  return textParts.join("");
}

function normalizeGeneratedStartup(
  result,
  sourceStartup,
  startupIndex,
  model,
  ideasPerStartup,
) {
  const startup = result?.startup;

  if (!startup || !Array.isArray(startup.ideas)) {
    throw new Error(`Generated response for ${sourceStartup.name} is invalid.`);
  }

  if (startup.ideas.length !== ideasPerStartup) {
    throw new Error(
      `Generated response for ${sourceStartup.name} returned ${startup.ideas.length} ideas instead of ${ideasPerStartup}.`,
    );
  }

  return {
    name: sourceStartup.name,
    description: getString(startup.description, `${sourceStartup.name}.description`),
    category: sourceStartup.category,
    amountRaised: sourceStartup.amountRaised,
    roundLabel: sourceStartup.roundLabel,
    sortOrder: (startupIndex + 1) * 10,
    websiteUrl: sourceStartup.websiteUrl,
    sourceUrls: sourceStartup.sourceUrls,
    sourceSummary: getString(
      startup.sourceSummary,
      `${sourceStartup.name}.sourceSummary`,
    ),
    pattern: getString(startup.pattern, `${sourceStartup.name}.pattern`),
    buildAngle: getString(
      startup.buildAngle,
      `${sourceStartup.name}.buildAngle`,
    ),
    targetCustomer: getString(
      startup.targetCustomer,
      `${sourceStartup.name}.targetCustomer`,
    ),
    starterStack: getOptionalStringArray(startup.starterStack),
    ideas: startup.ideas.map((idea, ideaIndex) => ({
      status: "pending",
      title: getString(idea.title, `${sourceStartup.name}.ideas[${ideaIndex}].title`),
      niche: getString(idea.niche, `${sourceStartup.name}.ideas[${ideaIndex}].niche`),
      sortOrder: (ideaIndex + 1) * 10,
      problem: getString(
        idea.problem,
        `${sourceStartup.name}.ideas[${ideaIndex}].problem`,
      ),
      whyItWorks: getString(
        idea.whyItWorks,
        `${sourceStartup.name}.ideas[${ideaIndex}].whyItWorks`,
      ),
      mvp: getString(idea.mvp, `${sourceStartup.name}.ideas[${ideaIndex}].mvp`),
      goToMarket: getString(
        idea.goToMarket,
        `${sourceStartup.name}.ideas[${ideaIndex}].goToMarket`,
      ),
      pricing: getString(
        idea.pricing,
        `${sourceStartup.name}.ideas[${ideaIndex}].pricing`,
      ),
      viabilityScore: normalizeViabilityScore(
        idea.viabilityScore,
        `${sourceStartup.name}.ideas[${ideaIndex}].viabilityScore`,
      ),
      evidence: normalizeEvidence(
        idea.evidence,
        sourceStartup,
        `${sourceStartup.name}.ideas[${ideaIndex}].evidence`,
      ),
      generationModel: model,
    })),
  };
}

function normalizeViabilityScore(value, label) {
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error(`${label} must be an integer from 1 to 5.`);
  }

  return value;
}

function normalizeEvidence(value, startup, label) {
  if (!Array.isArray(value) || !value.length) {
    throw new Error(`${label} must contain at least one evidence item.`);
  }

  return value.map((item, itemIndex) => {
    const source = getString(item.source, `${label}[${itemIndex}].source`);
    const snippet = getString(item.snippet, `${label}[${itemIndex}].snippet`);

    if (
      startup.sourceUrls.length &&
      !startup.sourceUrls.includes(source) &&
      !startup.sourceNotes.includes(source)
    ) {
      return {
        source: startup.sourceUrls[0],
        snippet,
      };
    }

    return { source, snippet };
  });
}

async function main() {
  loadLocalEnv();

  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const generationConfig = resolveGenerationConfig(args);

  if (!generationConfig.apiKey) {
    throw new Error(
      `Set ${
        generationConfig.provider === "anthropic"
          ? "CLAUDE_API_KEY or ANTHROPIC_API_KEY"
          : "OPENAI_API_KEY"
      } in .env.local before generating ideas.`,
    );
  }

  if (!existsSync(args.input)) {
    throw new Error(
      `Input file not found: ${args.input}. Start with inputs/startups.example.json.`,
    );
  }

  const inputText = await readFile(args.input, "utf8");
  const inputData = normalizeInputData(JSON.parse(inputText));
  const startups = args.limit ? inputData.slice(0, args.limit) : inputData;

  if (!startups.length) {
    throw new Error("Input file does not contain any startups to generate.");
  }

  const generatedStartups = [];

  for (const [startupIndex, startup] of startups.entries()) {
    console.log(
      `Generating ${args.ideas} ideas for ${startup.name} (${startupIndex + 1}/${startups.length}) with ${generationConfig.provider}/${generationConfig.model}...`,
    );

    const result = await callLlm({
      provider: generationConfig.provider,
      apiKey: generationConfig.apiKey,
      model: generationConfig.model,
      startup,
      ideasPerStartup: args.ideas,
    });

    generatedStartups.push(
      normalizeGeneratedStartup(
        result,
        startup,
        startupIndex,
        generationConfig.model,
        args.ideas,
      ),
    );
  }

  const reviewFile = {
    generatedAt: new Date().toISOString(),
    generationProvider: generationConfig.provider,
    generationModel: generationConfig.model,
    ideasPerStartup: args.ideas,
    reviewInstructions:
      "Change idea.status from pending to approved or rejected. Only approved ideas are imported into Supabase.",
    startups: generatedStartups,
  };

  await mkdir(dirname(args.output), { recursive: true });
  await writeFile(args.output, `${JSON.stringify(reviewFile, null, 2)}\n`);

  console.log(
    `Wrote ${generatedStartups.length} startups to ${args.output}. Review and approve ideas before importing.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
