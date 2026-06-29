insert into public.startups (
  id,
  slug,
  name,
  description,
  category,
  amount_raised,
  round_label,
  sort_order,
  is_published,
  website_url,
  source_urls,
  source_summary,
  pattern,
  build_angle,
  target_customer,
  starter_stack,
  enriched_at
)
values
  (
    '33333333-3333-4333-8333-333333333333',
    'mercury',
    'Mercury',
    'Banking and financial operations for startups and small businesses.',
    'finance',
    '$300M',
    'Series C',
    10,
    true,
    'https://mercury.com',
    array[
      'https://mercury.com',
      'https://techcrunch.com/2025/03/26/fintech-mercury-lands-300m-in-sequoia-led-series-c-doubles-valuation-to-3-5b/'
    ],
    'Mercury provides banking services and financial workflows for startups and small businesses. Its 2025 Series C was reported at $300M.',
    'A banking command center that combines accounts, cards, bill pay, permissions, and cash visibility for startup operators.',
    'Start as a workflow layer around existing bank accounts, then niche down by customer type and operational reporting needs.',
    'Small operators that move money weekly, need approvals, and lack an internal finance team.',
    array[
      'Bank import',
      'Cash dashboard',
      'Approval workflow',
      'Bill tracker',
      'Monthly exports'
    ],
    now()
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'ramp',
    'Ramp',
    'Corporate cards, expense management, bill pay, procurement, and finance automation for businesses.',
    'finance',
    '$300M',
    '2025 financing',
    20,
    true,
    'https://ramp.com',
    array[
      'https://ramp.com',
      'https://www.bloomberg.com/news/articles/2025-11-17/ramp-hits-32-billion-valuation-in-lightspeed-led-funding'
    ],
    'Ramp sells spend management software around corporate cards, expense management, bill pay, procurement, and automation. Its 2025 financing was reported at a $32B valuation.',
    'A spend-control operating system that turns company purchasing into policies, approvals, card controls, and accounting-ready exports.',
    'Start with expense intake and approval workflows for one narrow buyer before adding payments or cards.',
    'Teams with frequent purchases, messy approvals, and a finance owner who needs controls without enterprise software.',
    array[
      'Expense intake',
      'Approval policies',
      'Vendor tracker',
      'Receipt capture',
      'Accounting exports'
    ],
    now()
  )
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    category = excluded.category,
    amount_raised = excluded.amount_raised,
    round_label = excluded.round_label,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published,
    website_url = excluded.website_url,
    source_urls = excluded.source_urls,
    source_summary = excluded.source_summary,
    pattern = excluded.pattern,
    build_angle = excluded.build_angle,
    target_customer = excluded.target_customer,
    starter_stack = excluded.starter_stack,
    enriched_at = excluded.enriched_at;

