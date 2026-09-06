import { describe, expect, it } from 'vitest';
import {
  projectPublicReputationReviewSocialLinks,
  reputationFacebookReviewUrlSchema,
  reputationGoogleReviewUrlSchema,
  reputationInstagramUrlSchema,
  reputationReviewSocialLinksOutcomeSchema,
  reputationReviewSocialLinksReadModelSchema,
  reputationReviewSocialLinksSaveInputSchema,
  reputationReviewSocialLinksValuesSchema,
  validateReputationReviewSocialLink,
} from '../src/reputation';

const nullValues = {
  googleReviewUrl: null,
  facebookReviewUrl: null,
  instagramUrl: null,
};
const stateToken = 'a'.repeat(64);

describe('Reputation review and social-link URL policy', () => {
  it.each([
    ['https://g.page/yuta/review'],
    ['https://maps.app.goo.gl/AbCdEf'],
    ['https://google.com/maps/place/Yuta'],
    ['https://www.google.com/maps/place/Yuta'],
    ['https://google.fr/maps/place/Yuta'],
    ['https://www.google.fr/maps/place/Yuta'],
    ['https://search.google.com/local/writereview?placeid=abc'],
  ])('accepts an approved Google destination: %s', (value) => {
    expect(reputationGoogleReviewUrlSchema.parse(value)).toBe(value);
  });

  it.each([
    ['https://google.com/', 'PATH_NOT_ALLOWED'],
    ['https://www.google.com/search?q=yuta', 'PATH_NOT_ALLOWED'],
    ['https://google.fr/map/place/Yuta', 'PATH_NOT_ALLOWED'],
    ['https://www.google.fr/MAPS/place/Yuta', 'PATH_NOT_ALLOWED'],
    ['https://search.google.com/', 'PATH_NOT_ALLOWED'],
    ['https://mail.google.com/maps/place/Yuta', 'HOST_NOT_ALLOWED'],
    ['https://accounts.google.com/maps/place/Yuta', 'HOST_NOT_ALLOWED'],
    ['https://docs.google.com/maps/place/Yuta', 'HOST_NOT_ALLOWED'],
    ['https://maps.google.com/maps/place/Yuta', 'HOST_NOT_ALLOWED'],
    ['https://evil.google.com/maps/place/Yuta', 'HOST_NOT_ALLOWED'],
    ['https://google.com.example.invalid/maps/place/Yuta', 'HOST_NOT_ALLOWED'],
    ['https://bit.ly/yuta-google', 'HOST_NOT_ALLOWED'],
  ])('rejects an unapproved Google destination: %s', (value, issueCode) => {
    expect(validateReputationReviewSocialLink('GOOGLE', value)).toEqual({
      success: false,
      issueCode,
    });
  });

  it.each([
    ['https://facebook.com/yuta'],
    ['https://www.facebook.com/yuta'],
    ['https://m.facebook.com/yuta'],
    ['https://fb.me/yuta'],
  ])('accepts an approved Facebook destination: %s', (value) => {
    expect(reputationFacebookReviewUrlSchema.parse(value)).toBe(value);
  });

  it.each([
    ['https://business.facebook.com/yuta'],
    ['https://evil.facebook.com/yuta'],
    ['https://facebook.com.example.invalid/yuta'],
    ['https://bit.ly/yuta-facebook'],
  ])('rejects an unapproved Facebook destination: %s', (value) => {
    expect(reputationFacebookReviewUrlSchema.safeParse(value).success).toBe(
      false,
    );
  });

  it.each([['https://instagram.com/yuta'], ['https://www.instagram.com/yuta']])(
    'accepts an approved Instagram destination: %s',
    (value) => {
      expect(reputationInstagramUrlSchema.parse(value)).toBe(value);
    },
  );

  it.each([
    ['https://m.instagram.com/yuta'],
    ['https://business.instagram.com/yuta'],
    ['https://instagram.com.example.invalid/yuta'],
    ['https://tinyurl.com/yuta-instagram'],
  ])('rejects an unapproved Instagram destination: %s', (value) => {
    expect(reputationInstagramUrlSchema.safeParse(value).success).toBe(false);
  });

  it.each([
    ['GOOGLE', 'http://google.com/maps/place/Yuta', 'HTTPS_REQUIRED'],
    ['FACEBOOK', 'http://facebook.com/yuta', 'HTTPS_REQUIRED'],
    ['INSTAGRAM', 'http://instagram.com/yuta', 'HTTPS_REQUIRED'],
    [
      'GOOGLE',
      'https://user:secret@google.com/maps/place/Yuta',
      'CREDENTIALS_FORBIDDEN',
    ],
    ['FACEBOOK', 'https://user@facebook.com/yuta', 'CREDENTIALS_FORBIDDEN'],
    ['INSTAGRAM', 'not a URL', 'MALFORMED_URL'],
  ] as const)(
    'rejects unsafe common input for %s: %s',
    (provider, value, issueCode) => {
      expect(validateReputationReviewSocialLink(provider, value)).toEqual({
        success: false,
        issueCode,
      });
    },
  );

  it('trims outer whitespace, maps blank to null, and accepts explicit null', () => {
    expect(
      reputationGoogleReviewUrlSchema.parse(
        '  https://google.com/maps/place/Yuta?x=1#reviews  ',
      ),
    ).toBe('https://google.com/maps/place/Yuta?x=1#reviews');
    expect(reputationFacebookReviewUrlSchema.parse('   ')).toBeNull();
    expect(reputationInstagramUrlSchema.parse(null)).toBeNull();
  });

  it('enforces the 2048 application-string-unit boundary after trim', () => {
    const prefix = 'https://facebook.com/yuta#';
    const exact = `${prefix}${'x'.repeat(2_048 - prefix.length)}`;
    const tooLong = `${exact}x`;

    expect(exact.length).toBe(2_048);
    expect(reputationFacebookReviewUrlSchema.parse(exact)).toBe(exact);
    expect(validateReputationReviewSocialLink('FACEBOOK', tooLong)).toEqual({
      success: false,
      issueCode: 'TOO_LONG',
    });
    expect(reputationFacebookReviewUrlSchema.parse(` ${exact} `)).toBe(exact);
  });

  it('returns the trimmed original without rewriting path, query, or fragment', () => {
    const original =
      'https://WWW.FACEBOOK.COM/Yuta/%7Eteam?b=2&a=1#Review%20Us';

    expect(reputationFacebookReviewUrlSchema.parse(` ${original} `)).toBe(
      original,
    );
  });

  it('rejects non-string non-null values', () => {
    expect(validateReputationReviewSocialLink('GOOGLE', undefined)).toEqual({
      success: false,
      issueCode: 'INVALID_TYPE',
    });
    expect(reputationGoogleReviewUrlSchema.safeParse(42).success).toBe(false);
  });
});

