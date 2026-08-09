import { describe, expect, it } from 'vitest';
import {
  hasIncompleteVariantSelection,
  kitchenSendFeedback,
} from '../src/app/orders/[orderId]/items/kitchen-send-validation';

describe('kitchen send validation', () => {
  it('blocks a pending item until its configured choices are selected', () => {
    expect(
      hasIncompleteVariantSelection([
        {
          quantity: 1,
          status: 'pending',
          selectedVariants: [],
          requiredVariantQuantity: 2,
          variantOptionCodes: ['MANGUE', 'MATCHA'],
        },
      ]),
    ).toBe(true);

    expect(
      hasIncompleteVariantSelection([
        {
          quantity: 1,
          status: 'pending',
          selectedVariants: [
            { code: 'MANGUE', quantity: 1 },
            { code: 'MATCHA', quantity: 1 },
          ],
          requiredVariantQuantity: 2,
          variantOptionCodes: ['MANGUE', 'MATCHA'],
        },
      ]),
    ).toBe(false);
  });

  it('requires two selected flavours for every ordered portion', () => {
    expect(
      hasIncompleteVariantSelection([
        {
          quantity: 2,
          status: 'pending',
          selectedVariants: [{ code: 'MANGUE', quantity: 3 }],
          requiredVariantQuantity: 2,
          variantOptionCodes: ['MANGUE', 'MATCHA'],
        },
      ]),
    ).toBe(true);
  });

  it('rejects a pending selection removed from the catalog policy', () => {
    expect(
      hasIncompleteVariantSelection([
        {
          quantity: 1,
          status: 'pending',
          selectedVariants: [{ code: 'OLD_OPTION', quantity: 2 }],
          requiredVariantQuantity: 2,
          variantOptionCodes: ['MANGUE', 'MATCHA'],
        },
      ]),
    ).toBe(true);
  });

  it('returns actionable French feedback instead of exposing the API error', () => {
    expect(kitchenSendFeedback('INVALID_VARIANT_QUANTITY', true)).toEqual({
      title: 'Choix requis',
      description:
        'Ouvrez « Notes / allergie » sous l’article signalé et complétez les choix requis avant l’envoi.',
    });
    expect(kitchenSendFeedback('UNKNOWN_FAILURE', false)?.title).toBe(
      'Envoi impossible',
    );
  });
});
