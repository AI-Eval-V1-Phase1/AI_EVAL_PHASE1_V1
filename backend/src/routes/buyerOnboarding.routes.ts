import express from "express";
import onboardingAccess from "../middlewares/onboarding/onboardingTokenVerify.middleware.js";
import insertBuyerOnboarding from "../controllers/buyerOnboarding/addBuyer.controllers.js";
import authenticateToken from "../middlewares/routesProtection.js";
import getBuyerOnboardingMe from "../controllers/buyerOnboarding/getBuyerOnboardingMe.controller.js";


const buyerRoutes = express.Router();

buyerRoutes
.get("/buyerOnboarding/me", authenticateToken, getBuyerOnboardingMe)
.post("/buyerOnboarding", onboardingAccess, insertBuyerOnboarding);
 

export default buyerRoutes;
