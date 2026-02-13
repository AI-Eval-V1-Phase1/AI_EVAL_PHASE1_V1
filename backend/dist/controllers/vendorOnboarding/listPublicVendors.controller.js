import { db } from "../../database/db.js";
import { vendors } from "../../schema/schema.js";
import { eq } from "drizzle-orm";
/**
 * GET /vendorDirectory
 * Returns only vendors who have turned on Public Directory Listing (for buyer-facing directory).
 * When DB has public_directory_listing column, filter by it; when column is missing, returns [].
 */
const listPublicVendors = async (req, res) => {
    try {
        const selectFields = {
            id: vendors.id,
            userId: vendors.userId,
            organizationId: vendors.organizationId,
            vendorType: vendors.vendorType,
            companyWebsite: vendors.companyWebsite,
            companyDescription: vendors.companyDescription,
            headquartersLocation: vendors.headquartersLocation,
            vendorMaturity: vendors.vendorMaturity,
            sector: vendors.sector,
            publicDirectoryListing: vendors.publicDirectoryListing,
        };
        const rows = await db
            .select(selectFields)
            .from(vendors)
            .where(eq(vendors.publicDirectoryListing, true));
        const list = rows.map((r) => ({
            id: r.id,
            userId: r.userId,
            organizationId: r.organizationId,
            vendorType: r.vendorType ?? "",
            companyWebsite: r.companyWebsite ?? "",
            companyDescription: r.companyDescription ?? "",
            headquartersLocation: r.headquartersLocation ?? "",
            vendorMaturity: r.vendorMaturity ?? "",
            sector: r.sector ?? null,
        }));
        res.status(200).json({
            success: true,
            vendors: list,
        });
    }
    catch (e) {
        const err = e;
        const msg = err?.message ?? "";
        if (msg.includes("public_directory_listing") || msg.includes("does not exist")) {
            res.status(200).json({ success: true, vendors: [] });
            return;
        }
        console.error("listPublicVendors error:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export default listPublicVendors;
