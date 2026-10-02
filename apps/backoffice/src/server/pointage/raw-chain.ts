import { z } from 'zod';
import { createPointageStateGuard, verifyPointageStateGuard } from '@yuta/auth';

const scopeSchema = z
  .object({
    organizationId: z.string().uuid(),
    establishmentId: z.string().uuid(),
    personnelDossierId: z.string().uuid(),
  })
  .strict();
const eventSchema = scopeSchema
  .extend({
    id: z.string().uuid(),
    ordinal: z.string().regex(/^[1-9][0-9]*$/u),
    kind: z.enum(['CLOCK_IN', 'CLOCK_OUT']),
    acceptedAt: z.string(),
    timezoneName: z.string().min(1),
    utcOffsetSeconds: z.number().int().min(-50400).max(50400),
    businessDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
    receiptLinked: z.literal(true),
  })
  .strict();

export type PointageRawChainScope = Readonly<z.infer<typeof scopeSchema>>;
export type PointageRawChainEvent = Readonly<z.infer<typeof eventSchema>>;
export type PointageRawKind = PointageRawChainEvent['kind'];
export type PointageDerivedSession = Readonly<{
  opening: PointageRawChainEvent;
  closing: PointageRawChainEvent;
  groupedBusinessDate: string;
}>;
export type PointageDerivedChain = Readonly<{
  events: readonly PointageRawChainEvent[];
  sessions: readonly PointageDerivedSession[];
  open: PointageRawChainEvent | null;
  headEventId: string | null;
  state: 'NOT_CLOCKED_IN' | 'CLOCKED_IN';
}>;

export class PointageEvidenceInconsistentError extends Error {
  constructor() {
    super('Pointage evidence is unavailable.');
    this.name = 'PointageEvidenceInconsistentError';
  }
}

/** Parse the approved UTC serialization without passing fractional seconds
 * through Date. Date only validates the whole-second calendar component;
 * all ordering, interval and deadline arithmetic uses integer microseconds.
 */
export function pointageInstantMicroseconds(value: string): bigint {
  const parts = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\.(\d{6})Z$/u.exec(
    value,
  );
  if (!parts) throw new PointageEvidenceInconsistentError();
  const wholeMilliseconds = Date.parse(parts[1] + 'Z');
  if (
    !Number.isFinite(wholeMilliseconds) ||
    new Date(wholeMilliseconds).toISOString().slice(0, 19) !== parts[1]
  )
    throw new PointageEvidenceInconsistentError();
  return BigInt(wholeMilliseconds) * 1000n + BigInt(parts[2]!);
}

function retainedBusinessDate(instant: bigint, offset: number): string {
  const shifted = instant + BigInt(offset) * 1_000_000n;
  // Floor, not bigint truncation toward zero, for pre-epoch instants.
  const milliseconds =
    shifted >= 0n ? shifted / 1000n : (shifted - 999n) / 1000n;
  const date = new Date(Number(milliseconds));
  if (!Number.isFinite(date.getTime()))
    throw new PointageEvidenceInconsistentError();
  return date.toISOString().slice(0, 10);
}

/** The database supplies the complete scoped, ordinal-ordered chain and its
 * known timezone-name inventory. Receipt linkage is an integrity assertion,
 * never a second attendance source. No current establishment zone is used to
 * reinterpret retained offset/date snapshots.
 */
export function derivePointageRawChain(
  scope: PointageRawChainScope,
  rows: readonly unknown[],
  knownTimezoneNames: ReadonlySet<string>,
): PointageDerivedChain {
  if (!scopeSchema.safeParse(scope).success)
    throw new PointageEvidenceInconsistentError();
  let ordinal = 1n;
  let prior: bigint | null = null;
  let open: PointageRawChainEvent | null = null;
  const events: PointageRawChainEvent[] = [];
  const sessions: PointageDerivedSession[] = [];
  const ids = new Set<string>();
  for (const raw of rows) {
    const parsed = eventSchema.safeParse(raw);
    if (!parsed.success) throw new PointageEvidenceInconsistentError();
    const row = Object.freeze(parsed.data);
    const instant = pointageInstantMicroseconds(row.acceptedAt);
    if (
      row.organizationId !== scope.organizationId ||
      row.establishmentId !== scope.establishmentId ||
      row.personnelDossierId !== scope.personnelDossierId ||
      BigInt(row.ordinal) !== ordinal ||
      ids.has(row.id) ||
      (prior !== null && instant < prior) ||
      !knownTimezoneNames.has(row.timezoneName) ||
      retainedBusinessDate(instant, row.utcOffsetSeconds) !==
        row.businessDate ||
      row.kind !== (open === null ? 'CLOCK_IN' : 'CLOCK_OUT')
    )
      throw new PointageEvidenceInconsistentError();
    if (row.kind === 'CLOCK_IN') open = row;
    else {
      sessions.push(
        Object.freeze({
          opening: open!,
          closing: row,
          groupedBusinessDate: open!.businessDate,
        }),
      );
      open = null;
    }
    events.push(row);
    ids.add(row.id);
    ordinal++;
    prior = instant;
  }
  return Object.freeze({
    events: Object.freeze(events),
    sessions: Object.freeze(sessions),
    open,
    headEventId: events.at(-1)?.id ?? null,
    state: open === null ? 'NOT_CLOCKED_IN' : 'CLOCKED_IN',
  });
}

export function pointageTransitionAllowed(
  chain: PointageDerivedChain,
  kind: PointageRawKind,
): boolean {
  return kind === (chain.open === null ? 'CLOCK_IN' : 'CLOCK_OUT');
}

export function pointageChainStateGuard(
  key: Uint8Array,
  scope: PointageRawChainScope,
  chain: PointageDerivedChain,
): string {
  return createPointageStateGuard(key, {
    ...scope,
    headEventId: chain.headEventId,
  });
}

export function pointageChainGuardMatches(
  key: Uint8Array,
  scope: PointageRawChainScope,
  chain: PointageDerivedChain,
  candidate: string,
): boolean {
  return verifyPointageStateGuard(
    key,
    { ...scope, headEventId: chain.headEventId },
    candidate,
  );
}
