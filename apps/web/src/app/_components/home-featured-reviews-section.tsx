import { Badge, Card } from '@yuta/ui';
import {
  ArrowRight,
  CheckCircle2,
  MoveRight,
  PencilLine,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { MarketingButton } from '../../components/marketing/MarketingShell';
import { PublicContainer } from '../../components/marketing/PublicContainer';
import Image from 'next/image';
import {
  sectionTitleClassName,
  sectionDescriptionClassName,
  cardTitleClassName,
  cardDescriptionClassName,
} from './home-typography';

export function FeaturedReviewsSection() {
  const steps = [
    {
      title: 'Avis Google autorisés',
      description:
        'Récupérez les nouveaux avis de vos établissements autorisés.',
      icon: null,
      iconClassName: '',
    },
    {
      title: 'Suggestion par l’IA',
      description: 'Obtenez une proposition de réponse adaptée au contexte.',
      icon: Sparkles,
      iconClassName: 'text-status-info',
    },
    {
      title: 'Édition',
      description: 'Modifiez la réponse proposée pour la personnaliser.',
      icon: PencilLine,
      iconClassName: 'text-status-success',
    },
    {
      title: 'Validation humaine',
      description: 'Validez la réponse avant sa publication sur Google.',
      icon: CheckCircle2,
      iconClassName: 'text-status-success',
    },
  ];

  return (
    <section className="w-full py-7">
      <PublicContainer>
        <div className="grid gap-7 rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50/50 via-surface to-brand-50/30 p-5 lg:grid-cols-[0.62fr_1.38fr] lg:items-center lg:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-status-success">
                Module en vedette
              </p>
              <Badge tone="brand">Module pilote</Badge>
            </div>
            <h2 className={`mt-3 ${sectionTitleClassName}`}>
              Mieux gérer les avis et les retours clients
            </h2>
            <p className={`mt-3 ${sectionDescriptionClassName}`}>
              Centralisez les avis Google autorisés, préparez des réponses
              adaptées à votre ton et gardez le contrôle avant chaque
              publication.
            </p>
            <MarketingButton
              asChild
              variant="success"
              size="md"
              className="mt-5"
            >
              <Link href="/solutions/avis-commentaires">
                Découvrir Avis & commentaires
                <ArrowRight className="h-4 w-4" />
              </Link>
            </MarketingButton>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative">
                  <Card className="flex min-h-48 h-full flex-col items-center bg-surface p-4 text-center shadow-sm">
                    <h3
                      className={`flex min-h-10 items-center justify-center ${cardTitleClassName}`}
                    >
                      {step.title}
                    </h3>
                    <div className="mt-1 grid h-10 place-items-center">
                      {Icon ? (
                        <Icon
                          className={`h-8 w-8 stroke-[1.8] ${step.iconClassName}`}
                        />
                      ) : (
                        <Image
                          src="/brands/google-g.png"
                          alt="Google"
                          width={32}
                          height={32}
                          className="block h-8 w-8 object-contain"
                        />
                      )}
                    </div>
                    <p className={`mt-3 ${cardDescriptionClassName}`}>
                      {step.description}
                    </p>
                  </Card>
                  {index < steps.length - 1 ? (
                    <MoveRight className="absolute -right-[22px] top-1/2 z-10 hidden h-4 w-5 -translate-y-1/2 text-brand-500/65 stroke-[1.35] xl:block" />
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
