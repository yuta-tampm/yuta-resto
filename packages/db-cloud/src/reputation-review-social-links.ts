import {
  reputationReviewSocialLinkFieldValues,
  reputationReviewSocialLinkIssueCodeSchema,
  reputationReviewSocialLinkProviderSchema,
  reputationReviewSocialLinksSaveInputSchema,
  reputationReviewSocialLinksValuesSchema,
  validateReputationReviewSocialLink,
  type ReputationReviewSocialLinkField,
  type ReputationReviewSocialLinkIssueCode,
  type ReputationReviewSocialLinkProvider,
  type ReputationReviewSocialLinksOutcome,
  type ReputationReviewSocialLinksReadModel,
  type ReputationReviewSocialLinksSaveInput,
  type ReputationReviewSocialLinksValues,
} from '@yuta/contracts/reputation';
import { requireEstablishment, type TenantContext } from '@yuta/tenant';
import { and, desc, eq } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';
import type { CloudDatabaseClient } from './client';
import { reputationAuditEvents, reputationSettings } from './schema';

export const REPUTATION_REVIEW_SOCIAL_LINKS_AUDIT_ACTION =
  'settings.review-social-links.updated.v1';

type ScopedTenantContext = TenantContext & { establishmentId: string };
type ReputationTransaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];
type ModelOutcome = {
  kind: 'success' | 'no_change' | 'conflict';
  model: ReputationReviewSocialLinksReadModel;
};
type CapabilityErrorOutcome =
  | { kind: 'configuration_unavailable' }
  | { kind: 'server_error' };
type ReadOutcome =
  | { kind: 'success'; model: ReputationReviewSocialLinksReadModel }
  | CapabilityErrorOutcome;
type QualifiedEventRow = {
  id: string;
  organizationId: string;
  entityType: 'FEEDBACK' | 'REPLY' | 'CONNECTOR' | 'SETTINGS';
  entityId: string;
  action: string;
  actorUserId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
};
type ScopedSettingsState = {
  id: string;
  values: ReputationReviewSocialLinksValues;
};
type AuditChange = {
  provider: ReputationReviewSocialLinkProvider;
  previousUrl: string | null;
  newUrl: string | null;
};
type ParsedQualifiedEvent = QualifiedEventRow & {
  changes: readonly AuditChange[];
};
type StateEvidence = {
  currentToken: string;
  latestEvent: ParsedQualifiedEvent | null;
  predecessorValues: ReputationReviewSocialLinksValues | null;
  predecessorToken: string | null;
};

const providerOrder = new Map<ReputationReviewSocialLinkProvider, number>([
  ['GOOGLE', 0],
  ['FACEBOOK', 1],
  ['INSTAGRAM', 2],
]);

const providerFields: Readonly<
  Record<ReputationReviewSocialLinkProvider, ReputationReviewSocialLinkField>
> = {
  GOOGLE: 'googleReviewUrl',
  FACEBOOK: 'facebookReviewUrl',
  INSTAGRAM: 'instagramUrl',
};

const fieldProviders: Readonly<
  Record<ReputationReviewSocialLinkField, ReputationReviewSocialLinkProvider>
> = {
  googleReviewUrl: 'GOOGLE',
  facebookReviewUrl: 'FACEBOOK',
  instagramUrl: 'INSTAGRAM',
};

const auditChangeSchema = z
  .object({
    provider: reputationReviewSocialLinkProviderSchema,
    previousUrl: z.string().nullable(),
    newUrl: z.string().nullable(),
  })
  .strict();

const auditMetadataSchema = z
  .object({
    establishmentId: z.string().uuid(),
    changes: z.array(auditChangeSchema).min(1).max(3),
  })
  .strict();

export class ReputationReviewSocialLinksRepositoryError extends Error {
  constructor(
    message: string,
    readonly code: 'ACTOR_REQUIRED' | 'INTEGRITY_ERROR',
  ) {
    super(message);
    this.name = 'ReputationReviewSocialLinksRepositoryError';
  }
}

