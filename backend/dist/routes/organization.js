"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const insertOrg_1 = __importDefault(require("../controllers/organizationsControllers/insertOrg"));
const fetchOrgs_1 = __importDefault(require("../controllers/organizationsControllers/fetchOrgs"));
const orgrouter = express_1.default.Router();
orgrouter.post("/newOrganization", insertOrg_1.default);
orgrouter.get("/allOrganizations", fetchOrgs_1.default);
exports.default = orgrouter;
