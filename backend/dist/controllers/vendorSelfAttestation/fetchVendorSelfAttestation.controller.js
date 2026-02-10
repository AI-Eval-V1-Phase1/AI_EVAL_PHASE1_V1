import { db } from "../../database/db.js";
import { vendors, vendorSelfAttestations, usersTable } from "../../schema/schema.js";
import { and, desc, eq } from "drizzle-orm";
/** Map one attestation row to API shape (attestation section only) */
function mapAttestationRow(attestRow) {
    const raw = String(attestRow.status ?? "").toUpperCase();
    const rowStatus = raw === "DRAFT" ? "DRAFT" : "COMPLETED";
    return {
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
}
/** Build companyProfile from attestation row (saved draft company profile). Used when editing draft. */
function companyProfileFromAttestationRow(row) {
    const sectorRaw = row.target_industries;
    let sector = {};
    if (sectorRaw != null && typeof sectorRaw === "object" && !Array.isArray(sectorRaw)) {
        sector = sectorRaw;
    }
    else if (typeof sectorRaw === "string" && sectorRaw.trim()) {
        try {
            const p = JSON.parse(sectorRaw);
            sector = typeof p === "object" && p !== null ? p : {};
        }
        catch {
            sector = {};
        }
    }
    const opReg = row.operate_regions;
    const operatingRegions = Array.isArray(opReg) ? opReg : (opReg != null && typeof opReg === "object" ? opReg : []);
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
function attestationHasCompanyProfile(row) {
    return ((row.vendor_type != null && String(row.vendor_type).trim() !== "") ||
        (row.company_website != null && String(row.company_website).trim() !== "") ||
        (row.company_description != null && String(row.company_description).trim() !== "") ||
        (row.company_stage != null && String(row.company_stage).trim() !== ""));
}
/**
 * GET vendor self attestation: company profile + attestation(s).
 * - companyProfile: from vendor_onboarding (by organizationId or userId).
 * - Query ?id=xxx: return single attestation (for form edit); also set attestation for backward compat.
 * - No id: return attestations[] (all for user, newest first) and attestation (latest one for backward compat).
 */
const fetchVendorSelfAttestation = async (req, res) => {
    try {
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
                companyProfile: {},
                attestation: {},
                attestations: [],
            });
            return;
        }
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
        let companyProfile = {};
        if (vendorRow) {
            const r = vendorRow;
            const sectorRaw = r.sector;
            let sector = {};
            if (typeof sectorRaw === "string") {
                try {
                    const parsed = JSON.parse(sectorRaw);
                    sector = typeof parsed === "object" && parsed !== null ? parsed : {};
                }
                catch {
                    sector = {};
                }
            }
            else if (sectorRaw != null && typeof sectorRaw === "object") {
                sector = sectorRaw;
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
                        ? r.operatingRegions
                        : [],
            };
        }
        if (attestationId) {
            const [one] = await db
                .select()
                .from(vendorSelfAttestations)
                .where(and(eq(vendorSelfAttestations.id, attestationId), eq(vendorSelfAttestations.user_id, userId)))
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
            const oneRow = one;
            const attestation = mapAttestationRow(oneRow);
            // When editing a draft: use company profile saved in the attestation (draft data), not onboarding.
            let resolvedCompanyProfile = companyProfile;
            if (attestationHasCompanyProfile(oneRow)) {
                resolvedCompanyProfile = {
                    ...companyProfileFromAttestationRow(oneRow),
                    userId: companyProfile?.userId ?? vendorRow ? vendorRow.userId : undefined,
                    organizationId: companyProfile?.organizationId ?? vendorRow ? vendorRow.organizationId : undefined,
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
        const attestRows = await db
            .select()
            .from(vendorSelfAttestations)
            .where(eq(vendorSelfAttestations.user_id, userId))
            .orderBy(desc(vendorSelfAttestations.created_at));
        const attestations = attestRows.map((row) => mapAttestationRow(row));
        const attestation = attestations[0] ?? {};
        res.status(200).json({
            success: true,
            message: "Vendor self attestation data fetched successfully",
            companyProfile,
            attestation,
            attestations,
        });
    }
    catch (error) {
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
