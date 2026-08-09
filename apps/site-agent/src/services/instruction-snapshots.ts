import type {
  AllergenSnapshot,
  ItemVariantSnapshot,
  SelectedInstructionSnapshot,
} from '@yuta/db-pos/schema';
import { HttpError } from '../http';

export function buildInstructionSnapshots(
  options: Array<{ code: string; label: string; conflictsWith: string[] }>,
  codes: string[],
): SelectedInstructionSnapshot[] {
  const byCode = new Map(options.map((option) => [option.code, option]));
  const selected = new Set(codes);
  for (const code of selected) {
    const option = byCode.get(code);
    if (!option) {
      throw new HttpError(
        422,
        'UNKNOWN_INSTRUCTION',
        `Unknown quick instruction code: ${code}.`,
      );
    }
    if (option.conflictsWith.some((conflict) => selected.has(conflict))) {
      throw new HttpError(
        422,
        'CONFLICTING_INSTRUCTIONS',
        `Conflicting quick instructions include ${code}.`,
      );
    }
  }

  return codes.map((code) => ({
    instructionId: `qi_${code.toLowerCase()}`,
    code,
    labelSnapshot: byCode.get(code)?.label ?? code,
  }));
}

export function buildAllergenSnapshots(
  options: Array<{ code: string; label: string }>,
  codes: string[],
): AllergenSnapshot[] {
  const byCode = new Map(options.map((option) => [option.code, option]));
  if (codes.some((code) => !byCode.has(code))) {
    throw new HttpError(422, 'UNKNOWN_ALLERGEN', 'Unknown allergen.');
  }
  return codes.map((code) => ({
    code,
    labelSnapshot: byCode.get(code)?.label ?? code,
  }));
}

export function buildVariantSnapshots(
  variantOptions: Array<{ code: string; label: string }>,
  requiredVariantQuantity: number,
  itemQuantity: number,
  selections: Array<{ code: string; quantity: number }>,
): ItemVariantSnapshot[] {
  const selected = selections.filter(({ quantity }) => quantity > 0);
  if (variantOptions.length === 0) {
    if (selected.length > 0) {
      throw new HttpError(
        422,
        'VARIANTS_NOT_AVAILABLE',
        'Variants are not available for this item.',
      );
    }
    return [];
  }

  const labels = Object.fromEntries(
    variantOptions.map(({ code, label }) => [code, label]),
  );
  if (selected.some(({ code }) => !labels[code])) {
    throw new HttpError(422, 'UNKNOWN_VARIANT', 'Unknown item variant.');
  }
  const total = selected.reduce((sum, item) => sum + item.quantity, 0);
  const requiredTotal = itemQuantity * requiredVariantQuantity;
  if (requiredVariantQuantity > 0 && total !== requiredTotal) {
    throw new HttpError(
      422,
      'INVALID_VARIANT_QUANTITY',
      `Select exactly ${requiredTotal} item variants.`,
    );
  }

  return selected.map(({ code, quantity }) => ({
    code,
    labelSnapshot: labels[code],
    quantity,
  }));
}
