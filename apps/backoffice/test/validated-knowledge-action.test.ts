import { randomUUID } from 'node:crypto';
import { TenantError, type TenantContext, type TenantRole } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  denyManage: false,
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  createRestaurantKnowledgeValidatedItem: mocks.create,
  updateRestaurantKnowledgeValidatedItem: mocks.update,
  removeRestaurantKnowledgeValidatedItem: mocks.remove,
  saveRestaurantKnowledgeConceptHistory: vi.fn(),
  saveRestaurantKnowledgeCommunicationIdentity: vi.fn(),
  saveRestaurantKnowledgeCuisineKnowHow: vi.fn(),
  saveRestaurantKnowledgeCustomerExperience: vi.fn(),
  saveRestaurantKnowledgeTeamCulture: vi.fn(),
  updateEstablishmentProfile: vi.fn(),
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { test: true },
}));
vi.mock('../src/server/auth/session', () => ({
  requireAuthenticatedTenant: vi.fn(async () => ({ tenant: mocks.tenant })),
}));
vi.mock('../src/server/auth/permissions', async () => {
  const actual = await vi.importActual<
    typeof import('../src/server/auth/permissions')
  >('../src/server/auth/permissions');
  return {
    ...actual,
    requireRestaurantKnowledgePermission: (
      ...args: Parameters<typeof actual.requireRestaurantKnowledgePermission>
    ) => {
      if (mocks.denyManage) {
        throw new TenantError(
          'Permission denied.',
          'CROSS_TENANT_ACCESS_DENIED',
          403,
        );
      }
      return actual.requireRestaurantKnowledgePermission(...args);
    },
  };
});

import {
  createValidatedKnowledgeAction,
  removeValidatedKnowledgeAction,
  updateValidatedKnowledgeAction,
  type ValidatedKnowledgeActionState,
} from '../src/app/(authenticated)/etablissement/informations-generales/actions';

const initial: ValidatedKnowledgeActionState = {
  status: 'idle',
  message: null,
  fieldError: null,
  item: null,
  removedItemId: null,
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

describe('Validated Knowledge actions', () => {
  beforeEach(() => {
    mocks.denyManage = false;
    mocks.create.mockReset();
    mocks.update.mockReset();
    mocks.remove.mockReset();
    mocks.revalidatePath.mockReset();
  });

  it.each(['OWNER', 'MANAGER'] as const)(
    'creates with MANAGE for %s and preserves whitespace exactly',
    async (role) => {
      mocks.tenant = context(role);
      const id = randomUUID();
      mocks.create.mockResolvedValue({ id, statement: ' abc ' });
      const data = new FormData();
      data.set('statement', ' abc ');
      data.set('id', randomUUID());
      data.set('organizationId', randomUUID());
      data.set('role', 'STAFF');
      await expect(
        createValidatedKnowledgeAction(initial, data),
      ).resolves.toMatchObject({
        status: 'success',
        item: { id, statement: ' abc ' },
      });
      expect(mocks.create).toHaveBeenCalledWith(
        { test: true },
        mocks.tenant,
        ' abc ',
      );
      expect(mocks.revalidatePath).toHaveBeenCalledTimes(1);
    },
  );

  it.each(['', '   ', '\n\t '])(
    'rejects create %j before persistence',
    async (statement) => {
      mocks.tenant = context('OWNER');
      const data = new FormData();
      data.set('statement', statement);
      const result = await createValidatedKnowledgeAction(initial, data);
      expect(result.status).toBe('error');
      expect(result.fieldError).toContain('au moins un caractère');
      expect(mocks.create).not.toHaveBeenCalled();
      expect(mocks.remove).not.toHaveBeenCalled();
      expect(mocks.revalidatePath).not.toHaveBeenCalled();
    },
  );

  it('rejects a blank edit without update, remove, or success revalidation', async () => {
    mocks.tenant = context('MANAGER');
    const data = new FormData();
    data.set('id', randomUUID());
    data.set('statement', '   ');
    const result = await updateValidatedKnowledgeAction(initial, data);
    expect(result.status).toBe('error');
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.remove).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('updates one item and reports a missing stale item as an error', async () => {
    mocks.tenant = context('OWNER');
    const id = randomUUID();
    const data = new FormData();
    data.set('id', id);
    data.set('statement', '  a  ');
    mocks.update.mockResolvedValueOnce({ id, statement: '  a  ' });
    await expect(
      updateValidatedKnowledgeAction(initial, data),
    ).resolves.toMatchObject({
      status: 'success',
      item: { id, statement: '  a  ' },
    });
    mocks.revalidatePath.mockReset();
    mocks.update.mockResolvedValueOnce(null);
    await expect(
      updateValidatedKnowledgeAction(initial, data),
    ).resolves.toMatchObject({
      status: 'error',
      message: 'Cette connaissance n’existe plus.',
    });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('removes only through the explicit remove action', async () => {
    mocks.tenant = context('OWNER');
    const id = randomUUID();
    mocks.remove.mockResolvedValue(true);
    const data = new FormData();
    data.set('id', id);
    await expect(
      removeValidatedKnowledgeAction(initial, data),
    ).resolves.toMatchObject({
      status: 'success',
      removedItemId: id,
    });
    expect(mocks.remove).toHaveBeenCalledWith({ test: true }, mocks.tenant, id);
  });

  it('denies STAFF and an independent MANAGE denial before parsing or persistence', async () => {
    for (const tenant of [context('STAFF'), context('OWNER')]) {
      mocks.tenant = tenant;
      mocks.denyManage =
        tenant.actor.type === 'user' && tenant.actor.role === 'OWNER';
      await expect(
        createValidatedKnowledgeAction(initial, new FormData()),
      ).rejects.toThrow('Permission denied.');
    }
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.remove).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
