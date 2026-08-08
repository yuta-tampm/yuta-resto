import {
  localPrintJobsResponseSchema,
  localPrintJobSchema,
  printJobsQuerySchema,
  type PrintJobCommand,
  type PrintJobsQuery,
} from '@yuta/contracts/local-pos';
import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import { printJobs } from '@yuta/db-pos/schema';
import { asc, desc, eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { HttpError } from '../http';
import { ensurePrintSettings } from './print-settings-service';

export function createPrintJobService(db: PosDatabaseExecutor) {
  async function createTestPrintJob() {
    const settings = await ensurePrintSettings(db);
    const now = new Date();
    const [created] = await db
      .insert(printJobs)
      .values({
        id: uuidv7(),
        source: 'manual',
        printerName: 'tm-m30-test',
        jobType: 'test',
        payload: {
          orderNumber: 'TEST',
          tableLabel: 'Test imprimante',
          orderType: 'dine_in',
          orderNote: 'Police - marges - coupe',
          createdAt: now.toISOString(),
          includeAllItems: true,
          copies: 1,
          fontSizePreset: settings.fontSizePreset,
          topPaddingLines: settings.topPaddingLines,
          leftPaddingChars: settings.leftPaddingChars,
          bottomPaddingLines: settings.bottomPaddingLines,
          items: [
            {
              name: 'Test – tiret - apostrophe ’ droite',
              quantity: 1,
              note: 'Crème brûlée – l’été',
              quickInstructions: [
                { labelSnapshot: "Sans oignon – à l'ancienne" },
              ],
              selectedVariants: [{ labelSnapshot: 'Bœuf × 2', quantity: 2 }],
              hasAllergy: true,
              allergenCodes: ['arachides'],
              allergySeverity: 'severe_no_traces',
              allergyNote: 'test uniquement',
              station: 'kitchen',
              categoryName: 'Entrées',
            },
            {
              name: 'Thé glacé maison',
              quantity: 1,
              note: 'Citron & citronnelle',
              quickInstructions: [],
              selectedVariants: [],
              hasAllergy: false,
              allergenCodes: [],
              allergySeverity: null,
              allergyNote: null,
              station: 'bar',
              categoryName: 'Boissons',
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
              categoryName: 'Desserts',
            },
          ],
        },
      })
      .returning();
    if (!created) throw new Error('Test print job was not created.');
    return localPrintJobSchema.parse(toPrintJob(created));
  }

  async function listPrintJobs(input: PrintJobsQuery) {
    const query = printJobsQuerySchema.parse(input);
    const rows = query.status
      ? await db
          .select()
          .from(printJobs)
          .where(eq(printJobs.status, query.status))
          .orderBy(desc(printJobs.createdAt), asc(printJobs.id))
          .limit(query.limit)
      : await db
          .select()
          .from(printJobs)
          .orderBy(desc(printJobs.createdAt), asc(printJobs.id))
          .limit(query.limit);
    return localPrintJobsResponseSchema.parse({
      printJobs: rows.map(toPrintJob),
    });
  }

  async function executePrintJobCommand(
    printJobId: string,
    command: PrintJobCommand,
  ) {
    const job = await db.query.printJobs.findFirst({
      where: eq(printJobs.id, printJobId),
    });
    if (!job) {
      throw new HttpError(404, 'PRINT_JOB_NOT_FOUND', 'Print job not found.');
    }
    if (
      command.action === 'mark_printing' &&
      !['pending', 'failed'].includes(job.status)
    ) {
      throw new HttpError(
        409,
        'INVALID_PRINT_STATUS',
        'Only pending or failed jobs can start printing.',
      );
    }
    if (command.action === 'mark_printed' && job.status !== 'printing') {
      throw new HttpError(
        409,
        'INVALID_PRINT_STATUS',
        'Only printing jobs can be marked printed.',
      );
    }
    if (
      command.action === 'mark_failed' &&
      !['pending', 'printing'].includes(job.status)
    ) {
      throw new HttpError(
        409,
        'INVALID_PRINT_STATUS',
        'Only pending or printing jobs can fail.',
      );
    }
    if (command.action === 'retry' && job.status !== 'failed') {
      throw new HttpError(
        409,
        'INVALID_PRINT_STATUS',
        'Only failed jobs can be retried.',
      );
    }
    if (command.action === 'reprint' && job.status !== 'printed') {
      throw new HttpError(
        409,
        'INVALID_PRINT_STATUS',
        'Only printed jobs can be reprinted.',
      );
    }

    const values =
      command.action === 'mark_printing'
        ? { status: 'printing' as const, errorMessage: null }
        : command.action === 'mark_printed'
          ? {
              status: 'printed' as const,
              printedAt: new Date(),
              errorMessage: null,
            }
          : command.action === 'mark_failed'
            ? {
                status: 'failed' as const,
                errorMessage: command.errorMessage,
              }
            : {
                status: 'pending' as const,
                printedAt: null,
                errorMessage: null,
              };
    const [updated] = await db
      .update(printJobs)
      .set(values)
      .where(eq(printJobs.id, printJobId))
      .returning();
    return localPrintJobSchema.parse(toPrintJob(updated));
  }

  return { createTestPrintJob, listPrintJobs, executePrintJobCommand };
}

function toPrintJob(job: typeof printJobs.$inferSelect) {
  return {
    id: job.id,
    orderId: job.orderId,
    checkId: job.checkId,
    paymentId: job.paymentId,
    type: job.jobType,
    source: job.source,
    status: job.status,
    printerName: job.printerName,
    summary: summarizePayload(job.payload),
    errorMessage: job.errorMessage,
    createdAt: job.createdAt.toISOString(),
    printedAt: job.printedAt?.toISOString() ?? null,
  };
}

function summarizePayload(payload: Record<string, unknown>) {
  return {
    orderNumber:
      typeof payload.orderNumber === 'string' ? payload.orderNumber : null,
    tableLabel:
      typeof payload.tableLabel === 'string' ? payload.tableLabel : null,
    itemCount: Array.isArray(payload.items) ? payload.items.length : 0,
  };
}
