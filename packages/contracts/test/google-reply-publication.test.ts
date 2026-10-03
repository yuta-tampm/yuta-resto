import { describe, expect, it } from 'vitest';
import {
  googleReplyAttemptInputSchema,
  googleReplyPreviewInputSchema,
  googleReplyTextSchema,
  googleReplyPublicationReceiptSchema,
} from '../src/reputation';
const id = 'fbca289d-bbc7-4399-bd6c-a18613c9eb62';
describe('Google reply publication boundary', () => {
  it('counts UTF-8 bytes without silently changing text or normal draft limits', () => {
    expect(googleReplyTextSchema.parse(' café ')).toBe(' café ');
    expect(googleReplyTextSchema.safeParse('a'.repeat(4096)).success).toBe(
      true,
    );
    expect(googleReplyTextSchema.safeParse('é'.repeat(2048)).success).toBe(
      true,
    );
    expect(googleReplyTextSchema.safeParse('é'.repeat(2049)).success).toBe(
      false,
    );
    expect(googleReplyTextSchema.safeParse('🍜'.repeat(1025)).success).toBe(
      false,
    );
  });
  it('allows only local identifiers and never browser scope, final text or provider IDs', () => {
    const input = { feedbackId: id, replyId: id, revision: 1 };
    expect(googleReplyPreviewInputSchema.safeParse(input).success).toBe(true);
    for (const key of [
      'organizationId',
      'establishmentId',
      'role',
      'sessionId',
      'text',
      'reviewName',
    ])
      expect(
        googleReplyPreviewInputSchema.safeParse({ ...input, [key]: id })
          .success,
      ).toBe(false);
    expect(
      googleReplyPreviewInputSchema.safeParse({ ...input, revision: 0 })
        .success,
    ).toBe(false);
    expect(
      googleReplyAttemptInputSchema.safeParse({
        attemptId: id,
        confirmedText: 'fake',
      }).success,
    ).toBe(false);
  });
  it('projects only finite safe recovery categories without raw provider errors', () => {
    const receipt = {
      attemptId: id,
      replyId: id,
      revision: 1,
      state: 'FAILED',
      errorCategory: 'REMOTE_CHANGED',
      confirmedAt: null,
      observedAt: null,
      reconciledAt: null,
      superseded: false,
    };
    expect(googleReplyPublicationReceiptSchema.safeParse(receipt).success).toBe(
      true,
    );
    expect(
      googleReplyPublicationReceiptSchema.safeParse({
        ...receipt,
        errorCategory: 'raw provider body',
      }).success,
    ).toBe(false);
    expect(
      googleReplyPublicationReceiptSchema.safeParse({
        ...receipt,
        accessToken: 'synthetic',
      }).success,
    ).toBe(false);
  });
});
