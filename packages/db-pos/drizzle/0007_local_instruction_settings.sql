CREATE TABLE "pos_instruction_settings" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"quick_instruction_options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"allergen_options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pos_instruction_settings_singleton_check" CHECK ("pos_instruction_settings"."id" = 'default')
);
--> statement-breakpoint
ALTER TABLE "menu_categories" ADD COLUMN "default_instruction_codes" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_categories" ADD COLUMN "additional_instruction_codes" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "default_instruction_codes" jsonb;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "additional_instruction_codes" jsonb;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "selected_allergens" jsonb DEFAULT '[]'::jsonb NOT NULL;


INSERT INTO "pos_instruction_settings" ("id", "quick_instruction_options", "allergen_options")
VALUES (
  'default',
  '[{"code":"SANS_SALADE","label":"Sans salade","conflictsWith":[]},{"code":"SANS_HERBES","label":"Sans herbes","conflictsWith":[]},{"code":"SAUCE_A_PART","label":"Sauce à part","conflictsWith":["SANS_SAUCE"]},{"code":"SANS_SAUCE","label":"Sans sauce","conflictsWith":["SAUCE_A_PART","PEU_DE_SAUCE","SAUCE_SUPPLEMENTAIRE"]},{"code":"SANS_ACCOMPAGNEMENT","label":"Sans accompagnement","conflictsWith":[]},{"code":"SAUCE_SUPPLEMENTAIRE","label":"Sauce supplémentaire","conflictsWith":["SANS_SAUCE"]},{"code":"SAUCE_SOJA_A_PART","label":"Sauce soja à part","conflictsWith":[]},{"code":"SANS_SAUCE_SOJA","label":"Sans sauce soja","conflictsWith":[]},{"code":"COUPER_EN_DEUX","label":"Couper en deux","conflictsWith":[]},{"code":"SANS_CORIANDRE","label":"Sans coriandre","conflictsWith":[]},{"code":"SANS_MENTHE","label":"Sans menthe","conflictsWith":[]},{"code":"SANS_CRUDITES","label":"Sans crudités","conflictsWith":[]},{"code":"SANS_VERMICELLES","label":"Sans vermicelles","conflictsWith":[]},{"code":"SANS_CONCOMBRE","label":"Sans concombre","conflictsWith":[]},{"code":"SANS_MAYONNAISE","label":"Sans mayonnaise","conflictsWith":[]},{"code":"SANS_SRIRACHA","label":"Sans sriracha","conflictsWith":[]},{"code":"SAUCES_A_PART","label":"Sauces à part","conflictsWith":[]},{"code":"SANS_SEL","label":"Sans sel","conflictsWith":[]},{"code":"SANS_CACAHUETES","label":"Sans cacahuètes","conflictsWith":[]},{"code":"SANS_OIGNONS_FRITS","label":"Sans oignons frits","conflictsWith":[]},{"code":"SANS_CAROTTES","label":"Sans carottes","conflictsWith":[]},{"code":"PEU_DE_SAUCE","label":"Peu de sauce","conflictsWith":["SANS_SAUCE"]},{"code":"SANS_POUSSES_SOJA","label":"Sans pousses de soja","conflictsWith":[]},{"code":"FRITES_A_PART","label":"Frites à part","conflictsWith":["SANS_FRITES"]},{"code":"SANS_FRITES","label":"Sans frites","conflictsWith":["FRITES_A_PART"]},{"code":"SANS_CIBOULE","label":"Sans ciboule","conflictsWith":[]},{"code":"SANS_OIGNON","label":"Sans oignon","conflictsWith":[]},{"code":"SANS_BOULETTES","label":"Sans boulettes","conflictsWith":[]},{"code":"BOUILLON_A_PART","label":"Bouillon à part","conflictsWith":[]},{"code":"NOUILLES_A_PART","label":"Nouilles à part","conflictsWith":[]},{"code":"SANS_PIMENT","label":"Sans piment","conflictsWith":[]},{"code":"PEU_EPICE","label":"Peu épicé","conflictsWith":[]},{"code":"SANS_LEGUMES","label":"Sans légumes","conflictsWith":[]},{"code":"RIZ_A_PART","label":"Riz à part","conflictsWith":[]},{"code":"SANS_SAUCE_CHOCOLAT","label":"Sans sauce chocolat","conflictsWith":[]},{"code":"SAUCE_CHOCOLAT_A_PART","label":"Sauce chocolat à part","conflictsWith":[]},{"code":"SANS_BISCUIT","label":"Sans biscuit","conflictsWith":[]},{"code":"SANS_GLACONS","label":"Sans glaçons","conflictsWith":["PEU_DE_GLACONS"]},{"code":"PEU_DE_GLACONS","label":"Peu de glaçons","conflictsWith":["SANS_GLACONS"]},{"code":"PEU_SUCRE","label":"Peu sucré","conflictsWith":["SANS_SUCRE"]},{"code":"SANS_SUCRE","label":"Sans sucre","conflictsWith":["PEU_SUCRE"]},{"code":"SANS_CITRON","label":"Sans citron","conflictsWith":[]},{"code":"SANS_PAILLE","label":"Sans paille","conflictsWith":[]},{"code":"A_EMPORTER","label":"À emporter","conflictsWith":[]},{"code":"ALCOOL_LEGER","label":"Alcool léger","conflictsWith":[]},{"code":"SANS_ALCOOL","label":"Sans alcool","conflictsWith":[]}]'::jsonb,
  '[{"code":"PEANUTS","label":"Cacahuètes"},{"code":"GLUTEN","label":"Gluten"},{"code":"SOY","label":"Soja"},{"code":"CRUSTACEANS","label":"Crustacés"},{"code":"EGGS","label":"Œufs"},{"code":"MILK","label":"Lait"},{"code":"SESAME","label":"Sésame"},{"code":"FISH","label":"Poisson"},{"code":"OTHER","label":"Autre"}]'::jsonb
);

