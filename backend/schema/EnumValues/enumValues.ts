import { pgEnum } from "drizzle-orm/pg-core";


export const accountStatusEnum = pgEnum("account_status", ["invited", "confirmed"]);

export const organizationStatusEnum = pgEnum("organizationStatus", [
  "active",
  "inactive",
]);
export const signup = pgEnum("user_signup_completed", [
  "true",
  "false",
]);
export const onboarding = pgEnum("user_onboarding_completed", [
  "true",
  "false",
]);
