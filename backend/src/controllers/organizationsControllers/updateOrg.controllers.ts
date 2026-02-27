import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { createOrganization, organizationEditLogs } from "../../schema/schema.js";
import { eq } from "drizzle-orm";

const updateOrganization = async (req: Request, res: Response) => {
  const data = req.body;
  const orgId = Number(req.params.id);

  console.log("data =>", data);
  console.log("userId =>", orgId);

  if (!orgId) {
    return res.status(400).json({
      success: false,
      message: "Invalid organization id",
    });
  }

  try {
    const updateOrg = await db
      .update(createOrganization)
      .set({
        organizationName: data.isOrganization,
        organizationStatus: data.isStatus,
      })
      .where(eq(createOrganization.id, orgId));

    await db.insert(organizationEditLogs).values({
      organizationId: String(orgId),
      organizationName: data.isOrganization,
      organizationStatus: data.isStatus,
      updated_by: data.userId,
      reason: data.isReason,
    });

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update organization",
    });
  }
};

export default updateOrganization;
