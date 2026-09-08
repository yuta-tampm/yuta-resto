import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  POINTAGE_CREDENTIAL_ALGORITHM_VERSION,
  POINTAGE_CREDENTIAL_KEY_VERSION,
  POINTAGE_CREDENTIAL_PATTERN,
  POINTAGE_SCRYPT_PARAMETERS,
  createPointageCandidateRateLimitDigest,
  createPointageClientRateLimitDigest,
  createPointageCredentialVerifier,
  createPointageLookupDigest,
  decodePointageAuthSecret,
  derivePointageCredentialKeys,
  generatePointageCredential,
  normalizePointageCredential,
  runPointageDummyVerification,
  verifyPointageCredential,
} from '../src/pointage-credential';

const scope = {
  organizationId: '11111111-1111-4111-8111-111111111111',
  establishmentId: '22222222-2222-4222-8222-222222222222',
};
const keys = derivePointageCredentialKeys(Buffer.alloc(32, 7));

describe('Pointage credential primitives', () => {
  it('accepts exactly eight ASCII digits and generates the canonical format', () => {
    expect(normalizePointageCredential('00000000')).toBe('00000000');
    expect(normalizePointageCredential('99999999')).toBe('99999999');
    for (const rejected of [
      '1234567',
      '123456789',
      '１２３４５６７８',
      '1234-5678',
      ' 12345678',
    ]) {
      expect(normalizePointageCredential(rejected)).toBeNull();
    }
    for (let index = 0; index < 1_000; index += 1) {
      expect(generatePointageCredential()).toMatch(POINTAGE_CREDENTIAL_PATTERN);
    }
  });

  it('requires a canonical base64url secret containing at least 32 bytes', () => {
    const encoded = randomBytes(32).toString('base64url');
    expect(decodePointageAuthSecret(encoded)).toHaveLength(32);
    expect(() =>
      decodePointageAuthSecret(Buffer.alloc(31).toString('base64url')),
    ).toThrow();
    expect(() => decodePointageAuthSecret('not+base64')).toThrow();
  });

  it('derives separated keys and scope-separated lowercase digests', () => {
    expect(
      new Set(Object.values(keys).map((key) => key.toString('hex'))).size,
    ).toBe(4);
    const digest = createPointageLookupDigest(keys, scope, '12345678');
    expect(digest).toMatch(/^[a-f0-9]{64}$/u);
    expect(
      createPointageLookupDigest(
        keys,
        { ...scope, establishmentId: 'other' },
        '12345678',
      ),
    ).not.toBe(digest);
    expect(
      createPointageCandidateRateLimitDigest(keys, scope, '12345678'),
    ).not.toBe(digest);
    expect(
      createPointageClientRateLimitDigest(keys, scope, '203.0.113.1'),
    ).not.toBe(digest);
  });

  it('uses the approved scrypt parameters and constant-time verifier result', async () => {
    expect(POINTAGE_SCRYPT_PARAMETERS).toEqual({
      N: 32_768,
      r: 8,
      p: 1,
      keyLength: 32,
      saltLength: 16,
      maxmem: 64 * 1024 * 1024,
    });
    const stored = await createPointageCredentialVerifier(keys, '12345678');
    expect(stored.algorithmVersion).toBe(POINTAGE_CREDENTIAL_ALGORITHM_VERSION);
    expect(stored.keyVersion).toBe(POINTAGE_CREDENTIAL_KEY_VERSION);
    expect(Buffer.from(stored.salt, 'base64')).toHaveLength(16);
    expect(Buffer.from(stored.verifier, 'base64')).toHaveLength(32);
    expect(JSON.stringify(stored)).not.toContain('12345678');
    await expect(
      verifyPointageCredential(keys, '12345678', stored),
    ).resolves.toBe(true);
    await expect(
      verifyPointageCredential(keys, '87654321', stored),
    ).resolves.toBe(false);
    await expect(
      verifyPointageCredential(keys, '12345678', {
        ...stored,
        keyVersion: 2 as never,
      }),
    ).resolves.toBe(false);
  });

  it('runs deterministic dummy verification without accepting the candidate', async () => {
    await expect(
      runPointageDummyVerification(keys, scope, 'bad-input'),
    ).resolves.toBe(false);
    await expect(
      runPointageDummyVerification(keys, scope, 'bad-input'),
    ).resolves.toBe(false);
  });
});
