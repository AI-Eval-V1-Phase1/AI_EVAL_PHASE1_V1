CREATE TYPE "public"."account_status" AS ENUM('invited', 'confirmed');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"organization_name" varchar NOT NULL,
	"role" varchar(255) NOT NULL,
	"invited_at" timestamp DEFAULT now() NOT NULL,
	"account_status" "account_status" DEFAULT 'invited' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
