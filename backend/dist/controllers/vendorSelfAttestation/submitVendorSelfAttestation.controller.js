import { db } from "../../database/db.js";
import { vendorSelfAttestations, usersTable } from "../../schema/schema.js";
import { and, eq, sql } from "drizzle-orm";
/** Allowed file extensions for document_uploads (metadata only; actual files validated on frontend). */
const ALLOWED_DOC_EXTENSIONS = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];
const MAX_FILENAME_LENGTH = 255;
/**
 * Normalize and validate document_uploads from request.
 * Expected shape: "0": string[], "1": string[], "2": { categories, byCategory }, evidenceTestingPolicy?: string[].
 * Slot 2 can be legacy string[] (then normalized to { categories: [], byCategory: {} }).
 * Returns { ok: true, value } or { ok: false, message }.
 */
function normalizeDocumentUploads(raw) {
    if (raw == null)
        return { ok: true, value: {} };
    if (typeof raw !== "object")
        return { ok: false, message: "document_uploads must be an object" };
    const o = raw;
    const getExt = (name) => {
        const i = name.lastIndexOf(".");
        return i >= 0 ? name.slice(i).toLowerCase() : "";
    };
    const validateFileNames = (names) => {
        for (const name of names) {
            if (name.length > MAX_FILENAME_LENGTH)
                return `File name too long: ${name.slice(0, 30)}...`;
            const ext = getExt(name);
            if (ext && !ALLOWED_DOC_EXTENSIONS.includes(ext))
                return `Invalid file type for: ${name}. Accepted: PDF, DOCX, PPT.`;
        }
        return null;
    };
    const slot0 = Array.isArray(o["0"]) ? o["0"].filter((c) => typeof c === "string") : [];
    const slot1 = Array.isArray(o["1"]) ? o["1"].filter((c) => typeof c === "string") : [];
    let slot2 = { categories: [], byCategory: {} };
    const raw2 = o["2"];
    if (raw2 != null && typeof raw2 === "object" && !Array.isArray(raw2)) {
        const s = raw2;
        slot2 = {
            categories: Array.isArray(s.categories) ? s.categories.filter((c) => typeof c === "string") : [],
            byCategory: (() => {
                const bc = {};
                if (s.byCategory != null && typeof s.byCategory === "object") {
                    for (const [k, v] of Object.entries(s.byCategory)) {
                        if (typeof k !== "string")
                            continue;
                        bc[k] = Array.isArray(v) ? v.filter((c) => typeof c === "string") : [];
                    }
                }
                return bc;
            })(),
        };
    }
    const evidenceTestingPolicy = Array.isArray(o.evidenceTestingPolicy)
        ? o.evidenceTestingPolicy.filter((c) => typeof c === "string")
        : [];
    let err = validateFileNames(slot0);
    if (err)
        return { ok: false, message: err };
    err = validateFileNames(slot1);
    if (err)
        return { ok: false, message: err };
    for (const arr of Object.values(slot2.byCategory)) {
        err = validateFileNames(arr);
        if (err)
            return { ok: false, message: err };
    }
    err = validateFileNames(evidenceTestingPolicy);
    if (err)
        return { ok: false, message: err };
    return {
        ok: true,
        value: { "0": slot0, "1": slot1, "2": slot2, evidenceTestingPolicy },
    };
}
/**
 * POST vendor self attestation: create new or update existing by id.
 * - newAttestation: true OR no attestationId → always INSERT a new row (status DRAFT or COMPLETED). Never reuse or modify existing.
 * - attestationId provided (and not newAttestation) → UPDATE that row only if status is not COMPLETED (completed are immutable).
 * - New records: status "DRAFT" when is_draft true, "COMPLETED" when submit. Editing only by explicit attestationId.
 */
