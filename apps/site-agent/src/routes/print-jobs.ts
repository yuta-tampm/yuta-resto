import { identifierSchema } from '@yuta/contracts/common';
import {
  printJobCommandSchema,
  printJobsQuerySchema,
  localPosRoutes,
} from '@yuta/contracts/local-pos';
import { readJsonBody, sendJson } from '../http';
import { requireLocalManagementSession } from './auth';
import type { RouteHandler } from './types';

export const handlePrintJobRoutes: RouteHandler = async ({
  request,
  response,
  url,
  service,
}) => {
  if (url.pathname === localPosRoutes.printJobs && request.method === 'GET') {
    await requireLocalManagementSession(request.headers.authorization, service);
    const query = printJobsQuerySchema.parse({
      status: url.searchParams.get('status') ?? undefined,
      page: url.searchParams.get('page') ?? undefined,
      limit: url.searchParams.get('limit') ?? undefined,
    });
    sendJson(response, 200, await service.listPrintJobs(query));
    return true;
  }
  if (url.pathname === localPosRoutes.printTest && request.method === 'POST') {
    await requireLocalManagementSession(request.headers.authorization, service);
    sendJson(response, 201, await service.createTestPrintJob());
    return true;
  }
  const commandMatch = /^\/api\/v1\/print-jobs\/([^/]+)\/commands$/.exec(
    url.pathname,
  );
  if (commandMatch && request.method === 'POST') {
    await requireLocalManagementSession(request.headers.authorization, service);
    const command = await readJsonBody(request, printJobCommandSchema);
    sendJson(
      response,
      200,
      await service.executePrintJobCommand(
        identifierSchema.parse(commandMatch[1]),
        command,
      ),
    );
    return true;
  }
  return false;
};
