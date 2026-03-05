import type { Request, Response } from "express";
import { eq, desc } from "drizzle-orm";
import { db } from "../../database/db.js";
import { usersTable } from "../../schema/schema.js";
import { customerRiskAssessmentReports } from "../../schema/assessments/customerRiskAssessmentReports.js";
import { assessments } from "../../schema/assessments/assessments.js";

/**
 * GET /customerRiskReports
 * Returns Analysis Report records for the current user's organization, newest first.
 */
const listCustomerRiskReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.user as { id?: number; userId?: string | number; organization_id?: string } | undefined;
    let rawId = payload?.id ?? payload?.userId;
    let userId = rawId != null ? Number(rawId) : NaN;

    if (!Number.isInteger(userId) || userId < 1) {
      res.status(401).json({
        success: false,
        message: "User not authenticated or invalid user identifier",
      });
      return;
    }

    const [user] = await db
      .select({ organization_id: usersTable.organization_id })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    const orgId = user?.organization_id != null ? String(user.organization_id).trim() : "";
    if (!orgId) {
      res.status(200).json({ success: true, data: { reports: [] } });
      return;
    }

    const rows = await db
      .select({
        id: customerRiskAssessmentReports.id,
        assessmentId: customerRiskAssessmentReports.assessment_id,
        title: customerRiskAssessmentReports.title,
        report: customerRiskAssessmentReports.report,
        createdAt: customerRiskAssessmentReports.created_at,
        expiryAt: assessments.expiry_at,
      })
      .from(customerRiskAssessmentReports)
      .innerJoin(assessments, eq(customerRiskAssessmentReports.assessment_id, assessments.id))
      .where(eq(customerRiskAssessmentReports.organization_id, orgId))
      .orderBy(desc(customerRiskAssessmentReports.created_at))
      .limit(100);

    const reports = rows.map((r) => ({
      id: r.id,
      assessmentId: r.assessmentId,
      title: r.title,
      report: r.report,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      expiryAt: r.expiryAt instanceof Date ? r.expiryAt.toISOString() : (r.expiryAt != null ? String(r.expiryAt) : null),
    }));

    res.status(200).json({
      success: true,
      data: { reports },
    });
  } catch (error) {
    console.error("listCustomerRiskReports error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to list customer risk reports",
    });
  }
};

export default listCustomerRiskReports;
