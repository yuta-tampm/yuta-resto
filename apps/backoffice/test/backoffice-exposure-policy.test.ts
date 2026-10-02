import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('next/navigation', () => ({
  redirect: (destination: string): never => {
    throw new Error(`REDIRECT:${destination}`);
  },
}));

import {
  getBackofficeExposurePolicy,
  isBackofficeCapabilityAvailable,
  releaseAAttentionStatuses,
  type BackofficeExposureCapability,
} from '../src/lib/backoffice-exposure';
import {
  getReputationExposureScope,
  getReputationFeedbackScope,
  isBackofficeExposureCapabilityAvailable,
  requireBackofficeCapabilityAvailable,
  usesRestrictedDenialRecovery,
} from '../src/server/backoffice-exposure';

afterEach(() => vi.unstubAllEnvs());

const capabilities: readonly BackofficeExposureCapability[] = [
  'booking',
  'pointage',
  'reputation-analysis',
  'reputation-incidents',
  'restaurant-knowledge',
];

describe('exposure policy table', () => {
  it.each(capabilities)('keeps %s available in internal only', (capability) => {
    expect(isBackofficeCapabilityAvailable('internal', capability)).toBe(true);
    expect(isBackofficeCapabilityAvailable('release-a', capability)).toBe(
      false,
    );
  });

  it('restricts Release A Reputation work to Google attention statuses', () => {
    expect(getBackofficeExposurePolicy('release-a').reputationScope).toEqual({
      requiredSource: 'GOOGLE',
      attentionStatuses: releaseAAttentionStatuses,
    });
    expect(getBackofficeExposurePolicy('internal').reputationScope).toBeNull();
  });

  it('uses restricted denial recovery in Release A only', () => {
    expect(getBackofficeExposurePolicy('release-a').restrictedRecovery).toBe(
      true,
    );
    expect(getBackofficeExposurePolicy('internal').restrictedRecovery).toBe(
      false,
    );
  });
});

describe('server exposure helpers read the selected profile', () => {
  it.each(capabilities)(
    'redirects an invoked %s capability in Release A',
    (capability) => {
      vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'release-a');

      expect(isBackofficeExposureCapabilityAvailable(capability)).toBe(false);
      expect(() => requireBackofficeCapabilityAvailable(capability)).toThrow(
        'REDIRECT:/aujourdhui?exposure=unavailable',
      );
    },
  );

  it.each(capabilities)(
    'admits an invoked %s capability in internal',
    (capability) => {
      vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');

      expect(isBackofficeExposureCapabilityAvailable(capability)).toBe(true);
      expect(() =>
        requireBackofficeCapabilityAvailable(capability),
      ).not.toThrow();
    },
  );

  it('maps the Release A scope to the repository feedback scope', () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'release-a');

    expect(getReputationExposureScope()?.requiredSource).toBe('GOOGLE');
    expect(getReputationFeedbackScope()).toEqual({
      requiredSource: 'GOOGLE',
      scopedCounters: true,
      attentionStatuses: releaseAAttentionStatuses,
    });
    expect(usesRestrictedDenialRecovery()).toBe(true);
  });

  it('applies no Reputation restriction or restricted recovery in internal', () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');

    expect(getReputationExposureScope()).toBeNull();
    expect(getReputationFeedbackScope()).toBeUndefined();
    expect(usesRestrictedDenialRecovery()).toBe(false);
  });

  it('fails closed instead of falling back to internal on invalid selection', () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'ALL');

    expect(() => isBackofficeExposureCapabilityAvailable('booking')).toThrow(
      'configuration is unavailable',
    );
    expect(() => requireBackofficeCapabilityAvailable('pointage')).toThrow(
      'configuration is unavailable',
    );
    expect(() => getReputationFeedbackScope()).toThrow(
      'configuration is unavailable',
    );
    expect(() => usesRestrictedDenialRecovery()).toThrow(
      'configuration is unavailable',
    );
  });
});
