import type {
  LocalKitchenEvent,
  LocalKitchenScreen,
} from '@yuta/contracts/local-pos';

export const kitchenChimeCooldownMs = 2_500;

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
