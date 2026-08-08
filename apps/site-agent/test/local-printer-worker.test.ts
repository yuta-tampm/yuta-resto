import type { PrintJob } from '@yuta/db-pos/schema';
import { describe, expect, it } from 'vitest';
import {
  renderInternalKitchenTicket,
  renderInternalKitchenTickets,
  splitPrinterTicket,
} from '../src/services/local-printer-worker';

const baseJob: PrintJob = {
  id: '019fa0b8-e6e2-7353-b6e8-c9a5698eb8e5',
  orderId: '019fa0b8-e6e2-7353-b6e8-c9a5698eb8e6',
  checkId: null,
  paymentId: null,
  source: 'pos',
  printerName: 'tm-m30-internal',
  jobType: 'kitchen_ticket',
  status: 'printing',
  payload: {
    orderId: '019fa0b8-e6e2-7353-b6e8-c9a5698eb8e6',
    orderNumber: '1042',
    tableLabel: 'Table 8',
    orderType: 'dine_in',
    orderNote: 'Service rapide',
    createdAt: '2026-08-08T17:35:00.000Z',
    items: [
      {
        name: 'Phở spécial',
        quantity: 2,
        note: 'Không hành',
        quickInstructions: [
          { code: 'SANS_OIGNON', labelSnapshot: 'Sans oignon' },
        ],
        selectedVariants: [],
        hasAllergy: true,
        allergenCodes: ['arachides'],
        allergySeverity: 'allergy',
        allergyNote: null,
        station: 'kitchen',
        categoryName: 'Nos entrées',
      },
      {
        name: 'Coca-Cola',
        quantity: 1,
        note: null,
        quickInstructions: [],
        selectedVariants: [],
        hasAllergy: false,
        allergenCodes: [],
        allergySeverity: null,
        allergyNote: null,
        station: 'bar',
        categoryName: 'Nos boissons',
      },
      {
        name: 'Mochi glacé',
        quantity: 1,
        note: null,
        quickInstructions: [],
        selectedVariants: [{ labelSnapshot: 'Mangue', quantity: 2 }],
        hasAllergy: false,
        allergenCodes: [],
        allergySeverity: null,
        allergyNote: null,
        station: 'dessert',
        categoryName: 'Nos desserts',
      },
      {
        name: 'Sac papier',
        quantity: 1,
        note: null,
        quickInstructions: [],
        selectedVariants: [],
        hasAllergy: false,
        allergenCodes: [],
        allergySeverity: null,
        allergyNote: null,
        station: 'none',
        categoryName: 'Suppléments',
      },
    ],
  },
  errorMessage: null,
  idempotencyKey: '019fa0b8-e6e2-7353-b6e8-c9a5698eb8e7',
  createdAt: new Date('2026-08-08T17:35:00.000Z'),
  printedAt: null,
};

