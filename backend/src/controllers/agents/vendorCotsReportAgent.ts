import "dotenv/config";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const REGION = process.env.AWS_DEFAULT_REGION || "us-east-1";
const MODEL_ID = process.env.BEDROCK_VENDOR_COTS_MODEL_ID || "us.anthropic.claude-haiku-4-5-20251001-v1:0";

const client = new BedrockRuntimeClient({ region: REGION });

export interface GeneratedVendorCotsReport {
  overallRiskScore: number;
  riskLevel: string;
  summary: string;
  keyRisks: string[];
  recommendations: string[];
  raw?: string;
}

const VENDOR_COTS_REPORT_PROMPT = `You are a risk analyst. Using ONLY the vendor COTS (Commercial Off-The-Shelf) assessment data provided below, generate a structured Customer Risk Assessment report.

Output the report in the following sections with clear headings. Use the exact section titles below.

## 0. Risk Score
- **Overall Risk Score:** [0-100] (higher = higher risk)
- **Risk Level:** [Low | Moderate | High]
- **Summary:** 2–4 sentences summarizing the overall risk posture for this customer engagement, considering sector, data sensitivity, regulatory requirements, identified risks, and mitigation. Note main strengths and any residual risks.

## 1. Key Risks
List 3–6 key risks as bullet points. Each line: "- [risk description]". Base these on: identified_risks, customer_specific_risks, data_sensitivity, regulatory_requirements, integration_complexity, and risk_domain_scores if provided.

## 2. Recommendations
List 3–6 actionable recommendations as bullet points. Each line: "- [recommendation]". Focus on implementation, compliance, mitigation, and vendor-customer alignment.

Use only the data provided; if a field is empty or "Not specified", say so or infer conservatively. Be concise and professional.
`;

function buildAssessmentContext(payload: Record<string, unknown>): string {
  const toStr = (v: unknown): string => {
    if (v == null) return "Not specified";
    if (Array.isArray(v)) return v.length ? v.map(toStr).join(", ") : "Not specified";
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  };
  const lines: string[] = [
    "--- Vendor COTS Assessment Data ---",
    `Customer organization: ${toStr(payload.customer_organization_name ?? payload.customerOrganizationName)}`,
    `Customer sector: ${toStr(payload.customer_sector ?? payload.customerSector)}`,
    `Primary pain point: ${toStr(payload.primary_pain_point ?? payload.primaryPainPoint)}`,
    `Expected outcomes: ${toStr(payload.expected_outcomes ?? payload.expectedOutcomes)}`,
    `Customer budget range: ${toStr(payload.customer_budget_range ?? payload.customerBudgetRange)}`,
    `Implementation timeline: ${toStr(payload.implementation_timeline ?? payload.implementationTimeline)}`,
    `Product features: ${toStr(payload.product_features ?? payload.productFeatures)}`,
    `Implementation approach: ${toStr(payload.implementation_approach ?? payload.implementationApproach)}`,
    `Customization level: ${toStr(payload.customization_level ?? payload.customizationLevel)}`,
    `Integration complexity: ${toStr(payload.integration_complexity ?? payload.integrationComplexity)}`,
    `Regulatory requirements: ${toStr(payload.regulatory_requirements ?? payload.regulatoryRequirements)}`,
    `Regulatory requirements (other): ${toStr(payload.regulatory_requirements_other ?? payload.regulatoryRequirementsOther)}`,
    `Data sensitivity: ${toStr(payload.data_sensitivity ?? payload.dataSensitivity)}`,
    `Customer risk tolerance: ${toStr(payload.customer_risk_tolerance ?? payload.customerRiskTolerance)}`,
    `Alternatives considered: ${toStr(payload.alternatives_considered ?? payload.alternativesConsidered)}`,
    `Key advantages: ${toStr(payload.key_advantages ?? payload.keyAdvantages)}`,
    `Customer-specific risks: ${toStr(payload.customer_specific_risks ?? payload.customerSpecificRisks)}`,
    `Customer-specific risks (other): ${toStr(payload.customer_specific_risks_other ?? payload.customerSpecificRisksOther)}`,
    `Identified risks: ${toStr(payload.identified_risks ?? payload.identifiedRisks)}`,
    `Risk domain scores: ${toStr(payload.risk_domain_scores ?? payload.riskDomainScores)}`,
    `Contextual multipliers: ${toStr(payload.contextual_multipliers ?? payload.contextualMultipliers)}`,
    `Risk mitigation: ${toStr(payload.risk_mitigation ?? payload.riskMitigation)}`,
    "--- End of data ---",
  ];
  return lines.join("\n");
}

