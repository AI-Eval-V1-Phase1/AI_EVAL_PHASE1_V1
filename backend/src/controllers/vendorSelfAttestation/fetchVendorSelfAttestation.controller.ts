import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { vendors, vendorSelfAttestations, usersTable } from "../../schema/schema.js";
import { and, desc, eq } from "drizzle-orm";

function userDisplayName(u: { user_name?: string | null; user_first_name?: string | null; user_last_name?: string | null; email?: string | null }): string {
  const name = (u.user_name ?? "").trim();
  if (name) return name;
  const first = (u.user_first_name ?? "").trim();
  const last = (u.user_last_name ?? "").trim();
  const full = [first, last].filter(Boolean).join(" ").trim();
  if (full) return full;
  return (u.email ?? "").trim() || "";
}

/** Map one attestation row to API shape (attestation section only). completedByName is optional from join. */
function mapAttestationRow(attestRow: Record<string, unknown>, completedByName?: string): Record<string, unknown> {
  const raw = String(attestRow.status ?? "").toUpperCase();
  const rowStatus = raw === "DRAFT" ? "DRAFT" : "COMPLETED";
  const base: Record<string, unknown> = {
    id: attestRow.id,
    status: rowStatus,
    created_at: attestRow.created_at ?? undefined,
    updated_at: attestRow.updated_at ?? undefined,
    product_name: attestRow.product_name ?? undefined,
    visible_to_buyer: attestRow.visible_to_buyer === true || attestRow.visible_to_buyer === 1,
    visible_ai_governance: attestRow.visible_ai_governance !== false,
    visible_security_posture: attestRow.visible_security_posture !== false,
    visible_data_privacy: attestRow.visible_data_privacy !== false,
    visible_compliance: attestRow.visible_compliance !== false,
    visible_model_risk: attestRow.visible_model_risk !== false,
    purchase_decision_makers: attestRow.purchase_decisions_by ?? undefined,
    pain_points_solved: attestRow.pain_points ?? undefined,
    alternatives_considered: attestRow.alternatives_consider ?? undefined,
    unique_value_proposition: attestRow.unique_solution ?? undefined,
    typical_customer_roi: attestRow.roi_value_metrics ?? undefined,
    ai_capabilities: attestRow.product_capabilities ?? undefined,
    ai_model_types: attestRow.ai_models_usage ?? undefined,
    model_transparency: attestRow.ai_model_transparency ?? undefined,
    decision_autonomy: attestRow.ai_autonomy_level ?? undefined,
    security_certifications: attestRow.security_compliance_certificates ?? undefined,
    assessment_completion_level: attestRow.assessment_feedback ?? undefined,
    pii_handling: attestRow.pii_information ?? undefined,
    data_residency_options: attestRow.data_residency_options ?? undefined,
    data_retention_policy: attestRow.data_retention_policy ?? undefined,
    bias_testing_approach: attestRow.bias_ai ?? undefined,
    adversarial_security_testing: attestRow.security_testing ?? undefined,
    human_oversight: attestRow.human_oversight ?? undefined,
    training_data_documentation: attestRow.training_data_document ?? undefined,
    uptime_sla: attestRow.sla_guarantee ?? undefined,
    incident_response_plan: attestRow.incident_response_plan ?? undefined,
    rollback_capability: attestRow.rollback_deployment_issues ?? undefined,
    hosting_deployment: attestRow.solution_hosted ?? undefined,
    deployment_scale: attestRow.deployment_scale ?? undefined,
    product_stage: attestRow.stage_product ?? undefined,
    interaction_data_available: attestRow.available_usage_data ?? undefined,
    audit_logs_available: attestRow.audit_logs ?? undefined,
    testing_results_available: attestRow.test_results ?? undefined,
    document_uploads: attestRow.document_uploads ?? undefined,
  };
  if (completedByName != null && completedByName !== "") {
    base.completedBy = { name: completedByName };
  }
  return base;
}

