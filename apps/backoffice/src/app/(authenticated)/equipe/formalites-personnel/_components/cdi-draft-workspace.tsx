'use client';

import type {
  FormalitesPersonnelDraftMutationOutcome,
  FormalitesPersonnelDraftReadModel,
  FormalitesPersonnelFact,
  FormalitesPersonnelFacts,
  FormalitesPersonnelProbationChoice,
  FormalitesPersonnelReconciliationChoice,
} from '@yuta/contracts';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Label,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from '@yuta/ui';
import {
  ArrowLeft,
  CircleAlert,
  FilePenLine,
  RefreshCw,
  Save,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import type { LoadFormalitesPersonnelDraftActionResult } from '../[employeeId]/actions';
import {
  createOpaqueOperationKey,
  createWorkspaceIntent,
  hasWorkspaceUnsavedChanges,
  personnelFactLabels,
  prepareWorkspaceOperation,
  probationChoiceFromModel,
  probationChoiceLabels,
  reconciliationChoiceLabels,
  retainRelevantReconciliationChoices,
  settleWorkspaceOperation,
  type WorkspaceMutationKind,
  type WorkspaceOperation,
} from '../_lib/cdi-draft-workspace-state';

type ReconciliationChoices = Partial<
  Record<FormalitesPersonnelFact, FormalitesPersonnelReconciliationChoice>
>;

type WorkspaceFeedback = {
  tone: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  recoverable: boolean;
};

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
    const preparation = prepareWorkspaceOperation(
      operationRef.current,
      kind,
      createWorkspaceIntent(kind, intentPayload),
      createOpaqueOperationKey,
    );
    if (preparation.kind === 'blocked') return;

    operationRef.current = preparation.operation;
    setOperation(preparation.operation);
    setFeedback(null);
    const outcome = await run(preparation.operation.key);
    const nextOperation = settleWorkspaceOperation(
      preparation.operation,
      outcome,
    );
    operationRef.current = nextOperation;
    setOperation(nextOperation);
    handleMutationOutcome(outcome);
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
      setFeedback({
        tone: 'success',
        title: 'Modifications enregistrées',
        description:
          'Le brouillon affiché correspond maintenant à la version enregistrée.',
        recoverable: false,
      });
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
      const result = await loadAction(employeeId);
      if (result.kind === 'success') {
        acceptAuthoritativeModel(result.model, false);
        operationRef.current = null;
        setOperation(null);
        setFeedback({
          tone: 'info',
          title: 'Données actualisées',
          description: 'La dernière version enregistrée est affichée.',
          recoverable: false,
        });
      } else {
        setFeedback({
          tone: 'danger',
          title: 'Actualisation impossible',
          description:
            result.kind === 'not_found'
              ? 'Ce dossier n’est plus disponible dans cet établissement.'
              : 'Réessayez dans quelques instants.',
          recoverable: result.kind === 'server_error',
        });
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
      setFeedback({
        tone: 'danger',
        title: 'Choix incomplet',
        description:
          'Choisissez une action pour chaque information différente avant de continuer.',
        recoverable: false,
      });
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
      setFeedback({
        tone: 'danger',
        title: 'Motif requis',
        description: 'Saisissez un motif entre 1 et 250 caractères.',
        recoverable: false,
      });
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
        <div ref={feedbackRef} tabIndex={-1} aria-live="polite">
          <Alert
            tone={feedback.tone}
            icon={<CircleAlert className="h-5 w-5" aria-hidden />}
          >
            <AlertTitle>{feedback.title}</AlertTitle>
            <AlertDescription className="text-primary opacity-100">
              {feedback.description}
            </AlertDescription>
            {feedback.recoverable && (
              <Button
                className="mt-3"
                type="button"
                size="sm"
                variant="secondary"
                onClick={reloadAuthoritativeModel}
                disabled={pending}
              >
                <RefreshCw className="h-4 w-4" aria-hidden />
                Recharger la version enregistrée
              </Button>
            )}
          </Alert>
        </div>
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
        <Dialog open={abandonOpen} onOpenChange={changeAbandonDialog}>
          <DialogContent closeLabel="Fermer la confirmation d’abandon">
            <DialogHeader>
              <DialogTitle>Abandonner ce brouillon ?</DialogTitle>
              <DialogDescription>
                Le brouillon restera consultable en lecture seule. Cette action
                ne supprime pas le dossier salarié.
              </DialogDescription>
            </DialogHeader>
            <FormField
              className="mt-5"
              label={<Label htmlFor="formalites-abandon-reason">Motif</Label>}
              hint={`${abandonmentReason.trim().length}/250 caractères`}
            >
              <Textarea
                ref={abandonmentReasonRef}
                id="formalites-abandon-reason"
                value={abandonmentReason}
                maxLength={250}
                required
                aria-describedby="formalites-abandon-help"
                onChange={(event) => setAbandonmentReason(event.target.value)}
              />
              <p
                id="formalites-abandon-help"
                className="text-xs text-secondary"
              >
                Le motif est obligatoire et sera conservé avec le brouillon
                abandonné.
              </p>
            </FormField>
            <DialogFooter className="mt-5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => changeAbandonDialog(false)}
                disabled={pending}
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={abandonDraft}
                disabled={pending || abandonmentReason.trim().length === 0}
                loading={operation?.kind === 'abandon' && pending}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Confirmer l’abandon
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function EligibleNoDraft({
  model,
  locale,
  pending,
  onCreate,
}: {
  model: Extract<
    FormalitesPersonnelDraftReadModel,
    { state: 'eligible_no_draft' }
  >;
  locale: string;
  pending: boolean;
  onCreate(): void;
}) {
  return (
    <Card className="grid gap-5" padding="lg">
      <Alert tone="info" icon={<FilePenLine className="h-5 w-5" aria-hidden />}>
        <AlertTitle>Aucun brouillon actif</AlertTitle>
        <AlertDescription className="text-primary opacity-100">
          Créez explicitement un brouillon à partir des informations actuelles
          du dossier salarié. Aucun enregistrement automatique n’est effectué.
        </AlertDescription>
      </Alert>
      <FactsGrid
        title="Valeurs actuelles du dossier salarié"
        facts={model.currentPersonnelValues}
        locale={locale}
      />
      <div className="flex justify-end border-t border-border-subtle pt-4">
        <Button
          type="button"
          onClick={onCreate}
          disabled={pending}
          loading={pending}
        >
          Créer le brouillon
        </Button>
      </div>
    </Card>
  );
}

function EditableDraft({
  model,
  locale,
  probationChoice,
  pending,
  onProbationChoice,
  onSave,
  onAbandon,
}: {
  model: Extract<FormalitesPersonnelDraftReadModel, { state: 'editable' }>;
  locale: string;
  probationChoice: FormalitesPersonnelProbationChoice;
  pending: boolean;
  onProbationChoice(value: FormalitesPersonnelProbationChoice): void;
  onSave(): void;
  onAbandon(): void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <Card className="grid min-w-0 gap-6" padding="lg">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black">Brouillon en cours</h3>
            <p className="mt-1 text-sm text-secondary">
              Choisissez uniquement la décision de préparation puis
              enregistrez-la.
            </p>
          </div>
          <Badge tone="success">Modifiable</Badge>
        </div>
        <ProbationChoiceField
          value={probationChoice}
          onValueChange={onProbationChoice}
          disabled={pending}
        />
        <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-4 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="danger"
            onClick={onAbandon}
            disabled={pending}
          >
            Abandonner le brouillon
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={pending}
            loading={pending}
          >
            <Save className="h-4 w-4" aria-hidden />
            Enregistrer
          </Button>
        </div>
      </Card>
      <FactsGrid
        title="Informations du brouillon"
        facts={model.draftValues}
        locale={locale}
      />
    </div>
  );
}

function ReconciliationRequired({
  model,
  locale,
  choices,
  pending,
  onChoice,
  onReconcile,
  onAbandon,
}: {
  model: Extract<
    FormalitesPersonnelDraftReadModel,
    { state: 'reconciliation_required' }
  >;
  locale: string;
  choices: ReconciliationChoices;
  pending: boolean;
  onChoice(
    fact: FormalitesPersonnelFact,
    choice: FormalitesPersonnelReconciliationChoice,
  ): void;
  onReconcile(): void;
  onAbandon(): void;
}) {
  return (
    <Card className="grid gap-6" padding="lg">
      <Alert
        tone="warning"
        icon={<RefreshCw className="h-5 w-5" aria-hidden />}
      >
        <AlertTitle>Le dossier salarié a changé</AlertTitle>
        <AlertDescription className="text-primary opacity-100">
          Comparez chaque différence. Les valeurs actuelles restent en lecture
          seule et votre choix ne modifie pas le dossier salarié.
        </AlertDescription>
      </Alert>
      <div className="grid gap-4">
        {model.divergentFacts.map((fact) => (
          <fieldset
            key={fact}
            className="min-w-0 rounded-xl border border-border-default p-4"
          >
            <legend className="px-2 font-black">
              {personnelFactLabels[fact]}
            </legend>
            <div className="grid gap-3 md:grid-cols-2">
              <ValueCard
                label="Valeur du brouillon"
                value={formatFactValue(fact, model.draftValues[fact], locale)}
              />
              <ValueCard
                label="Valeur actuelle du dossier salarié"
                value={formatFactValue(
                  fact,
                  model.currentPersonnelValues[fact],
                  locale,
                )}
                emphasized
              />
            </div>
            <RadioGroup
              className="mt-4 grid gap-3 lg:grid-cols-2"
              value={choices[fact]}
              onValueChange={(value) =>
                onChoice(fact, value as FormalitesPersonnelReconciliationChoice)
              }
              disabled={pending}
              aria-label={`Choix pour ${personnelFactLabels[fact]}`}
            >
              {(['keep', 'refresh'] as const).map((choice) => (
                <Label
                  key={choice}
                  htmlFor={`reconcile-${fact}-${choice}`}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border-default p-3 focus-within:ring-2 focus-within:ring-focus-ring"
                >
                  <RadioGroupItem
                    id={`reconcile-${fact}-${choice}`}
                    value={choice}
                  />
                  <span>{reconciliationChoiceLabels[choice]}</span>
                </Label>
              ))}
            </RadioGroup>
          </fieldset>
        ))}
      </div>
      <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-4 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="danger"
          onClick={onAbandon}
          disabled={pending}
        >
          Abandonner le brouillon
        </Button>
        <Button
          type="button"
          onClick={onReconcile}
          disabled={pending}
          loading={pending}
        >
          Valider les choix
        </Button>
      </div>
    </Card>
  );
}

function IneligibleRecovery({
  model,
  locale,
  pending,
  onAbandon,
}: {
  model: Extract<
    FormalitesPersonnelDraftReadModel,
    { state: 'ineligible_recovery' }
  >;
  locale: string;
  pending: boolean;
  onAbandon(): void;
}) {
  return (
    <div className="grid gap-5">
      <Alert
        tone="warning"
        icon={<ShieldAlert className="h-5 w-5" aria-hidden />}
      >
        <AlertTitle>Ce brouillon ne peut plus être modifié</AlertTitle>
        <AlertDescription className="text-primary opacity-100">
          Le contrat actuel du salarié n’est plus un CDI. Vous pouvez consulter
          le brouillon conservé ou l’abandonner, sans modifier automatiquement
          son type.
        </AlertDescription>
      </Alert>
      <div className="grid gap-5 lg:grid-cols-2">
        <FactsGrid
          title="Valeurs conservées dans le brouillon"
          facts={model.draftValues}
          locale={locale}
        />
        <FactsGrid
          title="Valeurs actuelles du dossier salarié"
          facts={model.currentPersonnelValues}
          locale={locale}
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="danger"
          onClick={onAbandon}
          disabled={pending}
        >
          Abandonner le brouillon
        </Button>
      </div>
    </div>
  );
}

function AbandonedDraft({
  model,
  locale,
  pending,
  onCreate,
}: {
  model: Extract<FormalitesPersonnelDraftReadModel, { state: 'abandoned' }>;
  locale: string;
  pending: boolean;
  onCreate(): void;
}) {
  return (
    <div className="grid gap-5">
      <Alert
        tone="neutral"
        icon={<ShieldAlert className="h-5 w-5" aria-hidden />}
      >
        <AlertTitle>Brouillon abandonné — lecture seule</AlertTitle>
        <AlertDescription className="text-primary opacity-100">
          Cet enregistrement est conservé et ne peut pas être réactivé ou
          modifié.
        </AlertDescription>
      </Alert>
      <Card className="grid gap-4" padding="lg">
        <div>
          <p className="text-xs font-bold uppercase text-muted">
            Motif de l’abandon
          </p>
          <p className="mt-1 font-semibold">{model.abandonmentReason}</p>
        </div>
        <FactsGrid
          title="Dernières valeurs du brouillon"
          facts={model.draftValues}
          locale={locale}
          embedded
        />
        {model.currentPersonnelValues.employmentTermType === 'indefinite' && (
          <div className="flex justify-end border-t border-border-subtle pt-4">
            <Button
              type="button"
              onClick={onCreate}
              disabled={pending}
              loading={pending}
            >
              Créer un nouveau brouillon
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function ProbationChoiceField({
  value,
  onValueChange,
  disabled,
}: {
  value: FormalitesPersonnelProbationChoice;
  onValueChange(value: FormalitesPersonnelProbationChoice): void;
  disabled: boolean;
}) {
  return (
    <fieldset>
      <legend className="font-black">Période d’essai à prévoir</legend>
      <p className="mt-1 text-sm text-secondary">
        Ce choix sert uniquement à préparer le brouillon.
      </p>
      <RadioGroup
        className="mt-4 grid gap-3 xl:grid-cols-3"
        value={value}
        onValueChange={(next) =>
          onValueChange(next as FormalitesPersonnelProbationChoice)
        }
        disabled={disabled}
        aria-label="Décision de préparation de la période d’essai"
      >
        {(['undecided', 'include', 'exclude'] as const).map((choice) => (
          <Label
            key={choice}
            htmlFor={`formalites-probation-${choice}`}
            className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-border-default p-3 focus-within:ring-2 focus-within:ring-focus-ring"
          >
            <RadioGroupItem
              id={`formalites-probation-${choice}`}
              value={choice}
            />
            <span>{probationChoiceLabels[choice]}</span>
          </Label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

function FactsGrid({
  title,
  facts,
  locale,
  embedded = false,
}: {
  title: string;
  facts: FormalitesPersonnelFacts;
  locale: string;
  embedded?: boolean;
}) {
  const content = (
    <>
      <h3 className="font-black">{title}</h3>
      <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {(Object.keys(personnelFactLabels) as FormalitesPersonnelFact[]).map(
          (fact) => (
            <div key={fact} className="min-w-0">
              <dt className="text-xs font-bold uppercase text-muted">
                {personnelFactLabels[fact]}
              </dt>
              <dd className="mt-1 break-words text-sm font-semibold">
                {formatFactValue(fact, facts[fact], locale)}
              </dd>
            </div>
          ),
        )}
      </dl>
    </>
  );
  return embedded ? (
    <section className="border-t border-border-subtle pt-4">{content}</section>
  ) : (
    <Card className="min-w-0" padding="lg">
      {content}
    </Card>
  );
}

function ValueCard({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={
        emphasized
          ? 'rounded-lg bg-surface-selected p-3'
          : 'rounded-lg bg-surface-muted p-3'
      }
    >
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 break-words font-semibold">{value}</p>
    </div>
  );
}

function formatFactValue(
  fact: FormalitesPersonnelFact,
  value: FormalitesPersonnelFacts[FormalitesPersonnelFact],
  locale: string,
): string {
  if (fact === 'employmentTermType')
    return value === 'indefinite' ? 'CDI' : 'CDD';
  if (fact === 'entryDate') {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeZone: 'UTC',
    }).format(new Date(`${value as string}T12:00:00Z`));
  }
  if (fact === 'contractWeeklyMinutes') {
    if (value === null) return 'Non renseignée';
    const minutes = value as number;
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return remainder === 0
      ? `${hours} h par semaine`
      : `${hours} h ${remainder.toString().padStart(2, '0')} par semaine`;
  }
  return String(value);
}

export function workspaceFeedbackForOutcome(
  outcome: Exclude<
    FormalitesPersonnelDraftMutationOutcome,
    { kind: 'success' }
  >,
): WorkspaceFeedback {
  switch (outcome.kind) {
    case 'validation_error':
      return {
        tone: 'danger',
        title: 'Informations à vérifier',
        description: 'Corrigez les champs indiqués puis réessayez.',
        recoverable: false,
      };
    case 'active_draft_exists':
      return {
        tone: 'info',
        title: 'Brouillon existant retrouvé',
        description:
          'Le brouillon actif déjà enregistré est maintenant affiché.',
        recoverable: false,
      };
    case 'stale_draft':
      return {
        tone: 'warning',
        title: 'Le brouillon a été modifié ailleurs',
        description:
          'Rechargez la version enregistrée avant de reprendre vos modifications.',
        recoverable: true,
      };
    case 'stale_personnel_source':
      return {
        tone: 'warning',
        title: 'Le dossier salarié a encore changé',
        description:
          'Vérifiez les nouvelles différences. Aucun choix n’a été partiellement enregistré.',
        recoverable: true,
      };
    case 'ineligible_recovery':
      return {
        tone: 'warning',
        title: 'Modification interrompue',
        description:
          'Le salarié n’est plus en CDI. Le brouillon enregistré reste consultable ou peut être abandonné.',
        recoverable: false,
      };
    case 'draft_abandoned':
      return {
        tone: 'info',
        title: 'Brouillon déjà abandonné',
        description: 'La version conservée en lecture seule est affichée.',
        recoverable: false,
      };
    case 'replay_conflict':
      return {
        tone: 'danger',
        title: 'Envoi à reprendre',
        description:
          'Cette tentative ne correspond plus à l’action initiale. Rechargez avant de recommencer.',
        recoverable: true,
      };
    case 'not_found':
      return {
        tone: 'danger',
        title: 'Dossier indisponible',
        description:
          'Ce brouillon n’est plus disponible dans cet établissement.',
        recoverable: false,
      };
    case 'server_error':
      return {
        tone: 'danger',
        title: 'Enregistrement incertain',
        description:
          'La réponse du serveur n’a pas pu être confirmée. Réessayez la même action sans modifier les valeurs.',
        recoverable: true,
      };
  }
  return {
    tone: 'danger',
    title: 'Action interrompue',
    description: 'Rechargez la version enregistrée avant de réessayer.',
    recoverable: true,
  };
}

function focusSoon(ref: { current: HTMLElement | null }) {
  window.requestAnimationFrame(() => ref.current?.focus());
}

function focusElementSoon(id: string) {
  window.requestAnimationFrame(() => document.getElementById(id)?.focus());
}
