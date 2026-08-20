import { describe, expect, it } from 'vitest';
import { assertSiteAgentTimeZone, readSiteAgentEnv } from '../src/env';

const baseEnvironment = {
  POS_DATABASE_URL: 'postgres://test:test@localhost:5432/yuta_pos_test',
  TZ: 'Europe/Paris',
};

describe('site-agent timezone configuration', () => {
  it('requires the approved Europe/Paris process timezone', () => {
    expect(readSiteAgentEnv(baseEnvironment).TZ).toBe('Europe/Paris');
    expect(() => readSiteAgentEnv({ ...baseEnvironment, TZ: 'UTC' })).toThrow();
  });

  it('fails closed when the runtime does not resolve the configured timezone', () => {
    expect(() =>
      assertSiteAgentTimeZone('Europe/Paris', 'Europe/Paris'),
    ).not.toThrow();
    expect(() => assertSiteAgentTimeZone('Europe/Paris', 'UTC')).toThrow(
      /must resolve to Europe\/Paris/,
    );
  });
});
