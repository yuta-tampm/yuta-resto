import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
const bootstrap = vi.hoisted(() => vi.fn());
vi.mock('../src/server/pointage/raw-clocking-bootstrap', () => ({
  getPointageRawClockingConsumer: bootstrap,
}));
import { handlePointageRawClockingRequest } from '../src/server/pointage/raw-clocking-http';

afterEach(() => {
  vi.unstubAllEnvs();
  bootstrap.mockReset();
});

describe('A closes every Pointage handler before admission or body processing', () => {
  it.each([
    'context',
    'identify',
    'state',
    'clock-in',
    'clock-out',
    'recover',
    'end',
  ] as const)('denies %s before its protected outcome', async (operation) => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'release-a');
    const request = new Request(
      `http://127.0.0.1:3001/api/pointage/synthetic/${operation}`,
      {
        method: operation === 'context' ? 'GET' : 'POST',
        headers: {
          origin: 'http://127.0.0.1:3001',
          'content-type': 'application/json',
          authorization: 'Pointage ptc1_synthetic',
        },
        ...(operation !== 'context' ? { body: 'invalid private body' } : {}),
      },
    );
    const body = vi.spyOn(request, 'body', 'get');
    const response = await handlePointageRawClockingRequest(
      request,
      'synthetic',
      operation,
    );
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ code: 'POINTAGE_ACCESS_DENIED' });
    expect(body).not.toHaveBeenCalled();
    expect(bootstrap).not.toHaveBeenCalled();
    expect(response.headers.get('cache-control')).toContain('no-store');
  });
  it('invalid required configuration is unavailable before bootstrap', async () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'invalid');
    const response = await handlePointageRawClockingRequest(
      new Request('http://127.0.0.1:3001/api/pointage/synthetic/context'),
      'synthetic',
      'context',
    );
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ code: 'POINTAGE_UNAVAILABLE' });
    expect(bootstrap).not.toHaveBeenCalled();
  });
});