/** Build companyProfile from attestation row (saved draft company profile). Used when editing draft. */
function companyProfileFromAttestationRow(row: Record<string, unknown>): Record<string, unknown> {
  const sectorRaw = row.target_industries;
  let sector: Record<string, unknown> = {};
  if (sectorRaw != null && typeof sectorRaw === "object" && !Array.isArray(sectorRaw)) {
    sector = sectorRaw as Record<string, unknown>;
  } else if (typeof sectorRaw === "string" && sectorRaw.trim()) {
    try {
      const p = JSON.parse(sectorRaw);
      sector = typeof p === "object" && p !== null ? p : {};
    } catch {
      sector = {};
    }
  }
  const opReg = row.operate_regions;
  const operatingRegions = Array.isArray(opReg) ? opReg : (opReg != null && typeof opReg === "object" ? (opReg as string[]) : []);
  return {
    vendorType: row.vendor_type ?? "",
    sector,
    vendorMaturity: row.company_stage ?? "",
    companyWebsite: row.company_website ?? "",
    companyDescription: row.company_description ?? "",
    employeeCount: row.no_of_employees ?? "",
    yearFounded: row.year_founded ?? null,
    headquartersLocation: row.headquarter_location ?? "",
    operatingRegions,
  };
}

/** True if attestation row has any saved company profile data (so we prefer it over onboarding). */
function attestationHasCompanyProfile(row: Record<string, unknown>): boolean {
  return (
    (row.vendor_type != null && String(row.vendor_type).trim() !== "") ||
    (row.company_website != null && String(row.company_website).trim() !== "") ||
    (row.company_description != null && String(row.company_description).trim() !== "") ||
    (row.company_stage != null && String(row.company_stage).trim() !== "")
  );
}

/**
 * GET vendor self attestation: company profile + attestation(s).
 * - companyProfile: from vendor_onboarding (by organizationId or userId).
 * - Query ?id=xxx: return single attestation (for form edit); also set attestation for backward compat.
 * - No id: return attestations[] (all for user, newest first) and attestation (latest one for backward compat).
 */
