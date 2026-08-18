import { describe, expect, it } from 'vitest';
import { isPersonnelActionOverviewEnabled } from './personnel-action-overview-runtime';

describe('personnel action overview runtime gate', () => {
  it('enables the local development slice only', () => {
    expect(isPersonnelActionOverviewEnabled('development')).toBe(true);
    expect(isPersonnelActionOverviewEnabled('production')).toBe(false);
    expect(isPersonnelActionOverviewEnabled('test')).toBe(false);
    expect(isPersonnelActionOverviewEnabled(undefined)).toBe(false);
  });
});
