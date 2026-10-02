'use server';

import {
  type PersonnelEmployeeSummary,
  type PersonnelActionOverviewItemKind,
  type PersonnelActionOverviewQuery,
  type PersonnelActionOverviewResponse,
} from '@yuta/contracts/personnel';
import {
  listPersonnelActionOverview,
  resolvePersonnelActionTarget,
} from '@yuta/db-cloud';
import { requirePersonnelPermission } from '@/server/auth/permissions';
import { requirePersonnelTenant } from '@/server/auth/session';
import { requireBackofficePageAvailable } from '@/server/backoffice-exposure';
import { cloudDatabase } from '@/server/cloud-database';
import { getDateInTimezone } from '@/lib/local-time';
import { isPersonnelActionOverviewEnabled } from './_lib/personnel-action-overview-runtime';

export type LoadPersonnelActionOverviewActionResult =
  | { status: 'success'; overview: PersonnelActionOverviewResponse }
  | { status: 'error'; message: string };

export type ResolvePersonnelActionTargetActionResult =
  | { status: 'ready'; employee: PersonnelEmployeeSummary }
  | { status: 'changed'; message: string }
  | { status: 'error'; message: string };

export async function loadPersonnelActionOverviewAction(
  query: PersonnelActionOverviewQuery,
): Promise<LoadPersonnelActionOverviewActionResult> {
  requireBackofficePageAvailable('/equipe/salaries');
  if (!isPersonnelActionOverviewEnabled()) {
    return actionOverviewUnavailable();
  }
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.read');
  requirePersonnelPermission(tenant, 'personnel.document.read');
  try {
    const overview = await listPersonnelActionOverview(
      cloudDatabase,
      tenant,
      query,
      getDateInTimezone(tenant.timezone),
    );
    return { status: 'success', overview };
  } catch (error: unknown) {
    console.error('Failed to load the personnel action overview.', error);
    return actionOverviewUnavailable();
  }
}

export async function resolvePersonnelActionTargetAction(
  employeeId: string,
  kind: PersonnelActionOverviewItemKind,
): Promise<ResolvePersonnelActionTargetActionResult> {
  requireBackofficePageAvailable('/equipe/salaries');
  if (!isPersonnelActionOverviewEnabled()) {
    return actionOverviewUnavailable();
  }
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.read');
  if (kind === 'incomplete_employee_dossier') {
    requirePersonnelPermission(tenant, 'personnel.employee.manage');
  } else if (kind === 'missing_signed_base_contract') {
    requirePersonnelPermission(tenant, 'personnel.document.read');
    requirePersonnelPermission(tenant, 'personnel.document.manage');
  }
  try {
    const result = await resolvePersonnelActionTarget(
      cloudDatabase,
      tenant,
      employeeId,
      kind,
      getDateInTimezone(tenant.timezone),
    );
    return result.status === 'ready'
      ? result
      : {
          status: 'changed',
          message:
            'Cette action n’est plus nécessaire. La liste a été actualisée.',
        };
  } catch (error: unknown) {
    console.error('Failed to resolve a personnel action target.', error);
    return {
      status: 'error',
      message: 'Impossible d’ouvrir cette action. Réessayez.',
    };
  }
}

function actionOverviewUnavailable(): {
  status: 'error';
  message: string;
} {
  return {
    status: 'error',
    message: 'La liste des actions est indisponible. Réessayez.',
  };
}
