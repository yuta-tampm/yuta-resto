'use client';

import type { LocalInstructionSettings } from '@yuta/contracts/local-pos';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  cn,
} from '@yuta/ui';
import { List } from 'lucide-react';
import { SendToKitchenButton } from '../../../_components/SendToKitchenButton';
import {
  OrderItemDetails,
  OrderItemQuantityControls,
  type OrderItemPresentation,
} from './OrderItemPresentation';

type MobileOrderDialogProps = {
  items: OrderItemPresentation[];
  subtotalLabel: string;
  discountLabel: string;
  totalLabel: string;
  orderId: string;
  canEditItems: boolean;
  canSendToKitchen: boolean;
  sendIdempotencyKey: string;
  hasAllergy: boolean;
  allergyNote: string | null;
  allergyAcknowledged: boolean;
  itemAllergyWarnings: Array<{
    itemName: string;
    allergyNote: string;
  }>;
  allergyOptions: LocalInstructionSettings['allergenOptions'];
};

export function MobileOrderDialog({
  items,
  subtotalLabel,
  discountLabel,
  totalLabel,
  orderId,
  canEditItems,
  canSendToKitchen,
  sendIdempotencyKey,
  hasAllergy,
  allergyNote,
  allergyAcknowledged,
  itemAllergyWarnings,
  allergyOptions,
}: MobileOrderDialogProps) {
  return (
    <Dialog>
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[1600px] -translate-x-1/2 border-t border-border-default bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
        <MobileOrderDialogTrigger
          itemCount={items.length}
          totalLabel={totalLabel}
        />
      </div>

      <DialogContent className="bottom-0 left-0 top-auto flex max-h-[92dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-b-none rounded-t-2xl p-0 lg:hidden">
        <DialogHeader className="shrink-0 border-b border-border-default px-5 py-5 pr-12 text-left">
          <DialogTitle className="text-lg font-black">
            Commande actuelle
          </DialogTitle>
          <DialogDescription>
            {items.length} article{items.length === 1 ? '' : 's'}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5">
          {items.length === 0 ? (
            <p className="my-5 rounded-lg border border-border-default bg-canvas p-3 text-sm font-semibold text-primary/55">
              Aucun article pour le moment.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'grid gap-1 border-b border-border-default px-3 py-4 last:border-b-0',
                  item.requiresAttention &&
                    'rounded-lg border border-status-danger-border bg-status-danger-soft',
                )}
              >
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                  <OrderItemQuantityControls
                    orderId={orderId}
                    item={item}
                    canEditItems={canEditItems}
                  />
                  <OrderItemDetails
                    item={item}
                    orderId={orderId}
                    canEditItems={canEditItems}
                    allergyOptions={allergyOptions}
                  />
                  <span className="font-black">{item.totalLabel}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid shrink-0 gap-3 border-t border-border-default bg-white px-5 py-4">
          <AmountRow label="Sous-total" value={subtotalLabel} />
          <AmountRow label="Remise" value={discountLabel} />
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-lg font-black">Total</span>
            <span className="text-xl font-black">{totalLabel}</span>
          </div>
          <SendToKitchenButton
            orderId={orderId}
            idempotencyKey={sendIdempotencyKey}
            disabled={!canSendToKitchen}
            hasAllergy={hasAllergy}
            allergyNote={allergyNote}
            allergyAcknowledged={allergyAcknowledged}
            itemAllergyWarnings={itemAllergyWarnings}
            label="Envoyer en cuisine"
            icon="chef"
            variant="primary"
            className="h-11"
            fullWidth
            showSuccessOnCompletion
          />
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="mt-1 h-11 w-full"
            >
              Fermer
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MobileOrderDialogTrigger({
  itemCount,
  totalLabel,
}: {
  itemCount: number;
  totalLabel: string;
}) {
  return (
    <DialogTrigger asChild>
      <Button
        type="button"
        variant="primary"
        className="h-14 w-full justify-between rounded-lg px-4"
      >
        <span className="inline-flex items-center gap-2 font-black">
          <List className="h-4 w-4" />
          Voir commande ({itemCount})
        </span>
        <span className="font-black">{totalLabel}</span>
      </Button>
    </DialogTrigger>
  );
}

function AmountRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="font-semibold text-primary/60">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}
