import { SiteAgentClientError } from '../../../lib/site-agent-client';

export type ComboActionState = {
  error: string | null;
  success: string | null;
  recovery?: 'refresh';
};

export function toComboActionError(error: unknown): ComboActionState {
  if (error instanceof SiteAgentClientError) {
    const messages: Record<string, string> = {
      COMBO_RULE_NAME_CONFLICT: 'Une formule avec ce nom existe déjà.',
      COMBO_GROUP_NAME_CONFLICT: 'Un groupe avec ce nom existe déjà.',
      COMBO_GROUP_ITEM_CONFLICT: 'Cet article est déjà présent dans le groupe.',
      COMBO_RULE_MUST_BE_INACTIVE:
        'Désactivez la formule avant de modifier sa structure.',
      COMBO_RULE_STRUCTURE_REQUIRED:
        'Ajoutez des groupes et des articles valides avant d’activer la formule.',
      COMBO_BASE_GROUP_INVALID:
        'Le groupe de prix de base doit correspondre à un groupe existant.',
      COMBO_GROUP_QUANTITY_INVALID:
        'Le maximum doit être supérieur ou égal au minimum.',
      COMBO_RULE_NOT_FOUND: "La formule n'existe plus.",
      COMBO_GROUP_NOT_FOUND: "Le groupe n'existe plus.",
      COMBO_GROUP_ITEM_NOT_FOUND: "L'article éligible n'existe plus.",
      CATALOG_ITEM_NOT_FOUND: "L'article du catalogue n'existe plus.",
    };
    const recovery = error.code.endsWith('_NOT_FOUND') ? 'refresh' : undefined;

    return {
      error: messages[error.code] ?? "L'opération n'a pas pu être effectuée.",
      success: null,
      recovery,
    };
  }

  return { error: 'Site-agent indisponible.', success: null };
}
