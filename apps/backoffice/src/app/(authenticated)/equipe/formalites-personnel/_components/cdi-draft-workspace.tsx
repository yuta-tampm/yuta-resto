'use client';

import type {
  FormalitesPersonnelDraftReadModel,
  FormalitesPersonnelProbationChoice,
} from '@yuta/contracts';
import { Badge, Button } from '@yuta/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import type {
  FormalitesPersonnelDraftMutationActionResult,
  LoadFormalitesPersonnelDraftActionResult,
} from '../_lib/cdi-draft-workspace-action-result';
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
  canAbandonDraft,
  createOpaqueOperationKey,
  decideInitialModelUpdate,
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
) => Promise<FormalitesPersonnelDraftMutationActionResult>;

type FeedbackPlacement = 'page' | 'dialog';

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
  const [feedbackPlacement, setFeedbackPlacement] =
    useState<FeedbackPlacement>('page');
  const [focusRequest, setFocusRequest] = useState<{
    placement: FeedbackPlacement;
    sequence: number;
  } | null>(null);
  const [isReloading, setIsReloading] = useState(false);
  const [operation, setOperation] = useState<WorkspaceOperation | null>(null);
  const [forbidden, setForbidden] = useState(false);
  // Refs mirror state read by async completions and the initialModel effect.
  const modelRef = useRef(initialModel);
  const operationRef = useRef<WorkspaceOperation | null>(null);
  const reloadingRef = useRef(false);
  const abandonOpenRef = useRef(false);
  const employeeIdRef = useRef(employeeId);
  // Incremented when the employee changes so older completions are ignored.
  const generationRef = useRef(0);
  const focusFeedbackOnDialogCloseRef = useRef(false);
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const dialogFeedbackRef = useRef<HTMLDivElement | null>(null);
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
    const update = decideInitialModelUpdate({
      previousEmployeeId: employeeIdRef.current,
      employeeId,
      busy: operationRef.current !== null || reloadingRef.current,
      current: modelRef.current,
      next: initialModel,
    });
    if (update === 'ignore') return;
    if (update === 'reset_identity') {
      employeeIdRef.current = employeeId;
      generationRef.current += 1;
      reloadingRef.current = false;
      setIsReloading(false);
      setForbidden(false);
      setFeedback(null);
      setFeedbackPlacement('page');
      focusFeedbackOnDialogCloseRef.current = false;
      abandonOpenRef.current = false;
      setAbandonOpen(false);
    }
    modelRef.current = initialModel;
    setModel(initialModel);
    setProbationChoice(probationChoiceFromModel(initialModel));
    setReconciliationChoices({});
    setAbandonmentReason('');
    operationRef.current = null;
    setOperation(null);
  }, [employeeId, initialModel]);

  useEffect(() => {
    if (!focusRequest) return;
    const target =
      focusRequest.placement === 'dialog'
        ? (dialogFeedbackRef.current ?? feedbackRef.current)
        : feedbackRef.current;
    target?.focus();
  }, [focusRequest]);

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
  const dialogVisible = abandonOpen && canAbandonDraft(model);
  const dialogFeedback =
    feedback && feedbackPlacement === 'dialog' && dialogVisible
      ? feedback
      : null;

  function commitModel(nextModel: FormalitesPersonnelDraftReadModel) {
    modelRef.current = nextModel;
    setModel(nextModel);
  }

  function setAbandonDialogOpen(open: boolean) {
    abandonOpenRef.current = open;
    setAbandonOpen(open);
  }

  function showFeedback(
    nextFeedback: WorkspaceFeedback,
    placement: FeedbackPlacement,
    focus: boolean,
  ) {
    setFeedback(nextFeedback);
    setFeedbackPlacement(placement);
    if (focus) {
      setFocusRequest((current) => ({
        placement,
        sequence: (current?.sequence ?? 0) + 1,
      }));
    }
  }

  /** Shows feedback where it stays visible after an action from the dialog. */
  function showOutcomeFeedback(
    nextFeedback: WorkspaceFeedback,
    dialogWasOpen: boolean,
    focus: boolean,
  ) {
    if (dialogWasOpen && abandonOpenRef.current) {
      showFeedback(nextFeedback, 'dialog', true);
      return;
    }
    if (dialogWasOpen) focusFeedbackOnDialogCloseRef.current = true;
    showFeedback(nextFeedback, 'page', focus || dialogWasOpen);
  }

  function handleDialogCloseAutoFocus(event: Event) {
    if (!focusFeedbackOnDialogCloseRef.current) return;
    focusFeedbackOnDialogCloseRef.current = false;
    event.preventDefault();
    feedbackRef.current?.focus();
  }

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
    ) => Promise<FormalitesPersonnelDraftMutationActionResult>,
  ) {
    if (forbidden || reloadingRef.current) return;
    const generation = generationRef.current;
    const dialogWasOpen = abandonOpenRef.current;
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
    if (!result || generationRef.current !== generation) return;

    operationRef.current = result.operation;
    setOperation(result.operation);
    handleMutationOutcome(result.outcome, dialogWasOpen);
  }

  function acceptAuthoritativeModel(
    nextModel: FormalitesPersonnelDraftReadModel,
    preserveLocalInput: boolean,
  ) {
    commitModel(nextModel);
    if (!preserveLocalInput) {
      setProbationChoice(probationChoiceFromModel(nextModel));
      setReconciliationChoices({});
      setAbandonmentReason('');
      setAbandonDialogOpen(false);
      return;
    }
    setReconciliationChoices((choices) =>
      retainRelevantReconciliationChoices(choices, nextModel),
    );
    if (!canAbandonDraft(nextModel)) {
      setAbandonmentReason('');
      setAbandonDialogOpen(false);
    }
  }

  function handleMutationOutcome(
    outcome: FormalitesPersonnelDraftMutationActionResult,
    dialogWasOpen: boolean,
  ) {
    if (outcome.kind === 'success') {
      acceptAuthoritativeModel(outcome.model, false);
      showOutcomeFeedback(workspaceSavedFeedback(), dialogWasOpen, false);
      router.refresh();
      return;
    }

    if (outcome.kind === 'forbidden') {
      setForbidden(true);
    } else if (
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

    showOutcomeFeedback(
      workspaceFeedbackForOutcome(outcome),
      dialogWasOpen,
      true,
    );
  }

  async function reloadAuthoritativeModel() {
    if (reloadingRef.current || operationRef.current?.status === 'pending') {
      return;
    }
    const generation = generationRef.current;
    const dialogWasOpen = abandonOpenRef.current;
    reloadingRef.current = true;
    setIsReloading(true);
    setFeedback(null);
    try {
      const result = await reloadWorkspaceModel(() => loadAction(employeeId));
      if (generationRef.current !== generation) return;
      if (result.kind === 'success') {
        acceptAuthoritativeModel(result.model, false);
        operationRef.current = null;
        setOperation(null);
        showOutcomeFeedback(workspaceReloadedFeedback(), dialogWasOpen, true);
        return;
      }
      if (result.kind === 'forbidden') {
        setForbidden(true);
        operationRef.current = null;
        setOperation(null);
      }
      showOutcomeFeedback(
        workspaceReloadFailureFeedback(result),
        dialogWasOpen,
        true,
      );
    } finally {
      if (generationRef.current === generation) {
        reloadingRef.current = false;
        setIsReloading(false);
      }
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
      showFeedback(incompleteReconciliationFeedback(), 'page', false);
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
      showFeedback(abandonmentReasonRequiredFeedback(), 'dialog', false);
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
    // Keep the dialog while its request runs so the outcome stays visible.
    if (!open && pending) return;
    if (
      !open &&
      abandonmentReason.length > 0 &&
      !window.confirm('Abandonner le motif saisi sans enregistrer ?')
    ) {
      return;
    }
    setAbandonDialogOpen(open);
    if (!open) {
      setAbandonmentReason('');
      setFeedbackPlacement('page');
    }
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

      {feedback && !dialogFeedback && (
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
          locked={forbidden}
          onCreate={createDraft}
        />
      )}
      {model.state === 'editable' && (
        <EditableDraft
          model={model}
          locale={locale}
          probationChoice={probationChoice}
          pending={pending}
          locked={forbidden}
          onProbationChoice={setProbationChoice}
          onSave={saveDraft}
          onAbandon={() => setAbandonDialogOpen(true)}
        />
      )}
      {model.state === 'reconciliation_required' && (
        <ReconciliationRequired
          model={model}
          locale={locale}
          choices={reconciliationChoices}
          pending={pending}
          locked={forbidden}
          onChoice={(fact, choice) =>
            setReconciliationChoices((current) => ({
              ...current,
              [fact]: choice,
            }))
          }
          onReconcile={reconcileDraft}
          onAbandon={() => setAbandonDialogOpen(true)}
        />
      )}
      {model.state === 'ineligible_recovery' && (
        <IneligibleRecovery
          model={model}
          locale={locale}
          pending={pending}
          locked={forbidden}
          onAbandon={() => setAbandonDialogOpen(true)}
        />
      )}
      {model.state === 'abandoned' && (
        <AbandonedDraft
          model={model}
          locale={locale}
          pending={pending}
          locked={forbidden}
          onCreate={createDraft}
        />
      )}

      <AbandonDraftDialog
        open={dialogVisible}
        reason={abandonmentReason}
        reasonRef={abandonmentReasonRef}
        pending={pending}
        locked={forbidden}
        abandoning={operation?.kind === 'abandon' && pending}
        feedback={
          dialogFeedback && (
            <WorkspaceFeedbackAlert
              feedback={dialogFeedback}
              feedbackRef={dialogFeedbackRef}
              pending={pending}
              onReload={reloadAuthoritativeModel}
            />
          )
        }
        onOpenChange={changeAbandonDialog}
        onCloseAutoFocus={handleDialogCloseAutoFocus}
        onReasonChange={setAbandonmentReason}
        onConfirm={abandonDraft}
      />
    </div>
  );
}

function focusSoon(ref: { current: HTMLElement | null }) {
  window.requestAnimationFrame(() => ref.current?.focus());
}

function focusElementSoon(id: string) {
  window.requestAnimationFrame(() => document.getElementById(id)?.focus());
}
