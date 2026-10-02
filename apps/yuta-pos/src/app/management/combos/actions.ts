'use server';

import {
  createLocalComboGroupInputSchema,
  createLocalComboGroupItemInputSchema,
  createLocalComboRuleInputSchema,
  updateLocalComboGroupInputSchema,
  updateLocalComboGroupItemInputSchema,
  updateLocalComboRuleInputSchema,
} from '@yuta/contracts/local-pos';
import { revalidatePath } from 'next/cache';
import { siteAgentClient } from '../../../lib/site-agent-client';
import { requireLocalManagementCredentials } from '../../../server/local-management-session';
import {
  toComboActionError,
  type ComboActionState,
} from './combo-action-state';

export type { ComboActionState } from './combo-action-state';

export async function createComboRuleAction(
  _previousState: ComboActionState,
  formData: FormData,
): Promise<ComboActionState> {
  const input = createLocalComboRuleInputSchema.safeParse({
    ...readRuleForm(formData),
    isActive: false,
  });
  if (!input.success) return validationError();
  return execute(async (token) => {
    await siteAgentClient.createComboRule(token, input.data);
    return 'Formule créée inactive.';
  });
}

export async function updateComboRuleAction(
  ruleId: string,
  _previousState: ComboActionState,
  formData: FormData,
): Promise<ComboActionState> {
  const input = updateLocalComboRuleInputSchema.safeParse(
    readRuleForm(formData),
  );
  if (!input.success) return validationError();
  return execute(async (token) => {
    await siteAgentClient.updateComboRule(token, ruleId, input.data);
    return 'Formule mise à jour.';
  });
}

export async function setComboRuleActiveAction(
  ruleId: string,
  isActive: boolean,
  _previousState: ComboActionState,
): Promise<ComboActionState> {
  return execute(async (token) => {
    await siteAgentClient.updateComboRule(token, ruleId, { isActive });
    return isActive ? 'Formule activée.' : 'Formule désactivée.';
  });
}

export async function setComboRuleSuggestionEnabledAction(
  ruleId: string,
  isSuggestionEnabled: boolean,
  _previousState: ComboActionState,
): Promise<ComboActionState> {
  const input = updateLocalComboRuleInputSchema.safeParse({
    isSuggestionEnabled,
  });
  if (!input.success) return validationError();

  return execute(async (token) => {
    await siteAgentClient.updateComboRule(token, ruleId, input.data);
    return isSuggestionEnabled
      ? 'Suggestions à la commande activées.'
      : 'Suggestions à la commande désactivées.';
  });
}

export async function createComboGroupAction(
  ruleId: string,
  _previousState: ComboActionState,
  formData: FormData,
): Promise<ComboActionState> {
  const input = createLocalComboGroupInputSchema.safeParse({
    comboRuleId: ruleId,
    ...readGroupForm(formData),
  });
  if (!input.success) return validationError();
  return execute(async (token) => {
    await siteAgentClient.createComboGroup(token, input.data);
    return 'Groupe créé.';
  });
}

export async function updateComboGroupAction(
  groupId: string,
  _previousState: ComboActionState,
  formData: FormData,
): Promise<ComboActionState> {
  const input = updateLocalComboGroupInputSchema.safeParse(
    readGroupForm(formData),
  );
  if (!input.success) return validationError();
  return execute(async (token) => {
    await siteAgentClient.updateComboGroup(token, groupId, input.data);
    return 'Groupe mis à jour.';
  });
}

export async function deleteComboGroupAction(
  groupId: string,
  _previousState: ComboActionState,
): Promise<ComboActionState> {
  return execute(async (token) => {
    await siteAgentClient.deleteComboGroup(token, groupId);
    return 'Groupe supprimé.';
  });
}

export async function createComboGroupItemAction(
  groupId: string,
  _previousState: ComboActionState,
  formData: FormData,
): Promise<ComboActionState> {
  const input = createLocalComboGroupItemInputSchema.safeParse({
    comboRuleGroupId: groupId,
    menuItemId: formData.get('menuItemId'),
    extraPriceCents: parsePriceCents(formData.get('extraPrice')),
  });
  if (!input.success) return validationError();
  return execute(async (token) => {
    await siteAgentClient.createComboGroupItem(token, input.data);
    return 'Article ajouté au groupe.';
  });
}

export async function updateComboGroupItemAction(
  groupItemId: string,
  _previousState: ComboActionState,
  formData: FormData,
): Promise<ComboActionState> {
  const input = updateLocalComboGroupItemInputSchema.safeParse({
    extraPriceCents: parsePriceCents(formData.get('extraPrice')),
  });
  if (!input.success) return validationError();
  return execute(async (token) => {
    await siteAgentClient.updateComboGroupItem(token, groupItemId, input.data);
    return 'Supplément mis à jour.';
  });
}

export async function deleteComboGroupItemAction(
  groupItemId: string,
  _previousState: ComboActionState,
): Promise<ComboActionState> {
  return execute(async (token) => {
    await siteAgentClient.deleteComboGroupItem(token, groupItemId);
    return 'Article retiré du groupe.';
  });
}

function readRuleForm(formData: FormData) {
  const maxApplicationsValue = formData.get('maxApplications');
  return {
    name: formData.get('name'),
    pricingMode: formData.get('pricingMode'),
    comboPriceCents: parsePriceCents(formData.get('comboPrice')),
    priceDeltaCents: parseSignedPriceCents(formData.get('priceDelta')),
    basePricingGroupName: optionalText(formData.get('basePricingGroupName')),
    priority: Number(formData.get('priority')),
    maxApplications:
      typeof maxApplicationsValue === 'string' &&
      maxApplicationsValue.trim() !== ''
        ? Number(maxApplicationsValue)
        : null,
  };
}

function readGroupForm(formData: FormData) {
  return {
    name: formData.get('name'),
    minQuantity: Number(formData.get('minQuantity')),
    maxQuantity: Number(formData.get('maxQuantity')),
    sortOrder: Number(formData.get('sortOrder')),
  };
}

function parsePriceCents(value: FormDataEntryValue | null): number {
  const amount = parseDecimal(value);
  return Number.isFinite(amount) ? Math.round(amount * 100) : Number.NaN;
}

function parseSignedPriceCents(value: FormDataEntryValue | null): number {
  return parsePriceCents(value);
}

function parseDecimal(value: FormDataEntryValue | null): number {
  if (typeof value !== 'string' || value.trim() === '') return Number.NaN;
  return Number(value.replace(',', '.'));
}

function optionalText(value: FormDataEntryValue | null): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

async function execute(
  operation: (token: string) => Promise<string>,
): Promise<ComboActionState> {
  try {
    const { token } = await requireLocalManagementCredentials();
    const success = await operation(token);
    revalidatePath('/management/combos');
    revalidatePath('/orders', 'layout');
    return { error: null, success };
  } catch (error: unknown) {
    return toComboActionError(error);
  }
}

function validationError(): ComboActionState {
  return {
    error: 'Vérifiez les informations saisies.',
    success: null,
  };
}
