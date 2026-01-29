

export const EMPLOYEE_COUNTS = [
  {
    label: "1–10",
    value: "1_10"
  },
  {
    label: "11–50",
    value: "11_50"
  },
  {
    label: "51–200",
    value: "51_200"
  },
  {
    label: "201–500",
    value: "201_500"
  },
  {
    label: "501–1,000",
    value: "501_1000"
  },
  {
    label: "1,001–5,000",
    value: "1001_5000"
  },
  {
    label: "5,001–10,000",
    value: "5001_10000"
  },
  {
    label: "10,000+",
    value: "10000_plus"
  }
];



export  const VENDOR_MATURITY_LEVELS = [
    { value: "startup", label: "Startup - Early-stage, innovative solutions" },
    { value: "growth_stage", label: "Growth Stage - Scaling customer base" },
    { value: "established", label: "Established - Proven track record" },
    {
      value: "enterprise",
      label: "Enterprise - Large-scale global operations",
    },
  ];

 export  const VENDOR_TYPES = [
    {
      value: "ai_product_company",
      label: "AI Product Company",
    },
    {
      value: "ai_platform_provider",
      label: "AI Platform Provider",
    },
    {
      value: "ai_enabled_saas",
      label: "AI-Enabled SaaS",
    },
    {
      value: "system_integrator",
      label: "System Integrator",
    },
    {
      value: "technology_vendor_with_ai_features",
      label: "Technology Vendor with AI Features",
    },
  ];


  export const INDUSTRY_SECTORS = [
  {
    label: "Public Sector",
    options: [
      { label: "Federal Government (US)", value: "federal_us" },
      { label: "State Government (US)", value: "state_us" },
      { label: "Local Government (US)", value: "local_us" },
      { label: "International Governments", value: "international_government" },
      { label: "Educational Institutions (Public)", value: "education_public" },
      { label: "Public Healthcare Systems", value: "public_healthcare" },
      { label: "Public Utilities", value: "public_utilities" },
      { label: "Defense & Military", value: "defense_military" },
      { label: "Law Enforcement & Emergency Services", value: "law_emergency" }
    ]
  },
  {
    label: "Private Sector",
    options: [
      { label: "Healthcare", value: "healthcare_private" },
      { label: "Finance & Banking", value: "finance_banking" },
      { label: "Insurance", value: "insurance" },
      { label: "GovTech", value: "govtech" },
      { label: "Manufacturing", value: "manufacturing" },
      { label: "Retail & E-commerce", value: "retail_ecommerce" },
      { label: "Technology & Software", value: "technology_software" },
      { label: "Telecommunications", value: "telecom" },
      { label: "Energy & Utilities", value: "energy_utilities" },
      { label: "Transportation & Logistics", value: "transport_logistics" },
      { label: "Real Estate & Construction", value: "real_estate_construction" },
      { label: "Professional Services", value: "professional_services" },
      { label: "Media & Entertainment", value: "media_entertainment" },
      { label: "Hospitality & Tourism", value: "hospitality_tourism" },
      { label: "Agriculture & Food Production", value: "agriculture_food" },
      { label: "Pharmaceuticals & Biotechnology", value: "pharma_biotech" },
      { label: "Automotive", value: "automotive" },
      { label: "Aerospace & Defense (Private)", value: "aerospace_defense_private" },
      { label: "Chemical & Materials", value: "chemical_materials" },
      { label: "Consumer Goods", value: "consumer_goods" },
      { label: "Unknown", value: "unknown" }
    ]
  },
  {
    label: "Non-Profit",
    options: [
      { label: "Educational Institutions (Non-Profit)", value: "education_nonprofit" },
      { label: "Healthcare (Non-Profit)", value: "healthcare_nonprofit" },
      { label: "Social Services", value: "social_services" },
      { label: "Arts & Culture", value: "arts_culture" },
      { label: "Environmental & Conservation", value: "environment_conservation" },
      { label: "International Development & Relief", value: "intl_development_relief" },
      { label: "Advocacy & Civil Rights", value: "advocacy_civil_rights" },
      { label: "Religious Organizations", value: "religious_orgs" },
      { label: "Research & Think Tanks", value: "research_thinktanks" },
      { label: "Foundations & Grantmaking", value: "foundations_grants" },
      { label: "Community Development", value: "community_development" }
    ]
  }
];


