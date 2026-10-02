'use client';

import type { LocalUser } from '@yuta/contracts/local-pos';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  cn,
} from '@yuta/ui';
import {
  Bike,
  ClipboardCheck,
  PlusCircle,
  ShoppingBag,
  Utensils,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { createOrderAction, type CreateOrderActionState } from '../../actions';

type OrderEntryFormProps = {
  staffUsers: LocalUser[];
  defaultStaffUserId: string | undefined;
  loadFailed: boolean;
};

const orderTypes = [
  { value: 'dine_in', label: 'Sur place', icon: Utensils },
  { value: 'takeaway', label: 'A emporter', icon: ShoppingBag },
  { value: 'delivery', label: 'Livraison', icon: Bike },
] as const;

export function OrderEntryForm({
  staffUsers,
  defaultStaffUserId,
  loadFailed,
}: OrderEntryFormProps) {
  const router = useRouter();
  const hasStaffUsers = staffUsers.length > 0;
  const initialState: CreateOrderActionState = {
    revision: 0,
    status: 'idle',
    message: null,
    fieldErrors: {},
    values: {
      staffUserId: defaultStaffUserId ?? '',
      tableLabel: '',
      orderType: 'dine_in',
      note: '',
    },
  };
  const [state, formAction, actionPending] = useActionState(
    createOrderAction,
    initialState,
  );
  const [refreshPending, startRefresh] = useTransition();
  const [staffUserId, setStaffUserId] = useState(defaultStaffUserId ?? '');
  const [tableLabel, setTableLabel] = useState('');
  const [orderType, setOrderType] = useState('dine_in');
  const [note, setNote] = useState('');
  const formDisabled = loadFailed || !hasStaffUsers || actionPending;

  useEffect(() => {
    if (
      staffUserId &&
      staffUsers.some((staffUser) => staffUser.id === staffUserId)
    ) {
      return;
    }
    setStaffUserId(defaultStaffUserId ?? '');
  }, [defaultStaffUserId, staffUserId, staffUsers]);

  function fieldError(
    field: keyof CreateOrderActionState['fieldErrors'],
    currentValue: string,
  ): string | undefined {
    if (state.values[field] !== currentValue) return undefined;
    return state.fieldErrors[field];
  }

  const staffError = fieldError('staffUserId', staffUserId);
  const tableError = fieldError('tableLabel', tableLabel);
  const orderTypeError = fieldError('orderType', orderType);
  const noteError = fieldError('note', note);

  function refreshLocalUsers() {
    startRefresh(() => router.refresh());
  }

  return (
    <section className="mx-auto grid w-full max-w-2xl content-start">
      <Card
        padding="none"
        className="overflow-hidden rounded-xl border-border-default shadow-none"
      >
        <div className="flex items-center gap-3 border-b border-border-default px-5 py-4 sm:px-6">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-status-success/10 text-status-success">
            <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-black tracking-normal">
            Nouvelle commande
          </h2>
        </div>

        <form action={formAction} className="grid gap-5 p-5 sm:p-6">
          {loadFailed && (
            <Alert tone="danger">
              <AlertDescription>
                Impossible de charger les employes depuis le service local.
              </AlertDescription>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                loading={refreshPending}
                onClick={refreshLocalUsers}
              >
                {refreshPending ? 'Actualisation...' : 'Actualiser'}
              </Button>
            </Alert>
          )}

          {!loadFailed && !hasStaffUsers && (
            <Alert tone="danger">
              <AlertDescription>
                Aucun employe actif disponible pour creer une commande.
              </AlertDescription>
            </Alert>
          )}

          {state.message && (
            <Alert tone="danger" aria-live="polite">
              <AlertDescription>{state.message}</AlertDescription>
              {state.status === 'staff_unavailable' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  loading={refreshPending}
                  onClick={refreshLocalUsers}
                >
                  {refreshPending
                    ? 'Actualisation...'
                    : 'Actualiser les employes'}
                </Button>
              )}
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="staffUserId">Employe</Label>
            <Select
              name="staffUserId"
              value={staffUserId}
              onValueChange={setStaffUserId}
              required
              disabled={formDisabled}
            >
              <SelectTrigger
                id="staffUserId"
                className="h-12 rounded-lg"
                aria-invalid={Boolean(staffError)}
                aria-describedby={staffError ? 'staffUserId-error' : undefined}
              >
                <SelectValue placeholder="Choisir employe" />
              </SelectTrigger>
              <SelectContent>
                {staffUsers.map((staffUser) => (
                  <SelectItem key={staffUser.id} value={staffUser.id}>
                    {staffUser.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {staffError && (
              <p
                id="staffUserId-error"
                className="text-sm font-semibold text-status-danger"
              >
                {staffError}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tableLabel">Table / Repere</Label>
            <Input
              id="tableLabel"
              name="tableLabel"
              placeholder="Terrasse 5"
              autoComplete="off"
              required
              size="lg"
              value={tableLabel}
              onChange={(event) => setTableLabel(event.target.value)}
              disabled={formDisabled}
              aria-invalid={Boolean(tableError)}
              aria-describedby={tableError ? 'tableLabel-error' : undefined}
            />
            {tableError && (
              <p
                id="tableLabel-error"
                className="text-sm font-semibold text-status-danger"
              >
                {tableError}
              </p>
            )}
          </div>

          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold">Type de commande</legend>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {orderTypes.map((orderTypeOption) => {
                const OrderTypeIcon = orderTypeOption.icon;

                return (
                  <label key={orderTypeOption.value} className="cursor-pointer">
                    <input
                      key={`${orderTypeOption.value}-${state.revision}`}
                      type="radio"
                      name="orderType"
                      value={orderTypeOption.value}
                      checked={orderTypeOption.value === orderType}
                      onChange={() => setOrderType(orderTypeOption.value)}
                      className="peer sr-only"
                      required
                      disabled={formDisabled}
                      aria-invalid={Boolean(orderTypeError)}
                      aria-describedby={
                        orderTypeError ? 'orderType-error' : undefined
                      }
                    />
                    <span className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg border border-border-default bg-white px-2 py-2 text-center text-sm font-black transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-border-focus peer-focus-visible:ring-offset-2 peer-checked:border-status-success peer-checked:bg-status-success peer-checked:text-white sm:flex-row sm:gap-2 sm:px-3">
                      <OrderTypeIcon
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                      />
                      {orderTypeOption.label}
                    </span>
                  </label>
                );
              })}
            </div>
            {orderTypeError && (
              <p
                id="orderType-error"
                className="text-sm font-semibold text-status-danger"
              >
                {orderTypeError}
              </p>
            )}
          </fieldset>

          <div className="grid gap-2">
            <Label htmlFor="note">Note (optionnel)</Label>
            <Textarea
              id="note"
              name="note"
              placeholder="Ex: Anniversaire, demande generale..."
              className={cn(
                'min-h-28 sm:min-h-24',
                noteError && 'border-status-danger',
              )}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              disabled={formDisabled}
              aria-invalid={Boolean(noteError)}
              aria-describedby={noteError ? 'note-error' : undefined}
            />
            {noteError && (
              <p
                id="note-error"
                className="text-sm font-semibold text-status-danger"
              >
                {noteError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="min-h-14 justify-center bg-primary text-white hover:bg-primary/90"
            disabled={formDisabled}
            loading={actionPending}
          >
            <PlusCircle className="h-5 w-5" aria-hidden="true" />
            {actionPending ? 'Creation en cours...' : 'Creer la commande'}
          </Button>
        </form>
      </Card>
    </section>
  );
}
