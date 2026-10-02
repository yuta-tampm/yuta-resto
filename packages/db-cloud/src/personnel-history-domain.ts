import {
  personnelHistoryMutationGroupMetadataSchema,
  type PersonnelHistoryClassification,
  type PersonnelHistoryMutationGroupMetadata,
  type PersonnelHistorySemanticGroup,
  type PersonnelHistoryStoredSnapshot,
  type UpdatePersonnelEmployeeInput,
} from '@yuta/contracts/personnel';
import { parsePersonnelHistoryStoredSnapshot } from './personnel-history-cutover';

export type PersonnelHistoryDossierFacts = {
  givenNames: string;
  familyName: string;
  position: string;
  qualification: string;
  employmentTermType: 'indefinite' | 'fixed_term';
  expectedEndDate: string | null;
  fixedTermReasonCode:
    | 'employee_replacement'
    | 'temporary_activity_increase'
    | 'seasonal_employment'
    | 'customary_use_employment'
    | null;
  workTimeCategory: 'full_time' | 'part_time';
  contractWeeklyMinutes: number | null;
  entryDate: string;
  departureDate: string | null;
};

export type PersonnelHistoryMutationEvidence = {
  semanticGroup: PersonnelHistorySemanticGroup;
  classification: PersonnelHistoryClassification;
  previousSnapshot: PersonnelHistoryStoredSnapshot;
  newSnapshot: PersonnelHistoryStoredSnapshot;
  effectiveDate: string | null;
  correctionReason: string | null;
};

export class PersonnelHistoryMetadataError extends Error {
  readonly code = 'PERSONNEL_HISTORY_METADATA_INVALID';

  constructor(message: string) {
    super(message);
  }
}

const updateSemanticGroups = [
  'identity',
  'role',
  'contract_terms',
  'work_time',
  'entry',
] as const;

export function derivePersonnelHistoryMutationEvidence(input: {
  current: PersonnelHistoryDossierFacts;
  proposed: UpdatePersonnelEmployeeInput;
  businessDate: string;
}): PersonnelHistoryMutationEvidence[] {
  const metadata = parseMetadata(input.proposed.historyMetadata ?? []);
  const snapshots = updateSemanticGroups.map((semanticGroup) => ({
    semanticGroup,
    previousSnapshot: snapshot(semanticGroup, input.current),
    newSnapshot: snapshot(semanticGroup, input.proposed),
  }));
  const changed = snapshots.filter(
    ({ previousSnapshot, newSnapshot }) =>
      JSON.stringify(previousSnapshot.values) !==
      JSON.stringify(newSnapshot.values),
  );
  const changedGroups = new Set<PersonnelHistorySemanticGroup>(
    changed.map((item) => item.semanticGroup),
  );

  for (const supplied of metadata.values()) {
    if (!changedGroups.has(supplied.semanticGroup)) {
      throw new PersonnelHistoryMetadataError(
        `History metadata was supplied for unchanged group ${supplied.semanticGroup}.`,
      );
    }
  }
  if (changed.length !== metadata.size) {
    const missing = changed.find((item) => !metadata.has(item.semanticGroup));
    throw new PersonnelHistoryMetadataError(
      `History metadata is required for changed group ${missing?.semanticGroup ?? 'unknown'}.`,
    );
  }

  return changed.map(({ semanticGroup, previousSnapshot, newSnapshot }) => {
    const groupMetadata = metadata.get(semanticGroup);
    if (!groupMetadata) {
      throw new PersonnelHistoryMetadataError(
        `History metadata is required for changed group ${semanticGroup}.`,
      );
    }
    validateGroupMetadata({
      metadata: groupMetadata,
      businessDate: input.businessDate,
      authoritativeEntryDate: input.proposed.entryDate,
      departureDate: input.current.departureDate,
    });
    return {
      semanticGroup,
      classification: groupMetadata.classification,
      previousSnapshot,
      newSnapshot,
      effectiveDate: groupMetadata.effectiveDate,
      correctionReason: groupMetadata.correctionReason,
    };
  });
}

export function createDepartureHistoryMutationEvidence(input: {
  currentDepartureDate: string | null;
  newDepartureDate: string | null;
  correctionReason: string | null;
}): PersonnelHistoryMutationEvidence {
  const isCorrection = input.currentDepartureDate !== null;
  return {
    semanticGroup: 'departure',
    classification: isCorrection ? 'correction' : 'change',
    previousSnapshot: parsePersonnelHistoryStoredSnapshot('departure', {
      payloadVersion: 1,
      departureDate: input.currentDepartureDate,
    }),
    newSnapshot: parsePersonnelHistoryStoredSnapshot('departure', {
      payloadVersion: 1,
      departureDate: input.newDepartureDate,
    }),
    effectiveDate: null,
    correctionReason: isCorrection ? input.correctionReason : null,
  };
}

