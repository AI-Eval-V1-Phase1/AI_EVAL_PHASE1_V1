// backend/src/database/db.ts
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
// Create the postgresql client
const pool = new Pool({
    // connectionString: process.env.DATABASE_URL, // Connection String
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
});
// Create Drizzle ORM instance
export const db = drizzle({ client: pool });
// Optional: function to check connection
export async function initDB() {
    try {
        await db.execute(`SELECT 1 AS connected`);
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
