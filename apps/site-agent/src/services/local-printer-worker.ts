import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import { printJobs } from '@yuta/db-pos/schema';
import { and, asc, eq, inArray } from 'drizzle-orm';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import {
  printerCutSequence,
  renderInternalPrintTickets,
} from './print-ticket-renderers';

export { customerReceiptPayloadSchema } from './print-payload-schemas';
export {
  renderCustomerReceiptPayload,
  renderCustomerReceiptTicket,
  renderInternalKitchenTicket,
  renderInternalKitchenTickets,
  renderInternalPrintTickets,
} from './print-ticket-renderers';

type PrinterWriter = (devicePath: string, data: Buffer) => Promise<void>;
const defaultInterTicketDelayMs = 800;
const printerBodyChunkSize = 128;
const printerBodyChunkDelayMs = 20;
const printerDeviceOpenDelayMs = 300;
const printerCutSettleDelayMs = 1_000;

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

function printErrorMessage(error: unknown): string {
  const detail =
    error instanceof Error ? error.message : 'Unknown printer error.';
  return `Physical printer failed: ${detail}`.slice(0, 2_000);
}
