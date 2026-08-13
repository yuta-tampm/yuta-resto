'use client';

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
  Textarea,
} from '@yuta/ui';
import { AlertTriangle, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  createEmployeeAction,
  type CreateEmployeeActionState,
} from './actions';
import { formatEmployeeDate } from './salaries-model';

const initialCreateEmployeeActionState: CreateEmployeeActionState = {
  status: 'idle',
  message: null,
  fieldErrors: {},
  duplicateCandidates: [],
};

export function EmployeeCreateDialog({
  open,
  onOpenChange,
  locale,
}: {
  open: boolean;
  onOpenChange(open: boolean): void;
  locale: string;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(
    createEmployeeAction,
    initialCreateEmployeeActionState,
  );
  const [employmentTermType, setEmploymentTermType] = useState('indefinite');
  const [workTimeCategory, setWorkTimeCategory] = useState('full_time');
  const [givenNames, setGivenNames] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [position, setPosition] = useState('');
  const [qualification, setQualification] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [expectedEndDate, setExpectedEndDate] = useState('');
  const [duplicateReason, setDuplicateReason] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState('');

  useEffect(() => {
    if (open && !idempotencyKey) {
      setIdempotencyKey(crypto.randomUUID());
    }
  }, [idempotencyKey, open]);

  useEffect(() => {
    if (state.status === 'success') router.refresh();
  }, [router, state.status]);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setIdempotencyKey('');
      setEmploymentTermType('indefinite');
      setWorkTimeCategory('full_time');
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un salarié</DialogTitle>
          <DialogDescription>
            Créez le dossier minimum pour cet établissement. Les documents, la
            paie et les Formalités ne font pas partie de cette étape.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="mt-5 grid gap-5">
          <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
          <input
            type="hidden"
            name="confirmDuplicate"
            value={state.status === 'duplicate' ? 'true' : 'false'}
          />

          <section className="grid gap-4" aria-labelledby="employee-identity">
            <h3 id="employee-identity" className="font-bold">
              Identité minimale
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <EmployeeField
                id="employee-given-names"
                name="givenNames"
                label="Prénoms"
                error={state.fieldErrors.givenNames}
                autoComplete="given-name"
                value={givenNames}
                onValueChange={setGivenNames}
              />
              <EmployeeField
                id="employee-family-name"
                name="familyName"
                label="Nom"
                error={state.fieldErrors.familyName}
                autoComplete="family-name"
                value={familyName}
                onValueChange={setFamilyName}
              />
            </div>
          </section>

          <section className="grid gap-4" aria-labelledby="employee-employment">
            <h3 id="employee-employment" className="font-bold">
              Relation de travail
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <EmployeeField
                id="employee-position"
                name="position"
                label="Poste"
                error={state.fieldErrors.position}
                value={position}
                onValueChange={setPosition}
              />
              <EmployeeField
                id="employee-qualification"
                name="qualification"
                label="Qualification"
                error={state.fieldErrors.qualification}
                value={qualification}
                onValueChange={setQualification}
              />
              <FormField
                label={<Label htmlFor="employee-term">Type de contrat</Label>}
                error={state.fieldErrors.employmentTermType}
              >
                <Select
                  name="employmentTermType"
                  value={employmentTermType}
                  onValueChange={setEmploymentTermType}
                >
                  <SelectTrigger id="employee-term">
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
                  <Label htmlFor="employee-work-time">Temps de travail</Label>
                }
                error={state.fieldErrors.workTimeCategory}
              >
                <Select
                  name="workTimeCategory"
                  value={workTimeCategory}
                  onValueChange={setWorkTimeCategory}
                >
                  <SelectTrigger id="employee-work-time">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Temps plein</SelectItem>
                    <SelectItem value="part_time">Temps partiel</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField
                label={
                  <Label htmlFor="employee-entry-date">Date d’entrée</Label>
                }
                error={state.fieldErrors.entryDate}
              >
                <Input
                  id="employee-entry-date"
                  name="entryDate"
                  type="date"
                  value={entryDate}
                  onChange={(event) => setEntryDate(event.target.value)}
                  required
                />
              </FormField>
              {employmentTermType === 'fixed_term' && (
                <FormField
                  label={
                    <Label htmlFor="employee-end-date">Fin prévue du CDD</Label>
                  }
                  error={state.fieldErrors.expectedEndDate}
                >
                  <Input
                    id="employee-end-date"
                    name="expectedEndDate"
                    type="date"
                    value={expectedEndDate}
                    onChange={(event) => setExpectedEndDate(event.target.value)}
                    required
                  />
                </FormField>
              )}
            </div>
          </section>

          {state.status === 'duplicate' && (
            <Alert
              tone="warning"
              icon={<AlertTriangle className="h-5 w-5" aria-hidden />}
            >
              <AlertTitle>Vérifiez un possible doublon</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
              <ul className="mt-3 grid gap-2 text-sm">
                {state.duplicateCandidates.map((candidate) => (
                  <li key={candidate.id} className="rounded-lg bg-surface p-3">
                    <strong>{candidate.displayName}</strong> ·{' '}
                    {candidate.position}
                    <span className="block text-secondary">
                      Entrée : {formatEmployeeDate(candidate.entryDate, locale)}
                    </span>
                  </li>
                ))}
              </ul>
              <FormField
                className="mt-4"
                label={
                  <Label htmlFor="duplicate-override-reason">
                    Pourquoi créer un dossier distinct ?
                  </Label>
                }
                error={state.fieldErrors.duplicateOverrideReason}
              >
                <Textarea
                  id="duplicate-override-reason"
                  name="duplicateOverrideReason"
                  minLength={3}
                  maxLength={250}
                  value={duplicateReason}
                  onChange={(event) => setDuplicateReason(event.target.value)}
                  required
                />
              </FormField>
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
              onClick={() => handleOpenChange(false)}
            >
              {state.status === 'success' ? 'Fermer' : 'Annuler'}
            </Button>
            {state.status !== 'success' && (
              <CreateEmployeeSubmitButton
                ready={Boolean(idempotencyKey)}
                confirmDuplicate={state.status === 'duplicate'}
              />
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EmployeeField({
  id,
  name,
  label,
  error,
  autoComplete,
  value,
  onValueChange,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  autoComplete?: string;
  value: string;
  onValueChange(value: string): void;
}) {
  return (
    <FormField label={<Label htmlFor={id}>{label}</Label>} error={error}>
      <Input
        id={id}
        name={name}
        maxLength={120}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        required
        aria-invalid={Boolean(error)}
      />
    </FormField>
  );
}

function CreateEmployeeSubmitButton({
  ready,
  confirmDuplicate,
}: {
  ready: boolean;
  confirmDuplicate: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} disabled={!ready || pending}>
      <Save className="h-4 w-4" aria-hidden />
      {confirmDuplicate ? 'Confirmer la création' : 'Enregistrer'}
    </Button>
  );
}
