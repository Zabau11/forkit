alter table public.startups
  add column if not exists slug text,
  add column if not exists website_url text,
  add column if not exists source_urls text[] not null default '{}',
  add column if not exists source_summary text,
  add column if not exists pattern text,
  add column if not exists build_angle text,
  add column if not exists target_customer text,
  add column if not exists starter_stack text[] not null default '{}',
  add column if not exists enriched_at timestamptz;

update public.startups
set slug = regexp_replace(
  regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g'),
  '(^-|-$)',
  '',
  'g'
)
where slug is null;

alter table public.startups
  alter column slug set not null;

create unique index if not exists startups_slug_key
  on public.startups (slug);

alter table public.startup_fork_ideas
  add column if not exists problem text,
  add column if not exists why_it_works text,
  add column if not exists mvp text,
  add column if not exists go_to_market text,
  add column if not exists pricing text,
  add column if not exists viability_score smallint
    check (viability_score between 1 and 5),
  add column if not exists evidence jsonb not null default '[]'::jsonb,
  add column if not exists generation_model text,
  add column if not exists generated_at timestamptz;

create unique index if not exists startup_fork_ideas_startup_title_key
  on public.startup_fork_ideas (startup_id, title);

create index if not exists startup_fork_ideas_viability_idx
  on public.startup_fork_ideas (viability_score desc, sort_order)
  where viability_score is not null;
