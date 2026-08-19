import type { PrintJob } from '@yuta/db-pos/schema';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { writeInternalTicketPreview } from '../services/internal-ticket-preview-service';

const repositoryRoot = fileURLToPath(new URL('../../../..', import.meta.url));
const presetSchema = z.enum(['compact', 'standard', 'large']);

function readArguments(values: string[]) {
  const read = (name: string) => {
    const index = values.indexOf(name);
    return index === -1 ? undefined : values[index + 1];
  };
  if (values.includes('--help')) {
    console.log(
      'Usage: pnpm internal-ticket:preview [--preset compact|standard|large] [--output <directory>]',
    );
    process.exit(0);
  }
  return {
    preset: presetSchema.parse(read('--preset') ?? 'standard'),
    outputDirectory:
      read('--output') ??
      resolve(
        repositoryRoot,
        'apps/yuta-pos/.tmp/prints/internal-ticket-preview',
      ),
  };
}

async function main() {
  const input = readArguments(process.argv.slice(2));
  const job: PrintJob = {
    id: '019fa0b8-e6e2-7353-b6e8-c9a5698eb8e5',
    orderId: '019fa0b8-e6e2-7353-b6e8-c9a5698eb8e6',
    checkId: null,
    paymentId: null,
    source: 'pos',
    printerName: 'tm-m30-internal-preview',
    jobType: 'test',
    status: 'printing',
    payload: {
      orderNumber: 'POS-PREVIEW-001',
      tableLabel: 'T45',
      orderType: 'dine_in',
      orderNote: 'Sans oignon sur le Bún Gà',
      createdAt: '2026-08-19T10:34:00.000Z',
      includeAllItems: true,
      ticketDestinations: ['kitchen', 'counter'],
      copies: 1,
      fontSizePreset: input.preset,
      topPaddingLines: 1,
      leftPaddingChars: 2,
      bottomPaddingLines: 2,
      items: [
        item('Nems porc (3 pcs)', 'kitchen', 'Entrées'),
        item('Xíu Mai (4 pcs)', 'kitchen', 'Entrées'),
        item(
          'Bánh Bao (1 pce) - pâte au fruit de dragon',
          'kitchen',
          'Entrées',
        ),
        item('Nem vegan supplément', 'kitchen', 'Suppléments'),
        {
          ...item('Menu Petit Enfant', 'kitchen', 'Plats'),
          selectedVariants: [{ labelSnapshot: '2 nems porc', quantity: 1 }],
        },
        item('Bún Gà', 'kitchen', 'Plats', 'Sans oignon'),
        item('Orangina', 'bar', 'Boissons'),
        item('Thé glacé maison', 'bar', 'Boissons'),
        {
          ...item('Mochi glacé (2 pcs)', 'dessert', 'Desserts'),
          selectedVariants: [
            { labelSnapshot: 'Mangue', quantity: 1 },
            { labelSnapshot: 'Matcha', quantity: 1 },
          ],
        },
      ],
    },
    errorMessage: null,
    idempotencyKey: '019fa0b8-e6e2-7353-b6e8-c9a5698eb8e7',
    createdAt: new Date('2026-08-19T10:34:00.000Z'),
    printedAt: null,
  };
  const files = await writeInternalTicketPreview({
    outputDirectory: input.outputDirectory,
    job,
  });
  console.log(
    'Synthetic internal-ticket preview created; no print job was queued.',
  );
  console.log(files.indexPath);
  console.log(files.combinedTextPath);
  for (const file of files.files) {
    console.log(file.textPath);
    console.log(file.binaryPath);
  }
}

function item(
  name: string,
  station: 'kitchen' | 'bar' | 'dessert',
  categoryName: string,
  note: string | null = null,
) {
  return {
    name,
    quantity: 1,
    note,
    quickInstructions: [],
    selectedVariants: [],
    hasAllergy: false,
    allergenCodes: [],
    selectedAllergens: [],
    allergySeverity: null,
    allergyNote: null,
    station,
    categoryName,
  };
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
