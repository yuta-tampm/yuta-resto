import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import { printJobs, type PrintJob } from '@yuta/db-pos/schema';
import { and, asc, eq, inArray } from 'drizzle-orm';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { z } from 'zod';

const kitchenPrintPayloadSchema = z
  .object({
    orderNumber: z.string().min(1),
    tableLabel: z.string().nullable(),
    orderType: z.enum(['dine_in', 'takeaway', 'delivery']),
    orderNote: z.string().nullable(),
    createdAt: z.string().datetime(),
    items: z.array(
      z
        .object({
          name: z.string().min(1),
          quantity: z.number().int().positive(),
          note: z.string().nullable(),
          quickInstructions: z.array(
            z.object({ labelSnapshot: z.string().min(1) }).passthrough(),
          ),
          selectedVariants: z.array(
            z
              .object({
                labelSnapshot: z.string().min(1),
                quantity: z.number().int().positive(),
              })
              .passthrough(),
          ),
          hasAllergy: z.boolean(),
          allergenCodes: z.array(z.string()),
          selectedAllergens: z
            .array(
              z.object({
                code: z.string().min(1),
                labelSnapshot: z.string().min(1),
              }),
            )
            .default([]),
          allergySeverity: z
            .enum([
              'intolerance',
              'allergy',
              'severe_no_traces',
              'mild',
              'severe',
            ])
            .nullable(),
          allergyNote: z.string().nullable(),
          station: z.enum(['kitchen', 'bar', 'dessert', 'none']),
          categoryName: z.string().min(1).default('Autres'),
        })
        .passthrough(),
    ),
    ticketDestination: z.enum(['kitchen', 'counter']).optional(),
    ticketDestinations: z
      .array(z.enum(['kitchen', 'counter']))
      .min(1)
      .max(2)
      .optional(),
    includeAllItems: z.boolean().default(false),
    copies: z.number().int().min(1).max(3).default(1),
    fontSizePreset: z
      .enum(['compact', 'standard', 'large'])
      .default('standard'),
    topPaddingLines: z.number().int().min(0).max(8).default(1),
    leftPaddingChars: z.number().int().min(0).max(8).default(2),
    bottomPaddingLines: z.number().int().min(0).max(8).default(3),
  })
  .passthrough();

export const customerReceiptPayloadSchema = z
  .object({
    version: z.literal(1),
    documentType: z.literal('non_fiscal'),
    orderNumber: z.string().min(1),
    tableLabel: z.string().min(1),
    orderType: z.enum(['dine_in', 'takeaway', 'delivery']),
    targetKind: z.enum(['order', 'check']),
    targetLabel: z.string().min(1),
    createdAt: z.string().datetime(),
    paidAt: z.string().datetime(),
    items: z.array(
      z.object({
        name: z.string().min(1),
        quantity: z.number().int().positive(),
        unitPriceCents: z.number().int().nonnegative(),
        totalCents: z.number().int().nonnegative(),
      }),
    ),
    discounts: z.array(
      z.object({
        name: z.string().min(1),
        amountCents: z.number().int().nonnegative(),
      }),
    ),
    subtotalCents: z.number().int().nonnegative(),
    discountCents: z.number().int().nonnegative(),
    totalCents: z.number().int().nonnegative(),
    payments: z.array(
      z.object({
        method: z.enum(['cash', 'card', 'ticket_resto', 'other']),
        amountCents: z.number().int().positive(),
        tenderedCents: z.number().int().nonnegative().nullable(),
        changeCents: z.number().int().nonnegative().nullable(),
        tipCents: z.number().int().nonnegative(),
        paidBy: z.string().nullable(),
        paidAt: z.string().datetime(),
      }),
    ),
    copies: z.literal(1),
    fontSizePreset: z.enum(['compact', 'standard', 'large']),
    topPaddingLines: z.number().int().min(0).max(8),
    leftPaddingChars: z.number().int().min(0).max(8),
    bottomPaddingLines: z.number().int().min(0).max(8),
  })
  .passthrough();

