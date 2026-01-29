export const BUYER_INDUSTRY_SECTORS = [
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
      { label: "Law Enforcement & Emergency Services", value: "law_emergency" },
    ],
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
      {
        label: "Real Estate & Construction",
        value: "real_estate_construction",
      },
      { label: "Professional Services", value: "professional_services" },
      { label: "Media & Entertainment", value: "media_entertainment" },
      { label: "Hospitality & Tourism", value: "hospitality_tourism" },
      { label: "Agriculture & Food Production", value: "agriculture_food" },
      { label: "Pharmaceuticals & Biotechnology", value: "pharma_biotech" },
      { label: "Automotive", value: "automotive" },
      {
        label: "Aerospace & Defense (Private)",
        value: "aerospace_defense_private",
      },
      { label: "Chemical & Materials", value: "chemical_materials" },
      { label: "Consumer Goods", value: "consumer_goods" },
      { label: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Non-Profit",
    options: [
      {
        label: "Educational Institutions (Non-Profit)",
        value: "education_nonprofit",
      },
      { label: "Healthcare (Non-Profit)", value: "healthcare_nonprofit" },
      { label: "Social Services", value: "social_services" },
      { label: "Arts & Culture", value: "arts_culture" },
      {
        label: "Environmental & Conservation",
        value: "environment_conservation",
      },
      {
        label: "International Development & Relief",
        value: "international_development",
      },
      { label: "Advocacy & Civil Rights", value: "advocacy_civil_rights" },
      { label: "Religious Organizations", value: "religious_organizations" },
      { label: "Research & Think Tanks", value: "research_thinktanks" },
      { label: "Foundations & Grantmaking", value: "foundations_grantmaking" },
      { label: "Community Development", value: "community_development" },
    ],
  },
];

export const BUYER_PRIMARY_ROLE = [
  { label: "Chief Executive Officer (CEO)", value: "ceo" },
  { label: "Chief Operating Officer (COO)", value: "coo" },
  { label: "Chief Technology Officer (CTO)", value: "cto" },
  { label: "Chief Information Officer (CIO)", value: "cio" },
  { label: "Chief Data Officer (CDO)", value: "cdo" },
  { label: "VP of Technology/Engineering", value: "vp_technology_engineering" },
  { label: "VP of Operations", value: "vp_operations" },
  { label: "VP of Product", value: "vp_product" },
  { label: "Director of IT/Technology", value: "director_it_technology" },
  { label: "Director of Data/Analytics", value: "director_data_analytics" },
  { label: "Director of Operations", value: "director_operations" },
  { label: "Product Manager", value: "product_manager" },
  { label: "Project Manager", value: "project_manager" },
  { label: "IT Manager", value: "it_manager" },
  { label: "Business Analyst", value: "business_analyst" },
  { label: "Other", value: "other" },
];

export const BUYER_DEPARTMENTS = [
  { label: "Information Technology (IT)", value: "information_technology_it" },
  { label: "Data & Analytics", value: "data_analytics" },
  { label: "Operations", value: "operations" },
  { label: "Product & Engineering", value: "product_engineering" },
  {
    label: "Clinical Operations (Healthcare)",
    value: "clinical_operations_healthcare",
  },
  {
    label: "Claims Processing (Insurance)",
    value: "claims_processing_insurance",
  },
  { label: "Customer Service", value: "customer_service" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "Finance", value: "finance" },
  { label: "Human Resources", value: "human_resources" },
  { label: "Legal & Compliance", value: "legal_compliance" },
  { label: "Risk Management", value: "risk_management" },
  { label: "Research & Development", value: "research_development" },
  { label: "Business Operations", value: "business_operations" },
  { label: "Multiple Departments", value: "multiple_departments" },
  { label: "Other", value: "other" },
];

export const BUYER_EMPLOYEE_COUNTS = [
  { label: "1-50", value: "1_50" },
  { label: "51-200", value: "51_200" },
  { label: "201-500", value: "201_500" },
  { label: "501-1,000", value: "501_1000" },
  { label: "1,001-2,500", value: "1001_2500" },
  { label: "2,501-5,000", value: "2501_5000" },
  { label: "5,001-10,000", value: "5001_10000" },
  { label: "10,001-25,000", value: "10001_25000" },
  { label: "25,001-50,000", value: "25001_50000" },
  { label: "50,000+", value: "50000_plus" },
];

export const BUYER_ANNUAL_REVENUE = [
  { label: "Less than $1M", value: "less_than_1m" },
  { label: "$1M - $10M", value: "1m_10m" },
  { label: "$10M - $50M", value: "10m_50m" },
  { label: "$50M - $100M", value: "50m_100m" },
  { label: "$100M - $500M", value: "100m_500m" },
  { label: "$500M - $1B", value: "500m_1b" },
  { label: "$1B - $5B", value: "1b_5b" },
  { label: "$5B - $10B", value: "5b_10b" },
  { label: "$10B+", value: "10b_plus" },
  {
    label: "Not Applicable (Government/Non-Profit)",
    value: "not_applicable_gov_nonprofit",
  },
];

