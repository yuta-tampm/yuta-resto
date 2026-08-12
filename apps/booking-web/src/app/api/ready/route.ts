import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { cloudDatabase } from '../../../server/cloud-database';
import { isDependencyReady } from '../../../server/readiness';

export const dynamic = 'force-dynamic';

const responseHeaders = { 'Cache-Control': 'no-store' };

export async function GET() {
  const databaseReady = await isDependencyReady(() =>
    cloudDatabase.execute(sql`select 1`),
  );

  return NextResponse.json(
    {
      status: databaseReady ? 'ready' : 'not_ready',
      service: 'booking-web',
    },
    {
      status: databaseReady ? 200 : 503,
      headers: responseHeaders,
    },
  );
}
