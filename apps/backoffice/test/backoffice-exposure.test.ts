import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import {
  isBackofficePathAvailable,
  releaseAAttentionStatuses,
  safeBackofficeReturnTo,
} from '../src/lib/backoffice-exposure';
import { getBackofficeExposureProfile } from '../src/server/backoffice-exposure-config';
import { getVisibleNavigationSections } from '../src/components/backoffice/backoffice-navigation';
import { proxy } from '../src/proxy';

beforeEach(() => {
  vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'release-a');
});
afterEach(() => vi.unstubAllEnvs());

describe('server-owned Backoffice exposure configuration', () => {
  it.each(['internal', 'release-a'] as const)(
    'selects explicit %s',
    (profile) => {
      vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', profile);
      vi.stubEnv('NODE_ENV', 'production');
      expect(getBackofficeExposureProfile()).toBe(profile);
    },
  );
  it('keeps unset development/test internal and refuses unset production', () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', undefined);
    for (const runtime of ['development', 'test'] as const) {
      vi.stubEnv('NODE_ENV', runtime);
      expect(getBackofficeExposureProfile()).toBe('internal');
    }
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => getBackofficeExposureProfile()).toThrow(
      'configuration is unavailable',
    );
  });
  it.each(['', 'ALL', ' release-a ', 'internal,release-a'])(
    'refuses invalid selection %j',
    (value) => {
      vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', value);
      expect(() => getBackofficeExposureProfile()).toThrow(
        'configuration is unavailable',
      );
    },
  );
});

describe('closed paths and return destinations', () => {
  it.each([
    '/aujourdhui',
    '/visibilite-reputation/avis',
    '/visibilite-reputation/avis/synthetic-id',
    '/etablissement/informations-generales',
    '/parametres/integrations',
    '/parametres/utilisateurs-acces',
    '/connexion',
    '/selection-etablissement',
    '/resolution-etablissement',
    '/api/reputation/google/oauth/start',
    '/api/reputation/google/oauth/callback',
    '/_next/static/chunk.js',
    '/favicon.ico',
  ])('admits %s in A', (path) => {
    expect(isBackofficePathAvailable('release-a', path)).toBe(true);
  });
  it.each([
    '/reservations',
    '/visibilite-reputation/satisfaction',
    '/equipe/salaries',
    '/equipe/formalites-personnel',
    '/pointage/luna',
    '/api/pointage/luna/state',
    '/api/personnel/register/export',
    '/marketing/contenus',
    '/stock/inventaire',
    '/etablissement/horaires-services',
    '/parametres/abonnement',
    '/future-module',
    '/api/future-module',
    '/future-module.json',
    '/parametres/integrations/future',
    '/visibilite-reputation/avis/id/future',
  ])('closes %s in A and preserves internal availability', (path) => {
    expect(isBackofficePathAvailable('release-a', path)).toBe(false);
    expect(isBackofficePathAvailable('internal', path)).toBe(true);
  });
  it('keeps accepted deep-link queries and closes deferred/auth return destinations', () => {
    const detail =
      '/visibilite-reputation/avis?selected=synthetic-id&queue=attention';
    expect(safeBackofficeReturnTo('release-a', detail)).toBe(detail);
    for (const destination of [
      '/reservations?date=2026-10-01',
      '/connexion',
      '//example.test',
      '/\\example.test',
      '/aujourdhui\n',
    ]) {
      expect(safeBackofficeReturnTo('release-a', destination)).toBe(
        '/aujourdhui',
      );
    }
    expect(
      safeBackofficeReturnTo('internal', '/reservations?date=2026-10-01'),
    ).toBe('/reservations?date=2026-10-01');
  });
  it('uses the accepted local queue statuses, including every NEW item', () => {
    expect(releaseAAttentionStatuses).toEqual([
      'NEW',
      'TO_PROCESS',
      'DRAFTED',
      'FOLLOW_UP',
    ]);
  });
});