type PrinterWriter = (devicePath: string, data: Buffer) => Promise<void>;
const defaultInterTicketDelayMs = 800;
const printerBodyChunkSize = 128;
const printerBodyChunkDelayMs = 20;
const printerDeviceOpenDelayMs = 300;
const printerCutSettleDelayMs = 1_000;
const printerCutSequence = Buffer.from([0x1b, 0x64, 0x03, 0x1d, 0x56, 0x00]);

export function createLocalPrinterWorker(input: {
  db: PosDatabaseExecutor;
  devicePath: string;
  pollIntervalMs: number;
  write?: PrinterWriter;
  interTicketDelayMs?: number;
  orderIdScope?: string;
}) {
  const write = input.write ?? writePrinterDevice;
  const interTicketDelayMs =
    input.interTicketDelayMs ?? defaultInterTicketDelayMs;
  let timer: NodeJS.Timeout | null = null;
  let activeRun: Promise<void> | null = null;
  let stopped = true;

  async function processNext(): Promise<boolean> {
    const candidate = await input.db.query.printJobs.findFirst({
      where: and(
        eq(printJobs.status, 'pending'),
        inArray(printJobs.jobType, [
          'kitchen_ticket',
          'customer_receipt',
          'test',
        ]),
        ...(input.orderIdScope
          ? [eq(printJobs.orderId, input.orderIdScope)]
          : []),
      ),
      orderBy: [asc(printJobs.createdAt), asc(printJobs.id)],
    });
    if (!candidate) return false;

    const [claimed] = await input.db
      .update(printJobs)
      .set({ status: 'printing', errorMessage: null })
      .where(
        and(eq(printJobs.id, candidate.id), eq(printJobs.status, 'pending')),
      )
      .returning();
    if (!claimed) return false;

    try {
      const outputs = renderInternalPrintTickets(claimed);
      for (const output of outputs) {
        await write(input.devicePath, output);
        await wait(interTicketDelayMs);
      }
      await input.db
        .update(printJobs)
        .set({
          status: 'printed',
          printedAt: new Date(),
          errorMessage: null,
        })
        .where(
          and(eq(printJobs.id, claimed.id), eq(printJobs.status, 'printing')),
        );
    } catch (error: unknown) {
      await input.db
        .update(printJobs)
        .set({ status: 'failed', errorMessage: printErrorMessage(error) })
        .where(
          and(eq(printJobs.id, claimed.id), eq(printJobs.status, 'printing')),
        );
    }
    return true;
  }

  async function tick(): Promise<void> {
    if (stopped || activeRun) return;
    activeRun = processNext()
      .then((processed) => {
        if (processed && !stopped) queueMicrotask(() => void tick());
      })
      .catch((error: unknown) => {
        console.error('Local print worker polling failed.', error);
      })
      .finally(() => {
        activeRun = null;
      });
    await activeRun;
  }

  async function start(): Promise<void> {
    if (!stopped) return;
    stopped = false;
    try {
      await input.db
        .update(printJobs)
        .set({
          status: 'failed',
          errorMessage:
            'Print worker restarted before completion. Retry the job.',
        })
        .where(
          and(
            eq(printJobs.status, 'printing'),
            inArray(printJobs.jobType, [
              'kitchen_ticket',
              'customer_receipt',
              'test',
            ]),
            ...(input.orderIdScope
              ? [eq(printJobs.orderId, input.orderIdScope)]
              : []),
          ),
        );
    } catch (error: unknown) {
      console.error('Local print worker recovery failed.', error);
    }
    timer = setInterval(() => void tick(), input.pollIntervalMs);
    await tick();
  }

  async function stop(): Promise<void> {
    stopped = true;
    if (timer) clearInterval(timer);
    timer = null;
    await activeRun;
  }

  return { processNext, start, stop };
}

export function renderInternalKitchenTicket(job: PrintJob): Buffer | null {
  const tickets = renderInternalKitchenTickets(job);
  return tickets.length > 0 ? Buffer.concat(tickets) : null;
}

export function renderInternalPrintTickets(job: PrintJob): Buffer[] {
  if (job.jobType === 'customer_receipt') {
    const payload = customerReceiptPayloadSchema.parse(job.payload);
    return Array.from({ length: payload.copies }, () =>
      renderCustomerReceipt(payload),
    );
  }
  return renderInternalKitchenTickets(job);
}

