'use server';

import {
  formalitesPersonnelAbandonDraftInputSchema,
  formalitesPersonnelCreateDraftInputSchema,
  formalitesPersonnelDraftMutationOutcomeSchema,
  formalitesPersonnelDraftReadModelSchema,
  formalitesPersonnelReconcileDraftInputSchema,
  formalitesPersonnelSaveDraftInputSchema,
  type FormalitesPersonnelDraftMutationOutcome,
  type FormalitesPersonnelDraftReadModel,
} from '@yuta/contracts';
import {
  abandonFormalitesPersonnelDraft,
  createFormalitesPersonnelDraft,
  readFormalitesPersonnelDraft,
  reconcileFormalitesPersonnelDraft,
  saveFormalitesPersonnelDraft,
} from '@yuta/db-cloud';
import { z } from 'zod';
import { requireFormalitesTenant } from '../../../../../server/auth/formalites';
import { requirePersonnelPermission } from '../../../../../server/auth/permissions';
import { cloudDatabase } from '../../../../../server/cloud-database';

const returnTo = '/equipe/formalites-personnel';
const employeeIdSchema = z.string().uuid();

export type LoadFormalitesPersonnelDraftActionResult =
  | { kind: 'success'; model: FormalitesPersonnelDraftReadModel }
  | { kind: 'not_found' }
  | { kind: 'server_error' };

export async function loadFormalitesPersonnelDraftAction(
  rawEmployeeId: unknown,
): Promise<LoadFormalitesPersonnelDraftActionResult> {
  const { tenant } = await requireFormalitesTenant('formalites.read', returnTo);
  requirePersonnelPermission(tenant, 'personnel.employee.read');
  const parsedEmployeeId = employeeIdSchema.safeParse(rawEmployeeId);
  if (!parsedEmployeeId.success) return { kind: 'not_found' };

  try {
    const model = await readFormalitesPersonnelDraft(
      cloudDatabase,
      tenant,
      parsedEmployeeId.data,
    );
    return model
      ? {
          kind: 'success',
          model: formalitesPersonnelDraftReadModelSchema.parse(model),
        }
      : { kind: 'not_found' };
  } catch (error: unknown) {
    console.error('Failed to load the Formalités Personnel draft.', error);
    return { kind: 'server_error' };
  }
}

export async function createFormalitesPersonnelDraftAction(
  rawInput: unknown,
): Promise<FormalitesPersonnelDraftMutationOutcome> {
  const { tenant } = await requireMutationTenant(true);
  const parsed = formalitesPersonnelCreateDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) return validationOutcome(parsed.error);
  return runMutation(() =>
    createFormalitesPersonnelDraft(cloudDatabase, tenant, parsed.data),
  );
}

export async function saveFormalitesPersonnelDraftAction(
  rawInput: unknown,
): Promise<FormalitesPersonnelDraftMutationOutcome> {
  const { tenant } = await requireMutationTenant(true);
  const parsed = formalitesPersonnelSaveDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) return validationOutcome(parsed.error);
  return runMutation(() =>
    saveFormalitesPersonnelDraft(cloudDatabase, tenant, parsed.data),
  );
}

export async function reconcileFormalitesPersonnelDraftAction(
  rawInput: unknown,
): Promise<FormalitesPersonnelDraftMutationOutcome> {
  const { tenant } = await requireMutationTenant(true);
  const parsed =
    formalitesPersonnelReconcileDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) return validationOutcome(parsed.error);
  return runMutation(() =>
    reconcileFormalitesPersonnelDraft(cloudDatabase, tenant, parsed.data),
  );
}

export async function abandonFormalitesPersonnelDraftAction(
  rawInput: unknown,
): Promise<FormalitesPersonnelDraftMutationOutcome> {
  const { tenant } = await requireMutationTenant(true);
  const parsed = formalitesPersonnelAbandonDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) return validationOutcome(parsed.error);
  return runMutation(() =>
    abandonFormalitesPersonnelDraft(cloudDatabase, tenant, parsed.data),
  );
}

async function requireMutationTenant(requirePersonnelSourceRead: boolean) {
  const context = await requireFormalitesTenant('formalites.manage', returnTo);
  if (requirePersonnelSourceRead) {
    requirePersonnelPermission(context.tenant, 'personnel.employee.read');
  }
  return context;
}

async function runMutation(
  mutation: () => Promise<FormalitesPersonnelDraftMutationOutcome>,
): Promise<FormalitesPersonnelDraftMutationOutcome> {
  try {
    return formalitesPersonnelDraftMutationOutcomeSchema.parse(
      await mutation(),
    );
  } catch (error: unknown) {
    console.error('Failed to mutate the Formalités Personnel draft.', error);
    return { kind: 'server_error' };
  }
}

function validationOutcome(error: z.ZodError) {
  return formalitesPersonnelDraftMutationOutcomeSchema.parse({
    kind: 'validation_error',
    fieldErrors: error.flatten().fieldErrors,
  });
}
