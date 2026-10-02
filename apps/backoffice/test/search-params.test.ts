import { describe, expect, it } from 'vitest';
import { firstSearchParam } from '../src/lib/search-params';

describe('firstSearchParam', () => {
  it('takes the first value from repeated search parameters', () => {
    expect(firstSearchParam(['first', 'second'])).toBe('first');
    expect(firstSearchParam('single')).toBe('single');
    expect(firstSearchParam(undefined)).toBeUndefined();
  });
});
