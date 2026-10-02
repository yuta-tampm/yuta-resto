import { SiteAgentClientError } from '../../../lib/site-agent-client';

export type CatalogActionState = {
  error: string | null;
  success: string | null;
  recovery?: 'refresh';
};

export function toCatalogActionError(error: unknown): CatalogActionState {
  if (error instanceof SiteAgentClientError) {
    if (error.code === 'CATALOG_CATEGORY_NOT_FOUND') {
      return {
        error: "La catégorie n'existe plus.",
        success: null,
        recovery: 'refresh',
      };
    }
    if (error.code === 'CATALOG_ITEM_NOT_FOUND') {
      return {
        error: "L'article n'existe plus.",
        success: null,
        recovery: 'refresh',
      };
    }

    const messages: Record<string, string> = {
      CATALOG_CATEGORY_NAME_CONFLICT: 'Cette catégorie existe déjà.',
      CATALOG_ITEM_NAME_CONFLICT:
        'Un article avec ce nom existe déjà dans cette catégorie.',
      DUPLICATE_VARIANT_CODE: 'Chaque option doit utiliser un code unique.',
      VARIANT_OPTIONS_REQUIRED:
        'Ajoutez au moins une option lorsque des choix sont requis.',
      VARIANT_QUANTITY_REQUIRED:
        'Indiquez le nombre de choix requis pour utiliser des options.',
      DUPLICATE_OPTION_CODE: 'Chaque option doit utiliser un code unique.',
      UNKNOWN_INSTRUCTION_CONFLICT:
        'Une option référence un conflit qui n’existe pas.',
      INSTRUCTION_OPTION_IN_USE:
        'Retirez cette option des catégories et articles avant de la supprimer.',
      UNKNOWN_INSTRUCTION_ASSIGNMENT:
        'Une catégorie ou un article utilise une option inconnue.',
      DUPLICATE_INSTRUCTION_ASSIGNMENT:
        'Une même option ne peut apparaître qu’une seule fois.',
      INSTRUCTION_INHERITANCE_INVALID:
        'Les deux listes doivent hériter ensemble de la catégorie.',
    };
    return {
      error: messages[error.code] ?? "L'opération n'a pas pu être effectuée.",
      success: null,
    };
  }

  return { error: 'Site-agent indisponible.', success: null };
}
