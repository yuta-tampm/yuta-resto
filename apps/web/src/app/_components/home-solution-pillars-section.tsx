import { Card } from '@yuta/ui';
import {
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  Info,
  ShoppingBag,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { PublicContainer } from '../../components/marketing/PublicContainer';
import { sectionTitleClassName, cardTitleClassName } from './home-typography';

const solutionPillars = [
  {
    id: 'relation-client',
    title: 'Relation client',
    modules: [
      'Fiche client et historique',
      'Réservations',
      'Communications',
      'Avis & commentaires',
    ],
    icon: UserRound,
    iconClassName: 'bg-status-success text-inverse',
    borderClassName: 'border-status-success-border',
    backgroundClassName: 'bg-status-success-soft',
    dotClassName: 'bg-status-success',
  },
  {
    id: 'operations',
    title: 'Opérations',
    modules: [
      'Commandes & ventes',
      'Stocks & inventaires',
      'Fournisseurs',
      'Recettes & fiches produits',
    ],
    icon: ShoppingBag,
    iconClassName: 'bg-status-info text-inverse',
    borderClassName: 'border-status-info-border',
    backgroundClassName: 'bg-status-info-soft',
    dotClassName: 'bg-status-info',
  },
  {
    id: 'equipe',
    title: 'Équipe',
    modules: [
      'Employés',
      'Planning',
      'Rôles & permissions',
      'Tâches & procédures',
    ],
    icon: UsersRound,
    iconClassName: 'bg-brand-500 text-inverse',
    borderClassName: 'border-brand-200',
    backgroundClassName: 'bg-brand-50',
    dotClassName: 'bg-brand-500',
  },
  {
    id: 'pilotage-developpement',
    title: 'Pilotage & développement',
    modules: [
      'Tableaux de bord',
      'Indicateurs clés',
      'Analyses d’activité',
      'Export de données',
    ],
    icon: ChartNoAxesColumnIncreasing,
    iconClassName: 'bg-status-warning text-inverse',
    borderClassName: 'border-status-warning-border',
    backgroundClassName: 'bg-status-warning-soft',
    dotClassName: 'bg-status-warning',
  },
];

export function SolutionPillarsSection() {
  return (
    <section id="solutions" className="w-full scroll-mt-24 py-7">
      <PublicContainer>
        <h2 className={`text-center ${sectionTitleClassName}`}>
          Un environnement pensé pour le quotidien des restaurateurs
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {solutionPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={pillar.id}
                id={pillar.id}
                radius="lg"
                className={`flex min-h-56 scroll-mt-28 flex-col border ${pillar.borderClassName} ${pillar.backgroundClassName} p-5 shadow-none`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${pillar.iconClassName}`}
                  >
                    <Icon className="h-5 w-5 stroke-[2.25]" />
                  </span>
                  <h3 className={cardTitleClassName}>{pillar.title}</h3>
                </div>
                <ul className="mt-4 grid gap-1.5">
                  {pillar.modules.map((module) => (
                    <li
                      key={module}
                      className="flex items-start gap-2 text-[15px] leading-6 text-secondary"
                    >
                      <ChevronRight className="mt-1 h-3 w-3 shrink-0 text-primary stroke-[2.5]" />
                      {module}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto flex items-center gap-2 pt-4 text-[13px] font-semibold text-secondary">
                  <span
                    className={`h-2 w-2 rounded-full ${pillar.dotClassName}`}
                  />
                  Déploiement progressif
                </p>
              </Card>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-center gap-3 rounded-lg bg-surface-muted px-5 py-3">
          <Info className="h-4 w-4 shrink-0 text-status-success" />
          <p className="text-[14px] leading-5 text-secondary">
            Les modules sont déployés progressivement. Activez uniquement ce
            dont vous avez besoin aujourd’hui.
          </p>
        </div>
      </PublicContainer>
    </section>
  );
}
