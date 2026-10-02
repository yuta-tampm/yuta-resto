import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Children, createElement, isValidElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, Input } from '@yuta/ui';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createPointagePresentationController,
  PointageEmployeeView,
} from '../src/app/pointage/[establishmentSlug]/_components/pointage-employee';
import { PointageCredentialEntry } from '../src/app/pointage/[establishmentSlug]/_components/pointage-credential-entry';
import { PointageActiveInteraction } from '../src/app/pointage/[establishmentSlug]/_components/pointage-active-interaction';
import {
  initialPointagePresentation,
  pointageCalendarLabel,
  pointageFailureCopy,
  reducePointagePresentation,
} from '../src/app/pointage/[establishmentSlug]/_lib/pointage-interaction';

// Deterministic component/controller tests, not a mock usable route, SQL proof,
// rendered-browser interaction test, or Browser QA. No server is started.
const token = `ptc1_${'A'.repeat(43)}`;
const guard = 'B'.repeat(42) + 'A';
const pin = '38172649';
const requestId = '10000000-0000-4000-8000-000000000001';
const calendar = {
  timezoneName: 'Europe/Paris',
  utcOffsetSeconds: 7_200,
  businessDate: '2026-09-11',
};
const instant = '2026-09-11T10:23:45.123456Z';
const identifyPayload = (clocked = false) => ({
  continuation: token,
  expiresInMs: 120_000,
  idleInMs: 60_000,
  state: {
    displayName: 'Employé Synthétique',
    status: clocked ? 'CLOCKED_IN' : 'NOT_CLOCKED_IN',
    stateGuard: guard,
    openSessionStart: clocked ? { instant, ...calendar } : null,
  },
});
const receipt = (kind: 'CLOCK_IN' | 'CLOCK_OUT' = 'CLOCK_IN') => ({
  requestId,
  result: 'COMMITTED' as const,
  kind,
  acceptedAt: instant,
  ...calendar,
});
const json = (value: unknown, status = 200) => Response.json(value, { status });
type Controller = ReturnType<typeof createPointagePresentationController>;
let controller: Controller;
const http = vi.fn<typeof fetch>();

function html() {
  return renderToStaticMarkup(
    createElement(PointageEmployeeView, {
      snapshot: controller.getSnapshot(),
      controller,
    }),
  );
}

function elements(
  root: ReactNode,
): { type: unknown; props: Record<string, unknown> }[] {
  const found: { type: unknown; props: Record<string, unknown> }[] = [];
  Children.forEach(root, (child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return;
    found.push({ type: child.type, props: child.props });
    found.push(...elements(child.props.children));
  });
  return found;
}

function entry() {
  const state = controller.getSnapshot();
  if (!('pin' in state)) throw new Error('Expected entry presentation.');
  return PointageCredentialEntry({
    pin: state.pin,
    pending: state.phase === 'IDENTIFY_PENDING',
    ended: state.phase === 'NEUTRAL',
    onPinChange: controller.setPin,
    onIdentify: controller.identify,
  });
}

function submitEntry() {
  const form = elements(entry()).find((node) => node.type === 'form')!;
  const preventDefault = vi.fn();
  (form.props.onSubmit as (event: { preventDefault: () => void }) => void)({
    preventDefault,
  });
  expect(preventDefault).toHaveBeenCalledOnce();
}

function clickMutation() {
  const root = PointageActiveInteraction({
    snapshot: controller.getSnapshot(),
    onMutate: controller.mutate,
    onEnd: controller.end,
    onRecover: controller.recover,
    onRefresh: controller.refreshState,
  });
  const primary = elements(root).find(
    (node) => node.type === Button && node.props.variant !== 'secondary',
  )!;
  (primary.props.onClick as () => void)();
}

function deferred() {
  let complete!: (response: Response) => void;
  const promise = new Promise<Response>((done) => {
    complete = done;
  });
  return { promise, complete };
}

async function identify(clocked = false) {
  http.mockResolvedValueOnce(json(identifyPayload(clocked)));
  controller.setPin(pin);
  await controller.identify();
  expect(controller.getSnapshot().phase).toBe('ACTIVE');
}

