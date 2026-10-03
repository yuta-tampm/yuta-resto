import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import type { TenantContext } from '@yuta/tenant';
import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  listRegister: vi.fn(),
  listCandidates: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  listPersonnelRegister: mocks.listRegister,
  listPersonnelRegisterCandidates: mocks.listCandidates,
}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { kind: 'test-cloud-database' },
}));
vi.mock('../src/server/auth/session', () => ({
  requireAuthenticatedTenant: vi.fn(async () => ({ tenant: mocks.tenant })),
}));
vi.mock(
  '../src/app/(authenticated)/equipe/registre-personnel/_lib/personnel-register-runtime',
  () => ({ isPersonnelRegisterEnabled: () => true }),
);
vi.mock(
  '../src/app/(authenticated)/equipe/registre-personnel/_components/personnel-register-page',
  () => ({ PersonnelRegisterPage: () => null }),
);

import Page from '../src/app/(authenticated)/equipe/registre-personnel/page';

const registerData = {
  items: [],
  pageInfo: { nextCursor: null },
  readiness: 'ready',
  snapshotRevision: 1,
};

function context(timezone: string): TenantContext {
  return {
    organizationId: randomUUID(),
    establishmentId: randomUUID(),
    actor: {
      type: 'user',
      userId: randomUUID(),
      membershipId: randomUUID(),
      role: 'OWNER',
    },
    locale: 'fr-FR',
    timezone,
    entitlements: new Set(),
  };
}

async function renderedProps(): Promise<Record<string, unknown>> {
  const element: unknown = await Page();
  if (!isValidElement(element)) throw new Error('Expected a React element.');
  return (element as ReactElement<Record<string, unknown>>).props;
}

describe('Personnel Register correction business date', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    mocks.listRegister.mockReset();
    mocks.listRegister.mockResolvedValue(registerData);
    mocks.listCandidates.mockReset();
    mocks.listCandidates.mockResolvedValue({ items: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('uses the establishment day just after Paris midnight, not the UTC day', async () => {
    vi.setSystemTime(new Date('2026-10-03T22:30:00.000Z'));
    mocks.tenant = context('Europe/Paris');

    const props = await renderedProps();

    expect(new Date().toISOString().slice(0, 10)).toBe('2026-10-03');
    expect(props.businessDate).toBe('2026-10-04');
    expect(props.locale).toBe('fr-FR');
  });

  it('keeps the Paris day just before midnight', async () => {
    vi.setSystemTime(new Date('2026-10-03T21:59:00.000Z'));
    mocks.tenant = context('Europe/Paris');

    expect((await renderedProps()).businessDate).toBe('2026-10-03');
  });

  it('derives the day from the trusted tenant timezone', async () => {
    vi.setSystemTime(new Date('2026-10-03T22:30:00.000Z'));
    mocks.tenant = context('America/New_York');

    expect((await renderedProps()).businessDate).toBe('2026-10-03');
  });

  it('uses the supplied business date as the correction default', () => {
    const source = readFileSync(
      'src/app/(authenticated)/equipe/registre-personnel/_components/personnel-register-page.tsx',
      'utf8',
    );
    expect(source).toContain('defaultValue={props.businessDate}');
    expect(source).not.toContain('new Date().toISOString()');
  });
});
