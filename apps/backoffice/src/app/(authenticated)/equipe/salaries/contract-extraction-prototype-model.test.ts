import { describe, expect, it } from 'vitest';
import {
  contractExtractionPrototypeSuggestions,
  getContractExtractionConfidenceLabel,
  getSelectedContractExtractionSuggestions,
} from './contract-extraction-prototype-model';

describe('contract extraction prototype model', () => {
  it('contains only the three approved fictional employment suggestions', () => {
    expect(
      contractExtractionPrototypeSuggestions.map(
        (suggestion) => suggestion.field,
      ),
    ).toEqual(['position', 'employmentTermType', 'contractWeeklyMinutes']);
  });

  it('does not select a suggestion by confidence', () => {
    expect(getSelectedContractExtractionSuggestions({})).toEqual([]);
    expect(
      getSelectedContractExtractionSuggestions({
        position: 'keep',
        employmentTermType: 'use',
      }).map((suggestion) => suggestion.field),
    ).toEqual(['employmentTermType']);
  });

  it('uses textual confidence labels', () => {
    expect(getContractExtractionConfidenceLabel('high')).toBe('Élevée');
    expect(getContractExtractionConfidenceLabel('medium')).toBe('Moyenne');
    expect(getContractExtractionConfidenceLabel('low')).toBe('Faible');
  });
});
