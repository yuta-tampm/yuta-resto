import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import type { PersonnelRegisterEntry } from '@yuta/contracts/personnel';
import type { TenantContext } from '@yuta/tenant';
import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
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
vi.mock('../src/app/(authenticated)/equipe/registre-personnel/actions', () => ({
  correctPersonnelRegisterAction: vi.fn(),
  inscribePersonnelRegisterAction: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));
// The Radix dialog portal renders nothing on the server; keep the real dialog
// context but render open content inline so SSR markup can be asserted.
vi.mock('@yuta/ui', async (importOriginal) => {
  const { createElement } = await import('react');
  const ui = await importOriginal<typeof import('@yuta/ui')>();
  return {
    ...ui,
    Dialog: ({ open, children }: { open: boolean; children: ReactNode }) =>
      open ? createElement(ui.Dialog, { open }, children) : null,
    DialogContent: ({ children }: { children: ReactNode }) =>
      createElement('div', { role: 'dialog' }, children),
  };
});

import Page from '../src/app/(authenticated)/equipe/registre-personnel/page';
import { RegisterDialog } from '../src/app/(authenticated)/equipe/registre-personnel/_components/personnel-register-dialog';
import { CorrectionJustificationFields } from '../src/app/(authenticated)/equipe/registre-personnel/_components/personnel-register-fields';

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
    const markup = renderToStaticMarkup(
      <CorrectionJustificationFields businessDate="2026-10-04" />,
    );
    expect(markup).toMatch(
      /<input[^>]*name="effectiveDate"[^>]*value="2026-10-04"|<input[^>]*value="2026-10-04"[^>]*name="effectiveDate"/,
    );
  });

  it('defaults the correction dialog effective date to its business date', () => {
    const markup = renderToStaticMarkup(
      <RegisterDialog
        mode="correct"
        entry={registerEntry()}
        businessDate="2026-10-04"
        open
        onOpenChange={vi.fn()}
      />,
    );
    expect(markup).toContain('Corriger l’inscription n° 1');
    expect(markup).toMatch(
      /<input[^>]*name="effectiveDate"[^>]*value="2026-10-04"|<input[^>]*value="2026-10-04"[^>]*name="effectiveDate"/,
    );
  });

  it('keeps client Register components from deriving a UTC day', () => {
    for (const file of [
      'personnel-register-page.tsx',
      'personnel-register-dialog.tsx',
      'personnel-register-fields.tsx',
    ]) {
      expect(
        readFileSync(
          new URL(
            `../src/app/(authenticated)/equipe/registre-personnel/_components/${file}`,
            import.meta.url,
          ),
          'utf8',
        ),
      ).not.toContain('new Date().toISOString()');
    }
  });
});

function registerEntry(): PersonnelRegisterEntry {
  return {
    id: '0198c7af-37b8-7aa6-af0e-7fef3b81aaf1',
    employeeId: '0198c7af-37b8-7aa6-af0e-7fef3b81aaf2',
    sequence: 1,
    revision: 1,
    inscribedAt: '2026-08-18T10:00:00.000Z',
    updatedAt: '2026-08-18T10:00:00.000Z',
    facts: {
      givenNames: 'Camille',
      familyName: 'Durand',
      nationalityCode: 'FR',
      nationalityLabel: 'Française',
      birthDate: '1994-05-12',
      sex: 'F',
      position: 'Cheffe de rang',
      qualification: 'Employée qualifiée',
      entryDate: '2026-08-01',
      departureDate: null,
      protectedAuthorization: {
        required: false,
        authorizationDate: null,
        requestDate: null,
      },
      workAuthorization: {
        required: false,
        titleType: null,
        orderNumber: null,
      },
      employmentTermType: 'indefinite',
      workTimeCategory: 'full_time',
      temporaryWorkCompany: null,
      employerGroup: null,
      specialContract: 'none',
    },
  };
}
