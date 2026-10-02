import {
  localManagementReportsQuerySchema,
  localManagementReportsResponseSchema,
  localPrintJobsResponseSchema,
  localPrintJobSchema,
  localPrinterStatusSchema,
  localPrintSettingsSchema,
  localEstablishmentProfileSchema,
  localPosRoutes,
  printJobCommandSchema,
  printJobsQuerySchema,
  updateLocalPrintSettingsInputSchema,
  updateLocalEstablishmentProfileInputSchema,
  type LocalManagementReportsQuery,
  type PrintJobCommand,
  type PrintJobsQuery,
  type UpdateLocalPrintSettingsInput,
  type UpdateLocalEstablishmentProfileInput,
} from '@yuta/contracts/local-pos';
import { managementJsonHeaders, type SiteAgentTransport } from './http';

/** Printing, establishment profile and management report endpoints. */
export function createManagementMethods({ request }: SiteAgentTransport) {
  return {
    async listPrintJobs(token: string, input: Partial<PrintJobsQuery> = {}) {
      const query = printJobsQuerySchema.parse(input);
      const search = new URLSearchParams({
        page: String(query.page),
        limit: String(query.limit),
      });
      if (query.status) search.set('status', query.status);
      return request(
        `${localPosRoutes.printJobs}?${search.toString()}`,
        localPrintJobsResponseSchema,
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    async getPrintSettings(token: string) {
      return request(localPosRoutes.printSettings, localPrintSettingsSchema, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    async getEstablishmentProfile(token: string) {
      return request(
        localPosRoutes.establishmentProfile,
        localEstablishmentProfileSchema,
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    async getManagementReport(
      token: string,
      input: Partial<LocalManagementReportsQuery> = {},
    ) {
      const query = localManagementReportsQuerySchema.parse(input);
      const search = new URLSearchParams({
        page: String(query.page),
        limit: String(query.limit),
      });
      return request(
        `${localPosRoutes.managementReports}?${search.toString()}`,
        localManagementReportsResponseSchema,
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    async getPrinterStatus() {
      return request(localPosRoutes.printerStatus, localPrinterStatusSchema);
    },
    async createTestPrintJob(token: string) {
      return request(localPosRoutes.printTest, localPrintJobSchema, {
        method: 'POST',
        headers: managementJsonHeaders(token),
      });
    },
    async updatePrintSettings(
      token: string,
      input: UpdateLocalPrintSettingsInput,
    ) {
      const body = updateLocalPrintSettingsInputSchema.parse(input);
      return request(localPosRoutes.printSettings, localPrintSettingsSchema, {
        method: 'PATCH',
        headers: managementJsonHeaders(token),
        body: JSON.stringify(body),
      });
    },
    async updateEstablishmentProfile(
      token: string,
      input: UpdateLocalEstablishmentProfileInput,
    ) {
      const body = updateLocalEstablishmentProfileInputSchema.parse(input);
      return request(
        localPosRoutes.establishmentProfile,
        localEstablishmentProfileSchema,
        {
          method: 'PATCH',
          headers: managementJsonHeaders(token),
          body: JSON.stringify(body),
        },
      );
    },
    async executePrintJobCommand(
      token: string,
      printJobId: string,
      input: PrintJobCommand,
    ) {
      const body = printJobCommandSchema.parse(input);
      return request(
        `${localPosRoutes.printJobs}/${encodeURIComponent(printJobId)}/commands`,
        localPrintJobSchema,
        {
          method: 'POST',
          headers: managementJsonHeaders(token),
          body: JSON.stringify(body),
        },
      );
    },
  };
}
