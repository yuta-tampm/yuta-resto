'use server';

import { identifierSchema } from '@yuta/contracts/common';
import {
  receiptJobCommandInputSchema,
  type LocalReceiptCommandResponse,
  type LocalReceiptJobStatusResponse,
  type ReceiptJobCommandInput,
} from '@yuta/contracts/local-pos';
import { revalidatePath } from 'next/cache';
import { posApi } from '../../../../lib/pos-api';
import { SiteAgentClientError } from '../../../../lib/site-agent-client';

type ReceiptActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export async function executeOrderReceiptAction(
  unsafeOrderId: string,
  unsafeCommand: ReceiptJobCommandInput,
): Promise<ReceiptActionResult<LocalReceiptCommandResponse>> {
  const orderId = identifierSchema.parse(unsafeOrderId);
  const command = receiptJobCommandInputSchema.parse(unsafeCommand);
  try {
    const data = await posApi.executeReceiptCommand(orderId, command);
    revalidatePath(`/orders/${orderId}`);
    revalidatePath('/management/printing');
    return { ok: true, data };
  } catch (error: unknown) {
    return toReceiptActionError(error);
  }
}

export async function getOrderReceiptJobStatusAction(
  unsafeOrderId: string,
  unsafeJobId: string,
): Promise<ReceiptActionResult<LocalReceiptJobStatusResponse>> {
  const orderId = identifierSchema.parse(unsafeOrderId);
  const jobId = identifierSchema.parse(unsafeJobId);
  try {
    return {
      ok: true,
      data: await posApi.getReceiptJobStatus(orderId, jobId),
    };
  } catch (error: unknown) {
    return toReceiptActionError(error);
  }
}

function toReceiptActionError<T>(error: unknown): ReceiptActionResult<T> {
  if (!(error instanceof SiteAgentClientError)) throw error;
  const messages: Record<string, string> = {
    RECEIPT_TARGET_NOT_PAID:
      "L'addition doit être entièrement payée avant l'impression.",
    RECEIPT_TARGET_MISMATCH:
      'Cette addition ne correspond plus au mode de paiement de la commande.',
    RECEIPT_JOB_NOT_FOUND: "La demande d'impression est introuvable.",
    INVALID_RECEIPT_JOB_STATUS:
      "L'état de cette impression a changé. Actualisez puis réessayez.",
    IDEMPOTENCY_CONFLICT:
      "Cette demande d'impression a déjà été utilisée différemment.",
    ORDER_NOT_FOUND: 'La commande est introuvable.',
  };
  return {
    ok: false,
    error: {
      code: error.code,
      message:
        messages[error.code] ??
        "Le service d'impression local ne répond pas. Réessayez.",
    },
  };
}
