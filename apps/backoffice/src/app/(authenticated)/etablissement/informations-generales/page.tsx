import { getEstablishmentProfile } from '@yuta/db-cloud';
import { requireEstablishment } from '@yuta/tenant';
import { notFound } from 'next/navigation';
import { Card, ErrorState } from '@yuta/ui';
import { isReleaseAExposure } from '../../../../server/backoffice-exposure';
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
import { CustomerExperienceForm } from './_components/customer-experience-form';
import { TeamCultureForm } from './_components/team-culture-form';
import { CommunicationIdentityForm } from './_components/communication-identity-form';
import { ValidatedKnowledgeSection } from './_components/validated-knowledge-section';
import {
  loadCommunicationIdentitySection,
  loadConceptHistorySection,
  loadCuisineKnowHowSection,
  loadCustomerExperienceSection,
  loadTeamCultureSection,
  loadValidatedKnowledgeSection,
} from './restaurant-knowledge-loader';

export default async function GeneralInformationPage() {
  const { tenant } = await requireAuthenticatedTenant(
    '/etablissement/informations-generales',
  );
  requireEstablishment(tenant);
  requireEstablishmentPermission(tenant, 'establishment.profile.read');
  const releaseA = isReleaseAExposure();
  const [
    profile,
    conceptHistorySection,
    cuisineKnowHowSection,
    customerExperienceSection,
    teamCultureSection,
    communicationIdentitySection,
    validatedKnowledgeSection,
  ] = await Promise.all([
    getEstablishmentProfile(cloudDatabase, tenant),
    releaseA ? null : loadConceptHistorySection(cloudDatabase, tenant),
    releaseA ? null : loadCuisineKnowHowSection(cloudDatabase, tenant),
    releaseA ? null : loadCustomerExperienceSection(cloudDatabase, tenant),
    releaseA ? null : loadTeamCultureSection(cloudDatabase, tenant),
    releaseA ? null : loadCommunicationIdentitySection(cloudDatabase, tenant),
    releaseA ? null : loadValidatedKnowledgeSection(cloudDatabase, tenant),
  ]);
  if (!profile) {
    if (!releaseA) notFound();
    return (
      <BackofficePage title="Informations générales">
        <Card padding="none">
          <ErrorState
            title="Les informations de l’établissement sont indisponibles"
            description="Contactez votre administrateur ou l’assistance YUTA pour rétablir le contexte de votre établissement."
          />
        </Card>
      </BackofficePage>
    );
  }
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
            key={`concept-history\u0000${conceptHistorySection.conceptHistory.concept ?? ''}\u0000${conceptHistorySection.conceptHistory.history ?? ''}`}
            conceptHistory={conceptHistorySection.conceptHistory}
            canManage={conceptHistorySection.canManage}
          />
        )}
        {cuisineKnowHowSection && (
          <CuisineKnowHowForm
            key={`cuisine-know-how\u0000${cuisineKnowHowSection.cuisineKnowHow.cuisineDescription ?? ''}\u0000${cuisineKnowHowSection.cuisineKnowHow.knowHowParticularities ?? ''}\u0000${cuisineKnowHowSection.cuisineKnowHow.homemade ?? ''}`}
            cuisineKnowHow={cuisineKnowHowSection.cuisineKnowHow}
            canManage={cuisineKnowHowSection.canManage}
          />
        )}
        {customerExperienceSection && (
          <CustomerExperienceForm
            key={`customer-experience\u0000${customerExperienceSection.customerExperience.desiredExperience ?? ''}\u0000${customerExperienceSection.customerExperience.welcomeAndService ?? ''}\u0000${customerExperienceSection.customerExperience.customerAttention ?? ''}`}
            customerExperience={customerExperienceSection.customerExperience}
            canManage={customerExperienceSection.canManage}
          />
        )}
        {teamCultureSection && (
          <TeamCultureForm
            teamCulture={teamCultureSection.teamCulture}
            canManage={teamCultureSection.canManage}
          />
        )}
        {communicationIdentitySection && (
          <CommunicationIdentityForm
            communicationIdentity={
              communicationIdentitySection.communicationIdentity
            }
            canManage={communicationIdentitySection.canManage}
          />
        )}
        {validatedKnowledgeSection && (
          <ValidatedKnowledgeSection
            items={validatedKnowledgeSection.items}
            canManage={validatedKnowledgeSection.canManage}
          />
        )}
      </div>
    </BackofficePage>
  );
}
