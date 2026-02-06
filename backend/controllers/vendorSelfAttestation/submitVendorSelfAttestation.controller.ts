import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { vendorSelfAttestations, usersTable } from "../../schema/schema.js";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

/** Allowed file extensions for document_uploads (metadata only; actual files validated on frontend). */
const ALLOWED_DOC_EXTENSIONS = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];
const MAX_FILENAME_LENGTH = 255;

/**
 * Normalize and validate document_uploads from request.
 * Expected shape: "0": string[], "1": string[], "2": { categories, byCategory }, evidenceTestingPolicy?: string[].
 * Slot 2 can be legacy string[] (then normalized to { categories: [], byCategory: {} }).
 * Returns { ok: true, value } or { ok: false, message }.
 */
function normalizeDocumentUploads(raw: unknown): { ok: true; value: Record<string, unknown> } | { ok: false; message: string } {
  if (raw == null) return { ok: true, value: {} };
  if (typeof raw !== "object") return { ok: false, message: "document_uploads must be an object" };
  const o = raw as Record<string, unknown>;
  const getExt = (name: string) => {
    const i = name.lastIndexOf(".");
    return i >= 0 ? name.slice(i).toLowerCase() : "";
  };
  const validateFileNames = (names: string[]): string | null => {
    for (const name of names) {
      if (name.length > MAX_FILENAME_LENGTH) return `File name too long: ${name.slice(0, 30)}...`;
      const ext = getExt(name);
      if (ext && !ALLOWED_DOC_EXTENSIONS.includes(ext)) return `Invalid file type for: ${name}. Accepted: PDF, DOCX, PPT.`;
    }
    return null;
  };
  const slot0 = Array.isArray(o["0"]) ? (o["0"] as unknown[]).filter((c): c is string => typeof c === "string") : [];
  const slot1 = Array.isArray(o["1"]) ? (o["1"] as unknown[]).filter((c): c is string => typeof c === "string") : [];
  let slot2: { categories: string[]; byCategory: Record<string, string[]> } = { categories: [], byCategory: {} };
  const raw2 = o["2"];
  if (raw2 != null && typeof raw2 === "object" && !Array.isArray(raw2)) {
    const s = raw2 as Record<string, unknown>;
    slot2 = {
      categories: Array.isArray(s.categories) ? (s.categories as unknown[]).filter((c): c is string => typeof c === "string") : [],
      byCategory: (() => {
        const bc: Record<string, string[]> = {};
        if (s.byCategory != null && typeof s.byCategory === "object") {
          for (const [k, v] of Object.entries(s.byCategory)) {
            if (typeof k !== "string") continue;
            bc[k] = Array.isArray(v) ? (v as unknown[]).filter((c): c is string => typeof c === "string") : [];
          }
        }
        return bc;
      })(),
    };
  }
  const evidenceTestingPolicy = Array.isArray(o.evidenceTestingPolicy)
    ? (o.evidenceTestingPolicy as unknown[]).filter((c): c is string => typeof c === "string")
    : [];
  let err = validateFileNames(slot0);
  if (err) return { ok: false, message: err };
  err = validateFileNames(slot1);
  if (err) return { ok: false, message: err };
  for (const arr of Object.values(slot2.byCategory)) {
    err = validateFileNames(arr);
    if (err) return { ok: false, message: err };
  }
  err = validateFileNames(evidenceTestingPolicy);
  if (err) return { ok: false, message: err };
  return {
    ok: true,
    value: { "0": slot0, "1": slot1, "2": slot2, evidenceTestingPolicy },
  };
}

/**
 * POST vendor self attestation: insert or update by user_id.
 * - Validates user from JWT (id/userId or email fallback).
 * - Accepts attestation payload + document_uploads; maps to DB columns.
 * - If a row exists for user_id, update it; otherwise insert.
 * All DB access uses Drizzle ORM (parameterized). Handles validation and errors.
 */
