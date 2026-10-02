'use client';

import {
  Button,
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormField,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yuta/ui';
import { Pencil, Plus, Power, PowerOff } from 'lucide-react';
import { useActionState, useEffect, useId, useRef, useState } from 'react';
import {
  createComboRuleAction,
  setComboRuleActiveAction,
  updateComboRuleAction,
} from '../actions';
import {
  ComboActionFeedback,
  ComboEditorFooter,
  ComboFeedbackDescription,
  initialComboActionState,
  useCloseComboDialogOnSuccess,
} from './ComboDialogSupport';
import type { ComboRule } from '../combo-model';

export function CreateComboRuleButton() {
  return <ComboRuleDialog />;
}

export function ComboRuleDialog({ rule }: { rule?: ComboRule }) {
  const [open, setOpen] = useState(false);
  const actionFunction = rule
    ? updateComboRuleAction.bind(null, rule.id)
    : createComboRuleAction;
  const [state, action, pending] = useActionState(
    actionFunction,
    initialComboActionState,
  );
  useCloseComboDialogOnSuccess(state, setOpen);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!pending || nextOpen) setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={rule ? 'outline' : 'primary'}
          size={rule ? 'sm' : 'md'}
          className={rule ? 'min-h-11 min-w-11' : 'min-h-11'}
          aria-label={rule ? `Modifier ${rule.name}` : 'Nouvelle formule'}
        >
          {rule ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {!rule && 'Nouvelle formule'}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden p-0 sm:max-h-[90dvh]">
        <DialogHeader className="shrink-0 px-4 pt-4 pr-12 sm:px-6 sm:pt-6 sm:pr-12">
          <DialogTitle>
            {rule ? `Modifier ${rule.name}` : 'Nouvelle formule'}
          </DialogTitle>
          <DialogDescription>
            {rule
              ? 'Modifiez les paramètres de la formule sans changer sa structure.'
              : 'Une nouvelle formule reste inactive jusqu’à ce que ses groupes soient prêts.'}
          </DialogDescription>
        </DialogHeader>
        <form
          action={action}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 py-4 sm:px-6">
            <ComboRuleFields rule={rule} />
            <ComboActionFeedback state={state} />
          </div>
          <ComboEditorFooter
            pending={pending}
            onCancel={() => setOpen(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ComboRuleFields({ rule }: { rule?: ComboRule }) {
  const fieldPrefix = useId();
  const [pricingMode, setPricingMode] = useState(rule?.pricingMode ?? 'fixed');

  return (
    <>
      <FormField label={<label htmlFor={`${fieldPrefix}-name`}>Nom</label>}>
        <Input
          id={`${fieldPrefix}-name`}
          name="name"
          defaultValue={rule?.name}
          maxLength={255}
          required
        />
      </FormField>
      <FormField
        label={
          <label htmlFor={`${fieldPrefix}-pricing-mode`}>Mode de prix</label>
        }
      >
        <input type="hidden" name="pricingMode" value={pricingMode} />
        <Select
          value={pricingMode}
          onValueChange={(value) =>
            setPricingMode(value as ComboRule['pricingMode'])
          }
        >
          <SelectTrigger id={`${fieldPrefix}-pricing-mode`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Prix fixe</SelectItem>
            <SelectItem value="base_item_plus_delta">
              Article de base + supplément
            </SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label={
            <label htmlFor={`${fieldPrefix}-fixed-price`}>Prix fixe (€)</label>
          }
        >
          <Input
            id={`${fieldPrefix}-fixed-price`}
            name="comboPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={
              rule ? (rule.comboPriceCents / 100).toFixed(2) : '0.00'
            }
            required
          />
        </FormField>
        <FormField
          label={
            <label htmlFor={`${fieldPrefix}-price-delta`}>
              Supplément au prix de base (€)
            </label>
          }
        >
          <Input
            id={`${fieldPrefix}-price-delta`}
            name="priceDelta"
            type="number"
            step="0.01"
            defaultValue={
              rule ? (rule.priceDeltaCents / 100).toFixed(2) : '0.00'
            }
            required
          />
        </FormField>
      </div>
      <FormField
        label={
          <label htmlFor={`${fieldPrefix}-base-group`}>
            Nom du groupe de prix de base
          </label>
        }
        hint="Requis uniquement pour le mode article de base + supplément."
      >
        <Input
          id={`${fieldPrefix}-base-group`}
          name="basePricingGroupName"
          defaultValue={rule?.basePricingGroupName ?? ''}
          maxLength={255}
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label={<label htmlFor={`${fieldPrefix}-priority`}>Priorité</label>}
        >
          <Input
            id={`${fieldPrefix}-priority`}
            name="priority"
            type="number"
            defaultValue={rule?.priority ?? 0}
            required
          />
        </FormField>
        <FormField
          label={
            <label htmlFor={`${fieldPrefix}-max-applications`}>
              Applications maximum
            </label>
          }
          hint="Vide = sans limite."
        >
          <Input
            id={`${fieldPrefix}-max-applications`}
            name="maxApplications"
            type="number"
            min={1}
            defaultValue={rule?.maxApplications ?? ''}
          />
        </FormField>
      </div>
    </>
  );
}

export function ToggleComboRuleDialog({ rule }: { rule: ComboRule }) {
  const formRef = useRef<HTMLFormElement>(null);
  const submissionRequestedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    setComboRuleActiveAction.bind(null, rule.id, !rule.isActive),
    initialComboActionState,
  );
  useCloseComboDialogOnSuccess(state, setOpen);
  useEffect(() => {
    if (!pending) submissionRequestedRef.current = false;
  }, [pending, state]);

  return (
    <>
      <form ref={formRef} action={action} />
      <Button
        type="button"
        variant={rule.isActive ? 'danger' : 'secondary'}
        size="sm"
        className="min-h-11 min-w-11"
        loading={pending}
        aria-label={`${rule.isActive ? 'Désactiver' : 'Activer'} ${rule.name}`}
        onClick={() => setOpen(true)}
      >
        {rule.isActive ? (
          <PowerOff className="h-4 w-4" />
        ) : (
          <Power className="h-4 w-4" />
        )}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!pending || nextOpen) setOpen(nextOpen);
        }}
        title={`${rule.isActive ? 'Désactiver' : 'Activer'} ${rule.name} ?`}
        description={
          <ComboFeedbackDescription
            text={
              rule.isActive
                ? 'La formule ne sera plus appliquée aux nouveaux calculs.'
                : 'La structure sera validée avant activation.'
            }
            error={state.error}
            recovery={state.recovery}
          />
        }
        confirmLabel={
          pending ? 'Traitement…' : rule.isActive ? 'Désactiver' : 'Activer'
        }
        cancelLabel="Annuler"
        tone={rule.isActive ? 'danger' : 'primary'}
        onConfirm={() => {
          if (pending || submissionRequestedRef.current) return;
          submissionRequestedRef.current = true;
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
