import 'server-only';

import {
  personnelContractExtractionReviewResultSchema,
  type PersonnelContractExtractionRequest,
  type PersonnelContractExtractionReviewResult,
} from '@yuta/contracts/personnel';

export type DevelopmentContractExtractionReviewScope = Readonly<{
  organizationId: string;
  establishmentId: string;
}>;

export type DevelopmentContractExtractionReviewLookup =
  | Readonly<{
      status: 'valid';
      review: PersonnelContractExtractionReviewResult;
    }>
  | Readonly<{ status: 'missing' | 'expired' | 'mismatch' }>;

type StoredReview = Readonly<{
  review: PersonnelContractExtractionReviewResult;
  savedAt: number;
}>;

export class DevelopmentContractExtractionReviewStore {
  private readonly reviews = new Map<string, StoredReview>();

  constructor(
    private readonly now: () => number = () => Date.now(),
    private readonly maximumEntries = 200,
  ) {}

  save(
    scope: DevelopmentContractExtractionReviewScope,
    rawReview: PersonnelContractExtractionReviewResult,
  ): void {
    const review =
      personnelContractExtractionReviewResultSchema.parse(rawReview);
    this.removeExpired();
    while (this.reviews.size >= this.maximumEntries) {
      const oldestKey = this.reviews.keys().next().value;
      if (typeof oldestKey !== 'string') break;
      this.reviews.delete(oldestKey);
    }
    this.reviews.set(reviewKey(scope, review.requestId), {
      review,
      savedAt: this.now(),
    });
  }

  find(
    scope: DevelopmentContractExtractionReviewScope,
    request: PersonnelContractExtractionRequest,
  ): DevelopmentContractExtractionReviewLookup {
    const key = reviewKey(scope, request.requestId);
    const stored = this.reviews.get(key);
    if (!stored) return { status: 'missing' };
    if (Date.parse(stored.review.expiresAt) <= this.now()) {
      this.reviews.delete(key);
      return { status: 'expired' };
    }
    if (
      stored.review.document.id !== request.documentId ||
      stored.review.document.version !== request.documentVersion ||
      stored.review.employeeRevision !== request.employeeRevision
    ) {
      return { status: 'mismatch' };
    }
    return { status: 'valid', review: stored.review };
  }

  delete(
    scope: DevelopmentContractExtractionReviewScope,
    requestId: string,
  ): void {
    this.reviews.delete(reviewKey(scope, requestId));
  }

  private removeExpired(): void {
    const now = this.now();
    for (const [key, stored] of this.reviews) {
      if (Date.parse(stored.review.expiresAt) <= now) {
        this.reviews.delete(key);
      }
    }
  }
}

type ReviewStoreGlobal = typeof globalThis & {
  yutaDevelopmentContractExtractionReviewStore?: DevelopmentContractExtractionReviewStore;
};

const reviewStoreGlobal = globalThis as ReviewStoreGlobal;

export const developmentContractExtractionReviewStore =
  (reviewStoreGlobal.yutaDevelopmentContractExtractionReviewStore ??=
    new DevelopmentContractExtractionReviewStore());

function reviewKey(
  scope: DevelopmentContractExtractionReviewScope,
  requestId: string,
): string {
  return `${scope.organizationId}:${scope.establishmentId}:${requestId}`;
}
