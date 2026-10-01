import type { FeedbackScopeOptions } from '@yuta/db-cloud';
import type { TenantContext } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  releaseA: true,
  updateFeedback: vi.fn(),
  saveFeedbackReplyDraft: vi.fn(),
  createFeedbackInternalNote: vi.fn(),
  requireReputationPermission: vi.fn(),
  revalidatePath: vi.fn(),
  retrieveGoogleReviews: vi.fn(),
  findGoogleReputationConnector: vi.fn(),
  getGoogleConnectorAccessToken: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('../src/server/reputation/google-review-retrieval', () => ({
  retrieveGoogleReviews: mocks.retrieveGoogleReviews,
}));
vi.mock('../src/server/reputation/google-connector-access', () => ({
  getGoogleConnectorAccessToken: mocks.getGoogleConnectorAccessToken,
}));
vi.mock('../src/server/reputation/google-business-profile-client', () => ({
  listGoogleBusinessAccounts: vi.fn(),
  listGoogleBusinessLocations: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  redirect: (href: string) => {
    throw new Error(`REDIRECT:${href}`);
  },
}));
vi.mock('@yuta/db-cloud', () => ({
  updateFeedback: mocks.updateFeedback,
  saveFeedbackReplyDraft: mocks.saveFeedbackReplyDraft,
  createFeedbackInternalNote: mocks.createFeedbackInternalNote,
  findGoogleReputationConnector: mocks.findGoogleReputationConnector,
  ReputationRepositoryError: class extends Error {
    constructor(
      message: string,
      public code: string,
    ) {
      super(message);
    }
  },
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { test: true },
}));
vi.mock('../src/server/auth/session', () => ({
  requireReputationTenant: async () => ({
    session: {
      id: '00000000-0000-4000-8000-000000000009',
      userId: '00000000-0000-4000-8000-000000000001',
    },
    tenant: context,
  }),
}));
vi.mock('../src/server/auth/permissions', () => ({
  requireReputationPermission: mocks.requireReputationPermission,
}));
vi.mock('../src/server/backoffice-exposure', () => ({
  getReputationFeedbackScope: (): FeedbackScopeOptions | undefined =>
    mocks.releaseA
      ? {
          requiredSource: 'GOOGLE',
          scopedCounters: true,
          attentionStatuses: ['NEW', 'TO_PROCESS', 'DRAFTED', 'FOLLOW_UP'],
        }
      : undefined,
}));

import { ReputationRepositoryError } from '@yuta/db-cloud';
import {
  createInternalNoteAction,
  saveReplyDraftAction,
  updateFeedbackAction,
  retrieveGoogleReviewsAction,
} from '../src/app/(authenticated)/visibilite-reputation/avis/actions';
import { continueGoogleReviewsAction } from '../src/app/(authenticated)/parametres/integrations/actions';

const context: TenantContext = {
  organizationId: '00000000-0000-4000-8000-000000000003',
  establishmentId: '00000000-0000-4000-8000-000000000004',
  actor: {
    type: 'user',
    userId: '00000000-0000-4000-8000-000000000001',
    membershipId: '00000000-0000-4000-8000-000000000005',
    role: 'OWNER',
  },
  locale: 'fr-FR',
  timezone: 'Europe/Paris',
  entitlements: new Set(['reputation.enabled']),
};
const actions = [
  {
    action: updateFeedbackAction,
    repository: mocks.updateFeedback,
    permission: 'reputation.feedback.manage',
  },
  {
    action: saveReplyDraftAction,
    repository: mocks.saveFeedbackReplyDraft,
    permission: 'reputation.reply.create',
  },
  {
    action: createInternalNoteAction,
    repository: mocks.createFeedbackInternalNote,
    permission: 'reputation.note.create',
  },
];

function form(): FormData {
  const data = new FormData();
  data.set('feedbackId', '00000000-0000-4000-8000-000000000002');
  data.set('source', 'DIRECT');
  data.set('profile', 'internal');
  data.set('status', 'TO_PROCESS');
  data.set('assignedToUserId', 'UNASSIGNED');
  data.set('content', 'Manually entered text');
  return data;
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.releaseA = true;
});

