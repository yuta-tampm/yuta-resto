'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { useParams } from 'next/navigation';
import type {
  PointageCommittedReceiptResponse,
  PointageRecoverInput,
} from '@yuta/contracts';
import {
  endPointage,
  identifyPointage,
  mutatePointage,
  recoverPointage,
  readPointageState,
} from '../_lib/pointage-client';
import {
  initialPointagePresentation,
  reducePointagePresentation,
  type PointagePresentation,
  type PointageVisibleFailure,
} from '../_lib/pointage-interaction';
import { PointageActiveInteraction } from './pointage-active-interaction';
import { PointageCredentialEntry } from './pointage-credential-entry';

// Route-owned interaction only. Protected identity/intent stays in live memory,
// never in presentation, a shared registry, or durable browser storage.
export function createPointagePresentationController(slug: string) {
  let snapshot = initialPointagePresentation;
  let continuation: string | undefined;
  let stateGuard: string | undefined;
  let tuple: Readonly<PointageRecoverInput> | undefined;
  let generation = 0;
  let disposed = false;
  let flight: { generation: number; abort: AbortController } | undefined;
  let absoluteDeadline: number | undefined;
  let idleDeadline: number | undefined;
  let receiptDeadline: number | undefined;
  let absoluteTimer: ReturnType<typeof setTimeout> | undefined;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  let receiptTimer: ReturnType<typeof setTimeout> | undefined;
  let detachLifecycle: (() => void) | undefined;
  let visibility: (() => DocumentVisibilityState) | undefined;
  const listeners = new Set<() => void>();

  function dispatch(event: Parameters<typeof reducePointagePresentation>[1]) {
    snapshot = reducePointagePresentation(snapshot, event);
    for (const listener of listeners) listener();
  }

  function end() {
    ++generation;
    const token = continuation;
    continuation = undefined;
    stateGuard = undefined;
    tuple = undefined;
    const pending = flight;
    flight = undefined;
    absoluteDeadline = undefined;
    idleDeadline = undefined;
    receiptDeadline = undefined;
    clearTimeout(receiptTimer);
    clearTimeout(idleTimer);
    clearTimeout(absoluteTimer);
    receiptTimer = undefined;
    idleTimer = undefined;
    absoluteTimer = undefined;
    pending?.abort.abort();
    dispatch({ type: 'END' });
    // Token is captured only for this one best-effort end. No ACK claim, retry
    // queue, or completion callback that could restore an old presentation.
    if (token) void endPointage(slug, token);
  }

  function deadlinesExpired() {
    const now = performance.now();
    return [absoluteDeadline, idleDeadline, receiptDeadline].some(
      (deadline) => deadline !== undefined && now >= deadline,
    );
  }

  function current(expected: number) {
    if (disposed || generation !== expected) return false;
    if (visibility?.() === 'hidden' || deadlinesExpired()) {
      end();
      return false;
    }
    return true;
  }

  // Every callback captures its generation and immutable monotonic deadline.
  // Early wakeups re-arm against that same deadline; delayed wakeups clear.
  function armDeadline(
    deadline: number,
    expected: number,
    assign: (timer: ReturnType<typeof setTimeout>) => void,
    stillCurrent: () => boolean = () => true,
  ) {
    function check() {
      if (disposed || generation !== expected || !stillCurrent()) return;
      const remaining = deadline - performance.now();
      if (remaining <= 0) end();
      else assign(setTimeout(check, remaining));
    }
    assign(setTimeout(check, Math.max(0, deadline - performance.now())));
  }

  function armLifetime() {
    clearTimeout(absoluteTimer);
    clearTimeout(idleTimer);
    const absolute = absoluteDeadline;
    const idle = idleDeadline;
    if (absolute !== undefined)
      armDeadline(
        absolute,
        generation,
        (timer) => {
          absoluteTimer = timer;
        },
        () => absoluteDeadline === absolute,
      );
    if (idle !== undefined)
      armDeadline(
        idle,
        generation,
        (timer) => {
          idleTimer = timer;
        },
        () => idleDeadline === idle,
      );
  }

  function operationFailure(code: PointageVisibleFailure) {
    if (code === 'POINTAGE_ACCESS_DENIED') {
      end();
      return;
    }
    // An unavailable mutation/recovery result cannot prove absence of commit.
    const visible = code === 'POINTAGE_UNAVAILABLE' ? 'RESULT_UNKNOWN' : code;
    dispatch({
      type: 'FAILED',
      code: visible,
      ...(visible === 'RESULT_UNKNOWN'
        ? { action: 'recover' as const }
        : visible === 'POINTAGE_STATE_CONFLICT' ||
            visible === 'POINTAGE_REQUEST_CONFLICT'
          ? { action: 'refresh' as const }
          : {}),
    });
  }

  function committed(value: PointageCommittedReceiptResponse) {
    if (
      !tuple ||
      value.result !== 'COMMITTED' ||
      value.requestId !== tuple.requestId ||
      value.kind !== tuple.kind
    ) {
      operationFailure('RESULT_UNKNOWN');
      return;
    }
    tuple = undefined;
    const { kind, acceptedAt, timezoneName, utcOffsetSeconds, businessDate } =
      value;
    // Receipt has no remaining-lifetime fields. Never assume an idle renewal.
    receiptDeadline = performance.now() + 10_000;
    armDeadline(receiptDeadline, generation, (timer) => {
      receiptTimer = timer;
    });
    dispatch({
      type: 'COMMITTED',
      receipt: {
        kind,
        acceptedAt,
        timezoneName,
        utcOffsetSeconds,
        businessDate,
      },
    });
  }

  return {
    getSnapshot: () => snapshot,
    getGeneration: () => generation,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    bindLifecycle(
      doc: Pick<
        Document,
        'visibilityState' | 'addEventListener' | 'removeEventListener'
      >,
      win: Pick<Window, 'addEventListener' | 'removeEventListener'>,
    ) {
      detachLifecycle?.();
      // React development effect replay may reattach after cleanup. It resumes
      // only the neutral controller, never its discarded interaction/generation.
      disposed = false;
      visibility = () => doc.visibilityState;
      // Browser events run outside React's render/effect phase. Flush the
      // neutral external-store update before returning to a page snapshot.
      const hidden = () => {
        if (doc.visibilityState === 'hidden') flushSync(end);
      };
      const pagehide = () => flushSync(end);
      const pageshow = () => flushSync(end);
      doc.addEventListener('visibilitychange', hidden);
      win.addEventListener('pagehide', pagehide);
      win.addEventListener('pageshow', pageshow);
      detachLifecycle = () => {
        doc.removeEventListener('visibilitychange', hidden);
        win.removeEventListener('pagehide', pagehide);
        win.removeEventListener('pageshow', pageshow);
      };
      // Initial effect attachment has only neutral server presentation; do not
      // call flushSync from a React effect (including development replay).
      if (doc.visibilityState === 'hidden') end();
    },
    setPin(pin: string) {
      if (current(generation) && /^[0-9]{0,8}$/u.test(pin))
        dispatch({ type: 'PIN', pin });
    },
    async identify() {
      if (
        !current(generation) ||
        flight ||
        (snapshot.phase !== 'CREDENTIAL_ENTRY' &&
          snapshot.phase !== 'NEUTRAL') ||
        !/^[0-9]{8}$/u.test(snapshot.pin)
      )
        return;
      const pending = { generation, abort: new AbortController() };
      flight = pending;
      // Anchor before request dispatch, not response receipt. Subtracting the
      // whole round trip is conservative even without a server clock timestamp.
      const requestedAt = performance.now();
      const request = identifyPointage(
        slug,
        snapshot.pin,
        pending.abort.signal,
      );
      dispatch({ type: 'IDENTIFY' });
      const result = await request;
      if (!current(pending.generation) || flight !== pending) return;
      flight = undefined;
      if (!result.ok) {
        dispatch({ type: 'FAILED', code: result.code });
        return;
      }
      continuation = result.value.continuation;
      stateGuard = result.value.state.stateGuard;
      absoluteDeadline = requestedAt + result.value.expiresInMs;
      idleDeadline = Math.min(
        absoluteDeadline,
        requestedAt + result.value.idleInMs,
      );
      if (!current(pending.generation)) return;
      armLifetime();
      const { displayName, status, openSessionStart } = result.value.state;
      dispatch({
        type: 'IDENTIFIED',
        employee: { displayName, status, openSessionStart },
      });
    },
    async mutate() {
      if (
        !current(generation) ||
        flight ||
        tuple ||
        snapshot.phase !== 'ACTIVE' ||
        !continuation ||
        !stateGuard
      )
        return;
      const kind =
        snapshot.employee.status === 'CLOCKED_IN' ? 'CLOCK_OUT' : 'CLOCK_IN';
      const pending = { generation, abort: new AbortController() };
      flight = pending;
      // Freeze the entire identity/intent before the first network dispatch.
      try {
        tuple = Object.freeze({
          requestId: crypto.randomUUID(),
          kind,
          observedStateGuard: stateGuard,
        });
      } catch {
        flight = undefined;
        dispatch({ type: 'MUTATE' });
        dispatch({ type: 'FAILED', code: 'POINTAGE_UNAVAILABLE' });
        return;
      }
      const request = mutatePointage(
        slug,
        continuation,
        kind,
        {
          requestId: tuple.requestId,
          observedStateGuard: tuple.observedStateGuard,
        },
        pending.abort.signal,
      );
      dispatch({ type: 'MUTATE' });
      const result = await request;
      if (!current(pending.generation) || flight !== pending) return;
      flight = undefined;
      if (!result.ok) {
        operationFailure(result.code);
        return;
      }
      committed(result.value);
    },
    async recover() {
      if (
        !current(generation) ||
        flight ||
        !tuple ||
        !continuation ||
        snapshot.phase !== 'FAILURE' ||
        snapshot.action !== 'recover'
      )
        return;
      const pending = { generation, abort: new AbortController() };
      flight = pending;
      dispatch({ type: 'RECOVER' });
      if (!current(pending.generation) || flight !== pending) return;
      const result = await recoverPointage(
        slug,
        continuation,
        tuple,
        pending.abort.signal,
      );
      if (!current(pending.generation) || flight !== pending) return;
      if (!result.ok) {
        flight = undefined;
        operationFailure(result.code);
        return;
      }
      if (result.value.result === 'COMMITTED') {
        flight = undefined;
        committed(result.value);
        return;
      }
      // Human-approved U7: one explicit click permits at most one resend,
      // only after exact UNCONFIRMED; no state refresh or new tuple between.
      if (!tuple || !continuation) return;
      const resend = await mutatePointage(
        slug,
        continuation,
        tuple.kind,
        {
          requestId: tuple.requestId,
          observedStateGuard: tuple.observedStateGuard,
        },
        pending.abort.signal,
      );
      if (!current(pending.generation) || flight !== pending) return;
      flight = undefined;
      if (!resend.ok) operationFailure(resend.code);
      else committed(resend.value);
    },
    async refreshState() {
      if (
        !current(generation) ||
        flight ||
        !continuation ||
        absoluteDeadline === undefined ||
        snapshot.phase !== 'FAILURE' ||
        snapshot.action !== 'refresh'
      )
        return;
      const pending = { generation, abort: new AbortController() };
      flight = pending;
      const requestedAt = performance.now();
      dispatch({ type: 'REFRESH' });
      if (!current(pending.generation) || flight !== pending) return;
      const result = await readPointageState(
        slug,
        continuation,
        pending.abort.signal,
      );
      if (!current(pending.generation) || flight !== pending) return;
      flight = undefined;
      if (!result.ok) {
        if (result.code === 'POINTAGE_ACCESS_DENIED') end();
        else dispatch({ type: 'FAILED', code: result.code, action: 'refresh' });
        return;
      }
      absoluteDeadline = Math.min(
        absoluteDeadline,
        requestedAt + result.value.expiresInMs,
      );
      idleDeadline = Math.min(
        absoluteDeadline,
        requestedAt + result.value.idleInMs,
      );
      if (!current(pending.generation)) return;
      stateGuard = result.value.state.stateGuard;
      tuple = undefined;
      armLifetime();
      const { displayName, status, openSessionStart } = result.value.state;
      dispatch({
        type: 'IDENTIFIED',
        employee: { displayName, status, openSessionStart },
      });
    },
    end,
    dispose() {
      disposed = true;
      end();
      detachLifecycle?.();
      detachLifecycle = undefined;
      visibility = undefined;
      listeners.clear();
    },
  };
}

