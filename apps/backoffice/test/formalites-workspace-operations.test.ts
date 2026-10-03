import type {
  FormalitesPersonnelDraftMutationOutcome,
  FormalitesPersonnelDraftReadModel,
} from '@yuta/contracts';
import { describe, expect, it, vi } from 'vitest';
import type { FormalitesPersonnelDraftMutationActionResult } from '../src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-workspace-action-result';
import {
  reloadWorkspaceModel,
  runWorkspaceMutation,
  workspaceReloadFailureFeedback,
} from '../src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-workspace-operations';
import {
  canAbandonDraft,
  decideInitialModelUpdate,
  settleWorkspaceOperation,
  type WorkspaceOperation,
} from '../src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-workspace-state';

const intentPayload = {
  employeeId: '019930d3-2f5d-7d5a-9f96-8f2e25e7c40a',
  draftId: '019930d3-41ea-7282-81e4-2bddc527035d',
  expectedDraftRevision: 2,
  probationChoice: 'include',
};

const model: FormalitesPersonnelDraftReadModel = {
  state: 'eligible_no_draft',
  formalityType: 'cdi_preparation',
  currentPersonnelValues: {
    givenNames: 'Camille',
    familyName: 'Durand',
    position: 'Serveuse',
    qualification: 'Employée',
    employmentTermType: 'indefinite',
    entryDate: '2026-09-01',
    contractWeeklyMinutes: 2_100,
  },
};

function keySequence() {
  let next = 0;
  return vi.fn(() => `key-${++next}`);
}

describe('CDI draft workspace mutation orchestration', () => {
  it('maps a rejected mutation to an uncertain server_error and retries with the same key', async () => {
    const createKey = keySequence();
    const onPending = vi.fn();
    const run = vi
      .fn<(key: string) => Promise<FormalitesPersonnelDraftMutationOutcome>>()
      .mockRejectedValueOnce(new Error('Network dropped.'))
      .mockResolvedValueOnce({ kind: 'success', model });

    const first = await runWorkspaceMutation({
      current: null,
      kind: 'save',
      intentPayload,
      createKey,
      onPending,
      run,
    });

    expect(first?.outcome).toEqual({ kind: 'server_error' });
    expect(first?.operation).toMatchObject({
      kind: 'save',
      key: 'key-1',
      status: 'uncertain',
    });
    expect(onPending).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'key-1', status: 'pending' }),
    );

    const retry = await runWorkspaceMutation({
      current: first!.operation,
      kind: 'save',
      intentPayload: { ...intentPayload },
      createKey,
      onPending,
      run,
    });

    expect(run.mock.calls.map(([key]) => key)).toEqual(['key-1', 'key-1']);
    expect(createKey).toHaveBeenCalledOnce();
    expect(retry).toEqual({
      operation: null,
      outcome: { kind: 'success', model },
    });
  });

  it('uses a new key when the intent changes after an uncertain rejection', async () => {
    const createKey = keySequence();
    const run = vi
      .fn<(key: string) => Promise<FormalitesPersonnelDraftMutationOutcome>>()
      .mockRejectedValueOnce(new Error('Server action failed.'))
      .mockResolvedValueOnce({ kind: 'success', model });

    const first = await runWorkspaceMutation({
      current: null,
      kind: 'save',
      intentPayload,
      createKey,
      onPending: vi.fn(),
      run,
    });
    await runWorkspaceMutation({
      current: first!.operation,
      kind: 'save',
      intentPayload: { ...intentPayload, probationChoice: 'exclude' },
      createKey,
      onPending: vi.fn(),
      run,
    });

    expect(run.mock.calls.map(([key]) => key)).toEqual(['key-1', 'key-2']);
  });

  it('blocks a duplicate submit while the operation is pending', async () => {
    const pending: WorkspaceOperation = {
      kind: 'save',
      key: 'key-1',
      intent: 'save:{}',
      status: 'pending',
    };
    const run = vi.fn();
    const onPending = vi.fn();

    await expect(
      runWorkspaceMutation({
        current: pending,
        kind: 'save',
        intentPayload,
        createKey: keySequence(),
        onPending,
        run,
      }),
    ).resolves.toBeNull();
    expect(run).not.toHaveBeenCalled();
    expect(onPending).not.toHaveBeenCalled();
  });
});

