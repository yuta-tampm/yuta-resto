import { createHash } from 'node:crypto';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import type { CloudDatabaseClient } from './client';
import {
  establishments,
  organizations,
  personnelEmployeeDossiers,
  pointageEmployeeCredentials,
} from './schema';
import {
  pointageContinuations,
  pointageRawEvents,
  pointageRawCommandReceipts,
} from './schema/pointage-raw-clocking';

export type PointageRawDossierScope = Readonly<{
  organizationId: string;
  establishmentId: string;
  personnelDossierId: string;
}>;

export type PointageContinuationRecord =
  typeof pointageContinuations.$inferSelect;

export class PointageRawScopeUnavailableError extends Error {
  constructor() {
    super('Pointage scope is unavailable.');
    this.name = 'PointageRawScopeUnavailableError';
  }
}

type RawTransaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];

// Bound to the exact function body in the reviewed generated 0021 migration.
// Neither a browser nor environment configuration may supply this fingerprint.
const lockBodyFingerprint =
  '293dee4dfc8787ea891fe370668425dc97918b4412f62da6eb0f692e7521fe24';
const rawWriter = 'yuta_pointage_raw_writer';
const lockOwner = 'yuta_pointage_raw_lock_owner';
const evidenceTables = new Set([
  'pointage_raw_events',
  'pointage_raw_command_receipts',
  'pointage_continuations',
]);
const sourceSelect: Record<string, readonly string[]> = {
  organizations: ['id', 'status'],
  establishments: ['id', 'organization_id', 'status', 'timezone'],
  personnel_employee_dossiers: [
    'id',
    'organization_id',
    'establishment_id',
    'given_names',
    'family_name',
    'entry_date',
    'departure_date',
  ],
  pointage_employee_credentials: [
    'id',
    'organization_id',
    'establishment_id',
    'personnel_dossier_id',
    'credential_version',
    'superseded_at',
  ],
};
const ownerSelect: Record<string, readonly string[]> = {
  organizations: ['id', 'status'],
  establishments: ['id', 'organization_id', 'status'],
  personnel_employee_dossiers: ['id', 'organization_id', 'establishment_id'],
};

/** Fail closed on the same pinned connection, before any protected processing.
 * This is admission evidence, not protection against a concurrently malicious
 * administrator. It never repairs privileges or authorizes a Product operation.
 */
