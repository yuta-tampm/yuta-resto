import type { AuthenticatedSession } from '@yuta/auth';
import type { MembershipRecord, TenantContext } from '@yuta/tenant';
import { randomUUID } from 'node:crypto';
import { PDFDocument } from 'pdf-lib';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const infrastructure = vi.hoisted(() => ({
  session: vi.fn(),
  membership: vi.fn(),
  metadata: vi.fn(),
  employee: vi.fn(),
  documents: vi.fn(),
  audit: vi.fn(),
  grant: vi.fn(),
  update: vi.fn(),
  storedSource: vi.fn(),
  documentRuntime: vi.fn(),
  fetch: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === 'yuta_backoffice_session'
        ? { value: 'fictional-session-token' }
        : undefined,
  }),
}));
vi.mock('next/navigation', () => ({
  redirect: (path: string): never => {
    throw new Error('REDIRECT:' + path);
  },
}));
vi.mock('next/cache', () => ({ revalidatePath: infrastructure.revalidate }));
vi.mock('react', async (original) => ({
  ...(await original<typeof import('react')>()),
  cache: <T>(callback: T): T => callback,
}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { offline: true },
}));
vi.mock('@yuta/db-cloud', async (original) => ({
  ...(await original<typeof import('@yuta/db-cloud')>()),
  createAuthRepository: () => ({ findSession: infrastructure.session }),
  createMembershipLookup: () => ({
    findActiveMembership: infrastructure.membership,
  }),
  findAuthenticatedTenantMetadata: infrastructure.metadata,
  findPersonnelEmployee: infrastructure.employee,
  listPersonnelDocuments: infrastructure.documents,
  recordPersonnelContractExtractionAudit: infrastructure.audit,
  validatePersonnelContractExtractionReviewGrant: infrastructure.grant,
  updatePersonnelEmployee: infrastructure.update,
  resolvePersonnelDocumentExtractionSource: infrastructure.storedSource,
}));
vi.mock('../src/server/personnel-documents/runtime', () => ({
  getPersonnelDocumentRuntime: infrastructure.documentRuntime,
}));
import {
  startContractExtractionAction,
  applyContractExtractionAction,
} from '../src/app/(authenticated)/equipe/salaries/contract-extraction-actions';
import { SyntheticContractPdfPreparer } from '../src/server/personnel-contract-extraction/service';
import { developmentContractExtractionReviewStore } from '../src/server/personnel-contract-extraction/review-store';
const employee = {
  id: '22222222-2222-4222-8222-222222222222',
  givenNames: 'Fictional',
  familyName: 'Employee',
  position: 'Serveur',
  qualification: null,
  employmentTermType: 'indefinite',
  expectedEndDate: null,
  fixedTermReasonCode: null,
  workTimeCategory: 'full_time',
  contractWeeklyMinutes: 2100,
  entryDate: '2026-01-01',
  revision: 4,
};
let request = {
  requestId: randomUUID(),
  employeeId: employee.id,
  documentId: '33333333-3333-4333-8333-333333333333',
  documentVersion: 2,
  employeeRevision: 4,
  scenario: 'complete' as const,
};
const session: AuthenticatedSession = {
  id: 'session-a',
  userId: 'user-a',
  userName: 'Fictional Owner',
  userEmail: 'owner@example.test',
  systemRole: null,
  organizationId: 'org-a',
  establishmentId: 'est-a',
  expiresAt: new Date('2099-01-01'),
};
const membership: MembershipRecord = {
  membershipId: 'member-a',
  userId: 'user-a',
  organizationId: 'org-a',
  establishmentId: 'est-a',
  role: 'OWNER',
  status: 'active',
};
function upload() {
  const file = new File([new Uint8Array([37, 80, 68, 70])], 'fictional.pdf', {
    type: 'application/pdf',
  });
  const form = new FormData();
  form.set('syntheticSource', 'synthetic_upload');
  form.set('syntheticAttestation', 'fictional-only');
  form.set('syntheticPdf', file);
  return { form, read: vi.spyOn(file, 'arrayBuffer') };
}
function selected() {
  return {
    idempotencyKey: randomUUID(),
    request,
    selectedSuggestions: [
      { field: 'position', candidateValue: 'Responsable de salle' },
      { field: 'contractWeeklyMinutes', candidateValue: 2340 },
    ],
  };
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('NODE_ENV', 'development');
  vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
  vi.stubEnv(
    'YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE',
    'deterministic-synthetic',
  );
  vi.stubGlobal('fetch', infrastructure.fetch);
  infrastructure.fetch.mockRejectedValue(new Error('Live API is forbidden'));
  request = { ...request, requestId: randomUUID() };
  infrastructure.session.mockResolvedValue(session);
  infrastructure.membership.mockResolvedValue(membership);
  infrastructure.metadata.mockResolvedValue({
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: [],
  });
  infrastructure.employee.mockResolvedValue(employee);
  infrastructure.documents.mockResolvedValue({
    items: [{ id: request.documentId, version: 2 }],
  });
  infrastructure.audit.mockResolvedValue(undefined);
  infrastructure.grant.mockResolvedValue('valid');
  infrastructure.update.mockResolvedValue({
    employee: {
      ...employee,
      position: 'Responsable de salle',
      contractWeeklyMinutes: 2340,
    },
    updated: true,
    idempotentReplay: false,
  });
});
afterEach(() => {
  developmentContractExtractionReviewStore.delete(
    { organizationId: 'org-a', establishmentId: 'est-a' },
    request.requestId,
  );
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe('actual offline Backoffice extraction and Human apply boundary', () => {
  it('uses real session/membership/permissions and capability composition for generated extraction, completed audit, transient review and explicit bounded apply', async () => {
    const started = await startContractExtractionAction(request);
    expect(started.status).toBe('success');
    expect(infrastructure.update).not.toHaveBeenCalled();
    expect(infrastructure.fetch).not.toHaveBeenCalled();
    expect(infrastructure.employee.mock.calls[0]?.[1]).toMatchObject({
      organizationId: 'org-a',
      establishmentId: 'est-a',
      actor: { role: 'OWNER' },
    });
    expect(
      infrastructure.audit.mock.calls.map((call) => call[2].eventType),
    ).toEqual([
      'employee.contract_extraction_requested',
      'employee.contract_extraction_completed',
    ]);
    expect(
      developmentContractExtractionReviewStore.find(
        { organizationId: 'org-a', establishmentId: 'est-a' },
        request,
      ).status,
    ).toBe('valid');
    await expect(
      applyContractExtractionAction(selected()),
    ).resolves.toMatchObject({ status: 'success' });
    expect(infrastructure.update.mock.calls[0]?.[2]).toMatchObject({
      position: 'Responsable de salle',
      contractWeeklyMinutes: 2340,
      employmentTermType: 'indefinite',
      expectedRevision: 4,
    });
    expect(infrastructure.update.mock.calls[0]?.[5]).toMatchObject({
      selectedFields: ['position', 'contractWeeklyMinutes'],
    });
    expect(
      developmentContractExtractionReviewStore.find(
        { organizationId: 'org-a', establishmentId: 'est-a' },
        request,
      ).status,
    ).toBe('missing');
    await expect(
      applyContractExtractionAction(selected()),
    ).resolves.toMatchObject({ status: 'conflict' });
    expect(infrastructure.update).toHaveBeenCalledTimes(1);
  });
  it('runs an attested fictional upload through actual PDF preparation, capability and review without a provider call', async () => {
    const pdf = await PDFDocument.create();
    for (let page = 0; page < 3; page++) pdf.addPage();
    const bytes = await pdf.save();
    const file = new File([bytes as Uint8Array<ArrayBuffer>], 'fictional.pdf', {
      type: 'application/pdf',
    });
    const read = vi.spyOn(file, 'arrayBuffer');
    const form = new FormData();
    form.set('syntheticSource', 'synthetic_upload');
    form.set('syntheticAttestation', 'fictional-only');
    form.set('syntheticPdf', file);
    await expect(
      startContractExtractionAction(request, form),
    ).resolves.toMatchObject({ status: 'success', result: { pageCount: 3 } });
    expect(read).toHaveBeenCalledTimes(1);
    expect(infrastructure.fetch).not.toHaveBeenCalled();
    expect(infrastructure.update).not.toHaveBeenCalled();
  });
  it('retains the establishment rate limit and stops a denied eleventh attempt before bytes/preparation', async () => {
    infrastructure.session.mockResolvedValue({
      ...session,
      establishmentId: 'rate-limit-fixture',
    });
    infrastructure.membership.mockResolvedValue({
      ...membership,
      establishmentId: 'rate-limit-fixture',
    });
    for (let attempt = 0; attempt < 10; attempt++)
      expect(
        (
          await startContractExtractionAction({
            ...request,
            requestId: randomUUID(),
          })
        ).status,
      ).toBe('success');
    const source = upload();
    const prepare = vi.spyOn(SyntheticContractPdfPreparer.prototype, 'prepare');
    await expect(
      startContractExtractionAction(request, source.form),
    ).resolves.toMatchObject({ status: 'error', code: 'rate_limited' });
    expect(source.read).not.toHaveBeenCalled();
    expect(prepare).not.toHaveBeenCalled();
    expect(infrastructure.fetch).not.toHaveBeenCalled();
  });
  it.each(['organization', 'establishment'])(
    'keeps scoped lookup and denies a foreign %s target before upload bytes/preparation/provider',
    async (boundary) => {
      const target = {
        organizationId: 'org-a',
        establishmentId: 'est-a',
        ...(boundary === 'organization'
          ? { organizationId: 'foreign-org' }
          : { establishmentId: 'foreign-est' }),
      };
      infrastructure.employee.mockImplementation(
        async (_db: unknown, tenant: TenantContext) =>
          tenant.organizationId === target.organizationId &&
          tenant.establishmentId === target.establishmentId
            ? employee
            : null,
      );
      const source = upload();
      const prepare = vi.spyOn(
        SyntheticContractPdfPreparer.prototype,
        'prepare',
      );
      await expect(
        startContractExtractionAction(request, source.form),
      ).resolves.toMatchObject({ status: 'error', code: 'document_stale' });
      expect(source.read).not.toHaveBeenCalled();
      expect(prepare).not.toHaveBeenCalled();
      expect(infrastructure.fetch).not.toHaveBeenCalled();
    },
  );
  it.each(['MANAGER', 'STAFF'] as const)(
    'denies %s permissions before bytes or resource access',
    async (role) => {
      infrastructure.membership.mockResolvedValue({ ...membership, role });
      const source = upload();
      await expect(
        startContractExtractionAction(request, source.form),
      ).rejects.toThrow('Permission denied');
      expect(infrastructure.employee).not.toHaveBeenCalled();
      expect(source.read).not.toHaveBeenCalled();
      expect(infrastructure.fetch).not.toHaveBeenCalled();
    },
  );
  it.each([null, { ...membership, status: 'suspended' }])(
    'denies inactive or missing membership before resource/file effects',
    async (member) => {
      infrastructure.membership.mockResolvedValue(member);
      const source = upload();
      await expect(
        startContractExtractionAction(request, source.form),
      ).rejects.toThrow();
      expect(infrastructure.employee).not.toHaveBeenCalled();
      expect(source.read).not.toHaveBeenCalled();
    },
  );
  it('denies unavailable exposure before session/file/provider effects', async () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'release-a');
    const source = upload();
    await expect(
      startContractExtractionAction(request, source.form),
    ).rejects.toThrow('exposure=unavailable');
    expect(infrastructure.session).not.toHaveBeenCalled();
    expect(source.read).not.toHaveBeenCalled();
    expect(infrastructure.fetch).not.toHaveBeenCalled();
  });
  it.each([{ employeeRevision: 99 }, { documentVersion: 99 }])(
    'denies stale exact versions %j before uploaded bytes/preparation',
    async (stale) => {
      const source = upload();
      const prepare = vi.spyOn(
        SyntheticContractPdfPreparer.prototype,
        'prepare',
      );
      await expect(
        startContractExtractionAction({ ...request, ...stale }, source.form),
      ).resolves.toMatchObject({ status: 'error' });
      expect(source.read).not.toHaveBeenCalled();
      expect(prepare).not.toHaveBeenCalled();
      expect(infrastructure.fetch).not.toHaveBeenCalled();
    },
  );
  it.each([
    'classification',
    'purpose',
    'deployment',
    'model',
    'provider',
    'organizationId',
  ])(
    'rejects browser authority override %s through strict request schema',
    async (key) => {
      const source = upload();
      await expect(
        startContractExtractionAction(
          { ...request, [key]: 'untrusted' },
          source.form,
        ),
      ).resolves.toMatchObject({ status: 'error' });
      expect(infrastructure.employee).not.toHaveBeenCalled();
      expect(source.read).not.toHaveBeenCalled();
      expect(infrastructure.fetch).not.toHaveBeenCalled();
    },
  );
  it('rejects missing upload attestation without reading bytes', async () => {
    const source = upload();
    source.form.delete('syntheticAttestation');
    await expect(
      startContractExtractionAction(request, source.form),
    ).resolves.toMatchObject({ status: 'error' });
    expect(source.read).not.toHaveBeenCalled();
  });
  it('preserves completed audit and review-save errors without swallowing them as observation failures', async () => {
    infrastructure.audit.mockImplementation(
      async (_db: unknown, _tenant: unknown, event: { eventType: string }) => {
        if (event.eventType === 'employee.contract_extraction_completed')
          throw new Error('audit unavailable');
      },
    );
    await expect(startContractExtractionAction(request)).resolves.toMatchObject(
      { status: 'error' },
    );
    expect(
      developmentContractExtractionReviewStore.find(
        { organizationId: 'org-a', establishmentId: 'est-a' },
        request,
      ).status,
    ).toBe('missing');
    expect(infrastructure.update).not.toHaveBeenCalled();
    infrastructure.audit.mockResolvedValue(undefined);
    vi.spyOn(
      developmentContractExtractionReviewStore,
      'save',
    ).mockImplementation(() => {
      throw new Error('review unavailable');
    });
    await expect(startContractExtractionAction(request)).resolves.toMatchObject(
      { status: 'error' },
    );
    expect(infrastructure.update).not.toHaveBeenCalled();
  });
  it.each([
    'expired',
    'fabricated',
    'cross-scope',
    'stale',
    'missing-proof',
  ] as const)(
    'denies %s review apply without employee effects',
    async (reason) => {
      if (reason !== 'fabricated')
        expect((await startContractExtractionAction(request)).status).toBe(
          'success',
        );
      if (reason === 'expired')
        vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 16 * 60 * 1000);
      if (reason === 'cross-scope') {
        infrastructure.session.mockResolvedValue({
          ...session,
          establishmentId: 'other-est',
        });
        infrastructure.membership.mockResolvedValue({
          ...membership,
          establishmentId: 'other-est',
        });
      }
      if (reason === 'stale')
        infrastructure.employee.mockResolvedValue({ ...employee, revision: 5 });
      if (reason === 'missing-proof')
        infrastructure.grant.mockResolvedValue('missing');
      await expect(
        applyContractExtractionAction(selected()),
      ).resolves.toMatchObject({ status: 'conflict' });
      expect(infrastructure.update).not.toHaveBeenCalled();
    },
  );
  it('rechecks current membership/role on apply and rejects non-allowlisted or fabricated suggestions', async () => {
    expect((await startContractExtractionAction(request)).status).toBe(
      'success',
    );
    infrastructure.membership.mockResolvedValue({
      ...membership,
      role: 'STAFF',
    });
    await expect(applyContractExtractionAction(selected())).rejects.toThrow(
      'Permission denied',
    );
    infrastructure.membership.mockResolvedValue(membership);
    await expect(
      applyContractExtractionAction({
        ...selected(),
        selectedSuggestions: [
          { field: 'employmentTermType', candidateValue: 'fixed_term' },
        ],
      }),
    ).resolves.toMatchObject({ status: 'error' });
    expect(infrastructure.update).not.toHaveBeenCalled();
    await expect(
      applyContractExtractionAction({
        ...selected(),
        selectedSuggestions: [
          { field: 'position', candidateValue: 'Fabricated' },
        ],
      }),
    ).resolves.toMatchObject({ status: 'error' });
    expect(infrastructure.update).not.toHaveBeenCalled();
  });
});
