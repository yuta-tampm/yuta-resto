import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({
  due: vi.fn(),
  purge: vi.fn(),
  databaseImport: vi.fn(),
  fetch: vi.fn(),
}));
vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  listDueGoogleReviewCacheScopes: hooks.due,
  purgeGoogleReviewCache: hooks.purge,
}));

const secret = 'synthetic-maintenance-secret-with-at-least-32-characters';
const scope = {
  organizationId: 'c8494309-c6df-42bf-9260-090c3187420b',
  establishmentId: '384e37c5-45c2-4722-8c65-0eb0238ea3a7',
};
const route = async (authorization?: string, method = 'POST') => {
  const { POST } =
    await import('../src/app/api/internal/reputation/google-cache-maintenance/route');
  return POST(
    new Request(
      'https://synthetic.invalid/api/internal/reputation/google-cache-maintenance',
      {
        method,
        ...(authorization ? { headers: { authorization } } : {}),
      },
    ),
  );
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.resetModules();
  vi.doMock('../src/server/cloud-database', () => {
    hooks.databaseImport();
    return { cloudDatabase: { synthetic: true } };
  });
  vi.stubEnv('REPUTATION_CACHE_MAINTENANCE_SECRET', secret);
  vi.stubEnv('GOOGLE_REVIEW_RETRIEVAL_ENABLED', 'false');
  hooks.fetch.mockRejectedValue(
    new Error('Unrecognized external call denied by synthetic fixture.'),
  );
  vi.stubGlobal('fetch', hooks.fetch);
  hooks.due.mockResolvedValue([scope]);
  hooks.purge.mockResolvedValue({
    contentCleared: 2,
    referencesRemoved: 1,
    continuationsCleared: 1,
  });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('machine-authenticated Google content-only maintenance', () => {
  it.each([
    undefined,
    '',
    'short',
    'synthetic secret with spaces and enough length',
  ])(
    'denies unconfigured credential %j before DB module import/access',
    async (value) => {
      vi.stubEnv('REPUTATION_CACHE_MAINTENANCE_SECRET', value);
      const response = await route(`Bearer ${secret}`);
      expect(response.status).toBe(503);
      expect(await response.json()).toEqual({
        code: 'GOOGLE_CACHE_MAINTENANCE_UNAVAILABLE',
      });
      expect(response.headers.get('cache-control')).toContain('no-store');
      expect(hooks.databaseImport).not.toHaveBeenCalled();
      expect(hooks.due).not.toHaveBeenCalled();
      expect(hooks.purge).not.toHaveBeenCalled();
      expect(hooks.fetch).not.toHaveBeenCalled();
    },
  );

  it.each([
    undefined,
    'wrong',
    'Bearer incorrect',
    `Basic ${secret}`,
    `Bearer ${secret} extra`,
    `bearer ${secret}`,
  ])(
    'denies invalid authorization %j before DB module import/access',
    async (authorization) => {
      const response = await route(authorization);
      expect(response.status).toBe(403);
      expect(await response.json()).toEqual({
        code: 'GOOGLE_CACHE_MAINTENANCE_UNAVAILABLE',
      });
      expect(hooks.databaseImport).not.toHaveBeenCalled();
      expect(hooks.due).not.toHaveBeenCalled();
      expect(hooks.purge).not.toHaveBeenCalled();
    },
  );

  it('rejects direct non-POST execution before authentication/import/effects', async () => {
    const response = await route(`Bearer ${secret}`, 'GET');
    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('POST');
    expect(hooks.databaseImport).not.toHaveBeenCalled();
    expect(hooks.due).not.toHaveBeenCalled();
    expect(hooks.purge).not.toHaveBeenCalled();
  });

  it('cleans under its own machine authority even with retrieval disabled, returning own counts only', async () => {
    const response = await route(`Bearer ${secret}`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      scopesProcessed: 1,
      contentCleared: 2,
      referencesRemoved: 1,
      continuationsCleared: 1,
    });
    expect(hooks.databaseImport).toHaveBeenCalledTimes(1);
    expect(hooks.due).toHaveBeenCalledWith(expect.anything(), {
      now: expect.any(Date),
      limit: 25,
    });
    expect(hooks.purge).toHaveBeenCalledWith(expect.anything(), scope, {
      now: expect.any(Date),
      limit: 500,
    });
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(hooks.fetch).not.toHaveBeenCalled();
  });

  it('bounds due scopes and each explicit scope batch even if the repository returns too many', async () => {
    hooks.due.mockResolvedValue(Array.from({ length: 30 }, () => scope));
    const response = await route(`Bearer ${secret}`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      scopesProcessed: 25,
      contentCleared: 50,
      referencesRemoved: 25,
      continuationsCleared: 25,
    });
    expect(hooks.purge).toHaveBeenCalledTimes(25);
    for (const [, capturedScope, input] of hooks.purge.mock.calls) {
      expect(capturedScope).toEqual(scope);
      expect(input.limit).toBe(500);
    }
    expect(hooks.fetch).not.toHaveBeenCalled();
  });

  it('returns a safe no-store failure without exposing native DB errors or scope', async () => {
    hooks.purge.mockRejectedValue(
      new Error('native secret-bearing database-url and provider resource'),
    );
    const response = await route(`Bearer ${secret}`);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      code: 'GOOGLE_CACHE_MAINTENANCE_UNAVAILABLE',
    });
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(hooks.fetch).not.toHaveBeenCalled();
  });
});
