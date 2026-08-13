CREATE TABLE "personnel_command_receipts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"command_type" varchar(100) NOT NULL,
	"idempotency_hash" varchar(64) NOT NULL,
	"request_fingerprint" varchar(64) NOT NULL,
	"employee_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personnel_employee_audit_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"actor_user_id" uuid,
	"event_type" varchar(100) NOT NULL,
	"operation_id" uuid NOT NULL,
	"changed_fields" varchar(100)[] DEFAULT ARRAY[]::varchar[] NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "personnel_command_receipts" ADD CONSTRAINT "personnel_command_receipts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_command_receipts" ADD CONSTRAINT "personnel_command_receipts_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_employee_dossiers_scope_id_unique_idx" ON "personnel_employee_dossiers" USING btree ("organization_id","establishment_id","id");--> statement-breakpoint
ALTER TABLE "personnel_command_receipts" ADD CONSTRAINT "personnel_command_receipts_employee_scope_fk" FOREIGN KEY ("organization_id","establishment_id","employee_id") REFERENCES "public"."personnel_employee_dossiers"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_employee_audit_events" ADD CONSTRAINT "personnel_employee_audit_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_employee_audit_events" ADD CONSTRAINT "personnel_employee_audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_employee_audit_events" ADD CONSTRAINT "personnel_employee_audit_events_employee_scope_fk" FOREIGN KEY ("organization_id","establishment_id","employee_id") REFERENCES "public"."personnel_employee_dossiers"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_command_receipts_scope_key_unique_idx" ON "personnel_command_receipts" USING btree ("organization_id","establishment_id","actor_user_id","command_type","idempotency_hash");--> statement-breakpoint
CREATE INDEX "personnel_command_receipts_expires_at_idx" ON "personnel_command_receipts" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "personnel_employee_audit_events_scope_employee_idx" ON "personnel_employee_audit_events" USING btree ("organization_id","establishment_id","employee_id","created_at");
