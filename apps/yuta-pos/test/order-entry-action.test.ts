import { beforeEach, describe, expect, it, vi } from 'vitest';

const actionMocks = vi.hoisted(() => ({
  createOrder: vi.fn(),
  getSelectableStaffUserById: vi.fn(),
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
  getSelectableStaffUserById: actionMocks.getSelectableStaffUserById,
  getSelectedStaffUser: actionMocks.getSelectedStaffUser,
}));

vi.mock('../src/lib/pos-api', () => ({
  posApi: {
    createOrder: actionMocks.createOrder,
  },
}));

import {
  createOrderAction,
  type CreateOrderActionState,
} from '../src/app/actions/order-actions';

const staffUserId = '019fe22c-bcb3-747d-8df3-eb8aef155d3c';
const orderId = '019fe22c-bcab-73dc-af5d-2829d53b99ec';

function initialState(): CreateOrderActionState {
  return {
    revision: 0,
    status: 'idle',
    message: null,
    fieldErrors: {},
    values: {
      staffUserId,
      tableLabel: '',
      orderType: 'dine_in',
      note: '',
    },
  };
}

function formData(overrides: Partial<Record<string, string>> = {}): FormData {
  const data = new FormData();
  const values = {
    staffUserId,
    tableLabel: 'Terrasse 5',
    orderType: 'dine_in',
    note: 'Anniversaire',
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
}

describe('createOrderAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    actionMocks.getSelectableStaffUserById.mockResolvedValue({
      id: staffUserId,
    });
    actionMocks.createOrder.mockResolvedValue({ order: { id: orderId } });
    actionMocks.redirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });
  });

  it('returns associated validation errors and preserves submitted values', async () => {
    const result = await createOrderAction(
      initialState(),
      formData({ tableLabel: '   ' }),
    );

    expect(result).toMatchObject({
      revision: 1,
      status: 'validation_error',
      values: {
        staffUserId,
        tableLabel: '   ',
        orderType: 'dine_in',
        note: 'Anniversaire',
      },
      fieldErrors: {
        tableLabel: 'Indiquez une table ou un repere.',
      },
    });
    expect(actionMocks.getSelectableStaffUserById).not.toHaveBeenCalled();
    expect(actionMocks.createOrder).not.toHaveBeenCalled();
  });

  it('returns a recoverable stale-employee state without creating an order', async () => {
    actionMocks.getSelectableStaffUserById.mockRejectedValue(
      new Error('Selected staff user is not available.'),
    );

    const result = await createOrderAction(initialState(), formData());

    expect(result).toMatchObject({
      status: 'staff_unavailable',
      fieldErrors: {
        staffUserId: "L'employe selectionne n'est plus disponible.",
      },
    });
    expect(actionMocks.createOrder).not.toHaveBeenCalled();
  });

  it('returns a cautious unconfirmed state for local-service failure', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    actionMocks.createOrder.mockRejectedValue(new TypeError('fetch failed'));

    const result = await createOrderAction(initialState(), formData());

    expect(result.status).toBe('service_error');
    expect(result.message).toContain('Creation non confirmee');
    expect(result.values.tableLabel).toBe('Terrasse 5');
    expect(actionMocks.redirect).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('preserves the real create input and redirects to item entry on success', async () => {
    await expect(createOrderAction(initialState(), formData())).rejects.toThrow(
      'NEXT_REDIRECT',
    );

    expect(actionMocks.createOrder).toHaveBeenCalledWith({
      tableLabel: 'Terrasse 5',
      orderType: 'dine_in',
      staffUserId,
      note: 'Anniversaire',
    });
    expect(actionMocks.redirect).toHaveBeenCalledWith(
      `/orders/${orderId}/items`,
    );
  });
});
