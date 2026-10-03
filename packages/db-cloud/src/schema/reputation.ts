import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { establishments, organizations } from './tenancy';
import { users } from './users';

export const feedbackSourceEnum = pgEnum('feedback_source', [
  'GOOGLE',
  'DIRECT',
]);
export const feedbackTypeEnum = pgEnum('feedback_type', [
  'PUBLIC_REVIEW',
  'DIRECT_FEEDBACK',
]);
export const feedbackSentimentEnum = pgEnum('feedback_sentiment', [
  'POSITIVE',
  'NEUTRAL',
  'NEGATIVE',
]);
export const feedbackUrgencyEnum = pgEnum('feedback_urgency', [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]);
export const feedbackStatusEnum = pgEnum('feedback_status', [
  'NEW',
  'TO_PROCESS',
  'DRAFTED',
  'REPLIED',
  'FOLLOW_UP',
  'RESOLVED',
  'ARCHIVED',
  'SPAM',
]);
export const feedbackReplyStatusEnum = pgEnum('feedback_reply_status', [
  'DRAFT',
  'READY',
  'PUBLISHED',
  'FAILED',
  'DELETED',
]);
export const servicePeriodEnum = pgEnum('feedback_service_period', [
  'LUNCH',
  'DINNER',
  'OTHER',
]);
export const connectorProviderEnum = pgEnum('reputation_connector_provider', [
  'GOOGLE',
]);
export const connectorStatusEnum = pgEnum('reputation_connector_status', [
  'DISCONNECTED',
  'CONNECTING',
  'CONNECTED',
  'ERROR',
  'AUTH_EXPIRED',
]);
export const auditEntityTypeEnum = pgEnum('reputation_audit_entity_type', [
  'FEEDBACK',
  'REPLY',
  'CONNECTOR',
  'SETTINGS',
]);

const createdAt = () =>
  timestamp('created_at', { withTimezone: true }).defaultNow().notNull();
const updatedAt = () =>
  timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date());

