import { randomUUID } from 'node:crypto';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  hasPersonnelPermission,
  requirePersonnelPermission,
} from '../src/server/auth/permissions';

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

describe('personnel permissions', () => {
  it('allows only owners to read and manage employee dossiers', () => {
    for (const permission of [
      'personnel.employee.read',
      'personnel.employee.manage',
      'personnel.document.read',
      'personnel.document.manage',
      'personnel.document.extract',
      'personnel.register.read',
      'personnel.register.export',
    ] as const) {
      expect(hasPersonnelPermission(context('OWNER'), permission)).toBe(true);
      expect(hasPersonnelPermission(context('MANAGER'), permission)).toBe(
        false,
      );
      expect(hasPersonnelPermission(context('STAFF'), permission)).toBe(false);
      expect(() =>
        requirePersonnelPermission(context('MANAGER'), permission),
      ).toThrow('Permission denied.');
    }
  });

  it('denies public and service actors', () => {
    const ownerContext = context('OWNER');
    for (const actor of [
      { type: 'public' as const },
      { type: 'service' as const, serviceName: 'test-service' },
    ]) {
      const actorContext = { ...ownerContext, actor };
      expect(
        hasPersonnelPermission(actorContext, 'personnel.employee.read'),
      ).toBe(false);
      expect(() =>
        requirePersonnelPermission(actorContext, 'personnel.employee.read'),
      ).toThrow('Permission denied.');
    }
  });
});
