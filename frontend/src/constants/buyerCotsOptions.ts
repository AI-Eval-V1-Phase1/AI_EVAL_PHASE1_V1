/** Options for dropdown and multiselect fields in Buyer COTS Assessment (aligned with typical Excel/spec) */

export type OptionItem = { label: string; value: string };

export const INDUSTRY_SECTOR_OPTIONS: OptionItem[] = [
  { label: "Healthcare", value: "Healthcare" },
  { label: "Finance & Banking", value: "Finance & Banking" },
  { label: "Insurance", value: "Insurance" },
  { label: "Government", value: "Government" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Retail & E-commerce", value: "Retail & E-commerce" },
  { label: "Technology & Software", value: "Technology & Software" },
  { label: "Telecommunications", value: "Telecommunications" },
  { label: "Energy & Utilities", value: "Energy & Utilities" },
  { label: "Transportation & Logistics", value: "Transportation & Logistics" },
  { label: "Professional Services", value: "Professional Services" },
  { label: "Education", value: "Education" },
  { label: "Other", value: "Other" },
];

export const EMPLOYEE_COUNT_OPTIONS: OptionItem[] = [
  { label: "1-50", value: "1-50" },
  { label: "51-200", value: "51-200" },
  { label: "201-500", value: "201-500" },
  { label: "501-1,000", value: "501-1,000" },
  { label: "1,001-5,000", value: "1,001-5,000" },
  { label: "5,001-10,000", value: "5,001-10,000" },
  { label: "10,000+", value: "10,000+" },
];

export const OPERATING_REGIONS_OPTIONS: OptionItem[] = [
  { label: "North America (US & Canada)", value: "North America (US & Canada)" },
  { label: "United States Only", value: "United States Only" },
  { label: "European Union", value: "European Union" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Asia-Pacific", value: "Asia-Pacific" },
  { label: "Middle East", value: "Middle East" },
  { label: "Latin America", value: "Latin America" },
  { label: "Africa", value: "Africa" },
  { label: "Global", value: "Global" },
];

export const OWNING_DEPARTMENT_OPTIONS: OptionItem[] = [
  { label: "Information Technology (IT)", value: "Information Technology (IT)" },
  { label: "Data & Analytics", value: "Data & Analytics" },
  { label: "Operations", value: "Operations" },
  { label: "Product & Engineering", value: "Product & Engineering" },
  { label: "Customer Service", value: "Customer Service" },
  { label: "Finance", value: "Finance" },
  { label: "Legal & Compliance", value: "Legal & Compliance" },
  { label: "Risk Management", value: "Risk Management" },
  { label: "Other", value: "Other" },
];

export const BUDGET_RANGE_OPTIONS: OptionItem[] = [
  { label: "Under $100K", value: "Under $100K" },
  { label: "$100K - $250K", value: "$100K - $250K" },
  { label: "$250K - $500K", value: "$250K - $500K" },
  { label: "$500K - $1M", value: "$500K - $1M" },
  { label: "$1M - $2.5M", value: "$1M - $2.5M" },
  { label: "$2.5M - $5M", value: "$2.5M - $5M" },
  { label: "$5M+", value: "$5M+" },
];

export const TARGET_TIMELINE_OPTIONS: OptionItem[] = [
  { label: "Under 3 months", value: "Under 3 months" },
  { label: "3-6 months", value: "3-6 months" },
  { label: "6-12 months", value: "6-12 months" },
  { label: "12-18 months", value: "12-18 months" },
  { label: "18+ months", value: "18+ months" },
];

export const CRITICALITY_OPTIONS: OptionItem[] = [
  { label: "Critical", value: "Critical" },
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

export const INTEGRATION_SYSTEMS_OPTIONS: OptionItem[] = [
  { label: "EHR / EMR", value: "EHR / EMR" },
  { label: "ERP", value: "ERP" },
  { label: "CRM", value: "CRM" },
  { label: "HRIS", value: "HRIS" },
  { label: "Claims / Billing", value: "Claims / Billing" },
  { label: "Data Warehouse / Lake", value: "Data Warehouse / Lake" },
  { label: "Identity / SSO", value: "Identity / SSO" },
  { label: "Document Management", value: "Document Management" },
  { label: "Other", value: "Other" },
];

export const TECH_STACK_OPTIONS: OptionItem[] = [
  { label: "Cloud (AWS)", value: "Cloud (AWS)" },
  { label: "Cloud (Azure)", value: "Cloud (Azure)" },
  { label: "Cloud (GCP)", value: "Cloud (GCP)" },
  { label: "On-premise", value: "On-premise" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "SaaS-first", value: "SaaS-first" },
  { label: "Legacy / Mainframe", value: "Legacy / Mainframe" },
  { label: "Other", value: "Other" },
];

export const MATURITY_LEVEL_OPTIONS: OptionItem[] = [
  { label: "Initial / Ad hoc", value: "Initial / Ad hoc" },
  { label: "Developing", value: "Developing" },
  { label: "Defined", value: "Defined" },
  { label: "Managed", value: "Managed" },
  { label: "Optimizing", value: "Optimizing" },
];

export const YES_NO_OPTIONS: OptionItem[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "In progress", value: "In progress" },
];

export const IMPLEMENTATION_TEAM_OPTIONS: OptionItem[] = [
  { label: "IT / Engineering", value: "IT / Engineering" },
  { label: "Data / Analytics", value: "Data / Analytics" },
  { label: "Product", value: "Product" },
  { label: "Operations", value: "Operations" },
  { label: "Compliance / Legal", value: "Compliance / Legal" },
  { label: "Business / Domain", value: "Business / Domain" },
  { label: "External vendor support", value: "External vendor support" },
  { label: "Other", value: "Other" },
];

export const DATA_SENSITIVITY_OPTIONS: OptionItem[] = [
  { label: "Public", value: "Public" },
  { label: "Internal", value: "Internal" },
  { label: "Confidential", value: "Confidential" },
  { label: "Restricted / PII", value: "Restricted / PII" },
  { label: "PHI / HIPAA", value: "PHI / HIPAA" },
  { label: "Financial (PCI)", value: "Financial (PCI)" },
];

export const REGULATORY_OPTIONS: OptionItem[] = [
  { label: "HIPAA", value: "HIPAA" },
  { label: "GDPR", value: "GDPR" },
  { label: "CCPA", value: "CCPA" },
  { label: "SOC 2", value: "SOC 2" },
  { label: "PCI-DSS", value: "PCI-DSS" },
  { label: "FDA (if applicable)", value: "FDA (if applicable)" },
  { label: "Other", value: "Other" },
];

export const RISK_APPETITE_OPTIONS: OptionItem[] = [
  { label: "Very low", value: "Very low" },
  { label: "Low", value: "Low" },
  { label: "Moderate", value: "Moderate" },
  { label: "High", value: "High" },
  { label: "Very high", value: "Very high" },
];

export const DECISION_STAKES_OPTIONS: OptionItem[] = [
  { label: "Low (reversible, limited impact)", value: "Low (reversible, limited impact)" },
  { label: "Medium (operational impact)", value: "Medium (operational impact)" },
  { label: "High (strategic or financial)", value: "High (strategic or financial)" },
  { label: "Critical (safety, legal, reputational)", value: "Critical (safety, legal, reputational)" },
];

export const IMPACTED_STAKEHOLDERS_OPTIONS: OptionItem[] = [
  { label: "Employees", value: "Employees" },
  { label: "Customers", value: "Customers" },
  { label: "Patients (Healthcare)", value: "Patients (Healthcare)" },
  { label: "Partners / Vendors", value: "Partners / Vendors" },
  { label: "Regulators", value: "Regulators" },
  { label: "Public", value: "Public" },
  { label: "Other", value: "Other" },
];

export const VENDOR_VALIDATION_OPTIONS: OptionItem[] = [
  { label: "POC / Pilot", value: "POC / Pilot" },
  { label: "Third-party assessment", value: "Third-party assessment" },
  { label: "Internal security review", value: "Internal security review" },
  { label: "Reference checks", value: "Reference checks" },
  { label: "Certification review", value: "Certification review" },
  { label: "Other", value: "Other" },
];

export const SECURITY_POSTURE_OPTIONS: OptionItem[] = [
  { label: "Strong", value: "Strong" },
  { label: "Adequate", value: "Adequate" },
  { label: "Needs improvement", value: "Needs improvement" },
  { label: "Unknown", value: "Unknown" },
];

export const VENDOR_CERTIFICATIONS_OPTIONS: OptionItem[] = [
  { label: "SOC 2 Type II", value: "SOC 2 Type II" },
  { label: "ISO 27001", value: "ISO 27001" },
  { label: "HIPAA BAA", value: "HIPAA BAA" },
  { label: "FedRAMP", value: "FedRAMP" },
  { label: "GDPR compliance", value: "GDPR compliance" },
  { label: "Other", value: "Other" },
];

export const PILOT_ROLLOUT_OPTIONS: OptionItem[] = [
  { label: "Yes, planned", value: "Yes, planned" },
  { label: "Yes, in progress", value: "Yes, in progress" },
  { label: "No", value: "No" },
  { label: "Not yet decided", value: "Not yet decided" },
];

export const ROLLBACK_OPTIONS: OptionItem[] = [
  { label: "Full rollback capability", value: "Full rollback capability" },
  { label: "Partial / phased rollback", value: "Partial / phased rollback" },
  { label: "Limited", value: "Limited" },
  { label: "None", value: "None" },
];

export const CHANGE_MANAGEMENT_OPTIONS: OptionItem[] = [
  { label: "Yes, formal plan", value: "Yes, formal plan" },
  { label: "Yes, informal", value: "Yes, informal" },
  { label: "In development", value: "In development" },
  { label: "No", value: "No" },
];

export const MONITORING_AVAILABILITY_OPTIONS: OptionItem[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Partial", value: "Partial" },
  { label: "Unknown", value: "Unknown" },
];