const submitVendorSelfAttestation = async (req, res) => {
    try {
        // --- 1. Resolve user id from JWT (id/userId) or by email ---
        const payload = req.user;
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
                if (users[0])
                    userId = users[0].id;
            }
        }
        if (!Number.isInteger(userId) || userId < 1) {
            res.status(401).json({
                success: false,
                message: "User not authenticated or invalid user identifier",
            });
            return;
        }
        // --- 2. Normalize request body: accept current API names (snake_case); map to DB columns (Excel sheet names) ---
        const b = req.body ?? {};
        const get = (key) => b[key] ?? b[key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())];
        const asJson = (v) => (Array.isArray(v) || (v != null && typeof v === "object") ? v : null);
        const productNameRaw = get("product_name") ?? get("productName");
        const product_name = productNameRaw != null && String(productNameRaw).trim() !== ""
            ? String(productNameRaw).trim().slice(0, 255)
            : null;
        const purchase_decisions_by = asJson(get("purchase_decision_makers"));
        const pain_points = get("pain_points_solved") != null ? String(get("pain_points_solved")) : null;
        const alternatives_consider = get("alternatives_considered") != null ? String(get("alternatives_considered")) : null;
        const unique_solution = get("unique_value_proposition") != null ? String(get("unique_value_proposition")) : null;
        const roi_value_metrics = get("typical_customer_roi") != null ? String(get("typical_customer_roi")).slice(0, 500) : null;
        const product_capabilities = asJson(get("ai_capabilities"));
        const ai_models_usage = asJson(get("ai_model_types"));
        const ai_model_transparency = get("model_transparency") != null ? String(get("model_transparency")).slice(0, 100) : null;
        const ai_autonomy_level = get("decision_autonomy") != null ? String(get("decision_autonomy")).slice(0, 100) : null;
        const security_compliance_certificates = asJson(get("security_certifications"));
        const assessment_feedback = get("assessment_completion_level") != null ? String(get("assessment_completion_level")).slice(0, 100) : null;
        const pii_information = get("pii_handling") != null ? String(get("pii_handling")).slice(0, 100) : null;
        const data_residency_options = asJson(get("data_residency_options"));
        const data_retention_policy = get("data_retention_policy") != null ? String(get("data_retention_policy")) : null;
        const bias_ai = asJson(get("bias_testing_approach"));
        const security_testing = get("adversarial_security_testing") != null ? String(get("adversarial_security_testing")).slice(0, 100) : null;
        const human_oversight = asJson(get("human_oversight"));
        const training_data_document = get("training_data_documentation") != null ? String(get("training_data_documentation")).slice(0, 100) : null;
        const sla_guarantee = get("uptime_sla") != null ? String(get("uptime_sla")).slice(0, 100) : null;
        const incident_response_plan = get("incident_response_plan") != null ? String(get("incident_response_plan")).slice(0, 100) : null;
        const rollback_deployment_issues = get("rollback_capability") != null ? String(get("rollback_capability")).slice(0, 100) : null;
        const solution_hosted = asJson(get("hosting_deployment"));
        const deployment_scale = get("deployment_scale") != null ? String(get("deployment_scale")).slice(0, 100) : null;
        const stage_product = get("product_stage") != null ? String(get("product_stage")).slice(0, 100) : null;
        const available_usage_data = get("interaction_data_available") != null ? String(get("interaction_data_available")).slice(0, 100) : null;
        const audit_logs = get("audit_logs_available") != null ? String(get("audit_logs_available")).slice(0, 100) : null;
        const test_results = get("testing_results_available") != null ? String(get("testing_results_available")).slice(0, 100) : null;
        const document_uploadsRaw = get("document_uploads");
        const docUploadResult = normalizeDocumentUploads(document_uploadsRaw);
        if (!docUploadResult.ok) {
            res.status(400).json({ success: false, message: docUploadResult.message });
            return;
        }
        const document_uploads = Object.keys(docUploadResult.value).length > 0 ? docUploadResult.value : null;
        // Company profile (from step 0): save with draft so editing draft shows saved data, not onboarding.
        const cp = (b.companyProfile && typeof b.companyProfile === "object") ? b.companyProfile : {};
        const cpGet = (key) => cp[key] ?? get(key);
        const sectorVal = cpGet("sector");
        const target_industries = sectorVal != null && typeof sectorVal === "object" ? sectorVal : (typeof sectorVal === "string" && sectorVal.trim() ? (() => { try {
            return JSON.parse(sectorVal);
        }
        catch {
            return null;
        } })() : null);
        const operatingRegionsRaw = cpGet("operatingRegions");
        const operate_regions = Array.isArray(operatingRegionsRaw) ? operatingRegionsRaw : (typeof operatingRegionsRaw === "string" && operatingRegionsRaw.trim() ? (() => { try {
            const p = JSON.parse(operatingRegionsRaw);
            return Array.isArray(p) ? p : null;
        }
        catch {
            return null;
        } })() : null);
        const companyProfileValues = {
            vendor_type: cpGet("vendorType") != null ? String(cpGet("vendorType")).slice(0, 100) : null,
            target_industries: target_industries != null && typeof target_industries === "object" ? target_industries : null,
            company_stage: cpGet("vendorMaturity") != null ? String(cpGet("vendorMaturity")).slice(0, 100) : null,
            company_website: cpGet("companyWebsite") != null ? String(cpGet("companyWebsite")).slice(0, 500) : null,
            company_description: cpGet("companyDescription") != null ? String(cpGet("companyDescription")) : null,
            no_of_employees: cpGet("employeeCount") != null ? String(cpGet("employeeCount")).slice(0, 100) : null,
            year_founded: (() => { const v = cpGet("yearFounded"); if (v == null || String(v).trim() === "")
                return null; const n = parseInt(String(v), 10); return Number.isInteger(n) ? n : null; })(),
            headquarter_location: cpGet("headquartersLocation") != null ? String(cpGet("headquartersLocation")).slice(0, 255) : null,
            operate_regions,
        };
        // Saving a draft does NOT mark as completed. Only final Submit sets COMPLETED.
        const rawDraft = get("is_draft");
        const isDraft = rawDraft === true ||
            rawDraft === "true" ||
            String(rawDraft).toLowerCase() === "true" ||
            rawDraft === 1;
        const status = isDraft ? "DRAFT" : "COMPLETED";
        const values = {
            user_id: userId,
            status,
            ...companyProfileValues,
            product_name,
            purchase_decisions_by,
            pain_points,
            alternatives_consider,
            unique_solution,
            roi_value_metrics,
            product_capabilities,
            ai_models_usage,
            ai_model_transparency,
            ai_autonomy_level,
            security_compliance_certificates,
            assessment_feedback,
            pii_information,
            data_residency_options,
            data_retention_policy,
            bias_ai,
            security_testing,
            human_oversight,
            training_data_document,
            sla_guarantee,
            incident_response_plan,
            rollback_deployment_issues,
            solution_hosted,
            deployment_scale,
            stage_product,
            available_usage_data,
            audit_logs,
            test_results,
            document_uploads,
        };
        const rawNew = get("newAttestation");
        const newAttestation = rawNew === true ||
            rawNew === "true" ||
            String(rawNew).toLowerCase() === "true" ||
            rawNew === 1;
        const attestationIdRaw = get("attestationId") ?? get("id");
        const attestationId = typeof attestationIdRaw === "string" ? attestationIdRaw.trim() || null : null;
        /** Map DB columns (Excel names) back to API response shape (current names for UI). */
        const buildAttestationResponse = (row) => ({
            id: row.id,
            status: row.status ?? status,
            created_at: row.created_at ?? undefined,
            updated_at: row.updated_at ?? undefined,
            product_name: row.product_name ?? undefined,
            purchase_decision_makers: row.purchase_decisions_by ?? undefined,
            pain_points_solved: row.pain_points ?? undefined,
            alternatives_considered: row.alternatives_consider ?? undefined,
            unique_value_proposition: row.unique_solution ?? undefined,
            typical_customer_roi: row.roi_value_metrics ?? undefined,
            ai_capabilities: row.product_capabilities ?? undefined,
            ai_model_types: row.ai_models_usage ?? undefined,
            model_transparency: row.ai_model_transparency ?? undefined,
            decision_autonomy: row.ai_autonomy_level ?? undefined,
            security_certifications: row.security_compliance_certificates ?? undefined,
            assessment_completion_level: row.assessment_feedback ?? undefined,
            pii_handling: row.pii_information ?? undefined,
            data_residency_options: row.data_residency_options ?? undefined,
            data_retention_policy: row.data_retention_policy ?? undefined,
            bias_testing_approach: row.bias_ai ?? undefined,
            adversarial_security_testing: row.security_testing ?? undefined,
            human_oversight: row.human_oversight ?? undefined,
            training_data_documentation: row.training_data_document ?? undefined,
            uptime_sla: row.sla_guarantee ?? undefined,
            incident_response_plan: row.incident_response_plan ?? undefined,
            rollback_capability: row.rollback_deployment_issues ?? undefined,
            hosting_deployment: row.solution_hosted ?? undefined,
            deployment_scale: row.deployment_scale ?? undefined,
            product_stage: row.stage_product ?? undefined,
            interaction_data_available: row.available_usage_data ?? undefined,
            audit_logs_available: row.audit_logs ?? undefined,
            testing_results_available: row.test_results ?? undefined,
            document_uploads: row.document_uploads ?? undefined,
        });
        // --- New Attestation: always INSERT (never reuse or overwrite existing). No attestationId = create new. ---
        if (newAttestation || !attestationId) {
            const [inserted] = await db
                .insert(vendorSelfAttestations)
                .values(values)
                .returning();
            res.status(201).json({
                success: true,
                message: isDraft ? "Draft saved successfully" : "Vendor self attestation submitted successfully",
                status,
                attestation: inserted ? buildAttestationResponse(inserted) : null,
            });
            return;
        }
        // --- Update existing by id: only if row belongs to user and is not COMPLETED (immutable) ---
        if (attestationId) {
            const [existingById] = await db
                .select({ id: vendorSelfAttestations.id, status: vendorSelfAttestations.status })
                .from(vendorSelfAttestations)
                .where(and(eq(vendorSelfAttestations.id, attestationId), eq(vendorSelfAttestations.user_id, userId)))
                .limit(1);
            if (!existingById) {
                res.status(404).json({ success: false, message: "Attestation not found" });
                return;
            }
            const currentStatus = String(existingById.status ?? "").toUpperCase();
            if (currentStatus === "COMPLETED") {
                res.status(403).json({
                    success: false,
                    message: "Completed attestations cannot be modified. Start a new attestation to make changes.",
                });
                return;
            }
            await db
                .update(vendorSelfAttestations)
                .set({ ...values, updated_at: sql `now()` })
                .where(eq(vendorSelfAttestations.id, attestationId));
            const [savedRow] = await db
                .select()
                .from(vendorSelfAttestations)
                .where(eq(vendorSelfAttestations.id, attestationId))
                .limit(1);
            res.status(200).json({
                success: true,
                message: isDraft ? "Draft saved successfully" : "Vendor self attestation submitted successfully",
                status,
                attestation: savedRow ? buildAttestationResponse(savedRow) : null,
            });
            return;
        }
        // --- Only reachable when attestationId is set and newAttestation is false: update that row (already handled above). ---
        res.status(400).json({
            success: false,
            message: "Either newAttestation or attestationId must be provided.",
        });
    }
    catch (error) {
        console.error("submitVendorSelfAttestation error:", error);
        res.status(500).json({
            success: false,
            message: "Database or server error",
        });
    }
};
export default submitVendorSelfAttestation;
