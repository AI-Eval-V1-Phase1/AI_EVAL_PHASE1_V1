"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../database/db");
const schema_1 = require("../../schema");
const inserOrganization = async (req, res) => {
    //   console.log(req.body);
    const organizationName = req.body.isOrganizationName;
    //   console.log(organizationName)
    try {
        await db_1.db.insert(schema_1.createOrg).values({ organizationName });
        res.status(200).json({ message: "Organization received" });
    }
    catch (error) {
        console.log("Error in organizationController:", error.message);
    }
};
exports.default = inserOrganization;
