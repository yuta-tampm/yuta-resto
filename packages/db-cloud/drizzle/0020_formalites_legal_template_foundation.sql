CREATE TABLE "formalites_template_identities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"legal_purpose" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "formalites_template_purpose_nonempty" CHECK (length("formalites_template_identities"."legal_purpose") > 0)
);
--> statement-breakpoint
CREATE TABLE "formalites_template_versions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"template_id" uuid NOT NULL,
	"source_draft_id" uuid NOT NULL,
	"source_draft_revision" integer NOT NULL,
	"content_profile" text NOT NULL,
	"source_bytes" "bytea" NOT NULL,
	"checksum_algorithm" text NOT NULL,
	"content_checksum" text NOT NULL,
	"applicability" jsonb NOT NULL,
	"frozen_at" timestamp with time zone NOT NULL,
	CONSTRAINT "formalites_template_freeze_locator" UNIQUE("source_draft_id","source_draft_revision"),
	CONSTRAINT "formalites_template_version_positive_revision" CHECK ("formalites_template_versions"."source_draft_revision" > 0),
	CONSTRAINT "formalites_template_checksum_algorithm" CHECK ("formalites_template_versions"."checksum_algorithm" = 'sha256'),
	CONSTRAINT "formalites_template_checksum_shape" CHECK ("formalites_template_versions"."content_checksum" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE TABLE "formalites_template_working_drafts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"template_id" uuid NOT NULL,
	"revision" integer DEFAULT 1 NOT NULL,
	"content_profile" text NOT NULL,
	"source_bytes" "bytea" NOT NULL,
	"applicability" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"frozen_at" timestamp with time zone,
	CONSTRAINT "formalites_template_draft_containment" UNIQUE("id","template_id"),
	CONSTRAINT "formalites_template_draft_positive_revision" CHECK ("formalites_template_working_drafts"."revision" > 0)
);
--> statement-breakpoint
ALTER TABLE "formalites_template_versions" ADD CONSTRAINT "formalites_template_versions_template_id_formalites_template_identities_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."formalites_template_identities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formalites_template_versions" ADD CONSTRAINT "formalites_template_version_draft_containment" FOREIGN KEY ("source_draft_id","template_id") REFERENCES "public"."formalites_template_working_drafts"("id","template_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formalites_template_working_drafts" ADD CONSTRAINT "formalites_template_working_drafts_template_id_formalites_template_identities_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."formalites_template_identities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "formalites_template_one_active_draft" ON "formalites_template_working_drafts" USING btree ("template_id") WHERE "formalites_template_working_drafts"."frozen_at" is null;