describe('Reputation review and social-link transport contracts', () => {
  it('normalizes exactly three nullable values', () => {
    expect(
      reputationReviewSocialLinksValuesSchema.parse({
        googleReviewUrl: ' ',
        facebookReviewUrl: ' https://facebook.com/yuta ',
        instagramUrl: null,
      }),
    ).toEqual({
      googleReviewUrl: null,
      facebookReviewUrl: 'https://facebook.com/yuta',
      instagramUrl: null,
    });
  });

  it('accepts a strict read model and lowercase 64-hex state token', () => {
    const model = { values: nullValues, stateToken };

    expect(reputationReviewSocialLinksReadModelSchema.parse(model)).toEqual(
      model,
    );
    expect(
      reputationReviewSocialLinksReadModelSchema.safeParse({
        ...model,
        stateToken: 'A'.repeat(64),
      }).success,
    ).toBe(false);
    expect(
      reputationReviewSocialLinksReadModelSchema.safeParse({
        ...model,
        stateToken: 'a'.repeat(63),
      }).success,
    ).toBe(false);
    expect(
      reputationReviewSocialLinksReadModelSchema.safeParse({
        ...model,
        organizationId: 'internal-org-id',
      }).success,
    ).toBe(false);
  });

  it('accepts only expected values, proposed values, and expected state token', () => {
    const input = {
      expectedValues: nullValues,
      proposedValues: {
        ...nullValues,
        googleReviewUrl: 'https://g.page/yuta/review',
      },
      expectedStateToken: stateToken,
    };

    expect(reputationReviewSocialLinksSaveInputSchema.parse(input)).toEqual(
      input,
    );
    for (const [key, value] of [
      ['organizationId', 'org-1'],
      ['establishmentId', 'est-1'],
      ['role', 'OWNER'],
      ['permission', 'reputation.settings.manage'],
      ['settingsId', 'settings-1'],
      ['provider', 'GOOGLE'],
      ['status', 'ACTIVE'],
    ] as const) {
      expect(
        reputationReviewSocialLinksSaveInputSchema.safeParse({
          ...input,
          [key]: value,
        }).success,
      ).toBe(false);
    }
    expect(
      reputationReviewSocialLinksSaveInputSchema.safeParse({
        ...input,
        proposedValues: {
          ...input.proposedValues,
          actorUserId: 'user-1',
        },
      }).success,
    ).toBe(false);
  });

  it.each(['success', 'no_change', 'conflict'] as const)(
    'accepts a safe %s outcome with an authoritative model',
    (kind) => {
      expect(
        reputationReviewSocialLinksOutcomeSchema.parse({
          kind,
          model: { values: nullValues, stateToken },
        }),
      ).toMatchObject({ kind });
    },
  );

  it('accepts bounded validation, unavailable, and server outcomes', () => {
    expect(
      reputationReviewSocialLinksOutcomeSchema.parse({
        kind: 'validation_error',
        issues: [{ field: 'googleReviewUrl', code: 'HOST_NOT_ALLOWED' }],
      }),
    ).toMatchObject({ kind: 'validation_error' });
    expect(
      reputationReviewSocialLinksOutcomeSchema.parse({
        kind: 'configuration_unavailable',
      }),
    ).toEqual({ kind: 'configuration_unavailable' });
    expect(
      reputationReviewSocialLinksOutcomeSchema.parse({
        kind: 'server_error',
      }),
    ).toEqual({ kind: 'server_error' });
  });

  it('rejects raw values and internal metadata from safe outcomes', () => {
    expect(
      reputationReviewSocialLinksOutcomeSchema.safeParse({
        kind: 'validation_error',
        issues: [
          {
            field: 'googleReviewUrl',
            code: 'HOST_NOT_ALLOWED',
            rejectedValue: 'https://user:secret@example.invalid',
          },
        ],
      }).success,
    ).toBe(false);
    expect(
      reputationReviewSocialLinksOutcomeSchema.safeParse({
        kind: 'server_error',
        stack: 'database internals',
      }).success,
    ).toBe(false);
  });
});

