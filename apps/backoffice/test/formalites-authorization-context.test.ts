import type { AuthenticatedSession } from '@yuta/auth';
import {
  TenantError,
  type MembershipLookupPort,
  type MembershipRecord,
} from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const infrastructure = vi.hoisted(() => ({
  findSession: vi.fn<(token: string) => Promise<AuthenticatedSession | null>>(),
  membership: vi.fn<MembershipLookupPort['findActiveMembership']>(),
  metadata: vi.fn(),
  cookieGet: vi.fn(),
  headers: vi.fn(),
  database: Object.freeze({ testBoundary: true }),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: infrastructure.cookieGet }),
  headers: infrastructure.headers,
}));
vi.mock('next/navigation', () => ({
  redirect: (destination: string): never => {
    throw new Error(`REDIRECT:${destination}`);
  },
}));
vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react')>()),
  // No request cache survives a synthetic request or test case.
  cache: <T>(callback: T): T => callback,
}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: infrastructure.database,
}));
vi.mock('@yuta/db-cloud', () => ({
  createAuthRepository: () => ({ findSession: infrastructure.findSession }),
  createMembershipLookup: () => ({
    findActiveMembership: infrastructure.membership,
  }),
  findAuthenticatedTenantMetadata: infrastructure.metadata,
}));

// Real session.ts, real @yuta/tenant resolver and real permission guards.
import { requireFormalitesTenant } from '../src/server/auth/formalites';
import * as permissions from '../src/server/auth/permissions';

const operations = ['formalites.read', 'formalites.manage'] as const;
const returnTo = '/equipe/formalites-personnel';
const recovery = `REDIRECT:/resolution-etablissement?returnTo=${encodeURIComponent(returnTo)}`;
const login = `REDIRECT:/connexion?returnTo=${encodeURIComponent(returnTo)}`;

function session(): AuthenticatedSession {
  return {
    id: 'synthetic-session',
    userId: 'user-a',
    userName: 'Synthetic Owner',
    userEmail: 'owner@example.test',
    systemRole: null,
    organizationId: 'org-a',
    establishmentId: 'est-a',
    expiresAt: new Date('2099-01-01T00:00:00Z'),
  };
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

beforeEach(() => {
  vi.restoreAllMocks();
  infrastructure.findSession.mockReset().mockResolvedValue(session());
  infrastructure.membership.mockReset().mockResolvedValue(membership());
  infrastructure.metadata.mockReset().mockResolvedValue({
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: [],
  });
  infrastructure.cookieGet
    .mockReset()
    .mockImplementation((name: string) =>
      name === 'yuta_backoffice_session'
        ? { value: 'synthetic-token' }
        : undefined,
    );
  infrastructure.headers.mockReset();
  vi.spyOn(permissions, 'requireFormalitesPermission');
});

describe.each(operations)('trusted composition: %s', (operation) => {
  it('returns the real resolved OWNER establishment context', async () => {
    const result = await requireFormalitesTenant(operation);
    expect(result.session).toEqual(session());
    expect(result.tenant).toMatchObject({
      organizationId: 'org-a',
      establishmentId: 'est-a',
      actor: {
        type: 'user',
        userId: 'user-a',
        membershipId: 'member-a',
        role: 'OWNER',
      },
    });
    expect(Object.isFrozen(result.tenant)).toBe(true);
    expect(
      permissions.requireFormalitesPermission,
    ).toHaveBeenCalledExactlyOnceWith(result.tenant, operation);
    expect(infrastructure.findSession).toHaveBeenCalledExactlyOnceWith(
      'synthetic-token',
    );
    expect(infrastructure.metadata).toHaveBeenCalledExactlyOnceWith(
      infrastructure.database,
      { organizationId: 'org-a', establishmentId: 'est-a' },
    );
    expect(infrastructure.membership).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-a',
        organizationId: 'org-a',
        establishmentId: 'est-a',
      }),
    );
  });

  it('rejects missing session cookie without looking up scope', async () => {
    infrastructure.cookieGet.mockReturnValue(undefined);
    await expect(requireFormalitesTenant(operation)).rejects.toThrow(login);
    expect(infrastructure.findSession).not.toHaveBeenCalled();
    expect(infrastructure.metadata).not.toHaveBeenCalled();
    expect(permissions.requireFormalitesPermission).not.toHaveBeenCalled();
  });

  it('preserves login redirect for upstream invalid/expired session or inactive user', async () => {
    // The repository owns these conditions and exposes null; no DB claim here.
    infrastructure.findSession.mockResolvedValue(null);
    await expect(requireFormalitesTenant(operation)).rejects.toThrow(login);
    expect(infrastructure.metadata).not.toHaveBeenCalled();
    expect(permissions.requireFormalitesPermission).not.toHaveBeenCalled();
  });

  it('preserves scope recovery for missing/inactive organization or establishment metadata', async () => {
    infrastructure.metadata.mockResolvedValue(null);
    await expect(requireFormalitesTenant(operation)).rejects.toThrow(recovery);
    expect(infrastructure.membership).not.toHaveBeenCalled();
    expect(permissions.requireFormalitesPermission).not.toHaveBeenCalled();
  });

  it.each([
    ['missing', null],
    ['inactive', membership({ status: 'suspended' })],
    ['wrong user', membership({ userId: 'user-b' })],
    ['wrong organization', membership({ organizationId: 'org-b' })],
    ['wrong establishment', membership({ establishmentId: 'est-b' })],
  ] as const)(
    'rejects %s membership through actual resolver',
    async (_label, record) => {
      infrastructure.membership.mockResolvedValue(record);
      await expect(requireFormalitesTenant(operation)).rejects.toThrow(
        recovery,
      );
      expect(permissions.requireFormalitesPermission).not.toHaveBeenCalled();
    },
  );

  it('rejects organization-only resolution with exact 400 rather than selecting scope', async () => {
    // Malformed upstream fixture reaches the established missing-scope guard.
    infrastructure.findSession.mockResolvedValue({
      ...session(),
      establishmentId: '',
    });
    infrastructure.membership.mockResolvedValue(
      membership({ establishmentId: '' }),
    );
    await expect(requireFormalitesTenant(operation)).rejects.toMatchObject({
      name: 'TenantError',
      code: 'ESTABLISHMENT_REQUIRED',
      statusCode: 400,
      message: 'An establishment is required.',
    });
    expect(permissions.requireFormalitesPermission).not.toHaveBeenCalled();
  });

  it.each(['MANAGER', 'STAFF'] as const)(
    'denies valid %s membership',
    async (role) => {
      infrastructure.membership.mockResolvedValue(membership({ role }));
      await expect(requireFormalitesTenant(operation)).rejects.toMatchObject({
        code: 'CROSS_TENANT_ACCESS_DENIED',
        statusCode: 403,
        message: 'Permission denied.',
      });
    },
  );

  it.each(['YUTA_ADMIN', 'YUTA_SUPPORT'] as const)(
    'does not bypass membership/grants for %s',
    async (systemRole) => {
      infrastructure.findSession.mockResolvedValue({
        ...session(),
        systemRole,
      });
      infrastructure.membership.mockResolvedValue(null);
      await expect(requireFormalitesTenant(operation)).rejects.toThrow(
        recovery,
      );
      for (const role of ['MANAGER', 'STAFF'] as const) {
        infrastructure.membership.mockResolvedValue(membership({ role }));
        await expect(requireFormalitesTenant(operation)).rejects.toMatchObject({
          code: 'CROSS_TENANT_ACCESS_DENIED',
          statusCode: 403,
        });
      }
    },
  );

  it('ignores browser authority claims in cookies, headers and returnTo query', async () => {
    const claims = {
      tenant: 'forged',
      organization: 'org-b',
      establishment: 'est-b',
      role: 'OWNER',
      membership: 'forged',
      permissions: ['formalites.manage'],
    };
    infrastructure.cookieGet.mockImplementation((name: string) => ({
      value:
        name === 'yuta_backoffice_session'
          ? 'synthetic-token'
          : JSON.stringify(claims),
    }));
    infrastructure.headers.mockReturnValue(
      new Headers({ 'x-tenant': JSON.stringify(claims) }),
    );
    const hint = `${returnTo}?${new URLSearchParams({ claims: JSON.stringify(claims) })}`;
    const result = await requireFormalitesTenant(operation, hint);
    expect(result.tenant.organizationId).toBe('org-a');
    expect(result.tenant.establishmentId).toBe('est-a');
    expect(infrastructure.headers).not.toHaveBeenCalled();
    expect(infrastructure.cookieGet).toHaveBeenCalledExactlyOnceWith(
      'yuta_backoffice_session',
    );
    expect(infrastructure.metadata).toHaveBeenCalledWith(
      infrastructure.database,
      { organizationId: 'org-a', establishmentId: 'est-a' },
    );
    expect(infrastructure.membership).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-a',
        organizationId: 'org-a',
        establishmentId: 'est-a',
      }),
    );
    infrastructure.membership.mockResolvedValue(membership({ role: 'STAFF' }));
    await expect(
      requireFormalitesTenant(operation, hint),
    ).rejects.toMatchObject({ statusCode: 403 });
  });
});

