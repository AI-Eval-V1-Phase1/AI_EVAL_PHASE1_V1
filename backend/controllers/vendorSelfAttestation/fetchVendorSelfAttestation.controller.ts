import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { vendors, vendorSelfAttestations, usersTable } from "../../schema/schema.js";
import { eq } from "drizzle-orm";

/**
 * GET vendor self attestation flow data for the logged-in user:
 * - Company Profile: from vendor_onboarding (same as VendorOnboarding).
 * - Attestation: from vendor_self_attestations by user_id.
 * Returns empty objects when no record exists. Uses Drizzle ORM (parameterized) only.
 */
const fetchVendorSelfAttestation = async (req: Request, res: Response): Promise<void> => {
  try {
    // --- 1. Resolve user id from JWT (id/userId) or by email ---
    const payload = req.user as {
      id?: number;
      userId?: string | number;
      email?: string;
    } | undefined;
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
      });
      return;
    }

    // --- 2. Fetch Company Profile from vendor_onboarding (by user_id) ---
    const vendorRows = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, userId))
      .limit(1);
    const vendorRow = vendorRows[0] ?? null;

    let companyProfile: Record<string, unknown> = {};
    if (vendorRow) {
      const sectorRaw = vendorRow.sector;
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
        userId: vendorRow.userId,
        organizationId: vendorRow.organizationId,
        vendorType: vendorRow.vendorType ?? "",
        sector,
        vendorMaturity: vendorRow.vendorMaturity ?? "",
        companyWebsite: vendorRow.companyWebsite ?? "",
        companyDescription: vendorRow.companyDescription ?? "",
        primaryContactName: vendorRow.primaryContactName ?? "",
        primaryContactEmail: vendorRow.primaryContactEmail ?? "",
        primaryContactRole: vendorRow.primaryContactRole ?? "",
        employeeCount: vendorRow.employeeCount ?? "",
        yearFounded: vendorRow.yearFounded ?? null,
        headquartersLocation: vendorRow.headquartersLocation ?? "",
        operatingRegions: Array.isArray(vendorRow.operatingRegions)
          ? vendorRow.operatingRegions
          : vendorRow.operatingRegions != null && typeof vendorRow.operatingRegions === "object"
            ? (vendorRow.operatingRegions as string[])
            : [],
      };
    }

    // --- 3. Fetch attestation row from vendor_self_attestations (by user_id) ---
    const attestRows = await db
      .select()
      .from(vendorSelfAttestations)
      .where(eq(vendorSelfAttestations.user_id, userId))
      .limit(1);
    const attestRow = attestRows[0] ?? null;

    let attestation: Record<string, unknown> = {};
    if (attestRow) {
      attestation = {
        id: attestRow.id,
        purchase_decision_makers: attestRow.purchase_decision_makers ?? undefined,
        pain_points_solved: attestRow.pain_points_solved ?? undefined,
        alternatives_considered: attestRow.alternatives_considered ?? undefined,
        unique_value_proposition: attestRow.unique_value_proposition ?? undefined,
        typical_customer_roi: attestRow.typical_customer_roi ?? undefined,
        ai_capabilities: attestRow.ai_capabilities ?? undefined,
        ai_model_types: attestRow.ai_model_types ?? undefined,
        model_transparency: attestRow.model_transparency ?? undefined,
        decision_autonomy: attestRow.decision_autonomy ?? undefined,
        security_certifications: attestRow.security_certifications ?? undefined,
        assessment_completion_level: attestRow.assessment_completion_level ?? undefined,
        pii_handling: attestRow.pii_handling ?? undefined,
        data_residency_options: attestRow.data_residency_options ?? undefined,
        data_retention_policy: attestRow.data_retention_policy ?? undefined,
        bias_testing_approach: attestRow.bias_testing_approach ?? undefined,
        adversarial_security_testing: attestRow.adversarial_security_testing ?? undefined,
        human_oversight: attestRow.human_oversight ?? undefined,
        training_data_documentation: attestRow.training_data_documentation ?? undefined,
        uptime_sla: attestRow.uptime_sla ?? undefined,
        incident_response_plan: attestRow.incident_response_plan ?? undefined,
        rollback_capability: attestRow.rollback_capability ?? undefined,
        hosting_deployment: attestRow.hosting_deployment ?? undefined,
        deployment_scale: attestRow.deployment_scale ?? undefined,
        product_stage: attestRow.product_stage ?? undefined,
        interaction_data_available: attestRow.interaction_data_available ?? undefined,
        audit_logs_available: attestRow.audit_logs_available ?? undefined,
        testing_results_available: attestRow.testing_results_available ?? undefined,
        document_uploads: attestRow.document_uploads ?? undefined,
      };
    }

    res.status(200).json({
      success: true,
      message: "Vendor self attestation data fetched successfully",
      companyProfile,
      attestation,
    });
  } catch (error) {
    console.error("fetchVendorSelfAttestation error:", error);
    res.status(500).json({
      success: false,
      message: "Database or server error",
      companyProfile: {},
      attestation: {},
    });
  }
};

export default fetchVendorSelfAttestation;
