import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: vi.fn() }) }));
vi.mock('next/navigation', () => ({
  redirect: (destination: string): never => {
    throw new Error(`REDIRECT:${destination}`);
  },
}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: Object.freeze({ testBoundary: 'auth-secret' }),
}));
vi.mock('@yuta/db-cloud', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@yuta/db-cloud')>()),
  createAuthRepository: () => ({ findSession: vi.fn() }),
}));

import { getAuthSecret } from '../src/server/auth/session';

describe('getAuthSecret', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns a configured secret of at least 32 characters', () => {
    const secret = 'synthetic-test-auth-secret-0123456789';
    vi.stubEnv('AUTH_SECRET', secret);
    expect(getAuthSecret()).toBe(secret);
  });

  it.each(['development', 'test', 'production'])(
    'fails closed when AUTH_SECRET is missing in %s',
    (nodeEnvironment) => {
      vi.stubEnv('NODE_ENV', nodeEnvironment);
      vi.stubEnv('AUTH_SECRET', '');
      expect(() => getAuthSecret()).toThrow(
        /AUTH_SECRET must contain at least 32 characters/,
      );
    },
  );

  it.each(['development', 'test', 'production'])(
    'rejects the publicly known .env.example placeholder in %s',
    (nodeEnvironment) => {
      const example = readFileSync(
        new URL('../.env.example', import.meta.url),
        'utf8',
      );
      const placeholder = /^AUTH_SECRET=(.+)$/mu.exec(example)?.[1]?.trim();
      expect(placeholder).toMatch(/^replace-with-/u);
      expect(placeholder!.length).toBeGreaterThanOrEqual(32);

      vi.stubEnv('NODE_ENV', nodeEnvironment);
      vi.stubEnv('AUTH_SECRET', placeholder!);
      expect(() => getAuthSecret()).toThrow(/\.env\.example placeholder/u);
    },
  );

  it('accepts exactly 32 characters and rejects 31', () => {
    vi.stubEnv('AUTH_SECRET', 'a'.repeat(32));
    expect(getAuthSecret()).toBe('a'.repeat(32));
    vi.stubEnv('AUTH_SECRET', 'a'.repeat(31));
    expect(() => getAuthSecret()).toThrow(
      /AUTH_SECRET must contain at least 32 characters/,
    );
  });

  it.each(['development', 'production'])(
    'rejects a secret shorter than 32 characters in %s',
    (nodeEnvironment) => {
      vi.stubEnv('NODE_ENV', nodeEnvironment);
      vi.stubEnv('AUTH_SECRET', 'too-short');
      expect(() => getAuthSecret()).toThrow(
        /AUTH_SECRET must contain at least 32 characters/,
      );
    },
  );
});
