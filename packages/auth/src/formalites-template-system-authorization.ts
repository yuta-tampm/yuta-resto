import type { SystemRole } from '@yuta/contracts/tenant-foundation';

export const FORMALITES_TEMPLATE_SYSTEM_OPERATIONS = [
  'formalites.template.read',
  'formalites.template.draft.manage',
  'formalites.template.review.submit',
  'formalites.template.publish',
  'formalites.template.retire',
] as const;

export type FormalitesTemplateSystemOperation =
  (typeof FORMALITES_TEMPLATE_SYSTEM_OPERATIONS)[number];

export const GLOBAL_YUTA_FORMALITES_TEMPLATES_SCOPE =
  'GLOBAL_YUTA_FORMALITES_TEMPLATES' as const;

export type FormalitesTemplateSystemAuthorizationContext = Readonly<{
  actorUserId: string;
  systemRole: 'YUTA_ADMIN';
  operation: FormalitesTemplateSystemOperation;
  resourceScope: typeof GLOBAL_YUTA_FORMALITES_TEMPLATES_SCOPE;
}>;

export const FORMALITES_TEMPLATE_SYSTEM_ROLE_GRANTS = {
  YUTA_ADMIN: FORMALITES_TEMPLATE_SYSTEM_OPERATIONS,
  YUTA_SUPPORT: [] as const,
} as const satisfies Readonly<
  Record<SystemRole, readonly FormalitesTemplateSystemOperation[]>
>;

export function isFormalitesTemplateSystemOperation(
  value: unknown,
): value is FormalitesTemplateSystemOperation {
  return (
    typeof value === 'string' &&
    FORMALITES_TEMPLATE_SYSTEM_OPERATIONS.some(
      (operation) => operation === value,
    )
  );
}

export function hasFormalitesTemplateSystemOperation(
  systemRole: SystemRole | null,
  operation: FormalitesTemplateSystemOperation,
): systemRole is 'YUTA_ADMIN' {
  return (
    systemRole !== null &&
    FORMALITES_TEMPLATE_SYSTEM_ROLE_GRANTS[systemRole].some(
      (grantedOperation) => grantedOperation === operation,
    )
  );
}
