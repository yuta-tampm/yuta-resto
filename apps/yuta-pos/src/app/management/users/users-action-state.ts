import { SiteAgentClientError } from '../../../lib/site-agent-client';

export type LocalUserActionState = {
  error: string | null;
  success: string | null;
  recovery?: 'refresh';
};

export const initialLocalUserActionState: LocalUserActionState = {
  error: null,
  success: null,
};

export function toLocalUserActionError(error: unknown): LocalUserActionState {
  if (error instanceof SiteAgentClientError) {
    if (error.code === 'LOCAL_USER_NOT_FOUND') {
      return {
        error: "L'utilisateur n'existe plus.",
        success: null,
        recovery: 'refresh',
      };
    }

    const messages: Record<string, string> = {
      LOCAL_USER_EMAIL_CONFLICT: 'Cette adresse e-mail est déjà utilisée.',
      LAST_ACTIVE_ADMIN_REQUIRED:
        'Le dernier administrateur actif ne peut pas être désactivé ou rétrogradé.',
      LOCAL_USER_MANAGEMENT_FORBIDDEN:
        "Vous n'avez pas le droit de gérer ce rôle.",
    };
    return {
      error: messages[error.code] ?? "L'opération n'a pas pu être effectuée.",
      success: null,
    };
  }

  return { error: 'Site-agent indisponible.', success: null };
}
