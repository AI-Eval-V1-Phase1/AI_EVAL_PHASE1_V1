CREATE TYPE "public"."account_status" AS ENUM('invited', 'confirmed');--> statement-breakpoint
CREATE TYPE "public"."organizationStatus" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"organizationName" varchar NOT NULL,
	"organizationStatus" "organizationStatus" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"organization_name" varchar NOT NULL,
	"role" varchar(255) NOT NULL,
	"invited_at" timestamp DEFAULT now() NOT NULL,
	"account_status" "account_status" DEFAULT 'invited' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
