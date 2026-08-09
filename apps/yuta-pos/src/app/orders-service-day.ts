export type OrdersHomeView = 'open' | 'paid_today' | 'all_today';

type ServiceDayOrder = {
  status: string;
  createdAt: Date;
  paidAt: Date | null;
};

type ServiceDayWindow = {
  start: Date;
  end: Date;
};

export function isOrderVisibleInServiceDay(
  order: ServiceDayOrder,
  view: OrdersHomeView,
  serviceDay: ServiceDayWindow,
): boolean {
  const createdDuringService = isWithinServiceDay(order.createdAt, serviceDay);
  const paidDuringService =
    order.paidAt !== null && isWithinServiceDay(order.paidAt, serviceDay);

  if (view === 'open') {
    return (
      createdDuringService &&
      ['draft', 'sent', 'preparing', 'ready', 'served'].includes(order.status)
    );
  }

  if (view === 'paid_today') {
    return order.status === 'paid' && paidDuringService;
  }

  return createdDuringService || paidDuringService;
}

function isWithinServiceDay(date: Date, serviceDay: ServiceDayWindow): boolean {
  return date >= serviceDay.start && date < serviceDay.end;
}
