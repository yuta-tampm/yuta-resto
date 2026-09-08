import { sql } from 'drizzle-orm';
import {
  check,
  foreignKey,
  index,
  integer,
  pgTable,
  primaryKey,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { personnelEmployeeDossiers } from './personnel';
import { establishments, organizations } from './tenancy';
import { users } from './users';

export const pointageEmployeeCredentials = pgTable(
  'pointage_employee_credentials',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'restrict' }),
    establishmentId: uuid('establishment_id').notNull(),
    personnelDossierId: uuid('personnel_dossier_id').notNull(),
    credentialVersion: integer('credential_version').notNull(),
    credentialFormatVersion: integer('credential_format_version').notNull(),
    algorithmVersion: varchar('algorithm_version', { length: 32 }).notNull(),
    keyVersion: integer('key_version').notNull(),
    lookupDigest: varchar('lookup_digest', { length: 64 }).notNull(),
    salt: varchar('salt', { length: 24 }).notNull(),
    verifier: varchar('verifier', { length: 44 }).notNull(),
    issuedAt: timestamp('issued_at', { withTimezone: true }).notNull(),
    issuedByUserId: uuid('issued_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    supersededAt: timestamp('superseded_at', { withTimezone: true }),
    supersededByCredentialId: uuid('superseded_by_credential_id'),
    supersededByUserId: uuid('superseded_by_user_id').references(
      () => users.id,
      {
        onDelete: 'set null',
      },
    ),
  },
  (table) => [
    unique('pointage_credentials_continuation_binding_unique').on(
      table.organizationId,
      table.establishmentId,
      table.personnelDossierId,
      table.id,
      table.credentialVersion,
    ),
    unique('pointage_credentials_scope_id_unique').on(
      table.organizationId,
      table.establishmentId,
      table.id,
    ),
    uniqueIndex('pointage_credentials_historical_digest_unique_idx').on(
      table.organizationId,
      table.establishmentId,
      table.lookupDigest,
    ),
    uniqueIndex('pointage_credentials_dossier_version_unique_idx').on(
      table.organizationId,
      table.establishmentId,
      table.personnelDossierId,
      table.credentialVersion,
    ),
    uniqueIndex('pointage_credentials_one_active_dossier_unique_idx')
      .on(table.organizationId, table.establishmentId, table.personnelDossierId)
      .where(sql`${table.supersededAt} is null`),
    index('pointage_credentials_scope_dossier_idx').on(
      table.organizationId,
      table.establishmentId,
      table.personnelDossierId,
    ),
    foreignKey({
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
      name: 'pointage_credentials_establishment_scope_fk',
    }).onDelete('restrict'),
    foreignKey({
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
      name: 'pointage_credentials_dossier_scope_fk',
    }).onDelete('restrict'),
    foreignKey({
      columns: [
        table.organizationId,
        table.establishmentId,
        table.supersededByCredentialId,
      ],
      foreignColumns: [table.organizationId, table.establishmentId, table.id],
      name: 'pointage_credentials_superseded_scope_fk',
    }).onDelete('restrict'),
    check(
      'pointage_credentials_versions_check',
      sql`${table.credentialVersion} > 0 and ${table.credentialFormatVersion} > 0 and ${table.keyVersion} > 0`,
    ),
    check(
      'pointage_credentials_lookup_digest_check',
      sql`${table.lookupDigest} ~ '^[0-9a-f]{64}$'`,
    ),
    check(
      'pointage_credentials_supersede_consistency_check',
      sql`(${table.supersededAt} is null and ${table.supersededByCredentialId} is null and ${table.supersededByUserId} is null) or (${table.supersededAt} is not null and ${table.supersededByCredentialId} is not null and ${table.supersededByUserId} is not null)`,
    ),
  ],
);

