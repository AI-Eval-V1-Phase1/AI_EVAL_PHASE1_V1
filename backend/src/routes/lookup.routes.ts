import express from "express";
import authenticateToken from "../middlewares/routesProtection.js";
import getSectors from "../controllers/lookup/getSectors.controller.js";

const lookupRouter = express.Router();

// GET sectors with nested industries (for dropdowns and vendor/buyer sector details)
<<<<<<< HEAD
lookupRouter
.get("/sectors", authenticateToken, getSectors);
=======
lookupRouter.get("/sectors", authenticateToken, getSectors);
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8

export default lookupRouter;
