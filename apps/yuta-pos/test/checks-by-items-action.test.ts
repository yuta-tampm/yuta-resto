import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createChecksByItems: vi.fn(),
  getOrderDetail: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  }),
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));

vi.mock('../src/app/_pos-helpers', () => ({
  getSelectedStaffUser: vi.fn(),
}));

vi.mock('../src/lib/pos-api', () => ({
  posApi: {
    createChecksByItems: mocks.createChecksByItems,
    getOrderDetail: mocks.getOrderDetail,
  },
}));

import { createChecksByItemsAction } from '../src/app/actions/payment-actions';
import { SiteAgentClientError } from '../src/lib/site-agent-client';

const orderId = '019fe22c-bcab-73dc-af5d-2829d53b99ec';
const itemA = '019fe22c-bcb3-747d-8df3-eb8aef155d3c';
const itemB = '019fe22c-bcb3-747d-8df3-eb8aef155d3d';

function splitForm(
  entries: Record<string, string>,
  options: { returnTo?: string; clientCount?: string } = {},
): FormData {
  const formData = new FormData();
  formData.set('orderId', orderId);
  if (options.clientCount !== undefined) {
    formData.set('clientCount', options.clientCount);
  }
  if (options.returnTo) formData.set('returnTo', options.returnTo);
  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value);
  }
  return formData;
}

describe('createChecksByItemsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getOrderDetail.mockResolvedValue({
      items: [
        { id: itemA, quantity: 2, status: 'sent' },
        { id: itemB, quantity: 1, status: 'sent' },
      ],
    });
    mocks.createChecksByItems.mockResolvedValue({ checks: [] });
  });

  it('creates one check per client and ignores unassigned zero entries', async () => {
    await expect(
      createChecksByItemsAction(
        splitForm(
          {
            [`client1:${itemA}`]: '2',
            [`client1:${itemB}`]: '0',
            [`client2:${itemA}`]: '0',
            [`client2:${itemB}`]: '1',
          },
          { returnTo: 'payment', clientCount: '2' },
        ),
      ),
    ).rejects.toThrow(
      `NEXT_REDIRECT /orders/${orderId}/payment?paymentDialog=item-split`,
    );

    expect(mocks.createChecksByItems).toHaveBeenCalledWith(orderId, {
      checks: [
        {
          checkLabel: 'Client 1',
          items: [{ orderItemId: itemA, quantity: 2 }],
        },
        {
          checkLabel: 'Client 2',
          items: [{ orderItemId: itemB, quantity: 1 }],
        },
      ],
    });
  });

  it('rejects malformed quantities before calling site-agent', async () => {
    await expect(
      createChecksByItemsAction(
        splitForm({ [`client1:${itemA}`]: '-1' }, { returnTo: 'payment' }),
      ),
    ).rejects.toThrow(
      `NEXT_REDIRECT /orders/${orderId}/payment?itemSplitError=invalid`,
    );
    expect(mocks.getOrderDetail).not.toHaveBeenCalled();
    expect(mocks.createChecksByItems).not.toHaveBeenCalled();
  });

  it('treats an emptied quantity input as not assigned', async () => {
    await expect(
      createChecksByItemsAction(
        splitForm(
          {
            [`client1:${itemA}`]: '',
            [`client3:${itemA}`]: '00',
            [`client4:${itemA}`]: '-0',
            [`client2:${itemB}`]: '1',
          },
          { clientCount: '6' },
        ),
      ),
    ).rejects.toThrow(`NEXT_REDIRECT /orders/${orderId}/payment`);

    expect(mocks.createChecksByItems).toHaveBeenCalledWith(orderId, {
      checks: [
        {
          checkLabel: 'Client 2',
          items: [{ orderItemId: itemB, quantity: 1 }],
        },
      ],
    });
  });

  it('keeps the posted client count when rejecting malformed input', async () => {
    await expect(
      createChecksByItemsAction(
        splitForm({ [`client1:${itemA}`]: 'abc' }, { clientCount: '6' }),
      ),
    ).rejects.toThrow(
      `NEXT_REDIRECT /orders/${orderId}/payment/items?clients=6&error=invalid`,
    );
  });

  it('falls back to the highest client index when clientCount is missing', async () => {
    await expect(
      createChecksByItemsAction(splitForm({ [`client3:${itemA}`]: '5' })),
    ).rejects.toThrow(
      `NEXT_REDIRECT /orders/${orderId}/payment/items?clients=3&error=quantity`,
    );
  });

  it('returns to the dialog when nothing is assigned', async () => {
    await expect(
      createChecksByItemsAction(
        splitForm({ [`client1:${itemA}`]: '0' }, { returnTo: 'payment' }),
      ),
    ).rejects.toThrow(
      `NEXT_REDIRECT /orders/${orderId}/payment?itemSplitError=empty`,
    );
  });

  it('maps a site-agent INVALID_SPLIT to the quantity error', async () => {
    mocks.createChecksByItems.mockRejectedValue(
      new SiteAgentClientError(422, 'INVALID_SPLIT', 'Invalid split.'),
    );

    await expect(
      createChecksByItemsAction(
        splitForm({ [`client1:${itemA}`]: '1' }, { returnTo: 'payment' }),
      ),
    ).rejects.toThrow(
      `NEXT_REDIRECT /orders/${orderId}/payment?itemSplitError=quantity`,
    );
  });

  it('maps other site-agent errors to a generic split error', async () => {
    mocks.createChecksByItems.mockRejectedValue(
      new SiteAgentClientError(409, 'PAID_CHECK_EXISTS', 'Paid check.'),
    );

    await expect(
      createChecksByItemsAction(
        splitForm({ [`client1:${itemA}`]: '1' }, { returnTo: 'payment' }),
      ),
    ).rejects.toThrow(
      `NEXT_REDIRECT /orders/${orderId}/payment?itemSplitError=failed`,
    );
  });
});
