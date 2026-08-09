'use client';

import type {
  LocalPrintJob,
  LocalPrinterStatus,
  LocalPrintSettings,
  PrintFontSizePreset,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  StatCard,
} from '@yuta/ui';
import {
  CheckCircle2,
  CirclePlay,
  FlaskConical,
  Printer,
  RefreshCw,
  Settings2,
  TriangleAlert,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useActionState, useEffect, useState } from 'react';
import {
  createTestPrintJobAction,
  failPrintJobAction,
  runPrintJobCommandAction,
  savePrintSettingsAction,
  type PrintingActionState,
} from './actions';

const initialState: PrintingActionState = { error: null, success: null };
const paddingOptions = Array.from({ length: 9 }, (_, value) => String(value));

export function PrintingManagement({
  jobs,
  settings,
  printerStatus,
}: {
  jobs: LocalPrintJob[];
  settings: LocalPrintSettings;
  printerStatus: LocalPrinterStatus;
}) {
  const counters = {
    pending: jobs.filter((job) => job.status === 'pending').length,
    printing: jobs.filter((job) => job.status === 'printing').length,
    printed: jobs.filter((job) => job.status === 'printed').length,
    failed: jobs.filter((job) => job.status === 'failed').length,
  };

  return (
    <div className="grid gap-5">
      <PrinterStatusCard status={printerStatus} />
      <PrintSettingsCard settings={settings} />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="En attente" value={String(counters.pending)} />
        <StatCard label="En impression" value={String(counters.printing)} />
        <StatCard label="Imprimés" value={String(counters.printed)} />
        <StatCard label="Échecs" value={String(counters.failed)} />
      </section>

      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4">
          <h2 className="text-lg font-black">Tickets récents</h2>
          <p className="mt-1 text-sm text-secondary">
            {jobs.length} ticket{jobs.length === 1 ? '' : 's'} chargé
            {jobs.length === 1 ? '' : 's'}
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
            {jobs.map((job, index) => (
              <div key={job.id}>
                <PrintJobRow job={job} />
                {index < jobs.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function PrinterStatusCard({ status }: { status: LocalPrinterStatus }) {
  const presentation = printerStatusPresentation(status.status);

  return (
    <Card padding="lg" className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Printer className="mt-0.5 h-5 w-5 text-secondary" />
          <div>
            <h2 className="text-lg font-black">État de l’imprimante</h2>
            <p className="mt-1 text-sm text-secondary">
              Contrôle local sans ouvrir la connexion Bluetooth.
            </p>
          </div>
        </div>
        <Badge tone={presentation.tone} variant="soft">
          {presentation.label}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PrinterStatusMetric
          label="Canal RFCOMM"
          value={printerDeviceLabel(status.device)}
        />
        <PrinterStatusMetric
          label="Worker local"
          value={status.worker === 'running' ? 'Actif' : 'Désactivé'}
        />
        <PrinterStatusMetric
          label="File actuelle"
          value={`${status.queue.pending} attente · ${status.queue.printing} en cours · ${status.queue.failed} échec`}
        />
        <PrinterStatusMetric
          label="Dernière impression"
          value={
            status.lastPrintedAt
              ? formatDateTime(status.lastPrintedAt)
              : 'Aucune'
          }
        />
      </div>

      {(status.status === 'attention' || status.status === 'unavailable') && (
        <Alert tone={status.status === 'unavailable' ? 'danger' : 'warning'}>
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>{presentation.description}</AlertDescription>
        </Alert>
      )}

      <p className="text-xs text-secondary">
        Vérifié à {formatDateTime(status.checkedAt)}. Un canal prêt confirme que
        Linux peut envoyer les données ; utilisez le test d’impression pour
        confirmer le papier et l’état physique de la TM-m30.
      </p>
    </Card>
  );
}

function PrinterStatusMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border-default bg-surface-muted p-3">
      <p className="text-xs font-bold uppercase text-secondary">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}

function printerStatusPresentation(status: LocalPrinterStatus['status']): {
  label: string;
  description: string;
  tone: 'neutral' | 'success' | 'info' | 'warning' | 'danger';
} {
  if (status === 'ready') {
    return {
      label: 'Prête à envoyer',
      description: 'Le canal local est prêt.',
      tone: 'success',
    };
  }
  if (status === 'printing') {
    return {
      label: 'Impression en cours',
      description: 'Un ticket est en cours de transmission.',
      tone: 'info',
    };
  }
  if (status === 'attention') {
    return {
      label: 'Attention requise',
      description:
        'Un ticket attend depuis trop longtemps ou la dernière tentative a échoué.',
      tone: 'warning',
    };
  }
  if (status === 'unavailable') {
    return {
      label: 'Indisponible',
      description:
        'Le canal RFCOMM est absent, invalide ou inaccessible au site-agent.',
      tone: 'danger',
    };
  }
  return {
    label: 'Non configurée',
    description: 'Aucun périphérique d’impression local n’est configuré.',
    tone: 'neutral',
  };
}

function printerDeviceLabel(device: LocalPrinterStatus['device']): string {
  if (device === 'ready') return 'Prêt';
  if (device === 'missing') return 'Absent';
  if (device === 'not_writable') return 'Accès refusé';
  if (device === 'invalid') return 'Périphérique invalide';
  return 'Non configuré';
}

function PrintSettingsCard({ settings }: { settings: LocalPrintSettings }) {
  const [kitchenCopies, setKitchenCopies] = useState(
    String(settings.kitchenCopies),
  );
  const [counterCopies, setCounterCopies] = useState(
    String(settings.counterCopies),
  );
  const [fontSizePreset, setFontSizePreset] = useState<PrintFontSizePreset>(
    settings.fontSizePreset,
  );
  const [topPaddingLines, setTopPaddingLines] = useState(
    String(settings.topPaddingLines),
  );
  const [leftPaddingChars, setLeftPaddingChars] = useState(
    String(settings.leftPaddingChars),
  );
  const [bottomPaddingLines, setBottomPaddingLines] = useState(
    String(settings.bottomPaddingLines),
  );
  const [state, action, pending] = useActionState(
    savePrintSettingsAction,
    initialState,
  );

  return (
    <Card padding="lg" className="grid gap-5">
      <div className="flex items-start gap-3">
        <Settings2 className="mt-0.5 h-5 w-5 text-secondary" />
        <div>
          <h2 className="text-lg font-black">Paramètres des tickets</h2>
          <p className="mt-1 text-sm text-secondary">
            Le ticket Cuisine et le ticket BAR complet sont imprimés et coupés
            séparément sur l’EPSON TM-m30.
          </p>
        </div>
      </div>

      <form action={action} className="grid gap-5">
        <input type="hidden" name="kitchenCopies" value={kitchenCopies} />
        <input type="hidden" name="counterCopies" value={counterCopies} />
        <input type="hidden" name="fontSizePreset" value={fontSizePreset} />
        <input type="hidden" name="topPaddingLines" value={topPaddingLines} />
        <input type="hidden" name="leftPaddingChars" value={leftPaddingChars} />
        <input
          type="hidden"
          name="bottomPaddingLines"
          value={bottomPaddingLines}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="Copies Cuisine">
            <Select value={kitchenCopies} onValueChange={setKitchenCopies}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 copie</SelectItem>
                <SelectItem value="2">2 copies</SelectItem>
                <SelectItem value="3">3 copies</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Copies BAR (commande complète)">
            <Select value={counterCopies} onValueChange={setCounterCopies}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 copie</SelectItem>
                <SelectItem value="2">2 copies</SelectItem>
                <SelectItem value="3">3 copies</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Taille du texte">
            <Select
              value={fontSizePreset}
              onValueChange={(value) =>
                setFontSizePreset(value as PrintFontSizePreset)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compacte</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <PaddingSelect
            label="Marge haute (lignes)"
            value={topPaddingLines}
            onValueChange={setTopPaddingLines}
          />
          <PaddingSelect
            label="Marge gauche (caractères)"
            value={leftPaddingChars}
            onValueChange={setLeftPaddingChars}
          />
          <PaddingSelect
            label="Marge basse (lignes)"
            value={bottomPaddingLines}
            onValueChange={setBottomPaddingLines}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <TicketPreview
            title="CUISINE"
            subtitle={`${kitchenCopies} copie${kitchenCopies === '1' ? '' : 's'}`}
            preset={fontSizePreset}
            topPaddingLines={Number(topPaddingLines)}
            leftPaddingChars={Number(leftPaddingChars)}
            bottomPaddingLines={Number(bottomPaddingLines)}
          />
          <TicketPreview
            title="BAR — COMMANDE COMPLÈTE"
            subtitle={`${counterCopies} copie${counterCopies === '1' ? '' : 's'}`}
            preset={fontSizePreset}
            topPaddingLines={Number(topPaddingLines)}
            leftPaddingChars={Number(leftPaddingChars)}
            bottomPaddingLines={Number(bottomPaddingLines)}
          />
        </div>

        {state.error && (
          <Alert tone="danger">
            <TriangleAlert className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        {state.success && (
          <Alert tone="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{state.success}</AlertDescription>
          </Alert>
        )}
        <div className="flex justify-end">
          <Button type="submit" loading={pending}>
            Enregistrer les paramètres
          </Button>
        </div>
      </form>
      <TestPrintControl />
    </Card>
  );
}

function TestPrintControl() {
  const [state, action, pending] = useActionState(
    createTestPrintJobAction,
    initialState,
  );
  return (
    <div className="grid gap-3 border-t border-border pt-5">
      <div>
        <p className="font-bold">Test de l’imprimante</p>
        <p className="mt-1 text-sm text-secondary">
          Imprime une page avec accents, apostrophes, tirets, marges et coupe.
          Enregistrez d’abord les paramètres ci-dessus.
        </p>
      </div>
      {state.error && (
        <Alert tone="danger">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.success && (
        <Alert tone="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{state.success}</AlertDescription>
        </Alert>
      )}
      <form action={action}>
        <Button type="submit" variant="secondary" loading={pending}>
          <FlaskConical className="h-4 w-4" />
          Impression test
        </Button>
      </form>
    </div>
  );
}

function PaddingSelect({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <FormField label={label}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {paddingOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

function TicketPreview({
  title,
  subtitle,
  preset,
  topPaddingLines,
  leftPaddingChars,
  bottomPaddingLines,
}: {
  title: string;
  subtitle: string;
  preset: PrintFontSizePreset;
  topPaddingLines: number;
  leftPaddingChars: number;
  bottomPaddingLines: number;
}) {
  const itemClass =
    preset === 'large'
      ? 'text-lg font-black'
      : preset === 'compact'
        ? 'text-sm font-semibold'
        : 'text-base font-bold';
  return (
    <div
      className="rounded-lg border border-border bg-surface p-4"
      style={{
        paddingTop: `${16 + topPaddingLines * 4}px`,
        paddingLeft: `${16 + leftPaddingChars * 3}px`,
        paddingBottom: `${16 + bottomPaddingLines * 4}px`,
      }}
    >
      <p className="text-center text-xl font-black">{title}</p>
      <Separator className="my-3" />
      <p className="text-xs font-semibold uppercase text-secondary">
        {subtitle} · Papier 80 mm
      </p>
      <p className={`mt-3 ${itemClass}`}>2 × Exemple d’article</p>
      <p className="mt-1 text-sm text-secondary">&gt; Option ou remarque</p>
    </div>
  );
}

function PrintJobRow({ job }: { job: LocalPrintJob }) {
  return (
    <div className="grid gap-4 px-5 py-4 xl:grid-cols-[1.2fr_0.9fr_0.9fr_auto] xl:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-black">{jobTitle(job)}</p>
          <Badge tone={statusTone(job.status)}>{statusLabel(job.status)}</Badge>
        </div>
        <p className="mt-1 text-sm text-secondary">
          {typeLabel(job.type)} · {job.summary.itemCount} article
          {job.summary.itemCount === 1 ? '' : 's'}
        </p>
        {job.errorMessage && (
          <p className="mt-2 text-sm font-semibold text-status-danger">
            {job.errorMessage}
          </p>
        )}
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
            className="text-secondary underline-offset-4 hover:underline"
          >
            Ouvrir la commande
          </Link>
        ) : (
          <p className="text-muted">Sans commande liée</p>
        )}
      </div>

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
        <Button type="submit" size="sm" variant={variant} loading={pending}>
          {icon}
          {label}
        </Button>
      </form>
      {state.error && (
        <p className="mt-1 max-w-52 text-xs text-status-danger" role="alert">
          {state.error}
        </p>
      )}
    </div>
  );
}

function FailDialog({ job }: { job: LocalPrintJob }) {
  const [open, setOpen] = useState(false);
  const actionFunction = failPrintJobAction.bind(null, job.id);
  const [state, action, pending] = useActionState(actionFunction, initialState);

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="danger">
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
        <form action={action} className="grid gap-4">
          <FormField label="Motif">
            <Input
              name="errorMessage"
              placeholder="Papier absent, imprimante hors ligne…"
              maxLength={2000}
              required
            />
          </FormField>
          {state.error && (
            <Alert tone="danger">
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="danger" loading={pending}>
              Enregistrer l’échec
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
  if (type === 'customer_receipt') return 'Reçu client (historique)';
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
