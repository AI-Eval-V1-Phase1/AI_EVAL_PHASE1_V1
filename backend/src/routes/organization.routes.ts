import express from "express";
import insertOrganization from "../controllers/organizationsControllers/insertOrg.js";
import fetchOrganizations from "../controllers/organizationsControllers/fetchOrgs.js";
import authenticateToken from "../middlewares/routesProtection.js";
import updateOrganization from "../controllers/organizationsControllers/updateOrg.controllers.js";
import fetchOrgOnboarding from "../controllers/organizationsControllers/fetchOrgOnboarding.controller.js";
<<<<<<< HEAD
import getDashboardStats from "../controllers/organizationsControllers/dashboardStats.controller.js";
import listOrgAttestations from "../controllers/organizationsControllers/listOrgAttestations.controller.js";
import getOrgAttestationPreview from "../controllers/organizationsControllers/getOrgAttestationPreview.controller.js";

const orgrouter = express.Router();

orgrouter
.get("/dashboardStats", authenticateToken, getDashboardStats)
.get("/allOrganizations", authenticateToken, fetchOrganizations)
.get("/orgOnboarding/:id", authenticateToken, fetchOrgOnboarding)
.get("/orgAttestations/:id", authenticateToken, listOrgAttestations)
.get("/orgAttestationPreview/:orgId/:attestationId", authenticateToken, getOrgAttestationPreview)
.post("/newOrganization", authenticateToken, insertOrganization)
.put(
=======

const orgrouter = express.Router();

orgrouter.post("/newOrganization", authenticateToken, insertOrganization);
orgrouter.get("/allOrganizations", authenticateToken, fetchOrganizations);
orgrouter.put(
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
  "/updateOrganizations/:id",
  authenticateToken,
  updateOrganization,
);
<<<<<<< HEAD

=======
orgrouter.get("/orgOnboarding/:id", authenticateToken, fetchOrgOnboarding);
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8

// orgrouter.get("/orgOnboarding/:id",authenticateToken,onboardingData)

export default orgrouter;
