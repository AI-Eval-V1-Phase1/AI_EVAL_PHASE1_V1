import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { vendors, vendorSelfAttestations, usersTable } from "../../schema/schema.js";
import { and, eq } from "drizzle-orm";

function mapAttestationRow(attestRow: Record<string, unknown>): Record<string, unknown> {
  return {
    id: attestRow.id,
    status: String(attestRow.status ?? "").toUpperCase() === "DRAFT" ? "DRAFT" : "COMPLETED",
    created_at: attestRow.created_at ?? undefined,
    updated_at: attestRow.updated_at ?? undefined,
    product_name: attestRow.product_name ?? undefined,
    visible_to_buyer: attestRow.visible_to_buyer === true || attestRow.visible_to_buyer === 1,
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
    visible_ai_governance: attestRow.visible_ai_governance !== false,
    visible_security_posture: attestRow.visible_security_posture !== false,
    visible_data_privacy: attestRow.visible_data_privacy !== false,
    visible_compliance: attestRow.visible_compliance !== false,
    visible_model_risk: attestRow.visible_model_risk !== false,
  };
}

/**
 * GET /vendorDirectory/:vendorId/products/:productId
 * Returns full attestation detail for one product. Only if vendor has public listing
 * and this product is COMPLETED and visible_to_buyer = true.
 * Query ?all=true (system admin only): returns product regardless of status/visibility.
 */
const getVendorProductDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const vendorId = typeof req.params?.vendorId === "string" ? req.params.vendorId.trim() : null;
    const productId = typeof req.params?.productId === "string" ? req.params.productId.trim() : null;
    if (!vendorId || !productId) {
      res.status(400).json({ success: false, message: "Vendor ID and Product ID are required" });
      return;
    }

    const allParam = typeof req.query?.all === "string" && req.query.all.trim().toLowerCase() === "true";
    let isSystemAdmin = false;
    if (allParam) {
      const payload = req.user as { id?: number; userId?: string | number } | undefined;
      const rawId = payload?.id ?? payload?.userId;
      const userId = rawId != null ? Number(rawId) : NaN;
      if (Number.isInteger(userId) && userId >= 1) {
        const [row] = await db
          .select({ user_platform_role: usersTable.user_platform_role, role: usersTable.role, organization_id: usersTable.organization_id })
          .from(usersTable)
          .where(eq(usersTable.id, userId))
          .limit(1);
        const r = row as Record<string, unknown> | undefined;
        const platformRole = String(r?.user_platform_role ?? "").trim().toLowerCase();
        const role = String(r?.role ?? "").trim().toLowerCase();
        const orgId = r?.organization_id;
        isSystemAdmin =
          platformRole === "system admin" ||
          platformRole === "system_admin" ||
          platformRole === "systemadmin" ||
          (Number(orgId) === 1 && role === "admin");
      }
    }

    const [vendor] = await db
      .select({
        id: vendors.id,
        userId: vendors.userId,
        publicDirectoryListing: vendors.publicDirectoryListing,
      })
      .from(vendors)
      .where(eq(vendors.id, vendorId))
      .limit(1);

    if (!vendor) {
      res.status(404).json({ success: false, message: "Vendor or product not found" });
      return;
    }

    if (!allParam && !vendor.publicDirectoryListing) {
      res.status(404).json({ success: false, message: "Vendor or product not found" });
      return;
    }

    const vendorUserId = vendor.userId != null ? Number(vendor.userId) : null;
    if (vendorUserId == null) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const whereClause =
      allParam && isSystemAdmin
        ? and(eq(vendorSelfAttestations.id, productId), eq(vendorSelfAttestations.user_id, vendorUserId))
        : and(
            eq(vendorSelfAttestations.id, productId),
            eq(vendorSelfAttestations.user_id, vendorUserId),
            eq(vendorSelfAttestations.status, "COMPLETED"),
            eq(vendorSelfAttestations.visible_to_buyer, true)
          );
    const [row] = await db.select().from(vendorSelfAttestations).where(whereClause).limit(1);

    if (!row) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const rowRecord = row as Record<string, unknown>;
    const attestation = mapAttestationRow(rowRecord);
    const sectionVisibility = {
      aiGovernance: rowRecord.visible_ai_governance !== false,
      securityPosture: rowRecord.visible_security_posture !== false,
      dataPrivacy: rowRecord.visible_data_privacy !== false,
      compliance: rowRecord.visible_compliance !== false,
      modelRisk: rowRecord.visible_model_risk !== false,
    };

    res.status(200).json({
      success: true,
      attestation,
      sectionVisibility,
      productName: (row.product_name ?? "").trim() || "Product",
    });
  } catch (e) {
    console.error("getVendorProductDetail error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default getVendorProductDetail;
