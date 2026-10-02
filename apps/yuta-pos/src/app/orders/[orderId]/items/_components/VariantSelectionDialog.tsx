'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yuta/ui';
import { LoaderCircle, Minus, Plus, TriangleAlert } from 'lucide-react';
import type { ReactElement } from 'react';
import { useActionState, useEffect, useState } from 'react';
import {
  addConfiguredOrderItemAction,
  type AddConfiguredOrderItemActionState,
} from '../../../../actions';

type VariantOption = { code: string; label: string };

const initialActionState: AddConfiguredOrderItemActionState = {
  revision: 0,
  status: 'idle',
  message: null,
};

export function VariantSelectionDialog({
  orderId,
  itemId,
  itemName,
  priceLabel,
  variantOptions,
  requiredVariantQuantity,
  disabled,
  trigger,
}: {
  orderId: string;
  itemId: string;
  itemName: string;
  priceLabel: string;
  variantOptions: VariantOption[];
  requiredVariantQuantity: number;
  disabled: boolean;
  trigger: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [openedAtRevision, setOpenedAtRevision] = useState(0);
  const [state, action, pending] = useActionState(
    addConfiguredOrderItemAction,
    initialActionState,
  );
  const selectedVariants = variantOptions
    .map((option) => ({
      code: option.code,
      quantity: quantities[option.code] ?? 0,
    }))
    .filter(({ quantity }) => quantity > 0);
  const selectedQuantity = selectedVariants.reduce(
    (total, option) => total + option.quantity,
    0,
  );
  const complete = selectedQuantity === requiredVariantQuantity;
  const currentAttemptFinished = state.revision > openedAtRevision;

  useEffect(() => {
    if (open && currentAttemptFinished && state.status === 'success') {
      setOpen(false);
    }
  }, [currentAttemptFinished, open, state.status]);

  function changeQuantity(code: string, delta: number) {
    setQuantities((current) => {
      const currentQuantity = current[code] ?? 0;
      const currentTotal = Object.values(current).reduce(
        (total, quantity) => total + quantity,
        0,
      );
      const nextQuantity = Math.max(0, currentQuantity + delta);
      if (delta > 0 && currentTotal >= requiredVariantQuantity) {
        return current;
      }
      return { ...current, [code]: nextQuantity };
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setQuantities({});
          setOpenedAtRevision(state.revision);
        }
        if (!pending) setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild disabled={disabled}>
        {trigger}
      </DialogTrigger>
      <DialogContent
        className="max-h-[90dvh] overflow-y-auto sm:max-w-xl"
        closeClassName="h-11 w-11 p-0"
        closeLabel="Annuler la sélection"
      >
        <DialogHeader>
          <DialogTitle>Choisir les options</DialogTitle>
          <DialogDescription>
            {itemName} · {priceLabel}
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="mt-4 grid gap-5">
          <input type="hidden" name="orderId" value={orderId} />
          <input type="hidden" name="menuItemId" value={itemId} />
          <input
            type="hidden"
            name="selectedVariants"
            value={JSON.stringify(selectedVariants)}
          />

          <section className="grid gap-3" aria-labelledby={`options-${itemId}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 id={`options-${itemId}`} className="font-black">
                  Choisissez {requiredVariantQuantity} option
                  {requiredVariantQuantity > 1 ? 's' : ''}
                </h3>
                <p className="mt-1 text-sm font-semibold text-secondary">
                  Plusieurs choix identiques sont possibles.
                </p>
              </div>
              <span
                className="shrink-0 rounded-full bg-surface-muted px-3 py-1 text-sm font-black"
                aria-live="polite"
              >
                {selectedQuantity}/{requiredVariantQuantity}
              </span>
            </div>

            <div className="grid gap-2">
              {variantOptions.map((option) => {
                const quantity = quantities[option.code] ?? 0;
                return (
                  <div
                    key={option.code}
                    className="grid min-h-14 grid-cols-[minmax(0,1fr)_44px_32px_44px] items-center gap-2 rounded-xl border border-border-default bg-surface p-2"
                  >
                    <span className="min-w-0 pl-2 text-sm font-black">
                      {option.label}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-11 p-0"
                      aria-label={`Retirer ${option.label}`}
                      disabled={pending || quantity === 0}
                      onClick={() => changeQuantity(option.code, -1)}
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <span className="text-center font-black" aria-hidden="true">
                      {quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-11 p-0"
                      aria-label={`Ajouter ${option.label}`}
                      disabled={
                        pending || selectedQuantity >= requiredVariantQuantity
                      }
                      onClick={() => changeQuantity(option.code, 1)}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>

          {currentAttemptFinished &&
            state.status !== 'success' &&
            state.message && (
              <Alert tone="danger" role="alert">
                <TriangleAlert className="h-4 w-4" aria-hidden="true" />
                <AlertTitle>Ajout non confirmé</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                disabled={pending}
              >
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" size="lg" disabled={!complete || pending}>
              {pending ? (
                <>
                  <LoaderCircle
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Ajout...
                </>
              ) : (
                'Ajouter à la commande'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
