"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDB = initDB;
// backend/src/database/db.ts
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env.local" });
const serverless_1 = require("@neondatabase/serverless");
const neon_http_1 = require("drizzle-orm/neon-http");
// Create the Neon client
const sql = (0, serverless_1.neon)(process.env.DATABASE_URL);
// Create Drizzle ORM instance
exports.db = (0, neon_http_1.drizzle)({ client: sql });
// Optional: function to check connection
async function initDB() {
    try {
        await exports.db.execute(`SELECT 1 AS connected`);
        console.log("Database connected successfully");
    }
    catch (err) {
        console.error("Database connection failed:", err);
        throw err; // stop server if DB fails
    }
}
