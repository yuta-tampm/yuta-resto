import { randomUUID } from 'node:crypto';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  tenantError: null as Error | null,
  recordAccess: vi.fn(),
  listAccessHistory: vi.fn(),
  listAuditHistory: vi.fn(),
  listUnifiedHistory: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  listPersonnelEmployeeAccessHistory: mocks.listAccessHistory,
  listPersonnelEmployeeAuditHistory: mocks.listAuditHistory,
  listPersonnelEmployeeUnifiedHistory: mocks.listUnifiedHistory,
  recordPersonnelEmployeeAccess: mocks.recordAccess,
}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { kind: 'test-cloud-database' },
}));
vi.mock('../src/server/auth/session', () => ({
  requirePersonnelTenant: vi.fn(async () => {
    if (mocks.tenantError) throw mocks.tenantError;
    return { tenant: mocks.tenant };
  }),
}));

import {
  loadEmployeeAccessHistoryAction,
  loadEmployeeHistoryAction,
  loadEmployeeUnifiedHistoryAction,
} from '../src/app/(authenticated)/equipe/salaries/actions';

const database = { kind: 'test-cloud-database' };
const employeeId = '11111111-1111-4111-8111-111111111111';
const operationId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const cursor = 'opaque-cursor';
const historyMessage = 'Impossible de charger l’historique. Réessayez.';
const accessMessage = 'Impossible de charger les consultations. Réessayez.';

type Scenario = {
  name: string;
  load: () => Promise<unknown>;
  list: ReturnType<typeof vi.fn>;
  eventType: string;
  listArgs: () => unknown[];
  message: string;
};

const scenarios: Scenario[] = [
  {
    name: 'access history',
    load: () =>
      loadEmployeeAccessHistoryAction(employeeId, operationId, cursor),
    list: mocks.listAccessHistory,
    eventType: 'employee.access_history_viewed',
    listArgs: () => [database, mocks.tenant, employeeId, cursor],
    message: accessMessage,
  },
  {
    name: 'audit history',
    load: () => loadEmployeeHistoryAction(employeeId, operationId),
    list: mocks.listAuditHistory,
    eventType: 'employee.history_viewed',
    listArgs: () => [database, mocks.tenant, employeeId],
    message: historyMessage,
  },
  {
    name: 'unified history',
    load: () => loadEmployeeUnifiedHistoryAction(employeeId, operationId),
    list: mocks.listUnifiedHistory,
    eventType: 'employee.history_viewed',
    listArgs: () => [database, mocks.tenant, employeeId],
    message: historyMessage,
  },
];

function context(role: TenantRole): TenantContext {
  return {
    organizationId: randomUUID(),
    establishmentId: randomUUID(),
    actor: {
      type: 'user',
      userId: randomUUID(),
      membershipId: randomUUID(),
      role,
    },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set(),
  };
}

beforeEach(() => {
  mocks.tenant = context('OWNER');
  mocks.tenantError = null;
  mocks.recordAccess.mockReset();
  mocks.recordAccess.mockResolvedValue(true);
  for (const list of [
    mocks.listAccessHistory,
    mocks.listAuditHistory,
    mocks.listUnifiedHistory,
  ]) {
    list.mockReset();
    list.mockResolvedValue({ items: [] });
  }
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  return () => consoleError.mockRestore();
});

describe.each(scenarios)('Personnel $name load action', (scenario) => {
  it('records the access trace before the scoped repository read', async () => {
    await expect(scenario.load()).resolves.toEqual({
      status: 'success',
      history: { items: [] },
    });

    expect(mocks.recordAccess).toHaveBeenCalledWith(
      database,
      mocks.tenant,
      employeeId,
      scenario.eventType,
      operationId,
    );
    expect(scenario.list).toHaveBeenCalledWith(...scenario.listArgs());
    expect(mocks.recordAccess.mock.invocationCallOrder[0]).toBeLessThan(
      scenario.list.mock.invocationCallOrder[0] ?? 0,
    );
  });

  it('fails closed without reading when the trace is denied', async () => {
    mocks.recordAccess.mockResolvedValue(false);

    await expect(scenario.load()).resolves.toEqual({
      status: 'error',
      message: scenario.message,
    });
    expect(scenario.list).not.toHaveBeenCalled();
  });

  it('fails closed without reading when the trace cannot be written', async () => {
    mocks.recordAccess.mockRejectedValue(new Error('Audit unavailable.'));

    await expect(scenario.load()).resolves.toEqual({
      status: 'error',
      message: scenario.message,
    });
    expect(scenario.list).not.toHaveBeenCalled();
  });

  it('recovers from a read failure on retry', async () => {
    scenario.list.mockRejectedValueOnce(new Error('Temporary read failure.'));

    await expect(scenario.load()).resolves.toEqual({
      status: 'error',
      message: scenario.message,
    });
    await expect(scenario.load()).resolves.toEqual({
      status: 'success',
      history: { items: [] },
    });
    expect(mocks.recordAccess).toHaveBeenCalledTimes(2);
  });

  it('propagates trusted-session rejection before any trace or read', async () => {
    mocks.tenantError = new Error('Suspended membership.');

    await expect(scenario.load()).rejects.toThrow('Suspended membership.');
    expect(mocks.recordAccess).not.toHaveBeenCalled();
    expect(scenario.list).not.toHaveBeenCalled();
  });

  it.each(['MANAGER', 'STAFF'] as const)(
    'propagates %s permission denial before any trace or read',
    async (role) => {
      mocks.tenant = context(role);

      await expect(scenario.load()).rejects.toThrow('Permission denied.');
      expect(mocks.recordAccess).not.toHaveBeenCalled();
      expect(scenario.list).not.toHaveBeenCalled();
    },
  );
});

describe('Personnel access history cursor', () => {
  it('passes the opaque cursor unchanged with the trusted tenant scope', async () => {
    await loadEmployeeAccessHistoryAction(employeeId, operationId, 'next-page');

    expect(mocks.listAccessHistory).toHaveBeenCalledWith(
      database,
      mocks.tenant,
      employeeId,
      'next-page',
    );
  });

  it('reads the first page when no cursor is supplied', async () => {
    await loadEmployeeAccessHistoryAction(employeeId, operationId);

    expect(mocks.listAccessHistory).toHaveBeenCalledWith(
      database,
      mocks.tenant,
      employeeId,
      undefined,
    );
  });
});
