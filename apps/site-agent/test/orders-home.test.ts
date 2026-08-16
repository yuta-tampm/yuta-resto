import { describe, expect, it } from 'vitest';
import {
  escapeLikePattern,
  resolveOrdersHomePagination,
} from '../src/services/site-agent-service';

describe('POS Home pagination', () => {
  it('clamps an out-of-range page to the last available page', () => {
    expect(
      resolveOrdersHomePagination({
        requestedPage: 9,
        pageSize: 50,
        totalItems: 121,
      }),
    ).toEqual({ page: 3, totalPages: 3, offset: 100 });
  });

  it('keeps an empty result on page one', () => {
    expect(
      resolveOrdersHomePagination({
        requestedPage: 2,
        pageSize: 50,
        totalItems: 0,
      }),
    ).toEqual({ page: 1, totalPages: 1, offset: 0 });
  });
});

describe('POS Home search', () => {
  it('escapes SQL LIKE wildcards while retaining normal text', () => {
    expect(escapeLikePattern('Table_50%\\A')).toBe('Table\\_50\\%\\\\A');
  });
});
