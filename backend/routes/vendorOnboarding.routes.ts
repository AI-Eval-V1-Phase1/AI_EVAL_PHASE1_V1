import express from "express";
import insertVendorOnboarding from "../controllers/vendorOnboarding/addVendor.controllers.js";
import onboardingAccess from "../middlewares/onboarding/onboardingTokenVerify.middleware.js";

const vendorRoutes = express.Router();

vendorRoutes.post(
  "/vendorOnboarding",
  onboardingAccess,
  insertVendorOnboarding,
);

export default vendorRoutes;
