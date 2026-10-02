import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { execute } = vi.hoisted(() => ({ execute: vi.fn() }));

vi.mock('server-only', () => ({}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { execute },
}));

import { GET } from '../src/app/api/ready/route';

describe('booking readiness route', () => {
  beforeEach(() => {
    execute.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('reports ready when the cloud database responds', async () => {
    execute.mockResolvedValueOnce([{ '?column?': 1 }]);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    await expect(response.json()).resolves.toEqual({
      status: 'ready',
      service: 'booking-web',
    });
  });

  it('fails closed without exposing a database error', async () => {
    execute.mockRejectedValueOnce(new Error('sensitive database detail'));

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      status: 'not_ready',
      service: 'booking-web',
    });
  });

  it('returns not ready when the database probe exceeds its deadline', async () => {
    vi.useFakeTimers();
    execute.mockReturnValueOnce(new Promise(() => undefined));

    const responsePromise = GET();
    await vi.advanceTimersByTimeAsync(2_000);
    const response = await responsePromise;

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      status: 'not_ready',
      service: 'booking-web',
    });
  });
});