type Controller = ReturnType<typeof createPointagePresentationController>;

export function PointageEmployeeView({
  snapshot,
  controller,
}: {
  snapshot: PointagePresentation;
  controller: Pick<
    Controller,
    'setPin' | 'identify' | 'mutate' | 'recover' | 'refreshState' | 'end'
  >;
}) {
  const focusTarget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (snapshot.phase === 'CREDENTIAL_ENTRY') return;
    if (snapshot.phase === 'NEUTRAL') {
      focusTarget.current?.querySelector('input')?.focus();
    } else {
      focusTarget.current?.focus();
    }
  }, [snapshot.phase]);

  const entry =
    snapshot.phase === 'CREDENTIAL_ENTRY' ||
    snapshot.phase === 'NEUTRAL' ||
    snapshot.phase === 'IDENTIFY_PENDING';
  return (
    <main className="min-h-dvh bg-canvas px-4 py-8 text-primary">
      <div className="mx-auto grid w-full min-w-0 max-w-120 gap-6">
        <h1 className="text-2xl font-bold">Pointage</h1>
        <div
          ref={focusTarget}
          tabIndex={-1}
          aria-label="Interaction de pointage"
          className="min-w-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-focus-ring"
        >
          {entry ? (
            <PointageCredentialEntry
              pin={snapshot.pin}
              pending={snapshot.phase === 'IDENTIFY_PENDING'}
              ended={snapshot.phase === 'NEUTRAL'}
              onPinChange={controller.setPin}
              onIdentify={controller.identify}
            />
          ) : (
            <PointageActiveInteraction
              snapshot={snapshot}
              onMutate={controller.mutate}
              onEnd={controller.end}
              onRecover={controller.recover}
              onRefresh={controller.refreshState}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function BoundPointageEmployee({ slug }: { slug: string }) {
  const [controller] = useState(() =>
    createPointagePresentationController(slug),
  );
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    () => initialPointagePresentation,
  );
  useEffect(() => {
    controller.bindLifecycle(document, window);
    return () => controller.dispose();
  }, [controller]);
  return <PointageEmployeeView snapshot={snapshot} controller={controller} />;
}

export function PointageEmployee() {
  // Public locator only. Trusted establishment authority remains server-owned.
  const params = useParams<{ establishmentSlug: string }>();
  const slug =
    typeof params.establishmentSlug === 'string'
      ? params.establishmentSlug
      : '';
  return <BoundPointageEmployee key={slug} slug={slug} />;
}
