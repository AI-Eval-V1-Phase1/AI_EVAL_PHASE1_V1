import { db } from "../database/db.js";
import { sql, inArray } from "drizzle-orm";
import { riskTop5Mitigations } from "../schema/risks/riskTop5Mitigations.js";

export interface RiskMappingRow {
  risk_mapping_id: number;
  risk_id: string | null;
  risk_title: string | null;
  domains: string | null;
  description: string | null;
  technical_description: string | null;
  executive_summary: string | null;
  attack_vector: string | null;
  observable_indicators: string | null;
  data_to_identify_risk: string | null;
  evidence_sources: string | null;
  intent: string | null;
  timing: string | null;
  risk_type_detected: string | null;
  primary_risk: string | null;
  secondary_risks: string | null;
}

export interface MitigationRow {
  mapping_id: number;
  risk_id: string;
  mitigation_action_id: string;
  mitigation_action_name: string;
  mitigation_category: string;
  mitigation_definition: string | null;
}

export interface Top5RisksWithMitigations {
  top5Risks: RiskMappingRow[];
  mitigationsByRiskId: Record<string, MitigationRow[]>;
}

function toStr(v: unknown): string {
  if (v == null) return "";
  if (Array.isArray(v)) return v.length ? v.map(toStr).join(" ") : "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v).trim();
}

/**
 * Extract assessment context for matching risk_mappings (domain, intent, timing, primary_risk).
 */
function extractContext(payload: Record<string, unknown>): {
  domain: string;
  intent: string;
  timing: string;
  primary_risk: string;
} {
  const domain =
    toStr(payload.customer_sector ?? payload.customerSector) ||
    toStr(payload.risk_domain_scores ?? payload.riskDomainScores).slice(0, 200);
  const intent =
    toStr(payload.expected_outcomes ?? payload.expectedOutcomes) ||
    toStr(payload.regulatory_requirements ?? payload.regulatoryRequirements).slice(0, 200);
  const timing = toStr(payload.implementation_timeline ?? payload.implementationTimeline);
  const primary_risk =
    toStr(payload.primary_pain_point ?? payload.primaryPainPoint) ||
    toStr(payload.identified_risks ?? payload.identifiedRisks).slice(0, 200) ||
    toStr(payload.customer_specific_risks ?? payload.customerSpecificRisks).slice(0, 200);
  return { domain, intent, timing, primary_risk };
}

/**
 * Match vendor COTS assessment context to risk_mappings on domains, intent, timing, primary_risk,
 * return top 5 risks and their mitigations from risk_top5_mitigations (joined by risk_id).
 */
export async function getTop5RisksWithMitigations(
  payload: Record<string, unknown>
): Promise<Top5RisksWithMitigations> {
  const { domain, intent, timing, primary_risk } = extractContext(payload);

  const domainPattern = domain ? `%${domain}%` : null;
  const intentPattern = intent ? `%${intent}%` : null;
  const timingPattern = timing ? `%${timing}%` : null;
  const primaryRiskPattern = primary_risk ? `%${primary_risk}%` : null;

  type QueryResult = { rows: RiskMappingRow[] };
  const top5Result = await db.execute(sql`
    WITH scored AS (
      SELECT *,
        (CASE WHEN ${domainPattern}::text IS NOT NULL AND domains IS NOT NULL AND domains ILIKE ${domainPattern} THEN 1 ELSE 0 END +
         CASE WHEN ${intentPattern}::text IS NOT NULL AND intent IS NOT NULL AND intent ILIKE ${intentPattern} THEN 1 ELSE 0 END +
         CASE WHEN ${timingPattern}::text IS NOT NULL AND timing IS NOT NULL AND timing ILIKE ${timingPattern} THEN 1 ELSE 0 END +
         CASE WHEN ${primaryRiskPattern}::text IS NOT NULL AND primary_risk IS NOT NULL AND primary_risk ILIKE ${primaryRiskPattern} THEN 1 ELSE 0 END) AS match_score
      FROM public.risk_mappings
    )
    SELECT risk_mapping_id, risk_id, risk_title, domains, description, technical_description,
           executive_summary, attack_vector, observable_indicators, data_to_identify_risk,
           evidence_sources, intent, timing, risk_type_detected, primary_risk, secondary_risks
    FROM scored
    ORDER BY match_score DESC NULLS LAST, risk_mapping_id ASC
    LIMIT 5
  `);
  const rows: RiskMappingRow[] = ((top5Result as unknown) as QueryResult).rows ?? [];

  const riskIds = [...new Set(rows.map((r) => r.risk_id).filter(Boolean) as string[])];

  let mitigationsByRiskId: Record<string, MitigationRow[]> = {};
  if (riskIds.length > 0) {
    const mitigationsRows = await db
      .select()
      .from(riskTop5Mitigations)
      .where(inArray(riskTop5Mitigations.risk_id, riskIds));
    const mitigations: MitigationRow[] = mitigationsRows.map((m) => ({
      mapping_id: m.mapping_id,
      risk_id: m.risk_id,
      mitigation_action_id: m.mitigation_action_id,
      mitigation_action_name: m.mitigation_action_name,
      mitigation_category: m.mitigation_category,
      mitigation_definition: m.mitigation_definition ?? null,
    }));
    mitigationsByRiskId = riskIds.reduce<Record<string, MitigationRow[]>>((acc, id) => {
      acc[id] = mitigations.filter((m) => m.risk_id === id);
      return acc;
    }, {});
  }

  return {
    top5Risks: rows,
    mitigationsByRiskId,
  };
}
