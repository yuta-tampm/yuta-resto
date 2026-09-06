import { describe, expect, it } from 'vitest';
import {
  applyFormalitesPersonnelReconciliation,
  createFormalitesPersonnelSourceStateFingerprint,
  deriveFormalitesPersonnelDivergentFacts,
  FormalitesPersonnelReconciliationError,
  normalizeFormalitesPersonnelFacts,
} from '../src/formalites-personnel-draft-domain';

const source = {
  givenNames: 'Camille',
  familyName: 'Martin',
  position: 'Serveuse',
  qualification: 'Employée',
  employmentTermType: 'indefinite' as const,
  entryDate: '2026-09-01',
  contractWeeklyMinutes: null,
};

describe('Formalités Personnel draft domain', () => {
  it('normalizes only the approved facts and preserves null minutes', () => {
    expect(normalizeFormalitesPersonnelFacts(source)).toEqual(source);
    expect(() =>
      normalizeFormalitesPersonnelFacts({
        ...source,
        position: '  Cheffe de rang  ',
      }),
    ).not.toThrow();
    expect(
      normalizeFormalitesPersonnelFacts({
        ...source,
        position: '  Cheffe de rang  ',
      }).position,
    ).toBe('Cheffe de rang');
  });

  it('creates a stable normalized source fingerprint', () => {
    const first = createFormalitesPersonnelSourceStateFingerprint(source);
    const sameNormalizedState = createFormalitesPersonnelSourceStateFingerprint(
      {
        ...source,
        position: '  Serveuse  ',
      },
    );
    const changed = createFormalitesPersonnelSourceStateFingerprint({
      ...source,
      position: 'Cheffe de rang',
    });

    expect(first).toMatch(/^[a-f0-9]{64}$/u);
    expect(sameNormalizedState).toBe(first);
    expect(changed).not.toBe(first);
  });

  it('returns no divergence for an unchanged acknowledged source', () => {
    expect(deriveFormalitesPersonnelDivergentFacts(source, source)).toEqual([]);
  });

  it('applies mixed KEEP and REFRESH without mutating inputs', () => {
    const draft = { ...source };
    const current = {
      ...source,
      position: 'Cheffe de rang',
      qualification: 'Employée qualifiée',
    };
    const result = applyFormalitesPersonnelReconciliation({
      draftValues: draft,
      acknowledgedSourceValues: source,
      currentPersonnelValues: current,
      decisions: [
        { fact: 'position', choice: 'keep' },
        { fact: 'qualification', choice: 'refresh' },
      ],
    });

    expect(result.reconciledFacts).toEqual(['position', 'qualification']);
    expect(result.draftValues.position).toBe('Serveuse');
    expect(result.draftValues.qualification).toBe('Employée qualifiée');
    expect(result.acknowledgedSourceValues).toEqual(current);
    expect(draft).toEqual(source);
    expect(source.position).toBe('Serveuse');
    expect(
      deriveFormalitesPersonnelDivergentFacts(
        result.acknowledgedSourceValues,
        current,
      ),
    ).toEqual([]);
  });

  it('detects a later Personnel change after an acknowledged KEEP', () => {
    const firstCurrent = { ...source, position: 'Cheffe de rang' };
    const first = applyFormalitesPersonnelReconciliation({
      draftValues: source,
      acknowledgedSourceValues: source,
      currentPersonnelValues: firstCurrent,
      decisions: [{ fact: 'position', choice: 'keep' }],
    });

    expect(first.draftValues.position).toBe('Serveuse');
    expect(first.acknowledgedSourceValues.position).toBe('Cheffe de rang');
    expect(
      deriveFormalitesPersonnelDivergentFacts(first.acknowledgedSourceValues, {
        ...firstCurrent,
        position: 'Directrice de salle',
      }),
    ).toEqual(['position']);
  });

  it('rejects missing, extra, or duplicate reconciliation decisions', () => {
    const current = { ...source, position: 'Cheffe de rang' };
    expect(() =>
      applyFormalitesPersonnelReconciliation({
        draftValues: source,
        acknowledgedSourceValues: source,
        currentPersonnelValues: current,
        decisions: [],
      }),
    ).toThrow(FormalitesPersonnelReconciliationError);
    expect(() =>
      applyFormalitesPersonnelReconciliation({
        draftValues: source,
        acknowledgedSourceValues: source,
        currentPersonnelValues: current,
        decisions: [{ fact: 'familyName', choice: 'keep' }],
      }),
    ).toThrow(FormalitesPersonnelReconciliationError);
    expect(() =>
      applyFormalitesPersonnelReconciliation({
        draftValues: source,
        acknowledgedSourceValues: source,
        currentPersonnelValues: current,
        decisions: [
          { fact: 'position', choice: 'keep' },
          { fact: 'position', choice: 'refresh' },
        ],
      }),
    ).toThrow();
  });
});