UPDATE "menu_categories"
SET "default_instruction_codes" = '["SANS_CACAHUETES","SANS_OIGNONS_FRITS","SANS_CORIANDRE","SAUCE_A_PART"]'::jsonb,
  "additional_instruction_codes" = '["SANS_HERBES","SANS_CAROTTES","SANS_SALADE","PEU_DE_SAUCE","SANS_SAUCE","SAUCE_SUPPLEMENTAIRE","SANS_POUSSES_SOJA"]'::jsonb
WHERE "name" = 'Bún – vermicelles de riz';

UPDATE "menu_categories"
SET "default_instruction_codes" = '["SANS_CONCOMBRE","SANS_CAROTTES","SANS_HERBES","SAUCE_A_PART"]'::jsonb,
  "additional_instruction_codes" = '["SANS_CORIANDRE","SANS_SAUCE","FRITES_A_PART","SANS_FRITES","COUPER_EN_DEUX"]'::jsonb
WHERE "name" = 'Gua Bao';

UPDATE "menu_categories"
SET "default_instruction_codes" = '["SANS_LEGUMES","RIZ_A_PART","SAUCE_A_PART","SANS_SAUCE"]'::jsonb,
  "additional_instruction_codes" = '["PEU_EPICE","SANS_PIMENT","SANS_CORIANDRE"]'::jsonb
WHERE "name" = 'Plat du jour';

UPDATE "menu_categories"
SET "default_instruction_codes" = '["SANS_GLACONS","PEU_DE_GLACONS","PEU_SUCRE","SANS_SUCRE","SANS_CITRON","SANS_MENTHE"]'::jsonb,
  "additional_instruction_codes" = '["SANS_PAILLE","A_EMPORTER"]'::jsonb
WHERE "name" = 'Softs';

UPDATE "menu_categories"
SET "default_instruction_codes" = '["SANS_ALCOOL","SANS_GLACONS","PEU_DE_GLACONS","PEU_SUCRE","SANS_SUCRE","SANS_CITRON","SANS_MENTHE"]'::jsonb,
  "additional_instruction_codes" = '["SANS_PAILLE","A_EMPORTER"]'::jsonb
WHERE "name" = 'Cocktails & mocktails';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SANS_SALADE","SANS_HERBES","SAUCE_A_PART","SANS_SAUCE"]'::jsonb,
  "additional_instruction_codes" = '["SANS_ACCOMPAGNEMENT","SAUCE_SUPPLEMENTAIRE"]'::jsonb
WHERE "name" = 'Nems porc (3 pcs)';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SANS_SALADE","SANS_HERBES","SAUCE_A_PART","SANS_SAUCE"]'::jsonb,
  "additional_instruction_codes" = '["SANS_ACCOMPAGNEMENT","SAUCE_SUPPLEMENTAIRE"]'::jsonb
WHERE "name" = 'Nems vegan (3 pcs)';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SAUCE_SOJA_A_PART","SANS_SAUCE_SOJA","SANS_HERBES","SAUCE_SUPPLEMENTAIRE"]'::jsonb,
  "additional_instruction_codes" = '[]'::jsonb
