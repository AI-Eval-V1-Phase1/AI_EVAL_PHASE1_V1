import express from "express";
import onboardingAccess from "../middlewares/onboarding/onboardingTokenVerify.middleware.js";
import insertBuyerOnboarding from "../controllers/buyerOnboarding/addBuyer.controllers.js";

const buyerRoutes = express.Router();

buyerRoutes.post("/buyerOnboarding", onboardingAccess, insertBuyerOnboarding);

export default buyerRoutes;
