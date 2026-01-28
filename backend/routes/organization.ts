import express from "express";
import inserOrganization from "../controllers/organizationsControllers/inserOrg";
import fetchOrganizations from "../controllers/organizationsControllers/fetchOrgs";

const orgrouter = express.Router(); 

orgrouter.post("/newOrganization",inserOrganization);
orgrouter.get("/allOrganizations",fetchOrganizations)

export default orgrouter;
