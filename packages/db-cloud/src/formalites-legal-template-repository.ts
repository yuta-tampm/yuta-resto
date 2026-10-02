import type { AuthService } from '@yuta/auth';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { isDeepStrictEqual } from 'node:util';
import { v7 as uuidv7 } from 'uuid';
import type { z } from 'zod';
import type { CloudDatabaseClient } from './client';
import {
  FormalitesLegalTemplateError,
  canonicalizeFormalitesLegalSource,
  formalitesTemplateCreateDraftInput,
  formalitesTemplateDraftLocator,
  formalitesTemplateEditDraftInput,
  formalitesTemplateFreezeInput,
  formalitesTemplateIdentityInput,
  formalitesTemplateIdInput,
  formalitesTemplateVersionLocator,
  hashFormalitesLegalSource,
  validateFormalitesLegalSource,
  validateStoredFormalitesTemplateApplicability,
} from './formalites-legal-template-domain';
import {
  formalitesTemplateIdentities as identities,
  formalitesTemplateVersions as versions,
  formalitesTemplateWorkingDrafts as drafts,
} from './schema/formalites-legal-templates';

type Transaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];
type Draft = typeof drafts.$inferSelect;
type Version = typeof versions.$inferSelect;
type FreezeInput = z.infer<typeof formalitesTemplateFreezeInput>;

function exactlyOne<T>(rows: T[]): T {
  if (rows.length !== 1 || rows[0] === undefined)
    throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
  return rows[0];
}

function copyDraft(row: Draft) {
  try {
    return {
      ...row,
      sourceBytes: validateFormalitesLegalSource(
        row.sourceBytes,
        row.contentProfile,
      ),
      applicability: validateStoredFormalitesTemplateApplicability(
        row.applicability,
      ),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      frozenAt: row.frozenAt ? new Date(row.frozenAt) : null,
    };
  } catch {
    throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
  }
}

function verifiedVersion(row: Version) {
  try {
    const sourceBytes = validateFormalitesLegalSource(
      row.sourceBytes,
      row.contentProfile,
    );
    if (
      row.checksumAlgorithm !== 'sha256' ||
      !/^[0-9a-f]{64}$/.test(row.contentChecksum) ||
      hashFormalitesLegalSource(sourceBytes) !== row.contentChecksum
    ) {
      throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
    }
    return {
      ...row,
      sourceBytes,
      applicability: validateStoredFormalitesTemplateApplicability(
        row.applicability,
      ),
      frozenAt: new Date(row.frozenAt),
    };
  } catch {
    throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
  }
}

function verifyBinding(row: Version, draft: Draft) {
  const version = verifiedVersion(row);
  const source = copyDraft(draft);
  if (
    version.templateId !== source.templateId ||
    version.sourceDraftId !== source.id ||
    version.sourceDraftRevision !== source.revision ||
    version.contentProfile !== source.contentProfile ||
    !version.sourceBytes.equals(source.sourceBytes) ||
    !isDeepStrictEqual(version.applicability, source.applicability) ||
    (source.frozenAt !== null &&
      version.frozenAt.getTime() !== source.frozenAt.getTime())
  ) {
    throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
  }
  return version;
}

function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  if ('code' in error && error.code === '23505') return true;
  return (
    'cause' in error && error.cause !== error && isUniqueViolation(error.cause)
  );
}