function parseMetadata(raw: PersonnelHistoryMutationGroupMetadata[]) {
  const result = new Map<
    PersonnelHistorySemanticGroup,
    PersonnelHistoryMutationGroupMetadata
  >();
  for (const item of raw) {
    const metadata = personnelHistoryMutationGroupMetadataSchema.parse(item);
    if (metadata.semanticGroup === 'departure') {
      throw new PersonnelHistoryMetadataError(
        'Departure metadata is controlled by the departure command.',
      );
    }
    if (result.has(metadata.semanticGroup)) {
      throw new PersonnelHistoryMetadataError(
        `Duplicate history metadata for group ${metadata.semanticGroup}.`,
      );
    }
    result.set(metadata.semanticGroup, metadata);
  }
  return result;
}

function validateGroupMetadata(input: {
  metadata: PersonnelHistoryMutationGroupMetadata;
  businessDate: string;
  authoritativeEntryDate: string;
  departureDate: string | null;
}) {
  const { metadata } = input;
  if (
    metadata.semanticGroup === 'entry' &&
    metadata.classification !== 'correction'
  ) {
    throw new PersonnelHistoryMetadataError(
      'Entry date changes must be classified as corrections.',
    );
  }

  const datedChangeGroups = new Set<PersonnelHistorySemanticGroup>([
    'role',
    'contract_terms',
    'work_time',
  ]);
  const requiresEffectiveDate =
    metadata.classification === 'change' &&
    datedChangeGroups.has(metadata.semanticGroup);
  if (requiresEffectiveDate) {
    if (!metadata.effectiveDate) {
      throw new PersonnelHistoryMetadataError(
        `An effective date is required for ${metadata.semanticGroup} changes.`,
      );
    }
    if (metadata.effectiveDate > input.businessDate) {
      throw new PersonnelHistoryMetadataError(
        'The effective date must not be in the future.',
      );
    }
    if (metadata.effectiveDate < input.authoritativeEntryDate) {
      throw new PersonnelHistoryMetadataError(
        'The effective date must not precede the authoritative entry date.',
      );
    }
    if (input.departureDate && metadata.effectiveDate > input.departureDate) {
      throw new PersonnelHistoryMetadataError(
        'The effective date must not be after the departure date.',
      );
    }
  } else if (metadata.effectiveDate !== null) {
    throw new PersonnelHistoryMetadataError(
      `An effective date is not allowed for ${metadata.semanticGroup} ${metadata.classification}.`,
    );
  }

  const reasonRequired =
    metadata.classification === 'correction' &&
    (metadata.semanticGroup === 'entry' ||
      metadata.semanticGroup === 'contract_terms' ||
      metadata.semanticGroup === 'work_time');
  if (reasonRequired && !metadata.correctionReason) {
    throw new PersonnelHistoryMetadataError(
      `A correction reason is required for ${metadata.semanticGroup}.`,
    );
  }
  if (
    metadata.classification === 'change' &&
    metadata.correctionReason !== null
  ) {
    throw new PersonnelHistoryMetadataError(
      'A correction reason is not allowed for a change.',
    );
  }
}

function snapshot(
  semanticGroup: (typeof updateSemanticGroups)[number],
  facts: PersonnelHistoryDossierFacts | UpdatePersonnelEmployeeInput,
): PersonnelHistoryStoredSnapshot {
  switch (semanticGroup) {
    case 'identity':
      return parsePersonnelHistoryStoredSnapshot('identity', {
        payloadVersion: 1,
        givenNames: facts.givenNames,
        familyName: facts.familyName,
      });
    case 'role':
      return parsePersonnelHistoryStoredSnapshot('role', {
        payloadVersion: 1,
        position: facts.position,
        qualification: facts.qualification,
      });
    case 'contract_terms':
      return parsePersonnelHistoryStoredSnapshot('contract_terms', {
        payloadVersion: 1,
        employmentTermType: facts.employmentTermType,
        expectedEndDate: facts.expectedEndDate,
        fixedTermReasonCode: facts.fixedTermReasonCode,
      });
    case 'work_time':
      return parsePersonnelHistoryStoredSnapshot('work_time', {
        payloadVersion: 1,
        workTimeCategory: facts.workTimeCategory,
        contractWeeklyMinutes: facts.contractWeeklyMinutes,
      });
    case 'entry':
      return parsePersonnelHistoryStoredSnapshot('entry', {
        payloadVersion: 1,
        entryDate: facts.entryDate,
      });
  }
}
