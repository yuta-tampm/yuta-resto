import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PosHeader } from '../src/components/pos/PosHeader';
import { PosPageShell } from '../src/components/pos/PosPageShell';

function hrefCount(markup: string, href: string): number {
  return Array.from(markup.matchAll(new RegExp(`href="${href}"`, 'g'))).length;
}

describe('PosHeader', () => {
  it('keeps primary actions direct and owns secondary navigation on desktop and compact layouts', () => {
    const markup = renderToStaticMarkup(
      <PosHeader
        title="Commandes"
        prominent
        actions={<a href="/pos">Nouvelle commande</a>}
        secondaryActions={
          <>
            <a href="/kitchen">Cuisine</a>
            <a href="/management">Gestion</a>
          </>
        }
      />,
    );

    expect(hrefCount(markup, '/pos')).toBe(2);
    expect(hrefCount(markup, '/kitchen')).toBe(2);
    expect(hrefCount(markup, '/management')).toBe(2);
    expect(markup.match(/<details/g)).toHaveLength(2);
    expect(markup).toContain('Navigation secondaire');
    expect(markup).toContain('h-12 w-12');
    expect(markup).toContain('[&amp;&gt;*]:h-12');
    expect(markup).toContain('[&amp;&gt;form&gt;button]:h-12');
    expect(markup).toContain('absolute right-4 top-full');
    expect(markup).toContain('min-w-64');
  });

  it('preserves the existing all-actions compact menu when no secondary actions are provided', () => {
    const markup = renderToStaticMarkup(
      <PosHeader title="Cuisine" actions={<a href="/">Commandes</a>} />,
    );

    expect(hrefCount(markup, '/')).toBe(3);
    expect(markup.match(/<details/g)).toHaveLength(1);
    expect(markup).not.toContain('Navigation secondaire');
  });

  it('renders the prominent operational shell across the full viewport by default', () => {
    const markup = renderToStaticMarkup(
      <PosPageShell title="Cuisine">
        <p>File de préparation</p>
      </PosPageShell>,
    );

    expect(markup).toContain('h-dvh w-full max-w-none');
    expect(markup).toContain('gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8');
    expect(markup).toContain('h-11 w-11 rounded-lg sm:h-14 sm:w-14');
    expect(hrefCount(markup, '/')).toBe(3);
    expect(hrefCount(markup, '/kitchen')).toBe(2);
    expect(hrefCount(markup, '/management')).toBe(2);
    expect(hrefCount(markup, '/pos')).toBe(0);
    expect(markup).toContain('Navigation secondaire');
    expect(markup).not.toContain('max-w-6xl');
    expect(markup).not.toContain('max-w-7xl');
  });

  it('retains an explicit compact mode for non-service-time consumers', () => {
    const markup = renderToStaticMarkup(
      <PosPageShell title="Compact" prominentHeader={false}>
        <p>Compact content</p>
      </PosPageShell>,
    );

    expect(markup).toContain('gap-3 px-4 py-3');
    expect(markup).not.toContain('sm:h-14 sm:w-14');
  });
});
