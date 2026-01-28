"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrg = exports.organizationStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const pg_core_2 = require("drizzle-orm/pg-core");
const pg_core_3 = require("drizzle-orm/pg-core");
const pg_core_4 = require("drizzle-orm/pg-core");
const pg_core_5 = require("drizzle-orm/pg-core");
exports.organizationStatusEnum = (0, pg_core_4.pgEnum)("organizationStatus", [
    "active",
    "inactive",
]);
exports.createOrg = (0, pg_core_5.pgTable)("organizations", {
    id: (0, pg_core_3.serial)("id").primaryKey(),
    organizationName: (0, pg_core_2.varchar)("organizationName").notNull(),
    organizationStatus: (0, exports.organizationStatusEnum)("organizationStatus")
        .default("active")
        .notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
