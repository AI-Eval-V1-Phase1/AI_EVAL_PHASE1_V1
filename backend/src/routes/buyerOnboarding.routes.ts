import express from "express";
import onboardingAccess from "../middlewares/onboarding/onboardingTokenVerify.middleware.js";
import insertBuyerOnboarding from "../controllers/buyerOnboarding/addBuyer.controllers.js";
import authenticateToken from "../middlewares/routesProtection.js";
import getBuyerOnboardingMe from "../controllers/buyerOnboarding/getBuyerOnboardingMe.controller.js";


const buyerRoutes = express.Router();

<<<<<<< HEAD
buyerRoutes
.get("/buyerOnboarding/me", authenticateToken, getBuyerOnboardingMe)
.post("/buyerOnboarding", onboardingAccess, insertBuyerOnboarding);
=======
buyerRoutes.post("/buyerOnboarding", onboardingAccess, insertBuyerOnboarding);
buyerRoutes.get("/buyerOnboarding/me", authenticateToken, getBuyerOnboardingMe);
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
 

export default buyerRoutes;
