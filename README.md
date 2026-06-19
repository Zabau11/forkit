# forkitt

A Next.js landing page for a curated database of VC-backed startups and solo-founder fork ideas.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.local.example` and add your Supabase URL and anon key.

3. Apply the Supabase migration in `supabase/migrations`, then seed with `supabase/seed.sql`.

4. Run the app:

   ```bash
   npm run dev
   ```

## Data Model

The landing page reads from:

- `startups`
- `startup_fork_ideas`
- `landing_settings`

The suggestion form inserts into `startup_suggestions`.

## Review Workflow

Generated ideas are reviewed outside the website.

1. Add a generation API key to `.env.local`.

   Claude is the default:

   ```bash
   FORKIT_LLM_PROVIDER=anthropic
   CLAUDE_API_KEY=your-claude-api-key
   FORKIT_ANTHROPIC_MODEL=claude-sonnet-4-6
   ```

   OpenAI is still supported:

   ```bash
   FORKIT_LLM_PROVIDER=openai
   OPENAI_API_KEY=your-openai-api-key
   ```

2. Copy the startup input example:

   ```bash
   cp inputs/startups.example.json inputs/startups.json
   ```

3. Edit `inputs/startups.json` with the startups you want to generate ideas for.

   The real input file is git-ignored so your research list can stay local.

4. Generate the review file:

   ```bash
   npm run generate:review
   ```

   To test only the first few startups before spending more API credits:

   ```bash
   node scripts/generate-startup-review.mjs --limit 2
   ```

   You can also override the provider or model per run:

   ```bash
   node scripts/generate-startup-review.mjs --provider anthropic --model claude-sonnet-4-6 --limit 2
   ```

   Generated ideas start as `pending` and are not imported into Supabase.

5. Or copy the manual example review file:

   ```bash
   mkdir -p generated
   cp generated-review.example.json generated/startups-review.json
   ```

6. Edit `generated/startups-review.json`.

   Set each idea to one of:

   - `approved`
   - `rejected`
   - `pending`

7. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`.

8. Import approved ideas:

   ```bash
   npm run import:approved
   ```

Only ideas marked `approved` are inserted into Supabase.

The review file can include extra viability context on approved ideas:

- `problem`
- `whyItWorks`
- `mvp`
- `goToMarket`
- `pricing`
- `viabilityScore`
- `evidence`

Rejected ideas are ignored by the import script.
