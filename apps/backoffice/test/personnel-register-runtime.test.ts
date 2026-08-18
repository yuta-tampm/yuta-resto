import { describe, expect, it } from 'vitest';
import { isPersonnelRegisterEnabled } from '../src/app/(authenticated)/equipe/registre-personnel/_lib/personnel-register-runtime';

describe('personnel register runtime gate', () => {
  it('enables the real register only in local development', () => {
    expect(isPersonnelRegisterEnabled('development')).toBe(true);
    expect(isPersonnelRegisterEnabled('production')).toBe(false);
    expect(isPersonnelRegisterEnabled('test')).toBe(false);
    expect(isPersonnelRegisterEnabled(undefined)).toBe(false);
  });
});
