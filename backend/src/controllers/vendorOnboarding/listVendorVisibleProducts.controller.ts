import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { vendors, vendorSelfAttestations } from "../../schema/schema.js";
import { and, desc, eq } from "drizzle-orm";

/**
 * GET /vendorDirectory/:vendorId/products
 * Returns only products (attestations) that are COMPLETED and visible_to_buyer = true
 * for the given vendor. Vendor must have publicDirectoryListing = true.
 */
const listVendorVisibleProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const vendorId = typeof req.params?.vendorId === "string" ? req.params.vendorId.trim() : null;
    if (!vendorId) {
      res.status(400).json({ success: false, message: "Vendor ID is required" });
      return;
    }

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

    if (!vendor.publicDirectoryListing) {
      res.status(200).json({ success: true, products: [] });
      return;
    }

    const vendorUserId = vendor.userId != null ? Number(vendor.userId) : null;
    if (vendorUserId == null) {
      res.status(200).json({ success: true, products: [] });
      return;
    }

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
