import { ArrowRight, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { MarketingButton } from '../../components/marketing/MarketingShell';
import { PublicContainer } from '../../components/marketing/PublicContainer';

export function FinalCtaSection() {
  return (
    <section className="w-full pt-5">
      <PublicContainer>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 px-6 py-5 text-inverse md:px-9">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-24 bg-[radial-gradient(circle,var(--color-brand-300)_1px,transparent_1px)] bg-[length:10px_10px] opacity-35"
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-24 bg-[radial-gradient(circle,var(--color-brand-300)_1px,transparent_1px)] bg-[length:10px_10px] opacity-35"
          />
          <div className="relative grid gap-5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
            <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-lg bg-surface text-status-success shadow-sm sm:grid">
              <CalendarCheck className="h-6 w-6" />
            </span>
            <div>
              <h2 className="max-w-md text-[18px] font-bold leading-[1.25] tracking-[-0.02em]">
                Un seul environnement pour mieux gérer votre restaurant
              </h2>
              <p className="mt-1.5 text-[15px] leading-6 text-brand-100">
                Centralisez, organisez, automatisez. Avec YUTA, restez concentré
                sur l’essentiel : vos clients et votre cuisine.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <MarketingButton
                asChild
                variant="secondary"
                size="md"
                className="px-5 text-[15px]"
              >
                <Link href="/contact?subject=demo">
                  Demander une démonstration
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MarketingButton>
              <MarketingButton
                asChild
                variant="outline"
                size="md"
                className="border-brand-200 px-5 text-[15px] text-inverse"
              >
                <Link href="/contact">Nous contacter</Link>
              </MarketingButton>
            </div>
          </div>
        </div>
      </PublicContainer>
    </section>
  );
}
