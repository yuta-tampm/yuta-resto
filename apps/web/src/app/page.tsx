import type { Metadata } from 'next';
import {
  MarketingFooter,
  MarketingHeader,
} from '../components/marketing/MarketingShell';
import { HeroSection } from './_components/home-hero-section';
import { OperationalValueSection } from './_components/home-operational-value-section';
import { SolutionPillarsSection } from './_components/home-solution-pillars-section';
import { PracticalAiSection } from './_components/home-practical-ai-section';
import { ModularPlatformSection } from './_components/home-modular-platform-section';
import { FeaturedReviewsSection } from './_components/home-featured-reviews-section';
import { GoogleIntegrationSection } from './_components/home-google-integration-section';
import { FieldTestedSection } from './_components/home-field-tested-section';
import { DataControlSection } from './_components/home-data-control-section';
import { FinalCtaSection } from './_components/home-final-cta-section';

export const metadata: Metadata = {
  title: {
    absolute: 'YUTA — Suite de gestion pour restaurants',
  },
  description:
    'YUTA réunit les outils essentiels pour organiser votre équipe, suivre votre activité, améliorer la relation client et simplifier la gestion quotidienne de votre restaurant.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
    title: 'YUTA — Suite de gestion pour restaurants',
    description:
      'Une suite d’outils intelligents conçue pour simplifier la gestion quotidienne des restaurants.',
    images: ['/opengraph-image'],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://yutapro.fr/#organization',
  name: 'YUTA',
  url: 'https://yutapro.fr',
  logo: {
    '@type': 'ImageObject',
    url: 'https://yutapro.fr/images/web-app-manifest-512x512.png',
    width: 512,
    height: 512,
  },
  description:
    'YUTA développe une suite d’outils intelligents pour simplifier la gestion quotidienne des restaurants.',
  email: 'contact@yutapro.fr',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://yutapro.fr/#website',
  url: 'https://yutapro.fr',
  name: 'YUTA',
  inLanguage: 'fr-FR',
  publisher: {
    '@id': 'https://yutapro.fr/#organization',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface text-primary">
      <MarketingHeader />
      <main className="pb-12">
        <HeroSection />
        <OperationalValueSection />
        <SolutionPillarsSection />
        <PracticalAiSection />
        <ModularPlatformSection />
        <FeaturedReviewsSection />
        <GoogleIntegrationSection />
        <FieldTestedSection />
        <DataControlSection />
        <FinalCtaSection />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c'),
        }}
      />
    </div>
  );
}
