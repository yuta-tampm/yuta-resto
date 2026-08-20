CREATE TABLE "pos_establishment_profiles" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"display_name" varchar(80) NOT NULL,
	"revision" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pos_establishment_profiles_singleton_check" CHECK ("pos_establishment_profiles"."id" = 'default'),
	CONSTRAINT "pos_establishment_profiles_display_name_check" CHECK (char_length("pos_establishment_profiles"."display_name") between 1 and 80 and "pos_establishment_profiles"."display_name" = btrim("pos_establishment_profiles"."display_name") and "pos_establishment_profiles"."display_name" !~ '[[:cntrl:]]'),
	CONSTRAINT "pos_establishment_profiles_revision_check" CHECK ("pos_establishment_profiles"."revision" >= 1)
);
