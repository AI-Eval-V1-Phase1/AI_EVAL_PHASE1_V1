import { timestamp } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const organizationStatusEnum = pgEnum("organizationStatus", [
  "active",
  "inactive",
]);

export const createOrg = pgTable("organizations", {
  id: serial("id").primaryKey(),
  organizationName: varchar("organizationName").notNull(),
  organizationStatus: organizationStatusEnum("organizationStatus")
    .default("active")
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
