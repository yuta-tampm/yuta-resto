import 'server-only';
import { createHash } from 'node:crypto';

import { z } from 'zod';
import {
  generatePointageContinuation,
  digestPointageContinuation,
  verifyPointageContinuation,
} from '@yuta/auth';
import type {
  PointageRawClockingRepository,
  PointageRawDossierOperations,
} from '@yuta/db-cloud';
import type {
  VerifiedPointageCredential,
  PointageEmployeeOperation,
} from './authorization';
import type {
  createPointageServerFoundation,
  PointageEntryScope,
} from './service';
import { normalizeTenantSlug } from '@yuta/tenant';
import {
  derivePointageRawChain,
  pointageChainStateGuard,
  pointageChainGuardMatches,
  pointageTransitionAllowed,
  pointageInstantMicroseconds,
  type PointageDerivedChain,
  type PointageRawChainEvent,
} from './raw-chain';

type Foundation = Pick<
  ReturnType<typeof createPointageServerFoundation>,
  'validateCredential' | 'authorizeEmployeeOperation'
>;
type Personnel = Parameters<
  Parameters<PointageRawClockingRepository['withDossierTransaction']>[1]
>[1];
type Continuation = NonNullable<
  Awaited<ReturnType<PointageRawDossierOperations['insertContinuation']>>
>;
type Clock = Awaited<
  ReturnType<PointageRawDossierOperations['readCurrentClock']>
>;

export type PointageRawFailureCode =
  | 'POINTAGE_ACCESS_DENIED'
  | 'POINTAGE_TRY_LATER'
  | 'POINTAGE_STATE_CONFLICT'
  | 'POINTAGE_REQUEST_CONFLICT'
  | 'POINTAGE_REQUEST_INVALID'
  | 'POINTAGE_UNAVAILABLE';
export type PointageRawOutcome<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; code: PointageRawFailureCode }>;
export type PointageEmployeeState = Readonly<{
  displayName: string;
  status: 'NOT_CLOCKED_IN' | 'CLOCKED_IN';
  openSessionStart: null | Readonly<{
    instant: string;
    timezoneName: string;
    utcOffsetSeconds: number;
    businessDate: string;
  }>;
  stateGuard: string;
}>;
export type PointageIdentifyResult = Readonly<{
  continuation: string;
  expiresInMs: number;
  idleInMs: number;
  state: PointageEmployeeState;
}>;

class PointageRawAccessDenied extends Error {
  constructor() {
    super('Pointage access is denied.');
  }
}

class PointageRawConflict extends Error {
  constructor(
    readonly code: 'POINTAGE_STATE_CONFLICT' | 'POINTAGE_REQUEST_CONFLICT',
  ) {
    super('Pointage command conflicts.');
  }
}

const commandSchema = z
  .object({
    establishmentSlug: z.string(),
    continuation: z.string(),
    requestId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu,
      )
      .transform((value) => value.toLowerCase()),
    kind: z.enum(['CLOCK_IN', 'CLOCK_OUT']),
    observedStateGuard: z
      .string()
      .length(43)
      .regex(/^[A-Za-z0-9_-]+$/u)
      .refine(
        (value) =>
          Buffer.from(value, 'base64url').toString('base64url') === value,
      ),
  })
  .strict();
export type PointageRawCommand = Readonly<z.input<typeof commandSchema>>;
export type PointageCommittedReceipt = Readonly<{
  requestId: string;
  result: 'COMMITTED';
  kind: 'CLOCK_IN' | 'CLOCK_OUT';
  acceptedAt: string;
  timezoneName: string;
  utcOffsetSeconds: number;
  businessDate: string;
}>;
type CommandResult =
  | PointageCommittedReceipt
  | Readonly<{ result: 'UNCONFIRMED' }>;

function projectReceipt(
  requestId: string,
  event: PointageRawChainEvent,
): PointageCommittedReceipt {
  return {
    requestId,
    result: 'COMMITTED',
    kind: event.kind,
    acceptedAt: event.acceptedAt,
    timezoneName: event.timezoneName,
    utcOffsetSeconds: event.utcOffsetSeconds,
    businessDate: event.businessDate,
  };
}

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/u)
  .refine((value) => {
    const parsed = Date.parse(value + 'T00:00:00Z');
    return (
      Number.isFinite(parsed) &&
      new Date(parsed).toISOString().slice(0, 10) === value
    );
  });
