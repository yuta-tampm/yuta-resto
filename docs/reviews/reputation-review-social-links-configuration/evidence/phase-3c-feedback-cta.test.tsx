import { createRequire } from 'node:module';
import { describe, expect, it, vi } from 'vitest';
import { FeedbackSuccess } from '../../../../apps/feedback-web/src/app/[tenantSlug]/_components/feedback-form';

const requireFromFeedbackWeb = createRequire(
  new URL('../../../../apps/feedback-web/package.json', import.meta.url),
);
const { createElement } = requireFromFeedbackWeb('react') as {
  createElement: (...arguments_: unknown[]) => unknown;
};
const { renderToStaticMarkup } = requireFromFeedbackWeb('react-dom/server') as {
  renderToStaticMarkup: (element: unknown) => string;
};

const configuredLinks = {
  google: 'https://g.page/yuta/review',
  facebook: 'https://www.facebook.com/yuta',
  instagram: 'https://www.instagram.com/yuta',
};

describe('Public feedback provider CTAs', () => {
  it('renders the three safe projected providers with exact external-link protection', () => {
    const markup = renderSuccess(configuredLinks);

    expect(markup).toContain('Donner mon avis sur Google');
    expect(markup).toContain('Recommander sur Facebook');
    expect(markup).toContain('Voir sur Instagram');
    expect(markup).toContain(`href="${configuredLinks.google}"`);
    expect(markup).toContain(`href="${configuredLinks.facebook}"`);
    expect(markup).toContain(`href="${configuredLinks.instagram}"`);
    expect(markup.match(/target="_blank"/g)).toHaveLength(3);
    expect(markup.match(/rel="noopener noreferrer"/g)).toHaveLength(3);
  });

  it.each([
    ['google', 'Donner mon avis sur Google'],
    ['facebook', 'Recommander sur Facebook'],
    ['instagram', 'Voir sur Instagram'],
  ] as const)(
    'does not render the %s CTA when its safe projection is null',
    (provider, label) => {
      const markup = renderSuccess({ ...configuredLinks, [provider]: null });

      expect(markup).not.toContain(label);
    },
  );

  it('renders only configured providers in a mixed safe projection', () => {
    const markup = renderSuccess({
      google: configuredLinks.google,
      facebook: null,
      instagram: configuredLinks.instagram,
    });

    expect(markup).toContain('Donner mon avis sur Google');
    expect(markup).not.toContain('Recommander sur Facebook');
    expect(markup).toContain('Voir sur Instagram');
    expect(markup.match(/target="_blank"/g)).toHaveLength(2);
  });

  it('does not render an unsafe legacy fallback after projection returns null', () => {
    const unsafeLegacyValue = 'https://example.invalid/review';
    const markup = renderSuccess({
      google: null,
      facebook: null,
      instagram: null,
    });

    expect(markup).not.toContain(unsafeLegacyValue);
    expect(markup).not.toContain(
      'Partagez aussi votre expérience publiquement',
    );
  });

  it('preserves the existing completion message and reset action', () => {
    const markup = renderSuccess({
      google: null,
      facebook: null,
      instagram: null,
    });

    expect(markup).toContain('Merci pour votre retour !');
    expect(markup).toContain('Votre avis a bien été transmis');
    expect(markup).toContain('Donner un autre avis');
  });
});

function renderSuccess(externalLinks: {
  google: string | null;
  facebook: string | null;
  instagram: string | null;
}) {
  return renderToStaticMarkup(
    createElement(FeedbackSuccess, {
      establishmentName: 'Restaurant de test',
      externalLinks,
      onReset: vi.fn(),
    }),
  );
}
