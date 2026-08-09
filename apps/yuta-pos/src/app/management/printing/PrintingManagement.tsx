import type {
  LocalPrintJob,
  LocalPrintJobsResponse,
  LocalPrinterStatus,
  LocalPrintSettings,
} from '@yuta/contracts/local-pos';
import { PrintJobsCard } from './PrintJobsCard';
import { PrinterStatusCard } from './PrinterStatusCard';
import { PrintSettingsCard } from './PrintSettingsCard';

export function PrintingManagement({
  jobs,
  summary,
  pagination,
  settings,
  printerStatus,
}: {
  jobs: LocalPrintJob[];
  summary: LocalPrintJobsResponse['summary'];
  pagination: LocalPrintJobsResponse['pagination'];
  settings: LocalPrintSettings;
  printerStatus: LocalPrinterStatus;
}) {
  return (
    <div className="grid gap-3">
      <PrinterStatusCard status={printerStatus} />
      <PrintSettingsCard settings={settings} />
      <PrintJobsCard jobs={jobs} summary={summary} pagination={pagination} />
    </div>
  );
}
