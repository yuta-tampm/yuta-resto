import { createPosDatabaseClient } from '@yuta/db-pos/client';
import { sql } from 'drizzle-orm';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { buildReadOnlyCustomerReceiptPreview } from '../services/customer-receipt-service';
import { writeReceiptPreview } from '../services/receipt-preview-service';

config({ path: resolve(process.cwd(), 'apps/site-agent/.env.local') });
config({ path: resolve(process.cwd(), 'apps/site-agent/.env') });
config({ path: '.env.local' });
config({ path: '.env' });

const identifierSchema = z.string().uuid();
const repositoryRoot = fileURLToPath(new URL('../../../..', import.meta.url));

function readArguments(values: string[]) {
  const read = (name: string) => {
    const index = values.indexOf(name);
    return index === -1 ? undefined : values[index + 1];
  };
  if (values.includes('--help')) {
    console.log(
      'Usage: pnpm receipt:preview --order <paid-order-uuid> [--check <paid-check-uuid>] [--output <directory>]',
    );
    process.exit(0);
  }
  const orderId = identifierSchema.parse(read('--order'));
  const checkValue = read('--check');
  const checkId = checkValue ? identifierSchema.parse(checkValue) : undefined;
  const outputDirectory =
    read('--output') ??
    resolve(
      repositoryRoot,
      'apps/yuta-pos/.tmp/prints',
      `receipt-preview-${orderId.slice(0, 8)}${checkId ? `-${checkId.slice(0, 8)}` : ''}`,
    );
  return { orderId, checkId, outputDirectory };
}

async function main() {
  const input = readArguments(process.argv.slice(2));
  const db = createPosDatabaseClient(process.env);
  try {
    const payload = await db.transaction(async (tx) => {
      await tx.execute(sql`set transaction read only`);
      return buildReadOnlyCustomerReceiptPreview(tx, {
        orderId: input.orderId,
        target: input.checkId
          ? { kind: 'check', checkId: input.checkId }
          : { kind: 'order' },
      });
    });
    const files = await writeReceiptPreview({
      outputDirectory: input.outputDirectory,
      payload,
      mode: 'paid-order-read-only',
      orderId: input.orderId,
      checkId: input.checkId,
    });
    console.log('READ-ONLY receipt preview created; no print job was queued.');
    console.log(files.textPath);
    console.log(files.binaryPath);
    console.log(files.metadataPath);
  } finally {
    await db.$client.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
