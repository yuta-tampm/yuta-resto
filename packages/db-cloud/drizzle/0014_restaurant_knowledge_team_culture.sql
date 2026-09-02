CREATE TABLE "restaurant_knowledge_team_culture" (
	"organization_id" uuid NOT NULL,
	"establishment_id" uuid NOT NULL,
	"values_and_mindset" text,
	"working_together" text,
	"transmission_and_integration" text,
	CONSTRAINT "restaurant_knowledge_team_culture_scope_pk" PRIMARY KEY("organization_id","establishment_id")
);
--> statement-breakpoint
ALTER TABLE "restaurant_knowledge_team_culture" ADD CONSTRAINT "restaurant_knowledge_team_culture_establishment_scope_fk" FOREIGN KEY ("organization_id","establishment_id") REFERENCES "public"."establishments"("organization_id","id") ON DELETE restrict ON UPDATE no action;