export async function readReputationReviewSocialLinks(
  db: CloudDatabaseClient,
  context: TenantContext,
): Promise<ReadOutcome> {
  const scopedContext = requireScopedContext(context);

  try {
    return await db.transaction(
      async (transaction) => {
        const settings = await findScopedSettings(transaction, scopedContext);
        if (!settings) return configurationUnavailableOutcome();

        const evidence = await readStateEvidence(
          transaction,
          scopedContext,
          settings,
        );
        if (!evidence) return serverErrorOutcome();

        return successOutcome(settings.values, evidence.currentToken);
      },
      { isolationLevel: 'repeatable read' },
    );
  } catch {
    return serverErrorOutcome();
  }
}

export async function saveReputationReviewSocialLinks(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: ReputationReviewSocialLinksSaveInput | unknown,
): Promise<ReputationReviewSocialLinksOutcome> {
  const scopedContext = requireScopedContext(context);
  const actorUserId = requireUserActor(scopedContext);
  const parsedInput =
    reputationReviewSocialLinksSaveInputSchema.safeParse(rawInput);
  if (!parsedInput.success) return validationOutcome(parsedInput.error);

  try {
    return await db.transaction(async (transaction) => {
      const settings = await lockScopedSettings(transaction, scopedContext);
      if (!settings) return configurationUnavailableOutcome();

      const evidence = await readStateEvidence(
        transaction,
        scopedContext,
        settings,
      );
      if (!evidence) return serverErrorOutcome();

      const input = parsedInput.data;
      const currentMatchesExpected =
        valuesEqual(settings.values, input.expectedValues) &&
        evidence.currentToken === input.expectedStateToken;
      const currentMatchesProposed = valuesEqual(
        settings.values,
        input.proposedValues,
      );

      if (currentMatchesExpected && currentMatchesProposed) {
        return noChangeOutcome(settings.values, evidence.currentToken);
      }

      if (!currentMatchesExpected) {
        if (!currentMatchesProposed) {
          return conflictOutcome(settings.values, evidence.currentToken);
        }

        if (isProvenReplay(input, actorUserId, evidence)) {
          return successOutcome(settings.values, evidence.currentToken);
        }
        return noChangeOutcome(settings.values, evidence.currentToken);
      }

      const changes = deriveChanges(settings.values, input.proposedValues);
      if (changes.length === 0) {
        return noChangeOutcome(settings.values, evidence.currentToken);
      }

      const recordedAt = nextRecordedAt(evidence.latestEvent?.createdAt);
      const eventId = uuidv7();
      const [updated] = await transaction
        .update(reputationSettings)
        .set({
          googleReviewUrl: input.proposedValues.googleReviewUrl,
          facebookReviewUrl: input.proposedValues.facebookReviewUrl,
          instagramUrl: input.proposedValues.instagramUrl,
          updatedAt: recordedAt,
        })
        .where(
          and(
            eq(reputationSettings.id, settings.id),
            eq(reputationSettings.organizationId, scopedContext.organizationId),
            eq(
              reputationSettings.establishmentId,
              scopedContext.establishmentId,
            ),
          ),
        )
        .returning({ id: reputationSettings.id });
      if (!updated) {
        throw new ReputationReviewSocialLinksRepositoryError(
          'The scoped Reputation settings row changed unexpectedly.',
          'INTEGRITY_ERROR',
        );
      }

      await transaction.insert(reputationAuditEvents).values({
        id: eventId,
        organizationId: scopedContext.organizationId,
        entityType: 'SETTINGS',
        entityId: settings.id,
        action: REPUTATION_REVIEW_SOCIAL_LINKS_AUDIT_ACTION,
        actorUserId,
        metadata: {
          establishmentId: scopedContext.establishmentId,
          changes,
        },
        createdAt: recordedAt,
      });

      return successOutcome(
        input.proposedValues,
        createStateToken(settings.id, eventId, input.proposedValues),
      );
    });
  } catch {
    return serverErrorOutcome();
  }
}

