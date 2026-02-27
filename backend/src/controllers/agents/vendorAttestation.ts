import "dotenv/config";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const REGION = process.env.AWS_DEFAULT_REGION || "us-east-1";
const MODEL_ID = "us.anthropic.claude-haiku-4-5-20251001-v1:0";
// const MODEL_ID = "anthropic.claude-3-sonnet-20240229-v1:0";

const client = new BedrockRuntimeClient({ region: REGION });

export interface TrustScoreBlock {
  overallScore: number;
  label: string;
  summary: string;
  scoreByCategory?: Record<string, string | number>;
}

export interface ReportSection {
  id: number;
  title: string;
  subtitle?: string;
  items: Record<string, string>;
}

export interface VendorAttestationReport {
  trustScore: TrustScoreBlock;
  sections: ReportSection[];
  raw?: string;
}

const SECTION_TITLES: Record<number, string> = {
  0: "Trust Score",
  1: "Product Information",
  2: "Company Overview",
  3: "AI Models & Technology",
  4: "AI Governance",
  5: "Security Posture",
  6: "Data Practices",
  7: "Compliance & Certifications",
  8: "Operations & Support",
  9: "Vendor Management",
};

const VENDOR_ATTESTATION_PROMPT = `You are a vendor attestation analyst. Using ONLY the vendor data provided below, generate a structured vendor attestation report. For any detail not explicitly stated in the data, infer a reasonable value consistent with the vendor type and product, or write "Not specified" where nothing can be inferred.

Output the report in the following sections with clear headings and bullet points. Use the exact section titles and item labels below. Write concise, professional descriptions (1–2 sentences per item where appropriate).

## 0. Trust Score
First, compute an overall **Trust Score** (0–100) for this vendor based on the provided data. Consider: security posture, compliance and certifications, data practices and privacy, AI governance and safety, operations and reliability, and company maturity. Output:
- **Overall Trust Score:** [0-100] ([label: e.g. High / Moderate / Low])
- **Score by category:** Security, Compliance, Data Practices, AI Governance, Operations, Company Maturity — output each as "CategoryName: score" where score is 0–100 or "Not enough data" (e.g. Security: 85, Compliance: 90, Data Practices: 78, AI Governance: 82, Operations: 88, Company Maturity: 75)
- **Summary:** 2–3 sentences justifying the overall score and noting main strengths and any gaps or risks.

Then continue with the detailed sections below.

## 1. Product Information
- **Product Name:** [name and variant if any]
- **Version:** [model/version if stated]
- **Primary Use Case:** [enterprise use cases]
- **Target Industry:** [industries]
- **Deployment Model:** [e.g. Cloud-hosted (AWS/Azure/GCP), SaaS]
- **Pricing:** [if stated; otherwise "Contact vendor"]
- **Customer Base:** [metrics if stated]
- **Product Description:** [2–3 sentence summary covering security, compliance, and key differentiators]

## 2. Company Overview
- **Legal Name:** [company legal name]
- **Year Founded:** [year]
- **Employees:** [range or count]
- **Annual Revenue / Funding Stage:** [if stated]
- **Key Investors / Headquarters:** [if stated]
- **Operating Regions:** [regions]

## 3. AI Models & Technology
- **Model Types:** [e.g. LLM, custom-trained, NLP]
- **Model Purpose:** [capabilities: understanding, generation, analysis, coding, etc.]
- **Training Data / Transparency:** [explainability level, documentation]
- **Human Oversight:** [advisory vs autonomous, monitoring, alerts, audit logs]
- **Explainability:** [prompt-level control, citations, custom instructions if any]
- **Update Frequency:** [if stated; otherwise "Not specified"]

## 4. AI Governance (Ethics, oversight, and governance)
- **AI Ethics Policy:** [usage policies, safety guidelines]
- **Bias Detection:** [red team, third-party audits, monitoring, statistical tools]
- **Bias Audits:** [frequency, external evaluations]
- **Model Governance:** [safety framework, staged deployment if any]
- **Human-in-the-Loop:** [admin controls, content filtering, intervention]
- **Impact Assessment:** [system cards, documentation for releases]

## 5. Security Posture
- **Encryption at Rest:** [algorithm and infrastructure]
- **Encryption in Transit:** [e.g. TLS 1.2+]
- **Access Control:** [SSO, SAML, OIDC, SCIM, domain verification, roles]
- **MFA Required:** [Yes/No and scope]
- **Penetration Testing:** [frequency and type]
- **Bug Bounty:** [Yes/No; program name if any]
- **Incident Response:** [plan, testing, 24/7 if any]
- **Disaster Recovery:** [multi-region, failover]
- **Uptime SLA:** [percentage and service credits if any]

## 6. Data Practices
- **Data Types Processed:** [documents, code, communications, etc.]
- **PII Handling:** [extent and whether customer data is used for training]
- **Data Collection:** [API, chat interface, retention options]
- **Data Storage:** [infrastructure and encryption]
- **Data Retention:** [default and optional zero retention]
- **Data Location / Residency:** [US, EU, customer choice, etc.]
- **Data Deletion:** [on request, automated]
- **Sub-processors:** [infrastructure, payments, auth if known]

## 7. Compliance & Certifications
- **Certifications:** [SOC 2, ISO, FedRAMP, HIPAA, GDPR, etc.]
- **Regulatory Frameworks:** [NIST, GDPR, CCPA, EU AI Act readiness]
- **HIPAA Compliance:** [BAA eligibility]
- **GDPR Compliance:** [DPA availability]
- **EU AI Act Readiness:** [engagement, preparation]
- **Audit Frequency / Last Audit Date / Audit Findings:** [if stated]

## 8. Operations & Support
- **Support Hours:** [e.g. 24/7 for enterprise]
- **Support SLAs:** [response times by severity]
- **Uptime SLA:** [repeat if not above]
- **Change Management:** [rollouts, version pinning, release notes]

## 9. Vendor Management
- **Critical Vendors:** [infrastructure, payments]
- **Vendor Assessment:** [frequency of risk assessments]
- **Vendor SLAs:** [key SLAs from critical vendors]

---
Vendor data to use (use only this information; infer only when reasonable):

`;

