import { localPosRoutes } from '@yuta/contracts/local-pos';
import type { RouteHandler } from './types';

const HEARTBEAT_INTERVAL_MS = 25_000;

export const handleKitchenEventsRoute: RouteHandler = async ({
  request,
  response,
  url,
  service,
}) => {
  if (
    request.method !== 'GET' ||
    url.pathname !== localPosRoutes.kitchenEvents
  ) {
    return false;
  }

  response.writeHead(200, {
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream; charset=utf-8',
    'X-Accel-Buffering': 'no',
  });
  response.write('retry: 3000\n: connected\n\n');

  const unsubscribe = service.subscribeKitchenEvents((event) => {
    response.write(
      `id: ${event.revision}\nevent: kitchen_changed\ndata: ${JSON.stringify(event)}\n\n`,
    );
  });
  const heartbeat = setInterval(() => {
    response.write(`: heartbeat ${Date.now()}\n\n`);
  }, HEARTBEAT_INTERVAL_MS);
  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    clearInterval(heartbeat);
    unsubscribe();
  };
  request.once('close', cleanup);
  response.once('close', cleanup);
  return true;
};
