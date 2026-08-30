import 'server-only';

import {
  getRestaurantKnowledgeConceptHistory,
  type CloudDatabaseClient,
} from '@yuta/db-cloud';
import type { TenantContext } from '@yuta/tenant';
import { hasRestaurantKnowledgePermission } from '../../../../server/auth/permissions';

export async function loadConceptHistorySection(
  db: CloudDatabaseClient,
  tenant: TenantContext,
) {
  if (!hasRestaurantKnowledgePermission(tenant, 'restaurant-knowledge.read')) {
    return null;
  }

  return {
    conceptHistory: await getRestaurantKnowledgeConceptHistory(db, tenant),
    canManage: hasRestaurantKnowledgePermission(
      tenant,
      'restaurant-knowledge.manage',
    ),
  };
}
