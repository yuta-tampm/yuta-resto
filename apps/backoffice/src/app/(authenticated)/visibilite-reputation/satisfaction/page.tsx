import { readReputationReviewSocialLinks } from '@yuta/db-cloud';
import { Suspense } from 'react';
import { requireReputationPermission } from '../../../../server/auth/permissions';
import { requireReputationTenant } from '../../../../server/auth/session';
import { cloudDatabase as db } from '../../../../server/cloud-database';
import { loadReviewsPage } from '../avis/_components/reviews-loader';
import { saveReviewSocialLinksAction } from './actions';
import {
  ReviewSocialLinksSettings,
  ReviewSocialLinksSettingsLoading,
} from './_components/review-social-links-settings';

export const dynamic = 'force-dynamic';

const SATISFACTION_PATH = '/visibilite-reputation/satisfaction';

type ReviewSearchParams = Record<string, string | string[] | undefined>;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<ReviewSearchParams>;
}) {
  const reviewsPage = await loadReviewsPage(await searchParams, 'direct');

  return (
    <div className="flex w-full flex-col gap-5">
      {reviewsPage}
      <Suspense fallback={<ReviewSocialLinksSettingsLoading />}>
        <ReviewSocialLinksSettingsSection />
      </Suspense>
    </div>
  );
}

export async function ReviewSocialLinksSettingsSection() {
  const { tenant } = await requireReputationTenant(SATISFACTION_PATH);

  if (tenant.actor.type !== 'user' || tenant.actor.role !== 'OWNER') {
    return null;
  }

  requireReputationPermission(tenant, 'reputation.settings.manage');
  const initialOutcome = await readReputationReviewSocialLinks(db, tenant);

  return (
    <ReviewSocialLinksSettings
      initialOutcome={initialOutcome}
      saveAction={saveReviewSocialLinksAction}
    />
  );
}
