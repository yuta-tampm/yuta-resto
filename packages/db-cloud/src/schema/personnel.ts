import { sql } from 'drizzle-orm';
import {
  check,
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { establishments, organizations } from './tenancy';
import { users } from './users';

export const personnelEmploymentTermTypeEnum = pgEnum(
  'personnel_employment_term_type',
  ['indefinite', 'fixed_term'],
);
export const personnelWorkTimeCategoryEnum = pgEnum(
  'personnel_work_time_category',
  ['full_time', 'part_time'],
);

export const personnelEmployeeDossiers = pgTable(
  'personnel_employee_dossiers',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'restrict' }),
    establishmentId: uuid('establishment_id').notNull(),
    givenNames: varchar('given_names', { length: 120 }).notNull(),
    familyName: varchar('family_name', { length: 120 }).notNull(),
    position: varchar('position', { length: 120 }).notNull(),
    qualification: varchar('qualification', { length: 120 }).notNull(),
    employmentTermType: personnelEmploymentTermTypeEnum(
      'employment_term_type',
    ).notNull(),
    expectedEndDate: date('expected_end_date'),
    workTimeCategory:
      personnelWorkTimeCategoryEnum('work_time_category').notNull(),
    entryDate: date('entry_date').notNull(),
    departureDate: date('departure_date'),
    revision: integer('revision').default(1).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index('personnel_employee_dossiers_scope_entry_idx').on(
      table.organizationId,
      table.establishmentId,
      table.entryDate,
      table.id,
    ),
    index('personnel_employee_dossiers_scope_name_idx').on(
      table.organizationId,
      table.establishmentId,
      table.familyName,
      table.givenNames,
    ),
    uniqueIndex('personnel_employee_dossiers_scope_id_unique_idx').on(
      table.organizationId,
      table.establishmentId,
      table.id,
    ),
    foreignKey({
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
      name: 'personnel_employee_dossiers_establishment_scope_fk',
    }).onDelete('restrict'),
    check(
      'personnel_employee_dossiers_term_dates_check',
      sql`(${table.employmentTermType} = 'indefinite' and ${table.expectedEndDate} is null) or (${table.employmentTermType} = 'fixed_term' and ${table.expectedEndDate} is not null and ${table.expectedEndDate} >= ${table.entryDate})`,
    ),
    check(
      'personnel_employee_dossiers_departure_date_check',
      sql`${table.departureDate} is null or ${table.departureDate} >= ${table.entryDate}`,
    ),
    check(
      'personnel_employee_dossiers_revision_check',
      sql`${table.revision} > 0`,
    ),
  ],
);

export const personnelEmployeeAuditEvents = pgTable(
  'personnel_employee_audit_events',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'restrict' }),
    establishmentId: uuid('establishment_id').notNull(),
    employeeId: uuid('employee_id').notNull(),
    actorUserId: uuid('actor_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    eventType: varchar('event_type', { length: 100 }).notNull(),
    operationId: uuid('operation_id').notNull(),
    changedFields: varchar('changed_fields', { length: 100 })
      .array()
      .default(sql`ARRAY[]::varchar[]`)
      .notNull(),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('personnel_employee_audit_events_scope_employee_idx').on(
      table.organizationId,
      table.establishmentId,
      table.employeeId,
      table.createdAt,
    ),
    foreignKey({
      columns: [table.organizationId, table.establishmentId, table.employeeId],
      foreignColumns: [
        personnelEmployeeDossiers.organizationId,
        personnelEmployeeDossiers.establishmentId,
        personnelEmployeeDossiers.id,
      ],
      name: 'personnel_employee_audit_events_employee_scope_fk',
    }).onDelete('restrict'),
  ],
);

export const personnelCommandReceipts = pgTable(
  'personnel_command_receipts',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'restrict' }),
    establishmentId: uuid('establishment_id').notNull(),
    actorUserId: uuid('actor_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    commandType: varchar('command_type', { length: 100 }).notNull(),
    idempotencyHash: varchar('idempotency_hash', { length: 64 }).notNull(),
    requestFingerprint: varchar('request_fingerprint', {
      length: 64,
    }).notNull(),
    employeeId: uuid('employee_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex('personnel_command_receipts_scope_key_unique_idx').on(
      table.organizationId,
      table.establishmentId,
      table.actorUserId,
      table.commandType,
      table.idempotencyHash,
    ),
    index('personnel_command_receipts_expires_at_idx').on(table.expiresAt),
    foreignKey({
      columns: [table.organizationId, table.establishmentId, table.employeeId],
      foreignColumns: [
        personnelEmployeeDossiers.organizationId,
        personnelEmployeeDossiers.establishmentId,
        personnelEmployeeDossiers.id,
      ],
      name: 'personnel_command_receipts_employee_scope_fk',
    }).onDelete('restrict'),
  ],
);
