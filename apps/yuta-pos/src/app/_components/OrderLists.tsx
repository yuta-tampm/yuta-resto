import { formatEuros } from '@yuta/core';
import { Button, Card, Separator } from '@yuta/ui';
import { Clock, ExternalLink, Eye, User } from 'lucide-react';
import Link from 'next/link';
import {
  formatTime,
  orderHasAllergy,
  orderTypeLabel,
  statusAccentClass,
  type OrderRow,
} from '../_lib/orders-home';
import {
  OrderAllergyBadge,
  renderPrimaryOrderAction,
  StatusBadge,
} from './OrderRowParts';

export function MobileOrderList({ orders: orderRows }: { orders: OrderRow[] }) {
  return (
    <section className="grid gap-3 md:hidden">
      {orderRows.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </section>
  );
}

export function TabletOrderList({ orders: orderRows }: { orders: OrderRow[] }) {
  return (
    <section className="hidden overflow-hidden rounded-lg border border-border-default bg-white md:block xl:hidden">
      {orderRows.map((order, index) => (
        <div key={order.id}>
          <TabletOrderRow order={order} />
          {index < orderRows.length - 1 && <Separator />}
        </div>
      ))}
    </section>
  );
}

export function DesktopOrderTable({
  orders: orderRows,
}: {
  orders: OrderRow[];
}) {
  return (
    <Card
      padding="none"
      className="hidden overflow-hidden rounded-lg shadow-none xl:block"
    >
      <div className="grid grid-cols-[1fr_1.65fr_0.85fr_0.65fr_0.75fr_0.75fr_1.25fr] gap-4 px-8 py-4 text-xs font-bold uppercase text-primary/45">
        <span>Repere</span>
        <span>Commande</span>
        <span>Statut</span>
        <span>Heure</span>
        <span>Articles</span>
        <span>Total</span>
        <span className="text-right">Actions</span>
      </div>
      <Separator />
      <div>
        {orderRows.map((order, index) => (
          <div key={order.id}>
            <div
              className={`grid grid-cols-[1fr_1.65fr_0.85fr_0.65fr_0.75fr_0.75fr_1.25fr] gap-4 border-l-4 px-6 py-4 ${statusAccentClass(order.status)}`}
            >
              <div>
                <p className="font-black">{order.tableLabel}</p>
                <p className="mt-1 text-xs font-semibold text-primary/50">
                  {orderTypeLabel(order.orderType)}
                </p>
                {orderHasAllergy(order) && <OrderAllergyBadge />}
              </div>
              <p className="self-center font-black">{order.orderNumber}</p>
              <div className="self-center">
                <StatusBadge status={order.status} />
              </div>
              <p className="self-center text-sm text-primary/65">
                {formatTime(order.createdAt)}
              </p>
              <p className="self-center text-sm text-primary/65">
                {order.itemCount} article(s)
              </p>
              <p className="self-center font-black">
                {formatEuros(order.totalCents)}
              </p>
              <div className="flex items-center justify-end gap-2">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="min-h-11"
                >
                  <Link href={`/orders/${order.id}`}>
                    {order.status === 'paid' ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                    {order.status === 'paid' ? 'Voir le detail' : 'Ouvrir'}
                  </Link>
                </Button>
                {renderPrimaryOrderAction(order)}
              </div>
            </div>
            {index < orderRows.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </Card>
  );
}

function OrderCard({ order }: { order: OrderRow }) {
  return (
    <article
      className={`overflow-hidden rounded-lg border-l-4 bg-white ${statusAccentClass(order.status)} ${order.status === 'sent' ? 'bg-surface-muted' : ''}`}
    >
      <div className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black">{order.tableLabel}</h2>
            <p className="mt-2 truncate text-sm font-semibold text-primary/55">
              {order.orderNumber}
            </p>
          </div>
          <StatusBadge status={order.status} />
          {orderHasAllergy(order) && <OrderAllergyBadge />}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-primary/55">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(order.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {order.itemCount} article(s)
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-black">{formatEuros(order.totalCents)}</p>
          <div className="flex gap-2">
            <Button asChild variant="secondary" size="sm" className="min-h-11">
              <Link href={`/orders/${order.id}`}>
                <ExternalLink className="h-4 w-4" />
                Ouvrir
              </Link>
            </Button>
            {renderPrimaryOrderAction(order)}
          </div>
        </div>
      </div>
    </article>
  );
}

function TabletOrderRow({ order }: { order: OrderRow }) {
  return (
    <div
      className={`grid grid-cols-[minmax(130px,0.8fr)_minmax(220px,1fr)_auto] items-center gap-4 border-l-4 bg-white px-4 py-3 ${statusAccentClass(order.status)}`}
    >
      <div>
        <p className="font-black">{order.tableLabel}</p>
        <p className="mt-1 text-xs font-semibold text-primary/55">
          {orderTypeLabel(order.orderType)}
        </p>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <p className="truncate text-xs font-semibold text-primary/65">
            {order.orderNumber}
          </p>
          <StatusBadge status={order.status} />
          {orderHasAllergy(order) && <OrderAllergyBadge />}
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs font-semibold text-primary/55">
          <span>{formatTime(order.createdAt)}</span>
          <span>{order.itemCount} article(s)</span>
        </div>
      </div>
      <div className="grid justify-items-end gap-2">
        <p className="font-black">{formatEuros(order.totalCents)}</p>
        <div className="flex gap-2">
          <Button asChild variant="secondary" size="sm" className="min-h-11">
            <Link href={`/orders/${order.id}`}>
              <ExternalLink className="h-4 w-4" />
              Ouvrir
            </Link>
          </Button>
          {renderPrimaryOrderAction(order)}
        </div>
      </div>
    </div>
  );
}
