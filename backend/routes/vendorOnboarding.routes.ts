import express from "express";
import insertVendorOnboarding from "../controllers/vendorOnboarding/addVendor.controllers";
import onboardingAccess from "../middlewares/onboarding/onboardingTokenVerify.middleware";

const vendorRoutes = express.Router();

vendorRoutes.post(
  "/vendorOnboarding",
  onboardingAccess,
  insertVendorOnboarding,
);

export default vendorRoutes;
