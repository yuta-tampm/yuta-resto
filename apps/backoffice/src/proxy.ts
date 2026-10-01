import { randomBytes } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import {
  isBackofficePathAvailable,
  isBackofficePresentationPath,
} from './lib/backoffice-exposure';
import { getBackofficeExposureProfile } from './server/backoffice-exposure-config';

// Admission only. Invoked capabilities and tenant/resource authority remain
// enforced in server helpers, actions, handlers and scoped repositories.
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (isBackofficePresentationPath(pathname)) return NextResponse.next();
  const pointage =
    pathname === '/pointage' ||
    pathname.startsWith('/pointage/') ||
    pathname === '/api/pointage' ||
    pathname.startsWith('/api/pointage/');
  let response: NextResponse;
  try {
    if (isBackofficePathAvailable(getBackofficeExposureProfile(), pathname)) {
      response = NextResponse.next();
    } else if (
      !pathname.startsWith('/api/') &&
      (request.method === 'GET' || request.method === 'HEAD')
    ) {
      const destination = new URL(request.url);
      destination.pathname = '/aujourdhui';
      destination.search = '?exposure=unavailable';
      response = NextResponse.redirect(destination);
    } else {
      response = NextResponse.json(
        {
          code: pointage
            ? 'POINTAGE_ACCESS_DENIED'
            : 'BACKOFFICE_FEATURE_UNAVAILABLE',
        },
        { status: 403 },
      );
      if (!pointage && request.method === 'POST') {
        // Next action worker forwarding otherwise discards this non-RSC denial
        // and returns an empty 200 response. Preserve its standard unavailable
        // action response without reading action IDs, credentials or bodies.
        response.headers.set('x-nextjs-action-not-found', '1');
      }
    }
  } catch {
    response = NextResponse.json(
      { code: pointage ? 'POINTAGE_UNAVAILABLE' : 'BACKOFFICE_UNAVAILABLE' },
      { status: 503 },
    );
  }
  if (response.status !== 200) {
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  if (!pointage) return response;

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
  matcher: ['/:path*'],
};
