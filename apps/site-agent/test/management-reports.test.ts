import { describe, expect, it } from 'vitest';
import { getServiceDayWindow } from '@yuta/core';
import { resolveManagementReportsPagination } from '../src/services/management-reports-service';

process.env.TZ = 'Europe/Paris';

describe('Management reports service day', () => {
  it('keeps 05:00 wall-clock boundaries across the spring DST change', () => {
    const window = getServiceDayWindow(new Date('2026-03-29T00:30:00.000Z'));

    expect(window.start.toISOString()).toBe('2026-03-28T04:00:00.000Z');
    expect(window.end.toISOString()).toBe('2026-03-29T03:00:00.000Z');
    expect(window.end.getTime() - window.start.getTime()).toBe(
      23 * 60 * 60 * 1000,
    );
  });

  it('keeps 05:00 wall-clock boundaries across the autumn DST change', () => {
    const window = getServiceDayWindow(new Date('2026-10-25T00:30:00.000Z'));

    expect(window.start.toISOString()).toBe('2026-10-24T03:00:00.000Z');
    expect(window.end.toISOString()).toBe('2026-10-25T04:00:00.000Z');
    expect(window.end.getTime() - window.start.getTime()).toBe(
      25 * 60 * 60 * 1000,
    );
  });
});

describe('Management reports pagination', () => {
  it('clamps an out-of-range page to the last available page', () => {
    expect(
      resolveManagementReportsPagination({
        requestedPage: 9,
        pageSize: 50,
        totalItems: 121,
      }),
    ).toEqual({ page: 3, totalPages: 3, offset: 100 });
  });

  it('keeps an empty report on page one', () => {
    expect(
      resolveManagementReportsPagination({
        requestedPage: 2,
        pageSize: 50,
        totalItems: 0,
      }),
    ).toEqual({ page: 1, totalPages: 1, offset: 0 });
  });
});
