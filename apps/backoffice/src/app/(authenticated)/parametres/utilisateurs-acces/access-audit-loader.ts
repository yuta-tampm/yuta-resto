import 'server-only';

import { createAccessAuditRepository } from '@yuta/db-cloud';
import type { TenantContext } from '@yuta/tenant';
import { requireAccessAuditPermission } from '../../../../server/auth/access-audit-permissions';
import { cloudDatabase } from '../../../../server/cloud-database';
import type { AccessAuditQuery } from './access-audit-model';

const accessAuditRepository = createAccessAuditRepository(cloudDatabase);

export async function loadAccessAuditHistory(input: {
  tenant: TenantContext;
  allowedEstablishmentIds: string[];
  query: AccessAuditQuery;
}) {
  requireAccessAuditPermission(input.tenant);
  return accessAuditRepository.listAccessAuditEvents({
    organizationId: input.tenant.organizationId,
    allowedEstablishmentIds: input.allowedEstablishmentIds,
    ...input.query,
  });
}
