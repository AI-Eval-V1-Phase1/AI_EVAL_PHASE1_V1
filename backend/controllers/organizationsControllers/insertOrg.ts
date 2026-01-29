import { eq, exists } from "drizzle-orm";
import { db } from "../../database/db";
import { createOrganization, organizationsData } from "../../schema/schema";
import type { Request, Response } from "express";

const insertOrganization = async (req: Request, res: Response) => {
  //   console.log(req.body);
  const organizationName = req.body.isOrganizationName;
  //   console.log(organizationName)

  if (organizationName == "") {
    res.status(204).json({ message: "Organization name is required" });
    return;
  }

  const organizationDuplicates = await db
    .select()
    .from(createOrganization)
    .where(eq(createOrganization.organizationName, organizationName))
    .limit(1);

  // console.log("organizationDuplicates", organizationDuplicates);

  if (organizationDuplicates.length > 0) {
    res.status(409).json({ message: "Organization already exists" });
    return;
  }

  try {
    await db.insert(createOrganization).values({ organizationName });
    res.status(200).json({ message: "Organization received" });
  } catch (error) {
    console.log("Error in organizationController:", error.message);
  }
};

export default insertOrganization;
