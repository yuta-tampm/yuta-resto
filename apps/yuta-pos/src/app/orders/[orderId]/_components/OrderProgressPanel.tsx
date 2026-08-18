import { Card, cn } from '@yuta/ui';
import { Check } from 'lucide-react';
import {
  buildOrderProgressEvents,
  type OrderDetail,
} from '../_lib/order-detail-presentation';
import styles from './OrderProgressPanel.module.css';

export function OrderProgressPanel({
  order,
  className,
}: {
  order: OrderDetail;
  className?: string;
}) {
  const events = buildOrderProgressEvents(order);

  return (
    <Card padding="none" className={cn('rounded-lg shadow-none', className)}>
      <div className="p-4 pb-2">
        <h3 className="text-lg font-black">Suivi opérationnel</h3>
      </div>
      <div
        className="grid px-4 pb-4"
        style={{
          gridTemplateColumns: `repeat(${events.length}, minmax(0, 1fr))`,
        }}
      >
        {events.map((event, index) => (
          <div
            key={`${event.label}-${index}`}
            className="relative grid justify-items-center gap-2 px-1 text-center text-xs"
          >
            {index > 0 && (
              <span
                className={cn(
                  styles.connector,
                  !event.done && styles.connectorPending,
                )}
              />
            )}
            <span
              className={cn(
                'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white',
                event.done
                  ? 'border-status-success text-status-success'
                  : 'border-border-default text-muted',
              )}
            >
              <Check className="h-4 w-4" />
            </span>
            <span
              className={cn(
                'font-black leading-4',
                event.done && event.highlight && 'text-status-success',
                !event.done && 'text-primary/55',
              )}
            >
              {event.label}
            </span>
            <span className="font-semibold text-primary/55">{event.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