export function renderCustomerReceiptTicket(job: PrintJob): Buffer {
  if (job.jobType !== 'customer_receipt') {
    throw new Error('Expected a customer_receipt print job.');
  }
  return renderCustomerReceipt(customerReceiptPayloadSchema.parse(job.payload));
}

export function renderCustomerReceiptPayload(
  payload: z.infer<typeof customerReceiptPayloadSchema>,
): Buffer {
  return renderCustomerReceipt(customerReceiptPayloadSchema.parse(payload));
}

export function renderInternalKitchenTickets(job: PrintJob): Buffer[] {
  const payload = kitchenPrintPayloadSchema.parse(job.payload);
  const destinations = payload.ticketDestination
    ? [payload.ticketDestination]
    : (payload.ticketDestinations ?? (['kitchen', 'counter'] as const));
  const tickets = destinations.flatMap((destination) => {
    const items = payload.items.filter((item) =>
      destination === 'kitchen'
        ? item.station === 'kitchen'
        : payload.includeAllItems
          ? item.station !== 'none'
          : item.station === 'bar' || item.station === 'dessert',
    );
    if (items.length === 0) return [];
    return Array.from({ length: payload.copies }, () =>
      renderProductionTicket(payload, destination, items),
    );
  });
  return tickets;
}

async function wait(milliseconds: number): Promise<void> {
  if (milliseconds <= 0) return;
  await new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

async function writePrinterDevice(
  devicePath: string,
  data: Buffer,
): Promise<void> {
  const phases = planPrinterPhases(data);
  for (let index = 0; index < phases.length; index += 1) {
    const phase = phases[index];
    if (!phase) continue;
    if (index > 0) await wait(printerCutSettleDelayMs);
    await writePrinterPhase(devicePath, phase.data, phase.paced);
  }
}

async function writePrinterPhase(
  devicePath: string,
  data: Buffer,
  paced: boolean,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const writer = spawn(
      'timeout',
      ['--kill-after=2s', '15s', 'tee', devicePath],
      {
        stdio: ['pipe', 'ignore', 'pipe'],
      },
    );
    let stderr = '';
    writer.stderr.setEncoding('utf8');
    writer.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });
    writer.once('error', reject);
    writer.stdin.once('error', reject);
    writer.once('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          code === 124
            ? 'Printer write timed out after 10 seconds.'
            : `Printer writer exited with code ${code ?? 'unknown'}${stderr ? `: ${stderr.trim()}` : '.'}`,
        ),
      );
    });
    void writePhaseData(writer.stdin, data, paced).catch((error: unknown) => {
      writer.stdin.destroy();
      reject(error);
    });
  });
}

async function writePhaseData(
  stream: NodeJS.WritableStream,
  data: Buffer,
  paced: boolean,
): Promise<void> {
  await wait(printerDeviceOpenDelayMs);
  const chunkSize = paced ? printerBodyChunkSize : data.length;
  for (let offset = 0; offset < data.length; offset += chunkSize) {
    const chunk = data.subarray(offset, offset + chunkSize);
    if (!stream.write(chunk)) await once(stream, 'drain');
    if (paced) await wait(printerBodyChunkDelayMs);
  }
  stream.end();
}

export function splitPrinterTicket(ticket: Buffer): {
  body: Buffer;
  cut: Buffer;
} {
  const cutStart = ticket.length - printerCutSequence.length;
  if (cutStart >= 0 && ticket.subarray(cutStart).equals(printerCutSequence)) {
    return {
      body: ticket.subarray(0, cutStart),
      cut: ticket.subarray(cutStart),
    };
  }
  return { body: ticket, cut: Buffer.alloc(0) };
}

export function planPrinterPhases(ticket: Buffer): Array<{
  data: Buffer;
  paced: boolean;
}> {
  const { body, cut } = splitPrinterTicket(ticket);
  return [
    { data: body, paced: true },
    ...(cut.length > 0 ? [{ data: cut, paced: false }] : []),
  ];
}

