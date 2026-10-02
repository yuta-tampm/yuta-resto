import { describe, expect, it, vi } from 'vitest';
import {
  DisabledUserError,
  FORMALITES_TEMPLATE_SYSTEM_OPERATIONS,
  FORMALITES_TEMPLATE_SYSTEM_ROLE_GRANTS,
  ForbiddenError,
  GLOBAL_YUTA_FORMALITES_TEMPLATES_SCOPE,
  UnauthenticatedError,
  createAuthService,
  hasFormalitesTemplateSystemOperation,
  isFormalitesTemplateSystemOperation,
  type AuthSecurityLogger,
  type AuthenticatedIdentity,
  type InternalUserRecord,
} from '../src';

const identity: AuthenticatedIdentity = {
  providerUserId: 'provider-user-1',
  email: 'admin@example.test',
};

const activeAdmin: InternalUserRecord = {
  id: '11111111-1111-4111-8111-111111111111',
  email: identity.email,
  displayName: 'YUTA Admin',
  status: 'ACTIVE',
  systemRole: 'YUTA_ADMIN',
};

function createLogger() {
  const warn = vi.fn<AuthSecurityLogger['warn']>();
  return { logger: { warn }, warn };
}

function createService(
  user: InternalUserRecord | null = activeAdmin,
  logger?: AuthSecurityLogger,
) {
  return createAuthService(
    { getIdentity: async () => identity },
    { findByAuthProviderId: async () => user },
    logger,
  );
}

