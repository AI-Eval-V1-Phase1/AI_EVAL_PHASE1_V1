/**
 * Options / Validation values for Vendor COTS Assessment (from Excel Options/Validation column).
 * Used by VendorCotsDynamicStep for select and multiselect fields.
 */

export interface VendorCotsOptionItem {
  label: string
  value: string
}

// ----- Customer Discovery -----
export const VENDOR_COTS_INDUSTRY_SECTOR_OPTIONS: VendorCotsOptionItem[] = [
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
]

export const VENDOR_COTS_BUDGET_RANGE_OPTIONS: VendorCotsOptionItem[] = [
  { label: "Under $100K", value: "Under $100K" },
  { label: "$100K - $250K", value: "$100K - $250K" },
  { label: "$250K - $500K", value: "$250K - $500K" },
  { label: "$500K - $1M", value: "$500K - $1M" },
  { label: "$1M - $2.5M", value: "$1M - $2.5M" },
  { label: "$2.5M - $5M", value: "$2.5M - $5M" },
  { label: "$5M+", value: "$5M+" },
]

export const VENDOR_COTS_IMPLEMENTATION_TIMELINE_OPTIONS: VendorCotsOptionItem[] = [
  { label: "Under 3 months", value: "Under 3 months" },
  { label: "3-6 months", value: "3-6 months" },
  { label: "6-12 months", value: "6-12 months" },
  { label: "12-18 months", value: "12-18 months" },
  { label: "18+ months", value: "18+ months" },
]

// ----- Solution Fit -----
export const VENDOR_COTS_PRODUCT_FEATURES_OPTIONS: VendorCotsOptionItem[] = [
  { label: "Process automation", value: "Process automation" },
  { label: "Document processing", value: "Document processing" },
  { label: "Predictive analytics", value: "Predictive analytics" },
  { label: "Compliance workflows", value: "Compliance workflows" },
  { label: "Integration APIs", value: "Integration APIs" },
  { label: "Reporting & dashboards", value: "Reporting & dashboards" },
  { label: "Custom workflows", value: "Custom workflows" },
  { label: "AI/ML capabilities", value: "AI/ML capabilities" },
  { label: "Other", value: "Other" },
]

export const VENDOR_COTS_IMPLEMENTATION_APPROACH_OPTIONS: VendorCotsOptionItem[] = [
  { label: "Cloud SaaS", value: "Cloud SaaS" },
  { label: "On-premise", value: "On-premise" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "Managed service", value: "Managed service" },
  { label: "Other", value: "Other" },
]

export const VENDOR_COTS_CUSTOMIZATION_LEVEL_OPTIONS: VendorCotsOptionItem[] = [
  { label: "Out of the box (no customization)", value: "Out of the box (no customization)" },
  { label: "Configuration only", value: "Configuration only" },
  { label: "Light customization", value: "Light customization" },
  { label: "Heavy customization", value: "Heavy customization" },
  { label: "Other", value: "Other" },
]

export const VENDOR_COTS_INTEGRATION_COMPLEXITY_OPTIONS: VendorCotsOptionItem[] = [
  { label: "Low (1-2 systems)", value: "Low (1-2 systems)" },
  { label: "Medium (3-5 systems)", value: "Medium (3-5 systems)" },
  { label: "High (6+ systems)", value: "High (6+ systems)" },
  { label: "Very high (legacy/custom)", value: "Very high (legacy/custom)" },
  { label: "Other", value: "Other" },
]

// ----- Customer Risk Context -----
export const VENDOR_COTS_REGULATORY_REQUIREMENTS_OPTIONS: VendorCotsOptionItem[] = [
  { label: "HIPAA", value: "HIPAA" },
  { label: "GDPR", value: "GDPR" },
  { label: "CCPA", value: "CCPA" },
  { label: "SOC 2", value: "SOC 2" },
  { label: "PCI-DSS", value: "PCI-DSS" },
  { label: "FDA (if applicable)", value: "FDA (if applicable)" },
  { label: "Other", value: "Other" },
]

export const VENDOR_COTS_DATA_SENSITIVITY_OPTIONS: VendorCotsOptionItem[] = [
  { label: "Public", value: "Public" },
  { label: "Internal", value: "Internal" },
  { label: "Confidential", value: "Confidential" },
  { label: "Restricted / PII", value: "Restricted / PII" },
  { label: "PHI / HIPAA", value: "PHI / HIPAA" },
  { label: "Financial (PCI)", value: "Financial (PCI)" },
]

export const VENDOR_COTS_RISK_TOLERANCE_OPTIONS: VendorCotsOptionItem[] = [
  { label: "Very low", value: "Very low" },
  { label: "Low", value: "Low" },
  { label: "Moderate", value: "Moderate" },
  { label: "High", value: "High" },
  { label: "Very high", value: "Very high" },
]

// ----- Customer Risk Mitigation -----
export const VENDOR_COTS_CUSTOMER_SPECIFIC_RISKS_OPTIONS: VendorCotsOptionItem[] = [
  { label: "Integration complexity", value: "Integration complexity" },
  { label: "Compliance gaps", value: "Compliance gaps" },
  { label: "User adoption", value: "User adoption" },
  { label: "Data migration", value: "Data migration" },
  { label: "Resource constraints", value: "Resource constraints" },
  { label: "Timeline pressure", value: "Timeline pressure" },
  { label: "Other", value: "Other" },
]

/** Map optionsKey (from form schema) to options array. Used by VendorCotsDynamicStep. */
export const VENDOR_COTS_FIELD_OPTIONS: Record<string, VendorCotsOptionItem[]> = {
  industrySector: VENDOR_COTS_INDUSTRY_SECTOR_OPTIONS,
  budgetRange: VENDOR_COTS_BUDGET_RANGE_OPTIONS,
  implementationTimeline: VENDOR_COTS_IMPLEMENTATION_TIMELINE_OPTIONS,
  productFeatures: VENDOR_COTS_PRODUCT_FEATURES_OPTIONS,
  implementationApproach: VENDOR_COTS_IMPLEMENTATION_APPROACH_OPTIONS,
  customizationLevel: VENDOR_COTS_CUSTOMIZATION_LEVEL_OPTIONS,
  integrationComplexity: VENDOR_COTS_INTEGRATION_COMPLEXITY_OPTIONS,
  regulatoryRequirements: VENDOR_COTS_REGULATORY_REQUIREMENTS_OPTIONS,
  dataSensitivity: VENDOR_COTS_DATA_SENSITIVITY_OPTIONS,
  riskTolerance: VENDOR_COTS_RISK_TOLERANCE_OPTIONS,
  customerSpecificRisks: VENDOR_COTS_CUSTOMER_SPECIFIC_RISKS_OPTIONS,
}

export function getVendorCotsFieldOptions(optionsKey: string): VendorCotsOptionItem[] | undefined {
  return VENDOR_COTS_FIELD_OPTIONS[optionsKey]
}
