'use client';

import type {
  LocalPrintJob,
  LocalPrintJobsResponse,
  PrintJobCommand,
} from '@yuta/contracts/local-pos';
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  EmptyState,
  FormField,
  Input,
  Pagination,
  Separator,
} from '@yuta/ui';
import {
  CheckCircle2,
  CirclePlay,
  Printer,
  RefreshCw,
  TriangleAlert,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent, ReactNode } from 'react';
import { useActionState, useEffect, useState } from 'react';
import {
  failPrintJobAction,
  runPrintJobCommandAction,
  type PrintingActionState,
} from '../actions';

const initialState: PrintingActionState = { error: null, success: null };

export function PrintJobsCard({
  jobs,
  summary,
  pagination,
}: {
  jobs: LocalPrintJob[];
  summary: LocalPrintJobsResponse['summary'];
  pagination: LocalPrintJobsResponse['pagination'];
}) {
  const router = useRouter();

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <Printer className="h-4 w-4 text-secondary" />
          <h2 className="font-black">File d’impression</h2>
        </div>
        <QueueSummary summary={summary} />
      </div>
      <Separator />
      <div className="px-4 py-3">
        <h3 className="font-black">Tickets récents</h3>
        <p className="mt-1 text-sm text-secondary">
          {jobs.length} sur {pagination.totalItems} ticket
          {pagination.totalItems === 1 ? '' : 's'}
        </p>
      </div>
      <Separator />
      {jobs.length === 0 ? (
        <EmptyState
          icon={<Printer className="h-8 w-8" />}
          title="Aucun ticket d’impression"
          description="Les tickets internes apparaissent après l’envoi d’une commande en production."
        />
      ) : (
        <div>
          <div className="hidden grid-cols-[0.9fr_1.1fr_1.35fr_0.8fr_0.65fr_auto] gap-3 bg-surface-muted px-4 py-2 text-[11px] font-black uppercase text-muted xl:grid">
            <span>Statut</span>
            <span>Ticket</span>
            <span>Imprimante / source</span>
            <span>Créé le</span>
            <span>Articles</span>
            <span className="text-right">Actions</span>
          </div>
          {jobs.map((job, index) => (
            <div key={job.id}>
              <PrintJobRow job={job} />
              {index < jobs.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      )}
      {pagination.totalPages > 1 && (
        <>
          <Separator />
          <Pagination
            className="px-4 py-3"
            page={pagination.page}
            pageCount={pagination.totalPages}
            previousLabel="Précédent"
            nextLabel="Suivant"
            pageLabel={(page, pageCount) => `Page ${page} sur ${pageCount}`}
            onPrevious={() =>
              router.push(
                `/management/printing?page=${Math.max(1, pagination.page - 1)}`,
              )
            }
            onNext={() =>
              router.push(
                `/management/printing?page=${Math.min(
                  pagination.totalPages,
                  pagination.page + 1,
                )}`,
              )
            }
          />
        </>
      )}
      {pagination.totalPages <= 1 && pagination.totalItems > 0 && (
        <div className="border-t border-border-default px-4 py-3 text-right text-xs font-semibold text-muted">
          10 tickets par page
        </div>
      )}
    </Card>
  );
}

function QueueSummary({
  summary,
}: {
  summary: LocalPrintJobsResponse['summary'];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge tone="neutral" variant="outline">
        En attente <strong>{summary.pending}</strong>
      </Badge>
      <Badge tone="info" variant="outline">
        En impression <strong>{summary.printing}</strong>
      </Badge>
      <Badge tone="success" variant="outline">
        Imprimés <strong>{summary.printed}</strong>
      </Badge>
      <Badge tone="danger" variant="outline">
        Échecs <strong>{summary.failed}</strong>
      </Badge>
    </div>
  );
}

function PrintJobRow({ job }: { job: LocalPrintJob }) {
  return (
    <div className="grid gap-3 px-4 py-3 xl:grid-cols-[0.9fr_1.1fr_1.35fr_0.8fr_0.65fr_auto] xl:items-center">
      <div>
        <Badge tone={statusTone(job.status)}>{statusLabel(job.status)}</Badge>
        {job.errorMessage && (
          <p className="mt-2 text-sm font-semibold text-status-danger">
            {job.errorMessage}
          </p>
        )}
      </div>

      <div>
        <p className="font-black">{jobTitle(job)}</p>
        <p className="mt-0.5 text-xs text-secondary">{typeLabel(job.type)}</p>
      </div>

      <div className="text-sm">
        <p className="font-semibold">{job.printerName}</p>
        <p className="text-secondary">{sourceLabel(job.source)}</p>
      </div>

      <div className="text-sm">
        <p className="font-semibold">{formatDateTime(job.createdAt)}</p>
        {job.orderId ? (
          <Link
            href={`/orders/${job.orderId}`}
            className="inline-flex min-h-11 items-center text-secondary underline-offset-4 hover:underline xl:min-h-0"
          >
            Ouvrir la commande
          </Link>
        ) : (
          <p className="text-muted">Sans commande liée</p>
        )}
      </div>

      <p className="text-sm font-semibold">
        {job.summary.itemCount} article
        {job.summary.itemCount === 1 ? '' : 's'}
      </p>

      <JobActions job={job} />
    </div>
  );
}

function JobActions({ job }: { job: LocalPrintJob }) {
  if (job.status === 'printed') {
    return (
      <div className="flex flex-wrap items-center justify-start gap-2 xl:justify-end">
        <div className="flex items-center gap-2 text-sm font-semibold text-status-success">
          <CheckCircle2 className="h-4 w-4" />
          Terminé
        </div>
        <CommandButton
          jobId={job.id}
          command={{ action: 'reprint' }}
          label="Réimprimer"
          icon={<RefreshCw className="h-4 w-4" />}
          variant="secondary"
        />
      </div>
    );
  }

  if (job.status === 'failed') {
    return (
      <CommandButton
        jobId={job.id}
        command={{ action: 'retry' }}
        label="Réessayer"
        icon={<RefreshCw className="h-4 w-4" />}
        variant="secondary"
      />
    );
  }

  return (
    <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
      {job.status === 'pending' ? (
        <CommandButton
          jobId={job.id}
          command={{ action: 'mark_printing' }}
          label="Démarrer"
          icon={<CirclePlay className="h-4 w-4" />}
          variant="primary"
        />
      ) : (
        <CommandButton
          jobId={job.id}
          command={{ action: 'mark_printed' }}
          label="Imprimé"
          icon={<CheckCircle2 className="h-4 w-4" />}
          variant="success"
        />
      )}
      <FailDialog job={job} />
    </div>
  );
}

function CommandButton({
  jobId,
  command,
  label,
  icon,
  variant,
}: {
  jobId: string;
  command: PrintJobCommand;
  label: string;
  icon: ReactNode;
  variant: 'primary' | 'secondary' | 'success';
}) {
  const actionFunction = runPrintJobCommandAction.bind(null, jobId, command);
  const [state, action, pending] = useActionState(actionFunction, initialState);

  return (
    <div>
      <form action={action}>
        <Button
          type="submit"
          size="sm"
          variant={variant}
          loading={pending}
          className="min-h-11 xl:min-h-9"
        >
          {icon}
          {label}
        </Button>
      </form>
      {state.error && (
        <div className="mt-1 grid max-w-52 gap-2">
          <p className="text-xs text-status-danger" role="alert">
            {state.error}
          </p>
          {state.recovery === 'refresh' && <RefreshRecoveryButton />}
        </div>
      )}
      {state.success && (
        <p className="mt-1 max-w-52 text-xs text-status-success" role="status">
          {state.success}
        </p>
      )}
    </div>
  );
}

function FailDialog({ job }: { job: LocalPrintJob }) {
  const [open, setOpen] = useState(false);
  const [failureReason, setFailureReason] = useState('');
  const [failureReasonError, setFailureReasonError] = useState<string | null>(
    null,
  );
  const actionFunction = failPrintJobAction.bind(null, job.id);
  const [state, action, pending] = useActionState(actionFunction, initialState);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      setFailureReason('');
      setFailureReasonError(null);
    }
  }, [state.success]);

  const closeDialog = () => {
    setOpen(false);
    setFailureReason('');
    setFailureReasonError(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setFailureReason('');
      setFailureReasonError(null);
    }
  };

  const validateFailureReason = (event: FormEvent<HTMLFormElement>) => {
    if (failureReason.trim()) return;
    event.preventDefault();
    setFailureReasonError('Le motif est requis.');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="danger"
          className="min-h-11 xl:min-h-9"
        >
          <XCircle className="h-4 w-4" />
          Échec
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signaler un échec d’impression</DialogTitle>
          <DialogDescription>
            Le motif restera visible dans la file jusqu’à la prochaine
            tentative.
          </DialogDescription>
        </DialogHeader>
        <form
          action={action}
          className="grid gap-4"
          noValidate
          onSubmit={validateFailureReason}
        >
          <FormField label="Motif">
            <Input
              name="errorMessage"
              placeholder="Papier absent, imprimante hors ligne…"
              maxLength={2000}
              value={failureReason}
              onChange={(event) => {
                setFailureReason(event.target.value);
                if (event.target.value.trim()) setFailureReasonError(null);
              }}
              aria-invalid={failureReasonError ? true : undefined}
              aria-describedby={
                failureReasonError ? 'print-failure-reason-error' : undefined
              }
              required
            />
          </FormField>
          {failureReasonError && (
            <p
              id="print-failure-reason-error"
              className="text-sm font-semibold text-status-danger"
              role="alert"
            >
              {failureReasonError}
            </p>
          )}
          {state.error && (
            <Alert tone="danger">
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription>
                <span>{state.error}</span>
                {state.recovery === 'refresh' && (
                  <span className="mt-3 block">
                    <RefreshRecoveryButton />
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              className="min-h-11"
              onClick={closeDialog}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="danger"
              loading={pending}
              className="min-h-11"
            >
              Enregistrer l’échec
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RefreshRecoveryButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      className="min-h-11 xl:min-h-9"
      onClick={() => router.refresh()}
    >
      <RefreshCw className="h-4 w-4" />
      Actualiser
    </Button>
  );
}

function jobTitle(job: LocalPrintJob): string {
  return (
    job.summary.tableLabel ??
    job.summary.orderNumber ??
    `Ticket ${job.id.slice(0, 8)}`
  );
}

function statusLabel(status: LocalPrintJob['status']): string {
  if (status === 'pending') return 'En attente';
  if (status === 'printing') return 'En impression';
  if (status === 'printed') return 'Imprimé';
  return 'Échec';
}

function statusTone(
  status: LocalPrintJob['status'],
): 'neutral' | 'info' | 'success' | 'danger' {
  if (status === 'printing') return 'info';
  if (status === 'printed') return 'success';
  if (status === 'failed') return 'danger';
  return 'neutral';
}

function typeLabel(type: LocalPrintJob['type']): string {
  if (type === 'kitchen_ticket') return 'Ticket interne';
  if (type === 'customer_receipt') return 'Reçu client';
  return 'Test';
}

function sourceLabel(source: LocalPrintJob['source']): string {
  if (source === 'pos') return 'Créé par le POS';
  if (source === 'kitchen') return 'Créé en cuisine';
  if (source === 'delivery') return 'Créé par la livraison';
  return 'Créé manuellement';
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
