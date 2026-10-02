import { randomUUID } from 'node:crypto';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  tenantError: null as Error | null,
  listUnifiedHistory: vi.fn(),
  recordAccess: vi.fn(),
  updateEmployee: vi.fn(),
  revalidatePath: vi.fn(),
  RepositoryError: class RepositoryError extends Error {
    constructor(
      message: string,
      readonly code: string,
    ) {
      super(message);
    }
  },
  ConflictError: class ConflictError extends Error {
    constructor(readonly currentEmployee: unknown) {
      super('Revision conflict.');
    }
  },
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  listPersonnelEmployeeUnifiedHistory: mocks.listUnifiedHistory,
  recordPersonnelEmployeeAccess: mocks.recordAccess,
  updatePersonnelEmployee: mocks.updateEmployee,
  PersonnelRepositoryError: mocks.RepositoryError,
  PersonnelConflictError: mocks.ConflictError,
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { kind: 'test-cloud-database' },
}));
vi.mock('../src/server/auth/session', () => ({
  requirePersonnelTenant: vi.fn(async () => {
    if (mocks.tenantError) throw mocks.tenantError;
    return { tenant: mocks.tenant };
  }),
}));
vi.mock('../src/server/personnel-documents/runtime', () => ({}));
vi.mock('../src/server/personnel-contract-extraction/service', () => ({
  DevelopmentExtractionRateLimiter: class {},
}));
vi.mock('../src/server/personnel-contract-extraction/runtime', () => ({}));
vi.mock('../src/server/personnel-contract-extraction/review-store', () => ({}));
vi.mock(
  '../src/server/personnel-contract-extraction/synthetic-upload',
  () => ({}),
);
vi.mock(
  '../src/server/personnel-contract-extraction/stored-synthetic-document',
  () => ({ StoredSyntheticProviderQaGate: class {} }),
);

import {
  loadEmployeeUnifiedHistoryAction,
  updateEmployeeAction,
  type UpdateEmployeeActionState,
} from '../src/app/(authenticated)/equipe/salaries/actions';

const employee = {
  id: '11111111-1111-4111-8111-111111111111',
  givenNames: 'Nina Marie',
  familyName: 'Sierra',
  position: 'Cheffe de rang',
  qualification: 'Employée qualifiée',
  employmentTermType: 'indefinite' as const,
  expectedEndDate: null,
  fixedTermReasonCode: null,
  workTimeCategory: 'full_time' as const,
  contractWeeklyMinutes: 2_100,
  entryDate: '2026-08-01',
  departureDate: null,
  view: 'active' as const,
  completenessReasons: [],
  revision: 3,
  createdAt: '2026-08-01T08:00:00.000Z',
  updatedAt: '2026-09-03T09:00:00.000Z',
};

const initialUpdateState: UpdateEmployeeActionState = {
  status: 'idle',
  message: null,
  fieldErrors: {},
  currentEmployee: null,
};

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

describe('Personnel unified history action', () => {
  beforeEach(() => {
    mocks.tenant = context('OWNER');
    mocks.tenantError = null;
    mocks.listUnifiedHistory.mockReset();
    mocks.listUnifiedHistory.mockResolvedValue({ items: [], truncated: false });
    mocks.recordAccess.mockReset();
    mocks.recordAccess.mockResolvedValue(true);
    mocks.updateEmployee.mockReset();
    mocks.updateEmployee.mockResolvedValue({
      employee,
      updated: true,
      idempotentReplay: false,
    });
    mocks.revalidatePath.mockReset();
  });

  it('uses the trusted OWNER tenant and returns only the repository safe DTO', async () => {
    const employeeId = randomUUID();
    await expect(
      loadEmployeeUnifiedHistoryAction(
        employeeId,
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      ),
    ).resolves.toEqual({
      status: 'success',
      history: { items: [], truncated: false },
    });
    expect(mocks.recordAccess).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      employeeId,
      'employee.history_viewed',
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    );
    expect(mocks.listUnifiedHistory).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      employeeId,
    );
  });

  it.each(['MANAGER', 'STAFF'] as const)(
    'denies %s before repository access',
    async (role) => {
      mocks.tenant = context(role);
      await expect(
        loadEmployeeUnifiedHistoryAction(randomUUID(), randomUUID()),
      ).rejects.toThrow('Permission denied.');
      expect(mocks.listUnifiedHistory).not.toHaveBeenCalled();
    },
  );

  it('propagates trusted-session rejection for a suspended membership', async () => {
    mocks.tenantError = new Error('Suspended membership.');
    await expect(
      loadEmployeeUnifiedHistoryAction(randomUUID(), randomUUID()),
    ).rejects.toThrow('Suspended membership.');
    expect(mocks.listUnifiedHistory).not.toHaveBeenCalled();
  });

  it('fails closed when the existing history-view trace cannot be recorded', async () => {
    mocks.recordAccess.mockResolvedValue(false);

    await expect(
      loadEmployeeUnifiedHistoryAction(randomUUID(), randomUUID()),
    ).resolves.toEqual({
      status: 'error',
      message: 'Impossible de charger l’historique. Réessayez.',
    });
    expect(mocks.listUnifiedHistory).not.toHaveBeenCalled();
  });
});

