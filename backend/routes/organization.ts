import express from "express";
import insertOrganization from "../controllers/organizationsControllers/insertOrg";
import fetchOrganizations from "../controllers/organizationsControllers/fetchOrgs";
import authenticateToken from "../middlewares/routesProtection";
import updateOrganization from "../controllers/organizationsControllers/updateOrg.controllers";

const orgrouter = express.Router(); 

orgrouter.post("/newOrganization",authenticateToken,insertOrganization);
orgrouter.get("/allOrganizations",authenticateToken,fetchOrganizations)
orgrouter.put("/updateOrganizations/:id",authenticateToken,updateOrganization)

export default orgrouter;
