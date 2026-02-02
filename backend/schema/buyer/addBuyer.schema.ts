
import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

 export const buyersTable = pgTable("buyers", {
  id: serial("id").primaryKey(),

  buyerId: varchar("buyer_id", { length: 255 }).notNull().unique(),
  organizationName: varchar("organizationName", { length: 255 }).notNull(),
  organizationType:varchar("organizationType").notNull(),
  sector: text("sector").notNull(),
  organizationWebsite: varchar("organizationWebsite", { length: 255 }).notNull(),
  organizationDescription: text("organizationDescription").notNull(),

  primaryContactName: varchar("primary_contact_name", { length: 255 }).notNull(),
  primaryContactEmail: varchar("primary_contact_email", { length: 255 })
    .notNull()
    .unique(),
  primaryContactRole: varchar("primary_contact_role", { length: 255 }).notNull(),
  departmentOwner: varchar("departmentOwner", { length: 255 }).notNull(),

  employeeCount: varchar("employee_count", { length: 255 }).notNull(),
  annualRevenue:varchar("annualRevenue").notNull(),
  yearFounded: varchar("year_founded", { length: 255 }).notNull(),
  
  headquartersLocation: varchar("headquarters_location", {
    length: 255,
  }).notNull(),

  operatingRegions: jsonb("operating_regions").notNull(),
  dataResidencyRequirements:jsonb("dataResidencyRequirements").notNull(),
  existingAIInitiatives:varchar("existingAIInitiatives").notNull(),
  aiGovernanceMaturity:varchar("aiGovernanceMaturity").notNull(),
  dataGovernanceMaturity:varchar("dataGovernanceMaturity").notNull(),
  aiSkillsAvailability:varchar("aiSkillsAvailability").notNull(),
  changeManagementCapability:varchar("changeManagementCapability").notNull(),

  primaryRegulatoryFrameworks: jsonb("primaryRegulatoryFrameworks").notNull(),
  regulatoryPenaltyExposure:varchar("regulatoryPenaltyExposure").notNull(),
  dataClassificationHandled: jsonb("dataClassificationHandled").notNull(),
  piiHandling:varchar("piiHandling").notNull(),
  existingTechStack: jsonb("existingTechStack").notNull(),
  aiRiskAppetite:varchar("aiRiskAppetite").notNull(),
  acceptableRiskLevel:varchar("acceptableRiskLevel").notNull(),


  createdAt: timestamp("created_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
});



