import { db } from "../../database/db.js";
import { createOrganization } from "../../schema/organizations/createOrganization.js";
import { usersTable } from "../../schema/schema.js";
import { eq } from "drizzle-orm";
/** Fetch organizations with hasAdmin flag (each org can have only one admin for invite UI). */
const fetchOrganizations = async (req, res) => {
    try {
        const organizations = await db
            .select()
            .from(createOrganization);
        const orgNames = organizations.map((o) => o.organizationName);
        if (orgNames.length === 0) {
            return res.status(200).json({
                message: "Organizations fetched successfully",
                data: organizations.map((o) => ({ ...o, hasAdmin: false })),
            });
        }
        const adminRows = await db
            .select({ organization_name: usersTable.organization_name })
            .from(usersTable)
            .where(eq(usersTable.role, "admin"));
        const orgNamesWithAdmin = new Set(adminRows.map((r) => (r.organization_name ?? "").trim()).filter(Boolean));
        const data = organizations.map((org) => ({
            ...org,
            hasAdmin: orgNamesWithAdmin.has(org.organizationName),
        }));
        res.status(200).json({
            message: "Organizations fetched successfully",
            data,
        });
    }
    catch (error) {
        console.error("Error in fetchOrganizations:", error instanceof Error ? error.message : String(error));
        res.status(500).json({ error: "Internal server error" });
    }
};
export default fetchOrganizations;
