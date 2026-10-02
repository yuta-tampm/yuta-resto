import 'server-only';

import type { FeedbackScopeOptions } from '@yuta/db-cloud';
import { redirect } from 'next/navigation';
import {
  getBackofficeExposurePolicy,
  isBackofficeCapabilityAvailable,
  isBackofficePathAvailable,
  type BackofficeExposureCapability,
  type ReputationExposureScope,
} from '@/lib/backoffice-exposure';
import { getBackofficeExposureProfile } from './backoffice-exposure-config';

export { getBackofficeExposureProfile } from './backoffice-exposure-config';

/**
 * Release A presentation variant (copy, layout, preview size). Availability,
 * data scope and denial recovery must use the policy helpers below instead.
 */
export function isReleaseAExposure(): boolean {
  return getBackofficeExposureProfile() === 'release-a';
}

export function requireBackofficePageAvailable(pathname: string): void {
  if (!isBackofficePathAvailable(getBackofficeExposureProfile(), pathname)) {
    redirect('/aujourdhui?exposure=unavailable');
  }
}

export function isBackofficeExposureCapabilityAvailable(
  capability: BackofficeExposureCapability,
): boolean {
  return isBackofficeCapabilityAvailable(
    getBackofficeExposureProfile(),
    capability,
  );
}

export function requireBackofficeCapabilityAvailable(
  capability: BackofficeExposureCapability,
): void {
  // Explicit invoked capability, independent of the incoming action URL.
  if (!isBackofficeExposureCapabilityAvailable(capability)) {
    redirect('/aujourdhui?exposure=unavailable');
  }
}

export function usesRestrictedDenialRecovery(): boolean {
  return getBackofficeExposurePolicy(getBackofficeExposureProfile())
    .restrictedRecovery;
}

export function getReputationExposureScope(): ReputationExposureScope | null {
  return getBackofficeExposurePolicy(getBackofficeExposureProfile())
    .reputationScope;
}

export function getReputationFeedbackScope(): FeedbackScopeOptions | undefined {
  const scope = getReputationExposureScope();
  return scope
    ? {
        requiredSource: scope.requiredSource,
        scopedCounters: true,
        attentionStatuses: scope.attentionStatuses,
      }
    : undefined;
}
