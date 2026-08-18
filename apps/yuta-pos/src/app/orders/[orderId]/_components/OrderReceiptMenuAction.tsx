'use client';

import type {
  LocalPrintJob,
  LocalPrinterStatus,
  LocalReceiptTarget,
  LocalReceiptViewResponse,
  ReceiptJobCommandInput,
} from '@yuta/contracts/local-pos';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  cn,
} from '@yuta/ui';
import {
  CheckCircle2,
  Clock3,
  Printer,
  RefreshCw,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { v7 as uuidv7 } from 'uuid';
import { useClosePosHeaderMenu } from '../../../../components/pos/PosHeaderMenu';
import {
  executeOrderReceiptAction,
  getOrderReceiptJobStatusAction,
} from '../_lib/order-receipt-actions';
import {
  formatReceiptMoney,
  receiptAvailabilityLabel,
  receiptCommandIntent,
  receiptSubmitLabel,
} from '../_lib/order-receipt-presentation';

type OrderReceiptMenuActionProps = {
  orderId: string;
  receiptView: LocalReceiptViewResponse;
};

export function OrderReceiptMenuAction({
  orderId,
  receiptView,
}: OrderReceiptMenuActionProps) {
  const closeMenu = useClosePosHeaderMenu();
  const [open, setOpen] = useState(false);
  const [targets, setTargets] = useState(receiptView.targets);
  const firstAvailable =
    receiptView.targets.find((target) => target.availability === 'available') ??
    receiptView.targets[0];
  const [selectedTargetId, setSelectedTargetId] = useState(
    firstAvailable?.id ?? '',
  );
  const selectedTarget =
    targets.find((target) => target.id === selectedTargetId) ?? targets[0];
  const [activeJob, setActiveJob] = useState<LocalPrintJob | null>(
    selectedTarget?.latestJob ?? null,
  );
  const [printer, setPrinter] = useState(receiptView.printer);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const operationIdRef = useRef<string | null>(null);

  useEffect(() => {
    setActiveJob(selectedTarget?.latestJob ?? null);
    setErrorMessage(null);
    operationIdRef.current = null;
  }, [selectedTarget?.id, selectedTarget?.latestJob]);

  useEffect(() => {
    if (
      !open ||
      !activeJob ||
      (activeJob.status !== 'pending' && activeJob.status !== 'printing')
    ) {
      return;
    }
    let cancelled = false;
    const refresh = async () => {
      if (document.visibilityState !== 'visible') return;
      const result = await getOrderReceiptJobStatusAction(
        orderId,
        activeJob.id,
      );
      if (cancelled) return;
      if (!result.ok) {
        setErrorMessage(result.error.message);
        return;
      }
      setActiveJob(result.data.printJob);
      setPrinter(result.data.printer);
      setTargets((current) =>
        current.map((target) =>
          target.id === selectedTarget?.id
            ? { ...target, latestJob: result.data.printJob }
            : target,
        ),
      );
    };
    const onVisible = () => void refresh();
    const interval = window.setInterval(() => void refresh(), 2_000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [activeJob, open, orderId, selectedTarget?.id]);

  const commandIntent = receiptCommandIntent(activeJob);
  const waiting =
    activeJob?.status === 'pending' || activeJob?.status === 'printing';
  const canSubmit =
    selectedTarget?.availability === 'available' && !waiting && !pending;

  const submit = () => {
    if (!selectedTarget || !canSubmit) return;
    setErrorMessage(null);
    operationIdRef.current ??= uuidv7();
    const command: ReceiptJobCommandInput = {
      operationId: operationIdRef.current,
      target:
        selectedTarget.kind === 'order'
          ? { kind: 'order' }
          : { kind: 'check', checkId: selectedTarget.id },
      intent: commandIntent,
      ...(commandIntent === 'print' || !activeJob
        ? {}
        : { jobId: activeJob.id }),
    };
    startTransition(async () => {
      const result = await executeOrderReceiptAction(orderId, command);
      if (!result.ok) {
        operationIdRef.current = null;
        setErrorMessage(result.error.message);
        return;
      }
      operationIdRef.current = null;
      setActiveJob(result.data.printJob);
      setPrinter(result.data.printer);
      setTargets((current) =>
        current.map((target) =>
          target.id === result.data.target.id ? result.data.target : target,
        ),
      );
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full justify-start"
        onClick={() => {
          closeMenu();
          setOpen(true);
        }}
      >
        <Printer className="h-4 w-4" />
        Imprimer le reçu
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Imprimer un reçu</DialogTitle>
            <DialogDescription>
              Reçu de paiement, une copie. Document non fiscal. Sélectionnez une
              addition entièrement payée.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {targets.length > 1 && (
              <div
                className="grid gap-2"
                role="radiogroup"
                aria-label="Addition"
              >
                {targets.map((target) => (
                  <TargetButton
                    key={target.id}
                    target={target}
                    selected={target.id === selectedTarget?.id}
                    onSelect={() => setSelectedTargetId(target.id)}
                  />
                ))}
              </div>
            )}

            {selectedTarget && targets.length === 1 && (
              <div className="rounded-lg border border-border-default bg-surface-muted p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-black">{selectedTarget.label}</span>
                  <span className="font-black">
                    {formatReceiptMoney(selectedTarget.amountCents)}
                  </span>
                </div>
              </div>
            )}

            <PrinterNotice printer={printer} />
            {activeJob && <JobNotice job={activeJob} />}
            {selectedTarget?.availability !== 'available' && (
              <Alert tone="warning">
                <Clock3 className="h-4 w-4" />
                <AlertTitle>Paiement requis</AlertTitle>
                <AlertDescription>
                  Cette addition doit être entièrement payée avant impression.
                </AlertDescription>
              </Alert>
            )}
            {errorMessage && (
              <Alert tone="danger">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Impression impossible</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Fermer
            </Button>
            <Button type="button" onClick={submit} disabled={!canSubmit}>
              {commandIntent === 'print' ? (
                <Printer className="h-4 w-4" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {receiptSubmitLabel({
                intent: commandIntent,
                pending,
                status: activeJob?.status ?? null,
              })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TargetButton({
  target,
  selected,
  onSelect,
}: {
  target: LocalReceiptTarget;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex min-h-14 items-center justify-between gap-4 rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        selected
          ? 'border-primary bg-surface-muted'
          : 'border-border-default bg-white hover:bg-surface-muted',
      )}
    >
      <span className="grid gap-0.5">
        <span className="font-black">{target.label}</span>
        <span className="text-xs font-semibold text-primary/65">
          {receiptAvailabilityLabel(target.availability)}
        </span>
      </span>
      <span className="font-black">
        {formatReceiptMoney(target.amountCents)}
      </span>
    </button>
  );
}

function PrinterNotice({ printer }: { printer: LocalPrinterStatus }) {
  if (printer.status === 'ready' || printer.status === 'printing') return null;
  return (
    <Alert tone="warning">
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>Imprimante indisponible</AlertTitle>
      <AlertDescription>
        La demande restera dans la file locale jusqu'à ce que l'imprimante soit
        configurée et disponible.
      </AlertDescription>
    </Alert>
  );
}

function JobNotice({ job }: { job: LocalPrintJob }) {
  if (job.status === 'failed') {
    return (
      <Alert tone="danger">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Échec de l'impression</AlertTitle>
        <AlertDescription>
          {job.errorMessage ?? 'Vérifiez l’imprimante puis réessayez.'}
        </AlertDescription>
      </Alert>
    );
  }
  if (job.status === 'printed') {
    return (
      <Alert tone="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Reçu imprimé</AlertTitle>
        <AlertDescription>
          Vous pouvez lancer une réimpression du même reçu.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert tone="info">
      <Clock3 className="h-4 w-4" />
      <AlertTitle>
        {job.status === 'printing'
          ? 'Impression en cours'
          : "En attente d'impression"}
      </AlertTitle>
      <AlertDescription>
        Le statut se met à jour automatiquement tant que cette fenêtre reste
        ouverte.
      </AlertDescription>
    </Alert>
  );
}