describe('composition independence and recovery', () => {
  it('forwards each operation without reusing another operation result', async () => {
    vi.mocked(permissions.requireFormalitesPermission).mockImplementation(
      (_context, operation) => {
        if (operation === 'formalites.manage')
          throw new TenantError(
            'Permission denied.',
            'CROSS_TENANT_ACCESS_DENIED',
            403,
          );
      },
    );
    await expect(
      requireFormalitesTenant('formalites.read'),
    ).resolves.toHaveProperty('tenant');
    await expect(
      requireFormalitesTenant('formalites.manage'),
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(permissions.requireFormalitesPermission).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      'formalites.read',
    );
    expect(permissions.requireFormalitesPermission).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      'formalites.manage',
    );
  });

  it('does not inherit Personnel allow or call Personnel authorization', async () => {
    const hasPersonnel = vi
      .spyOn(permissions, 'hasPersonnelPermission')
      .mockReturnValue(true);
    const requirePersonnel = vi
      .spyOn(permissions, 'requirePersonnelPermission')
      .mockImplementation(() => undefined);
    infrastructure.membership.mockResolvedValue(membership({ role: 'STAFF' }));
    for (const operation of operations)
      await expect(requireFormalitesTenant(operation)).rejects.toMatchObject({
        statusCode: 403,
      });
    expect(hasPersonnel).not.toHaveBeenCalled();
    expect(requirePersonnel).not.toHaveBeenCalled();
  });

  it('preserves safeReturnTo sanitization', async () => {
    infrastructure.findSession.mockResolvedValue(null);
    await expect(
      requireFormalitesTenant('formalites.read', '//evil.example'),
    ).rejects.toThrow('REDIRECT:/connexion?returnTo=%2Faujourdhui');
  });

  it('propagates infrastructure failure instead of returning authorized context', async () => {
    const failure = new Error('synthetic repository failure');
    infrastructure.membership.mockRejectedValue(failure);
    await expect(requireFormalitesTenant('formalites.read')).rejects.toBe(
      failure,
    );
    expect(permissions.requireFormalitesPermission).not.toHaveBeenCalled();
  });
});
