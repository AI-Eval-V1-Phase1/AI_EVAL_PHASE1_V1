DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
    CREATE TYPE account_status AS ENUM('invited', 'confirmed');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'organizationStatus') THEN
    CREATE TYPE organizationStatus AS ENUM('active', 'inactive');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_signup_completed') THEN
    CREATE TYPE user_signup_completed AS ENUM('true', 'false');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_onboarding_completed') THEN
    CREATE TYPE user_onboarding_completed AS ENUM('true', 'false');
  END IF;
END $$;
CREATE TABLE IF NOT EXISTS organizations (
  "id" serial PRIMARY KEY NOT NULL,
  "organizationName" varchar NOT NULL,
  "organizationStatus" "organizationStatus" DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "created_by" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  "id" serial PRIMARY KEY NOT NULL,
  "email" varchar(255) NOT NULL,
  "organization_name" varchar NOT NULL,
  "role" varchar(255) NOT NULL,
  "invited_at" timestamp DEFAULT now() NOT NULL,
  "invited_by" varchar NOT NULL,
  "account_status" "account_status" DEFAULT 'invited' NOT NULL,
  "user_name" varchar,
  "user_first_name" varchar,
  "user_last_name" varchar,
  "user_password" text,
  "userStatus" "organizationStatus" DEFAULT 'active' NOT NULL,
  "user_signup_completed" "user_signup_completed" DEFAULT 'false' NOT NULL,
  "user_onboarding_completed" "user_onboarding_completed" DEFAULT 'false' NOT NULL,
  "user_platform_role" varchar,
  CONSTRAINT "users_email_unique" UNIQUE("email"),
  CONSTRAINT "users_user_name_unique" UNIQUE("user_name")
);

CREATE TABLE IF NOT EXISTS vendors (
  "id" serial PRIMARY KEY NOT NULL,
  "vendor_id" varchar(255) NOT NULL,
  "vendor_type" varchar(255) NOT NULL,
  "sector" varchar(255) NOT NULL,
  "vendor_maturity" varchar(255) NOT NULL,
  "company_website" varchar(255) NOT NULL,
  "company_description" text NOT NULL,
  "primary_contact_name" varchar(255) NOT NULL,
  "primary_contact_email" varchar(255) NOT NULL,
  "primary_contact_role" varchar(255) NOT NULL,
  "employee_count" varchar(255) NOT NULL,
  "year_founded" varchar(255) NOT NULL,
  "headquarters_location" varchar(255) NOT NULL,
  "operating_regions" jsonb NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "vendors_vendor_id_unique" UNIQUE("vendor_id"),
  CONSTRAINT "vendors_primary_contact_email_unique" UNIQUE("primary_contact_email")
);
