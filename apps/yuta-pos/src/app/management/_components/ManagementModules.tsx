import { Badge, Button, Card, IconTile } from '@yuta/ui';
import {
  ChartNoAxesCombined,
  Layers3,
  Printer,
  Tags,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

type ManagementModule = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: 'brand' | 'success' | 'info' | 'warning' | 'neutral';
  href: string | null;
};

const modules: readonly ManagementModule[] = [
  {
    title: 'Équipe POS',
    description: 'Utilisateurs, rôles, PIN et activation.',
    icon: Users,
    tone: 'brand',
    href: '/management/users',
  },
  {
    title: 'Menu et catégories',
    description: 'Articles, prix, postes cuisine et disponibilité.',
    icon: Tags,
    tone: 'success',
    href: '/management/catalog',
  },
  {
    title: 'Formules et combos',
    description: 'Règles, groupes, suppléments et priorités.',
    icon: Layers3,
    tone: 'info',
    href: '/management/combos',
  },
  {
    title: 'Rapports locaux',
    description: 'Chiffre payé, commandes ouvertes et activité du jour.',
    icon: ChartNoAxesCombined,
    tone: 'warning',
    href: null,
  },
  {
    title: "File d'impression",
    description: 'Tickets en attente, imprimés, échoués et relance.',
    icon: Printer,
    tone: 'neutral',
    href: '/management/printing',
  },
];

export function ManagementModules() {
  return (
    <section
      aria-label="Modules de gestion locale"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {modules.map((module) => (
        <ManagementModuleCard key={module.title} module={module} />
      ))}
    </section>
  );
}

function ManagementModuleCard({ module }: { module: ManagementModule }) {
  const ModuleIcon = module.icon;

  return (
    <Card
      padding="lg"
      variant={module.href ? 'default' : 'muted'}
      className={`grid gap-5 sm:min-h-60 ${
        module.href ? '' : 'border-dashed shadow-none'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <IconTile tone={module.tone}>
          <ModuleIcon className="h-5 w-5" />
        </IconTile>
        <Badge tone={module.href ? 'success' : 'neutral'} variant="soft">
          {module.href ? 'Disponible' : 'Prochaine étape'}
        </Badge>
      </div>
      <div className="min-w-0">
        <h2 className="text-lg font-black">{module.title}</h2>
        <p className="mt-1 text-sm text-secondary">{module.description}</p>
      </div>
      {module.href && (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-auto min-h-11 w-full"
        >
          <Link href={module.href}>Ouvrir</Link>
        </Button>
      )}
    </Card>
  );
}
