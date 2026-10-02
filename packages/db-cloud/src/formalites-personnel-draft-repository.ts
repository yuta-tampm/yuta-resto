import {
  formalitesPersonnelAbandonDraftInputSchema,
  formalitesPersonnelCreateDraftInputSchema,
  formalitesPersonnelDraftMutationOutcomeSchema,
  formalitesPersonnelDraftReadModelSchema,
  formalitesPersonnelReconcileDraftInputSchema,
  formalitesPersonnelSaveDraftInputSchema,
  type FormalitesPersonnelAbandonDraftInput,
  type FormalitesPersonnelCreateDraftInput,
  type FormalitesPersonnelDraftMutationOutcome,
  type FormalitesPersonnelDraftReadModel,
  type FormalitesPersonnelFacts,
  type FormalitesPersonnelReconcileDraftInput,
  type FormalitesPersonnelSaveDraftInput,
} from '@yuta/contracts';
import { requireEstablishment, type TenantContext } from '@yuta/tenant';
import { and, desc, eq, sql } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';
import type { CloudDatabaseClient } from './client';
import {
  applyFormalitesPersonnelReconciliation,
  createFormalitesPersonnelSourceStateFingerprint,
  deriveFormalitesPersonnelDivergentFacts,
  FormalitesPersonnelReconciliationError,
} from './formalites-personnel-draft-domain';
import {
  formalitesPersonnelDraftCommandReceipts,
  formalitesPersonnelDrafts,
  personnelEmployeeDossiers,
} from './schema';

type FormalitesTenantContext = TenantContext & { establishmentId: string };
type FormalitesTransaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];
type PersonnelRow = typeof personnelEmployeeDossiers.$inferSelect;
type DraftRow = typeof formalitesPersonnelDrafts.$inferSelect;
type ReceiptRow = typeof formalitesPersonnelDraftCommandReceipts.$inferSelect;
type FormalitesCommand = ReceiptRow['commandType'];
type FormalitesCommandOutcome = ReceiptRow['resultingOutcome'];

export class FormalitesPersonnelDraftRepositoryError extends Error {
  constructor(
    message: string,
    readonly code: 'ACTOR_REQUIRED' | 'INTEGRITY_ERROR',
  ) {
    super(message);
    this.name = 'FormalitesPersonnelDraftRepositoryError';
  }
}

export async function readFormalitesPersonnelDraft(
  db: CloudDatabaseClient,
  context: TenantContext,
  employeeId: string,
): Promise<FormalitesPersonnelDraftReadModel | null> {
  const scopedContext = requireFormalitesScope(context);
  const parsedEmployeeId = z.string().uuid().parse(employeeId);
  const personnel = await findScopedPersonnel(
    db,
    scopedContext,
    parsedEmployeeId,
  );
  if (!personnel) return null;

  const draft = await findPreferredScopedDraft(
    db,
    scopedContext,
    parsedEmployeeId,
  );
  return toReadModel(draft, personnel);
}

