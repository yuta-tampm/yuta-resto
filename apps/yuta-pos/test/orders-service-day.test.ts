import { getServiceDayWindow } from '@yuta/core';
import { describe, expect, it } from 'vitest';
import { isOrderVisibleInServiceDay } from '../src/app/orders-service-day';

const currentServiceDay = getServiceDayWindow(new Date(2026, 7, 9, 9, 30));

function order(status: string, createdAt: Date, paidAt: Date | null = null) {
  return {
    status,
    createdAt,
    paidAt,
  };
}

describe('orders home service-day filtering', () => {
  it('hides an unfinished order created before the 05:00 cutoff', () => {
    expect(
      isOrderVisibleInServiceDay(
        order('sent', new Date(2026, 7, 9, 4, 59, 59)),
        'open',
        currentServiceDay,
      ),
    ).toBe(false);
    expect(
      isOrderVisibleInServiceDay(
        order('sent', new Date(2026, 7, 9, 5)),
        'open',
        currentServiceDay,
      ),
    ).toBe(true);
    expect(
      isOrderVisibleInServiceDay(
        order('sent', new Date(2026, 7, 10, 5)),
        'open',
        currentServiceDay,
      ),
    ).toBe(false);
  });

  it('uses the payment time for the paid service-day view', () => {
    expect(
      isOrderVisibleInServiceDay(
        order('paid', new Date(2026, 7, 8, 18), new Date(2026, 7, 9, 6)),
        'paid_today',
        currentServiceDay,
      ),
    ).toBe(true);
  });

  it('keeps after-midnight activity in the previous service day', () => {
    const overnightServiceDay = getServiceDayWindow(new Date(2026, 7, 10, 2));
    expect(
      isOrderVisibleInServiceDay(
        order('draft', new Date(2026, 7, 10, 1, 30)),
        'all_today',
        overnightServiceDay,
      ),
    ).toBe(true);
  });
});
