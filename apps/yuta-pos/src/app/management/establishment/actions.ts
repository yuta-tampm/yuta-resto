'use server';

import { updateLocalEstablishmentProfileInputSchema } from '@yuta/contracts/local-pos';
import { revalidatePath } from 'next/cache';
import {
  siteAgentClient,
  SiteAgentClientError,
} from '../../../lib/site-agent-client';
import { requireLocalManagementCredentials } from '../../../server/local-management-session';
import type { EstablishmentProfileActionState } from './_lib/establishment-profile-action-state';

export async function saveEstablishmentProfileAction(
  _previousState: EstablishmentProfileActionState,
  formData: FormData,
): Promise<EstablishmentProfileActionState> {
  const input = updateLocalEstablishmentProfileInputSchema.safeParse({
    displayName: formData.get('displayName'),
    revision: formData.get('revision'),
  });
  if (!input.success) {
    return {
      status: 'error',
      message: 'Vérifiez le nom saisi.',
      fieldError:
        'Le nom doit contenir entre 1 et 80 caractères, sans retour à la ligne.',
      profile: null,
    };
  }

  try {
    const { token } = await requireLocalManagementCredentials();
    const profile = await siteAgentClient.updateEstablishmentProfile(
      token,
      input.data,
    );
    revalidatePath('/management/establishment');
    return {
      status: 'success',
      message:
        'Nom enregistré. Il sera utilisé pour les nouveaux reçus de paiement.',
      fieldError: null,
      profile,
    };
  } catch (error: unknown) {
    if (
      error instanceof SiteAgentClientError &&
      error.code === 'ESTABLISHMENT_PROFILE_CONFLICT'
    ) {
      return {
        status: 'conflict',
        message:
          'Le nom a été modifié depuis l’ouverture de cette page. Rechargez les données avant de réessayer.',
        fieldError: null,
        profile: null,
      };
    }
    if (error instanceof SiteAgentClientError) {
      return {
        status: 'error',
        message: 'Impossible d’enregistrer le nom dans le POS local.',
        fieldError: null,
        profile: null,
      };
    }
    return {
      status: 'error',
      message: 'Le service local est indisponible. Réessayez plus tard.',
      fieldError: null,
      profile: null,
    };
  }
}