describe('Personnel employee update interaction boundary', () => {
  beforeEach(() => {
    mocks.tenant = context('OWNER');
    mocks.tenantError = null;
    mocks.updateEmployee.mockReset();
    mocks.updateEmployee.mockResolvedValue({
      employee,
      updated: true,
      idempotentReplay: false,
    });
    mocks.revalidatePath.mockReset();
  });

  it('submits one normalized multi-group command with the proposed values', async () => {
    const formData = employeeUpdateFormData([
      metadata('identity', 'correction', null, null),
      metadata('role', 'change', '2026-09-01', null),
      metadata('work_time', 'correction', null, 'Durée corrigée'),
    ]);

    await expect(
      updateEmployeeAction(initialUpdateState, formData),
    ).resolves.toMatchObject({ status: 'success', currentEmployee: employee });

    expect(mocks.updateEmployee).toHaveBeenCalledOnce();
    const submitted = mocks.updateEmployee.mock.calls[0]?.[2];
    expect(submitted).toMatchObject({
      idempotencyKey: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      givenNames: 'Nina Marie',
      position: 'Cheffe de rang',
      contractWeeklyMinutes: 2_100,
      historyMetadata: [
        metadata('identity', 'correction', null, null),
        metadata('role', 'change', '2026-09-01', null),
        metadata('work_time', 'correction', null, 'Durée corrigée'),
      ],
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/equipe/salaries');
  });

  it('maps missing metadata to the affected group without a second save', async () => {
    mocks.updateEmployee.mockRejectedValueOnce(
      new mocks.RepositoryError(
        'History metadata is required for changed group identity.',
        'PERSONNEL_HISTORY_METADATA_INVALID',
      ),
    );

    const result = await updateEmployeeAction(
      initialUpdateState,
      employeeUpdateFormData(undefined),
    );

    expect(result).toMatchObject({
      status: 'error',
      fieldErrors: {
        'historyMetadata.identity.classification':
          'Choisissez un type de modification valide.',
      },
    });
    expect(mocks.updateEmployee).toHaveBeenCalledOnce();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('maps metadata supplied for an unchanged group and keeps the mutation rejected', async () => {
    mocks.updateEmployee.mockRejectedValueOnce(
      new mocks.RepositoryError(
        'History metadata was supplied for unchanged group entry.',
        'PERSONNEL_HISTORY_METADATA_INVALID',
      ),
    );
    const result = await updateEmployeeAction(
      initialUpdateState,
      employeeUpdateFormData([
        metadata('identity', 'correction', null, null),
        metadata('entry', 'correction', null, 'Date corrigée'),
      ]),
    );

    expect(result).toMatchObject({
      status: 'error',
      fieldErrors: {
        'historyMetadata.entry.classification':
          'Ce groupe n’a pas été modifié. Vérifiez les valeurs du formulaire.',
      },
    });
    expect(mocks.updateEmployee).toHaveBeenCalledOnce();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('rejects an unknown metadata property before the repository call', async () => {
    const result = await updateEmployeeAction(
      initialUpdateState,
      employeeUpdateFormData([
        {
          ...metadata('identity', 'correction', null, null),
          unexpected: 'not-allowed',
        },
      ]),
    );

    expect(result).toMatchObject({
      status: 'error',
      fieldErrors: {
        historyMetadata: 'Vérifiez la nature des modifications.',
      },
    });
    expect(mocks.updateEmployee).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('keeps a multi-group mutation wholly unsaved when one group is invalid', async () => {
    mocks.updateEmployee.mockRejectedValueOnce(
      new mocks.RepositoryError(
        'A correction reason is required for work_time.',
        'PERSONNEL_HISTORY_METADATA_INVALID',
      ),
    );
    const result = await updateEmployeeAction(
      initialUpdateState,
      employeeUpdateFormData([
        metadata('identity', 'correction', null, null),
        metadata('role', 'change', '2026-09-01', null),
        metadata('work_time', 'correction', null, null),
      ]),
    );

    expect(result).toMatchObject({
      status: 'error',
      fieldErrors: {
        'historyMetadata.work_time.correctionReason':
          'Expliquez brièvement la correction.',
      },
    });
    expect(mocks.updateEmployee).toHaveBeenCalledOnce();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('maps a future effective date clearly to its group field', async () => {
    mocks.updateEmployee.mockRejectedValueOnce(
      new mocks.RepositoryError(
        'The effective date must not be in the future.',
        'PERSONNEL_HISTORY_METADATA_INVALID',
      ),
    );
    const result = await updateEmployeeAction(
      initialUpdateState,
      employeeUpdateFormData([metadata('role', 'change', '2099-01-01', null)]),
    );

    expect(result).toMatchObject({
      status: 'error',
      message: 'Choisissez une date d’effet aujourd’hui ou antérieure.',
      fieldErrors: {
        'historyMetadata.role.effectiveDate':
          'La date d’effet ne peut pas être dans le futur.',
      },
    });
  });

  it('preserves stale revision recovery with the authoritative current dossier', async () => {
    mocks.updateEmployee.mockRejectedValueOnce(
      new mocks.ConflictError(employee),
    );

    await expect(
      updateEmployeeAction(
        initialUpdateState,
        employeeUpdateFormData([
          metadata('identity', 'correction', null, null),
        ]),
      ),
    ).resolves.toMatchObject({
      status: 'conflict',
      currentEmployee: employee,
    });
  });

  it('allows a generic failure retry with the same idempotency identity', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const formData = employeeUpdateFormData([
      metadata('identity', 'correction', null, null),
    ]);
    mocks.updateEmployee
      .mockRejectedValueOnce(new Error('Temporary database failure.'))
      .mockResolvedValueOnce({
        employee,
        updated: true,
        idempotentReplay: false,
      });

    const failed = await updateEmployeeAction(initialUpdateState, formData);
    const retried = await updateEmployeeAction(failed, formData);

    expect(failed).toMatchObject({ status: 'error', currentEmployee: null });
    expect(retried).toMatchObject({
      status: 'success',
      currentEmployee: employee,
    });
    expect(mocks.updateEmployee).toHaveBeenCalledTimes(2);
    expect(mocks.updateEmployee.mock.calls[0]?.[2].idempotencyKey).toBe(
      mocks.updateEmployee.mock.calls[1]?.[2].idempotencyKey,
    );
    consoleError.mockRestore();
  });

  it('preserves an idempotent replay as a single committed command identity', async () => {
    const formData = employeeUpdateFormData([
      metadata('identity', 'correction', null, null),
    ]);
    mocks.updateEmployee.mockResolvedValue({
      employee,
      updated: true,
      idempotentReplay: true,
    });

    await updateEmployeeAction(initialUpdateState, formData);
    await updateEmployeeAction(initialUpdateState, formData);

    expect(mocks.updateEmployee).toHaveBeenCalledTimes(2);
    expect(mocks.updateEmployee.mock.calls[0]?.[2]).toEqual(
      mocks.updateEmployee.mock.calls[1]?.[2],
    );
  });
});

function employeeUpdateFormData(historyMetadata: unknown): FormData {
  const formData = new FormData();
  formData.set('idempotencyKey', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
  formData.set('employeeId', employee.id);
  formData.set('expectedRevision', '2');
  formData.set('givenNames', employee.givenNames);
  formData.set('familyName', employee.familyName);
  formData.set('position', employee.position);
  formData.set('qualification', employee.qualification);
  formData.set('employmentTermType', employee.employmentTermType);
  formData.set('workTimeCategory', employee.workTimeCategory);
  formData.set('contractWeeklyHours', '35');
  formData.set('contractWeeklyMinuteRemainder', '0');
  formData.set('entryDate', employee.entryDate);
  formData.set('confirmFixedTermReasonClear', 'false');
  if (historyMetadata !== undefined) {
    formData.set('historyMetadata', JSON.stringify(historyMetadata));
  }
  return formData;
}

function metadata(
  semanticGroup: string,
  classification: string,
  effectiveDate: string | null,
  correctionReason: string | null,
) {
  return { semanticGroup, classification, effectiveDate, correctionReason };
}
