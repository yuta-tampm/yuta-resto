'use client';

import type {
  AllergySeverity,
  ItemVariantSnapshot,
  LocalInstructionSettings,
  LocalItemInstructionConfig,
  SelectedInstructionSnapshot,
} from '@yuta/contracts/local-pos';
import { IconButton, cn } from '@yuta/ui';
import { Minus, Plus, TriangleAlert } from 'lucide-react';
import {
  removePendingOrderItemAction,
  updateOrderItemQuantityAction,
} from '../../../../actions';
import { OrderItemNoteDialog } from './OrderItemNoteDialog';

export type OrderItemPresentation = {
  id: string;
  quantity: number;
  name: string;
  note: string | null;
  quickInstructions: SelectedInstructionSnapshot[];
  selectedVariants: ItemVariantSnapshot[];
  instructionConfig: LocalItemInstructionConfig & {
    variantOptions: Array<{ code: string; label: string }>;
  };
  orderingPolicy: 'merge' | 'separate';
  requiredVariantQuantity: number;
  hasAllergy: boolean;
  allergenCodes: string[];
  allergySeverity: AllergySeverity | null;
  allergyNote: string | null;
  allergyDisplay: string;
  totalLabel: string;
  isPending: boolean;
  requiresAttention: boolean;
  statusLabel: string;
};

type OrderItemDetailsProps = {
  item: OrderItemPresentation;
  orderId: string;
  canEditItems: boolean;
  allergyOptions: LocalInstructionSettings['allergenOptions'];
  truncateName?: boolean;
};

export function OrderItemDetails({
  item,
  orderId,
  canEditItems,
  allergyOptions,
  truncateName = false,
}: OrderItemDetailsProps) {
  return (
    <div className="min-w-0">
      <p className={cn('font-black', truncateName && 'truncate text-base')}>
        {item.name}
      </p>
      {item.note && (
        <p className="mt-1 text-xs font-semibold text-primary/55">
          Note: {item.note}
        </p>
      )}
      {item.quickInstructions.length > 0 && (
        <p className="mt-1 text-xs font-black text-status-info">
          {item.quickInstructions
            .map((instruction) => instruction.labelSnapshot)
            .join(' · ')}
        </p>
      )}
      {item.selectedVariants.length > 0 && (
        <p className="mt-1 text-xs font-black text-primary/65">
          Options:{' '}
          {item.selectedVariants
            .map((variant) => `${variant.quantity}× ${variant.labelSnapshot}`)
            .join(' · ')}
        </p>
      )}
      {item.hasAllergy && (
        <p className="mt-1 inline-flex items-start gap-1 rounded-md bg-status-danger-soft px-2 py-1 text-xs font-black text-status-danger">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {item.allergyDisplay}
        </p>
      )}
      <p className="mt-1 text-xs font-semibold text-primary/45">
        {item.statusLabel}
      </p>
      {item.isPending && canEditItems && (
        <OrderItemNoteDialog
          orderId={orderId}
          orderItemId={item.id}
          itemName={item.name}
          quantity={item.quantity}
          instructionConfig={item.instructionConfig}
          allergyOptions={allergyOptions}
          requiredVariantQuantity={item.requiredVariantQuantity}
          initialNote={item.note}
          initialQuickInstructions={item.quickInstructions}
          initialVariants={item.selectedVariants}
          initialHasAllergy={item.hasAllergy}
          initialAllergenCodes={item.allergenCodes}
          initialAllergySeverity={item.allergySeverity}
          initialAllergyNote={item.allergyNote}
          requiresAttention={item.requiresAttention}
        />
      )}
    </div>
  );
}

export function OrderItemQuantityControls({
  orderId,
  item,
  canEditItems,
}: {
  orderId: string;
  item: OrderItemPresentation;
  canEditItems: boolean;
}) {
  if (!canEditItems || !item.isPending) {
    return (
      <span className="min-w-6 text-center font-black">{item.quantity}</span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <form
        action={
          item.quantity === 1
            ? removePendingOrderItemAction
            : updateOrderItemQuantityAction
        }
      >
        <input type="hidden" name="orderId" value={orderId} />
        <input type="hidden" name="orderItemId" value={item.id} />
        {item.quantity > 1 && (
          <input type="hidden" name="quantity" value={item.quantity - 1} />
        )}
        <IconButton
          type="submit"
          variant="outline"
          size="md"
          className="h-11 w-11"
          aria-label="Retirer un article"
        >
          <Minus className="h-3.5 w-3.5" />
        </IconButton>
      </form>
      <span className="min-w-5 text-center font-black">{item.quantity}</span>
      {item.orderingPolicy !== 'separate' && (
        <form action={updateOrderItemQuantityAction}>
          <input type="hidden" name="orderId" value={orderId} />
          <input type="hidden" name="orderItemId" value={item.id} />
          <input type="hidden" name="quantity" value={item.quantity + 1} />
          <IconButton
            type="submit"
            variant="outline"
            size="md"
            className="h-11 w-11"
            aria-label="Ajouter un article"
          >
            <Plus className="h-3.5 w-3.5" />
          </IconButton>
        </form>
      )}
    </div>
  );
}
