import { BackofficeFrame } from '@/components/backoffice/backoffice-frame';
import {
  hasBookingPermission,
  hasPersonnelPermission,
  hasReputationPermission,
  hasUserManagementPermission,
} from '@/server/auth/permissions';
import {
  authRepository,
  requireAuthenticatedTenant,
} from '@/server/auth/session';
import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getBackofficeExposureProfile } from '@/server/backoffice-exposure';

export const dynamic = 'force-dynamic';

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { session, tenant } = await requireAuthenticatedTenant();
  if (tenant.actor.type !== 'user') redirect('/connexion');
  const availableTenants = await authRepository.listAvailableTenants(
    session.userId,
  );
  return (
    <BackofficeFrame
      exposureProfile={getBackofficeExposureProfile()}
      canManageGoogleConnector={hasReputationPermission(
        tenant,
        'reputation.connector.manage',
      )}
      currentUser={{
        name: session.userName,
        email: session.userEmail,
      }}
      tenantSwitcher={{
        tenants: availableTenants,
        currentMembershipId: tenant.actor.membershipId,
      }}
      canManageUsers={hasUserManagementPermission(
        tenant,
        'users.access.manage',
      )}
      canReadPersonnel={hasPersonnelPermission(
        tenant,
        'personnel.employee.read',
      )}
      canManageBookingSettings={hasBookingPermission(
        tenant,
        'booking.settings.manage',
      )}
      bookingEnabled={tenant.entitlements.has('booking.enabled')}
      reputationEnabled={tenant.entitlements.has('reputation.enabled')}
    >
      {children}
    </BackofficeFrame>
  );
}