export const  VENDOR_MATURITY_STAGE = [
  {
    label: "Startup (Pre-Seed/Seed)",
    value: "startup_pre_seed_seed"
  },
  {
    label: "Early Stage (Series A)",
    value: "early_stage_series_a"
  },
  {
    label: "Growth Stage (Series B/C)",
    value: "growth_stage_series_bc"
  },
  {
    label: "Established (Series D+/Pre-IPO)",
    value: "established_series_d_pre_ipo"
  },
  {
    label: "Publicly Traded",
    value: "publicly_traded"
  },
  {
    label: "Mature Private Company",
    value: "mature_private_company"
  },
  {
    label: "Bootstrapped / Self-Funded",
    value: "bootstrapped_self_funded"
  }
];


export const PRIMARY_CONTACT_ROLE  = [
  {
    label: "Chief Executive Officer (CEO)",
    value: "chief_executive_officer_ceo"
  },
  {
    label: "Chief Technology Officer (CTO)",
    value: "chief_technology_officer_cto"
  },
  {
    label: "Chief Product Officer (CPO)",
    value: "chief_product_officer_cpo"
  },
  {
    label: "VP Engineering",
    value: "vp_engineering"
  },
  {
    label: "VP Product",
    value: "vp_product"
  },
  {
    label: "VP Sales",
    value: "vp_sales"
  },
  {
    label: "Director of Engineering",
    value: "director_of_engineering"
  },
  {
    label: "Director of Product",
    value: "director_of_product"
  },
  {
    label: "Product Manager",
    value: "product_manager"
  },
  {
    label: "Sales Executive",
    value: "sales_executive"
  },
  {
    label: "Other",
    value: "other"
  }
];



export const  HEADQUARTERS_LOCATION  = [
  {
    label: "United States",
    value: "united_states"
  },
  {
    label: "Canada",
    value: "canada"
  },
  {
    label: "United Kingdom",
    value: "united_kingdom"
  },
  {
    label: "Germany",
    value: "germany"
  },
  {
    label: "France",
    value: "france"
  },
  {
    label: "Netherlands",
    value: "netherlands"
  },
  {
    label: "Switzerland",
    value: "switzerland"
  },
  {
    label: "Sweden",
    value: "sweden"
  },
  {
    label: "Denmark",
    value: "denmark"
  },
  {
    label: "Ireland",
    value: "ireland"
  },
  {
    label: "Australia",
    value: "australia"
  },
  {
    label: "Singapore",
    value: "singapore"
  },
  {
    label: "Japan",
    value: "japan"
  },
  {
    label: "South Korea",
    value: "south_korea"
  },
  {
    label: "India",
    value: "india"
  },
  {
    label: "Israel",
    value: "israel"
  },
  {
    label: "Other (Specify)",
    value: "other"
  }
];


export const OPERATING_REGIONS = [
  {
    label: "North America",
    value: "north_america"
  },
  {
    label: "Europe (EU)",
    value: "europe_eu"
  },
  {
    label: "Europe (Non-EU)",
    value: "europe_non_eu"
  },
  {
    label: "United Kingdom",
    value: "united_kingdom"
  },
  {
    label: "Asia-Pacific",
    value: "asia_pacific"
  },
  {
    label: "Middle East",
    value: "middle_east"
  },
  {
    label: "Africa",
    value: "africa"
  },
  {
    label: "Latin America",
    value: "latin_america"
  },
  {
    label: "Global (All regions)",
    value: "global"
  }
];