function requireScopedContext(context: TenantContext): ScopedTenantContext {
  requireEstablishment(context);
  return context;
}

function requireUserActor(context: ScopedTenantContext): string {
  if (context.actor.type !== 'user') {
    throw new ReputationReviewSocialLinksRepositoryError(
      'An authenticated user actor is required.',
      'ACTOR_REQUIRED',
    );
  }
  return context.actor.userId;
}

async function findScopedSettings(
  db: CloudDatabaseClient | ReputationTransaction,
  context: ScopedTenantContext,
): Promise<ScopedSettingsState | null> {
  const [row] = await db
    .select({
      id: reputationSettings.id,
      googleReviewUrl: reputationSettings.googleReviewUrl,
      facebookReviewUrl: reputationSettings.facebookReviewUrl,
      instagramUrl: reputationSettings.instagramUrl,
    })
    .from(reputationSettings)
    .where(
      and(
        eq(reputationSettings.organizationId, context.organizationId),
        eq(reputationSettings.establishmentId, context.establishmentId),
      ),
    )
    .limit(1);
  if (!row) return null;

  const parsedValues = reputationReviewSocialLinksValuesSchema.safeParse({
    googleReviewUrl: row.googleReviewUrl,
    facebookReviewUrl: row.facebookReviewUrl,
    instagramUrl: row.instagramUrl,
  });
  if (!parsedValues.success) {
    throw new ReputationReviewSocialLinksRepositoryError(
      'The stored Reputation link state is invalid.',
      'INTEGRITY_ERROR',
    );
  }
  return { id: row.id, values: parsedValues.data };
}

async function lockScopedSettings(
  transaction: ReputationTransaction,
  context: ScopedTenantContext,
): Promise<ScopedSettingsState | null> {
  const [row] = await transaction
    .select({
      id: reputationSettings.id,
      googleReviewUrl: reputationSettings.googleReviewUrl,
      facebookReviewUrl: reputationSettings.facebookReviewUrl,
      instagramUrl: reputationSettings.instagramUrl,
    })
    .from(reputationSettings)
    .where(
      and(
        eq(reputationSettings.organizationId, context.organizationId),
        eq(reputationSettings.establishmentId, context.establishmentId),
      ),
    )
    .limit(1)
    .for('update');
  if (!row) return null;

  const parsedValues = reputationReviewSocialLinksValuesSchema.safeParse({
    googleReviewUrl: row.googleReviewUrl,
    facebookReviewUrl: row.facebookReviewUrl,
    instagramUrl: row.instagramUrl,
  });
  if (!parsedValues.success) {
    throw new ReputationReviewSocialLinksRepositoryError(
      'The stored Reputation link state is invalid.',
      'INTEGRITY_ERROR',
    );
  }
  return { id: row.id, values: parsedValues.data };
}

