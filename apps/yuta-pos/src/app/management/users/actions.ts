'use server';

import {
  createLocalUserInputSchema,
  localPinSchema,
  updateLocalUserInputSchema,
} from '@yuta/contracts/local-pos';
import { revalidatePath } from 'next/cache';
import { siteAgentClient } from '../../../lib/site-agent-client';
import { requireLocalManagementCredentials } from '../../../server/local-management-session';
import {
  toLocalUserActionError,
  type LocalUserActionState,
} from './users-action-state';

export type { LocalUserActionState } from './users-action-state';

export async function createLocalUserAction(
  _previousState: LocalUserActionState,
  formData: FormData,
): Promise<LocalUserActionState> {
  const input = createLocalUserInputSchema.safeParse({
    name: formData.get('name'),
    email: optionalEmail(formData.get('email')),
    role: formData.get('role'),
    pin: formData.get('pin'),
  });
  if (!input.success) return validationError();

  const { token } = await requireLocalManagementCredentials();
  try {
    await siteAgentClient.createLocalUser(token, input.data);
    revalidatePath('/management/users');
    return { error: null, success: 'Utilisateur créé.' };
  } catch (error: unknown) {
    return toLocalUserActionError(error);
  }
}

export async function updateLocalUserAction(
  userId: string,
  _previousState: LocalUserActionState,
  formData: FormData,
): Promise<LocalUserActionState> {
  const input = updateLocalUserInputSchema.safeParse({
    name: formData.get('name'),
    email: optionalEmail(formData.get('email')),
    role: formData.get('role'),
    isActive: formData.get('isActive') === 'true',
  });
  if (!input.success) return validationError();

  const { token } = await requireLocalManagementCredentials();
  try {
    await siteAgentClient.updateLocalUser(token, userId, input.data);
    revalidatePath('/management/users');
    return { error: null, success: 'Utilisateur mis à jour.' };
  } catch (error: unknown) {
    return toLocalUserActionError(error);
  }
}

export async function setLocalUserActiveAction(
  userId: string,
  isActive: boolean,
  _previousState: LocalUserActionState,
): Promise<LocalUserActionState> {
  const { token } = await requireLocalManagementCredentials();
  try {
    await siteAgentClient.updateLocalUser(token, userId, { isActive });
    revalidatePath('/management/users');
    return {
      error: null,
      success: isActive ? 'Utilisateur activé.' : 'Utilisateur désactivé.',
    };
  } catch (error: unknown) {
    return toLocalUserActionError(error);
  }
}

export async function resetLocalUserPinAction(
  userId: string,
  _previousState: LocalUserActionState,
  formData: FormData,
): Promise<LocalUserActionState> {
  const pin = localPinSchema.safeParse(formData.get('pin'));
  const confirmation = localPinSchema.safeParse(
    formData.get('pinConfirmation'),
  );
  if (!pin.success || !confirmation.success || pin.data !== confirmation.data) {
    return {
      error: 'Saisissez deux fois le même PIN de 4 à 8 chiffres.',
      success: null,
    };
  }

  const { token } = await requireLocalManagementCredentials();
  try {
    await siteAgentClient.resetLocalUserPin(token, userId, { pin: pin.data });
    revalidatePath('/management/users');
    return { error: null, success: 'Code PIN modifié.' };
  } catch (error: unknown) {
    return toLocalUserActionError(error);
  }
}

function optionalEmail(value: FormDataEntryValue | null): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function validationError(): LocalUserActionState {
  return {
    error: 'Vérifiez les informations saisies.',
    success: null,
  };
}
