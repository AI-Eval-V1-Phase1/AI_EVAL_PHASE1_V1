import type { Request, Response } from "express";
import { db } from "../../database/db.js";
<<<<<<< HEAD
import { vendors, vendorSelfAttestations, usersTable } from "../../schema/schema.js";
=======
import { vendors, vendorSelfAttestations } from "../../schema/schema.js";
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
import { and, desc, eq } from "drizzle-orm";

/**
 * GET /vendorDirectory/:vendorId/products
 * Returns only products (attestations) that are COMPLETED and visible_to_buyer = true
 * for the given vendor. Vendor must have publicDirectoryListing = true.
<<<<<<< HEAD
 * Query ?all=true (system admin only): returns all attestations for this vendor (any status).
=======
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
 */
const listVendorVisibleProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const vendorId = typeof req.params?.vendorId === "string" ? req.params.vendorId.trim() : null;
    if (!vendorId) {
      res.status(400).json({ success: false, message: "Vendor ID is required" });
      return;
    }

<<<<<<< HEAD
    const allProducts = typeof req.query?.all === "string" && req.query.all.trim().toLowerCase() === "true";
    let isSystemAdmin = false;
    if (allProducts) {
      const payload = req.user as { id?: number; userId?: string | number } | undefined;
      const rawId = payload?.id ?? payload?.userId;
      const userId = rawId != null ? Number(rawId) : NaN;
      if (Number.isInteger(userId) && userId >= 1) {
        const [row] = await db
          .select({ user_platform_role: usersTable.user_platform_role, role: usersTable.role, organization_id: usersTable.organization_id })
          .from(usersTable)
          .where(eq(usersTable.id, userId))
          .limit(1);
        const r = row as Record<string, unknown> | undefined;
        const platformRole = String(r?.user_platform_role ?? "").trim().toLowerCase();
        const role = String(r?.role ?? "").trim().toLowerCase();
        const orgId = r?.organization_id;
        isSystemAdmin =
          platformRole === "system admin" ||
          platformRole === "system_admin" ||
          platformRole === "systemadmin" ||
          (Number(orgId) === 1 && role === "admin");
      }
    }

=======
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
    const [vendor] = await db
      .select({
        id: vendors.id,
        userId: vendors.userId,
        publicDirectoryListing: vendors.publicDirectoryListing,
      })
      .from(vendors)
      .where(eq(vendors.id, vendorId))
      .limit(1);

    if (!vendor) {
      res.status(404).json({ success: false, message: "Vendor not found" });
      return;
    }

<<<<<<< HEAD
    if (!allProducts && !vendor.publicDirectoryListing) {
=======
    if (!vendor.publicDirectoryListing) {
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
      res.status(200).json({ success: true, products: [] });
      return;
    }

    const vendorUserId = vendor.userId != null ? Number(vendor.userId) : null;
    if (vendorUserId == null) {
      res.status(200).json({ success: true, products: [] });
      return;
    }

<<<<<<< HEAD
    const rows =
      allProducts && isSystemAdmin
        ? await db
            .select({
              id: vendorSelfAttestations.id,
              product_name: vendorSelfAttestations.product_name,
              status: vendorSelfAttestations.status,
              updated_at: vendorSelfAttestations.updated_at,
              visible_to_buyer: vendorSelfAttestations.visible_to_buyer,
            })
            .from(vendorSelfAttestations)
            .where(eq(vendorSelfAttestations.user_id, vendorUserId))
            .orderBy(desc(vendorSelfAttestations.updated_at))
        : await db
            .select({
              id: vendorSelfAttestations.id,
              product_name: vendorSelfAttestations.product_name,
              status: vendorSelfAttestations.status,
              updated_at: vendorSelfAttestations.updated_at,
              visible_to_buyer: vendorSelfAttestations.visible_to_buyer,
            })
            .from(vendorSelfAttestations)
            .where(
              and(
                eq(vendorSelfAttestations.user_id, vendorUserId),
                eq(vendorSelfAttestations.status, "COMPLETED"),
                eq(vendorSelfAttestations.visible_to_buyer, true)
              )
            )
            .orderBy(desc(vendorSelfAttestations.updated_at));

    const products = rows.map((r) => {
      const apiStatus = (r.status ?? "").toUpperCase();
      const status = apiStatus === "COMPLETED" ? "Completed" : apiStatus === "REJECTED" ? "Rejected" : "Draft";
      return {
        id: r.id,
        productName: (r.product_name ?? "").trim() || "Product",
        status,
        updated_at: r.updated_at ?? null,
      };
    });
=======
    const rows = await db
      .select({
        id: vendorSelfAttestations.id,
        product_name: vendorSelfAttestations.product_name,
        status: vendorSelfAttestations.status,
        updated_at: vendorSelfAttestations.updated_at,
        visible_to_buyer: vendorSelfAttestations.visible_to_buyer,
      })
      .from(vendorSelfAttestations)
      .where(
        and(
          eq(vendorSelfAttestations.user_id, vendorUserId),
          eq(vendorSelfAttestations.status, "COMPLETED"),
          eq(vendorSelfAttestations.visible_to_buyer, true)
        )
      )
      .orderBy(desc(vendorSelfAttestations.updated_at));

    const products = rows.map((r) => ({
      id: r.id,
      productName: (r.product_name ?? "").trim() || "Product",
      status: "Completed",
      updated_at: r.updated_at ?? null,
    }));
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8

    res.status(200).json({
      success: true,
      products,
    });
  } catch (e) {
    console.error("listVendorVisibleProducts error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default listVendorVisibleProducts;
