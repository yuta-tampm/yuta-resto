'use client';

import type {
  PersonnelRegisterCandidate,
  PersonnelRegisterEntry,
} from '@yuta/contracts/personnel';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@yuta/ui';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  correctPersonnelRegisterAction,
  inscribePersonnelRegisterAction,
  type PersonnelRegisterActionState,
} from '../actions';
import {
  BaseFacts,
  ConditionalMentionFields,
  CorrectionJustificationFields,
  EmploymentCorrectionFields,
  LegalIdentityFields,
} from './personnel-register-fields';

const initialState: PersonnelRegisterActionState = {
  status: 'idle',
  message: null,
  fieldErrors: {},
};

type RegisterDialogProps =
  | {
      mode: 'inscribe';
      candidate: PersonnelRegisterCandidate;
      open: boolean;
      onOpenChange(open: boolean): void;
    }
  | {
      mode: 'correct';
      entry: PersonnelRegisterEntry;
      businessDate: string;
      open: boolean;
      onOpenChange(open: boolean): void;
    };

export function RegisterDialog(props: RegisterDialogProps) {
  const router = useRouter();
  const action =
    props.mode === 'inscribe'
      ? inscribePersonnelRegisterAction
      : correctPersonnelRegisterAction;
  const [state, formAction] = useActionState(action, initialState);
  const source =
    props.mode === 'inscribe'
      ? candidateFacts(props.candidate)
      : props.entry.facts;
  const [operationId, setOperationId] = useState('');
  useEffect(() => {
    if (!operationId) setOperationId(crypto.randomUUID());
  }, [operationId]);
  useEffect(() => {
    if (state.status === 'success') {
      router.refresh();
      props.onOpenChange(false);
    }
  }, [props, router, state.status]);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {props.mode === 'inscribe'
              ? 'Vérifier et inscrire le salarié'
              : `Corriger l’inscription n° ${props.entry.sequence}`}
          </DialogTitle>
          <DialogDescription>
            {props.mode === 'inscribe'
              ? 'La première inscription reçoit un numéro définitif. Vérifiez les mentions avant de confirmer.'
              : 'La valeur précédente reste conservée. Indiquez la date d’effet et la raison.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="mt-5 grid gap-6">
          <input type="hidden" name="operationId" value={operationId} />
          {props.mode === 'inscribe' ? (
            <input
              type="hidden"
              name="employeeId"
              value={props.candidate.employeeId}
            />
          ) : (
            <>
              <input type="hidden" name="entryId" value={props.entry.id} />
              <input
                type="hidden"
                name="expectedRevision"
                value={props.entry.revision}
              />
            </>
          )}
          {props.mode === 'inscribe' ? (
            <>
              <BaseFacts facts={source} />
              <Card variant="muted">
                <p className="font-bold">
                  {source.givenNames} {source.familyName}
                </p>
                <p className="mt-1 text-sm text-secondary">
                  {source.position} · {source.qualification} · entrée le{' '}
                  {source.entryDate}
                </p>
              </Card>
            </>
          ) : (
            <EmploymentCorrectionFields facts={source} />
          )}
          {state.message && (
            <Alert tone={state.status === 'success' ? 'success' : 'danger'}>
              <AlertTitle>
                {state.status === 'conflict'
                  ? 'Actualisation requise'
                  : 'Enregistrement'}
              </AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <LegalIdentityFields facts={source} />
          <ConditionalMentionFields facts={source} />
          {props.mode === 'correct' && (
            <CorrectionJustificationFields businessDate={props.businessDate} />
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => props.onOpenChange(false)}
            >
              Annuler
            </Button>
            <SubmitButton
              label={
                props.mode === 'inscribe'
                  ? 'Confirmer l’inscription'
                  : 'Enregistrer la correction'
              }
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function candidateFacts(
  candidate: PersonnelRegisterCandidate,
): PersonnelRegisterEntry['facts'] {
  return {
    ...candidate,
    nationalityCode: 'FR',
    nationalityLabel: '',
    birthDate: '',
    sex: 'F',
    protectedAuthorization: {
      required: false,
      authorizationDate: null,
      requestDate: null,
    },
    workAuthorization: { required: false, titleType: null, orderNumber: null },
    temporaryWorkCompany: null,
    employerGroup: null,
    specialContract: 'none',
  };
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Enregistrement…' : label}
    </Button>
  );
}
