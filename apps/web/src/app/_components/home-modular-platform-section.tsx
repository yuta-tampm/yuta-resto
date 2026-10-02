import { Card } from '@yuta/ui';
import { MoveRight } from 'lucide-react';
import { PublicContainer } from '../../components/marketing/PublicContainer';
import {
  sectionTitleClassName,
  cardTitleClassName,
  cardDescriptionClassName,
} from './home-typography';
import { PlatformModulesIllustration } from './home-platform-modules-illustration';

export function ModularPlatformSection() {
  const steps = [
    {
      title: 'Choisissez les modules utiles',
      description:
        'Activez uniquement les outils dont votre établissement a besoin.',
    },
    {
      title: 'Configurez vos règles',
      description:
        'Adaptez les services, rôles, alertes et préférences du restaurant.',
    },
    {
      title: 'Ajoutez des outils',
      description:
        'Faites évoluer l’environnement lorsque vos besoins changent.',
    },
  ];

  return (
    <section id="plateforme-modulaire" className="w-full scroll-mt-24 py-7">
      <PublicContainer>
        <h2 className={`text-center ${sectionTitleClassName}`}>
          Une plateforme qui s’adapte à votre établissement
        </h2>
        <div className="mt-5 grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
          <Card
            radius="lg"
            className="grid gap-5 border-brand-100 bg-surface p-5 shadow-none md:grid-cols-3 md:gap-7"
          >
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex gap-3.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-status-success text-[13px] font-bold text-inverse">
                  {index + 1}
                </span>
                <div>
                  <h3 className={cardTitleClassName}>{step.title}</h3>
                  <p className={`mt-1.5 ${cardDescriptionClassName}`}>
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 ? (
                  <MoveRight className="absolute -right-5 top-3 hidden h-4 w-6 text-brand-500/50 stroke-[1.25] md:block" />
                ) : null}
              </div>
            ))}
          </Card>
          <PlatformModulesIllustration />
        </div>
      </PublicContainer>
    </section>
  );
}
