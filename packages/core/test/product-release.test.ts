import { describe, expect, it } from 'vitest';
import {
  CURRENT_YUTA_PRODUCT_RELEASE,
  PRODUCT_MATURITY_LABELS,
  PRODUCT_MATURITY_STAGES,
  formatCompactProductRelease,
  formatProductRelease,
  getProductMaturityLabel,
  isValidProductVersion,
  parseProductRelease,
  type ProductMaturityStage,
  type ProductRelease,
} from '../src';

const expectedLabels = {
  PROTOTYPE: 'Prototype',
  ALPHA: 'Alpha',
  PRIVATE_BETA: 'Private Beta',
  PUBLIC_BETA: 'Public Beta',
  RELEASE_CANDIDATE: 'RC',
  GENERAL_AVAILABILITY: 'Stable',
} as const;

describe('Product Release maturity stages', () => {
  it('exposes exactly the six approved stages and canonical labels', () => {
    expect(PRODUCT_MATURITY_STAGES).toEqual([
      'PROTOTYPE',
      'ALPHA',
      'PRIVATE_BETA',
      'PUBLIC_BETA',
      'RELEASE_CANDIDATE',
      'GENERAL_AVAILABILITY',
    ]);
    expect(PRODUCT_MATURITY_LABELS).toEqual(expectedLabels);
    expect(Object.isFrozen(PRODUCT_MATURITY_STAGES)).toBe(true);
    expect(Object.isFrozen(PRODUCT_MATURITY_LABELS)).toBe(true);

    for (const stage of PRODUCT_MATURITY_STAGES) {
      expect(getProductMaturityLabel(stage)).toBe(expectedLabels[stage]);
    }
  });

  it('rejects unsupported runtime stages instead of returning a fallback', () => {
    expect(() =>
      getProductMaturityLabel('BETA' as ProductMaturityStage),
    ).toThrow('Invalid Product Maturity Stage');
    expect(() =>
      parseProductRelease({
        ...CURRENT_YUTA_PRODUCT_RELEASE,
        maturityStage: 'BETA',
      }),
    ).toThrow('Invalid Product Release metadata');
  });
});

describe('Product Version validation', () => {
  it.each([
    '0.1.0',
    '1.0.0',
    '2.13.4',
    '0.1.0-alpha.1',
    '0.2.0-beta.1',
    '0.9.0-rc.1',
    '1.0.0-alpha.0',
    '1.0.0-alpha-1',
  ])('accepts approved grammar: %s', (version) => {
    expect(isValidProductVersion(version)).toBe(true);
  });

  it.each([
    '',
    '1',
    '1.0',
    'v0.1.0-alpha.1',
    '01.0.0',
    '1.01.0',
    '1.0.00',
    '0.1.0-',
    '0.1.0-alpha..1',
    '0.1.0-alpha.01',
    '1.0.0+build.42',
    '1.0.0-alpha+build.42',
    '1.0.0-01',
    '1.0.0-ALPHA_1',
    '1.0.0\n',
    '1.0.0\r\n',
  ])('rejects values outside the approved grammar: %s', (version) => {
    expect(isValidProductVersion(version)).toBe(false);
    expect(() =>
      parseProductRelease({ ...CURRENT_YUTA_PRODUCT_RELEASE, version }),
    ).toThrow('Invalid Product Release metadata');
  });
});

describe('YUTA Product Release identity', () => {
  it('has one immutable four-field current release without a release ID or label copy', () => {
    expect(CURRENT_YUTA_PRODUCT_RELEASE).toEqual({
      product: 'YUTA',
      maturityStage: 'ALPHA',
      version: '0.1.0-alpha.1',
      releaseName: 'Foundation',
    });
    expect(Reflect.ownKeys(CURRENT_YUTA_PRODUCT_RELEASE)).toEqual([
      'product',
      'maturityStage',
      'version',
      'releaseName',
    ]);
    expect(Object.isFrozen(CURRENT_YUTA_PRODUCT_RELEASE)).toBe(true);
    expect(parseProductRelease(CURRENT_YUTA_PRODUCT_RELEASE)).toEqual(
      CURRENT_YUTA_PRODUCT_RELEASE,
    );
  });

  it('rejects extra metadata and blank release names', () => {
    expect(() =>
      parseProductRelease({
        ...CURRENT_YUTA_PRODUCT_RELEASE,
        releaseId: 'some-id',
      }),
    ).toThrow('Invalid Product Release metadata');
    expect(() =>
      parseProductRelease({
        ...CURRENT_YUTA_PRODUCT_RELEASE,
        publicLabel: 'Alpha',
      }),
    ).toThrow('Invalid Product Release metadata');
    expect(() =>
      parseProductRelease({
        ...CURRENT_YUTA_PRODUCT_RELEASE,
        releaseName: ' ',
      }),
    ).toThrow('Invalid Product Release metadata');
  });

  it('derives full and compact representations without altering canonical version', () => {
    expect(formatProductRelease(CURRENT_YUTA_PRODUCT_RELEASE)).toBe(
      'YUTA Alpha · v0.1.0-alpha.1',
    );
    expect(formatCompactProductRelease(CURRENT_YUTA_PRODUCT_RELEASE)).toBe(
      'Alpha · v0.1.0-alpha.1',
    );
    expect(CURRENT_YUTA_PRODUCT_RELEASE.version).toBe('0.1.0-alpha.1');
  });

  it('keeps the release name separate from stage and version', () => {
    const renamed: ProductRelease = {
      ...CURRENT_YUTA_PRODUCT_RELEASE,
      releaseName: 'Next Foundation',
    };

    expect(parseProductRelease(renamed)).toEqual(renamed);
    expect(formatProductRelease(renamed)).toBe('YUTA Alpha · v0.1.0-alpha.1');
  });

  it('keeps maturity independent of prerelease text', () => {
    for (const maturityStage of ['PRIVATE_BETA', 'PUBLIC_BETA'] as const) {
      const release: ProductRelease = {
        ...CURRENT_YUTA_PRODUCT_RELEASE,
        maturityStage,
        version: '0.2.0-beta.1',
      };

      expect(parseProductRelease(release).maturityStage).toBe(maturityStage);
      expect(formatCompactProductRelease(release)).toBe(
        `${expectedLabels[maturityStage]} · v0.2.0-beta.1`,
      );
    }

    expect(
      parseProductRelease({
        ...CURRENT_YUTA_PRODUCT_RELEASE,
        version: '1.0.0',
      }).maturityStage,
    ).toBe('ALPHA');
  });

  it('validates metadata before formatting', () => {
    expect(() =>
      formatProductRelease({
        ...CURRENT_YUTA_PRODUCT_RELEASE,
        version: 'v0.1.0-alpha.1',
      }),
    ).toThrow('Invalid Product Release metadata');
    expect(() =>
      formatCompactProductRelease({
        ...CURRENT_YUTA_PRODUCT_RELEASE,
        maturityStage: 'UNKNOWN',
      } as unknown as ProductRelease),
    ).toThrow('Invalid Product Release metadata');
  });
});
