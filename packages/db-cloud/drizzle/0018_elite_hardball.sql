CREATE TYPE "public"."formalites_personnel_draft_command" AS ENUM('create', 'save', 'reconcile', 'abandon');--> statement-breakpoint
CREATE TYPE "public"."formalites_personnel_draft_command_outcome" AS ENUM('created', 'saved', 'reconciled', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."formalites_personnel_draft_status" AS ENUM('draft', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."formalites_personnel_probation_choice" AS ENUM('undecided', 'include', 'exclude');--> statement-breakpoint
CREATE TABLE "formalites_personnel_draft_command_receipts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"command_type" "formalites_personnel_draft_command" NOT NULL,
	"operation_key_hash" varchar(64) NOT NULL,
	"request_fingerprint" varchar(64) NOT NULL,
	"resulting_draft_id" uuid NOT NULL,
	"resulting_draft_revision" integer NOT NULL,
	"resulting_outcome" "formalites_personnel_draft_command_outcome" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "formalites_personnel_draft_receipts_revision_check" CHECK ("formalites_personnel_draft_command_receipts"."resulting_draft_revision" > 0),
	CONSTRAINT "formalites_personnel_draft_receipts_hashes_check" CHECK (char_length("formalites_personnel_draft_command_receipts"."operation_key_hash") = 64 and "formalites_personnel_draft_command_receipts"."operation_key_hash" ~ '^[0-9a-f]{64}$' and char_length("formalites_personnel_draft_command_receipts"."request_fingerprint") = 64 and "formalites_personnel_draft_command_receipts"."request_fingerprint" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "formalites_personnel_drafts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"formality_type" varchar(64) NOT NULL,
	"status" "formalites_personnel_draft_status" DEFAULT 'draft' NOT NULL,
	"probation_choice" "formalites_personnel_probation_choice" DEFAULT 'undecided' NOT NULL,
	"revision" integer DEFAULT 1 NOT NULL,
	"draft_given_names" varchar(120) NOT NULL,
	"draft_family_name" varchar(120) NOT NULL,
	"draft_position" varchar(120) NOT NULL,
	"draft_qualification" varchar(120) NOT NULL,
	"draft_employment_term_type" "personnel_employment_term_type" NOT NULL,
	"draft_entry_date" date NOT NULL,
	"draft_contract_weekly_minutes" integer,
	"source_given_names" varchar(120) NOT NULL,
	"source_family_name" varchar(120) NOT NULL,
	"source_position" varchar(120) NOT NULL,
	"source_qualification" varchar(120) NOT NULL,
	"source_employment_term_type" "personnel_employment_term_type" NOT NULL,
	"source_entry_date" date NOT NULL,
	"source_contract_weekly_minutes" integer,
	"source_personnel_revision" integer NOT NULL,
	"abandonment_reason" varchar(250),
	"abandoned_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "formalites_personnel_drafts_scope_id_unique" UNIQUE("organization_id","establishment_id","id"),
	CONSTRAINT "formalites_personnel_drafts_formality_type_check" CHECK ("formalites_personnel_drafts"."formality_type" = 'cdi_preparation'),
	CONSTRAINT "formalites_personnel_drafts_revision_check" CHECK ("formalites_personnel_drafts"."revision" > 0),
	CONSTRAINT "formalites_personnel_drafts_source_revision_check" CHECK ("formalites_personnel_drafts"."source_personnel_revision" > 0),
	CONSTRAINT "formalites_personnel_drafts_weekly_minutes_check" CHECK (("formalites_personnel_drafts"."draft_contract_weekly_minutes" is null or ("formalites_personnel_drafts"."draft_contract_weekly_minutes" >= 1 and "formalites_personnel_drafts"."draft_contract_weekly_minutes" <= 2880)) and ("formalites_personnel_drafts"."source_contract_weekly_minutes" is null or ("formalites_personnel_drafts"."source_contract_weekly_minutes" >= 1 and "formalites_personnel_drafts"."source_contract_weekly_minutes" <= 2880))),
	CONSTRAINT "formalites_personnel_drafts_lifecycle_check" CHECK (("formalites_personnel_drafts"."status" = 'draft' and "formalites_personnel_drafts"."abandonment_reason" is null and "formalites_personnel_drafts"."abandoned_at" is null) or ("formalites_personnel_drafts"."status" = 'abandoned' and "formalites_personnel_drafts"."abandonment_reason" is not null and btrim("formalites_personnel_drafts"."abandonment_reason") = "formalites_personnel_drafts"."abandonment_reason" and char_length("formalites_personnel_drafts"."abandonment_reason") between 1 and 250 and "formalites_personnel_drafts"."abandoned_at" is not null))
);
--> statement-breakpoint
ALTER TABLE "formalites_personnel_draft_command_receipts" ADD CONSTRAINT "formalites_personnel_draft_command_receipts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formalites_personnel_draft_command_receipts" ADD CONSTRAINT "formalites_personnel_draft_command_receipts_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formalites_personnel_draft_command_receipts" ADD CONSTRAINT "formalites_personnel_draft_receipts_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formalites_personnel_draft_command_receipts" ADD CONSTRAINT "formalites_personnel_draft_receipts_draft_scope_fk" FOREIGN KEY ("organization_id","establishment_id","resulting_draft_id") REFERENCES "public"."formalites_personnel_drafts"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formalites_personnel_drafts" ADD CONSTRAINT "formalites_personnel_drafts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formalites_personnel_drafts" ADD CONSTRAINT "formalites_personnel_drafts_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formalites_personnel_drafts" ADD CONSTRAINT "formalites_personnel_drafts_employee_scope_fk" FOREIGN KEY ("organization_id","establishment_id","employee_id") REFERENCES "public"."personnel_employee_dossiers"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "formalites_personnel_draft_receipts_scope_key_unique_idx" ON "formalites_personnel_draft_command_receipts" USING btree ("organization_id","establishment_id","actor_user_id","command_type","operation_key_hash");--> statement-breakpoint
CREATE INDEX "formalites_personnel_draft_receipts_scope_draft_idx" ON "formalites_personnel_draft_command_receipts" USING btree ("organization_id","establishment_id","resulting_draft_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "formalites_personnel_drafts_one_active_idx" ON "formalites_personnel_drafts" USING btree ("organization_id","establishment_id","employee_id","formality_type") WHERE "formalites_personnel_drafts"."status" = 'draft';--> statement-breakpoint
CREATE INDEX "formalites_personnel_drafts_scope_employee_idx" ON "formalites_personnel_drafts" USING btree ("organization_id","establishment_id","employee_id","created_at");