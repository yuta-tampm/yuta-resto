import { randomUUID } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import type { AuthenticatedSession } from '@yuta/auth';
import type { TenantContext } from '@yuta/tenant';
import type { PointageRawChainEvent } from '../src/server/pointage/raw-chain';
vi.mock('server-only', () => ({}));
import { createPointageRawManagerRead } from '../src/server/pointage/raw-clocking-manager';

const scope = { organizationId: randomUUID(), establishmentId: randomUUID() };
const session: AuthenticatedSession = {
  id: randomUUID(),
  userId: randomUUID(),
  userName: 'Synthetic Manager',
  userEmail: 'synthetic@example.test',
  systemRole: null,
  ...scope,
  expiresAt: new Date('2030-01-01T00:00:00Z'),
};
function access(role: 'OWNER' | 'MANAGER' | 'STAFF' = 'OWNER') {
  const tenant: TenantContext = {
    ...scope,
    actor: {
      type: 'user',
      userId: session.userId,
      membershipId: '11111111-1111-4111-8111-111111111111',
      role,
    },
    locale: 'fr-FR',
    timezone: 'UTC',
    entitlements: new Set(),
  };
  return { session, tenant };
}
function event(
  dossier: string,
  ordinal: number,
  kind: 'CLOCK_IN' | 'CLOCK_OUT',
  day: string,
): PointageRawChainEvent {
  return {
    ...scope,
    personnelDossierId: dossier,
    id: randomUUID(),
    ordinal: String(ordinal),
    kind,
    acceptedAt: day + 'T12:00:00.123456Z',
    businessDate: day,
    timezoneName: 'UTC',
    utcOffsetSeconds: 0,
    receiptLinked: true,
  };
}
function fixture() {
  const closed = randomUUID();
  const priorOpen = randomUUID();
  const today = randomUUID();
  const snapshot = {
    businessDate: '2026-09-08',
    chains: [
      {
        personnelDossierId: closed,
        events: [
          event(closed, 1, 'CLOCK_IN', '2026-09-07'),
          event(closed, 2, 'CLOCK_OUT', '2026-09-07'),
        ],
        knownTimezoneNames: new Set(['UTC']),
      },
      {
        personnelDossierId: priorOpen,
        events: [event(priorOpen, 1, 'CLOCK_IN', '2026-09-07')],
        knownTimezoneNames: new Set(['UTC']),
      },
      {
        personnelDossierId: today,
        events: [
          event(today, 1, 'CLOCK_IN', '2026-09-08'),
          event(today, 2, 'CLOCK_OUT', '2026-09-08'),
        ],
        knownTimezoneNames: new Set(['UTC']),
      },
    ],
  };
  const loadCurrentAccess = vi.fn<
    () => Promise<ReturnType<typeof access> | null>
  >(async () => access());
  const readEstablishmentSnapshot = vi.fn(async () => snapshot);
  const requireReady = vi.fn(async () => undefined);
  return {
    snapshot,
    loadCurrentAccess,
    readEstablishmentSnapshot,
    requireReady,
    run: createPointageRawManagerRead({
      repository: { readEstablishmentSnapshot },
      loadCurrentAccess,
      requireReady,
    }),
  };
}
describe('S7 minimal manager server read', () => {
  it.each(['OWNER', 'MANAGER'] as const)(
    'permits fresh %s and exposes only today plus the earlier open session',
    async (role) => {
      const f = fixture();
      f.loadCurrentAccess.mockResolvedValue(access(role));
      const result = await f.run();
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error('Expected synthetic manager result.');
      expect(result.value.currentDayEvents).toHaveLength(2);
      expect(result.value.openSessions).toHaveLength(1);
      expect(result.value.openSessions[0]!.businessDate).toBe('2026-09-07');
      expect(Object.keys(result.value.openSessions[0]!).sort()).toEqual(
        [
          'personnelDossierId',
          'kind',
          'instant',
          'timezoneName',
          'utcOffsetSeconds',
          'businessDate',
        ].sort(),
      );
      expect(f.readEstablishmentSnapshot).toHaveBeenCalledWith(scope);
      expect(f.loadCurrentAccess).toHaveBeenCalledTimes(2);
      expect(f.loadCurrentAccess.mock.invocationCallOrder[0]).toBeLessThan(
        f.readEstablishmentSnapshot.mock.invocationCallOrder[0]!,
      );
      expect(f.loadCurrentAccess.mock.invocationCallOrder[1]).toBeGreaterThan(
        f.readEstablishmentSnapshot.mock.invocationCallOrder[0]!,
      );
    },
  );
  it.each([
    'STAFF',
    'absent',
    'employee',
    'organization',
    'establishment',
    'user',
  ] as const)('denies %s before reading', async (mode) => {
    const f = fixture();
    const value = access(mode === 'STAFF' ? 'STAFF' : 'OWNER');
    if (mode === 'organization')
      value.session = { ...session, organizationId: randomUUID() };
    if (mode === 'establishment')
      value.session = { ...session, establishmentId: randomUUID() };
    if (mode === 'user') value.session = { ...session, userId: randomUUID() };
    if (mode === 'employee')
      Object.assign(value.tenant, { actor: { type: 'POINTAGE_EMPLOYEE' } });
    f.loadCurrentAccess.mockResolvedValue(mode === 'absent' ? null : value);
    expect(await f.run()).toEqual({
      ok: false,
      code: 'POINTAGE_ACCESS_DENIED',
    });
    expect(f.readEstablishmentSnapshot).not.toHaveBeenCalled();
  });
  it.each([
    'revoked',
    'STAFF',
    'membership',
    'organization',
    'establishment',
    'unavailable',
  ] as const)(
    'discards materialized data after fresh final %s check',
    async (mode) => {
      const f = fixture();
      const final = access(mode === 'STAFF' ? 'STAFF' : 'OWNER');
      if (mode === 'membership' && final.tenant.actor.type === 'user')
        final.tenant = {
          ...final.tenant,
          actor: { ...final.tenant.actor, membershipId: randomUUID() },
        };
      if (mode === 'organization' || mode === 'establishment') {
        const key =
          mode === 'organization' ? 'organizationId' : 'establishmentId';
        const id = randomUUID();
        final.session = { ...session, [key]: id };
        final.tenant = { ...final.tenant, [key]: id };
      }
      f.loadCurrentAccess.mockResolvedValueOnce(access());
      if (mode === 'unavailable')
        f.loadCurrentAccess.mockRejectedValueOnce(
          new Error('Synthetic authority unavailable.'),
        );
      else
        f.loadCurrentAccess.mockResolvedValueOnce(
          mode === 'revoked' ? null : final,
        );
      expect(await f.run()).toEqual({
        ok: false,
        code:
          mode === 'unavailable'
            ? 'POINTAGE_UNAVAILABLE'
            : 'POINTAGE_ACCESS_DENIED',
      });
      expect(f.readEstablishmentSnapshot).toHaveBeenCalledOnce();
    },
  );
  it('discards the entire projection on a corrupt or cross-scoped chain', async () => {
    const f = fixture();
    f.snapshot.chains[2]!.events[1] = {
      ...f.snapshot.chains[2]!.events[1]!,
      establishmentId: randomUUID(),
    };
    expect(await f.run()).toEqual({ ok: false, code: 'POINTAGE_UNAVAILABLE' });
  });
  it('does not start authority or reads when readiness fails', async () => {
    const f = fixture();
    f.requireReady.mockRejectedValue(
      new Error('Synthetic readiness unavailable.'),
    );
    expect(await f.run()).toEqual({ ok: false, code: 'POINTAGE_UNAVAILABLE' });
    expect(f.loadCurrentAccess).not.toHaveBeenCalled();
    expect(f.readEstablishmentSnapshot).not.toHaveBeenCalled();
  });
});
