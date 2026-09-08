import { sql } from 'drizzle-orm';
import {
  check,
  customType,
  foreignKey,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

// Keep binary source independent from PostgreSQL text encoding and NUL limits.
const legalSourceBytes = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => 'bytea',
  toDriver: (value) => Buffer.from(value),
  fromDriver: (value) => {
    if (!(value instanceof Uint8Array)) {
      throw new Error('Invalid legal source binary representation');
    }
    return Buffer.from(value);
  },
});

export const formalitesTemplateIdentities = pgTable(
  'formalites_template_identities',
  {
    id: uuid('id').primaryKey(),
    legalPurpose: text('legal_purpose').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      'formalites_template_purpose_nonempty',
      sql`length(${table.legalPurpose}) > 0`,
    ),
  ],
);

export const formalitesTemplateWorkingDrafts = pgTable(
  'formalites_template_working_drafts',
  {
    id: uuid('id').primaryKey(),
    templateId: uuid('template_id')
      .notNull()
      .references(() => formalitesTemplateIdentities.id, {
        onDelete: 'restrict',
      }),
    revision: integer('revision').default(1).notNull(),
    contentProfile: text('content_profile').notNull(),
    sourceBytes: legalSourceBytes('source_bytes').notNull(),
    applicability: jsonb('applicability').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    frozenAt: timestamp('frozen_at', { withTimezone: true }),
  },
  (table) => [
    unique('formalites_template_draft_containment').on(
      table.id,
      table.templateId,
    ),
    uniqueIndex('formalites_template_one_active_draft')
      .on(table.templateId)
      .where(sql`${table.frozenAt} is null`),
    check(
      'formalites_template_draft_positive_revision',
      sql`${table.revision} > 0`,
    ),
  ],
);

export const formalitesTemplateVersions = pgTable(
  'formalites_template_versions',
  {
    id: uuid('id').primaryKey(),
    templateId: uuid('template_id')
      .notNull()
      .references(() => formalitesTemplateIdentities.id, {
        onDelete: 'restrict',
      }),
    sourceDraftId: uuid('source_draft_id').notNull(),
    sourceDraftRevision: integer('source_draft_revision').notNull(),
    contentProfile: text('content_profile').notNull(),
    sourceBytes: legalSourceBytes('source_bytes').notNull(),
    checksumAlgorithm: text('checksum_algorithm').notNull(),
    contentChecksum: text('content_checksum').notNull(),
    applicability: jsonb('applicability').notNull(),
    frozenAt: timestamp('frozen_at', { withTimezone: true }).notNull(),
  },
  (table) => [
    foreignKey({
      name: 'formalites_template_version_draft_containment',
      columns: [table.sourceDraftId, table.templateId],
      foreignColumns: [
        formalitesTemplateWorkingDrafts.id,
        formalitesTemplateWorkingDrafts.templateId,
      ],
    }).onDelete('restrict'),
    unique('formalites_template_freeze_locator').on(
      table.sourceDraftId,
      table.sourceDraftRevision,
    ),
    check(
      'formalites_template_version_positive_revision',
      sql`${table.sourceDraftRevision} > 0`,
    ),
    check(
      'formalites_template_checksum_algorithm',
      sql`${table.checksumAlgorithm} = 'sha256'`,
    ),
    check(
      'formalites_template_checksum_shape',
      sql`${table.contentChecksum} ~ '^[0-9a-f]{64}$'`,
    ),
  ],
);
