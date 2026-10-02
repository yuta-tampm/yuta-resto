import { sql } from 'drizzle-orm';
import {
  bigint,
  check,
  date,
  foreignKey,
  index,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { personnelEmployeeDossiers } from './personnel';
import { pointageEmployeeCredentials } from './pointage';
import { establishments } from './tenancy';

export const pointageRawEvents = pgTable(
  'pointage_raw_events',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    personnelDossierId: uuid('personnel_dossier_id').notNull(),
    ordinal: bigint('ordinal', { mode: 'bigint' }).notNull(),
    kind: varchar('kind', { length: 16 }).notNull(),
    acceptedAt: timestamp('accepted_at', {
      withTimezone: true,
      precision: 6,
      mode: 'string',
    }).notNull(),
    timezoneName: text('timezone_name').notNull(),
    utcOffsetSeconds: integer('utc_offset_seconds').notNull(),
    businessDate: date('business_date', { mode: 'string' }).notNull(),
  },
  (table) => [
    unique('pointage_raw_events_scoped_id').on(
      table.organizationId,
      table.establishmentId,
      table.personnelDossierId,
      table.id,
    ),
    unique('pointage_raw_events_scoped_ordinal').on(
      table.organizationId,
      table.establishmentId,
      table.personnelDossierId,
      table.ordinal,
    ),
    foreignKey({
      name: 'pointage_raw_events_establishment_fk',
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
    }).onDelete('restrict'),
    foreignKey({
      name: 'pointage_raw_events_dossier_fk',
      columns: [
        table.organizationId,
        table.establishmentId,
        table.personnelDossierId,
      ],
      foreignColumns: [
        personnelEmployeeDossiers.organizationId,
        personnelEmployeeDossiers.establishmentId,
        personnelEmployeeDossiers.id,
      ],
    }).onDelete('restrict'),
    check('pointage_raw_events_positive_ordinal', sql`${table.ordinal} > 0`),
    check(
      'pointage_raw_events_kind',
      sql`${table.kind} in ('CLOCK_IN', 'CLOCK_OUT')`,
    ),
    index('pointage_raw_events_scoped_day').on(
      table.organizationId,
      table.establishmentId,
      table.businessDate,
      table.acceptedAt,
    ),
  ],
);

export const pointageRawCommandReceipts = pgTable(
  'pointage_raw_command_receipts',
  {
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    personnelDossierId: uuid('personnel_dossier_id').notNull(),
    requestId: uuid('request_id').notNull(),
    eventId: uuid('event_id').notNull(),
    intentVersion: smallint('intent_version').notNull(),
    intentFingerprint: varchar('intent_fingerprint', { length: 64 }).notNull(),
  },
  (table) => [
    primaryKey({
      name: 'pointage_raw_receipts_request_pk',
      columns: [
        table.organizationId,
        table.establishmentId,
        table.personnelDossierId,
        table.requestId,
      ],
    }),
    unique('pointage_raw_receipts_scoped_event').on(
      table.organizationId,
      table.establishmentId,
      table.personnelDossierId,
      table.eventId,
    ),
    foreignKey({
      name: 'pointage_raw_receipts_event_fk',
      columns: [
        table.organizationId,
        table.establishmentId,
        table.personnelDossierId,
        table.eventId,
      ],
      foreignColumns: [
        pointageRawEvents.organizationId,
        pointageRawEvents.establishmentId,
        pointageRawEvents.personnelDossierId,
        pointageRawEvents.id,
      ],
    }).onDelete('no action'),
    check(
      'pointage_raw_receipts_intent_version',
      sql`${table.intentVersion} = 1`,
    ),
    check(
      'pointage_raw_receipts_fingerprint',
      sql`${table.intentFingerprint} ~ '^[0-9a-f]{64}$'`,
    ),
  ],
);

// The generated migration must make the receipt FK INITIALLY DEFERRED and add
// its reverse FK, also deferred. Drizzle cannot express that commit boundary.
// Neither the schema nor an isolated raw INSERT proves a committed operation.

export const pointageContinuations = pgTable(
  'pointage_continuations',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    personnelDossierId: uuid('personnel_dossier_id').notNull(),
    tokenDigest: varchar('token_digest', { length: 64 }).notNull(),
    credentialId: uuid('credential_id').notNull(),
    credentialVersion: integer('credential_version').notNull(),
    issuedAt: timestamp('issued_at', {
      withTimezone: true,
      precision: 6,
      mode: 'string',
    }).notNull(),
    absoluteExpiresAt: timestamp('absolute_expires_at', {
      withTimezone: true,
      precision: 6,
      mode: 'string',
    }).notNull(),
    idleExpiresAt: timestamp('idle_expires_at', {
      withTimezone: true,
      precision: 6,
      mode: 'string',
    }).notNull(),
    endedAt: timestamp('ended_at', {
      withTimezone: true,
      precision: 6,
      mode: 'string',
    }),
  },
  (table) => [
    unique('pointage_continuations_scoped_digest').on(
      table.organizationId,
      table.establishmentId,
      table.tokenDigest,
    ),
    foreignKey({
      name: 'pointage_continuations_dossier_fk',
      columns: [
        table.organizationId,
        table.establishmentId,
        table.personnelDossierId,
      ],
      foreignColumns: [
        personnelEmployeeDossiers.organizationId,
        personnelEmployeeDossiers.establishmentId,
        personnelEmployeeDossiers.id,
      ],
    }).onDelete('restrict'),
    foreignKey({
      name: 'pointage_continuations_credential_fk',
      columns: [
        table.organizationId,
        table.establishmentId,
        table.personnelDossierId,
        table.credentialId,
        table.credentialVersion,
      ],
      foreignColumns: [
        pointageEmployeeCredentials.organizationId,
        pointageEmployeeCredentials.establishmentId,
        pointageEmployeeCredentials.personnelDossierId,
        pointageEmployeeCredentials.id,
        pointageEmployeeCredentials.credentialVersion,
      ],
    }).onDelete('restrict'),
    check(
      'pointage_continuations_digest',
      sql`${table.tokenDigest} ~ '^[0-9a-f]{64}$'`,
    ),
    check(
      'pointage_continuations_credential_version',
      sql`${table.credentialVersion} > 0`,
    ),
    check(
      'pointage_continuations_absolute',
      sql`${table.absoluteExpiresAt} = ${table.issuedAt} + interval '120 seconds'`,
    ),
    check(
      'pointage_continuations_idle',
      sql`${table.issuedAt} < ${table.idleExpiresAt} and ${table.idleExpiresAt} <= ${table.absoluteExpiresAt}`,
    ),
  ],
);

export type PointageRawEvent = typeof pointageRawEvents.$inferSelect;
export type PointageRawCommandReceipt =
  typeof pointageRawCommandReceipts.$inferSelect;
export type PointageContinuation = typeof pointageContinuations.$inferSelect;
