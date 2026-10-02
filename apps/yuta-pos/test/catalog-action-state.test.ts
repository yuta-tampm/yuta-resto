import { describe, expect, it } from 'vitest';
import { SiteAgentClientError } from '../src/lib/site-agent-client';
import { toCatalogActionError } from '../src/app/management/catalog/catalog-action-state';

describe('catalog action state', () => {
  it.each([
    ['CATALOG_CATEGORY_NOT_FOUND', "La catégorie n'existe plus."],
    ['CATALOG_ITEM_NOT_FOUND', "L'article n'existe plus."],
  ])('offers refresh recovery for %s', (code, message) => {
    expect(
      toCatalogActionError(new SiteAgentClientError(404, code, message)),
    ).toEqual({ error: message, success: null, recovery: 'refresh' });
  });

  it('keeps a name conflict in the current editor without refresh recovery', () => {
    expect(
      toCatalogActionError(
        new SiteAgentClientError(409, 'CATALOG_CATEGORY_NAME_CONFLICT', 'x'),
      ),
    ).toEqual({ error: 'Cette catégorie existe déjà.', success: null });
  });

  it('maps an unavailable local service truthfully', () => {
    expect(toCatalogActionError(new Error('offline'))).toEqual({
      error: 'Site-agent indisponible.',
      success: null,
    });
  });
});