async function readStateEvidence(
  db: CloudDatabaseClient | ReputationTransaction,
  context: ScopedTenantContext,
  settings: ScopedSettingsState,
): Promise<StateEvidence | null> {
  const rows = await db
    .select({
      id: reputationAuditEvents.id,
      organizationId: reputationAuditEvents.organizationId,
      entityType: reputationAuditEvents.entityType,
      entityId: reputationAuditEvents.entityId,
      action: reputationAuditEvents.action,
      actorUserId: reputationAuditEvents.actorUserId,
      metadata: reputationAuditEvents.metadata,
      createdAt: reputationAuditEvents.createdAt,
    })
    .from(reputationAuditEvents)
    .where(
      and(
        eq(reputationAuditEvents.organizationId, context.organizationId),
        eq(reputationAuditEvents.entityType, 'SETTINGS'),
        eq(reputationAuditEvents.entityId, settings.id),
        eq(
          reputationAuditEvents.action,
          REPUTATION_REVIEW_SOCIAL_LINKS_AUDIT_ACTION,
        ),
      ),
    )
    .orderBy(
      desc(reputationAuditEvents.createdAt),
      desc(reputationAuditEvents.id),
    )
    .limit(2);

  if (rows.length === 0) {
    return {
      currentToken: createStateToken(settings.id, null, settings.values),
      latestEvent: null,
      predecessorValues: null,
      predecessorToken: null,
    };
  }

  const latestEvent = parseQualifiedEvent(rows[0], context, settings.id);
  const previousEvent = rows[1]
    ? parseQualifiedEvent(rows[1], context, settings.id)
    : null;
  if (!latestEvent || (rows[1] && !previousEvent)) return null;
  if (
    previousEvent &&
    latestEvent.createdAt.getTime() <= previousEvent.createdAt.getTime()
  ) {
    return null;
  }

  const predecessorValues = reverseChanges(
    settings.values,
    latestEvent.changes,
  );
  if (!predecessorValues) return null;
  if (previousEvent && !eventEndsAtValues(previousEvent, predecessorValues)) {
    return null;
  }

  return {
    currentToken: createStateToken(
      settings.id,
      latestEvent.id,
      settings.values,
    ),
    latestEvent,
    predecessorValues,
    predecessorToken: createStateToken(
      settings.id,
      previousEvent?.id ?? null,
      predecessorValues,
    ),
  };
}

function parseQualifiedEvent(
  row: QualifiedEventRow,
  context: ScopedTenantContext,
  settingsId: string,
): ParsedQualifiedEvent | null {
  if (
    row.organizationId !== context.organizationId ||
    row.entityType !== 'SETTINGS' ||
    row.entityId !== settingsId ||
    row.action !== REPUTATION_REVIEW_SOCIAL_LINKS_AUDIT_ACTION
  ) {
    return null;
  }

  const parsedMetadata = auditMetadataSchema.safeParse(row.metadata);
  if (
    !parsedMetadata.success ||
    parsedMetadata.data.establishmentId !== context.establishmentId
  ) {
    return null;
  }

  let previousOrder = -1;
  const seen = new Set<ReputationReviewSocialLinkProvider>();
  for (const change of parsedMetadata.data.changes) {
    const order = providerOrder.get(change.provider);
    if (
      order === undefined ||
      order <= previousOrder ||
      seen.has(change.provider)
    ) {
      return null;
    }
    previousOrder = order;
    seen.add(change.provider);

    for (const value of [change.previousUrl, change.newUrl]) {
      const validated = validateReputationReviewSocialLink(
        change.provider,
        value,
      );
      if (!validated.success || validated.value !== value) return null;
    }
    if (change.previousUrl === change.newUrl) return null;
  }

  return { ...row, changes: parsedMetadata.data.changes };
}

function reverseChanges(
  currentValues: ReputationReviewSocialLinksValues,
  changes: readonly AuditChange[],
): ReputationReviewSocialLinksValues | null {
  const predecessor = { ...currentValues };
  for (const change of changes) {
    const field = providerFields[change.provider];
    if (currentValues[field] !== change.newUrl) return null;
    predecessor[field] = change.previousUrl;
  }
  return predecessor;
}

function eventEndsAtValues(
  event: ParsedQualifiedEvent,
  values: ReputationReviewSocialLinksValues,
): boolean {
  return event.changes.every(
    (change) => values[providerFields[change.provider]] === change.newUrl,
  );
}

function deriveChanges(
  previousValues: ReputationReviewSocialLinksValues,
  newValues: ReputationReviewSocialLinksValues,
): AuditChange[] {
  const changes: AuditChange[] = [];
  for (const field of reputationReviewSocialLinkFieldValues) {
    if (previousValues[field] === newValues[field]) continue;
    const provider = fieldProviders[field];
    changes.push({
      provider,
      previousUrl: previousValues[field],
      newUrl: newValues[field],
    });
  }
  return changes;
}