export async function assertPointageRawDatabaseBoundary(
  connection: Pick<RawTransaction, 'execute'>,
): Promise<void> {
  const fail = () => {
    throw new PointageRawScopeUnavailableError();
  };
  const [identity] = await connection.execute<{
    session: string;
    current: string;
  }>(sql`select session_user as session, current_user as current`);
  if (identity?.session !== rawWriter || identity.current !== rawWriter) fail();
  const functions = await connection.execute<{
    body: string;
    valid: boolean;
    acl: boolean;
  }>(sql`
    select p.prosrc as body,
      (p.proowner = (select oid from pg_catalog.pg_roles where rolname=${lockOwner})
       and l.lanname='plpgsql' and p.prosecdef and not p.proisstrict
       and p.provolatile='v' and p.proparallel='u' and p.prokind='f'
       and p.pronargs=3 and p.pronargdefaults=0 and p.provariadic=0
       and p.proallargtypes is null and not p.proretset
       and p.prorettype='pg_catalog.void'::pg_catalog.regtype
       and p.proargtypes::text='2950 2950 2950'
       and p.proargnames=array['p_organization_id','p_establishment_id','p_personnel_dossier_id']::text[]
       and p.proconfig=array['search_path=pg_catalog, pg_temp']::text[]) as valid,
      (select count(*)=2 and bool_and(
        a.grantee in (select oid from pg_catalog.pg_roles where rolname in (${rawWriter},${lockOwner}))
        and a.privilege_type='EXECUTE' and not a.is_grantable)
       from pg_catalog.aclexplode(p.proacl) a) as acl
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid=p.pronamespace
    join pg_catalog.pg_language l on l.oid=p.prolang
    where n.nspname='public' and p.proname='pointage_raw_lock_dossier'
  `);
  const fn = functions[0];
  if (
    functions.length !== 1 ||
    !fn?.valid ||
    !fn.acl ||
    createHash('sha256').update(fn.body).digest('hex') !== lockBodyFingerprint
  )
    fail();

  const [roles] = await connection.execute<{ safe: boolean }>(sql`
    select count(*)=2 and bool_and(
      not r.rolsuper and not r.rolcreatedb and not r.rolcreaterole
      and not r.rolreplication and not r.rolbypassrls and not r.rolinherit
      and r.rolconfig is null and r.rolcanlogin=(r.rolname=${rawWriter})
      and not exists (select 1 from pg_catalog.pg_auth_members m where m.member=r.oid or m.roleid=r.oid)
      and not exists (select 1 from pg_catalog.pg_roles other where other.oid<>r.oid
        and (pg_catalog.pg_has_role(r.oid,other.oid,'MEMBER')
          or pg_catalog.pg_has_role(r.oid,other.oid,'USAGE')
          or pg_catalog.pg_has_role(r.oid,other.oid,'SET')))
      and not exists (select 1 from pg_catalog.pg_database d where d.datdba=r.oid)
      and not exists (select 1 from pg_catalog.pg_namespace n where n.nspowner=r.oid
        and n.nspname not like 'pg_temp_%' and n.nspname not like 'pg_toast_temp_%')
      and not exists (select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
        where c.relowner=r.oid and n.nspname not like 'pg_temp_%' and n.nspname not like 'pg_toast_temp_%')
      and pg_catalog.has_schema_privilege(r.oid,'public','USAGE')
      and not pg_catalog.has_schema_privilege(r.oid,'public','USAGE WITH GRANT OPTION')
      and not pg_catalog.has_database_privilege(r.oid,current_database(),'CREATE')
      and not exists (select 1 from pg_catalog.pg_namespace n
        where n.nspname not like 'pg_%' and n.nspname<>'information_schema'
          and pg_catalog.has_schema_privilege(r.oid,n.oid,'CREATE'))
      and not exists (select 1 from pg_catalog.pg_default_acl d
        cross join lateral pg_catalog.aclexplode(d.defaclacl) a where a.grantee in (0,r.oid))
      and not exists (select 1 from pg_catalog.pg_parameter_acl pa
        cross join lateral pg_catalog.aclexplode(pa.paracl) a where a.grantee in (0,r.oid))
      and not exists (select 1 from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
        where n.nspname not like 'pg_%' and n.nspname<>'information_schema'
          and p.oid<>'public.pointage_raw_lock_dossier(uuid,uuid,uuid)'::pg_catalog.regprocedure
          and (p.proowner=r.oid or pg_catalog.has_function_privilege(r.oid,p.oid,'EXECUTE')))
    ) as safe from pg_catalog.pg_roles r where rolname in (${rawWriter},${lockOwner})
  `);
  if (!roles?.safe) fail();

  const tables = await connection.execute<{
    role: string;
    name: string;
    schema: string;
    select: boolean;
    insert: boolean;
    forbidden: boolean;
  }>(sql`
    select r.rolname as role,c.relname as name,n.nspname as schema,
      pg_catalog.has_table_privilege(r.oid,c.oid,'SELECT') as select,
      pg_catalog.has_table_privilege(r.oid,c.oid,'INSERT') as insert,
      (pg_catalog.has_table_privilege(r.oid,c.oid,'UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN')
       or pg_catalog.has_table_privilege(r.oid,c.oid,'SELECT WITH GRANT OPTION,INSERT WITH GRANT OPTION')) as forbidden
    from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    cross join pg_catalog.pg_roles r
    where c.relkind in ('r','p','v','m','f') and n.nspname not like 'pg_%'
      and n.nspname<>'information_schema' and r.rolname in (${rawWriter},${lockOwner})
  `);
  for (const table of tables) {
    const expected =
      table.role === rawWriter &&
      table.schema === 'public' &&
      evidenceTables.has(table.name);
    if (
      table.forbidden ||
      table.select !== expected ||
      table.insert !== expected
    )
      fail();
  }
  const columns = await connection.execute<{
    role: string;
    name: string;
    schema: string;
    column: string;
    select: boolean;
    insert: boolean;
    update: boolean;
    forbidden: boolean;
  }>(sql`
    select r.rolname as role,c.relname as name,n.nspname as schema,a.attname as column,
      pg_catalog.has_column_privilege(r.oid,c.oid,a.attnum,'SELECT') as select,
      pg_catalog.has_column_privilege(r.oid,c.oid,a.attnum,'INSERT') as insert,
      pg_catalog.has_column_privilege(r.oid,c.oid,a.attnum,'UPDATE') as update,
      (pg_catalog.has_column_privilege(r.oid,c.oid,a.attnum,'REFERENCES')
       or pg_catalog.has_column_privilege(r.oid,c.oid,a.attnum,
         'SELECT WITH GRANT OPTION,INSERT WITH GRANT OPTION,UPDATE WITH GRANT OPTION,REFERENCES WITH GRANT OPTION')) as forbidden
    from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    join pg_catalog.pg_attribute a on a.attrelid=c.oid and a.attnum>0 and not a.attisdropped
    cross join pg_catalog.pg_roles r
    where c.relkind in ('r','p','v','m','f') and n.nspname not like 'pg_%'
      and n.nspname<>'information_schema' and r.rolname in (${rawWriter},${lockOwner})
  `);
  for (const column of columns) {
    const isWriter = column.role === rawWriter;
    const inPublic = column.schema === 'public';
    const evidence = inPublic && isWriter && evidenceTables.has(column.name);
    const selected =
      inPublic &&
      (isWriter ? sourceSelect : ownerSelect)[column.name]?.includes(
        column.column,
      ) === true;
    const updated =
      inPublic &&
      (isWriter
        ? column.name === 'pointage_continuations' &&
          ['idle_expires_at', 'ended_at'].includes(column.column)
        : column.column === 'id' && Object.hasOwn(ownerSelect, column.name));
    if (
      column.forbidden ||
      column.select !== (evidence || selected) ||
      column.insert !== evidence ||
      column.update !== updated
    )
      fail();
  }
  for (const [table, required] of Object.entries(sourceSelect)) {
    for (const column of required) {
      if (
        !columns.some(
          (row) =>
            row.role === rawWriter &&
            row.schema === 'public' &&
            row.name === table &&
            row.column === column,
        )
      )
        fail();
    }
  }
  for (const table of evidenceTables) {
    if (
      !tables.some(
        (row) =>
          row.role === rawWriter &&
          row.schema === 'public' &&
          row.name === table,
      )
    )
      fail();
  }
  const [sequences] = await connection.execute<{ safe: boolean }>(sql`
    select not exists (select 1 from pg_catalog.pg_class c
      join pg_catalog.pg_namespace n on n.oid=c.relnamespace cross join pg_catalog.pg_roles r
      where c.relkind='S' and n.nspname not like 'pg_%'
        and r.rolname in (${rawWriter},${lockOwner})
        and pg_catalog.has_sequence_privilege(r.oid,c.oid,'USAGE,SELECT,UPDATE')) as safe
  `);
  if (!sequences?.safe) fail();
}

