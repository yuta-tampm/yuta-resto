'use client';

import { Badge, Button } from '@yuta/ui';
import {
  CloudOff,
  Clock3,
  DatabaseZap,
  Printer,
  ServerCrash,
  Wifi,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { usePosStandby } from './PosStandbyProvider';

type HealthResponse = {
  status: 'available' | 'unavailable';
  siteAgent?: 'ok' | 'degraded' | 'unavailable';
  database: 'available' | 'unavailable' | 'unknown';
  internet: 'available' | 'unavailable' | 'unknown';
  printer?: PrinterStatus;
};

type PrinterStatus =
  | 'ready'
  | 'printing'
  | 'attention'
  | 'unavailable'
  | 'not_configured';

type ConnectivityState =
  | 'checking'
  | 'online'
  | 'local-only'
  | 'local-available'
  | 'database-unavailable'
  | 'server-unavailable';

export function PosConnectivityStatus() {
  const { automaticRefreshAllowed, openSettings, scheduleLabel } =
    usePosStandby();
  const [state, setState] = useState<ConnectivityState>('checking');
  const [printer, setPrinter] = useState<PrinterStatus | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/health', { cache: 'no-store' });
      const health = (await response.json()) as HealthResponse;
      setPrinter(health.printer ?? null);

      if (health.siteAgent === 'unavailable') {
        setState('server-unavailable');
      } else if (health.database !== 'available') {
        setState('database-unavailable');
      } else if (health.internet === 'unavailable') {
        setState('local-only');
      } else if (health.internet === 'available') {
        setState('online');
      } else {
        setState('local-available');
      }
    } catch {
      setState('server-unavailable');
      setPrinter('unavailable');
    }
  }, []);

  useEffect(() => {
    if (!automaticRefreshAllowed) return;
    void checkHealth();
    const checkIfVisible = () => {
      if (document.visibilityState === 'visible') void checkHealth();
    };
    const interval = window.setInterval(checkIfVisible, 15000);
    window.addEventListener('online', checkHealth);
    window.addEventListener('offline', checkHealth);
    window.addEventListener('focus', checkIfVisible);
    document.addEventListener('visibilitychange', checkIfVisible);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('online', checkHealth);
      window.removeEventListener('offline', checkHealth);
      window.removeEventListener('focus', checkIfVisible);
      document.removeEventListener('visibilitychange', checkIfVisible);
    };
  }, [automaticRefreshAllowed, checkHealth]);

  const status = statusByState[state];
  const Icon = status.icon;
  const printerStatus = printer ? printerStatusByState[printer] : null;

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 border-b border-border-default bg-surface-muted px-3 py-1.5 text-xs text-secondary">
      <div
        role="status"
        className="flex flex-wrap items-center justify-center gap-2"
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{status.label}</span>
        <Badge tone={status.tone} size="sm">
          {status.badge}
        </Badge>
        {printerStatus && (
          <Badge tone={printerStatus.tone} size="sm">
            <Printer className="h-3 w-3" aria-hidden="true" />
            {printerStatus.label}
          </Badge>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="min-h-11"
        onClick={openSettings}
      >
        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
        Horaires écran · {scheduleLabel}
      </Button>
    </div>
  );
}

const statusByState: Record<
  ConnectivityState,
  {
    label: string;
    badge: string;
    tone: 'neutral' | 'success' | 'warning' | 'danger';
    icon: typeof Wifi;
  }
> = {
  checking: {
    label: 'Verification du service local',
    badge: 'Verification',
    tone: 'neutral',
    icon: Wifi,
  },
  online: {
    label: 'Serveur local, base de donnees et Internet disponibles',
    badge: 'En ligne',
    tone: 'success',
    icon: Wifi,
  },
  'local-only': {
    label: 'Le POS local fonctionne sans Internet',
    badge: 'Mode local',
    tone: 'warning',
    icon: CloudOff,
  },
  'local-available': {
    label: 'Serveur local et base de donnees disponibles',
    badge: 'Service local',
    tone: 'success',
    icon: Wifi,
  },
  'database-unavailable': {
    label: 'La base de donnees locale est indisponible',
    badge: 'Base indisponible',
    tone: 'danger',
    icon: DatabaseZap,
  },
  'server-unavailable': {
    label: 'Le serveur POS local ne repond pas',
    badge: 'Serveur indisponible',
    tone: 'danger',
    icon: ServerCrash,
  },
};

const printerStatusByState: Record<
  PrinterStatus,
  {
    label: string;
    tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  }
> = {
  ready: { label: 'Imprimante prête', tone: 'success' },
  printing: { label: 'Impression en cours', tone: 'info' },
  attention: { label: 'Imprimante à vérifier', tone: 'warning' },
  unavailable: { label: 'Imprimante indisponible', tone: 'danger' },
  not_configured: { label: 'Imprimante non configurée', tone: 'neutral' },
};
