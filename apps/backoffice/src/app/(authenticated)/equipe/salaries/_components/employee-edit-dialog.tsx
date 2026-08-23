'use client';

import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Checkbox,
  ConfirmDialog,
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
import { AlertTriangle, RefreshCw, Save } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  updateEmployeeAction,
  type UpdateEmployeeActionState,
} from '../actions';
import {
  fixedTermReasonOptions,
  splitContractWeeklyMinutes,
} from '../_lib/employee-employment';
import { hasEmployeeEditUnsavedChanges } from '../_lib/employee-edit-flow';

const initialUpdateEmployeeActionState: UpdateEmployeeActionState = {
  status: 'idle',
  message: null,
  fieldErrors: {},
  currentEmployee: null,
};

export function EmployeeEditDialog({
  employee,
  open,
  onOpenChange,
  onSaved,
}: {
  employee: PersonnelEmployeeSummary;
  open: boolean;
  onOpenChange(open: boolean): void;
  onSaved(employee: PersonnelEmployeeSummary, message: string | null): void;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(
    updateEmployeeAction,
    initialUpdateEmployeeActionState,
  );
  const [values, setValues] = useState(() => editableValues(employee));
  const [loadedValues, setLoadedValues] = useState(() =>
    editableValues(employee),
  );
  const [revision, setRevision] = useState(employee.revision);
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [conflictDismissed, setConflictDismissed] = useState(false);
  const [loadedFixedTermReasonCode, setLoadedFixedTermReasonCode] = useState(
    employee.fixedTermReasonCode,
  );
  const [confirmFixedTermReasonClear, setConfirmFixedTermReasonClear] =
    useState(false);
  const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
  const hasUnsavedChanges = hasEmployeeEditUnsavedChanges(loadedValues, values);
  const needsFixedTermReasonClearConfirmation =
    loadedFixedTermReasonCode !== null &&
    values.employmentTermType === 'indefinite';

  useEffect(() => {
    if (state.status === 'success' && state.currentEmployee) {
      onSaved(state.currentEmployee, state.message);
      router.refresh();
    }
    if (state.status === 'conflict') setConflictDismissed(false);
  }, [onSaved, router, state.currentEmployee, state.status]);

  useEffect(() => {
    if (open && !idempotencyKey) setIdempotencyKey(crypto.randomUUID());
  }, [idempotencyKey, open]);

  function setValue(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function loadCurrentVersion() {
    if (!state.currentEmployee) return;
    const currentValues = editableValues(state.currentEmployee);
    setValues(currentValues);
    setLoadedValues(currentValues);
    setRevision(state.currentEmployee.revision);
    setLoadedFixedTermReasonCode(state.currentEmployee.fixedTermReasonCode);
    setConfirmFixedTermReasonClear(false);
    setIdempotencyKey(crypto.randomUUID());
    setConflictDismissed(true);
  }

  function closeImmediately() {
    setDiscardConfirmationOpen(false);
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      onOpenChange(true);
      return;
    }
    if (state.status !== 'success' && hasUnsavedChanges) {
      setDiscardConfirmationOpen(true);
      return;
    }
    closeImmediately();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le dossier salarié</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations minimales. Le départ, les documents,
            la paie et les Formalités restent hors de cette étape.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="mt-5 grid gap-5">
          <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
          <input type="hidden" name="employeeId" value={employee.id} />
          <input type="hidden" name="expectedRevision" value={revision} />
          <input
            type="hidden"
            name="confirmFixedTermReasonClear"
            value={confirmFixedTermReasonClear ? 'true' : 'false'}
          />

          <section className="grid gap-4" aria-labelledby="edit-identity">
            <h3 id="edit-identity" className="font-bold">
              Identité minimale
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <EditField
                id="edit-given-names"
                name="givenNames"
                label="Prénoms"
                value={values.givenNames}
                error={state.fieldErrors.givenNames}
                autoFocus={
                  employee.completenessReasons[0] === 'given_names_missing'
                }
                onValueChange={(value) => setValue('givenNames', value)}
              />
              <EditField
                id="edit-family-name"
                name="familyName"
                label="Nom"
                value={values.familyName}
                error={state.fieldErrors.familyName}
                autoFocus={
                  employee.completenessReasons[0] === 'family_name_missing'
                }
                onValueChange={(value) => setValue('familyName', value)}
              />
            </div>
          </section>

          <section className="grid gap-4" aria-labelledby="edit-employment">
            <h3 id="edit-employment" className="font-bold">
              Relation de travail
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <EditField
                id="edit-position"
                name="position"
                label="Poste"
                value={values.position}
                error={state.fieldErrors.position}
                autoFocus={
                  employee.completenessReasons[0] === 'position_missing'
                }
                onValueChange={(value) => setValue('position', value)}
              />
              <EditField
                id="edit-qualification"
                name="qualification"
                label="Qualification"
                value={values.qualification}
                error={state.fieldErrors.qualification}
                autoFocus={
                  employee.completenessReasons[0] === 'qualification_missing'
                }
                onValueChange={(value) => setValue('qualification', value)}
              />
              <FormField
                label={<Label htmlFor="edit-term">Type de contrat</Label>}
                error={state.fieldErrors.employmentTermType}
              >
                <Select
                  name="employmentTermType"
                  value={values.employmentTermType}
                  onValueChange={(value) => {
                    setConfirmFixedTermReasonClear(false);
                    setValues((current) => ({
                      ...current,
                      employmentTermType: value as 'indefinite' | 'fixed_term',
                      expectedEndDate:
                        value === 'indefinite' ? '' : current.expectedEndDate,
                      fixedTermReasonCode:
                        value === 'indefinite'
                          ? ''
                          : current.fixedTermReasonCode,
                    }));
                  }}
                >
                  <SelectTrigger id="edit-term">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indefinite">CDI</SelectItem>
                    <SelectItem value="fixed_term">CDD</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField
                label={
                  <Label htmlFor="edit-weekly-hours">
                    Durée hebdomadaire contractuelle
                  </Label>
                }
                error={state.fieldErrors.contractWeeklyMinutes}
              >
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    id="edit-weekly-hours"
                    name="contractWeeklyHours"
                    type="number"
                    min="0"
                    max="48"
                    inputMode="numeric"
                    value={values.contractWeeklyHours}
                    onChange={(event) =>
                      setValue('contractWeeklyHours', event.target.value)
                    }
                    aria-label="Heures par semaine"
                  />
                  <Input
                    name="contractWeeklyMinuteRemainder"
                    type="number"
                    min="0"
                    max="59"
                    inputMode="numeric"
                    value={values.contractWeeklyMinuteRemainder}
                    onChange={(event) =>
                      setValue(
                        'contractWeeklyMinuteRemainder',
                        event.target.value,
                      )
                    }
                    aria-label="Minutes par semaine"
                  />
                </div>
                <p className="mt-1 text-xs text-secondary">
                  Heures · Minutes. Laissez vide si l’information est inconnue.
                </p>
              </FormField>
              <FormField
                label={<Label htmlFor="edit-work-time">Temps de travail</Label>}
                error={state.fieldErrors.workTimeCategory}
              >
                <Select
                  name="workTimeCategory"
                  value={values.workTimeCategory}
                  onValueChange={(value) => setValue('workTimeCategory', value)}
                >
                  <SelectTrigger id="edit-work-time">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Temps plein</SelectItem>
                    <SelectItem value="part_time">Temps partiel</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField
                label={<Label htmlFor="edit-entry-date">Date d’entrée</Label>}
                error={state.fieldErrors.entryDate}
              >
                <Input
                  id="edit-entry-date"
                  name="entryDate"
                  type="date"
                  value={values.entryDate}
                  onChange={(event) =>
                    setValue('entryDate', event.target.value)
                  }
                  required
                />
              </FormField>
              {values.employmentTermType === 'fixed_term' && (
                <>
                  <FormField
                    label={
                      <Label htmlFor="edit-end-date">Fin prévue du CDD</Label>
                    }
                    error={state.fieldErrors.expectedEndDate}
                  >
                    <Input
                      id="edit-end-date"
                      name="expectedEndDate"
                      type="date"
                      value={values.expectedEndDate}
                      onChange={(event) =>
                        setValue('expectedEndDate', event.target.value)
                      }
                      required
                    />
                  </FormField>
                  <FormField
                    label={
                      <Label htmlFor="edit-fixed-term-reason">
                        Motif du CDD
                      </Label>
                    }
                    error={state.fieldErrors.fixedTermReasonCode}
                  >
                    <Select
                      name="fixedTermReasonCode"
                      value={values.fixedTermReasonCode}
                      onValueChange={(value) =>
                        setValue('fixedTermReasonCode', value)
                      }
                    >
                      <SelectTrigger id="edit-fixed-term-reason">
                        <SelectValue placeholder="Choisir un motif" />
                      </SelectTrigger>
                      <SelectContent>
                        {fixedTermReasonOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </>
              )}
            </div>
          </section>

          {needsFixedTermReasonClearConfirmation && (
            <div>
              <label
                htmlFor="confirm-fixed-term-reason-clear"
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border-default p-3 text-sm"
              >
                <Checkbox
                  id="confirm-fixed-term-reason-clear"
                  checked={confirmFixedTermReasonClear}
                  onCheckedChange={(checked) =>
                    setConfirmFixedTermReasonClear(checked === true)
                  }
                  aria-invalid={Boolean(
                    state.fieldErrors.confirmFixedTermReasonClear,
                  )}
                />
                <span>
                  Je confirme le passage en CDI et la suppression du motif CDD
                  enregistré.
                </span>
              </label>
              {state.fieldErrors.confirmFixedTermReasonClear && (
                <p className="mt-1 text-sm text-status-danger" role="alert">
                  {state.fieldErrors.confirmFixedTermReasonClear}
                </p>
              )}
            </div>
          )}

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
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOpenChange(false)}
            >
              Annuler
            </Button>
            {state.status !== 'success' &&
              (state.status !== 'conflict' || conflictDismissed) && (
                <UpdateEmployeeSubmitButton
                  ready={
                    Boolean(idempotencyKey) &&
                    (!needsFixedTermReasonClearConfirmation ||
                      confirmFixedTermReasonClear)
                  }
                />
              )}
          </DialogFooter>
        </form>
      </DialogContent>
      <ConfirmDialog
        open={discardConfirmationOpen}
        onOpenChange={setDiscardConfirmationOpen}
        title="Abandonner les modifications ?"
        description="Les modifications non enregistrées seront perdues."
        confirmLabel="Abandonner"
        cancelLabel="Continuer la modification"
        onConfirm={closeImmediately}
      />
    </Dialog>
  );
}

function editableValues(employee: PersonnelEmployeeSummary) {
  const weeklyDuration = splitContractWeeklyMinutes(
    employee.contractWeeklyMinutes,
  );
  return {
    givenNames: employee.givenNames,
    familyName: employee.familyName,
    position: employee.position,
    qualification: employee.qualification,
    employmentTermType: employee.employmentTermType,
    expectedEndDate: employee.expectedEndDate ?? '',
    fixedTermReasonCode: employee.fixedTermReasonCode ?? '',
    workTimeCategory: employee.workTimeCategory,
    contractWeeklyHours: weeklyDuration.hours,
    contractWeeklyMinuteRemainder: weeklyDuration.minutes,
    entryDate: employee.entryDate,
  };
}

function EditField({
  id,
  name,
  label,
  value,
  error,
  autoFocus = false,
  onValueChange,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  autoFocus?: boolean;
  onValueChange(value: string): void;
}) {
  return (
    <FormField label={<Label htmlFor={id}>{label}</Label>} error={error}>
      <Input
        id={id}
        name={name}
        maxLength={120}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        required
        autoFocus={autoFocus}
        aria-invalid={Boolean(error)}
      />
    </FormField>
  );
}

function UpdateEmployeeSubmitButton({ ready }: { ready: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} disabled={!ready || pending}>
      <Save className="h-4 w-4" aria-hidden />
      Enregistrer les modifications
    </Button>
  );
}
