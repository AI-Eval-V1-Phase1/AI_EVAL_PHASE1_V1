import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

 export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),

  vendorId: varchar("vendor_id", { length: 255 }).notNull().unique(),
  vendorType: varchar("vendor_type", { length: 255 }).notNull(),
  sector: text("sector").notNull(),
  vendorMaturity: varchar("vendor_maturity", { length: 255 }).notNull(),

  companyWebsite: varchar("company_website", { length: 255 }).notNull(),
  companyDescription: text("company_description").notNull(),

  primaryContactName: varchar("primary_contact_name", { length: 255 }).notNull(),
  primaryContactEmail: varchar("primary_contact_email", { length: 255 })
    .notNull()
    .unique(),
  primaryContactRole: varchar("primary_contact_role", { length: 255 }).notNull(),

  employeeCount: varchar("employee_count", { length: 255 }).notNull(),
  yearFounded: varchar("year_founded", { length: 255 }).notNull(),
  headquartersLocation: varchar("headquarters_location", {
    length: 255,
  }).notNull(),

  operatingRegions: jsonb("operating_regions").notNull(),

  createdAt: timestamp("created_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
});



