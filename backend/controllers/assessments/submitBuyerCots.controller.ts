import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { assessments } from "../../schema/assessments/assessments.js";
import { cotsBuyerAssessments } from "../../schema/assessments/cotsBuyerAssessments.js";

/** POST /buyerCotsAssessment - create assessment + cots_buyer_assessments row */
const submitBuyerCotsAssessment = async (req: Request, res: Response) => {
  try {
    const body = req.body ?? {};
    const organizationId = String(body.organizationId ?? body.organization_id ?? "").trim();
    if (!organizationId) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const payloadCots = {
      business_pain_point: body.businessPainPoint ?? body.business_pain_point ?? null,
      expected_outcomes: body.expectedOutcomes ?? body.expected_outcomes ?? null,
      owning_department: body.owningDepartment ?? body.owning_department ?? null,
      budget_range: body.budgetRange ?? body.budget_range ?? null,
      target_timeline: body.targetTimeline ?? body.target_timeline ?? null,
      criticality: body.criticality ?? null,
      vendor_name: body.vendorName ?? body.vendor_name ?? null,
      product_name: body.productName ?? body.product_name ?? null,
      requirement_gaps: body.requirementGaps ?? body.requirement_gaps ?? null,
      integration_systems: body.integrationSystems ?? body.integration_systems ?? null,
      tech_stack: body.techStack ?? body.tech_stack ?? null,
      digital_maturity_level: body.digitalMaturityLevel ?? body.digital_maturity_level ?? null,
      data_governance_maturity: body.dataGovernanceMaturity ?? body.data_governance_maturity ?? null,
      ai_governance_board: body.aiGovernanceBoard ?? body.ai_governance_board ?? null,
      ai_ethics_policy: body.aiEthicsPolicy ?? body.ai_ethics_policy ?? null,
      implementation_team_composition: body.implementationTeamComposition ?? body.implementation_team_composition ?? null,
      data_sensitivity: body.dataSensitivity ?? body.data_sensitivity ?? null,
      regulatory_requirements: body.regulatoryRequirements ?? body.regulatory_requirements ?? null,
      risk_appetite: body.riskAppetite ?? body.risk_appetite ?? null,
      decision_stakes: body.decisionStakes ?? body.decision_stakes ?? null,
      impacted_stakeholders: body.impactedStakeholders ?? body.impacted_stakeholders ?? null,
      vendor_validation_approach: body.vendorValidationApproach ?? body.vendor_validation_approach ?? null,
      vendor_security_posture: body.vendorSecurityPosture ?? body.vendor_security_posture ?? null,
      vendor_certifications: body.vendorCertifications ?? body.vendor_certifications ?? null,
      pilot_rollout_plan: body.pilotRolloutPlan ?? body.pilot_rollout_plan ?? null,
      rollback_capability: body.rollbackCapability ?? body.rollback_capability ?? null,
      change_management_plan: body.changeManagementPlan ?? body.change_management_plan ?? null,
      monitoring_data_available: body.monitoringDataAvailable ?? body.monitoring_data_available ?? null,
      audit_logs_available: body.auditLogsAvailable ?? body.audit_logs_available ?? null,
      testing_results_available: body.testingResultsAvailable ?? body.testing_results_available ?? null,
      identified_risks: body.identifiedRisks ?? body.identified_risks ?? null,
      risk_domain_scores: body.riskDomainScores ?? body.risk_domain_scores ?? null,
      contextual_multipliers: body.contextualMultipliers ?? body.contextual_multipliers ?? null,
      risk_mitigation: body.riskMitigation ?? body.risk_mitigation ?? null,
      risk_mitigation_mapping_ids:
        body.riskMitigationMappingIds ?? body.risk_mitigation_mapping_ids ?? null,
    };

    const [assessment] = await db.transaction(async (tx) => {
      const [a] = await tx
        .insert(assessments)
        .values({
          type: "cots_buyer",
          organization_id: organizationId,
          status: "draft",
        })
        .returning({ id: assessments.id });

      if (!a?.id) {
        throw new Error("Failed to create assessment");
      }

      await tx.insert(cotsBuyerAssessments).values({
        assessment_id: a.id,
        ...payloadCots,
      });

      return [a];
    });

    return res.status(201).json({
      message: "Buyer COTS assessment submitted successfully",
      assessmentId: assessment.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in submitBuyerCotsAssessment:", message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default submitBuyerCotsAssessment;
