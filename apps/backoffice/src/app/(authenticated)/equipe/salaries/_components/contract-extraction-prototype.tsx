'use client';

import type {
  PersonnelContractExtractionRequest,
  PersonnelContractExtractionReviewResult,
  PersonnelContractExtractionScenario,
  PersonnelContractExtractionSuggestion,
  PersonnelDocument,
  PersonnelEmployeeSummary,
} from '@yuta/contracts/personnel';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  RadioGroup,
  RadioGroupItem,
} from '@yuta/ui';
import {
  ChevronDown,
  Info,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  applyContractExtractionAction,
  loadStoredSyntheticContractEligibilityAction,
  startContractExtractionAction,
} from '../actions';
import {
  getContractExtractionConfidenceLabel,
  type ContractExtractionPrototypeChoices,
} from '../contract-extraction-prototype-model';

type ExtractionState =
  | { status: 'idle' }
  | { status: 'loading'; message: string }
  | { status: 'ready'; result: PersonnelContractExtractionReviewResult }
  | { status: 'error'; message: string };

type InputSource = 'generated' | 'upload' | 'stored';

type StoredEligibility =
  | { status: 'loading'; message: string }
  | {
      status: 'eligible';
      message: string;
      mode: 'offline' | 'provider_once';
    }
  | { status: 'unavailable'; message: string };

const scenarioOptions: ReadonlyArray<{
  value: PersonnelContractExtractionScenario;
  label: string;
}> = [
  { value: 'complete', label: 'Résultat complet' },
  { value: 'partial', label: 'Résultat partiel' },
  { value: 'no_result', label: 'Aucun champ détecté' },
  { value: 'unsupported', label: 'PDF image non pris en charge' },
  { value: 'failure', label: 'Service indisponible' },
  { value: 'timeout', label: 'Délai dépassé' },
];

