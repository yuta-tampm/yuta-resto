import { grantPersonnelContractAmendmentContentAccess } from '@yuta/db-cloud';
import { randomUUID } from 'node:crypto';
import { requirePersonnelPermission } from '../../../../../../server/auth/permissions';
import { requirePersonnelTenant } from '../../../../../../server/auth/session';
import { cloudDatabase } from '../../../../../../server/cloud-database';
import { getPersonnelDocumentRuntime } from '../../../../../../server/personnel-documents/runtime';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ employeeId: string; amendmentId: string }>;
  },
) {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.document.read');
  const { employeeId, amendmentId } = await params;
  const disposition =
    new URL(request.url).searchParams.get('download') === '1'
      ? 'attachment'
      : 'inline';
  try {
    const grant = await grantPersonnelContractAmendmentContentAccess(
      cloudDatabase,
      tenant,
      {
        employeeId,
        amendmentId,
        operationId: randomUUID(),
        disposition,
      },
    );
    const { storage } = await getPersonnelDocumentRuntime();
    const content = await storage.openAvailableObject(grant.storageKey);
    const responseBody = new ArrayBuffer(content.byteLength);
    new Uint8Array(responseBody).set(content);
    return new Response(responseBody, {
      status: 200,
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
        'Content-Disposition': contentDisposition(disposition, grant.filename),
        'Content-Length': String(grant.byteSize),
        'Content-Type': grant.mediaType,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: unknown) {
    console.error('Failed to deliver a personnel contract amendment.', error);
    return Response.json(
      { error: 'Amendment unavailable.' },
      { status: 404, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

function contentDisposition(
  disposition: 'inline' | 'attachment',
  filename: string,
): string {
  const asciiFilename = filename
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/gu, '_')
    .slice(0, 180);
  return `${disposition}; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}
