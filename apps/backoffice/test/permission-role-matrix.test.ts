import type { TenantContext, TenantRole } from '@yuta/tenant';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  hasBookingPermission,
  hasPersonnelPermission,
  hasReputationPermission,
  hasUserManagementPermission,
  requireReputationPermission,
  requireUserManagementPermission,
  type BookingPermission,
  type PersonnelPermission,
  type ReputationPermission,
  type UserManagementPermission,
} from '../src/server/auth/permissions';

function userContext(role: TenantRole): TenantContext {
  return {
    organizationId: 'org-a',
    establishmentId: 'est-a',
    actor: {
      type: 'user',
      userId: 'user-a',
      role,
      membershipId: 'member-a',
    },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set<string>(),
  };
}

const nonUserActors: TenantContext['actor'][] = [
  { type: 'public' },
  { type: 'service', serviceName: 'synthetic-service' },
];

function withActor(actor: TenantContext['actor']): TenantContext {
  return { ...userContext('OWNER'), actor };
}

// These grants replaced inline `role === '…'` checks in the layout, Today,
// Reviews, Satisfaction, Release A setup and user management. Pinning them keeps
// each former literal visible and reviewable in one table.
const reputationGrants: ReadonlyArray<
  readonly [ReputationPermission, readonly TenantRole[]]
> = [
  ['reputation.connector.manage', ['OWNER']],
  ['reputation.settings.manage', ['OWNER']],
  ['reputation.google.retrieve', ['OWNER', 'MANAGER']],
  ['reputation.feedback.manage', ['OWNER', 'MANAGER']],
  ['reputation.reply.create', ['OWNER', 'MANAGER', 'STAFF']],
  ['reputation.note.create', ['OWNER', 'MANAGER', 'STAFF']],
];
const allRoles: readonly TenantRole[] = ['OWNER', 'MANAGER', 'STAFF'];

describe('reputation permission matrix', () => {
  it.each(reputationGrants)('grants %s to exactly %j', (permission, roles) => {
    for (const role of allRoles) {
      expect(hasReputationPermission(userContext(role), permission)).toBe(
        roles.includes(role),
      );
    }
  });

  it.each(reputationGrants)('denies %s to non-user actors', (permission) => {
    for (const actor of nonUserActors) {
      expect(hasReputationPermission(withActor(actor), permission)).toBe(false);
    }
  });

  it('keeps require and has consistent for every role', () => {
    for (const [permission] of reputationGrants) {
      for (const role of allRoles) {
        const context = userContext(role);
        if (hasReputationPermission(context, permission)) {
          expect(() =>
            requireReputationPermission(context, permission),
          ).not.toThrow();
        } else {
          expect(() =>
            requireReputationPermission(context, permission),
          ).toThrowError(
            expect.objectContaining({
              code: 'CROSS_TENANT_ACCESS_DENIED',
              statusCode: 403,
            }),
          );
        }
      }
    }
  });
});

describe('user management permission', () => {
  const permission: UserManagementPermission = 'users.access.manage';

  it('grants OWNER and MANAGER only', () => {
    expect(hasUserManagementPermission(userContext('OWNER'), permission)).toBe(
      true,
    );
    expect(
      hasUserManagementPermission(userContext('MANAGER'), permission),
    ).toBe(true);
    expect(hasUserManagementPermission(userContext('STAFF'), permission)).toBe(
      false,
    );
  });

  it('denies non-user actors', () => {
    for (const actor of nonUserActors) {
      expect(hasUserManagementPermission(withActor(actor), permission)).toBe(
        false,
      );
    }
  });

  it('throws the standard 403 tenant error when denied', () => {
    expect(() =>
      requireUserManagementPermission(userContext('STAFF'), permission),
    ).toThrowError(
      expect.objectContaining({
        code: 'CROSS_TENANT_ACCESS_DENIED',
        statusCode: 403,
      }),
    );
    expect(() =>
      requireUserManagementPermission(userContext('MANAGER'), permission),
    ).not.toThrow();
  });
});

describe('layout capability grants', () => {
  const booking: BookingPermission = 'booking.settings.manage';
  const personnel: PersonnelPermission = 'personnel.employee.read';

  it.each([
    ['OWNER', true, true],
    ['MANAGER', true, false],
    ['STAFF', false, false],
  ] as const)(
    '%s: booking settings=%s, personnel read=%s',
    (role, bookingGrant, personnelGrant) => {
      expect(hasBookingPermission(userContext(role), booking)).toBe(
        bookingGrant,
      );
      expect(hasPersonnelPermission(userContext(role), personnel)).toBe(
        personnelGrant,
      );
    },
  );
});
