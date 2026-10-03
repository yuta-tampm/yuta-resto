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
  FormField,
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
  Plus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, useTransition } from 'react';
import { loadPersonnelRegisterPageAction } from '../actions';
import { RegisterDialog } from './personnel-register-dialog';
import { RegisterEntryRow } from './personnel-register-entries';

export function PersonnelRegisterPage({
  data,
  candidates,
  locale,
  businessDate,
}: {
  data: RegisterPageData;
  candidates: PersonnelRegisterCandidate[];
  locale: string;
  businessDate: string;
}) {
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
          businessDate={businessDate}
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
