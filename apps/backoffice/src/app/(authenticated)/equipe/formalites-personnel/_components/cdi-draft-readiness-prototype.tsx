import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
} from '@yuta/ui';
import { CircleAlert, FileCheck2, FlaskConical, UserRound } from 'lucide-react';
import { cdiDraftPrototypeData } from '../_lib/cdi-draft-prototype';

export function CdiDraftReadinessPrototype() {
  const data = cdiDraftPrototypeData;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <Alert
        tone="warning"
        icon={<FlaskConical className="h-5 w-5" aria-hidden />}
      >
        <AlertTitle>Prototype — données entièrement fictives</AlertTitle>
        <AlertDescription>
          Cet aperçu ne lit pas le dossier salarié ouvert. Il n’enregistre rien,
          ne génère aucun document et n’envoie aucune donnée à un service
          externe.
        </AlertDescription>
      </Alert>

      <Card className="flex flex-col gap-4" padding="lg">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-surface-muted p-2.5">
              <UserRound className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary/55">
                Salariée fictive
              </p>
              <h2 className="mt-1 text-xl font-black">
                {data.fictionalEmployee}
              </h2>
            </div>
          </div>
          <Badge tone="neutral">Aperçu en lecture seule</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <PrototypeStep number="1" label="Données réutilisables" active />
          <PrototypeStep number="2" label="Informations à compléter" />
          <PrototypeStep number="3" label="Vérification" />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <FieldSection
          title="Données qui viendraient de Salariés"
          description="Exemple des informations déjà connues dans le futur parcours."
          badge={<Badge tone="success">Disponibles dans l’aperçu</Badge>}
          fields={data.reusableFields}
        />
        <FieldSection
          title="Informations propres au projet CDI"
          description="Ces informations seraient demandées et validées dans Formalités."
          badge={<Badge tone="warning">À compléter dans Formalités</Badge>}
          fields={data.formalityFields}
        />
      </div>

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CircleAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-status-warning"
            aria-hidden
          />
          <div>
            <h2 className="font-black">
              Préparation impossible pour le moment
            </h2>
            <p className="mt-1 text-sm text-primary/60">
              Trois informations propres au projet CDI restent à compléter.
              Aucun fichier n’est créé par ce prototype.
            </p>
          </div>
        </div>
        <Button type="button" disabled className="shrink-0">
          <FileCheck2 className="h-4 w-4" aria-hidden />
          Générer le projet de contrat
        </Button>
      </Card>
    </div>
  );
}

function PrototypeStep({
  number,
  label,
  active = false,
}: {
  number: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={
        active
          ? 'rounded-lg border border-brand-200 bg-surface-selected p-3'
          : 'rounded-lg border border-border-default bg-surface p-3'
      }
    >
      <p className="text-xs font-bold text-primary/50">Étape {number}</p>
      <p className="mt-1 text-sm font-bold">{label}</p>
    </div>
  );
}

function FieldSection({
  title,
  description,
  badge,
  fields,
}: {
  title: string;
  description: string;
  badge: React.ReactNode;
  fields: readonly { label: string; value: string }[];
}) {
  return (
    <Card className="flex flex-col gap-4" padding="lg">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-black">{title}</h2>
          {badge}
        </div>
        <p className="mt-1 text-sm text-primary/55">{description}</p>
      </div>
      <dl className="divide-y divide-border-subtle">
        {fields.map((field) => (
          <div
            key={field.label}
            className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4"
          >
            <dt className="text-sm font-semibold text-primary/60">
              {field.label}
            </dt>
            <dd className="text-sm font-bold sm:text-right">{field.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
