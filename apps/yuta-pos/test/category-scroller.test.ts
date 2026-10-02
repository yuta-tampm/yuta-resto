import { describe, expect, it } from 'vitest';
import {
  categoryHref,
  isCategoryDragGesture,
} from '../src/app/orders/[orderId]/items/_components/CategoryScroller';

describe('category scroller drag intent', () => {
  it('keeps ordinary taps and small pointer movement clickable', () => {
    expect(isCategoryDragGesture(0, 0)).toBe(false);
    expect(isCategoryDragGesture(15, 1)).toBe(false);
    expect(isCategoryDragGesture(-8, 2)).toBe(false);
  });

  it('starts dragging only after a horizontal-dominant movement', () => {
    expect(isCategoryDragGesture(16, 2)).toBe(true);
    expect(isCategoryDragGesture(-24, 6)).toBe(true);
    expect(isCategoryDragGesture(20, 24)).toBe(false);
    expect(isCategoryDragGesture(20, 20)).toBe(false);
  });
});

describe('category suggestion dismissal navigation', () => {
  it('carries the current order-item version to every category', () => {
    expect(categoryHref('order-1', 'entry-1', '4-4-123')).toBe(
      '/orders/order-1/items?hideComboSuggestions=4-4-123&category=entry-1',
    );
    expect(categoryHref('order-1', 'all', '4-4-123')).toBe(
      '/orders/order-1/items?hideComboSuggestions=4-4-123',
    );
  });
});
