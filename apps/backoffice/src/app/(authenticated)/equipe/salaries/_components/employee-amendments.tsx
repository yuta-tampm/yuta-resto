'use client';

import type {
  PersonnelContractAmendment,
  PersonnelContractAmendmentList,
} from '@yuta/contracts/personnel';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  EmptyState,
} from '@yuta/ui';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileCheck2,
  FileText,
  LoaderCircle,
  Plus,
  RefreshCw,
  RotateCcw,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState, useTransition } from 'react';
import {
  loadEmployeeAmendmentsAction,
  saveEmployeeAmendmentAction,
  type SaveEmployeeAmendmentActionState,
} from '../actions';
import {
  formatDocumentSize,
  getDocumentFileSelectionLabel,
} from '../employee-documents-model';
import { formatEmployeeAmendmentDate } from '../_lib/employee-amendments';

const initialSaveState: SaveEmployeeAmendmentActionState = {
  status: 'idle',
  message: null,
  fieldErrors: {},
  amendment: null,
  values: { effectiveDate: '', reference: '' },
};

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; page: PersonnelContractAmendmentList };

type FormMode =
  | { type: 'create' }
  | { type: 'replace'; amendment: PersonnelContractAmendment };

export function EmployeeAmendments({
  employeeId,
  locale,
}: {
  employeeId: string;
  locale: string;
}) {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [cursor, setCursor] = useState<string | undefined>();
  const [cursorHistory, setCursorHistory] = useState<Array<string | undefined>>(
    [],
  );
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, startLoading] = useTransition();
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState(() =>
    crypto.randomUUID(),
  );
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    startLoading(async () => {
      const result = await loadEmployeeAmendmentsAction(employeeId, cursor);
      if (!active) return;
      setLoadState(
        result.status === 'success'
          ? { status: 'ready', page: result.amendments }
          : { status: 'error', message: result.message },
      );
    });
    return () => {
      active = false;
    };
  }, [cursor, employeeId, reloadKey]);

  function openForm(mode: FormMode) {
    setFormMode(mode);
    setSuccessMessage(null);
    setSelectedFilename(null);
    setIdempotencyKey(crypto.randomUUID());
  }

  const page = loadState.status === 'ready' ? loadState.page : null;

  return (
    <section
      aria-labelledby="employee-amendments-title"
      className="mt-6 border-t border-border-default pt-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 id="employee-amendments-title" className="text-lg font-bold">
            Avenants signés
          </h4>
          <p className="mt-1 text-sm text-secondary">
            Chaque avenant est distinct du contrat de travail et des autres
            avenants.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => openForm({ type: 'create' })}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Ajouter un avenant
        </Button>
      </div>

      <Alert className="mt-4" tone="info">
        <AlertTitle>Accès protégé</AlertTitle>
        <AlertDescription>
          PDF uniquement · 10 Mo maximum. Le fichier est contrôlé avant d’être
          disponible. « Remplacer » corrige uniquement le scan sélectionné.
        </AlertDescription>
      </Alert>

      {successMessage && (
        <Alert tone="success" className="mt-4">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {formMode && (
        <AmendmentForm
          employeeId={employeeId}
          mode={formMode}
          idempotencyKey={idempotencyKey}
          selectedFilename={selectedFilename}
          locale={locale}
          onFilenameChange={setSelectedFilename}
          onCancel={() => {
            setFormMode(null);
            setSelectedFilename(null);
          }}
          onSaved={(message) => {
            setSuccessMessage(message);
            setFormMode(null);
            setSelectedFilename(null);
            setCursor(undefined);
            setCursorHistory([]);
            setReloadKey((value) => value + 1);
          }}
        />
      )}

      {(loadState.status === 'loading' || isLoading) && (
        <p
          className="mt-5 flex items-center gap-2 text-sm text-secondary"
          role="status"
        >
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          Chargement des avenants…
        </p>
      )}

      {loadState.status === 'error' && !isLoading && (
        <Alert tone="danger" className="mt-5">
          <AlertTitle>Avenants indisponibles</AlertTitle>
          <AlertDescription>{loadState.message}</AlertDescription>
          <div className="mt-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setLoadState({ status: 'loading' });
                setReloadKey((value) => value + 1);
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Réessayer
            </Button>
          </div>
        </Alert>
      )}

      {page && page.items.length === 0 && !isLoading && !formMode && (
        <EmptyState
          className="mt-5 min-h-44 rounded-xl border border-dashed border-border-default"
          icon={<FileText className="h-9 w-9" aria-hidden />}
          title="Aucun avenant signé"
          description="Ajoutez un avenant uniquement lorsqu’un document distinct a été signé."
        />
      )}

      {page && page.items.length > 0 && !isLoading && (
        <div className="mt-4 space-y-3">
          {page.items.map((amendment) => (
            <AmendmentCard
              key={amendment.id}
              amendment={amendment}
              employeeId={employeeId}
              locale={locale}
              onReplace={() => openForm({ type: 'replace', amendment })}
            />
          ))}
        </div>
      )}

      {page && (cursorHistory.length > 0 || page.pageInfo.hasMore) && (
        <nav
          aria-label="Pagination des avenants"
          className="mt-4 flex items-center justify-between gap-3"
        >
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={cursorHistory.length === 0 || isLoading}
            onClick={() => {
              const previous = cursorHistory.at(-1);
              setCursorHistory((history) => history.slice(0, -1));
              setCursor(previous);
              setLoadState({ status: 'loading' });
            }}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Précédent
          </Button>
          <span className="text-xs text-muted">10 avenants par page</span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!page.pageInfo.nextCursor || isLoading}
            onClick={() => {
              if (!page.pageInfo.nextCursor) return;
              setCursorHistory((history) => [...history, cursor]);
              setCursor(page.pageInfo.nextCursor ?? undefined);
              setLoadState({ status: 'loading' });
            }}
          >
            Suivant
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </nav>
      )}
    </section>
  );
}

