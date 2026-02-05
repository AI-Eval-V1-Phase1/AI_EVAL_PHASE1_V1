CREATE TABLE "buyers" (
	"id" serial PRIMARY KEY NOT NULL,
	"buyer_id" varchar(255) NOT NULL,
	"organizationName" varchar(255) NOT NULL,
	"organizationType" varchar NOT NULL,
	"sector" text NOT NULL,
	"organizationWebsite" varchar(255) NOT NULL,
	"organizationDescription" text NOT NULL,
	"primary_contact_name" varchar(255) NOT NULL,
	"primary_contact_email" varchar(255) NOT NULL,
	"primary_contact_role" varchar(255) NOT NULL,
	"departmentOwner" varchar(255) NOT NULL,
	"employee_count" varchar(255) NOT NULL,
	"annualRevenue" varchar NOT NULL,
	"year_founded" varchar(255) NOT NULL,
	"headquarters_location" varchar(255) NOT NULL,
	"operating_regions" jsonb NOT NULL,
	"dataResidencyRequirements" jsonb NOT NULL,
	"existingAIInitiatives" varchar NOT NULL,
	"aiGovernanceMaturity" varchar NOT NULL,
	"dataGovernanceMaturity" varchar NOT NULL,
	"aiSkillsAvailability" varchar NOT NULL,
	"changeManagementCapability" varchar NOT NULL,
	"primaryRegulatoryFrameworks" jsonb NOT NULL,
	"regulatoryPenaltyExposure" varchar NOT NULL,
	"dataClassificationHandled" jsonb NOT NULL,
	"piiHandling" varchar NOT NULL,
	"existingTechStack" jsonb NOT NULL,
	"aiRiskAppetite" varchar NOT NULL,
	"acceptableRiskLevel" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "buyers_buyer_id_unique" UNIQUE("buyer_id"),
	CONSTRAINT "buyers_primary_contact_email_unique" UNIQUE("primary_contact_email")
);
--> statement-breakpoint
CREATE TABLE "userEditLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"email" varchar(255) NOT NULL,
	"organizationName" varchar NOT NULL,
	"userStatus" "organizationStatus" NOT NULL,
	"updated_by" varchar NOT NULL,
	"reason" varchar NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "userEditLogs_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "sector" SET DATA TYPE text;