describe('Release A Reputation action scope', () => {
  it('allows OWNER continuation from a current scoped binding without provider or import success', async () => {
    mocks.findGoogleReputationConnector.mockResolvedValue({
      status: 'CONNECTED',
      externalAccountId: 'accounts/scoped',
      externalLocationId: 'locations/scoped',
    });
    await expect(continueGoogleReviewsAction()).rejects.toThrow(
      'REDIRECT:/visibilite-reputation/avis',
    );
    expect(mocks.requireReputationPermission).toHaveBeenCalledWith(
      context,
      'reputation.connector.manage',
    );
    expect(mocks.findGoogleReputationConnector).toHaveBeenCalledWith(
      { test: true },
      context,
    );
    expect(mocks.getGoogleConnectorAccessToken).not.toHaveBeenCalled();
    expect(mocks.retrieveGoogleReviews).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('denies continuation before connector lookup and safely handles missing current binding', async () => {
    mocks.requireReputationPermission.mockImplementation(() => {
      throw new Error('Permission denied');
    });
    await expect(continueGoogleReviewsAction()).rejects.toThrow(
      'Permission denied',
    );
    expect(mocks.findGoogleReputationConnector).not.toHaveBeenCalled();
    mocks.requireReputationPermission.mockReset();
    mocks.findGoogleReputationConnector.mockResolvedValue({
      status: 'CONNECTED',
      externalAccountId: null,
      externalLocationId: null,
    });
    await expect(continueGoogleReviewsAction()).rejects.toThrow(
      'REDIRECT:/parametres/integrations?google=continuation_unavailable',
    );
    expect(mocks.getGoogleConnectorAccessToken).not.toHaveBeenCalled();
    expect(mocks.retrieveGoogleReviews).not.toHaveBeenCalled();
  });
  it('uses the validated session and defers list revalidation to explicit inspection', async () => {
    mocks.retrieveGoogleReviews.mockResolvedValue({ kind: 'fresh' });
    expect(
      await retrieveGoogleReviewsAction({ kind: 'recent', trigger: 'visit' }),
    ).toEqual({ outcome: { kind: 'fresh' }, error: null });
    expect(mocks.requireReputationPermission).toHaveBeenCalledWith(
      context,
      'reputation.google.retrieve',
    );
    expect(mocks.retrieveGoogleReviews).toHaveBeenCalledWith(
      context,
      '00000000-0000-4000-8000-000000000009',
      { kind: 'recent', trigger: 'visit' },
    );
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('denies retrieval grants and malformed forged identity before service effects', async () => {
    mocks.requireReputationPermission.mockImplementation(() => {
      throw new Error('Permission denied');
    });
    await expect(
      retrieveGoogleReviewsAction({ kind: 'recent', trigger: 'manual' }),
    ).rejects.toThrow('Permission denied');
    expect(mocks.retrieveGoogleReviews).not.toHaveBeenCalled();
    mocks.requireReputationPermission.mockReset();
    const input = {
      kind: 'recent' as const,
      trigger: 'manual' as const,
      reviewName: 'accounts/foreign/locations/foreign/reviews/private',
    };
    expect((await retrieveGoogleReviewsAction(input)).error).not.toBeNull();
    expect(mocks.retrieveGoogleReviews).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('returns a sanitized failure without touching saved work or the route', async () => {
    mocks.retrieveGoogleReviews.mockRejectedValue(
      new Error('private-provider-secret'),
    );
    const result = await retrieveGoogleReviewsAction({
      kind: 'detail',
      feedbackId: '00000000-0000-4000-8000-000000000002',
    });
    expect(result.outcome).toBeNull();
    expect(result.error).toContain('travail dans YUTA est conservé');
    expect(JSON.stringify(result)).not.toContain('private-provider-secret');
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.saveFeedbackReplyDraft).not.toHaveBeenCalled();
  });
  it.each(actions)(
    'passes server Google scope to $permission despite browser claims',
    async ({ action, repository, permission }) => {
      const result = await action({ error: null, success: null }, form());
      expect(result.error).toBeNull();
      expect(mocks.requireReputationPermission).toHaveBeenCalledWith(
        context,
        permission,
      );
      expect(repository.mock.calls[0]?.[1]).toBe(context);
      expect(repository.mock.calls[0]?.[3]).toMatchObject({
        requiredSource: 'GOOGLE',
      });
      expect(repository.mock.calls[0]?.[2]).not.toHaveProperty('source');
    },
  );

  it.each(actions)(
    'keeps grant denial before $permission repository effects',
    async ({ action, repository }) => {
      mocks.requireReputationPermission.mockImplementation(() => {
        throw new Error('Permission denied');
      });
      await expect(
        action({ error: null, success: null }, form()),
      ).rejects.toThrow('Permission denied');
      expect(repository).not.toHaveBeenCalled();
      expect(mocks.revalidatePath).not.toHaveBeenCalled();
    },
  );

  it.each(actions)(
    'keeps inaccessible source or ID unavailable without success for $permission',
    async ({ action, repository }) => {
      repository.mockRejectedValue(
        new ReputationRepositoryError('Unavailable', 'FEEDBACK_NOT_FOUND'),
      );
      expect(await action({ error: null, success: null }, form())).toEqual({
        error: "Cet avis n'existe plus.",
        success: null,
      });
      expect(mocks.revalidatePath).not.toHaveBeenCalled();
    },
  );

  it.each(actions)(
    'preserves internal repository call without exposure options for $permission',
    async ({ action, repository }) => {
      mocks.releaseA = false;
      await action({ error: null, success: null }, form());
      expect(repository.mock.calls[0]?.[3]).toBeUndefined();
    },
  );
});
