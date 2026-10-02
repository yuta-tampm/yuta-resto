'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  FieldError,
  FieldHint,
  FormField,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@yuta/ui';
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Database,
  FileCheck2,
  FlaskConical,
  RotateCcw,
  Save,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useReducer, useRef, useState } from 'react';
import {
  cdiDraftPrototypeData,
  cdiDraftPrototypeReducer,
  createCdiDraftPrototypeState,
  getCdiDraftDemoReadiness,
  hasRequiredDemoInputs,
  isCdiDraftCheckpointDirty,
  type CdiDraftPrototypeStep,
  type CdiDraftPrototypeData,
  type CdiDraftPrototypeValues,
  type FictionalProbationChoice,
} from '../_lib/cdi-draft-prototype';

const prototypeSteps: readonly {
  id: CdiDraftPrototypeStep;
  number: string;
  label: string;
}[] = [
  { id: 'SOURCE', number: '1', label: 'Données réutilisables' },
  { id: 'INPUTS', number: '2', label: 'Informations à compléter' },
  { id: 'REVIEW', number: '3', label: 'Vérification' },
];

export function CdiDraftReadinessPrototype({
  data = cdiDraftPrototypeData,
  connectedEmployeeDossierHref,
}: {
  data?: CdiDraftPrototypeData;
  connectedEmployeeDossierHref?: string;
} = {}) {
  const connected = connectedEmployeeDossierHref !== undefined;
  const [state, dispatch] = useReducer(
    cdiDraftPrototypeReducer,
    undefined,
    createCdiDraftPrototypeState,
  );
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const addressRef = useRef<HTMLInputElement>(null);
  const remunerationRef = useRef<HTMLInputElement>(null);
  const readiness = getCdiDraftDemoReadiness(
    state.draftValues,
    state.reviewAcknowledged,
  );
  const checkpointDirty = isCdiDraftCheckpointDirty(state);

  function requestReview() {
    const hasRequiredInputs = hasRequiredDemoInputs(state.draftValues);
    dispatch({ type: 'REQUEST_REVIEW' });
    if (!hasRequiredInputs) {
      window.requestAnimationFrame(() => {
        if (state.draftValues.address.trim().length === 0) {
          addressRef.current?.focus();
        } else {
          remunerationRef.current?.focus();
        }
      });
    }
  }

  function selectStep(step: CdiDraftPrototypeStep) {
    if (step === 'REVIEW') {
      requestReview();
      return;
    }
    dispatch({ type: 'SET_STEP', step });
  }

  function editValue(field: keyof CdiDraftPrototypeValues, value: string) {
    dispatch({ type: 'EDIT_VALUE', field, value });
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      {connected ? (
        <div>
          <Button asChild variant="ghost" size="sm">
            <Link href={connectedEmployeeDossierHref}>
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Retour au dossier salarié
            </Link>
          </Button>
        </div>
      ) : null}

      <Alert
        tone={connected ? 'info' : 'warning'}
        icon={
          connected ? (
            <Database className="h-5 w-5" aria-hidden />
          ) : (
            <FlaskConical className="h-5 w-5" aria-hidden />
          )
        }
      >
        <AlertTitle>
          {connected
            ? 'Prototype connecté — saisie locale uniquement'
            : 'Prototype interactif — données entièrement fictives'}
        </AlertTitle>
        <AlertDescription>
          {connected
            ? 'Les six informations affichées proviennent de ce dossier salarié fictif de développement. Les trois valeurs saisies ne sont ni enregistrées dans le navigateur, ni envoyées au serveur. Elles disparaissent au rechargement ou en quittant cette page.'
            : 'Rien n’est lu depuis un dossier salarié, enregistré dans le navigateur ou envoyé au serveur. Toutes les modifications disparaissent au rechargement ou en quittant cette page.'}
        </AlertDescription>
      </Alert>

      <Card className="flex flex-col gap-4" padding="lg">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-surface-muted p-2.5">
              <UserRound className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary/55">
                {connected ? 'Dossier salarié sélectionné' : 'Salariée fictive'}
              </p>
              <h2 className="mt-1 text-xl font-black">
                {data.fictionalEmployee}
              </h2>
            </div>
          </div>
          <Badge tone="neutral">
            {connected
              ? 'Dossier en lecture seule + saisie locale'
              : 'Interaction locale uniquement'}
          </Badge>
        </div>

        <div
          className="grid gap-3 sm:grid-cols-3"
          aria-label={
            connected ? 'Étapes du prototype connecté' : 'Étapes du prototype'
          }
        >
          {prototypeSteps.map((step) => (
            <PrototypeStep
              key={step.id}
              number={step.number}
              label={step.label}
              active={state.activeStep === step.id}
              onClick={() => selectStep(step.id)}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
          <CheckpointStatus
            hasCheckpoint={state.checkpointValues !== null}
            dirty={checkpointDirty}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setResetDialogOpen(true)}
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Réinitialiser la démonstration
          </Button>
        </div>
      </Card>

      {state.activeStep === 'SOURCE' ? (
        <SourceStep
          data={data}
          connected={connected}
          onContinue={() => selectStep('INPUTS')}
        />
      ) : null}

      {state.activeStep === 'INPUTS' ? (
        <InputsStep
          values={state.draftValues}
          validationAttempted={state.validationAttempted}
          addressRef={addressRef}
          remunerationRef={remunerationRef}
          onEdit={editValue}
          onBack={() => selectStep('SOURCE')}
          onCheckpoint={() => dispatch({ type: 'CREATE_CHECKPOINT' })}
          onContinue={requestReview}
        />
      ) : null}

      {state.activeStep === 'REVIEW' ? (
        <ReviewStep
          values={state.draftValues}
          readiness={readiness}
          reviewAcknowledged={state.reviewAcknowledged}
          onReviewAcknowledged={(acknowledged) =>
            dispatch({ type: 'SET_REVIEW_ACKNOWLEDGED', acknowledged })
          }
          onBack={() => selectStep('INPUTS')}
          onCheckpoint={() => dispatch({ type: 'CREATE_CHECKPOINT' })}
        />
      ) : null}

      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Réinitialiser cette démonstration ?"
        description="Les valeurs fictives saisies et le checkpoint local seront effacés. Aucune donnée métier ni aucun dossier salarié ne sera supprimé."
        confirmLabel="Réinitialiser la démonstration"
        cancelLabel="Continuer le test"
        tone="primary"
        onConfirm={() => {
          dispatch({ type: 'RESET' });
          setResetDialogOpen(false);
        }}
      />
    </div>
  );
}

function PrototypeStep({
  number,
  label,
  active,
  onClick,
}: {
  number: string;
  label: string;
  active: boolean;
  onClick(): void;
}) {
  return (
    <button
      type="button"
      className={
        active
          ? 'rounded-lg border border-brand-200 bg-surface-selected p-3 text-left focus:outline-none focus:ring-2 focus:ring-focus-ring'
          : 'rounded-lg border border-border-default bg-surface p-3 text-left hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-focus-ring'
      }
      aria-current={active ? 'step' : undefined}
      onClick={onClick}
    >
      <span className="block text-xs font-bold text-primary/50">
        Étape {number}
      </span>
      <span className="mt-1 block text-sm font-bold">{label}</span>
    </button>
  );
}

function CheckpointStatus({
  hasCheckpoint,
  dirty,
}: {
  hasCheckpoint: boolean;
  dirty: boolean;
}) {
  if (!hasCheckpoint) {
    return (
      <p className="text-sm font-medium text-primary/55" role="status">
        Aucun checkpoint — rien n’est conservé au rechargement.
      </p>
    );
  }
  return (
    <p
      className={
        dirty
          ? 'text-sm font-semibold text-status-warning'
          : 'text-sm font-semibold text-status-success'
      }
      role="status"
    >
      {dirty
        ? 'Modifications non mémorisées dans cette démonstration.'
        : 'Mémorisé pour cette démonstration — perdu au rechargement.'}
    </p>
  );
}

function SourceStep({
  data,
  connected,
  onContinue,
}: {
  data: CdiDraftPrototypeData;
  connected: boolean;
  onContinue(): void;
}) {
  return (
    <Card className="flex flex-col gap-5" padding="lg">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black">
            {connected
              ? 'Données autorisées venant de Salariés'
              : 'Données qui viendraient de Salariés'}
          </h2>
          <p className="mt-1 text-sm text-primary/55">
            {connected
              ? 'Ces six valeurs du dossier restent en lecture seule dans cette démonstration.'
              : 'Ces valeurs sont fixes et entièrement fictives dans ce prototype.'}
          </p>
        </div>
        <Badge tone="success">
          {connected ? 'Lecture seule' : 'Données de démonstration disponibles'}
        </Badge>
      </div>
      <FieldList fields={data.reusableFields} />
      <div className="flex justify-end border-t border-border-subtle pt-4">
        <Button type="button" onClick={onContinue}>
          Continuer
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </Card>
  );
}

function InputsStep({
  values,
  validationAttempted,
  addressRef,
  remunerationRef,
  onEdit,
  onBack,
  onCheckpoint,
  onContinue,
}: {
  values: CdiDraftPrototypeValues;
  validationAttempted: boolean;
  addressRef: React.RefObject<HTMLInputElement | null>;
  remunerationRef: React.RefObject<HTMLInputElement | null>;
  onEdit(field: keyof CdiDraftPrototypeValues, value: string): void;
  onBack(): void;
  onCheckpoint(): void;
  onContinue(): void;
}) {
  const addressMissing =
    validationAttempted && values.address.trim().length === 0;
  const remunerationMissing =
    validationAttempted && values.remuneration.trim().length === 0;

  return (
    <Card className="flex flex-col gap-5" padding="lg">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-black">
            Informations fictives à compléter
          </h2>
          <Badge tone="warning">Questionnaire incomplet et non juridique</Badge>
        </div>
        <p className="mt-1 text-sm text-primary/55">
          Ces trois champs servent uniquement à tester le parcours. Ils ne
          constituent pas un modèle de contrat CDI.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <FormField
          label={<Label htmlFor="fictional-address">Adresse fictive</Label>}
          error={
            addressMissing ? (
              <span id="fictional-address-error">
                Saisissez une valeur fictive pour continuer la démonstration.
              </span>
            ) : undefined
          }
          hint="Aucune adresse réelle ne doit être utilisée."
        >
          <Input
            ref={addressRef}
            id="fictional-address"
            value={values.address}
            placeholder="Ex. 10 rue de la Démonstration"
            aria-invalid={addressMissing}
            aria-describedby={
              addressMissing ? 'fictional-address-error' : undefined
            }
            onChange={(event) =>
              editInput(onEdit, 'address', event.target.value)
            }
          />
        </FormField>

        <FormField
          label={
            <Label htmlFor="fictional-remuneration">
              Rémunération contractuelle fictive
            </Label>
          }
          error={
            remunerationMissing ? (
              <span id="fictional-remuneration-error">
                Saisissez une valeur fictive pour continuer la démonstration.
              </span>
            ) : undefined
          }
          hint="Valeur libre de démonstration, sans validation salariale ou légale."
        >
          <Input
            ref={remunerationRef}
            id="fictional-remuneration"
            value={values.remuneration}
            placeholder="Ex. Valeur fictive"
            aria-invalid={remunerationMissing}
            aria-describedby={
              remunerationMissing ? 'fictional-remuneration-error' : undefined
            }
            onChange={(event) =>
              editInput(onEdit, 'remuneration', event.target.value)
            }
          />
        </FormField>
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-medium text-primary">
          Décision fictive sur la période d’essai
        </legend>
        <RadioGroup
          value={values.probationChoice}
          onValueChange={(value) =>
            onEdit('probationChoice', value as FictionalProbationChoice)
          }
          className="grid gap-3 sm:grid-cols-3"
        >
          <ProbationChoice value="yes" label="Oui — fictif" />
          <ProbationChoice value="no" label="Non — fictif" />
          <ProbationChoice value="undecided" label="À décider" />
        </RadioGroup>
        <FieldHint>
          Ce choix ne recommande aucune clause et ne remplace pas une validation
          juridique.
        </FieldHint>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-4 lg:flex-row lg:items-center lg:justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Précédent
        </Button>
        <div className="flex flex-col gap-3 lg:flex-row">
          <Button type="button" variant="outline" onClick={onCheckpoint}>
            <Save className="h-4 w-4" aria-hidden />
            Simuler l’enregistrement
          </Button>
          <Button type="button" onClick={onContinue}>
            Continuer vers la vérification
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ProbationChoice({
  value,
  label,
}: {
  value: FictionalProbationChoice;
  label: string;
}) {
  const id = `fictional-probation-${value}`;
  return (
    <Label
      htmlFor={id}
      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border-default bg-surface p-3"
    >
      <RadioGroupItem id={id} value={value} />
      <span>{label}</span>
    </Label>
  );
}

function ReviewStep({
  values,
  readiness,
  reviewAcknowledged,
  onReviewAcknowledged,
  onBack,
  onCheckpoint,
}: {
  values: CdiDraftPrototypeValues;
  readiness: ReturnType<typeof getCdiDraftDemoReadiness>;
  reviewAcknowledged: boolean;
  onReviewAcknowledged(acknowledged: boolean): void;
  onBack(): void;
  onCheckpoint(): void;
}) {
  const reviewFields = [
    { label: 'Adresse fictive', value: values.address },
    { label: 'Rémunération fictive', value: values.remuneration },
    {
      label: 'Période d’essai fictive',
      value: probationChoiceLabel(values.probationChoice),
    },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Card className="flex flex-col gap-5" padding="lg">
        <div>
          <h2 className="text-lg font-black">Vérification fictive</h2>
          <p className="mt-1 text-sm text-primary/55">
            Vérifiez uniquement le fonctionnement de l’interface. Aucun contrôle
            juridique ou métier réel n’est effectué.
          </p>
        </div>
        <FieldList fields={reviewFields} />
        <Label
          htmlFor="fictional-review-acknowledged"
          className="flex cursor-pointer items-start gap-3 rounded-lg border border-border-default bg-surface-muted p-4 leading-relaxed"
        >
          <Checkbox
            id="fictional-review-acknowledged"
            checked={reviewAcknowledged}
            onCheckedChange={(checked) =>
              onReviewAcknowledged(checked === true)
            }
          />
          <span>
            J’ai vérifié cette démonstration fictive. Cette confirmation n’est
            ni une approbation juridique ni une signature.
          </span>
        </Label>
        <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-4 lg:flex-row lg:items-center lg:justify-between">
          <Button type="button" variant="secondary" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Précédent
          </Button>
          <Button type="button" variant="outline" onClick={onCheckpoint}>
            <Save className="h-4 w-4" aria-hidden />
            Simuler l’enregistrement
          </Button>
        </div>
      </Card>

      <ReadinessCard readiness={readiness} />
    </div>
  );
}

function ReadinessCard({
  readiness,
}: {
  readiness: ReturnType<typeof getCdiDraftDemoReadiness>;
}) {
  const content =
    readiness === 'READY'
      ? {
          badge: <Badge tone="success">Prêt pour la démonstration</Badge>,
          title: 'Démonstration vérifiée',
          description:
            'Prêt pour cette démonstration uniquement : les trois valeurs fictives sont renseignées et la revue locale est cochée. Cela ne valide aucun contrat.',
        }
      : readiness === 'ATTENTION_REQUIRED'
        ? {
            badge: <Badge tone="warning">Attention requise</Badge>,
            title: 'Une décision fictive reste à vérifier',
            description:
              'Choisissez la période d’essai fictive et confirmez la revue de démonstration.',
          }
        : {
            badge: <Badge tone="danger">Informations incomplètes</Badge>,
            title: 'Démonstration incomplète',
            description:
              'Revenez à l’étape précédente pour compléter les valeurs fictives.',
          };

  return (
    <Card className="flex h-fit flex-col gap-4" padding="lg">
      <div>{content.badge}</div>
      <div className="flex items-start gap-3">
        <CircleAlert
          className="mt-0.5 h-5 w-5 shrink-0 text-status-warning"
          aria-hidden
        />
        <div>
          <h2 className="font-black">{content.title}</h2>
          <p className="mt-1 text-sm text-primary/60">{content.description}</p>
        </div>
      </div>
      <Button type="button" disabled fullWidth>
        <FileCheck2 className="h-4 w-4" aria-hidden />
        Générer le projet de contrat
      </Button>
      <p className="text-xs font-medium text-primary/50">
        Indisponible : aucun fichier n’est créé par ce prototype.
      </p>
    </Card>
  );
}

function FieldList({
  fields,
}: {
  fields: readonly { label: string; value: string }[];
}) {
  return (
    <dl className="divide-y divide-border-subtle">
      {fields.map((field) => (
        <div
          key={field.label}
          className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4"
        >
          <dt className="text-sm font-semibold text-primary/60">
            {field.label}
          </dt>
          <dd className="text-sm font-bold sm:text-right">{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function editInput(
  onEdit: (field: keyof CdiDraftPrototypeValues, value: string) => void,
  field: 'address' | 'remuneration',
  value: string,
) {
  onEdit(field, value);
}

function probationChoiceLabel(choice: FictionalProbationChoice): string {
  if (choice === 'yes') return 'Oui — fictif';
  if (choice === 'no') return 'Non — fictif';
  return 'À décider';
}
