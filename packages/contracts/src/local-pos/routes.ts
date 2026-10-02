import { z } from 'zod';
import { identifierSchema, isoDateTimeSchema } from '../common';

export const localPosApiVersion = 'v1' as const;
export const localPosApiBasePath = `/api/${localPosApiVersion}` as const;
export const uuidV7Schema = identifierSchema.refine(
  (value) => value[14]?.toLowerCase() === '7',
  'Expected a UUIDv7 value.',
);

export const localPosRoutes = {
  health: '/health',
  authLogin: `${localPosApiBasePath}/auth/login`,
  authSession: `${localPosApiBasePath}/auth/session`,
  localUsers: `${localPosApiBasePath}/local-users`,
  catalog: `${localPosApiBasePath}/catalog`,
  catalogCategories: `${localPosApiBasePath}/catalog/categories`,
  catalogItems: `${localPosApiBasePath}/catalog/items`,
  instructionSettings: `${localPosApiBasePath}/catalog/instruction-settings`,
  comboRules: `${localPosApiBasePath}/catalog/combo-rules`,
  comboRuleGroups: `${localPosApiBasePath}/catalog/combo-groups`,
  comboRuleGroupItems: `${localPosApiBasePath}/catalog/combo-group-items`,
  orders: `${localPosApiBasePath}/orders`,
  ordersHome: `${localPosApiBasePath}/orders/home`,
  kitchenQueue: `${localPosApiBasePath}/kitchen`,
  kitchenEvents: `${localPosApiBasePath}/kitchen/events`,
  orderItems: `${localPosApiBasePath}/order-items`,
  payments: `${localPosApiBasePath}/payments`,
  printJobs: `${localPosApiBasePath}/print-jobs`,
  printTest: `${localPosApiBasePath}/print-jobs/test`,
  printSettings: `${localPosApiBasePath}/print-settings`,
  establishmentProfile: `${localPosApiBasePath}/establishment-profile`,
  managementReports: `${localPosApiBasePath}/management/reports`,
  printerStatus: `${localPosApiBasePath}/printer-status`,
} as const;

export const siteAgentHealthResponseSchema = z
  .object({
    status: z.enum(['ok', 'degraded']),
    database: z.enum(['ready', 'unavailable']),
    service: z.literal('site-agent'),
    apiVersion: z.literal(localPosApiVersion),
    checkedAt: isoDateTimeSchema,
  })
  .strict();

export type SiteAgentHealthResponse = z.infer<
  typeof siteAgentHealthResponseSchema
>;
