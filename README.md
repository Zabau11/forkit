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
