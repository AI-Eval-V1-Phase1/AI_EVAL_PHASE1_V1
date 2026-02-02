import express from "express";
import onboardingAccess from "../middlewares/onboarding/onboardingTokenVerify.middleware";
import insertBuyerOnboarding from "../controllers/buyerOnboarding/addBuyer.controllers";

const buyerRoutes = express.Router();

buyerRoutes.post("/buyerOnboarding", onboardingAccess, insertBuyerOnboarding);

export default buyerRoutes;
