import { Boxes, Sparkles, Zap } from 'lucide-react';
import { PublicContainer } from '../../components/marketing/PublicContainer';
import Image from 'next/image';
import {
  sectionTitleClassName,
  sectionDescriptionClassName,
} from './home-typography';

export function FieldTestedSection() {
  return (
    <section className="w-full py-7">
      <PublicContainer>
        <div className="grid overflow-hidden rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50/30 via-surface to-surface lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
          <Image
            src="/images/restaurant-team-service.webp"
            alt="Équipe de restaurant travaillant pendant le service"
            width={1200}
            height={600}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="h-full min-h-52 w-full object-cover lg:rounded-r-2xl"
          />
          <div className="p-6 lg:px-8 lg:py-7">
            <h2 className={sectionTitleClassName}>
              Pensé avec des restaurateurs, testé sur le terrain
            </h2>
            <p className={`mt-3 ${sectionDescriptionClassName}`}>
              YUTA est développé avec des restaurateurs de tous types. Chaque
              fonctionnalité répond à un besoin concret du quotidien en salle et
              en cuisine.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: 'Conçu avec des professionnels de la restauration',
                  icon: Boxes,
                },
                {
                  title: 'Testé dans des conditions réelles d’exploitation',
                  icon: Zap,
                },
                {
                  title: 'Amélioré en continu grâce à vos retours d’expérience',
                  icon: Sparkles,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50">
                      <Icon className="h-5 w-5 text-status-success stroke-[1.9]" />
                    </span>
                    <p className="pt-0.5 text-[14px] font-semibold leading-5">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PublicContainer>
    </section>
  );
}