function renderProductionTicket(
  payload: z.infer<typeof kitchenPrintPayloadSchema>,
  destination: 'kitchen' | 'counter',
  items: z.infer<typeof kitchenPrintPayloadSchema>['items'],
): Buffer {
  const chunks: Buffer[] = [];
  const write = (value: string, indentation = 0) => {
    chunks.push(
      Buffer.from(ascii(`${' '.repeat(indentation)}${value}\r\n`), 'ascii'),
    );
  };
  const command = (...bytes: number[]) => chunks.push(Buffer.from(bytes));
  const setAlign = (value: 0 | 1) => command(0x1b, 0x61, value);
  const setBold = (enabled: boolean) => command(0x1b, 0x45, enabled ? 1 : 0);
  const setReverse = (enabled: boolean) => command(0x1d, 0x42, enabled ? 1 : 0);
  const setSize = (value: number) => command(0x1d, 0x21, value);
  const leftPadding = payload.leftPaddingChars;
  const contentWidth = 42 - leftPadding;
  const itemSize =
    payload.fontSizePreset === 'large'
      ? 0x11
      : payload.fontSizePreset === 'standard'
        ? 0x01
        : 0x00;
  const itemIndent =
    payload.fontSizePreset === 'large'
      ? Math.floor(leftPadding / 2)
      : leftPadding;
  const itemWidth =
    payload.fontSizePreset === 'large'
      ? Math.floor(contentWidth / 2)
      : contentWidth;

  command(0x1b, 0x40);
  for (let line = 0; line < payload.topPaddingLines; line += 1) write('');
  setAlign(1);
  setBold(true);
  setSize(0x11);
  if (destination === 'kitchen') {
    write('CUISINE');
  } else {
    if (payload.includeAllItems) {
      write('BAR');
    } else {
      write('BOISSONS');
      write('& DESSERTS');
    }
  }
  setSize(0x00);
  setBold(false);
  write(separator());

  setAlign(0);
  setBold(true);
  if (payload.tableLabel)
    write(`TABLE       ${payload.tableLabel}`, leftPadding);
  write(formatDateTime(payload.createdAt), leftPadding);
  write(
    `${items.reduce((sum, item) => sum + item.quantity, 0)} ARTICLES`,
    leftPadding,
  );
  if (payload.orderNote) write(`NOTE: ${payload.orderNote}`, leftPadding);
  setBold(false);
  write(separator(contentWidth), leftPadding);

  setAlign(1);
  setBold(true);
  setSize(0x01);
  write(orderType(payload.orderType));
  setSize(0x00);
  setBold(false);
  setAlign(0);
  write(separator(contentWidth), leftPadding);

  const groupedItems = new Map<string, typeof items>();
  for (const item of items) {
    const sectionName = printSectionName(
      item.categoryName,
      item.station,
      destination,
    );
    const group = groupedItems.get(sectionName) ?? [];
    group.push(item);
    groupedItems.set(sectionName, group);
  }
  const sectionOrder =
    destination === 'kitchen'
      ? ['ENTREES', 'SUPPLEMENTS', 'PLATS']
      : payload.includeAllItems
        ? ['BOISSONS', 'ENTREES', 'SUPPLEMENTS', 'PLATS', 'DESSERTS']
        : ['BOISSONS', 'DESSERTS'];
  for (const sectionName of sectionOrder) {
    const categoryItems = groupedItems.get(sectionName);
    if (!categoryItems) continue;
    setAlign(0);
    setBold(true);
    setReverse(true);
    write(centerText(sectionName, contentWidth), leftPadding);
    setReverse(false);
    setBold(false);
    write(separator(contentWidth), leftPadding);
    for (const item of categoryItems) {
      setSize(itemSize);
      setBold(true);
      for (const line of wrapText(
        `${item.quantity > 1 ? `${item.quantity} x ` : ''}${item.name}`.toLocaleUpperCase(
          'fr-FR',
        ),
        itemWidth,
      )) {
        write(line, itemIndent);
      }
      setSize(0x00);
      setBold(false);
      const detailIndent = Math.min(10, leftPadding + 4);
      const detailWidth = 42 - detailIndent;
      for (const instruction of item.quickInstructions) {
        for (const line of wrapText(
          `> ${instruction.labelSnapshot}`,
          detailWidth,
        ))
          write(line, detailIndent);
      }
      for (const variant of item.selectedVariants) {
        const text = `> ${variant.labelSnapshot}${variant.quantity > 1 ? ` x${variant.quantity}` : ''}`;
        for (const line of wrapText(text, detailWidth))
          write(line, detailIndent);
      }
      if (item.note) {
        for (const line of wrapText(`> NOTE: ${item.note}`, detailWidth))
          write(line, detailIndent);
      }
      if (item.hasAllergy) {
        const allergy = [
          allergySeverityLabel(item.allergySeverity),
          ...(item.selectedAllergens.length > 0
            ? item.selectedAllergens.map(({ labelSnapshot }) => labelSnapshot)
            : item.allergenCodes),
          item.allergyNote,
        ].filter((value): value is string => Boolean(value));
        setBold(true);
        setReverse(true);
        for (const line of wrapText(
          `!!! ALLERGIE: ${allergy.join(', ')}`,
          contentWidth,
        ))
          write(line, leftPadding);
        setReverse(false);
        setBold(false);
      }
    }
  }
  write(separator(contentWidth), leftPadding);
  for (let line = 0; line < payload.bottomPaddingLines; line += 1) write('');
  chunks.push(printerCutSequence);
  return Buffer.concat(chunks);
}

