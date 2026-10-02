import 'server-only';

import {
  getRestaurantKnowledgeConceptHistory,
  getRestaurantKnowledgeCommunicationIdentity,
  getRestaurantKnowledgeCuisineKnowHow,
  getRestaurantKnowledgeCustomerExperience,
  getRestaurantKnowledgeTeamCulture,
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

export async function loadCuisineKnowHowSection(
  db: CloudDatabaseClient,
  tenant: TenantContext,
) {
  if (!hasRestaurantKnowledgePermission(tenant, 'restaurant-knowledge.read')) {
    return null;
  }

  return {
    cuisineKnowHow: await getRestaurantKnowledgeCuisineKnowHow(db, tenant),
    canManage: hasRestaurantKnowledgePermission(
      tenant,
      'restaurant-knowledge.manage',
    ),
  };
}

export async function loadCustomerExperienceSection(
  db: CloudDatabaseClient,
  tenant: TenantContext,
) {
  if (!hasRestaurantKnowledgePermission(tenant, 'restaurant-knowledge.read')) {
    return null;
  }

  return {
    customerExperience: await getRestaurantKnowledgeCustomerExperience(
      db,
      tenant,
    ),
    canManage: hasRestaurantKnowledgePermission(
      tenant,
      'restaurant-knowledge.manage',
    ),
  };
}

export async function loadTeamCultureSection(
  db: CloudDatabaseClient,
  tenant: TenantContext,
) {
  if (!hasRestaurantKnowledgePermission(tenant, 'restaurant-knowledge.read')) {
    return null;
  }

  return {
    teamCulture: await getRestaurantKnowledgeTeamCulture(db, tenant),
    canManage: hasRestaurantKnowledgePermission(
      tenant,
      'restaurant-knowledge.manage',
    ),
  };
}

export async function loadCommunicationIdentitySection(
  db: CloudDatabaseClient,
  tenant: TenantContext,
) {
  if (!hasRestaurantKnowledgePermission(tenant, 'restaurant-knowledge.read')) {
    return null;
  }

  return {
    communicationIdentity: await getRestaurantKnowledgeCommunicationIdentity(
      db,
      tenant,
    ),
    canManage: hasRestaurantKnowledgePermission(
      tenant,
      'restaurant-knowledge.manage',
    ),
  };
}
