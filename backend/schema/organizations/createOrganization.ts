import {
  timestamp,
  varchar,
  serial,
  pgTable,
} from "drizzle-orm/pg-core";
import z from "zod";
import { organizationStatusEnum } from "../EnumValues/enumValues";



export const createOrganization = pgTable("organizations", {
  id: serial("id").primaryKey(),
  organizationName: varchar("organizationName").notNull(),
  organizationStatus: organizationStatusEnum("organizationStatus")
    .default("active")
    .notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    created_by: varchar("created_by").notNull(),
});
