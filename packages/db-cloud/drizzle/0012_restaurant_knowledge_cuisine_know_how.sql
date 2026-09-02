CREATE TABLE "restaurant_knowledge_cuisine_know_how" (
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"cuisine_description" text,
	"know_how_particularities" text,
	"homemade" text,
	CONSTRAINT "restaurant_knowledge_cuisine_know_how_scope_pk" PRIMARY KEY("organization_id","establishment_id")
);
--> statement-breakpoint
ALTER TABLE "restaurant_knowledge_cuisine_know_how" ADD CONSTRAINT "restaurant_knowledge_cuisine_know_how_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;