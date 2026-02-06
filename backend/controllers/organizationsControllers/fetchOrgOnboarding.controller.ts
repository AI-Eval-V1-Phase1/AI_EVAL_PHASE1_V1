import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { buyerOnboarding } from "../../schema/buyer/addBuyer.schema.js";
import { vendorOnboarding } from "../../schema/vendor/addVendor.schema.js";
import { eq } from "drizzle-orm";

/** GET /orgOnboarding/:id - returns buyer and vendor onboarding data for the organization */
const fetchOrgOnboarding = async (req: Request, res: Response) => {
  try {
    const orgId = String(req.params.id ?? "").trim();
    if (!orgId) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const [buyer] = await db
      .select()
      .from(buyerOnboarding)
      .where(eq(buyerOnboarding.organizationId, orgId))
      .limit(1);

    const [vendor] = await db
      .select()
      .from(vendorOnboarding)
      .where(eq(vendorOnboarding.organizationId, orgId))
      .limit(1);

    return res.status(200).json({
      message: "Onboarding data fetched successfully",
      data: {
        buyer: buyer ?? null,
        vendor: vendor ?? null,
      },
    });
  } catch (error) {
    console.error(
      "Error in fetchOrgOnboarding:",
      error instanceof Error ? error.message : String(error)
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchOrgOnboarding;