export function ContractExtractionPrototype({
  employee,
  document,
  onClose,
  onApplied,
}: {
  employee: PersonnelEmployeeSummary;
  document: PersonnelDocument;
  onClose: () => void;
  onApplied: (message: string) => void;
}) {
  const [scenario, setScenario] =
    useState<PersonnelContractExtractionScenario>('complete');
  const [state, setState] = useState<ExtractionState>({ status: 'idle' });
  const [inputSource, setInputSource] = useState<InputSource>('generated');
  const [storedEligibility, setStoredEligibility] = useState<StoredEligibility>(
    {
      status: 'loading',
      message: 'Vérification du contrat fictif enregistré…',
    },
  );
  const [syntheticPdf, setSyntheticPdf] = useState<File | null>(null);
  const [syntheticAttestation, setSyntheticAttestation] = useState(false);
  const [request, setRequest] =
    useState<PersonnelContractExtractionRequest | null>(null);
  const [choices, setChoices] = useState<ContractExtractionPrototypeChoices>(
    {},
  );
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const syntheticPdfInputRef = useRef<HTMLInputElement>(null);
  const initialVersions = useRef({
    employeeRevision: employee.revision,
    documentId: document.id,
    documentVersion: document.version,
  });

  async function runExtraction(nextScenario = scenario) {
    if (inputSource === 'upload' && !syntheticAttestation) return;
    const nextRequest: PersonnelContractExtractionRequest = {
      requestId: crypto.randomUUID(),
      employeeId: employee.id,
      documentId: document.id,
      documentVersion: document.version,
      employeeRevision: employee.revision,
      scenario: nextScenario,
    };
    setChoices({});
    setApplyError(null);
    setRequest(nextRequest);
    setState({ status: 'loading', message: 'Analyse locale en cours…' });
    try {
      const upload = inputSource === 'generated' ? undefined : new FormData();
      if (upload && inputSource === 'upload' && syntheticPdf) {
        upload.set('syntheticSource', 'synthetic_upload');
        upload.set('syntheticPdf', syntheticPdf);
        upload.set('syntheticAttestation', 'fictional-only');
      }
      if (upload && inputSource === 'stored') {
        upload.set('syntheticSource', 'stored_synthetic_document');
      }
      const response = await startContractExtractionAction(nextRequest, upload);
      setState(
        response.status === 'success'
          ? { status: 'ready', result: response.result }
          : { status: 'error', message: response.message },
      );
    } catch {
      setState({
        status: 'error',
        message: 'L’analyse locale est indisponible. Réessayez.',
      });
    }
  }

  useEffect(() => {
    let active = true;
    setStoredEligibility({
      status: 'loading',
      message: 'Vérification du contrat fictif enregistré…',
    });
    void loadStoredSyntheticContractEligibilityAction(
      employee.id,
      document.id,
      document.version,
    )
      .then((result) => {
        if (!active) return;
        setStoredEligibility(
          result.status === 'eligible'
            ? {
                status: 'eligible',
                mode: result.mode,
                message:
                  result.mode === 'provider_once'
                    ? 'Ce contrat fictif est autorisé pour un seul appel OpenAI Luna/v4.'
                    : 'Ce contrat correspond au fixture fictif YUTA autorisé.',
              }
            : result,
        );
      })
      .catch(() => {
        if (active) {
          setStoredEligibility({
            status: 'unavailable',
            message:
              'Le contrat fictif enregistré ne peut pas être vérifié actuellement.',
          });
        }
      });
    return () => {
      active = false;
    };
  }, [document.id, document.version, employee.id]);

  useEffect(() => {
    if (
      inputSource === 'stored' &&
      storedEligibility.status === 'unavailable'
    ) {
      setInputSource('generated');
      setState({ status: 'idle' });
    }
  }, [inputSource, storedEligibility.status]);

  useEffect(() => {
    const initial = initialVersions.current;
    if (
      employee.revision === initial.employeeRevision &&
      document.id === initial.documentId &&
      document.version === initial.documentVersion
    ) {
      return;
    }
    setRequest(null);
    setChoices({});
    setApplyError(null);
    setState({
      status: 'error',
      message:
        'Le dossier ou le contrat a changé. Relancez l’analyse sur la version actuelle.',
    });
  }, [document.id, document.version, employee.revision]);

  const selectedSuggestions = useMemo(() => {
    if (state.status !== 'ready') return [];
    return state.result.suggestions.filter(
      (suggestion) =>
        isApplyCapable(suggestion) && choices[suggestion.field] === 'use',
    );
  }, [choices, state]);

  async function applySelectedSuggestions() {
    if (!request || selectedSuggestions.length === 0) return;
    setIsApplying(true);
    setApplyError(null);
    try {
      const response = await applyContractExtractionAction({
        idempotencyKey: crypto.randomUUID(),
        request,
        selectedSuggestions: selectedSuggestions.map((suggestion) => ({
          field: suggestion.field,
          candidateValue: suggestion.candidateValue,
        })),
      });
      if (response.status === 'success') {
        onApplied(response.message);
      } else {
        if (response.status === 'conflict') {
          setRequest(null);
          setChoices({});
          setApplyError(null);
          setState({ status: 'error', message: response.message });
        } else {
          setApplyError(response.message);
        }
      }
    } catch {
      setApplyError('Impossible d’enregistrer les suggestions. Réessayez.');
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <section
      className="mt-4 rounded-xl border border-border-default bg-surface-muted p-4 sm:p-5"
      aria-labelledby="contract-extraction-prototype-title"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4
              id="contract-extraction-prototype-title"
              className="text-base font-bold"
            >
              Suggestions à vérifier
            </h4>
            <Badge tone="info" size="sm">
              {inputSource === 'stored'
                ? storedEligibility.status === 'eligible' &&
                  storedEligibility.mode === 'provider_once'
                  ? 'QA OpenAI — contrat fictif enregistré'
                  : 'Local — contrat fictif enregistré'
                : inputSource === 'upload'
                  ? 'Local — PDF fictif sélectionné'
                  : 'Local — PDF synthétique généré'}
            </Badge>
            <StateBadge state={state} />
          </div>
          <p className="mt-1 text-sm text-secondary">
            Rien ne sera enregistré sans votre confirmation.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="min-h-11 w-full sm:min-h-9 sm:w-auto"
        >
          <X className="h-4 w-4" aria-hidden />
          Fermer l’analyse
        </Button>
      </div>

      <Alert
        tone="info"
        className="mt-4"
        icon={<Info className="h-5 w-5" aria-hidden />}
      >
        <AlertTitle>Test local avec données fictives</AlertTitle>
        <AlertDescription>
          {inputSource === 'stored'
            ? storedEligibility.status === 'eligible' &&
              storedEligibility.mode === 'provider_once'
              ? 'Le serveur vérifiera ce PDF entièrement fictif, puis l’enverra une seule fois à OpenAI avec Luna/v4 pour ce QA. Aucune valeur ne sera appliquée automatiquement.'
              : 'Le contrat fictif enregistré est vérifié par le serveur puis traité uniquement par la simulation hors ligne. Aucun appel externe n’est autorisé dans cette phase.'
            : inputSource === 'upload'
              ? 'Le PDF fictif choisi sera transmis au service d’analyse configuré uniquement pour cette requête. Il n’est pas enregistré dans les documents YUTA.'
              : 'Le contrat signé affiché n’est pas lu ni transmis. Le serveur génère un PDF synthétique indépendant pour tester ce parcours local.'}
        </AlertDescription>
      </Alert>

      <div className="mt-4 rounded-xl border border-border-default bg-surface p-4">
        <fieldset>
          <legend className="text-sm font-semibold">
            Source du test local
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant={inputSource === 'generated' ? 'secondary' : 'outline'}
              aria-pressed={inputSource === 'generated'}
              disabled={state.status === 'loading' || isApplying}
              onClick={() => {
                setInputSource('generated');
                setScenario('complete');
                setRequest(null);
                setChoices({});
                setApplyError(null);
                setState({ status: 'idle' });
              }}
            >
              PDF généré par YUTA
            </Button>
            <Button
              type="button"
              variant={inputSource === 'stored' ? 'secondary' : 'outline'}
              aria-pressed={inputSource === 'stored'}
              disabled={
                state.status === 'loading' ||
                isApplying ||
                storedEligibility.status !== 'eligible'
              }
              onClick={() => {
                setInputSource('stored');
                setSyntheticPdf(null);
                setSyntheticAttestation(false);
                setScenario('complete');
                setRequest(null);
                setChoices({});
                setApplyError(null);
                setState({ status: 'idle' });
                if (syntheticPdfInputRef.current) {
                  syntheticPdfInputRef.current.value = '';
                }
              }}
            >
              Contrat fictif enregistré
            </Button>
          </div>
          <p className="mt-2 text-xs text-secondary" role="status">
            {storedEligibility.message}
          </p>
        </fieldset>

        <div className="my-4 border-t border-border-default" />
        <label
          htmlFor={`synthetic-contract-${document.id}`}
          className="text-sm font-semibold"
        >
          PDF fictif à tester (facultatif)
        </label>
        <p
          id={`synthetic-contract-help-${document.id}`}
          className="mt-1 text-xs text-secondary"
        >
          PDF uniquement · 750 Ko maximum · aucune donnée réelle. Sans fichier,
          YUTA utilise son PDF synthétique généré.
        </p>
        <div className="relative mt-3 flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-lg border border-border-default bg-surface px-3 py-2 focus-within:ring-2 focus-within:ring-action-primary focus-within:ring-offset-2">
          <input
            ref={syntheticPdfInputRef}
            id={`synthetic-contract-${document.id}`}
            type="file"
            accept="application/pdf,.pdf"
            disabled={state.status === 'loading' || isApplying}
            aria-describedby={`synthetic-contract-help-${document.id}`}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0] ?? null;
              setSyntheticPdf(file);
              setInputSource(file ? 'upload' : 'generated');
              setSyntheticAttestation(false);
              setScenario('complete');
              setRequest(null);
              setChoices({});
              setApplyError(null);
              setState({ status: 'idle' });
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
          <span className="shrink-0 rounded-md bg-action-primary px-3 py-2 text-sm font-semibold text-on-action">
            Choisir un PDF fictif
          </span>
          <span
            className="min-w-0 truncate text-sm text-secondary"
            aria-live="polite"
          >
            {syntheticPdf?.name ?? 'Aucun fichier sélectionné'}
          </span>
        </div>
        {syntheticPdf && (
          <>
            <label className="mt-3 flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-border-default bg-surface-muted px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={syntheticAttestation}
                disabled={state.status === 'loading' || isApplying}
                onChange={(event) =>
                  setSyntheticAttestation(event.currentTarget.checked)
                }
                className="mt-1 h-4 w-4 shrink-0 accent-current"
              />
              <span>
                Je confirme que ce PDF est entièrement fictif et ne contient
                aucune donnée d’un salarié réel.
              </span>
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={state.status === 'loading' || isApplying}
              onClick={() => {
                setSyntheticPdf(null);
                setInputSource('generated');
                setSyntheticAttestation(false);
                setRequest(null);
                setChoices({});
                setApplyError(null);
                setState({ status: 'idle' });
                if (syntheticPdfInputRef.current) {
                  syntheticPdfInputRef.current.value = '';
                }
              }}
              className="mt-2"
            >
              Utiliser le PDF généré
            </Button>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-semibold">
          Scénario local
          <select
            value={scenario}
            disabled={
              state.status === 'loading' ||
              isApplying ||
              inputSource !== 'generated'
            }
            onChange={(event) => {
              setScenario(
                event.currentTarget
                  .value as PersonnelContractExtractionScenario,
              );
              setRequest(null);
              setChoices({});
              setApplyError(null);
              setState({ status: 'idle' });
            }}
            className="mt-1 min-h-11 w-full rounded-lg border border-border-default bg-surface px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {scenarioOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <Button
          type="button"
          variant="secondary"
          disabled={
            state.status === 'loading' ||
            isApplying ||
            Boolean(syntheticPdf && !syntheticAttestation)
          }
          onClick={() => void runExtraction()}
          className="w-full sm:w-auto"
        >
          {state.status === 'idle' ? (
            <Sparkles className="h-4 w-4" aria-hidden />
          ) : (
            <RotateCcw className="h-4 w-4" aria-hidden />
          )}
          {state.status === 'idle'
            ? inputSource === 'stored'
              ? 'Analyser le contrat fictif enregistré'
              : inputSource === 'upload'
                ? 'Analyser ce PDF fictif'
                : 'Analyser le PDF généré'
            : 'Relancer ce scénario'}
        </Button>
      </div>

      {state.status === 'idle' && (
        <p className="mt-3 text-sm text-secondary" role="status">
          {inputSource === 'stored' &&
          storedEligibility.status === 'eligible' &&
          storedEligibility.mode === 'provider_once'
            ? 'Un seul appel OpenAI partira après votre clic sur le bouton d’analyse.'
            : 'Aucune requête externe ne part avant votre clic sur le bouton d’analyse.'}
        </p>
      )}

      {state.status === 'loading' && (
        <p
          className="mt-5 flex items-center gap-2 text-sm text-secondary"
          role="status"
        >
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          {state.message}
        </p>
      )}

      {state.status === 'error' && (
        <Alert tone="danger" className="mt-4">
          <AlertTitle>Analyse locale interrompue</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
          <div className="mt-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => void runExtraction()}
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Réessayer
            </Button>
          </div>
        </Alert>
      )}

      {state.status === 'ready' && state.result.status === 'no_result' && (
        <Alert tone="info" className="mt-4">
          <AlertTitle>Aucun champ pris en charge détecté</AlertTitle>
          <AlertDescription>
            Aucune valeur n’est proposée. Le contrat reste consultable et
            téléchargeable normalement.
          </AlertDescription>
        </Alert>
      )}

      {state.status === 'ready' && state.result.status === 'unsupported' && (
        <Alert tone="warning" className="mt-4">
          <AlertTitle>PDF image non pris en charge</AlertTitle>
          <AlertDescription>
            Ce scénario local ne peut pas produire de suggestions. Aucun champ
            du dossier n’est modifié.
          </AlertDescription>
        </Alert>
      )}

      {state.status === 'ready' && state.result.suggestions.length > 0 && (
        <div className="mt-4 grid gap-3">
          {state.result.suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.field}
              suggestion={suggestion}
              employee={employee}
              choice={choices[suggestion.field]}
              onChoice={(value) =>
                setChoices((current) => ({
                  ...current,
                  [suggestion.field]: value,
                }))
              }
            />
          ))}
        </div>
      )}

      {state.status === 'ready' && state.result.suggestions.length > 0 && (
        <div className="mt-4 rounded-xl border border-border-default bg-surface p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h5 className="font-bold">Changements sélectionnés</h5>
              {selectedSuggestions.length === 0 ? (
                <p className="mt-1 text-sm text-secondary">
                  Sélectionnez au moins un champ applicable.
                </p>
              ) : (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-secondary">
                  {selectedSuggestions.map((suggestion) => (
                    <li key={suggestion.field}>
                      {fieldLabel(suggestion.field)} :{' '}
                      {candidateLabel(suggestion)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button
              type="button"
              disabled={selectedSuggestions.length === 0 || isApplying}
              onClick={() => void applySelectedSuggestions()}
              className="w-full lg:w-auto"
            >
              {isApplying ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Sparkles className="h-4 w-4" aria-hidden />
              )}
              {isApplying
                ? 'Enregistrement…'
                : 'Appliquer les champs sélectionnés'}
            </Button>
          </div>
          {applyError && (
            <Alert tone="danger" className="mt-3">
              <AlertDescription>{applyError}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </section>
  );
}

function SuggestionCard({
  suggestion,
  employee,
  choice,
  onChoice,
}: {
  suggestion: PersonnelContractExtractionSuggestion;
  employee: PersonnelEmployeeSummary;
  choice: 'keep' | 'use' | undefined;
  onChoice: (choice: 'keep' | 'use') => void;
}) {
  const applicable = isApplyCapable(suggestion);
  return (
    <article className="rounded-xl border border-border-default bg-surface p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.65fr)] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h5 className="font-bold">{fieldLabel(suggestion.field)}</h5>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge tone={confidenceTone(suggestion.confidence)} size="sm">
                Confiance{' '}
                {getContractExtractionConfidenceLabel(
                  suggestion.confidence,
                ).toLowerCase()}
              </Badge>
              <span className="text-secondary">
                Page {suggestion.sourcePage}
              </span>
            </div>
          </div>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Valeur actuelle
              </dt>
              <dd className="mt-1 break-words text-sm font-semibold">
                {currentValueLabel(suggestion.field, employee)}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Suggestion synthétique
              </dt>
              <dd className="mt-1 break-words text-sm font-semibold text-action-primary">
                {candidateLabel(suggestion)}
              </dd>
            </div>
          </dl>
          <details className="mt-3 text-sm">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
              <ChevronDown className="h-4 w-4" aria-hidden />
              Voir l’extrait synthétique
            </summary>
            <blockquote className="mt-2 border-l-2 border-border-strong pl-3 text-secondary">
              « {suggestion.excerpt} »
            </blockquote>
          </details>
          {!applicable && (
            <Alert tone="warning" className="mt-3">
              <AlertDescription>
                Ce champ reste en lecture seule : un CDD exige aussi une date de
                fin et un motif contrôlé.
              </AlertDescription>
            </Alert>
          )}
        </div>
        {applicable ? (
          <RadioGroup
            aria-label={`Décision pour ${fieldLabel(suggestion.field)}`}
            value={choice ?? ''}
            onValueChange={(value) => onChoice(value as 'keep' | 'use')}
            className="gap-2"
          >
            <ChoiceRow
              id={`${suggestion.field}-keep`}
              value="keep"
              label="Conserver la valeur actuelle"
            />
            <ChoiceRow
              id={`${suggestion.field}-use`}
              value="use"
              label="Utiliser la suggestion"
            />
          </RadioGroup>
        ) : (
          <Badge tone="warning" className="w-fit">
            Vérification uniquement
          </Badge>
        )}
      </div>
    </article>
  );
}

function ChoiceRow({
  id,
  value,
  label,
}: {
  id: string;
  value: 'keep' | 'use';
  label: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border-default bg-surface px-3 py-2 text-sm font-semibold focus-within:ring-2 focus-within:ring-focus-ring"
    >
      <RadioGroupItem id={id} value={value} />
      <span>{label}</span>
    </label>
  );
}

function StateBadge({ state }: { state: ExtractionState }) {
  if (state.status === 'idle') return <Badge tone="neutral">À lancer</Badge>;
  if (state.status === 'loading') return <Badge tone="neutral">Analyse</Badge>;
  if (state.status === 'error') return <Badge tone="danger">Échec</Badge>;
  if (state.result.status === 'partial')
    return <Badge tone="warning">Partiel</Badge>;
  if (state.result.status === 'complete')
    return <Badge tone="success">Prêt</Badge>;
  return <Badge tone="neutral">Sans suggestion</Badge>;
}

function isApplyCapable(
  suggestion: PersonnelContractExtractionSuggestion,
): suggestion is Extract<
  PersonnelContractExtractionSuggestion,
  { field: 'position' | 'contractWeeklyMinutes' }
> {
  return (
    (suggestion.field === 'position' ||
      suggestion.field === 'contractWeeklyMinutes') &&
    !suggestion.issueCodes.includes('blocked_by_dependency')
  );
}

function fieldLabel(field: PersonnelContractExtractionSuggestion['field']) {
  return {
    position: 'Poste',
    employmentTermType: 'Type de contrat',
    contractWeeklyMinutes: 'Durée hebdomadaire',
  }[field];
}

function currentValueLabel(
  field: PersonnelContractExtractionSuggestion['field'],
  employee: PersonnelEmployeeSummary,
) {
  if (field === 'position') return employee.position;
  if (field === 'employmentTermType')
    return employee.employmentTermType === 'indefinite' ? 'CDI' : 'CDD';
  return employee.contractWeeklyMinutes
    ? formatWeeklyMinutes(employee.contractWeeklyMinutes)
    : 'Non renseignée';
}

function candidateLabel(suggestion: PersonnelContractExtractionSuggestion) {
  if (suggestion.field === 'employmentTermType')
    return suggestion.candidateValue === 'indefinite' ? 'CDI' : 'CDD';
  if (suggestion.field === 'contractWeeklyMinutes')
    return formatWeeklyMinutes(suggestion.candidateValue);
  return suggestion.candidateValue;
}

function formatWeeklyMinutes(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes === 0
    ? `${hours} h par semaine`
    : `${hours} h ${String(minutes).padStart(2, '0')} par semaine`;
}

function confidenceTone(
  confidence: PersonnelContractExtractionSuggestion['confidence'],
): 'success' | 'warning' | 'neutral' {
  return confidence === 'high'
    ? 'success'
    : confidence === 'medium'
      ? 'warning'
      : 'neutral';
}
