import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CdiDraftReadinessPrototype } from '../src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-readiness-prototype';
import {
  cdiDraftPrototypeData,
  cdiDraftPrototypeReducer,
  createCdiDraftPrototypeState,
  getCdiDraftDemoReadiness,
  isCdiDraftCheckpointDirty,
} from '../src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-prototype';

describe('CDI draft readiness prototype', () => {
  it('uses only the bounded fictional fixture', () => {
    expect(cdiDraftPrototypeData.fictionalEmployee).toBe('Camille Martin');
    expect(cdiDraftPrototypeData.reusableFields).toHaveLength(6);
    expect(JSON.stringify(cdiDraftPrototypeData)).not.toContain('employeeId');
    expect(JSON.stringify(cdiDraftPrototypeData)).not.toContain('documentId');
    expect(JSON.stringify(cdiDraftPrototypeData)).not.toContain(
      'establishmentId',
    );
  });

  it('states the transient boundary and keeps generation disabled', () => {
    const markup = renderToStaticMarkup(<CdiDraftReadinessPrototype />);

    expect(markup).toContain('données entièrement fictives');
    expect(markup).toContain('Rien n’est lu depuis un dossier salarié');
    expect(markup).toContain('Interaction locale uniquement');
    expect(markup).toContain('rien n’est conservé au rechargement');
    expect(markup).not.toContain('localStorage');
  });

  it('derives demo readiness without treating missing or undecided values as ready', () => {
    const initial = createCdiDraftPrototypeState();
    expect(getCdiDraftDemoReadiness(initial.draftValues, false)).toBe(
      'INCOMPLETE',
    );

    const withRequiredInputs = cdiDraftPrototypeReducer(
      cdiDraftPrototypeReducer(initial, {
        type: 'EDIT_VALUE',
        field: 'address',
        value: '10 rue fictive',
      }),
      {
        type: 'EDIT_VALUE',
        field: 'remuneration',
        value: 'Valeur fictive',
      },
    );
    expect(
      getCdiDraftDemoReadiness(withRequiredInputs.draftValues, false),
    ).toBe('ATTENTION_REQUIRED');

    const withDecision = cdiDraftPrototypeReducer(withRequiredInputs, {
      type: 'EDIT_VALUE',
      field: 'probationChoice',
      value: 'no',
    });
    const reviewed = cdiDraftPrototypeReducer(withDecision, {
      type: 'SET_REVIEW_ACKNOWLEDGED',
      acknowledged: true,
    });
    expect(getCdiDraftDemoReadiness(reviewed.draftValues, true)).toBe('READY');
  });

  it('keeps checkpoints in reducer memory and resets to the fictional fixture', () => {
    const initial = createCdiDraftPrototypeState();
    const edited = cdiDraftPrototypeReducer(initial, {
      type: 'EDIT_VALUE',
      field: 'address',
      value: 'Adresse fictive',
    });
    expect(isCdiDraftCheckpointDirty(edited)).toBe(true);

    const checkpointed = cdiDraftPrototypeReducer(edited, {
      type: 'CREATE_CHECKPOINT',
    });
    expect(isCdiDraftCheckpointDirty(checkpointed)).toBe(false);

    const editedAgain = cdiDraftPrototypeReducer(checkpointed, {
      type: 'EDIT_VALUE',
      field: 'address',
      value: 'Nouvelle adresse fictive',
    });
    expect(isCdiDraftCheckpointDirty(editedAgain)).toBe(true);

    const reset = cdiDraftPrototypeReducer(editedAgain, { type: 'RESET' });
    expect(reset).toEqual(createCdiDraftPrototypeState());
    expect(reset.checkpointValues).toBeNull();
  });

  it('blocks the review step until required demo inputs are populated', () => {
    const initial = createCdiDraftPrototypeState();
    const blocked = cdiDraftPrototypeReducer(initial, {
      type: 'REQUEST_REVIEW',
    });
    expect(blocked.activeStep).toBe('INPUTS');
    expect(blocked.validationAttempted).toBe(true);

    const completed = {
      ...blocked,
      draftValues: {
        ...blocked.draftValues,
        address: 'Adresse fictive',
        remuneration: 'Valeur fictive',
      },
    };
    const review = cdiDraftPrototypeReducer(completed, {
      type: 'REQUEST_REVIEW',
    });
    expect(review.activeStep).toBe('REVIEW');
  });
});
