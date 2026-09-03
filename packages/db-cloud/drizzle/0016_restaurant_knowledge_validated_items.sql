CREATE TABLE "restaurant_knowledge_validated_items" (
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"id" uuid NOT NULL,
	"statement" text NOT NULL,
	CONSTRAINT "restaurant_knowledge_validated_items_scope_item_pk" PRIMARY KEY("organization_id","establishment_id","id")
);
--> statement-breakpoint
ALTER TABLE "restaurant_knowledge_validated_items" ADD CONSTRAINT "restaurant_knowledge_validated_items_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;