import type { Request, Response } from "express";
import { db } from "../../database/db";
import { buyersTable, usersTable } from "../../schema/schema";
import { eq } from "drizzle-orm";

const insertBuyerOnboarding = async (req: Request, res: Response) => {
  try {
    const {
      vendorId,
      organizationName,
      organizationType,
      sector,
      organizationWebsite,
      organizationDescription,
      primaryContactName,
      primaryContactEmail,
      primaryContactRole,
      departmentOwner,
      employeeCount,
      annualRevenue,
      yearFounded,
      headquartersLocation,
      operatingRegions,
      dataResidencyRequirements,
      existingAIInitiatives,
      aiGovernanceMaturity,
      dataGovernanceMaturity,
      aiSkillsAvailability,
      changeManagementCapability,
      primaryRegulatoryFrameworks,
      regulatoryPenaltyExposure,
      dataClassificationHandled,
      piiHandling,
      existingTechStack,
      aiRiskAppetite,
      acceptableRiskLevel,
    } = req.body;

 const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, vendorId))
      .limit(1);

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (existingUser[0].user_onboarding_completed === "true") {
      return res
        .status(200)
        .json({ message: "Onboarding already completed" });
    }

    const addBuyer = await db.insert(buyersTable).values({
      buyerId: vendorId,
      organizationName,
      organizationType,
      sector: typeof sector === "object" ? JSON.stringify(sector) : sector,
      organizationWebsite,
      organizationDescription,
      primaryContactName,
      primaryContactEmail,
      primaryContactRole,
      departmentOwner,
      employeeCount,
      annualRevenue,
      yearFounded,
      headquartersLocation,
      operatingRegions: JSON.stringify(operatingRegions),
      dataResidencyRequirements: JSON.stringify(dataResidencyRequirements),
      existingAIInitiatives,
      aiGovernanceMaturity,
      dataGovernanceMaturity,
      aiSkillsAvailability,
      changeManagementCapability,
      primaryRegulatoryFrameworks: JSON.stringify(primaryRegulatoryFrameworks),
      regulatoryPenaltyExposure,
      dataClassificationHandled: JSON.stringify(dataClassificationHandled),
      piiHandling,
      existingTechStack: JSON.stringify(existingTechStack),
      aiRiskAppetite,
      acceptableRiskLevel,
    });

    await db
      .update(usersTable)
      .set({
        user_platform_role: "buyer",
        user_onboarding_completed: "true",
      })
      .where(eq(usersTable.id, vendorId));

    res.status(201).json({ success: true, data: addBuyer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert vendor" });
  }
};

export default insertBuyerOnboarding;