export async function createFormalitesPersonnelDraft(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: FormalitesPersonnelCreateDraftInput,
  now = new Date(),
): Promise<FormalitesPersonnelDraftMutationOutcome> {
  const scopedContext = requireFormalitesScope(context);
  const actorUserId = requireUserActor(scopedContext);
  const parsed = formalitesPersonnelCreateDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) return validationOutcome(parsed.error);
  const input = parsed.data;
  const operationKeyHash = hashText(input.operationKey);
  const requestFingerprint = fingerprint({
    employeeId: input.employeeId,
    probationChoice: input.probationChoice,
  });

  try {
    return await db.transaction(async (transaction) => {
      await lockCommand(
        transaction,
        scopedContext,
        actorUserId,
        'create',
        operationKeyHash,
      );
      const replay = await findReplay(
        transaction,
        scopedContext,
        actorUserId,
        'create',
        operationKeyHash,
        requestFingerprint,
      );
      if (replay) {
        return replayOutcome(transaction, scopedContext, replay);
      }

      const personnel = await lockScopedPersonnel(
        transaction,
        scopedContext,
        input.employeeId,
      );
      if (!personnel) return notFoundOutcome();
      if (personnel.employmentTermType !== 'indefinite') {
        return validationError('employeeId', 'employee_not_cdi');
      }

      const activeDraft = await findActiveScopedDraft(
        transaction,
        scopedContext,
        input.employeeId,
      );
      if (activeDraft) {
        return parseMutationOutcome({
          kind: 'active_draft_exists',
          model: toReadModel(activeDraft, personnel),
        });
      }

      const draftId = uuidv7();
      const values = personnelToFacts(personnel);
      const [created] = await transaction
        .insert(formalitesPersonnelDrafts)
        .values({
          id: draftId,
          organizationId: scopedContext.organizationId,
          establishmentId: scopedContext.establishmentId,
          employeeId: input.employeeId,
          formalityType: 'cdi_preparation',
          status: 'draft',
          probationChoice: input.probationChoice,
          revision: 1,
          ...draftValueColumns(values),
          ...sourceValueColumns(values),
          sourcePersonnelRevision: personnel.revision,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      if (!created) throw integrityError('Draft insert returned no row.');

      await insertReceipt(transaction, scopedContext, {
        actorUserId,
        commandType: 'create',
        operationKeyHash,
        requestFingerprint,
        resultingDraftId: created.id,
        resultingDraftRevision: created.revision,
        resultingOutcome: 'created',
        createdAt: now,
      });

      return successOutcome(toReadModel(created, personnel), false);
    });
  } catch (error: unknown) {
    if (!isActiveDraftUniqueViolation(error)) throw error;
    const active = await readActiveDraftAfterUniqueConflict(
      db,
      scopedContext,
      input.employeeId,
    );
    if (!active) {
      throw integrityError(
        'Active-draft uniqueness conflict had no scoped active draft.',
      );
    }
    return parseMutationOutcome({
      kind: 'active_draft_exists',
      model: active,
    });
  }
}

export async function saveFormalitesPersonnelDraft(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: FormalitesPersonnelSaveDraftInput,
  now = new Date(),
): Promise<FormalitesPersonnelDraftMutationOutcome> {
  const scopedContext = requireFormalitesScope(context);
  const actorUserId = requireUserActor(scopedContext);
  const parsed = formalitesPersonnelSaveDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) return validationOutcome(parsed.error);
  const input = parsed.data;
  const operationKeyHash = hashText(input.operationKey);
  const requestFingerprint = fingerprint({
    employeeId: input.employeeId,
    draftId: input.draftId,
    expectedDraftRevision: input.expectedDraftRevision,
    probationChoice: input.probationChoice,
  });

  return db.transaction(async (transaction) => {
    await lockCommand(
      transaction,
      scopedContext,
      actorUserId,
      'save',
      operationKeyHash,
    );
    const replay = await findReplay(
      transaction,
      scopedContext,
      actorUserId,
      'save',
      operationKeyHash,
      requestFingerprint,
    );
    if (replay) return replayOutcome(transaction, scopedContext, replay);

    const personnel = await lockScopedPersonnel(
      transaction,
      scopedContext,
      input.employeeId,
    );
    if (!personnel) return notFoundOutcome();
    const draft = await lockScopedDraft(
      transaction,
      scopedContext,
      input.employeeId,
      input.draftId,
    );
    const precondition = evaluateDraftPreconditions(
      draft,
      personnel,
      input.expectedDraftRevision,
      true,
    );
    if (precondition) return precondition;
    if (!draft) return notFoundOutcome();

    const divergences = deriveFormalitesPersonnelDivergentFacts(
      sourceFacts(draft),
      personnelToFacts(personnel),
    );
    if (divergences.length > 0) {
      return parseMutationOutcome({
        kind: 'stale_personnel_source',
        model: toReadModel(draft, personnel),
      });
    }

    const [updated] = await transaction
      .update(formalitesPersonnelDrafts)
      .set({
        probationChoice: input.probationChoice,
        revision: sql`${formalitesPersonnelDrafts.revision} + 1`,
        updatedAt: now,
      })
      .where(activeDraftMutationScope(scopedContext, input, draft.revision))
      .returning();
    if (!updated) throw integrityError('Locked draft update failed.');

    await insertReceipt(transaction, scopedContext, {
      actorUserId,
      commandType: 'save',
      operationKeyHash,
      requestFingerprint,
      resultingDraftId: updated.id,
      resultingDraftRevision: updated.revision,
      resultingOutcome: 'saved',
      createdAt: now,
    });
    return successOutcome(toReadModel(updated, personnel), false);
  });
}

