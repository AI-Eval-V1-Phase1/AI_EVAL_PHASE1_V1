import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { vendors } from "../../schema/schema.js";
import { eq } from "drizzle-orm";

/**
 * Fetch vendor onboarding data for the currently authenticated user.
 * Uses userId from JWT (req.user) to look up the vendor_onboarding row.
 * Returns empty object when no record exists so the frontend can show an empty form.
 * All DB access uses Drizzle ORM (parameterized) to prevent SQL injection.
 */
const fetchVendorOnboarding = async (req: Request, res: Response): Promise<void> => {
  try {
    // --- 1. Ensure user is authenticated (userId from JWT / request context) ---
    const payload = req.user as { id?: number; userId?: string | number } | undefined;
    const rawId = payload?.id ?? payload?.userId;
    const userId = rawId != null ? Number(rawId) : NaN;

    if (!Number.isInteger(userId) || userId < 1) {
      res.status(401).json({
        success: false,
        message: "User not authenticated or invalid user identifier",
        data: {},
      });
      return;
    }

    // --- 2. Fetch vendor record by userId (single source of truth; one onboarding per user/org) ---
    const rows = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, userId))
      .limit(1);

    const row = rows[0] ?? null;

    // --- 3. Return clean JSON: data object or empty placeholder when no record ---
    if (!row) {
      res.status(200).json({
        success: true,
        message: "No vendor onboarding data found",
        data: {},
      });
      return;
    }

    // Map DB row to a clean API shape (camelCase, optional parsing of JSON fields)
    const sectorRaw = row.sector;
    let sector: Record<string, unknown> | string = {};
    if (typeof sectorRaw === "string") {
      try {
        const parsed = JSON.parse(sectorRaw);
        sector = typeof parsed === "object" && parsed !== null ? parsed : {};
      } catch {
        sector = {};
      }
    } else if (sectorRaw != null && typeof sectorRaw === "object") {
      sector = sectorRaw as Record<string, unknown>;
    }

    const data = {
      userId: row.userId,
      organizationId: row.organizationId,
      vendorType: row.vendorType ?? "",
      sector: sector ?? {},
      vendorMaturity: row.vendorMaturity ?? "",
      companyWebsite: row.companyWebsite ?? "",
      companyDescription: row.companyDescription ?? "",
      primaryContactName: row.primaryContactName ?? "",
      primaryContactEmail: row.primaryContactEmail ?? "",
      primaryContactRole: row.primaryContactRole ?? "",
      employeeCount: row.employeeCount ?? "",
      yearFounded: row.yearFounded ?? null,
      headquartersLocation: row.headquartersLocation ?? "",
      operatingRegions: Array.isArray(row.operatingRegions)
        ? row.operatingRegions
        : row.operatingRegions != null && typeof row.operatingRegions === "object"
          ? (row.operatingRegions as string[])
          : [],
    };

    res.status(200).json({
      success: true,
      message: "Vendor onboarding data fetched successfully",
      data,
    });
  } catch (error) {
    // --- 4. Handle database and unexpected errors ---
    console.error("fetchVendorOnboarding error:", error);
    res.status(500).json({
      success: false,
      message: "Database or server error",
      data: {},
    });
  }
};

export default fetchVendorOnboarding;
