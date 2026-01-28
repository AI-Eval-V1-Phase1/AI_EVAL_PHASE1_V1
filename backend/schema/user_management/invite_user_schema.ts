import { pgTable, serial, varchar, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";

// Enum for account_status
export const accountStatusEnum = pgEnum("account_status", ["invited", "confirmed"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(), // auto-incrementing primary key
  email: varchar("email", { length: 255 }).notNull().unique(),
  organization_name: varchar("organization_name").notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  invited_at: timestamp("invited_at").defaultNow().notNull(),
  account_status: accountStatusEnum("account_status").default("invited").notNull(),
});
