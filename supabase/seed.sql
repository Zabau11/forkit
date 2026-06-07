insert into public.landing_settings (key, value)
values ('new_drop_cadence', 'weekly')
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

insert into public.startups (
  id,
  name,
  description,
  category,
  amount_raised,
  round_label,
  sort_order,
  is_published
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Notion',
    'All-in-one workspace for notes, wikis, and project management. Built for everyone, which means it is perfectly built for no one in particular.',
    'saas',
    '$343M',
    'Series C',
    10,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Linear',
    'Issue tracking and project management for software teams. Beautifully designed, but assumes every team looks like a Silicon Valley startup.',
    'saas',
    '$52M',
    'Series B',
    20,
    true
  )
on conflict (id) do update
set name = excluded.name,
    description = excluded.description,
    category = excluded.category,
    amount_raised = excluded.amount_raised,
    round_label = excluded.round_label,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published;

insert into public.startup_fork_ideas (
  id,
  startup_id,
  title,
  niche,
  sort_order
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    'Patient intake wikis for solo GPs',
    'healthcare',
    10
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '11111111-1111-4111-8111-111111111111',
    'Job-site documentation for contractors',
    'construction',
    20
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    '11111111-1111-4111-8111-111111111111',
    'Church membership and sermon notes hub',
    'faith communities',
    30
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
    '11111111-1111-4111-8111-111111111111',
    'Band setlist and rehearsal planner',
    'music',
    40
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '22222222-2222-4222-8222-222222222222',
    'Bug tracker for boutique law firms',
    'legal',
    10
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '22222222-2222-4222-8222-222222222222',
    'Campaign task tracker for local politicians',
    'politics',
    20
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
    '22222222-2222-4222-8222-222222222222',
    'Renovation punch-list tool for architects',
    'architecture',
    30
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4',
    '22222222-2222-4222-8222-222222222222',
    'Production tracker for indie game studios',
    'gaming',
    40
  )
on conflict (id) do update
set startup_id = excluded.startup_id,
    title = excluded.title,
    niche = excluded.niche,
    sort_order = excluded.sort_order;
