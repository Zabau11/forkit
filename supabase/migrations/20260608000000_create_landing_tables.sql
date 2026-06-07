create extension if not exists "pgcrypto";

create table if not exists public.startups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  category text not null check (category in ('saas', 'ai', 'marketplace')),
  amount_raised text not null,
  round_label text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.startup_fork_ideas (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startups(id) on delete cascade,
  title text not null,
  niche text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.startup_suggestions (
  id uuid primary key default gen_random_uuid(),
  startup_name text not null check (char_length(startup_name) between 2 and 120),
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.landing_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create index if not exists startups_published_sort_idx
  on public.startups (is_published, sort_order, created_at desc);

create index if not exists startup_fork_ideas_startup_sort_idx
  on public.startup_fork_ideas (startup_id, sort_order);

alter table public.startups enable row level security;
alter table public.startup_fork_ideas enable row level security;
alter table public.startup_suggestions enable row level security;
alter table public.landing_settings enable row level security;

drop policy if exists "Published startups are readable" on public.startups;
create policy "Published startups are readable"
  on public.startups
  for select
  to anon, authenticated
  using (is_published);

drop policy if exists "Published fork ideas are readable" on public.startup_fork_ideas;
create policy "Published fork ideas are readable"
  on public.startup_fork_ideas
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.startups
      where startups.id = startup_fork_ideas.startup_id
        and startups.is_published = true
    )
  );

drop policy if exists "Landing settings are readable" on public.landing_settings;
create policy "Landing settings are readable"
  on public.landing_settings
  for select
  to anon, authenticated
  using (key in ('new_drop_cadence'));

drop policy if exists "Visitors can suggest startups" on public.startup_suggestions;
create policy "Visitors can suggest startups"
  on public.startup_suggestions
  for insert
  to anon, authenticated
  with check (char_length(startup_name) between 2 and 120);
