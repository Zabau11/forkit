alter table public.startups
  drop constraint if exists startups_category_check;

alter table public.startups
  add constraint startups_category_check
  check (
    category in (
      'finance',
      'productivity',
      'devtools',
      'workforce',
      'data',
      'automation',
      'commerce',
      'marketplaces',
      'logistics',
      'ai-ops',
      'communications',
      'education',
      'real-estate'
    )
  ) not valid;

update public.startups
set category = case slug
  when 'notion' then 'productivity'
  when 'linear' then 'productivity'
  when 'mercury' then 'finance'
  when 'ramp' then 'finance'
  when 'stripe' then 'finance'
  when 'dropbox' then 'productivity'
  when 'gusto' then 'workforce'
  when 'coinbase' then 'finance'
  when 'instacart' then 'marketplaces'
  when 'doordash' then 'logistics'
  when 'gitlab' then 'devtools'
  when 'brex' then 'finance'
  when 'retool' then 'devtools'
  when 'deel' then 'workforce'
  when 'zapier' then 'automation'
  when 'segment' then 'data'
  when 'amplitude' then 'data'
  when 'webflow' then 'commerce'
  when 'flexport' then 'logistics'
  when 'rippling' then 'workforce'
  when 'scale-ai' then 'ai-ops'
  when 'faire' then 'marketplaces'
  when 'whatnot' then 'marketplaces'
  when 'heroku' then 'devtools'
  when 'salesforce' then 'productivity'
  when 'workday' then 'workforce'
  when 'twilio' then 'communications'
  when 'shopify' then 'commerce'
  when 'datadog' then 'devtools'
  when 'duolingo' then 'education'
  when 'perplexity' then 'ai-ops'
  when 'airbnb' then 'marketplaces'
  when 'zillow' then 'real-estate'
  else case category
    when 'saas' then 'productivity'
    when 'ai' then 'ai-ops'
    when 'marketplace' then 'marketplaces'
    else category
  end
end;

alter table public.startups
  validate constraint startups_category_check;
