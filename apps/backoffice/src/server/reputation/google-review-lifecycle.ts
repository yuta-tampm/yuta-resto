import 'server-only';

import {
  listDueGoogleReviewCacheScopes,
  purgeGoogleReviewCache,
} from '@yuta/db-cloud';

export async function maintainGoogleReviewCache(): Promise<{
  scopesProcessed: number;
  contentCleared: number;
  referencesRemoved: number;
  continuationsCleared: number;
}> {
  // The machine route authenticates before dynamically importing this module.
  const { cloudDatabase } = await import('../cloud-database');
  const now = new Date();
  const scopes = await listDueGoogleReviewCacheScopes(cloudDatabase, {
    now,
    limit: 25,
  });
  const totals = {
    scopesProcessed: 0,
    contentCleared: 0,
    referencesRemoved: 0,
    continuationsCleared: 0,
  };
  for (const scope of scopes.slice(0, 25)) {
    const result = await purgeGoogleReviewCache(cloudDatabase, scope, {
      now,
      limit: 500,
    });
    totals.scopesProcessed += 1;
    totals.contentCleared += result.contentCleared;
    totals.referencesRemoved += result.referencesRemoved;
    totals.continuationsCleared += result.continuationsCleared;
  }
  return totals;
}