export async function reconcileFormalitesPersonnelDraft(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: FormalitesPersonnelReconcileDraftInput,
  now = new Date(),
): Promise<FormalitesPersonnelDraftMutationOutcome> {
  const scopedContext = requireFormalitesScope(context);
  const actorUserId = requireUserActor(scopedContext);
  const parsed =
    formalitesPersonnelReconcileDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) return validationOutcome(parsed.error);
  const input = parsed.data;
  const operationKeyHash = hashText(input.operationKey);
  const decisions = [...input.decisions].sort((left, right) =>
    left.fact.localeCompare(right.fact),
  );
  const requestFingerprint = fingerprint({
    employeeId: input.employeeId,
    draftId: input.draftId,
    expectedDraftRevision: input.expectedDraftRevision,
    sourceStateFingerprint: input.sourceStateFingerprint,
    decisions,
  });

  return db.transaction(async (transaction) => {
    await lockCommand(
      transaction,
      scopedContext,
      actorUserId,
      'reconcile',
      operationKeyHash,
    );
    const replay = await findReplay(
      transaction,
      scopedContext,
      actorUserId,
      'reconcile',
      operationKeyHash,
      requestFingerprint,
    );
    if (replay) return replayOutcome(transaction, scopedContext, replay);

    const personnel = await lockScopedPersonnel(
      transaction,
      scopedContext,
      input.employeeId,
    );
    if (!personnel) return notFoundOutcome();
    const draft = await lockScopedDraft(
      transaction,
      scopedContext,
      input.employeeId,
      input.draftId,
    );
    const precondition = evaluateDraftPreconditions(
      draft,
      personnel,
      input.expectedDraftRevision,
      true,
    );
    if (precondition) return precondition;
    if (!draft) return notFoundOutcome();

    const currentValues = personnelToFacts(personnel);
    const currentFingerprint =
      createFormalitesPersonnelSourceStateFingerprint(currentValues);
    if (input.sourceStateFingerprint !== currentFingerprint) {
      return parseMutationOutcome({
        kind: 'stale_personnel_source',
        model: toReadModel(draft, personnel),
      });
    }
    if (
      deriveFormalitesPersonnelDivergentFacts(sourceFacts(draft), currentValues)
        .length === 0
    ) {
      return validationError(
        'decisions',
        'No Personnel divergence requires reconciliation.',
      );
    }

    let reconciliation: ReturnType<
      typeof applyFormalitesPersonnelReconciliation
    >;
    try {
      reconciliation = applyFormalitesPersonnelReconciliation({
        draftValues: draftFacts(draft),
        acknowledgedSourceValues: sourceFacts(draft),
        currentPersonnelValues: currentValues,
        decisions: input.decisions,
      });
    } catch (error: unknown) {
      if (error instanceof FormalitesPersonnelReconciliationError) {
        return validationError('decisions', error.message);
      }
      throw error;
    }

    const [updated] = await transaction
      .update(formalitesPersonnelDrafts)
      .set({
        ...draftValueColumns(reconciliation.draftValues),
        ...sourceValueColumns(reconciliation.acknowledgedSourceValues),
        sourcePersonnelRevision: personnel.revision,
        revision: sql`${formalitesPersonnelDrafts.revision} + 1`,
        updatedAt: now,
      })
      .where(activeDraftMutationScope(scopedContext, input, draft.revision))
      .returning();
    if (!updated) throw integrityError('Locked reconciliation update failed.');

    await insertReceipt(transaction, scopedContext, {
      actorUserId,
      commandType: 'reconcile',
      operationKeyHash,
      requestFingerprint,
      resultingDraftId: updated.id,
      resultingDraftRevision: updated.revision,
      resultingOutcome: 'reconciled',
      createdAt: now,
    });
    return successOutcome(toReadModel(updated, personnel), false);
  });
}

