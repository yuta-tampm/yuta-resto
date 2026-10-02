import {
  localPosRoutes,
  updateLocalEstablishmentProfileInputSchema,
} from '@yuta/contracts/local-pos';
import { readJsonBody, sendJson } from '../http';
import { requireLocalManagementSession } from './auth';
import type { RouteHandler } from './types';

export const handleEstablishmentProfileRoutes: RouteHandler = async ({
  request,
  response,
  url,
  service,
}) => {
  if (url.pathname !== localPosRoutes.establishmentProfile) return false;
  await requireLocalManagementSession(request.headers.authorization, service);

  if (request.method === 'GET') {
    sendJson(response, 200, await service.getEstablishmentProfile());
    return true;
  }
  if (request.method === 'PATCH') {
    const input = await readJsonBody(
      request,
      updateLocalEstablishmentProfileInputSchema,
    );
    sendJson(response, 200, await service.updateEstablishmentProfile(input));
    return true;
  }
  return false;
};
