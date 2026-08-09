import type { RouteHandler } from './types';
import { handleAuthRoutes } from './auth';
import { handleCatalogRoute } from './catalog';
import { handleHealthRoute } from './health';
import { handleLocalUsersRoute } from './local-users';
import { handleOrderItemsRoute } from './order-items';
import { handleOrdersRoute } from './orders';
import { handlePaymentRoutes } from './payments';
import { handlePrintJobRoutes } from './print-jobs';
import { handlePrintSettingsRoutes } from './print-settings';
import { handlePrinterStatusRoute } from './printer-status';

export const siteAgentRoutes: RouteHandler[] = [
  handleHealthRoute,
  handleAuthRoutes,
  handleLocalUsersRoute,
  handleCatalogRoute,
  handleOrdersRoute,
  handleOrderItemsRoute,
  handlePaymentRoutes,
  handlePrintJobRoutes,
  handlePrinterStatusRoute,
  handlePrintSettingsRoutes,
];
