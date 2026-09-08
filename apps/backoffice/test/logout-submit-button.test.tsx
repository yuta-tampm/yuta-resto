import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ pending: false }));

vi.mock('react-dom', () => ({
  useFormStatus: () => ({ pending: mocks.pending }),
}));

import { LogoutSubmitButton } from '../src/components/backoffice/logout-submit-button';

describe('LogoutSubmitButton', () => {
  beforeEach(() => {
    mocks.pending = false;
  });

  it('keeps the icon-only action understandable while idle', () => {
    const markup = renderToStaticMarkup(<LogoutSubmitButton />);

    expect(markup).toContain('type="submit"');
    expect(markup).toContain('aria-label="Se déconnecter"');
    expect(markup).toContain('title="Se déconnecter"');
    expect(markup).not.toContain('disabled=""');
    expect(markup).not.toContain('animate-spin');
  });

  it('disables repeat activation and exposes action-specific pending meaning', () => {
    mocks.pending = true;

    const markup = renderToStaticMarkup(<LogoutSubmitButton />);

    expect(markup).toContain('disabled=""');
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('aria-label="Déconnexion en cours…"');
    expect(markup).toContain('title="Déconnexion en cours…"');
    expect(markup).toContain('animate-spin');
    expect(markup).not.toContain('aria-label="Loading"');
  });
});
