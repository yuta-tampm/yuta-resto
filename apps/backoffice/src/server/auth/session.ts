import 'server-only';

import { hashRateLimitKey, type AuthenticatedSession } from '@yuta/auth';
import {
  createAuthRepository,
  createMembershipLookup,
  findAuthenticatedTenantMetadata,
} from '@yuta/db-cloud';
import {
  requireEntitlement,
  requireEstablishment,
  requireRole,
  resolveAuthenticatedTenant,
  TenantError,
  type TenantContext,
} from '@yuta/tenant';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { cloudDatabase } from '../cloud-database';
import { safeBackofficeReturnTo } from '../../lib/backoffice-exposure';
import {
  getBackofficeExposureProfile,
  isReleaseAExposure,
  requireBackofficePageAvailable,
} from '../backoffice-exposure';
import {
  requireBookingPermission,
  requirePersonnelPermission,
  requireReputationPermission,
  type ReputationPermission,
} from './permissions';

export const BACKOFFICE_SESSION_COOKIE = 'yuta_backoffice_session';
export const BACKOFFICE_SELECTION_COOKIE = 'yuta_backoffice_selection';

const authRepository = createAuthRepository(cloudDatabase);

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;
  throw new Error(
    'AUTH_SECRET must contain at least 32 characters. For local development, run `pnpm dev:env:sync` to generate one.',
  );
}

export function createLoginRateLimitKey(
  email: string,
  clientAddress: string,
): string {
  return hashRateLimitKey(`${email}|${clientAddress}`, getAuthSecret());
}

export function hashClientAddress(clientAddress: string): string {
  return hashRateLimitKey(clientAddress, getAuthSecret());
}

export const getCurrentSession = cache(
  async (): Promise<AuthenticatedSession | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get(BACKOFFICE_SESSION_COOKIE)?.value;
    if (!token) return null;
    return authRepository.findSession(token);
  },
);

export async function requireBackofficeSession(
  returnTo = '/aujourdhui',
): Promise<AuthenticatedSession> {
  const session = await getCurrentSession();
  if (!session) {
    redirect(
      `/connexion?returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`,
    );
  }
  return session;
}

type TenantResolution =
  | { status: 'resolved'; tenant: TenantContext }
  | { status: 'scope-recovery' };

// React `cache` memoizes only while a server render is active and never across
// requests, so a layout, the page it wraps and any streamed Server Component
// share one metadata and membership lookup per render. Keyed by primitive
// session scope only: caller-specific values such as `returnTo` stay outside
// the cache. Authorization correctness must not depend on memoization.
const resolveSessionTenant = cache(
  async (
    userId: string,
    organizationId: string,
    establishmentId: string,
  ): Promise<TenantResolution> => {
    const metadata = await findAuthenticatedTenantMetadata(cloudDatabase, {
      organizationId,
      establishmentId,
    });
    if (!metadata) return { status: 'scope-recovery' };

    try {
      const tenant = await resolveAuthenticatedTenant({
        userId,
        organizationId,
        establishmentId,
        membershipLookup: createMembershipLookup(cloudDatabase),
        tenantMetadata: metadata,
      });
      return { status: 'resolved', tenant };
    } catch (error: unknown) {
      if (error instanceof TenantError) return { status: 'scope-recovery' };
      throw error;
    }
  },
);

export async function requireAuthenticatedTenant(
  returnTo = '/aujourdhui',
): Promise<{
  session: AuthenticatedSession;
  tenant: TenantContext;
}> {
  requireBackofficePageAvailable(
    new URL(returnTo, 'https://backoffice.invalid').pathname,
  );
  const session = await requireBackofficeSession(returnTo);
  const resolution = await resolveSessionTenant(
    session.userId,
    session.organizationId,
    session.establishmentId,
  );
  if (resolution.status === 'scope-recovery') redirectToScopeRecovery(returnTo);
  return { session, tenant: resolution.tenant };
}

function redirectToScopeRecovery(returnTo: string): never {
  redirect(
    `/resolution-etablissement?returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`,
  );
}

export async function requireReputationTenant(
  returnTo = '/visibilite-reputation/avis',
  options: { requires?: ReputationPermission } = {},
): Promise<{
  session: AuthenticatedSession;
  tenant: TenantContext;
}> {
  const context = await requireAuthenticatedTenant(returnTo);
  try {
    requireEntitlement(context.tenant, 'reputation.enabled');
    requireReputationPermission(context.tenant, 'reputation.read');
    if (options.requires) {
      requireReputationPermission(context.tenant, options.requires);
    }
  } catch (error: unknown) {
    if (isReleaseAExposure() && error instanceof TenantError) {
      redirect('/aujourdhui?exposure=restricted');
    }
    throw error;
  }
  return context;
}

export async function requireUserManagementTenant(): Promise<{
  session: AuthenticatedSession;
  tenant: TenantContext;
}> {
  const context = await requireAuthenticatedTenant(
    '/parametres/utilisateurs-acces',
  );
  try {
    requireRole(context.tenant, ['OWNER', 'MANAGER']);
  } catch (error: unknown) {
    if (isReleaseAExposure() && error instanceof TenantError) {
      redirect('/aujourdhui?exposure=restricted');
    }
    throw error;
  }
  return context;
}

export async function requireBookingTenant(returnTo = '/reservations') {
  requireBackofficePageAvailable('/reservations');
  const context = await requireAuthenticatedTenant(returnTo);
  requireEstablishment(context.tenant);
  requireEntitlement(context.tenant, 'booking.enabled');
  requireBookingPermission(context.tenant, 'booking.read');
  return context as typeof context & {
    tenant: typeof context.tenant & { establishmentId: string };
  };
}

export async function requirePersonnelTenant(returnTo = '/equipe/salaries') {
  requireBackofficePageAvailable('/equipe/salaries');
  const context = await requireAuthenticatedTenant(returnTo);
  requireEstablishment(context.tenant);
  requirePersonnelPermission(context.tenant, 'personnel.employee.read');
  return context as typeof context & {
    tenant: typeof context.tenant & { establishmentId: string };
  };
}

export function safeReturnTo(value: string | null | undefined): string {
  return safeBackofficeReturnTo(getBackofficeExposureProfile(), value);
}

export { authRepository };
