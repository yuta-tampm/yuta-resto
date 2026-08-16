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
  unique,
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
export const personnelFixedTermReasonCodeEnum = pgEnum(
  'personnel_fixed_term_reason_code',
  [
    'employee_replacement',
    'temporary_activity_increase',
    'seasonal_employment',
    'customary_use_employment',
  ],
);
export const personnelDocumentCategoryEnum = pgEnum(
  'personnel_document_category',
  ['signed_employment_contract'],
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
    fixedTermReasonCode: personnelFixedTermReasonCodeEnum(
      'fixed_term_reason_code',
    ),
    workTimeCategory:
      personnelWorkTimeCategoryEnum('work_time_category').notNull(),
    contractWeeklyMinutes: integer('contract_weekly_minutes'),
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
      'personnel_employee_dossiers_fixed_term_reason_check',
      sql`(${table.employmentTermType} = 'indefinite' and ${table.fixedTermReasonCode} is null) or ${table.employmentTermType} = 'fixed_term'`,
    ),
    check(
      'personnel_employee_dossiers_contract_weekly_minutes_check',
      sql`${table.contractWeeklyMinutes} is null or (${table.contractWeeklyMinutes} >= 1 and ${table.contractWeeklyMinutes} <= 2880)`,
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

export const personnelDocuments = pgTable(
  'personnel_documents',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'restrict' }),
    establishmentId: uuid('establishment_id').notNull(),
    employeeId: uuid('employee_id').notNull(),
    category: personnelDocumentCategoryEnum('category').notNull(),
    currentVersion: integer('current_version').notNull(),
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
    uniqueIndex('personnel_documents_scope_employee_category_unique_idx').on(
      table.organizationId,
      table.establishmentId,
      table.employeeId,
      table.category,
    ),
    unique('personnel_documents_scope_id_unique').on(
      table.organizationId,
      table.establishmentId,
      table.employeeId,
      table.id,
    ),
    foreignKey({
      columns: [table.organizationId, table.establishmentId, table.employeeId],
      foreignColumns: [
        personnelEmployeeDossiers.organizationId,
        personnelEmployeeDossiers.establishmentId,
        personnelEmployeeDossiers.id,
      ],
      name: 'personnel_documents_employee_scope_fk',
    }).onDelete('restrict'),
    check(
      'personnel_documents_current_version_check',
      sql`${table.currentVersion} > 0`,
    ),
    check('personnel_documents_revision_check', sql`${table.revision} > 0`),
  ],
);

export const personnelDocumentVersions = pgTable(
  'personnel_document_versions',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'restrict' }),
    establishmentId: uuid('establishment_id').notNull(),
    employeeId: uuid('employee_id').notNull(),
    documentId: uuid('document_id').notNull(),
    version: integer('version').notNull(),
    filename: varchar('filename', { length: 180 }).notNull(),
    mediaType: varchar('media_type', { length: 100 }).notNull(),
    byteSize: integer('byte_size').notNull(),
    checksum: varchar('checksum', { length: 64 }).notNull(),
    storageKey: uuid('storage_key').notNull(),
    uploadedByUserId: uuid('uploaded_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('personnel_document_versions_document_version_unique_idx').on(
      table.documentId,
      table.version,
    ),
    uniqueIndex('personnel_document_versions_storage_key_unique_idx').on(
      table.storageKey,
    ),
    index('personnel_document_versions_scope_employee_idx').on(
      table.organizationId,
      table.establishmentId,
      table.employeeId,
      table.createdAt,
    ),
    foreignKey({
      columns: [
        table.organizationId,
        table.establishmentId,
        table.employeeId,
        table.documentId,
      ],
      foreignColumns: [
        personnelDocuments.organizationId,
        personnelDocuments.establishmentId,
        personnelDocuments.employeeId,
        personnelDocuments.id,
      ],
      name: 'personnel_document_versions_document_scope_fk',
    }).onDelete('restrict'),
    check(
      'personnel_document_versions_version_check',
      sql`${table.version} > 0`,
    ),
    check(
      'personnel_document_versions_byte_size_check',
      sql`${table.byteSize} > 0 and ${table.byteSize} <= 10485760`,
    ),
    check(
      'personnel_document_versions_media_type_check',
      sql`${table.mediaType} = 'application/pdf'`,
    ),
  ],
);

export const personnelDocumentCommandReceipts = pgTable(
  'personnel_document_command_receipts',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'restrict' }),
    establishmentId: uuid('establishment_id').notNull(),
    employeeId: uuid('employee_id').notNull(),
    actorUserId: uuid('actor_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    idempotencyHash: varchar('idempotency_hash', { length: 64 }).notNull(),
    requestFingerprint: varchar('request_fingerprint', {
      length: 64,
    }).notNull(),
    documentId: uuid('document_id').notNull(),
    version: integer('version').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex('personnel_document_receipts_scope_key_unique_idx').on(
      table.organizationId,
      table.establishmentId,
      table.actorUserId,
      table.idempotencyHash,
    ),
    index('personnel_document_receipts_expires_at_idx').on(table.expiresAt),
    foreignKey({
      columns: [
        table.organizationId,
        table.establishmentId,
        table.employeeId,
        table.documentId,
      ],
      foreignColumns: [
        personnelDocuments.organizationId,
        personnelDocuments.establishmentId,
        personnelDocuments.employeeId,
        personnelDocuments.id,
      ],
      name: 'personnel_document_receipts_document_scope_fk',
    }).onDelete('restrict'),
    check(
      'personnel_document_receipts_version_check',
      sql`${table.version} > 0`,
    ),
  ],
);

