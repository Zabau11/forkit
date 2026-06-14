alter table public.startup_fork_ideas
  add column if not exists review_status text not null default 'approved'
    check (review_status in ('pending', 'approved', 'rejected')),
  add column if not exists review_notes text,
  add column if not exists is_published boolean not null default true,
  add column if not exists is_featured boolean not null default false,
  add column if not exists reviewed_at timestamptz;

update public.startup_fork_ideas
set
  review_status = coalesce(review_status, 'approved'),
  is_published = coalesce(is_published, true),
  reviewed_at = coalesce(reviewed_at, now())
where reviewed_at is null;

create index if not exists startup_fork_ideas_review_idx
  on public.startup_fork_ideas (review_status, is_published, created_at desc);

drop policy if exists "Published fork ideas are readable" on public.startup_fork_ideas;
create policy "Published fork ideas are readable"
  on public.startup_fork_ideas
  for select
  to anon, authenticated
  using (
    is_published
    and review_status = 'approved'
    and exists (
      select 1
      from public.startups
      where startups.id = startup_fork_ideas.startup_id
        and startups.is_published = true
    )
  );
