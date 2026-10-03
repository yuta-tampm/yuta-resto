'use client';

import type { FeedbackTopic } from '@yuta/contracts/reputation';
import { Button, cn } from '@yuta/ui';
import {
  Check,
  Clock3,
  HandPlatter,
  MoreHorizontal,
  Sparkles,
  Store,
  Tags,
  Utensils,
  Waves,
} from 'lucide-react';

const topicOptions: Array<{
  value: FeedbackTopic;
  label: string;
  icon: typeof Store;
}> = [
  { value: 'WELCOME', label: 'Accueil', icon: Store },
  { value: 'FOOD_QUALITY', label: 'Qualité des plats', icon: Utensils },
  { value: 'WAITING_TIME', label: "Temps d'attente", icon: Clock3 },
  { value: 'SERVICE', label: 'Service', icon: HandPlatter },
  { value: 'AMBIENCE', label: 'Ambiance', icon: Waves },
  { value: 'PRICE', label: 'Rapport qualité-prix', icon: Tags },
  { value: 'CLEANLINESS', label: 'Propreté', icon: Sparkles },
  { value: 'OTHER', label: 'Autre', icon: MoreHorizontal },
];

export function TopicsStep({
  selectedTopics,
  onToggle,
  onContinue,
}: {
  selectedTopics: FeedbackTopic[];
  onToggle: (topic: FeedbackTopic) => void;
  onContinue: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col pt-9 text-center">
      <h1 className="text-2xl font-bold leading-tight">
        Sur quels aspects souhaitez-vous nous donner votre avis ?
      </h1>
      <p className="mt-3 text-sm text-secondary">
        Sélectionnez tout ce qui s&apos;applique
      </p>

      <div className="mt-7 grid gap-2.5 text-left">
        {topicOptions.map((topic) => {
          const Icon = topic.icon;
          const selected = selectedTopics.includes(topic.value);
          return (
            <button
              key={topic.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(topic.value)}
              className={cn(
                'flex min-h-12 items-center gap-3 rounded-xl border bg-surface px-4 py-2.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
                selected
                  ? 'border-brand-400 bg-brand-50 text-brand-800'
                  : 'border-border-default hover:bg-surface-muted',
              )}
            >
              <Icon className="h-5 w-5 text-brand-600" aria-hidden="true" />
              <span className="flex-1">{topic.label}</span>
              {selected && (
                <Check className="h-5 w-5 text-brand-600" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      <Button className="mt-7" size="lg" fullWidth onClick={onContinue}>
        Continuer
      </Button>
    </section>
  );
}
