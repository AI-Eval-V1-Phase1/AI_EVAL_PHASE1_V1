import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { createOrganization } from "../../schema/organizations/createOrganization.js";
import { usersTable } from "../../schema/schema.js";
import { eq } from "drizzle-orm";

/** Fetch organizations with hasAdmin flag (each org can have only one admin for invite UI). */
const fetchOrganizations = async (req: Request, res: Response) => {
  try {
    const organizations = await db
      .select()
      .from(createOrganization);

<<<<<<< HEAD
    if (organizations.length === 0) {
=======
    const orgNames = organizations.map((o) => (o as { organizationName: string }).organizationName);
    if (orgNames.length === 0) {
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
      return res.status(200).json({
        message: "Organizations fetched successfully",
        data: organizations.map((o) => ({ ...o, hasAdmin: false })),
      });
    }

    const adminRows = await db
<<<<<<< HEAD
      .select({ organization_id: usersTable.organization_id })
      .from(usersTable)
      .where(eq(usersTable.role, "admin"));

    const orgIdsWithAdmin = new Set(
      adminRows.map((r) => r.organization_id).filter((id): id is number => id != null)
=======
      .select({ organization_name: usersTable.organization_name })
      .from(usersTable)
      .where(eq(usersTable.role, "admin"));

    const orgNamesWithAdmin = new Set(
      adminRows.map((r) => (r.organization_name ?? "").trim()).filter(Boolean)
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
    );

    const data = organizations.map((org) => ({
      ...org,
<<<<<<< HEAD
      hasAdmin: orgIdsWithAdmin.has(org.id),
=======
      hasAdmin: orgNamesWithAdmin.has((org as { organizationName: string }).organizationName),
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
    }));

    res.status(200).json({
      message: "Organizations fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error in fetchOrganizations:", error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: "Internal server error" });
  }
};

export default fetchOrganizations;
