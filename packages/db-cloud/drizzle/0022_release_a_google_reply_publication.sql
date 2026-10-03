CREATE TABLE "google_reply_publications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"feedback_item_id" uuid NOT NULL,
	"reply_id" uuid NOT NULL,
	"revision" integer NOT NULL,
	"connector_id" uuid NOT NULL,
	"binding_generation" integer NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"actor_session_id" uuid NOT NULL,
	"actor_membership_id" uuid NOT NULL,
	"actor_auth_version" integer NOT NULL,
	"preview_expires_at" timestamp with time zone NOT NULL,
	"remote_fingerprint" varchar(64),
	"state" varchar(20) NOT NULL,
	"retry_parent_id" uuid,
	"superseded_by_id" uuid,
	"confirmed_at" timestamp with time zone,
	"dispatched_at" timestamp with time zone,
	"lease_expires_at" timestamp with time zone,
	"observed_at" timestamp with time zone,
	"reconciled_at" timestamp with time zone,
	"error_category" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "google_reply_publication_revision_check" CHECK ("google_reply_publications"."revision">0 and "google_reply_publications"."binding_generation">=0 and "google_reply_publications"."actor_auth_version">=0),
	CONSTRAINT "google_reply_publication_state_check" CHECK ("google_reply_publications"."state" in ('PREVIEW','DISPATCHING','UNCERTAIN','FAILED','UNCONFIRMED','PENDING','REJECTED','APPROVED'))
);
--> statement-breakpoint
ALTER TABLE "feedback_replies" ADD COLUMN "revision" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "feedback_replies_scoped_id_idx" ON "feedback_replies" USING btree ("organization_id","feedback_item_id","id");--> statement-breakpoint
ALTER TABLE "google_reply_publications" ADD CONSTRAINT "google_reply_publication_feedback_scope_fk" FOREIGN KEY ("organization_id","establishment_id","feedback_item_id") REFERENCES "public"."feedback_items"("organization_id","establishment_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "google_reply_publications" ADD CONSTRAINT "google_reply_publication_draft_scope_fk" FOREIGN KEY ("organization_id","feedback_item_id","reply_id") REFERENCES "public"."feedback_replies"("organization_id","feedback_item_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "google_reply_publications" ADD CONSTRAINT "google_reply_publication_connector_scope_fk" FOREIGN KEY ("organization_id","establishment_id","connector_id") REFERENCES "public"."reputation_connectors"("organization_id","establishment_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "google_reply_publication_review_idx" ON "google_reply_publications" USING btree ("organization_id","establishment_id","feedback_item_id","created_at");--> statement-breakpoint
CREATE INDEX "google_reply_publication_preview_expiry_idx" ON "google_reply_publications" USING btree ("preview_expires_at");--> statement-breakpoint
ALTER TABLE "feedback_replies" ADD CONSTRAINT "feedback_replies_revision_check" CHECK ("feedback_replies"."revision" > 0);