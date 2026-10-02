import { AllergyAlert } from '../../../components/orders/AllergyAlert';
import { PosPageShell } from '../../../components/pos/PosPageShell';
import { posApi } from '../../../lib/pos-api';
import { OrderArticlesPanel } from './_components/OrderArticlesPanel';
import { OrderReceiptMenuAction } from './_components/OrderReceiptMenuAction';
import actionStyles from './_components/OrderDetailActions.module.css';
import {
  OrderCancelForm,
  OrderItemEntryButton,
  OrderPaymentButton,
  OrderSendButton,
} from './_components/OrderDetailActions';
import { OrderInfoPanel } from './_components/OrderInfoPanel';
import { OrderProgressPanel } from './_components/OrderProgressPanel';
import { OrderSummaryHeader } from './_components/OrderSummaryHeader';
import { OrderTotalsPanel } from './_components/OrderTotalsPanel';
import type { OrderDetail } from './_lib/order-detail-presentation';
import styles from './order-detail.module.css';

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  const [paymentView, receiptView] = await Promise.all([
    posApi.getPaymentViewData(orderId),
    posApi.getReceiptView(orderId),
  ]);
  const order: OrderDetail = {
    ...paymentView.order,
    items: paymentView.order.items,
    discounts: paymentView.order.discounts,
  };
  const paidPayments = paymentView.order.payments.filter(
    (payment) => payment.status === 'paid',
  );
  const activeItems = order.items.filter((item) => item.status !== 'cancelled');
  const pendingItemCount = order.items.filter(
    (item) => item.status === 'pending',
  ).length;
  const canSendToKitchen =
    pendingItemCount > 0 &&
    order.status !== 'paid' &&
    order.status !== 'cancelled';
  const canPay = order.status !== 'paid' && order.status !== 'cancelled';
  const canCancel = canPay && paidPayments.length === 0;
  const canEditItems =
    canPay && paidPayments.length === 0 && order.paymentMode === 'single';
  const kitchenWasSent =
    Boolean(order.sentAt) ||
    order.items.some((item) =>
      ['sent', 'preparing', 'ready', 'served'].includes(item.status),
    );
  const kitchenActionComplete = kitchenWasSent && !canSendToKitchen;
  const actionHint = canSendToKitchen
    ? `${pendingItemCount} article${pendingItemCount > 1 ? 's' : ''} à envoyer en cuisine`
    : order.status === 'paid'
      ? 'Commande payée — actions verrouillées'
      : order.status === 'cancelled'
        ? 'Commande annulée — actions verrouillées'
        : kitchenActionComplete
          ? 'Commande envoyée en cuisine'
          : 'Ajoutez des articles pour commencer';

  return (
    <PosPageShell
      title={order.tableLabel}
      description={order.orderNumber}
      actions={
        <>
          <OrderSendButton
            order={order}
            disabled={!canSendToKitchen}
            fullWidth={false}
          />
          <OrderPaymentButton
            orderId={order.id}
            disabled={!canPay}
            className="border border-white/10"
            fullWidth={false}
          />
        </>
      }
      pageMenuActions={
        <OrderReceiptMenuAction orderId={order.id} receiptView={receiptView} />
      }
      contentClassName="px-4 py-4 md:px-6 md:py-5"
    >
      <div className="grid gap-4">
        {order.hasAllergy && (
          <AllergyAlert
            allergyNote={order.allergyNote}
            acknowledged={Boolean(order.allergyAcknowledgedAt)}
          />
        )}
        <OrderSummaryHeader
          order={order}
          actionHint={actionHint}
          actionComplete={kitchenActionComplete}
          actions={
            <>
              <OrderSendButton
                order={order}
                disabled={!canSendToKitchen}
                completed={kitchenActionComplete}
                label={'Envoyer en\u00a0cuisine'}
                variant={canSendToKitchen ? 'primary' : 'secondary'}
                className={actionStyles.orderActionButton}
              />
              <OrderPaymentButton
                orderId={order.id}
                disabled={!canPay}
                variant={canSendToKitchen ? 'secondary' : 'primary'}
                className={actionStyles.orderActionButton}
              />
              <OrderItemEntryButton
                orderId={order.id}
                disabled={!canEditItems}
                className={actionStyles.orderActionButton}
              />
            </>
          }
        />

        <section className={`${styles.contentGrid} gap-4`}>
          <OrderArticlesPanel items={activeItems} />
          <div className="grid content-start gap-4">
            <OrderTotalsPanel
              subtotalCents={order.subtotalCents}
              discountCents={order.discountCents}
              totalCents={order.totalCents}
              discounts={order.discounts}
              className={styles.totalsPanel}
            />
            <OrderProgressPanel
              order={order}
              className={styles.progressPanel}
            />
            <OrderInfoPanel order={order} className={styles.infoPanel} />
          </div>
        </section>

        <OrderCancelForm orderId={order.id} disabled={!canCancel} />
      </div>
    </PosPageShell>
  );
}
