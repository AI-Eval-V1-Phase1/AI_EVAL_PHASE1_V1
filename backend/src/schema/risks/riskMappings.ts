import { pgTable, uuid, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";

/**
 * risk_mappings – stores data from "Shared Enhanced Risk Database Jan 2026.xlsx".
 * Holds both risk rows (risk_id, title, domain, description) and mapping rows
 * (mapping_id, risk_id, mitigation_action_*, mitigation_category, mitigation_definition).
 */
export const riskMappings = pgTable("risk_mappings", {
  id: uuid("id").defaultRandom().primaryKey(),
  mapping_id: integer("mapping_id"),
  risk_id: varchar("risk_id", { length: 50 }).notNull(),
  risk_title: varchar("risk_title", { length: 500 }),
  risk_domain: varchar("risk_domain", { length: 100 }),
  risk_description: text("risk_description"),
  mitigation_action_id: varchar("mitigation_action_id", { length: 100 }),
  mitigation_action_name: varchar("mitigation_action_name", { length: 500 }),
  mitigation_category: varchar("mitigation_category", { length: 200 }),
  mitigation_definition: text("mitigation_definition"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