function parseBulletItems(text: string): Record<string, string> {
  const items: Record<string, string> = {};
  const bulletRegex = /^[-*]\s*\*\*(.+?):\*\*\s*([\s\S]*?)(?=^[-*]\s*\*\*|$)/gm;
  let m;
  while ((m = bulletRegex.exec(text)) !== null) {
    const label = m[1].trim();
    const value = m[2].replace(/\n/g, " ").trim();
    if (label && value) items[label] = value;
  }
  return items;
}

const TRUST_SCORE_KNOWN_CATEGORIES = [
  "Security",
  "Compliance",
  "Data Practices",
  "AI Governance",
  "Operations",
  "Company Maturity",
];

/** Extract only the content after "**Summary:**" – no label, stop at next ## or bullet. */
function extractSummaryAfterLabel(text: string): string {
  if (!text || !/Summary/i.test(text)) return "";
  const afterLabel = text.split(/\*\*Summary\*\*:\s*/i)[1];
  if (!afterLabel) return "";
  const content = afterLabel
    .replace(/\n+/g, " ")
    .trim()
    .split(/\n\s*##\s*\d|\n\s*[-*]\s*\*\*/)[0]
    .trim();
  return content.split(/^\*\*Summary\*\*:\s*/i)[1]?.trim() || content.trim();
}

function parseTrustScoreBlock(sectionText: string): TrustScoreBlock {
  const items = parseBulletItems(sectionText);
  let overall = items["Overall Trust Score"] || "";

  // First: try exact pattern "**Overall Trust Score:** 72 (Moderate-to-High)" with or without leading bullet
  const overallWithParen = sectionText.match(/\*\*Overall Trust Score\*\*:\s*(\d+)\s*\(([^)]+)\)/i);
  if (overallWithParen) {
    overall = `${overallWithParen[1]} (${overallWithParen[2].trim()})`;
  } else if (!overall && /Overall Trust Score/i.test(sectionText)) {
    const directMatch = sectionText.match(/\*\*Overall Trust Score\*\*:\s*(\d+)\s*[(\[]?\s*([^)\]]*)/i);
    if (directMatch) {
      overall = `${directMatch[1]} (${(directMatch[2] || "").trim()})`.trim();
    }
  }

  const match = overall.match(/(\d+)\s*[(\[]?\s*([^)\]]*)/);
  let overallScore = match
    ? Math.min(100, Math.max(0, parseInt(match[1], 10) || 0))
    : 0;
  let label = (match && match[2] ? match[2].trim() : "") || "Not specified";
  if (overallScore > 0 && (!label || label === "Not specified") && /\([^)]+\)/.test(sectionText)) {
    const parenMatch = sectionText.match(/\*\*Overall Trust Score\*\*:\s*\d+\s*\(([^)]+)\)/i) ?? sectionText.match(/\d+\s*\(([^)]+)\)/);
    if (parenMatch) label = parenMatch[1].trim();
  }

  let summary = items["Summary"] || "";
  if (!summary && /Summary/i.test(sectionText)) {
    const summaryMatch =
      sectionText.match(/\*\*Summary\*\*:\s*([\s\S]*?)(?=\n\s*##|\n\s*[-*]\s*\*\*|$)/im) ??
      sectionText.match(/[-*]\s*\*\*Summary\*\*:\s*([\s\S]*?)(?=\n\s*##|\n\s*[-*]\s*\*\*|$)/im) ??
      sectionText.match(/Summary:\s*([\s\S]*?)(?=\n\s*##|\n\s*[-*]\s*\*\*|$)/im);
    if (summaryMatch) summary = summaryMatch[1].replace(/\n+/g, " ").trim();
  }
  if (!summary.trim() && /Summary/i.test(sectionText)) {
    const afterSummary = sectionText.split(/\*\*Summary\*\*:\s*/i)[1];
    if (afterSummary) {
      summary = afterSummary
        .replace(/\n+/g, " ")
        .trim()
        .split(/\n\s*[-*]\s*\*\*|\n\s*##/)[0]
        .trim();
    }
  }
  const scoreByCategory: Record<string, string | number> = {};

  // Parse "Score by category" single line (e.g. "Security: 85, Compliance: 90")
  const catLine =
    items["Score by category (optional)"] ||
    items["Score by category"] ||
    items["Score by Category"] ||
    "";
  if (catLine) {
    const parts = catLine.split(/[,;]/).map((p) => p.trim());
    for (const p of parts) {
      const kv = p.split(/[:\-]/).map((s) => s.trim());
      if (kv.length >= 2) {
        const k = kv[0];
        const v = kv[1];
        if (k) scoreByCategory[k] = /^\d+$/.test(v) ? parseInt(v, 10) : v;
      }
    }
  }

  // Bullet format: "- Security: 75" etc. – items will have Security: "75"
  for (const cat of TRUST_SCORE_KNOWN_CATEGORIES) {
    if (items[cat] !== undefined && scoreByCategory[cat] === undefined) {
      const v = items[cat].trim();
      if (v) scoreByCategory[cat] = /^\d+$/.test(v) ? parseInt(v, 10) : v;
    }
  }

  // Fallback: if overallScore still 0, try to extract from section text
  if (overallScore === 0 && /Overall Trust Score/i.test(sectionText)) {
    const directNum = sectionText.match(/\*\*Overall Trust Score\*\*:\s*(\d+)/i);
    const numStr = directNum?.[1] ?? sectionText.match(/Overall Trust Score[^*]*?\*\*:\s*(\d+)/i)?.[1];
    const num = numStr != null ? parseInt(numStr, 10) : NaN;
    if (!Number.isNaN(num)) overallScore = Math.min(100, Math.max(0, num));
  }

  // Last resort: first number 1–100 in the block (e.g. "72" in "72 (Moderate)" or nearby)
  if (overallScore === 0) {
    const allNums = sectionText.match(/\b(\d{1,3})\b/g);
    if (allNums) {
      for (const s of allNums) {
        const n = parseInt(s, 10);
        if (n >= 1 && n <= 100) {
          overallScore = n;
          break;
        }
      }
    }
  }

  const filteredScoreByCategory =
    Object.keys(scoreByCategory).length > 0
      ? Object.fromEntries(
          Object.entries(scoreByCategory).filter(([k]) => k != null && String(k).trim() !== ""),
        )
      : undefined;
  return {
    overallScore: Number.isNaN(overallScore) ? 0 : overallScore,
    label,
    summary,
    scoreByCategory:
      filteredScoreByCategory && Object.keys(filteredScoreByCategory).length > 0
        ? filteredScoreByCategory
        : undefined,
  };
}

/** Parse 0–100 score from trust block text (summary/label) for storage fallback when overallScore is 0. */
export function parseScoreFromTrustText(text: string): number | null {
  if (!text || typeof text !== "string") return null;
  const m = text.match(/(\d{1,3})\s*[(\[]/) ?? text.match(/\b(\d{1,3})\b/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isNaN(n) ? null : Math.min(100, Math.max(0, n));
}

function parseReportSections(rawReply: string): {
  trustScore: TrustScoreBlock;
  sections: ReportSection[];
} {
  const sections: ReportSection[] = [];
  const sectionRegex = /##\s*(\d+)\.?\s*([^\n]*)\n([\s\S]*?)(?=##\s*\d|$)/g;
  let trustScore: TrustScoreBlock = {
    overallScore: 0,
    label: "Not specified",
    summary: "",
  };

  let m;
  while ((m = sectionRegex.exec(rawReply)) !== null) {
    const id = parseInt(m[1], 10);
    const titleLine = m[2].trim();
    const body = m[3].trim();
    const title = SECTION_TITLES[id] ?? (titleLine || `Section ${id}`);
    const subtitle = titleLine && titleLine !== title ? titleLine : undefined;

    if (id === 0) {
      trustScore = parseTrustScoreBlock(body);
      continue;
    }

    const items = parseBulletItems(body);
    sections.push({
      id,
      title,
      subtitle,
      items,
    });
  }

  // Fallback: if Trust Score block was not found or parsing returned defaults, find block by content
  const needFallback =
    trustScore.overallScore === 0 ||
    trustScore.summary === "" ||
    trustScore.label === "Not specified";
  if (needFallback && /Overall Trust Score|Trust Score|Summary/i.test(rawReply)) {
    let block = "";
    const overallIdx = rawReply.search(/\*\*Overall Trust Score\*\*|Overall Trust Score\s*:/i);
    const sectionZeroIdx = rawReply.search(/##\s*0\.?\s*Trust Score|##\s*Trust Score\b/i);
    const startIdx = overallIdx >= 0 ? overallIdx : sectionZeroIdx >= 0 ? sectionZeroIdx : rawReply.search(/\bTrust Score\b/i);
    if (startIdx >= 0) {
      const rest = rawReply.slice(startIdx);
      const endMatch = rest.match(/\n\s*##\s*[1-9][.\s]/);
      block = endMatch ? rest.slice(0, endMatch.index).trim() : rest.trim();
    }
    if (!block && /Overall Trust Score/i.test(rawReply)) {
      const beforeSection1 = rawReply.split(/\n\s*##\s*1[.\s]/)[0];
      if (beforeSection1 && beforeSection1.length < rawReply.length) block = beforeSection1.trim();
    }
    if (block) {
      const parsed = parseTrustScoreBlock(block);
      if (parsed.overallScore > 0 || parsed.summary || (parsed.label && parsed.label !== "Not specified")) {
        trustScore = {
          overallScore: parsed.overallScore || trustScore.overallScore,
          label: parsed.label && parsed.label !== "Not specified" ? parsed.label : trustScore.label,
          summary: parsed.summary || trustScore.summary,
          scoreByCategory: parsed.scoreByCategory ?? trustScore.scoreByCategory,
        };
      }
    }
  }

  // Last resort: "**Overall Trust Score:** 72 (Moderate-to-High)" anywhere in reply
  if (/Overall Trust Score/i.test(rawReply)) {
    const withLabel = rawReply.match(/\*\*Overall Trust Score\*\*:\s*(\d{1,3})\s*\(([^)]+)\)/i);
    const numOnly = rawReply.match(/\*\*Overall Trust Score\*\*:\s*(\d{1,3})\b/i) ?? rawReply.match(/Overall Trust Score\s*:\s*(\d{1,3})\b/i);
    if (withLabel) {
      const n = parseInt(withLabel[1], 10);
      if (!Number.isNaN(n) && n >= 0 && n <= 100) {
        trustScore = {
          ...trustScore,
          overallScore: n,
          label: (trustScore.label === "Not specified" ? withLabel[2].trim() : trustScore.label) || "Not specified",
        };
      }
    } else if (trustScore.overallScore === 0 && numOnly) {
      const n = parseInt(numOnly[1], 10);
      if (!Number.isNaN(n) && n >= 0 && n <= 100) {
        trustScore = { ...trustScore, overallScore: n };
      }
    }
  }

  // Last resort: extract Summary from raw reply if still empty
  if (!trustScore.summary.trim() && /\*\*Summary\*\*:/i.test(rawReply)) {
    const afterSummary = rawReply.split(/\*\*Summary\*\*:\s*/i)[1];
    if (afterSummary) {
      const summaryText = afterSummary
        .replace(/\n+/g, " ")
        .trim()
        .split(/\n\s*##\s*\d/)[0]
        .trim();
      if (summaryText.length > 20) trustScore = { ...trustScore, summary: summaryText };
    }
  }

  return { trustScore, sections };
}

async function chat(
  messages: { role: string; content: { type: string; text: string }[] }[],
  userInput: string,
) {
  const nextMessages = [
    ...messages,
    {
      role: "user" as const,
      content: [{ type: "text" as const, text: userInput }],
    },
  ];

  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 4096,
    temperature: 0.3,
    messages: nextMessages,
  });

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body,
  });

  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  const reply = result.content?.[0]?.text ?? "";

  return reply;
}

/**
 * Generate a structured vendor attestation report from vendor data.
 * No file I/O; returns the parsed report for API/UI consumption.
 */
export async function generateVendorAttestationReport(
  vendorData: string,
): Promise<VendorAttestationReport> {
  const userInput = VENDOR_ATTESTATION_PROMPT + (vendorData || "");
  const messages: {
    role: string;
    content: { type: string; text: string }[];
  }[] = [];
  const reply = await chat(messages, userInput);
  const { trustScore, sections } = parseReportSections(reply);
  console.log("Product Data", reply);
  return {
    trustScore,
    sections,
    raw: reply,
  };
}
