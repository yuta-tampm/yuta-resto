import { randomUUID } from 'node:crypto';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  hasAccessAuditPermission,
  requireAccessAuditPermission,
} from '../src/server/auth/access-audit-permissions';

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

describe('access audit permissions', () => {
  it('allows owners to read access history', () => {
    expect(hasAccessAuditPermission(context('OWNER'))).toBe(true);
    expect(() => requireAccessAuditPermission(context('OWNER'))).not.toThrow();
  });

  it.each(['MANAGER', 'STAFF'] as const)('denies %s', (role) => {
    expect(hasAccessAuditPermission(context(role))).toBe(false);
    expect(() => requireAccessAuditPermission(context(role))).toThrow(
      'Permission denied.',
    );
  });
});
