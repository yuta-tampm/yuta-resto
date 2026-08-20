import {
  localReceiptCommandResponseSchema,
  localReceiptJobStatusResponseSchema,
  localReceiptTargetSchema,
  localReceiptViewResponseSchema,
  receiptJobCommandInputSchema,
  type LocalPrinterStatus,
  type ReceiptJobCommandInput,
} from '@yuta/contracts/local-pos';
import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import {
  checkDiscounts,
  checkItems,
  checks,
  orderDiscounts,
  orderItems,
  orders,
  payments,
  printJobs,
} from '@yuta/db-pos/schema';
import { and, asc, desc, eq, inArray, isNull, ne } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { HttpError } from '../http';
import { toLocalPrintJob } from './print-job-service';
import {
  defaultLocalPrintSettings,
  ensurePrintSettings,
  readPrintSettings,
} from './print-settings-service';
import { readEstablishmentProfile } from './establishment-profile-service';

type GetPrinterStatus = () => Promise<LocalPrinterStatus>;

export function createCustomerReceiptService(
  db: PosDatabaseExecutor,
  input: { getPrinterStatus: GetPrinterStatus },
) {
  async function getReceiptView(orderId: string) {
    const [order, checkRows, jobs, printer] = await Promise.all([
      getRequiredOrder(db, orderId),
      db
        .select()
        .from(checks)
        .where(and(eq(checks.orderId, orderId), ne(checks.status, 'void')))
        .orderBy(asc(checks.createdAt), asc(checks.id)),
      db
        .select()
        .from(printJobs)
        .where(
          and(
            eq(printJobs.orderId, orderId),
            eq(printJobs.jobType, 'customer_receipt'),
          ),
        )
        .orderBy(desc(printJobs.createdAt), desc(printJobs.id)),
      input.getPrinterStatus(),
    ]);
    return localReceiptViewResponseSchema.parse({
      orderId,
      paymentMode: order.paymentMode,
      targets: buildTargets(order, checkRows, jobs),
      printer,
    });
  }

  async function executeReceiptCommand(
    orderId: string,
    unsafeCommand: ReceiptJobCommandInput,
  ) {
    const command = receiptJobCommandInputSchema.parse(unsafeCommand);
    const result = await db.transaction(async (tx) => {
      await lockOrder(tx, orderId);
      const order = await getRequiredOrder(tx, orderId);
      const existingByOperation = await tx.query.printJobs.findFirst({
        where: eq(printJobs.idempotencyKey, command.operationId),
      });
      if (existingByOperation) {
        assertOperationReplay(existingByOperation, orderId, command);
        return { job: existingByOperation, replayed: true };
      }

      const target = await resolvePaidTarget(tx, order, command);
      if (command.intent === 'print') {
        const active = await findActiveTargetJob(tx, orderId, target.checkId);
        if (active) return { job: active, replayed: true };
      }

      let payload: Record<string, unknown>;
      if (command.intent === 'print') {
        payload = {
          ...(await buildReceiptPayload(
            tx,
            order,
            target.checkId,
            await ensurePrintSettings(tx),
          )),
          request: {
            operationId: command.operationId,
            intent: command.intent,
            sourceJobId: null,
          },
        };
      } else {
        const source = await getRequiredReceiptJob(
          tx,
          orderId,
          command.jobId as string,
          target.checkId,
        );
        const expectedStatus =
          command.intent === 'retry' ? 'failed' : 'printed';
        if (source.status !== expectedStatus) {
          throw new HttpError(
            409,
            'INVALID_RECEIPT_JOB_STATUS',
            `${command.intent} requires a ${expectedStatus} receipt job.`,
          );
        }
        payload = {
          ...source.payload,
          request: {
            operationId: command.operationId,
            intent: command.intent,
            sourceJobId: source.id,
          },
        };
      }

      const [created] = await tx
        .insert(printJobs)
        .values({
          id: uuidv7(),
          orderId,
          checkId: target.checkId,
          paymentId: null,
          source: 'pos',
          printerName: 'tm-m30-receipt',
          jobType: 'customer_receipt',
          status: 'pending',
          payload,
          idempotencyKey: command.operationId,
        })
        .returning();
      if (!created) throw new Error('Customer receipt job was not created.');
      return { job: created, replayed: false };
    });

    const view = await getReceiptView(orderId);
    const target = view.targets.find((candidate) =>
      command.target.kind === 'order'
        ? candidate.kind === 'order'
        : candidate.kind === 'check' && candidate.id === command.target.checkId,
    );
    if (!target) throw new Error('Created receipt target is unavailable.');
    return localReceiptCommandResponseSchema.parse({
      target: { ...target, latestJob: toLocalPrintJob(result.job) },
      printJob: toLocalPrintJob(result.job),
      replayed: result.replayed,
      printer: view.printer,
    });
  }

  async function getReceiptJobStatus(orderId: string, jobId: string) {
    const job = await getRequiredReceiptJob(db, orderId, jobId);
    return localReceiptJobStatusResponseSchema.parse({
      printJob: toLocalPrintJob(job),
      printer: await input.getPrinterStatus(),
    });
  }

  return { getReceiptView, executeReceiptCommand, getReceiptJobStatus };
}

