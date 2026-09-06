import { readFileSync } from 'node:fs';
import { TenantError, type TenantContext, type TenantRole } from '@yuta/tenant';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  hasFormalitesPermission,
  requireFormalitesPermission,
  type FormalitesPermission,
} from '../src/server/auth/permissions';

const operations = ['formalites.read', 'formalites.manage'] as const;

function context(role: TenantRole = 'OWNER'): TenantContext {
  return {
    organizationId: 'synthetic-organization',
    establishmentId: 'synthetic-establishment',
    actor: { type: 'user', userId: 'user', membershipId: 'membership', role },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set(),
  };
}

function expectDenial(
  tenant: TenantContext,
  operation: FormalitesPermission,
  missingScope = false,
) {
  expect(hasFormalitesPermission(tenant, operation)).toBe(false);
  let caught: unknown;
  try {
    requireFormalitesPermission(tenant, operation);
  } catch (error: unknown) {
    caught = error;
  }
  expect(caught).toBeInstanceOf(TenantError);
  expect(caught).toMatchObject({
    code: missingScope
      ? 'ESTABLISHMENT_REQUIRED'
      : 'CROSS_TENANT_ACCESS_DENIED',
    statusCode: missingScope ? 400 : 403,
    message: missingScope
      ? 'An establishment is required.'
      : 'Permission denied.',
  });
}

describe.each(operations)('%s', (operation) => {
  it('allows OWNER independently', () => {
    expect(hasFormalitesPermission(context(), operation)).toBe(true);
    expect(() =>
      requireFormalitesPermission(context(), operation),
    ).not.toThrow();
  });

  it.each(['MANAGER', 'STAFF'] as const)(
    'denies %s with exact error',
    (role) => {
      expectDenial(context(role), operation);
    },
  );

  it.each([
    { type: 'public' as const },
    { type: 'service' as const, serviceName: 'synthetic-service' },
  ])('denies $type with exact error', (actor) => {
    expectDenial({ ...context(), actor }, operation);
  });

  it.each(['YUTA_ADMIN', 'YUTA_SUPPORT'])(
    'does not elevate %s',
    (systemRole) => {
      for (const role of ['MANAGER', 'STAFF'] as const) {
        const tenant = context(role);
        const tenantWithSystemRole = {
          ...tenant,
          actor: { ...tenant.actor, systemRole },
        };
        expectDenial(tenantWithSystemRole, operation);
      }
    },
  );

  it.each([null, ''])(
    'returns false/400 for missing establishment %s',
    (establishmentId) => {
      expectDenial({ ...context(), establishmentId }, operation, true);
    },
  );
});

describe('Formalites operation and Personnel isolation', () => {
  it('has exactly two typed operations', () => {
    expectTypeOf<FormalitesPermission>().toEqualTypeOf<
      (typeof operations)[number]
    >();
  });

  it.each([
    'unknown',
    'personnel.employee.manage',
    'toString',
    '__proto__',
    'constructor',
  ])('fails closed for runtime operation %s', (operation) => {
    expectDenial(context(), operation as FormalitesPermission);
  });

  it('keeps independent literal grants and no Personnel delegation in Formalites blocks', () => {
    const source = readFileSync(
      new URL('../src/server/auth/permissions.ts', import.meta.url),
      'utf8',
    );
    const additions = source.slice(
      source.indexOf('export type FormalitesPermission'),
      source.indexOf('export type ReputationPermission'),
    );
    expect(additions).toContain("'formalites.read': ['OWNER']");
    expect(additions).toContain("'formalites.manage': ['OWNER']");
    expect(additions).toContain('formalitesPermissionRoles[permission]');
    expect(additions).not.toMatch(
      /Personnel|personnel\.|restaurantKnowledge|RestaurantKnowledge/,
    );
    const helper = readFileSync(
      new URL('../src/server/auth/formalites.ts', import.meta.url),
      'utf8',
    );
    expect(helper).toContain("import 'server-only'");
    expect(helper).not.toMatch(
      /requirePersonnel|hasPersonnel|personnel\.employee|['"]use server['"]|@yuta\/db|fetch\(/,
    );
    expect(helper.match(/from ['"]([^'"]+)['"]/g)).toEqual([
      "from '@yuta/tenant'",
      "from './permissions'",
      "from './session'",
    ]);
  });
});
