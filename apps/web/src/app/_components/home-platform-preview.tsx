import { Badge, Card } from '@yuta/ui';
import {
  Boxes,
  CalendarCheck,
  FileCheck2,
  ListChecks,
  MessageCircle,
  PackageOpen,
  ShoppingBasket,
  Store,
  Users,
} from 'lucide-react';
import Image from 'next/image';

export function PlatformPreview() {
  const summaries = [
    {
      label: 'Réservations',
      value: '12',
      helper: 'Aujourd’hui',
      icon: CalendarCheck,
    },
    {
      label: 'Employés en service',
      value: '4',
      helper: 'En ce moment',
      icon: Users,
    },
    {
      label: 'Produits bientôt en rupture',
      value: '3',
      helper: 'À surveiller',
      icon: PackageOpen,
    },
    {
      label: 'Tâches à valider',
      value: '2',
      helper: 'En attente',
      icon: ListChecks,
    },
    {
      label: 'Avis à traiter',
      value: '5',
      helper: 'Nouveaux',
      icon: MessageCircle,
    },
    {
      label: 'Document à vérifier',
      value: '1',
      helper: 'En attente',
      icon: FileCheck2,
    },
  ];

  return (
    <figure className="min-w-0">
      <Card padding="none" radius="lg" className="overflow-hidden shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default px-4 py-3">
          <div className="flex items-center gap-2">
            <Image
              src="/images/web-app-manifest-192x192.png"
              alt=""
              width={26}
              height={26}
              className="h-6 w-6 object-contain"
            />
            <span className="text-[15px] font-bold">YUTA</span>
          </div>
          <figcaption className="rounded-full bg-surface-muted px-3 py-1 text-[13px] text-secondary">
            Aperçu de l’environnement YUTA — données d’illustration
          </figcaption>
        </div>
        <div className="grid md:grid-cols-[150px_1fr]">
          <aside className="hidden border-r border-border-default bg-surface-muted p-3 md:block">
            {[
              { label: 'Accueil', icon: Store },
              { label: 'Clients', icon: Users },
              { label: 'Réservations', icon: CalendarCheck },
              { label: 'Commandes', icon: ShoppingBasket },
              { label: 'Produits & stocks', icon: Boxes },
              { label: 'Équipe', icon: Users },
              { label: 'Planning', icon: ListChecks },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={
                    index === 0
                      ? 'mb-1 flex items-center gap-2 rounded-md bg-status-success-soft px-2.5 py-2 text-[13px] font-semibold text-status-success'
                      : 'mb-1 flex items-center gap-2 px-2.5 py-2 text-[13px] font-medium text-secondary'
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </div>
              );
            })}
          </aside>
          <div className="bg-canvas p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold">Établissement de démonstration</p>
                <p className="mt-0.5 text-[13px] text-secondary">
                  Vue d’ensemble du jour
                </p>
              </div>
              <Badge variant="outline">Aujourd’hui</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
              {summaries.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.label} padding="sm" className="shadow-none">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] leading-5 text-secondary">
                        {item.label}
                      </p>
                      <Icon className="h-4 w-4 shrink-0 text-status-success" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">{item.value}</p>
                    <p className="mt-1 text-[13px] font-semibold text-brand-700">
                      {item.helper}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </figure>
  );
}