type OrderRow = typeof orders.$inferSelect;
type CheckRow = typeof checks.$inferSelect;
type PrintJobRow = typeof printJobs.$inferSelect;

function buildTargets(
  order: OrderRow,
  checkRows: CheckRow[],
  jobs: PrintJobRow[],
) {
  const latestFor = (checkId: string | null) =>
    jobs.find((job) => job.checkId === checkId) ?? null;
  if (order.paymentMode === 'single') {
    return [
      localReceiptTargetSchema.parse({
        kind: 'order',
        id: order.id,
        label: 'Commande complète',
        amountCents: order.totalCents,
        availability:
          order.status === 'paid'
            ? 'available'
            : order.status === 'cancelled'
              ? 'cancelled'
              : 'payment_pending',
        splitMode: 'single',
        latestJob: latestFor(null) ? toLocalPrintJob(latestFor(null)!) : null,
      }),
    ];
  }
  return checkRows.map((check) => {
    const latest = latestFor(check.id);
    return localReceiptTargetSchema.parse({
      kind: 'check',
      id: check.id,
      label: check.checkLabel,
      amountCents: check.totalCents,
      availability: check.status === 'paid' ? 'available' : 'payment_pending',
      splitMode: check.splitMode,
      latestJob: latest ? toLocalPrintJob(latest) : null,
    });
  });
}

async function lockOrder(db: PosDatabaseExecutor, orderId: string) {
  const rows = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.id, orderId))
    .for('update');
  if (!rows[0]) throw new HttpError(404, 'ORDER_NOT_FOUND', 'Order not found.');
}

async function getRequiredOrder(db: PosDatabaseExecutor, orderId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });
  if (!order) throw new HttpError(404, 'ORDER_NOT_FOUND', 'Order not found.');
  return order;
}

async function resolvePaidTarget(
  db: PosDatabaseExecutor,
  order: OrderRow,
  command: ReceiptJobCommandInput,
): Promise<{ checkId: string | null }> {
  if (command.target.kind === 'order') {
    if (order.paymentMode !== 'single' || order.status !== 'paid') {
      throw new HttpError(
        409,
        'RECEIPT_TARGET_NOT_PAID',
        'The full order is not an available paid receipt target.',
      );
    }
    return { checkId: null };
  }
  if (order.paymentMode === 'single') {
    throw new HttpError(
      409,
      'RECEIPT_TARGET_MISMATCH',
      'A single order cannot print a split-check receipt.',
    );
  }
  const check = await db.query.checks.findFirst({
    where: and(
      eq(checks.id, command.target.checkId),
      eq(checks.orderId, order.id),
    ),
  });
  if (!check || check.status !== 'paid') {
    throw new HttpError(
      409,
      'RECEIPT_TARGET_NOT_PAID',
      'The selected check is not a paid receipt target.',
    );
  }
  return { checkId: check.id };
}

async function findActiveTargetJob(
  db: PosDatabaseExecutor,
  orderId: string,
  checkId: string | null,
) {
  return db.query.printJobs.findFirst({
    where: and(
      eq(printJobs.orderId, orderId),
      checkId ? eq(printJobs.checkId, checkId) : isNull(printJobs.checkId),
      eq(printJobs.jobType, 'customer_receipt'),
      inArray(printJobs.status, ['pending', 'printing']),
    ),
    orderBy: [desc(printJobs.createdAt), desc(printJobs.id)],
  });
}

async function getRequiredReceiptJob(
  db: PosDatabaseExecutor,
  orderId: string,
  jobId: string,
  checkId?: string | null,
) {
  const job = await db.query.printJobs.findFirst({
    where: and(
      eq(printJobs.id, jobId),
      eq(printJobs.orderId, orderId),
      eq(printJobs.jobType, 'customer_receipt'),
    ),
  });
  if (!job || (checkId !== undefined && job.checkId !== checkId)) {
    throw new HttpError(
      404,
      'RECEIPT_JOB_NOT_FOUND',
      'Customer receipt job not found for this target.',
    );
  }
  return job;
}

function assertOperationReplay(
  job: PrintJobRow,
  orderId: string,
  command: ReceiptJobCommandInput,
) {
  const request = job.payload.request;
  const expectedCheckId =
    command.target.kind === 'check' ? command.target.checkId : null;
  if (
    job.jobType !== 'customer_receipt' ||
    job.orderId !== orderId ||
    job.checkId !== expectedCheckId ||
    typeof request !== 'object' ||
    request === null ||
    !('intent' in request) ||
    request.intent !== command.intent ||
    ('sourceJobId' in request ? request.sourceJobId : undefined) !==
      (command.jobId ?? null)
  ) {
    throw new HttpError(
      409,
      'IDEMPOTENCY_CONFLICT',
      'Receipt operation ID was reused with different input.',
    );
  }
}

