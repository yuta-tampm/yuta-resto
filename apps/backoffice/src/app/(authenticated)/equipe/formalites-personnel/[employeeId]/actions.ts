'use server';

import {
  formalitesPersonnelAbandonDraftInputSchema,
  formalitesPersonnelCreateDraftInputSchema,
  formalitesPersonnelDraftMutationOutcomeSchema,
  formalitesPersonnelDraftReadModelSchema,
  formalitesPersonnelReconcileDraftInputSchema,
  formalitesPersonnelSaveDraftInputSchema,
  type FormalitesPersonnelDraftMutationOutcome,
} from '@yuta/contracts';
import {
  abandonFormalitesPersonnelDraft,
  createFormalitesPersonnelDraft,
  readFormalitesPersonnelDraft,
  reconcileFormalitesPersonnelDraft,
  saveFormalitesPersonnelDraft,
} from '@yuta/db-cloud';
import { TenantError } from '@yuta/tenant';
import { z } from 'zod';
import { requireFormalitesTenant } from '@/server/auth/formalites';
import {
  requirePersonnelPermission,
  type FormalitesPermission,
} from '@/server/auth/permissions';
import { cloudDatabase } from '@/server/cloud-database';
import type {
  CdiDraftWorkspaceForbiddenResult,
  FormalitesPersonnelDraftMutationActionResult,
  LoadFormalitesPersonnelDraftActionResult,
} from '../_lib/cdi-draft-workspace-action-result';

export type {
  FormalitesPersonnelDraftMutationActionResult,
  LoadFormalitesPersonnelDraftActionResult,
} from '../_lib/cdi-draft-workspace-action-result';

const returnTo = '/equipe/formalites-personnel';
const employeeIdSchema = z.string().uuid();

export async function loadFormalitesPersonnelDraftAction(
  rawEmployeeId: unknown,
): Promise<LoadFormalitesPersonnelDraftActionResult> {
  const access = await authorizeDraftAccess('formalites.read');
  if (access.kind === 'forbidden') return access;
  const { tenant } = access;
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
): Promise<FormalitesPersonnelDraftMutationActionResult> {
  const access = await authorizeDraftAccess('formalites.manage');
  if (access.kind === 'forbidden') return access;
  const { tenant } = access;
  const parsed = formalitesPersonnelCreateDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) return validationOutcome(parsed.error);
  return runMutation(() =>
    createFormalitesPersonnelDraft(cloudDatabase, tenant, parsed.data),
  );
}

export async function saveFormalitesPersonnelDraftAction(
  rawInput: unknown,
): Promise<FormalitesPersonnelDraftMutationActionResult> {
  const access = await authorizeDraftAccess('formalites.manage');
  if (access.kind === 'forbidden') return access;
  const { tenant } = access;
  const parsed = formalitesPersonnelSaveDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) return validationOutcome(parsed.error);
  return runMutation(() =>
    saveFormalitesPersonnelDraft(cloudDatabase, tenant, parsed.data),
  );
}

export async function reconcileFormalitesPersonnelDraftAction(
  rawInput: unknown,
): Promise<FormalitesPersonnelDraftMutationActionResult> {
  const access = await authorizeDraftAccess('formalites.manage');
  if (access.kind === 'forbidden') return access;
  const { tenant } = access;
  const parsed =
    formalitesPersonnelReconcileDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) return validationOutcome(parsed.error);
  return runMutation(() =>
    reconcileFormalitesPersonnelDraft(cloudDatabase, tenant, parsed.data),
  );
}

export async function abandonFormalitesPersonnelDraftAction(
  rawInput: unknown,
): Promise<FormalitesPersonnelDraftMutationActionResult> {
  const access = await authorizeDraftAccess('formalites.manage');
  if (access.kind === 'forbidden') return access;
  const { tenant } = access;
  const parsed = formalitesPersonnelAbandonDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) return validationOutcome(parsed.error);
  return runMutation(() =>
    abandonFormalitesPersonnelDraft(cloudDatabase, tenant, parsed.data),
  );
}

/**
 * Resolves the trusted session, active membership and establishment, then
 * requires the Formalités permission and independent Personnel source READ.
 * Only an actual trusted permission denial (403) becomes a local `forbidden`
 * result; login and scope-recovery redirects, the missing-establishment error
 * and unexpected failures propagate unchanged.
 */
async function authorizeDraftAccess(
  permission: FormalitesPermission,
): Promise<
  | { kind: 'authorized'; tenant: TrustedFormalitesTenant }
  | CdiDraftWorkspaceForbiddenResult
> {
  try {
    const { tenant } = await requireFormalitesTenant(permission, returnTo);
    requirePersonnelPermission(tenant, 'personnel.employee.read');
    return { kind: 'authorized', tenant };
  } catch (error: unknown) {
    if (isPermissionDenial(error)) return { kind: 'forbidden' };
    throw error;
  }
}

type TrustedFormalitesTenant = Awaited<
  ReturnType<typeof requireFormalitesTenant>
>['tenant'];

function isPermissionDenial(error: unknown): boolean {
  return (
    error instanceof TenantError &&
    error.statusCode === 403 &&
    error.code === 'CROSS_TENANT_ACCESS_DENIED'
  );
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
