CREATE TABLE "google_review_cache" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"feedback_item_id" uuid NOT NULL,
	"connector_id" uuid NOT NULL,
	"binding_generation" integer NOT NULL,
	"external_location_id" varchar(255) NOT NULL,
	"review_name" varchar(1024) NOT NULL,
	"author_name" varchar(255),
	"rating" integer,
	"content" text,
	"provider_created_at" timestamp with time zone,
	"provider_updated_at" timestamp with time zone,
	"remote_reply_content" text,
	"remote_reply_updated_at" timestamp with time zone,
	"remote_reply_status" varchar(100),
	"needs_review" boolean DEFAULT false NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"reference_expires_at" timestamp with time zone NOT NULL,
	"content_cleared_at" timestamp with time zone,
	CONSTRAINT "google_review_cache_deadlines_check" CHECK ("google_review_cache"."binding_generation" >= 0 and "google_review_cache"."expires_at" > "google_review_cache"."fetched_at" and "google_review_cache"."expires_at" <= "google_review_cache"."fetched_at" + interval '29 days' and "google_review_cache"."reference_expires_at" >= "google_review_cache"."expires_at" and "google_review_cache"."reference_expires_at" <= "google_review_cache"."fetched_at" + interval '30 days'),
	CONSTRAINT "google_review_cache_rating_check" CHECK ("google_review_cache"."rating" is null or "google_review_cache"."rating" between 1 and 5),
	CONSTRAINT "google_review_cache_cleared_content_check" CHECK ("google_review_cache"."content_cleared_at" is null or ("google_review_cache"."author_name" is null and "google_review_cache"."rating" is null and "google_review_cache"."content" is null and "google_review_cache"."provider_created_at" is null and "google_review_cache"."provider_updated_at" is null and "google_review_cache"."remote_reply_content" is null and "google_review_cache"."remote_reply_updated_at" is null and "google_review_cache"."remote_reply_status" is null and not "google_review_cache"."needs_review"))
);
--> statement-breakpoint
CREATE TABLE "google_review_retrieval_states" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"connector_id" uuid NOT NULL,
	"binding_generation" integer NOT NULL,
	"attempt_id" uuid,
	"sequence_id" uuid,
	"kind" varchar(20),
	"state" varchar(20),
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"lease_expires_at" timestamp with time zone,
	"error_category" varchar(50),
	"last_successful_batch_at" timestamp with time zone,
	"last_successful_recent_at" timestamp with time zone,
	"continuation_handle" uuid,
	"next_page_token" text,
	"coverage_expires_at" timestamp with time zone,
	"returned_count" integer,
	"added_count" integer,
	"changed_count" integer,
	"total_review_count" integer,
	"has_more" boolean,
	"recent_empty" boolean,
	CONSTRAINT "google_review_retrieval_state_values_check" CHECK ("google_review_retrieval_states"."binding_generation" >= 0 and ("google_review_retrieval_states"."kind" is null or "google_review_retrieval_states"."kind" in ('RECENT', 'HISTORY', 'DETAIL')) and ("google_review_retrieval_states"."state" is null or "google_review_retrieval_states"."state" in ('PENDING', 'FAILED', 'COMPLETED'))),
	CONSTRAINT "google_review_retrieval_state_counts_check" CHECK (("google_review_retrieval_states"."returned_count" is null or "google_review_retrieval_states"."returned_count" between 0 and 50) and ("google_review_retrieval_states"."added_count" is null or "google_review_retrieval_states"."added_count" between 0 and 50) and ("google_review_retrieval_states"."changed_count" is null or "google_review_retrieval_states"."changed_count" between 0 and 50) and ("google_review_retrieval_states"."total_review_count" is null or "google_review_retrieval_states"."total_review_count" >= 0)),
	CONSTRAINT "google_review_retrieval_state_continuation_check" CHECK (("google_review_retrieval_states"."continuation_handle" is null and "google_review_retrieval_states"."next_page_token" is null) or ("google_review_retrieval_states"."continuation_handle" is not null and "google_review_retrieval_states"."next_page_token" is not null and "google_review_retrieval_states"."coverage_expires_at" is not null and "google_review_retrieval_states"."sequence_id" is not null))
);
--> statement-breakpoint
ALTER TABLE "feedback_items" ADD COLUMN "google_importer_owned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "reputation_connectors" ADD COLUMN "binding_generation" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "feedback_items_scope_id_unique_idx" ON "feedback_items" USING btree ("organization_id","establishment_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "reputation_connectors_scope_id_unique_idx" ON "reputation_connectors" USING btree ("organization_id","establishment_id","id");--> statement-breakpoint
ALTER TABLE "google_review_cache" ADD CONSTRAINT "google_review_cache_work_scope_fk" FOREIGN KEY ("organization_id","establishment_id","feedback_item_id") REFERENCES "public"."feedback_items"("organization_id","establishment_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "google_review_cache" ADD CONSTRAINT "google_review_cache_connector_scope_fk" FOREIGN KEY ("organization_id","establishment_id","connector_id") REFERENCES "public"."reputation_connectors"("organization_id","establishment_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "google_review_retrieval_states" ADD CONSTRAINT "google_review_retrieval_state_connector_scope_fk" FOREIGN KEY ("organization_id","establishment_id","connector_id") REFERENCES "public"."reputation_connectors"("organization_id","establishment_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "google_review_cache_work_unique_idx" ON "google_review_cache" USING btree ("organization_id","establishment_id","feedback_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "google_review_cache_provider_identity_unique_idx" ON "google_review_cache" USING btree ("organization_id","external_location_id","review_name");--> statement-breakpoint
CREATE INDEX "google_review_cache_content_expiry_idx" ON "google_review_cache" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "google_review_cache_reference_expiry_idx" ON "google_review_cache" USING btree ("reference_expires_at");--> statement-breakpoint
CREATE INDEX "google_review_cache_connector_idx" ON "google_review_cache" USING btree ("organization_id","establishment_id","connector_id");--> statement-breakpoint
CREATE UNIQUE INDEX "google_review_retrieval_state_connector_unique_idx" ON "google_review_retrieval_states" USING btree ("organization_id","establishment_id","connector_id");--> statement-breakpoint
CREATE INDEX "google_review_retrieval_state_coverage_expiry_idx" ON "google_review_retrieval_states" USING btree ("coverage_expires_at");--> statement-breakpoint
ALTER TABLE "feedback_items" ADD CONSTRAINT "feedback_items_google_importer_boundary_check" CHECK (not "feedback_items"."google_importer_owned" or ("feedback_items"."source" = 'GOOGLE' and "feedback_items"."type" = 'PUBLIC_REVIEW'
        and "feedback_items"."external_id" is null and "feedback_items"."external_url" is null
        and "feedback_items"."author_name" is null and "feedback_items"."author_avatar_url" is null
        and "feedback_items"."rating" is null and "feedback_items"."title" is null and "feedback_items"."content" is null
        and "feedback_items"."language" is null and "feedback_items"."sentiment" is null and "feedback_items"."urgency" is null
        and "feedback_items"."published_at" is null and "feedback_items"."last_synced_at" is null and "feedback_items"."provider_metadata" is null));--> statement-breakpoint
ALTER TABLE "reputation_connectors" ADD CONSTRAINT "reputation_connectors_generation_check" CHECK ("reputation_connectors"."binding_generation" >= 0);
