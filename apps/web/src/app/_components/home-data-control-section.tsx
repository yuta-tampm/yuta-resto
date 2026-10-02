import { Card } from '@yuta/ui';
import { Database, LockKeyhole, Trash2, UserCheck } from 'lucide-react';
import { PublicContainer } from '../../components/marketing/PublicContainer';
import {
  cardTitleClassName,
  cardDescriptionClassName,
} from './home-typography';
import { SectionHeading } from './home-section-heading';

const dataPromises = [
  {
    title: 'Connexion sécurisée',
    description:
      'Accès à vos comptes via des autorisations sécurisées comme OAuth 2.0.',
    icon: LockKeyhole,
  },
  {
    title: 'Utilisation limitée',
    description:
      'Vos données sont utilisées uniquement pour les services YUTA que vous activez.',
    icon: Database,
  },
  {
    title: 'Validation humaine',
    description:
      'Aucune action n’est publiée sans votre relecture et votre validation.',
    icon: UserCheck,
  },
  {
    title: 'Retrait et suppression',
    description:
      'Les connexions peuvent être retirées et les données supprimées sur demande.',
    icon: Trash2,
  },
];

export function DataControlSection() {
  return (
    <section id="donnees" className="w-full scroll-mt-24 py-7">
      <PublicContainer>
        <div className="rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50/40 via-surface to-brand-50/30 p-5">
          <SectionHeading title="Vous gardez le contrôle de vos données" />
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {dataPromises.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <Icon className="h-8 w-8 shrink-0 text-status-success stroke-[1.75]" />
                    <div>
                      <h3 className={cardTitleClassName}>{item.title}</h3>
                      <p className={`mt-1.5 ${cardDescriptionClassName}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </PublicContainer>
    </section>
  );
}