export const BUYER_HEADQUARTERS_LOCATION = [
  { label: "United States", value: "united_states" },
  { label: "Canada", value: "canada" },
  { label: "United Kingdom", value: "united_kingdom" },
  { label: "Germany", value: "germany" },
  { label: "France", value: "france" },
  { label: "Netherlands", value: "netherlands" },
  { label: "Switzerland", value: "switzerland" },
  { label: "Sweden", value: "sweden" },
  { label: "Denmark", value: "denmark" },
  { label: "Ireland", value: "ireland" },
  { label: "Australia", value: "australia" },
  { label: "Singapore", value: "singapore" },
  { label: "Japan", value: "japan" },
  { label: "South Korea", value: "south_korea" },
  { label: "India", value: "india" },
  { label: "Israel", value: "israel" },
  { label: "China", value: "china" },
  { label: "UAE", value: "uae" },
  { label: "Other (specify)", value: "other" },
];

export const BUYER_OPERATING_REGIONS = [
  { label: "North America (US & Canada)", value: "north_america_us_canada" },
  { label: "United States Only", value: "united_states_only" },
  { label: "European Union", value: "european_union" },
  { label: "United Kingdom", value: "united_kingdom" },
  { label: "Europe (Non-EU)", value: "europe_non_eu" },
  { label: "Asia-Pacific", value: "asia_pacific" },
  { label: "China", value: "china" },
  { label: "Middle East", value: "middle_east" },
  { label: "Africa", value: "africa" },
  { label: "Latin America", value: "latin_america" },
  { label: "Global", value: "global" },
];

export const BUYER_DATA_RESIDENCY_REQUIREMENTS = [
  { label: "No specific requirements", value: "no_specific_requirements" },
  { label: "Must remain in home country", value: "home_country_only" },
  { label: "EU (GDPR)", value: "eu_gdpr" },
  { label: "United States", value: "united_states" },
  { label: "United Kingdom", value: "united_kingdom" },
  { label: "China (localization law)", value: "china_localization_law" },
  { label: "Switzerland", value: "switzerland" },
  { label: "Australia", value: "australia" },
  { label: "Canada", value: "canada" },
  {
    label: "Multi-region with restrictions",
    value: "multi_region_with_restrictions",
  },
  {
    label: "Specific state/province requirements",
    value: "state_province_specific",
  },
];
export const BUYER_EXISTING_AI_INITIATIVES = [
  { label: "No AI usage currently", value: "no_ai_usage" },
  { label: "Exploring/Researching AI", value: "exploring_ai" },
  { label: "Pilot projects (1-2)", value: "pilot_projects_1_2" },
  {
    label: "Limited production deployment (3-5 AI systems)",
    value: "limited_production_3_5",
  },
  {
    label: "Moderate production deployment (6-10 AI systems)",
    value: "moderate_production_6_10",
  },
  {
    label: "Extensive AI deployment (10+ AI systems)",
    value: "extensive_ai_10_plus",
  },
  { label: "AI-native organization", value: "ai_native_organization" },
];

export const BUYER_AI_GOVERNANCE_MATURITY = [
  { label: "None (No formal AI governance policies)", value: "none" },
  { label: "Basic (Documented AI policies exist)", value: "basic" },
  {
    label: "Intermediate (AI policies with oversight committee)",
    value: "intermediate",
  },
  {
    label: "Advanced (Comprehensive AI governance with board oversight)",
    value: "advanced",
  },
  {
    label: "Optimized (Data-driven AI governance culture)",
    value: "optimized",
  },
];

export const BUYER_DATA_GOVERNANCE_MATURITY = [
  { label: "Ad-hoc (Minimal or no formal data policies)", value: "ad_hoc" },
  { label: "Defined (Basic data policies documented)", value: "defined" },
  {
    label: "Managed (Data policies enforced with monitoring)",
    value: "managed",
  },
  {
    label: "Optimized (Comprehensive data governance program)",
    value: "optimized",
  },
  {
    label: "Excellent (Industry-leading data governance)",
    value: "excellent",
  },
];

export const BUYER_AI_SKILLS_AVAILABILITY = [
  { label: "None (No AI/ML expertise)", value: "none" },
  { label: "Limited (1-2 individuals with AI/ML skills)", value: "limited" },
  {
    label: "Moderate (3-5 person AI/ML team)",
    value: "moderate",
  },
  {
    label: "Strong (5-10 person AI/ML team)",
    value: "strong",
  },
  {
    label: "Expert (10+ person AI/ML team)",
    value: "expert",
  },
];

