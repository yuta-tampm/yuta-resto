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
});