describe('transport admission independent from caller claims', () => {
  it('ignores a forged internal query/header/cookie and redirects a deferred GET safely', () => {
    const request = new NextRequest(
      'http://127.0.0.1:3101/stock/inventaire?profile=internal',
      {
        headers: {
          'x-backoffice-profile': 'internal',
          cookie: 'BACKOFFICE_EXPOSURE_PROFILE=internal',
        },
      },
    );
    const response = proxy(request);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      `${new URL(request.url).origin}/aujourdhui?exposure=unavailable`,
    );
    expect(response.headers.get('cache-control')).toContain('no-store');
  });
  it.each(['/api/personnel/register/export', '/api/future', '/reservations'])(
    'denies direct POST %s',
    async (path) => {
      const response = proxy(
        new NextRequest(`http://127.0.0.1:3101${path}`, {
          method: 'POST',
          body: 'untrusted',
        }),
      );
      expect(response.status).toBe(403);
      expect(response.headers.get('x-nextjs-action-not-found')).toBe('1');
      expect(await response.json()).toEqual({
        code: 'BACKOFFICE_FEATURE_UNAVAILABLE',
      });
    },
  );
  it('allows transport to an A action URL without pretending to authorize the invoked capability', () => {
    const response = proxy(
      new NextRequest(
        'http://127.0.0.1:3101/etablissement/informations-generales',
        {
          method: 'POST',
          headers: { 'Next-Action': 'untrusted-action-id' },
          body: 'untrusted',
        },
      ),
    );
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });
  it('keeps typed Pointage denial and transport protection', async () => {
    const response = proxy(
      new NextRequest('http://127.0.0.1:3101/api/pointage/luna/end', {
        method: 'POST',
      }),
    );
    expect(response.status).toBe(403);
    expect(response.headers.get('x-nextjs-action-not-found')).toBeNull();
    expect(await response.json()).toEqual({ code: 'POINTAGE_ACCESS_DENIED' });
    expect(response.headers.get('content-security-policy')).toContain(
      "frame-ancestors 'none'",
    );
    expect(response.headers.get('referrer-policy')).toBe('no-referrer');
    expect(response.headers.get('cache-control')).toContain('no-store');
  });
  it('fails closed with safe 503 and preserves internal Pointage transport', async () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'invalid');
    const response = proxy(new NextRequest('http://127.0.0.1:3101/aujourdhui'));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ code: 'BACKOFFICE_UNAVAILABLE' });
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
    const internal = proxy(
      new NextRequest('http://127.0.0.1:3102/pointage/luna'),
    );
    expect(internal.headers.get('x-middleware-next')).toBe('1');
    expect(internal.headers.get('content-security-policy')).toContain(
      "object-src 'none'",
    );
  });
});

describe('server-projected A navigation', () => {
  const capabilities = {
    bookingEnabled: true,
    reputationEnabled: true,
    canManageBookingSettings: true,
    canManageUsers: true,
    canReadPersonnel: true,
  };
  const paths = (role: 'OWNER' | 'MANAGER' | 'STAFF') =>
    getVisibleNavigationSections({
      ...capabilities,
      exposureProfile: 'release-a',
      canManageGoogleConnector: role === 'OWNER',
      canManageUsers: role !== 'STAFF',
    }).flatMap((section) => section.items.map((item) => item.href));
  it('gives OWNER exactly five slices without deferred entries', () => {
    expect(paths('OWNER').sort()).toEqual(
      [
        '/aujourdhui',
        '/etablissement/informations-generales',
        '/parametres/integrations',
        '/parametres/utilisateurs-acces',
        '/visibilite-reputation/avis',
      ].sort(),
    );
  });
  it('keeps MANAGER and STAFF limits and the existing entitlement boundary', () => {
    expect(paths('MANAGER')).not.toContain('/parametres/integrations');
    expect(paths('STAFF')).toHaveLength(3);
    const hidden = getVisibleNavigationSections({
      ...capabilities,
      exposureProfile: 'release-a',
      reputationEnabled: false,
      canManageGoogleConnector: true,
    });
    expect(
      hidden.flatMap((section) => section.items.map((item) => item.href)),
    ).not.toContain('/parametres/integrations');
  });
});
