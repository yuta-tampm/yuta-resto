import { describe, expect, it } from 'vitest';
import {
  createPersonnelContractAmendmentMetadataInputSchema,
  createPersonnelEmployeeInputSchema,
  applyPersonnelContractExtractionInputSchema,
  personnelContractAmendmentListSchema,
  personnelContractExtractionReviewResultSchema,
  personnelActionOverviewQuerySchema,
  personnelActionOverviewResponseSchema,
  personnelEmployeeAccessHistorySchema,
  personnelEmployeeAuditHistorySchema,
  personnelEmployeeListQuerySchema,
  personnelEmployeeSummarySchema,
  personnelDocumentListSchema,
  personnelRegisterFactsSchema,
  personnelRegisterPageSchema,
  savePersonnelDocumentMetadataInputSchema,
  replacePersonnelContractAmendmentMetadataInputSchema,
  setPersonnelEmployeeDepartureInputSchema,
  updatePersonnelEmployeeInputSchema,
} from '../src/personnel';

describe('personnel contracts', () => {
  it('accepts only bounded, allowlisted contract extraction results', () => {
    const result = {
      schemaVersion: 1,
      requestId: '11111111-1111-4111-8111-111111111111',
      document: {
        id: '22222222-2222-4222-8222-222222222222',
        version: 2,
      },
      employeeRevision: 3,
      status: 'complete',
      pageCount: 3,
      suggestions: [
        {
          field: 'position',
          candidateValue: 'Chef de rang',
          confidence: 'high',
          sourcePage: 2,
          excerpt: 'Le salarié exercera les fonctions de chef de rang.',
          issueCodes: [],
        },
        {
          field: 'employmentTermType',
          candidateValue: 'fixed_term',
          confidence: 'medium',
          sourcePage: 1,
          excerpt: 'Le présent contrat est conclu pour une durée déterminée.',
          issueCodes: ['blocked_by_dependency'],
        },
      ],
      warnings: [],
      expiresAt: '2026-08-18T10:15:00.000Z',
    } as const;

    expect(personnelContractExtractionReviewResultSchema.parse(result)).toEqual(
      result,
    );
    expect(
      personnelContractExtractionReviewResultSchema.safeParse({
        ...result,
        providerPayload: { prompt: 'not allowed' },
      }).success,
    ).toBe(false);
    expect(
      personnelContractExtractionReviewResultSchema.safeParse({
        ...result,
        suggestions: [{ ...result.suggestions[0], sourcePage: 4 }],
      }).success,
    ).toBe(false);
    expect(
      personnelContractExtractionReviewResultSchema.safeParse({
        ...result,
        suggestions: [{ ...result.suggestions[0], excerpt: 'x'.repeat(241) }],
      }).success,
    ).toBe(false);
  });

  it('limits extraction apply input to supported fields and unique choices', () => {
    const request = {
      requestId: '11111111-1111-4111-8111-111111111111',
      employeeId: '33333333-3333-4333-8333-333333333333',
      documentId: '22222222-2222-4222-8222-222222222222',
      documentVersion: 2,
      employeeRevision: 3,
      scenario: 'complete',
    } as const;
    expect(
      applyPersonnelContractExtractionInputSchema.safeParse({
        idempotencyKey: '44444444-4444-4444-8444-444444444444',
        request,
        selectedSuggestions: [
          { field: 'position', candidateValue: 'Chef de rang' },
          { field: 'contractWeeklyMinutes', candidateValue: 2_100 },
        ],
      }).success,
    ).toBe(true);
    expect(
      applyPersonnelContractExtractionInputSchema.safeParse({
        idempotencyKey: '44444444-4444-4444-8444-444444444444',
        request,
        selectedSuggestions: [
          { field: 'employmentTermType', candidateValue: 'fixed_term' },
        ],
      }).success,
    ).toBe(false);
    expect(
      applyPersonnelContractExtractionInputSchema.safeParse({
        idempotencyKey: '44444444-4444-4444-8444-444444444444',
        request,
        selectedSuggestions: [
          { field: 'position', candidateValue: 'Chef de rang' },
          { field: 'position', candidateValue: 'Serveur' },
        ],
      }).success,
    ).toBe(false);
  });

  it('validates complete register facts and keeps transport scope-free', () => {
    const facts = personnelRegisterFactsSchema.parse({
      givenNames: 'Camille',
      familyName: 'Martin',
      nationalityCode: 'FR',
      nationalityLabel: 'Française',
      birthDate: '1990-04-12',
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
    });
    expect(
      personnelRegisterFactsSchema.safeParse({
        ...facts,
        workAuthorization: {
          required: true,
          titleType: null,
          orderNumber: null,
        },
      }).success,
    ).toBe(false);
    const page = personnelRegisterPageSchema.parse({
      items: [
        {
          id: '11111111-1111-4111-8111-111111111111',
          employeeId: '22222222-2222-4222-8222-222222222222',
          sequence: 1,
          revision: 1,
          facts,
          inscribedAt: '2026-08-18T10:00:00.000Z',
          updatedAt: '2026-08-18T10:00:00.000Z',
        },
      ],
      snapshotRevision: 1,
      readiness: 'ready',
      pageInfo: { hasMore: false, nextCursor: null },
    });
    expect(page.items[0]).not.toHaveProperty('organizationId');
    expect(page.items[0]).not.toHaveProperty('actorUserId');
  });

  it('keeps the action overview bounded and free of tenant or file metadata', () => {
    const overview = personnelActionOverviewResponseSchema.parse({
      corrections: {
        items: [
          {
            employeeId: '11111111-1111-4111-8111-111111111111',
            employeeDisplayName: 'Camille Martin',
            kind: 'missing_signed_base_contract',
          },
        ],
        pageInfo: { hasMore: false, nextCursor: null },
        documentSourceStatus: 'ready',
      },
      departures: {
        items: [
          {
            employeeId: '22222222-2222-4222-8222-222222222222',
            employeeDisplayName: 'Hugo Petit',
            kind: 'departure_within_five_days',
            departureDate: '2026-08-19',
          },
        ],
        pageInfo: { hasMore: false, nextCursor: null },
      },
    });
    expect(overview.corrections.items[0]).not.toHaveProperty('organizationId');
    expect(overview.corrections.items[0]).not.toHaveProperty('filename');
    expect(overview.corrections.items[0]).not.toHaveProperty('storageKey');
    expect(
      personnelActionOverviewResponseSchema.safeParse({
        ...overview,
        corrections: {
          ...overview.corrections,
          items: Array.from({ length: 6 }, () => overview.corrections.items[0]),
        },
      }).success,
    ).toBe(false);
  });

  it('rejects unknown or oversized action-overview cursors', () => {
    expect(personnelActionOverviewQuerySchema.parse({})).toEqual({});
    expect(
      personnelActionOverviewQuerySchema.safeParse({ unknown: 'value' })
        .success,
    ).toBe(false);
    expect(
      personnelActionOverviewQuerySchema.safeParse({
        correctionCursor: 'x'.repeat(501),
      }).success,
    ).toBe(false);
  });

  it('applies safe list defaults and rejects unbounded input', () => {
    expect(personnelEmployeeListQuerySchema.parse({})).toEqual({
      view: 'active',
      search: '',
      completeness: 'all',
      sort: 'entry_date_desc',
      limit: 25,
    });
    expect(
      personnelEmployeeListQuerySchema.safeParse({ limit: 101 }).success,
    ).toBe(false);
    expect(
      personnelEmployeeListQuerySchema.safeParse({ view: 'deleted' }).success,
    ).toBe(false);
    expect(
      personnelEmployeeListQuerySchema.safeParse({ sort: 'qualification_asc' })
        .success,
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
      fixedTermReasonCode: null,
      workTimeCategory: 'full_time',
      contractWeeklyMinutes: 2_100,
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
        expectedEndDate: '2026-12-31',
      }).success,
    ).toBe(false);
    expect(
      createPersonnelEmployeeInputSchema.safeParse({
        ...base,
        employmentTermType: 'fixed_term',
        expectedEndDate: '2026-12-31',
        fixedTermReasonCode: 'seasonal_employment',
      }).success,
    ).toBe(true);
    expect(
      createPersonnelEmployeeInputSchema.safeParse({
        ...base,
        contractWeeklyMinutes: 1,
      }).success,
    ).toBe(true);
    expect(
      createPersonnelEmployeeInputSchema.safeParse({
        ...base,
        contractWeeklyMinutes: 2_880,
      }).success,
    ).toBe(true);
    expect(
      createPersonnelEmployeeInputSchema.safeParse({
        ...base,
        contractWeeklyMinutes: 0,
      }).success,
    ).toBe(false);
    expect(
      createPersonnelEmployeeInputSchema.safeParse({
        ...base,
        employmentTermType: 'fixed_term',
        expectedEndDate: '2026-12-31',
        fixedTermReasonCode: 'other',
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
      fixedTermReasonCode: null,
      workTimeCategory: 'full_time',
      contractWeeklyMinutes: 2_100,
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
      fixedTermReasonCode: null,
      workTimeCategory: 'full_time',
      contractWeeklyMinutes: null,
      entryDate: '2026-08-13',
      confirmFixedTermReasonClear: false,
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
    expect(
      updatePersonnelEmployeeInputSchema.safeParse({
        ...base,
        employmentTermType: 'fixed_term',
        expectedEndDate: '2026-12-31',
        fixedTermReasonCode: 'customary_use_employment',
        contractWeeklyMinutes: 1,
      }).success,
    ).toBe(true);
    expect(
      updatePersonnelEmployeeInputSchema.safeParse({
        ...base,
        contractWeeklyMinutes: 2_881,
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

  it('keeps signed amendments distinct, bounded, and storage-safe', () => {
    const createInput = {
      idempotencyKey: '11111111-1111-4111-8111-111111111111',
      employeeId: '22222222-2222-4222-8222-222222222222',
      effectiveDate: '2026-09-01',
      reference: 'Avenant 1',
      filename: 'avenant-signe.pdf',
      mediaType: 'application/pdf',
      byteSize: 512_000,
      checksum: 'b'.repeat(64),
      storageKey: '33333333-3333-4333-8333-333333333333',
    };
    expect(
      createPersonnelContractAmendmentMetadataInputSchema.parse(createInput),
    ).toEqual(createInput);
    expect(
      createPersonnelContractAmendmentMetadataInputSchema.safeParse({
        ...createInput,
        effectiveDate: '01/09/2026',
      }).success,
    ).toBe(false);
    const replacementInput = {
      idempotencyKey: createInput.idempotencyKey,
      employeeId: createInput.employeeId,
      amendmentId: '44444444-4444-4444-8444-444444444444',
      expectedRevision: 1,
      filename: createInput.filename,
      mediaType: createInput.mediaType,
      byteSize: createInput.byteSize,
      checksum: createInput.checksum,
      storageKey: createInput.storageKey,
    };
    expect(
      replacePersonnelContractAmendmentMetadataInputSchema.parse(
        replacementInput,
      ),
    ).toEqual(replacementInput);
    const page = personnelContractAmendmentListSchema.parse({
      items: [
        {
          id: '44444444-4444-4444-8444-444444444444',
          employeeId: createInput.employeeId,
          effectiveDate: createInput.effectiveDate,
          reference: createInput.reference,
          filename: createInput.filename,
          mediaType: createInput.mediaType,
          byteSize: createInput.byteSize,
          version: 1,
          revision: 1,
          uploadedAt: '2026-08-15T10:00:00.000Z',
        },
      ],
      pageInfo: { hasMore: false, nextCursor: null },
    });
    expect(page.items[0]).not.toHaveProperty('storageKey');
    expect(page.items[0]).not.toHaveProperty('checksum');
    expect(page.items[0]).not.toHaveProperty('organizationId');
  });
});
