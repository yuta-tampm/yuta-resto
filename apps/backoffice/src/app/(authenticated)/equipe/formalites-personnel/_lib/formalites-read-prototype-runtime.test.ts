import { describe, expect, it } from 'vitest';
import { isFormalitesReadPrototypeEnabled } from './formalites-read-prototype-runtime';

describe('isFormalitesReadPrototypeEnabled', () => {
  it('requires an explicit development-only opt-in', () => {
    expect(isFormalitesReadPrototypeEnabled('development', 'true')).toBe(true);
    expect(isFormalitesReadPrototypeEnabled('development', 'false')).toBe(
      false,
    );
    expect(isFormalitesReadPrototypeEnabled('development', undefined)).toBe(
      false,
    );
    expect(isFormalitesReadPrototypeEnabled('production', 'true')).toBe(false);
    expect(isFormalitesReadPrototypeEnabled('test', 'true')).toBe(false);
  });
});