export async function abandonFormalitesPersonnelDraft(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: FormalitesPersonnelAbandonDraftInput,
  now = new Date(),
): Promise<FormalitesPersonnelDraftMutationOutcome> {
  const scopedContext = requireFormalitesScope(context);
  const actorUserId = requireUserActor(scopedContext);
  const parsed = formalitesPersonnelAbandonDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) return validationOutcome(parsed.error);
  const input = parsed.data;
  const operationKeyHash = hashText(input.operationKey);
  const requestFingerprint = fingerprint({
    employeeId: input.employeeId,
    draftId: input.draftId,
    expectedDraftRevision: input.expectedDraftRevision,
    abandonmentReason: input.abandonmentReason,
  });

  return db.transaction(async (transaction) => {
    await lockCommand(
      transaction,
      scopedContext,
      actorUserId,
      'abandon',
      operationKeyHash,
    );
    const replay = await findReplay(
      transaction,
      scopedContext,
      actorUserId,
      'abandon',
      operationKeyHash,
      requestFingerprint,
    );
    if (replay) return replayOutcome(transaction, scopedContext, replay);

    const draft = await lockScopedDraft(
      transaction,
      scopedContext,
      input.employeeId,
      input.draftId,
    );
    if (!draft) return notFoundOutcome();
    const personnel = await findScopedPersonnel(
      transaction,
      scopedContext,
      input.employeeId,
    );
    if (!personnel) return notFoundOutcome();
    if (draft.status === 'abandoned') {
      return parseMutationOutcome({
        kind: 'draft_abandoned',
        model: toReadModel(draft, personnel),
      });
    }
    if (draft.revision !== input.expectedDraftRevision) {
      return parseMutationOutcome({
        kind: 'stale_draft',
        model: toReadModel(draft, personnel),
      });
    }

    const [updated] = await transaction
      .update(formalitesPersonnelDrafts)
      .set({
        status: 'abandoned',
        abandonmentReason: input.abandonmentReason,
        abandonedAt: now,
        revision: sql`${formalitesPersonnelDrafts.revision} + 1`,
        updatedAt: now,
      })
      .where(activeDraftMutationScope(scopedContext, input, draft.revision))
      .returning();
    if (!updated) throw integrityError('Locked abandon update failed.');

    await insertReceipt(transaction, scopedContext, {
      actorUserId,
      commandType: 'abandon',
      operationKeyHash,
      requestFingerprint,
      resultingDraftId: updated.id,
      resultingDraftRevision: updated.revision,
      resultingOutcome: 'abandoned',
      createdAt: now,
    });
    return successOutcome(toReadModel(updated, personnel), false);
  });
}

function requireFormalitesScope(
  context: TenantContext,
): FormalitesTenantContext {
  requireEstablishment(context);
  return context as FormalitesTenantContext;
}

function requireUserActor(context: FormalitesTenantContext): string {
  if (context.actor.type !== 'user') {
    throw new FormalitesPersonnelDraftRepositoryError(
      'A user actor is required.',
      'ACTOR_REQUIRED',
    );
  }
  return context.actor.userId;
}

async function findScopedPersonnel(
  db: CloudDatabaseClient | FormalitesTransaction,
  context: FormalitesTenantContext,
  employeeId: string,
): Promise<PersonnelRow | null> {
  const [row] = await db
    .select()
    .from(personnelEmployeeDossiers)
    .where(personnelScope(context, employeeId))
    .limit(1);
  return row ?? null;
}

async function lockScopedPersonnel(
  transaction: FormalitesTransaction,
  context: FormalitesTenantContext,
  employeeId: string,
): Promise<PersonnelRow | null> {
  const [row] = await transaction
    .select()
    .from(personnelEmployeeDossiers)
    .where(personnelScope(context, employeeId))
    .limit(1)
    .for('update');
  return row ?? null;
}

function personnelScope(context: FormalitesTenantContext, employeeId: string) {
  return and(
    eq(personnelEmployeeDossiers.organizationId, context.organizationId),
    eq(personnelEmployeeDossiers.establishmentId, context.establishmentId),
    eq(personnelEmployeeDossiers.id, employeeId),
  );
}

async function findPreferredScopedDraft(
  db: CloudDatabaseClient | FormalitesTransaction,
  context: FormalitesTenantContext,
  employeeId: string,
): Promise<DraftRow | null> {
  const rows = await db
    .select()
    .from(formalitesPersonnelDrafts)
    .where(
      and(
        eq(formalitesPersonnelDrafts.organizationId, context.organizationId),
        eq(formalitesPersonnelDrafts.establishmentId, context.establishmentId),
        eq(formalitesPersonnelDrafts.employeeId, employeeId),
        eq(formalitesPersonnelDrafts.formalityType, 'cdi_preparation'),
      ),
    )
    .orderBy(
      sql`case when ${formalitesPersonnelDrafts.status} = 'draft' then 0 else 1 end`,
      desc(formalitesPersonnelDrafts.createdAt),
      desc(formalitesPersonnelDrafts.id),
    )
    .limit(1);
  return rows[0] ?? null;
}

