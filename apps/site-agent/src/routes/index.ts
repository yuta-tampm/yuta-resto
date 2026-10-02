import type { RouteHandler } from './types';
import { handleAuthRoutes } from './auth';
import { handleCatalogRoute } from './catalog';
import { handleCustomerReceiptRoutes } from './customer-receipts';
import { handleEstablishmentProfileRoutes } from './establishment-profile';
import { handleHealthRoute } from './health';
import { handleKitchenRoute } from './kitchen';
import { handleKitchenEventsRoute } from './kitchen-events';
import { handleLocalUsersRoute } from './local-users';
import { handleManagementReportsRoute } from './management-reports';
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
  handleEstablishmentProfileRoutes,
  handleManagementReportsRoute,
  handleCatalogRoute,
  handleKitchenEventsRoute,
  handleKitchenRoute,
  handleOrdersRoute,
  handleOrderItemsRoute,
  handlePaymentRoutes,
  handleCustomerReceiptRoutes,
  handlePrintJobRoutes,
  handlePrinterStatusRoute,
  handlePrintSettingsRoutes,
];
