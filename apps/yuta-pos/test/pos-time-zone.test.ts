import { describe, expect, it } from 'vitest';
import { formatOrderTime } from '../src/app/orders/[orderId]/_lib/order-detail-presentation';

describe('POS displayed times', () => {
  it('use Europe/Paris wall-clock time whatever the runtime time zone', () => {
    // 10:05 UTC is 12:05 in Paris during summer time and 11:05 in winter.
    expect(formatOrderTime(new Date('2026-07-01T10:05:00.000Z'))).toBe('12:05');
    expect(formatOrderTime(new Date('2026-12-01T10:05:00.000Z'))).toBe('11:05');
  });
});