function isProvenReplay(
  input: ReputationReviewSocialLinksSaveInput,
  actorUserId: string,
  evidence: StateEvidence,
): boolean {
  if (
    !evidence.latestEvent ||
    evidence.latestEvent.actorUserId !== actorUserId ||
    !evidence.predecessorValues ||
    !evidence.predecessorToken ||
    input.expectedStateToken !== evidence.predecessorToken ||
    !valuesEqual(input.expectedValues, evidence.predecessorValues)
  ) {
    return false;
  }

  return changesEqual(
    evidence.latestEvent.changes,
    deriveChanges(input.expectedValues, input.proposedValues),
  );
}

function changesEqual(
  left: readonly AuditChange[],
  right: readonly AuditChange[],
): boolean {
  return (
    left.length === right.length &&
    left.every(
      (change, index) =>
        change.provider === right[index]?.provider &&
        change.previousUrl === right[index]?.previousUrl &&
        change.newUrl === right[index]?.newUrl,
    )
  );
}

function valuesEqual(
  left: ReputationReviewSocialLinksValues,
  right: ReputationReviewSocialLinksValues,
): boolean {
  return reputationReviewSocialLinkFieldValues.every(
    (field) => left[field] === right[field],
  );
}

function createStateToken(
  settingsId: string,
  latestEventId: string | null,
  values: ReputationReviewSocialLinksValues,
): string {
  return createHash('sha256')
    .update(
      JSON.stringify([
        'review-social-links-state',
        1,
        settingsId,
        latestEventId,
        values.googleReviewUrl,
        values.facebookReviewUrl,
        values.instagramUrl,
      ]),
      'utf8',
    )
    .digest('hex');
}

function nextRecordedAt(latestRecordedAt: Date | undefined): Date {
  return new Date(
    Math.max(Date.now(), (latestRecordedAt?.getTime() ?? -1) + 1),
  );
}

function validationOutcome(
  error: z.ZodError,
): ReputationReviewSocialLinksOutcome {
  const issues = new Map<
    string,
    {
      field: ReputationReviewSocialLinkField;
      code: ReputationReviewSocialLinkIssueCode;
    }
  >();

  for (const issue of error.issues) {
    const field = issue.path.find((segment) =>
      reputationReviewSocialLinkFieldValues.includes(
        segment as ReputationReviewSocialLinkField,
      ),
    ) as ReputationReviewSocialLinkField | undefined;
    const parsedCode = reputationReviewSocialLinkIssueCodeSchema.safeParse(
      issue.message,
    );
    if (!field || !parsedCode.success) continue;
    issues.set(`${field}:${parsedCode.data}`, {
      field,
      code: parsedCode.data,
    });
  }

  if (issues.size === 0) return serverErrorOutcome();
  return { kind: 'validation_error', issues: [...issues.values()].slice(0, 3) };
}

function readModel(
  values: ReputationReviewSocialLinksValues,
  stateToken: string,
): ReputationReviewSocialLinksReadModel {
  return { values, stateToken };
}

function successOutcome(
  values: ReputationReviewSocialLinksValues,
  stateToken: string,
): ModelOutcome & { kind: 'success' } {
  return { kind: 'success', model: readModel(values, stateToken) };
}

function noChangeOutcome(
  values: ReputationReviewSocialLinksValues,
  stateToken: string,
): ModelOutcome & { kind: 'no_change' } {
  return { kind: 'no_change', model: readModel(values, stateToken) };
}

function conflictOutcome(
  values: ReputationReviewSocialLinksValues,
  stateToken: string,
): ModelOutcome & { kind: 'conflict' } {
  return { kind: 'conflict', model: readModel(values, stateToken) };
}

function configurationUnavailableOutcome(): CapabilityErrorOutcome {
  return { kind: 'configuration_unavailable' };
}

function serverErrorOutcome(): CapabilityErrorOutcome {
  return { kind: 'server_error' };
}
