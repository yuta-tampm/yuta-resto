import { Badge, Panel } from '@yuta/ui';
import {
  getGoogleConnectorPresentation,
  type GoogleConnectorSummary,
} from '../integrations-model';

export function GoogleConnectorPanel({
  connector,
  releaseA = false,
}: {
  connector: GoogleConnectorSummary | null;
  releaseA?: boolean;
}) {
  const presentation = getGoogleConnectorPresentation(connector);

  return (
    <Panel
      title="Google Business Profile"
      description={
        releaseA
          ? 'Autorisation Google et sélection de votre établissement.'
          : 'Import des avis et publication des réponses.'
      }
      bodyClassName="gap-4 p-5"
    >
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={presentation.connected ? 'success' : 'neutral'}>
          {presentation.label}
        </Badge>
        {!releaseA && connector?.tokenExpiresAt && (
          <span className="text-sm text-secondary">
            Jeton valable jusqu’au{' '}
            {new Intl.DateTimeFormat('fr-FR', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(connector.tokenExpiresAt)}
          </span>
        )}
      </div>
      {presentation.connected ? (
        <div className="rounded-lg bg-surface-muted p-4 text-sm">
          <p className="font-semibold text-primary">
            Ressource Google sélectionnée
          </p>
          <p className="mt-2 break-all text-secondary">
            {connector?.externalAccountId}
          </p>
          <p className="mt-1 break-all text-secondary">
            {connector?.externalLocationId}
          </p>
        </div>
      ) : (
        <p className="text-sm text-secondary">
          {releaseA
            ? 'Autorisez Google puis sélectionnez l’établissement correspondant à votre restaurant.'
            : 'L’autorisation Google et la sélection d’un établissement sont nécessaires avant la synchronisation.'}
        </p>
      )}
      <p className="text-xs text-muted">
        {releaseA
          ? 'Cette connexion prépare l’accès Google. La récupération des avis et la publication des réponses ne sont pas encore disponibles dans YUTA.'
          : 'Les jetons OAuth sont chiffrés avant leur stockage et ne sont jamais envoyés au navigateur.'}
      </p>
    </Panel>
  );
}
