import { readFileSync } from 'node:fs';
import { fork, type ChildProcess } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve } from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { config, proxy } from '../src/proxy';
import { pointageChildEnvironment } from './helpers/pointage-raw-clocking-launcher';

const origin = 'http://127.0.0.1:3001';
const policyHeaders = [
  'content-security-policy',
  'referrer-policy',
  'x-content-type-options',
  'cache-control',
  'pragma',
  'expires',
];
const matching = [
  '/pointage',
  '/pointage/synthetic-establishment',
  '/pointage/synthetic-establishment/',
  ...[
    'context',
    'identify',
    'state',
    'clock-in',
    'clock-out',
    'recover',
    'end',
  ].map((operation) => `/api/pointage/synthetic-establishment/${operation}`),
];
const unrelated = [
  '/',
  '/aujourdhui',
  '/equipe/pointage',
  '/equipe/salaries',
  '/planning',
  '/connexion',
  '/deconnexion',
  '/api/auth/login',
  '/api/personnel/register/export',
  '/api/reputation/google/oauth/start',
  '/pointage-other',
  '/api/pointage-other',
  '/_next/static/chunks/app.js',
  '/_next/image',
  '/favicon.ico',
  '/images/logo.svg',
  '/booking',
  '/feedback',
];

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

// Opt-in HTTP evidence uses the installed Next CLI, no admission owner,
// credential provider, database fixture or attendance operation.
describe.skipIf(process.env.YUTA_POINTAGE_SYNTHETIC_TEST_MODE !== 'true')(
  'U3 actual neutral Next page (HTTP implementation proof, not Browser QA)',
  () => {
    let child: ChildProcess | undefined;
    const pageUrl = `${origin}/pointage/synthetic-establishment`;

    beforeAll(async () => {
      const environment = pointageChildEnvironment(process.env);
      const probe = createServer();
      await new Promise<void>((done, reject) => {
        probe.once('error', reject);
        probe.listen(3001, '127.0.0.1', () => probe.close(() => done()));
      });
      child = fork(
        resolve(__dirname, '../node_modules/next/dist/bin/next'),
        ['dev', '--hostname', '127.0.0.1', '-p', '3001'],
        {
          cwd: resolve(__dirname, '..'),
          env: environment,
          execArgv: [],
          stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
        },
      );
      // Never relay Next diagnostics or persist complete HTML/RSC/nonce values.
      child.stdout?.resume();
      child.stderr?.resume();
      const deadline = Date.now() + 90_000;
      while (Date.now() < deadline && child.exitCode === null) {
        try {
          const response = await fetch(pageUrl, {
            signal: AbortSignal.timeout(10_000),
          });
          const body = await response.text();
          if (response.status === 200 && body.includes('Code de pointage'))
            return;
        } catch {
          // Only wait for this owned neutral Next route, never repair runtime.
        }
        await new Promise((done) => setTimeout(done, 250));
      }
      throw new Error('Actual neutral Pointage page did not become available.');
    }, 100_000);

    afterAll(async () => {
      if (!child || child.exitCode !== null || child.signalCode !== null)
        return;
      const owned = child;
      const exit = new Promise<void>((done) =>
        owned.once('exit', () => done()),
      );
      owned.kill('SIGTERM');
      const timer = setTimeout(() => {
        if (owned.exitCode === null && owned.signalCode === null)
          owned.kill('SIGKILL');
      }, 20_000);
      try {
        await exit;
      } finally {
        clearTimeout(timer);
      }
    }, 25_000);

    function assertPolicy(response: Response) {
      expect(response.status).toBe(200);
      const cache = response.headers.get('cache-control') ?? '';
      expect(/s-maxage|\bpublic\b/i.test(cache)).toBe(false);
      expect(response.headers.get('pragma')).toBe('no-cache');
      expect(response.headers.get('expires')).toBe('0');
      expect(response.headers.get('referrer-policy')).toBe('no-referrer');
      expect(response.headers.get('x-content-type-options')).toBe('nosniff');
      expect(response.headers.has('set-cookie')).toBe(false);
      expect(response.headers.has('x-middleware-override-headers')).toBe(false);
      return nonce(response);
    }

    function assertNeutral(body: string, format: 'html' | 'rsc' = 'html') {
      // Flight references the client entry instead of rendering its markup.
      expect(
        body.includes(
          format === 'html' ? 'Code de pointage' : 'PointageEmployee',
        ),
      ).toBe(true);
      expect(
        /ptc1_|stateGuard|observedStateGuard|credentialVersionId|Personnel dossier|U3_PRIVATE_|94726183|postgres(?:ql)?:\/\//i.test(
          body,
        ),
      ).toBe(false);
      expect(
        /Arrivée enregistrée|Départ enregistré|Non pointé/.test(body),
      ).toBe(false);
    }

    it('real HTML has matching framework script nonces, fresh per response and browser-proof', async () => {
      const nonces: string[] = [];
      for (let index = 0; index < 2; index++) {
        const response = await fetch(pageUrl, {
          headers: {
            'x-nonce': 'U3_PRIVATE_BROWSER_NONCE',
            'content-security-policy':
              "script-src 'nonce-U3_PRIVATE_BROWSER_CSP'",
            'content-security-policy-report-only':
              "script-src 'nonce-U3_PRIVATE_REPORT_ONLY'",
            Authorization: 'Pointage U3_PRIVATE_CONTINUATION',
            Cookie: 'employee=U3_PRIVATE_IDENTITY',
            'x-pointage-pin': '94726183',
            'x-state-guard': 'U3_PRIVATE_GUARD',
            'x-bootstrap-secret': 'U3_PRIVATE_BOOTSTRAP',
          },
          signal: AbortSignal.timeout(30_000),
        });
        const generated = assertPolicy(response);
        const body = await response.text();
        assertNeutral(body);
        expect(
          response.headers.get('content-type')?.includes('text/html'),
        ).toBe(true);
        const scripts = [...body.matchAll(/<script\b[^>]*>/g)].map(
          (match) => match[0],
        );
        expect(scripts.length > 0).toBe(true);
        // Boolean assertions deliberately avoid dumping nonce-bearing tags.
        expect(
          scripts.every((tag) => tag.includes(`nonce="${generated}"`)),
        ).toBe(true);
        nonces.push(generated);
      }
      expect(nonces[0] !== nonces[1]).toBe(true);
    }, 70_000);

    it('real RSC remains neutral with no protected serialization', async () => {
      const response = await fetch(pageUrl, {
        headers: { RSC: '1', 'x-nonce': 'U3_PRIVATE_BROWSER_NONCE' },
        signal: AbortSignal.timeout(30_000),
      });
      assertPolicy(response);
      expect(
        response.headers.get('content-type')?.includes('text/x-component'),
      ).toBe(true);
      assertNeutral(await response.text(), 'rsc');
    }, 35_000);

    it('actual HTML and RSC preserve every required final Cache-Control directive', async () => {
      for (const headers of [new Headers(), new Headers({ RSC: '1' })]) {
        const response = await fetch(pageUrl, {
          headers,
          signal: AbortSignal.timeout(30_000),
        });
        expect(response.status).toBe(200);
        const cache = response.headers.get('cache-control') ?? '';
        for (const directive of ['private', 'no-store', 'max-age=0'])
          expect
            .soft(
              cache.includes(directive),
              `Cache-Control: ${cache}; requires ${directive}`,
            )
            .toBe(true);
        expect(/s-maxage|\bpublic\b/i.test(cache)).toBe(false);
        await response.body?.cancel();
      }
    }, 65_000);

    it('actual unrelated redirect/static/missing routes keep their own policy', async () => {
      for (const [path, status] of [
        ['/', 307],
        ['/favicon.ico', 200],
        ['/api/pointage-other', 404],
      ] as const) {
        const response = await fetch(origin + path, {
          redirect: 'manual',
          signal: AbortSignal.timeout(30_000),
        });
        expect(response.status).toBe(status);
        expect(response.headers.has('content-security-policy')).toBe(false);
        expect(response.headers.has('referrer-policy')).toBe(false);
        expect(response.headers.has('x-content-type-options')).toBe(false);
        expect(response.headers.has('pragma')).toBe(false);
        expect(response.headers.has('expires')).toBe(false);
        if (path === '/')
          expect(response.headers.get('location')).toBe('/aujourdhui');
        await response.body?.cancel();
      }
    }, 100_000);

    it('ordinary Next still refuses the Pointage consumer without an admitted owner', async () => {
      const response = await fetch(
        `${origin}/api/pointage/synthetic-establishment/context`,
        { signal: AbortSignal.timeout(30_000) },
      );
      expect(response.status).toBe(503);
      expect(await response.json()).toEqual({ code: 'POINTAGE_UNAVAILABLE' });
      expect(response.headers.get('cache-control')).toContain('no-store');
      nonce(response);
    }, 35_000);
  },
);

