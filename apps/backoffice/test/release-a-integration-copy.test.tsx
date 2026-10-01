import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GoogleConnectorPanel } from '../src/app/(authenticated)/parametres/integrations/_components/google-connector-panel';
import { IntegrationStatusAlerts } from '../src/app/(authenticated)/parametres/integrations/_components/integration-status-alerts';
import { releaseAIntegrationResultMessages } from '../src/app/(authenticated)/parametres/integrations/integrations-model';

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
    expect(markup).toContain('ne sont pas encore disponibles dans YUTA');
    expect(markup).not.toContain(
      'Import des avis et publication des réponses.',
    );
    expect(markup).not.toContain('jetons OAuth');
    expect(
      releaseAIntegrationResultMessages.location_selected?.description,
    ).toContain('ne sont pas encore disponibles');
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
