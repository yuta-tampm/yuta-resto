import type { SystemRole, UserStatus } from '@yuta/contracts/tenant-foundation';
import {
  GLOBAL_YUTA_FORMALITES_TEMPLATES_SCOPE,
  hasFormalitesTemplateSystemOperation,
  isFormalitesTemplateSystemOperation,
  type FormalitesTemplateSystemAuthorizationContext,
} from './formalites-template-system-authorization';

export type AuthenticatedIdentity = Readonly<{
  providerUserId: string;
  email: string;
  displayName?: string | null;
}>;

export interface AuthAdapter {
  getIdentity(): Promise<AuthenticatedIdentity | null>;
}

export type SessionUser = Readonly<{
  id: string;
  email: string;
  displayName: string | null;
  systemRole: SystemRole | null;
}>;

export type InternalUserRecord = SessionUser &
  Readonly<{
    status: UserStatus;
  }>;

export interface InternalUserLookupPort {
  findByAuthProviderId(
    authProviderId: string,
  ): Promise<InternalUserRecord | null>;
}

export interface AuthSecurityLogger {
  warn(event: {
    event: string;
    userId?: string;
    reason: string;
    operation?: string;
  }): void;
}

export class UnauthenticatedError extends Error {
  constructor(message = 'Authentication is required.') {
    super(message);
    this.name = 'UnauthenticatedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Access is forbidden.') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class DisabledUserError extends ForbiddenError {
  constructor() {
    super('The authenticated user is disabled.');
    this.name = 'DisabledUserError';
  }
}

export function createAuthService(
  adapter: AuthAdapter,
  userLookup: InternalUserLookupPort,
  logger?: AuthSecurityLogger,
) {
  type CurrentUserResolution =
    | Readonly<{ status: 'unauthenticated' }>
    | Readonly<{ status: 'user_not_found' }>
    | Readonly<{ status: 'disabled'; userId: string }>
    | Readonly<{ status: 'active'; user: SessionUser }>;

  async function resolveCurrentUser(): Promise<CurrentUserResolution> {
    const identity = await adapter.getIdentity();
    if (!identity) return { status: 'unauthenticated' };

    const user = await userLookup.findByAuthProviderId(identity.providerUserId);
    if (!user) return { status: 'user_not_found' };
    if (user.status === 'DISABLED') {
      return { status: 'disabled', userId: user.id };
    }

    return {
      status: 'active',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        systemRole: user.systemRole,
      },
    };
  }

  async function getCurrentUser(): Promise<SessionUser | null> {
    const resolution = await resolveCurrentUser();
    if (resolution.status === 'unauthenticated') return null;
    if (resolution.status === 'user_not_found') {
      logger?.warn({
        event: 'auth.user_resolution_failed',
        reason: 'not_found',
      });
      return null;
    }
    if (resolution.status === 'disabled') {
      logger?.warn({
        event: 'auth.disabled_user_denied',
        userId: resolution.userId,
        reason: 'disabled',
      });
      throw new DisabledUserError();
    }

    return resolution.user;
  }

  async function requireUser(): Promise<SessionUser> {
    const user = await getCurrentUser();
    if (!user) throw new UnauthenticatedError();
    return user;
  }

  async function requireSystemRole(
    allowedRoles: readonly SystemRole[],
  ): Promise<SessionUser> {
    const user = await requireUser();
    if (!user.systemRole || !allowedRoles.includes(user.systemRole)) {
      logger?.warn({
        event: 'auth.system_role_denied',
        userId: user.id,
        reason: 'role_not_allowed',
      });
      throw new ForbiddenError('The required system role is missing.');
    }
    return user;
  }

  const safeOperationPattern = /^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/;
  const maximumAuditedOperationLength = 100;

  function normalizeAuditedOperation(rawOperation: unknown): string {
    if (
      typeof rawOperation === 'string' &&
      rawOperation.length <= maximumAuditedOperationLength &&
      safeOperationPattern.test(rawOperation)
    ) {
      return rawOperation;
    }
    return 'invalid';
  }

  function logFormalitesTemplateDenial(
    reason:
      | 'unauthenticated'
      | 'user_not_found'
      | 'disabled'
      | 'operation_not_allowed'
      | 'role_not_allowed',
    rawOperation: unknown,
    userId?: string,
  ): void {
    logger?.warn({
      event: 'auth.formalites_template_system_operation_denied',
      ...(userId ? { userId } : {}),
      reason,
      operation: normalizeAuditedOperation(rawOperation),
    });
  }

  async function requireFormalitesTemplateSystemOperation(
    rawOperation: unknown,
  ): Promise<FormalitesTemplateSystemAuthorizationContext> {
    const resolution = await resolveCurrentUser();

    if (resolution.status === 'unauthenticated') {
      logFormalitesTemplateDenial('unauthenticated', rawOperation);
      throw new UnauthenticatedError();
    }
    if (resolution.status === 'user_not_found') {
      logFormalitesTemplateDenial('user_not_found', rawOperation);
      throw new UnauthenticatedError();
    }
    if (resolution.status === 'disabled') {
      logFormalitesTemplateDenial('disabled', rawOperation, resolution.userId);
      throw new DisabledUserError();
    }

    const { user } = resolution;
    if (!isFormalitesTemplateSystemOperation(rawOperation)) {
      logFormalitesTemplateDenial(
        'operation_not_allowed',
        rawOperation,
        user.id,
      );
      throw new ForbiddenError(
        'The requested system operation is not allowed.',
      );
    }
    if (!hasFormalitesTemplateSystemOperation(user.systemRole, rawOperation)) {
      logFormalitesTemplateDenial('role_not_allowed', rawOperation, user.id);
      throw new ForbiddenError('The required system operation is missing.');
    }

    return {
      actorUserId: user.id,
      systemRole: user.systemRole,
      operation: rawOperation,
      resourceScope: GLOBAL_YUTA_FORMALITES_TEMPLATES_SCOPE,
    };
  }

  return {
    getCurrentUser,
    requireUser,
    requireSystemRole,
    requireFormalitesTemplateSystemOperation,
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
