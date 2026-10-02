'use server';

import { splitCheckItemSchema } from '@yuta/contracts/local-pos';
import { parseEuroAmountToCents } from '@yuta/core';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getSelectedStaffUser } from '../_pos-helpers';
import { posApi } from '../../lib/pos-api';
import { SiteAgentClientError } from '../../lib/site-agent-client';

const moneyCentsSchema = z.preprocess(
  (v) => (typeof v === 'string' ? parseEuroAmountToCents(v) : null),
  z.number().int().positive(),
);

const optionalMoneyCentsSchema = z.preprocess(
  (value) =>
    value === null || value === ''
      ? undefined
      : typeof value === 'string'
        ? parseEuroAmountToCents(value)
        : null,
  z.coerce.number().int().positive().optional(),
);

const orderIdFormSchema = z.object({
  orderId: z.string().uuid(),
});

const payFullOrderFormSchema = z.object({
  orderId: z.string().uuid(),
  method: z.enum(['cash', 'card', 'ticket_resto', 'other']),
  amountCents: moneyCentsSchema,
  tenderedCents: optionalMoneyCentsSchema,
  idempotencyKey: z.string().uuid(),
});

const splitOrderEquallyFormSchema = z.object({
  orderId: z.string().uuid(),
  parts: z.coerce.number().int().min(2).max(99),
});

const payCheckFormSchema = z.object({
  orderId: z.string().uuid(),
  checkId: z.string().uuid(),
  method: z.enum(['cash', 'card', 'ticket_resto', 'other']),
  amountCents: moneyCentsSchema,
  tenderedCents: optionalMoneyCentsSchema,
  idempotencyKey: z.string().uuid(),
});

const createChecksByItemsFormSchema = z.object({
  orderId: z.string().uuid(),
});

const maxItemSplitClientCount = 12;
const itemSplitEntryKeyPattern = /^client(\d+):(.+)$/;

const itemSplitClientCountSchema = z.coerce
  .number()
  .int()
  .min(2)
  .max(maxItemSplitClientCount)
  .optional();

const itemSplitSelectionSchema = z.object({
  clientCount: itemSplitClientCountSchema,
  entries: z.array(
    z.object({
      clientIndex: z.coerce.number().int().min(1).max(maxItemSplitClientCount),
      item: splitCheckItemSchema,
    }),
  ),
});

type ItemSplitError = 'empty' | 'quantity' | 'invalid' | 'failed';

export async function payFullOrderAction(formData: FormData): Promise<void> {
  const orderId = readOrderIdOrThrow(formData);
  const values = parsePaymentFormOrRedirect(
    payFullOrderFormSchema,
    formData,
    orderId,
  );
  try {
    await posApi.payOrder(values.orderId, {
      method: values.method,
      amountCents: values.amountCents,
      tenderedCents: values.tenderedCents,
      staffUserId: (await getSelectedStaffUser()).id,
      idempotencyKey: values.idempotencyKey,
    });
  } catch (error) {
    if (error instanceof SiteAgentClientError) {
      redirect(
        `/orders/${values.orderId}/payment?error=${paymentErrorCode(error.code)}`,
      );
    }

    throw error;
  }
  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/payment`);
  revalidatePath('/pos/prints');
  redirect(`/orders/${values.orderId}`);
}

export async function splitOrderEquallyAction(
  formData: FormData,
): Promise<void> {
  const values = splitOrderEquallyFormSchema.parse({
    orderId: formData.get('orderId'),
    parts: formData.get('parts'),
  });
  const shouldReturnToPayment = formData.get('returnTo') === 'payment';
  await posApi.splitOrderEqually(values.orderId, values.parts);

  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/payment`);
  redirect(
    shouldReturnToPayment
      ? `/orders/${values.orderId}/payment?paymentDialog=equal-split`
      : `/orders/${values.orderId}/payment`,
  );
}

export async function cancelOrderSplitAction(
  formData: FormData,
): Promise<void> {
  const values = orderIdFormSchema.parse({
    orderId: formData.get('orderId'),
  });
  try {
    await posApi.cancelOrderSplit(values.orderId);
  } catch (error) {
    if (error instanceof SiteAgentClientError) {
      redirect(
        `/orders/${values.orderId}/payment?error=${paymentErrorCode(error.code)}`,
      );
    }

    throw error;
  }

  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/payment`);
  redirect(`/orders/${values.orderId}/payment`);
}

export async function payCheckAction(formData: FormData): Promise<void> {
  const orderId = readOrderIdOrThrow(formData);
  const values = parsePaymentFormOrRedirect(
    payCheckFormSchema,
    formData,
    orderId,
  );
  try {
    await posApi.payCheck(values.orderId, {
      checkId: values.checkId,
      method: values.method,
      amountCents: values.amountCents,
      tenderedCents: values.tenderedCents,
      staffUserId: (await getSelectedStaffUser()).id,
      idempotencyKey: values.idempotencyKey,
    });
  } catch (error) {
    if (error instanceof SiteAgentClientError) {
      redirect(
        `/orders/${values.orderId}/payment?error=${paymentErrorCode(error.code)}`,
      );
    }

    throw error;
  }
  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/payment`);
  revalidatePath('/pos/prints');
  redirect(`/orders/${values.orderId}/payment`);
}

