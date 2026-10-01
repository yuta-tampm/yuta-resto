import { isValidElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TenantContext, TenantRole } from '@yuta/tenant';

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  connector: vi.fn(),
  token: vi.fn(),
  accounts: vi.fn(),
  locations: vi.fn(),
  select: vi.fn(),
  revalidate: vi.fn(),
  pageData: vi.fn(),
}));
vi.mock('server-only', () => ({}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { synthetic: true },
}));
vi.mock('@yuta/db-cloud', () => ({
  findGoogleReputationConnector: mocks.connector,
  selectGoogleReputationLocation: mocks.select,
}));
vi.mock('../src/server/auth/session', () => ({
  requireReputationTenant: mocks.session,
}));
vi.mock('../src/server/reputation/google-connector-access', () => ({
  getGoogleConnectorAccessToken: mocks.token,
}));
vi.mock('../src/server/reputation/google-business-profile-client', () => ({
  listGoogleBusinessAccounts: mocks.accounts,
  listGoogleBusinessLocations: mocks.locations,
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidate }));
vi.mock('next/navigation', () => ({
  redirect: (url: string): never => {
    throw new Error(`REDIRECT:${url}`);
  },
}));
vi.mock('../src/app/(authenticated)/parametres/integrations/actions', () => ({
  continueGoogleReviewsAction: vi.fn(),
  selectGoogleLocationAction: vi.fn(),
}));
vi.mock(
  '../src/app/(authenticated)/parametres/integrations/google-integration-loader',
  () => ({ loadGoogleIntegrationPageData: mocks.pageData }),
);

import { GoogleConnectorPanel } from '../src/app/(authenticated)/parametres/integrations/_components/google-connector-panel';
import { GoogleLocationSelectorPanel } from '../src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel';
import { IntegrationStatusAlerts } from '../src/app/(authenticated)/parametres/integrations/_components/integration-status-alerts';
import {
  releaseAIntegrationResultMessages,
  type GoogleConnectorSummary,
} from '../src/app/(authenticated)/parametres/integrations/integrations-model';
import { loadReleaseASetupSummary } from '../src/server/reputation/release-a-setup';
import SettingsIntegrationsPage from '../src/app/(authenticated)/parametres/integrations/page';

const tenant = (role: TenantRole = 'OWNER'): TenantContext => ({
  organizationId: 'cb4435bb-9c87-4487-b3a9-54b01012a6cc',
  establishmentId: '87c0c74d-ccbe-41f3-986a-93cc4f14ece7',
  actor: {
    type: 'user',
    role,
    userId: '93fe2e7e-3d7e-455f-abdf-16db7e91b3a9',
    membershipId: '7463b3e5-19dc-4b68-8bcd-ac7e5db9f430',
  },
  locale: 'fr-FR',
  timezone: 'Europe/Paris',
  entitlements: new Set(['reputation.enabled']),
});
const connected: GoogleConnectorSummary = {
  id: '9544777a-5850-4fc1-99a9-4f9d975bc866',
  provider: 'GOOGLE',
  status: 'CONNECTED',
  externalAccountId: 'accounts/synthetic-account',
  externalLocationId: 'locations/synthetic-location',
  tokenExpiresAt: null,
  grantedScopes: [],
  lastSyncedAt: null,
  lastSuccessfulSyncAt: null,
  lastSyncError: null,
  hasAccessToken: true,
  hasRefreshToken: true,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('GOOGLE_REVIEW_RETRIEVAL_ENABLED', 'false');
  mocks.session.mockResolvedValue({
    session: { id: '0ed7406f-9625-4908-9f0a-81020d317e9e' },
    tenant: tenant(),
  });
  mocks.connector.mockResolvedValue(connected);
});
afterEach(() => vi.unstubAllEnvs());

