import { Badge, Card, Separator, cn } from '@yuta/ui';
import {
  Check,
  Clock,
  Info,
  ReceiptText,
  ShoppingBag,
  Table2,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
  activeItemCount,
  formatOrderTime,
  orderTypeLabel,
  statusBadgeProps,
  statusLabel,
  type OrderDetail,
} from '../_lib/order-detail-presentation';
import styles from './OrderSummaryHeader.module.css';

export function OrderSummaryHeader({
  order,
  actionHint,
  actionComplete,
  actions,
}: {
  order: OrderDetail;
  actionHint: string;
  actionComplete: boolean;
  actions: ReactNode;
}) {
  const isFinal = order.status === 'paid' || order.status === 'cancelled';

  return (
    <Card
      padding="none"
      className={cn(styles.summaryCard, 'rounded-lg shadow-none')}
    >
      <section
        className={cn(styles.summaryGrid, 'gap-4 p-4 md:items-stretch md:p-5')}
      >
        <div className="flex min-w-0 items-center gap-4">
          <span
            className={cn(
              styles.summaryIcon,
              order.status === 'cancelled' && styles.summaryIconCancelled,
            )}
          >
            {isFinal ? (
              <Check className="h-6 w-6" />
            ) : (
              <ReceiptText className="h-6 w-6" />
            )}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black">
                Commande {order.tableLabel}
              </h2>
              <Badge {...statusBadgeProps(order.status)}>
                {statusLabel(order.status)}
              </Badge>
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-primary/55">
              {order.orderNumber}
            </p>
          </div>
        </div>

        <div className={styles.summaryMetrics}>
          <SummaryMetric
            icon={<Clock className="h-5 w-5" />}
            value={formatOrderTime(order.createdAt)}
            label="Heure"
          />
          <SummaryMetric
            icon={<ShoppingBag className="h-5 w-5" />}
            value={orderTypeLabel(order.orderType)}
            label="Type de commande"
          />
          <SummaryMetric
            icon={<ReceiptText className="h-5 w-5" />}
            value={`${activeItemCount(order)} articles`}
            label="Articles"
          />
          <SummaryMetric
            className={styles.tableMetric}
            icon={<Table2 className="h-5 w-5" />}
            value={order.tableLabel}
            label="Repère / Table"
          />
        </div>
      </section>
      <Separator />
      <section className={styles.actionBar} aria-label="Actions de la commande">
        <div className={styles.actionContext}>
          <span
            className={cn(
              styles.actionContextIcon,
              actionComplete && styles.actionContextIconComplete,
              isFinal && styles.actionContextIconFinal,
            )}
          >
            {actionComplete ? (
              <Check className="h-4 w-4" />
            ) : (
              <Info className="h-4 w-4" />
            )}
          </span>
          <span className="grid min-w-0 gap-0.5">
            <span className="text-sm font-black">Actions de la commande</span>
            <span className="text-sm font-semibold text-primary/55">
              {actionHint}
            </span>
          </span>
        </div>
        <div className={styles.actionButtons}>{actions}</div>
      </section>
    </Card>
  );
}

function SummaryMetric({
  icon,
  value,
  label,
  className,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(styles.summaryMetric, 'flex items-center gap-2', className)}
    >
      <span className="text-primary/55">{icon}</span>
      <span className="grid min-w-0 gap-0.5">
        <span className="truncate text-sm font-black">{value}</span>
        <span className="hidden text-xs font-semibold text-primary/55 md:block">
          {label}
        </span>
      </span>
    </div>
  );
}
