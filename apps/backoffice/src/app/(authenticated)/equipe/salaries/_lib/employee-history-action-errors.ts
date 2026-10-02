import {
  employeeEditHistoryFieldKey,
  employeeEditSemanticGroups,
  type EmployeeEditSemanticGroup,
} from './employee-edit-flow';

type SubmittedMetadata = {
  semanticGroup: EmployeeEditSemanticGroup;
  classification: unknown;
  effectiveDate: unknown;
  correctionReason: unknown;
};

const groupLabels: Record<EmployeeEditSemanticGroup, string> = {
  identity: 'Identité',
  role: 'Poste et qualification',
  contract_terms: 'Conditions du contrat',
  work_time: 'Temps de travail',
  entry: 'Date d’entrée',
};

export function mapPersonnelHistoryMetadataError(input: {
  repositoryMessage: string;
  submittedMetadata: unknown;
  businessDate: string;
  entryDate: string;
}): { message: string; fieldErrors: Record<string, string> } {
  const metadata = readSubmittedMetadata(input.submittedMetadata);
  const group = findGroupInMessage(input.repositoryMessage);
  const fieldErrors: Record<string, string> = {};

  if (input.repositoryMessage.includes('must not be in the future')) {
    addEffectiveDateErrors(
      fieldErrors,
      metadata.filter(
        (item) =>
          typeof item.effectiveDate === 'string' &&
          item.effectiveDate > input.businessDate,
      ),
      'La date d’effet ne peut pas être dans le futur.',
    );
    return withFallback(
      'Choisissez une date d’effet aujourd’hui ou antérieure.',
      fieldErrors,
    );
  }
  if (input.repositoryMessage.includes('authoritative entry date')) {
    addEffectiveDateErrors(
      fieldErrors,
      metadata.filter(
        (item) =>
          typeof item.effectiveDate === 'string' &&
          item.effectiveDate < input.entryDate,
      ),
      'La date d’effet ne peut pas précéder la date d’entrée.',
    );
    return withFallback(
      'La date d’effet doit respecter la date d’entrée.',
      fieldErrors,
    );
  }
  if (input.repositoryMessage.includes('after the departure date')) {
    addEffectiveDateErrors(
      fieldErrors,
      metadata.filter((item) => item.classification === 'change'),
      'La date d’effet ne peut pas dépasser la date de départ.',
    );
    return withFallback(
      'La date d’effet doit respecter la date de départ.',
      fieldErrors,
    );
  }
  if (input.repositoryMessage.includes('effective date is required') && group) {
    fieldErrors[employeeEditHistoryFieldKey(group, 'effectiveDate')] =
      'Renseignez la date d’effet.';
    return {
      message: `Complétez la date d’effet pour « ${groupLabels[group]} ».`,
      fieldErrors,
    };
  }
  if (
    input.repositoryMessage.includes('correction reason is required') &&
    group
  ) {
    fieldErrors[employeeEditHistoryFieldKey(group, 'correctionReason')] =
      'Expliquez brièvement la correction.';
    return {
      message: `Complétez le motif pour « ${groupLabels[group]} ».`,
      fieldErrors,
    };
  }
  if (
    input.repositoryMessage.includes('Entry date changes must be classified')
  ) {
    fieldErrors[employeeEditHistoryFieldKey('entry', 'classification')] =
      'La date d’entrée accepte uniquement une correction.';
    return {
      message: 'La date d’entrée doit être enregistrée comme une correction.',
      fieldErrors,
    };
  }
  if (input.repositoryMessage.includes('correction reason is not allowed')) {
    for (const item of metadata.filter(
      (candidate) =>
        candidate.classification === 'change' &&
        typeof candidate.correctionReason === 'string' &&
        candidate.correctionReason.trim(),
    )) {
      fieldErrors[
        employeeEditHistoryFieldKey(item.semanticGroup, 'correctionReason')
      ] = 'Un changement ne doit pas contenir de motif de correction.';
    }
    return withFallback(
      'Retirez le motif de correction du changement.',
      fieldErrors,
    );
  }
  if (group) {
    fieldErrors[employeeEditHistoryFieldKey(group, 'classification')] =
      input.repositoryMessage.includes('unchanged group')
        ? 'Ce groupe n’a pas été modifié. Vérifiez les valeurs du formulaire.'
        : 'Choisissez un type de modification valide.';
    return {
      message: `Vérifiez la modification « ${groupLabels[group]} ».`,
      fieldErrors,
    };
  }
  return withFallback(
    'Vérifiez la nature des modifications avant d’enregistrer.',
    fieldErrors,
  );
}

function readSubmittedMetadata(value: unknown): SubmittedMetadata[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const candidate = item as Record<string, unknown>;
    if (!isEmployeeEditGroup(candidate.semanticGroup)) return [];
    return [
      {
        semanticGroup: candidate.semanticGroup,
        classification: candidate.classification,
        effectiveDate: candidate.effectiveDate,
        correctionReason: candidate.correctionReason,
      },
    ];
  });
}

function isEmployeeEditGroup(
  value: unknown,
): value is EmployeeEditSemanticGroup {
  return (
    typeof value === 'string' &&
    (employeeEditSemanticGroups as readonly string[]).includes(value)
  );
}

function findGroupInMessage(message: string) {
  return employeeEditSemanticGroups.find((group) => message.includes(group));
}

function addEffectiveDateErrors(
  fieldErrors: Record<string, string>,
  metadata: readonly SubmittedMetadata[],
  message: string,
) {
  for (const item of metadata) {
    fieldErrors[
      employeeEditHistoryFieldKey(item.semanticGroup, 'effectiveDate')
    ] = message;
  }
}

function withFallback(message: string, fieldErrors: Record<string, string>) {
  if (Object.keys(fieldErrors).length === 0) {
    fieldErrors.historyMetadata = message;
  }
  return { message, fieldErrors };
}
