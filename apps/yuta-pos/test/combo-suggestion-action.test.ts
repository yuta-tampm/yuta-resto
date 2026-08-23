import { beforeEach, describe, expect, it, vi } from 'vitest';

const actionMocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  requireLocalManagementCredentials: vi.fn(),
  updateComboRule: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: actionMocks.revalidatePath,
}));

vi.mock('../src/server/local-management-session', () => ({
  requireLocalManagementCredentials:
    actionMocks.requireLocalManagementCredentials,
}));

vi.mock('../src/lib/site-agent-client', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../src/lib/site-agent-client')>();
  return {
    ...actual,
    siteAgentClient: {
      ...actual.siteAgentClient,
      updateComboRule: actionMocks.updateComboRule,
    },
  };
});

import { setComboRuleSuggestionEnabledAction } from '../src/app/management/combos/actions';

const ruleId = '019fe22c-bcab-73dc-af5d-2829d53b99ec';
const initialState = { error: null, success: null };

describe('setComboRuleSuggestionEnabledAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    actionMocks.requireLocalManagementCredentials.mockResolvedValue({
      token: 'local-management-token',
    });
    actionMocks.updateComboRule.mockResolvedValue({});
  });

  it.each([
    [true, 'Suggestions à la commande activées.'],
    [false, 'Suggestions à la commande désactivées.'],
  ])(
    'persists %s through the existing trusted update path',
    async (enabled, message) => {
      const result = await setComboRuleSuggestionEnabledAction(
        ruleId,
        enabled,
        initialState,
      );

      expect(actionMocks.updateComboRule).toHaveBeenCalledWith(
        'local-management-token',
        ruleId,
        { isSuggestionEnabled: enabled },
      );
      expect(actionMocks.revalidatePath).toHaveBeenCalledWith(
        '/management/combos',
      );
      expect(actionMocks.revalidatePath).toHaveBeenCalledWith(
        '/orders',
        'layout',
      );
      expect(result).toEqual({ error: null, success: message });
    },
  );
});
