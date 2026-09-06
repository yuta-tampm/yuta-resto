import { createSessionToken, hashPassword, hashSessionToken } from '@yuta/auth';
import { resolveAuthenticatedTenant } from '@yuta/tenant';
import { config } from 'dotenv';
import { and, asc, eq, inArray, sql } from 'drizzle-orm';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import { createAuthRepository } from '../src/auth-repository';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  createMembershipLookup,
  findAuthenticatedTenantMetadata,
} from '../src/tenant-adapters';
import {
  createTenantUserRepository,
  TenantUserError,
} from '../src/tenant-user-repository';
import {
  authAuditEvents,
  authLoginAttempts,
  authSessions,
  establishments,
  organizations,
  tenantMemberships,
  users,
} from '../src/schema';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;
type Repository = ReturnType<typeof createTenantUserRepository>;
type Edit = Parameters<Repository['updateMembership']>[0];
type Attach = Parameters<Repository['createOrAttachUser']>[0];
type Transaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];

integrationTest(
  'establishment owner preservation (disposable PostgreSQL)',
  () => {
    let db: CloudDatabaseClient;
    let writerA: CloudDatabaseClient;
    let writerB: CloudDatabaseClient;
    let coordinator: CloudDatabaseClient;
    let passwordHash: string;
    const password = createSessionToken();
    let org: string;
    let foreignOrg: string;
    let a: string;
    let b: string;
    let c: string;
    let d: string;
    let foreign: string;
    let actorId: string;
    let managerId: string;
    let first: string;
    let second: string;
    let staff: string;
    let firstMembership: string;
    let secondMembership: string;
    let staffMembership: string;
    let userIds: string[];
    let ownerScope: Pick<
      Edit,
      | 'actorUserId'
      | 'actorMembershipId'
      | 'actorRole'
      | 'organizationId'
      | 'allowedEstablishmentIds'
    >;
    let managerScope: typeof ownerScope;

    beforeAll(async () => {
      // Require a loopback, explicitly named disposable database, even with opt-in.
      const target = new URL(process.env.CLOUD_DATABASE_URL!);
      if (
        !['localhost', '127.0.0.1', '[::1]'].includes(target.hostname) ||
        !/^\/yuta_owner_preservation_test(?:_[a-z0-9]+)?$/.test(
          target.pathname,
        ) ||
        process.env.NODE_ENV === 'production'
      ) {
        throw new Error(
          'Unsafe owner-preservation integration database target.',
        );
      }
      db = createCloudDatabaseClient();
      writerA = createCloudDatabaseClient();
      writerB = createCloudDatabaseClient();
      coordinator = createCloudDatabaseClient();
      const [identity] = await db.$client`select current_database() as name`;
      expect(identity?.name).toBe(target.pathname.slice(1));
      passwordHash = await hashPassword(password);
    });

    async function membership(
      userId: string,
      establishmentId: string,
      role: 'OWNER' | 'MANAGER' | 'STAFF',
      status: 'active' | 'suspended' = 'active',
      organizationId = org,
    ) {
      const id = uuidv7();
      await db
        .insert(tenantMemberships)
        .values({ id, userId, organizationId, establishmentId, role, status });
      return id;
    }

    async function authenticatedScope(userId: string) {
      const auth = createAuthRepository(db);
      const signedIn = await auth.signIn({
        email: `${userId}@example.test`,
        password,
        rateLimitKeyHash: hashSessionToken(userId),
        ipHash: null,
        userAgent: 'owner-preservation-test',
      });
      if (signedIn.type !== 'SIGNED_IN')
        throw new Error('Fixture must sign in to one establishment.');
      const session = await auth.findSession(signedIn.token);
      if (!session) throw new Error('Fixture session invalid.');
      const metadata = await findAuthenticatedTenantMetadata(db, session);
      if (!metadata) throw new Error('Fixture tenant metadata missing.');
      const tenant = await resolveAuthenticatedTenant({
        ...session,
        membershipLookup: createMembershipLookup(db),
        tenantMetadata: metadata,
      });
      if (
        tenant.actor.type !== 'user' ||
        (tenant.actor.role !== 'OWNER' && tenant.actor.role !== 'MANAGER') ||
        !tenant.establishmentId
      )
        throw new Error('Fixture management actor invalid.');
      const allowed = await createTenantUserRepository(
        db,
      ).listManageableEstablishments({
        organizationId: tenant.organizationId,
        ...(tenant.actor.role === 'MANAGER'
          ? { establishmentId: tenant.establishmentId }
          : {}),
      });
      return {
        actorUserId: tenant.actor.userId,
        actorMembershipId: tenant.actor.membershipId,
        actorRole: tenant.actor.role,
        organizationId: tenant.organizationId,
        allowedEstablishmentIds: allowed.map((row) => row.id),
      };
    }

    beforeEach(async () => {
      [
        org,
        foreignOrg,
        a,
        b,
        c,
        d,
        foreign,
        actorId,
        managerId,
        first,
        second,
        staff,
      ] = Array.from({ length: 12 }, () => uuidv7()) as [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ];
      userIds = [actorId, managerId, first, second, staff];
      await db.insert(organizations).values(
        [org, foreignOrg].map((id) => ({
          id,
          name: 'Owner preservation test',
          slug: `owner-${id}`,
        })),
      );
      await db.insert(establishments).values(
        [a, b, c, d, foreign].map((id) => ({
          id,
          organizationId: id === foreign ? foreignOrg : org,
          name: `Test ${id}`,
          slug: `owner-${id}`,
        })),
      );
      await db.insert(users).values(
        userIds.map((id) => ({
          id,
          authProviderId: `test:${id}`,
          email: `${id}@example.test`,
          displayName: `Test ${id}`,
          passwordHash,
        })),
      );
      await membership(actorId, a, 'OWNER');
      await membership(managerId, b, 'MANAGER');
      firstMembership = await membership(first, b, 'OWNER');
      secondMembership = await membership(second, b, 'OWNER');
      staffMembership = await membership(staff, b, 'STAFF');
      await membership(second, c, 'OWNER');
      await membership(second, d, 'OWNER');
      await membership(first, foreign, 'OWNER', 'active', foreignOrg);
      ownerScope = await authenticatedScope(actorId);
      managerScope = await authenticatedScope(managerId);
      expect(ownerScope.allowedEstablishmentIds).toContain(b);
      expect(managerScope.allowedEstablishmentIds).toEqual([b]);
      // Target sessions include exact target scope and a scope that must survive.
      await db.insert(authSessions).values(
        [first, second].flatMap((userId) =>
          [b, a].map((establishmentId) => ({
            id: uuidv7(),
            userId,
            organizationId: org,
            establishmentId,
            tokenHash: hashSessionToken(createSessionToken()),
            authVersion: 0,
            expiresAt: new Date(Date.now() + 60_000),
          })),
        ),
      );
      await db
        .delete(authAuditEvents)
        .where(inArray(authAuditEvents.organizationId, [org, foreignOrg]));
    });

    afterEach(async () => {
      if (!db || !org) return;
      await db
        .delete(authAuditEvents)
        .where(inArray(authAuditEvents.organizationId, [org, foreignOrg]));
      await db
        .delete(authSessions)
        .where(inArray(authSessions.organizationId, [org, foreignOrg]));
      await db
        .delete(tenantMemberships)
        .where(inArray(tenantMemberships.organizationId, [org, foreignOrg]));
      await db
        .delete(authLoginAttempts)
        .where(
          inArray(
            authLoginAttempts.keyHash,
            [actorId, managerId].map(hashSessionToken),
          ),
        );
      await db.delete(users).where(inArray(users.id, userIds));
      await db
        .delete(establishments)
        .where(inArray(establishments.organizationId, [org, foreignOrg]));
      await db
        .delete(organizations)
        .where(inArray(organizations.id, [org, foreignOrg]));
    });

    afterAll(async () => {
      await Promise.all(
        [db, writerA, writerB, coordinator].map((client) =>
          client?.$client.end({ timeout: 5 }),
        ),
      );
    });

    function edit(
      membershipId = firstMembership,
      overrides: Partial<Edit> = {},
    ): Edit {
      return {
        ...ownerScope,
        membershipId,
        role: 'STAFF',
        status: 'active',
        ...overrides,
      };
    }
    function attach(userId = first, overrides: Partial<Attach> = {}): Attach {
      return {
        ...ownerScope,
        name: 'Must not replace identity',
        email: `${userId}@example.test`,
        password,
        establishmentIds: [b],
        role: 'STAFF',
        ...overrides,
      };
    }
    async function state() {
      return {
        memberships: await db
          .select()
          .from(tenantMemberships)
          .where(inArray(tenantMemberships.organizationId, [org, foreignOrg]))
          .orderBy(asc(tenantMemberships.id)),
        identities: await db
          .select()
          .from(users)
          .where(inArray(users.id, userIds))
          .orderBy(asc(users.id)),
        sessions: await db
          .select()
          .from(authSessions)
          .where(inArray(authSessions.organizationId, [org, foreignOrg]))
          .orderBy(asc(authSessions.id)),
        audits: await db
          .select()
          .from(authAuditEvents)
          .where(inArray(authAuditEvents.organizationId, [org, foreignOrg]))
          .orderBy(asc(authAuditEvents.id)),
      };
    }
    async function soleOwner() {
      await db
        .update(tenantMemberships)
        .set({ status: 'suspended' })
        .where(
          and(
            eq(tenantMemberships.id, secondMembership),
            eq(tenantMemberships.organizationId, org),
            eq(tenantMemberships.establishmentId, b),
          ),
        );
    }
    async function denied(call: () => Promise<unknown>, code: string) {
      const before = await state();
      await expect(call()).rejects.toMatchObject({ code });
      expect(await state()).toEqual(before);
    }

    it.each([
      ['MANAGER', 'active'],
      ['STAFF', 'active'],
      ['OWNER', 'suspended'],
      ['STAFF', 'suspended'],
    ] as const)(
      'rejects sole OWNER edit to %s/%s; suspended and foreign-scope owners do not count',
      async (role, status) => {
        await soleOwner();
        await denied(
          () =>
            createTenantUserRepository(writerA).updateMembership(
              edit(firstMembership, { role, status }),
            ),
          'LAST_OWNER_REQUIRED',
        );
      },
    );

    it.each(['MANAGER', 'STAFF'] as const)(
      'rejects attachment replacing sole OWNER with %s without duplicate or side effects',
      async (role) => {
        await soleOwner();
        await denied(
          () =>
            createTenantUserRepository(writerA).createOrAttachUser(
              attach(first, { role }),
            ),
          'LAST_OWNER_REQUIRED',
        );
      },
    );

    it('keeps sole OWNER attachment valid and preserves identity and non-requested memberships', async () => {
      await soleOwner();
      const before = await state();
      expect(
        await createTenantUserRepository(writerA).createOrAttachUser(
          attach(first, { role: 'OWNER' }),
        ),
      ).toEqual({ userId: first, created: false });
      const after = await state();
      expect(after.identities).toEqual(before.identities);
      expect(after.sessions).toEqual(before.sessions);
      expect(
        after.memberships.filter((row) => row.id !== firstMembership),
      ).toEqual(before.memberships.filter((row) => row.id !== firstMembership));
      expect(
        after.memberships.find((row) => row.id === firstMembership),
      ).toMatchObject({ role: 'OWNER', status: 'active' });
      expect(after.audits).toHaveLength(1);
    });

    it.each(['demote', 'suspend'] as const)(
      'allows %s with another active OWNER and revokes only exact scoped sessions',
      async (mode) => {
        const before = await state();
        const request = edit(
          firstMembership,
          mode === 'suspend' ? { role: 'OWNER', status: 'suspended' } : {},
        );
        await createTenantUserRepository(writerA).updateMembership(request);
        const after = await state();
        expect(
          after.memberships.find((row) => row.id === firstMembership),
        ).toMatchObject({ role: request.role, status: request.status });
        expect(
          after.memberships.filter((row) => row.id !== firstMembership),
        ).toEqual(
          before.memberships.filter((row) => row.id !== firstMembership),
        );
        for (const session of after.sessions) {
          if (
            mode === 'suspend' &&
            session.userId === first &&
            session.establishmentId === b
          )
            expect(session.revokedAt).toBeInstanceOf(Date);
          else
            expect(session).toEqual(
              before.sessions.find((row) => row.id === session.id),
            );
        }
        expect(after.audits).toHaveLength(1);
        expect(after.audits[0]).toMatchObject({
          event: 'tenant.membership.updated',
          subjectUserId: first,
          establishmentId: b,
          metadata: {
            previousRole: 'OWNER',
            previousStatus: 'active',
            role: request.role,
            status: request.status,
          },
        });
      },
    );

    it('supports existing-user upsert, new membership and suspended reactivation without replacing identity', async () => {
      await db
        .update(tenantMemberships)
        .set({ status: 'suspended' })
        .where(eq(tenantMemberships.id, staffMembership));
      const before = await state();
      await createTenantUserRepository(writerA).createOrAttachUser(
        attach(staff, { establishmentIds: [c, b] }),
      );
      const after = await state();
      expect(after.identities).toEqual(before.identities);
      expect(after.memberships.filter((row) => row.userId !== staff)).toEqual(
        before.memberships.filter((row) => row.userId !== staff),
      );
      expect(after.memberships.filter((row) => row.userId === staff)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: staffMembership,
            establishmentId: b,
            role: 'STAFF',
            status: 'active',
          }),
          expect.objectContaining({
            establishmentId: c,
            role: 'STAFF',
            status: 'active',
          }),
        ]),
      );
      expect(after.audits).toHaveLength(1);
    });

    it('preserves new-user creation and existing inactive/self/role/scope denial contracts', async () => {
      const repository = createTenantUserRepository(writerA);
      await denied(
        () => repository.updateMembership(edit(ownerScope.actorMembershipId)),
        'CURRENT_MEMBERSHIP_LOCKED',
      );
      await denied(
        () => repository.createOrAttachUser(attach(actorId)),
        'CURRENT_MEMBERSHIP_LOCKED',
      );
      await db
        .update(users)
        .set({ status: 'DISABLED' })
        .where(eq(users.id, staff));
      await denied(
        () => repository.createOrAttachUser(attach(staff)),
        'USER_INACTIVE',
      );
      await db
        .update(users)
        .set({ status: 'ACTIVE' })
        .where(eq(users.id, staff));
      for (const role of ['OWNER', 'MANAGER'] as const) {
        await denied(
          () =>
            repository.updateMembership(
              edit(staffMembership, { ...managerScope, role }),
            ),
          'ROLE_NOT_ALLOWED',
        );
        await denied(
          () =>
            repository.createOrAttachUser(
              attach(staff, { ...managerScope, role }),
            ),
          'ROLE_NOT_ALLOWED',
        );
      }
      await denied(
        () => repository.updateMembership(edit(firstMembership, managerScope)),
        'ROLE_NOT_ALLOWED',
      );
      await denied(
        () => repository.createOrAttachUser(attach(first, managerScope)),
        'ROLE_NOT_ALLOWED',
      );
      for (const establishmentIds of [[], [b, b], [foreign], [a]]) {
        await denied(
          () =>
            repository.createOrAttachUser(
              attach(staff, { ...managerScope, establishmentIds }),
            ),
          'ESTABLISHMENT_NOT_ALLOWED',
        );
      }
      await denied(
        () =>
          repository.updateMembership(
            edit(firstMembership, { allowedEstablishmentIds: [a] }),
          ),
        'MEMBERSHIP_NOT_FOUND',
      );
      await denied(
        () =>
          repository.updateMembership(
            edit(firstMembership, { organizationId: foreignOrg }),
          ),
        'MEMBERSHIP_NOT_FOUND',
      );
      await denied(
        () =>
          repository.createOrAttachUser(
            attach(staff, {
              establishmentIds: [foreign],
              allowedEstablishmentIds: [foreign],
            }),
          ),
        'ESTABLISHMENT_NOT_ALLOWED',
      );
      await repository.updateMembership(edit(staffMembership, managerScope));
      await repository.createOrAttachUser(attach(staff, managerScope));
      const newEmail = `${uuidv7()}@example.test`;
      const result = await repository.createOrAttachUser({
        ...attach(),
        email: newEmail,
        establishmentIds: [a, c],
      });
      userIds.push(result.userId);
      expect(result.created).toBe(true);
      const after = await state();
      expect(
        after.memberships.filter((row) => row.userId === result.userId),
      ).toHaveLength(2);
      expect(
        after.identities.find((row) => row.id === result.userId)?.passwordHash,
      ).toBeTruthy();
    });

    it('counts active OWNER memberships without a global usability predicate and preserves conservative suspended-OWNER edit guard', async () => {
      await db
        .update(users)
        .set({ status: 'DISABLED' })
        .where(eq(users.id, second));
      await createTenantUserRepository(writerA).updateMembership(edit());
      await db
        .update(tenantMemberships)
        .set({ status: 'suspended' })
        .where(eq(tenantMemberships.id, secondMembership));
      await denied(
        () =>
          createTenantUserRepository(writerA).updateMembership(
            edit(secondMembership),
          ),
        'LAST_OWNER_REQUIRED',
      );
      await db
        .update(users)
        .set({ status: 'ACTIVE' })
        .where(eq(users.id, second));
      await createTenantUserRepository(writerA).createOrAttachUser(
        attach(second, { role: 'OWNER' }),
      );
    });

    // Only observed database blocking is synchronization evidence; polling is bounded.
    async function waitForParentWaiters(blocker: number, count: number) {
      const deadline = Date.now() + 8_000;
      while (Date.now() < deadline) {
        const rows = await db.$client<
          { pid: number; query: string; blockers: number[] }[]
        >`
        select pid, query, pg_blocking_pids(pid) as blockers
        from pg_stat_activity where datname = current_database() and wait_event_type = 'Lock'`;
        const reachesBarrier = (
          pid: number,
          seen = new Set<number>(),
        ): boolean => {
          if (pid === blocker) return true;
          if (seen.has(pid)) return false;
          seen.add(pid);
          return (
            rows
              .find((row) => row.pid === pid)
              ?.blockers.some((parent) => reachesBarrier(parent, seen)) ?? false
          );
        };
        const waiters = rows.filter(
          (row) =>
            /from "establishments"/i.test(row.query) &&
            /for no key update/i.test(row.query) &&
            reachesBarrier(row.pid),
        );
        if (waiters.length === count) {
          expect(new Set(waiters.map((row) => row.pid)).size).toBe(count);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      throw new Error(
        'Controlled concurrency barrier timeout: expected parent-lock waiters not observed.',
      );
    }

    async function withBarrier(
      run: (
        pid: number,
        release: () => Promise<void>,
        connection: Awaited<
          ReturnType<CloudDatabaseClient['$client']['reserve']>
        >,
      ) => Promise<void>,
    ) {
      const connection = await coordinator.$client.reserve();
      let released = false;
      const release = async () => {
        if (!released) {
          await connection`commit`;
          released = true;
        }
      };
      try {
        await connection`begin`;
        const [backend] = await connection<
          { pid: number }[]
        >`select pg_backend_pid() as pid`;
        await connection`select id from establishments where organization_id = ${org} and id = ${b} for no key update`;
        await run(backend!.pid, release, connection);
      } finally {
        await release();
        connection.release();
      }
    }

    it.each([
      'owner-count',
      'manager-edit',
      'manager-attach',
      'moved-scope',
    ] as const)(
      'revalidates fresh post-lock target state: %s',
      async (mode) => {
        await soleOwner();
        await db
          .update(tenantMemberships)
          .set({ role: 'STAFF' })
          .where(eq(tenantMemberships.id, firstMembership));
        let outcome: PromiseSettledResult<unknown> | undefined;
        let committedBefore: Awaited<ReturnType<typeof state>> | undefined;
        await withBarrier(async (pid, release, connection) => {
          const repository = createTenantUserRepository(writerA);
          const request =
            mode === 'manager-attach'
              ? repository.createOrAttachUser(attach(first, managerScope))
              : repository.updateMembership(
                  edit(
                    firstMembership,
                    mode === 'manager-edit' ? managerScope : {},
                  ),
                );
          const settled = Promise.allSettled([request]);
          try {
            await waitForParentWaiters(pid, 1);
            if (mode === 'moved-scope')
              await connection`update tenant_memberships set establishment_id = ${c} where id = ${firstMembership} and organization_id = ${org} and establishment_id = ${b}`;
            else
              await connection`update tenant_memberships set role = 'OWNER' where id = ${firstMembership} and organization_id = ${org} and establishment_id = ${b}`;
          } finally {
            await release();
            [outcome] = await settled;
          }
          committedBefore = await state();
        });
        expect(outcome?.status).toBe('rejected');
        if (outcome?.status !== 'rejected')
          throw new Error('Fresh target guard was bypassed.');
        expect(outcome.reason).toMatchObject({
          code:
            mode === 'moved-scope'
              ? 'MEMBERSHIP_NOT_FOUND'
              : mode.startsWith('manager')
                ? 'ROLE_NOT_ALLOWED'
                : 'LAST_OWNER_REQUIRED',
        });
        expect(committedBefore?.audits).toHaveLength(0);
        expect(
          committedBefore?.sessions.every((row) => row.revokedAt === null),
        ).toBe(true);
        expect(
          committedBefore?.memberships.find(
            (row) => row.id === firstMembership,
          ),
        ).toMatchObject(
          mode === 'moved-scope'
            ? { establishmentId: c, role: 'STAFF' }
            : { establishmentId: b, role: 'OWNER' },
        );
      },
    );

    async function concurrentPair(
      kinds: readonly ['edit' | 'attach', 'edit' | 'attach'],
      batch = false,
    ) {
      let outcomes: PromiseSettledResult<unknown>[] = [];
      await withBarrier(async (pid, release) => {
        const requests = [writerA, writerB].map((client, index) => {
          const repository = createTenantUserRepository(client);
          return kinds[index] === 'edit'
            ? repository.updateMembership(
                edit(index === 0 ? firstMembership : secondMembership, {
                  role: 'OWNER',
                  status: 'suspended',
                }),
              )
            : repository.createOrAttachUser(
                attach(index === 0 ? first : second, {
                  establishmentIds: batch
                    ? index === 0
                      ? [c, b]
                      : [b, d, c]
                    : [b],
                }),
              );
        });
        const settled = Promise.allSettled(requests);
        try {
          await waitForParentWaiters(pid, 2);
        } finally {
          await release();
          outcomes = await settled;
        }
      });
      expect(
        outcomes.filter((result) => result.status === 'fulfilled'),
      ).toHaveLength(1);
      const loser = outcomes.findIndex(
        (result) => result.status === 'rejected',
      );
      const failed = outcomes[loser];
      if (failed?.status !== 'rejected')
        throw new Error('Expected exactly one invariant loser.');
      expect(failed.reason).toBeInstanceOf(TenantUserError);
      expect(failed.reason).toMatchObject({ code: 'LAST_OWNER_REQUIRED' });
      const after = await state();
      const owners = after.memberships.filter(
        (row) =>
          row.establishmentId === b &&
          row.role === 'OWNER' &&
          row.status === 'active',
      );
      expect(owners).toHaveLength(1);
      expect(owners[0]?.userId).toBe(loser === 0 ? first : second);
      const winner = 1 - loser;
      expect(
        after.memberships.find(
          (row) =>
            row.id === (winner === 0 ? firstMembership : secondMembership),
        ),
      ).toMatchObject(
        kinds[winner] === 'edit'
          ? { role: 'OWNER', status: 'suspended' }
          : { role: 'STAFF', status: 'active' },
      );
      expect(after.audits).toHaveLength(1);
      expect(after.audits[0]?.subjectUserId).toBe(
        winner === 0 ? first : second,
      );
      for (const session of after.sessions.filter((row) =>
        [first, second].includes(row.userId),
      )) {
        const shouldRevoke =
          kinds[winner] === 'edit' &&
          session.userId === (winner === 0 ? first : second) &&
          session.establishmentId === b;
        if (shouldRevoke) expect(session.revokedAt).toBeInstanceOf(Date);
        else expect(session.revokedAt).toBeNull();
      }
      return { loser, after };
    }

    it.each([
      ['edit', 'edit'],
      ['edit', 'attach'],
      ['attach', 'attach'],
    ] as const)(
      'serializes %s–%s with two observed waiters and exactly one winner',
      async (left, right) => {
        await concurrentPair([left, right]);
      },
    );

    it('preserves sequential first-success/second-LAST_OWNER_REQUIRED behavior', async () => {
      await createTenantUserRepository(writerA).updateMembership(edit());
      await denied(
        () =>
          createTenantUserRepository(writerB).updateMembership(
            edit(secondMembership),
          ),
        'LAST_OWNER_REQUIRED',
      );
    });

    it.each([false, true])(
      'rolls back every attachment target when one violates the invariant (reverse=%s)',
      async (reverse) => {
        await soleOwner();
        const ids = [c, b];
        await denied(
          () =>
            createTenantUserRepository(writerA).createOrAttachUser(
              attach(first, {
                establishmentIds: reverse ? ids.reverse() : ids,
              }),
            ),
          'LAST_OWNER_REQUIRED',
        );
      },
    );

    it('orders opposite-order overlapping batches and rolls back the losing batch private targets', async () => {
      // Both targets may independently change c; neither may remove c's last owner.
      await membership(staff, c, 'OWNER');
      await membership(staff, d, 'OWNER');
      const before = await state();
      const { loser, after } = await concurrentPair(['attach', 'attach'], true);
      const loserId = loser === 0 ? first : second;
      expect(after.memberships.filter((row) => row.userId === loserId)).toEqual(
        before.memberships.filter((row) => row.userId === loserId),
      );
    });

    it('does not serialize disjoint establishments at organization scope', async () => {
      await withBarrier(async (pid, release) => {
        const pending =
          createTenantUserRepository(writerA).updateMembership(edit());
        const settled = Promise.allSettled([pending]);
        try {
          await waitForParentWaiters(pid, 1);
          await createTenantUserRepository(writerB).createOrAttachUser(
            attach(staff, { establishmentIds: [c] }),
          );
          expect((await state()).audits).toHaveLength(1);
        } finally {
          await release();
          await settled;
        }
      });
      expect((await state()).audits).toHaveLength(2);
    });

    it.each(['edit', 'attach', 'new-user'] as const)(
      'rolls back real %s writes on audit failure, propagates once, and releases locks',
      async (mode) => {
        let calls = 0;
        const fault = new Error('Injected audit failure after real writes');
        const proxy = new Proxy(writerA, {
          get(target, property, receiver) {
            if (property !== 'transaction')
              return Reflect.get(target, property, receiver);
            return <T>(
              callback: (transaction: Transaction) => Promise<T>,
              options: Parameters<CloudDatabaseClient['transaction']>[1],
            ) =>
              target.transaction(async (transaction) => {
                expect(options).toEqual({ isolationLevel: 'read committed' });
                const [isolation] = await transaction.execute(
                  sql`show transaction_isolation`,
                );
                expect(isolation?.transaction_isolation).toBe('read committed');
                const wrapped = new Proxy(transaction, {
                  get(tx, key, txReceiver) {
                    if (key !== 'insert')
                      return Reflect.get(tx, key, txReceiver);
                    return (...args: Parameters<Transaction['insert']>) => {
                      if (args[0] === authAuditEvents) {
                        calls += 1;
                        throw fault;
                      }
                      return tx.insert(...args);
                    };
                  },
                });
                return callback(wrapped);
              }, options);
          },
        });
        const before = await state();
        const newEmail = `${uuidv7()}@example.test`;
        const request = attach(first, {
          establishmentIds: [b, c],
          ...(mode === 'new-user' ? { email: newEmail } : {}),
        });
        const repository = createTenantUserRepository(proxy);
        await expect(
          mode === 'edit'
            ? repository.updateMembership(
                edit(firstMembership, { role: 'OWNER', status: 'suspended' }),
              )
            : repository.createOrAttachUser(request),
        ).rejects.toBe(fault);
        expect(calls).toBe(1);
        expect(await state()).toEqual(before);
        expect(
          await db.select().from(users).where(eq(users.email, newEmail)),
        ).toHaveLength(0);
        if (mode === 'edit')
          await createTenantUserRepository(writerB).updateMembership(
            edit(firstMembership, { role: 'OWNER', status: 'suspended' }),
          );
        else {
          const result =
            await createTenantUserRepository(writerB).createOrAttachUser(
              request,
            );
          if (result.created) userIds.push(result.userId);
        }
        expect((await state()).audits).toHaveLength(1);
      },
    );
  },
);