export const pointageCredentialRateLimits = pgTable(
  'pointage_credential_rate_limits',
  {
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    keyKind: varchar('key_kind', { length: 16 }).notNull(),
    keyDigest: varchar('key_digest', { length: 64 }).notNull(),
    windowStartedAt: timestamp('window_started_at', {
      withTimezone: true,
    }).notNull(),
    failureCount: integer('failure_count').notNull(),
    blockedUntil: timestamp('blocked_until', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [
        table.organizationId,
        table.establishmentId,
        table.keyKind,
        table.keyDigest,
      ],
      name: 'pointage_rate_limits_scope_key_pk',
    }),
    foreignKey({
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
      name: 'pointage_rate_limits_establishment_scope_fk',
    }).onDelete('restrict'),
    check(
      'pointage_rate_limits_key_kind_check',
      sql`${table.keyKind} in ('candidate', 'client')`,
    ),
    check(
      'pointage_rate_limits_digest_check',
      sql`${table.keyDigest} ~ '^[0-9a-f]{64}$'`,
    ),
    check(
      'pointage_rate_limits_failure_count_check',
      sql`${table.failureCount} >= 0`,
    ),
  ],
);

export const pointageSecurityAuditEvents = pgTable(
  'pointage_security_audit_events',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    eventType: varchar('event_type', { length: 80 }).notNull(),
    outcome: varchar('outcome', { length: 16 }).notNull(),
    reasonCode: varchar('reason_code', { length: 40 }),
    managerUserId: uuid('manager_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    personnelDossierId: uuid('personnel_dossier_id'),
    credentialId: uuid('credential_id'),
    credentialVersion: integer('credential_version'),
    requestedOperation: varchar('requested_operation', { length: 64 }),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
  },
  (table) => [
    index('pointage_audit_scope_time_idx').on(
      table.organizationId,
      table.establishmentId,
      table.occurredAt,
    ),
    foreignKey({
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
      name: 'pointage_audit_establishment_scope_fk',
    }).onDelete('restrict'),
    foreignKey({
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
      name: 'pointage_audit_dossier_scope_fk',
    }).onDelete('restrict'),
    foreignKey({
      columns: [
        table.organizationId,
        table.establishmentId,
        table.credentialId,
      ],
      foreignColumns: [
        pointageEmployeeCredentials.organizationId,
        pointageEmployeeCredentials.establishmentId,
        pointageEmployeeCredentials.id,
      ],
      name: 'pointage_audit_credential_scope_fk',
    }).onDelete('restrict'),
    check(
      'pointage_audit_event_type_check',
      sql`${table.eventType} in ('pointage.credential.issued', 'pointage.credential.reset', 'pointage.credential.superseded', 'pointage.credential.authentication_succeeded', 'pointage.credential.authentication_denied', 'pointage.credential.rate_limited', 'pointage.authorization.denied', 'pointage.evidence_eligibility.denied')`,
    ),
    check(
      'pointage_audit_outcome_check',
      sql`${table.outcome} in ('succeeded', 'denied')`,
    ),
    check(
      'pointage_audit_reason_code_check',
      sql`${table.reasonCode} is null or ${table.reasonCode} in ('invalid_credential', 'superseded_credential', 'unsupported_version', 'rate_limited', 'scope_not_resolved', 'client_address_untrusted', 'operation_not_granted', 'dossier_not_in_scope', 'before_entry', 'after_departure')`,
    ),
    check(
      'pointage_audit_credential_version_check',
      sql`${table.credentialVersion} is null or ${table.credentialVersion} > 0`,
    ),
  ],
);

export type PointageEmployeeCredential =
  typeof pointageEmployeeCredentials.$inferSelect;
export type NewPointageEmployeeCredential =
  typeof pointageEmployeeCredentials.$inferInsert;
export type PointageSecurityAuditEvent =
  typeof pointageSecurityAuditEvents.$inferSelect;
export type NewPointageSecurityAuditEvent =
  typeof pointageSecurityAuditEvents.$inferInsert;
