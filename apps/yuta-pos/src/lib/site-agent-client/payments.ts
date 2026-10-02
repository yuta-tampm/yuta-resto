import {
  createLocalChecksByItemsInputSchema,
  localChecksResponseSchema,
  localOrderResponseSchema,
  localPaymentCaptureResponseSchema,
  localPaymentSummaryResponseSchema,
  localReceiptCommandResponseSchema,
  localReceiptJobStatusResponseSchema,
  localReceiptViewResponseSchema,
  localPosRoutes,
  payLocalCheckInputSchema,
  payLocalOrderInputSchema,
  receiptJobCommandInputSchema,
  splitLocalOrderEquallyInputSchema,
  type CreateLocalChecksByItemsInput,
  type PayLocalCheckInput,
  type PayLocalOrderInput,
  type ReceiptJobCommandInput,
} from '@yuta/contracts/local-pos';
import type { SiteAgentTransport } from './http';

/** Payment summary, receipts, split checks and payment capture. */
export function createPaymentMethods({ request }: SiteAgentTransport) {
  return {
    async getPaymentSummary(orderId: string) {
      return request(
        `${localPosRoutes.orders}/${encodeURIComponent(orderId)}/payment-summary`,
        localPaymentSummaryResponseSchema,
      );
    },
    async getReceiptView(orderId: string) {
      return request(
        `${localPosRoutes.orders}/${encodeURIComponent(orderId)}/receipts`,
        localReceiptViewResponseSchema,
      );
    },
    async executeReceiptCommand(
      orderId: string,
      input: ReceiptJobCommandInput,
    ) {
      const body = receiptJobCommandInputSchema.parse(input);
      return request(
        `${localPosRoutes.orders}/${encodeURIComponent(orderId)}/receipts`,
        localReceiptCommandResponseSchema,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
    },
    async getReceiptJobStatus(orderId: string, jobId: string) {
      return request(
        `${localPosRoutes.orders}/${encodeURIComponent(orderId)}/receipts/${encodeURIComponent(jobId)}`,
        localReceiptJobStatusResponseSchema,
      );
    },
    async splitOrderEqually(orderId: string, parts: number) {
      const body = splitLocalOrderEquallyInputSchema.parse({ parts });
      return request(
        `${localPosRoutes.orders}/${encodeURIComponent(orderId)}/checks/equal`,
        localChecksResponseSchema,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
    },
    async createChecksByItems(
      orderId: string,
      input: CreateLocalChecksByItemsInput,
    ) {
      const body = createLocalChecksByItemsInputSchema.parse(input);
      return request(
        `${localPosRoutes.orders}/${encodeURIComponent(orderId)}/checks/by-items`,
        localChecksResponseSchema,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
    },
    async cancelOrderSplit(orderId: string) {
      return request(
        `${localPosRoutes.orders}/${encodeURIComponent(orderId)}/checks`,
        localOrderResponseSchema,
        { method: 'DELETE' },
      );
    },
    async payOrder(orderId: string, input: PayLocalOrderInput) {
      const body = payLocalOrderInputSchema.parse(input);
      return request(
        `${localPosRoutes.orders}/${encodeURIComponent(orderId)}/payments`,
        localPaymentCaptureResponseSchema,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
    },
    async payCheck(orderId: string, input: PayLocalCheckInput) {
      const parsed = payLocalCheckInputSchema.parse(input);
      const { checkId, ...body } = parsed;
      return request(
        `${localPosRoutes.orders}/${encodeURIComponent(orderId)}/checks/${encodeURIComponent(checkId)}/payments`,
        localPaymentCaptureResponseSchema,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
    },
  };
}
