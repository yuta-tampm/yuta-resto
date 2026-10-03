'use client';

import type {
  FormalitesPersonnelDraftMutationOutcome,
  FormalitesPersonnelDraftReadModel,
  FormalitesPersonnelProbationChoice,
} from '@yuta/contracts';
import { Badge, Button } from '@yuta/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import type { LoadFormalitesPersonnelDraftActionResult } from '../[employeeId]/actions';
import {
  abandonmentReasonRequiredFeedback,
  incompleteReconciliationFeedback,
  workspaceFeedbackForOutcome,
  workspaceReloadedFeedback,
  workspaceSavedFeedback,
  type WorkspaceFeedback,
} from '../_lib/cdi-draft-workspace-feedback';
import {
  reloadWorkspaceModel,
  runWorkspaceMutation,
  workspaceReloadFailureFeedback,
} from '../_lib/cdi-draft-workspace-operations';
import {
  createOpaqueOperationKey,
  hasWorkspaceUnsavedChanges,
  probationChoiceFromModel,
  retainRelevantReconciliationChoices,
  type WorkspaceMutationKind,
  type WorkspaceOperation,
} from '../_lib/cdi-draft-workspace-state';
import {
  AbandonDraftDialog,
  AbandonedDraft,
  EditableDraft,
  EligibleNoDraft,
  IneligibleRecovery,
  ReconciliationRequired,
  WorkspaceFeedbackAlert,
  type ReconciliationChoices,
} from './cdi-draft-workspace-panels';

export type LoadCdiDraftWorkspaceAction = (
  employeeId: unknown,
) => Promise<LoadFormalitesPersonnelDraftActionResult>;
export type MutateCdiDraftWorkspaceAction = (
  input: unknown,
) => Promise<FormalitesPersonnelDraftMutationOutcome>;

