import 'server-only';

import { requireEstablishment } from '@yuta/tenant';
import {
  requireFormalitesPermission,
  type FormalitesPermission,
} from './permissions';
import { requireAuthenticatedTenant } from './session';

export async function requireFormalitesTenant(
  permission: FormalitesPermission,
  returnTo = '/equipe/formalites-personnel',
) {
  const context = await requireAuthenticatedTenant(returnTo);
  requireEstablishment(context.tenant);
  requireFormalitesPermission(context.tenant, permission);
  return context as typeof context & {
    tenant: typeof context.tenant & { establishmentId: string };
  };
}