describe('Formalités template system authorization policy', () => {
  it('defines exactly the five approved independent operations', () => {
    expect(FORMALITES_TEMPLATE_SYSTEM_OPERATIONS).toEqual([
      'formalites.template.read',
      'formalites.template.draft.manage',
      'formalites.template.review.submit',
      'formalites.template.publish',
      'formalites.template.retire',
    ]);
    expect(new Set(FORMALITES_TEMPLATE_SYSTEM_OPERATIONS).size).toBe(5);

    for (const operation of FORMALITES_TEMPLATE_SYSTEM_OPERATIONS) {
      expect(isFormalitesTemplateSystemOperation(operation)).toBe(true);
    }
    expect(isFormalitesTemplateSystemOperation('formalites.template')).toBe(
      false,
    );
    expect(isFormalitesTemplateSystemOperation('formalites.template.*')).toBe(
      false,
    );
    expect(
      isFormalitesTemplateSystemOperation('formalites.template.publish.child'),
    ).toBe(false);
  });

  it('uses an exhaustive explicit grant map without role inheritance', () => {
    expect(FORMALITES_TEMPLATE_SYSTEM_ROLE_GRANTS).toEqual({
      YUTA_ADMIN: FORMALITES_TEMPLATE_SYSTEM_OPERATIONS,
      YUTA_SUPPORT: [],
    });

    for (const operation of FORMALITES_TEMPLATE_SYSTEM_OPERATIONS) {
      expect(
        hasFormalitesTemplateSystemOperation('YUTA_ADMIN', operation),
      ).toBe(true);
      expect(
        hasFormalitesTemplateSystemOperation('YUTA_SUPPORT', operation),
      ).toBe(false);
      expect(hasFormalitesTemplateSystemOperation(null, operation)).toBe(false);
    }
  });

  it.each(FORMALITES_TEMPLATE_SYSTEM_OPERATIONS)(
    'allows YUTA_ADMIN for only the exact requested operation %s',
    async (operation) => {
      const { logger, warn } = createLogger();
      const result = await createService(
        activeAdmin,
        logger,
      ).requireFormalitesTemplateSystemOperation(operation);

      expect(result).toEqual({
        actorUserId: activeAdmin.id,
        systemRole: 'YUTA_ADMIN',
        operation,
        resourceScope: GLOBAL_YUTA_FORMALITES_TEMPLATES_SCOPE,
      });
      expect(Object.keys(result).sort()).toEqual([
        'actorUserId',
        'operation',
        'resourceScope',
        'systemRole',
      ]);
      expect(result).not.toHaveProperty('organizationId');
      expect(result).not.toHaveProperty('establishmentId');
      expect(result).not.toHaveProperty('membership');
      expect(result).not.toHaveProperty('template');
      expect(warn).not.toHaveBeenCalled();
    },
  );

  it.each(FORMALITES_TEMPLATE_SYSTEM_OPERATIONS)(
    'denies YUTA_SUPPORT for operation %s even with membership-like data',
    async (operation) => {
      const { logger, warn } = createLogger();
      const supportWithMembership = {
        ...activeAdmin,
        systemRole: 'YUTA_SUPPORT',
        membershipRole: 'OWNER',
        organizationId: 'organization-from-untrusted-context',
        establishmentId: 'establishment-from-untrusted-context',
      } as const satisfies InternalUserRecord & {
        membershipRole: 'OWNER';
        organizationId: string;
        establishmentId: string;
      };

      await expect(
        createService(
          supportWithMembership,
          logger,
        ).requireFormalitesTemplateSystemOperation(operation),
      ).rejects.toBeInstanceOf(ForbiddenError);
      expect(warn).toHaveBeenCalledWith({
        event: 'auth.formalites_template_system_operation_denied',
        userId: activeAdmin.id,
        reason: 'role_not_allowed',
        operation,
      });
    },
  );

  it('denies a user without a system role and ignores membership-like data', async () => {
    const { logger, warn } = createLogger();
    const restaurantOwnerOnly = {
      ...activeAdmin,
      systemRole: null,
      membershipRole: 'OWNER',
    } as const satisfies InternalUserRecord & { membershipRole: 'OWNER' };

    await expect(
      createService(
        restaurantOwnerOnly,
        logger,
      ).requireFormalitesTemplateSystemOperation('formalites.template.read'),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(warn).toHaveBeenCalledWith({
      event: 'auth.formalites_template_system_operation_denied',
      userId: activeAdmin.id,
      reason: 'role_not_allowed',
      operation: 'formalites.template.read',
    });
  });

  it('denies a missing external identity before evaluating the operation', async () => {
    const { logger, warn } = createLogger();
    const service = createAuthService(
      { getIdentity: async () => null },
      { findByAuthProviderId: async () => activeAdmin },
      logger,
    );

    await expect(
      service.requireFormalitesTemplateSystemOperation(
        'formalites.template.read',
      ),
    ).rejects.toBeInstanceOf(UnauthenticatedError);
    expect(warn).toHaveBeenCalledWith({
      event: 'auth.formalites_template_system_operation_denied',
      reason: 'unauthenticated',
      operation: 'formalites.template.read',
    });
  });

  it('denies an unknown internal user without inventing actor attribution', async () => {
    const { logger, warn } = createLogger();

    await expect(
      createService(null, logger).requireFormalitesTemplateSystemOperation(
        'formalites.template.read',
      ),
    ).rejects.toBeInstanceOf(UnauthenticatedError);
    expect(warn).toHaveBeenCalledWith({
      event: 'auth.formalites_template_system_operation_denied',
      reason: 'user_not_found',
      operation: 'formalites.template.read',
    });
  });

  it('denies a disabled YUTA_ADMIN with resolved actor attribution', async () => {
    const { logger, warn } = createLogger();

    await expect(
      createService(
        { ...activeAdmin, status: 'DISABLED' },
        logger,
      ).requireFormalitesTemplateSystemOperation('formalites.template.publish'),
    ).rejects.toBeInstanceOf(DisabledUserError);
    expect(warn).toHaveBeenCalledWith({
      event: 'auth.formalites_template_system_operation_denied',
      userId: activeAdmin.id,
      reason: 'disabled',
      operation: 'formalites.template.publish',
    });
  });

  it.each([
    'formalites.template',
    'formalites.template.publish.child',
    'formalites.template.delete',
  ])(
    'denies the unsupported safe operation %s without prefix matching',
    async (operation) => {
      const { logger, warn } = createLogger();

      await expect(
        createService(
          activeAdmin,
          logger,
        ).requireFormalitesTemplateSystemOperation(operation),
      ).rejects.toBeInstanceOf(ForbiddenError);
      expect(warn).toHaveBeenCalledWith({
        event: 'auth.formalites_template_system_operation_denied',
        userId: activeAdmin.id,
        reason: 'operation_not_allowed',
        operation,
      });
    },
  );

  it.each([
    undefined,
    null,
    42,
    {},
    'formalites.template.*',
    'FORMALITES TEMPLATE PUBLISH',
    `formalites.template.${'x'.repeat(101)}`,
  ])(
    'denies malformed operation input without logging its payload',
    async (operation) => {
      const { logger, warn } = createLogger();

      await expect(
        createService(
          activeAdmin,
          logger,
        ).requireFormalitesTemplateSystemOperation(operation),
      ).rejects.toBeInstanceOf(ForbiddenError);
      expect(warn).toHaveBeenCalledWith({
        event: 'auth.formalites_template_system_operation_denied',
        userId: activeAdmin.id,
        reason: 'operation_not_allowed',
        operation: 'invalid',
      });
    },
  );

  it('preserves existing auth behavior after shared user resolution refactor', async () => {
    const service = createService();

    await expect(service.getCurrentUser()).resolves.toEqual({
      id: activeAdmin.id,
      email: activeAdmin.email,
      displayName: activeAdmin.displayName,
      systemRole: activeAdmin.systemRole,
    });
    await expect(service.requireUser()).resolves.toMatchObject({
      id: activeAdmin.id,
    });
    await expect(
      service.requireSystemRole(['YUTA_ADMIN']),
    ).resolves.toMatchObject({ id: activeAdmin.id, systemRole: 'YUTA_ADMIN' });
  });

  it('preserves existing not-found and disabled security events', async () => {
    const notFound = createLogger();
    await expect(
      createService(null, notFound.logger).getCurrentUser(),
    ).resolves.toBeNull();
    expect(notFound.warn).toHaveBeenCalledWith({
      event: 'auth.user_resolution_failed',
      reason: 'not_found',
    });

    const disabled = createLogger();
    await expect(
      createService(
        { ...activeAdmin, status: 'DISABLED' },
        disabled.logger,
      ).getCurrentUser(),
    ).rejects.toBeInstanceOf(DisabledUserError);
    expect(disabled.warn).toHaveBeenCalledWith({
      event: 'auth.disabled_user_denied',
      userId: activeAdmin.id,
      reason: 'disabled',
    });
  });

  it('has no authorization side effect beyond identity and user resolution', async () => {
    const getIdentity = vi.fn(async () => identity);
    const findByAuthProviderId = vi.fn(async () => activeAdmin);
    const { logger, warn } = createLogger();
    const service = createAuthService(
      { getIdentity },
      { findByAuthProviderId },
      logger,
    );

    await expect(
      service.requireFormalitesTemplateSystemOperation(
        'formalites.template.retire',
      ),
    ).resolves.toMatchObject({
      operation: 'formalites.template.retire',
    });
    expect(getIdentity).toHaveBeenCalledTimes(1);
    expect(findByAuthProviderId).toHaveBeenCalledExactlyOnceWith(
      identity.providerUserId,
    );
    expect(warn).not.toHaveBeenCalled();
  });
});
