import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../database/db.js";
import { usersTable, generatedProfileReports } from "../../schema/schema.js";
import { generateVendorAttestationReport, parseScoreFromTrustText } from "../agents/vendorAttestation.js";

/**
 * POST /vendorSelfAttestation/generate-profile
 * Body: { vendorData: string, attestationId?: string }
 * Returns structured product profile report (trust score + sections) for display in UI cards.
 * Stores the report in generated_profile_reports (user_id, organization_id, optional attestation_id, trust_score, report).
 */
const generateProductProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const vendorData = typeof req.body?.vendorData === "string" ? req.body.vendorData : "";
    if (!vendorData.trim()) {
      res.status(400).json({
        success: false,
        message: "vendorData is required and must be a non-empty string",
      });
      return;
    }

    const payload = req.user as { id?: number; userId?: string | number; email?: string } | undefined;
    let rawId = payload?.id ?? payload?.userId;
    let userId = rawId != null ? Number(rawId) : NaN;

    if ((!Number.isInteger(userId) || userId < 1) && payload?.email) {
      const email = String(payload.email).trim();
      if (email) {
        const users = await db
          .select({ id: usersTable.id })
          .from(usersTable)
          .where(eq(usersTable.email, email))
          .limit(1);
        if (users[0]) userId = users[0].id;
      }
    }

    if (!Number.isInteger(userId) || userId < 1) {
      res.status(401).json({
        success: false,
        message: "User not authenticated or invalid user identifier",
      });
      return;
    }

    const [userRow] = await db
      .select({ organization_id: usersTable.organization_id })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    const organizationIdStr = userRow?.organization_id != null ? String(userRow.organization_id) : null;

    const report = await generateVendorAttestationReport(vendorData);
    let trustScore =
      typeof report.trustScore?.overallScore === "number" ? report.trustScore.overallScore : 0;
    if (trustScore === 0 && report.trustScore) {
      const fromSummary = parseScoreFromTrustText(String(report.trustScore.summary ?? ""));
      const fromLabel = parseScoreFromTrustText(String(report.trustScore.label ?? ""));
      const fallback = fromSummary ?? fromLabel ?? null;
      if (fallback != null) trustScore = fallback;
    }
    const trustScoreForPayload =
      trustScore !== 0 && report.trustScore
        ? { ...report.trustScore, overallScore: trustScore }
        : report.trustScore;
    const reportPayload = {
      trustScore: trustScoreForPayload,
      sections: report.sections,
    };

    const attestationIdRaw = req.body?.attestationId ?? req.body?.attestation_id;
    const attestationId =
      typeof attestationIdRaw === "string" && attestationIdRaw.trim() ? attestationIdRaw.trim() : null;

    const summaryText =
      typeof trustScoreForPayload === "object" && trustScoreForPayload !== null && "summary" in trustScoreForPayload
        ? String((trustScoreForPayload as { summary?: string }).summary ?? "")
        : "";
    await db.insert(generatedProfileReports).values({
      user_id: userId,
      organization_id: organizationIdStr,
      attestation_id: attestationId ?? undefined,
      trust_score: trustScore,
      summary: summaryText || undefined,
      report: reportPayload,
    });

    res.status(200).json({
      success: true,
      data: {
        trustScore: trustScoreForPayload,
        sections: report.sections,
      },
    });
  } catch (error) {
    console.error("generateProductProfile error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to generate product profile",
    });
  }
};

export default generateProductProfile;