function parseReportSections(rawReply: string): GeneratedVendorCotsReport {
  let overallRiskScore = 0;
  let riskLevel = "Moderate";
  let summary = "";
  const keyRisks: string[] = [];
  const recommendations: string[] = [];

  const section0 = rawReply.match(/##\s*0\.?\s*Risk Score[\s\S]*?(?=\n\s*##\s*1|$)/i)?.[0] ?? "";
  if (section0) {
    const scoreMatch = section0.match(/\*\*Overall Risk Score\*\*:\s*(\d+)/i) ?? section0.match(/Overall Risk Score\s*:\s*(\d+)/i);
    if (scoreMatch) {
      const n = parseInt(scoreMatch[1], 10);
      overallRiskScore = Math.min(100, Math.max(0, n));
    }
    const levelMatch = section0.match(/\*\*Risk Level\*\*:\s*([^\n*]+)/i) ?? section0.match(/Risk Level\s*:\s*([^\n*]+)/i);
    if (levelMatch) riskLevel = levelMatch[1].trim().slice(0, 50) || "Moderate";
    const summaryMatch =
      section0.match(/\*\*Summary\*\*:\s*([\s\S]*?)(?=\n\s*##|\n\s*[-*]\s*\*\*[A-Za-z]|$)/im) ??
      section0.match(/Summary:\s*([\s\S]*?)(?=\n\s*##|\n\s*[-*]\s*\*\*|$)/im);
    if (summaryMatch) summary = summaryMatch[1].replace(/\n+/g, " ").trim();
  }

  const section1 = rawReply.match(/##\s*1\.?\s*Key Risks[\s\S]*?(?=\n\s*##\s*2|$)/i)?.[0] ?? "";
  if (section1) {
    const bullets = section1.split(/\n/).filter((line) => /^\s*[-*]\s+/.test(line));
    for (const b of bullets) {
      const text = b.replace(/^\s*[-*]\s+/, "").trim();
      if (text.length > 0) keyRisks.push(text);
    }
  }

  const section2 = rawReply.match(/##\s*2\.?\s*Recommendations[\s\S]*?(?=\n\s*##|$)/i)?.[0] ?? "";
  if (section2) {
    const bullets = section2.split(/\n/).filter((line) => /^\s*[-*]\s+/.test(line));
    for (const b of bullets) {
      const text = b.replace(/^\s*[-*]\s+/, "").trim();
      if (text.length > 0) recommendations.push(text);
    }
  }

  if (overallRiskScore === 0 && /\d{1,3}/.test(rawReply)) {
    const anyNum = rawReply.match(/\*\*Overall Risk Score\*\*[^\d]*(\d{1,3})/i)?.[1] ?? rawReply.match(/Risk Score[^\d]*(\d{1,3})/i)?.[1];
    if (anyNum) overallRiskScore = Math.min(100, Math.max(0, parseInt(anyNum, 10)));
  }

  return {
    overallRiskScore,
    riskLevel,
    summary: summary || "No summary generated.",
    keyRisks,
    recommendations,
  };
}

async function invokeModel(userInput: string): Promise<string> {
  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 4096,
    temperature: 0.3,
    messages: [{ role: "user", content: [{ type: "text", text: userInput }] }],
  });

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body,
  });

  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.content?.[0]?.text ?? "";
}

/**
 * Generate a structured Customer Risk Assessment report from vendor COTS assessment data.
 * Called when a vendor user completes (submits) a vendor COTS assessment.
 */
export async function generateVendorCotsReport(
  payload: Record<string, unknown>,
): Promise<GeneratedVendorCotsReport | null> {
  try {
    const context = buildAssessmentContext(payload);
    const userInput = VENDOR_COTS_REPORT_PROMPT + "\n\n" + context;
    const rawReply = await invokeModel(userInput);
    if (!rawReply.trim()) return null;
    const parsed = parseReportSections(rawReply);
    return { ...parsed, raw: rawReply };
  } catch (err) {
    console.error("generateVendorCotsReport error:", err);
    return null;
  }
}
