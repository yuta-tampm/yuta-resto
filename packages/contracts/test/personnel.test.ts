import { describe, expect, it } from 'vitest';
import {
  createPersonnelEmployeeInputSchema,
  personnelEmployeeAccessHistorySchema,
  personnelEmployeeAuditHistorySchema,
  personnelEmployeeListQuerySchema,
  personnelEmployeeSummarySchema,
  personnelDocumentListSchema,
  savePersonnelDocumentMetadataInputSchema,
  setPersonnelEmployeeDepartureInputSchema,
  updatePersonnelEmployeeInputSchema,
} from '../src/personnel';

describe('personnel contracts', () => {
  it('applies safe list defaults and rejects unbounded input', () => {
    expect(personnelEmployeeListQuerySchema.parse({})).toEqual({
      view: 'active',
      search: '',
      completeness: 'all',
      limit: 25,
    });
    expect(
      personnelEmployeeListQuerySchema.safeParse({ limit: 101 }).success,
    ).toBe(false);
    expect(
      personnelEmployeeListQuerySchema.safeParse({ view: 'deleted' }).success,
    ).toBe(false);
  });

  it('validates the minimum create command and fixed-term dates', () => {
    const base = {
      idempotencyKey: '11111111-1111-4111-8111-111111111111',
      givenNames: ' Élodie ',
      familyName: ' Martin ',
      position: 'Cheffe de rang',
      qualification: 'Employée qualifiée',
      employmentTermType: 'indefinite',
      expectedEndDate: null,
      workTimeCategory: 'full_time',
      entryDate: '2026-08-13',
      confirmDuplicate: false,
      duplicateOverrideReason: null,
    };
    expect(createPersonnelEmployeeInputSchema.parse(base).givenNames).toBe(
      'Élodie',
    );
    expect(
      createPersonnelEmployeeInputSchema.safeParse({
        ...base,
        employmentTermType: 'fixed_term',
      }).success,
    ).toBe(false);
    expect(
      createPersonnelEmployeeInputSchema.safeParse({
        ...base,
        confirmDuplicate: true,
      }).success,
    ).toBe(false);
  });

  it('keeps trusted tenant and actor fields out of employee responses', () => {
    const parsed = personnelEmployeeSummarySchema.parse({
      id: '11111111-1111-4111-8111-111111111111',
      givenNames: 'Élodie',
      familyName: 'Martin',
      position: 'Cheffe de rang',
      qualification: 'Employée qualifiée',
      employmentTermType: 'indefinite',
      expectedEndDate: null,
      workTimeCategory: 'full_time',
      entryDate: '2026-01-02',
      departureDate: null,
      view: 'active',
      completenessReasons: [],
      revision: 1,
      createdAt: '2026-01-02T10:00:00.000Z',
      updatedAt: '2026-01-02T10:00:00.000Z',
    });
    expect(parsed).not.toHaveProperty('organizationId');
    expect(parsed).not.toHaveProperty('establishmentId');
    expect(parsed).not.toHaveProperty('actorId');
    expect(
      personnelEmployeeSummarySchema.parse({
        ...parsed,
        position: '',
        completenessReasons: ['position_missing'],
      }),
    ).toMatchObject({
      position: '',
      completenessReasons: ['position_missing'],
    });
    expect(
      personnelEmployeeSummarySchema.safeParse({
        ...parsed,
        completenessReasons: ['unknown_reason'],
      }).success,
    ).toBe(false);
  });

  it('exposes only the bounded employee audit-history contract', () => {
    const parsed = personnelEmployeeAuditHistorySchema.parse({
      items: [
        {
          id: '11111111-1111-4111-8111-111111111111',
          eventType: 'employee.identity_updated',
          changedFields: ['givenNames'],
          actorDisplayName: 'Propriétaire test',
          occurredAt: '2026-08-14T10:00:00.000Z',
          reason: null,
          previousDepartureDate: null,
          newDepartureDate: null,
        },
      ],
      truncated: false,
    });

    expect(parsed.items[0]?.eventType).toBe('employee.identity_updated');
    expect(parsed.items[0]).not.toHaveProperty('organizationId');
    expect(parsed.items[0]).not.toHaveProperty('establishmentId');
    expect(parsed.items[0]).not.toHaveProperty('operationId');
    expect(parsed.items[0]).not.toHaveProperty('metadata');
    expect(
      personnelEmployeeAuditHistorySchema.safeParse({
        ...parsed,
        items: [{ ...parsed.items[0], eventType: 'employee.password_viewed' }],
      }).success,
    ).toBe(false);
  });

  it('exposes only allowlisted employee access-history fields', () => {
    const parsed = personnelEmployeeAccessHistorySchema.parse({
      items: [
        {
          id: '11111111-1111-4111-8111-111111111111',
          eventType: 'employee.dossier_viewed',
          actorDisplayName: 'Propriétaire test',
          occurredAt: '2026-08-14T10:00:00.000Z',
        },
      ],
      pageInfo: { hasMore: false, nextCursor: null },
    });

    expect(parsed.items[0]).not.toHaveProperty('organizationId');
    expect(parsed.items[0]).not.toHaveProperty('establishmentId');
    expect(parsed.items[0]).not.toHaveProperty('operationId');
    expect(parsed.items[0]).not.toHaveProperty('metadata');
    expect(
      personnelEmployeeAccessHistorySchema.safeParse({
        ...parsed,
        items: [{ ...parsed.items[0], eventType: 'employee.password_viewed' }],
      }).success,
    ).toBe(false);
  });

  it('validates guarded employee updates and fixed-term dates', () => {
    const base = {
      idempotencyKey: '11111111-1111-4111-8111-111111111111',
      employeeId: '22222222-2222-4222-8222-222222222222',
      expectedRevision: '2',
      givenNames: ' Élodie ',
      familyName: ' Martin ',
      position: 'Cheffe de rang',
      qualification: 'Employée qualifiée',
      employmentTermType: 'indefinite',
      expectedEndDate: null,
      workTimeCategory: 'full_time',
      entryDate: '2026-08-13',
    };
    const parsed = updatePersonnelEmployeeInputSchema.parse(base);
    expect(parsed.expectedRevision).toBe(2);
    expect(parsed.givenNames).toBe('Élodie');
    expect(
      updatePersonnelEmployeeInputSchema.safeParse({
        ...base,
        expectedRevision: 0,
      }).success,
    ).toBe(false);
    expect(
      updatePersonnelEmployeeInputSchema.safeParse({
        ...base,
        employmentTermType: 'fixed_term',
      }).success,
    ).toBe(false);
  });

  it('requires an explicit non-deletion confirmation for departure commands', () => {
    const base = {
      idempotencyKey: '11111111-1111-4111-8111-111111111111',
      employeeId: '22222222-2222-4222-8222-222222222222',
      expectedRevision: '1',
      departureDate: '2026-08-13',
      correctionReason: null,
      confirmNonDeletion: true,
    };
    expect(
      setPersonnelEmployeeDepartureInputSchema.parse(base).expectedRevision,
    ).toBe(1);
    expect(
      setPersonnelEmployeeDepartureInputSchema.safeParse({
        ...base,
        confirmNonDeletion: false,
      }).success,
    ).toBe(false);
    expect(
      setPersonnelEmployeeDepartureInputSchema.safeParse({
        ...base,
        correctionReason: 'x',
      }).success,
    ).toBe(false);
  });

  it('limits the first personnel document slice to a bounded signed-contract PDF', () => {
    const metadata = {
      idempotencyKey: '11111111-1111-4111-8111-111111111111',
      employeeId: '22222222-2222-4222-8222-222222222222',
      expectedRevision: null,
      category: 'signed_employment_contract',
      filename: 'contrat-signe.pdf',
      mediaType: 'application/pdf',
      byteSize: 428_000,
      checksum: 'a'.repeat(64),
      storageKey: '33333333-3333-4333-8333-333333333333',
    };
    expect(savePersonnelDocumentMetadataInputSchema.parse(metadata)).toEqual(
      metadata,
    );
    expect(
      savePersonnelDocumentMetadataInputSchema.safeParse({
        ...metadata,
        mediaType: 'image/png',
      }).success,
    ).toBe(false);
    expect(
      savePersonnelDocumentMetadataInputSchema.safeParse({
        ...metadata,
        byteSize: 10 * 1024 * 1024 + 1,
      }).success,
    ).toBe(false);

    const response = personnelDocumentListSchema.parse({
      items: [
        {
          id: '44444444-4444-4444-8444-444444444444',
          employeeId: metadata.employeeId,
          category: metadata.category,
          filename: metadata.filename,
          mediaType: metadata.mediaType,
          byteSize: metadata.byteSize,
          version: 1,
          revision: 1,
          uploadedAt: '2026-08-15T10:00:00.000Z',
        },
      ],
    });
    expect(response.items[0]).not.toHaveProperty('storageKey');
    expect(response.items[0]).not.toHaveProperty('checksum');
    expect(response.items[0]).not.toHaveProperty('organizationId');
  });
});
