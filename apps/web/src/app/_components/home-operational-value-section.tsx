import { Card, IconTile } from '@yuta/ui';
import { Database, Users, Zap } from 'lucide-react';
import { PublicContainer } from '../../components/marketing/PublicContainer';
import {
  sectionTitleClassName,
  cardTitleClassName,
  cardDescriptionClassName,
} from './home-typography';

export function OperationalValueSection() {
  const benefits = [
    {
      title: 'Centraliser',
      description:
        'Toutes les informations de votre restaurant au même endroit : clients, réservations, commandes, stocks, équipe, tâches et documents.',
      icon: Database,
    },
    {
      title: 'Organiser',
      description:
        'Structurez votre activité avec des processus clairs, des plannings partagés et une répartition des responsabilités visible par tous.',
      icon: Users,
    },
    {
      title: 'Automatiser',
      description:
        'Automatisez les tâches répétitives, les rappels et le suivi pour réduire les oublis et vous concentrer sur l’essentiel.',
      icon: Zap,
    },
  ];

  return (
    <section id="pourquoi-yuta" className="w-full scroll-mt-24 py-7">
      <PublicContainer>
        <h2 className={`text-center ${sectionTitleClassName}`}>
          Moins d’outils dispersés. Plus de temps pour votre restaurant.
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="flex min-h-40 items-start gap-5 p-5 shadow-none"
              >
                <IconTile
                  tone="success"
                  shape="circle"
                  size="lg"
                  className="h-14 w-14 shrink-0"
                >
                  <Icon className="h-7 w-7 fill-status-success text-status-success stroke-[1.75]" />
                </IconTile>
                <div className="pt-1">
                  <h3 className={cardTitleClassName}>{item.title}</h3>
                  <p className={`mt-2 ${cardDescriptionClassName}`}>
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </PublicContainer>
    </section>
  );
}
