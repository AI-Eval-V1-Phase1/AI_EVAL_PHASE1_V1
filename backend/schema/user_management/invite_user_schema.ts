import { pgTable, serial, varchar, integer, timestamp, pgEnum, text } from "drizzle-orm/pg-core";
import z from "zod";

// Enum for account_status
export const accountStatusEnum = pgEnum("account_status", ["invited", "confirmed"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(), // auto-incrementing primary key
  email: varchar("email", { length: 255 }).notNull().unique(),
  organization_name: varchar("organization_name").notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  invited_at: timestamp("invited_at").defaultNow().notNull(),
  account_status: accountStatusEnum("account_status").default("invited").notNull(),
  user_name:varchar("user_name").unique(),
  user_first_name:varchar("user_first_name"),
  user_last_name:varchar("user_last_name"),
  user_password:text("user_password"),
  // user_onboarding_completed:enum(["yes","no"]).default("no"),
  // user_signup_completed:enum(["yes","no"]).default("no"),
  // user_app_role:enum(["buyer","vendor"]),
});
