ALTER TABLE "print_settings" ADD COLUMN "kitchen_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "print_settings" ADD COLUMN "counter_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "print_settings" ADD CONSTRAINT "print_settings_destination_enabled_check" CHECK ("print_settings"."kitchen_enabled" or "print_settings"."counter_enabled");