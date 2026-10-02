CREATE TYPE "public"."item_ordering_policy" AS ENUM('merge', 'separate');--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "ordering_policy" "item_ordering_policy" DEFAULT 'merge' NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "variant_options" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "required_variant_quantity" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_required_variant_quantity_non_negative_check" CHECK ("menu_items"."required_variant_quantity" >= 0);--> statement-breakpoint
UPDATE "menu_items"
SET
  "ordering_policy" = 'separate',
  "variant_options" = '[{"code":"MANGUE","label":"Mangue"},{"code":"MATCHA","label":"Matcha"},{"code":"CACAO","label":"Cacao"}]'::jsonb,
  "required_variant_quantity" = 2
WHERE "name" = 'Mochi glacé (2 pcs)';