async function findActiveScopedDraft(
  db: CloudDatabaseClient | FormalitesTransaction,
  context: FormalitesTenantContext,
  employeeId: string,
): Promise<DraftRow | null> {
  const [row] = await db
    .select()
    .from(formalitesPersonnelDrafts)
    .where(
      and(
        eq(formalitesPersonnelDrafts.organizationId, context.organizationId),
        eq(formalitesPersonnelDrafts.establishmentId, context.establishmentId),
        eq(formalitesPersonnelDrafts.employeeId, employeeId),
        eq(formalitesPersonnelDrafts.formalityType, 'cdi_preparation'),
        eq(formalitesPersonnelDrafts.status, 'draft'),
      ),
    )
    .limit(1);
  return row ?? null;
}

async function lockScopedDraft(
  transaction: FormalitesTransaction,
  context: FormalitesTenantContext,
  employeeId: string,
  draftId: string,
): Promise<DraftRow | null> {
  const [row] = await transaction
    .select()
    .from(formalitesPersonnelDrafts)
    .where(
      and(
        eq(formalitesPersonnelDrafts.organizationId, context.organizationId),
        eq(formalitesPersonnelDrafts.establishmentId, context.establishmentId),
        eq(formalitesPersonnelDrafts.employeeId, employeeId),
        eq(formalitesPersonnelDrafts.id, draftId),
        eq(formalitesPersonnelDrafts.formalityType, 'cdi_preparation'),
      ),
    )
    .limit(1)
    .for('update');
  return row ?? null;
}

function activeDraftMutationScope(
  context: FormalitesTenantContext,
  input: { employeeId: string; draftId: string },
  revision: number,
) {
  return and(
    eq(formalitesPersonnelDrafts.organizationId, context.organizationId),
    eq(formalitesPersonnelDrafts.establishmentId, context.establishmentId),
    eq(formalitesPersonnelDrafts.employeeId, input.employeeId),
    eq(formalitesPersonnelDrafts.id, input.draftId),
    eq(formalitesPersonnelDrafts.formalityType, 'cdi_preparation'),
    eq(formalitesPersonnelDrafts.status, 'draft'),
    eq(formalitesPersonnelDrafts.revision, revision),
  );
}

function evaluateDraftPreconditions(
  draft: DraftRow | null,
  personnel: PersonnelRow,
  expectedRevision: number,
  requireCurrentCdi: boolean,
): FormalitesPersonnelDraftMutationOutcome | null {
  if (!draft) return notFoundOutcome();
  if (draft.status === 'abandoned') {
    return parseMutationOutcome({
      kind: 'draft_abandoned',
      model: toReadModel(draft, personnel),
    });
  }
  if (draft.revision !== expectedRevision) {
    return parseMutationOutcome({
      kind: 'stale_draft',
      model: toReadModel(draft, personnel),
    });
  }
  if (requireCurrentCdi && personnel.employmentTermType !== 'indefinite') {
    return parseMutationOutcome({
      kind: 'ineligible_recovery',
      model: toReadModel(draft, personnel),
    });
  }
  return null;
}

async function lockCommand(
  transaction: FormalitesTransaction,
  context: FormalitesTenantContext,
  actorUserId: string,
  commandType: FormalitesCommand,
  operationKeyHash: string,
): Promise<void> {
  const identity = `${context.organizationId}:${context.establishmentId}:${actorUserId}:formalites.personnel.${commandType}:${operationKeyHash}`;
  await transaction.execute(
    sql`select pg_advisory_xact_lock(hashtextextended(${identity}, 0))`,
  );
}

async function findReplay(
  transaction: FormalitesTransaction,
  context: FormalitesTenantContext,
  actorUserId: string,
  commandType: FormalitesCommand,
  operationKeyHash: string,
  requestFingerprint: string,
): Promise<ReceiptRow | FormalitesPersonnelDraftMutationOutcome | null> {
  const [receipt] = await transaction
    .select()
    .from(formalitesPersonnelDraftCommandReceipts)
    .where(
      and(
        eq(
          formalitesPersonnelDraftCommandReceipts.organizationId,
          context.organizationId,
        ),
        eq(
          formalitesPersonnelDraftCommandReceipts.establishmentId,
          context.establishmentId,
        ),
        eq(formalitesPersonnelDraftCommandReceipts.actorUserId, actorUserId),
        eq(formalitesPersonnelDraftCommandReceipts.commandType, commandType),
        eq(
          formalitesPersonnelDraftCommandReceipts.operationKeyHash,
          operationKeyHash,
        ),
      ),
    )
    .limit(1);
  if (!receipt) return null;
  return receipt.requestFingerprint === requestFingerprint
    ? receipt
    : parseMutationOutcome({ kind: 'replay_conflict' });
}

