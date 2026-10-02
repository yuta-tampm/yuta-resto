import type { AuthenticatedSession } from '@yuta/auth';
import type { MembershipLookupPort, MembershipRecord } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const infrastructure = vi.hoisted(() => ({
  findSession: vi.fn<(token: string) => Promise<AuthenticatedSession | null>>(),
  membership: vi.fn<MembershipLookupPort['findActiveMembership']>(),
  metadata: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === 'yuta_backoffice_session' ? { value: 'token' } : undefined,
  }),
}));
vi.mock('next/navigation', () => ({
  redirect: (destination: string): never => {
    throw new Error(`REDIRECT:${destination}`);
  },
}));
// React.cache only memoizes while rendering Server Components. Emulate one
// render pass: results are shared by identical primitive arguments, and the
// store is reset in beforeEach to model a new request.
const renderPass = vi.hoisted(() => ({
  store: new Map<string, unknown>(),
  reset() {
    this.store.clear();
  },
}));
vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react')>()),
  cache:
    <Arguments extends unknown[], Result>(
      callback: (...args: Arguments) => Result,
    ) =>
    (...args: Arguments): Result => {
      const key = `${callback.toString()}|${JSON.stringify(args)}`;
      if (!renderPass.store.has(key)) {
        renderPass.store.set(key, callback(...args));
      }
      return renderPass.store.get(key) as Result;
    },
}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: Object.freeze({ testBoundary: 'tenant-resolution-cache' }),
}));
vi.mock('@yuta/db-cloud', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@yuta/db-cloud')>()),
  createAuthRepository: () => ({ findSession: infrastructure.findSession }),
  createMembershipLookup: () => ({
    findActiveMembership: infrastructure.membership,
  }),
  findAuthenticatedTenantMetadata: infrastructure.metadata,
}));

import {
  requireAuthenticatedTenant,
  requireReputationTenant,
} from '../src/server/auth/session';

beforeEach(() => {
  vi.clearAllMocks();
  renderPass.reset();
  infrastructure.findSession.mockResolvedValue(session());
  infrastructure.membership.mockResolvedValue(membership());
  infrastructure.metadata.mockResolvedValue({
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: ['reputation.enabled'],
  });
});

describe('tenant resolution within one render pass', () => {
  it('resolves metadata and membership once for a layout and a nested page', async () => {
    const layout = await requireAuthenticatedTenant();
    const page = await requireAuthenticatedTenant(
      '/visibilite-reputation/avis',
    );

    expect(page.tenant).toBe(layout.tenant);
    expect(infrastructure.metadata).toHaveBeenCalledTimes(1);
    expect(infrastructure.membership).toHaveBeenCalledTimes(1);
  });

  it('shares the lookup with a streamed component using a module-specific helper', async () => {
    await requireAuthenticatedTenant();
    await requireReputationTenant('/visibilite-reputation/satisfaction');

    expect(infrastructure.metadata).toHaveBeenCalledTimes(1);
    expect(infrastructure.membership).toHaveBeenCalledTimes(1);
  });

  it('keeps the return path outside the cached resolution', async () => {
    infrastructure.metadata.mockResolvedValue(null);

    await expect(requireAuthenticatedTenant('/aujourdhui')).rejects.toThrow(
      'REDIRECT:/resolution-etablissement?returnTo=%2Faujourdhui',
    );
    await expect(
      requireAuthenticatedTenant('/visibilite-reputation/avis'),
    ).rejects.toThrow(
      'REDIRECT:/resolution-etablissement?returnTo=%2Fvisibilite-reputation%2Favis',
    );
    expect(infrastructure.metadata).toHaveBeenCalledTimes(1);
  });

  it('resolves again for a new request instead of reusing a stale tenant', async () => {
    await requireAuthenticatedTenant();
    infrastructure.findSession.mockResolvedValue(
      session({ establishmentId: 'est-b' }),
    );
    infrastructure.membership.mockResolvedValue(
      membership({ establishmentId: 'est-b' }),
    );
    renderPass.reset();
    const next = await requireAuthenticatedTenant();

    expect(next.tenant.establishmentId).toBe('est-b');
    expect(infrastructure.metadata).toHaveBeenCalledTimes(2);
    expect(infrastructure.metadata).toHaveBeenLastCalledWith(
      expect.anything(),
      { organizationId: 'org-a', establishmentId: 'est-b' },
    );
  });

  it('propagates a metadata failure instead of redirecting and shares it within the render', async () => {
    infrastructure.metadata.mockRejectedValue(
      new Error('database unavailable'),
    );

    await expect(requireAuthenticatedTenant()).rejects.toThrow(
      'database unavailable',
    );
    await expect(
      requireAuthenticatedTenant('/visibilite-reputation/avis'),
    ).rejects.toThrow('database unavailable');
    expect(infrastructure.metadata).toHaveBeenCalledTimes(1);
  });

  it('propagates a membership lookup failure instead of redirecting', async () => {
    infrastructure.membership.mockRejectedValue(new Error('lookup failed'));

    await expect(requireAuthenticatedTenant()).rejects.toThrow('lookup failed');
  });

  it('recovers scope when the membership is no longer active', async () => {
    infrastructure.membership.mockResolvedValue(
      membership({ status: 'suspended' }),
    );

    await expect(requireAuthenticatedTenant()).rejects.toThrow(
      'REDIRECT:/resolution-etablissement?returnTo=%2Faujourdhui',
    );
  });
});

function session(overrides: Partial<AuthenticatedSession> = {}) {
  return {
    id: 'session-a',
    userId: 'user-a',
    userName: 'Synthetic user',
    userEmail: 'synthetic@example.test',
    systemRole: null,
    organizationId: 'org-a',
    establishmentId: 'est-a',
    expiresAt: new Date('2099-01-01T00:00:00Z'),
    ...overrides,
  } satisfies AuthenticatedSession;
}

function membership(
  overrides: Partial<MembershipRecord> = {},
): MembershipRecord {
  return {
    membershipId: 'member-a',
    userId: 'user-a',
    organizationId: 'org-a',
    establishmentId: 'est-a',
    status: 'active',
    role: 'OWNER',
    ...overrides,
  };
}
