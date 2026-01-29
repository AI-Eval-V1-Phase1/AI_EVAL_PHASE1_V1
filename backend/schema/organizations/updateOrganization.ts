

//** Edit Organization schema

import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const organizationEditLogs = pgTable("organizationEditLogs", {
  id: serial("id").primaryKey(),
  organizationId: varchar("organizationId").notNull(),
  updated_by:varchar("updated_by").notNull(),
  reason: varchar("reason").notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});