'use client';

import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';
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
} from './actions';

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
}: {
  employee: PersonnelEmployeeSummary;
  open: boolean;
  onOpenChange(open: boolean): void;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(
    updateEmployeeAction,
    initialUpdateEmployeeActionState,
  );
  const [values, setValues] = useState(() => editableValues(employee));
  const [revision, setRevision] = useState(employee.revision);
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [conflictDismissed, setConflictDismissed] = useState(false);

  useEffect(() => {
    if (state.status === 'success') router.refresh();
    if (state.status === 'conflict') setConflictDismissed(false);
  }, [router, state.status]);

  useEffect(() => {
    if (open && !idempotencyKey) setIdempotencyKey(crypto.randomUUID());
  }, [idempotencyKey, open]);

  function setValue(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function loadCurrentVersion() {
    if (!state.currentEmployee) return;
    setValues(editableValues(state.currentEmployee));
    setRevision(state.currentEmployee.revision);
    setIdempotencyKey(crypto.randomUUID());
    setConflictDismissed(true);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onValueChange={(value) => setValue('givenNames', value)}
              />
              <EditField
                id="edit-family-name"
                name="familyName"
                label="Nom"
                value={values.familyName}
                error={state.fieldErrors.familyName}
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
                onValueChange={(value) => setValue('position', value)}
              />
              <EditField
                id="edit-qualification"
                name="qualification"
                label="Qualification"
                value={values.qualification}
                error={state.fieldErrors.qualification}
                onValueChange={(value) => setValue('qualification', value)}
              />
              <FormField
                label={<Label htmlFor="edit-term">Type de contrat</Label>}
                error={state.fieldErrors.employmentTermType}
              >
                <Select
                  name="employmentTermType"
                  value={values.employmentTermType}
                  onValueChange={(value) =>
                    setValues((current) => ({
                      ...current,
                      employmentTermType: value as 'indefinite' | 'fixed_term',
                      expectedEndDate:
                        value === 'indefinite' ? '' : current.expectedEndDate,
                    }))
                  }
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
              )}
            </div>
          </section>

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
                <UpdateEmployeeSubmitButton ready={Boolean(idempotencyKey)} />
              )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function editableValues(employee: PersonnelEmployeeSummary) {
  return {
    givenNames: employee.givenNames,
    familyName: employee.familyName,
    position: employee.position,
    qualification: employee.qualification,
    employmentTermType: employee.employmentTermType,
    expectedEndDate: employee.expectedEndDate ?? '',
    workTimeCategory: employee.workTimeCategory,
    entryDate: employee.entryDate,
  };
}

function EditField({
  id,
  name,
  label,
  value,
  error,
  onValueChange,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
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
