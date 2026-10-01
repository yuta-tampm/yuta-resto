import { Button } from '@yuta/ui';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { BackofficePage } from '../../../../components/backoffice/backoffice-page';
import { requireReputationPermission } from '../../../../server/auth/permissions';
import { requireReputationTenant } from '../../../../server/auth/session';
import { GoogleConnectorPanel } from './_components/google-connector-panel';
import { loadGoogleIntegrationPageData } from './google-integration-loader';
import { GoogleLocationSelectorPanel } from './_components/google-location-selector-panel';
import { IntegrationStatusAlerts } from './_components/integration-status-alerts';
import type { IntegrationSearchParams } from './integrations-model';
import {
  filterIntegrationSearchParam,
  releaseAIntegrationResultMessages,
} from './integrations-model';
import { isReleaseAExposure } from '../../../../server/backoffice-exposure';
import { isGoogleReviewRetrievalEnabled } from '../../../../server/reputation/google-review-retrieval-config';

export const dynamic = 'force-dynamic';

export default async function SettingsIntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<IntegrationSearchParams>;
}) {
  const params = await searchParams;
  const { tenant } = await requireReputationTenant('/parametres/integrations');
  requireReputationPermission(tenant, 'reputation.connector.manage');
  const data = await loadGoogleIntegrationPageData(tenant, params);
  const releaseA = isReleaseAExposure();

  return (
    <BackofficePage
      title="Intégrations"
      description={
        releaseA
          ? 'Préparez la connexion Google de votre établissement.'
          : 'Connectez les services externes utilisés par votre établissement.'
      }
      actions={
        data.configured ? (
          <Button asChild variant={data.connector ? 'outline' : 'primary'}>
            <a href="/api/reputation/google/oauth/start">
              {data.connector ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              {data.connector ? 'Reconnecter Google' : 'Connecter Google'}
            </a>
          </Button>
        ) : undefined
      }
    >
      <IntegrationStatusAlerts
        resultMessage={
          releaseA
            ? releaseAIntegrationResultMessages[
                filterIntegrationSearchParam(params.google) ?? ''
              ]
            : data.resultMessage
        }
        configured={data.configured}
        discoveryError={data.discoveryError}
        releaseA={releaseA}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <GoogleConnectorPanel
          connector={data.connector}
          releaseA={releaseA}
          retrievalEnabled={isGoogleReviewRetrievalEnabled()}
        />
        <GoogleLocationSelectorPanel
          accounts={data.accounts}
          locations={data.locations}
          selectedAccount={data.selectedAccount}
          connector={data.connector}
        />
      </div>
    </BackofficePage>
  );
}
