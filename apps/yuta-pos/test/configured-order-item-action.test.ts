import { beforeEach, describe, expect, it, vi } from 'vitest';

const actionMocks = vi.hoisted(() => ({
  addOrderItem: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: actionMocks.revalidatePath,
}));

vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

vi.mock('../src/app/_pos-helpers', () => ({
  getSelectableStaffUserById: vi.fn(),
  getSelectedStaffUser: vi.fn(),
}));

vi.mock('../src/lib/pos-api', () => ({
  posApi: { addOrderItem: actionMocks.addOrderItem },
}));

import {
  addConfiguredOrderItemAction,
  type AddConfiguredOrderItemActionState,
} from '../src/app/actions/order-actions';
import { SiteAgentClientError } from '../src/lib/site-agent-client';

const orderId = '019fe22c-bcab-73dc-af5d-2829d53b99ec';
const menuItemId = '019fe22c-bcb3-747d-8df3-eb8aef155d3c';
const initialState: AddConfiguredOrderItemActionState = {
  revision: 0,
  status: 'idle',
  message: null,
};

function configuredItemFormData(selectedVariants: unknown): FormData {
  const formData = new FormData();
  formData.set('orderId', orderId);
  formData.set('menuItemId', menuItemId);
  formData.set('selectedVariants', JSON.stringify(selectedVariants));
  return formData;
}

describe('addConfiguredOrderItemAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    actionMocks.addOrderItem.mockResolvedValue({ item: { id: 'item-1' } });
  });

  it('adds the item and selected options in one site-agent request', async () => {
    const result = await addConfiguredOrderItemAction(
      initialState,
      configuredItemFormData([
        { code: 'MANGUE', quantity: 1 },
        { code: 'MATCHA', quantity: 1 },
      ]),
    );

    expect(result).toEqual({ revision: 1, status: 'success', message: null });
    expect(actionMocks.addOrderItem).toHaveBeenCalledWith(orderId, {
      menuItemId,
      quantity: 1,
      selectedVariants: [
        { code: 'MANGUE', quantity: 1 },
        { code: 'MATCHA', quantity: 1 },
      ],
    });
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith(
      `/orders/${orderId}/items`,
    );
  });

  it('keeps authoritative variant failures recoverable in the modal', async () => {
    actionMocks.addOrderItem.mockRejectedValue(
      new SiteAgentClientError(
        422,
        'INVALID_VARIANT_QUANTITY',
        'Select exactly 2 item variants.',
      ),
    );

    const result = await addConfiguredOrderItemAction(
      initialState,
      configuredItemFormData([{ code: 'MANGUE', quantity: 1 }]),
    );

    expect(result).toMatchObject({
      revision: 1,
      status: 'service_error',
      message: 'Choisissez exactement le nombre d’options demandé.',
    });
    expect(actionMocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('rejects malformed option payloads before calling site-agent', async () => {
    const result = await addConfiguredOrderItemAction(
      initialState,
      configuredItemFormData([{ code: '', quantity: -1 }]),
    );

    expect(result.status).toBe('validation_error');
    expect(actionMocks.addOrderItem).not.toHaveBeenCalled();
  });
});
