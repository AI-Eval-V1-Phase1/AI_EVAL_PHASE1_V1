import { db } from "../../database/db.js";
import { createOrganization } from "../../schema/organizations/createOrganization.js";
import { buyerOnboarding } from "../../schema/buyer/addBuyer.schema.js";
import { vendorOnboarding } from "../../schema/vendor/addVendor.schema.js";
import { eq, or } from "drizzle-orm";
/** GET /orgOnboarding/:id - returns buyer and vendor onboarding data for the organization.
 *  :id is the organization's numeric id from the organizations table.
 *  Onboarding tables may store organization_id as either this id or the org name, so we match both.
 */
const fetchOrgOnboarding = async (req, res) => {
    try {
        const orgIdParam = String(req.params.id ?? "").trim();
        if (!orgIdParam) {
            return res.status(400).json({ message: "Organization ID is required" });
        }
        const orgRow = await db
            .select({
            id: createOrganization.id,
            organizationName: createOrganization.organizationName,
        })
            .from(createOrganization)
            .where(eq(createOrganization.id, Number(orgIdParam) || 0))
            .limit(1);
        const orgName = orgRow[0]?.organizationName ?? null;
        const buyerWhere = orgName
            ? or(eq(buyerOnboarding.organizationId, orgIdParam), eq(buyerOnboarding.organizationId, orgName))
            : eq(buyerOnboarding.organizationId, orgIdParam);
        const [buyer] = await db
            .select()
            .from(buyerOnboarding)
            .where(buyerWhere)
            .limit(1);
        const vendorWhere = orgName
            ? or(eq(vendorOnboarding.organizationId, orgIdParam), eq(vendorOnboarding.organizationId, orgName))
            : eq(vendorOnboarding.organizationId, orgIdParam);
        const [vendor] = await db
            .select()
            .from(vendorOnboarding)
            .where(vendorWhere)
            .limit(1);
        return res.status(200).json({
            message: "Onboarding data fetched successfully",
            data: {
                buyer: buyer ?? null,
                vendor: vendor ?? null,
            },
        });
    }
    catch (error) {
        console.error("Error in fetchOrgOnboarding:", error instanceof Error ? error.message : String(error));
        return res.status(500).json({ message: "Internal server error" });
    }
};
export default fetchOrgOnboarding;
