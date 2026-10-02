import {
  pointageCommittedReceiptSchema,
  pointageFailureResponseSchema,
  pointageIdentifyResponseSchema,
  pointageRecoverResponseSchema,
  pointageStateResponseSchema,
  type PointageCommittedReceiptResponse,
  type PointageFailureResponse,
  type PointageIdentifyResponse,
  type PointageMutationInput,
  type PointageRecoverInput,
  type PointageRecoverResponse,
  type PointageStateResponse,
} from '@yuta/contracts';

export type PointageClientResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: PointageFailureResponse['code'] | 'RESULT_UNKNOWN' };

const failureStatus: Record<PointageFailureResponse['code'], number> = {
  POINTAGE_ACCESS_DENIED: 403,
  POINTAGE_TRY_LATER: 429,
  POINTAGE_STATE_CONFLICT: 409,
  POINTAGE_REQUEST_CONFLICT: 409,
  POINTAGE_REQUEST_INVALID: 400,
  POINTAGE_UNAVAILABLE: 503,
};

// Stateless transport only. Origin is supplied by the browser, never fabricated
// here. No cookies, persistence, retry policy, or environment composition.
async function post<T>(
  slug: string,
  operation:
    | 'identify'
    | 'state'
    | 'clock-in'
    | 'clock-out'
    | 'recover'
    | 'end',
  body: object,
  parse: (value: unknown) => T,
  continuation?: string,
  signal?: AbortSignal,
): Promise<PointageClientResult<T>> {
  try {
    if (!slug || slug === '.' || slug === '..')
      return { ok: false, code: 'POINTAGE_UNAVAILABLE' };
    const response = await fetch(
      `/api/pointage/${encodeURIComponent(slug)}/${operation}`,
      {
        method: 'POST',
        credentials: 'omit',
        cache: 'no-store',
        redirect: 'error',
        signal,
        headers: {
          'Content-Type': 'application/json',
          ...(continuation
            ? { Authorization: `Pointage ${continuation}` }
            : {}),
        },
        body: JSON.stringify(body),
      },
    );
    if (operation === 'end' && response.status === 204)
      return { ok: true, value: parse(null) };
    const payload: unknown = await response.json();
    if (response.status === 200 && operation !== 'end')
      return { ok: true, value: parse(payload) };
    const failure = pointageFailureResponseSchema.safeParse(payload);
    if (failure.success && response.status === failureStatus[failure.data.code])
      return { ok: false, code: failure.data.code };
  } catch {
    // A lost or malformed response is not evidence of attendance failure.
  }
  return { ok: false, code: 'RESULT_UNKNOWN' };
}

export function identifyPointage(
  slug: string,
  credential: string,
  signal?: AbortSignal,
): Promise<PointageClientResult<PointageIdentifyResponse>> {
  return post(
    slug,
    'identify',
    { credential },
    (value) => pointageIdentifyResponseSchema.parse(value),
    undefined,
    signal,
  );
}

export function mutatePointage(
  slug: string,
  continuation: string,
  kind: PointageCommittedReceiptResponse['kind'],
  input: PointageMutationInput,
  signal?: AbortSignal,
): Promise<PointageClientResult<PointageCommittedReceiptResponse>> {
  return post(
    slug,
    kind === 'CLOCK_IN' ? 'clock-in' : 'clock-out',
    input,
    (value) => {
      const receipt = pointageCommittedReceiptSchema.parse(value);
      if (receipt.kind !== kind || receipt.requestId !== input.requestId)
        throw new Error('Unconfirmed Pointage response.');
      return receipt;
    },
    continuation,
    signal,
  );
}

export function endPointage(slug: string, continuation: string) {
  return post(slug, 'end', {}, () => undefined, continuation);
}

export function readPointageState(
  slug: string,
  continuation: string,
  signal?: AbortSignal,
): Promise<PointageClientResult<PointageStateResponse>> {
  return post(
    slug,
    'state',
    {},
    (value) => pointageStateResponseSchema.parse(value),
    continuation,
    signal,
  );
}

export function recoverPointage(
  slug: string,
  continuation: string,
  input: Readonly<PointageRecoverInput>,
  signal?: AbortSignal,
): Promise<PointageClientResult<PointageRecoverResponse>> {
  return post(
    slug,
    'recover',
    input,
    (value) => {
      const result = pointageRecoverResponseSchema.parse(value);
      if (
        result.result === 'COMMITTED' &&
        (result.requestId !== input.requestId || result.kind !== input.kind)
      )
        throw new Error('Unconfirmed Pointage response.');
      return result;
    },
    continuation,
    signal,
  );
}