insert into public.startup_fork_ideas (
  id,
  startup_id,
  title,
  niche,
  sort_order,
  problem,
  why_it_works,
  mvp,
  go_to_market,
  pricing,
  viability_score,
  evidence,
  generation_model,
  generated_at
)
values
  (
    'c3333333-3333-4333-8333-333333333331',
    '33333333-3333-4333-8333-333333333333',
    'Cash dashboard for boutique accounting firms',
    'accounting',
    10,
    'Small accounting firms answer client cash questions through screenshots, exports, and ad hoc spreadsheets.',
    'The buyer already owns monthly close and cash advisory work, so better visibility saves billable time and supports higher-retainer services.',
    'Client balance snapshots, transaction review queues, monthly close checklists, and owner-ready cash packets.',
    'Sell to boutique firms that already offer monthly advisory retainers and onboard their first five clients manually.',
    '$99-$399 per firm per month, plus client account tiers.',
    5,
    $$[
      {
        "source": "https://mercury.com",
        "snippet": "Mercury positions itself around banking and financial workflows for startups."
      }
    ]$$::jsonb,
    'manual-seed',
    now()
  ),
  (
    'c3333333-3333-4333-8333-333333333332',
    '33333333-3333-4333-8333-333333333333',
    'Production cash tracker for indie film crews',
    'film production',
    20,
    'Film crews move money quickly across locations, departments, temporary workers, and vendors.',
    'The workflow is urgent, budget-bound, and recurring across productions, but too small for enterprise production accounting tools.',
    'Budget envelopes, petty cash logs, vendor payout tracking, crew reimbursements, and daily burn reports.',
    'Partner with production accountants and independent producer groups before grant and festival cycles.',
    '$299-$999 per production.',
    4,
    $$[
      {
        "source": "https://mercury.com",
        "snippet": "Mercury combines accounts, payments, cards, and cash visibility."
      }
    ]$$::jsonb,
    'manual-seed',
    now()
  ),
  (
    'c3333333-3333-4333-8333-333333333333',
    '33333333-3333-4333-8333-333333333333',
    'Restricted-fund tracker for small nonprofits',
    'nonprofits',
    30,
    'Small nonprofits need to know which cash can actually be spent against restricted grants and donor funds.',
    'They have serious compliance pressure but rarely have a finance director or nonprofit ERP budget.',
    'Fund buckets, grant spend tracking, approval notes, board-ready cash reports, and exportable audit trails.',
    'Reach nonprofit bookkeepers, fiscal sponsors, and grant writers who already see the reporting pain.',
    '$79-$249 per organization per month.',
    5,
    $$[
      {
        "source": "https://mercury.com",
        "snippet": "Banking workflow patterns can be narrowed to specialized cash reporting needs."
      }
    ]$$::jsonb,
    'manual-seed',
    now()
  ),
  (
    'c3333333-3333-4333-8333-333333333334',
    '33333333-3333-4333-8333-333333333333',
    'Multi-location cash controls for franchise owners',
    'local franchise',
    40,
    'Franchise owners juggle several locations, managers, recurring vendor bills, payroll timing, and royalty reporting.',
    'The customer has repeated operating cash questions across locations and values simple controls more than banking novelty.',
    'Location-level dashboards, bill approvals, manager spend limits, vendor calendars, and royalty export reports.',
    'Start with one franchise category and sell through owner communities and franchise-focused accountants.',
    '$49-$149 per location per month.',
    4,
    $$[
      {
        "source": "https://mercury.com",
        "snippet": "Mercury-style cash visibility can be packaged around operator permissions and reporting."
      }
    ]$$::jsonb,
    'manual-seed',
    now()
  ),
  (
    'c3333333-3333-4333-8333-333333333335',
    '33333333-3333-4333-8333-333333333333',
    'Clinic cashflow board for independent practices',
    'healthcare',
    50,
    'Independent clinics deal with delayed reimbursements, patient payments, payroll, and vendor bills without much finance staff.',
    'Cash timing is painful and recurring, and practice managers need visibility before they need sophisticated banking.',
    'Receivables aging, expected deposit tracking, bill reminders, owner approvals, and payroll runway views.',
    'Lead with practice managers and healthcare bookkeepers serving small clinics.',
    '$199-$499 per clinic per month.',
    4,
    $$[
      {
        "source": "https://mercury.com",
        "snippet": "Banking dashboards can be forked into operational cashflow tools for narrow verticals."
      }
    ]$$::jsonb,
    'manual-seed',
    now()
  ),
  (
    'c4444444-4444-4444-8444-444444444441',
    '44444444-4444-4444-8444-444444444444',
    'Expense approvals for construction subcontractors',
    'construction',
    10,
    'Subcontractors buy materials constantly, but approvals, receipts, and job-cost coding are often handled after the fact.',
    'The spend is frequent, field-driven, and tied to specific jobs, making a focused workflow immediately useful.',
    'Job-coded purchase requests, foreman approvals, receipt capture, vendor spend limits, and QuickBooks exports.',
    'Sell through construction bookkeepers and subcontractor associations.',
    '$99-$299 per company per month.',
    5,
    $$[
      {
        "source": "https://ramp.com",
        "snippet": "Ramp bundles corporate cards, expense management, bill pay, procurement, and automation."
      }
    ]$$::jsonb,
    'manual-seed',
    now()
  ),
  (
    'c4444444-4444-4444-8444-444444444442',
    '44444444-4444-4444-8444-444444444444',
    'Procurement intake for dental groups',
    'healthcare',
    20,
    'Small dental groups buy supplies, lab services, equipment repairs, and local services across multiple offices.',
    'They have repeated purchase approval needs but do not want full enterprise procurement software.',
    'Office purchase requests, preferred vendor lists, budget approvals, invoice matching, and monthly spend reports.',
    'Start with dental office managers and dental-focused fractional CFOs.',
    '$149-$499 per group per month.',
    4,
    $$[
      {
        "source": "https://ramp.com",
        "snippet": "Ramp includes procurement and bill-pay workflows that can be narrowed to vertical purchasing."
      }
    ]$$::jsonb,
    'manual-seed',
    now()
  ),
  (
    'c4444444-4444-4444-8444-444444444443',
    '44444444-4444-4444-8444-444444444444',
    'Spend controls for nonprofit field teams',
    'nonprofits',
    30,
    'Field teams at small nonprofits spend across programs, grants, and locations, then reconcile manually.',
    'Grant reporting creates a strong need for spend controls and clean exports, but budgets are too small for enterprise suites.',
    'Program budgets, spend requests, receipt collection, restricted-fund tags, and grant-ready exports.',
    'Reach nonprofit operations managers through bookkeepers and grant compliance consultants.',
    '$79-$249 per organization per month.',
    5,
    $$[
      {
        "source": "https://ramp.com",
        "snippet": "Spend management patterns translate well to budget and approval-heavy teams."
      }
    ]$$::jsonb,
    'manual-seed',
    now()
  ),
  (
    'c4444444-4444-4444-8444-444444444444',
    '44444444-4444-4444-8444-444444444444',
    'Vendor spend tracker for boutique hotels',
    'hospitality',
    40,
    'Boutique hotels buy across maintenance, food, cleaning, events, and guest services with local vendor sprawl.',
    'The operator needs purchasing control by property and department more than a generic corporate card product.',
    'Department budgets, vendor approvals, maintenance purchase logs, receipt capture, and owner reporting.',
    'Sell to independent hotel operators and hospitality accountants.',
    '$99-$399 per property per month.',
    4,
    $$[
      {
        "source": "https://ramp.com",
        "snippet": "Ramp-style expense controls can be focused on property-level purchasing workflows."
      }
    ]$$::jsonb,
    'manual-seed',
    now()
  ),
  (
    'c4444444-4444-4444-8444-444444444445',
    '44444444-4444-4444-8444-444444444444',
    'Policy assistant for remote creative agencies',
    'creative agencies',
    50,
    'Remote agencies have project expenses, contractors, subscriptions, client pass-through costs, and weak approval habits.',
    'Agencies already understand margin leakage and can adopt a lightweight policy and receipt workflow quickly.',
    'Project-coded requests, subscription reviews, contractor reimbursements, receipt capture, and client-billable exports.',
    'Launch with agency operators and fractional CFOs who sell profitability cleanups.',
    '$49-$199 per agency per month.',
    4,
    $$[
      {
        "source": "https://ramp.com",
        "snippet": "Expense policies and automation can be narrowed into agency project-spend workflows."
      }
    ]$$::jsonb,
    'manual-seed',
    now()
  )
on conflict (startup_id, title) do update
set niche = excluded.niche,
    sort_order = excluded.sort_order,
    problem = excluded.problem,
    why_it_works = excluded.why_it_works,
    mvp = excluded.mvp,
    go_to_market = excluded.go_to_market,
    pricing = excluded.pricing,
    viability_score = excluded.viability_score,
    evidence = excluded.evidence,
    generation_model = excluded.generation_model,
    generated_at = excluded.generated_at;
