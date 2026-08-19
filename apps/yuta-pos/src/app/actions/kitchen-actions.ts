'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSelectedStaffUser } from '../_pos-helpers';
import { posApi } from '../../lib/pos-api';
import { SiteAgentClientError } from '../../lib/site-agent-client';

const orderItemIdFormSchema = z.object({
  orderItemId: z.string().uuid(),
});

const kitchenTicketFormSchema = z.object({
  orderId: z.string().uuid(),
  station: z.enum(['kitchen', 'counter']),
});

export async function markKitchenTicketPreparingAction(
  formData: FormData,
): Promise<void> {
  const values = kitchenTicketFormSchema.parse({
    orderId: formData.get('orderId'),
    station: formData.get('station'),
  });
  await runKitchenStatusAction(() =>
    posApi.executeOrderCommand(values.orderId, {
      action: 'mark_station_preparing',
      station: values.station,
    }),
  );
}

export async function markKitchenTicketSentAction(
  formData: FormData,
): Promise<void> {
  const values = kitchenTicketFormSchema.parse({
    orderId: formData.get('orderId'),
    station: formData.get('station'),
  });
  await runKitchenStatusAction(() =>
    posApi.executeOrderCommand(values.orderId, {
      action: 'mark_station_sent',
      station: values.station,
    }),
  );
}

export async function markOrderItemPreparingAction(
  formData: FormData,
): Promise<void> {
  const values = orderItemIdFormSchema.parse({
    orderItemId: formData.get('orderItemId'),
  });
  await runKitchenStatusAction(() =>
    posApi.executeOrderItemCommand(values.orderItemId, {
      action: 'mark_preparing',
    }),
  );
}

export async function markOrderItemReadyAction(
  formData: FormData,
): Promise<void> {
  const values = orderItemIdFormSchema.parse({
    orderItemId: formData.get('orderItemId'),
  });
  await runKitchenStatusAction(() =>
    posApi.executeOrderItemCommand(values.orderItemId, {
      action: 'mark_ready',
    }),
  );
}

export async function confirmOrderItemAllergyAction(
  formData: FormData,
): Promise<void> {
  const values = orderItemIdFormSchema.parse({
    orderItemId: formData.get('orderItemId'),
  });
  const staffUser = await getSelectedStaffUser();
  await runKitchenStatusAction(() =>
    posApi.executeOrderItemCommand(values.orderItemId, {
      action: 'confirm_allergy',
      staffUserId: staffUser.id,
    }),
  );
}

async function runKitchenStatusAction(
  operation: () => Promise<unknown>,
): Promise<void> {
  try {
    await operation();
  } catch (error) {
    if (
      error instanceof SiteAgentClientError &&
      error.code === 'INVALID_ITEM_STATUS'
    ) {
      revalidatePath('/kitchen');
      return;
    }

    throw error;
  }

  revalidatePath('/kitchen');
}
