import type { PersonnelRegisterEntry } from '@yuta/contracts/personnel';
import { Button } from '@yuta/ui';
import { Pencil } from 'lucide-react';

export function RegisterEntryRow({
  entry,
  locale,
  onCorrect,
}: {
  entry: PersonnelRegisterEntry;
  locale: string;
  onCorrect(origin: HTMLButtonElement): void;
}) {
  const facts = entry.facts;
  return (
    <article className="grid gap-4 px-5 py-4 xl:grid-cols-[4rem_minmax(12rem,1.2fr)_repeat(3,minmax(9rem,1fr))_auto] xl:items-center">
      <div>
        <span className="text-xs font-bold uppercase text-muted">N°</span>
        <p className="text-lg font-black">{entry.sequence}</p>
      </div>
      <div>
        <p className="font-bold">
          {facts.givenNames} {facts.familyName}
        </p>
        <p className="text-sm text-secondary">
          {facts.nationalityLabel} · né{facts.sex === 'F' ? 'e' : ''} le{' '}
          {formatDate(facts.birthDate, locale)}
        </p>
      </div>
      <Fact label="Emploi" value={facts.position} />
      <Fact label="Qualification" value={facts.qualification} />
      <Fact
        label="Entrée / sortie"
        value={`${formatDate(facts.entryDate, locale)} · ${facts.departureDate ? formatDate(facts.departureDate, locale) : '—'}`}
      />
      <Button
        size="sm"
        variant="secondary"
        onClick={(event) => onCorrect(event.currentTarget)}
      >
        <Pencil className="h-4 w-4" aria-hidden />
        Corriger
      </Button>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function formatDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