// Trusted server composition only. No request may supply an auth context or policy.
export function createFormalitesLegalTemplateRepository(
  db: CloudDatabaseClient,
  auth: AuthService,
) {
  async function lockIdentity(tx: Transaction, templateId: string) {
    const rows = await tx
      .select()
      .from(identities)
      .where(eq(identities.id, templateId))
      .for('update');
    if (rows.length === 0) throw new FormalitesLegalTemplateError('NOT_FOUND');
    return exactlyOne(rows);
  }

  async function lockDraft(tx: Transaction, input: FreezeInput) {
    await lockIdentity(tx, input.templateId);
    const rows = await tx
      .select()
      .from(drafts)
      .where(
        and(
          eq(drafts.templateId, input.templateId),
          eq(drafts.id, input.draftId),
        ),
      )
      .for('update');
    if (rows.length === 0) throw new FormalitesLegalTemplateError('NOT_FOUND');
    const row = exactlyOne(rows);
    if (row.revision !== input.expectedRevision)
      throw new FormalitesLegalTemplateError('STALE_DRAFT_REVISION');
    return row;
  }

  async function replay(tx: Transaction, draft: Draft) {
    if (!draft.frozenAt)
      throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
    const rows = await tx
      .select()
      .from(versions)
      .where(
        and(
          eq(versions.templateId, draft.templateId),
          eq(versions.sourceDraftId, draft.id),
          eq(versions.sourceDraftRevision, draft.revision),
        ),
      );
    return { version: verifyBinding(exactlyOne(rows), draft), replayed: true };
  }

  async function createIdentity(input: unknown) {
    await auth.requireFormalitesTemplateSystemOperation(
      'formalites.template.draft.manage',
    );
    const value = formalitesTemplateIdentityInput.parse(input);
    return exactlyOne(
      await db
        .insert(identities)
        .values({ id: uuidv7(), legalPurpose: value.legalPurpose })
        .returning(),
    );
  }

  async function readIdentity(input: unknown) {
    await auth.requireFormalitesTemplateSystemOperation(
      'formalites.template.read',
    );
    const { templateId } = formalitesTemplateIdInput.parse(input);
    const rows = await db
      .select()
      .from(identities)
      .where(eq(identities.id, templateId));
    if (!rows.length) throw new FormalitesLegalTemplateError('NOT_FOUND');
    return exactlyOne(rows);
  }

  async function readDraft(input: unknown) {
    await auth.requireFormalitesTemplateSystemOperation(
      'formalites.template.read',
    );
    const { templateId, draftId } = formalitesTemplateDraftLocator.parse(input);
    const rows = await db
      .select()
      .from(drafts)
      .where(and(eq(drafts.templateId, templateId), eq(drafts.id, draftId)));
    if (!rows.length) throw new FormalitesLegalTemplateError('NOT_FOUND');
    return copyDraft(exactlyOne(rows));
  }

  async function readVersion(input: unknown) {
    await auth.requireFormalitesTemplateSystemOperation(
      'formalites.template.read',
    );
    const { templateId, versionId } =
      formalitesTemplateVersionLocator.parse(input);
    const rows = await db
      .select()
      .from(versions)
      .where(
        and(eq(versions.templateId, templateId), eq(versions.id, versionId)),
      );
    if (!rows.length) throw new FormalitesLegalTemplateError('NOT_FOUND');
    return verifiedVersion(exactlyOne(rows));
  }

  async function readHistory(input: unknown) {
    await auth.requireFormalitesTemplateSystemOperation(
      'formalites.template.read',
    );
    const { templateId } = formalitesTemplateIdInput.parse(input);
    const parent = await db
      .select({ id: identities.id })
      .from(identities)
      .where(eq(identities.id, templateId));
    if (!parent.length) throw new FormalitesLegalTemplateError('NOT_FOUND');
    // Order is deterministic history only, never applicability or qualification.
    const rows = await db
      .select()
      .from(versions)
      .where(eq(versions.templateId, templateId))
      .orderBy(asc(versions.frozenAt), asc(versions.id));
    return rows.map(verifiedVersion);
  }

  async function createDraft(input: unknown) {
    await auth.requireFormalitesTemplateSystemOperation(
      'formalites.template.draft.manage',
    );
    const value = formalitesTemplateCreateDraftInput.parse(input);
    const sourceBytes = canonicalizeFormalitesLegalSource(
      value.sourceBytes,
      value.contentProfile,
    );
    return db.transaction(
      async (tx) => {
        await lockIdentity(tx, value.templateId);
        const active = await tx
          .select({ id: drafts.id })
          .from(drafts)
          .where(
            and(
              eq(drafts.templateId, value.templateId),
              isNull(drafts.frozenAt),
            ),
          );
        if (active.length)
          throw new FormalitesLegalTemplateError('ACTIVE_DRAFT_EXISTS');
        return copyDraft(
          exactlyOne(
            await tx
              .insert(drafts)
              .values({
                id: uuidv7(),
                templateId: value.templateId,
                revision: 1,
                contentProfile: value.contentProfile,
                sourceBytes,
                applicability: value.applicability,
              })
              .returning(),
          ),
        );
      },
      { isolationLevel: 'read committed' },
    );
  }

  async function editDraft(input: unknown) {
    await auth.requireFormalitesTemplateSystemOperation(
      'formalites.template.draft.manage',
    );
    const value = formalitesTemplateEditDraftInput.parse(input);
    const sourceBytes = canonicalizeFormalitesLegalSource(
      value.sourceBytes,
      value.contentProfile,
    );
    return db.transaction(
      async (tx) => {
        const draft = await lockDraft(tx, value);
        if (draft.frozenAt)
          throw new FormalitesLegalTemplateError('DRAFT_FROZEN');
        if (draft.revision >= 2147483647)
          throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
        const rows = await tx
          .update(drafts)
          .set({
            sourceBytes,
            contentProfile: value.contentProfile,
            applicability: value.applicability,
            revision: draft.revision + 1,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(drafts.templateId, value.templateId),
              eq(drafts.id, value.draftId),
              eq(drafts.revision, value.expectedRevision),
              isNull(drafts.frozenAt),
            ),
          )
          .returning();
        return copyDraft(exactlyOne(rows));
      },
      { isolationLevel: 'read committed' },
    );
  }

  async function freezeDraft(input: unknown) {
    await auth.requireFormalitesTemplateSystemOperation(
      'formalites.template.review.submit',
    );
    const value = formalitesTemplateFreezeInput.parse(input);
    try {
      return await db.transaction(
        async (tx) => {
          const draft = await lockDraft(tx, value);
          if (draft.frozenAt) return replay(tx, draft);
          const snapshot = copyDraft(draft);
          const versionId = uuidv7();
          const frozenAt = new Date();
          await tx.insert(versions).values({
            id: versionId,
            templateId: snapshot.templateId,
            sourceDraftId: snapshot.id,
            sourceDraftRevision: snapshot.revision,
            contentProfile: snapshot.contentProfile,
            sourceBytes: snapshot.sourceBytes,
            checksumAlgorithm: 'sha256',
            contentChecksum: hashFormalitesLegalSource(snapshot.sourceBytes),
            applicability: snapshot.applicability,
            frozenAt,
          });
          const inserted = exactlyOne(
            await tx
              .select()
              .from(versions)
              .where(
                and(
                  eq(versions.templateId, snapshot.templateId),
                  eq(versions.id, versionId),
                ),
              ),
          );
          const version = verifyBinding(inserted, snapshot);
          if (
            version.id !== versionId ||
            version.frozenAt.getTime() !== frozenAt.getTime()
          )
            throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
          const closed = exactlyOne(
            await tx
              .update(drafts)
              .set({ frozenAt })
              .where(
                and(
                  eq(drafts.templateId, value.templateId),
                  eq(drafts.id, value.draftId),
                  eq(drafts.revision, value.expectedRevision),
                  isNull(drafts.frozenAt),
                ),
              )
              .returning(),
          );
          verifyBinding(version, closed);
          return { version, replayed: false };
        },
        { isolationLevel: 'read committed' },
      );
    } catch (error) {
      // Only a known unique-constraint failure permits bounded replay recovery.
      // Connection/commit errors propagate; they do not prove commit or rollback.
      if (!isUniqueViolation(error)) throw error;
      await auth.requireFormalitesTemplateSystemOperation(
        'formalites.template.review.submit',
      );
      return db.transaction(
        async (tx) => replay(tx, await lockDraft(tx, value)),
        { isolationLevel: 'read committed' },
      );
    }
  }

  return {
    createIdentity,
    readIdentity,
    readDraft,
    readVersion,
    readHistory,
    createDraft,
    editDraft,
    freezeDraft,
  };
}

export type FormalitesLegalTemplateRepository = ReturnType<
  typeof createFormalitesLegalTemplateRepository
>;
