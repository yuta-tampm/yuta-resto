import type { AuthenticatedSession } from '@yuta/auth';
import type { MembershipLookupPort, MembershipRecord } from '@yuta/tenant';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
  cloudDatabase: Object.freeze({ testBoundary: 'tenant-access-helpers' }),
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

import AuthenticatedLayout from '../src/app/(authenticated)/layout';
import {
  requireBookingTenant,
  requirePersonnelTenant,
  requireReputationTenant,
  requireUserManagementTenant,
} from '../src/server/auth/session';

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
  infrastructure.findSession.mockResolvedValue(session());
  infrastructure.membership.mockResolvedValue(membership());
  infrastructure.metadata.mockResolvedValue({
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: ['booking.enabled', 'reputation.enabled'],
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('requireBookingTenant', () => {
  it('returns a context narrowed to a concrete establishment', async () => {
    const { tenant, session: current } = await requireBookingTenant();

    const establishmentId: string = tenant.establishmentId;
    expect(establishmentId).toBe('est-a');
    expect(current.userId).toBe('user-a');
  });

  it('requires the booking entitlement', async () => {
    infrastructure.metadata.mockResolvedValue({
      locale: 'fr-FR',
      timezone: 'Europe/Paris',
      entitlements: ['reputation.enabled'],
    });

    await expect(requireBookingTenant()).rejects.toMatchObject({
      code: 'FEATURE_NOT_ENABLED',
    });
  });

  it('checks page availability before touching the database in Release A', async () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'release-a');

    await expect(requireBookingTenant()).rejects.toThrow(
      'REDIRECT:/aujourdhui?exposure=unavailable',
    );
    expect(infrastructure.metadata).not.toHaveBeenCalled();
  });

  it('lets STAFF read bookings, which booking.read grants', async () => {
    infrastructure.membership.mockResolvedValue(membership({ role: 'STAFF' }));

    await expect(requireBookingTenant()).resolves.toMatchObject({
      tenant: { establishmentId: 'est-a' },
    });
  });
});

describe('requirePersonnelTenant', () => {
  it('allows an OWNER with a concrete establishment', async () => {
    const { tenant } = await requirePersonnelTenant();

    const establishmentId: string = tenant.establishmentId;
    expect(establishmentId).toBe('est-a');
  });

  it.each(['MANAGER', 'STAFF'] as const)(
    'denies %s with the standard permission error, never a redirect',
    async (role) => {
      infrastructure.membership.mockResolvedValue(membership({ role }));

      await expect(requirePersonnelTenant()).rejects.toMatchObject({
        code: 'CROSS_TENANT_ACCESS_DENIED',
        statusCode: 403,
      });
    },
  );

  it('checks page availability before touching the database in Release A', async () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'release-a');

    await expect(requirePersonnelTenant()).rejects.toThrow(
      'REDIRECT:/aujourdhui?exposure=unavailable',
    );
    expect(infrastructure.metadata).not.toHaveBeenCalled();
  });
});

describe('authenticated layout capability props', () => {
  async function layoutProps(role: MembershipRecord['role']) {
    infrastructure.membership.mockResolvedValue(membership({ role }));
    const element = await AuthenticatedLayout({ children: null });
    return (
      element as {
        props: {
          canManageGoogleConnector: boolean;
          canManageUsers: boolean;
          canReadPersonnel: boolean;
          canManageBookingSettings: boolean;
          bookingEnabled: boolean;
          reputationEnabled: boolean;
        };
      }
    ).props;
  }

  it.each([
    ['OWNER', true, true, true, true],
    ['MANAGER', false, true, false, true],
    ['STAFF', false, false, false, false],
  ] as const)(
    '%s: connector=%s users=%s personnel=%s bookingSettings=%s',
    async (role, connector, users, personnel, bookingSettings) => {
      const props = await layoutProps(role);

      expect(props.canManageGoogleConnector).toBe(connector);
      expect(props.canManageUsers).toBe(users);
      expect(props.canReadPersonnel).toBe(personnel);
      expect(props.canManageBookingSettings).toBe(bookingSettings);
    },
  );

  it('keeps entitlements separate from role capabilities', async () => {
    const props = await layoutProps('OWNER');

    expect(props.bookingEnabled).toBe(true);
    expect(props.reputationEnabled).toBe(true);
  });
});

describe('Release A restricted recovery', () => {
  beforeEach(() => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'release-a');
  });

  it('redirects a STAFF user from user management', async () => {
    infrastructure.membership.mockResolvedValue(membership({ role: 'STAFF' }));

    await expect(requireUserManagementTenant()).rejects.toThrow(
      'REDIRECT:/aujourdhui?exposure=restricted',
    );
  });

  it('allows a MANAGER into user management', async () => {
    infrastructure.membership.mockResolvedValue(
      membership({ role: 'MANAGER' }),
    );

    await expect(requireUserManagementTenant()).resolves.toMatchObject({
      tenant: { actor: { role: 'MANAGER' } },
    });
  });

  it('redirects a missing reputation entitlement', async () => {
    infrastructure.metadata.mockResolvedValue({
      locale: 'fr-FR',
      timezone: 'Europe/Paris',
      entitlements: [],
    });

    await expect(requireReputationTenant()).rejects.toThrow(
      'REDIRECT:/aujourdhui?exposure=restricted',
    );
  });

  it('propagates a membership lookup failure unchanged', async () => {
    infrastructure.membership.mockRejectedValue(new Error('lookup failed'));

    await expect(requireUserManagementTenant()).rejects.toThrow(
      'lookup failed',
    );
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
