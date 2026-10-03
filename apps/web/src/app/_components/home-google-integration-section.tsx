import { ArrowRight, Check, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { MarketingButton } from '../../components/marketing/MarketingShell';
import { PublicContainer } from '../../components/marketing/PublicContainer';
import Image from 'next/image';
import { sectionTitleClassName } from './home-typography';

export function GoogleIntegrationSection() {
  return (
    <section id="integration-google" className="w-full scroll-mt-24 py-7">
      <PublicContainer>
        <div className="grid gap-6 rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50/40 via-surface to-brand-50/30 p-5 lg:grid-cols-[280px_minmax(0,1fr)_190px] lg:items-center lg:gap-6">
          <div className="relative mx-auto h-32 w-[280px]">
            <Image
              src="/images/restaurant-integration.webp"
              alt="Équipe préparant le service dans un restaurant"
              width={640}
              height={364}
              sizes="192px"
              className="absolute right-0 top-1/2 h-[118px] w-48 -translate-y-1/2 rounded-l-xl rounded-r-[3rem] object-cover shadow-sm"
            />
            <div className="absolute left-0 top-1/2 z-10 grid h-28 w-28 -translate-y-1/2 place-items-center rounded-full border border-brand-100 bg-surface shadow-md">
              <Image
                src="/brands/google-g.png"
                alt="Google"
                width={58}
                height={58}
                className="h-[58px] w-[58px] object-contain"
              />
              <span className="absolute bottom-0 right-0 grid h-9 w-9 translate-x-1/4 place-items-center rounded-full border-4 border-surface bg-brand-50 shadow-sm">
                <LockKeyhole className="h-4 w-4 text-status-success stroke-[2]" />
              </span>
            </div>
          </div>
          <div>
            <h2 className={sectionTitleClassName}>
              Connectez les établissements que vous gérez sur Google
            </h2>
            <ul className="mt-4 grid gap-2 text-[15px] leading-6 text-secondary">
              {[
                'Connexion sécurisée via Google OAuth 2.0',
                'Sélection des établissements autorisés',
                'Synchronisation des avis associés',
                'Publication après votre validation',
                'Déconnexion possible à tout moment',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-status-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <MarketingButton
            asChild
            variant="outline"
            className="w-full justify-between border-status-success px-4 text-left text-[14px] leading-5 text-status-success lg:min-h-16 lg:w-[190px]"
          >
            <Link href="/integrations/google-business-profile">
              <span>Comprendre l’intégration Google Business Profile</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </MarketingButton>
        </div>
        <p className="mt-3 text-center text-[14px] leading-5 text-secondary">
          Google Business Profile est une marque de Google LLC. YUTA est un
          service indépendant et n’est ni affilié à, ni approuvé par Google.
        </p>
      </PublicContainer>
    </section>
  );
}
