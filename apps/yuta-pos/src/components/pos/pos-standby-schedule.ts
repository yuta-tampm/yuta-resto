import { z } from 'zod';

export const posStandbySettingsStorageKey = 'yuta:pos-standby-settings';
export const temporaryWakeDurationMs = 15 * 60 * 1_000;

const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export const posStandbySettingsSchema = z
  .object({
    version: z.literal(1),
    enabled: z.boolean(),
    startTime: z.string().regex(timePattern),
    endTime: z.string().regex(timePattern),
  })
  .refine(
    (settings) => !settings.enabled || settings.startTime !== settings.endTime,
    {
      message: 'Les heures de début et de fin doivent être différentes.',
      path: ['endTime'],
    },
  );

export type PosStandbySettings = z.infer<typeof posStandbySettingsSchema>;

export const defaultPosStandbySettings: PosStandbySettings = {
  version: 1,
  enabled: true,
  startTime: '09:00',
  endTime: '23:00',
};

export function parsePosStandbySettings(
  rawSettings: string | null,
): PosStandbySettings {
  if (!rawSettings) return defaultPosStandbySettings;

  try {
    const parsed = posStandbySettingsSchema.safeParse(JSON.parse(rawSettings));
    return parsed.success ? parsed.data : defaultPosStandbySettings;
  } catch {
    return defaultPosStandbySettings;
  }
}

export function isWithinPosActivitySchedule(
  settings: PosStandbySettings,
  now: Date,
) {
  if (!settings.enabled) return true;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = timeToMinutes(settings.startTime);
  const endMinutes = timeToMinutes(settings.endTime);

  if (startMinutes < endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}

export function isAutomaticRefreshAllowed({
  settings,
  now,
  temporaryAwakeUntil,
}: {
  settings: PosStandbySettings;
  now: Date;
  temporaryAwakeUntil: number;
}) {
  return (
    now.getTime() < temporaryAwakeUntil ||
    isWithinPosActivitySchedule(settings, now)
  );
}

export function formatPosActivitySchedule(settings: PosStandbySettings) {
  return settings.enabled
    ? `${settings.startTime}–${settings.endTime}`
    : 'Veille désactivée';
}

function timeToMinutes(value: string) {
  const [hours = '0', minutes = '0'] = value.split(':');
  return Number(hours) * 60 + Number(minutes);
}