describe('explicit OWNER Google OAuth document navigation', () => {
  const actions = async (
    configured: boolean,
    connector: GoogleConnectorSummary | null,
  ) => {
    mocks.pageData.mockResolvedValue({
      configured,
      connector,
      accounts: [],
      locations: [],
      selectedAccount: null,
      discoveryError: false,
      resultMessage: undefined,
    });
    const page: unknown = await SettingsIntegrationsPage({
      searchParams: Promise.resolve({}),
    });
    expect(mocks.session).toHaveBeenCalledWith('/parametres/integrations', {
      requires: 'reputation.connector.manage',
    });
    expect(mocks.pageData).toHaveBeenCalledWith(tenant(), {});
    if (!isValidElement<{ actions?: ReactNode }>(page)) {
      throw new Error('Expected the actual Integrations page.');
    }
    return page.props.actions;
  };

  const assertDocumentAnchor = (action: ReactNode, label: string) => {
    if (!isValidElement<{ children?: ReactNode }>(action)) {
      throw new Error('Expected the configured OAuth action.');
    }
    const anchor = action.props.children;
    if (!isValidElement<{ href?: string }>(anchor)) {
      throw new Error('Expected an OAuth navigation anchor.');
    }
    // OAuth starts only through native document navigation, never client routing.
    expect(anchor.type).toBe('a');
    expect(anchor.props.href).toBe('/api/reputation/google/oauth/start');
    const markup = renderToStaticMarkup(action);
    expect(markup).toContain(label);
    expect(markup).toContain('href="/api/reputation/google/oauth/start"');
    expect(mocks.token).not.toHaveBeenCalled();
    expect(mocks.accounts).not.toHaveBeenCalled();
    expect(mocks.locations).not.toHaveBeenCalled();
  };

  it('offers connected OWNER a normal document anchor to reconnect Google', async () => {
    assertDocumentAnchor(await actions(true, connected), 'Reconnecter Google');
  });

  it('offers unconnected OWNER a normal document anchor to connect Google', async () => {
    assertDocumentAnchor(await actions(true, null), 'Connecter Google');
  });

  it('omits the OAuth action when Google configuration is unavailable', async () => {
    expect(await actions(false, null)).toBeUndefined();
    expect(mocks.token).not.toHaveBeenCalled();
    expect(mocks.accounts).not.toHaveBeenCalled();
    expect(mocks.locations).not.toHaveBeenCalled();
  });
});

describe('Release A Google configuration recovery copy', () => {
  it('uses operator/support recovery without server implementation instructions', () => {
    const markup = renderToStaticMarkup(
      <IntegrationStatusAlerts
        configured={false}
        discoveryError
        releaseA
        resultMessage={releaseAIntegrationResultMessages.configuration_error}
      />,
    );
    expect(markup).toContain('support YUTA');
    expect(markup).toContain('Reconnectez Google');
    expect(markup).not.toMatch(
      /chiffrement|OAuth|Google Cloud|identifiants|redirection/u,
    );
  });

  it('keeps binding separate from import and publication availability', () => {
    const markup = renderToStaticMarkup(
      <GoogleConnectorPanel connector={null} releaseA />,
    );
    expect(markup).toContain('L’association ne récupère aucun avis.');
    expect(markup).toContain(
      'La publication des réponses depuis YUTA n’est pas disponible.',
    );
    expect(markup).not.toContain(
      'Import des avis et publication des réponses.',
    );
    expect(markup).not.toContain('jetons OAuth');
    expect(
      releaseAIntegrationResultMessages.location_selected?.description,
    ).toContain('cette association ne récupère aucun avis');
  });

  it('offers explicit confirmation for an already-associated profile while retrieval is disabled', () => {
    const markup = renderToStaticMarkup(
      <GoogleConnectorPanel connector={connected} releaseA />,
    );
    expect(markup).toContain('Confirmer et continuer vers Avis');
    expect(markup).toContain('La récupération Google est indisponible.');
    expect(markup).toContain(
      'Votre travail dans YUTA reste accessible dans Avis.',
    );
    expect(markup).not.toContain('Dernière récupération');
  });

  it('keeps confirmation available during temporary account discovery failure', () => {
    const markup = renderToStaticMarkup(
      <GoogleLocationSelectorPanel
        accounts={[]}
        locations={[]}
        selectedAccount={null}
        connector={connected}
      />,
    );
    expect(markup).toContain('Votre établissement associé reste disponible.');
    expect(markup).toContain('confirmer la continuation vers Avis');
    expect(markup).not.toContain('Connectez Google pour afficher');
  });

  it('describes an eligible visit separately from association and publication', () => {
    const markup = renderToStaticMarkup(
      <GoogleConnectorPanel connector={connected} releaseA retrievalEnabled />,
    );
    expect(markup).toContain(
      'Une visite dans Avis peut récupérer les avis Google si nécessaire.',
    );
    expect(markup).toContain(
      'L’association seule ne confirme aucun avis récupéré.',
    );
    expect(markup).toContain(
      'La publication des réponses depuis YUTA n’est pas disponible.',
    );
  });

  it('does not offer confirmation for an unfinished association', () => {
    const markup = renderToStaticMarkup(
      <GoogleConnectorPanel
        connector={{ ...connected, status: 'CONNECTING' }}
        releaseA
      />,
    );
    expect(markup).not.toContain('Confirmer et continuer vers Avis');
  });

  it('retains the internal configuration instructions', () => {
    const markup = renderToStaticMarkup(
      <IntegrationStatusAlerts
        configured={false}
        discoveryError
        resultMessage={undefined}
      />,
    );
    expect(markup).toContain('clé de chiffrement');
    expect(markup).toContain('Google Cloud');
  });
});