function continuationPredicate(scope: PointageRawDossierScope, id: string) {
  return and(
    eq(pointageContinuations.organizationId, scope.organizationId),
    eq(pointageContinuations.establishmentId, scope.establishmentId),
    eq(pointageContinuations.personnelDossierId, scope.personnelDossierId),
    eq(pointageContinuations.id, id),
  );
}

const continuationFields = {
  id: pointageContinuations.id,
  organizationId: pointageContinuations.organizationId,
  establishmentId: pointageContinuations.establishmentId,
  personnelDossierId: pointageContinuations.personnelDossierId,
  tokenDigest: pointageContinuations.tokenDigest,
  credentialId: pointageContinuations.credentialId,
  credentialVersion: pointageContinuations.credentialVersion,
  issuedAt: sql<string>`to_char(${pointageContinuations.issuedAt} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`,
  absoluteExpiresAt: sql<string>`to_char(${pointageContinuations.absoluteExpiresAt} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`,
  idleExpiresAt: sql<string>`to_char(${pointageContinuations.idleExpiresAt} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`,
  endedAt: sql<
    string | null
  >`to_char(${pointageContinuations.endedAt} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`,
};

function createDossierOperations(
  transaction: RawTransaction,
  scope: PointageRawDossierScope,
) {
  return {
    async findCommandReceipt(
      requestId: string,
    ): Promise<typeof pointageRawCommandReceipts.$inferSelect | null> {
      const [row] = await transaction
        .select()
        .from(pointageRawCommandReceipts)
        .where(
          and(
            eq(pointageRawCommandReceipts.organizationId, scope.organizationId),
            eq(
              pointageRawCommandReceipts.establishmentId,
              scope.establishmentId,
            ),
            eq(
              pointageRawCommandReceipts.personnelDossierId,
              scope.personnelDossierId,
            ),
            eq(pointageRawCommandReceipts.requestId, requestId),
          ),
        );
      return row ?? null;
    },

    async appendRawEvent(kind: 'CLOCK_IN' | 'CLOCK_OUT') {
      const [row] = await transaction
        .insert(pointageRawEvents)
        .values({
          ...scope,
          id: uuidv7(),
          kind,
          // Non-authoritative placeholders required by the INSERT shape. The
          // reviewed invoker trigger replaces all five fields from one DB sample.
          ordinal: 1n,
          acceptedAt: sql`timestamptz '1970-01-01 00:00:00+00'`,
          timezoneName: 'UTC',
          utcOffsetSeconds: 0,
          businessDate: '1970-01-01',
        })
        .returning({
          id: pointageRawEvents.id,
          kind: pointageRawEvents.kind,
          acceptedAt: sql<string>`to_char(${pointageRawEvents.acceptedAt} at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`,
          timezoneName: pointageRawEvents.timezoneName,
          utcOffsetSeconds: pointageRawEvents.utcOffsetSeconds,
          businessDate: pointageRawEvents.businessDate,
        });
      if (!row) throw new PointageRawScopeUnavailableError();
      return row;
    },

    async insertCommandReceipt(
      input: Readonly<{
        requestId: string;
        eventId: string;
        intentFingerprint: string;
      }>,
    ) {
      await transaction
        .insert(pointageRawCommandReceipts)
        .values({ ...scope, ...input, intentVersion: 1 });
      // No ON CONFLICT catch/savepoint: any conflict aborts the whole command.
    },

    async readCurrentClock() {
      const [clock] = await transaction.execute<{
        instant: string;
        businessDate: string;
      }>(sql`
        with sample as materialized (select pg_catalog.clock_timestamp() as instant)
        select to_char(sample.instant at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as instant,
          (sample.instant at time zone e.timezone)::date::text as "businessDate"
        from sample cross join public.establishments e
        where e.organization_id=${scope.organizationId}::uuid and e.id=${scope.establishmentId}::uuid and e.status='active'
      `);
      if (!clock) throw new PointageRawScopeUnavailableError();
      return clock;
    },

    async readRawChain() {
      const events = await transaction
        .select({
          id: pointageRawEvents.id,
          organizationId: pointageRawEvents.organizationId,
          establishmentId: pointageRawEvents.establishmentId,
          personnelDossierId: pointageRawEvents.personnelDossierId,
          ordinal: sql<string>`${pointageRawEvents.ordinal}::text`,
          kind: pointageRawEvents.kind,
          acceptedAt: sql<string>`to_char(${pointageRawEvents.acceptedAt} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`,
          timezoneName: pointageRawEvents.timezoneName,
          utcOffsetSeconds: pointageRawEvents.utcOffsetSeconds,
          businessDate: pointageRawEvents.businessDate,
          receiptLinked: sql<boolean>`exists (select 1 from public.pointage_raw_command_receipts r
          where r.organization_id=${scope.organizationId}::uuid and r.establishment_id=${scope.establishmentId}::uuid
            and r.personnel_dossier_id=${scope.personnelDossierId}::uuid and r.event_id=${pointageRawEvents.id})`,
        })
        .from(pointageRawEvents)
        .where(
          and(
            eq(pointageRawEvents.organizationId, scope.organizationId),
            eq(pointageRawEvents.establishmentId, scope.establishmentId),
            eq(pointageRawEvents.personnelDossierId, scope.personnelDossierId),
          ),
        )
        .orderBy(pointageRawEvents.ordinal);
      const zones = await transaction.execute<{ name: string }>(sql`
        select name from pg_catalog.pg_timezone_names where name in (
          select timezone_name from public.pointage_raw_events where organization_id=${scope.organizationId}::uuid
            and establishment_id=${scope.establishmentId}::uuid and personnel_dossier_id=${scope.personnelDossierId}::uuid
        )
      `);
      return {
        events,
        knownTimezoneNames: new Set(zones.map((zone) => zone.name)),
      };
    },

    async lockContinuation(
      id: string,
    ): Promise<PointageContinuationRecord | null> {
      const [row] = await transaction
        .select(continuationFields)
        .from(pointageContinuations)
        .where(continuationPredicate(scope, id))
        .for('update');
      return row ?? null;
    },

    async findCurrentCredential(): Promise<{
      id: string;
      credentialVersion: number;
    } | null> {
      const [row] = await transaction
        .select({
          id: pointageEmployeeCredentials.id,
          credentialVersion: pointageEmployeeCredentials.credentialVersion,
        })
        .from(pointageEmployeeCredentials)
        .where(
          and(
            eq(
              pointageEmployeeCredentials.organizationId,
              scope.organizationId,
            ),
            eq(
              pointageEmployeeCredentials.establishmentId,
              scope.establishmentId,
            ),
            eq(
              pointageEmployeeCredentials.personnelDossierId,
              scope.personnelDossierId,
            ),
            isNull(pointageEmployeeCredentials.supersededAt),
          ),
        );
      return row ?? null;
    },

    // Call only after both exact identify and state.read authorizations. The
    // enclosing transaction must commit before its caller presents a token.
    async insertContinuation(
      input: Readonly<{
        tokenDigest: string;
        credentialId: string;
        credentialVersion: number;
      }>,
    ): Promise<PointageContinuationRecord | null> {
      const [clock] = await transaction.execute<{ issuedAt: string }>(
        sql`select to_char(clock_timestamp() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as "issuedAt"`,
      );
      if (!clock) throw new PointageRawScopeUnavailableError();
      const [row] = await transaction
        .insert(pointageContinuations)
        .values({
          id: uuidv7(),
          ...scope,
          ...input,
          issuedAt: clock.issuedAt,
          absoluteExpiresAt: sql`${clock.issuedAt}::timestamptz + interval '120 seconds'`,
          idleExpiresAt: sql`${clock.issuedAt}::timestamptz + interval '60 seconds'`,
          endedAt: null,
        })
        .onConflictDoNothing()
        .returning(continuationFields);
      return row ?? null;
    },

    // No caller-supplied deadline, binding or partial-row update is accepted.
    async touchContinuationIdle(
      id: string,
    ): Promise<PointageContinuationRecord | null> {
      const [row] = await transaction
        .update(pointageContinuations)
        .set({
          idleExpiresAt: sql`greatest(${pointageContinuations.idleExpiresAt}, least(${pointageContinuations.absoluteExpiresAt}, clock_timestamp() + interval '60 seconds'))`,
        })
        .where(
          and(
            continuationPredicate(scope, id),
            isNull(pointageContinuations.endedAt),
            sql`${pointageContinuations.idleExpiresAt} > clock_timestamp()`,
            sql`${pointageContinuations.absoluteExpiresAt} > clock_timestamp()`,
          ),
        )
        .returning(continuationFields);
      return row ?? null;
    },

    async endOwnContinuation(
      id: string,
    ): Promise<PointageContinuationRecord | null> {
      const [row] = await transaction
        .update(pointageContinuations)
        .set({
          endedAt: sql`clock_timestamp()`,
        })
        .where(
          and(
            continuationPredicate(scope, id),
            isNull(pointageContinuations.endedAt),
          ),
        )
        .returning(continuationFields);
      if (row) return row;
      const [ended] = await transaction
        .select(continuationFields)
        .from(pointageContinuations)
        .where(continuationPredicate(scope, id));
      return ended ?? null;
    },
  };
}

