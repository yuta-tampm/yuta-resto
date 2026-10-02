import { formatEuros } from '@yuta/core';
import { Badge, Button, Card, Separator } from '@yuta/ui';
import { v7 as uuidv7 } from 'uuid';
import {
  cancelOrderSplitAction,
  createChecksByItemsAction,
  payFullOrderAction,
  splitOrderEquallyAction,
} from '../../../actions';
import { PosPageShell } from '../../../../components/pos/PosPageShell';
import { AllergyAlert } from '../../../../components/orders/AllergyAlert';
import { CheckPaymentList } from './_components/CheckPaymentList';
import { EqualSplitDialogContent } from './_components/EqualSplitDialogContent';
import { ItemSplitDialogContent } from './_components/ItemSplitDialogContent';
import { PaymentCaptureForm } from './_components/PaymentCaptureForm';
import { PaymentChoiceDialogs } from './_components/PaymentChoiceDialogs';
import { PaymentSummaryCard } from './_components/PaymentSummaryCard';
import {
  getInitialItemSplitState,
  paymentErrorMessage,
  toItemSplitComboRules,
  toItemSplitItems,
} from './_lib/payment-view';
import { posApi } from '../../../../lib/pos-api';

type PaymentPageProps = {
  params: Promise<{
    orderId: string;
  }>;
  searchParams: Promise<{
    error?: string;
    itemSplitError?: string;
    paymentDialog?: string;
  }>;
};

export default async function PaymentPage({
  params,
  searchParams,
}: PaymentPageProps) {
  const { orderId } = await params;
  const { error, itemSplitError, paymentDialog } = await searchParams;
  const { order, activeComboRules } = await posApi.getPaymentViewData(orderId);

  const paidCents = order.payments
    .filter((payment) => payment.status === 'paid')
    .reduce((total, payment) => total + payment.amountCents, 0);
  const activeOrderItems = order.items.filter(
    (item) => item.status !== 'cancelled',
  );
  const cancelledOrderItems = order.items.filter(
    (item) => item.status === 'cancelled',
  );
  const remainingCents = Math.max(0, order.totalCents - paidCents);
  const equalChecks = order.checks.filter(
    (check) => check.splitMode === 'equal' && check.status !== 'void',
  );
  const itemChecks = order.checks.filter(
    (check) => check.splitMode === 'items' && check.status !== 'void',
  );
  const splitChecks = [...equalChecks, ...itemChecks];
  const hasPaidSplitCheck = splitChecks.some(
    (check) => check.status === 'paid',
  );
  const initialItemSplitState = getInitialItemSplitState(itemChecks);

  const fullPaymentContent = (
    <>
      <PaymentCaptureForm
        action={payFullOrderAction}
        orderId={order.id}
        remainingCents={remainingCents}
        idempotencyKey={uuidv7()}
        disabled={splitChecks.length > 0}
        submitSize="lg"
      />

      {splitChecks.length > 0 && (
        <div className="mt-4 rounded-lg border border-border-default bg-surface-muted p-3">
          <p className="text-sm font-semibold text-primary/70">
            Paiement complet bloqué car un partage est actif.
          </p>
        </div>
      )}
    </>
  );

  const itemSplitContent = (
    <>
      <ItemSplitDialogContent
        action={createChecksByItemsAction}
        orderId={order.id}
        items={toItemSplitItems(activeOrderItems)}
        comboRules={toItemSplitComboRules(activeComboRules)}
        initialClientCount={initialItemSplitState.clientCount}
        initialQuantities={initialItemSplitState.quantities}
        disabled={order.status === 'paid'}
        error={itemSplitError}
      />

      {itemChecks.length > 0 && (
        <>
          <Separator className="my-5" />
          <CheckPaymentList
            checks={itemChecks}
            payments={order.payments}
            orderId={order.id}
          />
        </>
      )}
    </>
  );

  const equalSplitContent = (
    <>
      <EqualSplitDialogContent
        action={splitOrderEquallyAction}
        orderId={order.id}
        totalCents={order.totalCents}
        initialParts={equalChecks.length > 0 ? equalChecks.length : undefined}
        disabled={order.status === 'paid'}
      />

      {equalChecks.length > 0 && (
        <>
          <Separator className="my-5" />
          <CheckPaymentList
            checks={equalChecks}
            payments={order.payments}
            orderId={order.id}
          />
        </>
      )}
    </>
  );

  return (
    <PosPageShell
      title={`Paiement - ${order.tableLabel}`}
      description={order.orderNumber}
      actions={
        <Badge
          tone={order.status === 'paid' ? 'success' : 'warning'}
          variant="solid"
        >
          {order.status === 'paid' ? 'Payée' : 'À encaisser'}
        </Badge>
      }
    >
      {order.hasAllergy && (
        <AllergyAlert
          allergyNote={order.allergyNote}
          acknowledged={Boolean(order.allergyAcknowledgedAt)}
        />
      )}
      {error && (
        <div className="rounded-lg border border-border-default bg-surface-muted p-3 text-sm font-semibold text-primary">
          {paymentErrorMessage(error)}
        </div>
      )}

      <section className="grid gap-5">
        <PaymentSummaryCard
          order={order}
          activeOrderItems={activeOrderItems}
          cancelledOrderItems={cancelledOrderItems}
          paidCents={paidCents}
          remainingCents={remainingCents}
        />

        <PaymentChoiceDialogs
          fullPaymentContent={fullPaymentContent}
          itemSplitContent={itemSplitContent}
          equalSplitContent={equalSplitContent}
          fullPaymentLabel={formatEuros(remainingCents)}
          itemSplitLabel="Par articles"
          equalSplitLabel="Parts égales"
          itemSplitDefaultOpen={
            Boolean(itemSplitError) || paymentDialog === 'item-split'
          }
          equalSplitDefaultOpen={paymentDialog === 'equal-split'}
        />

        {splitChecks.length > 0 && (
          <Card className="rounded-lg p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black">Partage actif</p>
                <p className="mt-1 text-sm font-semibold text-primary/55">
                  Annuler le partage pour revenir au paiement complet.
                </p>
                {hasPaidSplitCheck && (
                  <p className="mt-1 text-xs font-semibold text-primary/45">
                    Impossible après encaissement d'un ticket.
                  </p>
                )}
              </div>
              <form action={cancelOrderSplitAction}>
                <input type="hidden" name="orderId" value={order.id} />
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  disabled={hasPaidSplitCheck}
                >
                  Annuler le partage
                </Button>
              </form>
            </div>
          </Card>
        )}
      </section>
    </PosPageShell>
  );
}
