import {
  feedbackListQuerySchema,
  type FeedbackListQuery,
  type FeedbackStatus,
} from '@yuta/contracts/reputation';
import type { TenantContext } from '@yuta/tenant';
import { and, eq, inArray } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  createFeedbackInternalNote,
  findFeedbackDetail,
  listFeedback,
  saveFeedbackReplyDraft,
  updateFeedback,
  type FeedbackScopeOptions,
} from '../src/reputation-repository';
import {
  establishments,
  feedbackInternalNotes,
  feedbackItems,
  feedbackReplies,
  organizations,
  reputationAuditEvents,
  tenantMemberships,
  users,
} from '../src/schema';

const disposableIdentity = 'yuta_release_a_exposure_test';
const refusal = 'Release A disposable database target refused.';

// No dotenv fallback, migrations, provisioning or fixture effects occur here.
function requireReleaseATestConfiguration(environment: NodeJS.ProcessEnv) {
  if (
    environment.NODE_ENV !== 'test' ||
    environment.VERCEL !== undefined ||
    environment.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS !== 'true' ||
    environment.YUTA_ALLOW_RELEASE_A_EXPOSURE_TESTS !== 'true' ||
    environment.CLOUD_DATABASE_SSL !== 'false' ||
    !environment.CLOUD_DATABASE_URL ||
    /[\s\\]/u.test(environment.CLOUD_DATABASE_URL)
  ) {
    throw new Error(refusal);
  }
  let target: URL;
  try {
    target = new URL(environment.CLOUD_DATABASE_URL);
  } catch {
    throw new Error(refusal);
  }
  const rawAuthority = /^postgres(?:ql)?:\/\/([^/?#]+)\//u.exec(
    environment.CLOUD_DATABASE_URL,
  )?.[1];
  const rawHost = rawAuthority?.slice(rawAuthority.lastIndexOf('@') + 1);
  if (
    !['postgres:', 'postgresql:'].includes(target.protocol) ||
    target.hostname !== '127.0.0.1' ||
    target.port !== '54329' ||
    rawHost !== target.host ||
    target.username !== disposableIdentity ||
    !target.password ||
    target.pathname !== `/${disposableIdentity}` ||
    target.search ||
    target.hash
  ) {
    throw new Error(refusal);
  }
  return environment;
}

describe('Release A disposable database admission', () => {
  const allowed: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    YUTA_ALLOW_DATABASE_INTEGRATION_TESTS: 'true',
    YUTA_ALLOW_RELEASE_A_EXPOSURE_TESTS: 'true',
    CLOUD_DATABASE_SSL: 'false',
    CLOUD_DATABASE_URL: `postgres://${disposableIdentity}:synthetic@127.0.0.1:54329/${disposableIdentity}`,
  };

  it('admits only explicit task flags and the exact disposable URL identity', () => {
    expect(requireReleaseATestConfiguration(allowed)).toBe(allowed);
    for (const override of [
      { YUTA_ALLOW_RELEASE_A_EXPOSURE_TESTS: undefined },
      { YUTA_ALLOW_DATABASE_INTEGRATION_TESTS: undefined },
      { NODE_ENV: 'production' },
      { VERCEL: '1' },
      { CLOUD_DATABASE_SSL: 'true' },
      { CLOUD_DATABASE_URL: undefined },
    ]) {
      expect(() =>
        requireReleaseATestConfiguration({ ...allowed, ...override }),
      ).toThrow(refusal);
    }
  });

  it.each([
    `postgres://${disposableIdentity}:synthetic@127.0.0.1:5432/${disposableIdentity}`,
    `postgres://${disposableIdentity}:synthetic@localhost:54329/${disposableIdentity}`,
    `postgres://${disposableIdentity}:synthetic@127.1:54329/${disposableIdentity}`,
    `postgres://${disposableIdentity}:synthetic@remote.example:54329/${disposableIdentity}`,
    `postgres://another_user:synthetic@127.0.0.1:54329/${disposableIdentity}`,
    `postgres://${disposableIdentity}:synthetic@127.0.0.1:54329/yuta_cloud_dev`,
    `postgres://${disposableIdentity}:synthetic@127.0.0.1:54329/${disposableIdentity}?sslmode=require`,
    `postgres://${disposableIdentity}:synthetic@127.0.0.1:54329/${disposableIdentity}#ignored`,
  ])('refuses a different or ambiguous target without connecting', (url) => {
    expect(() =>
      requireReleaseATestConfiguration({
        ...allowed,
        CLOUD_DATABASE_URL: url,
      }),
    ).toThrow(refusal);
  });
});

