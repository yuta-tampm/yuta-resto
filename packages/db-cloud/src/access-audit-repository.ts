import type { MembershipStatus } from '@yuta/contracts/cloud-admin';
import { tenantRoleSchema, type TenantRole } from '@yuta/tenant';
import { and, desc, eq, inArray, isNull, lt, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import type { CloudDatabaseClient } from './client';
import { authAuditEvents, establishments, users } from './schema';

export const accessAuditActions = [
  'tenant.user.created',
  'tenant.user.attached',
  'tenant.membership.updated',
] as const;

export type AccessAuditAction = (typeof accessAuditActions)[number];

export type AccessAuditItem = {
  id: string;
  action: AccessAuditAction;
  createdAt: Date;
  actor: { id: string | null; name: string; email: string | null };
  subject: { id: string | null; name: string; email: string | null };
  establishments: Array<{ id: string; name: string }>;
  previousRole: TenantRole | null;
  nextRole: TenantRole | null;
  previousStatus: MembershipStatus | null;
  nextStatus: MembershipStatus | null;
};

export type AccessAuditPage = {
  items: AccessAuditItem[];
  nextCursor: string | null;
};

const accessAuditActionSchema = z.enum(accessAuditActions);
const membershipStatusSchema = z.enum(['active', 'suspended']);
const cursorSchema = z.object({
  createdAt: z.string().datetime({ offset: true }),
  id: z.string().uuid(),
});
const establishmentListMetadataSchema = z.object({
  establishmentIds: z.array(z.string().uuid()).default([]),
  role: tenantRoleSchema.nullable().default(null),
});
const membershipUpdateMetadataSchema = z.object({
  previousRole: tenantRoleSchema.nullable().default(null),
  previousStatus: membershipStatusSchema.nullable().default(null),
  role: tenantRoleSchema.nullable().default(null),
  status: membershipStatusSchema.nullable().default(null),
});

type SanitizedAccessAuditMetadata = {
  establishmentIds: string[];
  previousRole: TenantRole | null;
  nextRole: TenantRole | null;
  previousStatus: MembershipStatus | null;
  nextStatus: MembershipStatus | null;
};

export function sanitizeAccessAuditMetadata(
  action: AccessAuditAction,
  metadata: unknown,
): SanitizedAccessAuditMetadata {
  if (action === 'tenant.membership.updated') {
    const parsed = membershipUpdateMetadataSchema.safeParse(metadata);
    return {
      establishmentIds: [],
      previousRole: parsed.success ? parsed.data.previousRole : null,
      nextRole: parsed.success ? parsed.data.role : null,
      previousStatus: parsed.success ? parsed.data.previousStatus : null,
      nextStatus: parsed.success ? parsed.data.status : null,
    };
  }

  const parsed = establishmentListMetadataSchema.safeParse(metadata);
  return {
    establishmentIds: parsed.success ? parsed.data.establishmentIds : [],
    previousRole: null,
    nextRole: parsed.success ? parsed.data.role : null,
    previousStatus: null,
    nextStatus: 'active',
  };
}

export function encodeAccessAuditCursor(input: {
  createdAt: Date;
  id: string;
}): string {
  return Buffer.from(
    JSON.stringify({ createdAt: input.createdAt.toISOString(), id: input.id }),
  ).toString('base64url');
}

export function decodeAccessAuditCursor(
  value: string | null | undefined,
): { createdAt: Date; id: string } | null {
  if (!value) return null;
  try {
    const parsed = cursorSchema.safeParse(
      JSON.parse(Buffer.from(value, 'base64url').toString('utf8')),
    );
    return parsed.success
      ? { createdAt: new Date(parsed.data.createdAt), id: parsed.data.id }
      : null;
  } catch {
    return null;
  }
}

export function createAccessAuditRepository(repositoryDb: CloudDatabaseClient) {
  async function listAccessAuditEvents(input: {
    organizationId: string;
    allowedEstablishmentIds: string[];
    subjectUserId?: string;
    establishmentId?: string;
    action?: AccessAuditAction;
    cursor?: string;
    pageSize?: number;
  }): Promise<AccessAuditPage> {
    if (input.allowedEstablishmentIds.length === 0) {
      return { items: [], nextCursor: null };
    }

    const allowedEstablishments = await repositoryDb
      .select({ id: establishments.id, name: establishments.name })
      .from(establishments)
      .where(
        and(
          eq(establishments.organizationId, input.organizationId),
          eq(establishments.status, 'active'),
          inArray(establishments.id, input.allowedEstablishmentIds),
        ),
      );
    const allowedIds = allowedEstablishments.map(
      (establishment) => establishment.id,
    );
    if (
      allowedIds.length === 0 ||
      (input.establishmentId && !allowedIds.includes(input.establishmentId))
    ) {
      return { items: [], nextCursor: null };
    }

    const allowedIdArray = sql`ARRAY[${sql.join(
      allowedIds.map((id) => sql`${id}`),
      sql`, `,
    )}]::text[]`;
    const organizationEventInScope = sql<boolean>`COALESCE(${authAuditEvents.metadata}->'establishmentIds', '[]'::jsonb) ?| ${allowedIdArray}`;
    const conditions = [
      eq(authAuditEvents.organizationId, input.organizationId),
      inArray(authAuditEvents.event, accessAuditActions),
      or(
        inArray(authAuditEvents.establishmentId, allowedIds),
        and(isNull(authAuditEvents.establishmentId), organizationEventInScope),
      )!,
    ];
    if (input.subjectUserId) {
      conditions.push(eq(authAuditEvents.subjectUserId, input.subjectUserId));
    }
    if (input.establishmentId) {
      conditions.push(
        or(
          eq(authAuditEvents.establishmentId, input.establishmentId),
          and(
            isNull(authAuditEvents.establishmentId),
            sql<boolean>`COALESCE(${authAuditEvents.metadata}->'establishmentIds', '[]'::jsonb) ? ${input.establishmentId}`,
          ),
        )!,
      );
    }
    if (input.action) {
      conditions.push(eq(authAuditEvents.event, input.action));
    }
    const cursor = decodeAccessAuditCursor(input.cursor);
    if (cursor) {
      conditions.push(
        or(
          lt(authAuditEvents.createdAt, cursor.createdAt),
          and(
            eq(authAuditEvents.createdAt, cursor.createdAt),
            lt(authAuditEvents.id, cursor.id),
          ),
        )!,
      );
    }

    const actorUsers = alias(users, 'access_audit_actor_users');
    const subjectUsers = alias(users, 'access_audit_subject_users');
    const eventEstablishments = alias(
      establishments,
      'access_audit_establishments',
    );
    const pageSize = Math.min(Math.max(input.pageSize ?? 20, 1), 100);
    const rows = await repositoryDb
      .select({
        id: authAuditEvents.id,
        event: authAuditEvents.event,
        createdAt: authAuditEvents.createdAt,
        metadata: authAuditEvents.metadata,
        actorUserId: authAuditEvents.actorUserId,
        actorName: actorUsers.displayName,
        actorEmail: actorUsers.email,
        subjectUserId: authAuditEvents.subjectUserId,
        subjectName: subjectUsers.displayName,
        subjectEmail: subjectUsers.email,
        establishmentId: authAuditEvents.establishmentId,
        establishmentName: eventEstablishments.name,
      })
      .from(authAuditEvents)
      .leftJoin(actorUsers, eq(actorUsers.id, authAuditEvents.actorUserId))
      .leftJoin(
        subjectUsers,
        eq(subjectUsers.id, authAuditEvents.subjectUserId),
      )
      .leftJoin(
        eventEstablishments,
        and(
          eq(eventEstablishments.id, authAuditEvents.establishmentId),
          eq(eventEstablishments.organizationId, input.organizationId),
          inArray(eventEstablishments.id, allowedIds),
        ),
      )
      .where(and(...conditions))
      .orderBy(desc(authAuditEvents.createdAt), desc(authAuditEvents.id))
      .limit(pageSize + 1);

    const establishmentById = new Map(
      allowedEstablishments.map((establishment) => [
        establishment.id,
        establishment.name,
      ]),
    );
    const items = rows.slice(0, pageSize).flatMap((row) => {
      const action = accessAuditActionSchema.safeParse(row.event);
      if (!action.success) return [];
      const metadata = sanitizeAccessAuditMetadata(action.data, row.metadata);
      const eventEstablishmentIds = row.establishmentId
        ? [row.establishmentId]
        : metadata.establishmentIds.filter((id) => allowedIds.includes(id));
      return [
        {
          id: row.id,
          action: action.data,
          createdAt: row.createdAt,
          actor: {
            id: row.actorUserId,
            name: row.actorName ?? row.actorEmail ?? 'Utilisateur supprimé',
            email: row.actorEmail,
          },
          subject: {
            id: row.subjectUserId,
            name: row.subjectName ?? row.subjectEmail ?? 'Utilisateur supprimé',
            email: row.subjectEmail,
          },
          establishments: eventEstablishmentIds.flatMap((id) => {
            const name = establishmentById.get(id);
            return name ? [{ id, name }] : [];
          }),
          previousRole: metadata.previousRole,
          nextRole: metadata.nextRole,
          previousStatus: metadata.previousStatus,
          nextStatus: metadata.nextStatus,
        } satisfies AccessAuditItem,
      ];
    });
    const lastItem = items.at(-1);
    return {
      items,
      nextCursor:
        rows.length > pageSize && lastItem
          ? encodeAccessAuditCursor(lastItem)
          : null,
    };
  }

  return { listAccessAuditEvents };
}
