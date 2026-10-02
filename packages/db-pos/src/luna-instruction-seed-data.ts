import type { AllergenOption, QuickInstructionOption } from './schema/catalog';

export type InstructionCodeConfig = {
  defaultInstructionCodes: string[];
  additionalInstructionCodes: string[];
};

const conflicts: Record<string, string[]> = {
  SANS_SAUCE: ['SAUCE_A_PART', 'PEU_DE_SAUCE', 'SAUCE_SUPPLEMENTAIRE'],
  SAUCE_A_PART: ['SANS_SAUCE'],
  PEU_DE_SAUCE: ['SANS_SAUCE'],
  SAUCE_SUPPLEMENTAIRE: ['SANS_SAUCE'],
  SANS_FRITES: ['FRITES_A_PART'],
  FRITES_A_PART: ['SANS_FRITES'],
  SANS_GLACONS: ['PEU_DE_GLACONS'],
  PEU_DE_GLACONS: ['SANS_GLACONS'],
  SANS_SUCRE: ['PEU_SUCRE'],
  PEU_SUCRE: ['SANS_SUCRE'],
};

const labels: Record<string, string> = {
  SANS_SALADE: 'Sans salade',
  SANS_HERBES: 'Sans herbes',
  SAUCE_A_PART: 'Sauce à part',
  SANS_SAUCE: 'Sans sauce',
  SANS_ACCOMPAGNEMENT: 'Sans accompagnement',
  SAUCE_SUPPLEMENTAIRE: 'Sauce supplémentaire',
  SAUCE_SOJA_A_PART: 'Sauce soja à part',
  SANS_SAUCE_SOJA: 'Sans sauce soja',
  COUPER_EN_DEUX: 'Couper en deux',
  SANS_CORIANDRE: 'Sans coriandre',
  SANS_MENTHE: 'Sans menthe',
  SANS_CRUDITES: 'Sans crudités',
  SANS_VERMICELLES: 'Sans vermicelles',
  SANS_CONCOMBRE: 'Sans concombre',
  SANS_MAYONNAISE: 'Sans mayonnaise',
  SANS_SRIRACHA: 'Sans sriracha',
  SAUCES_A_PART: 'Sauces à part',
  SANS_SEL: 'Sans sel',
  SANS_CACAHUETES: 'Sans cacahuètes',
  SANS_OIGNONS_FRITS: 'Sans oignons frits',
  SANS_CAROTTES: 'Sans carottes',
  PEU_DE_SAUCE: 'Peu de sauce',
  SANS_POUSSES_SOJA: 'Sans pousses de soja',
  FRITES_A_PART: 'Frites à part',
  SANS_FRITES: 'Sans frites',
  SANS_CIBOULE: 'Sans ciboule',
  SANS_OIGNON: 'Sans oignon',
  SANS_BOULETTES: 'Sans boulettes',
  BOUILLON_A_PART: 'Bouillon à part',
  NOUILLES_A_PART: 'Nouilles à part',
  SANS_PIMENT: 'Sans piment',
  PEU_EPICE: 'Peu épicé',
  SANS_LEGUMES: 'Sans légumes',
  RIZ_A_PART: 'Riz à part',
  SANS_SAUCE_CHOCOLAT: 'Sans sauce chocolat',
  SAUCE_CHOCOLAT_A_PART: 'Sauce chocolat à part',
  SANS_BISCUIT: 'Sans biscuit',
  SANS_GLACONS: 'Sans glaçons',
  PEU_DE_GLACONS: 'Peu de glaçons',
  PEU_SUCRE: 'Peu sucré',
  SANS_SUCRE: 'Sans sucre',
  SANS_CITRON: 'Sans citron',
  SANS_PAILLE: 'Sans paille',
  A_EMPORTER: 'À emporter',
  ALCOOL_LEGER: 'Alcool léger',
  SANS_ALCOOL: 'Sans alcool',
};

export const lunaQuickInstructionOptions: QuickInstructionOption[] =
  Object.entries(labels).map(([code, label]) => ({
    code,
    label,
    conflictsWith: conflicts[code] ?? [],
  }));

export const lunaAllergenOptions: AllergenOption[] = [
  { code: 'PEANUTS', label: 'Cacahuètes' },
  { code: 'GLUTEN', label: 'Gluten' },
  { code: 'SOY', label: 'Soja' },
  { code: 'CRUSTACEANS', label: 'Crustacés' },
  { code: 'EGGS', label: 'Œufs' },
  { code: 'MILK', label: 'Lait' },
  { code: 'SESAME', label: 'Sésame' },
  { code: 'FISH', label: 'Poisson' },
  { code: 'OTHER', label: 'Autre' },
];

const config = (
  defaultInstructionCodes: string[],
  additionalInstructionCodes: string[] = [],
): InstructionCodeConfig => ({
  defaultInstructionCodes,
  additionalInstructionCodes,
});

const drinkDefaults = [
  'SANS_GLACONS',
  'PEU_DE_GLACONS',
  'PEU_SUCRE',
  'SANS_SUCRE',
  'SANS_CITRON',
  'SANS_MENTHE',
];

export const lunaCategoryInstructionConfigs: Record<
  string,
  InstructionCodeConfig
