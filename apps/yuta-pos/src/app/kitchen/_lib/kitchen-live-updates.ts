import type {
  LocalKitchenEvent,
  LocalKitchenScreen,
} from '@yuta/contracts/local-pos';

export const kitchenChimeCooldownMs = 2_500;
export const defaultKitchenChimeVolume = 0.5;
export const minimumKitchenChimeVolume = 0.1;
export const maximumKitchenChimeVolume = 1;
export const kitchenChimeVolumeVersion = '3';

export function parseKitchenChimeVolume(value: string | null): number {
  if (value === null) return defaultKitchenChimeVolume;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return defaultKitchenChimeVolume;

  return Math.min(
    maximumKitchenChimeVolume,
    Math.max(minimumKitchenChimeVolume, parsed),
  );
}

export function resolveKitchenChimeVolume(
  value: string | null,
  storedVersion: string | null,
): number {
  const parsed = parseKitchenChimeVolume(value);
  const wasAutomaticallyRaised = storedVersion === '2' && parsed === 0.8;
  return wasAutomaticallyRaised ? defaultKitchenChimeVolume : parsed;
}

export function kitchenEventMatchesScreen(
  event: LocalKitchenEvent,
  selectedScreen: LocalKitchenScreen,
): boolean {
  return event.screen === 'all' || event.screen === selectedScreen;
}

export function shouldPlayKitchenChime(input: {
  event: LocalKitchenEvent;
  selectedScreen: LocalKitchenScreen;
  now: number;
  lastPlayedAt: number;
}): boolean {
  return (
    input.event.reason === 'ticket_created' &&
    kitchenEventMatchesScreen(input.event, input.selectedScreen) &&
    input.now - input.lastPlayedAt >= kitchenChimeCooldownMs
  );
}
