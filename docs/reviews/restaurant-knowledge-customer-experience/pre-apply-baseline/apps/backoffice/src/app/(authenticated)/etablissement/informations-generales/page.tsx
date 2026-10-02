import { getEstablishmentProfile } from '@yuta/db-cloud';
import { requireEstablishment } from '@yuta/tenant';
import { notFound } from 'next/navigation';
import { BackofficePage } from '../../../../components/backoffice/backoffice-page';
import {
  hasEstablishmentPermission,
  requireEstablishmentPermission,
} from '../../../../server/auth/permissions';
import { requireAuthenticatedTenant } from '../../../../server/auth/session';
import { cloudDatabase } from '../../../../server/cloud-database';
import { GeneralInformationForm } from './_components/general-information-form';
import { ConceptHistoryForm } from './_components/concept-history-form';
import { CuisineKnowHowForm } from './_components/cuisine-know-how-form';
import {
  loadConceptHistorySection,
  loadCuisineKnowHowSection,
} from './restaurant-knowledge-loader';

export default async function GeneralInformationPage() {
  const { tenant } = await requireAuthenticatedTenant(
    '/etablissement/informations-generales',
  );
  requireEstablishment(tenant);
  requireEstablishmentPermission(tenant, 'establishment.profile.read');
  const [profile, conceptHistorySection, cuisineKnowHowSection] =
    await Promise.all([
      getEstablishmentProfile(cloudDatabase, tenant),
      loadConceptHistorySection(cloudDatabase, tenant),
      loadCuisineKnowHowSection(cloudDatabase, tenant),
    ]);
  if (!profile) notFound();
  const canEditProfile = hasEstablishmentPermission(
    tenant,
    'establishment.profile.manage',
  );

  return (
    <BackofficePage
      title="Informations générales"
      description="Gérez les informations principales et les coordonnées publiques de votre établissement."
    >
      <div className="grid gap-5">
        <GeneralInformationForm profile={profile} canEdit={canEditProfile} />
        {conceptHistorySection && (
          <ConceptHistoryForm
            key={`${conceptHistorySection.conceptHistory.concept ?? ''}\u0000${conceptHistorySection.conceptHistory.history ?? ''}`}
            conceptHistory={conceptHistorySection.conceptHistory}
            canManage={conceptHistorySection.canManage}
          />
        )}
        {cuisineKnowHowSection && (
          <CuisineKnowHowForm
            key={`${cuisineKnowHowSection.cuisineKnowHow.cuisineDescription ?? ''}\u0000${cuisineKnowHowSection.cuisineKnowHow.knowHowParticularities ?? ''}\u0000${cuisineKnowHowSection.cuisineKnowHow.homemade ?? ''}`}
            cuisineKnowHow={cuisineKnowHowSection.cuisineKnowHow}
            canManage={cuisineKnowHowSection.canManage}
          />
        )}
      </div>
    </BackofficePage>
  );
}
