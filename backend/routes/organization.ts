import express from "express";
import insertOrganization from "../controllers/organizationsControllers/insertOrg";
import fetchOrganizations from "../controllers/organizationsControllers/fetchOrgs";

const orgrouter = express.Router(); 

orgrouter.post("/newOrganization",insertOrganization);
orgrouter.get("/allOrganizations",fetchOrganizations)

export default orgrouter;
