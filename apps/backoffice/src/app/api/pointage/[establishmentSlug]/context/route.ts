import { handlePointageRawClockingRequest } from '../../../../../server/pointage/raw-clocking-http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ establishmentSlug: string }> },
) {
  const { establishmentSlug } = await context.params;
  return handlePointageRawClockingRequest(
    request,
    establishmentSlug,
    'context',
  );
}
