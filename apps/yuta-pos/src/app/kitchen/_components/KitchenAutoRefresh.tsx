'use client';

import {
  localKitchenEventSchema,
  type LocalKitchenScreen,
} from '@yuta/contracts/local-pos';
import { Button } from '@yuta/ui';
import { Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { usePosStandby } from '../../../components/pos/PosStandbyProvider';
import {
  defaultKitchenChimeVolume,
  kitchenEventMatchesScreen,
  kitchenChimeVolumeVersion,
  maximumKitchenChimeVolume,
  minimumKitchenChimeVolume,
  parseKitchenChimeVolume,
  resolveKitchenChimeVolume,
  shouldPlayKitchenChime,
} from '../_lib/kitchen-live-updates';

const fallbackRefreshIntervalMs = 60_000;
const eventDebounceMs = 200;
const soundPreferenceKey = 'yuta:kitchen-sound-enabled';
const volumePreferenceKey = 'yuta:kitchen-sound-volume';
const volumePreferenceVersionKey = 'yuta:kitchen-sound-volume-version';
const kitchenChimeBaseGain = 1.4;

export function KitchenAutoRefresh({
  selectedScreen,
}: {
  selectedScreen: LocalKitchenScreen;
}) {
  const router = useRouter();
  const { automaticRefreshAllowed } = usePosStandby();
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
    if (!automaticRefreshAllowed) return;
    if (document.visibilityState !== 'visible') return;
    if (refreshInFlightRef.current) {
      refreshQueuedRef.current = true;
      return;
    }
    refreshInFlightRef.current = true;
    startTransition(() => router.refresh());
  }, [automaticRefreshAllowed, router]);

  useEffect(() => {
    let shouldEnableSound = false;
    try {
      const storedVolume = resolveKitchenChimeVolume(
        window.localStorage.getItem(volumePreferenceKey),
        window.localStorage.getItem(volumePreferenceVersionKey),
      );
      volumeRef.current = storedVolume;
      setVolume(storedVolume);
      window.localStorage.setItem(volumePreferenceKey, String(storedVolume));
      window.localStorage.setItem(
        volumePreferenceVersionKey,
        kitchenChimeVolumeVersion,
      );
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
    if (!automaticRefreshAllowed) return;
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
  }, [automaticRefreshAllowed, requestRefresh, selectedScreen]);

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
  const limiter = context.createDynamicsCompressor();
  limiter.threshold.setValueAtTime(-10, startAt);
  limiter.knee.setValueAtTime(10, startAt);
  limiter.ratio.setValueAtTime(6, startAt);
  limiter.attack.setValueAtTime(0.003, startAt);
  limiter.release.setValueAtTime(0.12, startAt);
  limiter.connect(context.destination);
  const pattern = [
    { offset: 0, frequency: 880 },
    { offset: 0.22, frequency: 1_320 },
    { offset: 0.52, frequency: 880 },
    { offset: 0.74, frequency: 1_320 },
    { offset: 1.04, frequency: 880 },
    { offset: 1.26, frequency: 1_320 },
  ];

  for (const tone of pattern) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const toneStart = startAt + tone.offset;
    const toneEnd = toneStart + 0.18;

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(tone.frequency, toneStart);
    gain.gain.setValueAtTime(0.0001, toneStart);
    gain.gain.exponentialRampToValueAtTime(
      volume * kitchenChimeBaseGain,
      toneStart + 0.015,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);
    oscillator.connect(gain);
    gain.connect(limiter);
    oscillator.start(toneStart);
    oscillator.stop(toneEnd + 0.01);
  }
}
