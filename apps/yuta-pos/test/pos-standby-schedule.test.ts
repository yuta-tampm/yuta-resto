import { describe, expect, it } from 'vitest';
import {
  defaultPosStandbySettings,
  isAutomaticRefreshAllowed,
  isWithinPosActivitySchedule,
  parsePosStandbySettings,
  type PosStandbySettings,
} from '../src/components/pos/pos-standby-schedule';

const scheduled: PosStandbySettings = {
  version: 1,
  enabled: true,
  startTime: '09:00',
  endTime: '23:00',
};

function localDate(hours: number, minutes = 0) {
  return new Date(2026, 7, 25, hours, minutes, 0, 0);
}

describe('POS standby schedule', () => {
  it('allows automatic refresh when standby is disabled', () => {
    expect(
      isWithinPosActivitySchedule(
        { ...defaultPosStandbySettings, enabled: false },
        localDate(3),
      ),
    ).toBe(true);
  });

  it('includes the opening time and excludes the closing time', () => {
    expect(isWithinPosActivitySchedule(scheduled, localDate(8, 59))).toBe(
      false,
    );
    expect(isWithinPosActivitySchedule(scheduled, localDate(9))).toBe(true);
    expect(isWithinPosActivitySchedule(scheduled, localDate(22, 59))).toBe(
      true,
    );
    expect(isWithinPosActivitySchedule(scheduled, localDate(23))).toBe(false);
  });

  it('supports an activity range that crosses midnight', () => {
    const overnight = {
      ...scheduled,
      startTime: '18:00',
      endTime: '02:00',
    };
    expect(isWithinPosActivitySchedule(overnight, localDate(17, 59))).toBe(
      false,
    );
    expect(isWithinPosActivitySchedule(overnight, localDate(18))).toBe(true);
    expect(isWithinPosActivitySchedule(overnight, localDate(1, 59))).toBe(true);
    expect(isWithinPosActivitySchedule(overnight, localDate(2))).toBe(false);
  });

  it('allows refresh during a temporary wake period', () => {
    const now = localDate(3);
    expect(
      isAutomaticRefreshAllowed({
        settings: scheduled,
        now,
        temporaryAwakeUntil: now.getTime() + 1,
      }),
    ).toBe(true);
    expect(
      isAutomaticRefreshAllowed({
        settings: scheduled,
        now,
        temporaryAwakeUntil: now.getTime(),
      }),
    ).toBe(false);
  });

  it('loads valid persisted settings and falls back safely', () => {
    expect(parsePosStandbySettings(JSON.stringify(scheduled))).toEqual(
      scheduled,
    );
    expect(parsePosStandbySettings('{invalid')).toEqual(
      defaultPosStandbySettings,
    );
    expect(
      parsePosStandbySettings(
        JSON.stringify({ ...scheduled, endTime: scheduled.startTime }),
      ),
    ).toEqual(defaultPosStandbySettings);
    expect(
      parsePosStandbySettings(
        JSON.stringify({
          ...scheduled,
          enabled: false,
          endTime: scheduled.startTime,
        }),
      ),
    ).toEqual({
      ...scheduled,
      enabled: false,
      endTime: scheduled.startTime,
    });
  });
});
