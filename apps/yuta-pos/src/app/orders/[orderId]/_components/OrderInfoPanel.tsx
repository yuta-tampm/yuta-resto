import { Card, Separator, cn } from '@yuta/ui';
import { ShieldCheck, StickyNote, Table2 } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  orderTypeLabel,
  type OrderDetail,
} from '../_lib/order-detail-presentation';

export function OrderInfoPanel({
  order,
  className,
}: {
  order: OrderDetail;
  className?: string;
}) {
  const note = order.note?.trim();

  return (
    <Card padding="none" className={cn('rounded-lg shadow-none', className)}>
      <div className="p-4">
        <h3 className="text-lg font-black">Informations</h3>
      </div>
      <Separator />
      <div className="grid gap-4 p-4">
        <InfoRow
          icon={<ShieldCheck className="h-4 w-4 text-status-success" />}
          label="Type de commande"
          value={orderTypeLabel(order.orderType)}
        />
        <InfoRow
          icon={<Table2 className="h-4 w-4 text-status-success" />}
          label="Repère / Table"
          value={order.tableLabel}
        />
        <InfoRow
          icon={<StickyNote className="h-4 w-4 text-status-success" />}
          label="Note"
          value={note || '—'}
        />
      </div>
    </Card>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[20px_minmax(0,1fr)_minmax(0,auto)] items-center gap-3 text-sm">
      {icon}
      <span className="font-semibold text-primary/55">{label}</span>
      <span className="min-w-0 text-right font-black">{value}</span>
    </div>
  );
}
