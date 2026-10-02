import { identifierSchema } from '@yuta/contracts/common';
import { receiptJobCommandInputSchema } from '@yuta/contracts/local-pos';
import { readJsonBody, sendJson } from '../http';
import type { RouteHandler } from './types';

export const handleCustomerReceiptRoutes: RouteHandler = async ({
  request,
  response,
  url,
  service,
}) => {
  const collectionMatch = /^\/api\/v1\/orders\/([^/]+)\/receipts$/.exec(
    url.pathname,
  );
  if (collectionMatch) {
    const orderId = identifierSchema.parse(collectionMatch[1]);
    if (request.method === 'GET') {
      sendJson(response, 200, await service.getReceiptView(orderId));
      return true;
    }
    if (request.method === 'POST') {
      const command = await readJsonBody(request, receiptJobCommandInputSchema);
      sendJson(
        response,
        201,
        await service.executeReceiptCommand(orderId, command),
      );
      return true;
    }
  }

  const jobMatch = /^\/api\/v1\/orders\/([^/]+)\/receipts\/([^/]+)$/.exec(
    url.pathname,
  );
  if (jobMatch && request.method === 'GET') {
    sendJson(
      response,
      200,
      await service.getReceiptJobStatus(
        identifierSchema.parse(jobMatch[1]),
        identifierSchema.parse(jobMatch[2]),
      ),
    );
    return true;
  }
  return false;
};