function AmendmentForm({
  employeeId,
  mode,
  idempotencyKey,
  selectedFilename,
  locale,
  onFilenameChange,
  onCancel,
  onSaved,
}: {
  employeeId: string;
  mode: FormMode;
  idempotencyKey: string;
  selectedFilename: string | null;
  locale: string;
  onFilenameChange: (value: string | null) => void;
  onCancel: () => void;
  onSaved: (message: string) => void;
}) {
  const [saveState, saveAction, isSaving] = useActionState(
    async (
      previousState: SaveEmployeeAmendmentActionState,
      formData: FormData,
    ) => {
      const result = await saveEmployeeAmendmentAction(previousState, formData);
      if (result.status === 'success') {
        onSaved(result.message ?? 'L’avenant a été enregistré.');
      }
      return result;
    },
    initialSaveState,
  );
  const [effectiveDate, setEffectiveDate] = useState('');
  const [reference, setReference] = useState('');
  useEffect(() => {
    if (saveState.status === 'error' || saveState.status === 'conflict') {
      setEffectiveDate(saveState.values.effectiveDate);
      setReference(saveState.values.reference);
    }
  }, [saveState]);
  const inputId = `personnel-amendment-${employeeId}`;
  const helpId = `${inputId}-help`;
  const isReplacing = mode.type === 'replace';
  return (
    <form
      action={saveAction}
      className="mt-4 rounded-xl border border-border-default bg-surface-muted p-4"
    >
      <input type="hidden" name="employeeId" value={employeeId} />
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      <input type="hidden" name="mode" value={mode.type} />
      {isReplacing && (
        <>
          <input type="hidden" name="amendmentId" value={mode.amendment.id} />
          <input
            type="hidden"
            name="expectedRevision"
            value={mode.amendment.revision}
          />
        </>
      )}
      <h5 className="font-bold">
        {isReplacing
          ? 'Remplacer le scan de cet avenant'
          : 'Ajouter un avenant signé'}
      </h5>
      {isReplacing ? (
        <p className="mt-1 text-sm text-secondary">
          {mode.amendment.reference ??
            `Avenant du ${formatEmployeeAmendmentDate(
              mode.amendment.effectiveDate,
              locale,
            )}`}
          . Le document juridique reste le même.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Date d’effet
            <input
              type="date"
              name="effectiveDate"
              lang="fr"
              required
              disabled={isSaving}
              value={effectiveDate}
              onChange={(event) => setEffectiveDate(event.currentTarget.value)}
              aria-invalid={Boolean(saveState.fieldErrors.effectiveDate)}
              className="mt-1 min-h-11 w-full rounded-lg border border-border-default bg-surface px-3 text-sm"
            />
            {saveState.fieldErrors.effectiveDate && (
              <span
                className="mt-1 block text-xs text-status-danger"
                role="alert"
              >
                {saveState.fieldErrors.effectiveDate}
              </span>
            )}
          </label>
          <label className="text-sm font-semibold">
            Référence{' '}
            <span className="font-normal text-muted">(facultatif)</span>
            <input
              type="text"
              name="reference"
              maxLength={80}
              disabled={isSaving}
              value={reference}
              onChange={(event) => setReference(event.currentTarget.value)}
              aria-invalid={Boolean(saveState.fieldErrors.reference)}
              className="mt-1 min-h-11 w-full rounded-lg border border-border-default bg-surface px-3 text-sm"
              placeholder="Ex. Avenant n° 1"
            />
            {saveState.fieldErrors.reference && (
              <span
                className="mt-1 block text-xs text-status-danger"
                role="alert"
              >
                {saveState.fieldErrors.reference}
              </span>
            )}
          </label>
        </div>
      )}
      <label htmlFor={inputId} className="mt-4 block text-sm font-semibold">
        Fichier PDF
      </label>
      <p id={helpId} className="mt-1 text-xs text-secondary">
        PDF uniquement · 10 Mo maximum
      </p>
      <div className="relative mt-3 flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-lg border border-border-default bg-surface px-3 py-2 focus-within:ring-2 focus-within:ring-action-primary focus-within:ring-offset-2">
        <input
          id={inputId}
          name="file"
          type="file"
          accept="application/pdf,.pdf"
          required
          disabled={isSaving}
          aria-describedby={helpId}
          aria-invalid={Boolean(saveState.fieldErrors.file)}
          onChange={(event) =>
            onFilenameChange(event.currentTarget.files?.[0]?.name ?? null)
          }
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <span className="shrink-0 rounded-md bg-action-primary px-3 py-2 text-sm font-semibold text-on-action">
          Choisir un fichier
        </span>
        <span
          className="min-w-0 truncate text-sm text-secondary"
          aria-live="polite"
        >
          {getDocumentFileSelectionLabel(selectedFilename)}
        </span>
      </div>
      {saveState.fieldErrors.file && (
        <p className="mt-1 text-xs text-status-danger" role="alert">
          {saveState.fieldErrors.file}
        </p>
      )}
      {saveState.message && saveState.status !== 'success' && (
        <Alert
          tone={saveState.status === 'conflict' ? 'warning' : 'danger'}
          className="mt-3"
        >
          <AlertDescription>{saveState.message}</AlertDescription>
        </Alert>
      )}
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          disabled={isSaving}
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Upload className="h-4 w-4" aria-hidden />
          )}
          {isSaving
            ? 'Vérification…'
            : isReplacing
              ? 'Vérifier et remplacer'
              : 'Vérifier et ajouter'}
        </Button>
      </div>
    </form>
  );
}

