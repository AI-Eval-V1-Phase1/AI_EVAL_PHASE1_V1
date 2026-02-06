import express from "express";
import fetchVendorSelfAttestation from "../controllers/vendorSelfAttestation/fetchVendorSelfAttestation.controller.js";
import submitVendorSelfAttestation from "../controllers/vendorSelfAttestation/submitVendorSelfAttestation.controller.js";
import authenticateToken from "../middlewares/routesProtection.js";

const router = express.Router();

// GET: Fetch company profile + attestation data for the logged-in vendor
router.get("/vendorSelfAttestation", authenticateToken, fetchVendorSelfAttestation);

// POST: Submit or update vendor self attestation (upsert by user_id)
router.post("/vendorSelfAttestation", authenticateToken, submitVendorSelfAttestation);

export default router;
