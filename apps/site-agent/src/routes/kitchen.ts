import {
  localKitchenQueueQuerySchema,
  localPosRoutes,
} from '@yuta/contracts/local-pos';
import { sendJson } from '../http';
import type { RouteHandler } from './types';

export const handleKitchenRoute: RouteHandler = async ({
  request,
  response,
  url,
  service,
}) => {
  if (
    request.method !== 'GET' ||
    url.pathname !== localPosRoutes.kitchenQueue
  ) {
    return false;
  }

  const query = localKitchenQueueQuerySchema.parse({
    screen: url.searchParams.get('screen') ?? undefined,
    queue: url.searchParams.get('queue') ?? undefined,
    limit: url.searchParams.get('limit') ?? undefined,
  });
  sendJson(response, 200, await service.listKitchenQueue(query));
  return true;
};
