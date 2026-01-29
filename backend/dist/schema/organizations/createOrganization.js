"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganization = exports.organizationStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.organizationStatusEnum = (0, pg_core_1.pgEnum)("organizationStatus", [
    "active",
    "inactive",
]);
exports.createOrganization = (0, pg_core_1.pgTable)("organizations", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    organizationName: (0, pg_core_1.varchar)("organizationName").notNull(),
    organizationStatus: (0, exports.organizationStatusEnum)("organizationStatus")
        .default("active")
        .notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    // created_by: varchar("created_by").notNull(),
});
