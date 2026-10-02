export type ContractExtractionPrototypeField =
  | 'position'
  | 'employmentTermType'
  | 'contractWeeklyMinutes';

export type ContractExtractionPrototypeConfidence = 'high' | 'medium' | 'low';

export type ContractExtractionPrototypeChoice = 'keep' | 'use';

export type ContractExtractionPrototypeSuggestion = Readonly<{
  field: ContractExtractionPrototypeField;
  label: string;
  currentValue: string;
  detectedValue: string;
  confidence: ContractExtractionPrototypeConfidence;
  sourcePage: number;
  fictionalExcerpt: string;
}>;

export const contractExtractionPrototypeSuggestions = [
  {
    field: 'position',
    label: 'Poste',
    currentValue: 'Employé polyvalent',
    detectedValue: 'Chef de rang',
    confidence: 'high',
    sourcePage: 2,
    fictionalExcerpt:
      'Le salarié exercera les fonctions de chef de rang au sein de l’établissement.',
  },
  {
    field: 'employmentTermType',
    label: 'Type de contrat',
    currentValue: 'CDI',
    detectedValue: 'CDD',
    confidence: 'medium',
    sourcePage: 1,
    fictionalExcerpt:
      'Le présent contrat est conclu pour une durée déterminée.',
  },
  {
    field: 'contractWeeklyMinutes',
    label: 'Durée hebdomadaire',
    currentValue: 'Non renseignée',
    detectedValue: '35 h par semaine',
    confidence: 'low',
    sourcePage: 3,
    fictionalExcerpt:
      'La durée hebdomadaire de travail est fixée à trente-cinq heures.',
  },
] as const satisfies ReadonlyArray<ContractExtractionPrototypeSuggestion>;

export type ContractExtractionPrototypeChoices = Partial<
  Record<ContractExtractionPrototypeField, ContractExtractionPrototypeChoice>
>;

export function getSelectedContractExtractionSuggestions(
  choices: ContractExtractionPrototypeChoices,
): ReadonlyArray<ContractExtractionPrototypeSuggestion> {
  return contractExtractionPrototypeSuggestions.filter(
    (suggestion) => choices[suggestion.field] === 'use',
  );
}

export function getContractExtractionConfidenceLabel(
  confidence: ContractExtractionPrototypeConfidence,
): string {
  switch (confidence) {
    case 'high':
      return 'Élevée';
    case 'medium':
      return 'Moyenne';
    case 'low':
      return 'Faible';
  }
}
