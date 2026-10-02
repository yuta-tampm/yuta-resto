CREATE TABLE "personnel_contract_amendment_command_receipts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"command_type" varchar(80) NOT NULL,
	"idempotency_hash" varchar(64) NOT NULL,
	"request_fingerprint" varchar(64) NOT NULL,
	"amendment_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personnel_contract_amendment_receipts_version_check" CHECK ("personnel_contract_amendment_command_receipts"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "personnel_contract_amendment_versions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"amendment_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"filename" varchar(180) NOT NULL,
	"media_type" varchar(100) NOT NULL,
	"byte_size" integer NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"storage_key" uuid NOT NULL,
	"uploaded_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "personnel_contract_amendment_versions_version_check" CHECK ("personnel_contract_amendment_versions"."version" > 0),
	CONSTRAINT "personnel_contract_amendment_versions_byte_size_check" CHECK ("personnel_contract_amendment_versions"."byte_size" > 0 and "personnel_contract_amendment_versions"."byte_size" <= 10485760),
	CONSTRAINT "personnel_contract_amendment_versions_media_type_check" CHECK ("personnel_contract_amendment_versions"."media_type" = 'application/pdf')
);
--> statement-breakpoint
CREATE TABLE "personnel_contract_amendments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"effective_date" date NOT NULL,
	"reference" varchar(80),
	"current_version" integer NOT NULL,
	"revision" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "personnel_contract_amendments_scope_id_unique" UNIQUE("organization_id","establishment_id","employee_id","id"),
	CONSTRAINT "personnel_contract_amendments_current_version_check" CHECK ("personnel_contract_amendments"."current_version" > 0),
	CONSTRAINT "personnel_contract_amendments_revision_check" CHECK ("personnel_contract_amendments"."revision" > 0)
);
--> statement-breakpoint
ALTER TABLE "personnel_contract_amendment_command_receipts" ADD CONSTRAINT "personnel_contract_amendment_command_receipts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_contract_amendment_command_receipts" ADD CONSTRAINT "personnel_contract_amendment_command_receipts_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_contract_amendment_command_receipts" ADD CONSTRAINT "personnel_contract_amendment_receipts_amendment_scope_fk" FOREIGN KEY ("organization_id","establishment_id","employee_id","amendment_id") REFERENCES "public"."personnel_contract_amendments"("organization_id","establishment_id","employee_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_contract_amendment_versions" ADD CONSTRAINT "personnel_contract_amendment_versions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_contract_amendment_versions" ADD CONSTRAINT "personnel_contract_amendment_versions_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_contract_amendment_versions" ADD CONSTRAINT "personnel_contract_amendment_versions_amendment_scope_fk" FOREIGN KEY ("organization_id","establishment_id","employee_id","amendment_id") REFERENCES "public"."personnel_contract_amendments"("organization_id","establishment_id","employee_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_contract_amendments" ADD CONSTRAINT "personnel_contract_amendments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_contract_amendments" ADD CONSTRAINT "personnel_contract_amendments_employee_scope_fk" FOREIGN KEY ("organization_id","establishment_id","employee_id") REFERENCES "public"."personnel_employee_dossiers"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_contract_amendment_receipts_scope_key_unique_idx" ON "personnel_contract_amendment_command_receipts" USING btree ("organization_id","establishment_id","actor_user_id","idempotency_hash");--> statement-breakpoint
CREATE INDEX "personnel_contract_amendment_receipts_expires_at_idx" ON "personnel_contract_amendment_command_receipts" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_contract_amendment_versions_amendment_version_unique_idx" ON "personnel_contract_amendment_versions" USING btree ("amendment_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_contract_amendment_versions_storage_key_unique_idx" ON "personnel_contract_amendment_versions" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX "personnel_contract_amendment_versions_scope_employee_idx" ON "personnel_contract_amendment_versions" USING btree ("organization_id","establishment_id","employee_id","created_at");--> statement-breakpoint
CREATE INDEX "personnel_contract_amendments_scope_employee_date_idx" ON "personnel_contract_amendments" USING btree ("organization_id","establishment_id","employee_id","effective_date","created_at","id");