WHERE "name" = 'Xíu Maï (4 pcs)';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SANS_SAUCE","SAUCE_A_PART","COUPER_EN_DEUX","SANS_ACCOMPAGNEMENT"]'::jsonb,
  "additional_instruction_codes" = '[]'::jsonb
WHERE "name" = 'Bánh Bao (1 pce) – pâte au fruit de dragon';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SANS_CORIANDRE","SANS_MENTHE","SANS_CRUDITES","SAUCE_A_PART"]'::jsonb,
  "additional_instruction_codes" = '["SANS_SAUCE","SANS_VERMICELLES","SANS_CONCOMBRE"]'::jsonb
WHERE "name" = 'Rouleaux de printemps – Bœuf';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SANS_CORIANDRE","SANS_MENTHE","SANS_CRUDITES","SAUCE_A_PART"]'::jsonb,
  "additional_instruction_codes" = '["SANS_SAUCE","SANS_VERMICELLES","SANS_CONCOMBRE"]'::jsonb
WHERE "name" = 'Rouleaux de printemps – Poulet croustillant';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SANS_CORIANDRE","SANS_MENTHE","SANS_CRUDITES","SAUCE_A_PART"]'::jsonb,
  "additional_instruction_codes" = '["SANS_SAUCE","SANS_VERMICELLES","SANS_CONCOMBRE"]'::jsonb
WHERE "name" = 'Rouleaux de printemps – Tofu';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SAUCE_A_PART","SANS_SAUCE","SAUCE_SUPPLEMENTAIRE","SANS_ACCOMPAGNEMENT"]'::jsonb,
  "additional_instruction_codes" = '[]'::jsonb
WHERE "name" = 'Poulet croustillant';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SANS_MAYONNAISE","SANS_SRIRACHA","SAUCES_A_PART","SANS_SAUCE"]'::jsonb,
  "additional_instruction_codes" = '["SANS_SEL"]'::jsonb
WHERE "name" = 'Panier de frites wedges';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SANS_CORIANDRE","SANS_CIBOULE","SANS_OIGNON","SANS_BOULETTES"]'::jsonb,
  "additional_instruction_codes" = '["SANS_HERBES","BOUILLON_A_PART","NOUILLES_A_PART","SANS_PIMENT"]'::jsonb
WHERE "name" = 'Pho Bœuf';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SANS_CORIANDRE","SANS_CIBOULE","SANS_CACAHUETES","SANS_PIMENT"]'::jsonb,
  "additional_instruction_codes" = '["SANS_HERBES","PEU_EPICE","BOUILLON_A_PART","NOUILLES_A_PART"]'::jsonb
WHERE "name" = 'Mì Quảng poulet';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SANS_CACAHUETES","SANS_SAUCE_CHOCOLAT","SAUCE_CHOCOLAT_A_PART","SANS_BISCUIT"]'::jsonb,
  "additional_instruction_codes" = '[]'::jsonb
WHERE "name" = 'Le trio Glaces';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SANS_ALCOOL","SANS_GLACONS","PEU_SUCRE","SANS_MENTHE","SANS_CITRON","ALCOOL_LEGER"]'::jsonb,
  "additional_instruction_codes" = '[]'::jsonb
WHERE "name" = 'Mojito litchi';

UPDATE "menu_items"
SET "default_instruction_codes" = '["SANS_ALCOOL","SANS_GLACONS","PEU_SUCRE","SANS_MENTHE","SANS_CITRON","ALCOOL_LEGER"]'::jsonb,
  "additional_instruction_codes" = '[]'::jsonb
WHERE "name" = 'Mojito citron-menthe';

UPDATE "order_items" AS "order_item"
SET "selected_allergens" = COALESCE(
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'code',
        "allergen_code",
        'labelSnapshot',
        COALESCE(
          (
            SELECT "option" ->> 'label'
            FROM jsonb_array_elements(
              (
                SELECT "allergen_options"
                FROM "pos_instruction_settings"
                WHERE "id" = 'default'
              )
            ) AS "option"
            WHERE "option" ->> 'code' = "allergen_code"
          ),
          "allergen_code"
        )
      )
    )
    FROM jsonb_array_elements_text("order_item"."allergen_codes") AS "allergen_code"
  ),
  '[]'::jsonb
)
WHERE jsonb_array_length("order_item"."allergen_codes") > 0;
