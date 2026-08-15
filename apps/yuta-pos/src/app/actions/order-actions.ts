'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  getSelectableStaffUserById,
  getSelectedStaffUser,
} from '../_pos-helpers';
import { posApi } from '../../lib/pos-api';
import { SiteAgentClientError } from '../../lib/site-agent-client';

const createOrderFormSchema = z.object({
  tableLabel: z
    .string()
    .trim()
    .min(1, 'Indiquez une table ou un repere.')
    .max(255, 'La table ou le repere ne peut pas depasser 255 caracteres.'),
  orderType: z.enum(['dine_in', 'takeaway', 'delivery'], {
    message: 'Choisissez un type de commande.',
  }),
  staffUserId: z.string().uuid('Choisissez un employe valide.').optional(),
  note: z
    .string()
    .trim()
    .max(2000, 'La note ne peut pas depasser 2 000 caracteres.')
    .optional(),
});

export type CreateOrderActionState = {
  revision: number;
  status: 'idle' | 'validation_error' | 'staff_unavailable' | 'service_error';
  message: string | null;
  fieldErrors: Partial<
    Record<'staffUserId' | 'tableLabel' | 'orderType' | 'note', string>
  >;
  values: {
    staffUserId: string;
    tableLabel: string;
    orderType: string;
    note: string;
  };
};

const addOrderItemFormSchema = z.object({
  orderId: z.string().uuid(),
  menuItemId: z.string().uuid(),
});

const orderIdFormSchema = z.object({
  orderId: z.string().uuid(),
});

const sendToKitchenFormSchema = orderIdFormSchema.extend({
  idempotencyKey: z.string().uuid(),
});

export type SendOrderToKitchenActionState = {
  revision: number;
  status: 'idle' | 'success';
};

const orderItemIdFormSchema = z.object({
  orderItemId: z.string().uuid(),
});

const updateOrderItemQuantityFormSchema = z.object({
  orderId: z.string().uuid(),
  orderItemId: z.string().uuid(),
  quantity: z.coerce.number().int().positive(),
});

const updateOrderItemInstructionsFormSchema = z.object({
  orderId: z.string().uuid(),
  orderItemId: z.string().uuid(),
  note: z.string().trim().max(300).optional(),
  selectedInstructionCodes: z.array(z.string()),
  selectedVariants: z.array(
    z.object({ code: z.string(), quantity: z.number().int().nonnegative() }),
  ),
  hasAllergy: z.boolean(),
  allergenCodes: z.array(z.string()),
  allergySeverity: z
    .enum(['intolerance', 'allergy', 'severe_no_traces'])
    .optional(),
  allergyNote: z.string().trim().max(300).optional(),
});

const cancelOrderItemFormSchema = z.object({
  orderId: z.string().uuid(),
  orderItemId: z.string().uuid(),
});

const restoreOrderItemFormSchema = z.object({
  orderId: z.string().uuid(),
  orderItemId: z.string().uuid(),
});

export async function createOrderAction(
  previousState: CreateOrderActionState,
  formData: FormData,
): Promise<CreateOrderActionState> {
  const submittedValues = {
    staffUserId: formString(formData, 'staffUserId'),
    tableLabel: formString(formData, 'tableLabel'),
    orderType: formString(formData, 'orderType'),
    note: formString(formData, 'note'),
  };
  const parsed = createOrderFormSchema.safeParse({
    ...submittedValues,
    staffUserId: submittedValues.staffUserId || undefined,
    note: submittedValues.note || undefined,
  });

  if (!parsed.success) {
    const flattenedErrors = parsed.error.flatten().fieldErrors;
    return {
      revision: previousState.revision + 1,
      status: 'validation_error',
      message: 'Verifiez les champs signales avant de continuer.',
      fieldErrors: {
        staffUserId: flattenedErrors.staffUserId?.[0],
        tableLabel: flattenedErrors.tableLabel?.[0],
        orderType: flattenedErrors.orderType?.[0],
        note: flattenedErrors.note?.[0],
      },
      values: submittedValues,
    };
  }

  let orderId: string;
  try {
    const staffUser = parsed.data.staffUserId
      ? await getSelectableStaffUserById(parsed.data.staffUserId)
      : await getSelectedStaffUser();
    const { order } = await posApi.createOrder({
      tableLabel: parsed.data.tableLabel,
      orderType: parsed.data.orderType,
      staffUserId: staffUser.id,
      note: parsed.data.note,
    });
    orderId = order.id;
  } catch (error: unknown) {
    if (isStaffUnavailableError(error)) {
      return {
        revision: previousState.revision + 1,
        status: 'staff_unavailable',
        message:
          "Cet employe n'est plus disponible. Actualisez la liste puis choisissez un employe actif.",
        fieldErrors: {
          staffUserId: "L'employe selectionne n'est plus disponible.",
        },
        values: submittedValues,
      };
    }

    console.error('POS order creation failed.', error);
    return {
      revision: previousState.revision + 1,
      status: 'service_error',
      message:
        'Creation non confirmee. Verifiez le service local et la liste des commandes avant de soumettre de nouveau.',
      fieldErrors: {},
      values: submittedValues,
    };
  }

  redirect(`/orders/${orderId}/items`);
}

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function isStaffUnavailableError(error: unknown): boolean {
  if (
    error instanceof SiteAgentClientError &&
    error.code === 'STAFF_USER_UNAVAILABLE'
  ) {
    return true;
  }
  return (
    error instanceof Error &&
    (error.message === 'Selected staff user is not available.' ||
      error.message ===
        'No active staff user found. Seed the local POS database first.')
  );
}

