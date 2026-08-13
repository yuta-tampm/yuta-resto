import { accessAuditActions, type AccessAuditAction } from '@yuta/db-cloud';
import { z } from 'zod';

export type AccessAuditSearchParams = {
  auditUser?: string | string[];
  auditEstablishment?: string | string[];
  auditAction?: string | string[];
  auditCursor?: string | string[];
};

export type AccessAuditQuery = {
  subjectUserId?: string;
  establishmentId?: string;
  action?: AccessAuditAction;
  cursor?: string;
};

const optionalUuid = z.string().uuid().optional();
const optionalAction = z.enum(accessAuditActions).optional();
const optionalCursor = z.string().min(1).max(512).optional();

export const accessAuditActionLabels: Record<AccessAuditAction, string> = {
  'tenant.user.created': 'Utilisateur créé',
  'tenant.user.attached': 'Utilisateur rattaché',
  'tenant.membership.updated': 'Accès modifié',
};

export function parseAccessAuditQuery(
  params: AccessAuditSearchParams,
): AccessAuditQuery {
  const subjectUserId = optionalUuid.safeParse(first(params.auditUser));
  const establishmentId = optionalUuid.safeParse(
    first(params.auditEstablishment),
  );
  const action = optionalAction.safeParse(first(params.auditAction));
  const cursor = optionalCursor.safeParse(first(params.auditCursor));
  return {
    ...(subjectUserId.success && subjectUserId.data
      ? { subjectUserId: subjectUserId.data }
      : {}),
    ...(establishmentId.success && establishmentId.data
      ? { establishmentId: establishmentId.data }
      : {}),
    ...(action.success && action.data ? { action: action.data } : {}),
    ...(cursor.success && cursor.data ? { cursor: cursor.data } : {}),
  };
}

export function buildAccessAuditHref(
  query: AccessAuditQuery,
  cursor?: string,
): string {
  const params = new URLSearchParams();
  if (query.subjectUserId) params.set('auditUser', query.subjectUserId);
  if (query.establishmentId) {
    params.set('auditEstablishment', query.establishmentId);
  }
  if (query.action) params.set('auditAction', query.action);
  if (cursor) params.set('auditCursor', cursor);
  const search = params.toString();
  return `/parametres/utilisateurs-acces${search ? `?${search}` : ''}#historique-acces`;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
