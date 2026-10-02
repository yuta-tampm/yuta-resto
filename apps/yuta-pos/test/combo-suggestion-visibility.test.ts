import { describe, expect, it } from 'vitest';
import {
  comboSuggestionDismissalToken,
  hiddenComboSuggestionKeys,
} from '../src/app/orders/[orderId]/items/_lib/combo-suggestion-visibility';

describe('combo suggestion visibility', () => {
  it('dismisses the currently visible combo rules', () => {
    expect(
      comboSuggestionDismissalToken([{ dismissalKey: 'gua-bao-happy:bao=1' }]),
    ).toBe('gua-bao-happy:bao=1');
  });

  it('keeps an existing dismissal when unrelated order items change', () => {
    expect(comboSuggestionDismissalToken([], 'gua-bao-happy:bao=1')).toBe(
      'gua-bao-happy:bao=1',
    );
    expect(hiddenComboSuggestionKeys('gua-bao-happy:bao=1')).toEqual(
      new Set(['gua-bao-happy:bao=1']),
    );
  });

  it('adds newly visible rules without reviving a dismissed rule', () => {
    expect(
      comboSuggestionDismissalToken(
        [{ dismissalKey: 'gua-bao-happy:bao=2' }],
        'gua-bao-happy:bao=1',
      ),
    ).toBe('gua-bao-happy:bao=1,gua-bao-happy:bao=2');
  });
});
