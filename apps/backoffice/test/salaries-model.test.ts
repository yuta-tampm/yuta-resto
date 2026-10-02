import { describe, expect, it } from 'vitest';
import { getEmployeeDossierHref } from '../src/app/(authenticated)/equipe/salaries/salaries-model';

describe('salaries model', () => {
  it('builds the addressable full employee dossier route', () => {
    expect(getEmployeeDossierHref('11111111-1111-4111-8111-111111111111')).toBe(
      '/equipe/salaries/11111111-1111-4111-8111-111111111111',
    );
  });
});
