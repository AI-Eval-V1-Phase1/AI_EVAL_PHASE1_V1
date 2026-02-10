import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { usersTable } from "../../schema/schema.js";
import { assessments } from "../../schema/assessments/assessments.js";
import { cotsVendorAssessments } from "../../schema/assessments/cotsVendorAssessments.js";
import { eq, and } from "drizzle-orm";

/** POST /vendorCotsAssessment - submit: create or update assessment. Save draft = status "draft", Submit = status "submitted" (DB enum has draft/submitted). */
const submitVendorCotsAssessment = async (req: Request, res: Response) => {
  try {
    const decoded = req.user as { id?: number } | undefined;
    const userId = decoded?.id;
    if (userId == null) {
      return res.status(401).json({ message: "User not found from token" });
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, Number(userId)))
      .limit(1);
    if (!user) return res.status(404).json({ message: "User not found" });
    const orgIdFromUser = (user as Record<string, unknown>).organization_name;
    const orgIdStr = orgIdFromUser != null ? String(orgIdFromUser).trim() : "";
    if (!orgIdStr) {
      return res.status(400).json({ message: "User has no organization. Complete onboarding or contact admin." });
    }

    const body = req.body ?? {};
    const get = (key: string) => body[key] ?? body[key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())];
    const parseJson = (v: unknown): unknown => {
      if (v == null) return null;
      if (typeof v === "string" && v.trim().length > 0) {
        try {
          const parsed = JSON.parse(v);
          return parsed;
        } catch {
          return v;
        }
      }
      return v;
    };

    const payloadCots = {
      customer_organization_name: get("customerOrganizationName") != null ? String(get("customerOrganizationName")).slice(0, 200) : null,
      customer_sector: get("customerSector") != null ? String(get("customerSector")).slice(0, 200) : null,
      primary_pain_point: get("primaryPainPoint") != null ? String(get("primaryPainPoint")) : null,
      expected_outcomes: get("expectedOutcomes") != null ? String(get("expectedOutcomes")).slice(0, 300) : null,
      customer_budget_range: get("customerBudgetRange") != null ? String(get("customerBudgetRange")).slice(0, 100) : null,
      implementation_timeline: get("implementationTimeline") != null ? String(get("implementationTimeline")).slice(0, 100) : null,
      product_features: parseJson(get("productFeatures") ?? get("product_features")),
      implementation_approach: get("implementationApproach") != null ? String(get("implementationApproach")).slice(0, 100) : null,
      customization_level: get("customizationLevel") != null ? String(get("customizationLevel")).slice(0, 100) : null,
      integration_complexity: get("integrationComplexity") != null ? String(get("integrationComplexity")).slice(0, 100) : null,
      regulatory_requirements: parseJson(get("regulatoryRequirements") ?? get("regulatory_requirements")),
      data_sensitivity: get("dataSensitivity") != null ? String(get("dataSensitivity")).slice(0, 100) : null,
      customer_risk_tolerance: get("customerRiskTolerance") != null ? String(get("customerRiskTolerance")).slice(0, 100) : null,
      alternatives_considered: get("alternativesConsidered") != null ? String(get("alternativesConsidered")) : null,
      key_advantages: get("keyAdvantages") != null ? String(get("keyAdvantages")) : null,
      customer_specific_risks: parseJson(get("customerSpecificRisks") ?? get("customer_specific_risks")),
      identified_risks: get("identifiedRisks") != null ? String(get("identifiedRisks")) : null,
      risk_domain_scores: get("riskDomainScores") != null ? String(get("riskDomainScores")) : null,
      contextual_multipliers: get("contextualMultipliers") != null ? String(get("contextualMultipliers")) : null,
      risk_mitigation: get("riskMitigation") != null ? String(get("riskMitigation")) : null,
    };

    const assessmentIdRaw = body.assessmentId ?? body.assessment_id;
    const assessmentId = typeof assessmentIdRaw === "string" ? assessmentIdRaw.trim() || null : null;

    if (assessmentId) {
      const [existing] = await db
        .select({ id: assessments.id, status: assessments.status })
        .from(assessments)
        .where(
          and(
            eq(assessments.id, assessmentId),
            eq(assessments.organization_id, orgIdStr),
            eq(assessments.type, "cots_vendor")
          )
        )
        .limit(1);
      if (existing) {
        const currentStatus = String((existing as { status?: string }).status ?? "").toLowerCase();
        if (currentStatus === "completed" || currentStatus === "submitted") {
          return res.status(403).json({
            message: "Completed assessments cannot be modified.",
          });
        }
        await db.transaction(async (tx) => {
          await tx
            .update(assessments)
            .set({ status: "submitted", updated_at: new Date() })
            .where(eq(assessments.id, assessmentId));
          await tx
            .update(cotsVendorAssessments)
            .set({ ...payloadCots, updated_at: new Date() })
            .where(eq(cotsVendorAssessments.assessment_id, assessmentId));
        });
        return res.status(200).json({
          message: "Vendor COTS assessment submitted successfully",
          assessmentId,
        });
      }
    }

    const [assessment] = await db.transaction(async (tx) => {
      const [a] = await tx
        .insert(assessments)
        .values({
          type: "cots_vendor",
          organization_id: orgIdStr,
          status: "submitted",
        })
        .returning({ id: assessments.id });

      if (!a?.id) {
        throw new Error("Failed to create assessment");
      }

      await tx.insert(cotsVendorAssessments).values({
        assessment_id: a.id,
        ...payloadCots,
      });

      return [a];
    });

    return res.status(201).json({
      message: "Vendor COTS assessment submitted successfully",
      assessmentId: assessment.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in submitVendorCotsAssessment:", message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default submitVendorCotsAssessment;
