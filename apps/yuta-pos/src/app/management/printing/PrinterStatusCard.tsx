import type { LocalPrinterStatus } from '@yuta/contracts/local-pos';
import { Alert, AlertDescription, Badge, Card } from '@yuta/ui';
import { Printer, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

export function PrinterStatusCard({ status }: { status: LocalPrinterStatus }) {
  const presentation = printerStatusPresentation(status.status);

  return (
    <Card className="grid gap-4">
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
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
        <PrinterStatusMetric
          label="Statut"
          value={
            <Badge tone={presentation.tone} variant="soft">
              {presentation.label}
            </Badge>
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
  value: ReactNode;
}) {
  return (
    <div className="border-l-2 border-border-default pl-3 first:border-l-0 first:pl-0">
      <p className="text-xs font-bold uppercase text-secondary">{label}</p>
      <div className="mt-1 font-black">{value}</div>
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

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
