import { describe, expect, it } from 'vitest';
import {
  closeReviewSearchParams,
  updateReviewsSearchParams,
} from '../src/app/(authenticated)/visibilite-reputation/avis/_lib/reviews-query';

describe('Avis navigation context', () => {
  it('opens and closes an item on a later filtered page without losing context', () => {
    const current = 'page=2&rating=5&search=service&sort=oldest';
    const opened = updateReviewsSearchParams(
      current,
      { selected: 'review-26' },
      { keepSelected: true, keepPage: true },
    );
    expect(opened.get('selected')).toBe('review-26');
    expect(closeReviewSearchParams(opened.toString()).toString()).toBe(current);
  });

  it('closes without unpinning a working list or changing unrelated query context', () => {
    const closed = closeReviewSearchParams(
      'page=2&selected=review-26&working=review-26,review-27&queue=attention',
    );
    expect(closed.get('selected')).toBeNull();
    expect(closed.get('working')).toBe('review-26,review-27');
    expect(closed.get('page')).toBe('2');
    expect(closed.get('queue')).toBe('attention');
  });

  it('resets selection, working context and page when filters change', () => {
    const filtered = updateReviewsSearchParams(
      'page=2&selected=review-26&working=review-26&status=NEW&sort=oldest',
      { status: 'ALL', rating: 4 },
    );
    expect(filtered.toString()).toBe('sort=oldest&rating=4');
  });

  it('keeps an explicitly requested page while clearing the previous selection', () => {
    const paged = updateReviewsSearchParams('page=2&selected=review-26', {
      page: 3,
    });
    expect(paged.toString()).toBe('page=3');
  });

  it('retains the existing default selection pagination behavior for Satisfaction', () => {
    const selected = updateReviewsSearchParams(
      'page=2&search=service',
      { selected: 'direct-review' },
      { keepSelected: true },
    );
    expect(selected.toString()).toBe('search=service&selected=direct-review');
  });
});