const submitVendorSelfAttestation = async (req: Request, res: Response): Promise<void> => {
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
      });
      return;
    }

    // --- 2. Normalize request body (allow camelCase from frontend; map to snake_case columns) ---
    const b = req.body ?? {};
    const get = (key: string) => b[key] ?? b[key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())];

    const purchase_decision_makers = get("purchase_decision_makers");
    const pain_points_solved = get("pain_points_solved") != null ? String(get("pain_points_solved")) : null;
    const alternatives_considered = get("alternatives_considered") != null ? String(get("alternatives_considered")) : null;
    const unique_value_proposition = get("unique_value_proposition") != null ? String(get("unique_value_proposition")) : null;
    const typical_customer_roi = get("typical_customer_roi") != null ? String(get("typical_customer_roi")).slice(0, 500) : null;
    const ai_capabilities = get("ai_capabilities");
    const ai_model_types = get("ai_model_types");
    const model_transparency = get("model_transparency") != null ? String(get("model_transparency")).slice(0, 100) : null;
    const decision_autonomy = get("decision_autonomy") != null ? String(get("decision_autonomy")).slice(0, 100) : null;
    const security_certifications = get("security_certifications");
    const assessment_completion_level = get("assessment_completion_level") != null ? String(get("assessment_completion_level")).slice(0, 100) : null;
    const pii_handling = get("pii_handling") != null ? String(get("pii_handling")).slice(0, 100) : null;
    const data_residency_options = get("data_residency_options");
    const data_retention_policy = get("data_retention_policy") != null ? String(get("data_retention_policy")) : null;
    const bias_testing_approach = get("bias_testing_approach");
    const adversarial_security_testing = get("adversarial_security_testing") != null ? String(get("adversarial_security_testing")).slice(0, 100) : null;
    const human_oversight = get("human_oversight");
    const training_data_documentation = get("training_data_documentation") != null ? String(get("training_data_documentation")).slice(0, 100) : null;
    const uptime_sla = get("uptime_sla") != null ? String(get("uptime_sla")).slice(0, 100) : null;
    const incident_response_plan = get("incident_response_plan") != null ? String(get("incident_response_plan")).slice(0, 100) : null;
    const rollback_capability = get("rollback_capability") != null ? String(get("rollback_capability")).slice(0, 100) : null;
    const hosting_deployment = get("hosting_deployment");
    const deployment_scale = get("deployment_scale") != null ? String(get("deployment_scale")).slice(0, 100) : null;
    const product_stage = get("product_stage") != null ? String(get("product_stage")).slice(0, 100) : null;
    const interaction_data_available = get("interaction_data_available") != null ? String(get("interaction_data_available")).slice(0, 100) : null;
    const audit_logs_available = get("audit_logs_available") != null ? String(get("audit_logs_available")).slice(0, 100) : null;
    const testing_results_available = get("testing_results_available") != null ? String(get("testing_results_available")).slice(0, 100) : null;
    const document_uploadsRaw = get("document_uploads");
    const docUploadResult = normalizeDocumentUploads(document_uploadsRaw);
    if (!docUploadResult.ok) {
      res.status(400).json({ success: false, message: docUploadResult.message });
      return;
    }
    const document_uploads = Object.keys(docUploadResult.value).length > 0 ? docUploadResult.value : null;

    const values = {
      user_id: userId,
      purchase_decision_makers: Array.isArray(purchase_decision_makers) || (purchase_decision_makers != null && typeof purchase_decision_makers === "object") ? purchase_decision_makers : null,
      pain_points_solved,
      alternatives_considered,
      unique_value_proposition,
      typical_customer_roi,
      ai_capabilities: Array.isArray(ai_capabilities) || (ai_capabilities != null && typeof ai_capabilities === "object") ? ai_capabilities : null,
      ai_model_types: Array.isArray(ai_model_types) || (ai_model_types != null && typeof ai_model_types === "object") ? ai_model_types : null,
      model_transparency,
      decision_autonomy,
      security_certifications: Array.isArray(security_certifications) || (security_certifications != null && typeof security_certifications === "object") ? security_certifications : null,
      assessment_completion_level,
      pii_handling,
      data_residency_options: Array.isArray(data_residency_options) || (data_residency_options != null && typeof data_residency_options === "object") ? data_residency_options : null,
      data_retention_policy,
      bias_testing_approach: Array.isArray(bias_testing_approach) || (bias_testing_approach != null && typeof bias_testing_approach === "object") ? bias_testing_approach : null,
      adversarial_security_testing,
      human_oversight: Array.isArray(human_oversight) || (human_oversight != null && typeof human_oversight === "object") ? human_oversight : null,
      training_data_documentation,
      uptime_sla,
      incident_response_plan,
      rollback_capability,
      hosting_deployment: Array.isArray(hosting_deployment) || (hosting_deployment != null && typeof hosting_deployment === "object") ? hosting_deployment : null,
      deployment_scale,
      product_stage,
      interaction_data_available,
      audit_logs_available,
      testing_results_available,
      document_uploads,
    };

    // --- 3. Upsert: find existing by user_id; update or insert ---
    const existing = await db
      .select({ id: vendorSelfAttestations.id })
      .from(vendorSelfAttestations)
      .where(eq(vendorSelfAttestations.user_id, userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(vendorSelfAttestations)
        .set({
          ...values,
          updated_at: sql`now()`,
        })
        .where(eq(vendorSelfAttestations.user_id, userId));
      res.status(200).json({
        success: true,
        message: "Vendor self attestation updated successfully",
      });
      return;
    }

    await db.insert(vendorSelfAttestations).values(values);
    res.status(201).json({
      success: true,
      message: "Vendor self attestation saved successfully",
    });
  } catch (error) {
    console.error("submitVendorSelfAttestation error:", error);
    res.status(500).json({
      success: false,
      message: "Database or server error",
    });
  }
};

export default submitVendorSelfAttestation;
