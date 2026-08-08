import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import { printJobs, type PrintJob } from '@yuta/db-pos/schema';
import { and, asc, eq, inArray } from 'drizzle-orm';
import { spawn } from 'node:child_process';
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
          allergySeverity: z.enum(['mild', 'severe']).nullable(),
          allergyNote: z.string().nullable(),
          station: z.enum(['kitchen', 'bar', 'dessert', 'none']),
          categoryName: z.string().min(1).default('Autres'),
        })
        .passthrough(),
    ),
    ticketDestination: z.enum(['kitchen', 'counter']).optional(),
    copies: z.number().int().min(1).max(3).default(1),
    fontSizePreset: z
      .enum(['compact', 'standard', 'large'])
      .default('standard'),
    topPaddingLines: z.number().int().min(0).max(8).default(1),
    leftPaddingChars: z.number().int().min(0).max(8).default(2),
    bottomPaddingLines: z.number().int().min(0).max(8).default(3),
  })
  .passthrough();

type PrinterWriter = (devicePath: string, data: Buffer) => Promise<void>;

export function createLocalPrinterWorker(input: {
  db: PosDatabaseExecutor;
  devicePath: string;
  pollIntervalMs: number;
  write?: PrinterWriter;
}) {
  const write = input.write ?? writePrinterDevice;
  let timer: NodeJS.Timeout | null = null;
  let activeRun: Promise<void> | null = null;
  let stopped = true;

  async function processNext(): Promise<boolean> {
    const candidate = await input.db.query.printJobs.findFirst({
      where: and(
        eq(printJobs.status, 'pending'),
        inArray(printJobs.jobType, ['kitchen_ticket', 'test']),
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
      const output = renderInternalKitchenTicket(claimed);
      if (output) await write(input.devicePath, output);
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
            inArray(printJobs.jobType, ['kitchen_ticket', 'test']),
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
  const payload = kitchenPrintPayloadSchema.parse(job.payload);
  const destinations = payload.ticketDestination
    ? [payload.ticketDestination]
    : (['kitchen', 'counter'] as const);
  const tickets = destinations.flatMap((destination) => {
    const items = payload.items.filter((item) =>
      destination === 'kitchen'
        ? item.station === 'kitchen'
        : item.station === 'bar' || item.station === 'dessert',
    );
    if (items.length === 0) return [];
    return Array.from({ length: payload.copies }, () =>
      renderProductionTicket(payload, destination, items),
    );
  });
  return tickets.length > 0 ? Buffer.concat(tickets) : null;
}

async function writePrinterDevice(
  devicePath: string,
  data: Buffer,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const writer = spawn(
      'timeout',
      ['--kill-after=2s', '10s', 'tee', devicePath],
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
    writer.stdin.end(data);
  });
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
  const itemSize = payload.fontSizePreset === 'large' ? 0x11 : 0x00;
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
    write('BOISSONS');
    write('& DESSERTS');
  }
  setSize(0x00);
  setBold(false);
  write(separator());

  setAlign(0);
  setBold(true);
  if (payload.tableLabel)
    write(`TABLE       ${payload.tableLabel}`, leftPadding);
  write(orderType(payload.orderType), leftPadding);
  write(formatDateTime(payload.createdAt), leftPadding);
  write(
    `${items.reduce((sum, item) => sum + item.quantity, 0)} ARTICLES`,
    leftPadding,
  );
  if (payload.orderNote) write(`NOTE: ${payload.orderNote}`, leftPadding);
  setBold(false);
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
      setBold(payload.fontSizePreset !== 'compact');
      for (const line of wrapText(
        `${item.quantity > 1 ? `${item.quantity} x ` : ''}${item.name}`,
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
          item.allergySeverity === 'severe' ? 'GRAVE' : 'LEGERE',
          ...item.allergenCodes,
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
      write('');
    }
  }
  write(separator(contentWidth), leftPadding);
  for (let line = 0; line < payload.bottomPaddingLines; line += 1) write('');
  command(0x1d, 0x56, 0x41, 0x03);
  return Buffer.concat(chunks);
}

function printSectionName(
  categoryName: string,
  station: 'kitchen' | 'bar' | 'dessert' | 'none',
  destination: 'kitchen' | 'counter',
): string {
  if (destination === 'counter')
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
