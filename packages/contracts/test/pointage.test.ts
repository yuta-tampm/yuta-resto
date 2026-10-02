import { describe, expect, it } from 'vitest';
import * as dto from '../src/pointage';

const guard = 'A'.repeat(43);
const requestId = '11111111-1111-4111-8111-111111111111';
const command = { requestId, observedStateGuard: guard };
const state = {
  displayName: 'Camille Exemple',
  status: 'NOT_CLOCKED_IN',
  openSessionStart: null,
  stateGuard: guard,
};
const calendar = {
  timezoneName: 'Europe/Paris',
  utcOffsetSeconds: 7200,
  businessDate: '2026-09-08',
};
const receipt = {
  requestId,
  result: 'COMMITTED',
  kind: 'CLOCK_IN',
  acceptedAt: '2026-09-08T10:00:00.123456Z',
  ...calendar,
};

describe('Pointage employee transport allowlists', () => {
  it('accepts only the four approved strict request shapes below 4 KiB', () => {
    const pairs = [
      [dto.pointageIdentifyInputSchema, { credential: '12345678' }],
      [dto.pointageEmptyInputSchema, {}],
      [dto.pointageMutationInputSchema, command],
      [dto.pointageRecoverInputSchema, { ...command, kind: 'CLOCK_OUT' }],
    ] as const;
    for (const [schema, value] of pairs) {
      expect(schema.safeParse(value).success).toBe(true);
      expect(
        new TextEncoder().encode(JSON.stringify(value)).length,
      ).toBeLessThan(dto.POINTAGE_JSON_BODY_LIMIT_BYTES);
      for (const key of [
        'organizationId',
        'establishmentId',
        'personnelDossierId',
        'role',
        'context',
        'acceptedAt',
        'extra',
      ])
        expect(schema.safeParse({ ...value, [key]: 'untrusted' }).success).toBe(
          false,
        );
    }
  });
  it.each([
    '',
    '1234567',
    '123456789',
    '12345678\n',
    '１２３４５６７８',
    ' 12345678',
    '1234 678',
  ])('rejects malformed credential %j without normalization', (credential) => {
    expect(
      dto.pointageIdentifyInputSchema.safeParse({ credential }).success,
    ).toBe(false);
  });
  it('rejects UUID aliases, non-v4 identities and unauthorized mutation kinds', () => {
    for (const id of [
      requestId + '\n',
      requestId + ' ',
      requestId.replace('-4111-', '-7111-'),
      'invalid',
    ])
      expect(
        dto.pointageMutationInputSchema.safeParse({ ...command, requestId: id })
          .success,
      ).toBe(false);
    expect(
      dto.pointageMutationInputSchema.safeParse({
        ...command,
        kind: 'CLOCK_IN',
      }).success,
    ).toBe(false);
    expect(
      dto.pointageRecoverInputSchema.safeParse({ ...command, kind: 'BREAK' })
        .success,
    ).toBe(false);
  });
  it('requires canonical 32-byte token and guard encodings', () => {
    expect(
      dto.pointageContinuationSchema.safeParse('ptc1_' + guard).success,
    ).toBe(true);
    for (const token of [
      guard,
      'ptc1_' + 'A'.repeat(42) + 'B',
      'ptc1_' + guard + '=',
      'ptc1_' + guard + '\n',
    ])
      expect(dto.pointageContinuationSchema.safeParse(token).success).toBe(
        false,
      );
    for (const value of [
      guard + '\n',
      guard + '=',
      'A'.repeat(42) + 'B',
      'a'.repeat(10000),
    ])
      expect(dto.pointageStateGuardSchema.safeParse(value).success).toBe(false);
  });
  it('allows only consistent minimal state with no history, totals or trusted identity', () => {
    expect(dto.pointageEmployeeStateSchema.safeParse(state).success).toBe(true);
    const open = { instant: receipt.acceptedAt, ...calendar };
    expect(
      dto.pointageEmployeeStateSchema.safeParse({
        ...state,
        status: 'CLOCKED_IN',
        openSessionStart: open,
      }).success,
    ).toBe(true);
    expect(
      dto.pointageEmployeeStateSchema.safeParse({
        ...state,
        openSessionStart: open,
      }).success,
    ).toBe(false);
    expect(
      dto.pointageEmployeeStateSchema.safeParse({
        ...state,
        status: 'CLOCKED_IN',
      }).success,
    ).toBe(false);
    for (const key of [
      'history',
      'dailyTotal',
      'priorClockOut',
      'personnelDossierId',
      'credential',
    ])
      expect(
        dto.pointageEmployeeStateSchema.safeParse({ ...state, [key]: [] })
          .success,
      ).toBe(false);
  });
  it('bounds continuation lifetimes and rejects extra protected response fields', () => {
    const identified = {
      continuation: 'ptc1_' + guard,
      state,
      expiresInMs: 120000,
      idleInMs: 60000,
    };
    expect(
      dto.pointageIdentifyResponseSchema.safeParse(identified).success,
    ).toBe(true);
    for (const value of [
      { ...identified, expiresInMs: 120001 },
      { ...identified, idleInMs: 60001 },
      { ...identified, expiresInMs: 1000 },
      { ...identified, idleInMs: -1 },
      { ...identified, credential: '12345678' },
    ])
      expect(dto.pointageIdentifyResponseSchema.safeParse(value).success).toBe(
        false,
      );
    expect(dto.pointageStateResponseSchema.safeParse(identified).success).toBe(
      false,
    );
    expect(
      dto.pointageIdentifyResponseSchema.safeParse({
        ...identified,
        expiresInMs: 0,
        idleInMs: 0,
      }).success,
    ).toBe(true);
  });
  it('preserves microseconds and the inclusive integer-second historical offset domain', () => {
    for (const utcOffsetSeconds of [-50400, -50399, -1, 0, 1, 50399, 50400])
      expect(
        dto.pointageCommittedReceiptSchema.parse({
          ...receipt,
          utcOffsetSeconds,
        }).acceptedAt,
      ).toBe(receipt.acceptedAt);
    for (const utcOffsetSeconds of [-50401, 50401, 1.5, Infinity, NaN])
      expect(
        dto.pointageCommittedReceiptSchema.safeParse({
          ...receipt,
          utcOffsetSeconds,
        }).success,
      ).toBe(false);
    for (const acceptedAt of [
      '2026-09-08T10:00:00.123Z',
      '2026-09-08T10:00:00.123456Z\n',
      '2026-02-30T10:00:00.123456Z',
    ])
      expect(
        dto.pointageCommittedReceiptSchema.safeParse({ ...receipt, acceptedAt })
          .success,
      ).toBe(false);
    expect(
      dto.pointageCommittedReceiptSchema.safeParse({
        ...receipt,
        businessDate: '2026-02-30',
      }).success,
    ).toBe(false);
  });
  it('keeps UNCONFIRMED distinct from committed attendance and public failures generic', () => {
    expect(
      dto.pointageRecoverResponseSchema.parse({ result: 'UNCONFIRMED' }),
    ).toEqual({ result: 'UNCONFIRMED' });
    expect(dto.pointageRecoverResponseSchema.parse(receipt)).toEqual(receipt);
    expect(
      dto.pointageRecoverResponseSchema.safeParse({
        result: 'UNCONFIRMED',
        acceptedAt: receipt.acceptedAt,
      }).success,
    ).toBe(false);
    expect(
      dto.pointageContextResponseSchema.safeParse({
        available: true,
        employees: [],
      }).success,
    ).toBe(false);
    expect(
      dto.pointageFailureResponseSchema.parse({
        code: 'POINTAGE_ACCESS_DENIED',
      }),
    ).toEqual({ code: 'POINTAGE_ACCESS_DENIED' });
    expect(
      dto.pointageFailureResponseSchema.safeParse({
        code: 'POINTAGE_ACCESS_DENIED',
        reason: 'former',
      }).success,
    ).toBe(false);
  });
});
