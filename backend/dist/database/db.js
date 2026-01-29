"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDB = initDB;
// backend/src/database/db.ts
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env.local" });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
// Create the postgresql client
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Create Drizzle ORM instance
exports.db = (0, node_postgres_1.drizzle)({ client: pool });
// Optional: function to check connection
async function initDB() {
    try {
        await exports.db.execute(`SELECT 1 AS connected`);
        //     const result = await db.execute(`
        //   SELECT inet_server_addr(), inet_server_port(), current_database();
        // `);
        // console.log(result);
        console.log("Database connected successfully");
    }
    catch (err) {
        console.error("Database connection failed:", err);
        throw err; // stop server if DB fails
    }
}
