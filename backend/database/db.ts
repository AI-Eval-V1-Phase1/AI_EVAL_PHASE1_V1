// backend/src/database/db.ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Create the Neon client
const sql = neon(process.env.DATABASE_URL!);

// Create Drizzle ORM instance
export const db = drizzle({ client: sql });

// Optional: function to check connection
export async function initDB() {
  try {
    await db.execute(`SELECT 1 AS connected`);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err; // stop server if DB fails
  }
}

