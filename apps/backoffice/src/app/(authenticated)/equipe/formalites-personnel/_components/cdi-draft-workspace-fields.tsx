'use client';

import type {
  FormalitesPersonnelFact,
  FormalitesPersonnelFacts,
  FormalitesPersonnelProbationChoice,
} from '@yuta/contracts';
import { Card, Label, RadioGroup, RadioGroupItem } from '@yuta/ui';
import {
  personnelFactLabels,
  probationChoiceLabels,
} from '../_lib/cdi-draft-workspace-state';

export function ProbationChoiceField({
  value,
  onValueChange,
  disabled,
}: {
  value: FormalitesPersonnelProbationChoice;
  onValueChange(value: FormalitesPersonnelProbationChoice): void;
  disabled: boolean;
}) {
  return (
    <fieldset>
      <legend className="font-black">Période d’essai à prévoir</legend>
      <p className="mt-1 text-sm text-secondary">
        Ce choix sert uniquement à préparer le brouillon.
      </p>
      <RadioGroup
        className="mt-4 grid gap-3 xl:grid-cols-3"
        value={value}
        onValueChange={(next) =>
          onValueChange(next as FormalitesPersonnelProbationChoice)
        }
        disabled={disabled}
        aria-label="Décision de préparation de la période d’essai"
      >
        {(['undecided', 'include', 'exclude'] as const).map((choice) => (
          <Label
            key={choice}
            htmlFor={`formalites-probation-${choice}`}
            className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-border-default p-3 focus-within:ring-2 focus-within:ring-focus-ring"
          >
            <RadioGroupItem
              id={`formalites-probation-${choice}`}
              value={choice}
            />
            <span>{probationChoiceLabels[choice]}</span>
          </Label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

export function FactsGrid({
  title,
  facts,
  locale,
  embedded = false,
}: {
  title: string;
  facts: FormalitesPersonnelFacts;
  locale: string;
  embedded?: boolean;
}) {
  const content = (
    <>
      <h3 className="font-black">{title}</h3>
      <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {(Object.keys(personnelFactLabels) as FormalitesPersonnelFact[]).map(
          (fact) => (
            <div key={fact} className="min-w-0">
              <dt className="text-xs font-bold uppercase text-muted">
                {personnelFactLabels[fact]}
              </dt>
              <dd className="mt-1 break-words text-sm font-semibold">
                {formatFactValue(fact, facts[fact], locale)}
              </dd>
            </div>
          ),
        )}
      </dl>
    </>
  );
  return embedded ? (
    <section className="border-t border-border-subtle pt-4">{content}</section>
  ) : (
    <Card className="min-w-0" padding="lg">
      {content}
    </Card>
  );
}

export function ValueCard({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={
        emphasized
          ? 'rounded-lg bg-surface-selected p-3'
          : 'rounded-lg bg-surface-muted p-3'
      }
    >
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 break-words font-semibold">{value}</p>
    </div>
  );
}

export function formatFactValue(
  fact: FormalitesPersonnelFact,
  value: FormalitesPersonnelFacts[FormalitesPersonnelFact],
  locale: string,
): string {
  if (fact === 'employmentTermType')
    return value === 'indefinite' ? 'CDI' : 'CDD';
  if (fact === 'entryDate') {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeZone: 'UTC',
    }).format(new Date(`${value as string}T12:00:00Z`));
  }
  if (fact === 'contractWeeklyMinutes') {
    if (value === null) return 'Non renseignée';
    const minutes = value as number;
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return remainder === 0
      ? `${hours} h par semaine`
      : `${hours} h ${remainder.toString().padStart(2, '0')} par semaine`;
  }
  return String(value);
}
