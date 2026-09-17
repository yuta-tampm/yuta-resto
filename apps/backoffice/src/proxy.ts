import { randomBytes } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

// Transport policy only. Employee authority stays in the Pointage handlers.
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (
    pathname !== '/pointage' &&
    !pathname.startsWith('/pointage/') &&
    pathname !== '/api/pointage' &&
    !pathname.startsWith('/api/pointage/')
  ) {
    return NextResponse.next();
  }

  const nonce = randomBytes(16).toString('base64');
  const developmentConnection =
    process.env.NODE_ENV === 'development' &&
    process.env.YUTA_POINTAGE_SYNTHETIC_TEST_MODE === 'true' &&
    process.env.POINTAGE_TEST_ORIGIN === 'http://127.0.0.1:3001'
      ? ' ws://127.0.0.1:3001'
      : '';

  // Do not clone/serialize inbound headers into request-override metadata.
  // In particular, this layer never reads credentials, cookies or a body.
  // Page-level dynamic rendering and script nonce consumption require the
  // separately authorized PAGE implementation and its actual HTML/RSC proof.
  const response = NextResponse.next();
  response.headers.set(
    'Content-Security-Policy',
    [
      `script-src 'self' 'nonce-${nonce}'`,
      "object-src 'none'",
      "base-uri 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      `connect-src 'self'${developmentConnection}`,
    ].join('; '),
  );
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export const config = {
  matcher: ['/pointage/:path*', '/api/pointage/:path*'],
};