export async function createChecksByItemsAction(
  formData: FormData,
): Promise<void> {
  const values = createChecksByItemsFormSchema.parse({
    orderId: formData.get('orderId'),
  });
  const shouldReturnToPayment = formData.get('returnTo') === 'payment';
  const rawSelection = readItemSplitSelection(formData);
  const selection = itemSplitSelectionSchema.safeParse(rawSelection);
  if (!selection.success) {
    redirectToItemSplitError(
      values.orderId,
      shouldReturnToPayment,
      itemSplitClientCountSchema.safeParse(rawSelection.clientCount).data ?? 2,
      'invalid',
    );
  }

  const itemsByClient = new Map<
    number,
    Array<{ orderItemId: string; quantity: number }>
  >();
  for (const entry of selection.data.entries) {
    const items = itemsByClient.get(entry.clientIndex) ?? [];
    items.push(entry.item);
    itemsByClient.set(entry.clientIndex, items);
  }

  const filteredChecks = Array.from(itemsByClient.entries())
    .toSorted(([leftIndex], [rightIndex]) => leftIndex - rightIndex)
    .map(([clientIndex, items]) => ({
      checkLabel: `Client ${clientIndex}`,
      items,
    }));
  const clientCount =
    selection.data.clientCount ?? Math.max(2, ...itemsByClient.keys());

  if (filteredChecks.length === 0) {
    redirectToItemSplitError(
      values.orderId,
      shouldReturnToPayment,
      clientCount,
      'empty',
    );
  }

  const activeItems = (
    await posApi.getOrderDetail(values.orderId)
  ).items.filter((item) => item.status !== 'cancelled');
  const activeQuantityByItemId = new Map(
    activeItems.map((item) => [item.id, item.quantity]),
  );
  const assignedQuantityByItemId = new Map<string, number>();

  for (const check of filteredChecks) {
    for (const item of check.items) {
      assignedQuantityByItemId.set(
        item.orderItemId,
        (assignedQuantityByItemId.get(item.orderItemId) ?? 0) + item.quantity,
      );
    }
  }

  for (const [
    orderItemId,
    assignedQuantity,
  ] of assignedQuantityByItemId.entries()) {
    const availableQuantity = activeQuantityByItemId.get(orderItemId);

    if (
      availableQuantity === undefined ||
      assignedQuantity > availableQuantity
    ) {
      redirectToItemSplitError(
        values.orderId,
        shouldReturnToPayment,
        clientCount,
        'quantity',
      );
    }
  }

  try {
    await posApi.createChecksByItems(values.orderId, {
      checks: filteredChecks,
    });
  } catch (error) {
    if (error instanceof SiteAgentClientError) {
      redirectToItemSplitError(
        values.orderId,
        shouldReturnToPayment,
        clientCount,
        error.code === 'INVALID_SPLIT' ? 'quantity' : 'failed',
      );
    }

    throw error;
  }

  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/payment`);
  redirect(
    shouldReturnToPayment
      ? `/orders/${values.orderId}/payment?paymentDialog=item-split`
      : `/orders/${values.orderId}/payment`,
  );
}

function readItemSplitSelection(formData: FormData) {
  const rawClientCount = formData.get('clientCount');
  const entries: Array<{
    clientIndex: string;
    item: { orderItemId: string; quantity: number };
  }> = [];

  for (const [key, value] of formData.entries()) {
    const match = itemSplitEntryKeyPattern.exec(key);
    // Split forms post every client/item pair; zero or an emptied input means
    // "not assigned".
    if (
      !match ||
      (typeof value === 'string' &&
        (value.trim() === '' || Number(value.trim()) === 0))
    ) {
      continue;
    }
    entries.push({
      clientIndex: match[1],
      item: {
        orderItemId: match[2],
        quantity: typeof value === 'string' ? Number(value) : Number.NaN,
      },
    });
  }

  return {
    clientCount:
      rawClientCount === null || rawClientCount === ''
        ? undefined
        : rawClientCount,
    entries,
  };
}

function redirectToItemSplitError(
  orderId: string,
  returnToPayment: boolean,
  clientCount: number,
  error: ItemSplitError,
): never {
  redirect(
    returnToPayment
      ? `/orders/${orderId}/payment?itemSplitError=${error}`
      : `/orders/${orderId}/payment/items?clients=${clientCount}&error=${error}`,
  );
}

function paymentErrorCode(code: string): string {
  const codes: Record<string, string> = {
    OVERPAYMENT: 'overpayment',
    INVALID_TENDER: 'invalid_tender',
    ORDER_NOT_PAYABLE: 'invalid_status',
    CHECK_NOT_PAYABLE: 'invalid_status',
    PAID_CHECK_EXISTS: 'paid_check_exists',
  };
  return codes[code] ?? code.toLocaleLowerCase('en-US');
}

function readOrderIdOrThrow(formData: FormData): string {
  return orderIdFormSchema.parse({
    orderId: formData.get('orderId'),
  }).orderId;
}

function parsePaymentFormOrRedirect<
  T extends typeof payFullOrderFormSchema | typeof payCheckFormSchema,
>(schema: T, formData: FormData, orderId: string): z.infer<T> {
  const rawAmountCents = formData.get('amountCents');
  const rawTenderedCents = formData.get('tenderedCents');
  const parsedValues = schema.safeParse({
    orderId,
    checkId: formData.get('checkId'),
    method: formData.get('method'),
    amountCents: rawAmountCents,
    tenderedCents:
      rawTenderedCents === null || rawTenderedCents === ''
        ? rawAmountCents
        : rawTenderedCents,
    idempotencyKey: formData.get('idempotencyKey'),
  });

  if (!parsedValues.success) {
    redirect(`/orders/${orderId}/payment?error=invalid_amount`);
  }

  return parsedValues.data as z.infer<T>;
}