describe('Reputation public safe projection', () => {
  it('uses the same policy and maps each invalid legacy value to null', () => {
    expect(
      projectPublicReputationReviewSocialLinks({
        googleReviewUrl: 'https://maps.google.com/maps/place/Yuta',
        facebookReviewUrl: ' https://www.facebook.com/yuta?ref=page#reviews ',
        instagramUrl: 'https://m.instagram.com/yuta',
      }),
    ).toEqual({
      googleReviewUrl: null,
      facebookReviewUrl: 'https://www.facebook.com/yuta?ref=page#reviews',
      instagramUrl: null,
    });
  });

  it('matches private schema results without rewriting accepted URLs', () => {
    const values = {
      googleReviewUrl:
        ' https://search.google.com/local/writereview?placeid=A%2FB#start ',
      facebookReviewUrl: 'https://fb.me/Yuta?utm_source=manual#review',
      instagramUrl: null,
    };
    const privateResult = reputationReviewSocialLinksValuesSchema.parse(values);

    expect(projectPublicReputationReviewSocialLinks(values)).toEqual(
      privateResult,
    );
  });

  it('fails closed for malformed legacy types independently by provider', () => {
    expect(
      projectPublicReputationReviewSocialLinks({
        googleReviewUrl: 42,
        facebookReviewUrl: undefined,
        instagramUrl: 'https://instagram.com/yuta',
      }),
    ).toEqual({
      googleReviewUrl: null,
      facebookReviewUrl: null,
      instagramUrl: 'https://instagram.com/yuta',
    });
  });
});
