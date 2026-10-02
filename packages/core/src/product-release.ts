export const PRODUCT_MATURITY_STAGES = Object.freeze([
  'PROTOTYPE',
  'ALPHA',
  'PRIVATE_BETA',
  'PUBLIC_BETA',
  'RELEASE_CANDIDATE',
  'GENERAL_AVAILABILITY',
] as const);

export type ProductMaturityStage = (typeof PRODUCT_MATURITY_STAGES)[number];

export const PRODUCT_MATURITY_LABELS = Object.freeze({
  PROTOTYPE: 'Prototype',
  ALPHA: 'Alpha',
  PRIVATE_BETA: 'Private Beta',
  PUBLIC_BETA: 'Public Beta',
  RELEASE_CANDIDATE: 'RC',
  GENERAL_AVAILABILITY: 'Stable',
} as const satisfies Record<ProductMaturityStage, string>);

export type ProductRelease = Readonly<{
  product: 'YUTA';
  maturityStage: ProductMaturityStage;
  version: string;
  releaseName: string;
}>;

export const CURRENT_YUTA_PRODUCT_RELEASE = Object.freeze({
  product: 'YUTA',
  maturityStage: 'ALPHA',
  version: '0.1.0-alpha.1',
  releaseName: 'Foundation',
} as const satisfies ProductRelease);

const productVersionPattern =
  /^(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

function isProductMaturityStage(value: unknown): value is ProductMaturityStage {
  return PRODUCT_MATURITY_STAGES.some((stage) => stage === value);
}

export function isValidProductVersion(value: string): boolean {
  if (typeof value !== 'string') return false;

  const match = productVersionPattern.exec(value);
  if (!match || match[0] !== value) return false;

  const prerelease = match[1];
  if (!prerelease) return true;

  return prerelease
    .split('.')
    .every(
      (identifier) =>
        !/^[0-9]+$/.test(identifier) ||
        identifier === '0' ||
        identifier[0] !== '0',
    );
}

export function parseProductRelease(value: unknown): ProductRelease {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Invalid Product Release metadata');
  }

  const keys = Reflect.ownKeys(value);
  if (
    keys.length !== 4 ||
    !['product', 'maturityStage', 'version', 'releaseName'].every((key) =>
      keys.includes(key),
    )
  ) {
    throw new Error('Invalid Product Release metadata');
  }

  const input = value as Record<string, unknown>;
  const { product, maturityStage, version, releaseName } = input;
  if (
    product !== 'YUTA' ||
    !isProductMaturityStage(maturityStage) ||
    typeof version !== 'string' ||
    !isValidProductVersion(version) ||
    typeof releaseName !== 'string' ||
    releaseName.trim().length === 0
  ) {
    throw new Error('Invalid Product Release metadata');
  }

  return { product, maturityStage, version, releaseName };
}

export function getProductMaturityLabel(stage: ProductMaturityStage): string {
  if (!isProductMaturityStage(stage)) {
    throw new Error('Invalid Product Maturity Stage');
  }

  return PRODUCT_MATURITY_LABELS[stage];
}

export function formatProductRelease(release: ProductRelease): string {
  const validated = parseProductRelease(release);
  return `${validated.product} ${getProductMaturityLabel(validated.maturityStage)} · v${validated.version}`;
}

export function formatCompactProductRelease(release: ProductRelease): string {
  const validated = parseProductRelease(release);
  return `${getProductMaturityLabel(validated.maturityStage)} · v${validated.version}`;
}
