import { describe, expect, it } from 'vitest';
import { getComboSuggestionStatus } from '../src/app/management/combos/combo-model';

describe('combo suggestion management status', () => {
  it('keeps discount activation and suggestion eligibility distinct', () => {
    expect(
      getComboSuggestionStatus(
        { isActive: true, isSuggestionEnabled: true },
        false,
      ),
    ).toBe('Activée');
    expect(
      getComboSuggestionStatus(
        { isActive: true, isSuggestionEnabled: false },
        false,
      ),
    ).toBe('Désactivée');
    expect(
      getComboSuggestionStatus(
        { isActive: false, isSuggestionEnabled: true },
        false,
      ),
    ).toBe('Activée · formule inactive');
  });

  it('announces the pending save state before persisted data changes', () => {
    expect(
      getComboSuggestionStatus(
        { isActive: true, isSuggestionEnabled: true },
        true,
      ),
    ).toBe('Enregistrement…');
  });
});
