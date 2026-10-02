CREATE TABLE "restaurant_knowledge_customer_experience" (
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"desired_experience" text,
	"welcome_and_service" text,
	"customer_attention" text,
	CONSTRAINT "restaurant_knowledge_customer_experience_scope_pk" PRIMARY KEY("organization_id","establishment_id")
);
--> statement-breakpoint
ALTER TABLE "restaurant_knowledge_customer_experience" ADD CONSTRAINT "restaurant_knowledge_customer_experience_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;