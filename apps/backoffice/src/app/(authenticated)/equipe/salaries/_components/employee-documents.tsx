'use client';

import type { PersonnelDocument } from '@yuta/contracts/personnel';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  EmptyState,
} from '@yuta/ui';
import {
  Download,
  Eye,
  FileCheck2,
  FileText,
  LoaderCircle,
  Plus,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import {
  loadEmployeeDocumentsAction,
  saveEmployeeDocumentAction,
  type SaveEmployeeDocumentActionState,
} from '../actions';
import {
  formatDocumentSize,
  getDocumentFileSelectionLabel,
} from '../employee-documents-model';
import { EmployeeAmendments } from './employee-amendments';

type LoadState =
  | { status: 'loading'; message: null }
  | { status: 'ready'; message: null }
  | { status: 'error'; message: string };

const initialSaveState: SaveEmployeeDocumentActionState = {
  status: 'idle',
  message: null,
  document: null,
};

export function EmployeeDocuments({
  employeeId,
  locale,
}: {
  employeeId: string;
  locale: string;
}) {
  const [document, setDocument] = useState<PersonnelDocument | null>(null);
  const [loadState, setLoadState] = useState<LoadState>({
    status: 'loading',
    message: null,
  });
  const [loadOperationId, setLoadOperationId] = useState(() =>
    crypto.randomUUID(),
  );
  const [showForm, setShowForm] = useState(false);
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState(() =>
    crypto.randomUUID(),
  );
  const [saveState, saveAction, isSaving] = useActionState(
    saveEmployeeDocumentAction,
    initialSaveState,
  );

  useEffect(() => {
    let active = true;
    setLoadState({ status: 'loading', message: null });
    void loadEmployeeDocumentsAction(employeeId, loadOperationId)
      .then((result) => {
        if (!active) return;
        if (result.status === 'success') {
          setDocument(result.documents.items[0] ?? null);
          setLoadState({ status: 'ready', message: null });
        } else {
          setLoadState({ status: 'error', message: result.message });
        }
      })
      .catch(() => {
        if (active) {
          setLoadState({
            status: 'error',
            message: 'Impossible de charger les documents. Réessayez.',
          });
        }
      });
    return () => {
      active = false;
    };
  }, [employeeId, loadOperationId]);

  useEffect(() => {
    if (saveState.status !== 'success' || !saveState.document) return;
    setDocument(saveState.document);
    setShowForm(false);
    setSelectedFilename(null);
    setIdempotencyKey(crypto.randomUUID());
  }, [saveState]);

  return (
    <section className="rounded-xl border border-border-default bg-surface p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold">Documents</h3>
            <Badge tone="success" size="sm">
              Stockage privé
            </Badge>
          </div>
          <p className="mt-1 text-sm text-secondary">
            Contrat de travail signé rattaché à ce salarié et à cet
            établissement.
          </p>
        </div>
        {loadState.status === 'ready' && !showForm && (
          <Button
            type="button"
            size="sm"
            variant={document ? 'outline' : 'primary'}
            onClick={() => {
              setIdempotencyKey(crypto.randomUUID());
              setSelectedFilename(null);
              setShowForm(true);
            }}
            className="w-full sm:w-auto"
          >
            {document ? (
              <RefreshCw className="h-4 w-4" aria-hidden />
            ) : (
              <Plus className="h-4 w-4" aria-hidden />
            )}
            {document ? 'Remplacer' : 'Ajouter le contrat'}
          </Button>
        )}
      </div>

      <Alert
        tone="info"
        className="mt-5"
        icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
      >
        <AlertTitle>Accès protégé</AlertTitle>
        <AlertDescription>
          Seuls les propriétaires autorisés peuvent consulter ce document. Le
          fichier doit être un PDF de 10 Mo maximum et passer le contrôle de
          sécurité avant d’être disponible.
        </AlertDescription>
      </Alert>

      {loadState.status === 'loading' && (
        <p
          className="mt-5 flex items-center gap-2 text-sm text-secondary"
          role="status"
        >
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          Chargement du document…
        </p>
      )}

      {loadState.status === 'error' && (
        <Alert tone="danger" className="mt-5">
          <AlertTitle>Document indisponible</AlertTitle>
          <AlertDescription>{loadState.message}</AlertDescription>
          <div className="mt-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setLoadOperationId(crypto.randomUUID())}
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Réessayer
            </Button>
          </div>
        </Alert>
      )}

      {loadState.status === 'ready' && !document && !showForm && (
        <EmptyState
          className="mt-5 min-h-52 rounded-xl border border-dashed border-border-default"
          icon={<FileText className="h-9 w-9" aria-hidden />}
          title="Aucun contrat signé"
          description="L’absence de fichier ne rend pas automatiquement le dossier incomplet."
        />
      )}

      {loadState.status === 'ready' && document && (
        <DocumentCard
          document={document}
          employeeId={employeeId}
          locale={locale}
        />
      )}

      {showForm && (
        <form
          action={saveAction}
          className="mt-5 rounded-xl border border-border-default bg-surface-muted p-4"
        >
          <input type="hidden" name="employeeId" value={employeeId} />
          <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
          <input
            type="hidden"
            name="expectedRevision"
            value={document?.revision ?? ''}
          />
          <label
            htmlFor={`personnel-document-${employeeId}`}
            className="text-sm font-bold"
          >
            {document ? 'Nouveau contrat signé' : 'Contrat signé'}
          </label>
          <p
            id={`personnel-document-help-${employeeId}`}
            className="mt-1 text-xs text-secondary"
          >
            PDF uniquement · 10 Mo maximum
          </p>
          <div className="relative mt-3 flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-lg border border-border-default bg-surface px-3 py-2 focus-within:ring-2 focus-within:ring-action-primary focus-within:ring-offset-2">
            <input
              id={`personnel-document-${employeeId}`}
              name="file"
              type="file"
              accept="application/pdf,.pdf"
              required
              disabled={isSaving}
              aria-describedby={`personnel-document-help-${employeeId}`}
              onChange={(event) =>
                setSelectedFilename(
                  event.currentTarget.files?.[0]?.name ?? null,
                )
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
              onClick={() => {
                setSelectedFilename(null);
                setShowForm(false);
              }}
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
                : document
                  ? 'Vérifier et remplacer'
                  : 'Vérifier et ajouter'}
            </Button>
          </div>
        </form>
      )}

      {saveState.status === 'success' && saveState.message && (
        <Alert
          tone="success"
          className="mt-4"
          icon={<FileCheck2 className="h-5 w-5" aria-hidden />}
        >
          <AlertDescription>{saveState.message}</AlertDescription>
        </Alert>
      )}

      <EmployeeAmendments employeeId={employeeId} locale={locale} />
    </section>
  );
}

function DocumentCard({
  document,
  employeeId,
  locale,
}: {
  document: PersonnelDocument;
  employeeId: string;
  locale: string;
}) {
  const href = `/api/personnel/documents/${employeeId}/${document.id}`;
  return (
    <article className="mt-5 rounded-xl border border-border-default bg-surface p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-action-primary">
          <FileCheck2 className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Contrat de travail signé
              </p>
              <p className="mt-1 truncate font-bold" title={document.filename}>
                {document.filename}
              </p>
              <p className="mt-1 text-sm text-secondary">
                PDF · {formatDocumentSize(document.byteSize)} · version{' '}
                {document.version}
              </p>
              <p className="mt-1 text-xs text-muted">
                Ajouté le{' '}
                {new Intl.DateTimeFormat(locale, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(document.uploadedAt))}
              </p>
            </div>
            <Badge tone="success" className="w-fit shrink-0">
              Disponible
            </Badge>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 border-t border-border-default pt-4 sm:grid-cols-2">
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
      </div>
    </article>
  );
}
