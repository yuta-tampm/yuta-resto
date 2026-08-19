import type { PrintJob } from '@yuta/db-pos/schema';
import { describe, expect, it } from 'vitest';
import {
  renderCustomerReceiptTicket,
  renderInternalKitchenTicket,
  renderInternalKitchenTickets,
  planPrinterPhases,
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
  it('renders one neutral non-fiscal customer receipt with payment totals', () => {
    const output = renderCustomerReceiptTicket({
      ...baseJob,
      jobType: 'customer_receipt',
      printerName: 'tm-m30-receipt',
      payload: {
        version: 1,
        documentType: 'non_fiscal',
        orderNumber: 'POS-1042',
        tableLabel: 'Table 8',
        orderType: 'dine_in',
        targetKind: 'order',
        targetLabel: 'Commande complète',
        createdAt: '2026-08-08T17:35:00.000Z',
        paidAt: '2026-08-08T18:02:00.000Z',
        items: [
          {
            name: 'Combo Été',
            quantity: 1,
            unitPriceCents: 1590,
            totalCents: 1590,
          },
        ],
        discounts: [{ name: 'Combo Été', amountCents: 100 }],
        subtotalCents: 1590,
        discountCents: 100,
        totalCents: 1490,
        payments: [
          {
            method: 'card',
            amountCents: 1490,
            tenderedCents: null,
            changeCents: null,
            tipCents: 0,
            paidBy: null,
            paidAt: '2026-08-08T18:02:00.000Z',
          },
        ],
        copies: 1,
        fontSizePreset: 'standard',
        topPaddingLines: 1,
        leftPaddingChars: 2,
        bottomPaddingLines: 2,
      },
    });
    const text = output.toString('ascii');

    expect(text).toContain('RECU DE PAIEMENT');
    expect(text).toContain('Document non fiscal');
    expect(text).toContain('1 x Combo Ete');
    expect(text).toContain('Remise Combo Ete');
    expect(text).toContain('-1,00 EUR');
    expect(text).toContain('TOTAL');
    expect(text).toContain('14,90 EUR');
    expect(text).toContain('Carte');
    expect(text).not.toContain('TVA');
    expect(text).not.toContain('SIRET');
    expect(countSequence(output, [0x1d, 0x56, 0x00])).toBe(1);
  });

  it('renders equal split receipts without inventing item allocation', () => {
    const output = renderCustomerReceiptTicket({
      ...baseJob,
      checkId: '019fa0b8-e6e2-7353-b6e8-c9a5698eb8e8',
      jobType: 'customer_receipt',
      printerName: 'tm-m30-receipt',
      payload: {
        version: 1,
        documentType: 'non_fiscal',
        orderNumber: 'POS-1042',
        tableLabel: 'Table 8',
        orderType: 'dine_in',
        targetKind: 'check',
        targetLabel: 'Part 1/2',
        createdAt: '2026-08-08T17:35:00.000Z',
        paidAt: '2026-08-08T18:02:00.000Z',
        items: [],
        discounts: [],
        subtotalCents: 745,
        discountCents: 0,
        totalCents: 745,
        payments: [
          {
            method: 'cash',
            amountCents: 745,
            tenderedCents: 1000,
            changeCents: 255,
            tipCents: 0,
            paidBy: null,
            paidAt: '2026-08-08T18:02:00.000Z',
          },
        ],
        copies: 1,
        fontSizePreset: 'standard',
        topPaddingLines: 1,
        leftPaddingChars: 2,
        bottomPaddingLines: 2,
      },
    });
    const text = output.toString('ascii');

    expect(text).toContain('Partage egal - detail articles non applicable');
    expect(text).toContain('Recu');
    expect(text).toContain('Rendu');
  });

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
    expect(text).toContain('  2 X PHO SPECIAL');
    expect(text).toContain('    !!! ALLERGIE: ALLERGIE, arachides');
    expect(text).not.toContain('BOISSONS');
    expect(text).not.toContain('MOCHI GLACE');
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
    expect(text.match(/COCA-COLA/g)).toHaveLength(2);
    expect(text.match(/MOCHI GLACE/g)).toHaveLength(2);
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
    expect(text).not.toContain('PHO SPECIAL');
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
    expect(text).toContain('PHO SPECIAL');
    expect(text).toContain('BOISSONS');
    expect(text).toContain('COCA-COLA');
    expect(text).toContain('DESSERTS');
    expect(text).toContain('MOCHI GLACE');
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

  it('uses tall standard item text without blank lines between items', () => {
    const item = (name: string): Record<string, unknown> => ({
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
      categoryName: 'Entrées',
    });
    const output = renderInternalKitchenTicket({
      ...baseJob,
      payload: {
        ...baseJob.payload,
        ticketDestination: 'kitchen',
        fontSizePreset: 'standard',
        items: [item('Premier article'), item('Deuxieme article')],
      },
    });
    expect(output).not.toBeNull();
    if (!output) throw new Error('Expected a compact standard ticket.');

    expect(countSequence(output, [0x1d, 0x21, 0x01])).toBe(3);
    const text = output.toString('ascii');
    const firstItemEnd =
      text.indexOf('PREMIER ARTICLE') + 'PREMIER ARTICLE'.length;
    const secondItemStart = text.indexOf('DEUXIEME ARTICLE');
    expect(firstItemEnd).toBeGreaterThan('PREMIER ARTICLE'.length - 1);
    expect(secondItemStart).toBeGreaterThan(firstItemEnd);
    expect(text.slice(firstItemEnd, secondItemStart)).not.toContain('\r\n\r\n');
    expect(text).not.toContain('Premier article');
  });

  it('centers a tall order type immediately before the item sections', () => {
    const output = renderInternalKitchenTicket({
      ...baseJob,
      payload: {
        ...baseJob.payload,
        ticketDestination: 'kitchen',
        fontSizePreset: 'standard',
      },
    });
    expect(output).not.toBeNull();
    if (!output) throw new Error('Expected an order-type preview ticket.');

    const text = output.toString('ascii');
    const orderTypeIndex = text.indexOf('SUR PLACE');
    const sectionIndex = text.indexOf('ENTREES');
    expect(orderTypeIndex).toBeGreaterThan(
      text.indexOf('NOTE: Service rapide'),
    );
    expect(sectionIndex).toBeGreaterThan(orderTypeIndex);
    expect(
      countSequence(
        output.subarray(Math.max(0, orderTypeIndex - 8), orderTypeIndex),
        [0x1d, 0x21, 0x01],
      ),
    ).toBe(1);
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
    expect(text).toContain("TIRET - APOSTROPHE ' DROITE");
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

  it('renders only enabled destinations for a test job', () => {
    const testJob = {
      ...baseJob,
      jobType: 'test',
      payload: {
        ...baseJob.payload,
        includeAllItems: true,
        ticketDestinations: ['counter'],
      },
    } satisfies PrintJob;
    const tickets = renderInternalKitchenTickets(testJob);
    expect(tickets).toHaveLength(1);
    expect(tickets[0]?.toString('ascii')).toContain('BAR');
    expect(tickets[0]?.toString('ascii')).not.toContain('CUISINE');
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
    const phases = planPrinterPhases(firstTicket);
    expect(phases).toHaveLength(2);
    expect(phases[0]).toEqual({ data: body, paced: true });
    expect(phases[1]).toEqual({ data: cut, paced: false });
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
