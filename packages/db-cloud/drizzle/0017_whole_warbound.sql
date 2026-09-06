CREATE TYPE "public"."personnel_history_classification" AS ENUM('correction', 'change');--> statement-breakpoint
CREATE TYPE "public"."personnel_history_event_kind" AS ENUM('mutation', 'cutover_baseline');--> statement-breakpoint
CREATE TYPE "public"."personnel_history_semantic_group" AS ENUM('identity', 'role', 'contract_terms', 'work_time', 'entry', 'departure');--> statement-breakpoint
CREATE TABLE "personnel_employee_history_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"event_kind" "personnel_history_event_kind" NOT NULL,
	"operation_id" uuid NOT NULL,
	"previous_revision" integer,
	"new_revision" integer NOT NULL,
	"actor_user_id" uuid,
	"payload_version" integer NOT NULL,
	"recorded_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personnel_employee_history_events_scope_kind_id_unique" UNIQUE("organization_id","establishment_id","employee_id","event_kind","id"),
	CONSTRAINT "personnel_employee_history_events_payload_version_check" CHECK ("personnel_employee_history_events"."payload_version" = 1),
	CONSTRAINT "personnel_employee_history_events_kind_metadata_check" CHECK (("personnel_employee_history_events"."event_kind" = 'mutation' and "personnel_employee_history_events"."previous_revision" is not null and "personnel_employee_history_events"."previous_revision" > 0 and "personnel_employee_history_events"."new_revision" = "personnel_employee_history_events"."previous_revision" + 1) or ("personnel_employee_history_events"."event_kind" = 'cutover_baseline' and "personnel_employee_history_events"."actor_user_id" is null and "personnel_employee_history_events"."previous_revision" is null and "personnel_employee_history_events"."new_revision" > 0))
);
--> statement-breakpoint
CREATE TABLE "personnel_employee_history_group_changes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"event_kind" "personnel_history_event_kind" NOT NULL,
	"semantic_group" "personnel_history_semantic_group" NOT NULL,
	"classification" "personnel_history_classification",
	"previous_values" jsonb,
	"new_values" jsonb NOT NULL,
	"effective_date" date,
	"correction_reason" varchar(250),
	CONSTRAINT "personnel_employee_history_groups_kind_metadata_check" CHECK (("personnel_employee_history_group_changes"."event_kind" = 'mutation' and "personnel_employee_history_group_changes"."classification" is not null and "personnel_employee_history_group_changes"."previous_values" is not null) or ("personnel_employee_history_group_changes"."event_kind" = 'cutover_baseline' and "personnel_employee_history_group_changes"."classification" is null and "personnel_employee_history_group_changes"."previous_values" is null and "personnel_employee_history_group_changes"."effective_date" is null and "personnel_employee_history_group_changes"."correction_reason" is null))
);
--> statement-breakpoint
CREATE TABLE "personnel_history_cutovers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"cutover_version" integer NOT NULL,
	"cutover_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personnel_history_cutovers_scope_version_unique" UNIQUE("organization_id","establishment_id","cutover_version"),
	CONSTRAINT "personnel_history_cutovers_version_check" CHECK ("personnel_history_cutovers"."cutover_version" = 1),
	CONSTRAINT "personnel_history_cutovers_timestamps_check" CHECK ("personnel_history_cutovers"."completed_at" >= "personnel_history_cutovers"."cutover_at")
);
--> statement-breakpoint
ALTER TABLE "personnel_employee_history_events" ADD CONSTRAINT "personnel_employee_history_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_employee_history_events" ADD CONSTRAINT "personnel_employee_history_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_employee_history_events" ADD CONSTRAINT "personnel_employee_history_events_employee_scope_fk" FOREIGN KEY ("organization_id","establishment_id","employee_id") REFERENCES "public"."personnel_employee_dossiers"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_employee_history_group_changes" ADD CONSTRAINT "personnel_employee_history_group_changes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_employee_history_group_changes" ADD CONSTRAINT "personnel_employee_history_groups_event_scope_fk" FOREIGN KEY ("organization_id","establishment_id","employee_id","event_kind","event_id") REFERENCES "public"."personnel_employee_history_events"("organization_id","establishment_id","employee_id","event_kind","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_history_cutovers" ADD CONSTRAINT "personnel_history_cutovers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel_history_cutovers" ADD CONSTRAINT "personnel_history_cutovers_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_employee_history_events_scope_operation_unique_idx" ON "personnel_employee_history_events" USING btree ("organization_id","establishment_id","employee_id","operation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_employee_history_events_one_cutover_idx" ON "personnel_employee_history_events" USING btree ("organization_id","establishment_id","employee_id") WHERE "personnel_employee_history_events"."event_kind" = 'cutover_baseline';--> statement-breakpoint
CREATE INDEX "personnel_employee_history_events_scope_employee_recorded_idx" ON "personnel_employee_history_events" USING btree ("organization_id","establishment_id","employee_id","recorded_at","id");--> statement-breakpoint
CREATE UNIQUE INDEX "personnel_employee_history_groups_event_group_unique_idx" ON "personnel_employee_history_group_changes" USING btree ("organization_id","establishment_id","employee_id","event_id","semantic_group");--> statement-breakpoint
CREATE INDEX "personnel_employee_history_groups_scope_employee_idx" ON "personnel_employee_history_group_changes" USING btree ("organization_id","establishment_id","employee_id","event_id");