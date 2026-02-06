import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { usersTable } from "../../schema/schema.js";
import { assessments } from "../../schema/assessments/assessments.js";
import { cotsBuyerAssessments } from "../../schema/assessments/cotsBuyerAssessments.js";
import { eq, desc } from "drizzle-orm";

/**
 * GET /assessments?organizationId=... or GET /assessments (uses authenticated user's org)
 * Returns all assessments for the organization of the logged-in user.
 */
const listAssessmentsByOrganization = async (req: Request, res: Response) => {
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orgId = (user as Record<string, unknown>).organization_name;
    const orgIdStr = orgId != null ? String(orgId).trim() : "";
    if (!orgIdStr) {
      return res.status(400).json({ message: "User has no organization" });
    }

    const rows = await db
      .select({
        assessmentId: assessments.id,
        type: assessments.type,
        status: assessments.status,
        createdAt: assessments.created_at,
        updatedAt: assessments.updated_at,
        organizationId: assessments.organization_id,
        // All cots_buyer_assessments columns for full assessment detail
        businessPainPoint: cotsBuyerAssessments.business_pain_point,
        expectedOutcomes: cotsBuyerAssessments.expected_outcomes,
        owningDepartment: cotsBuyerAssessments.owning_department,
        budgetRange: cotsBuyerAssessments.budget_range,
        targetTimeline: cotsBuyerAssessments.target_timeline,
        criticality: cotsBuyerAssessments.criticality,
        vendorName: cotsBuyerAssessments.vendor_name,
        productName: cotsBuyerAssessments.product_name,
        requirementGaps: cotsBuyerAssessments.requirement_gaps,
        integrationSystems: cotsBuyerAssessments.integration_systems,
        techStack: cotsBuyerAssessments.tech_stack,
        digitalMaturityLevel: cotsBuyerAssessments.digital_maturity_level,
        dataGovernanceMaturity: cotsBuyerAssessments.data_governance_maturity,
        aiGovernanceBoard: cotsBuyerAssessments.ai_governance_board,
        aiEthicsPolicy: cotsBuyerAssessments.ai_ethics_policy,
        implementationTeamComposition: cotsBuyerAssessments.implementation_team_composition,
        dataSensitivity: cotsBuyerAssessments.data_sensitivity,
        regulatoryRequirements: cotsBuyerAssessments.regulatory_requirements,
        riskAppetite: cotsBuyerAssessments.risk_appetite,
        decisionStakes: cotsBuyerAssessments.decision_stakes,
        impactedStakeholders: cotsBuyerAssessments.impacted_stakeholders,
        vendorValidationApproach: cotsBuyerAssessments.vendor_validation_approach,
        vendorSecurityPosture: cotsBuyerAssessments.vendor_security_posture,
        vendorCertifications: cotsBuyerAssessments.vendor_certifications,
        pilotRolloutPlan: cotsBuyerAssessments.pilot_rollout_plan,
        rollbackCapability: cotsBuyerAssessments.rollback_capability,
        changeManagementPlan: cotsBuyerAssessments.change_management_plan,
        monitoringDataAvailable: cotsBuyerAssessments.monitoring_data_available,
        auditLogsAvailable: cotsBuyerAssessments.audit_logs_available,
        testingResultsAvailable: cotsBuyerAssessments.testing_results_available,
        identifiedRisks: cotsBuyerAssessments.identified_risks,
        riskDomainScores: cotsBuyerAssessments.risk_domain_scores,
        contextualMultipliers: cotsBuyerAssessments.contextual_multipliers,
        riskMitigation: cotsBuyerAssessments.risk_mitigation,
        riskMitigationMappingIds: cotsBuyerAssessments.risk_mitigation_mapping_ids,
        cotsCreatedAt: cotsBuyerAssessments.created_at,
        cotsUpdatedAt: cotsBuyerAssessments.updated_at,
      })
      .from(assessments)
      .leftJoin(
        cotsBuyerAssessments,
        eq(assessments.id, cotsBuyerAssessments.assessment_id)
      )
      .where(eq(assessments.organization_id, orgIdStr))
      .orderBy(desc(assessments.created_at));

    const list = rows.map((r) => ({
      assessmentId: r.assessmentId,
      type: r.type,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      organizationId: r.organizationId,
      businessPainPoint: r.businessPainPoint ?? null,
      expectedOutcomes: r.expectedOutcomes ?? null,
      owningDepartment: r.owningDepartment ?? null,
      budgetRange: r.budgetRange ?? null,
      targetTimeline: r.targetTimeline ?? null,
      criticality: r.criticality ?? null,
      vendorName: r.vendorName ?? null,
      productName: r.productName ?? null,
      requirementGaps: r.requirementGaps ?? null,
      integrationSystems: r.integrationSystems ?? null,
      techStack: r.techStack ?? null,
      digitalMaturityLevel: r.digitalMaturityLevel ?? null,
      dataGovernanceMaturity: r.dataGovernanceMaturity ?? null,
      aiGovernanceBoard: r.aiGovernanceBoard ?? null,
      aiEthicsPolicy: r.aiEthicsPolicy ?? null,
      implementationTeamComposition: r.implementationTeamComposition ?? null,
      dataSensitivity: r.dataSensitivity ?? null,
      regulatoryRequirements: r.regulatoryRequirements ?? null,
      riskAppetite: r.riskAppetite ?? null,
      decisionStakes: r.decisionStakes ?? null,
      impactedStakeholders: r.impactedStakeholders ?? null,
      vendorValidationApproach: r.vendorValidationApproach ?? null,
      vendorSecurityPosture: r.vendorSecurityPosture ?? null,
      vendorCertifications: r.vendorCertifications ?? null,
      pilotRolloutPlan: r.pilotRolloutPlan ?? null,
      rollbackCapability: r.rollbackCapability ?? null,
      changeManagementPlan: r.changeManagementPlan ?? null,
      monitoringDataAvailable: r.monitoringDataAvailable ?? null,
      auditLogsAvailable: r.auditLogsAvailable ?? null,
      testingResultsAvailable: r.testingResultsAvailable ?? null,
      identifiedRisks: r.identifiedRisks ?? null,
      riskDomainScores: r.riskDomainScores ?? null,
      contextualMultipliers: r.contextualMultipliers ?? null,
      riskMitigation: r.riskMitigation ?? null,
      riskMitigationMappingIds: r.riskMitigationMappingIds ?? null,
      cotsCreatedAt: r.cotsCreatedAt ?? null,
      cotsUpdatedAt: r.cotsUpdatedAt ?? null,
    }));

    return res.status(200).json({
      message: "Assessments fetched successfully",
      data: { assessments: list, organizationId: orgIdStr },
    });
  } catch (error) {
    console.error(
      "listAssessmentsByOrganization:",
      error instanceof Error ? error.message : String(error)
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default listAssessmentsByOrganization;
