import type {
  FormalitesPersonnelDraftReadModel,
  FormalitesPersonnelFact,
} from '@yuta/contracts';
import { describe, expect, it, vi } from 'vitest';
import {
  createWorkspaceIntent,
  hasWorkspaceUnsavedChanges,
  prepareWorkspaceOperation,
  probationChoiceFromModel,
  probationChoiceLabels,
  reconciliationChoiceLabels,
  retainRelevantReconciliationChoices,
  settleWorkspaceOperation,
} from '../src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-workspace-state';

describe('Formalités persistent draft client state', () => {
  it('uses the three approved probation choices and keeps UNDECIDED saveable', () => {
    expect(probationChoiceLabels).toEqual({
      undecided: 'À décider',
      include: 'Prévoir une période d’essai',
      exclude: 'Ne pas prévoir de période d’essai',
    });
    expect(probationChoiceFromModel(editableModel())).toBe('undecided');
    expect(
      hasWorkspaceUnsavedChanges({
        model: editableModel(),
        probationChoice: 'undecided',
        reconciliationChoices: {},
        abandonmentReason: '',
      }),
    ).toBe(false);
  });

  it('creates one key before submit and blocks an accidental double submit', () => {
    const createKey = vi.fn(() => 'operation-key-0001');
    const intent = createWorkspaceIntent('save', {
      revision: 1,
      probationChoice: 'include',
    });
    const first = prepareWorkspaceOperation(null, 'save', intent, createKey);
    expect(first).toEqual({
      kind: 'submit',
      operation: {
        kind: 'save',
        key: 'operation-key-0001',
        intent,
        status: 'pending',
      },
    });
    if (first.kind !== 'submit') throw new Error('Expected submit.');
    const duplicate = prepareWorkspaceOperation(
      first.operation,
      'save',
      intent,
      createKey,
    );
    expect(duplicate.kind).toBe('blocked');
    expect(createKey).toHaveBeenCalledTimes(1);
  });

  it('reuses a key only for the same uncertain logical mutation', () => {
    const createKey = vi
      .fn<() => string>()
      .mockReturnValueOnce('operation-key-0001')
      .mockReturnValueOnce('operation-key-0002');
    const firstIntent = createWorkspaceIntent('save', {
      revision: 1,
      probationChoice: 'include',
    });
    const first = prepareWorkspaceOperation(
      null,
      'save',
      firstIntent,
      createKey,
    );
    if (first.kind !== 'submit') throw new Error('Expected submit.');
    const uncertain = settleWorkspaceOperation(first.operation, {
      kind: 'server_error',
    });
    expect(uncertain).toMatchObject({
      key: 'operation-key-0001',
      status: 'uncertain',
    });

    const retry = prepareWorkspaceOperation(
      uncertain,
      'save',
      firstIntent,
      createKey,
    );
    expect(retry).toMatchObject({
      kind: 'submit',
      operation: { key: 'operation-key-0001', status: 'pending' },
    });
    expect(createKey).toHaveBeenCalledTimes(1);

    const changedIntent = createWorkspaceIntent('save', {
      revision: 1,
      probationChoice: 'exclude',
    });
    const deliberateMutation = prepareWorkspaceOperation(
      uncertain,
      'save',
      changedIntent,
      createKey,
    );
    expect(deliberateMutation).toMatchObject({
      kind: 'submit',
      operation: { key: 'operation-key-0002', status: 'pending' },
    });
  });

  it('closes the logical operation after a conclusive outcome', () => {
    const preparation = prepareWorkspaceOperation(
      null,
      'create',
      createWorkspaceIntent('create', { probationChoice: 'undecided' }),
      () => 'operation-key-0001',
    );
    if (preparation.kind !== 'submit') throw new Error('Expected submit.');
    expect(
      settleWorkspaceOperation(preparation.operation, {
        kind: 'success',
        replayed: false,
        model: editableModel(),
      }),
    ).toBeNull();
    expect(
      settleWorkspaceOperation(preparation.operation, {
        kind: 'validation_error',
        fieldErrors: {},
      }),
    ).toBeNull();
    expect(
      settleWorkspaceOperation(preparation.operation, {
        kind: 'replay_conflict',
      }),
    ).toBeNull();
  });

  it('tracks dirty probation, reconciliation and abandon inputs without autosave', () => {
    const model = editableModel();
    expect(
      hasWorkspaceUnsavedChanges({
        model,
        probationChoice: 'include',
        reconciliationChoices: {},
        abandonmentReason: '',
      }),
    ).toBe(true);
    expect(
      hasWorkspaceUnsavedChanges({
        model: reconciliationModel(['position']),
        probationChoice: 'undecided',
        reconciliationChoices: { position: 'keep' },
        abandonmentReason: '',
      }),
    ).toBe(true);
    expect(
      hasWorkspaceUnsavedChanges({
        model,
        probationChoice: 'undecided',
        reconciliationChoices: {},
        abandonmentReason: 'À conserver',
      }),
    ).toBe(true);
  });

  it('keeps only still-relevant reconciliation choices after a stale source reload', () => {
    expect(reconciliationChoiceLabels).toEqual({
      keep: 'Conserver la valeur du brouillon',
      refresh: 'Reprendre la valeur actuelle du dossier salarié',
    });
    expect(
      retainRelevantReconciliationChoices(
        { position: 'keep', qualification: 'refresh' },
        reconciliationModel(['qualification', 'givenNames']),
      ),
    ).toEqual({ qualification: 'refresh' });
    expect(
      retainRelevantReconciliationChoices(
        { position: 'keep' },
        editableModel(),
      ),
    ).toEqual({});
  });

  it('normalizes intent field order without exposing the operation key', () => {
    expect(createWorkspaceIntent('save', { b: 2, a: 1 })).toBe(
      createWorkspaceIntent('save', { a: 1, b: 2 }),
    );
    expect(createWorkspaceIntent('save', { a: 1, b: 2 })).not.toContain(
      'operation-key',
    );
  });
});

const currentValues = {
  givenNames: 'Camille',
  familyName: 'Durand',
  position: 'Serveuse',
  qualification: 'Employée',
  employmentTermType: 'indefinite' as const,
  entryDate: '2026-09-01',
  contractWeeklyMinutes: 2_100,
};

function editableModel(): Extract<
  FormalitesPersonnelDraftReadModel,
  { state: 'editable' }
> {
  return {
    state: 'editable',
    draftId: '019930d3-41ea-7282-81e4-2bddc527035d',
    formalityType: 'cdi_preparation',
    status: 'draft',
    probationChoice: 'undecided',
    revision: 1,
    draftValues: currentValues,
    currentPersonnelValues: currentValues,
    createdAt: '2026-09-05T00:00:00.000Z',
    updatedAt: '2026-09-05T00:00:00.000Z',
  };
}

function reconciliationModel(
  divergentFacts: FormalitesPersonnelFact[],
): Extract<
  FormalitesPersonnelDraftReadModel,
  { state: 'reconciliation_required' }
> {
  return {
    ...editableModel(),
    state: 'reconciliation_required',
    divergentFacts,
    sourceStateFingerprint: 'a'.repeat(64),
  };
}
