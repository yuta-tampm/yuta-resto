import { describe, expect, it } from 'vitest';
import { resolvePrintJobPagination } from '../src/services/print-job-service';

describe('print job pagination', () => {
  it('uses ten-item page offsets', () => {
    expect(
      resolvePrintJobPagination({
        requestedPage: 3,
        pageSize: 10,
        totalItems: 35,
      }),
    ).toEqual({ page: 3, totalPages: 4, offset: 20 });
  });

  it('clamps a page that became larger than the refreshed result set', () => {
    expect(
      resolvePrintJobPagination({
        requestedPage: 5,
        pageSize: 10,
        totalItems: 12,
      }),
    ).toEqual({ page: 2, totalPages: 2, offset: 10 });
  });

  it('keeps an empty queue on page one', () => {
    expect(
      resolvePrintJobPagination({
        requestedPage: 2,
        pageSize: 10,
        totalItems: 0,
      }),
    ).toEqual({ page: 1, totalPages: 1, offset: 0 });
  });
});
