'use server';

import {
  createLocalCatalogCategoryInputSchema,
  createLocalCatalogItemInputSchema,
  updateLocalCatalogCategoryInputSchema,
  updateLocalCatalogItemInputSchema,
  updateLocalInstructionSettingsInputSchema,
} from '@yuta/contracts/local-pos';
import { revalidatePath } from 'next/cache';
import { siteAgentClient } from '../../../lib/site-agent-client';
import { requireLocalManagementCredentials } from '../../../server/local-management-session';
import {
  toCatalogActionError,
  type CatalogActionState,
} from './catalog-action-state';

export type { CatalogActionState } from './catalog-action-state';

export async function createCatalogCategoryAction(
  _previousState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const input = createLocalCatalogCategoryInputSchema.safeParse({
    name: formData.get('name'),
    sortOrder: Number(formData.get('sortOrder')),
    defaultInstructionCodes: parseCodeList(
      formData.get('defaultInstructionCodes'),
    ),
    additionalInstructionCodes: parseCodeList(
      formData.get('additionalInstructionCodes'),
    ),
  });
  if (!input.success) return validationError();

  try {
    const { token } = await requireLocalManagementCredentials();
    await siteAgentClient.createCatalogCategory(token, input.data);
    revalidateCatalog();
    return { error: null, success: 'Catégorie créée.' };
  } catch (error: unknown) {
    return toCatalogActionError(error);
  }
}

export async function updateCatalogCategoryAction(
  categoryId: string,
  _previousState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const input = updateLocalCatalogCategoryInputSchema.safeParse({
    name: formData.get('name'),
    sortOrder: Number(formData.get('sortOrder')),
    defaultInstructionCodes: parseCodeList(
      formData.get('defaultInstructionCodes'),
    ),
    additionalInstructionCodes: parseCodeList(
      formData.get('additionalInstructionCodes'),
    ),
  });
  if (!input.success) return validationError();

  try {
    const { token } = await requireLocalManagementCredentials();
    await siteAgentClient.updateCatalogCategory(token, categoryId, input.data);
    revalidateCatalog();
    return { error: null, success: 'Catégorie mise à jour.' };
  } catch (error: unknown) {
    return toCatalogActionError(error);
  }
}

export async function updateInstructionSettingsAction(
  _previousState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const input = updateLocalInstructionSettingsInputSchema.safeParse({
    quickInstructionOptions: parseQuickInstructionOptions(
      formData.get('quickInstructionOptions'),
    ),
    allergenOptions: parseNamedOptions(formData.get('allergenOptions')),
  });
  if (!input.success) return validationError();

  try {
    const { token } = await requireLocalManagementCredentials();
    await siteAgentClient.updateInstructionSettings(token, input.data);
    revalidateCatalog();
    return { error: null, success: 'Options mises à jour.' };
  } catch (error: unknown) {
    return toCatalogActionError(error);
  }
}

export async function setCatalogCategoryActiveAction(
  categoryId: string,
  isActive: boolean,
  _previousState: CatalogActionState,
): Promise<CatalogActionState> {
  try {
    const { token } = await requireLocalManagementCredentials();
    await siteAgentClient.updateCatalogCategory(token, categoryId, {
      isActive,
    });
    revalidateCatalog();
    return {
      error: null,
      success: isActive ? 'Catégorie activée.' : 'Catégorie masquée.',
    };
  } catch (error: unknown) {
    return toCatalogActionError(error);
  }
}

export async function createCatalogItemAction(
  _previousState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const input = createLocalCatalogItemInputSchema.safeParse(
    readCatalogItemForm(formData),
  );
  if (!input.success) return validationError();

  try {
    const { token } = await requireLocalManagementCredentials();
    await siteAgentClient.createCatalogItem(token, input.data);
    revalidateCatalog();
    return { error: null, success: 'Article créé.' };
  } catch (error: unknown) {
    return toCatalogActionError(error);
  }
}

export async function updateCatalogItemAction(
  itemId: string,
  _previousState: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const input = updateLocalCatalogItemInputSchema.safeParse(
    readCatalogItemForm(formData),
  );
  if (!input.success) return validationError();

  try {
    const { token } = await requireLocalManagementCredentials();
    await siteAgentClient.updateCatalogItem(token, itemId, input.data);
    revalidateCatalog();
    return { error: null, success: 'Article mis à jour.' };
  } catch (error: unknown) {
    return toCatalogActionError(error);
  }
}

export async function setCatalogItemAvailableAction(
  itemId: string,
  isAvailable: boolean,
  _previousState: CatalogActionState,
): Promise<CatalogActionState> {
  try {
    const { token } = await requireLocalManagementCredentials();
    await siteAgentClient.updateCatalogItem(token, itemId, { isAvailable });
    revalidateCatalog();
    return {
      error: null,
      success: isAvailable ? 'Article disponible.' : 'Article indisponible.',
    };
  } catch (error: unknown) {
    return toCatalogActionError(error);
  }
}

function readCatalogItemForm(formData: FormData) {
  const customInstructions = formData.get('instructionSource') === 'custom';
  return {
    categoryId: formData.get('categoryId'),
    name: formData.get('name'),
    description: optionalText(formData.get('description')),
    priceCents: parsePriceCents(formData.get('price')),
    kitchenStation: formData.get('kitchenStation'),
    orderingPolicy: formData.get('orderingPolicy'),
    variantOptions: parseVariantOptions(formData.get('variantOptions')),
    requiredVariantQuantity: Number(formData.get('requiredVariantQuantity')),
    defaultInstructionCodes: customInstructions
      ? parseCodeList(formData.get('defaultInstructionCodes'))
      : null,
    additionalInstructionCodes: customInstructions
      ? parseCodeList(formData.get('additionalInstructionCodes'))
      : null,
    isAvailable: formData.get('isAvailable') !== 'false',
    sortOrder: Number(formData.get('sortOrder')),
  };
}

function parseCodeList(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string' || !value.trim()) return [];
  return value
    .split(/[\s,]+/)
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean);
}

function parseNamedOptions(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !value.trim()) return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf('=');
      if (separatorIndex < 1) return { code: '', label: '' };
      return {
        code: line.slice(0, separatorIndex).trim().toUpperCase(),
        label: line.slice(separatorIndex + 1).trim(),
      };
    });
}

function parseQuickInstructionOptions(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !value.trim()) return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [definition = '', conflictList = ''] = line.split('|', 2);
      const separatorIndex = definition.indexOf('=');
      if (separatorIndex < 1) {
        return { code: '', label: '', conflictsWith: [] };
      }
      return {
        code: definition.slice(0, separatorIndex).trim().toUpperCase(),
        label: definition.slice(separatorIndex + 1).trim(),
        conflictsWith: parseCodeList(conflictList),
      };
    });
}

function parseVariantOptions(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !value.trim()) return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf('=');
      if (separatorIndex < 1) return { code: '', label: '' };
      return {
        code: line.slice(0, separatorIndex).trim().toUpperCase(),
        label: line.slice(separatorIndex + 1).trim(),
      };
    });
}

function parsePriceCents(value: FormDataEntryValue | null): number {
  if (typeof value !== 'string' || value.trim() === '') return Number.NaN;
  return Math.round(Number(value.replace(',', '.')) * 100);
}

function optionalText(value: FormDataEntryValue | null): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function revalidateCatalog(): void {
  revalidatePath('/management/catalog');
  revalidatePath('/pos');
  revalidatePath('/orders', 'layout');
}

function validationError(): CatalogActionState {
  return {
    error: 'Vérifiez les informations saisies.',
    success: null,
  };
}
