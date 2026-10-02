import 'server-only';

import { TenantError, type TenantContext } from '@yuta/tenant';

export function hasAccessAuditPermission(context: TenantContext): boolean {
  return context.actor.type === 'user' && context.actor.role === 'OWNER';
}

export function requireAccessAuditPermission(context: TenantContext): void {
  if (!hasAccessAuditPermission(context)) {
    throw new TenantError(
      'Permission denied.',
      'CROSS_TENANT_ACCESS_DENIED',
      403,
    );
  }
}
