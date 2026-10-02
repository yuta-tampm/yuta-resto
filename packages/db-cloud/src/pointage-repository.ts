import { and, eq, isNull, sql } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import type { CloudDatabaseClient } from './client';
import {
  establishments,
  organizations,
  personnelEmployeeDossiers,
  pointageCredentialRateLimits,
  pointageEmployeeCredentials,
  pointageSecurityAuditEvents,
} from './schema';

export type PointageRepositoryScope = Readonly<{
  organizationId: string;
  establishmentId: string;
}>;

export type PointageEntryScopeRecord = PointageRepositoryScope &
  Readonly<{ locale: string; timezone: string }>;

export type PointageCredentialMaterial = Readonly<{
  lookupDigest: string;
  credentialFormatVersion: number;
  algorithmVersion: string;
  keyVersion: number;
  salt: string;
  verifier: string;
}>;

export type PointageCredentialCandidate = Readonly<{
  id: string;
  personnelDossierId: string;
  credentialVersion: number;
  credentialFormatVersion: number;
  algorithmVersion: string;
  keyVersion: number;
  salt: string;
  verifier: string;
  supersededAt: Date | null;
}>;

export type PointagePersonnelEmploymentPeriod = Readonly<{
  personnelDossierId: string;
  entryDate: string;
  departureDate: string | null;
}>;

export type PointageAuditEventType =
  | 'pointage.credential.issued'
  | 'pointage.credential.reset'
  | 'pointage.credential.superseded'
  | 'pointage.credential.authentication_succeeded'
  | 'pointage.credential.authentication_denied'
  | 'pointage.credential.rate_limited'
  | 'pointage.authorization.denied'
  | 'pointage.evidence_eligibility.denied';

export type PointageAuditReasonCode =
  | 'invalid_credential'
  | 'superseded_credential'
  | 'unsupported_version'
  | 'rate_limited'
  | 'scope_not_resolved'
  | 'client_address_untrusted'
  | 'operation_not_granted'
  | 'dossier_not_in_scope'
  | 'before_entry'
  | 'after_departure';

export type PointageAuditWrite = PointageRepositoryScope &
  Readonly<{
    eventType: PointageAuditEventType;
    outcome: 'succeeded' | 'denied';
    reasonCode?: PointageAuditReasonCode;
    managerUserId?: string;
    personnelDossierId?: string;
    credentialId?: string;
    credentialVersion?: number;
    requestedOperation?: string;
    occurredAt: Date;
  }>;

export class PointageCredentialAlreadyExistsError extends Error {
  constructor() {
    super('A current Pointage credential already exists for this dossier.');
    this.name = 'PointageCredentialAlreadyExistsError';
  }
}

export class PointageCredentialMissingError extends Error {
  constructor() {
    super('No current Pointage credential exists for this dossier.');
    this.name = 'PointageCredentialMissingError';
  }
}

export class PointageCredentialCollisionExhaustedError extends Error {
  constructor() {
    super('Pointage credential collision retry limit was exhausted.');
    this.name = 'PointageCredentialCollisionExhaustedError';
  }
}

export class PointageDossierNotInScopeError extends Error {
  constructor() {
    super('Personnel dossier does not belong to the trusted Pointage scope.');
    this.name = 'PointageDossierNotInScopeError';
  }
}

function auditValues(event: PointageAuditWrite) {
  return {
    id: uuidv7(),
    organizationId: event.organizationId,
    establishmentId: event.establishmentId,
    eventType: event.eventType,
    outcome: event.outcome,
    reasonCode: event.reasonCode ?? null,
    managerUserId: event.managerUserId ?? null,
    personnelDossierId: event.personnelDossierId ?? null,
    credentialId: event.credentialId ?? null,
    credentialVersion: event.credentialVersion ?? null,
    requestedOperation: event.requestedOperation ?? null,
    occurredAt: event.occurredAt,
  };
}

