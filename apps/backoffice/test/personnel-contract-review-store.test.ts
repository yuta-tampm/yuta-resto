import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { DevelopmentContractExtractionReviewStore } from '../src/server/personnel-contract-extraction/review-store';

const scope = {
  organizationId: '11111111-1111-4111-8111-111111111111',
  establishmentId: '22222222-2222-4222-8222-222222222222',
};

const request = {
  requestId: '33333333-3333-4333-8333-333333333333',
  employeeId: '44444444-4444-4444-8444-444444444444',
  documentId: '55555555-5555-4555-8555-555555555555',
  documentVersion: 2,
  employeeRevision: 4,
  scenario: 'complete' as const,
};

function review(
  requestId = request.requestId,
  expiresAt = '2026-08-20T10:15:00.000Z',
) {
  return {
    schemaVersion: 1 as const,
    requestId,
    document: { id: request.documentId, version: request.documentVersion },
    employeeRevision: request.employeeRevision,
    status: 'complete' as const,
    pageCount: 2,
    suggestions: [
      {
        field: 'position' as const,
        candidateValue: 'Chef de rang',
        confidence: 'high' as const,
        sourcePage: 2,
        excerpt: 'Poste : Chef de rang',
        issueCodes: [],
      },
      {
        field: 'contractWeeklyMinutes' as const,
        candidateValue: 2_100,
        confidence: 'high' as const,
        sourcePage: 2,
        excerpt: '35 heures par semaine',
        issueCodes: [],
      },
    ],
    warnings: [],
    expiresAt,
  };
}

describe('development contract extraction review store', () => {
  it('returns the exact validated review only inside its trusted scope', () => {
    const store = new DevelopmentContractExtractionReviewStore(() =>
      Date.parse('2026-08-20T10:00:00.000Z'),
    );
    const stored = review();
    store.save(scope, stored);

    expect(store.find(scope, request)).toEqual({
      status: 'valid',
      review: stored,
    });
    expect(store.find({ ...scope, establishmentId: 'other' }, request)).toEqual(
      { status: 'missing' },
    );
    expect(store.find(scope, { ...request, documentVersion: 3 })).toEqual({
      status: 'mismatch',
    });
  });

  it('expires and deletes transient reviews', () => {
    let now = Date.parse('2026-08-20T10:00:00.000Z');
    const store = new DevelopmentContractExtractionReviewStore(() => now);
    store.save(scope, review());

    now = Date.parse('2026-08-20T10:15:00.000Z');
    expect(store.find(scope, request)).toEqual({ status: 'expired' });
    expect(store.find(scope, request)).toEqual({ status: 'missing' });
  });

  it('deletes a review after explicit cleanup and bounds retained entries', () => {
    const store = new DevelopmentContractExtractionReviewStore(
      () => Date.parse('2026-08-20T10:00:00.000Z'),
      1,
    );
    store.save(scope, review());
    store.save(scope, review('66666666-6666-4666-8666-666666666666'));

    expect(store.find(scope, request)).toEqual({ status: 'missing' });
    store.delete(scope, '66666666-6666-4666-8666-666666666666');
    expect(
      store.find(scope, {
        ...request,
        requestId: '66666666-6666-4666-8666-666666666666',
      }),
    ).toEqual({ status: 'missing' });
  });
});
