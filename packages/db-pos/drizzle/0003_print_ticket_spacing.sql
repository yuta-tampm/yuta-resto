ALTER TABLE "print_settings" ADD COLUMN "top_padding_lines" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "print_settings" ADD COLUMN "left_padding_chars" integer DEFAULT 2 NOT NULL;--> statement-breakpoint
ALTER TABLE "print_settings" ADD COLUMN "bottom_padding_lines" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "print_settings" ADD CONSTRAINT "print_settings_top_padding_lines_check" CHECK ("print_settings"."top_padding_lines" between 0 and 8);--> statement-breakpoint
ALTER TABLE "print_settings" ADD CONSTRAINT "print_settings_left_padding_chars_check" CHECK ("print_settings"."left_padding_chars" between 0 and 8);--> statement-breakpoint
ALTER TABLE "print_settings" ADD CONSTRAINT "print_settings_bottom_padding_lines_check" CHECK ("print_settings"."bottom_padding_lines" between 0 and 8);
