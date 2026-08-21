import { describe, expect, it } from 'vitest';
import type { LocalKitchenEvent } from '@yuta/contracts/local-pos';
import {
  defaultKitchenChimeVolume,
  kitchenChimeCooldownMs,
  kitchenEventMatchesScreen,
  parseKitchenChimeVolume,
  shouldPlayKitchenChime,
} from '../src/app/kitchen/_lib/kitchen-live-updates';

const ticketCreated: LocalKitchenEvent = {
  type: 'kitchen_changed',
  revision: 'boot:1',
  screen: 'kitchen',
  reason: 'ticket_created',
  occurredAt: '2026-08-19T12:00:00.000Z',
};

describe('Kitchen live updates', () => {
  it('uses a safe persisted chime volume', () => {
    expect(parseKitchenChimeVolume(null)).toBe(defaultKitchenChimeVolume);
    expect(parseKitchenChimeVolume('0.7')).toBe(0.7);
    expect(parseKitchenChimeVolume('invalid')).toBe(defaultKitchenChimeVolume);
    expect(parseKitchenChimeVolume('0')).toBe(0.1);
    expect(parseKitchenChimeVolume('2')).toBe(1);
  });

  it('matches only the selected screen unless the event targets all', () => {
    expect(kitchenEventMatchesScreen(ticketCreated, 'kitchen')).toBe(true);
    expect(kitchenEventMatchesScreen(ticketCreated, 'counter')).toBe(false);
    expect(
      kitchenEventMatchesScreen({ ...ticketCreated, screen: 'all' }, 'counter'),
    ).toBe(true);
  });

  it('plays only for a new matching ticket outside the cooldown', () => {
    expect(
      shouldPlayKitchenChime({
        event: ticketCreated,
        selectedScreen: 'kitchen',
        now: kitchenChimeCooldownMs,
        lastPlayedAt: 0,
      }),
    ).toBe(true);
    expect(
      shouldPlayKitchenChime({
        event: { ...ticketCreated, reason: 'state_changed' },
        selectedScreen: 'kitchen',
        now: kitchenChimeCooldownMs,
        lastPlayedAt: 0,
      }),
    ).toBe(false);
    expect(
      shouldPlayKitchenChime({
        event: ticketCreated,
        selectedScreen: 'kitchen',
        now: kitchenChimeCooldownMs,
        lastPlayedAt: 1,
      }),
    ).toBe(false);
  });
});
