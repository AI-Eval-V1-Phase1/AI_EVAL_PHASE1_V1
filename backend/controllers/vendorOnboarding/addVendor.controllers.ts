import type { Request, Response } from "express";
import { db } from "../../database/db";
import { usersTable, vendors } from "../../schema/schema";
import { eq } from "drizzle-orm";

const insertVendorOnboarding = async (req: Request, res: Response) => {
    console.log(req.body);
  try {
    const {
      vendorType,
      vendorId ,
      sector,
      vendorMaturity,
      companyWebsite,
      companyDescription,
      primaryContactName,
      primaryContactEmail,
      primaryContactRole,
      employeeCount,
      yearFounded,
      headquartersLocation,
      operatingRegions,
    } = req.body;

    if (!Array.isArray(operatingRegions)) {
      return res
        .status(400)
        .json({ error: "operatingRegions must be an array" });
    }

    const addVendor = await db.insert(vendors).values({
      vendorId: vendorId ,
      vendorType: vendorType,
      sector: sector,
      vendorMaturity: vendorMaturity,
      companyWebsite: companyWebsite,
      companyDescription: companyDescription,
      primaryContactName: primaryContactName,
      primaryContactEmail: primaryContactEmail,
      primaryContactRole: primaryContactRole,
      employeeCount: employeeCount,
      yearFounded: yearFounded,
      headquartersLocation: headquartersLocation,
      operatingRegions: operatingRegions,
    });

    const updatedUser = await db
      .update(usersTable)
      .set({
        user_platform_role: "vendor",
        user_onboarding_completed:"true"
      })
      .where(eq(usersTable.id, vendorId));

    res.status(201).json({ success: true, data: addVendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert vendor" });
  }
};

export default insertVendorOnboarding;