async function replayOutcome(
  transaction: FormalitesTransaction,
  context: FormalitesTenantContext,
  replay: ReceiptRow | FormalitesPersonnelDraftMutationOutcome,
): Promise<FormalitesPersonnelDraftMutationOutcome> {
  if (!('requestFingerprint' in replay)) return replay;
  const [draft] = await transaction
    .select()
    .from(formalitesPersonnelDrafts)
    .where(
      and(
        eq(formalitesPersonnelDrafts.organizationId, context.organizationId),
        eq(formalitesPersonnelDrafts.establishmentId, context.establishmentId),
        eq(formalitesPersonnelDrafts.id, replay.resultingDraftId),
      ),
    )
    .limit(1);
  if (!draft || draft.revision < replay.resultingDraftRevision) {
    throw integrityError('Committed receipt does not resolve to its draft.');
  }
  const personnel = await findScopedPersonnel(
    transaction,
    context,
    draft.employeeId,
  );
  if (!personnel) {
    throw integrityError('Committed receipt does not resolve to Personnel.');
  }
  return successOutcome(toReadModel(draft, personnel), true);
}

async function insertReceipt(
  transaction: FormalitesTransaction,
  context: FormalitesTenantContext,
  values: {
    actorUserId: string;
    commandType: FormalitesCommand;
    operationKeyHash: string;
    requestFingerprint: string;
    resultingDraftId: string;
    resultingDraftRevision: number;
    resultingOutcome: FormalitesCommandOutcome;
    createdAt: Date;
  },
): Promise<void> {
  await transaction.insert(formalitesPersonnelDraftCommandReceipts).values({
    id: uuidv7(),
    organizationId: context.organizationId,
    establishmentId: context.establishmentId,
    ...values,
  });
}

function toReadModel(
  draft: DraftRow | null,
  personnel: PersonnelRow,
): FormalitesPersonnelDraftReadModel | null {
  const currentPersonnelValues = personnelToFacts(personnel);
  if (!draft) {
    if (personnel.employmentTermType !== 'indefinite') return null;
    return formalitesPersonnelDraftReadModelSchema.parse({
      state: 'eligible_no_draft',
      formalityType: 'cdi_preparation',
      currentPersonnelValues,
    });
  }

  const common = {
    draftId: draft.id,
    formalityType: 'cdi_preparation' as const,
    probationChoice: draft.probationChoice,
    revision: draft.revision,
    draftValues: draftFacts(draft),
    currentPersonnelValues,
    createdAt: draft.createdAt.toISOString(),
    updatedAt: draft.updatedAt.toISOString(),
  };
  if (draft.status === 'abandoned') {
    if (!draft.abandonmentReason || !draft.abandonedAt) {
      throw integrityError('Abandoned draft lifecycle state is incomplete.');
    }
    return formalitesPersonnelDraftReadModelSchema.parse({
      state: 'abandoned',
      status: 'abandoned',
      ...common,
      abandonmentReason: draft.abandonmentReason,
      abandonedAt: draft.abandonedAt.toISOString(),
    });
  }

  const divergentFacts = deriveFormalitesPersonnelDivergentFacts(
    sourceFacts(draft),
    currentPersonnelValues,
  );
  if (personnel.employmentTermType !== 'indefinite') {
    return formalitesPersonnelDraftReadModelSchema.parse({
      state: 'ineligible_recovery',
      status: 'draft',
      ...common,
      divergentFacts,
    });
  }
  if (divergentFacts.length > 0) {
    return formalitesPersonnelDraftReadModelSchema.parse({
      state: 'reconciliation_required',
      status: 'draft',
      ...common,
      divergentFacts,
      sourceStateFingerprint: createFormalitesPersonnelSourceStateFingerprint(
        currentPersonnelValues,
      ),
    });
  }
  return formalitesPersonnelDraftReadModelSchema.parse({
    state: 'editable',
    status: 'draft',
    ...common,
  });
}