function nonce(response: Response) {
  const csp = response.headers.get('content-security-policy');
  const value = csp?.match(
    /(?:^|;)\s*script-src 'self' 'nonce-([A-Za-z0-9+/]{22}==)'(?:;|$)/,
  )?.[1];
  expect(
    typeof value === 'string' && Buffer.from(value, 'base64').length === 16,
  ).toBe(true);
  return value!;
}

describe('U3 isolated header implementation evidence, not PAGE/RSC or Browser QA', () => {
  it('PAGE is explicitly dynamic/revalidate zero and only composes neutral presentation', () => {
    const source = readFileSync(
      resolve(__dirname, '../src/app/pointage/[establishmentSlug]/page.tsx'),
      'utf8',
    );
    expect(source).toContain("export const dynamic = 'force-dynamic'");
    expect(source).toContain('export const revalidate = 0');
    expect(
      [...source.matchAll(/from '([^']+)'/g)].map((match) => match[1]),
    ).toEqual(['./_components/pointage-employee']);
    expect(source).not.toMatch(
      /fetch\(|params|searchParams|cookies\(|headers\(|unstable_cache|process\.env/,
    );
  });
  it.each(matching)(
    'Next matcher and proxy apply Pointage policy to %s',
    (path) => {
      expect(unstable_doesMiddlewareMatch({ config, url: origin + path })).toBe(
        true,
      );
      const response = proxy(new NextRequest(origin + path));
      nonce(response);
      expect(response.headers.get('cache-control')).toBe(
        'private, no-store, max-age=0',
      );
      expect(response.headers.get('pragma')).toBe('no-cache');
      expect(response.headers.get('expires')).toBe('0');
      expect(response.headers.get('referrer-policy')).toBe('no-referrer');
      expect(response.headers.get('x-content-type-options')).toBe('nosniff');
      const csp = response.headers.get('content-security-policy')!;
      for (const directive of [
        "object-src 'none'",
        "base-uri 'none'",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "connect-src 'self'",
      ])
        expect(csp).toContain(directive);
      expect(response.headers.has('set-cookie')).toBe(false);
      expect(response.headers.has('x-middleware-override-headers')).toBe(false);
      expect(response.body).toBeNull();
    },
  );

  it.each(unrelated)('does not match or modify unrelated route %s', (path) => {
    expect(unstable_doesMiddlewareMatch({ config, url: origin + path })).toBe(
      false,
    );
    const response = proxy(new NextRequest(origin + path));
    expect([...response.headers]).toEqual([...NextResponse.next().headers]);
    for (const header of policyHeaders)
      expect(response.headers.has(header)).toBe(false);
  });

  it('generates a fresh server-side nonce for each response, ignoring supplied nonce/CSP', () => {
    const values = new Set<string>();
    for (let i = 0; i < 64; i++) {
      const response = proxy(
        new NextRequest(origin + '/pointage/synthetic?nonce=browser-value', {
          headers: {
            'x-nonce': 'browser-value',
            'content-security-policy': "script-src 'nonce-browser-value'",
            'content-security-policy-report-only':
              "script-src 'nonce-browser-value'",
          },
        }),
      );
      values.add(nonce(response));
      expect(
        [...response.headers].some(([, value]) =>
          value.includes('browser-value'),
        ),
      ).toBe(false);
    }
    expect(values.size).toBe(64);
  });

  it.each(['GET', 'POST', 'HEAD', 'OPTIONS'])(
    'cache/privacy policy does not depend on %s request content',
    (method) => {
      const response = proxy(
        new NextRequest(origin + '/api/pointage/synthetic/state', { method }),
      );
      expect(response.headers.get('cache-control')).toBe(
        'private, no-store, max-age=0',
      );
      expect(
        [...response.headers].some(([, value]) =>
          /s-maxage|\bpublic\b/i.test(value),
        ),
      ).toBe(false);
      expect(response.headers.has('access-control-allow-origin')).toBe(false);
      expect(response.headers.get('x-middleware-next')).toBe('1');
    },
  );

  it('never reads or serializes inbound headers, cookies, body, query or employee data', () => {
    const request = new NextRequest(origin + '/pointage/synthetic');
    const untouched = () => {
      throw new Error('U3 accessed forbidden input');
    };
    for (const key of [
      'headers',
      'cookies',
      'body',
      'json',
      'text',
      'arrayBuffer',
      'formData',
      'url',
    ])
      Object.defineProperty(request, key, { get: untouched });
    Object.defineProperty(request.nextUrl, 'searchParams', { get: untouched });
    const logs = ['log', 'info', 'warn', 'error', 'debug'].map((key) =>
      vi.spyOn(console, key as 'log').mockImplementation(() => undefined),
    );
    const response = proxy(request);
    nonce(response);
    expect([...response.headers.keys()].sort()).toEqual(
      [...policyHeaders, 'x-middleware-next'].sort(),
    );
    expect(response.body).toBeNull();
    for (const log of logs) expect(log).not.toHaveBeenCalled();
  });

  it.each(['production', 'test', undefined])(
    'no dev connection or unsafe script allowance in %s',
    (mode) => {
      vi.stubEnv('NODE_ENV', mode);
      vi.stubEnv('YUTA_POINTAGE_SYNTHETIC_TEST_MODE', 'true');
      vi.stubEnv('POINTAGE_TEST_ORIGIN', origin);
      const csp = proxy(
        new NextRequest(origin + '/pointage/synthetic'),
      ).headers.get('content-security-policy')!;
      expect(csp).toContain("connect-src 'self'");
      expect(csp).not.toMatch(/ws:|wss:|unsafe-eval|unsafe-inline|\*/);
    },
  );

  it('dev HMR allowance is exact configured loopback, never browser host/provenance', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('YUTA_POINTAGE_SYNTHETIC_TEST_MODE', 'true');
    vi.stubEnv('POINTAGE_TEST_ORIGIN', origin);
    const request = new NextRequest(
      'http://untrusted.example/pointage/synthetic',
      {
        headers: {
          Host: 'untrusted.example',
          Forwarded: 'host=untrusted.example',
          'X-Forwarded-Host': 'untrusted.example',
          'X-Forwarded-For': '203.0.113.1',
          'X-Real-IP': '203.0.113.2',
        },
      },
    );
    const csp = proxy(request).headers.get('content-security-policy')!;
    expect(csp).toContain("connect-src 'self' ws://127.0.0.1:3001");
    expect(csp).not.toMatch(/untrusted|203\.0\.113|unsafe-eval|unsafe-inline/);
    vi.stubEnv('POINTAGE_TEST_ORIGIN', 'http://untrusted.example');
    expect(proxy(request).headers.get('content-security-policy')).not.toContain(
      'ws:',
    );
    vi.stubEnv('POINTAGE_TEST_ORIGIN', origin);
    vi.stubEnv('YUTA_POINTAGE_SYNTHETIC_TEST_MODE', undefined);
    expect(proxy(request).headers.get('content-security-policy')).not.toContain(
      'ws:',
    );
  });

  it('contains only the approved transport dependency and has no persistent or personal-data operations', () => {
    const source = readFileSync(resolve(__dirname, '../src/proxy.ts'), 'utf8');
    expect(
      [...source.matchAll(/from '([^']+)'/g)].map((match) => match[1]),
    ).toEqual(['node:crypto', 'next/server']);
    expect(source).toContain('randomBytes(16)');
    expect(source).not.toMatch(
      /request\.(headers|cookies|body|json|text|url)|searchParams|console\.|fetch\(|localStorage|sessionStorage|indexedDB|serviceWorker|@yuta\/(auth|db-cloud)|writeFile|new Headers/,
    );
  });
});
