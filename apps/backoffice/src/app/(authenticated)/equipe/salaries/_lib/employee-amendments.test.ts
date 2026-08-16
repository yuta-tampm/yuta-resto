import { describe, expect, it } from 'vitest';
import { formatEmployeeAmendmentDate } from './employee-amendments';

describe('employee amendments presentation', () => {
  it('formats an effective date without timezone drift', () => {
    expect(formatEmployeeAmendmentDate('2025-03-15', 'fr-FR')).toBe(
      '15 mars 2025',
    );
  });
});