const personnelSchema = z
  .object({
    id: z.string().uuid(),
    givenNames: z.string().trim().min(1),
    familyName: z.string().trim().min(1),
    entryDate: date,
    departureDate: date.nullable(),
    timezone: z.string().min(1),
  })
  .strict();

function minimalPersonnel(personnel: Personnel) {
  const parsed = personnelSchema.safeParse(personnel);
  if (!parsed.success) throw new PointageRawAccessDenied();
  return parsed.data;
}

function requireEligibility(personnel: Personnel, clock: Clock): void {
  const current = minimalPersonnel(personnel);
  if (
    !date.safeParse(clock.businessDate).success ||
    clock.businessDate < current.entryDate ||
    (current.departureDate !== null &&
      (current.departureDate < current.entryDate ||
        clock.businessDate > current.departureDate))
  )
    throw new PointageRawAccessDenied();
  pointageInstantMicroseconds(clock.instant);
}

function remaining(continuation: Continuation, clock: Clock) {
  const now = pointageInstantMicroseconds(clock.instant);
  const absolute = pointageInstantMicroseconds(continuation.absoluteExpiresAt);
  const idle = pointageInstantMicroseconds(continuation.idleExpiresAt);
  if (continuation.endedAt !== null || now >= absolute || now >= idle)
    throw new PointageRawAccessDenied();
  return {
    expiresInMs: Number((absolute - now) / 1000n),
    idleInMs: Number((idle - now) / 1000n),
  };
}

/** Server composition only. No provider, database fallback, cloud-user session,
 * transport or production default is constructed by this domain service.
 */
