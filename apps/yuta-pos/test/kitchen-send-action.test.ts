import { beforeEach, describe, expect, it, vi } from 'vitest';

const actionMocks = vi.hoisted(() => ({
  executeOrderCommand: vi.fn(),
  getSelectedStaffUser: vi.fn(),
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: actionMocks.revalidatePath,
}));

vi.mock('next/navigation', () => ({
  redirect: actionMocks.redirect,
}));

vi.mock('../src/app/_pos-helpers', () => ({
  getSelectableStaffUserById: vi.fn(),
  getSelectedStaffUser: actionMocks.getSelectedStaffUser,
}));

vi.mock('../src/lib/pos-api', () => ({
  posApi: {
    executeOrderCommand: actionMocks.executeOrderCommand,
  },
}));

import {
  sendOrderToKitchenAction,
  type SendOrderToKitchenActionState,
} from '../src/app/actions/order-actions';
import { SiteAgentClientError } from '../src/lib/site-agent-client';

const orderId = '019fe22c-bcab-73dc-af5d-2829d53b99ec';
const staffUserId = '019fe22c-bcb3-747d-8df3-eb8aef155d3c';
const idempotencyKey = '019fe22c-bcb3-747d-8df3-eb8aef155d3d';

const initialState: SendOrderToKitchenActionState = {
  revision: 0,
  status: 'idle',
};

function kitchenFormData(): FormData {
  const formData = new FormData();
  formData.set('orderId', orderId);
  formData.set('idempotencyKey', idempotencyKey);
  formData.set('allergyAcknowledged', 'true');
  return formData;
}

describe('sendOrderToKitchenAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    actionMocks.getSelectedStaffUser.mockResolvedValue({ id: staffUserId });
    actionMocks.executeOrderCommand.mockResolvedValue({ replayed: false });
    actionMocks.redirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });
  });

  it('returns trusted success only after the site-agent command resolves', async () => {
    const result = await sendOrderToKitchenAction(
      initialState,
      kitchenFormData(),
    );

    expect(result).toEqual({ revision: 1, status: 'success' });
    expect(actionMocks.executeOrderCommand).toHaveBeenCalledWith(orderId, {
      action: 'send_to_kitchen',
      idempotencyKey,
      allergyAcknowledged: true,
      staffUserId,
    });
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith(
      `/orders/${orderId}/items`,
    );
  });

  it('keeps service errors on the existing recoverable error route', async () => {
    actionMocks.executeOrderCommand.mockRejectedValue(
      new SiteAgentClientError(
        409,
        'EMPTY_KITCHEN_SEND',
        'Order has no pending items to send.',
      ),
    );

    await expect(
      sendOrderToKitchenAction(initialState, kitchenFormData()),
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(actionMocks.redirect).toHaveBeenCalledWith(
      `/orders/${orderId}/items?sendError=EMPTY_KITCHEN_SEND`,
    );
  });
});
