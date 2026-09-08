import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  derivePointageRawChain,
  pointageInstantMicroseconds,
  pointageTransitionAllowed,
  pointageChainStateGuard,
  pointageChainGuardMatches,
  PointageEvidenceInconsistentError,
  type PointageRawChainEvent,
} from '../src/server/pointage/raw-chain';

const scope = {
  organizationId: randomUUID(),
  establishmentId: randomUUID(),
  personnelDossierId: randomUUID(),
};
const known = new Set(['UTC', 'Europe/Paris', 'America/New_York']);
function event(
  ordinal: number,
  patch: Partial<PointageRawChainEvent> = {},
): PointageRawChainEvent {
  return {
    ...scope,
    id: randomUUID(),
    ordinal: String(ordinal),
    kind: ordinal % 2 ? 'CLOCK_IN' : 'CLOCK_OUT',
    acceptedAt: '2025-01-01T12:00:00.123456Z',
    timezoneName: 'UTC',
    utcOffsetSeconds: 0,
    businessDate: '2025-01-01',
    receiptLinked: true,
    ...patch,
  };
}

describe('Pointage S1/S2 complete canonical raw-chain reduction', () => {
  it('implements all four transition outcomes without fabricating evidence', () => {
    const empty = derivePointageRawChain(scope, [], known);
    expect(empty).toMatchObject({
      state: 'NOT_CLOCKED_IN',
      open: null,
      headEventId: null,
      sessions: [],
      events: [],
    });
    expect(pointageTransitionAllowed(empty, 'CLOCK_IN')).toBe(true);
    expect(pointageTransitionAllowed(empty, 'CLOCK_OUT')).toBe(false);
    const row = event(1);
    const opened = derivePointageRawChain(scope, [row], known);
    expect(opened).toMatchObject({
      state: 'CLOCKED_IN',
      open: row,
      sessions: [],
    });
    expect(pointageTransitionAllowed(opened, 'CLOCK_IN')).toBe(false);
    expect(pointageTransitionAllowed(opened, 'CLOCK_OUT')).toBe(true);
    expect(opened.events).toHaveLength(1);
  });

  it('derives unlimited sequential sessions and at most one unclosed opening without mutation', () => {
    const rows = Array.from({ length: 401 }, (_, i) => event(i + 1));
    const before = structuredClone(rows);
    const result = derivePointageRawChain(scope, rows, known);
    expect(result.sessions).toHaveLength(200);
    expect(result.open).toEqual(rows.at(-1));
    expect(rows).toEqual(before);
    expect(result.events).toEqual(rows);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.events)).toBe(true);
    expect(Object.isFrozen(result.events[0])).toBe(true);
  });

  it.each([
    ['organization', { organizationId: randomUUID() }],
    ['establishment', { establishmentId: randomUUID() }],
    ['dossier', { personnelDossierId: randomUUID() }],
    ['zero ordinal', { ordinal: '0' }],
    ['ordinal gap', { ordinal: '2' }],
    ['noncanonical ordinal', { ordinal: '01' }],
    ['non-integer ordinal', { ordinal: '1.5' }],
    ['unknown kind', { kind: 'BREAK' }],
    ['OUT first', { kind: 'CLOCK_OUT' }],
    ['missing receipt', { receiptLinked: false }],
    ['unknown timezone', { timezoneName: 'Not/A_Zone' }],
    ['timezone whitespace', { timezoneName: ' UTC' }],
    ['minimum offset overflow', { utcOffsetSeconds: -50401 }],
    ['maximum offset overflow', { utcOffsetSeconds: 50401 }],
    ['fractional offset', { utcOffsetSeconds: 0.5 }],
    ['invalid date', { businessDate: '2025-02-30' }],
    ['inconsistent date', { businessDate: '2025-01-02' }],
    ['infinite date', { businessDate: 'infinity' }],
    ['infinite time', { acceptedAt: 'infinity' }],
    ['calendar alias', { acceptedAt: '2025-02-30T12:00:00.123456Z' }],
    ['lost microseconds', { acceptedAt: '2025-01-01T12:00:00.123Z' }],
    [
      'non-UTC serialization',
      { acceptedAt: '2025-01-01T12:00:00.123456+00:00' },
    ],
    ['additional authority', { isSynthetic: true }],
  ])('rejects %s without returning partial state', (_name, patch) => {
    expect(() =>
      derivePointageRawChain(scope, [{ ...event(1), ...patch }], known),
    ).toThrow(PointageEvidenceInconsistentError);
  });

  it('rejects duplicate identity/ordinal, repeated kinds and backward clocks anywhere in history', () => {
    const first = event(1);
    for (const second of [
      event(2, { id: first.id }),
      event(2, { ordinal: '1' }),
      event(2, { kind: 'CLOCK_IN' }),
      event(2, { acceptedAt: '2025-01-01T12:00:00.123455Z' }),
    ]) {
      expect(() =>
        derivePointageRawChain(scope, [first, second, event(3)], known),
      ).toThrow(PointageEvidenceInconsistentError);
    }
    expect(() =>
      derivePointageRawChain(
        scope,
        [first, event(2), event(3, { kind: 'CLOCK_OUT' })],
        known,
      ),
    ).toThrow(PointageEvidenceInconsistentError);
  });

  it('retains microseconds exactly, accepts equal instants by ordinal, and handles pre-epoch fractions', () => {
    expect(
      pointageInstantMicroseconds('2025-01-01T12:00:00.123457Z') -
        pointageInstantMicroseconds('2025-01-01T12:00:00.123456Z'),
    ).toBe(1n);
    expect(pointageInstantMicroseconds('1969-12-31T23:59:59.999999Z')).toBe(
      -1n,
    );
    const rows = [
      event(1),
      event(2),
      event(3, { acceptedAt: '2025-01-01T12:00:00.123457Z' }),
    ];
    expect(derivePointageRawChain(scope, rows, known).events).toEqual(rows);
  });

  it.each([
    [-50400, '2024-12-31'],
    [50400, '2025-01-02'],
    [-1, '2025-01-01'],
    [1, '2025-01-01'],
    [20701, '2025-01-01'],
  ])(
    'preserves inclusive second-level offset %s without divisibility or tzdb recomputation',
    (offset, date) => {
      const row = event(1, {
        timezoneName: 'Europe/Paris',
        utcOffsetSeconds: offset as number,
        businessDate: date as string,
      });
      expect(derivePointageRawChain(scope, [row], known).open).toEqual(row);
    },
  );

  it('retains DST repeated-hour snapshots and groups cross-midnight by the opening business date', () => {
    const first = event(1, {
      acceptedAt: '2025-10-26T00:30:00.123456Z',
      timezoneName: 'Europe/Paris',
      utcOffsetSeconds: 7200,
      businessDate: '2025-10-26',
    });
    const second = event(2, {
      acceptedAt: '2025-10-26T01:30:00.123456Z',
      timezoneName: 'Europe/Paris',
      utcOffsetSeconds: 3600,
      businessDate: '2025-10-26',
    });
    const result = derivePointageRawChain(scope, [first, second], known);
    expect(
      pointageInstantMicroseconds(second.acceptedAt) -
        pointageInstantMicroseconds(first.acceptedAt),
    ).toBe(3_600_000_000n);
    expect(result.sessions[0]).toEqual({
      opening: first,
      closing: second,
      groupedBusinessDate: '2025-10-26',
    });
    const opening = event(1, { acceptedAt: '2025-01-01T23:30:00.000001Z' });
    const closing = event(2, {
      acceptedAt: '2025-01-03T01:30:00.000002Z',
      timezoneName: 'America/New_York',
      utcOffsetSeconds: -18000,
      businessDate: '2025-01-02',
    });
    expect(
      derivePointageRawChain(scope, [opening, closing], known).sessions[0]
        ?.groupedBusinessDate,
    ).toBe('2025-01-01');
    expect(derivePointageRawChain(scope, [opening], known).open).toEqual(
      opening,
    );
  });

  it('binds stateGuard to the exact scoped head so stale OUT A cannot close B', () => {
    const key = Buffer.alloc(32, 7);
    const rows = [event(1), event(2), event(3)];
    const empty = derivePointageRawChain(scope, [], known);
    const a = derivePointageRawChain(scope, rows.slice(0, 1), known);
    const b = derivePointageRawChain(scope, rows, known);
    const guard = pointageChainStateGuard(key, scope, a);
    expect(pointageChainGuardMatches(key, scope, a, guard)).toBe(true);
    expect(pointageTransitionAllowed(b, 'CLOCK_OUT')).toBe(true);
    expect(pointageChainGuardMatches(key, scope, b, guard)).toBe(false);
    expect(
      pointageChainGuardMatches(
        key,
        { ...scope, establishmentId: randomUUID() },
        a,
        guard,
      ),
    ).toBe(false);
    expect(
      pointageChainGuardMatches(
        key,
        scope,
        b,
        pointageChainStateGuard(key, scope, empty),
      ),
    ).toBe(false);
  });
});
