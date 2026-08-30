import { randomUUID } from 'node:crypto';
import type { TenantActor, TenantContext, TenantRole } from '@yuta/tenant';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  hasEstablishmentPermission,
  hasRestaurantKnowledgePermission,
  requireRestaurantKnowledgePermission,
  type RestaurantKnowledgePermission,
} from '../src/server/auth/permissions';

const permissions = [
  'restaurant-knowledge.read',
  'restaurant-knowledge.manage',
] as const satisfies readonly RestaurantKnowledgePermission[];

function context(role: TenantRole): TenantContext {
  return {
    organizationId: randomUUID(),
    establishmentId: randomUUID(),
    actor: {
      type: 'user',
      userId: randomUUID(),
      membershipId: randomUUID(),
      role,
    },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set(),
  };
}

function actorContext(actor: TenantActor): TenantContext {
  return { ...context('OWNER'), actor };
}

describe('restaurant knowledge permissions', () => {
  it.each(['OWNER', 'MANAGER'] as const)(
    'grants READ and MANAGE independently to %s',
    (role) => {
      for (const permission of permissions) {
        expect(
          hasRestaurantKnowledgePermission(context(role), permission),
        ).toBe(true);
        expect(() =>
          requireRestaurantKnowledgePermission(context(role), permission),
        ).not.toThrow();
      }
    },
  );

  it('keeps READ and MANAGE as separate typed operations', () => {
    expect(permissions).toEqual([
      'restaurant-knowledge.read',
      'restaurant-knowledge.manage',
    ]);
    expect(permissions[0]).not.toBe(permissions[1]);
  });

  it('denies STAFF for both operations without inheriting profile read access', () => {
    const staffContext = context('STAFF');

    expect(
      hasEstablishmentPermission(staffContext, 'establishment.profile.read'),
    ).toBe(true);

    for (const permission of permissions) {
      expect(hasRestaurantKnowledgePermission(staffContext, permission)).toBe(
        false,
      );
      expect(() =>
        requireRestaurantKnowledgePermission(staffContext, permission),
      ).toThrow('Permission denied.');
    }
  });

  it.each([
    { type: 'public' as const },
    { type: 'service' as const, serviceName: 'test-service' },
  ])('denies the $type actor for both operations', (actor) => {
    for (const permission of permissions) {
      expect(
        hasRestaurantKnowledgePermission(actorContext(actor), permission),
      ).toBe(false);
      expect(() =>
        requireRestaurantKnowledgePermission(actorContext(actor), permission),
      ).toThrow('Permission denied.');
    }
  });

  it.each(['YUTA_ADMIN', 'YUTA_SUPPORT'] as const)(
    'does not let %s bypass the active membership role',
    (systemRole) => {
      const systemActorWithStaffMembership = {
        ...context('STAFF'),
        systemRole,
      };

      for (const permission of permissions) {
        expect(
          hasRestaurantKnowledgePermission(
            systemActorWithStaffMembership,
            permission,
          ),
        ).toBe(false);
        expect(() =>
          requireRestaurantKnowledgePermission(
            systemActorWithStaffMembership,
            permission,
          ),
        ).toThrow('Permission denied.');
      }
    },
  );
});