async function buildReceiptPayload(
  db: PosDatabaseExecutor,
  order: OrderRow,
  checkId: string | null,
  settings: Pick<
    typeof defaultLocalPrintSettings,
    | 'fontSizePreset'
    | 'topPaddingLines'
    | 'leftPaddingChars'
    | 'bottomPaddingLines'
  >,
) {
  const establishmentProfile = await readEstablishmentProfile(db);
  const paymentRows = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.orderId, order.id),
        checkId ? eq(payments.checkId, checkId) : isNull(payments.checkId),
        eq(payments.status, 'paid'),
      ),
    )
    .orderBy(asc(payments.createdAt), asc(payments.id));
  const check = checkId
    ? await db.query.checks.findFirst({ where: eq(checks.id, checkId) })
    : null;
  const itemRows = checkId
    ? await db
        .select({
          name: orderItems.itemNameSnapshot,
          quantity: checkItems.quantity,
          unitPriceCents: orderItems.unitPriceCentsSnapshot,
          totalCents: checkItems.amountCentsSnapshot,
        })
        .from(checkItems)
        .innerJoin(orderItems, eq(checkItems.orderItemId, orderItems.id))
        .where(eq(checkItems.checkId, checkId))
        .orderBy(asc(checkItems.createdAt), asc(checkItems.id))
    : await db
        .select({
          name: orderItems.itemNameSnapshot,
          quantity: orderItems.quantity,
          unitPriceCents: orderItems.unitPriceCentsSnapshot,
          totalCents: orderItems.unitPriceCentsSnapshot,
        })
        .from(orderItems)
        .where(
          and(
            eq(orderItems.orderId, order.id),
            ne(orderItems.status, 'cancelled'),
          ),
        )
        .orderBy(asc(orderItems.createdAt), asc(orderItems.id));
  const normalizedItems = itemRows.map((item) => ({
    ...item,
    totalCents: checkId ? item.totalCents : item.unitPriceCents * item.quantity,
  }));
  const discountRows = checkId
    ? await db
        .select({
          name: checkDiscounts.nameSnapshot,
          amountCents: checkDiscounts.discountCents,
        })
        .from(checkDiscounts)
        .where(eq(checkDiscounts.checkId, checkId))
        .orderBy(asc(checkDiscounts.createdAt), asc(checkDiscounts.id))
    : await db
        .select({
          name: orderDiscounts.nameSnapshot,
          amountCents: orderDiscounts.discountCents,
        })
        .from(orderDiscounts)
        .where(eq(orderDiscounts.orderId, order.id))
        .orderBy(asc(orderDiscounts.createdAt), asc(orderDiscounts.id));
  return {
    version: 1,
    documentType: 'non_fiscal',
    ...(establishmentProfile
      ? { establishmentDisplayName: establishmentProfile.displayName }
      : {}),
    orderNumber: order.orderNumber,
    tableLabel: order.tableLabel,
    orderType: order.orderType,
    targetKind: checkId ? 'check' : 'order',
    targetLabel: check?.checkLabel ?? 'Commande complète',
    createdAt: order.createdAt.toISOString(),
    paidAt:
      paymentRows.at(-1)?.paidAt?.toISOString() ??
      order.paidAt?.toISOString() ??
      new Date().toISOString(),
    items: normalizedItems,
    discounts: discountRows,
    subtotalCents: check?.subtotalCents ?? order.subtotalCents,
    discountCents: check?.discountCents ?? order.discountCents,
    totalCents: check?.totalCents ?? order.totalCents,
    payments: paymentRows.map((payment) => ({
      method: payment.method,
      amountCents: payment.amountCents,
      tenderedCents: payment.tenderedCents,
      changeCents: payment.changeCents,
      tipCents: payment.tipCents,
      paidBy: payment.paidBy,
      paidAt: payment.paidAt?.toISOString() ?? payment.createdAt.toISOString(),
    })),
    copies: 1,
    fontSizePreset: settings.fontSizePreset,
    topPaddingLines: settings.topPaddingLines,
    leftPaddingChars: settings.leftPaddingChars,
    bottomPaddingLines: settings.bottomPaddingLines,
  };
}

export async function buildReadOnlyCustomerReceiptPreview(
  db: PosDatabaseExecutor,
  input: {
    orderId: string;
    target: { kind: 'order' } | { kind: 'check'; checkId: string };
  },
) {
  const order = await getRequiredOrder(db, input.orderId);
  const target = await resolvePaidTarget(db, order, {
    operationId: uuidv7(),
    intent: 'print',
    target: input.target,
  });
  const settings = (await readPrintSettings(db)) ?? defaultLocalPrintSettings;
  return buildReceiptPayload(db, order, target.checkId, settings);
}
