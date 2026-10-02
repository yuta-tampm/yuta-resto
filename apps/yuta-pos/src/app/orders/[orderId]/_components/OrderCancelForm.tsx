'use client';

import {
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
import { Lock, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { cancelOrderAction } from '../../../actions';

export function OrderCancelForm({
  orderId,
  disabled,
}: {
  orderId: string;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);

  async function confirmCancel(formData: FormData) {
    await cancelOrderAction(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="danger"
          className="min-h-12 w-full justify-center border border-status-danger bg-white text-action-danger hover:bg-surface-muted"
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
          Annuler la commande
          {disabled && <Lock className="ml-auto h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Annuler la commande ?</DialogTitle>
          <DialogDescription>
            La commande et ses articles en cours seront annulés. Cette action
            est définitive.
          </DialogDescription>
        </DialogHeader>
        <form action={confirmCancel}>
          <input type="hidden" name="orderId" value={orderId} />
          <DialogFooter className="mt-4">
            <CancelDialogActions />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CancelDialogActions() {
  const { pending } = useFormStatus();

  return (
    <>
      <DialogClose asChild>
        <Button
          type="button"
          variant="secondary"
          className="min-h-11"
          disabled={pending}
        >
          Retour
        </Button>
      </DialogClose>
      <Button
        type="submit"
        variant="danger"
        className="min-h-11"
        loading={pending}
      >
        {pending ? 'Annulation…' : 'Confirmer l’annulation'}
      </Button>
    </>
  );
}
