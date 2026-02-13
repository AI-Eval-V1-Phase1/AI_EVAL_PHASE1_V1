import type { Request, Response } from "express";
<<<<<<< HEAD
import * as jwt from "jsonwebtoken";
import { db } from "../../database/db.js";
import { createOrganization, usersTable, vendors } from "../../schema/schema.js";
=======
import { db } from "../../database/db.js";
import { usersTable, vendors } from "../../schema/schema.js";
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
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

<<<<<<< HEAD
    if (!user && (bodyOrgId ?? bodyOrgIdCamel) != null) {
      const orgIdNum = Number(bodyOrgId ?? bodyOrgIdCamel);
      if (!Number.isNaN(orgIdNum)) {
        const byOrg = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.organization_id, orgIdNum))
=======
    if (!user && (bodyOrgId ?? bodyOrgIdCamel)) {
      const orgStr = String(bodyOrgId ?? bodyOrgIdCamel ?? "").trim();
      if (orgStr) {
        const byOrg = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.organization_name, orgStr))
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
          .limit(1);
        user = byOrg[0] ?? undefined;
      }
    }

<<<<<<< HEAD
    if (!user && bodyVendorId != null && (bodyOrgId ?? bodyOrgIdCamel) != null) {
      const orgIdNum = Number(bodyOrgId ?? bodyOrgIdCamel);
      if (!Number.isNaN(orgIdNum)) {
        const byBoth = await db
          .select()
          .from(usersTable)
          .where(
            and(
              eq(usersTable.id, Number(bodyVendorId)),
              eq(usersTable.organization_id, orgIdNum),
            ),
          )
          .limit(1);
        user = byBoth[0] ?? undefined;
      }
=======
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
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.user_onboarding_completed === "true") {
      return res.status(200).json({ message: "Onboarding already completed" });
    }

<<<<<<< HEAD
    const organizationIdRaw = bodyOrgId ?? bodyOrgIdCamel ?? user.organization_id;
=======
    const organizationIdRaw = bodyOrgId ?? bodyOrgIdCamel ?? user.organization_name;
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
    const organizationId = String(organizationIdRaw ?? "").trim();
    if (!organizationId) {
      return res.status(400).json({
        error: "Organization ID is required",
<<<<<<< HEAD
        details: "organization_Id, organizationId, or user organization_id is missing or empty",
=======
        details: "organization_Id, organizationId, or user organization_name is missing or empty",
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
      });
    }

    const sectorValue =
      sector != null && typeof sector === "object"
        ? JSON.stringify(sector)
        : sector != null
          ? String(sector)
          : null;
    const sectorTruncated =
      sectorValue != null && sectorValue.length > 500
        ? sectorValue.slice(0, 500)
        : sectorValue;

    const yearFoundedNum =
      yearFounded != null ? Number(yearFounded) : new Date().getFullYear();
    const operatingRegionsValue =
      Array.isArray(operatingRegions) || (operatingRegions != null && typeof operatingRegions === "object")
        ? operatingRegions
        : null;

    const vendorValues = {
      userId: user.id,
      organizationId,
      vendorType: String(vendorType ?? ""),
      sector: sectorTruncated,
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

<<<<<<< HEAD
    await db
=======
    const updatedUser = await db
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
      .update(usersTable)
      .set({
        user_platform_role: "vendor",
        user_onboarding_completed: "true",
      })
      .where(eq(usersTable.id, user.id));

<<<<<<< HEAD
    const [updatedRow] = await db
      .select({
        user: usersTable,
        organizationName: createOrganization.organizationName,
      })
      .from(usersTable)
      .leftJoin(createOrganization, eq(usersTable.organization_id, createOrganization.id))
      .where(eq(usersTable.id, user.id))
      .limit(1);

    const u = updatedRow?.user;
    const organizationName = updatedRow?.organizationName ?? "";

    const secret = process.env.JWT_SECRET_KEY ?? "";
    if (!secret) throw new Error("JWT_SECRET_KEY not set");
    const token = jwt.sign(
      { id: u?.id, email: u?.email, userRole: u?.role },
      secret,
      { expiresIn: "24h" },
    );

    const userDetails = [
      {
        ...u,
        organization_name: organizationName,
        organization_id: u?.organization_id,
      },
    ];

    res.status(201).json({
      success: true,
      data: addVendor,
      token,
      userDetails,
    });
=======
    res.status(201).json({ success: true, data: addVendor });
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const code = error && typeof (error as { code?: string }).code === "string" ? (error as { code: string }).code : undefined;
    console.error("Vendor onboarding insert error:", error);
    res.status(500).json({
      error: "Failed to insert vendor",
      details: message,
      ...(code && { code }),
    });
  }
};

export default insertVendorOnboarding;
