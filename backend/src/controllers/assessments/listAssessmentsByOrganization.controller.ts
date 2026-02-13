import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { usersTable } from "../../schema/schema.js";
import { assessments } from "../../schema/assessments/assessments.js";
import { cotsBuyerAssessments } from "../../schema/assessments/cotsBuyerAssessments.js";
import { cotsVendorAssessments } from "../../schema/assessments/cotsVendorAssessments.js";
import { eq, desc, sql } from "drizzle-orm";

/**
 * GET /assessments (uses authenticated user's org).
 * System admins see all assessments; others see only their organization's.
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

    const platformRole = String((user as Record<string, unknown>).user_platform_role ?? "").trim().toLowerCase();
    const isSystemAdmin = platformRole === "system admin";

    const organizationIdFromQuery = typeof req.query?.organizationId === "string" ? req.query.organizationId.trim() || null : null;
<<<<<<< HEAD
    const orgIdFromUser = user.organization_id;
=======
    const orgIdFromUser = (user as Record<string, unknown>).organization_name;
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
    const orgIdStrFromUser = orgIdFromUser != null ? String(orgIdFromUser).trim() : "";
    const orgIdStr = isSystemAdmin && organizationIdFromQuery ? organizationIdFromQuery : orgIdStrFromUser;
    if (!isSystemAdmin && !orgIdStr) {
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
        // cots_buyer_assessments (Excel buyer_cots column names) → same API shape for frontend
        organizationName: cotsBuyerAssessments.organization_name,
<<<<<<< HEAD
        completedByUserEmail: usersTable.email,
        completedByUserFirstName: usersTable.user_first_name,
        completedByUserLastName: usersTable.user_last_name,
        completedByUserName: usersTable.user_name,
=======
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
        industrySector: cotsBuyerAssessments.industry_sector,
        businessPainPoint: cotsBuyerAssessments.pain_point,
        expectedOutcomes: cotsBuyerAssessments.business_outcomes,
        owningDepartment: cotsBuyerAssessments.business_unit,
        budgetRange: cotsBuyerAssessments.budget_range,
        targetTimeline: cotsBuyerAssessments.target_timeline,
        criticality: cotsBuyerAssessments.critical_of_ai_solution,
        vendorName: cotsBuyerAssessments.vendor_name,
        productName: cotsBuyerAssessments.specific_product,
        requirementGaps: cotsBuyerAssessments.gap_requirement_product,
        integrationSystems: cotsBuyerAssessments.integrate_system,
        techStack: cotsBuyerAssessments.current_tech_stack,
        digitalMaturityLevel: cotsBuyerAssessments.digital_maturity,
        dataGovernanceMaturity: cotsBuyerAssessments.governance_maturity,
        aiGovernanceBoard: cotsBuyerAssessments.ai_governance_board,
        aiEthicsPolicy: cotsBuyerAssessments.ai_ethics_policy,
        implementationTeamComposition: cotsBuyerAssessments.team_composition,
        dataSensitivity: cotsBuyerAssessments.data_sensitivity_level,
        regulatoryRequirements: cotsBuyerAssessments.regulatory_requirments,
        riskAppetite: cotsBuyerAssessments.risk_appetite,
        decisionStakes: cotsBuyerAssessments.statke_at_ai_decisions,
        impactedStakeholders: cotsBuyerAssessments.impact_by_ai,
        vendorValidationApproach: cotsBuyerAssessments.vendor_capabilities,
        vendorSecurityPosture: cotsBuyerAssessments.vendor_security_posture,
        vendorCertifications: cotsBuyerAssessments.vendor_compliance_certifications,
        pilotRolloutPlan: cotsBuyerAssessments.phased_rollout_plan,
        rollbackCapability: cotsBuyerAssessments.rollback_capability,
        changeManagementPlan: cotsBuyerAssessments.management_plan,
        monitoringDataAvailable: cotsBuyerAssessments.vendor_usage_data,
        auditLogsAvailable: cotsBuyerAssessments.audit_logs,
        testingResultsAvailable: cotsBuyerAssessments.testing_results,
        identifiedRisks: cotsBuyerAssessments.identified_risks,
        riskDomainScores: cotsBuyerAssessments.risk_domain_scores,
        contextualMultipliers: cotsBuyerAssessments.contextual_multipliers,
        riskMitigation: cotsBuyerAssessments.buyer_risk_mitigation,
        riskMitigationMappingIds: cotsBuyerAssessments.risk_mitigation_mapping_ids,
        cotsCreatedAt: cotsBuyerAssessments.created_at,
        cotsUpdatedAt: cotsBuyerAssessments.updated_at,
        // cots_vendor_assessments (for vendor COTS rows)
        customerOrganizationName: cotsVendorAssessments.customer_organization_name,
        customerSector: cotsVendorAssessments.customer_sector,
        primaryPainPoint: cotsVendorAssessments.primary_pain_point,
        vendorExpectedOutcomes: cotsVendorAssessments.expected_outcomes,
        customerBudgetRange: cotsVendorAssessments.customer_budget_range,
        implementationTimeline: cotsVendorAssessments.implementation_timeline,
        productFeatures: cotsVendorAssessments.product_features,
        implementationApproach: cotsVendorAssessments.implementation_approach,
        customizationLevel: cotsVendorAssessments.customization_level,
        integrationComplexity: cotsVendorAssessments.integration_complexity,
        vendorRegulatoryRequirements: cotsVendorAssessments.regulatory_requirements,
        vendorDataSensitivity: cotsVendorAssessments.data_sensitivity,
        customerRiskTolerance: cotsVendorAssessments.customer_risk_tolerance,
        alternativesConsidered: cotsVendorAssessments.alternatives_considered,
        keyAdvantages: cotsVendorAssessments.key_advantages,
        customerSpecificRisks: cotsVendorAssessments.customer_specific_risks,
        vendorIdentifiedRisks: cotsVendorAssessments.identified_risks,
        vendorRiskDomainScores: cotsVendorAssessments.risk_domain_scores,
        vendorContextualMultipliers: cotsVendorAssessments.contextual_multipliers,
        vendorRiskMitigation: cotsVendorAssessments.risk_mitigation,
        vendorCotsCreatedAt: cotsVendorAssessments.created_at,
        vendorCotsUpdatedAt: cotsVendorAssessments.updated_at,
      })
      .from(assessments)
      .leftJoin(
        cotsBuyerAssessments,
        eq(assessments.id, cotsBuyerAssessments.assessment_id)
      )
      .leftJoin(
        cotsVendorAssessments,
        eq(assessments.id, cotsVendorAssessments.assessment_id)
      )
<<<<<<< HEAD
      .leftJoin(usersTable, eq(cotsBuyerAssessments.user_id, usersTable.id))
=======
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
      .where(isSystemAdmin ? sql`1 = 1` : eq(assessments.organization_id, orgIdStr))
      .orderBy(desc(assessments.created_at));

    const list = rows.map((r) => ({
      assessmentId: r.assessmentId,
      type: r.type,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      organizationId: r.organizationId,
      organizationName: r.organizationName ?? null,
<<<<<<< HEAD
      completedByUserEmail: r.completedByUserEmail ?? null,
      completedByUserFirstName: r.completedByUserFirstName ?? null,
      completedByUserLastName: r.completedByUserLastName ?? null,
      completedByUserName: r.completedByUserName ?? null,
=======
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
      industrySector: r.industrySector ?? null,
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
      // Vendor COTS fields (populated when type === "cots_vendor")
      customerOrganizationName: r.customerOrganizationName ?? null,
      customerSector: r.customerSector ?? null,
      primaryPainPoint: r.primaryPainPoint ?? null,
      vendorExpectedOutcomes: r.vendorExpectedOutcomes ?? null,
      customerBudgetRange: r.customerBudgetRange ?? null,
      implementationTimeline: r.implementationTimeline ?? null,
      productFeatures: r.productFeatures ?? null,
      implementationApproach: r.implementationApproach ?? null,
      customizationLevel: r.customizationLevel ?? null,
      integrationComplexity: r.integrationComplexity ?? null,
      vendorRegulatoryRequirements: r.vendorRegulatoryRequirements ?? null,
      vendorDataSensitivity: r.vendorDataSensitivity ?? null,
      customerRiskTolerance: r.customerRiskTolerance ?? null,
      alternativesConsidered: r.alternativesConsidered ?? null,
      keyAdvantages: r.keyAdvantages ?? null,
      customerSpecificRisks: r.customerSpecificRisks ?? null,
      vendorIdentifiedRisks: r.vendorIdentifiedRisks ?? null,
      vendorRiskDomainScores: r.vendorRiskDomainScores ?? null,
      vendorContextualMultipliers: r.vendorContextualMultipliers ?? null,
      vendorRiskMitigation: r.vendorRiskMitigation ?? null,
      vendorCotsCreatedAt: r.vendorCotsCreatedAt ?? null,
      vendorCotsUpdatedAt: r.vendorCotsUpdatedAt ?? null,
    }));

    return res.status(200).json({
      message: "Assessments fetched successfully",
      data: { assessments: list, organizationId: isSystemAdmin ? undefined : orgIdStr },
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
