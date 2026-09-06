import { config } from 'dotenv';
import { and, eq, sql } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import { createCloudDatabaseClient } from '../src/client';
import {
  abandonFormalitesPersonnelDraft,
  createFormalitesPersonnelDraft,
  readFormalitesPersonnelDraft,
  reconcileFormalitesPersonnelDraft,
  saveFormalitesPersonnelDraft,
} from '../src/formalites-personnel-draft-repository';
import {
  establishments,
  formalitesPersonnelDraftCommandReceipts,
  formalitesPersonnelDrafts,
  organizations,
  personnelCommandReceipts,
  personnelEmployeeAuditEvents,
  personnelEmployeeDossiers,
  personnelEmployeeHistoryEvents,
  personnelRegisterAuditEvents,
  personnelRegisterCommandReceipts,
  personnelRegisterCorrections,
  personnelRegisterEntries,
  users,
} from '../src/schema';
import type { TenantContext } from '@yuta/tenant';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('Formalités Personnel draft repository', () => {
  const db = createCloudDatabaseClient(process.env);
  const organizationId = uuidv7();
  const establishmentId = uuidv7();
  const otherOrganizationId = uuidv7();
  const otherEstablishmentId = uuidv7();
  const actorUserId = uuidv7();
  const otherActorUserId = uuidv7();

  const context = tenant(organizationId, establishmentId, actorUserId);
  const otherContext = tenant(
    otherOrganizationId,
    otherEstablishmentId,
    otherActorUserId,
  );

  beforeAll(async () => {
    await db.insert(organizations).values([
      {
        id: organizationId,
        name: 'Formalités repository A',
        slug: `formalites-repository-a-${organizationId}`,
      },
      {
        id: otherOrganizationId,
        name: 'Formalités repository B',
        slug: `formalites-repository-b-${otherOrganizationId}`,
      },
    ]);
    await db.insert(establishments).values([
      {
        id: establishmentId,
        organizationId,
        name: 'Formalités repository A',
        slug: `formalites-repository-a-${establishmentId}`,
      },
      {
        id: otherEstablishmentId,
        organizationId: otherOrganizationId,
        name: 'Formalités repository B',
        slug: `formalites-repository-b-${otherEstablishmentId}`,
      },
    ]);
    await db.insert(users).values([
      {
        id: actorUserId,
        authProviderId: `test:formalites-repository:${actorUserId}`,
        email: `formalites-repository-${actorUserId}@example.test`,
      },
      {
        id: otherActorUserId,
        authProviderId: `test:formalites-repository:${otherActorUserId}`,
        email: `formalites-repository-${otherActorUserId}@example.test`,
      },
    ]);
  });

  afterAll(async () => {
    await db
      .delete(formalitesPersonnelDraftCommandReceipts)
      .where(
        sql`${formalitesPersonnelDraftCommandReceipts.organizationId} in (${organizationId}, ${otherOrganizationId})`,
      );
    await db
      .delete(formalitesPersonnelDrafts)
      .where(
        sql`${formalitesPersonnelDrafts.organizationId} in (${organizationId}, ${otherOrganizationId})`,
      );
    await db
      .delete(personnelEmployeeDossiers)
      .where(
        sql`${personnelEmployeeDossiers.organizationId} in (${organizationId}, ${otherOrganizationId})`,
      );
    await db
      .delete(users)
      .where(sql`${users.id} in (${actorUserId}, ${otherActorUserId})`);
    await db
      .delete(establishments)
      .where(
        sql`${establishments.organizationId} in (${organizationId}, ${otherOrganizationId})`,
      );
    await db
      .delete(organizations)
      .where(
        sql`${organizations.id} in (${organizationId}, ${otherOrganizationId})`,
      );
  });

  it('reads eligible current Personnel and fails closed for wrong scope', async () => {
    const employeeId = await insertEmployee({
      givenNames: 'Alice',
      workTimeCategory: 'part_time',
      departureDate: '2026-12-31',
    });
    const model = await readFormalitesPersonnelDraft(db, context, employeeId);
    expect(model).toMatchObject({
      state: 'eligible_no_draft',
      currentPersonnelValues: {
        givenNames: 'Alice',
        employmentTermType: 'indefinite',
      },
    });
    expect(
      await readFormalitesPersonnelDraft(db, otherContext, employeeId),
    ).toBeNull();
  });

  it('creates one eligible draft from exactly seven coherent facts without extra eligibility gates', async () => {
    const employeeId = await insertEmployee({
      givenNames: 'Brune',
      workTimeCategory: 'part_time',
      departureDate: '2026-12-31',
    });
    const before = await personnelEvidence(employeeId);
    const result = await createFormalitesPersonnelDraft(db, context, {
      employeeId,
      probationChoice: 'undecided',
      operationKey: operationKey('create-seven-facts'),
    });
    expect(result.kind).toBe('success');
    if (result.kind !== 'success') return;
    expect(result.replayed).toBe(false);
    expect(result.model).toMatchObject({
      state: 'editable',
      probationChoice: 'undecided',
      draftValues: {
        givenNames: 'Brune',
        familyName: 'Durand',
        position: 'Serveuse',
        qualification: 'Employée',
        employmentTermType: 'indefinite',
        entryDate: '2026-09-01',
        contractWeeklyMinutes: 1_800,
      },
    });
    await expectPersonnelUnchanged(employeeId, before);
  });

  it('rejects non-CDI create and wrong employee/organization/establishment scope', async () => {
    const fixedEmployeeId = await insertEmployee({
      employmentTermType: 'fixed_term',
      expectedEndDate: '2027-01-31',
    });
    const rejected = await createFormalitesPersonnelDraft(db, context, {
      employeeId: fixedEmployeeId,
      probationChoice: 'undecided',
      operationKey: operationKey('fixed-term-create'),
    });
    expect(rejected).toMatchObject({ kind: 'validation_error' });

    const otherEmployeeId = await insertEmployee(
      { givenNames: 'Other' },
      otherContext,
    );
    for (const candidateContext of [
      context,
      tenant(organizationId, otherEstablishmentId, actorUserId),
    ]) {
      const result = await createFormalitesPersonnelDraft(
        db,
        candidateContext,
        {
          employeeId: otherEmployeeId,
          probationChoice: 'undecided',
          operationKey: operationKey('wrong-scope'),
        },
      );
      expect(result).toEqual({ kind: 'not_found' });
    }
  });

  it('serializes concurrent create and permits a new draft after abandonment', async () => {
    const employeeId = await insertEmployee({ givenNames: 'Concurrent' });
    const [left, right] = await Promise.all([
      createFormalitesPersonnelDraft(db, context, {
        employeeId,
        probationChoice: 'include',
        operationKey: operationKey('concurrent-left'),
      }),
      createFormalitesPersonnelDraft(db, context, {
        employeeId,
        probationChoice: 'exclude',
        operationKey: operationKey('concurrent-right'),
      }),
    ]);
    expect([left.kind, right.kind].sort()).toEqual([
      'active_draft_exists',
      'success',
    ]);
    const active = await activeDraft(employeeId);
    expect(active).toHaveLength(1);

    const abandoned = await abandonFormalitesPersonnelDraft(db, context, {
      employeeId,
      draftId: active[0]!.id,
      expectedDraftRevision: active[0]!.revision,
      abandonmentReason: 'Préparation remplacée.',
      operationKey: operationKey('concurrent-abandon'),
    });
    expect(abandoned.kind).toBe('success');
    const recreated = await createFormalitesPersonnelDraft(db, context, {
      employeeId,
      probationChoice: 'undecided',
      operationKey: operationKey('create-after-abandon'),
    });
    expect(recreated.kind).toBe('success');
    expect(await activeDraft(employeeId)).toHaveLength(1);
  });

  it('saves UNDECIDED, INCLUDE and EXCLUDE with revision and no Personnel writes', async () => {
    const employeeId = await insertEmployee({ givenNames: 'SaveStates' });
    const draftId = await createDraft(employeeId);
    let revision = 1;
    for (const probationChoice of [
      'undecided',
      'include',
      'exclude',
    ] as const) {
      const before = await personnelEvidence(employeeId);
      const result = await saveFormalitesPersonnelDraft(db, context, {
        employeeId,
        draftId,
        expectedDraftRevision: revision,
        probationChoice,
        operationKey: operationKey(`save-${probationChoice}`),
      });
      expect(result.kind).toBe('success');
      if (result.kind === 'success') {
        expect(result.model.probationChoice).toBe(probationChoice);
        revision = result.model.revision;
      }
      await expectPersonnelUnchanged(employeeId, before);
    }
    expect(revision).toBe(4);
  });

  it('rejects stale save/save and save/abandon races without partial state', async () => {
    const employeeId = await insertEmployee({ givenNames: 'SaveRace' });
    const draftId = await createDraft(employeeId);
    const [left, right] = await Promise.all([
      saveFormalitesPersonnelDraft(db, context, {
        employeeId,
        draftId,
        expectedDraftRevision: 1,
        probationChoice: 'include',
        operationKey: operationKey('save-race-left'),
      }),
      saveFormalitesPersonnelDraft(db, context, {
        employeeId,
        draftId,
        expectedDraftRevision: 1,
        probationChoice: 'exclude',
        operationKey: operationKey('save-race-right'),
      }),
    ]);
    expect([left.kind, right.kind].sort()).toEqual(['stale_draft', 'success']);

    const current = (await activeDraft(employeeId))[0]!;
    const [save, abandon] = await Promise.all([
      saveFormalitesPersonnelDraft(db, context, {
        employeeId,
        draftId,
        expectedDraftRevision: current.revision,
        probationChoice: 'undecided',
        operationKey: operationKey('save-abandon-save'),
      }),
      abandonFormalitesPersonnelDraft(db, context, {
        employeeId,
        draftId,
        expectedDraftRevision: current.revision,
        abandonmentReason: 'Conflit volontaire.',
        operationKey: operationKey('save-abandon-abandon'),
      }),
    ]);
    expect([save.kind, abandon.kind]).toContain('success');
    expect([save.kind, abandon.kind]).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/stale_draft|draft_abandoned|success/),
      ]),
    );
    expect(
      [save, abandon].filter((result) => result.kind === 'success'),
    ).toHaveLength(1);
  });

  it('fails closed for wrong employee and draft scope on mutation', async () => {
    const employeeId = await insertEmployee({ givenNames: 'ScopedOwner' });
    const otherEmployeeId = await insertEmployee({ givenNames: 'ScopedOther' });
    const draftId = await createDraft(otherEmployeeId);
    const wrongEmployee = await saveFormalitesPersonnelDraft(db, context, {
      employeeId,
      draftId,
      expectedDraftRevision: 1,
      probationChoice: 'include',
      operationKey: operationKey('wrong-draft-employee'),
    });
    expect(wrongEmployee).toEqual({ kind: 'not_found' });

    const wrongEstablishment = await saveFormalitesPersonnelDraft(
      db,
      tenant(organizationId, otherEstablishmentId, actorUserId),
      {
        employeeId: otherEmployeeId,
        draftId,
        expectedDraftRevision: 1,
        probationChoice: 'include',
        operationKey: operationKey('wrong-draft-establishment'),
      },
    );
    expect(wrongEstablishment).toEqual({ kind: 'not_found' });
    expect((await activeDraft(otherEmployeeId))[0]!.revision).toBe(1);
  });

  it('reconciles KEEP/REFRESH per exact divergence and does not reprompt unchanged source', async () => {
    const employeeId = await insertEmployee({ givenNames: 'Reconcile' });
    const draftId = await createDraft(employeeId);
    await db
      .update(personnelEmployeeDossiers)
      .set({
        position: 'Responsable de salle',
        qualification: 'Agent de maîtrise',
        revision: sql`${personnelEmployeeDossiers.revision} + 1`,
      })
      .where(eq(personnelEmployeeDossiers.id, employeeId));
    const presented = await readFormalitesPersonnelDraft(
      db,
      context,
      employeeId,
    );
    expect(presented?.state).toBe('reconciliation_required');
    if (presented?.state !== 'reconciliation_required') return;

    const before = await personnelEvidence(employeeId);
    const result = await reconcileFormalitesPersonnelDraft(db, context, {
      employeeId,
      draftId,
      expectedDraftRevision: presented.revision,
      sourceStateFingerprint: presented.sourceStateFingerprint,
      decisions: [
        { fact: 'position', choice: 'keep' },
        { fact: 'qualification', choice: 'refresh' },
      ],
      operationKey: operationKey('mixed-reconcile'),
    });
    expect(result.kind).toBe('success');
    if (result.kind !== 'success') return;
    expect(result.model.state).toBe('editable');
    expect(result.model.draftValues.position).toBe('Serveuse');
    expect(result.model.currentPersonnelValues.position).toBe(
      'Responsable de salle',
    );
    expect(result.model.draftValues.qualification).toBe('Agent de maîtrise');
    expect(
      (await readFormalitesPersonnelDraft(db, context, employeeId))?.state,
    ).toBe('editable');
    await expectPersonnelUnchanged(employeeId, before);

    await db
      .update(personnelEmployeeDossiers)
      .set({
        position: 'Directrice de salle',
        revision: sql`${personnelEmployeeDossiers.revision} + 1`,
      })
      .where(eq(personnelEmployeeDossiers.id, employeeId));
    const changedAgain = await readFormalitesPersonnelDraft(
      db,
      context,
      employeeId,
    );
    expect(changedAgain).toMatchObject({
      state: 'reconciliation_required',
      divergentFacts: ['position'],
    });
  });

  it('rejects missing, extra, duplicate and stale reconciliation input with no write', async () => {
    const employeeId = await insertEmployee({ givenNames: 'InvalidChoices' });
    const draftId = await createDraft(employeeId);
    await db
      .update(personnelEmployeeDossiers)
      .set({
        position: 'Cheffe de rang',
        revision: sql`${personnelEmployeeDossiers.revision} + 1`,
      })
      .where(eq(personnelEmployeeDossiers.id, employeeId));
    const presented = await readFormalitesPersonnelDraft(
      db,
      context,
      employeeId,
    );
    if (presented?.state !== 'reconciliation_required')
      throw new Error('fixture');
    const beforeDraft = (await activeDraft(employeeId))[0]!;

    const attempts = [
      [],
      [
        { fact: 'position' as const, choice: 'keep' as const },
        { fact: 'familyName' as const, choice: 'refresh' as const },
      ],
      [
        { fact: 'position' as const, choice: 'keep' as const },
        { fact: 'position' as const, choice: 'refresh' as const },
      ],
    ];
    for (const decisions of attempts) {
      const result = await reconcileFormalitesPersonnelDraft(db, context, {
        employeeId,
        draftId,
        expectedDraftRevision: beforeDraft.revision,
        sourceStateFingerprint: presented.sourceStateFingerprint,
        decisions,
        operationKey: operationKey('invalid-decisions'),
      });
      expect(result.kind).toBe('validation_error');
      expect((await activeDraft(employeeId))[0]!.revision).toBe(
        beforeDraft.revision,
      );
    }

    await db
      .update(personnelEmployeeDossiers)
      .set({
        position: 'Maître d’hôtel',
        revision: sql`${personnelEmployeeDossiers.revision} + 1`,
      })
      .where(eq(personnelEmployeeDossiers.id, employeeId));
    const stale = await reconcileFormalitesPersonnelDraft(db, context, {
      employeeId,
      draftId,
      expectedDraftRevision: beforeDraft.revision,
      sourceStateFingerprint: presented.sourceStateFingerprint,
      decisions: [{ fact: 'position', choice: 'keep' }],
      operationKey: operationKey('stale-source'),
    });
    expect(stale.kind).toBe('stale_personnel_source');
    expect((await activeDraft(employeeId))[0]!.revision).toBe(
      beforeDraft.revision,
    );
  });

  it('replays one committed mutation once and rejects key reuse for another mutation', async () => {
    const employeeId = await insertEmployee({ givenNames: 'Replay' });
    const draftId = await createDraft(employeeId);
    const operationKeyValue = operationKey('response-loss');
    const input = {
      employeeId,
      draftId,
      expectedDraftRevision: 1,
      probationChoice: 'include' as const,
      operationKey: operationKeyValue,
    };
    const first = await saveFormalitesPersonnelDraft(db, context, input);
    const replay = await saveFormalitesPersonnelDraft(db, context, input);
    expect(first).toMatchObject({ kind: 'success', replayed: false });
    expect(replay).toMatchObject({ kind: 'success', replayed: true });
    expect((await activeDraft(employeeId))[0]!.revision).toBe(2);
    const [receipt] = await db
      .select()
      .from(formalitesPersonnelDraftCommandReceipts)
      .where(
        and(
          eq(
            formalitesPersonnelDraftCommandReceipts.organizationId,
            organizationId,
          ),
          eq(
            formalitesPersonnelDraftCommandReceipts.establishmentId,
            establishmentId,
          ),
          eq(formalitesPersonnelDraftCommandReceipts.resultingDraftId, draftId),
          eq(formalitesPersonnelDraftCommandReceipts.commandType, 'save'),
        ),
      );
    expect(receipt).toMatchObject({
      operationKeyHash: createHash('sha256')
        .update(operationKeyValue, 'utf8')
        .digest('hex'),
      resultingDraftRevision: 2,
      resultingOutcome: 'saved',
    });
    expect(receipt?.operationKeyHash).not.toBe(operationKeyValue);
    expect(Object.keys(receipt ?? {})).not.toEqual(
      expect.arrayContaining([
        'operationKey',
        'personnelValues',
        'abandonmentReason',
        'requestBody',
      ]),
    );

    const conflict = await saveFormalitesPersonnelDraft(db, context, {
      ...input,
      probationChoice: 'exclude',
    });
    expect(conflict).toEqual({ kind: 'replay_conflict' });
    const newMutation = await saveFormalitesPersonnelDraft(db, context, {
      ...input,
      operationKey: operationKey('new-logical-mutation'),
    });
    expect(newMutation.kind).toBe('stale_draft');
  });

  it('rolls back draft and receipt together for create/save/reconcile/abandon failures', async () => {
    const missingActorContext = tenant(
      organizationId,
      establishmentId,
      uuidv7(),
    );

    const createEmployeeId = await insertEmployee({
      givenNames: 'RollbackCreate',
    });
    await expect(
      createFormalitesPersonnelDraft(db, missingActorContext, {
        employeeId: createEmployeeId,
        probationChoice: 'undecided',
        operationKey: operationKey('rollback-create'),
      }),
    ).rejects.toThrow();
    expect(await activeDraft(createEmployeeId)).toHaveLength(0);

    const saveEmployeeId = await insertEmployee({ givenNames: 'RollbackSave' });
    const saveDraftId = await createDraft(saveEmployeeId);
    await expect(
      saveFormalitesPersonnelDraft(db, missingActorContext, {
        employeeId: saveEmployeeId,
        draftId: saveDraftId,
        expectedDraftRevision: 1,
        probationChoice: 'include',
        operationKey: operationKey('rollback-save'),
      }),
    ).rejects.toThrow();
    expect((await activeDraft(saveEmployeeId))[0]!.revision).toBe(1);

    const reconcileEmployeeId = await insertEmployee({
      givenNames: 'RollbackReconcile',
    });
    const reconcileDraftId = await createDraft(reconcileEmployeeId);
    await db
      .update(personnelEmployeeDossiers)
      .set({
        position: 'Nouvelle fonction',
        revision: sql`${personnelEmployeeDossiers.revision} + 1`,
      })
      .where(eq(personnelEmployeeDossiers.id, reconcileEmployeeId));
    const presented = await readFormalitesPersonnelDraft(
      db,
      context,
      reconcileEmployeeId,
    );
    if (presented?.state !== 'reconciliation_required')
      throw new Error('fixture');
    await expect(
      reconcileFormalitesPersonnelDraft(db, missingActorContext, {
        employeeId: reconcileEmployeeId,
        draftId: reconcileDraftId,
        expectedDraftRevision: 1,
        sourceStateFingerprint: presented.sourceStateFingerprint,
        decisions: [{ fact: 'position', choice: 'refresh' }],
        operationKey: operationKey('rollback-reconcile'),
      }),
    ).rejects.toThrow();
    expect((await activeDraft(reconcileEmployeeId))[0]!.revision).toBe(1);

    const abandonEmployeeId = await insertEmployee({
      givenNames: 'RollbackAbandon',
    });
    const abandonDraftId = await createDraft(abandonEmployeeId);
    await expect(
      abandonFormalitesPersonnelDraft(db, missingActorContext, {
        employeeId: abandonEmployeeId,
        draftId: abandonDraftId,
        expectedDraftRevision: 1,
        abandonmentReason: 'Échec injecté.',
        operationKey: operationKey('rollback-abandon'),
      }),
    ).rejects.toThrow();
    expect((await activeDraft(abandonEmployeeId))[0]!.status).toBe('draft');

    const receipts = await db
      .select()
      .from(formalitesPersonnelDraftCommandReceipts)
      .where(
        eq(
          formalitesPersonnelDraftCommandReceipts.actorUserId,
          missingActorContext.actor.type === 'user'
            ? missingActorContext.actor.userId
            : '',
        ),
      );
    expect(receipts).toEqual([]);
  });

  it('honors current CDI eligibility in both serial orders and allows non-CDI abandon', async () => {
    const cddFirstEmployeeId = await insertEmployee({ givenNames: 'CddFirst' });
    const cddFirstDraftId = await createDraft(cddFirstEmployeeId);
    await setFixedTerm(cddFirstEmployeeId);
    const cddFirstSave = await saveFormalitesPersonnelDraft(db, context, {
      employeeId: cddFirstEmployeeId,
      draftId: cddFirstDraftId,
      expectedDraftRevision: 1,
      probationChoice: 'include',
      operationKey: operationKey('cdd-first-save'),
    });
    expect(cddFirstSave.kind).toBe('ineligible_recovery');
    expect((await activeDraft(cddFirstEmployeeId))[0]!.revision).toBe(1);

    const formalitesFirstEmployeeId = await insertEmployee({
      givenNames: 'FormalitesFirst',
    });
    const formalitesFirstDraftId = await createDraft(formalitesFirstEmployeeId);
    const formalitesFirstSave = await saveFormalitesPersonnelDraft(
      db,
      context,
      {
        employeeId: formalitesFirstEmployeeId,
        draftId: formalitesFirstDraftId,
        expectedDraftRevision: 1,
        probationChoice: 'exclude',
        operationKey: operationKey('formalites-first-save'),
      },
    );
    expect(formalitesFirstSave.kind).toBe('success');
    await setFixedTerm(formalitesFirstEmployeeId);
    expect(
      (
        await readFormalitesPersonnelDraft(
          db,
          context,
          formalitesFirstEmployeeId,
        )
      )?.state,
    ).toBe('ineligible_recovery');

    const before = await personnelEvidence(formalitesFirstEmployeeId);
    const abandoned = await abandonFormalitesPersonnelDraft(db, context, {
      employeeId: formalitesFirstEmployeeId,
      draftId: formalitesFirstDraftId,
      expectedDraftRevision: 2,
      abandonmentReason: 'Le contrat est désormais CDD.',
      operationKey: operationKey('abandon-non-cdi'),
    });
    expect(abandoned.kind).toBe('success');
    await expectPersonnelUnchanged(formalitesFirstEmployeeId, before);

    const rejected = await saveFormalitesPersonnelDraft(db, context, {
      employeeId: formalitesFirstEmployeeId,
      draftId: formalitesFirstDraftId,
      expectedDraftRevision: 3,
      probationChoice: 'include',
      operationKey: operationKey('abandoned-save'),
    });
    expect(rejected.kind).toBe('draft_abandoned');
  });

  it('serializes a real CDI-to-CDD race in both committed orders', async () => {
    const cddFirstEmployeeId = await insertEmployee({
      givenNames: 'RaceCddFirst',
    });
    const cddFirstDraftId = await createDraft(cddFirstEmployeeId);
    const cddUpdated = deferred<void>();
    const releaseCdd = deferred<void>();
    const cddFirstMutation = db.transaction(async (transaction) => {
      await transaction
        .update(personnelEmployeeDossiers)
        .set({
          employmentTermType: 'fixed_term',
          expectedEndDate: '2027-01-31',
          revision: sql`${personnelEmployeeDossiers.revision} + 1`,
        })
        .where(eq(personnelEmployeeDossiers.id, cddFirstEmployeeId));
      cddUpdated.resolve();
      await releaseCdd.promise;
    });
    await cddUpdated.promise;
    const blockedSave = saveFormalitesPersonnelDraft(db, context, {
      employeeId: cddFirstEmployeeId,
      draftId: cddFirstDraftId,
      expectedDraftRevision: 1,
      probationChoice: 'include',
      operationKey: operationKey('race-cdd-first'),
    });
    await expectPending(blockedSave);
    releaseCdd.resolve();
    await cddFirstMutation;
    expect((await blockedSave).kind).toBe('ineligible_recovery');
    expect((await activeDraft(cddFirstEmployeeId))[0]!.revision).toBe(1);

    const formalitesFirstEmployeeId = await insertEmployee({
      givenNames: 'RaceFormalitesFirst',
    });
    const formalitesFirstDraftId = await createDraft(formalitesFirstEmployeeId);
    const draftLocked = deferred<void>();
    const releaseDraft = deferred<void>();
    const draftBlocker = db.transaction(async (transaction) => {
      await transaction
        .select({ id: formalitesPersonnelDrafts.id })
        .from(formalitesPersonnelDrafts)
        .where(eq(formalitesPersonnelDrafts.id, formalitesFirstDraftId))
        .for('update');
      draftLocked.resolve();
      await releaseDraft.promise;
    });
    await draftLocked.promise;

    const formalitesFirstSave = saveFormalitesPersonnelDraft(db, context, {
      employeeId: formalitesFirstEmployeeId,
      draftId: formalitesFirstDraftId,
      expectedDraftRevision: 1,
      probationChoice: 'exclude',
      operationKey: operationKey('race-formalites-first'),
    });
    await new Promise((resolve) => setTimeout(resolve, 75));
    const cddAfterSave = setFixedTerm(formalitesFirstEmployeeId);
    await expectPending(cddAfterSave);
    releaseDraft.resolve();
    await draftBlocker;
    expect((await formalitesFirstSave).kind).toBe('success');
    await cddAfterSave;
    expect((await activeDraft(formalitesFirstEmployeeId))[0]!.revision).toBe(2);
    expect(
      (
        await readFormalitesPersonnelDraft(
          db,
          context,
          formalitesFirstEmployeeId,
        )
      )?.state,
    ).toBe('ineligible_recovery');
  });

  async function insertEmployee(
    overrides: Partial<typeof personnelEmployeeDossiers.$inferInsert> = {},
    scopedContext = context,
  ): Promise<string> {
    const employeeId = uuidv7();
    await db.insert(personnelEmployeeDossiers).values({
      id: employeeId,
      organizationId: scopedContext.organizationId,
      establishmentId: scopedContext.establishmentId!,
      givenNames: 'Camille',
      familyName: 'Durand',
      position: 'Serveuse',
      qualification: 'Employée',
      employmentTermType: 'indefinite',
      expectedEndDate: null,
      fixedTermReasonCode: null,
      workTimeCategory: 'full_time',
      contractWeeklyMinutes: 1_800,
      entryDate: '2026-09-01',
      departureDate: null,
      revision: 1,
      ...overrides,
    });
    return employeeId;
  }

  async function createDraft(employeeId: string): Promise<string> {
    const result = await createFormalitesPersonnelDraft(db, context, {
      employeeId,
      probationChoice: 'undecided',
      operationKey: operationKey('fixture-create'),
    });
    if (result.kind !== 'success') {
      throw new Error(`Expected draft creation, received ${result.kind}.`);
    }
    return result.model.draftId;
  }

  async function activeDraft(employeeId: string) {
    return db
      .select()
      .from(formalitesPersonnelDrafts)
      .where(
        and(
          eq(formalitesPersonnelDrafts.organizationId, organizationId),
          eq(formalitesPersonnelDrafts.establishmentId, establishmentId),
          eq(formalitesPersonnelDrafts.employeeId, employeeId),
          eq(formalitesPersonnelDrafts.status, 'draft'),
        ),
      );
  }

  async function setFixedTerm(employeeId: string): Promise<void> {
    await db
      .update(personnelEmployeeDossiers)
      .set({
        employmentTermType: 'fixed_term',
        expectedEndDate: '2027-01-31',
        revision: sql`${personnelEmployeeDossiers.revision} + 1`,
      })
      .where(
        and(
          eq(personnelEmployeeDossiers.organizationId, organizationId),
          eq(personnelEmployeeDossiers.establishmentId, establishmentId),
          eq(personnelEmployeeDossiers.id, employeeId),
        ),
      );
  }

  async function personnelEvidence(employeeId: string) {
    const [employee] = await db
      .select()
      .from(personnelEmployeeDossiers)
      .where(eq(personnelEmployeeDossiers.id, employeeId));
    const count = async (
      table:
        | typeof personnelEmployeeAuditEvents
        | typeof personnelCommandReceipts
        | typeof personnelEmployeeHistoryEvents
        | typeof personnelRegisterEntries,
      employeeColumn:
        | typeof personnelEmployeeAuditEvents.employeeId
        | typeof personnelCommandReceipts.employeeId
        | typeof personnelEmployeeHistoryEvents.employeeId
        | typeof personnelRegisterEntries.employeeId,
    ) => {
      const [row] = await db
        .select({ value: sql<number>`count(*)`.mapWith(Number) })
        .from(table)
        .where(eq(employeeColumn, employeeId));
      return row?.value ?? 0;
    };
    const scopedCount = async (
      table:
        | typeof personnelRegisterCorrections
        | typeof personnelRegisterCommandReceipts
        | typeof personnelRegisterAuditEvents,
      organizationColumn:
        | typeof personnelRegisterCorrections.organizationId
        | typeof personnelRegisterCommandReceipts.organizationId
        | typeof personnelRegisterAuditEvents.organizationId,
    ) => {
      const [row] = await db
        .select({ value: sql<number>`count(*)`.mapWith(Number) })
        .from(table)
        .where(eq(organizationColumn, organizationId));
      return row?.value ?? 0;
    };
    return {
      rowHash: createHash('sha256')
        .update(JSON.stringify(employee), 'utf8')
        .digest('hex'),
      revision: employee?.revision,
      audit: await count(
        personnelEmployeeAuditEvents,
        personnelEmployeeAuditEvents.employeeId,
      ),
      receipts: await count(
        personnelCommandReceipts,
        personnelCommandReceipts.employeeId,
      ),
      history: await count(
        personnelEmployeeHistoryEvents,
        personnelEmployeeHistoryEvents.employeeId,
      ),
      registerEntries: await count(
        personnelRegisterEntries,
        personnelRegisterEntries.employeeId,
      ),
      registerCorrections: await scopedCount(
        personnelRegisterCorrections,
        personnelRegisterCorrections.organizationId,
      ),
      registerReceipts: await scopedCount(
        personnelRegisterCommandReceipts,
        personnelRegisterCommandReceipts.organizationId,
      ),
      registerAudit: await scopedCount(
        personnelRegisterAuditEvents,
        personnelRegisterAuditEvents.organizationId,
      ),
    };
  }

  async function expectPersonnelUnchanged(
    employeeId: string,
    before: Awaited<ReturnType<typeof personnelEvidence>>,
  ) {
    expect(await personnelEvidence(employeeId)).toEqual(before);
  }
});

function tenant(
  organizationId: string,
  establishmentId: string,
  actorUserId: string,
): TenantContext {
  return {
    organizationId,
    establishmentId,
    actor: {
      type: 'user',
      userId: actorUserId,
      membershipId: uuidv7(),
      role: 'OWNER',
    },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set(),
  };
}

function operationKey(label: string): string {
  return `${label}-${uuidv7().replaceAll('-', '')}`;
}

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

async function expectPending(promise: Promise<unknown>): Promise<void> {
  const state = await Promise.race([
    promise.then(
      () => 'settled',
      () => 'settled',
    ),
    new Promise<'pending'>((resolve) =>
      setTimeout(() => resolve('pending'), 75),
    ),
  ]);
  expect(state).toBe('pending');
}
