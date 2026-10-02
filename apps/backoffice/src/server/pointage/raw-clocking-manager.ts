import 'server-only';
import type { AuthenticatedSession } from '@yuta/auth';
import type { TenantContext } from '@yuta/tenant';
import type { PointageRawClockingRepository } from '@yuta/db-cloud';
import {
  createPointageManagerContext,
  PointageAuthorizationError,
  requirePointageManagerOperation,
} from './authorization';
import {
  derivePointageRawChain,
  type PointageRawChainEvent,
} from './raw-chain';
import type { PointageRawOutcome } from './raw-clocking-service';

type CurrentAccess = Readonly<{
  session: AuthenticatedSession;
  tenant: TenantContext;
}>;
export type PointageManagerRawEvent = Readonly<{
  personnelDossierId: string;
  kind: 'CLOCK_IN' | 'CLOCK_OUT';
  instant: string;
  timezoneName: string;
  utcOffsetSeconds: number;
  businessDate: string;
}>;
export type PointageManagerSnapshot = Readonly<{
  businessDate: string;
  currentDayEvents: readonly PointageManagerRawEvent[];
  openSessions: readonly PointageManagerRawEvent[];
}>;

function projection(row: PointageRawChainEvent): PointageManagerRawEvent {
  return {
    personnelDossierId: row.personnelDossierId,
    kind: row.kind,
    instant: row.acceptedAt,
    timezoneName: row.timezoneName,
    utcOffsetSeconds: row.utcOffsetSeconds,
    businessDate: row.businessDate,
  };
}

/** Server-only consumer; no manager transport. loadCurrentAccess must perform
 * fresh session/membership/active-scope validation using the existing cloud auth
 * repositories on each call, outside the attendance snapshot. Never supply a
 * cached React session/context or employee continuation as this authority.
 */
export function createPointageRawManagerRead(
  input: Readonly<{
    repository: Pick<
      PointageRawClockingRepository,
      'readEstablishmentSnapshot'
    >;
    loadCurrentAccess: () => Promise<CurrentAccess | null>;
    requireReady: () => Promise<void>;
  }>,
) {
  async function authorize() {
    const access = await input.loadCurrentAccess();
    if (access === null) return null;
    const context = createPointageManagerContext({
      ...access,
      operation: 'pointage.establishment.read',
    });
    requirePointageManagerOperation(context, 'pointage.establishment.read');
    return context;
  }
  return async (): Promise<PointageRawOutcome<PointageManagerSnapshot>> => {
    try {
      await input.requireReady();
      const initial = await authorize();
      if (initial === null)
        return { ok: false, code: 'POINTAGE_ACCESS_DENIED' };
      const scope = {
        organizationId: initial.organizationId,
        establishmentId: initial.establishmentId,
      };
      const snapshot = await input.repository.readEstablishmentSnapshot(scope);
      const currentDayEvents: PointageManagerRawEvent[] = [];
      const openSessions: PointageManagerRawEvent[] = [];
      for (const dossier of snapshot.chains) {
        const chain = derivePointageRawChain(
          { ...scope, personnelDossierId: dossier.personnelDossierId },
          dossier.events,
          dossier.knownTimezoneNames,
        );
        for (const event of chain.events)
          if (event.businessDate === snapshot.businessDate)
            currentDayEvents.push(projection(event));
        if (chain.open !== null) openSessions.push(projection(chain.open));
      }
      // This is after the read-only REPEATABLE READ transaction has ended, not a
      // second query inside the same stale permission snapshot.
      const final = await authorize();
      if (
        final === null ||
        final.organizationId !== initial.organizationId ||
        final.establishmentId !== initial.establishmentId ||
        final.userId !== initial.userId ||
        final.membershipId !== initial.membershipId
      )
        return { ok: false, code: 'POINTAGE_ACCESS_DENIED' };
      return {
        ok: true,
        value: {
          businessDate: snapshot.businessDate,
          currentDayEvents,
          openSessions,
        },
      };
    } catch (error) {
      return {
        ok: false,
        code:
          error instanceof PointageAuthorizationError
            ? 'POINTAGE_ACCESS_DENIED'
            : 'POINTAGE_UNAVAILABLE',
      };
    }
  };
}