const integrationTest =
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true' &&
  process.env.YUTA_ALLOW_RELEASE_A_EXPOSURE_TESTS === 'true'
    ? describe
    : describe.skip;
const attentionStatuses: readonly FeedbackStatus[] = [
  'NEW',
  'TO_PROCESS',
  'DRAFTED',
  'FOLLOW_UP',
];
const googleScope: FeedbackScopeOptions = {
  requiredSource: 'GOOGLE',
  scopedCounters: true,
  attentionStatuses,
};

integrationTest('Release A persisted Reputation scope', () => {
  let db: CloudDatabaseClient | undefined;
  let verified = false;
  const organizationId = uuidv7();
  const foreignOrganizationId = uuidv7();
  const ownedOrganizationIds = [organizationId, foreignOrganizationId];
  const establishmentId = uuidv7();
  const otherEstablishmentId = uuidv7();
  const foreignEstablishmentId = uuidv7();
  const ownerUserId = uuidv7();
  const managerUserId = uuidv7();
  const staffUserId = uuidv7();
  const userIds = [ownerUserId, managerUserId, staffUserId];
  const membershipIds = [uuidv7(), uuidv7(), uuidv7()];
  const ownerContext: TenantContext = {
    organizationId,
    establishmentId,
    actor: {
      type: 'user',
      userId: ownerUserId,
      role: 'OWNER',
      membershipId: membershipIds[0]!,
    },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set(['reputation.enabled']),
  };
  const managerContext: TenantContext = {
    ...ownerContext,
    actor: {
      type: 'user',
      userId: managerUserId,
      role: 'MANAGER',
      membershipId: membershipIds[1]!,
    },
  };
  const staffContext: TenantContext = {
    ...ownerContext,
    actor: {
      type: 'user',
      userId: staffUserId,
      role: 'STAFF',
      membershipId: membershipIds[2]!,
    },
  };

  function database() {
    if (!verified || !db) throw new Error(refusal);
    return db;
  }

  async function addFeedback(
    values: Partial<typeof feedbackItems.$inferInsert> = {},
  ) {
    const [feedback] = await database()
      .insert(feedbackItems)
      .values({
        id: uuidv7(),
        organizationId,
        establishmentId,
        source: 'GOOGLE',
        type: 'PUBLIC_REVIEW',
        status: 'NEW',
        rating: 4,
        sentiment: 'POSITIVE',
        content: 'Synthetic Release A feedback',
        ...values,
      })
      .returning();
    return feedback!;
  }

  async function snapshot(feedbackId: string) {
    const client = database();
    const [parents, replies, notes, audits] = await Promise.all([
      client
        .select()
        .from(feedbackItems)
        .where(eq(feedbackItems.id, feedbackId)),
      client
        .select()
        .from(feedbackReplies)
        .where(eq(feedbackReplies.feedbackItemId, feedbackId)),
      client
        .select()
        .from(feedbackInternalNotes)
        .where(eq(feedbackInternalNotes.feedbackItemId, feedbackId)),
      client
        .select()
        .from(reputationAuditEvents)
        .where(
          inArray(reputationAuditEvents.organizationId, ownedOrganizationIds),
        ),
    ]);
    return { parents, replies, notes, audits };
  }

  beforeAll(async () => {
    const configuration = requireReleaseATestConfiguration(process.env);
    db = createCloudDatabaseClient(configuration);
    const [identity] = await db.$client<
      { database: string; user: string; sessionUser: string; version: number }[]
    >`
      select current_database() as database, current_user as "user",
        session_user as "sessionUser",
        current_setting('server_version_num')::integer as version
    `;
    if (
      identity?.database !== disposableIdentity ||
      identity.user !== disposableIdentity ||
      identity.sessionUser !== disposableIdentity ||
      identity.version < 170000 ||
      identity.version >= 180000
    ) {
      throw new Error(refusal);
    }
    verified = true;
    await database()
      .insert(organizations)
      .values(
        ownedOrganizationIds.map((id) => ({
          id,
          name: 'Synthetic Release A test organization',
          slug: `release-a-test-${id}`,
        })),
      );
    await database()
      .insert(establishments)
      .values([
        {
          id: establishmentId,
          organizationId,
          name: 'Test establishment',
          slug: 'main',
        },
        {
          id: otherEstablishmentId,
          organizationId,
          name: 'Other establishment',
          slug: 'other',
        },
        {
          id: foreignEstablishmentId,
          organizationId: foreignOrganizationId,
          name: 'Foreign establishment',
          slug: 'foreign',
        },
      ]);
    await database()
      .insert(users)
      .values(
        userIds.map((id) => ({
          id,
          authProviderId: `test:${id}`,
          displayName: 'Synthetic Release A actor',
          email: `release-a-${id}@example.test`,
        })),
      );
    await database()
      .insert(tenantMemberships)
      .values([
        {
          id: membershipIds[0]!,
          userId: ownerUserId,
          organizationId,
          establishmentId,
          role: 'OWNER',
          status: 'active',
        },
        {
          id: membershipIds[1]!,
          userId: managerUserId,
          organizationId,
          establishmentId,
          role: 'MANAGER',
          status: 'active',
        },
        {
          id: membershipIds[2]!,
          userId: staffUserId,
          organizationId,
          establishmentId,
          role: 'STAFF',
          status: 'active',
        },
      ]);
  });

  afterAll(async () => {
    if (!db) return;
    try {
      if (verified) {
        await db
          .delete(reputationAuditEvents)
          .where(
            inArray(reputationAuditEvents.organizationId, ownedOrganizationIds),
          );
        await db
          .delete(feedbackItems)
          .where(inArray(feedbackItems.organizationId, ownedOrganizationIds));
        await db
          .delete(tenantMemberships)
          .where(
            inArray(tenantMemberships.organizationId, ownedOrganizationIds),
          );
        await db.delete(users).where(inArray(users.id, userIds));
        await db
          .delete(establishments)
          .where(inArray(establishments.organizationId, ownedOrganizationIds));
        await db
          .delete(organizations)
          .where(inArray(organizations.id, ownedOrganizationIds));
      }
    } finally {
      await db.$client.end({ timeout: 5 });
    }
  });

  it('uses identical source, actor and status predicates beyond the preview cap, including a local published reply', async () => {
    const queueRows = await Promise.all(
      Array.from({ length: 8 }, (_, index) =>
        addFeedback({
          status: attentionStatuses[index % attentionStatuses.length],
          content: 'Queue marker',
          assignedToUserId: index < 4 ? staffUserId : null,
        }),
      ),
    );
    await database().insert(feedbackReplies).values({
      id: uuidv7(),
      organizationId,
      feedbackItemId: queueRows[0]!.id,
      content: 'Locally published fixture',
      status: 'PUBLISHED',
    });
    await addFeedback({
      status: 'RESOLVED',
      content: 'Queue marker',
      assignedToUserId: staffUserId,
    });
    await addFeedback({
      source: 'DIRECT',
      type: 'DIRECT_FEEDBACK',
      content: 'Queue marker',
      assignedToUserId: staffUserId,
    });
    await addFeedback({
      establishmentId: otherEstablishmentId,
      content: 'Queue marker',
      assignedToUserId: staffUserId,
    });
    await addFeedback({
      organizationId: foreignOrganizationId,
      establishmentId: foreignEstablishmentId,
      content: 'Queue marker',
      assignedToUserId: staffUserId,
    });
    const query = feedbackListQuerySchema.parse({
      source: 'DIRECT',
      search: 'Queue marker',
      pageSize: 3,
    });
    const options = { ...googleScope, statuses: attentionStatuses };
    const owner = await listFeedback(database(), ownerContext, query, options);
    const manager = await listFeedback(
      database(),
      managerContext,
      query,
      options,
    );
    const staff = await listFeedback(database(), staffContext, query, options);
    expect(owner.items).toHaveLength(3);
    expect(owner.pagination.totalItems).toBe(8);
    expect(owner.attentionCount).toBe(8);
    expect(owner.counters).toMatchObject({ total: 8, new: 2, unanswered: 7 });
    expect(manager.pagination.totalItems).toBe(8);
    expect(manager.attentionCount).toBe(8);
    expect(staff.pagination.totalItems).toBe(4);
    expect(staff.attentionCount).toBe(4);
    expect(staff.counters).toMatchObject({ total: 4, new: 1 });
    expect(
      staff.items.every((row) => row.assignedToUserId === staffUserId),
    ).toBe(true);
    const fullQueue = await listFeedback(
      database(),
      ownerContext,
      { ...query, pageSize: 100 },
      options,
    );
    expect(fullQueue.items.map((row) => row.id).sort()).toEqual(
      queueRows.map((row) => row.id).sort(),
    );
    expect(
      fullQueue.items.find((row) => row.id === queueRows[0]!.id)?.replyStatus,
    ).toBe('PUBLISHED');
    const narrowed = await listFeedback(
      database(),
      ownerContext,
      { ...query, status: 'DRAFTED' },
      options,
    );
    expect(narrowed.pagination.totalItems).toBe(2);
    expect(narrowed.attentionCount).toBe(2);
    expect(narrowed.counters).toMatchObject({ total: 2, new: 0 });
    const excludedStatus = await listFeedback(
      database(),
      ownerContext,
      { ...query, status: 'RESOLVED' },
      options,
    );
    expect(excludedStatus.pagination.totalItems).toBe(0);
    expect(excludedStatus.attentionCount).toBe(0);
    expect(excludedStatus.counters.total).toBe(0);
    const emptySet = await listFeedback(database(), ownerContext, query, {
      ...googleScope,
      statuses: [],
    });
    expect(emptySet.pagination.totalItems).toBe(0);
    expect(emptySet.attentionCount).toBe(0);
  });

  it('denies DIRECT, foreign organization, other establishment and unassigned STAFF targets without effects or success audits', async () => {
    const direct = await addFeedback({
      source: 'DIRECT',
      type: 'DIRECT_FEEDBACK',
    });
    const foreign = await addFeedback({
      organizationId: foreignOrganizationId,
      establishmentId: foreignEstablishmentId,
    });
    const other = await addFeedback({ establishmentId: otherEstablishmentId });
    const unassigned = await addFeedback();
    for (const [context, feedback] of [
      [ownerContext, direct],
      [ownerContext, foreign],
      [ownerContext, other],
      [staffContext, unassigned],
    ] as const) {
      const before = await snapshot(feedback.id);
      await expect(
        findFeedbackDetail(database(), context, feedback.id, googleScope),
      ).resolves.toBeUndefined();
      await expect(
        updateFeedback(
          database(),
          context,
          {
            feedbackId: feedback.id,
            status: 'ARCHIVED',
            actorUserId: ownerUserId,
          },
          googleScope,
        ),
      ).rejects.toMatchObject({ code: 'FEEDBACK_NOT_FOUND' });
      await expect(
        saveFeedbackReplyDraft(
          database(),
          context,
          {
            feedbackId: feedback.id,
            content: 'Denied draft',
            actorUserId: ownerUserId,
          },
          googleScope,
        ),
      ).rejects.toMatchObject({ code: 'FEEDBACK_NOT_FOUND' });
      await expect(
        createFeedbackInternalNote(
          database(),
          context,
          {
            feedbackId: feedback.id,
            content: 'Denied note',
            actorUserId: ownerUserId,
          },
          googleScope,
        ),
      ).rejects.toMatchObject({ code: 'FEEDBACK_NOT_FOUND' });
      expect(await snapshot(feedback.id)).toEqual(before);
    }
  });

  it('admits assigned STAFF draft and note while isolating foreign-organization children', async () => {
    const feedback = await addFeedback({ assignedToUserId: staffUserId });
    const foreignReplyId = uuidv7();
    const foreignNoteId = uuidv7();
    await database().insert(feedbackReplies).values({
      id: foreignReplyId,
      organizationId: foreignOrganizationId,
      feedbackItemId: feedback.id,
      content: 'Foreign child must stay untouched',
      status: 'DRAFT',
    });
    await database().insert(feedbackInternalNotes).values({
      id: foreignNoteId,
      organizationId: foreignOrganizationId,
      feedbackItemId: feedback.id,
      content: 'Foreign note must not be exposed',
      createdByUserId: ownerUserId,
    });
    const reply = await saveFeedbackReplyDraft(
      database(),
      staffContext,
      {
        feedbackId: feedback.id,
        content: 'Permitted manual draft',
        actorUserId: staffUserId,
      },
      googleScope,
    );
    const updatedReply = await saveFeedbackReplyDraft(
      database(),
      staffContext,
      {
        feedbackId: feedback.id,
        content: 'Edited manual draft',
        actorUserId: staffUserId,
      },
      googleScope,
    );
    expect(updatedReply.id).toBe(reply.id);
    expect(updatedReply).toMatchObject({
      organizationId,
      status: 'DRAFT',
      content: 'Edited manual draft',
    });
    await createFeedbackInternalNote(
      database(),
      staffContext,
      {
        feedbackId: feedback.id,
        content: 'Permitted internal note',
        actorUserId: staffUserId,
      },
      googleScope,
    );
    const detail = await findFeedbackDetail(
      database(),
      staffContext,
      feedback.id,
      googleScope,
    );
    expect(detail?.status).toBe('DRAFTED');
    expect(detail?.replies).toHaveLength(1);
    expect(detail?.notes).toHaveLength(1);
    expect(detail?.replies[0]?.id).toBe(reply.id);
    const [foreignReply] = await database()
      .select()
      .from(feedbackReplies)
      .where(
        and(
          eq(feedbackReplies.organizationId, foreignOrganizationId),
          eq(feedbackReplies.id, foreignReplyId),
        ),
      );
    expect(foreignReply?.content).toBe('Foreign child must stay untouched');
    const list = await listFeedback(
      database(),
      staffContext,
      feedbackListQuerySchema.parse({ search: 'Synthetic Release A feedback' }),
      googleScope,
    );
    expect(list.items.find((row) => row.id === feedback.id)?.replyId).toBe(
      reply.id,
    );
    await updateFeedback(
      database(),
      ownerContext,
      {
        feedbackId: feedback.id,
        assignedToUserId: null,
        actorUserId: ownerUserId,
      },
      googleScope,
    );
    const before = await snapshot(feedback.id);
    await expect(
      saveFeedbackReplyDraft(
        database(),
        staffContext,
        {
          feedbackId: feedback.id,
          content: 'No longer assigned',
          actorUserId: staffUserId,
        },
        googleScope,
      ),
    ).rejects.toMatchObject({ code: 'FEEDBACK_NOT_FOUND' });
    expect(await snapshot(feedback.id)).toEqual(before);
  });

  it('preserves internal mixed-source reads, legacy counters, DIRECT note/status and draft source denial', async () => {
    const direct = await addFeedback({
      source: 'DIRECT',
      type: 'DIRECT_FEEDBACK',
      content: 'Internal regression marker',
    });
    await addFeedback({ content: 'Internal regression marker' });
    const query: FeedbackListQuery = feedbackListQuerySchema.parse({
      search: 'Internal regression marker',
      status: 'NEW',
    });
    const legacy = await listFeedback(database(), ownerContext, query);
    expect(new Set(legacy.items.map((row) => row.source))).toEqual(
      new Set(['GOOGLE', 'DIRECT']),
    );
    expect(legacy.pagination.totalItems).toBe(2);
    expect(legacy.counters.total).toBeGreaterThan(legacy.pagination.totalItems);
    expect(legacy.attentionCount).toBe(0);
    await updateFeedback(database(), managerContext, {
      feedbackId: direct.id,
      status: 'TO_PROCESS',
      actorUserId: managerUserId,
    });
    await createFeedbackInternalNote(database(), managerContext, {
      feedbackId: direct.id,
      content: 'Existing internal note',
      actorUserId: managerUserId,
    });
    const before = await snapshot(direct.id);
    await expect(
      saveFeedbackReplyDraft(database(), managerContext, {
        feedbackId: direct.id,
        content: 'Unsupported internal draft',
        actorUserId: managerUserId,
      }),
    ).rejects.toMatchObject({ code: 'SOURCE_NOT_SUPPORTED' });
    expect(await snapshot(direct.id)).toEqual(before);
    const detail = await findFeedbackDetail(
      database(),
      managerContext,
      direct.id,
    );
    expect(detail).toMatchObject({ source: 'DIRECT', status: 'TO_PROCESS' });
    expect(detail?.notes[0]?.content).toBe('Existing internal note');
  });
});
