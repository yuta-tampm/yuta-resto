import { describe, expect, it } from 'vitest';
import { splitCents } from '../src/money-split';

describe('splitCents', () => {
  it('gives the remainder cents to the first shares', () => {
    expect(splitCents(1000, 3)).toEqual([334, 333, 333]);
    expect(splitCents(2, 3)).toEqual([1, 1, 0]);
    expect(splitCents(1200, 4)).toEqual([300, 300, 300, 300]);
  });

  it('conserves the total', () => {
    for (const [total, parts] of [
      [1000, 3],
      [9999, 7],
      [1, 6],
    ]) {
      expect(
        splitCents(total, parts).reduce((sum, part) => sum + part, 0),
      ).toBe(total);
    }
  });
});
