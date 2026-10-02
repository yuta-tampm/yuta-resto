import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  FORMALITES_LEGAL_SOURCE_PROFILE as profile,
  canonicalizeFormalitesLegalSource as canonicalize,
  validateFormalitesLegalSource as validate,
  hashFormalitesLegalSource as hash,
  parseFormalitesTemplateApplicability as applicability,
  validateStoredFormalitesTemplateApplicability as storedApplicability,
  formalitesTemplateFreezeInput,
} from '../src/formalites-legal-template-domain';

describe('Canonical Legal Source Profile V1', () => {
  it.each([
    [0xef, 0xbb, 0xbf, 65],
    [0xc0, 0xaf],
    [0xe2, 0x82],
    [0xff],
    [0xed, 0xa0, 0x80],
    [0xf4, 0x90, 0x80, 0x80],
  ])('rejects BOM or invalid UTF-8 %j', (...bytes) => {
    expect(() => canonicalize(Buffer.from(bytes), profile)).toThrow(
      'INVALID_SOURCE',
    );
  });
  it('converts only line endings before freeze; validation never repairs stored CR', () => {
    const input = Buffer.from('  a\r\nb\rc\t\n\n');
    expect(canonicalize(input, profile)).toEqual(
      Buffer.from('  a\nb\nc\t\n\n'),
    );
    expect(() => validate(input, profile)).toThrow('INVALID_SOURCE');
    expect(input.toString()).toBe('  a\r\nb\rc\t\n\n');
  });
  it.each(['', 'a', 'a\n', ' \t\n\na  ', 'a\uFEFFb\0', 'é', 'e\u0301'])(
    'preserves exact bytes %j and independent digest',
    (value) => {
      const bytes = Buffer.from(value);
      const output = canonicalize(bytes, profile);
      expect(output).toEqual(bytes);
      expect(output).not.toBe(bytes);
      expect(hash(output)).toBe(
        createHash('sha256').update(bytes).digest('hex'),
      );
      bytes.fill(0);
      expect(output).toEqual(Buffer.from(value));
    },
  );
  it('does not normalize Unicode or accept unknown profiles/non-binary source', () => {
    expect(hash(canonicalize(Buffer.from('é'), profile))).not.toBe(
      hash(canonicalize(Buffer.from('e\u0301'), profile)),
    );
    expect(() => canonicalize(Buffer.from('a'), 'future')).toThrow(
      'INVALID_SOURCE',
    );
    expect(() => canonicalize('a', profile)).toThrow('INVALID_SOURCE');
  });
});

describe('Non-executable applicability declaration', () => {
  it('materializes exactly nine unknown dimensions, not unrestricted defaults', () => {
    const value = applicability({});
    expect(Object.keys(value)).toEqual([
      'jurisdiction',
      'contractCategory',
      'workingTimeBoundary',
      'employeeCategories',
      'employerCategories',
      'collectiveAgreementAssumptions',
      'effectiveDateConstraints',
      'exclusions',
      'bindingConditions',
    ]);
    expect(
      Object.values(value).every((dimension) => dimension.kind === 'unknown'),
    ).toBe(true);
    expect(() => storedApplicability({})).toThrow('INTEGRITY_FAILURE');
  });
  it('preserves declaration strings/order and copies caller objects', () => {
    const input = {
      jurisdiction: {
        kind: 'assertions',
        values: ['  synthetic B ', 'synthetic A'],
      },
    };
    const value = applicability(input);
    input.jurisdiction.values[0] = 'changed';
    expect(value.jurisdiction).toEqual({
      kind: 'assertions',
      values: ['  synthetic B ', 'synthetic A'],
    });
    expect(storedApplicability(value)).toEqual(value);
    expect(storedApplicability(value)).not.toBe(value);
  });
  it.each([
    {
      jurisdiction: {
        kind: 'canonicalReferences',
        values: [{ owner: 'unapproved', referenceId: 'claim' }],
      },
    },
    { jurisdiction: { kind: 'assertions', values: [] } },
    { jurisdiction: { kind: 'assertions', values: [''] } },
    { jurisdiction: { kind: 'unknown', unrestricted: true } },
    { reviewer: 'private' },
    { evidenceUrl: 'private' },
    { metadata: {} },
    { publication: true },
  ])(
    'rejects unsupported owner, private/extra fields and invalid declaration %j',
    (input) => {
      expect(() => applicability(input)).toThrow('INVALID_APPLICABILITY');
    },
  );
  it('freeze input admits only the exact locator/revision, not replacement or authority', () => {
    const input = {
      templateId: '019c0000-0000-7000-8000-000000000001',
      draftId: '019c0000-0000-7000-8000-000000000002',
      expectedRevision: 1,
    };
    expect(formalitesTemplateFreezeInput.parse(input)).toEqual(input);
    for (const extra of [
      'sourceBytes',
      'applicability',
      'contentChecksum',
      'TenantContext',
      'organizationId',
      'operation',
      'systemRole',
    ]) {
      expect(
        formalitesTemplateFreezeInput.safeParse({
          ...input,
          [extra]: 'untrusted',
        }).success,
      ).toBe(false);
    }
    for (const expectedRevision of [0, -1, 1.5, 2147483648])
      expect(
        formalitesTemplateFreezeInput.safeParse({ ...input, expectedRevision })
          .success,
      ).toBe(false);
  });
});
