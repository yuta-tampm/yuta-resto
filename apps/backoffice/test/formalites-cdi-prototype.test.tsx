import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CdiDraftReadinessPrototype } from '../src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-readiness-prototype';
import { cdiDraftPrototypeData } from '../src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-prototype';

describe('CDI draft readiness prototype', () => {
  it('uses only the bounded fictional fixture', () => {
    expect(cdiDraftPrototypeData.fictionalEmployee).toBe('Camille Martin');
    expect(cdiDraftPrototypeData.reusableFields).toHaveLength(6);
    expect(cdiDraftPrototypeData.formalityFields).toHaveLength(3);
    expect(JSON.stringify(cdiDraftPrototypeData)).not.toContain('employeeId');
  });

  it('states the read-only boundary and disables document generation', () => {
    const markup = renderToStaticMarkup(<CdiDraftReadinessPrototype />);

    expect(markup).toContain('données entièrement fictives');
    expect(markup).toContain('ne lit pas le dossier salarié ouvert');
    expect(markup).toContain('Aucun fichier n’est créé');
    expect(markup).toContain('disabled');
  });
});
