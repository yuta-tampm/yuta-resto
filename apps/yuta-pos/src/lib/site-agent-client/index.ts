import { createCatalogMethods } from './catalog';
import {
  createSiteAgentTransport,
  normalizeBaseUrl,
  posRuntimeEnvSchema,
  type FetchImplementation,
} from './http';
import { createManagementMethods } from './management';
import { createOrderMethods } from './orders';
import { createPaymentMethods } from './payments';
import { createSessionAndUserMethods } from './session-users';

export { SiteAgentClientError } from './http';

export function createSiteAgentClient(input?: {
  baseUrl?: string;
  fetchImplementation?: FetchImplementation;
}) {
  const baseUrl = normalizeBaseUrl(
    input?.baseUrl ?? posRuntimeEnvSchema.parse(process.env).SITE_AGENT_URL,
  );
  const fetchImplementation = input?.fetchImplementation ?? fetch;
  const transport = createSiteAgentTransport(baseUrl, fetchImplementation);

  return {
    ...createSessionAndUserMethods(transport),
    ...createCatalogMethods(transport),
    ...createManagementMethods(transport),
    ...createOrderMethods(transport),
    ...createPaymentMethods(transport),
  };
}

export const siteAgentClient = createSiteAgentClient();