export type PointageRawDossierOperations = ReturnType<
  typeof createDossierOperations
>;

export type PointageRawClockingRepository = ReturnType<
  typeof createPointageRawClockingRepository
>;

export function createPointageRawClockingRepository(
  repositoryDb: CloudDatabaseClient,
) {
  return {
    async findContinuationCandidate(
      scope: Pick<
        PointageRawDossierScope,
        'organizationId' | 'establishmentId'
      >,
      tokenDigest: string,
    ): Promise<{ id: string; personnelDossierId: string } | null> {
      return repositoryDb.transaction(
        async (transaction) => {
          await assertPointageRawDatabaseBoundary(transaction);
          const [row] = await transaction
            .select({
              id: pointageContinuations.id,
              personnelDossierId: pointageContinuations.personnelDossierId,
            })
            .from(pointageContinuations)
            .where(
              and(
                eq(pointageContinuations.organizationId, scope.organizationId),
                eq(
                  pointageContinuations.establishmentId,
                  scope.establishmentId,
                ),
                eq(pointageContinuations.tokenDigest, tokenDigest),
              ),
            );
          // Locator only, not employee authority. The consumer must reacquire the
          // exact dossier then continuation locks and verify its current binding.
          return row ?? null;
        },
        { isolationLevel: 'read committed' },
      );
    },

    async readEstablishmentSnapshot(
      scope: Pick<
        PointageRawDossierScope,
        'organizationId' | 'establishmentId'
      >,
    ) {
      return repositoryDb.transaction(
        async (transaction) => {
          await transaction.execute(sql`set local statement_timeout='5s'`);
          await assertPointageRawDatabaseBoundary(transaction);
          const [active] = await transaction.execute<{ valid: boolean }>(sql`
          select true as valid from public.organizations o join public.establishments e on e.organization_id=o.id
          where o.id=${scope.organizationId}::uuid and e.id=${scope.establishmentId}::uuid and o.status='active' and e.status='active'
        `);
          if (!active?.valid) throw new PointageRawScopeUnavailableError();
          const dossiers = await transaction
            .selectDistinct({ id: pointageRawEvents.personnelDossierId })
            .from(pointageRawEvents)
            .where(
              and(
                eq(pointageRawEvents.organizationId, scope.organizationId),
                eq(pointageRawEvents.establishmentId, scope.establishmentId),
              ),
            )
            .orderBy(pointageRawEvents.personnelDossierId);
          const [clock] = await transaction.execute<{
            businessDate: string;
          }>(sql`
          select (clock_timestamp() at time zone timezone)::date::text as "businessDate" from public.establishments
          where organization_id=${scope.organizationId}::uuid and id=${scope.establishmentId}::uuid
        `);
          if (!clock) throw new PointageRawScopeUnavailableError();
          const chains = [];
          for (const dossier of dossiers) {
            const source = await createDossierOperations(transaction, {
              ...scope,
              personnelDossierId: dossier.id,
            }).readRawChain();
            chains.push({ personnelDossierId: dossier.id, ...source });
          }
          return { businessDate: clock.businessDate, chains };
        },
        { isolationLevel: 'repeatable read', accessMode: 'read only' },
      );
    },

    async withDossierTransaction<T>(
      scope: PointageRawDossierScope,
      operation: (
        operations: PointageRawDossierOperations,
        personnel: Readonly<{
          id: string;
          givenNames: string;
          familyName: string;
          entryDate: string;
          departureDate: string | null;
          timezone: string;
        }>,
      ) => Promise<T>,
    ): Promise<T> {
      return repositoryDb.transaction(
        async (transaction) => {
          await transaction.execute(sql`set local lock_timeout = '2s'`);
          await transaction.execute(sql`set local statement_timeout = '5s'`);
          await assertPointageRawDatabaseBoundary(transaction);
          // The reviewed helper holds parent and dossier locks until this outer
          // transaction ends. It does not authorize the operation or return data.
          // Do not catch lock errors or release these locks through a savepoint.
          await transaction.execute(sql`
            select public.pointage_raw_lock_dossier(
              ${scope.organizationId}::pg_catalog.uuid,
              ${scope.establishmentId}::pg_catalog.uuid,
              ${scope.personnelDossierId}::pg_catalog.uuid
            )
          `);
          // Re-read current scope and Personnel after delegated lock acquisition;
          // continuation locking and current credential checks remain invoker work.
          const [organization] = await transaction
            .select({ id: organizations.id })
            .from(organizations)
            .where(
              and(
                eq(organizations.id, scope.organizationId),
                eq(organizations.status, 'active'),
              ),
            );
          if (!organization) throw new PointageRawScopeUnavailableError();
          const [establishment] = await transaction
            .select({ timezone: establishments.timezone })
            .from(establishments)
            .where(
              and(
                eq(establishments.organizationId, scope.organizationId),
                eq(establishments.id, scope.establishmentId),
                eq(establishments.status, 'active'),
              ),
            );
          if (!establishment) throw new PointageRawScopeUnavailableError();
          const [personnel] = await transaction
            .select({
              id: personnelEmployeeDossiers.id,
              givenNames: personnelEmployeeDossiers.givenNames,
              familyName: personnelEmployeeDossiers.familyName,
              entryDate: personnelEmployeeDossiers.entryDate,
              departureDate: personnelEmployeeDossiers.departureDate,
            })
            .from(personnelEmployeeDossiers)
            .where(
              and(
                eq(
                  personnelEmployeeDossiers.organizationId,
                  scope.organizationId,
                ),
                eq(
                  personnelEmployeeDossiers.establishmentId,
                  scope.establishmentId,
                ),
                eq(personnelEmployeeDossiers.id, scope.personnelDossierId),
              ),
            );
          if (!personnel) throw new PointageRawScopeUnavailableError();
          return operation(createDossierOperations(transaction, scope), {
            ...personnel,
            timezone: establishment.timezone,
          });
        },
        { isolationLevel: 'read committed' },
      );
    },
  };
}
