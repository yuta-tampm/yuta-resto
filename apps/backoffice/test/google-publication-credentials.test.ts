import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TenantContext } from '@yuta/tenant';
import type {
  GoogleReplyPublicationTarget,
  GoogleReviewDatabase,
} from '@yuta/db-cloud';

vi.mock('server-only', () => ({}));
const mocks = vi.hoisted(() => ({
  find: vi.fn(),
  update: vi.fn(),
  refresh: vi.fn(),
  time: vi.fn(),
}));
vi.mock('@yuta/db-cloud', () => ({
  findCapturedGoogleConnectorCredentials: mocks.find,
  updateCapturedGoogleConnectorAccessToken: mocks.update,
  findGoogleReputationConnectorCredentials: vi.fn(),
  updateGoogleReputationConnectorAccessToken: vi.fn(),
  assertGoogleReplyTargetTime: mocks.time,
  GoogleReviewRetrievalRepositoryError: class extends Error {
    constructor(readonly code: string) {
      super(code);
    }
  },
}));
vi.mock('../src/server/reputation/credential-crypto', () => ({
  decryptCredential: (value: string) => value.slice(4),
  encryptCredential: (value: string) => `enc:${value}`,
}));
vi.mock('../src/server/reputation/google-connector-config', () => ({
  getGoogleConnectorConfiguration: () => ({ encryptionKey: 'synthetic' }),
}));
vi.mock('../src/server/reputation/google-business-profile-client', async () => {
  const actual = await vi.importActual<
    typeof import('../src/server/reputation/google-business-profile-client')
  >('../src/server/reputation/google-business-profile-client');
  return { ...actual, refreshGoogleAccessToken: mocks.refresh };
});
import { getGooglePublicationAccessToken } from '../src/server/reputation/google-connector-access';

const id = 'fbca289d-bbc7-4399-bd6c-a18613c9eb62';
const tenant: TenantContext = {
  organizationId: id,
  establishmentId: id,
  actor: { type: 'user', userId: id, membershipId: id, role: 'OWNER' },
  locale: 'fr-FR',
  timezone: 'Europe/Paris',
  entitlements: new Set(['reputation.enabled']),
};
const target: GoogleReplyPublicationTarget = {
  feedbackId: id,
  replyId: id,
  revision: 1,
  text: 'Synthetic reply',
  establishmentName: 'Synthetic restaurant',
  binding: {
    connectorId: id,
    bindingGeneration: 1,
    externalAccountId: 'accounts/a',
    externalLocationId: 'locations/l',
  },
  reviewName: 'accounts/a/locations/l/reviews/r',
  actor: { sessionId: id, userId: id, membershipId: id, authVersion: 0 },
  authorityExpiresAt: new Date('2030-01-01'),
};
const transaction = {} as GoogleReviewDatabase;
beforeEach(() => {
  vi.stubEnv('GOOGLE_REVIEW_PUBLICATION_ENABLED', 'true');
  vi.stubEnv('GOOGLE_REVIEW_RETRIEVAL_ENABLED', 'false');
  Object.values(mocks).forEach((mock) => mock.mockReset());
  mocks.find.mockResolvedValue({
    encryptedAccessToken: 'enc:old',
    encryptedRefreshToken: 'enc:refresh',
    tokenExpiresAt: new Date(0),
  });
  mocks.refresh.mockResolvedValue({
    accessToken: 'new',
    expiresAt: new Date('2030-01-01'),
    scopes: ['business.manage'],
  });
  mocks.update.mockResolvedValue(true);
});
afterEach(() => vi.unstubAllEnvs());
describe('operation-specific publication credentials', () => {
  it('refreshes only the captured connector through the supplied transaction independently of retrieval admission', async () => {
    expect(
      await getGooglePublicationAccessToken(transaction, tenant, target),
    ).toBe('new');
    expect(mocks.find).toHaveBeenCalledWith(
      transaction,
      tenant,
      target.binding,
    );
    expect(mocks.refresh).toHaveBeenCalledWith(
      { encryptionKey: 'synthetic' },
      'refresh',
    );
    expect(mocks.update).toHaveBeenCalledWith(
      transaction,
      tenant,
      target.binding,
      {
        encryptedAccessToken: 'enc:new',
        tokenExpiresAt: new Date('2030-01-01'),
        grantedScopes: ['business.manage'],
      },
    );
  });
  it('uses a still-valid token without refresh or persistence', async () => {
    mocks.find.mockResolvedValue({
      encryptedAccessToken: 'enc:cached',
      tokenExpiresAt: new Date(Date.now() + 3600_000),
    });
    expect(
      await getGooglePublicationAccessToken(transaction, tenant, target),
    ).toBe('cached');
    expect(mocks.refresh).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it('rejects disabled admission and elapsed authority before credentials', async () => {
    vi.stubEnv('GOOGLE_REVIEW_PUBLICATION_ENABLED', 'false');
    expect(
      await getGooglePublicationAccessToken(transaction, tenant, target),
    ).toBeNull();
    expect(mocks.find).not.toHaveBeenCalled();
    vi.stubEnv('GOOGLE_REVIEW_PUBLICATION_ENABLED', 'true');
    mocks.time.mockImplementation(() => {
      throw Error('expired');
    });
    await expect(
      getGooglePublicationAccessToken(transaction, tenant, target),
    ).rejects.toThrow('expired');
    expect(mocks.find).not.toHaveBeenCalled();
  });
  it('rejects missing/replaced binding and refused captured refresh persistence', async () => {
    mocks.find.mockResolvedValue(null);
    await expect(
      getGooglePublicationAccessToken(transaction, tenant, target),
    ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
    expect(mocks.refresh).not.toHaveBeenCalled();
    mocks.find.mockResolvedValue({
      encryptedAccessToken: 'enc:old',
      encryptedRefreshToken: 'enc:refresh',
      tokenExpiresAt: new Date(0),
    });
    mocks.update.mockResolvedValue(false);
    await expect(
      getGooglePublicationAccessToken(transaction, tenant, target),
    ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
  });
});
