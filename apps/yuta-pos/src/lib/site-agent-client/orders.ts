import {
  addLocalOrderItemInputSchema,
  createLocalOrderInputSchema,
  localKitchenSendResponseSchema,
  localKitchenQueueQuerySchema,
  localKitchenQueueResponseSchema,
  localOrderCommandSchema,
  localOrderDetailResponseSchema,
  localOrderItemCommandSchema,
  localOrderItemResponseSchema,
  localOrderResponseSchema,
  localOrdersHomeQuerySchema,
  localOrdersHomeResponseSchema,
  localOrdersQuerySchema,
  localOrdersResponseSchema,
  localPosRoutes,
  updateLocalOrderItemInputSchema,
  type AddLocalOrderItemInput,
  type CreateLocalOrderInput,
  type LocalOrderCommand,
  type LocalOrderItemCommand,
  type LocalKitchenQueueQuery,
  type LocalOrdersHomeQuery,
  type LocalOrdersQuery,
  type UpdateLocalOrderItemInput,
} from '@yuta/contracts/local-pos';
import type { SiteAgentTransport } from './http';

/** Orders home, kitchen queue/events, order and order item commands. */
export function createOrderMethods({
  request,
  requestEventStream,
}: SiteAgentTransport) {
  return {
    async listOrders(input: Partial<LocalOrdersQuery> = {}) {
      const query = localOrdersQuerySchema.parse(input);
      const search = new URLSearchParams({ limit: String(query.limit) });
      if (query.status) {
        search.set('status', query.status);
      }
      return request(
        `${localPosRoutes.orders}?${search.toString()}`,
        localOrdersResponseSchema,
      );
    },
    async listOrdersHome(input: Partial<LocalOrdersHomeQuery> = {}) {
      const query = localOrdersHomeQuerySchema.parse(input);
      const search = new URLSearchParams({
        view: query.view,
        page: String(query.page),
        limit: String(query.limit),
      });
      if (query.q) {
        search.set('q', query.q);
      }
      return request(
        `${localPosRoutes.ordersHome}?${search.toString()}`,
        localOrdersHomeResponseSchema,
      );
    },
    async listKitchenQueue(input: Partial<LocalKitchenQueueQuery> = {}) {
      const query = localKitchenQueueQuerySchema.parse(input);
      const search = new URLSearchParams({
        screen: query.screen,
        queue: query.queue,
        limit: String(query.limit),
      });
      return request(
        `${localPosRoutes.kitchenQueue}?${search.toString()}`,
        localKitchenQueueResponseSchema,
      );
    },
    async openKitchenEventStream(signal?: AbortSignal) {
      return requestEventStream(signal);
    },
    async createOrder(input: CreateLocalOrderInput) {
      const body = createLocalOrderInputSchema.parse(input);
      return request(localPosRoutes.orders, localOrderResponseSchema, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    },
    async getOrderDetail(orderId: string) {
      return request(
        `${localPosRoutes.orders}/${encodeURIComponent(orderId)}`,
        localOrderDetailResponseSchema,
      );
    },
    async addOrderItem(orderId: string, input: AddLocalOrderItemInput) {
      const body = addLocalOrderItemInputSchema.parse(input);
      return request(
        `${localPosRoutes.orders}/${encodeURIComponent(orderId)}/items`,
        localOrderItemResponseSchema,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
    },
    async updateOrderItem(
      orderItemId: string,
      input: UpdateLocalOrderItemInput,
    ) {
      const body = updateLocalOrderItemInputSchema.parse(input);
      return request(
        `${localPosRoutes.orderItems}/${encodeURIComponent(orderItemId)}`,
        localOrderItemResponseSchema,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
    },
    async executeOrderItemCommand(
      orderItemId: string,
      input: LocalOrderItemCommand,
    ) {
      const body = localOrderItemCommandSchema.parse(input);
      return request(
        `${localPosRoutes.orderItems}/${encodeURIComponent(orderItemId)}/commands`,
        localOrderItemResponseSchema,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
    },
    async executeOrderCommand(orderId: string, input: LocalOrderCommand) {
      const body = localOrderCommandSchema.parse(input);
      return request(
        `${localPosRoutes.orders}/${encodeURIComponent(orderId)}/commands`,
        body.action === 'send_to_kitchen'
          ? localKitchenSendResponseSchema
          : localOrderDetailResponseSchema,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
    },
  };
}
