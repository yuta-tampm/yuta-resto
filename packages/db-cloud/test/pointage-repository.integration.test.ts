import { config } from 'dotenv';
import { and, eq, isNull } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7, version as uuidVersion } from 'uuid';
import {
  PointageCredentialAlreadyExistsError,
  PointageCredentialCollisionExhaustedError,
  PointageCredentialMissingError,
  PointageDossierNotInScopeError,
  createPointageRepository,
  type PointageCredentialMaterial,
} from '../src/pointage-repository';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  establishments,
  organizations,
  personnelEmployeeDossiers,
  pointageCredentialRateLimits,
  pointageEmployeeCredentials,
  pointageSecurityAuditEvents,
  users,
} from '../src/schema';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('Pointage repository on disposable PostgreSQL', () => {
  let db: CloudDatabaseClient;
  let writerA: CloudDatabaseClient;
  let writerB: CloudDatabaseClient;
  const organizationId = uuidv7();
  const foreignOrganizationId = uuidv7();
  const establishmentId = uuidv7();
  const siblingEstablishmentId = uuidv7();
  const foreignEstablishmentId = uuidv7();
  const managerUserId = uuidv7();
  const dossierId = uuidv7();
  const collisionDossierId = uuidv7();
  const concurrentDossierId = uuidv7();
  const rollbackDossierId = uuidv7();
  const mixedConcurrencyDossierId = uuidv7();
  const exhaustedDossierId = uuidv7();
  const scope = { organizationId, establishmentId };

  beforeAll(async () => {
    const target = new URL(process.env.CLOUD_DATABASE_URL!);
    if (
      !['localhost', '127.0.0.1', '[::1]'].includes(target.hostname) ||
      !/^\/yuta_pointage_foundation_test(?:_[a-z0-9]+)?$/u.test(
        target.pathname,
      ) ||
      process.env.NODE_ENV === 'production'
    ) {
      throw new Error('Unsafe Pointage integration database target.');
    }
    db = createCloudDatabaseClient(process.env);
    writerA = createCloudDatabaseClient(process.env);
    writerB = createCloudDatabaseClient(process.env);
    const [identity] = await db.$client`select current_database() as name`;
    expect(identity?.name).toBe(target.pathname.slice(1));

    await db.insert(organizations).values([
      {
        id: organizationId,
        name: 'Pointage Org',
        slug: `pointage-${organizationId}`,
      },
      {
        id: foreignOrganizationId,
        name: 'Foreign Org',
        slug: `foreign-${foreignOrganizationId}`,
      },
    ]);
    await db.insert(establishments).values([
      {
        id: establishmentId,
        organizationId,
        name: 'Pointage Establishment',
        slug: `pointage-${establishmentId}`,
      },
      {
        id: siblingEstablishmentId,
        organizationId,
        name: 'Sibling Establishment',
        slug: `pointage-${siblingEstablishmentId}`,
      },
      {
        id: foreignEstablishmentId,
        organizationId: foreignOrganizationId,
        name: 'Foreign Establishment',
        slug: `pointage-${foreignEstablishmentId}`,
      },
    ]);
    await db.insert(users).values({
      id: managerUserId,
      authProviderId: `pointage:${managerUserId}`,
      email: `pointage-${managerUserId}@example.test`,
    });
    await db.insert(personnelEmployeeDossiers).values(
      [
        dossierId,
        collisionDossierId,
        concurrentDossierId,
        rollbackDossierId,
        mixedConcurrencyDossierId,
        exhaustedDossierId,
      ].map((id, index) => ({
        id,
        organizationId,
        establishmentId,
        givenNames: `Employee ${index}`,
        familyName: 'Pointage',
        position: 'Crew',
        qualification: 'Employee',
        employmentTermType: 'indefinite' as const,
        workTimeCategory: 'full_time' as const,
        entryDate: '2026-01-01',
      })),
    );
  });

  afterAll(async () => {
    if (!db) return;
    await db
      .delete(pointageSecurityAuditEvents)
      .where(eq(pointageSecurityAuditEvents.organizationId, organizationId));
    await db
      .delete(pointageCredentialRateLimits)
      .where(eq(pointageCredentialRateLimits.organizationId, organizationId));
    await db
      .delete(pointageEmployeeCredentials)
      .where(eq(pointageEmployeeCredentials.organizationId, organizationId));
    await db
      .delete(personnelEmployeeDossiers)
      .where(eq(personnelEmployeeDossiers.organizationId, organizationId));
    await db.delete(users).where(eq(users.id, managerUserId));
    await db
      .delete(establishments)
      .where(eq(establishments.organizationId, organizationId));
    await db
      .delete(establishments)
      .where(eq(establishments.organizationId, foreignOrganizationId));
    await db.delete(organizations).where(eq(organizations.id, organizationId));
    await db
      .delete(organizations)
      .where(eq(organizations.id, foreignOrganizationId));
    await Promise.all([
      db.$client.end({ timeout: 5 }),
      writerA.$client.end({ timeout: 5 }),
      writerB.$client.end({ timeout: 5 }),
    ]);
  });

  function material(digestCharacter: string): PointageCredentialMaterial {
    return {
      lookupDigest: digestCharacter.repeat(64),
      credentialFormatVersion: 1,
      algorithmVersion: 'scrypt-v1',
      keyVersion: 1,
      salt: Buffer.alloc(16, 1).toString('base64'),
      verifier: Buffer.alloc(32, 2).toString('base64'),
    };
  }

  it('resolves only active server-owned establishment scope', async () => {
    const repository = createPointageRepository(db);
    await expect(
      repository.resolveActiveEntryScope(
        `POINTAGE-${establishmentId}`.toLowerCase(),
      ),
    ).resolves.toMatchObject(scope);
    await expect(
      repository.resolveActiveEntryScope('unknown'),
    ).resolves.toBeNull();
    await db
      .update(establishments)
      .set({ status: 'disabled' })
      .where(eq(establishments.id, siblingEstablishmentId));
    await expect(
      repository.resolveActiveEntryScope(
        `pointage-${siblingEstablishmentId}`.toLowerCase(),
      ),
    ).resolves.toBeNull();
    await db
      .update(establishments)
      .set({ status: 'active' })
      .where(eq(establishments.id, siblingEstablishmentId));
    await db
      .update(organizations)
      .set({ status: 'disabled' })
      .where(eq(organizations.id, foreignOrganizationId));
    await expect(
      repository.resolveActiveEntryScope(
        `pointage-${foreignEstablishmentId}`.toLowerCase(),
      ),
    ).resolves.toBeNull();
    await db
      .update(organizations)
      .set({ status: 'active' })
      .where(eq(organizations.id, foreignOrganizationId));
  });

  it('issues and resets atomically with historical non-reuse and scoped reads', async () => {
    const repository = createPointageRepository(db);
    const issuedAt = new Date('2026-09-01T12:00:00Z');
    const issued = await repository.issueCredential({
      scope,
      personnelDossierId: dossierId,
      managerUserId,
      now: issuedAt,
      createMaterial: async () => material('a'),
    });
    expect(issued.credentialVersion).toBe(1);
    expect(uuidVersion(issued.credentialId)).toBe(7);
    await expect(
      repository.findCredentialCandidate(scope, 'a'.repeat(64)),
    ).resolves.toMatchObject({ id: issued.credentialId, supersededAt: null });
    await expect(
      repository.findCredentialCandidate(
        { organizationId, establishmentId: siblingEstablishmentId },
        'a'.repeat(64),
      ),
    ).resolves.toBeNull();
    await expect(
      repository.findCredentialCandidate(
        {
          organizationId: foreignOrganizationId,
          establishmentId: foreignEstablishmentId,
        },
        'a'.repeat(64),
      ),
    ).resolves.toBeNull();

    const reset = await repository.resetCredential({
      scope,
      personnelDossierId: dossierId,
      managerUserId,
      now: new Date('2026-09-02T12:00:00Z'),
      createMaterial: async () => material('b'),
    });
    expect(reset).toMatchObject({
      credentialVersion: 2,
      supersededCredentialId: issued.credentialId,
    });
    const [oldRow, newRow] = await Promise.all([
      repository.findCredentialCandidate(scope, 'a'.repeat(64)),
      repository.findCredentialCandidate(scope, 'b'.repeat(64)),
    ]);
    expect(oldRow?.supersededAt).not.toBeNull();
    expect(newRow?.supersededAt).toBeNull();
    const activeRows = await db
      .select()
      .from(pointageEmployeeCredentials)
      .where(
        and(
          eq(pointageEmployeeCredentials.organizationId, organizationId),
          eq(pointageEmployeeCredentials.establishmentId, establishmentId),
          eq(pointageEmployeeCredentials.personnelDossierId, dossierId),
          isNull(pointageEmployeeCredentials.supersededAt),
        ),
      );
    expect(activeRows).toHaveLength(1);
    expect(activeRows[0]).not.toHaveProperty('credential');
    const audits = await db
      .select()
      .from(pointageSecurityAuditEvents)
      .where(eq(pointageSecurityAuditEvents.personnelDossierId, dossierId));
    expect(audits.map((audit) => audit.eventType).sort()).toEqual([
      'pointage.credential.issued',
      'pointage.credential.reset',
      'pointage.credential.superseded',
    ]);
    expect(audits.every((audit) => uuidVersion(audit.id) === 7)).toBe(true);
  });

  it('retries a scoped historical digest collision without partial audit', async () => {
    const repository = createPointageRepository(db);
    let attempts = 0;
    const result = await repository.issueCredential({
      scope,
      personnelDossierId: collisionDossierId,
      managerUserId,
      now: new Date('2026-09-03T12:00:00Z'),
      createMaterial: async () => {
        attempts += 1;
        return material(attempts === 1 ? 'a' : 'c');
      },
    });
    expect(attempts).toBe(2);
    expect(result.credentialVersion).toBe(1);
    const audits = await db
      .select()
      .from(pointageSecurityAuditEvents)
      .where(
        eq(pointageSecurityAuditEvents.personnelDossierId, collisionDossierId),
      );
    expect(audits).toHaveLength(1);
  });

  it('serializes concurrent issue decisions to one current credential', async () => {
    const repositoryA = createPointageRepository(writerA);
    const repositoryB = createPointageRepository(writerB);
    const settled = await Promise.allSettled([
      repositoryA.issueCredential({
        scope,
        personnelDossierId: concurrentDossierId,
        managerUserId,
        now: new Date('2026-09-04T12:00:00Z'),
        createMaterial: async () => material('d'),
      }),
      repositoryB.issueCredential({
        scope,
        personnelDossierId: concurrentDossierId,
        managerUserId,
        now: new Date('2026-09-04T12:00:01Z'),
        createMaterial: async () => material('e'),
      }),
    ]);
    expect(
      settled.filter((result) => result.status === 'fulfilled'),
    ).toHaveLength(1);
    const rejected = settled.find((result) => result.status === 'rejected');
    expect(rejected).toMatchObject({
      status: 'rejected',
      reason: expect.any(PointageCredentialAlreadyExistsError),
    });
    const activeRows = await db
      .select()
      .from(pointageEmployeeCredentials)
      .where(
        and(
          eq(
            pointageEmployeeCredentials.personnelDossierId,
            concurrentDossierId,
          ),
          isNull(pointageEmployeeCredentials.supersededAt),
        ),
      );
    expect(activeRows).toHaveLength(1);
  });

  it('serializes issue-reset and reset-reset races with one monotonic current version', async () => {
    const repository = createPointageRepository(db);
    await repository.issueCredential({
      scope,
      personnelDossierId: mixedConcurrencyDossierId,
      managerUserId,
      now: new Date('2026-09-04T13:00:00Z'),
      createMaterial: async () => material('3'),
    });
    const repositoryA = createPointageRepository(writerA);
    const repositoryB = createPointageRepository(writerB);
    const mixed = await Promise.allSettled([
      repositoryA.issueCredential({
        scope,
        personnelDossierId: mixedConcurrencyDossierId,
        managerUserId,
        now: new Date('2026-09-04T13:00:01Z'),
        createMaterial: async () => material('4'),
      }),
      repositoryB.resetCredential({
        scope,
        personnelDossierId: mixedConcurrencyDossierId,
        managerUserId,
        now: new Date('2026-09-04T13:00:02Z'),
        createMaterial: async () => material('4'),
      }),
    ]);
    expect(
      mixed.filter((result) => result.status === 'fulfilled'),
    ).toHaveLength(1);
    expect(mixed.find((result) => result.status === 'rejected')).toMatchObject({
      reason: expect.any(PointageCredentialAlreadyExistsError),
    });

    const resets = await Promise.all([
      repositoryA.resetCredential({
        scope,
        personnelDossierId: mixedConcurrencyDossierId,
        managerUserId,
        now: new Date('2026-09-04T13:00:03Z'),
        createMaterial: async (version) => material(version === 3 ? '5' : '6'),
      }),
      repositoryB.resetCredential({
        scope,
        personnelDossierId: mixedConcurrencyDossierId,
        managerUserId,
        now: new Date('2026-09-04T13:00:04Z'),
        createMaterial: async (version) => material(version === 3 ? '5' : '6'),
      }),
    ]);
    expect(resets.map((result) => result.credentialVersion).sort()).toEqual([
      3, 4,
    ]);
    const activeRows = await db
      .select({
        credentialVersion: pointageEmployeeCredentials.credentialVersion,
      })
      .from(pointageEmployeeCredentials)
      .where(
        and(
          eq(
            pointageEmployeeCredentials.personnelDossierId,
            mixedConcurrencyDossierId,
          ),
          isNull(pointageEmployeeCredentials.supersededAt),
        ),
      );
    expect(activeRows).toEqual([{ credentialVersion: 4 }]);
  });

  it('bounds historical collision retries at ten with no credential or audit effect', async () => {
    const repository = createPointageRepository(db);
    let attempts = 0;
    await expect(
      repository.issueCredential({
        scope,
        personnelDossierId: exhaustedDossierId,
        managerUserId,
        now: new Date('2026-09-04T14:00:00Z'),
        createMaterial: async () => {
          attempts += 1;
          return material('a');
        },
      }),
    ).rejects.toBeInstanceOf(PointageCredentialCollisionExhaustedError);
    expect(attempts).toBe(10);
    const [credentials, audits] = await Promise.all([
      db
        .select()
        .from(pointageEmployeeCredentials)
        .where(
          eq(
            pointageEmployeeCredentials.personnelDossierId,
            exhaustedDossierId,
          ),
        ),
      db
        .select()
        .from(pointageSecurityAuditEvents)
        .where(
          eq(
            pointageSecurityAuditEvents.personnelDossierId,
            exhaustedDossierId,
          ),
        ),
    ]);
    expect(credentials).toEqual([]);
    expect(audits).toEqual([]);
  });

  it('rolls back credential state when a required actor foreign key fails', async () => {
    const repository = createPointageRepository(db);
    await expect(
      repository.issueCredential({
        scope: { organizationId, establishmentId: siblingEstablishmentId },
        personnelDossierId: rollbackDossierId,
        managerUserId,
        now: new Date('2026-09-05T10:00:00Z'),
        createMaterial: async () => material('7'),
      }),
    ).rejects.toBeInstanceOf(PointageDossierNotInScopeError);
    await expect(
      repository.resetCredential({
        scope,
        personnelDossierId: rollbackDossierId,
        managerUserId,
        now: new Date('2026-09-05T11:00:00Z'),
        createMaterial: async () => material('7'),
      }),
    ).rejects.toBeInstanceOf(PointageCredentialMissingError);
    await expect(
      repository.issueCredential({
        scope,
        personnelDossierId: rollbackDossierId,
        managerUserId: uuidv7(),
        now: new Date('2026-09-05T12:00:00Z'),
        createMaterial: async () => material('f'),
      }),
    ).rejects.toThrow();
    const rows = await db
      .select()
      .from(pointageEmployeeCredentials)
      .where(
        eq(pointageEmployeeCredentials.personnelDossierId, rollbackDossierId),
      );
    expect(rows).toHaveLength(0);
  });

  it('enforces atomic candidate/client failure thresholds and candidate-only success reset', async () => {
    const repository = createPointageRepository(db);
    const now = new Date('2026-09-06T12:00:00Z');
    const candidateDigest = '1'.repeat(64);
    const clientDigest = '2'.repeat(64);
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await expect(
        repository.recordRateLimitFailure({
          scope,
          keyKind: 'candidate',
          keyDigest: candidateDigest,
          now: new Date(now.getTime() + attempt),
          windowMs: 900_000,
          failureLimit: 5,
          blockMs: 900_000,
        }),
      ).resolves.toEqual({ blocked: attempt === 5, failureCount: attempt });
    }
    await expect(
      repository.isRateLimitBlocked(scope, 'candidate', candidateDigest, now),
    ).resolves.toBe(true);
    await repository.recordRateLimitFailure({
      scope,
      keyKind: 'client',
      keyDigest: clientDigest,
      now,
      windowMs: 900_000,
      failureLimit: 30,
      blockMs: 900_000,
    });
    for (let attempt = 2; attempt <= 30; attempt += 1) {
      const result = await repository.recordRateLimitFailure({
        scope,
        keyKind: 'client',
        keyDigest: clientDigest,
        now: new Date(now.getTime() + attempt),
        windowMs: 900_000,
        failureLimit: 30,
        blockMs: 900_000,
      });
      expect(result).toEqual({
        blocked: attempt === 30,
        failureCount: attempt,
      });
    }
    await repository.resetCandidateRateLimit(scope, candidateDigest, now);
    await expect(
      repository.isRateLimitBlocked(scope, 'candidate', candidateDigest, now),
    ).resolves.toBe(false);
    const [clientRow] = await db
      .select()
      .from(pointageCredentialRateLimits)
      .where(eq(pointageCredentialRateLimits.keyDigest, clientDigest));
    expect(clientRow?.failureCount).toBe(30);
  });
});
