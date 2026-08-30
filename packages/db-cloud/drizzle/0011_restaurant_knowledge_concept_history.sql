CREATE TABLE "restaurant_knowledge_concept_history" (
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"concept" text,
	"history" text,
	CONSTRAINT "restaurant_knowledge_concept_history_scope_pk" PRIMARY KEY("organization_id","establishment_id")
);
--> statement-breakpoint
ALTER TABLE "restaurant_knowledge_concept_history" ADD CONSTRAINT "restaurant_knowledge_concept_history_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;