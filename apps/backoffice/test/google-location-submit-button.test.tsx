import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ pending: false }));

vi.mock('react-dom', () => ({
  useFormStatus: () => ({ pending: mocks.pending }),
}));

import { GoogleLocationSubmitButton } from '../src/app/(authenticated)/parametres/integrations/_components/google-location-submit-button';

describe('GoogleLocationSubmitButton', () => {
  beforeEach(() => {
    mocks.pending = false;
  });

  it('renders the existing action-specific idle submission', () => {
    const markup = renderToStaticMarkup(<GoogleLocationSubmitButton />);

    expect(markup).toContain('type="submit"');
    expect(markup).toContain('>Sélectionner</button>');
    expect(markup).not.toContain('disabled=""');
    expect(markup).not.toContain('aria-busy');
  });

  it('prevents duplicate activation and exposes truthful pending meaning', () => {
    mocks.pending = true;

    const markup = renderToStaticMarkup(<GoogleLocationSubmitButton />);

    expect(markup).toContain('disabled=""');
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('data-loading=""');
    expect(markup).toContain('>Sélection en cours…</button>');
    expect(markup).not.toContain('>Sélectionner</button>');
  });
});
