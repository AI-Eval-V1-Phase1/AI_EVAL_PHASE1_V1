import { eq, sql } from "drizzle-orm";
import { db } from "../../database/db.js";
import { createOrganization } from "../../schema/schema.js";
import type { Request, Response } from "express";

const insertOrganization = async (req: Request, res: Response) => {
  try {
    let organizationName = req.body.isOrganizationName?.trim();
    const userId = req.body.user;

console.log("userId",userId)
    if (!organizationName) {
      return res
        .status(400)
        .json({ message: "Organization name is required" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const lowerCaseOrgName = organizationName.toLowerCase();

    const organizationDuplicates = await db
      .select()
      .from(createOrganization)
      .where(
        sql`${createOrganization.organizationName} = ${lowerCaseOrgName}`
      )
      .limit(1);

    if (organizationDuplicates.length > 0) {
      return res
        .status(409)
        .json({ message: "Organization already exists" });
    }


    const [organization] = await db
      .insert(createOrganization)
      .values({
        organizationName: lowerCaseOrgName,
        organizationStatus: "active",
        created_by: String(userId),
      })
      .returning();

    return res.status(201).json({
      message: "Organization created successfully",
      organization,
    });
  } catch (error: any) {
    console.error("Error in insertOrganization:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default insertOrganization;
