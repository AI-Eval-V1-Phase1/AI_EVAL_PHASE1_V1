"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enumValues_1 = require("../EnumValues/enumValues");
exports.usersTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(), // auto-incrementing primary key
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    organization_name: (0, pg_core_1.varchar)("organization_name").notNull(),
    role: (0, pg_core_1.varchar)("role", { length: 255 }).notNull(),
    invited_at: (0, pg_core_1.timestamp)("invited_at").defaultNow().notNull(),
    invited_by: (0, pg_core_1.varchar)("invited_by").notNull(),
    account_status: (0, enumValues_1.accountStatusEnum)("account_status")
        .default("invited")
        .notNull(),
    user_name: (0, pg_core_1.varchar)("user_name").unique(),
    user_first_name: (0, pg_core_1.varchar)("user_first_name"),
    user_last_name: (0, pg_core_1.varchar)("user_last_name"),
    user_password: (0, pg_core_1.text)("user_password"),
    userStatus: (0, enumValues_1.organizationStatusEnum)("userStatus").default("active").notNull(),
    user_signup_completed: (0, enumValues_1.signup)("user_signup_completed")
        .default("false")
        .notNull(),
    user_onboarding_completed: (0, enumValues_1.onboarding)("user_onboarding_completed")
        .default("false")
        .notNull(),
    user_platform_role: (0, pg_core_1.varchar)("user_platform_role"),
});
