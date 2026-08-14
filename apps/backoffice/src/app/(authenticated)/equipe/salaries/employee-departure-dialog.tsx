'use client';

import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
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
  Textarea,
} from '@yuta/ui';
import { AlertTriangle, CalendarX2, RefreshCw } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  setEmployeeDepartureAction,
  type DepartureEmployeeActionState,
} from './actions';
import { formatEmployeeDate, getEmployeeName } from './salaries-model';

const initialDepartureActionState: DepartureEmployeeActionState = {
  status: 'idle',
  message: null,
  fieldErrors: {},
  currentEmployee: null,
};

export function EmployeeDepartureDialog({
  employee,
  businessDate,
  locale,
  open,
  onOpenChange,
}: {
  employee: PersonnelEmployeeSummary;
  businessDate: string;
  locale: string;
  open: boolean;
  onOpenChange(open: boolean): void;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(
    setEmployeeDepartureAction,
    initialDepartureActionState,
  );
  const [departureDate, setDepartureDate] = useState(
    employee.departureDate ?? '',
  );
  const [baseDepartureDate, setBaseDepartureDate] = useState(
    employee.departureDate,
  );
  const [revision, setRevision] = useState(employee.revision);
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [conflictDismissed, setConflictDismissed] = useState(false);
  const isCorrection = baseDepartureDate !== null;

  useEffect(() => {
    if (state.status === 'success') router.refresh();
    if (state.status === 'conflict') setConflictDismissed(false);
  }, [router, state.status]);

  useEffect(() => {
    if (open && !idempotencyKey) setIdempotencyKey(crypto.randomUUID());
  }, [idempotencyKey, open]);

  function loadCurrentVersion() {
    if (!state.currentEmployee) return;
    setDepartureDate(state.currentEmployee.departureDate ?? '');
    setBaseDepartureDate(state.currentEmployee.departureDate);
    setRevision(state.currentEmployee.revision);
    setReason('');
    setConfirmed(false);
    setIdempotencyKey(crypto.randomUUID());
    setConflictDismissed(true);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isCorrection ? 'Corriger le départ' : 'Enregistrer un départ'}
          </DialogTitle>
          <DialogDescription>
            {getEmployeeName(employee)} · cette action conserve le dossier et
            son historique.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="mt-5 grid gap-5">
          <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
          <input type="hidden" name="employeeId" value={employee.id} />
          <input type="hidden" name="expectedRevision" value={revision} />
          <input
            type="hidden"
            name="confirmNonDeletion"
            value={confirmed ? 'true' : 'false'}
          />

          <FormField
            label={
              <Label htmlFor="departure-date">Dernier jour travaillé</Label>
            }
            error={state.fieldErrors.departureDate}
          >
            <Input
              id="departure-date"
              name="departureDate"
              type="date"
              min={employee.entryDate}
              value={departureDate}
              onChange={(event) => setDepartureDate(event.target.value)}
              required={!isCorrection}
              aria-invalid={Boolean(state.fieldErrors.departureDate)}
            />
            {isCorrection && departureDate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setDepartureDate('')}
              >
                Annuler le départ enregistré
              </Button>
            )}
          </FormField>

          <p className="rounded-lg bg-surface-muted px-3 py-2 text-sm text-secondary">
            {departureImpact(departureDate, businessDate, locale, isCorrection)}
          </p>

          {isCorrection && (
            <FormField
              label={
                <Label htmlFor="departure-correction-reason">
                  Motif de la correction
                </Label>
              }
              error={state.fieldErrors.correctionReason}
            >
              <Textarea
                id="departure-correction-reason"
                name="correctionReason"
                minLength={3}
                maxLength={250}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                required
                aria-invalid={Boolean(state.fieldErrors.correctionReason)}
              />
            </FormField>
          )}

          <div>
            <label
              htmlFor="confirm-non-deletion"
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border-default p-3 text-sm"
            >
              <Checkbox
                id="confirm-non-deletion"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked === true)}
                aria-invalid={Boolean(state.fieldErrors.confirmNonDeletion)}
              />
              <span>
                Je confirme que le dossier salarié ne sera pas supprimé et que
                cette action ne modifie pas ses accès utilisateur.
              </span>
            </label>
            {state.fieldErrors.confirmNonDeletion && (
              <p className="mt-1 text-sm text-status-danger" role="alert">
                {state.fieldErrors.confirmNonDeletion}
              </p>
            )}
          </div>

          {state.status === 'conflict' && !conflictDismissed && (
            <Alert
              tone="warning"
              icon={<AlertTriangle className="h-5 w-5" aria-hidden />}
            >
              <AlertTitle>Une version plus récente existe</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
              <Button
                type="button"
                variant="secondary"
                className="mt-3"
                onClick={loadCurrentVersion}
              >
                <RefreshCw className="h-4 w-4" aria-hidden />
                Recharger la version actuelle
              </Button>
            </Alert>
          )}

          {state.status === 'error' && (
            <p
              className="rounded-lg bg-status-danger-soft px-3 py-2 text-sm font-medium text-status-danger"
              role="alert"
            >
              {state.message}
            </p>
          )}
          {state.status === 'success' && (
            <p
              className="rounded-lg bg-status-success-soft px-3 py-2 text-sm font-medium text-status-success"
              role="status"
            >
              {state.message}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              {state.status === 'success' ? 'Fermer' : 'Annuler'}
            </Button>
            {state.status !== 'success' &&
              (state.status !== 'conflict' || conflictDismissed) && (
                <DepartureSubmitButton
                  ready={Boolean(idempotencyKey) && confirmed}
                  correction={isCorrection}
                />
              )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function departureImpact(
  departureDate: string,
  businessDate: string,
  locale: string,
  correction: boolean,
) {
  if (!departureDate) {
    return correction
      ? 'Le départ sera annulé. Le dossier redeviendra actif ou à venir selon sa date d’entrée.'
      : 'Choisissez le dernier jour travaillé.';
  }
  const formattedDate = formatEmployeeDate(departureDate, locale);
  if (departureDate > businessDate) {
    return `Le salarié restera actif jusqu’au ${formattedDate} inclus.`;
  }
  if (departureDate === businessDate) {
    return `Le salarié reste actif aujourd’hui et passera dans les anciens salariés demain.`;
  }
  return `Le salarié sera classé dans les anciens salariés, avec un dernier jour travaillé le ${formattedDate}.`;
}

function DepartureSubmitButton({
  ready,
  correction,
}: {
  ready: boolean;
  correction: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} disabled={!ready || pending}>
      <CalendarX2 className="h-4 w-4" aria-hidden />
      {correction ? 'Enregistrer la correction' : 'Confirmer le départ'}
    </Button>
  );
}
