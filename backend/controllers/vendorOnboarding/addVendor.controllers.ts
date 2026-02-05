import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { usersTable, vendors } from "../../schema/schema.js";
import { and, eq, sql } from "drizzle-orm";

const insertVendorOnboarding = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const {
      vendorType,
      organization_Id: bodyOrgId,
      organizationId: bodyOrgIdCamel,
      vendorId: bodyVendorId,
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

    // Prefer user set by onboarding middleware (from token)
    let user = req.onboardingUser;

    if (!user && bodyVendorId != null && !Number.isNaN(Number(bodyVendorId))) {
      const byId = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, Number(bodyVendorId)))
        .limit(1);
      user = byId[0] ?? undefined;
    }

    if (!user && (bodyOrgId ?? bodyOrgIdCamel)) {
      const orgStr = String(bodyOrgId ?? bodyOrgIdCamel ?? "").trim();
      if (orgStr) {
        const byOrg = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.organization_name, orgStr))
          .limit(1);
        user = byOrg[0] ?? undefined;
      }
    }

    if (!user && bodyVendorId != null && (bodyOrgId ?? bodyOrgIdCamel)) {
      const byBoth = await db
        .select()
        .from(usersTable)
        .where(
          and(
            eq(usersTable.id, Number(bodyVendorId)),
            eq(usersTable.organization_name, String(bodyOrgId ?? bodyOrgIdCamel ?? "")),
          ),
        )
        .limit(1);
      user = byBoth[0] ?? undefined;
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.user_onboarding_completed === "true") {
      return res.status(200).json({ message: "Onboarding already completed" });
    }

    const organizationId = bodyOrgId ?? bodyOrgIdCamel ?? user.organization_name;
    const sectorValue =
      sector != null && typeof sector === "object"
        ? JSON.stringify(sector)
        : sector != null
          ? String(sector)
          : null;
    const yearFoundedNum =
      yearFounded != null ? Number(yearFounded) : new Date().getFullYear();
    const operatingRegionsValue =
      Array.isArray(operatingRegions) || (operatingRegions != null && typeof operatingRegions === "object")
        ? operatingRegions
        : null;

    const vendorValues = {
      userId: user.id,
      organizationId: String(organizationId ?? user.organization_name),
      vendorType: String(vendorType ?? ""),
      sector: sectorValue,
      vendorMaturity: vendorMaturity != null ? String(vendorMaturity) : null,
      companyWebsite: String(companyWebsite ?? ""),
      companyDescription: String(companyDescription ?? ""),
      primaryContactName: String(primaryContactName ?? ""),
      primaryContactEmail: String(primaryContactEmail ?? ""),
      primaryContactRole:
        primaryContactRole != null ? String(primaryContactRole) : null,
      employeeCount: String(employeeCount ?? ""),
      yearFounded: Number.isNaN(yearFoundedNum) ? new Date().getFullYear() : yearFoundedNum,
      headquartersLocation: String(headquartersLocation ?? ""),
      operatingRegions: operatingRegionsValue,
    };

    const addVendor = await db
      .insert(vendors)
      .values(vendorValues)
      .onConflictDoUpdate({
        target: vendors.organizationId,
        set: {
          userId: user.id,
          vendorType: vendorValues.vendorType,
          sector: vendorValues.sector,
          vendorMaturity: vendorValues.vendorMaturity,
          companyWebsite: vendorValues.companyWebsite,
          companyDescription: vendorValues.companyDescription,
          primaryContactName: vendorValues.primaryContactName,
          primaryContactEmail: vendorValues.primaryContactEmail,
          primaryContactRole: vendorValues.primaryContactRole,
          employeeCount: vendorValues.employeeCount,
          yearFounded: vendorValues.yearFounded,
          headquartersLocation: vendorValues.headquartersLocation,
          operatingRegions: vendorValues.operatingRegions,
          updatedAt: sql`now()`,
        },
      });

    const updatedUser = await db
      .update(usersTable)
      .set({
        user_platform_role: "vendor",
        user_onboarding_completed: "true",
      })
      .where(eq(usersTable.id, user.id));

    res.status(201).json({ success: true, data: addVendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert vendor" });
  }
};

export default insertVendorOnboarding;
