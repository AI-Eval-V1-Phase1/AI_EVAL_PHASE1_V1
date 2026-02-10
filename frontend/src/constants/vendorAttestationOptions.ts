/**
 * Options / Validation values for Vendor Self Attestation (Sheet 1).
 * Used by attestation form components; fetch by section and field key.
 */
export interface OptionItem {
  label: string;
  value: string;
}

// ----- Product Profile -----
export const PURCHASE_DECISION_MAKERS_OPTIONS: OptionItem[] = [
  { label: "IT / Technology Leadership", value: "IT / Technology Leadership" },
  { label: "Data & Analytics", value: "Data & Analytics" },
  { label: "Product / Engineering", value: "Product / Engineering" },
  { label: "Operations", value: "Operations" },
  { label: "Procurement", value: "Procurement" },
  { label: "Legal & Compliance", value: "Legal & Compliance" },
  { label: "Executive (C-Suite)", value: "Executive (C-Suite)" },
  { label: "Business Unit Leaders", value: "Business Unit Leaders" },
  { label: "Other", value: "Other" },
];

// ----- AI Technical Capabilities -----
export const AI_CAPABILITIES_OPTIONS: OptionItem[] = [
  { label: "Natural Language Processing (NLP)", value: "Natural Language Processing (NLP)" },
  { label: "Computer Vision", value: "Computer Vision" },
  { label: "Predictive Analytics", value: "Predictive Analytics" },
  { label: "Generative AI / LLMs", value: "Generative AI / LLMs" },
  { label: "Recommendation Engines", value: "Recommendation Engines" },
  { label: "Automation / RPA", value: "Automation / RPA" },
  { label: "Speech Recognition", value: "Speech Recognition" },
  { label: "Other", value: "Other" },
];

export const AI_MODEL_TYPES_OPTIONS: OptionItem[] = [
  { label: "Proprietary / In-house", value: "Proprietary / In-house" },
  { label: "Third-party / Licensed", value: "Third-party / Licensed" },
  { label: "Open Source", value: "Open Source" },
  { label: "Fine-tuned / Custom", value: "Fine-tuned / Custom" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "Other", value: "Other" },
];

export const MODEL_TRANSPARENCY_OPTIONS: OptionItem[] = [
  { label: "Full transparency (model cards, documentation)", value: "Full transparency (model cards, documentation)" },
  { label: "Partial (high-level documentation)", value: "Partial (high-level documentation)" },
  { label: "Limited (inputs/outputs only)", value: "Limited (inputs/outputs only)" },
  { label: "Black box (no disclosure)", value: "Black box (no disclosure)" },
];

export const DECISION_AUTONOMY_OPTIONS: OptionItem[] = [
  { label: "Fully autonomous", value: "Fully autonomous" },
  { label: "Human-in-the-loop (review required)", value: "Human-in-the-loop (review required)" },
  { label: "Human-on-the-loop (override available)", value: "Human-on-the-loop (override available)" },
  { label: "Assistive only (recommendations)", value: "Assistive only (recommendations)" },
  { label: "Other", value: "Other" },
];

// ----- Compliance & Certifications -----
export const SECURITY_CERTIFICATIONS_OPTIONS: OptionItem[] = [
  { label: "SOC 2 Type II", value: "SOC 2 Type II" },
  { label: "ISO 27001", value: "ISO 27001" },
  { label: "HIPAA", value: "HIPAA" },
  { label: "FedRAMP", value: "FedRAMP" },
  { label: "GDPR compliant", value: "GDPR compliant" },
  { label: "PCI-DSS", value: "PCI-DSS" },
  { label: "Other", value: "Other" },
];

export const ASSESSMENT_COMPLETION_LEVEL_OPTIONS: OptionItem[] = [
  { label: "Self-assessed", value: "Self-assessed" },
  { label: "Third-party audited", value: "Third-party audited" },
  { label: "Certified", value: "Certified" },
  { label: "In progress", value: "In progress" },
];

// ----- Data Handling & Privacy -----
export const PII_HANDLING_OPTIONS: OptionItem[] = [
  { label: "None", value: "None" },
  { label: "Low (non-identifying only)", value: "Low (non-identifying only)" },
  { label: "Medium (standard PII)", value: "Medium (standard PII)" },
  { label: "High (sensitive/health/financial)", value: "High (sensitive/health/financial)" },
];

export const DATA_RESIDENCY_OPTIONS_OPTIONS: OptionItem[] = [
  { label: "US only", value: "US only" },
  { label: "EU only", value: "EU only" },
  { label: "UK only", value: "UK only" },
  { label: "Region of choice", value: "Region of choice" },
  { label: "Multi-region", value: "Multi-region" },
  { label: "Other", value: "Other" },
];

