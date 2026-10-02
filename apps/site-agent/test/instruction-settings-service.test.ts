import type { LocalInstructionSettings } from '@yuta/contracts/local-pos';
import { describe, expect, it } from 'vitest';
import { HttpError } from '../src/http';
import {
  assertInstructionAssignments,
  resolveInstructionConfig,
} from '../src/services/instruction-settings-service';

const settings: LocalInstructionSettings = {
  quickInstructionOptions: [
    { code: 'SANS_ALCOOL', label: 'Sans alcool', conflictsWith: [] },
    { code: 'SANS_GLACONS', label: 'Sans glaçons', conflictsWith: [] },
  ],
  allergenOptions: [],
};

describe('local instruction settings', () => {
  it('inherits category choices when the item has no override', () => {
    expect(
      resolveInstructionConfig(
        settings,
        {
          defaultInstructionCodes: ['SANS_ALCOOL'],
          additionalInstructionCodes: ['SANS_GLACONS'],
        },
        {
          defaultInstructionCodes: null,
          additionalInstructionCodes: null,
        },
      ),
    ).toEqual({
      defaultOptions: [settings.quickInstructionOptions[0]],
      additionalOptions: [settings.quickInstructionOptions[1]],
    });
  });

  it('allows an item to replace the inherited choices', () => {
    expect(
      resolveInstructionConfig(
        settings,
        {
          defaultInstructionCodes: ['SANS_ALCOOL'],
          additionalInstructionCodes: [],
        },
        {
          defaultInstructionCodes: ['SANS_GLACONS'],
          additionalInstructionCodes: [],
        },
      ).defaultOptions,
    ).toEqual([settings.quickInstructionOptions[1]]);
  });

  it('rejects unknown, duplicate, and partial-inheritance assignments', () => {
    const cases = [
      {
        defaultInstructionCodes: ['UNKNOWN'],
        additionalInstructionCodes: [],
      },
      {
        defaultInstructionCodes: ['SANS_ALCOOL'],
        additionalInstructionCodes: ['SANS_ALCOOL'],
      },
      {
        defaultInstructionCodes: null,
        additionalInstructionCodes: [],
      },
    ];

    for (const assignment of cases) {
      expect(() => assertInstructionAssignments(settings, assignment)).toThrow(
        HttpError,
      );
    }
  });
});
