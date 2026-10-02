CREATE TYPE "public"."personnel_document_category" AS ENUM('signed_employment_contract');--> statement-breakpoint
CREATE TABLE "personnel_document_command_receipts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"idempotency_hash" varchar(64) NOT NULL,
	"request_fingerprint" varchar(64) NOT NULL,
	"document_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personnel_document_receipts_version_check" CHECK ("personnel_document_command_receipts"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "personnel_document_versions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"filename" varchar(180) NOT NULL,
	"media_type" varchar(100) NOT NULL,
	"byte_size" integer NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"storage_key" uuid NOT NULL,
	"uploaded_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "personnel_document_versions_version_check" CHECK ("personnel_document_versions"."version" > 0),
	CONSTRAINT "personnel_document_versions_byte_size_check" CHECK ("personnel_document_versions"."byte_size" > 0 and "personnel_document_versions"."byte_size" <= 10485760),
	CONSTRAINT "personnel_document_versions_media_type_check" CHECK ("personnel_document_versions"."media_type" = 'application/pdf')
);
--> statement-breakpoint
CREATE TABLE "personnel_documents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"category" "personnel_document_category" NOT NULL,
	"current_version" integer NOT NULL,
	"revision" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "personnel_documents_scope_id_unique" UNIQUE("organization_id","establishment_id","employee_id","id"),
	CONSTRAINT "personnel_documents_current_version_check" CHECK ("personnel_documents"."current_version" > 0),
	CONSTRAINT "personnel_documents_revision_check" CHECK ("personnel_documents"."revision" > 0)
);
--> statement-breakpoint
ALTER TABLE "personnel_document_command_receipts" ADD CONSTRAINT "personnel_document_command_receipts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_document_command_receipts" ADD CONSTRAINT "personnel_document_command_receipts_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_document_command_receipts" ADD CONSTRAINT "personnel_document_receipts_document_scope_fk" FOREIGN KEY ("organization_id","establishment_id","employee_id","document_id") REFERENCES "public"."personnel_documents"("organization_id","establishment_id","employee_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_document_versions" ADD CONSTRAINT "personnel_document_versions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_document_versions" ADD CONSTRAINT "personnel_document_versions_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_document_versions" ADD CONSTRAINT "personnel_document_versions_document_scope_fk" FOREIGN KEY ("organization_id","establishment_id","employee_id","document_id") REFERENCES "public"."personnel_documents"("organization_id","establishment_id","employee_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_documents" ADD CONSTRAINT "personnel_documents_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_documents" ADD CONSTRAINT "personnel_documents_employee_scope_fk" FOREIGN KEY ("organization_id","establishment_id","employee_id") REFERENCES "public"."personnel_employee_dossiers"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_document_receipts_scope_key_unique_idx" ON "personnel_document_command_receipts" USING btree ("organization_id","establishment_id","actor_user_id","idempotency_hash");--> statement-breakpoint
CREATE INDEX "personnel_document_receipts_expires_at_idx" ON "personnel_document_command_receipts" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_document_versions_document_version_unique_idx" ON "personnel_document_versions" USING btree ("document_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_document_versions_storage_key_unique_idx" ON "personnel_document_versions" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX "personnel_document_versions_scope_employee_idx" ON "personnel_document_versions" USING btree ("organization_id","establishment_id","employee_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_documents_scope_employee_category_unique_idx" ON "personnel_documents" USING btree ("organization_id","establishment_id","employee_id","category");