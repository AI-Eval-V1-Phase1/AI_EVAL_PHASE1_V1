"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersTable = exports.accountStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// Enum for account_status
exports.accountStatusEnum = (0, pg_core_1.pgEnum)("account_status", ["invited", "confirmed"]);
exports.usersTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(), // auto-incrementing primary key
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    organization_name: (0, pg_core_1.varchar)("organization_name").notNull(),
    role: (0, pg_core_1.varchar)("role", { length: 255 }).notNull(),
    invited_at: (0, pg_core_1.timestamp)("invited_at").defaultNow().notNull(),
    account_status: (0, exports.accountStatusEnum)("account_status").default("invited").notNull(),
});
