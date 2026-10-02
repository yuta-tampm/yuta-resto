import {
  CheckCircle2,
  MessageCircle,
  MoveRight,
  PencilLine,
  Sparkles,
} from 'lucide-react';
import { PublicContainer } from '../../components/marketing/PublicContainer';
import {
  sectionTitleClassName,
  cardTitleClassName,
  cardDescriptionClassName,
} from './home-typography';

export function PracticalAiSection() {
  const steps = [
    {
      title: 'Repérer',
      description:
        'YUTA identifie les éléments à traiter : avis, documents, tâches et anomalies.',
      icon: MessageCircle,
    },
    {
      title: 'Proposer',
      description:
        'L’IA propose des suggestions concrètes et rédigées à partir de vos données.',
      icon: Sparkles,
    },
    {
      title: 'Adapter',
      description:
        'Vous relisez et ajustez les propositions selon votre contexte.',
      icon: PencilLine,
    },
    {
      title: 'Valider & agir',
      description:
        'Vous validez, YUTA applique l’action et en garde la trace pour le suivi.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      id="intelligence-artificielle"
      className="w-full scroll-mt-24 py-7"
    >
      <PublicContainer>
        <div className="rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50/40 via-surface to-brand-50/40 px-5 py-5 shadow-sm sm:px-7">
          <h2 className={`text-center ${sectionTitleClassName}`}>
            L’intelligence artificielle intégrée aux tâches utiles
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-7">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative flex items-center gap-4"
                >
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-brand-100 bg-surface">
                    <Icon className="h-7 w-7 text-status-success stroke-[2]" />
                  </span>
                  <div>
                    <h3 className={cardTitleClassName}>{step.title}</h3>
                    <p className={`mt-1.5 ${cardDescriptionClassName}`}>
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 ? (
                    <MoveRight className="absolute -right-6 top-1/2 z-10 hidden h-5 w-7 -translate-y-1/2 text-brand-500/70 stroke-[1.35] xl:block" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </PublicContainer>
    </section>
  );
}
