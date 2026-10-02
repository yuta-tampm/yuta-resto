import { z } from 'zod';
import type { BackofficeExposureProfile } from '@/lib/backoffice-exposure';

const exposureProfileSchema = z.enum(['internal', 'release-a']);

export class BackofficeExposureConfigurationError extends Error {
  constructor() {
    super('Backoffice exposure configuration is unavailable.');
    this.name = 'BackofficeExposureConfigurationError';
  }
}

// This process-owned reader also serves the server-only Next proxy boundary.
// It is never imported by client presentation modules.
export function getBackofficeExposureProfile(): BackofficeExposureProfile {
  const selection = process.env.BACKOFFICE_EXPOSURE_PROFILE;
  if (selection === undefined && process.env.NODE_ENV !== 'production') {
    return 'internal';
  }
  const parsed = exposureProfileSchema.safeParse(selection);
  if (!parsed.success) throw new BackofficeExposureConfigurationError();
  return parsed.data;
}