export const BUYER_CHANGE_MANAGEMENT_CAPABILITY = [
  { label: "None (No formal change management)", value: "none" },
  { label: "Ad-hoc (Informal change management)", value: "ad_hoc" },
  { label: "Basic (Documented change processes)", value: "basic" },
  {
    label: "Intermediate (Structured change management program)",
    value: "intermediate",
  },
  {
    label: "Advanced (Mature change management capability)",
    value: "advanced",
  },
  {
    label: "Excellent (Industry-leading change management)",
    value: "excellent",
  },
];

export const BUYER_PRIMARY_REGULATORY_FRAMEWORKS = [
  { label: "None/Minimal regulation", value: "none_minimal" },
  { label: "HIPAA", value: "hipaa" },
  { label: "HITRUST", value: "hitrust" },
  { label: "FDA", value: "fda" },
  { label: "GLBA (Gramm-Leach-Bliley Act)", value: "glba" },
  { label: "PCI DSS", value: "pci_dss" },
  { label: "SOX (Sarbanes-Oxley)", value: "sox" },
  { label: "GDPR", value: "gdpr" },
  { label: "CCPA/CPRA", value: "ccpa_cpra" },
  { label: "FedRAMP", value: "fedramp" },
  { label: "StateRAMP", value: "stateramp" },
  { label: "NIST frameworks", value: "nist_frameworks" },
  { label: "ISO 27001", value: "iso_27001" },
  { label: "SOC 2", value: "soc_2" },
  { label: "Industry-specific regulations", value: "industry_specific" },
  { label: "Other", value: "other" },
];

export const BUYER_REGULATORY_PENALTY_EXPOSURE = [
  { label: "Minimal (Less than $100K)", value: "minimal" },
  { label: "Low ($100K - $1M)", value: "low" },
  { label: "Medium ($1M - $10M)", value: "medium" },
  { label: "High ($10M - $100M)", value: "high" },
  { label: "Severe ($100M+)", value: "severe" },
];


export const BUYER_DATA_CLASSIFICATION_LEVELS_HANDLED = [
  { label: "Public", value: "public" },
  { label: "Internal/Confidential", value: "internal_confidential" },
  { label: "Confidential/Business-Sensitive", value: "confidential_business_sensitive" },
  { label: "Restricted (PHI/PII/Financial)", value: "restricted_phi_pii_financial" },
  { label: "Regulated (Government/National Security)", value: "regulated_government_national_security" }
];

export const BUYER_PII_SENSITIVE_DATA_HANDLING = [
  { label: "None (No PII handled)", value: "none" },
  { label: "Minimal (Limited identifiers only)", value: "minimal" },
  { label: "Moderate (Standard personal data)", value: "moderate" },
  { label: "Extensive (Detailed personal profiles)", value: "extensive" },
  { label: "Critical (PHI/Financial data)", value: "critical" },
  { label: "Highly Sensitive (Special category: biometric/genetic/health)", value: "highly_sensitive" }
];


export const BUYER_EXISTING_TECHNOLOGY_STACK = [
      { label: "Cloud (AWS)", value: "cloud_aws" },
  { label: "Cloud (Azure)", value: "cloud_azure" },
  { label: "Cloud (Google Cloud Platform)", value: "cloud_gcp" },
  { label: "Cloud (Other)", value: "cloud_other" },
  { label: "On-Premises Infrastructure", value: "on_premises" },
  { label: "Hybrid Cloud", value: "hybrid_cloud" },
  { label: "Legacy Mainframe Systems", value: "legacy_mainframe" },
  { label: "Modern Microservices Architecture", value: "microservices_architecture" },
  { label: "Monolithic Applications", value: "monolithic_applications" },
  { label: "SaaS Applications", value: "saas_applications" },
  { label: "Custom-Built Systems", value: "custom_built_systems" },
  { label: "Third-Party Integrations", value: "third_party_integrations" },
  { label: "API-First Architecture", value: "api_first_architecture" },
  { label: "Not Sure/Need Assessment", value: "not_sure" }

];


export const BUYER_AI_RISK_APPETITE = [
  { label: "Conservative (Minimize risk, extensive controls)", value: "conservative" },
  { label: "Moderate (Balance risk and innovation)", value: "moderate" },
  { label: "Aggressive (Accept higher risk for faster innovation)", value: "aggressive" },
  { label: "Risk-Seeking (Pioneering, willing to accept significant risk)", value: "risk_seeking" }
];



export const  BUYER_ACCEPTABLE_RISK_LEVEL = [
  { label: "Very Low (0-25)", value: "very_low" },
  { label: "Low (26-40)", value: "low" },
  { label: "Medium (41-60)", value: "medium" },
  { label: "High (61-75)", value: "high" },
  { label: "Very High (76-100)", value: "very_high" }
];


