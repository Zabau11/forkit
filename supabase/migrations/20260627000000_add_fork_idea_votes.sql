alter table public.startup_fork_ideas
  add column if not exists upvotes integer not null default 0
    check (upvotes >= 0),
  add column if not exists downvotes integer not null default 0
    check (downvotes >= 0);

update public.startup_fork_ideas
set upvotes = greatest(upvotes, 0),
    downvotes = greatest(downvotes, 0);

create or replace function public.adjust_fork_idea_vote(
  idea_id uuid,
  upvote_delta integer,
  downvote_delta integer
)
returns table (
  upvotes integer,
  downvotes integer
)
language sql
security definer
set search_path = public
as $$
  update public.startup_fork_ideas
  set upvotes = greatest(0, startup_fork_ideas.upvotes + upvote_delta),
      downvotes = greatest(0, startup_fork_ideas.downvotes + downvote_delta)
  where id = idea_id
    and exists (
      select 1
      from public.startups
      where startups.id = startup_fork_ideas.startup_id
        and startups.is_published = true
    )
  returning startup_fork_ideas.upvotes, startup_fork_ideas.downvotes;
$$;

grant execute on function public.adjust_fork_idea_vote(uuid, integer, integer)
  to anon, authenticated;
