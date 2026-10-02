import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from '../src/button';

describe('Button loading contract', () => {
  it('exposes native disabled and busy semantics while preserving its children', () => {
    const markup = renderToStaticMarkup(
      <Button type="submit" loading>
        Enregistrer
      </Button>,
    );

    expect(markup).toContain('disabled=""');
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('data-loading=""');
    expect(markup).toContain('>Enregistrer</button>');
  });

  it('keeps explicit disabled behavior without manufacturing a loading state', () => {
    const markup = renderToStaticMarkup(
      <Button disabled aria-busy="false">
        Continuer
      </Button>,
    );

    expect(markup).toContain('disabled=""');
    expect(markup).toContain('aria-busy="false"');
    expect(markup).not.toContain('data-loading');
    expect(markup).toContain('>Continuer</button>');
  });

  it('keeps loading dominant when the caller also disables the native button', () => {
    const markup = renderToStaticMarkup(
      <Button loading disabled aria-busy="false">
        Envoyer
      </Button>,
    );

    expect(markup).toContain('disabled=""');
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('data-loading=""');
    expect(markup).toContain('>Envoyer</button>');
  });

  it('does not inject a spinner or replace action-specific copy', () => {
    const markup = renderToStaticMarkup(<Button loading>Publication…</Button>);

    expect(markup).toContain('>Publication…</button>');
    expect(markup).not.toMatch(/spinner|animate-spin/i);
  });
});