function AmendmentCard({
  amendment,
  employeeId,
  locale,
  onReplace,
}: {
  amendment: PersonnelContractAmendment;
  employeeId: string;
  locale: string;
  onReplace: () => void;
}) {
  const href = `/api/personnel/amendments/${employeeId}/${amendment.id}`;
  return (
    <article className="rounded-xl border border-border-default bg-surface p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-action-primary">
          <FileCheck2 className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="font-bold">
                {amendment.reference ?? 'Avenant signé'}
              </p>
              <p className="mt-1 text-sm text-secondary">
                Date d’effet ·{' '}
                {formatEmployeeAmendmentDate(amendment.effectiveDate, locale)}
              </p>
              <p
                className="mt-2 truncate text-sm font-medium"
                title={amendment.filename}
              >
                {amendment.filename}
              </p>
              <p className="mt-1 text-xs text-muted">
                PDF · {formatDocumentSize(amendment.byteSize)} · version{' '}
                {amendment.version} · ajouté le{' '}
                {new Intl.DateTimeFormat(locale, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(amendment.uploadedAt))}
              </p>
            </div>
            <Badge tone="success" className="w-fit shrink-0">
              Disponible
            </Badge>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 border-t border-border-default pt-4 sm:grid-cols-3">
        <Button asChild type="button" variant="secondary" size="sm">
          <Link href={href} target="_blank" rel="noopener noreferrer">
            <Eye className="h-4 w-4" aria-hidden />
            Consulter
          </Link>
        </Button>
        <Button asChild type="button" variant="outline" size="sm">
          <a href={`${href}?download=1`}>
            <Download className="h-4 w-4" aria-hidden />
            Télécharger
          </a>
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onReplace}>
          <RefreshCw className="h-4 w-4" aria-hidden />
          Remplacer
        </Button>
      </div>
    </article>
  );
}
