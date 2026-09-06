import { readFormalitesPersonnelDraft } from '@yuta/db-cloud';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { BackofficePage } from '../../../../../components/backoffice/backoffice-page';
import { requireFormalitesTenant } from '../../../../../server/auth/formalites';
import { requirePersonnelPermission } from '../../../../../server/auth/permissions';
import { cloudDatabase } from '../../../../../server/cloud-database';
import { CdiDraftConnectedReadPrototype } from '../_components/cdi-draft-connected-read-prototype';
import { createCdiDraftConnectedReadModel } from '../_lib/cdi-draft-connected-read-model';
import { isFormalitesReadPrototypeEnabled } from '../_lib/formalites-read-prototype-runtime';
import {
  abandonFormalitesPersonnelDraftAction,
  createFormalitesPersonnelDraftAction,
  loadFormalitesPersonnelDraftAction,
  reconcileFormalitesPersonnelDraftAction,
  saveFormalitesPersonnelDraftAction,
} from './actions';

type PageProps = { params: Promise<{ employeeId: string }> };

const employeeIdSchema = z.string().uuid();

export default async function Page({ params }: PageProps) {
  if (!isFormalitesReadPrototypeEnabled()) notFound();

  const { employeeId } = await params;
  const path = `/equipe/formalites-personnel/${employeeId}`;
  const { tenant } = await requireFormalitesTenant('formalites.read', path);
  requirePersonnelPermission(tenant, 'personnel.employee.read');
  if (!employeeIdSchema.safeParse(employeeId).success) notFound();

  const draftModel = await readFormalitesPersonnelDraft(
    cloudDatabase,
    tenant,
    employeeId,
  );
  if (!draftModel) notFound();

  const model = createCdiDraftConnectedReadModel(draftModel, tenant.locale);

  return (
    <BackofficePage
      title="Préparer un projet de contrat CDI"
      description="Créez, enregistrez et retrouvez le brouillon lié à ce dossier salarié."
    >
      <CdiDraftConnectedReadPrototype
        model={model}
        employeeDossierHref={`/equipe/salaries/${employeeId}`}
        employeeId={employeeId}
        locale={tenant.locale}
        loadAction={loadFormalitesPersonnelDraftAction}
        createAction={createFormalitesPersonnelDraftAction}
        saveAction={saveFormalitesPersonnelDraftAction}
        reconcileAction={reconcileFormalitesPersonnelDraftAction}
        abandonAction={abandonFormalitesPersonnelDraftAction}
      />
    </BackofficePage>
  );
}
