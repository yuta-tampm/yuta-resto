import { describe, expect, it } from 'vitest';
import { HttpError } from '../src/http';
import {
  buildInstructionSnapshots,
  buildVariantSnapshots,
} from '../src/services/instruction-snapshots';

describe('local order instruction snapshots', () => {
  it('persists stable labels for known quick instructions', () => {
    expect(buildInstructionSnapshots(['SANS_SAUCE'])).toEqual([
      {
        instructionId: 'qi_sans_sauce',
        code: 'SANS_SAUCE',
        labelSnapshot: 'Sans sauce',
      },
    ]);
  });

  it('rejects conflicting quick instructions', () => {
    expect(() =>
      buildInstructionSnapshots(['SANS_SAUCE', 'SAUCE_A_PART']),
    ).toThrowError(HttpError);
  });

  it('uses catalog variant policy without matching an item name', () => {
    const options = [
      { code: 'MANGUE', label: 'Mangue' },
      { code: 'MATCHA', label: 'Matcha' },
    ];
    expect(
      buildVariantSnapshots(options, 2, 1, [
        { code: 'MANGUE', quantity: 1 },
        { code: 'MATCHA', quantity: 1 },
      ]),
    ).toHaveLength(2);
    expect(() =>
      buildVariantSnapshots(options, 2, 1, [{ code: 'MANGUE', quantity: 3 }]),
    ).toThrowError(HttpError);
  });
});