function assertNoProtectedOutput(markup = html()) {
  for (const secret of [pin, token, guard, requestId])
    expect(markup.includes(secret)).toBe(false);
  expect(markup).not.toMatch(
    /stateGuard|requestId|continuation|dossier|credentialVersion|Historique|Total|Dernier départ|Choisir un employé/u,
  );
}

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'Date', 'performance'],
  });
  http.mockReset();
  vi.stubGlobal('fetch', http);
  vi.spyOn(crypto, 'randomUUID').mockReturnValue(requestId);
  controller = createPointagePresentationController('synthetic-establishment');
});
afterEach(() => {
  controller.dispose();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('U5 visible presentation and actual component callback wiring', () => {
  it('initial neutral credential form has label, masked numeric shape, disabled submit and 48px controls', () => {
    const markup = html();
    expect(markup).toContain('Saisissez votre code de pointage');
    expect(markup).toContain('for="pointage-credential"');
    expect(markup).toContain('type="password"');
    expect(markup).toContain('inputMode="numeric"');
    expect(markup).toContain('pattern="[0-9]{8}"');
    expect(markup).toContain('autoComplete="off"');
    expect(markup).toContain('type="submit"');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('h-12');
    expect(markup).toContain('focus:ring-focus-ring');
    assertNoProtectedOutput(markup);
    expect(http).not.toHaveBeenCalled();
  });

  it('input and keyboard form submission dispatch exactly once; pending contains no employee', async () => {
    const input = elements(entry()).find((node) => node.type === Input)!;
    (input.props.onChange as (event: { target: { value: string } }) => void)({
      target: { value: pin },
    });
    const pending = deferred();
    http.mockReturnValueOnce(pending.promise);
    submitEntry();
    submitEntry();
    await controller.identify();
    expect(http).toHaveBeenCalledOnce();
    expect(controller.getSnapshot().phase).toBe('IDENTIFY_PENDING');
    expect(html()).toContain('Identification en cours…');
    expect(html()).toContain('aria-busy="true"');
    expect(html()).not.toContain('Employé Synthétique');
    const request = http.mock.calls[0]!;
    expect(request[0]).toBe('/api/pointage/synthetic-establishment/identify');
    expect(request[1]).toMatchObject({
      method: 'POST',
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'error',
    });
    expect(JSON.parse(String(request[1]?.body))).toEqual({ credential: pin });
    expect(request[1]?.headers).toEqual({ 'Content-Type': 'application/json' });
    pending.complete(json(identifyPayload()));
    await vi.waitFor(() =>
      expect(controller.getSnapshot().phase).toBe('ACTIVE'),
    );
    expect('pin' in controller.getSnapshot()).toBe(false);
    expect(html()).not.toContain('type="password"');
    assertNoProtectedOutput();
  });

  it.each([
    '',
    '123',
    '１２３４５６７８',
    '12345678\n',
    '123456789',
    '12ab5678',
  ])('does not identify invalid PIN shape %j', async (value) => {
    controller.setPin(value);
    await controller.identify();
    expect(http).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    'renders only the correct active action; clocked=%s',
    async (clocked) => {
      await identify(clocked);
      expect(html()).toContain('Employé Synthétique');
      expect(html()).toContain(
        clocked ? 'Enregistrer mon départ' : 'Enregistrer mon arrivée',
      );
      expect(html()).not.toContain(
        clocked ? 'Enregistrer mon arrivée' : 'Enregistrer mon départ',
      );
      if (clocked) expect(html()).toContain('12:23:45.123456');
      else expect(html()).not.toContain('Arrivée enregistrée le');
      assertNoProtectedOutput();
    },
  );

  it.each([
    { continuation: token },
    { state: identifyPayload().state },
    {
      ...identifyPayload(),
      state: { ...identifyPayload().state, priorClockOut: instant },
    },
    { ...identifyPayload(), continuation: 'invalid' },
  ])(
    'partial/malformed identify cannot expose protected state or retain PIN',
    async (payload) => {
      http.mockResolvedValueOnce(json(payload));
      controller.setPin(pin);
      await controller.identify();
      expect(controller.getSnapshot()).toEqual({
        phase: 'FAILURE',
        code: 'RESULT_UNKNOWN',
      });
      expect(html()).not.toContain('Employé Synthétique');
      assertNoProtectedOutput();
    },
  );

  it.each([
    ['POINTAGE_ACCESS_DENIED', 403],
    ['POINTAGE_TRY_LATER', 429],
    ['POINTAGE_UNAVAILABLE', 503],
    ['POINTAGE_REQUEST_INVALID', 400],
  ] as const)(
    'clears PIN and announces only generic identify error %s',
    async (code, status) => {
      http.mockResolvedValueOnce(json({ code }, status));
      controller.setPin(pin);
      await controller.identify();
      expect(controller.getSnapshot()).toEqual({ phase: 'FAILURE', code });
      expect(html()).toContain(pointageFailureCopy[code]);
      expect(html()).toContain('role="alert"');
      expect(html()).not.toContain('Employé Synthétique');
      assertNoProtectedOutput();
    },
  );

  it.each(['CLOCK_IN', 'CLOCK_OUT'] as const)(
    'one-shot %s wiring waits for its matching committed receipt, then ends at 10 seconds',
    async (kind) => {
      await identify(kind === 'CLOCK_OUT');
      const pending = deferred();
      http.mockReturnValueOnce(pending.promise);
      clickMutation();
      await controller.mutate();
      expect(http).toHaveBeenCalledTimes(2);
      expect(controller.getSnapshot()).toEqual({ phase: 'MUTATION_PENDING' });
      expect(html()).toContain('Enregistrement en cours…');
      expect(html()).toContain('disabled=""');
      expect(html()).toContain('Terminer');
      expect(html()).not.toMatch(
        /Arrivée enregistrée|Départ enregistré|Employé Synthétique/,
      );
      const [url, init] = http.mock.calls[1]!;
      expect(url).toBe(
        `/api/pointage/synthetic-establishment/${kind === 'CLOCK_IN' ? 'clock-in' : 'clock-out'}`,
      );
      expect(JSON.parse(String(init?.body))).toEqual({
        requestId,
        observedStateGuard: guard,
      });
      expect(init).toMatchObject({
        credentials: 'omit',
        cache: 'no-store',
        headers: { Authorization: `Pointage ${token}` },
      });
      let shownAt = -1;
      const unsubscribe = controller.subscribe(() => {
        if (controller.getSnapshot().phase === 'RECEIPT')
          shownAt = vi.getMockedSystemTime()!.getTime();
      });
      pending.complete(json(receipt(kind)));
      await vi.waitFor(() =>
        expect(controller.getSnapshot().phase).toBe('RECEIPT'),
      );
      const markup = html();
      expect(markup).toContain(
        kind === 'CLOCK_IN' ? 'Arrivée enregistrée' : 'Départ enregistré',
      );
      expect(markup).toContain('11/09/2026 à 12:23:45.123456');
      expect(markup).toContain('role="status"');
      assertNoProtectedOutput(markup);
      http.mockResolvedValueOnce(new Response(null, { status: 204 }));
      // Account for vi.waitFor advancing time while response.json() settles.
      expect(shownAt).toBeGreaterThanOrEqual(0);
      const elapsed = vi.getMockedSystemTime()!.getTime() - shownAt;
      await vi.advanceTimersByTimeAsync(9_999 - elapsed);
      expect(controller.getSnapshot().phase).toBe('RECEIPT');
      await vi.advanceTimersByTimeAsync(1);
      unsubscribe();
      expect(controller.getSnapshot()).toEqual({ phase: 'NEUTRAL', pin: '' });
      expect(html()).not.toContain('enregistrée');
      expect(http.mock.calls[2]?.[0]).toBe(
        '/api/pointage/synthetic-establishment/end',
      );
      expect(JSON.parse(String(http.mock.calls[2]?.[1]?.body))).toEqual({});
      expect(http).toHaveBeenCalledTimes(3);
    },
  );

  it.each([
    ['POINTAGE_STATE_CONFLICT', 409],
    ['POINTAGE_REQUEST_CONFLICT', 409],
    ['POINTAGE_ACCESS_DENIED', 403],
    ['POINTAGE_TRY_LATER', 429],
    ['POINTAGE_UNAVAILABLE', 503],
    ['POINTAGE_REQUEST_INVALID', 400],
  ] as const)(
    'mutation %s has no success or automatic retry/rebase',
    async (code, status) => {
      await identify();
      http.mockResolvedValueOnce(json({ code }, status));
      await controller.mutate();
      // U7 explicitly clears denied authority and keeps unavailable mutation
      // outcomes unknown; confirmed conflicts now expose explicit refresh.
      if (code === 'POINTAGE_ACCESS_DENIED') {
        expect(controller.getSnapshot()).toEqual({ phase: 'NEUTRAL', pin: '' });
      } else {
        const visible =
          code === 'POINTAGE_UNAVAILABLE' ? 'RESULT_UNKNOWN' : code;
        const action =
          visible === 'RESULT_UNKNOWN'
            ? 'recover'
            : code === 'POINTAGE_STATE_CONFLICT' ||
                code === 'POINTAGE_REQUEST_CONFLICT'
              ? 'refresh'
              : undefined;
        expect(controller.getSnapshot()).toEqual({
          phase: 'FAILURE',
          code: visible,
          ...(action ? { action } : {}),
        });
        expect(html()).toContain(pointageFailureCopy[visible]);
      }
      expect(html()).not.toContain('Enregistrer mon');
      await controller.mutate();
      await vi.advanceTimersByTimeAsync(300_000);
      expect(http).toHaveBeenCalledTimes(3);
      expect(http.mock.calls[2]?.[0]).toBe(
        '/api/pointage/synthetic-establishment/end',
      );
      assertNoProtectedOutput();
    },
  );

  it.each([
    'network',
    'malformed',
    'wrong-kind',
    'wrong-id',
    'status-mismatch',
  ])(
    'unknown %s never invents an outcome or dispatches recovery',
    async (mode) => {
      await identify();
      if (mode === 'network')
        http.mockRejectedValueOnce(new Error('Synthetic connection loss'));
      else
        http.mockResolvedValueOnce(
          mode === 'malformed'
            ? new Response('invalid JSON')
            : mode === 'wrong-kind'
              ? json(receipt('CLOCK_OUT'))
              : mode === 'wrong-id'
                ? json({
                    ...receipt(),
                    requestId: '20000000-0000-4000-8000-000000000001',
                  })
                : json({ code: 'POINTAGE_ACCESS_DENIED' }, 200),
        );
      await controller.mutate();
      expect(controller.getSnapshot()).toEqual({
        phase: 'FAILURE',
        code: 'RESULT_UNKNOWN',
        action: 'recover',
      });
      expect(html()).toContain(pointageFailureCopy.RESULT_UNKNOWN);
      expect(html()).not.toContain('Enregistrer mon');
      expect(html()).toContain('Vérifier le résultat');
      await controller.mutate();
      await vi.advanceTimersByTimeAsync(300_000);
      expect(http).toHaveBeenCalledTimes(3);
      expect(http.mock.calls[2]?.[0]).toBe(
        '/api/pointage/synthetic-establishment/end',
      );
      assertNoProtectedOutput();
    },
  );

  it('explicit Terminer is wired to immediate neutral even if remote end fails', async () => {
    await identify();
    http.mockRejectedValueOnce(new Error('Synthetic end failure'));
    const root = PointageActiveInteraction({
      snapshot: controller.getSnapshot(),
      onMutate: controller.mutate,
      onEnd: controller.end,
      onRecover: controller.recover,
      onRefresh: controller.refreshState,
    });
    const end = elements(root).find(
      (node) => node.type === Button && node.props.variant === 'secondary',
    )!;
    (end.props.onClick as () => void)();
    expect(controller.getSnapshot()).toEqual({ phase: 'NEUTRAL', pin: '' });
    expect(html()).toContain('Interaction terminée sur cet appareil');
    await vi.runAllTimersAsync();
    expect(html()).not.toContain('Employé Synthétique');
    expect(html()).not.toMatch(/révoqu|serveur.*termin/);
    assertNoProtectedOutput();
  });

  it.each(['identify', 'mutate'] as const)(
    'minimum stale-completion protection after end during %s',
    async (operation) => {
      if (operation === 'mutate') await identify();
      const pending = deferred();
      http.mockReturnValueOnce(pending.promise);
      controller.setPin(pin);
      const work =
        operation === 'identify' ? controller.identify() : controller.mutate();
      http.mockResolvedValueOnce(new Response(null, { status: 204 }));
      controller.end();
      pending.complete(
        json(operation === 'identify' ? identifyPayload() : receipt()),
      );
      await work;
      expect(controller.getSnapshot()).toEqual({ phase: 'NEUTRAL', pin: '' });
      assertNoProtectedOutput();
    },
  );
});

describe('U5 pure boundaries and source regression', () => {
  it('presentation reducer cannot fabricate success from entry or accept a duplicate transition', () => {
    expect(
      reducePointagePresentation(initialPointagePresentation, {
        type: 'COMMITTED',
        receipt: receipt(),
      }),
    ).toBe(initialPointagePresentation);
    expect(
      reducePointagePresentation(initialPointagePresentation, {
        type: 'MUTATE',
      }),
    ).toBe(initialPointagePresentation);
  });

  it.each([-50_400, -561, 0, 561, 50_400])(
    'historical display preserves second offset %s and microseconds without current tzdb',
    (offset) => {
      const wall = new Date(Date.parse(instant) + offset * 1_000).toISOString();
      const label = pointageCalendarLabel(instant, {
        ...calendar,
        businessDate: wall.slice(0, 10),
        utcOffsetSeconds: offset,
      });
      expect(label).toContain(wall.slice(11, 19) + '.123456');
      expect(label).toContain(offset < 0 ? 'UTC-' : 'UTC+');
      if (Math.abs(offset) === 561) expect(label).toContain('00:09:21');
    },
  );

  it('keeps DTO/presentation boundaries, with only approved U6 listeners and no U7/storage/environment hooks', () => {
    const base = resolve(__dirname, '../src/app/pointage/[establishmentSlug]');
    const source = [
      '_lib/pointage-client.ts',
      '_lib/pointage-interaction.ts',
      '_components/pointage-employee.tsx',
      '_components/pointage-credential-entry.tsx',
      '_components/pointage-active-interaction.tsx',
    ]
      .map((path) => readFileSync(resolve(base, path), 'utf8'))
      .join('\n');
    expect(source).not.toMatch(
      /localStorage|sessionStorage|indexedDB|BroadcastChannel|postMessage\(|document\.cookie|history\.|process\.env|@yuta\/(db-cloud|auth|tenant)|setInterval/,
    );
    expect(source).not.toMatch(
      /console\.(log|error|warn|info|debug)|window\.location|Date\.now\(/,
    );
    const owner = readFileSync(
      resolve(base, '_components/pointage-employee.tsx'),
      'utf8',
    );
    expect(owner).toContain('useSyncExternalStore(');
    expect(owner).toContain('snapshot={snapshot} controller={controller}');
    expect(owner).toContain("querySelector('input')?.focus()");
    expect(owner).toContain('focusTarget.current?.focus()');
    expect(owner).toContain('receiptDeadline = performance.now() + 10_000');
    expect(
      [...owner.matchAll(/addEventListener\('([^']+)'/g)].map(
        (match) => match[1],
      ),
    ).toEqual(['visibilitychange', 'pagehide', 'pageshow']);
    const page = readFileSync(resolve(base, 'page.tsx'), 'utf8');
    expect(page).toContain('<PointageEmployee />');
    expect(page).not.toMatch(/fetch\(|cookies\(|headers\(|params|process\.env/);
  });
});

describe('U7 exact-tuple recovery and explicit conflict refresh (Apply only)', () => {
  const nextId = '20000000-0000-4000-8000-000000000002';
  const freshGuard = 'C'.repeat(42) + 'A';
  const frozen = { requestId, kind: 'CLOCK_IN', observedStateGuard: guard };
  const originalBody = { requestId, observedStateGuard: guard };
  function body(index: number) {
    return JSON.parse(String(http.mock.calls[index]?.[1]?.body));
  }
  function path(index: number) {
    return String(http.mock.calls[index]?.[0]).split('/').at(-1);
  }
  function unknown() {
    expect(controller.getSnapshot()).toEqual({
      phase: 'FAILURE',
      code: 'RESULT_UNKNOWN',
      action: 'recover',
    });
    expect(html()).toContain(
      'Résultat non confirmé. Vérifiez cette même demande.',
    );
    expect(html()).toContain('Vérifier le résultat');
    expect(html()).not.toContain('Arrivée enregistrée');
    assertNoProtectedOutput();
  }
  async function beginUnknown(clocked = false) {
    await identify(clocked);
    http.mockRejectedValueOnce(new Error('Synthetic response loss'));
    await controller.mutate();
    unknown();
  }
  async function conflict(code = 'POINTAGE_STATE_CONFLICT') {
    await identify();
    http.mockResolvedValueOnce(json({ code }, 409));
    await controller.mutate();
    expect(controller.getSnapshot()).toEqual({
      phase: 'FAILURE',
      code,
      action: 'refresh',
    });
  }
  function statePayload(
    clocked = true,
    expiresInMs = 120_000,
    idleInMs = 60_000,
  ) {
    return {
      state: { ...identifyPayload(clocked).state, stateGuard: freshGuard },
      expiresInMs,
      idleInMs,
    };
  }
  function activeTree() {
    return PointageActiveInteraction({
      snapshot: controller.getSnapshot(),
      onMutate: controller.mutate,
      onEnd: controller.end,
      onRecover: controller.recover,
      onRefresh: controller.refreshState,
    });
  }
  function clickRecoveryOrRefresh() {
    const primary = elements(activeTree()).find(
      (node) => node.type === Button && node.props.variant !== 'secondary',
    )!;
    (primary.props.onClick as () => void)();
  }
  function assertNeutral() {
    expect(controller.getSnapshot()).toEqual({ phase: 'NEUTRAL', pin: '' });
    assertNoProtectedOutput();
  }

  it('freezes the complete tuple before the initial dispatch and duplicate activation cannot allocate another ID', async () => {
    await identify();
    const freeze = vi.spyOn(Object, 'freeze');
    const pending = deferred();
    http.mockImplementationOnce(() => {
      expect(freeze).toHaveBeenCalledWith(frozen);
      const matching = freeze.mock.results.find(
        (result) => result.value?.requestId === requestId,
      )?.value;
      expect(Object.isFrozen(matching)).toBe(true);
      return pending.promise;
    });
    const operation = controller.mutate();
    await controller.mutate();
    expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
    expect(body(1)).toEqual(originalBody);
    pending.complete(json(receipt()));
    await operation;
    expect(controller.getSnapshot().phase).toBe('RECEIPT');
    await controller.recover();
    expect(http).toHaveBeenCalledTimes(2);
  });

  it.each([false, true])(
    'explicit recover uses exact tuple and continuation; matching receipt avoids resend, clocked=%s',
    async (clocked) => {
      await beginUnknown(clocked);
      const pending = deferred();
      http.mockReturnValueOnce(pending.promise);
      clickRecoveryOrRefresh();
      expect(path(2)).toBe('recover');
      expect(body(2)).toEqual({
        ...frozen,
        kind: clocked ? 'CLOCK_OUT' : 'CLOCK_IN',
      });
      expect(http.mock.calls[2]?.[1]).toMatchObject({
        credentials: 'omit',
        cache: 'no-store',
        redirect: 'error',
        headers: { Authorization: `Pointage ${token}` },
      });
      expect(http.mock.calls[2]?.[1]?.signal).toBeInstanceOf(AbortSignal);
      expect(html()).toContain('aria-busy="true"');
      expect(html()).toContain('disabled=""');
      await controller.recover();
      await controller.mutate();
      expect(http).toHaveBeenCalledTimes(3);
      pending.complete(json(receipt(clocked ? 'CLOCK_OUT' : 'CLOCK_IN')));
      await vi.advanceTimersByTimeAsync(0);
      expect(controller.getSnapshot().phase).toBe('RECEIPT');
      expect(http).toHaveBeenCalledTimes(3);
      expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
      await controller.recover();
      expect(http).toHaveBeenCalledTimes(3);
      await vi.advanceTimersByTimeAsync(9_999);
      expect(controller.getSnapshot().phase).toBe('RECEIPT');
      await vi.advanceTimersByTimeAsync(1);
      assertNeutral();
    },
  );

  it.each([
    'wrong-id',
    'wrong-kind',
    'extra-field',
    'malformed',
    'network',
    '503',
    'status-mismatch',
  ])(
    'recover %s stays unknown with original tuple and cannot resend without exact UNCONFIRMED',
    async (mode) => {
      await beginUnknown();
      if (mode === 'network')
        http.mockRejectedValueOnce(new Error('Synthetic recovery loss'));
      else
        http.mockResolvedValueOnce(
          mode === 'wrong-id'
            ? json({ ...receipt(), requestId: nextId })
            : mode === 'wrong-kind'
              ? json(receipt('CLOCK_OUT'))
              : mode === 'extra-field'
                ? json({ result: 'UNCONFIRMED', retry: true })
                : mode === 'malformed'
                  ? new Response('malformed')
                  : mode === '503'
                    ? json({ code: 'POINTAGE_UNAVAILABLE' }, 503)
                    : json({ result: 'UNCONFIRMED' }, 503),
        );
      await controller.recover();
      unknown();
      expect(http).toHaveBeenCalledTimes(3);
      await vi.advanceTimersByTimeAsync(1_000);
      expect(http).toHaveBeenCalledTimes(3);
      http.mockResolvedValueOnce(json(receipt()));
      await controller.recover();
      expect(body(3)).toEqual(frozen);
      expect(controller.getSnapshot().phase).toBe('RECEIPT');
      expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
    },
  );

  it.each([false, true])(
    'one explicit click -> recover -> UNCONFIRMED -> exactly one same-tuple resend, clocked=%s',
    async (clocked) => {
      await beginUnknown(clocked);
      const pending = deferred();
      http.mockResolvedValueOnce(json({ result: 'UNCONFIRMED' }));
      http.mockReturnValueOnce(pending.promise);
      const action = controller.recover();
      await vi.advanceTimersByTimeAsync(0);
      expect(path(2)).toBe('recover');
      expect(path(3)).toBe(clocked ? 'clock-out' : 'clock-in');
      expect(body(3)).toEqual(body(1));
      expect(body(2)).toEqual({
        ...body(1),
        kind: clocked ? 'CLOCK_OUT' : 'CLOCK_IN',
      });
      expect(controller.getSnapshot().phase).toBe('RECOVERY_PENDING');
      expect(html()).not.toContain('Arrivée enregistrée');
      await controller.recover();
      await controller.refreshState();
      await controller.mutate();
      expect(http).toHaveBeenCalledTimes(4);
      expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
      pending.complete(json(receipt(clocked ? 'CLOCK_OUT' : 'CLOCK_IN')));
      await action;
      expect(controller.getSnapshot().phase).toBe('RECEIPT');
      await controller.recover();
      expect(http).toHaveBeenCalledTimes(4);
    },
  );

  it.each(['network', 'malformed', 'wrong-id', 'wrong-kind', '503'])(
    'uncertain resend %s stops; only a second explicit click repeats bounded cycle',
    async (mode) => {
      await beginUnknown();
      http.mockResolvedValueOnce(json({ result: 'UNCONFIRMED' }));
      if (mode === 'network')
        http.mockRejectedValueOnce(new Error('Synthetic resend loss'));
      else
        http.mockResolvedValueOnce(
          mode === 'malformed'
            ? new Response('malformed')
            : mode === 'wrong-id'
              ? json({ ...receipt(), requestId: nextId })
              : mode === 'wrong-kind'
                ? json(receipt('CLOCK_OUT'))
                : json({ code: 'POINTAGE_UNAVAILABLE' }, 503),
        );
      await controller.recover();
      unknown();
      await vi.advanceTimersByTimeAsync(1_000);
      expect(http).toHaveBeenCalledTimes(4);
      http.mockResolvedValueOnce(json({ result: 'UNCONFIRMED' }));
      http.mockResolvedValueOnce(json(receipt()));
      await controller.recover();
      expect([path(2), path(3), path(4), path(5)]).toEqual([
        'recover',
        'clock-in',
        'recover',
        'clock-in',
      ]);
      expect(body(2)).toEqual(body(4));
      expect(body(3)).toEqual(body(5));
      expect(body(5)).toEqual(originalBody);
      expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
      expect(controller.getSnapshot().phase).toBe('RECEIPT');
    },
  );

  it.each(['POINTAGE_STATE_CONFLICT', 'POINTAGE_REQUEST_CONFLICT'])(
    '%s after resend stops; explicit refresh then new explicit action is required',
    async (code) => {
      await beginUnknown();
      http.mockResolvedValueOnce(json({ result: 'UNCONFIRMED' }));
      http.mockResolvedValueOnce(json({ code }, 409));
      await controller.recover();
      expect(controller.getSnapshot()).toEqual({
        phase: 'FAILURE',
        code,
        action: 'refresh',
      });
      expect(html()).toContain(
        pointageFailureCopy[code as keyof typeof pointageFailureCopy],
      );
      expect(html()).toContain('Actualiser ma situation');
      await controller.recover();
      await controller.mutate();
      expect(http).toHaveBeenCalledTimes(4);
      const pending = deferred();
      http.mockReturnValueOnce(pending.promise);
      clickRecoveryOrRefresh();
      expect(path(4)).toBe('state');
      expect(body(4)).toEqual({});
      expect(html()).toContain('Actualisation en cours');
      expect(html()).toContain('aria-busy="true"');
      await controller.refreshState();
      expect(http).toHaveBeenCalledTimes(5);
      pending.complete(json(statePayload()));
      await vi.advanceTimersByTimeAsync(0);
      expect(controller.getSnapshot().phase).toBe('ACTIVE');
      expect(html()).toContain('Enregistrer mon départ');
      expect(http).toHaveBeenCalledTimes(5);
      expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
      vi.mocked(crypto.randomUUID).mockReturnValueOnce(nextId);
      http.mockResolvedValueOnce(
        json({ ...receipt('CLOCK_OUT'), requestId: nextId }),
      );
      await controller.mutate();
      expect(path(5)).toBe('clock-out');
      expect(body(5)).toEqual({
        requestId: nextId,
        observedStateGuard: freshGuard,
      });
      expect(crypto.randomUUID).toHaveBeenCalledTimes(2);
      assertNoProtectedOutput();
      expect(html()).not.toContain(nextId);
      expect(html()).not.toContain(freshGuard);
    },
  );

  it.each(['POINTAGE_STATE_CONFLICT', 'POINTAGE_REQUEST_CONFLICT'])(
    'initial %s never auto-refreshes/rebases; state request consumes only existing strict DTO',
    async (code) => {
      await conflict(code);
      expect(http).toHaveBeenCalledTimes(2);
      await controller.mutate();
      await controller.recover();
      expect(http).toHaveBeenCalledTimes(2);
      http.mockResolvedValueOnce(json(statePayload(false)));
      await controller.refreshState();
      expect(path(2)).toBe('state');
      expect(body(2)).toEqual({});
      expect(http.mock.calls[2]?.[1]).toMatchObject({
        credentials: 'omit',
        cache: 'no-store',
      });
      expect(controller.getSnapshot().phase).toBe('ACTIVE');
      expect(http).toHaveBeenCalledTimes(3);
    },
  );

  it.each(['malformed', 'extra-field', 'network', '503'])(
    'refresh %s cannot install guard/state or renew lifetime; explicit refresh can be retried',
    async (mode) => {
      await conflict();
      await vi.advanceTimersByTimeAsync(50_000);
      if (mode === 'network')
        http.mockRejectedValueOnce(new Error('Synthetic state loss'));
      else
        http.mockResolvedValueOnce(
          mode === 'malformed'
            ? json({ state: {} })
            : mode === 'extra-field'
              ? json({ ...statePayload(), extra: 'forbidden' })
              : json({ code: 'POINTAGE_UNAVAILABLE' }, 503),
        );
      await controller.refreshState();
      expect(controller.getSnapshot()).toMatchObject({
        phase: 'FAILURE',
        action: 'refresh',
      });
      expect(html()).not.toContain('Employé Synthétique');
      await controller.recover();
      await controller.mutate();
      expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(10_000);
      assertNeutral();
    },
  );

  it('successful foreground state read anchors before dispatch, refreshes idle but never extends absolute', async () => {
    await conflict();
    await vi.advanceTimersByTimeAsync(40_000);
    const pending = deferred();
    http.mockReturnValueOnce(pending.promise);
    const action = controller.refreshState();
    await vi.advanceTimersByTimeAsync(5_000);
    pending.complete(json(statePayload(false, 120_000, 60_000)));
    await action;
    await vi.advanceTimersByTimeAsync(54_999);
    expect(controller.getSnapshot().phase).toBe('ACTIVE');
    await vi.advanceTimersByTimeAsync(1);
    assertNeutral(); // requestStart40s + idle60s, not responseAt45s +60s.
  });

  it('repeated explicit state responses cannot move the original absolute deadline', async () => {
    await conflict();
    await vi.advanceTimersByTimeAsync(50_000);
    http.mockResolvedValueOnce(json(statePayload(false)));
    await controller.refreshState();
    http.mockResolvedValueOnce(json({ code: 'POINTAGE_STATE_CONFLICT' }, 409));
    await controller.mutate();
    await vi.advanceTimersByTimeAsync(50_000);
    http.mockResolvedValueOnce(json(statePayload(false)));
    await controller.refreshState();
    await vi.advanceTimersByTimeAsync(19_999);
    expect(controller.getSnapshot().phase).toBe('ACTIVE');
    await vi.advanceTimersByTimeAsync(1);
    assertNeutral();
  });

  it('superseded idle timer cannot clear refreshed same-generation state', async () => {
    const timers = vi.spyOn(globalThis, 'setTimeout');
    await conflict();
    const oldIdle = timers.mock.calls[1]?.[0] as () => void;
    await vi.advanceTimersByTimeAsync(50_000);
    http.mockResolvedValueOnce(json(statePayload(false)));
    await controller.refreshState();
    vi.setSystemTime(new Date('2099-01-01')); // Wall clock does not own lifetime.
    await vi.advanceTimersByTimeAsync(10_000);
    oldIdle();
    expect(controller.getSnapshot().phase).toBe('ACTIVE');
    await vi.advanceTimersByTimeAsync(50_000);
    assertNeutral();
  });

  it('zero remaining lifetime from state clears before presenting fresh employee', async () => {
    await conflict();
    http.mockResolvedValueOnce(json(statePayload(true, 0, 0)));
    await controller.refreshState();
    assertNeutral();
  });

  it.each(['mutation', 'recover', 'resend', 'state'])(
    'access denial during %s clears protected tuple and cannot survive re-identification',
    async (operation) => {
      if (operation === 'state') await conflict();
      else if (operation === 'mutation') await identify();
      else await beginUnknown();
      if (operation === 'resend')
        http.mockResolvedValueOnce(json({ result: 'UNCONFIRMED' }));
      http.mockResolvedValueOnce(json({ code: 'POINTAGE_ACCESS_DENIED' }, 403));
      if (operation === 'state') await controller.refreshState();
      else if (operation === 'mutation') await controller.mutate();
      else await controller.recover();
      assertNeutral();
      const count = http.mock.calls.length;
      await controller.recover();
      await controller.refreshState();
      expect(http).toHaveBeenCalledTimes(count);
      await identify();
      await controller.recover();
      expect(http).toHaveBeenCalledTimes(count + 1);
    },
  );

  it.each([
    'end',
    'hidden',
    'pagehide',
    'pageshow',
    'dispose',
    'idle',
    'absolute',
  ])(
    '%s during recover destroys authority and prevents UNCONFIRMED from dispatching resend',
    async (boundary) => {
      if (boundary === 'absolute') {
        http.mockResolvedValueOnce(
          json({ ...identifyPayload(), expiresInMs: 60_000 }),
        );
        controller.setPin(pin);
        await controller.identify();
        http.mockRejectedValueOnce(new Error('Synthetic loss'));
        await controller.mutate();
      } else await beginUnknown();
      const doc = Object.assign(new EventTarget(), {
        visibilityState: 'visible' as DocumentVisibilityState,
      });
      const win = new EventTarget();
      controller.bindLifecycle(doc, win);
      const pending = deferred();
      http.mockReturnValueOnce(pending.promise);
      const action = controller.recover();
      const signal = http.mock.calls[2]?.[1]?.signal;
      if (boundary === 'end') controller.end();
      else if (boundary === 'dispose') controller.dispose();
      else if (boundary === 'hidden') {
        doc.visibilityState = 'hidden';
        doc.dispatchEvent(new Event('visibilitychange'));
      } else if (boundary === 'idle' || boundary === 'absolute')
        await vi.advanceTimersByTimeAsync(60_000);
      else win.dispatchEvent(new Event(boundary));
      expect(signal?.aborted).toBe(true);
      const count = http.mock.calls.length;
      pending.complete(json({ result: 'UNCONFIRMED' }));
      await action;
      assertNeutral();
      await controller.recover();
      expect(http).toHaveBeenCalledTimes(count);
      expect(
        http.mock.calls.filter(([url]) => String(url).endsWith('/clock-in')),
      ).toHaveLength(1);
    },
  );

  it.each(['recover', 'resend', 'state'])(
    'late %s response cannot restore cleared tuple or overwrite the next employee',
    async (operation) => {
      if (operation === 'state') await conflict();
      else await beginUnknown();
      const pending = deferred();
      if (operation === 'resend')
        http.mockResolvedValueOnce(json({ result: 'UNCONFIRMED' }));
      http.mockReturnValueOnce(pending.promise);
      const action =
        operation === 'state'
          ? controller.refreshState()
          : controller.recover();
      await vi.advanceTimersByTimeAsync(0);
      const signal = http.mock.calls.at(-1)?.[1]?.signal;
      controller.end();
      expect(signal?.aborted).toBe(true);
      http.mockResolvedValueOnce(
        json({
          ...identifyPayload(),
          state: {
            ...identifyPayload().state,
            displayName: 'Deuxième Synthétique',
          },
        }),
      );
      controller.setPin(pin);
      await controller.identify();
      pending.complete(
        json(operation === 'state' ? statePayload() : receipt()),
      );
      await action;
      expect(html()).toContain('Deuxième Synthétique');
      expect(html()).not.toContain('Employé Synthétique');
      const count = http.mock.calls.length;
      await controller.recover();
      expect(http).toHaveBeenCalledTimes(count);
      assertNoProtectedOutput();
    },
  );

  it('new/duplicate controllers cannot consume another live recovery tuple', async () => {
    await beginUnknown();
    const other = createPointagePresentationController(
      'synthetic-establishment',
    );
    await other.recover();
    await other.refreshState();
    await other.mutate();
    expect(other.getSnapshot()).toEqual(initialPointagePresentation);
    expect(http).toHaveBeenCalledTimes(2);
    other.dispose();
    unknown();
  });

  it('source boundary allows only existing stateless operations; tuple never enters presentation or durable storage', () => {
    const base = resolve(__dirname, '../src/app/pointage/[establishmentSlug]');
    const client = readFileSync(
      resolve(base, '_lib/pointage-client.ts'),
      'utf8',
    );
    const owner = readFileSync(
      resolve(base, '_components/pointage-employee.tsx'),
      'utf8',
    );
    const view = readFileSync(
      resolve(base, '_components/pointage-active-interaction.tsx'),
      'utf8',
    );
    expect(owner).toContain('Object.freeze(');
    expect(owner).toContain('tuple = undefined');
    expect(client).toContain('pointageRecoverResponseSchema.parse');
    expect(client).toContain('pointageStateResponseSchema.parse');
    expect(client).not.toMatch(
      /setTimeout|setInterval|randomUUID|Object.freeze|localStorage|sessionStorage/,
    );
    expect(view).not.toMatch(/requestId|observedStateGuard|continuation/);
    expect(owner + client + view).not.toMatch(
      /localStorage|sessionStorage|indexedDB|history\.|BroadcastChannel|postMessage|serviceWorker|window\.name|setInterval/,
    );
  });
});

describe('U6 deterministic shared-device lifecycle (not Browser QA)', () => {
  function lifecycle() {
    const doc = Object.assign(new EventTarget(), {
      visibilityState: 'visible' as DocumentVisibilityState,
    });
    const win = new EventTarget();
    controller.bindLifecycle(doc, win);
    return { doc, win };
  }

  function neutral() {
    expect(controller.getSnapshot()).toEqual({ phase: 'NEUTRAL', pin: '' });
    assertNoProtectedOutput();
    expect(html()).not.toContain('Employé Synthétique');
  }

  it('end increments generation, clears references/timers, and cannot reuse token or guard', async () => {
    await identify();
    expect(vi.getTimerCount()).toBe(2);
    const previous = controller.getGeneration();
    http.mockResolvedValueOnce(new Response(null, { status: 204 }));
    controller.end();
    expect(controller.getGeneration()).toBe(previous + 1);
    neutral();
    expect(vi.getTimerCount()).toBe(0);
    await controller.mutate();
    controller.end();
    expect(http).toHaveBeenCalledTimes(2);
    expect(http.mock.calls[1]?.[0]).toContain('/end');
    expect(
      Object.values(controller).every((value) => typeof value === 'function'),
    ).toBe(true);
  });

  it.each(['identify', 'mutate'] as const)(
    'aborts %s and ignores late success from the old generation',
    async (operation) => {
      if (operation === 'mutate') await identify();
      const pending = deferred();
      http.mockReturnValueOnce(pending.promise);
      controller.setPin(pin);
      const work =
        operation === 'identify' ? controller.identify() : controller.mutate();
      const signal = http.mock.calls.at(-1)![1]!.signal!;
      const previous = controller.getGeneration();
      controller.end();
      expect(signal.aborted).toBe(true);
      expect(controller.getGeneration()).toBe(previous + 1);
      await identify();
      const newState = controller.getSnapshot();
      pending.complete(
        json(operation === 'identify' ? identifyPayload(true) : receipt()),
      );
      await work;
      expect(controller.getSnapshot()).toBe(newState);
      expect(html()).not.toContain('Arrivée enregistrée');
    },
  );

  it.each(['identify', 'mutate'] as const)(
    'AbortError from cleared %s cannot restore RESULT_UNKNOWN',
    async (operation) => {
      if (operation === 'mutate') await identify();
      http.mockImplementationOnce(
        (_url, init) =>
          new Promise((_done, reject) => {
            init!.signal!.addEventListener('abort', () =>
              reject(new DOMException('Cancelled', 'AbortError')),
            );
          }),
      );
      controller.setPin(pin);
      const work =
        operation === 'identify' ? controller.identify() : controller.mutate();
      controller.end();
      await work;
      neutral();
      expect(html()).not.toContain('Résultat non confirmé');
    },
  );

  it('idle clears at its exact monotonic boundary, irrespective of wall clock changes', async () => {
    await identify();
    vi.setSystemTime(new Date('2099-01-01T00:00:00Z'));
    await vi.advanceTimersByTimeAsync(59_999);
    expect(controller.getSnapshot().phase).toBe('ACTIVE');
    await vi.advanceTimersByTimeAsync(1);
    neutral();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('absolute timer clears at its own fixed boundary without sliding on activity', async () => {
    const timer = vi.spyOn(globalThis, 'setTimeout');
    const { win } = lifecycle();
    await identify();
    const absolute = timer.mock.calls.find(
      (call) => call[1] === 120_000,
    )![0] as () => void;
    const clock = vi.spyOn(performance, 'now');
    clock.mockReturnValue(119_999);
    for (const event of ['mousemove', 'pointermove', 'keydown', 'click'])
      win.dispatchEvent(new Event(event));
    absolute();
    expect(controller.getSnapshot().phase).toBe('ACTIVE');
    expect(timer.mock.calls.at(-1)![1]).toBe(1);
    clock.mockReturnValue(120_000);
    absolute();
    neutral();
  });

  it('known absolute and idle deadlines may coincide and clear at the server upper bound', async () => {
    http.mockResolvedValueOnce(
      json({ ...identifyPayload(), expiresInMs: 2_000, idleInMs: 2_000 }),
    );
    controller.setPin(pin);
    await controller.identify();
    await vi.advanceTimersByTimeAsync(1_999);
    expect(controller.getSnapshot().phase).toBe('ACTIVE');
    await vi.advanceTimersByTimeAsync(1);
    neutral();
  });

  it('round-trip time cannot extend server remaining durations or expose an already-expired identify', async () => {
    const pending = deferred();
    http.mockReturnValueOnce(pending.promise);
    controller.setPin(pin);
    const work = controller.identify();
    await vi.advanceTimersByTimeAsync(1_000);
    pending.complete(
      json({ ...identifyPayload(), expiresInMs: 1_000, idleInMs: 500 }),
    );
    await work;
    neutral();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('zero remaining lifetime clears immediately with no personal presentation', async () => {
    http.mockResolvedValueOnce(
      json({ ...identifyPayload(), expiresInMs: 0, idleInMs: 0 }),
    );
    controller.setPin(pin);
    await controller.identify();
    neutral();
  });

  it('early wakeup re-arms unchanged deadline and late wakeup clears immediately', async () => {
    const timer = vi.spyOn(globalThis, 'setTimeout');
    await identify();
    const idle = timer.mock.calls.find(
      (call) => call[1] === 60_000,
    )![0] as () => void;
    const clock = vi.spyOn(performance, 'now');
    clock.mockReturnValue(20_000);
    idle();
    expect(timer.mock.calls.at(-1)![1]).toBe(40_000);
    expect(controller.getSnapshot().phase).toBe('ACTIVE');
    clock.mockReturnValue(60_001);
    idle();
    neutral();
  });

  it('delayed timer scheduling never permits a mutation beyond a known deadline', async () => {
    await identify();
    vi.spyOn(performance, 'now').mockReturnValue(60_001);
    await controller.mutate();
    neutral();
    expect(http.mock.calls.map((call) => call[0])).toEqual([
      '/api/pointage/synthetic-establishment/identify',
      '/api/pointage/synthetic-establishment/end',
    ]);
  });

  it('receipt cannot assume idle renewal, and clears before 10s at the known idle deadline', async () => {
    await identify();
    await vi.advanceTimersByTimeAsync(59_000);
    http.mockResolvedValueOnce(json(receipt()));
    await controller.mutate();
    expect(controller.getSnapshot().phase).toBe('RECEIPT');
    await vi.advanceTimersByTimeAsync(999);
    expect(controller.getSnapshot().phase).toBe('RECEIPT');
    await vi.advanceTimersByTimeAsync(1);
    neutral();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('old receipt/idle/absolute callbacks cannot clear a later generation', async () => {
    const timer = vi.spyOn(globalThis, 'setTimeout');
    await identify();
    http.mockResolvedValueOnce(json(receipt()));
    await controller.mutate();
    const callbacks = timer.mock.calls.map((call) => call[0] as () => void);
    controller.end();
    await identify(true);
    const next = controller.getSnapshot();
    for (const callback of callbacks) callback();
    expect(controller.getSnapshot()).toBe(next);
  });

  it('user activity cannot renew idle lifetime or issue background requests', async () => {
    const { doc, win } = lifecycle();
    await identify();
    await vi.advanceTimersByTimeAsync(59_000);
    for (const name of ['mousemove', 'pointermove', 'keydown', 'click']) {
      doc.dispatchEvent(new Event(name));
      win.dispatchEvent(new Event(name));
    }
    controller.setPin(pin);
    html();
    expect(http).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(1_000);
    neutral();
  });

  it.each([
    ['pagehide', false],
    ['pagehide', true],
    ['pageshow', false],
    ['pageshow', true],
  ] as const)(
    '%s persisted=%s clears generation and remains neutral',
    async (name, persisted) => {
      const { win } = lifecycle();
      await identify();
      const previous = controller.getGeneration();
      win.dispatchEvent(Object.assign(new Event(name), { persisted }));
      neutral();
      expect(controller.getGeneration()).toBe(previous + 1);
      win.dispatchEvent(Object.assign(new Event(name), { persisted }));
      expect(http).toHaveBeenCalledTimes(2);
      expect(vi.getTimerCount()).toBe(0);
    },
  );

  it('hidden clears synchronously, visible does not restore or reidentify, repeats do not fan out end', async () => {
    const { doc, win } = lifecycle();
    await identify();
    const previous = controller.getGeneration();
    doc.visibilityState = 'hidden';
    doc.dispatchEvent(new Event('visibilitychange'));
    neutral();
    expect(controller.getGeneration()).toBe(previous + 1);
    controller.setPin(pin);
    await controller.identify();
    neutral();
    win.dispatchEvent(new Event('pagehide'));
    doc.visibilityState = 'visible';
    doc.dispatchEvent(new Event('visibilitychange'));
    win.dispatchEvent(new Event('pageshow'));
    neutral();
    expect(http).toHaveBeenCalledTimes(2);
  });

  it('dispose aborts protected work, clears timers/secrets and removes every lifecycle listener', async () => {
    const { doc, win } = lifecycle();
    const removeDoc = vi.spyOn(doc, 'removeEventListener');
    const removeWin = vi.spyOn(win, 'removeEventListener');
    await identify();
    const pending = deferred();
    http.mockReturnValueOnce(pending.promise);
    const work = controller.mutate();
    const signal = http.mock.calls.at(-1)![1]!.signal!;
    controller.dispose();
    const generation = controller.getGeneration();
    expect(signal.aborted).toBe(true);
    neutral();
    expect(vi.getTimerCount()).toBe(0);
    expect(removeDoc.mock.calls.map((call) => call[0])).toEqual([
      'visibilitychange',
    ]);
    expect(removeWin.mock.calls.map((call) => call[0])).toEqual([
      'pagehide',
      'pageshow',
    ]);
    win.dispatchEvent(new Event('pageshow'));
    expect(controller.getGeneration()).toBe(generation);
    controller.setPin(pin);
    await controller.identify();
    pending.complete(json(receipt()));
    await work;
    neutral();
    expect(http).toHaveBeenCalledTimes(3);
  });

  it('React effect cleanup/reattach stays neutral and only permits a fresh user interaction', async () => {
    const { doc, win } = lifecycle();
    await identify();
    controller.dispose();
    const previous = controller.getGeneration();
    controller.bindLifecycle(doc, win);
    neutral();
    expect(controller.getGeneration()).toBe(previous);
    await identify();
  });

  it('refresh/restart/duplicate instance constructs neutral without copying another employee', async () => {
    await identify();
    const other = createPointagePresentationController(
      'synthetic-establishment',
    );
    expect(other.getSnapshot()).toEqual(initialPointagePresentation);
    expect(other.getGeneration()).toBe(0);
    other.dispose();
    expect(controller.getSnapshot().phase).toBe('ACTIVE');
    expect(http).toHaveBeenCalledOnce();
  });

  it('sequential employees have distinct live projection with no prior name/receipt/guard', async () => {
    await identify();
    controller.end();
    http.mockResolvedValueOnce(
      json({
        ...identifyPayload(true),
        continuation: `ptc1_${'C'.repeat(42)}A`,
        state: {
          ...identifyPayload(true).state,
          displayName: 'Deuxième Synthétique',
        },
      }),
    );
    controller.setPin('82917364');
    await controller.identify();
    expect(html()).toContain('Deuxième Synthétique');
    expect(html()).not.toContain('Employé Synthétique');
    assertNoProtectedOutput();
  });

  it('exact route-local listeners are paired and there is no storage/channel/registry authority', () => {
    const base = resolve(__dirname, '../src/app/pointage/[establishmentSlug]');
    const owner = readFileSync(
      resolve(base, '_components/pointage-employee.tsx'),
      'utf8',
    );
    const client = readFileSync(
      resolve(base, '_lib/pointage-client.ts'),
      'utf8',
    );
    for (const operation of ['addEventListener', 'removeEventListener']) {
      const names = [
        ...owner.matchAll(new RegExp(operation + "\\('([^']+)'", 'g')),
      ].map((match) => match[1]);
      expect(names).toEqual(['visibilitychange', 'pagehide', 'pageshow']);
    }
    expect(owner).toContain('controller.bindLifecycle(document, window)');
    expect(owner).toContain("import { flushSync } from 'react-dom'");
    expect([...owner.matchAll(/flushSync\(end\)/g)]).toHaveLength(3);
    expect(owner).toContain('return () => controller.dispose()');
    expect(owner + client).not.toMatch(
      /localStorage|sessionStorage|indexedDB|document\.cookie|history\.|BroadcastChannel|postMessage|serviceWorker|caches\.|window\.name|globalThis\.|setInterval|Date\.now\(/,
    );
    expect(client).toContain('signal,');
    expect(client).toContain("credentials: 'omit'");
  });
});
