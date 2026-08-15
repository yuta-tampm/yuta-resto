import { createTenantUserRepository } from '@yuta/db-cloud';
import { Suspense } from 'react';
import { requireUserManagementTenant } from '../../../../server/auth/session';
import { cloudDatabase } from '../../../../server/cloud-database';
import { AccessAuditHistory } from './_components/access-audit-history';
import { AccessAuditLoading } from './_components/access-audit-loading';
import {
  parseAccessAuditQuery,
  type AccessAuditSearchParams,
} from './access-audit-model';
import { UsersPage } from './_components/users-page';

export const dynamic = 'force-dynamic';

const tenantUserRepository = createTenantUserRepository(cloudDatabase);

export default async function SettingsUsersPage({
  searchParams,
}: {
  searchParams: Promise<AccessAuditSearchParams>;
}) {
  const { session, tenant } = await requireUserManagementTenant();
  if (
    tenant.actor.type !== 'user' ||
    !tenant.establishmentId ||
    (tenant.actor.role !== 'OWNER' && tenant.actor.role !== 'MANAGER')
  ) {
    throw new Error('User management requires an authenticated tenant user.');
  }

  const establishments =
    await tenantUserRepository.listManageableEstablishments({
      organizationId: tenant.organizationId,
      establishmentId:
        tenant.actor.role === 'MANAGER' ? tenant.establishmentId : undefined,
    });
  const organizationUsers = await tenantUserRepository.listOrganizationUsers({
    organizationId: tenant.organizationId,
    establishmentIds: establishments.map((establishment) => establishment.id),
  });
  const auditQuery = parseAccessAuditQuery(await searchParams);

  return (
    <UsersPage
      users={organizationUsers}
      establishments={establishments}
      currentUserId={session.userId}
      currentMembershipId={tenant.actor.membershipId}
      currentEstablishmentId={tenant.establishmentId}
      actorRole={tenant.actor.role}
      auditHistory={
        tenant.actor.role === 'OWNER' ? (
          <Suspense fallback={<AccessAuditLoading />}>
            <AccessAuditHistory
              tenant={tenant}
              establishments={establishments}
              users={organizationUsers}
              query={auditQuery}
            />
          </Suspense>
        ) : undefined
      }
    />
  );
}