function renderCustomerReceipt(
  payload: z.infer<typeof customerReceiptPayloadSchema>,
): Buffer {
  const chunks: Buffer[] = [];
  const command = (...bytes: number[]) => chunks.push(Buffer.from(bytes));
  const write = (value = '', indentation = 0) => {
    chunks.push(
      Buffer.from(ascii(`${' '.repeat(indentation)}${value}\r\n`), 'ascii'),
    );
  };
  const setAlign = (value: 0 | 1) => command(0x1b, 0x61, value);
  const setBold = (enabled: boolean) => command(0x1b, 0x45, enabled ? 1 : 0);
  const setSize = (value: number) => command(0x1d, 0x21, value);
  const leftPadding = payload.leftPaddingChars;
  const width = 42 - leftPadding;
  const row = (label: string, value: string) =>
    write(leftRight(label, value, width), leftPadding);

  command(0x1b, 0x40);
  for (let line = 0; line < payload.topPaddingLines; line += 1) write();
  setAlign(1);
  setBold(true);
  setSize(0x11);
  write('RECU DE PAIEMENT');
  setSize(0x00);
  setBold(false);
  write(payload.targetLabel);
  write(payload.orderNumber);
  write(formatDateTime(payload.paidAt));
  setAlign(0);
  write(separator(width), leftPadding);
  row('Service', orderType(payload.orderType));
  row('Repere', payload.tableLabel);
  write(separator(width), leftPadding);

  if (payload.items.length === 0) {
    write('Partage egal - detail articles non applicable', leftPadding);
  } else {
    for (const item of payload.items) {
      setBold(payload.fontSizePreset === 'large');
      for (const line of wrapText(
        `${item.quantity} x ${item.name}`,
        Math.max(12, width - 10),
      )) {
        write(line, leftPadding);
      }
      setBold(false);
      row(
        `${formatMoney(item.unitPriceCents)} x ${item.quantity}`,
        formatMoney(item.totalCents),
      );
    }
  }
  write(separator(width), leftPadding);
  row('Sous-total', formatMoney(payload.subtotalCents));
  for (const discount of payload.discounts) {
    row(`Remise ${discount.name}`, `-${formatMoney(discount.amountCents)}`);
  }
  if (payload.discounts.length === 0 && payload.discountCents > 0) {
    row('Remise', `-${formatMoney(payload.discountCents)}`);
  }
  setBold(true);
  row('TOTAL', formatMoney(payload.totalCents));
  setBold(false);
  write(separator(width), leftPadding);
  for (const payment of payload.payments) {
    row(paymentMethod(payment.method), formatMoney(payment.amountCents));
    if (payment.tenderedCents !== null) {
      row('Recu', formatMoney(payment.tenderedCents));
    }
    if (payment.changeCents !== null && payment.changeCents > 0) {
      row('Rendu', formatMoney(payment.changeCents));
    }
    if (payment.tipCents > 0) row('Pourboire', formatMoney(payment.tipCents));
  }
  write(separator(width), leftPadding);
  setAlign(1);
  write('Document non fiscal');
  write('Merci');
  setAlign(0);
  for (let line = 0; line < payload.bottomPaddingLines; line += 1) write();
  chunks.push(printerCutSequence);
  return Buffer.concat(chunks);
}

