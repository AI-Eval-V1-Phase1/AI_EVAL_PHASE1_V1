import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const getDirname = () => {
  if (typeof import.meta?.url !== "undefined") {
    return path.dirname(fileURLToPath(import.meta.url));
  }
  return path.resolve(process.cwd());
};
const rootDir = getDirname();
const migrationsDir = path.join(rootDir, "migrations");

export default defineConfig({
  schema: "./schema/schema.ts",
  out: migrationsDir,
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
