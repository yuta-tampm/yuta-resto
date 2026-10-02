import { describe, expect, it } from 'vitest';
import { toComboActionError } from '../src/app/management/combos/combo-action-state';
import { SiteAgentClientError } from '../src/lib/site-agent-client';

describe('combo action state', () => {
  it.each([
    ['COMBO_RULE_NOT_FOUND', "La formule n'existe plus."],
    ['COMBO_GROUP_NOT_FOUND', "Le groupe n'existe plus."],
    ['COMBO_GROUP_ITEM_NOT_FOUND', "L'article éligible n'existe plus."],
    ['CATALOG_ITEM_NOT_FOUND', "L'article du catalogue n'existe plus."],
  ])('offers refresh recovery for %s', (code, message) => {
    expect(
      toComboActionError(new SiteAgentClientError(404, code, message)),
    ).toEqual({ error: message, success: null, recovery: 'refresh' });
  });

  it('keeps a name conflict in the current editor', () => {
    expect(
      toComboActionError(
        new SiteAgentClientError(409, 'COMBO_RULE_NAME_CONFLICT', 'x'),
      ),
    ).toEqual({
      error: 'Une formule avec ce nom existe déjà.',
      success: null,
    });
  });

  it('maps invalid activation without refresh recovery', () => {
    expect(
      toComboActionError(
        new SiteAgentClientError(422, 'COMBO_RULE_STRUCTURE_REQUIRED', 'x'),
      ),
    ).toEqual({
      error:
        'Ajoutez des groupes et des articles valides avant d’activer la formule.',
      success: null,
    });
  });

  it('maps an unavailable local service truthfully', () => {
    expect(toComboActionError(new Error('offline'))).toEqual({
      error: 'Site-agent indisponible.',
      success: null,
    });
  });
});
