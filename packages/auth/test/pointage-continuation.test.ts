import { createHash, createHmac, hkdfSync } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import * as crypto from 'node:crypto';
import {
  createPointageStateGuard,
  derivePointageStateGuardKey,
  digestPointageContinuation,
  generatePointageContinuation,
  verifyPointageContinuation,
  verifyPointageStateGuard,
} from '../src/pointage-continuation';
import { derivePointageCredentialKeys } from '../src/pointage-credential';

vi.mock('node:crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:crypto')>();
  return { ...actual, randomBytes: vi.fn(actual.randomBytes) };
});

const head = Object.freeze({
  organizationId: '11111111-1111-4111-8111-111111111111',
  establishmentId: '22222222-2222-4222-8222-222222222222',
  personnelDossierId: '33333333-3333-4333-8333-333333333333',
  headEventId: null,
});
const secret = Buffer.alloc(32, 7);
const key = derivePointageStateGuardKey(secret);
const token = 'ptc1_' + Buffer.alloc(32).toString('base64url');

describe('Pointage F1 continuation and raw state guard primitives', () => {
  it('A1/A6: uses exactly 32 CSPRNG bytes and the canonical opaque representation', () => {
    const random = vi.mocked(crypto.randomBytes);
    random.mockReturnValueOnce(Buffer.alloc(32, 9) as never);
    expect(generatePointageContinuation()).toBe(
      'ptc1_' + Buffer.alloc(32, 9).toString('base64url'),
    );
    expect(random).toHaveBeenCalledWith(32);
    const tokens = new Set(
      Array.from({ length: 100 }, generatePointageContinuation),
    );
    expect(tokens.size).toBe(100);
    for (const value of tokens) {
      expect(value).toHaveLength(48);
      expect(value).toMatch(/^ptc1_[A-Za-z0-9_-]{43}$/u);
    }
  });

  it('A6: hashes decoded secret bytes, not a token or serialized context', () => {
    const expected =
      '66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925';
    expect(digestPointageContinuation(token)).toBe(expected);
    expect(verifyPointageContinuation(token, expected)).toBe(true);
    expect(
      verifyPointageContinuation(generatePointageContinuation(), expected),
    ).toBe(false);
    expect(digestPointageContinuation(token)).not.toBe(
      createHash('sha256').update(token).digest('hex'),
    );
  });

  it.each([
    '',
    token + '\n',
    token + '=',
    ' ' + token,
    token.slice(1),
    token.replace('ptc1_', 'ptc2_'),
    token.slice(0, -1) + 'B',
    'ptc1_' + 'Ａ'.repeat(43),
  ])('rejects malformed continuation %# without normalization', (value) => {
    expect(digestPointageContinuation(value)).toBeNull();
    expect(verifyPointageContinuation(value, '0'.repeat(64))).toBe(false);
  });

  it.each([
    '',
    '0'.repeat(63),
    '0'.repeat(65),
    'g'.repeat(64),
    'A'.repeat(64),
    '0'.repeat(64) + '\n',
  ])('rejects malformed stored digest %#', (value) => {
    expect(verifyPointageContinuation(token, value)).toBe(false);
  });

  it('F1: separates the state key from all existing credential keys', () => {
    const expected = Buffer.from(
      hkdfSync(
        'sha256',
        secret,
        Buffer.from('yuta/pointage/auth/v1'),
        'yuta/pointage/raw-state-guard/v1',
        32,
      ),
    );
    expect(key).toEqual(expected);
    for (const existing of Object.values(derivePointageCredentialKeys(secret)))
      expect(key).not.toEqual(existing);
    expect(() => derivePointageStateGuardKey(Buffer.alloc(31))).toThrow(
      'Invalid Pointage key material.',
    );
    expect(secret).toEqual(Buffer.alloc(32, 7));
  });

  it('R6: authenticates a versioned length-delimited scoped head', () => {
    const fields = [
      'pointage-raw-state-v1',
      head.organizationId,
      head.establishmentId,
      head.personnelDossierId,
      'START',
    ];
    const encoded = Buffer.alloc(
      fields.reduce((n, field) => n + 4 + Buffer.byteLength(field), 0),
    );
    let offset = 0;
    for (const field of fields) {
      offset = encoded.writeUInt32BE(Buffer.byteLength(field), offset);
      offset += encoded.write(field, offset, 'utf8');
    }
    const expected = createHmac('sha256', key)
      .update(encoded)
      .digest('base64url');
    expect(createPointageStateGuard(key, head)).toBe(expected);
    expect(verifyPointageStateGuard(key, head, expected)).toBe(true);
    for (const field of [
      'organizationId',
      'establishmentId',
      'personnelDossierId',
      'headEventId',
    ] as const) {
      expect(
        verifyPointageStateGuard(
          key,
          { ...head, [field]: '44444444-4444-4444-8444-444444444444' },
          expected,
        ),
      ).toBe(false);
    }
    expect(verifyPointageStateGuard(Buffer.alloc(32, 8), head, expected)).toBe(
      false,
    );
    for (const malformed of [
      '',
      expected + '\n',
      expected + '=',
      expected.slice(1),
      'A'.repeat(42) + 'B',
    ])
      expect(verifyPointageStateGuard(key, head, malformed)).toBe(false);
    expect(() => createPointageStateGuard(Buffer.alloc(31), head)).toThrow();
    expect(() =>
      createPointageStateGuard(key, {
        ...head,
        personnelDossierId: 'invalid\0scope',
      }),
    ).toThrow('Invalid Pointage state binding.');
  });

  it('A6/F1: remains persistence/framework/environment/logging free and uses timing-safe equality', () => {
    const source = readFileSync(
      new URL('../src/pointage-continuation.ts', import.meta.url),
      'utf8',
    );
    expect(source).toContain('timingSafeEqual(');
    expect(source).not.toMatch(
      /console\.|process\.env|@yuta\/db|node:fs|next\/|localStorage|sessionStorage/u,
    );
    expect(source).not.toContain('JSON.stringify');
  });
});
