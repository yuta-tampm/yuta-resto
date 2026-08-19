import { Badge, Button } from '@yuta/ui';
import { Check, RotateCcw, ShieldCheck, TriangleAlert } from 'lucide-react';
import {
  confirmOrderItemAllergyAction,
  markOrderItemPreparingAction,
  markOrderItemReadyAction,
} from '../../actions';
import { allergySummaryFromSnapshots } from '../../_pos-helpers';
import type { PosOrderItem } from '../../../lib/pos-api';
import type { KitchenItemTone, KitchenOrderStatus } from '../_lib/kitchen-view';
import styles from '../kitchen.module.css';

type KitchenItemProps = {
  item: PosOrderItem;
  orderStatus: KitchenOrderStatus;
  tone: KitchenItemTone;
};

export function KitchenItem({ item, orderStatus, tone }: KitchenItemProps) {
  return (
    <article
      className={`${styles.item} ${itemToneClass(tone)} ${item.status === 'ready' ? styles.itemReady : ''}`}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={styles.quantity}>{item.quantity}</span>
            <div className="min-w-0">
              <p className={styles.itemName}>{item.itemNameSnapshot}</p>
            </div>
          </div>
        </div>
        <KitchenItemActions item={item} orderStatus={orderStatus} />
      </div>

      {item.hasAllergy && <KitchenItemAllergy item={item} />}

      {item.quickInstructions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.quickInstructions.map((instruction) => (
            <Badge key={instruction.code} tone="info" variant="outline">
              {instruction.labelSnapshot}
            </Badge>
          ))}
        </div>
      )}

      {item.selectedVariants.length > 0 && (
        <p className={styles.itemDetail}>
          Options:{' '}
          {item.selectedVariants
            .map((variant) => `${variant.quantity}× ${variant.labelSnapshot}`)
            .join(' · ')}
        </p>
      )}

      {item.note && <p className={styles.itemNote}>Note: {item.note}</p>}
    </article>
  );
}

function itemToneClass(tone: KitchenItemTone): string {
  if (tone === 'starter') return styles.itemStarter;
  if (tone === 'bar') return styles.itemBar;
  return '';
}

function KitchenItemAllergy({ item }: { item: PosOrderItem }) {
  const confirmed = Boolean(item.allergyKitchenConfirmedAt);

  return (
    <div
      className={`${styles.itemAllergy} ${confirmed ? styles.itemAllergyConfirmed : ''}`}
    >
      <p className="inline-flex max-w-full items-center gap-2 text-xs font-black uppercase">
        {confirmed ? (
          <span
            className={styles.allergyConfirmedIcon}
            role="img"
            aria-label="Allergie confirmée par la cuisine"
            title="Allergie confirmée par la cuisine"
          >
            <ShieldCheck className="h-4 w-4" />
          </span>
        ) : (
          <TriangleAlert className="h-4 w-4 shrink-0" />
        )}
        <span className="min-w-0 break-words">
          {allergySummaryFromSnapshots(
            item.selectedAllergens,
            item.allergySeverity,
            item.allergyNote,
          )}
        </span>
      </p>
      {!confirmed && (
        <form action={confirmOrderItemAllergyAction}>
          <input type="hidden" name="orderItemId" value={item.id} />
          <Button
            type="submit"
            variant="danger"
            size="sm"
            className="min-h-10 w-full"
          >
            <Check className="h-4 w-4" />
            Confirmer l'allergie
          </Button>
        </form>
      )}
    </div>
  );
}

function KitchenItemActions({
  item,
  orderStatus,
}: Pick<KitchenItemProps, 'item' | 'orderStatus'>) {
  if (orderStatus === 'cancelled') {
    return (
      <div className="rounded-lg border border-border-default bg-surface-muted px-3 py-2 text-sm font-semibold text-primary/60">
        Commande annulée
      </div>
    );
  }

  if (item.status === 'ready') {
    return (
      <div className="flex">
        <form action={markOrderItemPreparingAction}>
          <input type="hidden" name="orderItemId" value={item.id} />
          <Button
            type="submit"
            variant="success"
            size="sm"
            className="h-11 w-11 p-0"
            aria-label="Réouvrir en préparation"
            title="Réouvrir en préparation"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form action={markOrderItemReadyAction}>
      <input type="hidden" name="orderItemId" value={item.id} />
      <Button
        type="submit"
        variant="success"
        size="sm"
        className="h-11 w-11 p-0"
        disabled={item.hasAllergy && !item.allergyKitchenConfirmedAt}
        aria-label="Marquer prêt"
        title="Marquer prêt"
      >
        <Check className="h-5 w-5" />
      </Button>
    </form>
  );
}
