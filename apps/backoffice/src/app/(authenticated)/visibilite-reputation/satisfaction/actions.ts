'use server';

import type {
  ReputationReviewSocialLinksOutcome,
  ReputationReviewSocialLinksSaveInput,
} from '@yuta/contracts/reputation';
import { saveReputationReviewSocialLinks } from '@yuta/db-cloud';
import { revalidatePath } from 'next/cache';
import { requireReputationPermission } from '../../../../server/auth/permissions';
import { requireReputationTenant } from '../../../../server/auth/session';
import { cloudDatabase as db } from '../../../../server/cloud-database';

const SATISFACTION_PATH = '/visibilite-reputation/satisfaction';

export async function saveReviewSocialLinksAction(
  rawInput: ReputationReviewSocialLinksSaveInput | unknown,
): Promise<ReputationReviewSocialLinksOutcome> {
  const { tenant } = await requireReputationTenant(SATISFACTION_PATH);
  requireReputationPermission(tenant, 'reputation.settings.manage');

  const outcome = await saveReputationReviewSocialLinks(db, tenant, rawInput);
  if (outcome.kind === 'success') {
    revalidatePath(SATISFACTION_PATH);
  }
  return outcome;
}
