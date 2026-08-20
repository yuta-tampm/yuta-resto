import {
  localManagementReportsQuerySchema,
  localPosRoutes,
} from '@yuta/contracts/local-pos';
import { sendJson } from '../http';
import { requireLocalManagementSession } from './auth';
import type { RouteHandler } from './types';

export const handleManagementReportsRoute: RouteHandler = async ({
  request,
  response,
  url,
  service,
}) => {
  if (
    url.pathname !== localPosRoutes.managementReports ||
    request.method !== 'GET'
  ) {
    return false;
  }

  await requireLocalManagementSession(request.headers.authorization, service);
  const query = localManagementReportsQuerySchema.parse({
    page: url.searchParams.get('page') ?? undefined,
    limit: url.searchParams.get('limit') ?? undefined,
  });
  sendJson(response, 200, await service.getManagementReport(query));
  return true;
};
