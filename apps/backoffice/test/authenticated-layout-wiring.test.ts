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
vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react')>()),
  cache: <T>(callback: T): T => callback,
}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: Object.freeze({ testBoundary: 'authenticated-layout-wiring' }),
}));
vi.mock('@yuta/db-cloud', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@yuta/db-cloud')>()),
  createAuthRepository: () => ({
    findSession: infrastructure.findSession,
    listAvailableTenants: async () => [],
  }),
  createMembershipLookup: () => ({
    findActiveMembership: infrastructure.membership,
  }),
  findAuthenticatedTenantMetadata: infrastructure.metadata,
}));
// Real permission tables, wrapped so each capability flag can be tied to the
// exact permission it asks for. A role grid alone cannot tell two flags apart
// when they share the same grants (for example OWNER and MANAGER only).
vi.mock('../src/server/auth/permissions', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../src/server/auth/permissions')>();
  return {
    ...actual,
    hasBookingPermission: vi.fn(actual.hasBookingPermission),
    hasPersonnelPermission: vi.fn(actual.hasPersonnelPermission),
    hasReputationPermission: vi.fn(actual.hasReputationPermission),
    hasUserManagementPermission: vi.fn(actual.hasUserManagementPermission),
  };
});

import AuthenticatedLayout from '../src/app/(authenticated)/layout';
import * as permissions from '../src/server/auth/permissions';

beforeEach(() => {
  vi.clearAllMocks();
  infrastructure.findSession.mockResolvedValue(session());
  infrastructure.membership.mockResolvedValue(membership());
  infrastructure.metadata.mockResolvedValue({
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: ['booking.enabled', 'reputation.enabled'],
  });
});

describe('authenticated layout capability wiring', () => {
  it('asks each capability flag for its own permission', async () => {
    const element = (await AuthenticatedLayout({ children: null })) as {
      props: Record<string, unknown>;
    };

    expect(permissions.hasReputationPermission).toHaveBeenCalledWith(
      expect.anything(),
      'reputation.connector.manage',
    );
    expect(permissions.hasUserManagementPermission).toHaveBeenCalledWith(
      expect.anything(),
      'users.access.manage',
    );
    expect(permissions.hasPersonnelPermission).toHaveBeenCalledWith(
      expect.anything(),
      'personnel.employee.read',
    );
    expect(permissions.hasBookingPermission).toHaveBeenCalledWith(
      expect.anything(),
      'booking.settings.manage',
    );
    // Exactly one lookup per flag: no flag borrows another flag's permission.
    expect(permissions.hasReputationPermission).toHaveBeenCalledTimes(1);
    expect(permissions.hasUserManagementPermission).toHaveBeenCalledTimes(1);
    expect(permissions.hasPersonnelPermission).toHaveBeenCalledTimes(1);
    expect(permissions.hasBookingPermission).toHaveBeenCalledTimes(1);
    expect(element.props).toMatchObject({
      canManageGoogleConnector: true,
      canManageUsers: true,
      canReadPersonnel: true,
      canManageBookingSettings: true,
    });
  });
});

function session(): AuthenticatedSession {
  return {
    id: 'session-a',
    userId: 'user-a',
    userName: 'Synthetic user',
    userEmail: 'synthetic@example.test',
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
