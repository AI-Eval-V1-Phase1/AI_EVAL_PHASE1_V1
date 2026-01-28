"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../database/db");
const schema_1 = require("../../schema");
const fetchOrganizations = async (req, res) => {
    try {
        const organizations = await db_1.db
            .select()
            .from(schema_1.createOrg);
        res.status(200).json({
            message: "Organizations fetched successfully",
            data: organizations,
        });
    }
    catch (error) {
        console.error("Error in fetchOrganizations:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.default = fetchOrganizations;
