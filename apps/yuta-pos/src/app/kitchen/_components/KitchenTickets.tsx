import { Badge, Button, Card } from '@yuta/ui';
import {
  Clock,
  Flame,
  RotateCcw,
  ShieldCheck,
  StickyNote,
  TriangleAlert,
} from 'lucide-react';
import {
  markKitchenTicketPreparingAction,
  markKitchenTicketSentAction,
} from '../../actions';
import {
  groupTimeLabel,
  kitchenItemTone,
  kitchenGroupStatus,
  orderTypeLabel,
  sortKitchenItems,
  type KitchenOrderGroup,
  type KitchenOrderStatus,
  type KitchenScreen,
} from '../_lib/kitchen-view';
import styles from '../kitchen.module.css';
import { KitchenItem } from './KitchenItem';

type KitchenTicketsProps = {
  groups: KitchenOrderGroup[];
  selectedScreen: KitchenScreen;
};

export function KitchenTickets({
  groups,
  selectedScreen,
}: KitchenTicketsProps) {
  return (
    <section className={styles.ticketTrack} aria-label="Commandes de cuisine">
      {groups.map((group) => (
        <KitchenTicket
          key={group.order.id}
          group={group}
          selectedScreen={selectedScreen}
        />
      ))}
    </section>
  );
}

function KitchenTicket({
  group,
  selectedScreen,
}: {
  group: KitchenOrderGroup;
  selectedScreen: KitchenScreen;
}) {
  const orderedItems = sortKitchenItems(group.items, selectedScreen);
  const unfinishedItems = orderedItems.filter(
    (item) => item.status !== 'ready',
  );
  const completedItems = orderedItems.filter((item) => item.status === 'ready');
  const hasSentItems = unfinishedItems.some((item) => item.status === 'sent');
  const hasPreparingItems = unfinishedItems.some(
    (item) => item.status === 'preparing',
  );

  return (
    <Card
      padding="none"
      className={`${styles.ticket} ${ticketStatusCardClass(kitchenGroupStatus(group))} shadow-none`}
    >
      <div className={styles.ticketHeader}>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 gap-y-1">
          <div className="col-start-1 row-start-1 flex min-w-0 items-center justify-between gap-2">
            <h2 className="min-w-0 truncate text-base font-black">
              {group.order.tableLabel}
            </h2>
            <span className="inline-flex items-center gap-1 text-xs font-black text-primary/50">
              <Clock className="h-3.5 w-3.5" />
              {groupTimeLabel(group.items)}
            </span>
          </div>
          {group.order.status !== 'cancelled' && hasSentItems && (
            <form
              action={markKitchenTicketPreparingAction}
              className="col-start-2 row-span-2 row-start-1 flex items-center"
            >
              <input type="hidden" name="orderId" value={group.order.id} />
              <input type="hidden" name="station" value={selectedScreen} />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="h-11 w-11 bg-status-warning p-0 text-inverse hover:bg-status-warning/90"
                aria-label="Tout préparer"
                title="Démarrer toute la commande"
              >
                <Flame className="h-5 w-5" />
              </Button>
            </form>
          )}
          {group.order.status !== 'cancelled' &&
            !hasSentItems &&
            hasPreparingItems && (
              <form
                action={markKitchenTicketSentAction}
                className="col-start-2 row-span-2 row-start-1 flex items-center"
              >
                <input type="hidden" name="orderId" value={group.order.id} />
                <input type="hidden" name="station" value={selectedScreen} />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  className="h-11 w-11 p-0"
                  aria-label="Annuler la préparation"
                  title="Remettre toute la commande à préparer"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </form>
            )}
          <div className="col-start-1 row-start-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <KitchenOrderTypeBadge type={group.order.orderType} />
            <KitchenOrderStatusBadge status={group.order.status} />
            <span className="font-bold text-primary/55">
              {unfinishedItems.length} à faire · {completedItems.length}{' '}
              terminé(s)
            </span>
          </div>
        </div>
        {group.order.hasAllergy && (
          <div className={styles.orderAllergy} role="status">
            {group.order.allergyAcknowledgedAt ? (
              <span
                className={styles.allergyConfirmedIcon}
                role="img"
                aria-label="Allergie signalée à la cuisine"
                title="Allergie signalée à la cuisine"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
            ) : (
              <TriangleAlert className="h-4 w-4 shrink-0" />
            )}
            <span className="min-w-0 break-words">
              Allergie client
              {group.order.allergyNote?.trim()
                ? ` — ${group.order.allergyNote.trim()}`
                : ''}
            </span>
          </div>
        )}
        {group.order.note?.trim() && (
          <p className={styles.orderNote}>
            <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
            <span className="min-w-0 break-words">
              {group.order.note.trim()}
            </span>
          </p>
        )}
      </div>
      <div
        className={styles.ticketBody}
        tabIndex={0}
        aria-label={`Articles de ${group.order.tableLabel}`}
      >
        {unfinishedItems.map((item) => (
          <KitchenItem
            key={item.id}
            item={item}
            tone={kitchenItemTone(item, selectedScreen)}
            orderStatus={group.order.status}
          />
        ))}
        {completedItems.map((item) => (
          <KitchenItem
            key={item.id}
            item={item}
            tone={kitchenItemTone(item, selectedScreen)}
            orderStatus={group.order.status}
          />
        ))}
      </div>
    </Card>
  );
}

function KitchenOrderTypeBadge({ type }: { type: string }) {
  const tone =
    type === 'takeaway' ? 'warning' : type === 'delivery' ? 'info' : 'success';

  return (
    <Badge
      tone={tone}
      variant="solid"
      className="rounded-md px-3 py-1 text-sm font-black"
    >
      {orderTypeLabel(type)}
    </Badge>
  );
}

function KitchenOrderStatusBadge({ status }: { status: KitchenOrderStatus }) {
  if (status === 'paid') {
    return (
      <Badge tone="success" variant="solid">
        Payée
      </Badge>
    );
  }

  if (status === 'cancelled') {
    return (
      <Badge tone="danger" variant="solid">
        Annulée
      </Badge>
    );
  }

  return null;
}

function ticketStatusCardClass(status: 'sent' | 'preparing' | 'ready'): string {
  if (status === 'sent') {
    return 'border-t-4 border-t-status-warning';
  }

  if (status === 'preparing') {
    return 'border-t-4 border-t-status-info';
  }

  return 'border-t-4 border-t-status-success';
}
