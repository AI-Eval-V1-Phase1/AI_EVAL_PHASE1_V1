CREATE TABLE "organizationEditLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"organizationId" varchar NOT NULL,
	"organizationName" varchar NOT NULL,
	"organizationStatus" "organizationStatus" NOT NULL,
	"updated_by" varchar NOT NULL,
	"reason" varchar NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_platform_role" SET DATA TYPE varchar;