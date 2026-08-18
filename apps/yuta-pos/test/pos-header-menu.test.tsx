import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PosHeader } from '../src/components/pos/PosHeader';

describe('PosHeader page menu', () => {
  it('keeps page actions before shared navigation without replacing workflow actions', () => {
    const markup = renderToStaticMarkup(
      <PosHeader
        title="Commande"
        actions={<button>Action métier</button>}
        pageMenuActions={<button>Imprimer le reçu</button>}
        secondaryActions={<a href="/kitchen">Cuisine</a>}
        prominent
      />,
    );

    expect(markup).toContain('Action métier');
    expect(markup).toContain('Imprimer le reçu');
    expect(markup).toContain('Cuisine');
    expect(markup.indexOf('Imprimer le reçu')).toBeLessThan(
      markup.indexOf('Cuisine'),
    );
  });
});
