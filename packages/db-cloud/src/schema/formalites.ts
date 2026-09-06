import { sql } from 'drizzle-orm';
import {
  check,
  date,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import {
  personnelEmployeeDossiers,
  personnelEmploymentTermTypeEnum,
} from './personnel';
import { establishments, organizations } from './tenancy';
import { users } from './users';

export const formalitesPersonnelDraftStatusEnum = pgEnum(
  'formalites_personnel_draft_status',
  ['draft', 'abandoned'],
);
export const formalitesPersonnelProbationChoiceEnum = pgEnum(
  'formalites_personnel_probation_choice',
  ['undecided', 'include', 'exclude'],
);
export const formalitesPersonnelDraftCommandEnum = pgEnum(
  'formalites_personnel_draft_command',
  ['create', 'save', 'reconcile', 'abandon'],
);
export const formalitesPersonnelDraftCommandOutcomeEnum = pgEnum(
  'formalites_personnel_draft_command_outcome',
  ['created', 'saved', 'reconciled', 'abandoned'],
);

export const formalitesPersonnelDrafts = pgTable(
  'formalites_personnel_drafts',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'restrict' }),
    establishmentId: uuid('establishment_id').notNull(),
    employeeId: uuid('employee_id').notNull(),
    formalityType: varchar('formality_type', { length: 64 }).notNull(),
    status: formalitesPersonnelDraftStatusEnum('status')
      .default('draft')
      .notNull(),
    probationChoice: formalitesPersonnelProbationChoiceEnum('probation_choice')
      .default('undecided')
      .notNull(),
    revision: integer('revision').default(1).notNull(),

    draftGivenNames: varchar('draft_given_names', { length: 120 }).notNull(),
    draftFamilyName: varchar('draft_family_name', { length: 120 }).notNull(),
    draftPosition: varchar('draft_position', { length: 120 }).notNull(),
    draftQualification: varchar('draft_qualification', {
      length: 120,
    }).notNull(),
    draftEmploymentTermType: personnelEmploymentTermTypeEnum(
      'draft_employment_term_type',
    ).notNull(),
    draftEntryDate: date('draft_entry_date').notNull(),
    draftContractWeeklyMinutes: integer('draft_contract_weekly_minutes'),

    sourceGivenNames: varchar('source_given_names', {
      length: 120,
    }).notNull(),
    sourceFamilyName: varchar('source_family_name', {
      length: 120,
    }).notNull(),
    sourcePosition: varchar('source_position', { length: 120 }).notNull(),
    sourceQualification: varchar('source_qualification', {
      length: 120,
    }).notNull(),
    sourceEmploymentTermType: personnelEmploymentTermTypeEnum(
      'source_employment_term_type',
    ).notNull(),
    sourceEntryDate: date('source_entry_date').notNull(),
    sourceContractWeeklyMinutes: integer('source_contract_weekly_minutes'),
    sourcePersonnelRevision: integer('source_personnel_revision').notNull(),

    abandonmentReason: varchar('abandonment_reason', { length: 250 }),
    abandonedAt: timestamp('abandoned_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique('formalites_personnel_drafts_scope_id_unique').on(
      table.organizationId,
      table.establishmentId,
      table.id,
    ),
    uniqueIndex('formalites_personnel_drafts_one_active_idx')
      .on(
        table.organizationId,
        table.establishmentId,
        table.employeeId,
        table.formalityType,
      )
      .where(sql`${table.status} = 'draft'`),
    index('formalites_personnel_drafts_scope_employee_idx').on(
      table.organizationId,
      table.establishmentId,
      table.employeeId,
      table.createdAt,
    ),
    foreignKey({
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
      name: 'formalites_personnel_drafts_establishment_scope_fk',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.organizationId, table.establishmentId, table.employeeId],
      foreignColumns: [
        personnelEmployeeDossiers.organizationId,
        personnelEmployeeDossiers.establishmentId,
        personnelEmployeeDossiers.id,
      ],
      name: 'formalites_personnel_drafts_employee_scope_fk',
    }).onDelete('restrict'),
    check(
      'formalites_personnel_drafts_formality_type_check',
      sql`${table.formalityType} = 'cdi_preparation'`,
    ),
    check(
      'formalites_personnel_drafts_revision_check',
      sql`${table.revision} > 0`,
    ),
    check(
      'formalites_personnel_drafts_source_revision_check',
      sql`${table.sourcePersonnelRevision} > 0`,
    ),
    check(
      'formalites_personnel_drafts_weekly_minutes_check',
      sql`(${table.draftContractWeeklyMinutes} is null or (${table.draftContractWeeklyMinutes} >= 1 and ${table.draftContractWeeklyMinutes} <= 2880)) and (${table.sourceContractWeeklyMinutes} is null or (${table.sourceContractWeeklyMinutes} >= 1 and ${table.sourceContractWeeklyMinutes} <= 2880))`,
    ),
    check(
      'formalites_personnel_drafts_lifecycle_check',
      sql`(${table.status} = 'draft' and ${table.abandonmentReason} is null and ${table.abandonedAt} is null) or (${table.status} = 'abandoned' and ${table.abandonmentReason} is not null and btrim(${table.abandonmentReason}) = ${table.abandonmentReason} and char_length(${table.abandonmentReason}) between 1 and 250 and ${table.abandonedAt} is not null)`,
    ),
  ],
);

export const formalitesPersonnelDraftCommandReceipts = pgTable(
  'formalites_personnel_draft_command_receipts',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'restrict' }),
    establishmentId: uuid('establishment_id').notNull(),
    actorUserId: uuid('actor_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    commandType: formalitesPersonnelDraftCommandEnum('command_type').notNull(),
    operationKeyHash: varchar('operation_key_hash', { length: 64 }).notNull(),
    requestFingerprint: varchar('request_fingerprint', {
      length: 64,
    }).notNull(),
    resultingDraftId: uuid('resulting_draft_id').notNull(),
    resultingDraftRevision: integer('resulting_draft_revision').notNull(),
    resultingOutcome:
      formalitesPersonnelDraftCommandOutcomeEnum('resulting_outcome').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('formalites_personnel_draft_receipts_scope_key_unique_idx').on(
      table.organizationId,
      table.establishmentId,
      table.actorUserId,
      table.commandType,
      table.operationKeyHash,
    ),
    index('formalites_personnel_draft_receipts_scope_draft_idx').on(
      table.organizationId,
      table.establishmentId,
      table.resultingDraftId,
      table.createdAt,
    ),
    foreignKey({
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
      name: 'formalites_personnel_draft_receipts_establishment_scope_fk',
    }).onDelete('restrict'),
    foreignKey({
      columns: [
        table.organizationId,
        table.establishmentId,
        table.resultingDraftId,
      ],
      foreignColumns: [
        formalitesPersonnelDrafts.organizationId,
        formalitesPersonnelDrafts.establishmentId,
        formalitesPersonnelDrafts.id,
      ],
      name: 'formalites_personnel_draft_receipts_draft_scope_fk',
    }).onDelete('restrict'),
    check(
      'formalites_personnel_draft_receipts_revision_check',
      sql`${table.resultingDraftRevision} > 0`,
    ),
    check(
      'formalites_personnel_draft_receipts_hashes_check',
      sql`char_length(${table.operationKeyHash}) = 64 and ${table.operationKeyHash} ~ '^[0-9a-f]{64}$' and char_length(${table.requestFingerprint}) = 64 and ${table.requestFingerprint} ~ '^[0-9a-f]{64}$'`,
    ),
  ],
);
