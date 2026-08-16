import { describe, expect, it } from 'vitest';
import {
  combineContractWeeklyMinutes,
  formatContractWeeklyMinutes,
  formatFixedTermReason,
  splitContractWeeklyMinutes,
} from './employee-employment';

describe('employee employment presentation', () => {
  it('maps stable reason codes to French labels', () => {
    expect(formatFixedTermReason('employee_replacement')).toBe(
      'Remplacement d’un salarié',
    );
    expect(formatFixedTermReason(null)).toBe('Non renseigné');
  });

  it('formats and splits integer weekly minutes without decimal rounding', () => {
    expect(formatContractWeeklyMinutes(1_470)).toBe('24 h 30 par semaine');
    expect(formatContractWeeklyMinutes(60)).toBe('1 heure par semaine');
    expect(formatContractWeeklyMinutes(null)).toBe('Non renseignée');
    expect(splitContractWeeklyMinutes(1_470)).toEqual({
      hours: '24',
      minutes: '30',
    });
    expect(combineContractWeeklyMinutes('24', '30')).toBe('1470');
    expect(combineContractWeeklyMinutes('', '')).toBe('');
  });
});
