import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
const calls = vi.hoisted(() => ({
  get: vi.fn(),
  context: vi.fn(),
  identify: vi.fn(),
  readState: vi.fn(),
  mutate: vi.fn(),
  recover: vi.fn(),
  end: vi.fn(),
}));
vi.mock('../src/server/pointage/raw-clocking-bootstrap', () => ({
  getPointageRawClockingConsumer: calls.get,
}));
import { handlePointageRawClockingRequest } from '../src/server/pointage/raw-clocking-http';
const origin = 'http://127.0.0.1:3001';
const token = 'ptc1_' + Buffer.alloc(32).toString('base64url');
const guard = Buffer.alloc(32).toString('base64url');
const state = {
  displayName: 'Synthetic Test',
  status: 'NOT_CLOCKED_IN',
  openSessionStart: null,
  stateGuard: guard,
};
function request(
  body: unknown = {},
  extraHeaders: Record<string, string> = {},
) {
  return new Request(origin + '/api/pointage/synthetic-test/state', {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      Authorization: `Pointage ${token}`,
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
}
beforeEach(() => {
  vi.resetAllMocks();
  calls.get.mockResolvedValue(calls);
  calls.context.mockResolvedValue({ available: true });
  calls.identify.mockResolvedValue({
    ok: true,
    value: {
      state,
      continuation: token,
      expiresInMs: 120_000,
      idleInMs: 60_000,
    },
  });
  calls.readState.mockResolvedValue({
    ok: true,
    value: { state, expiresInMs: 119_000, idleInMs: 60_000 },
  });
  calls.end.mockResolvedValue({ ok: true, value: null });
});
describe('U2 HTTP adapter unit evidence (not actual-process or Browser QA)', () => {
  it('missing admission cannot process credentials/body', async () => {
    calls.get.mockRejectedValue(new Error('private secret'));
    const response = await handlePointageRawClockingRequest(
      request({ credential: '12345678' }),
      'synthetic-test',
      'identify',
    );
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ code: 'POINTAGE_UNAVAILABLE' });
    expect(calls.identify).not.toHaveBeenCalled();
  });
  it('context requires the same consumer and returns only neutral availability', async () => {
    const response = await handlePointageRawClockingRequest(
      new Request(origin + '/api/pointage/synthetic-test/context'),
      'synthetic-test',
      'context',
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ available: true });
    expect(calls.context).toHaveBeenCalledWith('synthetic-test');
    calls.context.mockResolvedValue(null);
    expect(
      (
        await handlePointageRawClockingRequest(
          new Request(origin),
          'absent',
          'context',
        )
      ).status,
    ).toBe(503);
  });
  it('strict DTOs refuse browser authority and surplus fields', async () => {
    for (const body of [
      { credential: '12345678', organizationId: 'untrusted' },
      { credential: '12345678', employee: 'untrusted' },
    ]) {
      expect(
        (
          await handlePointageRawClockingRequest(
            request(body),
            'synthetic-test',
            'identify',
          )
        ).status,
      ).toBe(400);
    }
    expect(calls.identify).not.toHaveBeenCalled();
  });
  it('4 KiB applies to actual bytes and malformed UTF-8/JSON never reaches service', async () => {
    expect(
      (
        await handlePointageRawClockingRequest(
          request({ credential: 'x'.repeat(4096) }),
          'synthetic-test',
          'identify',
        )
      ).status,
    ).toBe(400);
    const bad = new Request(origin, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: new Uint8Array([0xff, 0xfe]),
    });
    expect(
      (
        await handlePointageRawClockingRequest(
          bad,
          'synthetic-test',
          'identify',
        )
      ).status,
    ).toBe(400);
    expect(calls.identify).not.toHaveBeenCalled();
  });
  it('requires exact Origin and Pointage scheme, never cookies/generic cloud session', async () => {
    const rejectedHeaders: Array<Record<string, string>> = [
      { Origin: 'https://example.test' },
      { Origin: '' },
      { 'Sec-Fetch-Site': 'cross-site' },
    ];
    for (const patch of rejectedHeaders) {
      expect(
        (
          await handlePointageRawClockingRequest(
            request({}, patch),
            'synthetic-test',
            'state',
          )
        ).status,
      ).toBe(403);
    }
    for (const Authorization of [
      '',
      `Bearer ${token}`,
      `Pointage ${token} extra`,
    ]) {
      expect(
        (
          await handlePointageRawClockingRequest(
            request({}, { Authorization, Cookie: 'cloud-session=untrusted' }),
            'synthetic-test',
            'state',
          )
        ).status,
      ).toBe(403);
    }
    expect(calls.readState).not.toHaveBeenCalled();
  });
  it('returns validated minimal state and does not emit CORS/cacheable responses', async () => {
    const response = await handlePointageRawClockingRequest(
      request(),
      'synthetic-test',
      'state',
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      state,
      expiresInMs: 119_000,
      idleInMs: 60_000,
    });
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(response.headers.has('access-control-allow-origin')).toBe(false);
    calls.readState.mockResolvedValue({
      ok: true,
      value: { state, expiresInMs: 119_000, idleInMs: 60_000, history: [] },
    });
    expect(
      (
        await handlePointageRawClockingRequest(
          request(),
          'synthetic-test',
          'state',
        )
      ).status,
    ).toBe(503);
  });
  it.each([
    ['POINTAGE_ACCESS_DENIED', 403],
    ['POINTAGE_TRY_LATER', 429],
    ['POINTAGE_STATE_CONFLICT', 409],
    ['POINTAGE_REQUEST_CONFLICT', 409],
    ['POINTAGE_REQUEST_INVALID', 400],
    ['POINTAGE_UNAVAILABLE', 503],
  ])('maps %s without input echo', async (code, expected) => {
    calls.readState.mockResolvedValue({ ok: false, code });
    const response = await handlePointageRawClockingRequest(
      request(),
      'synthetic-test',
      'state',
    );
    expect(response.status).toBe(expected);
    expect(await response.json()).toEqual({ code });
  });
  it('end returns no identity/receipt', async () => {
    const response = await handlePointageRawClockingRequest(
      request(),
      'synthetic-test',
      'end',
    );
    expect(response.status).toBe(204);
    expect(await response.text()).toBe('');
  });
});
