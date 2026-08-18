import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  customerReceiptPayloadSchema,
  renderCustomerReceiptPayload,
} from './local-printer-worker';

export function receiptBufferToText(buffer: Buffer): string {
  const bytes: number[] = [];
  for (let index = 0; index < buffer.length; index += 1) {
    const byte = buffer[index];
    if (byte === 0x1b || byte === 0x1d) {
      const command = buffer[index + 1];
      index += byte === 0x1b && command === 0x40 ? 1 : 2;
      continue;
    }
    if (byte === 0x0a || byte === 0x0d || (byte >= 0x20 && byte <= 0x7e)) {
      bytes.push(byte);
    }
  }
  return Buffer.from(bytes)
    .toString('ascii')
    .replaceAll('\r\n', '\n')
    .trimEnd();
}

export async function writeReceiptPreview(input: {
  outputDirectory: string;
  payload: unknown;
  mode: 'paid-order-read-only' | 'disposable-e2e';
  orderId: string;
  checkId?: string;
}) {
  const payload = customerReceiptPayloadSchema.parse(input.payload);
  const binary = renderCustomerReceiptPayload(payload);
  const outputDirectory = resolve(input.outputDirectory);
  await mkdir(outputDirectory, { recursive: true });
  const binaryPath = resolve(outputDirectory, 'receipt.bin');
  const textPath = resolve(outputDirectory, 'receipt.txt');
  const metadataPath = resolve(outputDirectory, 'metadata.json');
  await writeFile(binaryPath, binary);
  await writeFile(textPath, `${receiptBufferToText(binary)}\n`, 'utf8');
  await writeFile(
    metadataPath,
    `${JSON.stringify(
      {
        mode: input.mode,
        orderId: input.orderId,
        checkId: input.checkId ?? null,
        documentType: payload.documentType,
        orderNumber: payload.orderNumber,
        bytes: binary.byteLength,
        sha256: createHash('sha256').update(binary).digest('hex'),
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
  return { outputDirectory, binaryPath, textPath, metadataPath };
}
