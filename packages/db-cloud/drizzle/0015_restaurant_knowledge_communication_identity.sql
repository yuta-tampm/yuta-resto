CREATE TABLE "restaurant_knowledge_communication_identity" (
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"tone_and_communication_style" text,
	"customer_addressing" text,
	"language_elements_and_things_to_avoid" text,
	CONSTRAINT "restaurant_knowledge_communication_identity_scope_pk" PRIMARY KEY("organization_id","establishment_id")
);
--> statement-breakpoint
ALTER TABLE "restaurant_knowledge_communication_identity" ADD CONSTRAINT "restaurant_knowledge_communication_identity_establishment_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;