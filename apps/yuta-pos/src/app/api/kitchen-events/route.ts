import { siteAgentClient } from '../../../lib/site-agent-client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const upstream = await siteAgentClient.openKitchenEventStream(
      request.signal,
    );
    if (!upstream.body) {
      return unavailableResponse();
    }
    return new Response(upstream.body, {
      headers: {
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream; charset=utf-8',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch {
    return unavailableResponse();
  }
}

function unavailableResponse() {
  return Response.json(
    {
      error: {
        code: 'SITE_AGENT_UNAVAILABLE',
        message: 'Kitchen event stream is temporarily unavailable.',
      },
    },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
