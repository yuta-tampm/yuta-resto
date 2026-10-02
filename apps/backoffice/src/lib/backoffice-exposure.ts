export type BackofficeExposureProfile = 'internal' | 'release-a';

export const releaseAAttentionStatuses = [
  'NEW',
  'TO_PROCESS',
  'DRAFTED',
  'FOLLOW_UP',
] as const;

/**
 * Optional capabilities whose availability depends on the instance profile.
 * An unavailable capability is not read, serialized or invoked. When it is
 * available, its own session, permission, entitlement and record guards still
 * apply: availability never grants access.
 */
export type BackofficeExposureCapability =
  | 'booking'
  | 'pointage'
  | 'reputation-analysis'
  | 'reputation-incidents'
  | 'restaurant-knowledge';

export type ReputationExposureScope = Readonly<{
  requiredSource: 'GOOGLE';
  attentionStatuses: typeof releaseAAttentionStatuses;
}>;

export type BackofficeExposurePolicy = Readonly<{
  capabilities: ReadonlySet<BackofficeExposureCapability>;
  /**
   * Reputation work visible to the instance, or `null` for no restriction. A
   * scoped instance also makes no remote-reply claims (`unanswered`).
   */
  reputationScope: ReputationExposureScope | null;
  /** Turn an authorization denial into the permitted restricted recovery. */
  restrictedRecovery: boolean;
}>;

// Single source for what each profile exposes. Path admission stays in the
// path sets below; release-specific presentation stays with its components.
const backofficeExposurePolicies: Readonly<
  Record<BackofficeExposureProfile, BackofficeExposurePolicy>
> = {
  internal: {
    capabilities: new Set<BackofficeExposureCapability>([
      'booking',
      'pointage',
      'reputation-analysis',
      'reputation-incidents',
      'restaurant-knowledge',
    ]),
    reputationScope: null,
    restrictedRecovery: false,
  },
  'release-a': {
    capabilities: new Set<BackofficeExposureCapability>(),
    reputationScope: {
      requiredSource: 'GOOGLE',
      attentionStatuses: releaseAAttentionStatuses,
    },
    restrictedRecovery: true,
  },
};

export function getBackofficeExposurePolicy(
  profile: BackofficeExposureProfile,
): BackofficeExposurePolicy {
  return backofficeExposurePolicies[profile];
}

export function isBackofficeCapabilityAvailable(
  profile: BackofficeExposureProfile,
  capability: BackofficeExposureCapability,
): boolean {
  return backofficeExposurePolicies[profile].capabilities.has(capability);
}

const releaseAProductPaths = new Set([
  '/',
  '/aujourdhui',
  '/etablissement/informations-generales',
  '/parametres/restaurant',
  '/parametres/integrations',
  '/parametres/utilisateurs-acces',
  '/visibilite-reputation/avis',
]);

const supportPaths = new Set([
  '/connexion',
  '/mot-de-passe-oublie',
  '/reinitialiser-mot-de-passe',
  '/resolution-etablissement',
  '/selection-etablissement',
  '/acces/aucun-etablissement',
  '/api/reputation/google/oauth/start',
  '/api/reputation/google/oauth/callback',
  '/api/internal/reputation/google-cache-maintenance',
]);

const presentationPaths = new Set([
  '/favicon.ico',
  '/site.webmanifest',
  '/images/yuta-logo-padding-giam-square-transparent.png',
  '/images/web-app-manifest-512x512.png',
  '/images/web-app-manifest-192x192.png',
  '/images/logo-slogan.png',
  '/images/favicon-96x96.png',
  '/images/apple-touch-icon.png',
]);

export function isReleaseAProductPath(pathname: string): boolean {
  return (
    releaseAProductPaths.has(pathname) ||
    /^\/visibilite-reputation\/avis\/[^/]+$/u.test(pathname)
  );
}

export function isBackofficePresentationPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname === '/_next/image' ||
    presentationPaths.has(pathname)
  );
}

export function isBackofficePathAvailable(
  profile: BackofficeExposureProfile,
  pathname: string,
): boolean {
  return (
    profile === 'internal' ||
    isReleaseAProductPath(pathname) ||
    supportPaths.has(pathname) ||
    isBackofficePresentationPath(pathname)
  );
}

export function safeBackofficeReturnTo(
  profile: BackofficeExposureProfile,
  value: string | null | undefined,
): string {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    /[\u0000-\u001f\u007f]/u.test(value)
  ) {
    return '/aujourdhui';
  }
  try {
    const destination = new URL(value, 'https://backoffice.invalid');
    return profile === 'internal' || isReleaseAProductPath(destination.pathname)
      ? value
      : '/aujourdhui';
  } catch {
    return '/aujourdhui';
  }
}
