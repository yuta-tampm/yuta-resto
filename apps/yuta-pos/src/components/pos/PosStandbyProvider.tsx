'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Switch,
} from '@yuta/ui';
import { Clock3, Moon, TriangleAlert } from 'lucide-react';
import {
  createContext,
  type FormEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  defaultPosStandbySettings,
  formatPosActivitySchedule,
  isAutomaticRefreshAllowed,
  parsePosStandbySettings,
  posStandbySettingsSchema,
  posStandbySettingsStorageKey,
  temporaryWakeDurationMs,
  type PosStandbySettings,
} from './pos-standby-schedule';

type PosStandbyContextValue = {
  automaticRefreshAllowed: boolean;
  initialized: boolean;
  openSettings: () => void;
  scheduleLabel: string;
  settings: PosStandbySettings;
};

const defaultPosStandbyContext: PosStandbyContextValue = {
  automaticRefreshAllowed: true,
  initialized: true,
  openSettings: () => undefined,
  scheduleLabel: formatPosActivitySchedule(defaultPosStandbySettings),
  settings: defaultPosStandbySettings,
};

const PosStandbyContext = createContext<PosStandbyContextValue>(
  defaultPosStandbyContext,
);

export function PosStandbyProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaultPosStandbySettings);
  const [draftSettings, setDraftSettings] = useState(defaultPosStandbySettings);
  const [initialized, setInitialized] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [temporaryAwakeUntil, setTemporaryAwakeUntil] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const wakeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const loadSettings = () => {
      let nextSettings = defaultPosStandbySettings;
      try {
        nextSettings = parsePosStandbySettings(
          window.localStorage.getItem(posStandbySettingsStorageKey),
        );
      } catch {
        // Defaults keep the POS usable if browser storage is unavailable.
      }
      setSettings(nextSettings);
      setDraftSettings(nextSettings);
      setNow(new Date());
      setInitialized(true);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== posStandbySettingsStorageKey) return;
      const nextSettings = parsePosStandbySettings(event.newValue);
      setSettings(nextSettings);
      setDraftSettings(nextSettings);
    };

    loadSettings();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const updateClock = () => setNow(new Date());
    const intervalId = window.setInterval(updateClock, 30_000);
    document.addEventListener('visibilitychange', updateClock);
    window.addEventListener('focus', updateClock);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', updateClock);
      window.removeEventListener('focus', updateClock);
    };
  }, [initialized]);

  const automaticRefreshAllowed =
    initialized &&
    now !== null &&
    isAutomaticRefreshAllowed({ settings, now, temporaryAwakeUntil });
  const standbyActive = initialized && !automaticRefreshAllowed;

  useEffect(() => {
    if (standbyActive && !settingsOpen) wakeButtonRef.current?.focus();
  }, [settingsOpen, standbyActive]);

  const openSettings = useCallback(() => {
    setDraftSettings(settings);
    setSettingsError(null);
    setSettingsOpen(true);
  }, [settings]);

  const saveSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = posStandbySettingsSchema.safeParse(draftSettings);
    if (!parsed.success) {
      setSettingsError(
        parsed.error.issues[0]?.message ?? 'Vérifiez les horaires saisis.',
      );
      return;
    }

    try {
      window.localStorage.setItem(
        posStandbySettingsStorageKey,
        JSON.stringify(parsed.data),
      );
    } catch {
      setSettingsError(
        "Les horaires n'ont pas pu être enregistrés sur cet écran.",
      );
      return;
    }

    setSettings(parsed.data);
    setNow(new Date());
    setTemporaryAwakeUntil(0);
    setSettingsError(null);
    setSettingsOpen(false);
  };

  const contextValue = useMemo<PosStandbyContextValue>(
    () => ({
      automaticRefreshAllowed,
      initialized,
      openSettings,
      scheduleLabel: formatPosActivitySchedule(settings),
      settings,
    }),
    [automaticRefreshAllowed, initialized, openSettings, settings],
  );

  return (
    <PosStandbyContext.Provider value={contextValue}>
      <div
        aria-hidden={standbyActive ? true : undefined}
        inert={standbyActive ? true : undefined}
      >
        {children}
      </div>

      {standbyActive && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pos-standby-title"
          className="fixed inset-0 z-[60] flex min-h-dvh items-center justify-center bg-standby p-4 text-inverse"
        >
          <div className="grid w-full max-w-md justify-items-center gap-6 text-center">
            <Moon className="h-12 w-12" aria-hidden="true" />
            <div className="grid gap-2">
              <p className="text-5xl font-black tabular-nums">
                {formatLocalTime(now)}
              </p>
              <h1 id="pos-standby-title" className="text-2xl font-black">
                Écran en veille
              </h1>
              <p className="text-sm text-inverse/75">
                Horaires actifs : {formatPosActivitySchedule(settings)}
              </p>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <Button
                ref={wakeButtonRef}
                type="button"
                size="lg"
                variant="secondary"
                onClick={() => {
                  setTemporaryAwakeUntil(Date.now() + temporaryWakeDurationMs);
                  setNow(new Date());
                }}
              >
                Réveiller 15 min
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="border-inverse/40 text-inverse hover:bg-inverse/10"
                onClick={openSettings}
              >
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                Modifier les horaires
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={settingsOpen}
        onOpenChange={(open) => {
          setSettingsOpen(open);
          if (!open) setSettingsError(null);
        }}
      >
        <DialogContent
          className="z-[80] max-h-[90dvh] overflow-y-auto sm:max-w-lg"
          closeClassName="inline-flex min-h-11 min-w-11 items-center justify-center"
          closeLabel="Fermer"
        >
          <form className="grid gap-5" onSubmit={saveSettings}>
            <DialogHeader>
              <DialogTitle>Horaires de l’écran</DialogTitle>
              <DialogDescription>
                Ces horaires sont enregistrés uniquement dans ce navigateur POS.
                Ils utilisent l’heure locale de l’appareil.
              </DialogDescription>
            </DialogHeader>

            <label className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-border-default bg-surface-muted p-4">
              <span className="grid gap-1">
                <span className="font-black text-primary">
                  Activer la veille automatique
                </span>
                <span className="text-sm text-secondary">
                  Suspend les mises à jour automatiques hors horaires.
                </span>
              </span>
              <Switch
                checked={draftSettings.enabled}
                aria-label="Activer la veille automatique"
                onCheckedChange={(enabled) =>
                  setDraftSettings((current) => ({ ...current, enabled }))
                }
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 font-semibold text-primary">
                Ouverture
                <input
                  type="time"
                  value={draftSettings.startTime}
                  disabled={!draftSettings.enabled}
                  className="h-12 rounded-lg border border-border-default bg-surface px-3 text-base font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-focus-ring disabled:opacity-50"
                  onChange={(event) =>
                    setDraftSettings((current) => ({
                      ...current,
                      startTime: event.currentTarget.value,
                    }))
                  }
                />
              </label>
              <label className="grid gap-2 font-semibold text-primary">
                Fermeture
                <input
                  type="time"
                  value={draftSettings.endTime}
                  disabled={!draftSettings.enabled}
                  className="h-12 rounded-lg border border-border-default bg-surface px-3 text-base font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-focus-ring disabled:opacity-50"
                  onChange={(event) =>
                    setDraftSettings((current) => ({
                      ...current,
                      endTime: event.currentTarget.value,
                    }))
                  }
                />
              </label>
            </div>

            <p className="text-sm text-secondary">
              Une plage comme 18:00–02:00 traverse automatiquement minuit.
            </p>

            {settingsError && (
              <Alert tone="danger">
                <TriangleAlert className="h-4 w-4" aria-hidden="true" />
                <AlertTitle>Enregistrement impossible</AlertTitle>
                <AlertDescription>{settingsError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => setSettingsOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" size="lg">
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PosStandbyContext.Provider>
  );
}

export function usePosStandby() {
  return useContext(PosStandbyContext);
}

function formatLocalTime(now: Date | null) {
  if (!now) return '--:--';
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
}
