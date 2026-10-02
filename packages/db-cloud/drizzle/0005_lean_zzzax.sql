CREATE TYPE "public"."personnel_employment_term_type" AS ENUM('indefinite', 'fixed_term');--> statement-breakpoint
CREATE TYPE "public"."personnel_work_time_category" AS ENUM('full_time', 'part_time');--> statement-breakpoint
CREATE TABLE "personnel_employee_dossiers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"given_names" varchar(120) NOT NULL,
	"family_name" varchar(120) NOT NULL,
	"position" varchar(120) NOT NULL,
	"qualification" varchar(120) NOT NULL,
	"employment_term_type" "personnel_employment_term_type" NOT NULL,
	"expected_end_date" date,
	"work_time_category" "personnel_work_time_category" NOT NULL,
	"entry_date" date NOT NULL,
	"departure_date" date,
	"revision" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "personnel_employee_dossiers_term_dates_check" CHECK (("personnel_employee_dossiers"."employment_term_type" = 'indefinite' and "personnel_employee_dossiers"."expected_end_date" is null) or ("personnel_employee_dossiers"."employment_term_type" = 'fixed_term' and "personnel_employee_dossiers"."expected_end_date" is not null and "personnel_employee_dossiers"."expected_end_date" >= "personnel_employee_dossiers"."entry_date")),
	CONSTRAINT "personnel_employee_dossiers_departure_date_check" CHECK ("personnel_employee_dossiers"."departure_date" is null or "personnel_employee_dossiers"."departure_date" >= "personnel_employee_dossiers"."entry_date"),
	CONSTRAINT "personnel_employee_dossiers_revision_check" CHECK ("personnel_employee_dossiers"."revision" > 0)
);
--> statement-breakpoint
ALTER TABLE "personnel_employee_dossiers" ADD CONSTRAINT "personnel_employee_dossiers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "establishments_organization_id_id_unique_idx" ON "establishments" USING btree ("organization_id","id");--> statement-breakpoint
ALTER TABLE "personnel_employee_dossiers" ADD CONSTRAINT "personnel_employee_dossiers_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "personnel_employee_dossiers_scope_entry_idx" ON "personnel_employee_dossiers" USING btree ("organization_id","establishment_id","entry_date","id");--> statement-breakpoint
CREATE INDEX "personnel_employee_dossiers_scope_name_idx" ON "personnel_employee_dossiers" USING btree ("organization_id","establishment_id","family_name","given_names");
