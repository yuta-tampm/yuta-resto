import { Button, SegmentedNav } from '@yuta/ui';
import { Check, Flame, Martini, Soup } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  kitchenUrl,
  type KitchenProductionStation,
  type KitchenQueueFilter,
  type KitchenScreen,
} from '../_lib/kitchen-view';

type KitchenFiltersProps = {
  queueCounts: Record<KitchenQueueFilter, number>;
  selectedQueue: KitchenQueueFilter;
  selectedScreen: KitchenScreen;
  stationCounts: Record<KitchenProductionStation, number>;
  liveUpdatesControl: ReactNode;
};

const screens: Array<{
  value: KitchenScreen;
  stations: Array<{ label: string; value: KitchenProductionStation }>;
  icon: typeof Soup;
}> = [
  {
    value: 'kitchen',
    stations: [{ label: 'Cuisine', value: 'kitchen' }],
    icon: Soup,
  },
  {
    value: 'counter',
    stations: [
      { label: 'Bar', value: 'bar' },
      { label: 'Desserts', value: 'dessert' },
    ],
    icon: Martini,
  },
];

const queues: Array<{
  value: KitchenQueueFilter;
  label: string;
  icon: typeof Flame;
}> = [
  { value: 'active', label: 'À préparer', icon: Flame },
  { value: 'ready', label: 'Prêt', icon: Check },
];

export function KitchenFilters({
  queueCounts,
  selectedQueue,
  selectedScreen,
  stationCounts,
  liveUpdatesControl,
}: KitchenFiltersProps) {
  return (
    <div className="overflow-x-auto px-4 py-3">
      <div className="flex min-w-max items-center gap-3">
        <SegmentedNav className="overflow-visible">
          {screens.map(({ value, stations, icon: Icon }) => (
            <Button
              key={value}
              asChild
              variant={value === selectedScreen ? 'primary' : 'secondary'}
              size="sm"
              className="min-h-11 shrink-0 rounded-lg"
            >
              <Link
                href={kitchenUrl(value, selectedQueue)}
                aria-current={value === selectedScreen ? 'page' : undefined}
                aria-label={value === 'counter' ? 'Bar et Desserts' : undefined}
              >
                <Icon className="h-4 w-4" />
                <span className="grid min-w-20 text-left text-xs leading-3">
                  {stations.map((station) => (
                    <span
                      key={station.value}
                      className="flex items-center justify-between gap-2"
                    >
                      <span>{station.label}</span>
                      <span className="font-black">
                        {stationCounts[station.value]}
                      </span>
                    </span>
                  ))}
                </span>
              </Link>
            </Button>
          ))}
        </SegmentedNav>

        <span
          aria-hidden="true"
          className="h-8 w-px shrink-0 bg-border-default"
        />

        <SegmentedNav className="overflow-visible">
          {queues.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              asChild
              variant={value === selectedQueue ? 'primary' : 'secondary'}
              size="sm"
              className={`min-h-11 shrink-0 rounded-lg ${queueButtonClass(
                value,
                selectedQueue,
              )}`}
            >
              <Link
                href={kitchenUrl(selectedScreen, value)}
                aria-current={value === selectedQueue ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" />
                {label}
                <span className="rounded-full bg-surface-muted px-1.5 py-0.5 text-[10px] font-black text-primary">
                  {queueCounts[value]}
                </span>
              </Link>
            </Button>
          ))}
        </SegmentedNav>

        <span
          aria-hidden="true"
          className="h-8 w-px shrink-0 bg-border-default"
        />

        {liveUpdatesControl}
      </div>
    </div>
  );
}

function queueButtonClass(
  queue: KitchenQueueFilter,
  selectedQueue: KitchenQueueFilter,
): string {
  if (queue !== selectedQueue) return '';

  return queue === 'active'
    ? 'bg-status-warning text-inverse hover:bg-status-warning/90'
    : 'bg-status-success text-inverse hover:bg-status-success/90';
}
