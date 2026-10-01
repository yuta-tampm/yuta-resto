import 'server-only';

import { findGoogleReputationConnector } from '@yuta/db-cloud';
import type { TenantContext } from '@yuta/tenant';
import { cloudDatabase } from '../cloud-database';

export type ReleaseASetupSummary = {
  title: string;
  description: string;
  setupHref: '/parametres/integrations' | null;
};

export async function loadReleaseASetupSummary(
  tenant: TenantContext,
): Promise<ReleaseASetupSummary> {
  const canManage =
    tenant.actor.type === 'user' && tenant.actor.role === 'OWNER';
  try {
    const connector = await findGoogleReputationConnector(
      cloudDatabase,
      tenant,
    );
    const bound =
      connector?.status === 'CONNECTED' &&
      Boolean(connector.externalAccountId) &&
      Boolean(connector.externalLocationId);
    if (bound) {
      return {
        title: 'Établissement Google associé',
        description:
          'La récupération des avis Google n’est pas encore disponible. Les avis déjà enregistrés restent consultables ; aucun résultat d’import n’est confirmé.',
        setupHref: null,
      };
    }
    return {
      title: connector
        ? 'Connexion Google à finaliser'
        : 'Connexion Google à préparer',
      description: canManage
        ? 'Ouvrez les intégrations pour autoriser Google et sélectionner votre établissement. Cette préparation ne récupère pas les avis.'
        : 'Demandez au propriétaire de l’établissement de préparer la connexion Google. Cette préparation ne récupère pas les avis.',
      setupHref: canManage ? '/parametres/integrations' : null,
    };
  } catch (error: unknown) {
    console.error('Unable to load Google setup summary.', error);
    return {
      title: 'État de la connexion indisponible',
      description:
        'Réessayez dans quelques instants. Si le problème persiste, contactez votre responsable ou le support YUTA.',
      setupHref: null,
    };
  }
}
