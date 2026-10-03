'use client';

import type {
  FormalitesPersonnelDraftReadModel,
  FormalitesPersonnelFact,
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
  CircleAlert,
  FilePenLine,
  RefreshCw,
  Save,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import type { RefObject } from 'react';
import type { WorkspaceFeedback } from '../_lib/cdi-draft-workspace-feedback';
import {
  personnelFactLabels,
  reconciliationChoiceLabels,
} from '../_lib/cdi-draft-workspace-state';
import {
  FactsGrid,
  ProbationChoiceField,
  ValueCard,
  formatFactValue,
} from './cdi-draft-workspace-fields';

export type ReconciliationChoices = Partial<
  Record<FormalitesPersonnelFact, FormalitesPersonnelReconciliationChoice>
>;

export function WorkspaceFeedbackAlert({
  feedback,
  feedbackRef,
  pending,
  onReload,
}: {
  feedback: WorkspaceFeedback;
  feedbackRef: RefObject<HTMLDivElement | null>;
  pending: boolean;
  onReload(): void;
}) {
  return (
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
            onClick={onReload}
            disabled={pending}
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Recharger la version enregistrée
          </Button>
        )}
      </Alert>
    </div>
  );
}

export function EligibleNoDraft({
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

export function EditableDraft({
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

export function ReconciliationRequired({
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

export function IneligibleRecovery({
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

export function AbandonedDraft({
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

export function AbandonDraftDialog({
  open,
  reason,
  reasonRef,
  pending,
  abandoning,
  onOpenChange,
  onReasonChange,
  onConfirm,
}: {
  open: boolean;
  reason: string;
  reasonRef: RefObject<HTMLTextAreaElement | null>;
  pending: boolean;
  abandoning: boolean;
  onOpenChange(open: boolean): void;
  onReasonChange(reason: string): void;
  onConfirm(): void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel="Fermer la confirmation d’abandon">
        <DialogHeader>
          <DialogTitle>Abandonner ce brouillon ?</DialogTitle>
          <DialogDescription>
            Le brouillon restera consultable en lecture seule. Cette action ne
            supprime pas le dossier salarié.
          </DialogDescription>
        </DialogHeader>
        <FormField
          className="mt-5"
          label={<Label htmlFor="formalites-abandon-reason">Motif</Label>}
          hint={`${reason.trim().length}/250 caractères`}
        >
          <Textarea
            ref={reasonRef}
            id="formalites-abandon-reason"
            value={reason}
            maxLength={250}
            required
            aria-describedby="formalites-abandon-help"
            onChange={(event) => onReasonChange(event.target.value)}
          />
          <p id="formalites-abandon-help" className="text-xs text-secondary">
            Le motif est obligatoire et sera conservé avec le brouillon
            abandonné.
          </p>
        </FormField>
        <DialogFooter className="mt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={pending || reason.trim().length === 0}
            loading={abandoning}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Confirmer l’abandon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
