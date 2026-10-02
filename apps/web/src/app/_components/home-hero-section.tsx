import { Badge } from '@yuta/ui';
import {
  ArrowRight,
  Coffee,
  ConciergeBell,
  Puzzle,
  Sandwich,
  Store,
  Truck,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';
import { MarketingButton } from '../../components/marketing/MarketingShell';
import { PublicContainer } from '../../components/marketing/PublicContainer';
import Image from 'next/image';
import { PlatformPreview } from './home-platform-preview';

const restaurantTypes = [
  { label: 'Restaurant indépendant', icon: Utensils },
  { label: 'Café', icon: Coffee },
  { label: 'Bistrot', icon: Store },
  { label: 'Street food', icon: Truck },
  { label: 'Traiteur', icon: ConciergeBell },
  { label: 'Restauration rapide', icon: Sandwich },
];

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-12 h-96 w-96 rounded-full bg-brand-100 blur-3xl"
      />
      <PublicContainer className="relative grid gap-9 pb-9 pt-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-10 lg:pb-10 lg:pt-12">
        <div className="max-w-[560px]">
          <Badge
            tone="success"
            className="px-3 py-1 text-[11px] font-semibold tracking-[0.04em] uppercase"
          >
            Suite de gestion pour restaurants
          </Badge>
          <h1 className="mt-6 text-[36px] font-bold leading-[1.1] tracking-[-0.035em] sm:text-[38px] xl:text-[40px]">
            <span className="block">Les outils qui</span>
            <span className="block">simplifient la gestion</span>
            <span className="block text-status-success">
              de votre restaurant.
            </span>
          </h1>
          <p className="mt-5 max-w-[520px] text-[16px] leading-7 text-secondary">
            De la relation client à l’organisation de l’équipe, YUTA centralise
            les informations, automatise les tâches répétitives et aide les
            restaurateurs à mieux piloter leur établissement.
          </p>
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <MarketingButton
              asChild
              variant="success"
              size="md"
              className="whitespace-nowrap px-5 text-[15px]"
            >
              <a href="#solutions">
                Découvrir YUTA
                <ArrowRight className="h-4 w-4" />
              </a>
            </MarketingButton>
            <MarketingButton
              asChild
              variant="outline"
              size="md"
              className="whitespace-nowrap px-5 text-[15px]"
            >
              <Link href="/contact?subject=demo">Demander une démo</Link>
            </MarketingButton>
          </div>
          <div className="mt-7 grid gap-3 text-[14px] leading-5 text-secondary sm:grid-cols-[1.1fr_0.9fr_1.1fr] sm:gap-4">
            <span className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-status-success-soft">
                <Utensils className="h-4 w-4 text-status-success" />
              </span>
              Pensé pour les restaurateurs
            </span>
            <span className="flex items-center gap-2.5">
              <Image
                src="/flags/fr.svg"
                alt=""
                width={32}
                height={24}
                className="h-6 w-8 shrink-0 rounded-sm border border-border-default object-cover shadow-sm"
              />
              Développé en France
            </span>
            <span className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-status-success-soft">
                <Puzzle className="h-4 w-4 text-status-success" />
              </span>
              Modules selon vos besoins
            </span>
          </div>
        </div>
        <PlatformPreview />
      </PublicContainer>

      <PublicContainer className="pb-7">
        <div className="grid gap-px overflow-hidden rounded-lg border border-border-default bg-border-default shadow-sm sm:grid-cols-2 lg:grid-cols-6">
          {restaurantTypes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex min-h-16 items-center justify-center gap-3 bg-surface px-3 py-3"
              >
                <Icon className="h-6 w-6 shrink-0 text-status-success" />
                <span className="whitespace-nowrap text-[13px] font-medium text-secondary">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </PublicContainer>
    </section>
  );
}
