import { NextResponse } from 'next/server';
import type { LocalPrinterStatus } from '@yuta/contracts/local-pos';
import {
  SiteAgentClientError,
  siteAgentClient,
} from '../../../lib/site-agent-client';

export const dynamic = 'force-dynamic';

type InternetStatus = 'available' | 'unavailable' | 'unknown';

export async function GET() {
  const checkedAt = new Date().toISOString();
  let printer: LocalPrinterStatus['status'] = 'unavailable';

  try {
    const health = await siteAgentClient.getHealth();
    if (health.status !== 'ok' || health.database !== 'ready') {
      return NextResponse.json(
        {
          status: 'unavailable',
          siteAgent: health.status,
          database: health.database,
          printer,
          internet: 'unknown' satisfies InternetStatus,
          checkedAt,
        },
        { status: 503 },
      );
    }
  } catch (error: unknown) {
    return NextResponse.json(
      {
        status: 'unavailable',
        siteAgent: 'unavailable',
        database: 'unknown',
        printer,
        errorCode:
          error instanceof SiteAgentClientError
            ? error.code
            : 'SITE_AGENT_UNREACHABLE',
        internet: 'unknown' satisfies InternetStatus,
        checkedAt,
      },
      { status: 503 },
    );
  }

  try {
    printer = (await siteAgentClient.getPrinterStatus()).status;
  } catch {
    printer = 'unavailable';
  }

  const internet = await checkInternet();

  return NextResponse.json(
    {
      status: 'available',
      siteAgent: 'ok',
      database: 'available',
      printer,
      internet,
      checkedAt,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

async function checkInternet(): Promise<InternetStatus> {
  const url = process.env.POS_INTERNET_CHECK_URL;

  if (!url) {
    return 'unknown';
  }

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      cache: 'no-store',
      signal: AbortSignal.timeout(2500),
    });

    return response.ok ? 'available' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}