> = {
  'Bún – vermicelles de riz': config(
    ['SANS_CACAHUETES', 'SANS_OIGNONS_FRITS', 'SANS_CORIANDRE', 'SAUCE_A_PART'],
    [
      'SANS_HERBES',
      'SANS_CAROTTES',
      'SANS_SALADE',
      'PEU_DE_SAUCE',
      'SANS_SAUCE',
      'SAUCE_SUPPLEMENTAIRE',
      'SANS_POUSSES_SOJA',
    ],
  ),
  'Gua Bao': config(
    ['SANS_CONCOMBRE', 'SANS_CAROTTES', 'SANS_HERBES', 'SAUCE_A_PART'],
    [
      'SANS_CORIANDRE',
      'SANS_SAUCE',
      'FRITES_A_PART',
      'SANS_FRITES',
      'COUPER_EN_DEUX',
    ],
  ),
  'Plat du jour': config(
    ['SANS_LEGUMES', 'RIZ_A_PART', 'SAUCE_A_PART', 'SANS_SAUCE'],
    ['PEU_EPICE', 'SANS_PIMENT', 'SANS_CORIANDRE'],
  ),
  Softs: config(drinkDefaults, ['SANS_PAILLE', 'A_EMPORTER']),
  'Cocktails & mocktails': config(
    ['SANS_ALCOOL', ...drinkDefaults],
    ['SANS_PAILLE', 'A_EMPORTER'],
  ),
};

export const lunaItemInstructionConfigs: Record<string, InstructionCodeConfig> =
  {
    'Nems porc (3 pcs)': config(
      ['SANS_SALADE', 'SANS_HERBES', 'SAUCE_A_PART', 'SANS_SAUCE'],
      ['SANS_ACCOMPAGNEMENT', 'SAUCE_SUPPLEMENTAIRE'],
    ),
    'Nems vegan (3 pcs)': config(
      ['SANS_SALADE', 'SANS_HERBES', 'SAUCE_A_PART', 'SANS_SAUCE'],
      ['SANS_ACCOMPAGNEMENT', 'SAUCE_SUPPLEMENTAIRE'],
    ),
    'Xíu Maï (4 pcs)': config([
      'SAUCE_SOJA_A_PART',
      'SANS_SAUCE_SOJA',
      'SANS_HERBES',
      'SAUCE_SUPPLEMENTAIRE',
    ]),
    'Bánh Bao (1 pce) – pâte au fruit de dragon': config([
      'SANS_SAUCE',
      'SAUCE_A_PART',
      'COUPER_EN_DEUX',
      'SANS_ACCOMPAGNEMENT',
    ]),
    'Rouleaux de printemps – Bœuf': config(
      ['SANS_CORIANDRE', 'SANS_MENTHE', 'SANS_CRUDITES', 'SAUCE_A_PART'],
      ['SANS_SAUCE', 'SANS_VERMICELLES', 'SANS_CONCOMBRE'],
    ),
    'Rouleaux de printemps – Poulet croustillant': config(
      ['SANS_CORIANDRE', 'SANS_MENTHE', 'SANS_CRUDITES', 'SAUCE_A_PART'],
      ['SANS_SAUCE', 'SANS_VERMICELLES', 'SANS_CONCOMBRE'],
    ),
    'Rouleaux de printemps – Tofu': config(
      ['SANS_CORIANDRE', 'SANS_MENTHE', 'SANS_CRUDITES', 'SAUCE_A_PART'],
      ['SANS_SAUCE', 'SANS_VERMICELLES', 'SANS_CONCOMBRE'],
    ),
    'Poulet croustillant': config([
      'SAUCE_A_PART',
      'SANS_SAUCE',
      'SAUCE_SUPPLEMENTAIRE',
      'SANS_ACCOMPAGNEMENT',
    ]),
    'Panier de frites wedges': config(
      ['SANS_MAYONNAISE', 'SANS_SRIRACHA', 'SAUCES_A_PART', 'SANS_SAUCE'],
      ['SANS_SEL'],
    ),
    'Pho Bœuf': config(
      ['SANS_CORIANDRE', 'SANS_CIBOULE', 'SANS_OIGNON', 'SANS_BOULETTES'],
      ['SANS_HERBES', 'BOUILLON_A_PART', 'NOUILLES_A_PART', 'SANS_PIMENT'],
    ),
    'Mì Quảng poulet': config(
      ['SANS_CORIANDRE', 'SANS_CIBOULE', 'SANS_CACAHUETES', 'SANS_PIMENT'],
      ['SANS_HERBES', 'PEU_EPICE', 'BOUILLON_A_PART', 'NOUILLES_A_PART'],
    ),
    'Le trio Glaces': config([
      'SANS_CACAHUETES',
      'SANS_SAUCE_CHOCOLAT',
      'SAUCE_CHOCOLAT_A_PART',
      'SANS_BISCUIT',
    ]),
    'Mojito litchi': config([
      'SANS_ALCOOL',
      'SANS_GLACONS',
      'PEU_SUCRE',
      'SANS_MENTHE',
      'SANS_CITRON',
      'ALCOOL_LEGER',
    ]),
    'Mojito citron-menthe': config([
      'SANS_ALCOOL',
      'SANS_GLACONS',
      'PEU_SUCRE',
      'SANS_MENTHE',
      'SANS_CITRON',
      'ALCOOL_LEGER',
    ]),
  };
