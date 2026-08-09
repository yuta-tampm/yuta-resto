import {
  localPrinterStatusSchema,
  type LocalPrinterStatus,
} from '@yuta/contracts/local-pos';
import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import { printJobs } from '@yuta/db-pos/schema';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { constants } from 'node:fs';
import { access, stat } from 'node:fs/promises';

type DeviceStatus = LocalPrinterStatus['device'];
const stalePendingAfterMs = 30_000;

export function createPrinterStatusService(
  db: PosDatabaseExecutor,
  options: {
    devicePath?: string;
    inspectDevice?: (devicePath: string) => Promise<DeviceStatus>;
    now?: () => Date;
  } = {},
) {
  const inspectDevice = options.inspectDevice ?? inspectPrinterDevice;
  const now = options.now ?? (() => new Date());

  async function getPrinterStatus(): Promise<LocalPrinterStatus> {
    const [statusRows, lastPrinted, lastFailed, oldestPending, device] =
      await Promise.all([
        db
          .select({
            status: printJobs.status,
            count: sql<number>`count(*)::int`,
          })
          .from(printJobs)
          .groupBy(printJobs.status),
        db.query.printJobs.findFirst({
          where: eq(printJobs.status, 'printed'),
          orderBy: [desc(printJobs.printedAt)],
        }),
        db.query.printJobs.findFirst({
          where: eq(printJobs.status, 'failed'),
          orderBy: [desc(printJobs.createdAt)],
        }),
        db.query.printJobs.findFirst({
          where: eq(printJobs.status, 'pending'),
          orderBy: [asc(printJobs.createdAt)],
        }),
        options.devicePath
          ? inspectDevice(options.devicePath)
          : Promise.resolve('not_configured' as const),
      ]);

    const countByStatus = new Map(
      statusRows.map((row) => [row.status, Number(row.count)]),
    );
    const checkedAt = now();
    const lastPrintedAt = lastPrinted?.printedAt ?? null;
    const lastFailureAt = lastFailed?.createdAt ?? null;
    const unresolvedFailure =
      lastFailureAt !== null &&
      (lastPrintedAt === null || lastFailureAt > lastPrintedAt);
    const stalePending =
      oldestPending !== undefined &&
      checkedAt.getTime() - oldestPending.createdAt.getTime() >
        stalePendingAfterMs;

    return localPrinterStatusSchema.parse({
      status: derivePrinterOperationalStatus({
        device,
        workerRunning: Boolean(options.devicePath),
        printing: countByStatus.get('printing') ?? 0,
        unresolvedFailure,
        stalePending,
      }),
      worker: options.devicePath ? 'running' : 'disabled',
      device,
      queue: {
        pending: countByStatus.get('pending') ?? 0,
        printing: countByStatus.get('printing') ?? 0,
        failed: countByStatus.get('failed') ?? 0,
      },
      lastPrintedAt: lastPrintedAt?.toISOString() ?? null,
      lastFailureAt: lastFailureAt?.toISOString() ?? null,
      checkedAt: checkedAt.toISOString(),
    });
  }

  return { getPrinterStatus };
}

export function derivePrinterOperationalStatus(input: {
  device: DeviceStatus;
  workerRunning: boolean;
  printing: number;
  unresolvedFailure: boolean;
  stalePending: boolean;
}): LocalPrinterStatus['status'] {
  if (input.device === 'not_configured' || !input.workerRunning) {
    return 'not_configured';
  }
  if (input.device !== 'ready') return 'unavailable';
  if (input.printing > 0) return 'printing';
  if (input.unresolvedFailure || input.stalePending) return 'attention';
  return 'ready';
}

async function inspectPrinterDevice(devicePath: string): Promise<DeviceStatus> {
  try {
    const device = await stat(devicePath);
    if (!device.isCharacterDevice()) return 'invalid';
    await access(devicePath, constants.W_OK);
    return 'ready';
  } catch (error: unknown) {
    const code = errorCode(error);
    if (code === 'ENOENT') return 'missing';
    if (code === 'EACCES' || code === 'EPERM') return 'not_writable';
    return 'invalid';
  }
}

function errorCode(error: unknown): string | undefined {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : undefined;
}
