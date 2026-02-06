import express from "express";
import insertVendorOnboarding from "../controllers/vendorOnboarding/addVendor.controllers.js";
import fetchVendorOnboarding from "../controllers/vendorOnboarding/fetchVendorOnboarding.controller.js";
import onboardingAccess from "../middlewares/onboarding/onboardingTokenVerify.middleware.js";
import authenticateToken from "../middlewares/routesProtection.js";

const vendorRoutes = express.Router();

// GET: Fetch vendor onboarding data for the logged-in user (JWT required)
vendorRoutes.get("/vendorOnboarding", authenticateToken, fetchVendorOnboarding);

vendorRoutes.post(
  "/vendorOnboarding",
  onboardingAccess,
  insertVendorOnboarding,
);

export default vendorRoutes;
