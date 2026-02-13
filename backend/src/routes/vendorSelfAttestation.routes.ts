import express from "express";
import fetchVendorSelfAttestation from "../controllers/vendorSelfAttestation/fetchVendorSelfAttestation.controller.js";
import submitVendorSelfAttestation from "../controllers/vendorSelfAttestation/submitVendorSelfAttestation.controller.js";
<<<<<<< HEAD
import getAttestationDocument from "../controllers/vendorSelfAttestation/getAttestationDocument.controller.js";
=======
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
import updateAttestationVisibility from "../controllers/vendorSelfAttestation/updateAttestationVisibility.controller.js";
import updateSectionVisibility from "../controllers/vendorSelfAttestation/updateSectionVisibility.controller.js";
import authenticateToken from "../middlewares/routesProtection.js";

const router = express.Router();

// GET: Fetch company profile + attestation data for the logged-in vendor
router.get("/vendorSelfAttestation", authenticateToken, fetchVendorSelfAttestation);

<<<<<<< HEAD
// GET: Serve an uploaded attestation document (for preview "open document")
router.get("/vendorSelfAttestation/document/:attestationId/:fileName", authenticateToken, getAttestationDocument);

=======
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
// POST: Submit or update vendor self attestation (upsert by user_id)
router.post("/vendorSelfAttestation", authenticateToken, submitVendorSelfAttestation);

// PATCH: Set visibility to buyers for a completed product (attestation)
router.patch("/vendorSelfAttestation/visibility", authenticateToken, updateAttestationVisibility);
// PATCH: Set which detail sections are visible to buyers (per card)
router.patch("/vendorSelfAttestation/section-visibility", authenticateToken, updateSectionVisibility);

export default router;
