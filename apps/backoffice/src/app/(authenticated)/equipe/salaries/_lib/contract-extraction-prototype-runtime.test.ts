import { describe, expect, it } from 'vitest';
import { isContractExtractionPrototypeEnabled } from './contract-extraction-prototype-runtime';

describe('isContractExtractionPrototypeEnabled', () => {
  it('enables the fixture prototype only in local development', () => {
    expect(isContractExtractionPrototypeEnabled('development')).toBe(true);
    expect(isContractExtractionPrototypeEnabled('production')).toBe(false);
    expect(isContractExtractionPrototypeEnabled('test')).toBe(false);
    expect(isContractExtractionPrototypeEnabled(undefined)).toBe(false);
  });
});