export const feedbackItems = pgTable(
  'feedback_items',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    establishmentId: uuid('establishment_id')
      .notNull()
      .references(() => establishments.id),
    source: feedbackSourceEnum('source').notNull(),
    type: feedbackTypeEnum('type').notNull(),
    googleImporterOwned: boolean('google_importer_owned')
      .default(false)
      .notNull(),
    externalId: varchar('external_id', { length: 255 }),
    externalUrl: text('external_url'),
    authorName: varchar('author_name', { length: 255 }),
    authorAvatarUrl: text('author_avatar_url'),
    rating: integer('rating'),
    title: varchar('title', { length: 500 }),
    content: text('content'),
    language: varchar('language', { length: 35 }),
    sentiment: feedbackSentimentEnum('sentiment'),
    urgency: feedbackUrgencyEnum('urgency'),
    status: feedbackStatusEnum('status').default('NEW').notNull(),
    assignedToUserId: uuid('assigned_to_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    receivedAt: timestamp('received_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
    providerMetadata:
      jsonb('provider_metadata').$type<Record<string, unknown>>(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    check(
      'feedback_items_google_importer_boundary_check',
      sql`not ${table.googleImporterOwned} or (${table.source} = 'GOOGLE' and ${table.type} = 'PUBLIC_REVIEW'
        and ${table.externalId} is null and ${table.externalUrl} is null
        and ${table.authorName} is null and ${table.authorAvatarUrl} is null
        and ${table.rating} is null and ${table.title} is null and ${table.content} is null
        and ${table.language} is null and ${table.sentiment} is null and ${table.urgency} is null
        and ${table.publishedAt} is null and ${table.lastSyncedAt} is null and ${table.providerMetadata} is null)`,
    ),
    uniqueIndex('feedback_items_scope_id_unique_idx').on(
      table.organizationId,
      table.establishmentId,
      table.id,
    ),
    check(
      'feedback_items_rating_check',
      sql`${table.rating} is null or (${table.rating} >= 1 and ${table.rating} <= 5)`,
    ),
    uniqueIndex('feedback_items_provider_external_unique_idx').on(
      table.organizationId,
      table.source,
      table.externalId,
    ),
    index('feedback_items_scope_idx').on(
      table.organizationId,
      table.establishmentId,
    ),
    index('feedback_items_status_idx').on(table.status),
    index('feedback_items_received_at_idx').on(table.receivedAt),
    index('feedback_items_assigned_to_user_id_idx').on(table.assignedToUserId),
  ],
);

export const feedbackReplies = pgTable(
  'feedback_replies',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    feedbackItemId: uuid('feedback_item_id')
      .notNull()
      .references(() => feedbackItems.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    revision: integer('revision').default(1).notNull(),
    status: feedbackReplyStatusEnum('status').default('DRAFT').notNull(),
    externalReplyId: varchar('external_reply_id', { length: 255 }),
    externalReplyStatus: varchar('external_reply_status', { length: 100 }),
    generatedByAi: boolean('generated_by_ai').default(false).notNull(),
    originalAiContent: text('original_ai_content'),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    editedByUserId: uuid('edited_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    approvedByUserId: uuid('approved_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    publishedByUserId: uuid('published_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    failedAt: timestamp('failed_at', { withTimezone: true }),
    errorCode: varchar('error_code', { length: 100 }),
    errorMessage: text('error_message'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index('feedback_replies_organization_id_idx').on(table.organizationId),
    index('feedback_replies_feedback_item_id_idx').on(table.feedbackItemId),
    index('feedback_replies_status_idx').on(table.status),
    uniqueIndex('feedback_replies_scoped_id_idx').on(
      table.organizationId,
      table.feedbackItemId,
      table.id,
    ),
    check('feedback_replies_revision_check', sql`${table.revision} > 0`),
  ],
);

export const googleReplyPublications = pgTable(
  'google_reply_publications',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    feedbackItemId: uuid('feedback_item_id').notNull(),
    replyId: uuid('reply_id').notNull(),
    revision: integer('revision').notNull(),
    connectorId: uuid('connector_id').notNull(),
    bindingGeneration: integer('binding_generation').notNull(),
    actorUserId: uuid('actor_user_id').notNull(),
    actorSessionId: uuid('actor_session_id').notNull(),
    actorMembershipId: uuid('actor_membership_id').notNull(),
    actorAuthVersion: integer('actor_auth_version').notNull(),
    previewExpiresAt: timestamp('preview_expires_at', {
      withTimezone: true,
    }).notNull(),
    remoteFingerprint: varchar('remote_fingerprint', { length: 64 }),
    state: varchar('state', { length: 20 })
      .$type<import('@yuta/contracts/reputation').GoogleReplyPublicationState>()
      .notNull(),
    retryParentId: uuid('retry_parent_id'),
    supersededById: uuid('superseded_by_id'),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    dispatchedAt: timestamp('dispatched_at', { withTimezone: true }),
    leaseExpiresAt: timestamp('lease_expires_at', { withTimezone: true }),
    observedAt: timestamp('observed_at', { withTimezone: true }),
    reconciledAt: timestamp('reconciled_at', { withTimezone: true }),
    errorCategory: varchar('error_category', { length: 50 }),
    createdAt: createdAt(),
  },
  (table) => [
    foreignKey({
      name: 'google_reply_publication_feedback_scope_fk',
      columns: [
        table.organizationId,
        table.establishmentId,
        table.feedbackItemId,
      ],
      foreignColumns: [
        feedbackItems.organizationId,
        feedbackItems.establishmentId,
        feedbackItems.id,
      ],
    }),
    foreignKey({
      name: 'google_reply_publication_draft_scope_fk',
      columns: [table.organizationId, table.feedbackItemId, table.replyId],
      foreignColumns: [
        feedbackReplies.organizationId,
        feedbackReplies.feedbackItemId,
        feedbackReplies.id,
      ],
    }),
    foreignKey({
      name: 'google_reply_publication_connector_scope_fk',
      columns: [table.organizationId, table.establishmentId, table.connectorId],
      foreignColumns: [
        reputationConnectors.organizationId,
        reputationConnectors.establishmentId,
        reputationConnectors.id,
      ],
    }),
    check(
      'google_reply_publication_revision_check',
      sql`${table.revision}>0 and ${table.bindingGeneration}>=0 and ${table.actorAuthVersion}>=0`,
    ),
    check(
      'google_reply_publication_state_check',
      sql`${table.state} in ('PREVIEW','DISPATCHING','UNCERTAIN','FAILED','UNCONFIRMED','PENDING','REJECTED','APPROVED')`,
    ),
    index('google_reply_publication_review_idx').on(
      table.organizationId,
      table.establishmentId,
      table.feedbackItemId,
      table.createdAt,
    ),
    index('google_reply_publication_preview_expiry_idx').on(
      table.previewExpiresAt,
    ),
  ],
);

export const directCustomerFeedback = pgTable(
  'direct_customer_feedback',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    establishmentId: uuid('establishment_id')
      .notNull()
      .references(() => establishments.id),
    feedbackItemId: uuid('feedback_item_id')
      .notNull()
      .references(() => feedbackItems.id, { onDelete: 'cascade' }),
    selectedTopics: jsonb('selected_topics')
      .$type<string[]>()
      .default([])
      .notNull(),
    customerName: varchar('customer_name', { length: 255 }),
    customerEmail: varchar('customer_email', { length: 320 }),
    customerPhone: varchar('customer_phone', { length: 40 }),
    consentToContact: boolean('consent_to_contact').default(false).notNull(),
    consentRecordedAt: timestamp('consent_recorded_at', {
      withTimezone: true,
    }),
    orderReference: varchar('order_reference', { length: 100 }),
    visitDate: timestamp('visit_date', { withTimezone: true }),
    servicePeriod: servicePeriodEnum('service_period'),
    sourceTag: varchar('source_tag', { length: 50 }),
    submissionIpHash: varchar('submission_ip_hash', { length: 64 }),
    userAgent: varchar('user_agent', { length: 500 }),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex('direct_customer_feedback_item_unique_idx').on(
      table.feedbackItemId,
    ),
    index('direct_customer_feedback_scope_idx').on(
      table.organizationId,
      table.establishmentId,
    ),
    index('direct_customer_feedback_ip_created_idx').on(
      table.submissionIpHash,
      table.createdAt,
    ),
  ],
);

export const feedbackInternalNotes = pgTable(
  'feedback_internal_notes',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    feedbackItemId: uuid('feedback_item_id')
      .notNull()
      .references(() => feedbackItems.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    createdByUserId: uuid('created_by_user_id')
      .notNull()
      .references(() => users.id),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index('feedback_internal_notes_organization_id_idx').on(
      table.organizationId,
    ),
    index('feedback_internal_notes_feedback_item_id_idx').on(
      table.feedbackItemId,
    ),
  ],
);

export const reputationConnectors = pgTable(
  'reputation_connectors',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    establishmentId: uuid('establishment_id')
      .notNull()
      .references(() => establishments.id),
    provider: connectorProviderEnum('provider').notNull(),
    bindingGeneration: integer('binding_generation').default(0).notNull(),
    externalAccountId: varchar('external_account_id', {
      length: 255,
    }).notNull(),
    externalLocationId: varchar('external_location_id', {
      length: 255,
    }).notNull(),
    status: connectorStatusEnum('status').default('DISCONNECTED').notNull(),
    encryptedAccessToken: text('encrypted_access_token'),
    encryptedRefreshToken: text('encrypted_refresh_token'),
    tokenExpiresAt: timestamp('token_expires_at', { withTimezone: true }),
    grantedScopes: jsonb('granted_scopes')
      .$type<string[]>()
      .default([])
      .notNull(),
    lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
    lastSuccessfulSyncAt: timestamp('last_successful_sync_at', {
      withTimezone: true,
    }),
    lastSyncError: text('last_sync_error'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    check(
      'reputation_connectors_generation_check',
      sql`${table.bindingGeneration} >= 0`,
    ),
    uniqueIndex('reputation_connectors_scope_id_unique_idx').on(
      table.organizationId,
      table.establishmentId,
      table.id,
    ),
    uniqueIndex('reputation_connectors_location_provider_unique_idx').on(
      table.organizationId,
      table.establishmentId,
      table.provider,
    ),
    index('reputation_connectors_status_idx').on(table.status),
  ],
);

export const googleReviewCache = pgTable(
  'google_review_cache',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    feedbackItemId: uuid('feedback_item_id').notNull(),
    connectorId: uuid('connector_id').notNull(),
    bindingGeneration: integer('binding_generation').notNull(),
    externalLocationId: varchar('external_location_id', {
      length: 255,
    }).notNull(),
    reviewName: varchar('review_name', { length: 1024 }).notNull(),
    authorName: varchar('author_name', { length: 255 }),
    rating: integer('rating'),
    content: text('content'),
    providerCreatedAt: timestamp('provider_created_at', { withTimezone: true }),
    providerUpdatedAt: timestamp('provider_updated_at', { withTimezone: true }),
    remoteReplyContent: text('remote_reply_content'),
    remoteReplyUpdatedAt: timestamp('remote_reply_updated_at', {
      withTimezone: true,
    }),
    remoteReplyStatus: varchar('remote_reply_status', { length: 100 }),
    needsReview: boolean('needs_review').default(false).notNull(),
    fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    referenceExpiresAt: timestamp('reference_expires_at', {
      withTimezone: true,
    }).notNull(),
    contentClearedAt: timestamp('content_cleared_at', { withTimezone: true }),
  },
  (table) => [
    foreignKey({
      name: 'google_review_cache_work_scope_fk',
      columns: [
        table.organizationId,
        table.establishmentId,
        table.feedbackItemId,
      ],
      foreignColumns: [
        feedbackItems.organizationId,
        feedbackItems.establishmentId,
        feedbackItems.id,
      ],
    }).onDelete('cascade'),
    foreignKey({
      name: 'google_review_cache_connector_scope_fk',
      columns: [table.organizationId, table.establishmentId, table.connectorId],
      foreignColumns: [
        reputationConnectors.organizationId,
        reputationConnectors.establishmentId,
        reputationConnectors.id,
      ],
    }).onDelete('cascade'),
    check(
      'google_review_cache_deadlines_check',
      sql`${table.bindingGeneration} >= 0 and ${table.expiresAt} > ${table.fetchedAt} and ${table.expiresAt} <= ${table.fetchedAt} + interval '29 days' and ${table.referenceExpiresAt} >= ${table.expiresAt} and ${table.referenceExpiresAt} <= ${table.fetchedAt} + interval '30 days'`,
    ),
    check(
      'google_review_cache_rating_check',
      sql`${table.rating} is null or ${table.rating} between 1 and 5`,
    ),
    check(
      'google_review_cache_cleared_content_check',
      sql`${table.contentClearedAt} is null or (${table.authorName} is null and ${table.rating} is null and ${table.content} is null and ${table.providerCreatedAt} is null and ${table.providerUpdatedAt} is null and ${table.remoteReplyContent} is null and ${table.remoteReplyUpdatedAt} is null and ${table.remoteReplyStatus} is null and not ${table.needsReview})`,
    ),
    uniqueIndex('google_review_cache_work_unique_idx').on(
      table.organizationId,
      table.establishmentId,
      table.feedbackItemId,
    ),
    uniqueIndex('google_review_cache_provider_identity_unique_idx').on(
      table.organizationId,
      table.externalLocationId,
      table.reviewName,
    ),
    index('google_review_cache_content_expiry_idx').on(table.expiresAt),
    index('google_review_cache_reference_expiry_idx').on(
      table.referenceExpiresAt,
    ),
    index('google_review_cache_connector_idx').on(
      table.organizationId,
      table.establishmentId,
      table.connectorId,
    ),
  ],
);

export const googleReviewRetrievalStates = pgTable(
  'google_review_retrieval_states',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    connectorId: uuid('connector_id').notNull(),
    bindingGeneration: integer('binding_generation').notNull(),
    attemptId: uuid('attempt_id'),
    sequenceId: uuid('sequence_id'),
    kind: varchar('kind', { length: 20 }).$type<
      'RECENT' | 'HISTORY' | 'DETAIL'
    >(),
    state: varchar('state', { length: 20 }).$type<
      'PENDING' | 'FAILED' | 'COMPLETED'
    >(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    leaseExpiresAt: timestamp('lease_expires_at', { withTimezone: true }),
    errorCategory: varchar('error_category', { length: 50 }),
    lastSuccessfulBatchAt: timestamp('last_successful_batch_at', {
      withTimezone: true,
    }),
    lastSuccessfulRecentAt: timestamp('last_successful_recent_at', {
      withTimezone: true,
    }),
    continuationHandle: uuid('continuation_handle'),
    nextPageToken: text('next_page_token'),
    coverageExpiresAt: timestamp('coverage_expires_at', { withTimezone: true }),
    returnedCount: integer('returned_count'),
    addedCount: integer('added_count'),
    changedCount: integer('changed_count'),
    totalReviewCount: integer('total_review_count'),
    hasMore: boolean('has_more'),
    recentEmpty: boolean('recent_empty'),
  },
  (table) => [
    foreignKey({
      name: 'google_review_retrieval_state_connector_scope_fk',
      columns: [table.organizationId, table.establishmentId, table.connectorId],
      foreignColumns: [
        reputationConnectors.organizationId,
        reputationConnectors.establishmentId,
        reputationConnectors.id,
      ],
    }).onDelete('cascade'),
    uniqueIndex('google_review_retrieval_state_connector_unique_idx').on(
      table.organizationId,
      table.establishmentId,
      table.connectorId,
    ),
    check(
      'google_review_retrieval_state_values_check',
      sql`${table.bindingGeneration} >= 0 and (${table.kind} is null or ${table.kind} in ('RECENT', 'HISTORY', 'DETAIL')) and (${table.state} is null or ${table.state} in ('PENDING', 'FAILED', 'COMPLETED'))`,
    ),
    check(
      'google_review_retrieval_state_counts_check',
      sql`(${table.returnedCount} is null or ${table.returnedCount} between 0 and 50) and (${table.addedCount} is null or ${table.addedCount} between 0 and 50) and (${table.changedCount} is null or ${table.changedCount} between 0 and 50) and (${table.totalReviewCount} is null or ${table.totalReviewCount} >= 0)`,
    ),
    check(
      'google_review_retrieval_state_continuation_check',
      sql`(${table.continuationHandle} is null and ${table.nextPageToken} is null) or (${table.continuationHandle} is not null and ${table.nextPageToken} is not null and ${table.coverageExpiresAt} is not null and ${table.sequenceId} is not null)`,
    ),
    index('google_review_retrieval_state_coverage_expiry_idx').on(
      table.coverageExpiresAt,
    ),
  ],
);

export const reputationSettings = pgTable(
  'reputation_settings',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    establishmentId: uuid('establishment_id')
      .notNull()
      .references(() => establishments.id),
    brandVoice: text('brand_voice').notNull(),
    replySignature: varchar('reply_signature', { length: 255 }),
    defaultReplyLanguage: varchar('default_reply_language', { length: 35 })
      .default('fr')
      .notNull(),
    allowEmployeePublish: boolean('allow_employee_publish')
      .default(false)
      .notNull(),
    requireManagerApproval: boolean('require_manager_approval')
      .default(false)
      .notNull(),
    googleReviewUrl: text('google_review_url'),
    facebookReviewUrl: text('facebook_review_url'),
    instagramUrl: text('instagram_url'),
    publicFeedbackEnabled: boolean('public_feedback_enabled')
      .default(false)
      .notNull(),
    publicFeedbackSlug: varchar('public_feedback_slug', {
      length: 100,
    }).notNull(),
    notifyOnNewReview: boolean('notify_on_new_review').default(true).notNull(),
    notifyOnNegativeReview: boolean('notify_on_negative_review')
      .default(true)
      .notNull(),
    negativeRatingThreshold: integer('negative_rating_threshold')
      .default(3)
      .notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    check(
      'reputation_settings_negative_threshold_check',
      sql`${table.negativeRatingThreshold} >= 1 and ${table.negativeRatingThreshold} <= 5`,
    ),
    uniqueIndex('reputation_settings_location_unique_idx').on(
      table.organizationId,
      table.establishmentId,
    ),
    uniqueIndex('reputation_settings_public_slug_unique_idx').on(
      table.publicFeedbackSlug,
    ),
  ],
);

export const reputationAuditEvents = pgTable(
  'reputation_audit_events',
  {
    id: uuid('id').primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    entityType: auditEntityTypeEnum('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    action: varchar('action', { length: 100 }).notNull(),
    actorUserId: uuid('actor_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (table) => [
    index('reputation_audit_events_organization_id_idx').on(
      table.organizationId,
    ),
    index('reputation_audit_events_entity_idx').on(
      table.entityType,
      table.entityId,
    ),
    index('reputation_audit_events_created_at_idx').on(table.createdAt),
  ],
);