export async function addOrderItemAction(formData: FormData): Promise<void> {
  const values = addOrderItemFormSchema.parse({
    orderId: formData.get('orderId'),
    menuItemId: formData.get('menuItemId'),
  });
  await posApi.addOrderItem(values.orderId, {
    menuItemId: values.menuItemId,
    quantity: 1,
  });

  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/items`);
}

export async function sendOrderToKitchenAction(
  previousState: SendOrderToKitchenActionState,
  formData: FormData,
): Promise<SendOrderToKitchenActionState> {
  const values = sendToKitchenFormSchema.parse({
    orderId: formData.get('orderId'),
    idempotencyKey: formData.get('idempotencyKey'),
  });

  try {
    const staffUser = await getSelectedStaffUser();
    await posApi.executeOrderCommand(values.orderId, {
      action: 'send_to_kitchen',
      idempotencyKey: values.idempotencyKey,
      allergyAcknowledged: formData.get('allergyAcknowledged') === 'true',
      staffUserId: staffUser.id,
    });
  } catch (error) {
    if (error instanceof SiteAgentClientError) {
      redirect(
        `/orders/${values.orderId}/items?sendError=${encodeURIComponent(
          kitchenSendErrorCode(error.code),
        )}`,
      );
    }
    throw error;
  }

  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/items`);
  revalidatePath('/kitchen');
  revalidatePath('/pos/prints');

  return {
    revision: previousState.revision + 1,
    status: 'success',
  };
}

function kitchenSendErrorCode(code: string): string {
  const supportedCodes = new Set([
    'INVALID_VARIANT_QUANTITY',
    'ALLERGY_ACKNOWLEDGEMENT_REQUIRED',
    'EMPTY_KITCHEN_SEND',
    'INVALID_ORDER_STATUS',
    'IDEMPOTENCY_CONFLICT',
  ]);
  return supportedCodes.has(code) ? code : 'KITCHEN_SEND_FAILED';
}

export async function updateOrderItemInstructionsAction(
  formData: FormData,
): Promise<void> {
  const values = updateOrderItemInstructionsFormSchema.parse({
    orderId: formData.get('orderId'),
    orderItemId: formData.get('orderItemId'),
    note: formData.get('note') || undefined,
    selectedInstructionCodes: parseJsonArray(
      formData.get('selectedInstructionCodes'),
    ),
    selectedVariants: parseJsonArray(formData.get('selectedVariants')),
    hasAllergy: formData.get('hasAllergy') === 'true',
    allergenCodes: parseJsonArray(formData.get('allergenCodes')),
    allergySeverity: formData.get('allergySeverity') || undefined,
    allergyNote: formData.get('allergyNote') || undefined,
  });

  await posApi.updateOrderItem(values.orderItemId, {
    note: values.note,
    selectedInstructionCodes: values.selectedInstructionCodes,
    selectedVariants: values.selectedVariants,
    hasAllergy: values.hasAllergy,
    allergenCodes: values.allergenCodes,
    allergySeverity: values.allergySeverity,
    allergyNote: values.allergyNote,
  });

  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/items`);
}

function parseJsonArray(value: FormDataEntryValue | null): unknown[] {
  if (typeof value !== 'string' || value.length === 0) {
    return [];
  }
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error('Expected a JSON array.');
  }
  return parsed;
}

export async function cancelOrderAction(formData: FormData): Promise<void> {
  const values = orderIdFormSchema.parse({
    orderId: formData.get('orderId'),
  });
  await posApi.executeOrderCommand(values.orderId, {
    action: 'cancel',
    reason: 'POS order cancellation',
  });

  revalidatePath('/');
  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/items`);
  revalidatePath(`/orders/${values.orderId}/payment`);
  revalidatePath('/kitchen');
}

export async function updateOrderItemQuantityAction(
  formData: FormData,
): Promise<void> {
  const values = updateOrderItemQuantityFormSchema.parse({
    orderId: formData.get('orderId'),
    orderItemId: formData.get('orderItemId'),
    quantity: formData.get('quantity'),
  });
  await posApi.updateOrderItem(values.orderItemId, {
    quantity: values.quantity,
  });

  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/items`);
  revalidatePath(`/orders/${values.orderId}/payment`);
}

export async function removePendingOrderItemAction(
  formData: FormData,
): Promise<void> {
  const values = cancelOrderItemFormSchema.parse({
    orderId: formData.get('orderId'),
    orderItemId: formData.get('orderItemId'),
  });
  await posApi.executeOrderItemCommand(values.orderItemId, {
    action: 'remove_pending',
  });

  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/items`);
  revalidatePath(`/orders/${values.orderId}/payment`);
}

export async function cancelOrderItemAction(formData: FormData): Promise<void> {
  const values = cancelOrderItemFormSchema.parse({
    orderId: formData.get('orderId'),
    orderItemId: formData.get('orderItemId'),
  });
  await posApi.executeOrderItemCommand(values.orderItemId, {
    action: 'cancel',
    reason: 'POS item cancellation',
  });

  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/items`);
  revalidatePath(`/orders/${values.orderId}/payment`);
  revalidatePath('/kitchen');
}

export async function restoreOrderItemAction(
  formData: FormData,
): Promise<void> {
  const values = restoreOrderItemFormSchema.parse({
    orderId: formData.get('orderId'),
    orderItemId: formData.get('orderItemId'),
  });
  await posApi.executeOrderItemCommand(values.orderItemId, {
    action: 'restore',
  });

  revalidatePath(`/orders/${values.orderId}`);
  revalidatePath(`/orders/${values.orderId}/items`);
  revalidatePath(`/orders/${values.orderId}/payment`);
  revalidatePath('/kitchen');
}
