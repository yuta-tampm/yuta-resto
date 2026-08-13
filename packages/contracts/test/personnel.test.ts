import { describe, expect, it } from 'vitest';
import {
  createPersonnelEmployeeInputSchema,
  personnelEmployeeListQuerySchema,
  personnelEmployeeSummarySchema,
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
  });
});
