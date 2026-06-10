import type { StartupDetail } from "@/lib/supabase";

export const featuredStartupDetails: StartupDetail[] = [
  {
    id: "canva",
    slug: "canva",
    name: "Canva",
    description:
      "Browser-based design for everyone, forked into deeper workflows for specific creators with repeated design jobs.",
    category: "saas",
    amountRaised: "$40B",
    roundLabel: "Private valuation",
    sortOrder: 10,
    createdAt: "2026-06-10T00:00:00.000Z",
    pattern:
      "Horizontal design platform with generic templates and tools; underserves power users with role-specific, high-frequency design jobs.",
    buildAngle:
      "Go vertical: build a narrow design tool for one role's recurring design tasks, pre-loaded with industry templates, brand kits, and automation.",
    targetCustomer:
      "Solo professionals and small teams with recurring design needs, such as agents, restaurants, teachers, gyms, and handmade sellers.",
    starterStack: [
      "Next.js",
      "Konva.js or Fabric.js",
      "Cloudinary image transforms",
      "Supabase auth and database",
      "Stripe subscriptions",
    ],
    forkIdeas: [
      {
        id: "canva-listingkit",
        title: "ListingKit - Property listing design tool",
        niche: "real estate agents",
        sortOrder: 10,
        whyItWorks:
          "Agents repeat the same design job for every listing and need flyers, social posts, stories, and open-house assets quickly.",
        mvp: "Property form, photo upload, brand colors, and a ZIP export with six listing assets.",
        goToMarket:
          "DM independent agents on Instagram and partner with one small brokerage for a white-label pilot.",
        pricing: "$29/month for unlimited listing packs; $99/month brokerage plan.",
      },
      {
        id: "canva-menucraft",
        title: "MenuCraft - Weekly menu and specials designer",
        niche: "restaurants",
        sortOrder: 20,
        whyItWorks:
          "Independent restaurants update specials constantly and need print-ready menus plus social assets without opening a general design tool.",
        mvp: "Brand setup, menu-item CMS, weekly specials picker, PDF menu insert, Instagram post, and Facebook image.",
        goToMarket:
          "Cold outreach to restaurants via Google Maps and Instagram with a free first-menu setup.",
        pricing: "$19/month for one location; $39/month for multi-location operators.",
      },
      {
        id: "canva-classkit",
        title: "ClassKit - Classroom visual designer",
        niche: "teachers",
        sortOrder: 30,
        whyItWorks:
          "Teachers already use design tools, but classroom materials need grade-level templates, themes, and education-specific assets.",
        mvp: "Teacher templates, classroom theme system, education asset library, and PDF/PNG exports.",
        goToMarket:
          "Seed teacher influencers before back-to-school season and offer a free export-limited plan.",
        pricing: "$9/month for teachers; $49/month for a small school site license.",
      },
      {
        id: "canva-gymgraphics",
        title: "GymGraphics - Fitness studio asset generator",
        niche: "gyms",
        sortOrder: 40,
        whyItWorks:
          "Studios need daily branded posts for workouts, schedules, challenges, testimonials, and announcements.",
        mvp: "Brand kit plus five form-based templates that generate ready-to-post PNGs.",
        goToMarket:
          "Demo in gym-owner communities and partner with a gym consultant or studio software reseller.",
        pricing: "$25/month per location or $199/year.",
      },
      {
        id: "canva-shopbanner",
        title: "ShopBanner - Etsy listing image suite",
        niche: "handmade sellers",
        sortOrder: 50,
        whyItWorks:
          "Sellers launch products repeatedly, and better listing images have a direct path to better conversion.",
        mvp: "Product photo upload, style kit, listing hero image, callout graphics, shop banner, and ZIP export.",
        goToMarket:
          "Post demos in Etsy seller communities and offer three free product sets to seed reviews.",
        pricing: "$15/month for 20 product sets; $29/month unlimited.",
      },
    ],
  },
  {
    id: "twilio",
    slug: "twilio",
    name: "Twilio",
    description:
      "Developer-first communication APIs, forked into simple vertical messaging tools for non-technical operators.",
    category: "saas",
    amountRaised: "$10B",
    roundLabel: "Public company",
    sortOrder: 20,
    createdAt: "2026-06-10T00:00:00.000Z",
    pattern:
      "Developer-first communication infrastructure with broad APIs, usage pricing, and setup complexity.",
    buildAngle:
      "Strip out the API layer and ship a vertical SaaS with prebuilt workflows, plain-language setup, and flat pricing.",
    targetCustomer:
      "SMB owners in high-touch service industries that need automated customer messaging without hiring a developer.",
    starterStack: [
      "Next.js",
      "Twilio or Vonage API",
      "Supabase",
      "Resend",
      "Stripe",
    ],
    forkIdeas: [
      {
        id: "twilio-textdesk",
        title: "TextDesk - Clinic reminder SMS",
        niche: "clinics",
        sortOrder: 10,
        whyItWorks:
          "No-shows cost clinics real revenue, and office managers need a focused reminder tool rather than a communication API.",
        mvp: "Calendar or CSV import, automated reminders, Yes/No/Reschedule replies, and a daily confirmation dashboard.",
        goToMarket:
          "Cold email independent clinics in a few metros and offer a 30-day no-show reduction pilot.",
        pricing: "$79/month up to 500 SMS; $129/month up to 1,500 SMS.",
      },
      {
        id: "twilio-slotping",
        title: "SlotPing - Salon waitlist SMS",
        niche: "salons",
        sortOrder: 20,
        whyItWorks:
          "A cancellation is immediate lost revenue, and salons can fill it with a simple one-tap waitlist flow.",
        mvp: "Manual waitlist, cancellation trigger, auto-text top contacts, and one-tap booking confirmation.",
        goToMarket:
          "Instagram DMs, local salon groups, and short demo videos aimed at owner-operators.",
        pricing: "$49/month for one salon; $89/month for multi-stylist teams.",
      },
      {
        id: "twilio-followcasa",
        title: "FollowCasa - Real estate SMS follow-ups",
        niche: "real estate agents",
        sortOrder: 30,
        whyItWorks:
          "One closed lead can be worth thousands, so agents can justify a narrow SMS follow-up tool quickly.",
        mvp: "Lead entry, source tags, five-touch SMS drip, reply detection, and a simple inbox.",
        goToMarket:
          "Sell through agent communities, coaches, and search demand around real estate lead follow-up.",
        pricing: "$99/month up to 200 active leads; $179/month up to 600.",
      },
      {
        id: "twilio-pingroute",
        title: "PingRoute - Contractor job updates",
        niche: "home services",
        sortOrder: 40,
        whyItWorks:
          "Home-service customers complain when communication is bad, but small contractors do not need full field-service software.",
        mvp: "Job card, customer phone, on-my-way SMS, job-complete SMS, editable templates, and mobile PWA.",
        goToMarket:
          "Target contractors with weak review mentions around communication and offer a simple reputation fix.",
        pricing: "$39/month up to 5 technicians; $69/month up to 15.",
      },
      {
        id: "twilio-rentping",
        title: "RentPing - Landlord reminder SMS",
        niche: "landlords",
        sortOrder: 50,
        whyItWorks:
          "Independent landlords have monthly recurring communication pain but do not always want payment software.",
        mvp: "Tenant list, rent reminders, late reminders, broadcast messages, and two-way reply inbox.",
        goToMarket:
          "BiggerPockets, landlord communities, and local real estate investor meetups.",
        pricing: "$29/month up to 10 units; $59/month up to 30 units.",
      },
    ],
  },
  {
    id: "workday",
    slug: "workday",
    name: "Workday",
    description:
      "Enterprise HR and people operations software, forked into lightweight vertical workflows for SMB operators.",
    category: "saas",
    amountRaised: "$60B",
    roundLabel: "Public company",
    sortOrder: 30,
    createdAt: "2026-06-10T00:00:00.000Z",
    pattern:
      "Enterprise HR platform with broad workforce workflows that are overbuilt for small teams in regulated or shift-heavy industries.",
    buildAngle:
      "Pick one high-friction HR workflow that repeats constantly, then ship a cheaper pre-configured version for one industry.",
    targetCustomer:
      "SMB operators with 20-300 employees in healthcare, construction, retail, hospitality, or other compliance-heavy verticals.",
    starterStack: [
      "Next.js",
      "Supabase",
      "Resend reminders",
      "PDF generation",
      "Stripe billing",
    ],
    forkIdeas: [
      {
        id: "workday-shiftready",
        title: "ShiftReady - Home care onboarding",
        niche: "home care",
        sortOrder: 10,
        whyItWorks:
          "Home care agencies hire constantly, and missed onboarding steps create operational and compliance risk.",
        mvp: "Checklist builder, document uploads, e-signature, reminder emails, and compliance status dashboard.",
        goToMarket:
          "Cold email state-licensed agency lists and post in home care owner communities.",
        pricing: "$49/month up to 10 aides; $199/month up to 100.",
      },
      {
        id: "workday-permitpeople",
        title: "PermitPeople - Contractor cert tracking",
        niche: "construction",
        sortOrder: 20,
        whyItWorks:
          "Certification deadlines are recurring and expensive to miss, but small contractors need tracking, not enterprise HR.",
        mvp: "Worker records, certification expiry dates, file uploads, 60/30/7-day alerts, and red-yellow-green dashboard.",
        goToMarket:
          "Partner with OSHA training providers and local contractor associations.",
        pricing: "$29/month up to 15 workers; $59/month up to 50.",
      },
      {
        id: "workday-deskmed",
        title: "DeskMed - Practice credential tracker",
        niche: "medical practices",
        sortOrder: 30,
        whyItWorks:
          "Credential lapses can affect revenue, and office managers need renewal visibility without a heavy HR suite.",
        mvp: "Staff credential tracker, document metadata, renewal alerts, and upcoming-renewal dashboard.",
        goToMarket:
          "Reach practice managers through MGMA-style communities and public NPI outreach.",
        pricing: "$59/month up to 10 staff; $99/month up to 25.",
      },
      {
        id: "workday-rosterrun",
        title: "RosterRun - Retail availability scheduler",
        niche: "retail",
        sortOrder: 40,
        whyItWorks:
          "Independent retailers schedule weekly and face seasonal staffing spikes that make per-seat enterprise tools painful.",
        mvp: "Availability form, drag-and-drop schedule grid, published schedule notifications, and shift-swap approvals.",
        goToMarket:
          "Partner with Shopify merchant communities and local retail associations.",
        pricing: "Free up to 8 employees; $39/month up to 20; $69/month up to 40.",
      },
      {
        id: "workday-hireflow",
        title: "HireFlow - Restaurant hiring workflow",
        niche: "restaurants",
        sortOrder: 50,
        whyItWorks:
          "Restaurant groups hire hourly staff repeatedly, and unfilled shifts create obvious revenue pain.",
        mvp: "Candidate pipeline by location, scorecards, offer-letter generation, and owner hiring dashboard.",
        goToMarket:
          "Pilot one location, then expand across multi-location restaurant operators.",
        pricing: "$49/month per location, capped at $199/month for 5+ locations.",
      },
    ],
  },
  {
    id: "stripe",
    slug: "stripe",
    name: "Stripe",
    description:
      "Developer-first payments infrastructure, forked into no-code payment workflows for specific non-technical business owners.",
    category: "saas",
    amountRaised: "$65B",
    roundLabel: "Private valuation",
    sortOrder: 40,
    createdAt: "2026-06-10T00:00:00.000Z",
    pattern:
      "Developer-first horizontal payments platform that needs engineering resources to configure and maintain.",
    buildAngle:
      "Build narrow payment and billing tools on top of payment rails, with templates, auto-reconciliation, and zero setup.",
    targetCustomer:
      "Non-technical small business owners, solo operators, and niche service providers with opinionated payment workflows.",
    starterStack: [
      "Next.js",
      "Stripe API or Lemon Squeezy",
      "Postgres",
      "Resend",
      "Vercel",
    ],
    forkIdeas: [
      {
        id: "stripe-freelanceinvoice",
        title: "FreelanceInvoice - Consultant invoicing",
        niche: "consultants",
        sortOrder: 10,
        whyItWorks:
          "Consultants need branded invoices, reminder rules, and a simple paid/outstanding dashboard without building on an API.",
        mvp: "Invoice builder, Stripe payment link, reminder emails, webhook-paid status, and simple dashboard.",
        goToMarket:
          "Reach fractional executives and consultants through LinkedIn communities and direct outreach.",
        pricing: "$12/month flat or 0.4% of collected volume capped at $30/month.",
      },
      {
        id: "stripe-classpay",
        title: "ClassPay - Instructor enrollment billing",
        niche: "instructors",
        sortOrder: 20,
        whyItWorks:
          "Teachers and coaches need to know who is enrolled and paid before class without reconciling Venmo screenshots.",
        mvp: "Class setup, student sign-up link, Stripe subscriptions, and live roster with paid status.",
        goToMarket:
          "Target yoga, fitness, and music teacher communities with a migrate-from-Venmo setup call.",
        pricing: "$19/month per instructor.",
      },
      {
        id: "stripe-rentcollect",
        title: "RentCollect - ACH rent with late fees",
        niche: "landlords",
        sortOrder: 30,
        whyItWorks:
          "Small landlords have recurring rent collection rules and want automation without a full property-management suite.",
        mvp: "Tenant setup, ACH connection, monthly charge, configurable late fee, and reconciliation PDF.",
        goToMarket:
          "BiggerPockets, landlord communities, and public rental listing outreach.",
        pricing: "$5/unit/month.",
      },
      {
        id: "stripe-eventdeposit",
        title: "EventDeposit - Vendor deposit collection",
        niche: "event vendors",
        sortOrder: 40,
        whyItWorks:
          "Vendors use the same deposit-now, balance-later pattern for every booking and need fewer missed final payments.",
        mvp: "Booking page, deposit percent, balance due date, cancellation terms, card capture, and auto-charge reminders.",
        goToMarket:
          "Sell through wedding vendor groups, Instagram DMs, and planner referral partnerships.",
        pricing: "$29/month flat.",
      },
      {
        id: "stripe-membershipsimple",
        title: "MembershipSimple - Club dues portal",
        niche: "clubs",
        sortOrder: 50,
        whyItWorks:
          "Volunteer treasurers need annual dues collection, receipts, paid/unpaid tracking, and exports with no technical setup.",
        mvp: "Membership tier link, Stripe Checkout, receipt email, PDF membership card, and treasurer CSV export.",
        goToMarket:
          "Target club treasurers through local Facebook groups, hobby subreddits, and association communities.",
        pricing: "1% of dues collected, minimum $10/month and maximum $50/month.",
      },
    ],
  },
  {
    id: "salesforce",
    slug: "salesforce",
    name: "Salesforce",
    description:
      "CRM and sales software, forked into simpler vertical CRMs with industry-specific defaults and fewer moving parts.",
    category: "saas",
    amountRaised: "$200B",
    roundLabel: "Public company",
    sortOrder: 50,
    createdAt: "2026-06-10T00:00:00.000Z",
    pattern:
      "A broad CRM platform with far more configurability than most specific industries need.",
    buildAngle:
      "Pick one underserved vertical, hardcode the pipeline stages and terminology, and make setup work in an afternoon.",
    targetCustomer:
      "Small and mid-market businesses with 2-50 reps that are stuck on spreadsheets or paying for overbuilt CRM software.",
    starterStack: [
      "Next.js",
      "Supabase",
      "Resend",
      "Stripe",
      "Trigger.dev automations",
    ],
    forkIdeas: [
      {
        id: "salesforce-piperoof",
        title: "PipeRoof - Roofing contractor CRM",
        niche: "roofing",
        sortOrder: 10,
        whyItWorks:
          "Roofing jobs are high value, pipeline stages are predictable, and contractors do not want to configure a general CRM.",
        mvp: "Roofing pipeline, job card, claim fields, adjuster details, photo upload, and SMS/email follow-up tasks.",
        goToMarket:
          "Sell through roofing owner communities in storm-heavy markets with a concierge migration offer.",
        pricing: "$99/month up to 5 users; $149/month up to 15 users.",
      },
      {
        id: "salesforce-counselpipe",
        title: "CounselPipe - Small law firm CRM",
        niche: "law firms",
        sortOrder: 20,
        whyItWorks:
          "Small firms lose money when intake follow-up is slow, and legal workflows need matter types, retainers, and conflict checks.",
        mvp: "Legal intake stages, matter type fields, conflict-check reminders, retainer tracking, and follow-up sequences.",
        goToMarket:
          "Use bar association directories, legal VA partnerships, and SEO around legal intake software.",
        pricing: "$79/month solo; $149/month up to 5 users; $249/month up to 10.",
      },
      {
        id: "salesforce-freightdesk",
        title: "FreightDesk - Freight broker CRM",
        niche: "freight brokers",
        sortOrder: 30,
        whyItWorks:
          "Brokers need shipper relationships tied to lanes, quotes, load history, and repeat follow-up.",
        mvp: "Shipper records, lane history, acquisition pipeline, quote history, and CSV import.",
        goToMarket:
          "Target licensed brokers through FMCSA data, freight communities, and new broker education channels.",
        pricing: "$89/month up to 3 users; $159/month up to 8.",
      },
      {
        id: "salesforce-recruitloop",
        title: "RecruitLoop - Independent recruiter CRM",
        niche: "recruiters",
        sortOrder: 40,
        whyItWorks:
          "Recruiters need a three-way relationship between clients, job orders, and candidates that generic CRMs make awkward.",
        mvp: "Client, job order, and candidate objects; job-specific candidate pipeline; fee tracker; outreach templates.",
        goToMarket:
          "Reach independent recruiters on LinkedIn and through recruiter training communities.",
        pricing: "$69/month solo; $129/month up to 3 users; $199/month up to 5.",
      },
      {
        id: "salesforce-medspaflow",
        title: "MedSpaFlow - Med spa lead CRM",
        niche: "med spas",
        sortOrder: 50,
        whyItWorks:
          "Med spas have high-LTV repeat treatments and need lead tracking, rebooking reminders, and attribution visibility.",
        mvp: "Lead pipeline, treatment tags, last-visit date, rebooking reminders, and source attribution report.",
        goToMarket:
          "Use Instagram DMs, med spa owner groups, and a free lead-leak audit offer.",
        pricing: "$129/month per location; $229/month for two locations.",
      },
    ],
  },
  {
    id: "mercury",
    slug: "mercury",
    name: "Mercury",
    description:
      "Modern banking for startups, reworked for overlooked niches that need cash visibility, approvals, and lightweight financial operations more than another generic business account.",
    category: "saas",
    amountRaised: "$250M",
    roundLabel: "Series C",
    sortOrder: 100,
    createdAt: "2026-06-08T00:00:00.000Z",
    pattern:
      "A clean financial command center that wraps banking, cards, transfers, permissions, and cash reporting into one calm operating surface.",
    buildAngle:
      "Do not try to become a bank first. Start as the workflow layer around existing accounts: import balances and transactions, route approvals, forecast cash, and export accountant-ready reports.",
    targetCustomer:
      "Small operators with real money movement, recurring reconciliation pain, and no in-house finance team.",
    starterStack: [
      "Plaid or bank CSV import",
      "Role-based approvals",
      "Cash runway dashboard",
      "Invoice and bill tracker",
      "Monthly close export",
    ],
    forkIdeas: [
      {
        id: "mercury-accounting-firms",
        title: "Banking dashboard for boutique accounting firms",
        niche: "accounting",
        sortOrder: 10,
        whyItWorks:
          "Small firms manage cash questions across many client accounts, but the work still happens in spreadsheets, email, and screenshots.",
        mvp: "Client balance snapshots, transaction review queues, monthly close checklists, and one-click accountant packets.",
        goToMarket:
          "Start with two to five boutique firms that already sell monthly advisory retainers.",
        pricing: "$99-$399 per firm per month, plus client account tiers.",
      },
      {
        id: "mercury-film-crews",
        title: "Cashflow command center for indie film crews",
        niche: "film production",
        sortOrder: 20,
        whyItWorks:
          "Productions burn cash quickly, involve temporary vendors, and need fast visibility by shoot, department, and location.",
        mvp: "Budget envelopes, crew spend approvals, petty cash logs, vendor payout tracking, and daily burn reports.",
        goToMarket:
          "Partner with production accountants and indie producer communities before festival and grant cycles.",
        pricing: "$299-$999 per production, based on budget size and crew seats.",
      },
      {
        id: "mercury-franchise-owners",
        title: "Operating account tools for local franchise owners",
        niche: "local franchise",
        sortOrder: 30,
        whyItWorks:
          "Owners run several locations with separate managers, recurring payroll, vendor bills, and franchise reporting requirements.",
        mvp: "Location-level cash dashboards, bill approvals, vendor payment calendars, and royalty report exports.",
        goToMarket:
          "Pick one franchise category and sell through owner groups, accountants, and local operator meetups.",
        pricing: "$49-$149 per location per month.",
      },
    ],
  },
];
