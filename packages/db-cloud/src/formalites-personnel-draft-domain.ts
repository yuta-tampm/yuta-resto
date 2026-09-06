import { createHash } from 'node:crypto';
import {
  formalitesPersonnelFactsSchema,
  formalitesPersonnelReconciliationDecisionsSchema,
  type FormalitesPersonnelFact,
  type FormalitesPersonnelFacts,
  type FormalitesPersonnelReconciliationDecision,
} from '@yuta/contracts';

export const FORMALITES_PERSONNEL_FACTS = [
  'givenNames',
  'familyName',
  'position',
  'qualification',
  'employmentTermType',
  'entryDate',
  'contractWeeklyMinutes',
] as const satisfies readonly FormalitesPersonnelFact[];

export class FormalitesPersonnelReconciliationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormalitesPersonnelReconciliationError';
  }
}

export function normalizeFormalitesPersonnelFacts(
  values: FormalitesPersonnelFacts,
): FormalitesPersonnelFacts {
  return formalitesPersonnelFactsSchema.parse(values);
}

export function deriveFormalitesPersonnelDivergentFacts(
  acknowledgedSourceValues: FormalitesPersonnelFacts,
  currentPersonnelValues: FormalitesPersonnelFacts,
): FormalitesPersonnelFact[] {
  const source = normalizeFormalitesPersonnelFacts(acknowledgedSourceValues);
  const current = normalizeFormalitesPersonnelFacts(currentPersonnelValues);

  return FORMALITES_PERSONNEL_FACTS.filter(
    (fact) => source[fact] !== current[fact],
  );
}

export function createFormalitesPersonnelSourceStateFingerprint(
  currentPersonnelValues: FormalitesPersonnelFacts,
): string {
  const normalized = normalizeFormalitesPersonnelFacts(currentPersonnelValues);
  const canonicalValues = FORMALITES_PERSONNEL_FACTS.map((fact) => [
    fact,
    normalized[fact],
  ]);

  return createHash('sha256')
    .update(JSON.stringify(canonicalValues), 'utf8')
    .digest('hex');
}

export function applyFormalitesPersonnelReconciliation(input: {
  draftValues: FormalitesPersonnelFacts;
  acknowledgedSourceValues: FormalitesPersonnelFacts;
  currentPersonnelValues: FormalitesPersonnelFacts;
  decisions: readonly FormalitesPersonnelReconciliationDecision[];
}): {
  draftValues: FormalitesPersonnelFacts;
  acknowledgedSourceValues: FormalitesPersonnelFacts;
  reconciledFacts: FormalitesPersonnelFact[];
} {
  const draftValues = normalizeFormalitesPersonnelFacts(input.draftValues);
  const acknowledgedSourceValues = normalizeFormalitesPersonnelFacts(
    input.acknowledgedSourceValues,
  );
  const currentPersonnelValues = normalizeFormalitesPersonnelFacts(
    input.currentPersonnelValues,
  );
  const decisions = formalitesPersonnelReconciliationDecisionsSchema.parse(
    input.decisions,
  );
  const divergentFacts = deriveFormalitesPersonnelDivergentFacts(
    acknowledgedSourceValues,
    currentPersonnelValues,
  );
  const decisionMap = new Map(
    decisions.map((decision) => [decision.fact, decision.choice]),
  );

  if (
    decisions.length !== divergentFacts.length ||
    divergentFacts.some((fact) => !decisionMap.has(fact))
  ) {
    throw new FormalitesPersonnelReconciliationError(
      'Reconciliation decisions must match the exact divergent fact set.',
    );
  }

  const nextDraftValues = { ...draftValues };
  const nextSourceValues = { ...acknowledgedSourceValues };

  for (const fact of divergentFacts) {
    assignFormalitesPersonnelFact(
      nextSourceValues,
      fact,
      currentPersonnelValues,
    );
    if (decisionMap.get(fact) === 'refresh') {
      assignFormalitesPersonnelFact(
        nextDraftValues,
        fact,
        currentPersonnelValues,
      );
    }
  }

  return {
    draftValues: nextDraftValues,
    acknowledgedSourceValues: nextSourceValues,
    reconciledFacts: divergentFacts,
  };
}

function assignFormalitesPersonnelFact(
  target: FormalitesPersonnelFacts,
  fact: FormalitesPersonnelFact,
  source: FormalitesPersonnelFacts,
): void {
  switch (fact) {
    case 'givenNames':
      target.givenNames = source.givenNames;
      return;
    case 'familyName':
      target.familyName = source.familyName;
      return;
    case 'position':
      target.position = source.position;
      return;
    case 'qualification':
      target.qualification = source.qualification;
      return;
    case 'employmentTermType':
      target.employmentTermType = source.employmentTermType;
      return;
    case 'entryDate':
      target.entryDate = source.entryDate;
      return;
    case 'contractWeeklyMinutes':
      target.contractWeeklyMinutes = source.contractWeeklyMinutes;
  }
}