const fetchVendorSelfAttestation = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.user as { id?: number; userId?: string | number; email?: string } | undefined;
    let rawId = payload?.id ?? payload?.userId;
    let userId = rawId != null ? Number(rawId) : NaN;

    if ((!Number.isInteger(userId) || userId < 1) && payload?.email) {
      const email = String(payload.email).trim();
      if (email) {
        const users = await db
          .select({ id: usersTable.id })
          .from(usersTable)
          .where(eq(usersTable.email, email))
          .limit(1);
        if (users[0]) userId = users[0].id;
      }
    }

    if (!Number.isInteger(userId) || userId < 1) {
      res.status(401).json({
        success: false,
        message: "User not authenticated or invalid user identifier",
        companyProfile: {},
        attestation: {},
        attestations: [],
      });
      return;
    }

    const [currentUserRow] = await db
      .select({
        user_platform_role: usersTable.user_platform_role,
        role: usersTable.role,
        organization_id: usersTable.organization_id,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    const platformRole = String((currentUserRow as Record<string, unknown>)?.user_platform_role ?? "").trim().toLowerCase();
    const orgId = (currentUserRow as Record<string, unknown>)?.organization_id;
    const role = String((currentUserRow as Record<string, unknown>)?.role ?? "").trim().toLowerCase();
    // System admin: explicit platform role or org 1 (AI EVAL) admin
    const isSystemAdmin =
      platformRole === "system admin" ||
      platformRole === "system_admin" ||
      platformRole === "systemadmin" ||
      (Number(orgId) === 1 && role === "admin");

    const organizationId = typeof req.query?.organizationId === "string" ? req.query.organizationId.trim() : null;
    const attestationId = typeof req.query?.id === "string" ? req.query.id.trim() || null : null;

    // Explicit select (exclude public_directory_listing) so this works when that column does not exist yet
    const vendorSelect = {
      userId: vendors.userId,
      organizationId: vendors.organizationId,
      vendorType: vendors.vendorType,
      sector: vendors.sector,
      vendorMaturity: vendors.vendorMaturity,
      companyWebsite: vendors.companyWebsite,
      companyDescription: vendors.companyDescription,
      primaryContactName: vendors.primaryContactName,
      primaryContactEmail: vendors.primaryContactEmail,
      primaryContactRole: vendors.primaryContactRole,
      employeeCount: vendors.employeeCount,
      yearFounded: vendors.yearFounded,
      headquartersLocation: vendors.headquartersLocation,
      operatingRegions: vendors.operatingRegions,
    };
    const vendorRows = organizationId
      ? await db.select(vendorSelect).from(vendors).where(eq(vendors.organizationId, organizationId)).limit(1)
      : await db.select(vendorSelect).from(vendors).where(eq(vendors.userId, userId)).limit(1);
    const vendorRow = vendorRows[0] ?? null;

    /** Explicit select for attestation + user display fields (Drizzle does not accept ...table in select). */
    const attestationWithUserSelect = {
      id: vendorSelfAttestations.id,
      vendor_self_attestation_id: vendorSelfAttestations.vendor_self_attestation_id,
      user_id: vendorSelfAttestations.user_id,
      organization_id: vendorSelfAttestations.organization_id,
      vendor_type: vendorSelfAttestations.vendor_type,
      target_industries: vendorSelfAttestations.target_industries,
      company_stage: vendorSelfAttestations.company_stage,
      company_website: vendorSelfAttestations.company_website,
      company_description: vendorSelfAttestations.company_description,
      no_of_employees: vendorSelfAttestations.no_of_employees,
      year_founded: vendorSelfAttestations.year_founded,
      headquarter_location: vendorSelfAttestations.headquarter_location,
      operate_regions: vendorSelfAttestations.operate_regions,
      product_name: vendorSelfAttestations.product_name,
      market_product_material: vendorSelfAttestations.market_product_material,
      tech_product_specifications: vendorSelfAttestations.tech_product_specifications,
      regulatorycompliance_cert_material: vendorSelfAttestations.regulatorycompliance_cert_material,
      purchase_decisions_by: vendorSelfAttestations.purchase_decisions_by,
      pain_points: vendorSelfAttestations.pain_points,
      alternatives_consider: vendorSelfAttestations.alternatives_consider,
      unique_solution: vendorSelfAttestations.unique_solution,
      roi_value_metrics: vendorSelfAttestations.roi_value_metrics,
      product_capabilities: vendorSelfAttestations.product_capabilities,
      ai_models_usage: vendorSelfAttestations.ai_models_usage,
      ai_model_transparency: vendorSelfAttestations.ai_model_transparency,
      ai_autonomy_level: vendorSelfAttestations.ai_autonomy_level,
      security_compliance_certificates: vendorSelfAttestations.security_compliance_certificates,
      assessment_feedback: vendorSelfAttestations.assessment_feedback,
      pii_information: vendorSelfAttestations.pii_information,
      data_residency_options: vendorSelfAttestations.data_residency_options,
      data_retention_policy: vendorSelfAttestations.data_retention_policy,
      bias_ai: vendorSelfAttestations.bias_ai,
      security_testing: vendorSelfAttestations.security_testing,
      human_oversight: vendorSelfAttestations.human_oversight,
      training_data_document: vendorSelfAttestations.training_data_document,
      sla_guarantee: vendorSelfAttestations.sla_guarantee,
      incident_response_plan: vendorSelfAttestations.incident_response_plan,
      rollback_deployment_issues: vendorSelfAttestations.rollback_deployment_issues,
      solution_hosted: vendorSelfAttestations.solution_hosted,
      deployment_scale: vendorSelfAttestations.deployment_scale,
      stage_product: vendorSelfAttestations.stage_product,
      test_policy_document: vendorSelfAttestations.test_policy_document,
      available_usage_data: vendorSelfAttestations.available_usage_data,
      audit_logs: vendorSelfAttestations.audit_logs,
      test_results: vendorSelfAttestations.test_results,
      assessment_id: vendorSelfAttestations.assessment_id,
      document_uploads: vendorSelfAttestations.document_uploads,
      status: vendorSelfAttestations.status,
      visible_to_buyer: vendorSelfAttestations.visible_to_buyer,
      visible_ai_governance: vendorSelfAttestations.visible_ai_governance,
      visible_security_posture: vendorSelfAttestations.visible_security_posture,
      visible_data_privacy: vendorSelfAttestations.visible_data_privacy,
      visible_compliance: vendorSelfAttestations.visible_compliance,
      visible_model_risk: vendorSelfAttestations.visible_model_risk,
      created_at: vendorSelfAttestations.created_at,
      updated_at: vendorSelfAttestations.updated_at,
      user_name: usersTable.user_name,
      user_first_name: usersTable.user_first_name,
      user_last_name: usersTable.user_last_name,
      user_email: usersTable.email,
    };

    let companyProfile: Record<string, unknown> = {};
    if (vendorRow) {
      const r = vendorRow as Record<string, unknown>;
      const sectorRaw = r.sector;
      let sector: Record<string, unknown> = {};
      if (typeof sectorRaw === "string") {
        try {
          const parsed = JSON.parse(sectorRaw);
          sector = typeof parsed === "object" && parsed !== null ? parsed : {};
        } catch {
          sector = {};
        }
      } else if (sectorRaw != null && typeof sectorRaw === "object") {
        sector = sectorRaw as Record<string, unknown>;
      }
      companyProfile = {
        userId: r.userId,
        organizationId: r.organizationId,
        vendorType: r.vendorType ?? "",
        sector,
        vendorMaturity: r.vendorMaturity ?? "",
        companyWebsite: r.companyWebsite ?? "",
        companyDescription: r.companyDescription ?? "",
        primaryContactName: r.primaryContactName ?? "",
        primaryContactEmail: r.primaryContactEmail ?? "",
        primaryContactRole: r.primaryContactRole ?? "",
        employeeCount: r.employeeCount ?? "",
        yearFounded: r.yearFounded ?? null,
        headquartersLocation: r.headquartersLocation ?? "",
        operatingRegions: Array.isArray(r.operatingRegions)
          ? r.operatingRegions
          : r.operatingRegions != null && typeof r.operatingRegions === "object"
            ? (r.operatingRegions as string[])
            : [],
      };
    }

    if (attestationId) {
      // System admin: do not expose vendor attestations (require own user_id, so they never match)
      const whereSingle = and(
        eq(vendorSelfAttestations.id, attestationId),
        eq(vendorSelfAttestations.user_id, userId)
      );
      const [one] = await db
        .select(attestationWithUserSelect)
        .from(vendorSelfAttestations)
        .leftJoin(usersTable, eq(vendorSelfAttestations.user_id, usersTable.id))
        .where(whereSingle)
        .limit(1);
      if (!one) {
        res.status(200).json({
          success: true,
          message: "Vendor self attestation data fetched successfully",
          companyProfile,
          attestation: {},
          attestations: [],
        });
        return;
      }
      const oneRow = one as Record<string, unknown>;
      const completedByName = userDisplayName({
        user_name: one.user_name ?? null,
        user_first_name: one.user_first_name ?? null,
        user_last_name: one.user_last_name ?? null,
        email: one.user_email ?? null,
      });
      const attestation = mapAttestationRow(oneRow, completedByName);
      // When editing a draft: use company profile saved in the attestation (draft data), not onboarding.
      let resolvedCompanyProfile = companyProfile;
      if (attestationHasCompanyProfile(oneRow)) {
        resolvedCompanyProfile = {
          ...companyProfileFromAttestationRow(oneRow),
          userId: companyProfile?.userId ?? vendorRow ? (vendorRow as Record<string, unknown>).userId : oneRow.user_id,
          organizationId: companyProfile?.organizationId ?? vendorRow ? (vendorRow as Record<string, unknown>).organizationId : oneRow.organization_id,
        };
      }
      res.status(200).json({
        success: true,
        message: "Vendor self attestation data fetched successfully",
        companyProfile: resolvedCompanyProfile,
        attestation,
        attestations: [attestation],
      });
      return;
    }

    // System admin: do not display vendor attestations on this page (return empty list)
    const attestRows = isSystemAdmin
      ? []
      : await db
          .select(attestationWithUserSelect)
          .from(vendorSelfAttestations)
          .leftJoin(usersTable, eq(vendorSelfAttestations.user_id, usersTable.id))
          .where(eq(vendorSelfAttestations.user_id, userId))
          .orderBy(desc(vendorSelfAttestations.created_at));
    const attestations = attestRows.map((row) => {
      const completedByName = userDisplayName({
        user_name: row.user_name ?? null,
        user_first_name: row.user_first_name ?? null,
        user_last_name: row.user_last_name ?? null,
        email: row.user_email ?? null,
      });
      return mapAttestationRow(row as Record<string, unknown>, completedByName);
    });
    const attestation = attestations[0] ?? {};

    res.status(200).json({
      success: true,
      message: "Vendor self attestation data fetched successfully",
      companyProfile,
      attestation,
      attestations,
    });
  } catch (error) {
    console.error("fetchVendorSelfAttestation error:", error);
    res.status(500).json({
      success: false,
      message: "Database or server error",
      companyProfile: {},
      attestation: {},
      attestations: [],
    });
  }
};

export default fetchVendorSelfAttestation;
