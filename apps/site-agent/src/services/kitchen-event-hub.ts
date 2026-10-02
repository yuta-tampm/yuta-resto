import {
  localKitchenEventSchema,
  type LocalKitchenEvent,
  type LocalKitchenEventReason,
  type LocalKitchenEventScreen,
} from '@yuta/contracts/local-pos';
import { v7 as uuidv7 } from 'uuid';

type KitchenEventListener = (event: LocalKitchenEvent) => void;

export function createKitchenEventHub(input?: {
  bootId?: string;
  now?: () => Date;
}) {
  const bootId = input?.bootId ?? uuidv7();
  const now = input?.now ?? (() => new Date());
  const listeners = new Set<KitchenEventListener>();
  let sequence = 0;

  function publish(
    screen: LocalKitchenEventScreen,
    reason: LocalKitchenEventReason = 'state_changed',
  ): LocalKitchenEvent {
    sequence += 1;
    const event = localKitchenEventSchema.parse({
      type: 'kitchen_changed',
      revision: `${bootId}:${sequence}`,
      screen,
      reason,
      occurredAt: now().toISOString(),
    });
    for (const listener of listeners) listener(event);
    return event;
  }

  function subscribe(listener: KitchenEventListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { publish, subscribe };
}

export type KitchenEventHub = ReturnType<typeof createKitchenEventHub>;

export function kitchenEventScreenForStation(
  station: 'kitchen' | 'bar' | 'dessert' | 'counter' | 'none',
): LocalKitchenEventScreen {
  if (station === 'kitchen') return 'kitchen';
  if (station === 'bar' || station === 'dessert' || station === 'counter') {
    return 'counter';
  }
  return 'all';
}

export function kitchenEventScreensForStations(
  stations: Array<'kitchen' | 'bar' | 'dessert' | 'counter' | 'none'>,
): Array<'kitchen' | 'counter'> {
  const screens = new Set<'kitchen' | 'counter'>();
  for (const station of stations) {
    if (station === 'kitchen') screens.add('kitchen');
    if (station === 'bar' || station === 'dessert' || station === 'counter') {
      screens.add('counter');
    }
  }
  return [...screens];
}
