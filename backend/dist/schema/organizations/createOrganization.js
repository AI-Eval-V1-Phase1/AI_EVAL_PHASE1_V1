"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganization = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enumValues_1 = require("../EnumValues/enumValues");
exports.createOrganization = (0, pg_core_1.pgTable)("organizations", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    organizationName: (0, pg_core_1.varchar)("organizationName").notNull(),
    organizationStatus: (0, enumValues_1.organizationStatusEnum)("organizationStatus")
        .default("active")
        .notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    created_by: (0, pg_core_1.varchar)("created_by").notNull(),
});
