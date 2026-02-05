import express from "express";
import insertOrganization from "../controllers/organizationsControllers/insertOrg.js";
import fetchOrganizations from "../controllers/organizationsControllers/fetchOrgs.js";
import authenticateToken from "../middlewares/routesProtection.js";
import updateOrganization from "../controllers/organizationsControllers/updateOrg.controllers.js";
const orgrouter = express.Router();
orgrouter.post("/newOrganization", authenticateToken, insertOrganization);
orgrouter.get("/allOrganizations", authenticateToken, fetchOrganizations);
orgrouter.put("/updateOrganizations/:id", authenticateToken, updateOrganization);
// orgrouter.get("/orgOnboarding/:id",authenticateToken,onboardingData)
export default orgrouter;
