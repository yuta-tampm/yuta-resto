import 'server-only';

import type { AuthenticatedSession } from '@yuta/auth';
import type { TenantContext } from '@yuta/tenant';

export const POINTAGE_OPERATIONS = [
  'pointage.employee.identify',
  'pointage.employee.state.read',
  'pointage.employee.operation.create',
  'pointage.establishment.read',
  'pointage.credential.issue',
  'pointage.credential.reset',
] as const;

export type PointageOperation = (typeof POINTAGE_OPERATIONS)[number];
export type PointageEmployeeOperation = Extract<
  PointageOperation,
  `pointage.employee.${string}`
>;
export type PointageManagerOperation = Exclude<
  PointageOperation,
  PointageEmployeeOperation
>;

export type VerifiedPointageCredential = Readonly<{
  proofType: 'VERIFIED_POINTAGE_CREDENTIAL';
  organizationId: string;
  establishmentId: string;
  personnelDossierId: string;
  credentialId: string;
  credentialVersion: number;
}>;

export type PointageEmployeeContext = Readonly<{
  actorType: 'POINTAGE_EMPLOYEE';
  organizationId: string;
  establishmentId: string;
  personnelDossierId: string;
  credentialId: string;
  credentialVersion: number;
  operation: PointageEmployeeOperation;
}>;

export type PointageManagerContext = Readonly<{
  actorType: 'POINTAGE_MANAGER';
  organizationId: string;
  establishmentId: string;
  userId: string;
  membershipId: string;
  role: 'OWNER' | 'MANAGER';
  operation: PointageManagerOperation;
}>;

export class PointageAuthorizationError extends Error {
  constructor() {
    super('Pointage operation is not granted.');
    this.name = 'PointageAuthorizationError';
  }
}

function isPointageOperation(value: string): value is PointageOperation {
  return (POINTAGE_OPERATIONS as readonly string[]).includes(value);
}

function isPointageManagerOperation(
  value: string,
): value is PointageManagerOperation {
  return isPointageOperation(value) && !value.startsWith('pointage.employee.');
}

export function createPointageManagerContext(
  input: Readonly<{
    session: AuthenticatedSession;
    tenant: TenantContext;
    operation: string;
  }>,
): PointageManagerContext {
  if (
    !isPointageManagerOperation(input.operation) ||
    input.tenant.establishmentId === null ||
    input.tenant.actor.type !== 'user' ||
    (input.tenant.actor.role !== 'OWNER' &&
      input.tenant.actor.role !== 'MANAGER') ||
    input.session.userId !== input.tenant.actor.userId ||
    input.session.organizationId !== input.tenant.organizationId ||
    input.session.establishmentId !== input.tenant.establishmentId
  ) {
    throw new PointageAuthorizationError();
  }

  return Object.freeze({
    actorType: 'POINTAGE_MANAGER',
    organizationId: input.tenant.organizationId,
    establishmentId: input.tenant.establishmentId,
    userId: input.tenant.actor.userId,
    membershipId: input.tenant.actor.membershipId,
    role: input.tenant.actor.role,
    operation: input.operation,
  });
}

export function createPointageEmployeeContext(
  input: Readonly<{
    credential: VerifiedPointageCredential;
    operation: PointageEmployeeOperation;
  }>,
): PointageEmployeeContext {
  if (
    !(
      [
        'pointage.employee.identify',
        'pointage.employee.state.read',
        'pointage.employee.operation.create',
      ] as readonly string[]
    ).includes(input.operation)
  ) {
    throw new PointageAuthorizationError();
  }
  return Object.freeze({
    actorType: 'POINTAGE_EMPLOYEE',
    organizationId: input.credential.organizationId,
    establishmentId: input.credential.establishmentId,
    personnelDossierId: input.credential.personnelDossierId,
    credentialId: input.credential.credentialId,
    credentialVersion: input.credential.credentialVersion,
    operation: input.operation,
  });
}

export function requirePointageManagerOperation(
  context: PointageManagerContext,
  operation: PointageManagerOperation,
): void {
  if (context.operation !== operation) {
    throw new PointageAuthorizationError();
  }
}