export const personnelContractAmendments = pgTable(
  'personnel_contract_amendments',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'restrict' }),
    establishmentId: uuid('establishment_id').notNull(),
    employeeId: uuid('employee_id').notNull(),
    effectiveDate: date('effective_date').notNull(),
    reference: varchar('reference', { length: 80 }),
    currentVersion: integer('current_version').notNull(),
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
    index('personnel_contract_amendments_scope_employee_date_idx').on(
      table.organizationId,
      table.establishmentId,
      table.employeeId,
      table.effectiveDate,
      table.createdAt,
      table.id,
    ),
    unique('personnel_contract_amendments_scope_id_unique').on(
      table.organizationId,
      table.establishmentId,
      table.employeeId,
      table.id,
    ),
    foreignKey({
      columns: [table.organizationId, table.establishmentId, table.employeeId],
      foreignColumns: [
        personnelEmployeeDossiers.organizationId,
        personnelEmployeeDossiers.establishmentId,
        personnelEmployeeDossiers.id,
      ],
      name: 'personnel_contract_amendments_employee_scope_fk',
    }).onDelete('restrict'),
    check(
      'personnel_contract_amendments_current_version_check',
      sql`${table.currentVersion} > 0`,
    ),
    check(
      'personnel_contract_amendments_revision_check',
      sql`${table.revision} > 0`,
    ),
  ],
);

export const personnelContractAmendmentVersions = pgTable(
  'personnel_contract_amendment_versions',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'restrict' }),
    establishmentId: uuid('establishment_id').notNull(),
    employeeId: uuid('employee_id').notNull(),
    amendmentId: uuid('amendment_id').notNull(),
    version: integer('version').notNull(),
    filename: varchar('filename', { length: 180 }).notNull(),
    mediaType: varchar('media_type', { length: 100 }).notNull(),
    byteSize: integer('byte_size').notNull(),
    checksum: varchar('checksum', { length: 64 }).notNull(),
    storageKey: uuid('storage_key').notNull(),
    uploadedByUserId: uuid('uploaded_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex(
      'personnel_contract_amendment_versions_amendment_version_unique_idx',
    ).on(table.amendmentId, table.version),
    uniqueIndex(
      'personnel_contract_amendment_versions_storage_key_unique_idx',
    ).on(table.storageKey),
    index('personnel_contract_amendment_versions_scope_employee_idx').on(
      table.organizationId,
      table.establishmentId,
      table.employeeId,
      table.createdAt,
    ),
    foreignKey({
      columns: [
        table.organizationId,
        table.establishmentId,
        table.employeeId,
        table.amendmentId,
      ],
      foreignColumns: [
        personnelContractAmendments.organizationId,
        personnelContractAmendments.establishmentId,
        personnelContractAmendments.employeeId,
        personnelContractAmendments.id,
      ],
      name: 'personnel_contract_amendment_versions_amendment_scope_fk',
    }).onDelete('restrict'),
    check(
      'personnel_contract_amendment_versions_version_check',
      sql`${table.version} > 0`,
    ),
    check(
      'personnel_contract_amendment_versions_byte_size_check',
      sql`${table.byteSize} > 0 and ${table.byteSize} <= 10485760`,
    ),
    check(
      'personnel_contract_amendment_versions_media_type_check',
      sql`${table.mediaType} = 'application/pdf'`,
    ),
  ],
);

export const personnelContractAmendmentCommandReceipts = pgTable(
  'personnel_contract_amendment_command_receipts',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'restrict' }),
    establishmentId: uuid('establishment_id').notNull(),
    employeeId: uuid('employee_id').notNull(),
    actorUserId: uuid('actor_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    commandType: varchar('command_type', { length: 80 }).notNull(),
    idempotencyHash: varchar('idempotency_hash', { length: 64 }).notNull(),
    requestFingerprint: varchar('request_fingerprint', {
      length: 64,
    }).notNull(),
    amendmentId: uuid('amendment_id').notNull(),
    version: integer('version').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex(
      'personnel_contract_amendment_receipts_scope_key_unique_idx',
    ).on(
      table.organizationId,
      table.establishmentId,
      table.actorUserId,
      table.idempotencyHash,
    ),
    index('personnel_contract_amendment_receipts_expires_at_idx').on(
      table.expiresAt,
    ),
    foreignKey({
      columns: [
        table.organizationId,
        table.establishmentId,
        table.employeeId,
        table.amendmentId,
      ],
      foreignColumns: [
        personnelContractAmendments.organizationId,
        personnelContractAmendments.establishmentId,
        personnelContractAmendments.employeeId,
        personnelContractAmendments.id,
      ],
      name: 'personnel_contract_amendment_receipts_amendment_scope_fk',
    }).onDelete('restrict'),
    check(
      'personnel_contract_amendment_receipts_version_check',
      sql`${table.version} > 0`,
    ),
  ],
);
