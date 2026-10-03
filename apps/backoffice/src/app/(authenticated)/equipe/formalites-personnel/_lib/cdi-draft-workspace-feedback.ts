import type { FormalitesPersonnelDraftMutationActionResult } from './cdi-draft-workspace-action-result';

export type WorkspaceFeedback = {
  tone: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  recoverable: boolean;
};

export function workspaceSavedFeedback(): WorkspaceFeedback {
  return {
    tone: 'success',
    title: 'Modifications enregistrées',
    description:
      'Le brouillon affiché correspond maintenant à la version enregistrée.',
    recoverable: false,
  };
}

export function workspaceReloadedFeedback(): WorkspaceFeedback {
  return {
    tone: 'info',
    title: 'Données actualisées',
    description: 'La dernière version enregistrée est affichée.',
    recoverable: false,
  };
}

export function incompleteReconciliationFeedback(): WorkspaceFeedback {
  return {
    tone: 'danger',
    title: 'Choix incomplet',
    description:
      'Choisissez une action pour chaque information différente avant de continuer.',
    recoverable: false,
  };
}

export function abandonmentReasonRequiredFeedback(): WorkspaceFeedback {
  return {
    tone: 'danger',
    title: 'Motif requis',
    description: 'Saisissez un motif entre 1 et 250 caractères.',
    recoverable: false,
  };
}

export function workspaceFeedbackForOutcome(
  outcome: Exclude<
    FormalitesPersonnelDraftMutationActionResult,
    { kind: 'success' }
  >,
): WorkspaceFeedback {
  switch (outcome.kind) {
    case 'forbidden':
      return {
        tone: 'danger',
        title: 'Action non autorisée',
        description:
          'Votre accès actuel ne permet pas de modifier ce brouillon.',
        recoverable: false,
      };
    case 'validation_error':
      return {
        tone: 'danger',
        title: 'Informations à vérifier',
        description: 'Corrigez les champs indiqués puis réessayez.',
        recoverable: false,
      };
    case 'active_draft_exists':
      return {
        tone: 'info',
        title: 'Brouillon existant retrouvé',
        description:
          'Le brouillon actif déjà enregistré est maintenant affiché.',
        recoverable: false,
      };
    case 'stale_draft':
      return {
        tone: 'warning',
        title: 'Le brouillon a été modifié ailleurs',
        description:
          'Rechargez la version enregistrée avant de reprendre vos modifications.',
        recoverable: true,
      };
    case 'stale_personnel_source':
      return {
        tone: 'warning',
        title: 'Le dossier salarié a encore changé',
        description:
          'Vérifiez les nouvelles différences. Aucun choix n’a été partiellement enregistré.',
        recoverable: true,
      };
    case 'ineligible_recovery':
      return {
        tone: 'warning',
        title: 'Modification interrompue',
        description:
          'Le salarié n’est plus en CDI. Le brouillon enregistré reste consultable ou peut être abandonné.',
        recoverable: false,
      };
    case 'draft_abandoned':
      return {
        tone: 'info',
        title: 'Brouillon déjà abandonné',
        description: 'La version conservée en lecture seule est affichée.',
        recoverable: false,
      };
    case 'replay_conflict':
      return {
        tone: 'danger',
        title: 'Envoi à reprendre',
        description:
          'Cette tentative ne correspond plus à l’action initiale. Rechargez avant de recommencer.',
        recoverable: true,
      };
    case 'not_found':
      return {
        tone: 'danger',
        title: 'Dossier indisponible',
        description:
          'Ce brouillon n’est plus disponible dans cet établissement.',
        recoverable: false,
      };
    case 'server_error':
      return {
        tone: 'danger',
        title: 'Enregistrement incertain',
        description:
          'La réponse du serveur n’a pas pu être confirmée. Réessayez la même action sans modifier les valeurs.',
        recoverable: true,
      };
  }
  return {
    tone: 'danger',
    title: 'Action interrompue',
    description: 'Rechargez la version enregistrée avant de réessayer.',
    recoverable: true,
  };
}
