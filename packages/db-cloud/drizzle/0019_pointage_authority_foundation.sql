CREATE TABLE "pointage_credential_rate_limits" (
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"key_kind" varchar(16) NOT NULL,
	"key_digest" varchar(64) NOT NULL,
	"window_started_at" timestamp with time zone NOT NULL,
	"failure_count" integer NOT NULL,
	"blocked_until" timestamp with time zone,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "pointage_rate_limits_scope_key_pk" PRIMARY KEY("organization_id","establishment_id","key_kind","key_digest"),
	CONSTRAINT "pointage_rate_limits_key_kind_check" CHECK ("pointage_credential_rate_limits"."key_kind" in ('candidate', 'client')),
	CONSTRAINT "pointage_rate_limits_digest_check" CHECK ("pointage_credential_rate_limits"."key_digest" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "pointage_rate_limits_failure_count_check" CHECK ("pointage_credential_rate_limits"."failure_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "pointage_employee_credentials" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"personnel_dossier_id" uuid NOT NULL,
	"credential_version" integer NOT NULL,
	"credential_format_version" integer NOT NULL,
	"algorithm_version" varchar(32) NOT NULL,
	"key_version" integer NOT NULL,
	"lookup_digest" varchar(64) NOT NULL,
	"salt" varchar(24) NOT NULL,
	"verifier" varchar(44) NOT NULL,
	"issued_at" timestamp with time zone NOT NULL,
	"issued_by_user_id" uuid,
	"superseded_at" timestamp with time zone,
	"superseded_by_credential_id" uuid,
	"superseded_by_user_id" uuid,
	CONSTRAINT "pointage_credentials_scope_id_unique" UNIQUE("organization_id","establishment_id","id"),
	CONSTRAINT "pointage_credentials_versions_check" CHECK ("pointage_employee_credentials"."credential_version" > 0 and "pointage_employee_credentials"."credential_format_version" > 0 and "pointage_employee_credentials"."key_version" > 0),
	CONSTRAINT "pointage_credentials_lookup_digest_check" CHECK ("pointage_employee_credentials"."lookup_digest" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "pointage_credentials_supersede_consistency_check" CHECK (("pointage_employee_credentials"."superseded_at" is null and "pointage_employee_credentials"."superseded_by_credential_id" is null and "pointage_employee_credentials"."superseded_by_user_id" is null) or ("pointage_employee_credentials"."superseded_at" is not null and "pointage_employee_credentials"."superseded_by_credential_id" is not null and "pointage_employee_credentials"."superseded_by_user_id" is not null))
);
--> statement-breakpoint
CREATE TABLE "pointage_security_audit_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"event_type" varchar(80) NOT NULL,
	"outcome" varchar(16) NOT NULL,
	"reason_code" varchar(40),
	"manager_user_id" uuid,
	"personnel_dossier_id" uuid,
	"credential_id" uuid,
	"credential_version" integer,
	"requested_operation" varchar(64),
	"occurred_at" timestamp with time zone NOT NULL,
	CONSTRAINT "pointage_audit_event_type_check" CHECK ("pointage_security_audit_events"."event_type" in ('pointage.credential.issued', 'pointage.credential.reset', 'pointage.credential.superseded', 'pointage.credential.authentication_succeeded', 'pointage.credential.authentication_denied', 'pointage.credential.rate_limited', 'pointage.authorization.denied', 'pointage.evidence_eligibility.denied')),
	CONSTRAINT "pointage_audit_outcome_check" CHECK ("pointage_security_audit_events"."outcome" in ('succeeded', 'denied')),
	CONSTRAINT "pointage_audit_reason_code_check" CHECK ("pointage_security_audit_events"."reason_code" is null or "pointage_security_audit_events"."reason_code" in ('invalid_credential', 'superseded_credential', 'unsupported_version', 'rate_limited', 'scope_not_resolved', 'client_address_untrusted', 'operation_not_granted', 'dossier_not_in_scope', 'before_entry', 'after_departure')),
	CONSTRAINT "pointage_audit_credential_version_check" CHECK ("pointage_security_audit_events"."credential_version" is null or "pointage_security_audit_events"."credential_version" > 0)
);
--> statement-breakpoint
ALTER TABLE "pointage_credential_rate_limits" ADD CONSTRAINT "pointage_rate_limits_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_employee_credentials" ADD CONSTRAINT "pointage_employee_credentials_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_employee_credentials" ADD CONSTRAINT "pointage_employee_credentials_issued_by_user_id_users_id_fk" FOREIGN KEY ("issued_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_employee_credentials" ADD CONSTRAINT "pointage_employee_credentials_superseded_by_user_id_users_id_fk" FOREIGN KEY ("superseded_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_employee_credentials" ADD CONSTRAINT "pointage_credentials_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_employee_credentials" ADD CONSTRAINT "pointage_credentials_dossier_scope_fk" FOREIGN KEY ("organization_id","establishment_id","personnel_dossier_id") REFERENCES "public"."personnel_employee_dossiers"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_employee_credentials" ADD CONSTRAINT "pointage_credentials_superseded_scope_fk" FOREIGN KEY ("organization_id","establishment_id","superseded_by_credential_id") REFERENCES "public"."pointage_employee_credentials"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_security_audit_events" ADD CONSTRAINT "pointage_security_audit_events_manager_user_id_users_id_fk" FOREIGN KEY ("manager_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_security_audit_events" ADD CONSTRAINT "pointage_audit_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_security_audit_events" ADD CONSTRAINT "pointage_audit_dossier_scope_fk" FOREIGN KEY ("organization_id","establishment_id","personnel_dossier_id") REFERENCES "public"."personnel_employee_dossiers"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointage_security_audit_events" ADD CONSTRAINT "pointage_audit_credential_scope_fk" FOREIGN KEY ("organization_id","establishment_id","credential_id") REFERENCES "public"."pointage_employee_credentials"("organization_id","establishment_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "pointage_credentials_historical_digest_unique_idx" ON "pointage_employee_credentials" USING btree ("organization_id","establishment_id","lookup_digest");--> statement-breakpoint
CREATE UNIQUE INDEX "pointage_credentials_dossier_version_unique_idx" ON "pointage_employee_credentials" USING btree ("organization_id","establishment_id","personnel_dossier_id","credential_version");--> statement-breakpoint
CREATE UNIQUE INDEX "pointage_credentials_one_active_dossier_unique_idx" ON "pointage_employee_credentials" USING btree ("organization_id","establishment_id","personnel_dossier_id") WHERE "pointage_employee_credentials"."superseded_at" is null;--> statement-breakpoint
CREATE INDEX "pointage_credentials_scope_dossier_idx" ON "pointage_employee_credentials" USING btree ("organization_id","establishment_id","personnel_dossier_id");--> statement-breakpoint
CREATE INDEX "pointage_audit_scope_time_idx" ON "pointage_security_audit_events" USING btree ("organization_id","establishment_id","occurred_at");