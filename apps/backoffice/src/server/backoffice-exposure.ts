import 'server-only';

import type { FeedbackScopeOptions } from '@yuta/db-cloud';
import { redirect } from 'next/navigation';
import {
  isBackofficePathAvailable,
  releaseAAttentionStatuses,
} from '../lib/backoffice-exposure';
import { getBackofficeExposureProfile } from './backoffice-exposure-config';

export { getBackofficeExposureProfile } from './backoffice-exposure-config';

export function isReleaseAExposure(): boolean {
  return getBackofficeExposureProfile() === 'release-a';
}

export function requireBackofficePageAvailable(pathname: string): void {
  if (!isBackofficePathAvailable(getBackofficeExposureProfile(), pathname)) {
    redirect('/aujourdhui?exposure=unavailable');
  }
}

export function requireBackofficeCapabilityAvailable(
  capability: 'restaurant-knowledge' | 'pointage',
): void {
  if (isReleaseAExposure()) {
    // Explicit invoked capability, independent of the incoming action URL.
    redirect('/aujourdhui?exposure=unavailable');
  }
  void capability;
}

export function getReputationFeedbackScope(): FeedbackScopeOptions | undefined {
  return isReleaseAExposure()
    ? {
        requiredSource: 'GOOGLE',
        scopedCounters: true,
        attentionStatuses: releaseAAttentionStatuses,
      }
    : undefined;
}
