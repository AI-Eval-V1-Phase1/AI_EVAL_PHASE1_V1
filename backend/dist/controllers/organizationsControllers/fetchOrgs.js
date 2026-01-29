"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selectOrganization_1 = require("../../schema/organizations/selectOrganization");
//** Fetch Organization Details and send it to frontend(client) side
const fetchOrganizations = async (req, res) => {
    try {
        const organizations = await selectOrganization_1.organizationsData;
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
