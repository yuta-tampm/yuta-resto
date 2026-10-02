import 'server-only';

import { findGoogleReputationConnector } from '@yuta/db-cloud';
import type { TenantContext } from '@yuta/tenant';
import { hasReputationPermission } from '../auth/permissions';
import { cloudDatabase } from '../cloud-database';
import { isGoogleReviewRetrievalEnabled } from './google-review-retrieval-config';

export type ReleaseASetupSummary = {
  title: string;
  description: string;
  setupHref: '/parametres/integrations' | null;
};

export async function loadReleaseASetupSummary(
  tenant: TenantContext,
): Promise<ReleaseASetupSummary> {
  const canManage = hasReputationPermission(
    tenant,
    'reputation.connector.manage',
  );
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
      const cannotRetrieve = !hasReputationPermission(
        tenant,
        'reputation.google.retrieve',
      );
      return {
        title: 'Établissement Google associé',
        description: cannotRetrieve
          ? 'Vos avis attribués et votre travail dans YUTA restent accessibles. Pour récupérer du contenu Google, contactez un propriétaire ou un responsable.'
          : isGoogleReviewRetrievalEnabled()
            ? 'Une visite dans Avis peut récupérer les avis Google si nécessaire. Votre travail dans YUTA reste accessible ; l’association seule ne confirme aucun résultat de récupération.'
            : 'La récupération Google est indisponible. Votre travail dans YUTA reste accessible ; l’association seule ne confirme aucun résultat de récupération.',
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
    console.error('Unable to load Google setup summary.', {
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });
    return {
      title: 'État de la connexion indisponible',
      description:
        'Réessayez dans quelques instants. Si le problème persiste, contactez votre responsable ou le support YUTA.',
      setupHref: null,
    };
  }
}
