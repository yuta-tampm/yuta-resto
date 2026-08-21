'use client';

import {
  localKitchenEventSchema,
  type LocalKitchenScreen,
} from '@yuta/contracts/local-pos';
import { Button } from '@yuta/ui';
import { Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import {
  defaultKitchenChimeVolume,
  kitchenEventMatchesScreen,
  maximumKitchenChimeVolume,
  minimumKitchenChimeVolume,
  parseKitchenChimeVolume,
  shouldPlayKitchenChime,
} from '../_lib/kitchen-live-updates';

const fallbackRefreshIntervalMs = 60_000;
const eventDebounceMs = 200;
const soundPreferenceKey = 'yuta:kitchen-sound-enabled';
const volumePreferenceKey = 'yuta:kitchen-sound-volume';

export function KitchenAutoRefresh({
  selectedScreen,
}: {
  selectedScreen: LocalKitchenScreen;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const refreshInFlightRef = useRef(false);
  const refreshQueuedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioReadyRef = useRef(false);
  const volumeRef = useRef(defaultKitchenChimeVolume);
  const lastChimeAtRef = useRef(0);
  const [audioReady, setAudioReady] = useState(false);
  const [volume, setVolume] = useState(defaultKitchenChimeVolume);

  const setAudioState = useCallback((ready: boolean) => {
    audioReadyRef.current = ready;
    setAudioReady(ready);
  }, []);

  const enableSound = useCallback(
    async (playConfirmation: boolean) => {
      try {
        const context = audioContextRef.current ?? new AudioContext();
        audioContextRef.current = context;
        await context.resume();
        if (context.state !== 'running') return;
        window.localStorage.setItem(soundPreferenceKey, 'true');
        setAudioState(true);
        if (playConfirmation) playKitchenChime(context, volumeRef.current);
      } catch {
        setAudioState(false);
      }
    },
    [setAudioState],
  );

  const toggleSound = useCallback(() => {
    if (!audioReadyRef.current) {
      void enableSound(true);
      return;
    }
    window.localStorage.setItem(soundPreferenceKey, 'false');
    setAudioState(false);
    void audioContextRef.current?.suspend();
  }, [enableSound, setAudioState]);

  const updateVolume = useCallback((value: string) => {
    const nextVolume = parseKitchenChimeVolume(value);
    volumeRef.current = nextVolume;
    setVolume(nextVolume);
    try {
      window.localStorage.setItem(volumePreferenceKey, String(nextVolume));
    } catch {
      // Keep the selected volume for this session if storage is unavailable.
    }
  }, []);

  const previewVolume = useCallback(() => {
    const context = audioContextRef.current;
    if (audioReadyRef.current && context?.state === 'running') {
      playKitchenChime(context, volumeRef.current);
    }
  }, []);

  const requestRefresh = useCallback(() => {
    if (document.visibilityState !== 'visible') return;
    if (refreshInFlightRef.current) {
      refreshQueuedRef.current = true;
      return;
    }
    refreshInFlightRef.current = true;
    startTransition(() => router.refresh());
  }, [router]);

  useEffect(() => {
    let shouldEnableSound = false;
    try {
      const storedVolume = parseKitchenChimeVolume(
        window.localStorage.getItem(volumePreferenceKey),
      );
      volumeRef.current = storedVolume;
      setVolume(storedVolume);
      shouldEnableSound =
        window.localStorage.getItem(soundPreferenceKey) === 'true';
    } catch {
      // Browser storage is optional; defaults remain available for this session.
    }
    if (shouldEnableSound) {
      void enableSound(false);
    }
    return () => {
      void audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, [enableSound]);

  useEffect(() => {
    if (isPending || !refreshInFlightRef.current) return;
    refreshInFlightRef.current = false;
    if (refreshQueuedRef.current) {
      refreshQueuedRef.current = false;
      requestRefresh();
    }
  }, [isPending, requestRefresh]);

  useEffect(() => {
    let source: EventSource | null = null;
    let debounceTimer: number | null = null;

    const scheduleRefresh = (delay = eventDebounceMs) => {
      if (debounceTimer !== null) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        debounceTimer = null;
        requestRefresh();
      }, delay);
    };
    const connect = () => {
      if (document.visibilityState !== 'visible' || source) return;
      source = new EventSource('/api/kitchen-events');
      source.addEventListener('open', () => scheduleRefresh(0));
      source.addEventListener('kitchen_changed', (rawEvent) => {
        if (!(rawEvent instanceof MessageEvent)) return;
        try {
          const parsed = localKitchenEventSchema.safeParse(
            JSON.parse(rawEvent.data as string),
          );
          if (
            parsed.success &&
            kitchenEventMatchesScreen(parsed.data, selectedScreen)
          ) {
            scheduleRefresh();
            const now = Date.now();
            const context = audioContextRef.current;
            if (
              audioReadyRef.current &&
              context?.state === 'running' &&
              shouldPlayKitchenChime({
                event: parsed.data,
                selectedScreen,
                now,
                lastPlayedAt: lastChimeAtRef.current,
              })
            ) {
              playKitchenChime(context, volumeRef.current);
              lastChimeAtRef.current = now;
            }
          }
        } catch {
          // Ignore malformed notifications; the periodic refresh remains active.
        }
      });
    };
    const disconnect = () => {
      source?.close();
      source = null;
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        connect();
        scheduleRefresh(0);
      } else {
        disconnect();
      }
    };
    const handleOnline = () => {
      disconnect();
      connect();
      scheduleRefresh(0);
    };

    connect();
    const intervalId = window.setInterval(
      requestRefresh,
      fallbackRefreshIntervalMs,
    );
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      disconnect();
      if (debounceTimer !== null) window.clearTimeout(debounceTimer);
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [requestRefresh, selectedScreen]);

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        type="button"
        variant={audioReady ? 'success' : 'secondary'}
        size="sm"
        className="min-h-11 shrink-0 rounded-lg px-3"
        aria-label={audioReady ? 'Désactiver le son' : 'Activer le son'}
        aria-pressed={audioReady}
        title={
          audioReady ? 'Son activé' : 'Activer le son des nouvelles commandes'
        }
        onClick={toggleSound}
      >
        {audioReady ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
        Son
      </Button>

      <label className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-border-default bg-surface px-2">
        <span className="sr-only">Volume du son</span>
        <input
          type="range"
          min={minimumKitchenChimeVolume}
          max={maximumKitchenChimeVolume}
          step={0.1}
          value={volume}
          className="h-2 w-20 cursor-pointer accent-[var(--color-status-success)]"
          aria-label="Volume du son"
          aria-valuetext={`${Math.round(volume * 100)} %`}
          onChange={(event) => updateVolume(event.currentTarget.value)}
          onPointerUp={previewVolume}
          onKeyUp={previewVolume}
        />
        <span
          aria-hidden="true"
          className="w-8 text-right text-xs font-black tabular-nums text-secondary"
        >
          {Math.round(volume * 100)}%
        </span>
      </label>
    </div>
  );
}

function playKitchenChime(context: AudioContext, volume: number) {
  const startAt = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, startAt);
  oscillator.frequency.setValueAtTime(1_175, startAt + 0.2);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.55);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + 0.56);
}