export function createPointageRawClockingService(
  input: Readonly<{
    foundation: Foundation;
    repository: PointageRawClockingRepository;
    stateGuardKey: Uint8Array;
    requireReady: () => Promise<void>;
    resolveEntryScope: (slug: string) => Promise<PointageEntryScope | null>;
    generateContinuation?: () => string;
  }>,
) {
  const generate = input.generateContinuation ?? generatePointageContinuation;

  async function authorize(
    ops: PointageRawDossierOperations,
    personnel: Personnel,
    credential: VerifiedPointageCredential,
    entryScope: PointageEntryScope,
    operation: PointageEmployeeOperation,
    clock: Clock,
  ): Promise<void> {
    if (
      credential.proofType !== 'VERIFIED_POINTAGE_CREDENTIAL' ||
      credential.organizationId !== entryScope.organizationId ||
      credential.establishmentId !== entryScope.establishmentId ||
      credential.personnelDossierId !== personnel.id
    )
      throw new PointageRawAccessDenied();
    requireEligibility(personnel, clock);
    const current = await ops.findCurrentCredential();
    if (
      current?.id !== credential.credentialId ||
      current.credentialVersion !== credential.credentialVersion
    )
      throw new PointageRawAccessDenied();
    const actor = await input.foundation.authorizeEmployeeOperation({
      credential,
      entryScope: { ...entryScope, timezone: personnel.timezone },
      operation,
    });
    if (
      actor?.actorType !== 'POINTAGE_EMPLOYEE' ||
      actor.operation !== operation ||
      actor.organizationId !== credential.organizationId ||
      actor.establishmentId !== credential.establishmentId ||
      actor.personnelDossierId !== credential.personnelDossierId ||
      actor.credentialId !== credential.credentialId ||
      actor.credentialVersion !== credential.credentialVersion
    )
      throw new PointageRawAccessDenied();
  }

  function state(
    personnel: Personnel,
    credential: VerifiedPointageCredential,
    chain: PointageDerivedChain,
  ): PointageEmployeeState {
    const names = minimalPersonnel(personnel);
    return Object.freeze({
      displayName: names.givenNames + ' ' + names.familyName,
      status: chain.state,
      openSessionStart:
        chain.open === null
          ? null
          : Object.freeze({
              instant: chain.open.acceptedAt,
              timezoneName: chain.open.timezoneName,
              utcOffsetSeconds: chain.open.utcOffsetSeconds,
              businessDate: chain.open.businessDate,
            }),
      stateGuard: pointageChainStateGuard(
        input.stateGuardKey,
        {
          organizationId: credential.organizationId,
          establishmentId: credential.establishmentId,
          personnelDossierId: credential.personnelDossierId,
        },
        chain,
      ),
    });
  }

  async function identify(
    request: Readonly<{ establishmentSlug: string; credential: string }>,
  ): Promise<PointageRawOutcome<PointageIdentifyResult>> {
    try {
      await input.requireReady();
      const verified = await input.foundation.validateCredential(request);
      if (verified.status !== 'VERIFIED')
        return {
          ok: false,
          code:
            verified.status === 'POINTAGE_TRY_LATER'
              ? 'POINTAGE_TRY_LATER'
              : verified.status === 'POINTAGE_UNAVAILABLE'
                ? 'POINTAGE_UNAVAILABLE'
                : 'POINTAGE_ACCESS_DENIED',
        };
      const { credential, entryScope } = verified;
      const scope = {
        organizationId: credential.organizationId,
        establishmentId: credential.establishmentId,
        personnelDossierId: credential.personnelDossierId,
      };
      const value = await input.repository.withDossierTransaction(
        scope,
        async (ops, personnel) => {
          await authorize(
            ops,
            personnel,
            credential,
            entryScope,
            'pointage.employee.identify',
            await ops.readCurrentClock(),
          );
          // A candidate is memory only. State.read is a separate exact authority;
          // no continuation row or protected payload has been returned yet.
          let candidate = generate();
          await authorize(
            ops,
            personnel,
            credential,
            entryScope,
            'pointage.employee.state.read',
            await ops.readCurrentClock(),
          );
          const source = await ops.readRawChain();
          const chain = derivePointageRawChain(
            scope,
            source.events,
            source.knownTimezoneNames,
          );
          const projected = state(personnel, credential, chain);
          const finalClock = await ops.readCurrentClock();
          await authorize(
            ops,
            personnel,
            credential,
            entryScope,
            'pointage.employee.identify',
            finalClock,
          );
          await authorize(
            ops,
            personnel,
            credential,
            entryScope,
            'pointage.employee.state.read',
            finalClock,
          );
          for (let attempt = 0; attempt < 3; attempt++) {
            const digest = digestPointageContinuation(candidate);
            if (digest === null)
              throw new Error('Pointage continuation is unavailable.');
            const persisted = await ops.insertContinuation({
              tokenDigest: digest,
              credentialId: credential.credentialId,
              credentialVersion: credential.credentialVersion,
            });
            if (persisted !== null) {
              // Re-evaluate after the DB-issued timestamp too: crossing midnight
              // during INSERT must not publish an ineligible partial identify.
              const publishClock = await ops.readCurrentClock();
              await authorize(
                ops,
                personnel,
                credential,
                entryScope,
                'pointage.employee.identify',
                publishClock,
              );
              await authorize(
                ops,
                personnel,
                credential,
                entryScope,
                'pointage.employee.state.read',
                publishClock,
              );
              return {
                continuation: candidate,
                ...remaining(persisted, publishClock),
                state: projected,
              };
            }
            if (attempt < 2) candidate = generate();
          }
          throw new Error('Pointage continuation is unavailable.');
        },
      );
      // The repository resolves only after successful outer COMMIT. A rejected
      // or unknown COMMIT never publishes its candidate or staged personal data.
      return Object.freeze({ ok: true, value });
    } catch (error: unknown) {
      return Object.freeze({
        ok: false,
        code:
          error instanceof PointageRawConflict
            ? error.code
            : error instanceof PointageRawAccessDenied
              ? 'POINTAGE_ACCESS_DENIED'
              : 'POINTAGE_UNAVAILABLE',
      });
    }
  }
  async function withContinuation<T>(
    request: Readonly<{ establishmentSlug: string; continuation: string }>,
    operation: PointageEmployeeOperation | null,
    run: (
      ops: PointageRawDossierOperations,
      personnel: Personnel,
      credential: VerifiedPointageCredential,
      entryScope: PointageEntryScope,
      row: Continuation,
    ) => Promise<T>,
  ): Promise<PointageRawOutcome<T>> {
    try {
      await input.requireReady();
      const entryScope = await input.resolveEntryScope(
        normalizeTenantSlug(request.establishmentSlug),
      );
      if (entryScope === null) throw new PointageRawAccessDenied();
      const digest = digestPointageContinuation(request.continuation);
      if (digest === null) throw new PointageRawAccessDenied();
      const candidate = await input.repository.findContinuationCandidate(
        entryScope,
        digest,
      );
      if (candidate === null) throw new PointageRawAccessDenied();
      const scope = {
        organizationId: entryScope.organizationId,
        establishmentId: entryScope.establishmentId,
        personnelDossierId: candidate.personnelDossierId,
      };
      const value = await input.repository.withDossierTransaction(
        scope,
        async (ops, personnel) => {
          const row = await ops.lockContinuation(candidate.id);
          const valid = verifyPointageContinuation(
            request.continuation,
            row?.tokenDigest ?? '0'.repeat(64),
          );
          if (
            !valid ||
            row === null ||
            row.id !== candidate.id ||
            row.organizationId !== scope.organizationId ||
            row.establishmentId !== scope.establishmentId ||
            row.personnelDossierId !== scope.personnelDossierId
          )
            throw new PointageRawAccessDenied();
          const credential: VerifiedPointageCredential = {
            ...scope,
            proofType: 'VERIFIED_POINTAGE_CREDENTIAL',
            credentialId: row.credentialId,
            credentialVersion: row.credentialVersion,
          };
          if (operation !== null) {
            const clock = await ops.readCurrentClock();
            remaining(row, clock);
            await authorize(
              ops,
              personnel,
              credential,
              entryScope,
              operation,
              clock,
            );
          }
          return run(ops, personnel, credential, entryScope, row);
        },
      );
      return { ok: true, value };
    } catch (error: unknown) {
      return {
        ok: false,
        code:
          error instanceof PointageRawConflict
            ? error.code
            : error instanceof PointageRawAccessDenied
              ? 'POINTAGE_ACCESS_DENIED'
              : 'POINTAGE_UNAVAILABLE',
      };
    }
  }

  async function readState(
    request: Readonly<{ establishmentSlug: string; continuation: string }>,
  ): Promise<
    PointageRawOutcome<{
      state: PointageEmployeeState;
      expiresInMs: number;
      idleInMs: number;
    }>
  > {
    return withContinuation(
      request,
      'pointage.employee.state.read',
      async (ops, personnel, credential, entryScope, row) => {
        const source = await ops.readRawChain();
        const scope = {
          organizationId: credential.organizationId,
          establishmentId: credential.establishmentId,
          personnelDossierId: credential.personnelDossierId,
        };
        const chain = derivePointageRawChain(
          scope,
          source.events,
          source.knownTimezoneNames,
        );
        const clock = await ops.readCurrentClock();
        remaining(row, clock);
        await authorize(
          ops,
          personnel,
          credential,
          entryScope,
          'pointage.employee.state.read',
          clock,
        );
        const touched = await ops.touchContinuationIdle(row.id);
        if (touched === null) throw new PointageRawAccessDenied();
        const finalClock = await ops.readCurrentClock();
        await authorize(
          ops,
          personnel,
          credential,
          entryScope,
          'pointage.employee.state.read',
          finalClock,
        );
        return {
          state: state(personnel, credential, chain),
          ...remaining(touched, finalClock),
        };
      },
    );
  }

  async function end(
    request: Readonly<{ establishmentSlug: string; continuation: string }>,
  ): Promise<PointageRawOutcome<null>> {
    return withContinuation(
      request,
      null,
      async (ops, _personnel, _credential, _entryScope, row) => {
        // Ending authentic own metadata is deliberately allowed after eligibility,
        // credential version or lifetime loss. It never returns identity/state.
        const ended = await ops.endOwnContinuation(row.id);
        if (ended === null || ended.endedAt === null)
          throw new PointageRawAccessDenied();
        return null;
      },
    );
  }

  async function command(
    request: PointageRawCommand,
    recoverOnly: boolean,
  ): Promise<PointageRawOutcome<CommandResult>> {
    const parsed = commandSchema.safeParse(request);
    if (!parsed.success) return { ok: false, code: 'POINTAGE_REQUEST_INVALID' };
    const intent = parsed.data;
    return withContinuation(
      intent,
      'pointage.employee.operation.create',
      async (ops, personnel, credential, entryScope, row) => {
        const scope = {
          organizationId: credential.organizationId,
          establishmentId: credential.establishmentId,
          personnelDossierId: credential.personnelDossierId,
        };
        const fingerprint = createHash('sha256')
          .update(
            JSON.stringify([
              'pointage-raw-intent-v1',
              scope.organizationId.toLowerCase(),
              scope.establishmentId.toLowerCase(),
              scope.personnelDossierId.toLowerCase(),
              intent.kind,
              intent.observedStateGuard,
            ]),
            'utf8',
          )
          .digest('hex');
        const source = await ops.readRawChain();
        const chain = derivePointageRawChain(
          scope,
          source.events,
          source.knownTimezoneNames,
        );
        // Lookup committed intent before evaluating the current transition/head.
        // Canonical chain validity and current authority still precede any replay.
        const receipt = await ops.findCommandReceipt(intent.requestId);
        let committed: PointageRawChainEvent | undefined;
        if (receipt !== null) {
          if (
            receipt.intentVersion !== 1 ||
            receipt.intentFingerprint !== fingerprint
          )
            throw new PointageRawConflict('POINTAGE_REQUEST_CONFLICT');
          committed = chain.events.find(
            (event) => event.id === receipt.eventId,
          );
          if (!committed || committed.kind !== intent.kind)
            throw new Error('Pointage evidence is unavailable.');
        } else if (recoverOnly) {
          const finalClock = await ops.readCurrentClock();
          remaining(row, finalClock);
          await authorize(
            ops,
            personnel,
            credential,
            entryScope,
            'pointage.employee.operation.create',
            finalClock,
          );
          // Not a successful replay or mutation: no idle extension and no write.
          return { result: 'UNCONFIRMED' as const };
        } else {
          if (
            !pointageChainGuardMatches(
              input.stateGuardKey,
              scope,
              chain,
              intent.observedStateGuard,
            ) ||
            !pointageTransitionAllowed(chain, intent.kind)
          )
            throw new PointageRawConflict('POINTAGE_STATE_CONFLICT');
          const accepted = await ops.appendRawEvent(intent.kind);
          const acceptedClock = {
            instant: accepted.acceptedAt,
            businessDate: accepted.businessDate,
          };
          // Exactly the returned accepted instant controls the final deadline and
          // lifecycle check; never substitute a second clock sample for this one.
          remaining(row, acceptedClock);
          await authorize(
            ops,
            personnel,
            credential,
            entryScope,
            'pointage.employee.operation.create',
            acceptedClock,
          );
          await ops.insertCommandReceipt({
            requestId: intent.requestId,
            eventId: accepted.id,
            intentFingerprint: fingerprint,
          });
          const after = await ops.readRawChain();
          committed = derivePointageRawChain(
            scope,
            after.events,
            after.knownTimezoneNames,
          ).events.find((event) => event.id === accepted.id);
          if (!committed) throw new Error('Pointage evidence is unavailable.');
        }
        const finalClock = await ops.readCurrentClock();
        remaining(row, finalClock);
        await authorize(
          ops,
          personnel,
          credential,
          entryScope,
          'pointage.employee.operation.create',
          finalClock,
        );
        if ((await ops.touchContinuationIdle(row.id)) === null)
          throw new PointageRawAccessDenied();
        return projectReceipt(intent.requestId, committed);
      },
    );
  }

  async function mutate(
    request: PointageRawCommand,
  ): Promise<PointageRawOutcome<PointageCommittedReceipt>> {
    const result = await command(request, false);
    if (result.ok && result.value.result === 'UNCONFIRMED')
      return { ok: false, code: 'POINTAGE_UNAVAILABLE' };
    if (!result.ok) return result;
    if (result.value.result !== 'COMMITTED')
      return { ok: false, code: 'POINTAGE_UNAVAILABLE' };
    return { ok: true, value: result.value };
  }

  return {
    identify,
    readState,
    end,
    mutate,
    recover: (request: PointageRawCommand) => command(request, true),
  };
}
