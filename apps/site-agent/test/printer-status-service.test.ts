import { describe, expect, it } from 'vitest';
import { derivePrinterOperationalStatus } from '../src/services/printer-status-service';

const healthy = {
  device: 'ready' as const,
  workerRunning: true,
  printing: 0,
  unresolvedFailure: false,
  stalePending: false,
};

describe('printer operational status', () => {
  it('reports ready without opening the physical device', () => {
    expect(derivePrinterOperationalStatus(healthy)).toBe('ready');
  });

  it('prioritizes unavailable device and active printing states', () => {
    expect(
      derivePrinterOperationalStatus({ ...healthy, device: 'missing' }),
    ).toBe('unavailable');
    expect(derivePrinterOperationalStatus({ ...healthy, printing: 1 })).toBe(
      'printing',
    );
  });

  it('requires attention for an unresolved failure or stale queue', () => {
    expect(
      derivePrinterOperationalStatus({
        ...healthy,
        unresolvedFailure: true,
      }),
    ).toBe('attention');
    expect(
      derivePrinterOperationalStatus({ ...healthy, stalePending: true }),
    ).toBe('attention');
  });

  it('reports missing configuration separately', () => {
    expect(
      derivePrinterOperationalStatus({
        ...healthy,
        device: 'not_configured',
        workerRunning: false,
      }),
    ).toBe('not_configured');
  });
});
