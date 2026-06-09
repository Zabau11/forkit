# forkit

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

1. Copy the example review file:

   ```bash
   mkdir -p generated
   cp generated-review.example.json generated/startups-review.json
   ```

2. Edit `generated/startups-review.json`.

   Set each idea to either:

   - `approved`
   - `rejected`

3. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`.

4. Import approved ideas:

   ```bash
   npm run import:approved
   ```

Only ideas marked `approved` are inserted into Supabase.