export const DATA_RETENTION_DELETION_OPTIONS: OptionItem[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

// ----- AI Safety & Testing -----
export const BIAS_TESTING_APPROACH_OPTIONS: OptionItem[] = [
  { label: "Demographic parity checks", value: "Demographic parity checks" },
  { label: "Fairness metrics (e.g., equalized odds)", value: "Fairness metrics (e.g., equalized odds)" },
  { label: "Third-party audit", value: "Third-party audit" },
  { label: "Internal testing only", value: "Internal testing only" },
  { label: "Other", value: "Other" },
];

export const ADVERSARIAL_SECURITY_TESTING_OPTIONS: OptionItem[] = [
  { label: "Yes, completed", value: "Yes, completed" },
  { label: "In progress", value: "In progress" },
  { label: "Planned", value: "Planned" },
  { label: "No", value: "No" },
];

export const HUMAN_OVERSIGHT_OPTIONS: OptionItem[] = [
  { label: "Pre-deployment review", value: "Pre-deployment review" },
  { label: "Post-decision review", value: "Post-decision review" },
  { label: "Escalation path", value: "Escalation path" },
  { label: "Override capability", value: "Override capability" },
  { label: "Other", value: "Other" },
];

export const TRAINING_DATA_DOCUMENTATION_OPTIONS: OptionItem[] = [
  { label: "Fully documented", value: "Fully documented" },
  { label: "Partially documented", value: "Partially documented" },
  { label: "Limited documentation", value: "Limited documentation" },
  { label: "Not documented", value: "Not documented" },
];

// ----- Operations & Reliability -----
export const UPTIME_SLA_OPTIONS: OptionItem[] = [
  { label: "99.9%", value: "99.9%" },
  { label: "99.95%", value: "99.95%" },
  { label: "99.99%", value: "99.99%" },
  { label: "Other", value: "Other" },
];

export const INCIDENT_RESPONSE_PLAN_OPTIONS: OptionItem[] = [
  { label: "Documented and tested", value: "Documented and tested" },
  { label: "Documented", value: "Documented" },
  { label: "In development", value: "In development" },
  { label: "None", value: "None" },
];

export const ROLLBACK_CAPABILITY_OPTIONS: OptionItem[] = [
  { label: "Full rollback supported", value: "Full rollback supported" },
  { label: "Partial rollback", value: "Partial rollback" },
  { label: "Limited", value: "Limited" },
  { label: "None", value: "None" },
];

// ----- Deployment Architecture -----
export const HOSTING_DEPLOYMENT_OPTIONS: OptionItem[] = [
  { label: "Cloud (AWS)", value: "Cloud (AWS)" },
  { label: "Cloud (Azure)", value: "Cloud (Azure)" },
  { label: "Cloud (GCP)", value: "Cloud (GCP)" },
  { label: "On-premise", value: "On-premise" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "SaaS", value: "SaaS" },
  { label: "Other", value: "Other" },
];

export const DEPLOYMENT_SCALE_OPTIONS: OptionItem[] = [
  { label: "Single tenant", value: "Single tenant" },
  { label: "Multi-tenant", value: "Multi-tenant" },
  { label: "Enterprise scale", value: "Enterprise scale" },
  { label: "Other", value: "Other" },
];

export const PRODUCT_STAGE_OPTIONS: OptionItem[] = [
  { label: "Beta", value: "Beta" },
  { label: "GA", value: "GA" },
  { label: "Mature", value: "Mature" },
  { label: "Legacy", value: "Legacy" },
];

// ----- Evidence & Supporting Documentation -----
export const INTERACTION_DATA_AVAILABLE_OPTIONS: OptionItem[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Partial", value: "Partial" },
];

export const AUDIT_LOGS_AVAILABLE_OPTIONS: OptionItem[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Partial", value: "Partial" },
];

export const TESTING_RESULTS_AVAILABLE_OPTIONS: OptionItem[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Partial", value: "Partial" },
];

/** Map: payload key -> options (for dropdown or multiselect). Used by AttestationDynamicStep. */
export const ATTESTATION_FIELD_OPTIONS: Record<string, OptionItem[]> = {
  purchase_decision_makers: PURCHASE_DECISION_MAKERS_OPTIONS,
  ai_capabilities: AI_CAPABILITIES_OPTIONS,
  ai_model_types: AI_MODEL_TYPES_OPTIONS,
  model_transparency: MODEL_TRANSPARENCY_OPTIONS,
  decision_autonomy: DECISION_AUTONOMY_OPTIONS,
  security_certifications: SECURITY_CERTIFICATIONS_OPTIONS,
  assessment_completion_level: ASSESSMENT_COMPLETION_LEVEL_OPTIONS,
  pii_handling: PII_HANDLING_OPTIONS,
  data_residency_options: DATA_RESIDENCY_OPTIONS_OPTIONS,
  data_retention_policy: DATA_RETENTION_DELETION_OPTIONS,
  bias_testing_approach: BIAS_TESTING_APPROACH_OPTIONS,
  adversarial_security_testing: ADVERSARIAL_SECURITY_TESTING_OPTIONS,
  human_oversight: HUMAN_OVERSIGHT_OPTIONS,
  training_data_documentation: TRAINING_DATA_DOCUMENTATION_OPTIONS,
  uptime_sla: UPTIME_SLA_OPTIONS,
  incident_response_plan: INCIDENT_RESPONSE_PLAN_OPTIONS,
  rollback_capability: ROLLBACK_CAPABILITY_OPTIONS,
  hosting_deployment: HOSTING_DEPLOYMENT_OPTIONS,
  deployment_scale: DEPLOYMENT_SCALE_OPTIONS,
  product_stage: PRODUCT_STAGE_OPTIONS,
  interaction_data_available: INTERACTION_DATA_AVAILABLE_OPTIONS,
  audit_logs_available: AUDIT_LOGS_AVAILABLE_OPTIONS,
  testing_results_available: TESTING_RESULTS_AVAILABLE_OPTIONS,
};

/**
 * Get options for an attestation field by payload key (Sheet 1 Options / Validation).
 * Returns undefined for free-text fields.
 */
export function getAttestationFieldOptions(fieldKey: string): OptionItem[] | undefined {
  return ATTESTATION_FIELD_OPTIONS[fieldKey];
}
