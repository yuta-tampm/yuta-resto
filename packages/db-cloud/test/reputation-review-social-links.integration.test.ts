import { config } from 'dotenv';
import type {
  ReputationReviewSocialLinksOutcome,
  ReputationReviewSocialLinksReadModel,
  ReputationReviewSocialLinksValues,
} from '@yuta/contracts/reputation';
import type { PublicTenantContext, TenantContext } from '@yuta/tenant';
import { and, eq, sql } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import { findPublicFeedbackConfiguration } from '../src/reputation-repository';
import {
  readReputationReviewSocialLinks,
  REPUTATION_REVIEW_SOCIAL_LINKS_AUDIT_ACTION,
  saveReputationReviewSocialLinks,
} from '../src/reputation-review-social-links';
import {
  establishments,
  organizations,
  reputationAuditEvents,
  reputationSettings,
  users,
} from '../src/schema';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('Reputation review social links integration', () => {
  let db: CloudDatabaseClient;
  const organizationId = uuidv7();
  const establishmentId = uuidv7();
  const otherEstablishmentId = uuidv7();
  const actorOneId = uuidv7();
  const actorTwoId = uuidv7();
  let settingsId = uuidv7();

  const values = (
    overrides: Partial<ReputationReviewSocialLinksValues> = {},
  ): ReputationReviewSocialLinksValues => ({
    googleReviewUrl: null,
    facebookReviewUrl: null,
    instagramUrl: null,
    ...overrides,
  });

  const contextFor = (
    userId: string,
    scopedEstablishmentId = establishmentId,
  ): TenantContext => ({
    organizationId,
    establishmentId: scopedEstablishmentId,
    actor: {
      type: 'user',
      userId,
      role: 'OWNER',
      membershipId: uuidv7(),
    },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set(['reputation.enabled']),
  });

  beforeAll(async () => {
    db = createCloudDatabaseClient(process.env);
    await db.insert(organizations).values({
      id: organizationId,
      name: 'Review links test organization',
      slug: `review-links-${organizationId}`,
    });
    await db.insert(establishments).values([
      {
        id: establishmentId,
        organizationId,
        name: 'Review links test establishment',
        slug: `review-links-main-${establishmentId}`,
      },
      {
        id: otherEstablishmentId,
        organizationId,
        name: 'Other review links test establishment',
        slug: `review-links-other-${otherEstablishmentId}`,
      },
    ]);
    await db.insert(users).values([
      {
        id: actorOneId,
        authProviderId: `test:${actorOneId}`,
        displayName: 'Review Links Owner One',
        email: `review-links-one-${actorOneId}@example.test`,
      },
      {
        id: actorTwoId,
        authProviderId: `test:${actorTwoId}`,
        displayName: 'Review Links Owner Two',
        email: `review-links-two-${actorTwoId}@example.test`,
      },
    ]);
  });

  beforeEach(async () => {
    await db
      .delete(reputationAuditEvents)
      .where(eq(reputationAuditEvents.organizationId, organizationId));
    await db
      .delete(reputationSettings)
      .where(eq(reputationSettings.organizationId, organizationId));
    settingsId = uuidv7();
    await db.insert(reputationSettings).values({
      id: settingsId,
      organizationId,
      establishmentId,
      brandVoice: 'Warm and concise',
      replySignature: 'L’équipe YUTA',
      defaultReplyLanguage: 'fr',
      allowEmployeePublish: false,
      requireManagerApproval: true,
      googleReviewUrl: null,
      facebookReviewUrl: null,
      instagramUrl: null,
      publicFeedbackEnabled: true,
      publicFeedbackSlug: `review-links-${settingsId}`,
      notifyOnNewReview: true,
      notifyOnNegativeReview: true,
      negativeRatingThreshold: 2,
    });
  });

  afterAll(async () => {
    await db
      .delete(reputationAuditEvents)
      .where(eq(reputationAuditEvents.organizationId, organizationId));
    await db
      .delete(reputationSettings)
      .where(eq(reputationSettings.organizationId, organizationId));
    await db.delete(users).where(eq(users.id, actorOneId));
    await db.delete(users).where(eq(users.id, actorTwoId));
    await db
      .delete(establishments)
      .where(eq(establishments.organizationId, organizationId));
    await db.delete(organizations).where(eq(organizations.id, organizationId));
    await db.$client.end({ timeout: 5 });
  });

  it('reads a scoped baseline and fails closed for missing or cross-scope rows', async () => {
    const baseline = expectSuccess(
      await readReputationReviewSocialLinks(db, contextFor(actorOneId)),
    );
    expect(baseline.values).toEqual(values());
    expect(baseline.stateToken).toMatch(/^[a-f0-9]{64}$/);

    await expect(
      readReputationReviewSocialLinks(
        db,
        contextFor(actorOneId, otherEstablishmentId),
      ),
    ).resolves.toEqual({ kind: 'configuration_unavailable' });

    await db
      .delete(reputationSettings)
      .where(eq(reputationSettings.id, settingsId));
    await expect(
      readReputationReviewSocialLinks(db, contextFor(actorOneId)),
    ).resolves.toEqual({ kind: 'configuration_unavailable' });
    await expect(
      saveReputationReviewSocialLinks(db, contextFor(actorOneId), {
        expectedValues: baseline.values,
        proposedValues: values({
          googleReviewUrl: 'https://g.page/yuta/review',
        }),
        expectedStateToken: baseline.stateToken,
      }),
    ).resolves.toEqual({ kind: 'configuration_unavailable' });
    expect(
      await db
        .select({ id: reputationSettings.id })
        .from(reputationSettings)
        .where(eq(reputationSettings.organizationId, organizationId)),
    ).toHaveLength(0);
    expect(await readQualifiedAudits()).toHaveLength(0);
  });

  it('projects unsafe legacy public links to null without modifying stored values', async () => {
    const legacyValues = {
      googleReviewUrl: 'https://mail.google.com/maps/yuta',
      facebookReviewUrl: 'https://www.facebook.com/yuta',
      instagramUrl: 'https://m.instagram.com/yuta',
    };
    await db
      .update(reputationSettings)
      .set(legacyValues)
      .where(eq(reputationSettings.id, settingsId));
    const row = await readSettingsRow();
    const publicContext: PublicTenantContext = {
      organizationId,
      establishmentId,
      hostname: 'reviews.example.test',
      locale: 'fr-FR',
      timezone: 'Europe/Paris',
      entitlements: new Set(['reputation.enabled']),
    };

    await expect(
      findPublicFeedbackConfiguration(
        db,
        publicContext,
        row.publicFeedbackSlug,
      ),
    ).resolves.toMatchObject({
      googleReviewUrl: null,
      facebookReviewUrl: legacyValues.facebookReviewUrl,
      instagramUrl: null,
    });
    expect(await readSettingsRow()).toMatchObject(legacyValues);
  });

  it('commits a multi-provider mutation with one ordered audit and preserves unrelated settings', async () => {
    const initialRow = await readSettingsRow();
    const baseline = expectSuccess(
      await readReputationReviewSocialLinks(db, contextFor(actorOneId)),
    );
    const proposed = values({
      googleReviewUrl: 'https://www.google.com/maps/place/Yuta',
      facebookReviewUrl: 'https://m.facebook.com/yuta',
      instagramUrl: 'https://www.instagram.com/yuta',
    });

    const outcome = await saveReputationReviewSocialLinks(
      db,
      contextFor(actorOneId),
      {
        expectedValues: baseline.values,
        proposedValues: proposed,
        expectedStateToken: baseline.stateToken,
      },
    );
    expect(outcome).toMatchObject({
      kind: 'success',
      model: { values: proposed },
    });

    const currentRow = await readSettingsRow();
    expect(currentRow).toMatchObject({
      ...initialRow,
      ...proposed,
      updatedAt: expect.any(Date),
    });
    expect(currentRow.updatedAt.getTime()).toBeGreaterThanOrEqual(
      initialRow.updatedAt.getTime(),
    );

    const audits = await readQualifiedAudits();
    expect(audits).toHaveLength(1);
    expect(audits[0]).toMatchObject({
      entityType: 'SETTINGS',
      entityId: settingsId,
      actorUserId: actorOneId,
      metadata: {
        establishmentId,
        changes: [
          {
            provider: 'GOOGLE',
            previousUrl: null,
            newUrl: proposed.googleReviewUrl,
          },
          {
            provider: 'FACEBOOK',
            previousUrl: null,
            newUrl: proposed.facebookReviewUrl,
          },
          {
            provider: 'INSTAGRAM',
            previousUrl: null,
            newUrl: proposed.instagramUrl,
          },
        ],
      },
    });
  });

  it('returns validation error and no-op without writing or auditing', async () => {
    const baseline = expectSuccess(
      await readReputationReviewSocialLinks(db, contextFor(actorOneId)),
    );
    const invalid = await saveReputationReviewSocialLinks(
      db,
      contextFor(actorOneId),
      {
        expectedValues: baseline.values,
        proposedValues: values({
          googleReviewUrl: 'https://mail.google.com/maps/x',
        }),
        expectedStateToken: baseline.stateToken,
      },
    );
    expect(invalid).toEqual({
      kind: 'validation_error',
      issues: [{ field: 'googleReviewUrl', code: 'HOST_NOT_ALLOWED' }],
    });
    expect(await readQualifiedAudits()).toHaveLength(0);

    const noChange = await saveReputationReviewSocialLinks(
      db,
      contextFor(actorOneId),
      {
        expectedValues: baseline.values,
        proposedValues: baseline.values,
        expectedStateToken: baseline.stateToken,
      },
    );
    expect(noChange).toMatchObject({ kind: 'no_change', model: baseline });
    expect(await readQualifiedAudits()).toHaveLength(0);
  });

  it('recovers an exact same-actor replay and classifies another actor as no-change', async () => {
    const baseline = expectSuccess(
      await readReputationReviewSocialLinks(db, contextFor(actorOneId)),
    );
    const proposed = values({ facebookReviewUrl: 'https://fb.me/yuta' });
    const input = {
      expectedValues: baseline.values,
      proposedValues: proposed,
      expectedStateToken: baseline.stateToken,
    };

    await expect(
      saveReputationReviewSocialLinks(db, contextFor(actorOneId), input),
    ).resolves.toMatchObject({ kind: 'success' });
    const replay = await saveReputationReviewSocialLinks(
      db,
      contextFor(actorOneId),
      input,
    );
    expect(replay).toMatchObject({
      kind: 'success',
      model: { values: proposed },
    });
    expect(await readQualifiedAudits()).toHaveLength(1);

    const otherActor = await saveReputationReviewSocialLinks(
      db,
      contextFor(actorTwoId),
      input,
    );
    expect(otherActor).toMatchObject({ kind: 'no_change' });
    expect(await readQualifiedAudits()).toHaveLength(1);
  });

  it('rejects stale and ABA mutations while preserving current state', async () => {
    const initial = expectSuccess(
      await readReputationReviewSocialLinks(db, contextFor(actorOneId)),
    );
    const stateB = values({ googleReviewUrl: 'https://g.page/yuta/review' });
    const resultB = expectModelOutcome(
      await saveReputationReviewSocialLinks(db, contextFor(actorOneId), {
        expectedValues: initial.values,
        proposedValues: stateB,
        expectedStateToken: initial.stateToken,
      }),
      'success',
    );

    const stale = await saveReputationReviewSocialLinks(
      db,
      contextFor(actorTwoId),
      {
        expectedValues: initial.values,
        proposedValues: values({ instagramUrl: 'https://instagram.com/yuta' }),
        expectedStateToken: initial.stateToken,
      },
    );
    expect(stale).toMatchObject({
      kind: 'conflict',
      model: { values: stateB },
    });

    const returnedToA = expectModelOutcome(
      await saveReputationReviewSocialLinks(db, contextFor(actorOneId), {
        expectedValues: resultB.values,
        proposedValues: initial.values,
        expectedStateToken: resultB.stateToken,
      }),
      'success',
    );
    expect(returnedToA.stateToken).not.toBe(initial.stateToken);

    const aba = await saveReputationReviewSocialLinks(
      db,
      contextFor(actorTwoId),
      {
        expectedValues: initial.values,
        proposedValues: values({
          facebookReviewUrl: 'https://facebook.com/yuta',
        }),
        expectedStateToken: initial.stateToken,
      },
    );
    expect(aba).toMatchObject({ kind: 'conflict', model: returnedToA });
    const audits = await readQualifiedAudits();
    expect(audits).toHaveLength(2);
    const recordedTimes = audits
      .map((audit) => audit.createdAt.getTime())
      .sort((left, right) => left - right);
    expect(recordedTimes[1]).toBeGreaterThan(recordedTimes[0] ?? 0);
  });

  it('serializes concurrent writers so only one mutation commits', async () => {
    const baseline = expectSuccess(
      await readReputationReviewSocialLinks(db, contextFor(actorOneId)),
    );
    const input = (proposedValues: ReputationReviewSocialLinksValues) => ({
      expectedValues: baseline.values,
      proposedValues,
      expectedStateToken: baseline.stateToken,
    });

    const outcomes = await Promise.all([
      saveReputationReviewSocialLinks(
        db,
        contextFor(actorOneId),
        input(values({ facebookReviewUrl: 'https://facebook.com/yuta' })),
      ),
      saveReputationReviewSocialLinks(
        db,
        contextFor(actorTwoId),
        input(values({ instagramUrl: 'https://instagram.com/yuta' })),
      ),
    ]);

    expect(outcomes.map((outcome) => outcome.kind).sort()).toEqual([
      'conflict',
      'success',
    ]);
    expect(await readQualifiedAudits()).toHaveLength(1);
  });

  it('fails closed for malformed and ambiguous qualified history', async () => {
    await db.insert(reputationAuditEvents).values({
      id: uuidv7(),
      organizationId,
      entityType: 'SETTINGS',
      entityId: settingsId,
      action: REPUTATION_REVIEW_SOCIAL_LINKS_AUDIT_ACTION,
      actorUserId: actorOneId,
      metadata: {
        establishmentId,
        changes: [
          {
            provider: 'GOOGLE',
            previousUrl: null,
            newUrl: 'https://mail.google.com/maps/yuta',
          },
        ],
      },
    });
    await expect(
      readReputationReviewSocialLinks(db, contextFor(actorOneId)),
    ).resolves.toEqual({ kind: 'server_error' });

    await db
      .delete(reputationAuditEvents)
      .where(eq(reputationAuditEvents.organizationId, organizationId));
    const sameInstant = new Date('2026-09-05T12:00:00.000Z');
    await db.insert(reputationAuditEvents).values([
      {
        id: uuidv7(),
        organizationId,
        entityType: 'SETTINGS',
        entityId: settingsId,
        action: REPUTATION_REVIEW_SOCIAL_LINKS_AUDIT_ACTION,
        actorUserId: actorOneId,
        metadata: {
          establishmentId,
          changes: [
            {
              provider: 'GOOGLE',
              previousUrl: null,
              newUrl: 'https://g.page/a',
            },
          ],
        },
        createdAt: sameInstant,
      },
      {
        id: uuidv7(),
        organizationId,
        entityType: 'SETTINGS',
        entityId: settingsId,
        action: REPUTATION_REVIEW_SOCIAL_LINKS_AUDIT_ACTION,
        actorUserId: actorOneId,
        metadata: {
          establishmentId,
          changes: [
            {
              provider: 'GOOGLE',
              previousUrl: 'https://g.page/a',
              newUrl: null,
            },
          ],
        },
        createdAt: sameInstant,
      },
    ]);
    await expect(
      readReputationReviewSocialLinks(db, contextFor(actorOneId)),
    ).resolves.toEqual({ kind: 'server_error' });
  });

  it('keeps state evidence valid after actor FK nullification and permits a later mutation', async () => {
    const transientActorId = uuidv7();
    await db.insert(users).values({
      id: transientActorId,
      authProviderId: `test:${transientActorId}`,
      displayName: 'Transient Review Links Owner',
      email: `transient-${transientActorId}@example.test`,
    });
    const baseline = expectSuccess(
      await readReputationReviewSocialLinks(db, contextFor(transientActorId)),
    );
    const firstInput = {
      expectedValues: baseline.values,
      proposedValues: values({ googleReviewUrl: 'https://g.page/yuta/review' }),
      expectedStateToken: baseline.stateToken,
    };
    const committed = expectModelOutcome(
      await saveReputationReviewSocialLinks(
        db,
        contextFor(transientActorId),
        firstInput,
      ),
      'success',
    );
    await db.delete(users).where(eq(users.id, transientActorId));

    const [auditAfterDeletion] = await readQualifiedAudits();
    expect(auditAfterDeletion?.actorUserId).toBeNull();
    const afterDeletion = expectSuccess(
      await readReputationReviewSocialLinks(db, contextFor(actorOneId)),
    );
    expect(afterDeletion.stateToken).toBe(committed.stateToken);
    await expect(
      saveReputationReviewSocialLinks(
        db,
        contextFor(transientActorId),
        firstInput,
      ),
    ).resolves.toMatchObject({ kind: 'no_change' });

    await expect(
      saveReputationReviewSocialLinks(db, contextFor(actorOneId), {
        expectedValues: committed.values,
        proposedValues: {
          ...committed.values,
          facebookReviewUrl: 'https://facebook.com/yuta',
        },
        expectedStateToken: committed.stateToken,
      }),
    ).resolves.toMatchObject({ kind: 'success' });
    expect(await readQualifiedAudits()).toHaveLength(2);
  });

  it('rolls back both sides when settings update or audit insertion fails', async () => {
    const baseline = expectSuccess(
      await readReputationReviewSocialLinks(db, contextFor(actorOneId)),
    );
    const input = {
      expectedValues: baseline.values,
      proposedValues: values({ googleReviewUrl: 'https://g.page/yuta/review' }),
      expectedStateToken: baseline.stateToken,
    };

    await installSettingsFailureTrigger();
    try {
      await expect(
        saveReputationReviewSocialLinks(db, contextFor(actorOneId), input),
      ).resolves.toEqual({ kind: 'server_error' });
    } finally {
      await removeSettingsFailureTrigger();
    }
    expect((await readSettingsRow()).googleReviewUrl).toBeNull();
    expect(await readQualifiedAudits()).toHaveLength(0);

    await installAuditFailureTrigger();
    try {
      await expect(
        saveReputationReviewSocialLinks(db, contextFor(actorOneId), input),
      ).resolves.toEqual({ kind: 'server_error' });
    } finally {
      await removeAuditFailureTrigger();
    }
    expect((await readSettingsRow()).googleReviewUrl).toBeNull();
    expect(await readQualifiedAudits()).toHaveLength(0);
  });

  async function readSettingsRow() {
    const [row] = await db
      .select()
      .from(reputationSettings)
      .where(
        and(
          eq(reputationSettings.organizationId, organizationId),
          eq(reputationSettings.establishmentId, establishmentId),
        ),
      )
      .limit(1);
    if (!row) throw new Error('Expected test settings row.');
    return row;
  }

  async function readQualifiedAudits() {
    return db
      .select()
      .from(reputationAuditEvents)
      .where(
        and(
          eq(reputationAuditEvents.organizationId, organizationId),
          eq(reputationAuditEvents.entityType, 'SETTINGS'),
          eq(reputationAuditEvents.entityId, settingsId),
          eq(
            reputationAuditEvents.action,
            REPUTATION_REVIEW_SOCIAL_LINKS_AUDIT_ACTION,
          ),
        ),
      );
  }

  async function installSettingsFailureTrigger() {
    await db.execute(
      sql.raw(`
      create or replace function yuta_test_fail_review_links_settings()
      returns trigger language plpgsql as $$
      begin
        raise exception 'synthetic settings failure';
      end;
      $$;
      create trigger yuta_test_fail_review_links_settings_trigger
      before update of google_review_url, facebook_review_url, instagram_url
      on reputation_settings
      for each row execute function yuta_test_fail_review_links_settings();
    `),
    );
  }

  async function removeSettingsFailureTrigger() {
    await db.execute(
      sql.raw(`
      drop trigger if exists yuta_test_fail_review_links_settings_trigger
      on reputation_settings;
      drop function if exists yuta_test_fail_review_links_settings();
    `),
    );
  }

  async function installAuditFailureTrigger() {
    await db.execute(
      sql.raw(`
      create or replace function yuta_test_fail_review_links_audit()
      returns trigger language plpgsql as $$
      begin
        if new.action = '${REPUTATION_REVIEW_SOCIAL_LINKS_AUDIT_ACTION}' then
          raise exception 'synthetic audit failure';
        end if;
        return new;
      end;
      $$;
      create trigger yuta_test_fail_review_links_audit_trigger
      before insert on reputation_audit_events
      for each row execute function yuta_test_fail_review_links_audit();
    `),
    );
  }

  async function removeAuditFailureTrigger() {
    await db.execute(
      sql.raw(`
      drop trigger if exists yuta_test_fail_review_links_audit_trigger
      on reputation_audit_events;
      drop function if exists yuta_test_fail_review_links_audit();
    `),
    );
  }
});

function expectSuccess(
  outcome: Awaited<ReturnType<typeof readReputationReviewSocialLinks>>,
): ReputationReviewSocialLinksReadModel {
  if (outcome.kind !== 'success') {
    throw new Error(`Expected success, received ${outcome.kind}.`);
  }
  return outcome.model;
}

function expectModelOutcome(
  outcome: ReputationReviewSocialLinksOutcome,
  kind: 'success' | 'no_change' | 'conflict',
): ReputationReviewSocialLinksReadModel {
  if (outcome.kind !== kind || !('model' in outcome)) {
    throw new Error(`Expected ${kind}, received ${outcome.kind}.`);
  }
  return outcome.model;
}
