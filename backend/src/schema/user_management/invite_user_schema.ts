import { pgTable, serial, varchar, timestamp, text } from "drizzle-orm/pg-core";
import z from "zod";
import {
  accountStatusEnum,
  onboarding,
  organizationStatusEnum,
  signup,
} from "../EnumValues/enumValues.js";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(), // auto-incrementing primary key
  email: varchar("email", { length: 255 }).notNull().unique(),
  organization_name: varchar("organization_name").notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  invited_at: timestamp("invited_at").defaultNow().notNull(),
  invited_by: varchar("invited_by").notNull(),
  account_status: accountStatusEnum("account_status")
    .default("invited")
    .notNull(),
  user_name: varchar("user_name").unique(),
  user_first_name: varchar("user_first_name"),
  user_last_name: varchar("user_last_name"),
  user_password: text("user_password"),
  userStatus: organizationStatusEnum("userStatus").default("active").notNull(),
  user_signup_completed: signup("user_signup_completed")
    .default("false")
    .notNull(),
  user_onboarding_completed: onboarding("user_onboarding_completed")
    .default("false")
    .notNull(),
  user_platform_role:varchar("user_platform_role"),
});
