UPDATE "menu_items"
SET
  "description" = '1 brioche porc laqué + 2 nems porc ou vegan + 1 compote',
  "ordering_policy" = 'separate',
  "variant_options" = '[{"code":"NEMS_PORC","label":"2 nems porc"},{"code":"NEMS_VEGAN","label":"2 nems vegan"}]'::jsonb,
  "required_variant_quantity" = 1
WHERE "name" = 'Menu Petit Enfant';