function formatMoney(cents: number): string {
  return `${(cents / 100).toFixed(2).replace('.', ',')} EUR`;
}

function paymentMethod(
  value: 'cash' | 'card' | 'ticket_resto' | 'other',
): string {
  if (value === 'cash') return 'Especes';
  if (value === 'card') return 'Carte';
  if (value === 'ticket_resto') return 'Titre restaurant';
  return 'Autre paiement';
}

function leftRight(label: string, value: string, width: number): string {
  const safeLabel = ascii(label);
  const safeValue = ascii(value);
  const available = Math.max(1, width - safeValue.length - 1);
  return `${safeLabel.slice(0, available).padEnd(available, ' ')} ${safeValue}`;
}

function allergySeverityLabel(
  value:
    | 'intolerance'
    | 'allergy'
    | 'severe_no_traces'
    | 'mild'
    | 'severe'
    | null,
): string {
  if (value === 'severe_no_traces' || value === 'severe')
    return 'GRAVE - SANS TRACES';
  if (value === 'allergy') return 'ALLERGIE';
  return 'INTOLERANCE';
}

function printSectionName(
  categoryName: string,
  station: 'kitchen' | 'bar' | 'dessert' | 'none',
  destination: 'kitchen' | 'counter',
): string {
  if (destination === 'counter' && (station === 'bar' || station === 'dessert'))
    return station === 'dessert' ? 'DESSERTS' : 'BOISSONS';
  const normalizedCategory = ascii(categoryName).toLowerCase();
  if (normalizedCategory.includes('entree')) return 'ENTREES';
  if (normalizedCategory.includes('supplement')) return 'SUPPLEMENTS';
  return 'PLATS';
}

function orderType(value: 'dine_in' | 'takeaway' | 'delivery'): string {
  if (value === 'takeaway') return 'A EMPORTER';
  if (value === 'delivery') return 'LIVRAISON';
  return 'SUR PLACE';
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  const time = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
  const day = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
  return `${time} - ${day}`;
}

function separator(width = 42): string {
  return '-'.repeat(width);
}

function centerText(value: string, width: number): string {
  const text = ascii(value).slice(0, width - 2);
  const left = Math.max(1, Math.floor((width - text.length) / 2));
  return `${' '.repeat(left)}${text}`.padEnd(width, ' ');
}

function wrapText(value: string, width: number): string[] {
  const words = ascii(value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if (word.length > width) {
      if (line) lines.push(line);
      for (let index = 0; index < word.length; index += width) {
        lines.push(word.slice(index, index + width));
      }
      line = '';
      continue;
    }
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > width) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.length > 0 ? lines : [''];
}

function ascii(value: string): string {
  return value
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .replace(/[‐‑‒–—―−]/g, '-')
    .replace(/[\u00A0\u202F]/g, ' ')
    .replaceAll('…', '...')
    .replaceAll('×', 'x')
    .replaceAll('•', '*')
    .replaceAll('€', 'EUR')
    .replaceAll('œ', 'oe')
    .replaceAll('Œ', 'OE')
    .replaceAll('đ', 'd')
    .replaceAll('Đ', 'D')
    .replaceAll('œ', 'oe')
    .replaceAll('Œ', 'OE')
    .replaceAll('đ', 'd')
    .replaceAll('Đ', 'D')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\x0A\x0D\x20-\x7E]/g, '?');
}

function printErrorMessage(error: unknown): string {
  const detail =
    error instanceof Error ? error.message : 'Unknown printer error.';
  return `Physical printer failed: ${detail}`.slice(0, 2_000);
}
