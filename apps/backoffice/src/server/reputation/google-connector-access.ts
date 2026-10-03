import 'server-only';

import {
  findGoogleReputationConnectorCredentials,
  findCapturedGoogleConnectorCredentials,
  GoogleReviewRetrievalRepositoryError,
  type GoogleReviewBinding,
  type GoogleReviewDatabase,
  type GoogleReplyPublicationTarget,
  assertGoogleReplyTargetTime,
  updateCapturedGoogleConnectorAccessToken,
  updateGoogleReputationConnectorAccessToken,
} from '@yuta/db-cloud';
import type { TenantContext } from '@yuta/tenant';
import { requireEntitlement } from '@yuta/tenant';
import { requireReputationPermission } from '../auth/permissions';
import { isGoogleReviewRetrievalEnabled } from './google-review-retrieval-config';
import { decryptCredential, encryptCredential } from './credential-crypto';
import {
  GoogleBusinessProfileApiError,
  refreshGoogleAccessToken,
} from './google-business-profile-client';
import { getGoogleConnectorConfiguration } from './google-connector-config';
import { isGoogleReplyPublicationEnabled } from './google-reply-publication-config';

export async function getGoogleConnectorAccessToken(
  tenant: TenantContext,
  binding?: GoogleReviewBinding,
): Promise<string | null> {
  if (binding) {
    requireEntitlement(tenant, 'reputation.enabled');
    requireReputationPermission(tenant, 'reputation.read');
    requireReputationPermission(tenant, 'reputation.google.retrieve');
    if (!isGoogleReviewRetrievalEnabled()) return null;
  }
  const { cloudDatabase: db } = await import('../cloud-database');
  return accessGoogleToken(db, tenant, binding);
}

export async function getGooglePublicationAccessToken(
  db: GoogleReviewDatabase,
  tenant: TenantContext,
  target: GoogleReplyPublicationTarget,
): Promise<string | null> {
  requireEntitlement(tenant, 'reputation.enabled');
  requireReputationPermission(tenant, 'reputation.read');
  requireReputationPermission(tenant, 'reputation.reply.publish');
  if (!isGoogleReplyPublicationEnabled()) return null;
  assertGoogleReplyTargetTime(target, new Date());
  return accessGoogleToken(db, tenant, target.binding);
}

async function accessGoogleToken(
  db: GoogleReviewDatabase,
  tenant: TenantContext,
  binding?: GoogleReviewBinding,
): Promise<string | null> {
  const connector = binding
    ? await findCapturedGoogleConnectorCredentials(db, tenant, binding)
    : await findGoogleReputationConnectorCredentials(db, tenant);
  if (binding && !connector) {
    throw new GoogleReviewRetrievalRepositoryError('STALE_AUTHORITY');
  }
  if (!connector?.encryptedAccessToken) return null;
  const configuration = getGoogleConnectorConfiguration();
  if (
    connector.tokenExpiresAt &&
    connector.tokenExpiresAt.getTime() > Date.now() + 60_000
  ) {
    return decryptCredential(
      connector.encryptedAccessToken,
      configuration.encryptionKey,
    );
  }
  if (!connector.encryptedRefreshToken) return null;
  try {
    const refreshToken = decryptCredential(
      connector.encryptedRefreshToken,
      configuration.encryptionKey,
    );
    const tokens = await refreshGoogleAccessToken(configuration, refreshToken);
    const update = {
      encryptedAccessToken: encryptCredential(
        tokens.accessToken,
        configuration.encryptionKey,
      ),
      tokenExpiresAt: tokens.expiresAt,
      grantedScopes: tokens.scopes,
    };
    if (binding) {
      if (
        !(await updateCapturedGoogleConnectorAccessToken(
          db,
          tenant,
          binding,
          update,
        ))
      ) {
        throw new GoogleReviewRetrievalRepositoryError('STALE_AUTHORITY');
      }
    } else {
      await updateGoogleReputationConnectorAccessToken(db, tenant, update);
    }
    return tokens.accessToken;
  } catch (error: unknown) {
    if (
      error instanceof GoogleBusinessProfileApiError &&
      [400, 401].includes(error.status)
    ) {
      return null;
    }
    throw error;
  }
}
