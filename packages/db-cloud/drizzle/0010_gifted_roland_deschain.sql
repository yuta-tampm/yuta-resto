CREATE TABLE "personnel_register_audit_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"event_type" varchar(80) NOT NULL,
	"operation_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personnel_register_command_receipts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"command_type" varchar(80) NOT NULL,
	"operation_id" uuid NOT NULL,
	"request_fingerprint" varchar(64) NOT NULL,
	"entry_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personnel_register_corrections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"entry_id" uuid NOT NULL,
	"prior_revision" integer NOT NULL,
	"new_revision" integer NOT NULL,
	"previous_facts" jsonb NOT NULL,
	"new_facts" jsonb NOT NULL,
	"effective_date" date NOT NULL,
	"reason" varchar(250) NOT NULL,
	"actor_user_id" uuid,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "personnel_register_corrections_revision_check" CHECK ("personnel_register_corrections"."prior_revision" > 0 and "personnel_register_corrections"."new_revision" = "personnel_register_corrections"."prior_revision" + 1)
);
--> statement-breakpoint
CREATE TABLE "personnel_register_counters" (
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"next_sequence" integer DEFAULT 1 NOT NULL,
	"revision" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "personnel_register_counters_scope_unique" UNIQUE("organization_id","establishment_id"),
	CONSTRAINT "personnel_register_counters_next_check" CHECK ("personnel_register_counters"."next_sequence" > 0),
	CONSTRAINT "personnel_register_counters_revision_check" CHECK ("personnel_register_counters"."revision" >= 0)
);
--> statement-breakpoint
CREATE TABLE "personnel_register_entries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"sequence" integer NOT NULL,
	"revision" integer DEFAULT 1 NOT NULL,
	"initial_facts" jsonb NOT NULL,
	"current_facts" jsonb NOT NULL,
	"inscribed_by_user_id" uuid,
	"inscribed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "personnel_register_entries_scope_id_unique" UNIQUE("organization_id","establishment_id","id"),
	CONSTRAINT "personnel_register_entries_sequence_check" CHECK ("personnel_register_entries"."sequence" > 0),
	CONSTRAINT "personnel_register_entries_revision_check" CHECK ("personnel_register_entries"."revision" > 0)
);
--> statement-breakpoint
ALTER TABLE "personnel_register_audit_events" ADD CONSTRAINT "personnel_register_audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_register_audit_events" ADD CONSTRAINT "personnel_register_audit_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_register_command_receipts" ADD CONSTRAINT "personnel_register_command_receipts_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_register_command_receipts" ADD CONSTRAINT "personnel_register_receipts_entry_scope_fk" FOREIGN KEY ("organization_id","establishment_id","entry_id") REFERENCES "public"."personnel_register_entries"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_register_corrections" ADD CONSTRAINT "personnel_register_corrections_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_register_corrections" ADD CONSTRAINT "personnel_register_corrections_entry_scope_fk" FOREIGN KEY ("organization_id","establishment_id","entry_id") REFERENCES "public"."personnel_register_entries"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_register_counters" ADD CONSTRAINT "personnel_register_counters_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_register_counters" ADD CONSTRAINT "personnel_register_counters_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_register_entries" ADD CONSTRAINT "personnel_register_entries_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_register_entries" ADD CONSTRAINT "personnel_register_entries_inscribed_by_user_id_users_id_fk" FOREIGN KEY ("inscribed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_register_entries" ADD CONSTRAINT "personnel_register_entries_employee_scope_fk" FOREIGN KEY ("organization_id","establishment_id","employee_id") REFERENCES "public"."personnel_employee_dossiers"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_register_audit_scope_operation_unique_idx" ON "personnel_register_audit_events" USING btree ("organization_id","establishment_id","actor_user_id","event_type","operation_id");--> statement-breakpoint
CREATE INDEX "personnel_register_audit_scope_created_idx" ON "personnel_register_audit_events" USING btree ("organization_id","establishment_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_register_receipts_scope_operation_unique_idx" ON "personnel_register_command_receipts" USING btree ("organization_id","establishment_id","actor_user_id","command_type","operation_id");--> statement-breakpoint
CREATE INDEX "personnel_register_corrections_scope_entry_idx" ON "personnel_register_corrections" USING btree ("organization_id","establishment_id","entry_id","new_revision");--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_register_entries_scope_employee_unique_idx" ON "personnel_register_entries" USING btree ("organization_id","establishment_id","employee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_register_entries_scope_sequence_unique_idx" ON "personnel_register_entries" USING btree ("organization_id","establishment_id","sequence");