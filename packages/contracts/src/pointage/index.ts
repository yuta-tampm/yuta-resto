import { z } from 'zod';

export const POINTAGE_JSON_BODY_LIMIT_BYTES = 4_096;

// Canonical unpadded base64url for exactly 32 bytes. No crypto or trusted
// employee context belongs in these serialization-only contracts.
const opaque32Schema = z
  .string()
  .length(43)
  .regex(/^[A-Za-z0-9_-]{42}[AEIMQUYcgkosw048]$/u);
export const pointageContinuationSchema = z
  .string()
  .length(48)
  .regex(/^ptc1_[A-Za-z0-9_-]{42}[AEIMQUYcgkosw048]$/u);
export const pointageStateGuardSchema = opaque32Schema;
export const pointageRequestIdSchema = z
  .string()
  .length(36)
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu,
  );
export const pointageClockKindSchema = z.enum(['CLOCK_IN', 'CLOCK_OUT']);

export const pointageIdentifyInputSchema = z
  .object({
    credential: z
      .string()
      .length(8)
      .regex(/^[0-9]{8}$/u),
  })
  .strict();
export const pointageEmptyInputSchema = z.object({}).strict();
export const pointageMutationInputSchema = z
  .object({
    requestId: pointageRequestIdSchema,
    observedStateGuard: pointageStateGuardSchema,
  })
  .strict();
export const pointageRecoverInputSchema = pointageMutationInputSchema
  .extend({ kind: pointageClockKindSchema })
  .strict();

const instantSchema = z.string().datetime({ precision: 6 });
const businessDateSchema = z
  .string()
  .length(10)
  .regex(/^\d{4}-\d{2}-\d{2}$/u)
  .refine((value) => {
    const instant = Date.parse(value + 'T00:00:00Z');
    return (
      Number.isFinite(instant) &&
      new Date(instant).toISOString().slice(0, 10) === value
    );
  });
const calendar = {
  timezoneName: z.string().min(1),
  utcOffsetSeconds: z.number().int().min(-50_400).max(50_400),
  businessDate: businessDateSchema,
};
export const pointageOpenSessionStartSchema = z
  .object({ instant: instantSchema, ...calendar })
  .strict();
const employee = {
  displayName: z.string().min(1),
  stateGuard: pointageStateGuardSchema,
};
export const pointageEmployeeStateSchema = z.discriminatedUnion('status', [
  z
    .object({
      ...employee,
      status: z.literal('NOT_CLOCKED_IN'),
      openSessionStart: z.null(),
    })
    .strict(),
  z
    .object({
      ...employee,
      status: z.literal('CLOCKED_IN'),
      openSessionStart: pointageOpenSessionStartSchema,
    })
    .strict(),
]);
const lifetime = {
  // The service floors microseconds to remaining milliseconds; a still-live
  // sub-millisecond deadline therefore serializes as zero, never as renewal.
  expiresInMs: z.number().int().nonnegative().max(120_000),
  idleInMs: z.number().int().nonnegative().max(60_000),
};
export const pointageStateResponseSchema = z
  .object({ state: pointageEmployeeStateSchema, ...lifetime })
  .strict()
  .refine((value) => value.idleInMs <= value.expiresInMs);
export const pointageIdentifyResponseSchema = z
  .object({
    continuation: pointageContinuationSchema,
    state: pointageEmployeeStateSchema,
    ...lifetime,
  })
  .strict()
  .refine((value) => value.idleInMs <= value.expiresInMs);
export const pointageContextResponseSchema = z
  .object({ available: z.literal(true) })
  .strict();
export const pointageCommittedReceiptSchema = z
  .object({
    requestId: pointageRequestIdSchema,
    result: z.literal('COMMITTED'),
    kind: pointageClockKindSchema,
    acceptedAt: instantSchema,
    ...calendar,
  })
  .strict();
export const pointageRecoverResponseSchema = z.union([
  pointageCommittedReceiptSchema,
  z.object({ result: z.literal('UNCONFIRMED') }).strict(),
]);
export const pointageFailureResponseSchema = z
  .object({
    code: z.enum([
      'POINTAGE_ACCESS_DENIED',
      'POINTAGE_TRY_LATER',
      'POINTAGE_STATE_CONFLICT',
      'POINTAGE_REQUEST_CONFLICT',
      'POINTAGE_REQUEST_INVALID',
      'POINTAGE_UNAVAILABLE',
    ]),
  })
  .strict();

export type PointageIdentifyInput = z.infer<typeof pointageIdentifyInputSchema>;
export type PointageMutationInput = z.infer<typeof pointageMutationInputSchema>;
export type PointageRecoverInput = z.infer<typeof pointageRecoverInputSchema>;
export type PointageEmployeeStateResponse = z.infer<
  typeof pointageEmployeeStateSchema
>;
export type PointageIdentifyResponse = z.infer<
  typeof pointageIdentifyResponseSchema
>;
export type PointageStateResponse = z.infer<typeof pointageStateResponseSchema>;
export type PointageCommittedReceiptResponse = z.infer<
  typeof pointageCommittedReceiptSchema
>;
export type PointageRecoverResponse = z.infer<
  typeof pointageRecoverResponseSchema
>;
export type PointageFailureResponse = z.infer<
  typeof pointageFailureResponseSchema
>;
