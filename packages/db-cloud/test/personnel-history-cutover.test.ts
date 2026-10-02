import { describe, expect, it } from 'vitest';
import {
  getPersonnelHistoryRetentionEligibility,
  parsePersonnelHistoryStoredSnapshot,
} from '../src/personnel-history-cutover';

describe('personnel history foundation', () => {
  it('fails closed for unknown or malformed stored payloads', () => {
    expect(() =>
      parsePersonnelHistoryStoredSnapshot('identity', {
        payloadVersion: 2,
        givenNames: 'Camille',
        familyName: 'Martin',
      }),
    ).toThrow();
    expect(() =>
      parsePersonnelHistoryStoredSnapshot('contract_terms', {
        payloadVersion: 1,
        employmentTermType: 'fixed_term',
        expectedEndDate: '2027-03-31',
        fixedTermReasonCode: 'seasonal_employment',
        documentText: 'not allowed',
      }),
    ).toThrow();
  });

  it('derives retention eligibility without an override authority', () => {
    expect(
      getPersonnelHistoryRetentionEligibility({
        departureDate: null,
        businessDate: '2026-09-03',
      }),
    ).toEqual({ status: 'retained_attached', eligibleOn: null });
    expect(
      getPersonnelHistoryRetentionEligibility({
        departureDate: '2022-01-10',
        businessDate: '2026-09-03',
      }),
    ).toEqual({
      status: 'retained_until_five_years',
      eligibleOn: '2027-01-10',
    });
    expect(
      getPersonnelHistoryRetentionEligibility({
        departureDate: '2021-09-03',
        businessDate: '2026-09-03',
      }),
    ).toEqual({ status: 'eligible', eligibleOn: '2026-09-03' });
  });
});