describe('local TM-m30 print rendering', () => {
  it('renders a large kitchen ticket grouped by category', () => {
    const output = renderInternalKitchenTicket({
      ...baseJob,
      payload: {
        ...baseJob.payload,
        ticketDestination: 'kitchen',
        copies: 1,
        fontSizePreset: 'large',
        topPaddingLines: 2,
        leftPaddingChars: 4,
        bottomPaddingLines: 2,
      },
    });
    expect(output).not.toBeNull();
    if (!output) throw new Error('Expected a physical ticket.');
    const text = output.toString('ascii');

    expect([...output.subarray(0, 2)]).toEqual([0x1b, 0x40]);
    expect([...output.subarray(-3)]).toEqual([0x1d, 0x56, 0x00]);
    expect(countSequence(output, [0x1b, 0x64, 0x03])).toBe(1);
    expect(text).toContain('CUISINE');
    expect(text).toContain('ENTREES');
    expect(text).toContain('  2 x Pho special');
    expect(text).toContain('    !!! ALLERGIE: ALLERGIE, arachides');
    expect(text).not.toContain('BOISSONS');
    expect(text).not.toContain('Mochi glace');
    expect(text).not.toContain('Sac papier');
    expect(text).not.toContain('€');
  });

  it('renders and cuts the configured number of counter copies', () => {
    const output = renderInternalKitchenTicket({
      ...baseJob,
      payload: {
        ...baseJob.payload,
        ticketDestination: 'counter',
        copies: 2,
        fontSizePreset: 'standard',
      },
    });
    expect(output).not.toBeNull();
    if (!output) throw new Error('Expected counter tickets.');
    const text = output.toString('ascii');
    expect(text.match(/BOISSONS/g)).toHaveLength(4);
    expect(text.match(/DESSERTS/g)).toHaveLength(4);
    expect(text.match(/Coca-Cola/g)).toHaveLength(2);
    expect(text.match(/Mochi glace/g)).toHaveLength(2);
    const firstBoissonsSection = text.indexOf(
      'BOISSONS',
      text.indexOf('BOISSONS') + 1,
    );
    const firstDessertsSection = text.indexOf(
      'DESSERTS',
      text.indexOf('& DESSERTS') + '& DESSERTS'.length,
    );
    expect(firstBoissonsSection).toBeGreaterThan(-1);
    expect(firstDessertsSection).toBeGreaterThan(firstBoissonsSection);
    expect(countSequence(output, [0x1d, 0x56, 0x00])).toBe(2);
    expect(text).not.toContain('Pho special');
  });

  it('renders a full BAR ticket with kitchen, drink, and dessert items', () => {
    const output = renderInternalKitchenTicket({
      ...baseJob,
      payload: {
        ...baseJob.payload,
        ticketDestination: 'counter',
        includeAllItems: true,
        copies: 1,
        items: [
          ...(baseJob.payload.items as Record<string, unknown>[]),
          {
            name: 'Supplement test',
            quantity: 1,
            note: null,
            quickInstructions: [],
            selectedVariants: [],
            hasAllergy: false,
            allergenCodes: [],
            allergySeverity: null,
            allergyNote: null,
            station: 'kitchen',
            categoryName: 'Supplements',
          },
          {
            name: 'Plat test',
            quantity: 1,
            note: null,
            quickInstructions: [],
            selectedVariants: [],
            hasAllergy: false,
            allergenCodes: [],
            allergySeverity: null,
            allergyNote: null,
            station: 'kitchen',
            categoryName: 'Plats',
          },
        ],
      },
    });
    expect(output).not.toBeNull();
    if (!output) throw new Error('Expected a full BAR ticket.');
    const text = output.toString('ascii');
    expect(text).toContain('BAR');
    expect(text).toContain('ENTREES');
    expect(text).toContain('SUPPLEMENTS');
    expect(text).toContain('Pho special');
    expect(text).toContain('BOISSONS');
    expect(text).toContain('Coca-Cola');
    expect(text).toContain('DESSERTS');
    expect(text).toContain('Mochi glace');
    expect(text.indexOf('BOISSONS')).toBeLessThan(text.indexOf('ENTREES'));
    expect(text.indexOf('ENTREES')).toBeLessThan(text.indexOf('SUPPLEMENTS'));
    expect(text.indexOf('SUPPLEMENTS')).toBeLessThan(text.indexOf('PLATS'));
    expect(text.indexOf('PLATS')).toBeLessThan(text.indexOf('DESSERTS'));
    expect(countSequence(output, [0x1d, 0x56, 0x00])).toBe(1);
  });

  it('orders kitchen sections as entrees, supplements, then plats', () => {
    const kitchenItem = (
      name: string,
      categoryName: string,
    ): Record<string, unknown> => ({
      name,
      quantity: 1,
      note: null,
      quickInstructions: [],
      selectedVariants: [],
      hasAllergy: false,
      allergenCodes: [],
      allergySeverity: null,
      allergyNote: null,
      station: 'kitchen',
      categoryName,
    });
    const output = renderInternalKitchenTicket({
      ...baseJob,
      payload: {
        ...baseJob.payload,
        ticketDestination: 'kitchen',
        items: [
          kitchenItem('Plat test', 'Plats'),
          kitchenItem('Supplément test', 'Suppléments'),
          kitchenItem('Entrée test', 'Entrées'),
        ],
      },
    });
    expect(output).not.toBeNull();
    if (!output) throw new Error('Expected an ordered kitchen ticket.');
    const text = output.toString('ascii');
    expect(text.indexOf('ENTREES')).toBeLessThan(text.indexOf('SUPPLEMENTS'));
    expect(text.indexOf('SUPPLEMENTS')).toBeLessThan(text.indexOf('PLATS'));
  });

  it('transliterates receipt punctuation instead of printing question marks', () => {
    const output = renderInternalKitchenTicket({
      ...baseJob,
      payload: {
        ...baseJob.payload,
        ticketDestination: 'kitchen',
        items: [
          {
            name: 'Tiret \u2013 apostrophe \u2019 droite',
            quantity: 1,
            note: 'B\u0153uf \u00d7 2 \u2013 l\u2019\u00e9t\u00e9',
            quickInstructions: [],
            selectedVariants: [],
            hasAllergy: false,
            allergenCodes: [],
            allergySeverity: null,
            allergyNote: null,
            station: 'kitchen',
            categoryName: 'Entr\u00e9es',
          },
        ],
      },
    });
    expect(output).not.toBeNull();
    if (!output) throw new Error('Expected a punctuation test ticket.');
    const text = output.toString('ascii');
    expect(text).toContain("Tiret - apostrophe ' droite");
    expect(text).toContain("> NOTE: Boeuf x 2 - l'ete");
    expect(text).not.toContain('?');
  });

  it('renders a combined test job as two full-cut tickets', () => {
    const testJob = {
      ...baseJob,
      jobType: 'test',
      payload: { ...baseJob.payload, includeAllItems: true },
    } satisfies PrintJob;
    const tickets = renderInternalKitchenTickets(testJob);
    const output = renderInternalKitchenTicket(testJob);
    expect(output).not.toBeNull();
    if (!output) throw new Error('Expected two test tickets.');
    expect(tickets).toHaveLength(2);
    expect(output.toString('ascii')).toContain('CUISINE');
    expect(output.toString('ascii')).toContain('BAR');
    expect(countSequence(output, [0x1d, 0x56, 0x00])).toBe(2);
  });

  it('separates the cut command from the printable ticket body', () => {
    const output = renderInternalKitchenTicket(baseJob);
    expect(output).not.toBeNull();
    if (!output) throw new Error('Expected a physical ticket.');
    const firstTicket = renderInternalKitchenTickets(baseJob)[0];
    expect(firstTicket).toBeDefined();
    if (!firstTicket) throw new Error('Expected the first ticket.');
    const { body, cut } = splitPrinterTicket(firstTicket);
    expect(body.length).toBeGreaterThan(0);
    expect([...cut]).toEqual([0x1b, 0x64, 0x03, 0x1d, 0x56, 0x00]);
    expect(Buffer.concat([body, cut])).toEqual(firstTicket);
  });

  it('skips a physical ticket without internal production items', () => {
    expect(
      renderInternalKitchenTicket({
        ...baseJob,
        payload: {
          ...baseJob.payload,
          items: [
            {
              name: 'Sac papier',
              quantity: 1,
              note: null,
              quickInstructions: [],
              selectedVariants: [],
              hasAllergy: false,
              allergenCodes: [],
              allergySeverity: null,
              allergyNote: null,
              station: 'none',
              categoryName: 'Suppléments',
            },
          ],
        },
      }),
    ).toBeNull();
  });
});

function countSequence(buffer: Buffer, sequence: number[]): number {
  let count = 0;
  for (let index = 0; index <= buffer.length - sequence.length; index += 1) {
    if (sequence.every((value, offset) => buffer[index + offset] === value)) {
      count += 1;
    }
  }
  return count;
}