export function createPointageRepository(repositoryDb: CloudDatabaseClient) {
  return {
    async resolveActiveEntryScope(
      normalizedEstablishmentSlug: string,
    ): Promise<PointageEntryScopeRecord | null> {
      const [row] = await repositoryDb
        .select({
          organizationId: establishments.organizationId,
          establishmentId: establishments.id,
          locale: establishments.locale,
          timezone: establishments.timezone,
        })
        .from(establishments)
        .innerJoin(
          organizations,
          eq(organizations.id, establishments.organizationId),
        )
        .where(
          and(
            sql`lower(${establishments.slug}) = ${normalizedEstablishmentSlug}`,
            eq(establishments.status, 'active'),
            eq(organizations.status, 'active'),
          ),
        )
        .limit(1);
      return row ?? null;
    },

    async findCredentialCandidate(
      scope: PointageRepositoryScope,
      lookupDigest: string,
    ): Promise<PointageCredentialCandidate | null> {
      const [row] = await repositoryDb
        .select({
          id: pointageEmployeeCredentials.id,
          personnelDossierId: pointageEmployeeCredentials.personnelDossierId,
          credentialVersion: pointageEmployeeCredentials.credentialVersion,
          credentialFormatVersion:
            pointageEmployeeCredentials.credentialFormatVersion,
          algorithmVersion: pointageEmployeeCredentials.algorithmVersion,
          keyVersion: pointageEmployeeCredentials.keyVersion,
          salt: pointageEmployeeCredentials.salt,
          verifier: pointageEmployeeCredentials.verifier,
          supersededAt: pointageEmployeeCredentials.supersededAt,
        })
        .from(pointageEmployeeCredentials)
        .where(
          and(
            eq(
              pointageEmployeeCredentials.organizationId,
              scope.organizationId,
            ),
            eq(
              pointageEmployeeCredentials.establishmentId,
              scope.establishmentId,
            ),
            eq(pointageEmployeeCredentials.lookupDigest, lookupDigest),
          ),
        )
        .limit(1);
      return row ?? null;
    },

    async findPersonnelEmploymentPeriod(
      scope: PointageRepositoryScope,
      personnelDossierId: string,
    ): Promise<PointagePersonnelEmploymentPeriod | null> {
      const [row] = await repositoryDb
        .select({
          personnelDossierId: personnelEmployeeDossiers.id,
          entryDate: personnelEmployeeDossiers.entryDate,
          departureDate: personnelEmployeeDossiers.departureDate,
        })
        .from(personnelEmployeeDossiers)
        .where(
          and(
            eq(personnelEmployeeDossiers.organizationId, scope.organizationId),
            eq(
              personnelEmployeeDossiers.establishmentId,
              scope.establishmentId,
            ),
            eq(personnelEmployeeDossiers.id, personnelDossierId),
          ),
        )
        .limit(1);
      return row ?? null;
    },

    async isRateLimitBlocked(
      scope: PointageRepositoryScope,
      keyKind: 'candidate' | 'client',
      keyDigest: string,
      now: Date,
    ): Promise<boolean> {
      const [row] = await repositoryDb
        .select({ blockedUntil: pointageCredentialRateLimits.blockedUntil })
        .from(pointageCredentialRateLimits)
        .where(
          and(
            eq(
              pointageCredentialRateLimits.organizationId,
              scope.organizationId,
            ),
            eq(
              pointageCredentialRateLimits.establishmentId,
              scope.establishmentId,
            ),
            eq(pointageCredentialRateLimits.keyKind, keyKind),
            eq(pointageCredentialRateLimits.keyDigest, keyDigest),
          ),
        )
        .limit(1);
      return row?.blockedUntil !== null && row?.blockedUntil !== undefined
        ? row.blockedUntil.getTime() > now.getTime()
        : false;
    },

    async recordRateLimitFailure(input: {
      scope: PointageRepositoryScope;
      keyKind: 'candidate' | 'client';
      keyDigest: string;
      now: Date;
      windowMs: number;
      failureLimit: number;
      blockMs: number;
    }): Promise<{ blocked: boolean; failureCount: number }> {
      return repositoryDb.transaction(async (transaction) => {
        await transaction
          .insert(pointageCredentialRateLimits)
          .values({
            organizationId: input.scope.organizationId,
            establishmentId: input.scope.establishmentId,
            keyKind: input.keyKind,
            keyDigest: input.keyDigest,
            windowStartedAt: input.now,
            failureCount: 0,
            blockedUntil: null,
            updatedAt: input.now,
          })
          .onConflictDoNothing();

        const locked = await transaction.execute<{
          window_started_at: Date;
          failure_count: number;
          blocked_until: Date | null;
        }>(sql`
          select window_started_at, failure_count, blocked_until
          from pointage_credential_rate_limits
          where organization_id = ${input.scope.organizationId}
            and establishment_id = ${input.scope.establishmentId}
            and key_kind = ${input.keyKind}
            and key_digest = ${input.keyDigest}
          for update
        `);
        const current = locked[0];
        if (current === undefined) {
          throw new Error('Pointage rate-limit row could not be locked.');
        }

        const currentBlockedUntil =
          current.blocked_until === null
            ? null
            : new Date(current.blocked_until);
        const currentWindowStartedAt = new Date(current.window_started_at);
        if (
          currentBlockedUntil !== null &&
          currentBlockedUntil.getTime() > input.now.getTime()
        ) {
          return { blocked: true, failureCount: current.failure_count };
        }

        const windowExpired =
          input.now.getTime() - currentWindowStartedAt.getTime() >=
          input.windowMs;
        const failureCount = windowExpired ? 1 : current.failure_count + 1;
        const blocked = failureCount >= input.failureLimit;
        await transaction
          .update(pointageCredentialRateLimits)
          .set({
            windowStartedAt: windowExpired ? input.now : currentWindowStartedAt,
            failureCount,
            blockedUntil: blocked
              ? new Date(input.now.getTime() + input.blockMs)
              : null,
            updatedAt: input.now,
          })
          .where(
            and(
              eq(
                pointageCredentialRateLimits.organizationId,
                input.scope.organizationId,
              ),
              eq(
                pointageCredentialRateLimits.establishmentId,
                input.scope.establishmentId,
              ),
              eq(pointageCredentialRateLimits.keyKind, input.keyKind),
              eq(pointageCredentialRateLimits.keyDigest, input.keyDigest),
            ),
          );
        return { blocked, failureCount };
      });
    },

    async resetCandidateRateLimit(
      scope: PointageRepositoryScope,
      keyDigest: string,
      now: Date,
    ): Promise<void> {
      await repositoryDb
        .update(pointageCredentialRateLimits)
        .set({
          windowStartedAt: now,
          failureCount: 0,
          blockedUntil: null,
          updatedAt: now,
        })
        .where(
          and(
            eq(
              pointageCredentialRateLimits.organizationId,
              scope.organizationId,
            ),
            eq(
              pointageCredentialRateLimits.establishmentId,
              scope.establishmentId,
            ),
            eq(pointageCredentialRateLimits.keyKind, 'candidate'),
            eq(pointageCredentialRateLimits.keyDigest, keyDigest),
          ),
        );
    },

    async appendAudit(event: PointageAuditWrite): Promise<void> {
      await repositoryDb
        .insert(pointageSecurityAuditEvents)
        .values(auditValues(event));
    },

    async issueCredential(input: {
      scope: PointageRepositoryScope;
      personnelDossierId: string;
      managerUserId: string;
      now: Date;
      createMaterial: (version: number) => Promise<PointageCredentialMaterial>;
    }) {
      return repositoryDb.transaction(async (transaction) => {
        const dossierLock = await transaction.execute<{ id: string }>(sql`
          select id from personnel_employee_dossiers
          where organization_id = ${input.scope.organizationId}
            and establishment_id = ${input.scope.establishmentId}
            and id = ${input.personnelDossierId}
          for update
        `);
        if (dossierLock.length !== 1) {
          throw new PointageDossierNotInScopeError();
        }
        const [current] = await transaction
          .select({ id: pointageEmployeeCredentials.id })
          .from(pointageEmployeeCredentials)
          .where(
            and(
              eq(
                pointageEmployeeCredentials.organizationId,
                input.scope.organizationId,
              ),
              eq(
                pointageEmployeeCredentials.establishmentId,
                input.scope.establishmentId,
              ),
              eq(
                pointageEmployeeCredentials.personnelDossierId,
                input.personnelDossierId,
              ),
              isNull(pointageEmployeeCredentials.supersededAt),
            ),
          )
          .limit(1);
        if (current !== undefined) {
          throw new PointageCredentialAlreadyExistsError();
        }

        for (let attempt = 0; attempt < 10; attempt += 1) {
          const material = await input.createMaterial(1);
          const credentialId = uuidv7();
          const inserted = await transaction
            .insert(pointageEmployeeCredentials)
            .values({
              id: credentialId,
              ...material,
              organizationId: input.scope.organizationId,
              establishmentId: input.scope.establishmentId,
              personnelDossierId: input.personnelDossierId,
              credentialVersion: 1,
              issuedAt: input.now,
              issuedByUserId: input.managerUserId,
            })
            .onConflictDoNothing()
            .returning({ id: pointageEmployeeCredentials.id });
          if (inserted.length === 0) {
            continue;
          }
          await transaction.insert(pointageSecurityAuditEvents).values(
            auditValues({
              ...input.scope,
              eventType: 'pointage.credential.issued',
              outcome: 'succeeded',
              managerUserId: input.managerUserId,
              personnelDossierId: input.personnelDossierId,
              credentialId,
              credentialVersion: 1,
              requestedOperation: 'pointage.credential.issue',
              occurredAt: input.now,
            }),
          );
          return { credentialId, credentialVersion: 1 };
        }
        throw new PointageCredentialCollisionExhaustedError();
      });
    },

    async resetCredential(input: {
      scope: PointageRepositoryScope;
      personnelDossierId: string;
      managerUserId: string;
      now: Date;
      createMaterial: (version: number) => Promise<PointageCredentialMaterial>;
    }) {
      return repositoryDb.transaction(async (transaction) => {
        const dossierLock = await transaction.execute<{ id: string }>(sql`
          select id from personnel_employee_dossiers
          where organization_id = ${input.scope.organizationId}
            and establishment_id = ${input.scope.establishmentId}
            and id = ${input.personnelDossierId}
          for update
        `);
        if (dossierLock.length !== 1) {
          throw new PointageDossierNotInScopeError();
        }
        const [current] = await transaction
          .select({
            id: pointageEmployeeCredentials.id,
            credentialVersion: pointageEmployeeCredentials.credentialVersion,
          })
          .from(pointageEmployeeCredentials)
          .where(
            and(
              eq(
                pointageEmployeeCredentials.organizationId,
                input.scope.organizationId,
              ),
              eq(
                pointageEmployeeCredentials.establishmentId,
                input.scope.establishmentId,
              ),
              eq(
                pointageEmployeeCredentials.personnelDossierId,
                input.personnelDossierId,
              ),
              isNull(pointageEmployeeCredentials.supersededAt),
            ),
          )
          .limit(1);
        if (current === undefined) {
          throw new PointageCredentialMissingError();
        }
        const nextVersion = current.credentialVersion + 1;

        for (let attempt = 0; attempt < 10; attempt += 1) {
          const material = await input.createMaterial(nextVersion);
          const credentialId = uuidv7();
          const staged = await transaction
            .insert(pointageEmployeeCredentials)
            .values({
              id: credentialId,
              ...material,
              organizationId: input.scope.organizationId,
              establishmentId: input.scope.establishmentId,
              personnelDossierId: input.personnelDossierId,
              credentialVersion: nextVersion,
              issuedAt: input.now,
              issuedByUserId: input.managerUserId,
              supersededAt: input.now,
              supersededByCredentialId: current.id,
              supersededByUserId: input.managerUserId,
            })
            .onConflictDoNothing()
            .returning({ id: pointageEmployeeCredentials.id });
          if (staged.length === 0) {
            continue;
          }
          await transaction
            .update(pointageEmployeeCredentials)
            .set({
              supersededAt: input.now,
              supersededByCredentialId: credentialId,
              supersededByUserId: input.managerUserId,
            })
            .where(
              and(
                eq(
                  pointageEmployeeCredentials.organizationId,
                  input.scope.organizationId,
                ),
                eq(
                  pointageEmployeeCredentials.establishmentId,
                  input.scope.establishmentId,
                ),
                eq(pointageEmployeeCredentials.id, current.id),
                isNull(pointageEmployeeCredentials.supersededAt),
              ),
            );
          await transaction
            .update(pointageEmployeeCredentials)
            .set({
              supersededAt: null,
              supersededByCredentialId: null,
              supersededByUserId: null,
            })
            .where(
              and(
                eq(
                  pointageEmployeeCredentials.organizationId,
                  input.scope.organizationId,
                ),
                eq(
                  pointageEmployeeCredentials.establishmentId,
                  input.scope.establishmentId,
                ),
                eq(pointageEmployeeCredentials.id, credentialId),
              ),
            );
          await transaction.insert(pointageSecurityAuditEvents).values([
            auditValues({
              ...input.scope,
              eventType: 'pointage.credential.reset',
              outcome: 'succeeded',
              managerUserId: input.managerUserId,
              personnelDossierId: input.personnelDossierId,
              credentialId,
              credentialVersion: nextVersion,
              requestedOperation: 'pointage.credential.reset',
              occurredAt: input.now,
            }),
            auditValues({
              ...input.scope,
              eventType: 'pointage.credential.superseded',
              outcome: 'succeeded',
              managerUserId: input.managerUserId,
              personnelDossierId: input.personnelDossierId,
              credentialId: current.id,
              credentialVersion: current.credentialVersion,
              requestedOperation: 'pointage.credential.reset',
              occurredAt: input.now,
            }),
          ]);
          return {
            credentialId,
            credentialVersion: nextVersion,
            supersededCredentialId: current.id,
          };
        }
        throw new PointageCredentialCollisionExhaustedError();
      });
    },
  };
}

export type PointageRepository = ReturnType<typeof createPointageRepository>;