describe('CDI draft workspace forbidden outcome', () => {
  it('clears an uncertain operation on a forbidden retry', async () => {
    const createKey = keySequence();
    const run = vi
      .fn<
        (key: string) => Promise<FormalitesPersonnelDraftMutationActionResult>
      >()
      .mockRejectedValueOnce(new Error('Network dropped.'))
      .mockResolvedValueOnce({ kind: 'forbidden' });

    const first = await runWorkspaceMutation({
      current: null,
      kind: 'abandon',
      intentPayload,
      createKey,
      onPending: vi.fn(),
      run,
    });
    expect(first?.operation?.status).toBe('uncertain');

    const denied = await runWorkspaceMutation({
      current: first!.operation,
      kind: 'abandon',
      intentPayload,
      createKey,
      onPending: vi.fn(),
      run,
    });
    expect(run.mock.calls.map(([key]) => key)).toEqual(['key-1', 'key-1']);
    expect(denied).toEqual({ operation: null, outcome: { kind: 'forbidden' } });
  });

  it('settles forbidden as confirmed and only server_error as uncertain', () => {
    const operation: WorkspaceOperation = {
      kind: 'save',
      key: 'key-1',
      intent: 'save:{}',
      status: 'pending',
    };
    expect(settleWorkspaceOperation(operation, { kind: 'forbidden' })).toBe(
      null,
    );
    expect(
      settleWorkspaceOperation(operation, { kind: 'server_error' }),
    ).toEqual({ ...operation, status: 'uncertain' });
  });

  it('gives a forbidden reload non-recoverable copy that does not invite a retry', () => {
    const feedback = workspaceReloadFailureFeedback({ kind: 'forbidden' });
    expect(feedback).toEqual({
      tone: 'danger',
      title: 'Accès refusé',
      description:
        'Votre accès actuel ne permet plus de consulter ou de modifier ce brouillon.',
      recoverable: false,
    });
    expect(feedback.description).not.toMatch(/Réessayez|Rechargez/);
  });
});

describe('CDI draft workspace initialModel updates', () => {
  const employeeId = intentPayload.employeeId;
  const otherEmployeeId = '019930d3-2f5d-7d5a-9f96-8f2e25e7c40b';

  it('resets for a changed employee identity even while busy', () => {
    expect(
      decideInitialModelUpdate({
        previousEmployeeId: employeeId,
        employeeId: otherEmployeeId,
        busy: true,
        current: draftModel(3),
        next: model,
      }),
    ).toBe('reset_identity');
  });

  it('keeps the local model, inputs and operation while a request is pending or uncertain', () => {
    expect(
      decideInitialModelUpdate({
        previousEmployeeId: employeeId,
        employeeId,
        busy: true,
        current: draftModel(2),
        next: draftModel(3),
      }),
    ).toBe('ignore');
  });

  it('ignores an older revision of the displayed draft', () => {
    expect(
      decideInitialModelUpdate({
        previousEmployeeId: employeeId,
        employeeId,
        busy: false,
        current: draftModel(3),
        next: draftModel(2),
      }),
    ).toBe('ignore');
  });

  it('replaces the model when idle with a same or newer server model', () => {
    for (const next of [draftModel(3), draftModel(4), model]) {
      expect(
        decideInitialModelUpdate({
          previousEmployeeId: employeeId,
          employeeId,
          busy: false,
          current: draftModel(3),
          next,
        }),
      ).toBe('replace');
    }
    expect(
      decideInitialModelUpdate({
        previousEmployeeId: employeeId,
        employeeId,
        busy: false,
        current: draftModel(3),
        next: {
          ...draftModel(1),
          draftId: '019930d3-41ea-7282-81e4-2bddc527035e',
        },
      }),
    ).toBe('replace');
  });

  it('only offers abandonment for an active draft', () => {
    expect(canAbandonDraft(model)).toBe(false);
    expect(canAbandonDraft(draftModel(1))).toBe(true);
    expect(
      canAbandonDraft({
        ...draftModel(1),
        state: 'abandoned',
        status: 'abandoned',
        abandonmentReason: 'Annulé',
        abandonedAt: '2026-09-05T02:00:00.000Z',
      }),
    ).toBe(false);
  });
});

function draftModel(
  revision: number,
): Extract<FormalitesPersonnelDraftReadModel, { state: 'editable' }> {
  if (model.state !== 'eligible_no_draft') throw new Error('Unexpected model.');
  return {
    state: 'editable',
    draftId: intentPayload.draftId,
    formalityType: 'cdi_preparation',
    status: 'draft',
    probationChoice: 'undecided',
    revision,
    draftValues: model.currentPersonnelValues,
    currentPersonnelValues: model.currentPersonnelValues,
    createdAt: '2026-09-05T00:00:00.000Z',
    updatedAt: '2026-09-05T01:00:00.000Z',
  };
}

describe('CDI draft workspace reload orchestration', () => {
  it('maps a rejected reload to safe, recoverable French feedback', async () => {
    const result = await reloadWorkspaceModel(() =>
      Promise.reject(new Error('Offline: internal detail stack')),
    );

    expect(result).toEqual({ kind: 'server_error' });
    if (result.kind === 'success') throw new Error('Expected a failure.');
    const feedback = workspaceReloadFailureFeedback(result);
    expect(feedback).toEqual({
      tone: 'danger',
      title: 'Actualisation impossible',
      description: 'Réessayez dans quelques instants.',
      recoverable: true,
    });
    expect(JSON.stringify(feedback)).not.toMatch(/Offline|internal|stack/i);
  });

  it('keeps the unavailable dossier reload feedback non-recoverable', () => {
    expect(workspaceReloadFailureFeedback({ kind: 'not_found' })).toEqual({
      tone: 'danger',
      title: 'Actualisation impossible',
      description: 'Ce dossier n’est plus disponible dans cet établissement.',
      recoverable: false,
    });
  });

  it('returns the authoritative load result unchanged', async () => {
    await expect(
      reloadWorkspaceModel(async () => ({ kind: 'success', model })),
    ).resolves.toEqual({ kind: 'success', model });
    await expect(
      reloadWorkspaceModel(async () => ({ kind: 'not_found' })),
    ).resolves.toEqual({ kind: 'not_found' });
  });
});
