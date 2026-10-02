'use client';

import type {
  PersonnelRegisterCandidate,
  PersonnelRegisterEntry,
  PersonnelRegisterPage as RegisterPageData,
} from '@yuta/contracts/personnel';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yuta/ui';
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  FileDown,
  LockKeyhole,
  Pencil,
  Plus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useFormStatus } from 'react-dom';
import {
  correctPersonnelRegisterAction,
  inscribePersonnelRegisterAction,
  loadPersonnelRegisterPageAction,
  type PersonnelRegisterActionState,
} from '../actions';

const initialState: PersonnelRegisterActionState = {
  status: 'idle',
  message: null,
  fieldErrors: {},
};

export function PersonnelRegisterPage({
  data,
  candidates,
  locale,
}: {
  data: RegisterPageData;
  candidates: PersonnelRegisterCandidate[];
  locale: string;
}) {
  const router = useRouter();
  const [displayData, setDisplayData] = useState(data);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [previousCursors, setPreviousCursors] = useState<(string | null)[]>([]);
  const [paginationMessage, setPaginationMessage] = useState<string | null>(
    null,
  );
  const [isPaginationPending, startPaginationTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [candidate, setCandidate] = useState<PersonnelRegisterCandidate | null>(
    null,
  );
  const [correction, setCorrection] = useState<PersonnelRegisterEntry | null>(
    null,
  );
  const dialogOriginRef = useRef<HTMLButtonElement | null>(null);

  function restoreDialogOrigin() {
    const origin = dialogOriginRef.current;
    dialogOriginRef.current = null;
    requestAnimationFrame(() => {
      if (origin?.isConnected) origin.focus();
    });
  }

  function closeCandidateDialog(open: boolean) {
    if (open) return;
    setCandidate(null);
    restoreDialogOrigin();
  }

  function closeCorrectionDialog(open: boolean) {
    if (open) return;
    setCorrection(null);
    restoreDialogOrigin();
  }

  useEffect(() => {
    setDisplayData(data);
    setCurrentCursor(null);
    setPreviousCursors([]);
    setPaginationMessage(null);
  }, [data]);

  function loadPage(nextCursor: string | null, direction: 'next' | 'previous') {
    setPaginationMessage(null);
    startPaginationTransition(async () => {
      const result = await loadPersonnelRegisterPageAction(nextCursor);
      if (result.status !== 'success') {
        setPaginationMessage(result.message);
        return;
      }
      setDisplayData(result.data);
      if (direction === 'next') {
        setPreviousCursors((items) => [...items, currentCursor]);
      } else {
        setPreviousCursors((items) => items.slice(0, -1));
      }
      setCurrentCursor(nextCursor);
    });
  }

  async function exportPdf() {
    setIsExporting(true);
    setExportMessage(null);
    try {
      const response = await fetch('/api/personnel/register/export', {
        method: 'GET',
        cache: 'no-store',
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        setExportMessage(
          payload?.message ?? 'Le PDF est indisponible. Réessayez.',
        );
        return;
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = 'registre-personnel.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportMessage('Le PDF est indisponible. Réessayez.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-5">
      <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-3 mb-2">
            <Link href="/equipe/salaries">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Salariés
            </Link>
          </Button>
          <h1 className="text-3xl font-black tracking-tight">
            Registre du personnel
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Données structurées confirmées, dans leur ordre d’inscription pour
            l’établissement actif.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {displayData.readiness === 'ready' ? (
            <Button
              variant="secondary"
              onClick={exportPdf}
              disabled={isExporting}
            >
              <FileDown className="h-4 w-4" aria-hidden />
              {isExporting ? 'Préparation…' : 'Exporter en PDF'}
            </Button>
          ) : (
            <Button variant="secondary" disabled>
              <FileDown className="h-4 w-4" aria-hidden />
              Exporter en PDF
            </Button>
          )}
          <Button
            onClick={(event) => {
              if (!candidates[0]) return;
              dialogOriginRef.current = event.currentTarget;
              setCandidate(candidates[0]);
            }}
            disabled={candidates.length === 0}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Inscrire un salarié
          </Button>
        </div>
      </header>

      {exportMessage && (
        <Alert tone="danger">
          <AlertTitle>Export impossible</AlertTitle>
          <AlertDescription>{exportMessage}</AlertDescription>
        </Alert>
      )}

      <Alert
        tone="warning"
        icon={<LockKeyhole className="h-5 w-5" aria-hidden />}
      >
        <AlertTitle>Phase locale — production verrouillée</AlertTitle>
        <AlertDescription>
          Une inscription est distincte du dossier Salariés et nécessite une
          vérification explicite. Elle ne peut pas être supprimée ou réordonnée.
        </AlertDescription>
      </Alert>

      <div className="grid gap-3 sm:grid-cols-3">
        <Summary
          icon={<Users className="h-5 w-5" aria-hidden />}
          value={displayData.items.length}
          label="inscriptions sur cette page"
        />
        <Summary
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
          value={`Révision ${displayData.snapshotRevision}`}
          label="instantané consulté"
        />
        <Summary
          icon={<CircleAlert className="h-5 w-5" aria-hidden />}
          value={candidates.length}
          label="dossiers à vérifier"
        />
      </div>

      {candidates.length > 0 && (
        <CandidatePicker
          candidates={candidates}
          selectedId={selectedCandidateId}
          onSelectedIdChange={setSelectedCandidateId}
          onOpen={(selected, origin) => {
            dialogOriginRef.current = origin;
            setCandidate(selected);
          }}
        />
      )}

      <section
        aria-labelledby="register-list-title"
        aria-busy={isPaginationPending}
      >
        <Card padding="none" className="overflow-hidden">
          <div className="border-b border-border-default px-5 py-4">
            <h2 id="register-list-title" className="text-lg font-bold">
              Inscriptions
            </h2>
            <p className="mt-1 text-sm text-secondary">
              50 inscriptions maximum par page. Aucun tri ni filtre ne modifie
              l’ordre officiel.
            </p>
          </div>
          {paginationMessage && (
            <Alert tone="warning" className="m-4">
              <AlertTitle>Pagination interrompue</AlertTitle>
              <AlertDescription>{paginationMessage}</AlertDescription>
            </Alert>
          )}
          {displayData.items.length === 0 ? (
            <div className="grid justify-items-center gap-2 px-5 py-14 text-center">
              <Users className="h-8 w-8 text-muted" aria-hidden />
              <h3 className="font-bold">Aucune inscription</h3>
              <p className="max-w-lg text-sm text-secondary">
                Les dossiers Salariés existants ne sont pas ajoutés
                automatiquement. Vérifiez chaque personne avant sa première
                inscription.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-default">
              {displayData.items.map((entry) => (
                <RegisterEntryRow
                  key={entry.id}
                  entry={entry}
                  locale={locale}
                  onCorrect={(origin) => {
                    dialogOriginRef.current = origin;
                    setCorrection(entry);
                  }}
                />
              ))}
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border-default px-5 py-4">
            <Button
              variant="secondary"
              disabled={previousCursors.length === 0 || isPaginationPending}
              onClick={() =>
                loadPage(previousCursors.at(-1) ?? null, 'previous')
              }
            >
              Précédent
            </Button>
            <span className="hidden text-sm text-secondary sm:inline">
              Ordre d’inscription croissant
            </span>
            {displayData.pageInfo.nextCursor ? (
              <Button
                variant="secondary"
                disabled={isPaginationPending}
                onClick={() =>
                  loadPage(displayData.pageInfo.nextCursor!, 'next')
                }
              >
                {isPaginationPending ? 'Chargement…' : 'Suivant'}
              </Button>
            ) : (
              <Button variant="secondary" disabled>
                Suivant
              </Button>
            )}
          </div>
        </Card>
      </section>

      <Card variant="muted">
        <h2 className="font-bold">Stagiaires et service civique</h2>
        <p className="mt-1 text-sm text-secondary">
          Ces catégories restent séparées et indisponibles dans cette phase.
          Elles ne sont pas simulées dans le registre salarié.
        </p>
      </Card>

      {candidate && (
        <RegisterDialog
          mode="inscribe"
          candidate={candidate}
          open
          onOpenChange={closeCandidateDialog}
        />
      )}
      {correction && (
        <RegisterDialog
          mode="correct"
          entry={correction}
          open
          onOpenChange={closeCorrectionDialog}
        />
      )}
    </div>
  );
}

function CandidatePicker({
  candidates,
  selectedId,
  onSelectedIdChange,
  onOpen,
}: {
  candidates: PersonnelRegisterCandidate[];
  selectedId: string;
  onSelectedIdChange(value: string): void;
  onOpen(value: PersonnelRegisterCandidate, origin: HTMLButtonElement): void;
}) {
  const selected = candidates.find((item) => item.employeeId === selectedId);
  return (
    <Card>
      <h2 className="font-bold">Salariés non encore inscrits</h2>
      <p className="mt-1 text-sm text-secondary">
        Choisissez un dossier puis complétez uniquement les mentions du
        registre.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <FormField
          className="min-w-0 flex-1"
          label={<Label htmlFor="register-candidate">Dossier salarié</Label>}
        >
          <Select value={selectedId} onValueChange={onSelectedIdChange}>
            <SelectTrigger id="register-candidate">
              <SelectValue placeholder="Choisir un salarié" />
            </SelectTrigger>
            <SelectContent>
              {candidates.map((item) => (
                <SelectItem key={item.employeeId} value={item.employeeId}>
                  {item.givenNames} {item.familyName} · {item.entryDate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <Button
          disabled={!selected}
          onClick={(event) => selected && onOpen(selected, event.currentTarget)}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Vérifier et inscrire
        </Button>
      </div>
    </Card>
  );
}

function Summary({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <Card className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-muted text-status-success">
        {icon}
      </span>
      <span>
        <strong className="block">{value}</strong>
        <span className="text-sm text-secondary">{label}</span>
      </span>
    </Card>
  );
}

function RegisterEntryRow({
  entry,
  locale,
  onCorrect,
}: {
  entry: PersonnelRegisterEntry;
  locale: string;
  onCorrect(origin: HTMLButtonElement): void;
}) {
  const facts = entry.facts;
  return (
    <article className="grid gap-4 px-5 py-4 xl:grid-cols-[4rem_minmax(12rem,1.2fr)_repeat(3,minmax(9rem,1fr))_auto] xl:items-center">
      <div>
        <span className="text-xs font-bold uppercase text-muted">N°</span>
        <p className="text-lg font-black">{entry.sequence}</p>
      </div>
      <div>
        <p className="font-bold">
          {facts.givenNames} {facts.familyName}
        </p>
        <p className="text-sm text-secondary">
          {facts.nationalityLabel} · né{facts.sex === 'F' ? 'e' : ''} le{' '}
          {formatDate(facts.birthDate, locale)}
        </p>
      </div>
      <Fact label="Emploi" value={facts.position} />
      <Fact label="Qualification" value={facts.qualification} />
      <Fact
        label="Entrée / sortie"
        value={`${formatDate(facts.entryDate, locale)} · ${facts.departureDate ? formatDate(facts.departureDate, locale) : '—'}`}
      />
      <Button
        size="sm"
        variant="secondary"
        onClick={(event) => onCorrect(event.currentTarget)}
      >
        <Pencil className="h-4 w-4" aria-hidden />
        Corriger
      </Button>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

type RegisterDialogProps =
  | {
      mode: 'inscribe';
      candidate: PersonnelRegisterCandidate;
      open: boolean;
      onOpenChange(open: boolean): void;
    }
  | {
      mode: 'correct';
      entry: PersonnelRegisterEntry;
      open: boolean;
      onOpenChange(open: boolean): void;
    };

function RegisterDialog(props: RegisterDialogProps) {
  const router = useRouter();
  const action =
    props.mode === 'inscribe'
      ? inscribePersonnelRegisterAction
      : correctPersonnelRegisterAction;
  const [state, formAction] = useActionState(action, initialState);
  const source =
    props.mode === 'inscribe'
      ? candidateFacts(props.candidate)
      : props.entry.facts;
  const [operationId, setOperationId] = useState('');
  const [protectedRequired, setProtectedRequired] = useState(
    source.protectedAuthorization.required,
  );
  const [workRequired, setWorkRequired] = useState(
    source.workAuthorization.required,
  );
  const [temporaryRequired, setTemporaryRequired] = useState(
    Boolean(source.temporaryWorkCompany),
  );
  const [groupRequired, setGroupRequired] = useState(
    Boolean(source.employerGroup),
  );
  useEffect(() => {
    if (!operationId) setOperationId(crypto.randomUUID());
  }, [operationId]);
  useEffect(() => {
    if (state.status === 'success') {
      router.refresh();
      props.onOpenChange(false);
    }
  }, [props, router, state.status]);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {props.mode === 'inscribe'
              ? 'Vérifier et inscrire le salarié'
              : `Corriger l’inscription n° ${props.entry.sequence}`}
          </DialogTitle>
          <DialogDescription>
            {props.mode === 'inscribe'
              ? 'La première inscription reçoit un numéro définitif. Vérifiez les mentions avant de confirmer.'
              : 'La valeur précédente reste conservée. Indiquez la date d’effet et la raison.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="mt-5 grid gap-6">
          <input type="hidden" name="operationId" value={operationId} />
          {props.mode === 'inscribe' ? (
            <input
              type="hidden"
              name="employeeId"
              value={props.candidate.employeeId}
            />
          ) : (
            <>
              <input type="hidden" name="entryId" value={props.entry.id} />
              <input
                type="hidden"
                name="expectedRevision"
                value={props.entry.revision}
              />
            </>
          )}
          {props.mode === 'inscribe' ? (
            <>
              <BaseFacts facts={source} />
              <Card variant="muted">
                <p className="font-bold">
                  {source.givenNames} {source.familyName}
                </p>
                <p className="mt-1 text-sm text-secondary">
                  {source.position} · {source.qualification} · entrée le{' '}
                  {source.entryDate}
                </p>
              </Card>
            </>
          ) : (
            <EmploymentCorrectionFields facts={source} />
          )}
          {state.message && (
            <Alert tone={state.status === 'success' ? 'success' : 'danger'}>
              <AlertTitle>
                {state.status === 'conflict'
                  ? 'Actualisation requise'
                  : 'Enregistrement'}
              </AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <section className="grid gap-4">
            <h3 className="font-bold">Identité légale</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                name="nationalityCode"
                label="Code pays de nationalité"
                defaultValue={source.nationalityCode}
                placeholder="FR"
                maxLength={2}
              />
              <TextField
                name="nationalityLabel"
                label="Nationalité affichée"
                defaultValue={source.nationalityLabel}
                placeholder="Française"
              />
              <TextField
                name="birthDate"
                label="Date de naissance"
                type="date"
                defaultValue={source.birthDate}
              />
              <SelectField
                name="sex"
                label="Sexe inscrit"
                defaultValue={source.sex}
                options={[
                  ['F', 'F'],
                  ['M', 'M'],
                ]}
              />
            </div>
          </section>
          <section className="grid gap-4">
            <h3 className="font-bold">Mentions conditionnelles</h3>
            <Toggle
              name="protectedAuthorizationRequired"
              checked={protectedRequired}
              onCheckedChange={setProtectedRequired}
              label="Autorisation administrative requise"
            />
            {protectedRequired && (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  name="protectedAuthorizationDate"
                  label="Date d’autorisation"
                  type="date"
                  defaultValue={
                    source.protectedAuthorization.authorizationDate ?? ''
                  }
                  required={false}
                />
                <TextField
                  name="protectedAuthorizationRequestDate"
                  label="Date de demande"
                  type="date"
                  defaultValue={source.protectedAuthorization.requestDate ?? ''}
                  required={false}
                />
              </div>
            )}
            <Toggle
              name="workAuthorizationRequired"
              checked={workRequired}
              onCheckedChange={setWorkRequired}
              label="Titre autorisant le travail requis"
            />
            {workRequired && (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  name="workAuthorizationTitleType"
                  label="Type de titre"
                  defaultValue={source.workAuthorization.titleType ?? ''}
                />
                <TextField
                  name="workAuthorizationOrderNumber"
                  label="Numéro d’ordre"
                  defaultValue={source.workAuthorization.orderNumber ?? ''}
                />
              </div>
            )}
            <SelectField
              name="specialContract"
              label="Mention particulière"
              defaultValue={source.specialContract}
              options={[
                ['none', 'Aucune'],
                ['apprenticeship', 'Apprenti'],
                ['professionalization', 'Contrat de professionnalisation'],
              ]}
            />
            <ThirdPartyFields
              prefix="temporaryWorkCompany"
              title="Entreprise de travail temporaire"
              checked={temporaryRequired}
              onCheckedChange={setTemporaryRequired}
              value={source.temporaryWorkCompany}
            />
            <ThirdPartyFields
              prefix="employerGroup"
              title="Groupement d’employeurs"
              checked={groupRequired}
              onCheckedChange={setGroupRequired}
              value={source.employerGroup}
            />
          </section>
          {props.mode === 'correct' && (
            <section className="grid gap-4">
              <h3 className="font-bold">Justification de la correction</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  name="effectiveDate"
                  label="Date d’effet"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                />
                <TextField
                  name="reason"
                  label="Raison"
                  defaultValue=""
                  placeholder="Correction vérifiée sur justificatif"
                />
              </div>
            </section>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => props.onOpenChange(false)}
            >
              Annuler
            </Button>
            <SubmitButton
              label={
                props.mode === 'inscribe'
                  ? 'Confirmer l’inscription'
                  : 'Enregistrer la correction'
              }
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BaseFacts({ facts }: { facts: PersonnelRegisterEntry['facts'] }) {
  return (
    <>
      {Object.entries({
        givenNames: facts.givenNames,
        familyName: facts.familyName,
        position: facts.position,
        qualification: facts.qualification,
        entryDate: facts.entryDate,
        departureDate: facts.departureDate ?? '',
        employmentTermType: facts.employmentTermType,
        workTimeCategory: facts.workTimeCategory,
      }).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
    </>
  );
}

function EmploymentCorrectionFields({
  facts,
}: {
  facts: PersonnelRegisterEntry['facts'];
}) {
  return (
    <section className="grid gap-4">
      <h3 className="font-bold">Identité et relation de travail</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          name="givenNames"
          label="Prénoms"
          defaultValue={facts.givenNames}
        />
        <TextField
          name="familyName"
          label="Nom"
          defaultValue={facts.familyName}
        />
        <TextField
          name="position"
          label="Emploi"
          defaultValue={facts.position}
        />
        <TextField
          name="qualification"
          label="Qualification"
          defaultValue={facts.qualification}
        />
        <TextField
          name="entryDate"
          label="Date d’entrée"
          type="date"
          defaultValue={facts.entryDate}
        />
        <TextField
          name="departureDate"
          label="Date de sortie"
          type="date"
          defaultValue={facts.departureDate ?? ''}
          required={false}
        />
        <SelectField
          name="employmentTermType"
          label="Type de contrat"
          defaultValue={facts.employmentTermType}
          options={[
            ['indefinite', 'Contrat à durée indéterminée'],
            ['fixed_term', 'Contrat à durée déterminée'],
          ]}
        />
        <SelectField
          name="workTimeCategory"
          label="Temps de travail"
          defaultValue={facts.workTimeCategory}
          options={[
            ['full_time', 'Temps plein'],
            ['part_time', 'Temps partiel'],
          ]}
        />
      </div>
    </section>
  );
}

function candidateFacts(
  candidate: PersonnelRegisterCandidate,
): PersonnelRegisterEntry['facts'] {
  return {
    ...candidate,
    nationalityCode: 'FR',
    nationalityLabel: '',
    birthDate: '',
    sex: 'F',
    protectedAuthorization: {
      required: false,
      authorizationDate: null,
      requestDate: null,
    },
    workAuthorization: { required: false, titleType: null, orderNumber: null },
    temporaryWorkCompany: null,
    employerGroup: null,
    specialContract: 'none',
  };
}
function TextField({
  name,
  label,
  defaultValue,
  type = 'text',
  placeholder,
  maxLength,
  required = true,
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <FormField label={<Label htmlFor={`register-${name}`}>{label}</Label>}>
      <Input
        id={`register-${name}`}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
      />
    </FormField>
  );
}
function SelectField({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: [string, string][];
}) {
  return (
    <FormField label={<Label htmlFor={`register-${name}`}>{label}</Label>}>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger id={`register-${name}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(([value, text]) => (
            <SelectItem key={value} value={value}>
              {text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}
function Toggle({
  name,
  label,
  checked,
  onCheckedChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onCheckedChange(value: boolean): void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-border-default p-3 text-sm font-semibold">
      <Checkbox
        name={name}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <span>{label}</span>
    </label>
  );
}
function ThirdPartyFields({
  prefix,
  title,
  checked,
  onCheckedChange,
  value,
}: {
  prefix: string;
  title: string;
  checked: boolean;
  onCheckedChange(value: boolean): void;
  value: PersonnelRegisterEntry['facts']['temporaryWorkCompany'];
}) {
  return (
    <div className="grid gap-3">
      <Toggle
        name={`${prefix}Required`}
        checked={checked}
        onCheckedChange={onCheckedChange}
        label={`${title} concerné`}
      />
      {checked && (
        <div className="grid gap-4 rounded-lg border border-border-default p-4 sm:grid-cols-2">
          <TextField
            name={`${prefix}LegalName`}
            label="Raison sociale"
            defaultValue={value?.legalName ?? ''}
          />
          <TextField
            name={`${prefix}AddressLine1`}
            label="Adresse"
            defaultValue={value?.address.line1 ?? ''}
          />
          <TextField
            name={`${prefix}AddressLine2`}
            label="Complément"
            defaultValue={value?.address.line2 ?? ''}
            required={false}
          />
          <TextField
            name={`${prefix}PostalCode`}
            label="Code postal"
            defaultValue={value?.address.postalCode ?? ''}
          />
          <TextField
            name={`${prefix}City`}
            label="Ville"
            defaultValue={value?.address.city ?? ''}
          />
          <TextField
            name={`${prefix}CountryCode`}
            label="Code pays"
            defaultValue={value?.address.countryCode ?? 'FR'}
            maxLength={2}
          />
        </div>
      )}
    </div>
  );
}
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Enregistrement…' : label}
    </Button>
  );
}
function formatDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
