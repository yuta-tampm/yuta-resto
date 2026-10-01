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
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  updateFeedback: mocks.updateFeedback,
  saveFeedbackReplyDraft: mocks.saveFeedbackReplyDraft,
  createFeedbackInternalNote: mocks.createFeedbackInternalNote,
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
    session: { userId: '00000000-0000-4000-8000-000000000001' },
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
} from '../src/app/(authenticated)/visibilite-reputation/avis/actions';

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