describe('trusted OWNER Google continuation', () => {
  const action = async () => {
    const actual = await vi.importActual<
      typeof import('../src/app/(authenticated)/parametres/integrations/actions')
    >('../src/app/(authenticated)/parametres/integrations/actions');
    return actual.continueGoogleReviewsAction();
  };

  it('checks scoped persisted association then redirects, without token/provider/persistence effects', async () => {
    await expect(action()).rejects.toThrow(
      'REDIRECT:/visibilite-reputation/avis',
    );
    expect(mocks.session).toHaveBeenCalledWith('/parametres/integrations', {
      requires: 'reputation.connector.manage',
    });
    expect(mocks.connector).toHaveBeenCalledWith({ synthetic: true }, tenant());
    expect(mocks.token).not.toHaveBeenCalled();
    expect(mocks.accounts).not.toHaveBeenCalled();
    expect(mocks.locations).not.toHaveBeenCalled();
    expect(mocks.select).not.toHaveBeenCalled();
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });

  it.each(['MANAGER', 'STAFF'] as const)(
    'denies %s before connector lookup/provider access',
    async (role) => {
      mocks.session.mockResolvedValue({
        session: { id: 'synthetic-session' },
        tenant: tenant(role),
      });
      await expect(action()).rejects.toMatchObject({
        code: 'CROSS_TENANT_ACCESS_DENIED',
      });
      expect(mocks.connector).not.toHaveBeenCalled();
      expect(mocks.token).not.toHaveBeenCalled();
    },
  );

  it.each([
    null,
    { ...connected, status: 'CONNECTING' },
    { ...connected, externalAccountId: '' },
    { ...connected, externalLocationId: 'locations/foreign/path' },
  ])(
    'refuses incomplete persisted association without provider access',
    async (connector) => {
      mocks.connector.mockResolvedValue(connector);
      await expect(action()).rejects.toThrow(
        'REDIRECT:/parametres/integrations?google=continuation_unavailable',
      );
      expect(mocks.token).not.toHaveBeenCalled();
      expect(mocks.accounts).not.toHaveBeenCalled();
      expect(mocks.locations).not.toHaveBeenCalled();
    },
  );

  it('uses operator/support recovery when association lookup fails', async () => {
    mocks.connector.mockRejectedValue(new Error('synthetic lookup failure'));
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      await expect(action()).rejects.toThrow(
        'REDIRECT:/parametres/integrations?google=continuation_unavailable',
      );
      expect(log).toHaveBeenCalledWith(
        'Unable to verify Google continuation.',
        { errorName: 'Error' },
      );
    } finally {
      log.mockRestore();
    }
  });
});

describe('token-free setup copy without provider retrieval', () => {
  it('does not infer a successful retrieval from association with default-disabled admission', async () => {
    const summary = await loadReleaseASetupSummary(tenant());
    expect(summary.description).toContain(
      'La récupération Google est indisponible.',
    );
    expect(summary.description).toContain(
      'l’association seule ne confirme aucun résultat de récupération.',
    );
    expect(summary.setupHref).toBeNull();
    expect(JSON.stringify(summary)).not.toMatch(
      /synthetic-account|synthetic-location|lastSync|token/u,
    );
    expect(mocks.token).not.toHaveBeenCalled();
  });

  it('mentions eligible visits for MANAGER while preserving local work and separate outcomes', async () => {
    vi.stubEnv('GOOGLE_REVIEW_RETRIEVAL_ENABLED', 'true');
    const summary = await loadReleaseASetupSummary(tenant('MANAGER'));
    expect(summary.description).toContain(
      'Une visite dans Avis peut récupérer',
    );
    expect(summary.description).toContain(
      'l’association seule ne confirme aucun résultat',
    );
    expect(mocks.token).not.toHaveBeenCalled();
  });

  it('gives STAFF an assigned-work handoff without any batch/cursor/coverage output', async () => {
    vi.stubEnv('GOOGLE_REVIEW_RETRIEVAL_ENABLED', 'true');
    const summary = await loadReleaseASetupSummary(tenant('STAFF'));
    expect(summary.description).toContain(
      'Vos avis attribués et votre travail dans YUTA restent accessibles.',
    );
    expect(summary.description).toContain(
      'contactez un propriétaire ou un responsable.',
    );
    expect(summary.setupHref).toBeNull();
    expect(summary.description).not.toContain('Une visite');
    expect(JSON.stringify(summary)).not.toMatch(
      /continuationHandle|lastBatchCount|coverage|lastSuccessfulAt/u,
    );
  });
});
