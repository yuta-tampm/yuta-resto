import {
  getPersonnelRegisterExportSnapshot,
  PersonnelRegisterRepositoryError,
  recordPersonnelRegisterExport,
} from '@yuta/db-cloud';
import { randomUUID } from 'node:crypto';
import { requirePersonnelPermission } from '../../../../../server/auth/permissions';
import { requirePersonnelTenant } from '../../../../../server/auth/session';
import { cloudDatabase } from '../../../../../server/cloud-database';
import {
  buildPersonnelRegisterPdf,
  PersonnelRegisterPdfError,
} from '../../../../../server/personnel-register/pdf';
import { isPersonnelRegisterEnabled } from '../../../../(authenticated)/equipe/registre-personnel/_lib/personnel-register-runtime';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isPersonnelRegisterEnabled())
    return new Response('Not found.', { status: 404 });
  const { tenant } = await requirePersonnelTenant('/equipe/registre-personnel');
  requirePersonnelPermission(tenant, 'personnel.register.read');
  requirePersonnelPermission(tenant, 'personnel.register.export');
  try {
    const snapshot = await getPersonnelRegisterExportSnapshot(
      cloudDatabase,
      tenant,
    );
    const bytes = await buildPersonnelRegisterPdf(snapshot);
    const operationId = randomUUID();
    await recordPersonnelRegisterExport(cloudDatabase, tenant, operationId);
    const body = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer;
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="registre-personnel.pdf"',
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (
      error instanceof PersonnelRegisterRepositoryError &&
      error.code === 'EMPTY_REGISTER'
    ) {
      return Response.json(
        { message: 'Le registre est vide. Aucun PDF n’a été créé.' },
        {
          status: 409,
          headers: { 'Cache-Control': 'private, no-store, max-age=0' },
        },
      );
    }
    if (error instanceof PersonnelRegisterPdfError) {
      return Response.json(
        {
          message:
            'Le PDF ne peut pas représenter un caractère du registre. Aucun fichier n’a été créé.',
        },
        {
          status: 422,
          headers: { 'Cache-Control': 'private, no-store, max-age=0' },
        },
      );
    }
    throw error;
  }
}
