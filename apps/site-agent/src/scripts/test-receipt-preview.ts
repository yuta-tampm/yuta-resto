import { createPosDatabaseClient } from '@yuta/db-pos/client';
import { seedPosData } from '@yuta/db-pos/seed';
import { printJobs } from '@yuta/db-pos/schema';
import { eq } from 'drizzle-orm';
import { resolve } from 'node:path';
import { v7 as uuidv7 } from 'uuid';
import { createLocalPrinterWorker } from '../services/local-printer-worker';
import { writeReceiptPreview } from '../services/receipt-preview-service';
import { createSiteAgentService } from '../services/site-agent-service';

async function main() {
  const outputDirectory = process.argv[2];
  if (!outputDirectory)
    throw new Error('Receipt preview output directory is required.');
  const db = createPosDatabaseClient(process.env);
  try {
    const seed = await seedPosData(db);
    const item = Object.values(seed.menuItems).find(
      (candidate) =>
        candidate.isAvailable && candidate.requiredVariantQuantity === 0,
    );
    if (!item) throw new Error('Seeded preview menu item is unavailable.');
    const service = createSiteAgentService(db);
    const created = await service.createOrder({
      tableLabel: 'Preview imprimante',
      orderType: 'dine_in',
      staffUserId: seed.staffUser.id,
    });
    const orderId = created.order.id;
    await service.addOrderItem(orderId, { menuItemId: item.id, quantity: 2 });
    const summary = await service.getPaymentSummary(orderId);
    await service.payOrder(orderId, {
      method: 'card',
      amountCents: summary.remainingCents,
      staffUserId: seed.staffUser.id,
      idempotencyKey: uuidv7(),
    });
    const command = await service.executeReceiptCommand(orderId, {
      operationId: uuidv7(),
      intent: 'print',
      target: { kind: 'order' },
    });
    const captured: Buffer[] = [];
    const worker = createLocalPrinterWorker({
      db,
      devicePath: 'preview://memory',
      pollIntervalMs: 1,
      interTicketDelayMs: 0,
      orderIdScope: orderId,
      write: async (_path, data) => {
        captured.push(data);
      },
    });
    if (!(await worker.processNext()) || captured.length !== 1) {
      throw new Error('Receipt worker did not produce exactly one ticket.');
    }
    const job = await db.query.printJobs.findFirst({
      where: eq(printJobs.id, command.printJob.id),
    });
    if (!job || job.status !== 'printed') {
      throw new Error(
        'Receipt worker did not mark the disposable job printed.',
      );
    }
    const files = await writeReceiptPreview({
      outputDirectory: resolve(outputDirectory),
      payload: job.payload,
      mode: 'disposable-e2e',
      orderId,
    });
    const { renderCustomerReceiptTicket } =
      await import('../services/local-printer-worker');
    if (!captured[0].equals(renderCustomerReceiptTicket(job))) {
      throw new Error(
        'Captured worker bytes differ from the production renderer.',
      );
    }
    console.log(`Disposable receipt flow passed for order ${orderId}.`);
    console.log(files.textPath);
    console.log(files.binaryPath);
    console.log(files.metadataPath);
  } finally {
    await db.$client.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