function personnelToFacts(row: PersonnelRow): FormalitesPersonnelFacts {
  return {
    givenNames: row.givenNames,
    familyName: row.familyName,
    position: row.position,
    qualification: row.qualification,
    employmentTermType: row.employmentTermType,
    entryDate: row.entryDate,
    contractWeeklyMinutes: row.contractWeeklyMinutes,
  };
}

function draftFacts(row: DraftRow): FormalitesPersonnelFacts {
  return {
    givenNames: row.draftGivenNames,
    familyName: row.draftFamilyName,
    position: row.draftPosition,
    qualification: row.draftQualification,
    employmentTermType: row.draftEmploymentTermType,
    entryDate: row.draftEntryDate,
    contractWeeklyMinutes: row.draftContractWeeklyMinutes,
  };
}

function sourceFacts(row: DraftRow): FormalitesPersonnelFacts {
  return {
    givenNames: row.sourceGivenNames,
    familyName: row.sourceFamilyName,
    position: row.sourcePosition,
    qualification: row.sourceQualification,
    employmentTermType: row.sourceEmploymentTermType,
    entryDate: row.sourceEntryDate,
    contractWeeklyMinutes: row.sourceContractWeeklyMinutes,
  };
}

function draftValueColumns(values: FormalitesPersonnelFacts) {
  return {
    draftGivenNames: values.givenNames,
    draftFamilyName: values.familyName,
    draftPosition: values.position,
    draftQualification: values.qualification,
    draftEmploymentTermType: values.employmentTermType,
    draftEntryDate: values.entryDate,
    draftContractWeeklyMinutes: values.contractWeeklyMinutes,
  };
}

function sourceValueColumns(values: FormalitesPersonnelFacts) {
  return {
    sourceGivenNames: values.givenNames,
    sourceFamilyName: values.familyName,
    sourcePosition: values.position,
    sourceQualification: values.qualification,
    sourceEmploymentTermType: values.employmentTermType,
    sourceEntryDate: values.entryDate,
    sourceContractWeeklyMinutes: values.contractWeeklyMinutes,
  };
}

function successOutcome(
  model: FormalitesPersonnelDraftReadModel | null,
  replayed: boolean,
): FormalitesPersonnelDraftMutationOutcome {
  if (!model) throw integrityError('Successful mutation has no read model.');
  return parseMutationOutcome({ kind: 'success', replayed, model });
}

function notFoundOutcome(): FormalitesPersonnelDraftMutationOutcome {
  return parseMutationOutcome({ kind: 'not_found' });
}

function validationError(
  field: string,
  message: string,
): FormalitesPersonnelDraftMutationOutcome {
  return parseMutationOutcome({
    kind: 'validation_error',
    fieldErrors: { [field]: [message] },
  });
}

function validationOutcome(
  error: z.ZodError,
): FormalitesPersonnelDraftMutationOutcome {
  return parseMutationOutcome({
    kind: 'validation_error',
    fieldErrors: error.flatten().fieldErrors,
  });
}

function parseMutationOutcome(
  value: unknown,
): FormalitesPersonnelDraftMutationOutcome {
  return formalitesPersonnelDraftMutationOutcomeSchema.parse(value);
}

function fingerprint(value: unknown): string {
  return hashText(JSON.stringify(value));
}

function hashText(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function integrityError(message: string) {
  return new FormalitesPersonnelDraftRepositoryError(
    message,
    'INTEGRITY_ERROR',
  );
}

function isActiveDraftUniqueViolation(error: unknown): boolean {
  let current: unknown = error;
  for (let depth = 0; depth < 4 && current; depth += 1) {
    if (typeof current !== 'object') return false;
    const candidate = current as {
      code?: unknown;
      constraint?: unknown;
      constraint_name?: unknown;
      cause?: unknown;
    };
    if (
      candidate.code === '23505' &&
      (candidate.constraint === 'formalites_personnel_drafts_one_active_idx' ||
        candidate.constraint_name ===
          'formalites_personnel_drafts_one_active_idx')
    ) {
      return true;
    }
    current = candidate.cause;
  }
  return false;
}

async function readActiveDraftAfterUniqueConflict(
  db: CloudDatabaseClient,
  context: FormalitesTenantContext,
  employeeId: string,
): Promise<FormalitesPersonnelDraftReadModel | null> {
  const personnel = await findScopedPersonnel(db, context, employeeId);
  if (!personnel) return null;
  const active = await findActiveScopedDraft(db, context, employeeId);
  return active ? toReadModel(active, personnel) : null;
}