export function CdiDraftWorkspace({
  employeeId,
  employeeName,
  initialModel,
  employeeDossierHref,
  locale,
  loadAction,
  createAction,
  saveAction,
  reconcileAction,
  abandonAction,
}: {
  employeeId: string;
  employeeName: string;
  initialModel: FormalitesPersonnelDraftReadModel;
  employeeDossierHref: string;
  locale: string;
  loadAction: LoadCdiDraftWorkspaceAction;
  createAction: MutateCdiDraftWorkspaceAction;
  saveAction: MutateCdiDraftWorkspaceAction;
  reconcileAction: MutateCdiDraftWorkspaceAction;
  abandonAction: MutateCdiDraftWorkspaceAction;
}) {
  const router = useRouter();
  const [model, setModel] = useState(initialModel);
  const [probationChoice, setProbationChoice] =
    useState<FormalitesPersonnelProbationChoice>(() =>
      probationChoiceFromModel(initialModel),
    );
  const [reconciliationChoices, setReconciliationChoices] =
    useState<ReconciliationChoices>({});
  const [abandonmentReason, setAbandonmentReason] = useState('');
  const [abandonOpen, setAbandonOpen] = useState(false);
  const [feedback, setFeedback] = useState<WorkspaceFeedback | null>(null);
  const [isReloading, setIsReloading] = useState(false);
  const [operation, setOperation] = useState<WorkspaceOperation | null>(null);
  const operationRef = useRef<WorkspaceOperation | null>(null);
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const abandonmentReasonRef = useRef<HTMLTextAreaElement | null>(null);

  const dirty = useMemo(
    () =>
      hasWorkspaceUnsavedChanges({
        model,
        probationChoice,
        reconciliationChoices,
        abandonmentReason,
      }),
    [abandonmentReason, model, probationChoice, reconciliationChoices],
  );

  useEffect(() => {
    setModel(initialModel);
    setProbationChoice(probationChoiceFromModel(initialModel));
    setReconciliationChoices({});
    setAbandonmentReason('');
    operationRef.current = null;
    setOperation(null);
  }, [initialModel]);

  useEffect(() => {
    if (!dirty) return;
    const protectUnsavedChanges = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', protectUnsavedChanges);
    return () =>
      window.removeEventListener('beforeunload', protectUnsavedChanges);
  }, [dirty]);

  const pending = operation?.status === 'pending' || isReloading;

  function confirmNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (
      dirty &&
      !window.confirm(
        'Des modifications ne sont pas enregistrées. Voulez-vous vraiment quitter cette page ?',
      )
    ) {
      event.preventDefault();
    }
  }

  async function executeMutation(
    kind: WorkspaceMutationKind,
    intentPayload: Readonly<Record<string, unknown>>,
    run: (
      operationKey: string,
    ) => Promise<FormalitesPersonnelDraftMutationOutcome>,
  ) {
    const result = await runWorkspaceMutation({
      current: operationRef.current,
      kind,
      intentPayload,
      createKey: createOpaqueOperationKey,
      onPending: (pendingOperation) => {
        operationRef.current = pendingOperation;
        setOperation(pendingOperation);
        setFeedback(null);
      },
      run,
    });
    if (!result) return;

    operationRef.current = result.operation;
    setOperation(result.operation);
    handleMutationOutcome(result.outcome);
  }

  function acceptAuthoritativeModel(
    nextModel: FormalitesPersonnelDraftReadModel,
    preserveLocalInput: boolean,
  ) {
    setModel(nextModel);
    if (!preserveLocalInput) {
      setProbationChoice(probationChoiceFromModel(nextModel));
      setReconciliationChoices({});
      setAbandonmentReason('');
      setAbandonOpen(false);
      return;
    }
    setReconciliationChoices((choices) =>
      retainRelevantReconciliationChoices(choices, nextModel),
    );
  }

  function handleMutationOutcome(
    outcome: FormalitesPersonnelDraftMutationOutcome,
  ) {
    if (outcome.kind === 'success') {
      acceptAuthoritativeModel(outcome.model, false);
      setFeedback(workspaceSavedFeedback());
      router.refresh();
      return;
    }

    if (
      outcome.kind === 'stale_draft' ||
      outcome.kind === 'stale_personnel_source'
    ) {
      acceptAuthoritativeModel(outcome.model, true);
    } else if (
      outcome.kind === 'active_draft_exists' ||
      outcome.kind === 'ineligible_recovery' ||
      outcome.kind === 'draft_abandoned'
    ) {
      acceptAuthoritativeModel(outcome.model, false);
    }

    setFeedback(workspaceFeedbackForOutcome(outcome));
    focusSoon(feedbackRef);
  }

  async function reloadAuthoritativeModel() {
    setIsReloading(true);
    setFeedback(null);
    try {
      const result = await reloadWorkspaceModel(() => loadAction(employeeId));
      if (result.kind === 'success') {
        acceptAuthoritativeModel(result.model, false);
        operationRef.current = null;
        setOperation(null);
        setFeedback(workspaceReloadedFeedback());
      } else {
        setFeedback(workspaceReloadFailureFeedback(result));
        focusSoon(feedbackRef);
      }
    } finally {
      setIsReloading(false);
    }
  }

  async function createDraft() {
    await executeMutation(
      'create',
      { employeeId, probationChoice: 'undecided' },
      (operationKey) =>
        createAction({
          employeeId,
          operationKey,
          probationChoice: 'undecided',
        }),
    );
  }

  async function saveDraft() {
    if (model.state !== 'editable') return;
    await executeMutation(
      'save',
      {
        employeeId,
        draftId: model.draftId,
        expectedDraftRevision: model.revision,
        probationChoice,
      },
      (operationKey) =>
        saveAction({
          employeeId,
          draftId: model.draftId,
          expectedDraftRevision: model.revision,
          operationKey,
          probationChoice,
        }),
    );
  }

  async function reconcileDraft() {
    if (model.state !== 'reconciliation_required') return;
    const missingFact = model.divergentFacts.find(
      (fact) => !reconciliationChoices[fact],
    );
    if (missingFact) {
      setFeedback(incompleteReconciliationFeedback());
      focusElementSoon(`reconcile-${missingFact}-keep`);
      return;
    }
    const decisions = model.divergentFacts.map((fact) => ({
      fact,
      choice: reconciliationChoices[fact]!,
    }));
    await executeMutation(
      'reconcile',
      {
        employeeId,
        draftId: model.draftId,
        expectedDraftRevision: model.revision,
        sourceStateFingerprint: model.sourceStateFingerprint,
        decisions,
      },
      (operationKey) =>
        reconcileAction({
          employeeId,
          draftId: model.draftId,
          expectedDraftRevision: model.revision,
          operationKey,
          sourceStateFingerprint: model.sourceStateFingerprint,
          decisions,
        }),
    );
  }

  async function abandonDraft() {
    if (model.state === 'eligible_no_draft' || model.state === 'abandoned') {
      return;
    }
    const reason = abandonmentReason.trim();
    if (reason.length < 1 || reason.length > 250) {
      setFeedback(abandonmentReasonRequiredFeedback());
      focusSoon(abandonmentReasonRef);
      return;
    }
    await executeMutation(
      'abandon',
      {
        employeeId,
        draftId: model.draftId,
        expectedDraftRevision: model.revision,
        abandonmentReason: reason,
      },
      (operationKey) =>
        abandonAction({
          employeeId,
          draftId: model.draftId,
          expectedDraftRevision: model.revision,
          operationKey,
          abandonmentReason: reason,
        }),
    );
  }

  function changeAbandonDialog(open: boolean) {
    if (
      !open &&
      abandonmentReason.length > 0 &&
      !window.confirm('Abandonner le motif saisi sans enregistrer ?')
    ) {
      return;
    }
    setAbandonOpen(open);
    if (!open) setAbandonmentReason('');
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge tone="brand">Dossier salarié connecté</Badge>
          <h2 className="mt-2 text-xl font-black text-primary">
            {employeeName}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            Projet de contrat CDI conservé dans les Formalités de cet
            établissement.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href={employeeDossierHref} onClick={confirmNavigation}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Revenir au dossier salarié
          </Link>
        </Button>
      </div>

      {feedback && (
        <WorkspaceFeedbackAlert
          feedback={feedback}
          feedbackRef={feedbackRef}
          pending={pending}
          onReload={reloadAuthoritativeModel}
        />
      )}

      {model.state === 'eligible_no_draft' && (
        <EligibleNoDraft
          model={model}
          locale={locale}
          pending={pending}
          onCreate={createDraft}
        />
      )}
      {model.state === 'editable' && (
        <EditableDraft
          model={model}
          locale={locale}
          probationChoice={probationChoice}
          pending={pending}
          onProbationChoice={setProbationChoice}
          onSave={saveDraft}
          onAbandon={() => setAbandonOpen(true)}
        />
      )}
      {model.state === 'reconciliation_required' && (
        <ReconciliationRequired
          model={model}
          locale={locale}
          choices={reconciliationChoices}
          pending={pending}
          onChoice={(fact, choice) =>
            setReconciliationChoices((current) => ({
              ...current,
              [fact]: choice,
            }))
          }
          onReconcile={reconcileDraft}
          onAbandon={() => setAbandonOpen(true)}
        />
      )}
      {model.state === 'ineligible_recovery' && (
        <IneligibleRecovery
          model={model}
          locale={locale}
          pending={pending}
          onAbandon={() => setAbandonOpen(true)}
        />
      )}
      {model.state === 'abandoned' && (
        <AbandonedDraft
          model={model}
          locale={locale}
          pending={pending}
          onCreate={createDraft}
        />
      )}

      {model.state !== 'eligible_no_draft' && model.state !== 'abandoned' && (
        <AbandonDraftDialog
          open={abandonOpen}
          reason={abandonmentReason}
          reasonRef={abandonmentReasonRef}
          pending={pending}
          abandoning={operation?.kind === 'abandon' && pending}
          onOpenChange={changeAbandonDialog}
          onReasonChange={setAbandonmentReason}
          onConfirm={abandonDraft}
        />
      )}
    </div>
  );
}

function focusSoon(ref: { current: HTMLElement | null }) {
  window.requestAnimationFrame(() => ref.current?.focus());
}

function focusElementSoon(id: string) {
  window.requestAnimationFrame(() => document.getElementById(id)?.focus());
}
