import 'server-only';
import {
  POINTAGE_JSON_BODY_LIMIT_BYTES,
  pointageContinuationSchema,
  pointageIdentifyInputSchema,
  pointageEmptyInputSchema,
  pointageMutationInputSchema,
  pointageRecoverInputSchema,
  pointageContextResponseSchema,
  pointageIdentifyResponseSchema,
  pointageStateResponseSchema,
  pointageCommittedReceiptSchema,
  pointageRecoverResponseSchema,
} from '@yuta/contracts';
import { getPointageRawClockingConsumer } from './raw-clocking-bootstrap';
import type { PointageRawFailureCode } from './raw-clocking-service';

type Operation =
  | 'context'
  | 'identify'
  | 'state'
  | 'clock-in'
  | 'clock-out'
  | 'recover'
  | 'end';
const status: Record<PointageRawFailureCode, number> = {
  POINTAGE_ACCESS_DENIED: 403,
  POINTAGE_TRY_LATER: 429,
  POINTAGE_STATE_CONFLICT: 409,
  POINTAGE_REQUEST_CONFLICT: 409,
  POINTAGE_REQUEST_INVALID: 400,
  POINTAGE_UNAVAILABLE: 503,
};
const headers = {
  'Cache-Control': 'private, no-store, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
};
function failure(code: PointageRawFailureCode) {
  return Response.json({ code }, { status: status[code], headers });
}

async function readBody(request: Request): Promise<unknown> {
  if (
    !/^application\/json(?:\s*;\s*charset=utf-8)?$/iu.test(
      request.headers.get('content-type') ?? '',
    ) ||
    request.headers.has('content-encoding')
  )
    throw new Error('Invalid Pointage request.');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Invalid Pointage request.');
  const parts: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > POINTAGE_JSON_BODY_LIMIT_BYTES) {
        await reader.cancel();
        throw new Error('Invalid Pointage request.');
      }
      parts.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const part of parts) {
      bytes.set(part, offset);
      offset += part.byteLength;
    }
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } finally {
    reader.releaseLock();
  }
}

export async function handlePointageRawClockingRequest(
  request: Request,
  establishmentSlug: string,
  operation: Operation,
): Promise<Response> {
  if (
    request.method !== (operation === 'context' ? 'GET' : 'POST') ||
    new URL(request.url).search
  )
    return failure('POINTAGE_REQUEST_INVALID');
  if (
    operation !== 'context' &&
    (request.headers.get('origin') !== 'http://127.0.0.1:3001' ||
      request.headers.get('sec-fetch-site') === 'cross-site')
  )
    return failure('POINTAGE_ACCESS_DENIED');

  // Admission precedes even PIN/body processing. No route receives bootstrap
  // inputs, client handles, or a factory and no response echoes untrusted input.
  try {
    const consumer = await getPointageRawClockingConsumer();
    if (operation === 'context')
      return Response.json(
        pointageContextResponseSchema.parse(
          await consumer.context(establishmentSlug),
        ),
        { headers },
      );
    let body: unknown;
    try {
      body = await readBody(request);
    } catch {
      return failure('POINTAGE_REQUEST_INVALID');
    }
    if (operation === 'identify') {
      const parsed = pointageIdentifyInputSchema.safeParse(body);
      if (!parsed.success) return failure('POINTAGE_REQUEST_INVALID');
      const result = await consumer.identify({
        establishmentSlug,
        ...parsed.data,
      });
      return result.ok
        ? Response.json(pointageIdentifyResponseSchema.parse(result.value), {
            headers,
          })
        : failure(result.code);
    }
    const authorization = request.headers.get('authorization') ?? '';
    const token = /^Pointage (ptc1_[A-Za-z0-9_-]+)$/u.exec(authorization)?.[1];
    const continuation = pointageContinuationSchema.safeParse(token);
    if (!continuation.success) return failure('POINTAGE_ACCESS_DENIED');
    const input = { establishmentSlug, continuation: continuation.data };
    if (operation === 'state' || operation === 'end') {
      if (!pointageEmptyInputSchema.safeParse(body).success)
        return failure('POINTAGE_REQUEST_INVALID');
      if (operation === 'end') {
        const result = await consumer.end(input);
        return result.ok
          ? new Response(null, { status: 204, headers })
          : failure(result.code);
      }
      const result = await consumer.readState(input);
      return result.ok
        ? Response.json(pointageStateResponseSchema.parse(result.value), {
            headers,
          })
        : failure(result.code);
    }
    if (operation === 'recover') {
      const parsed = pointageRecoverInputSchema.safeParse(body);
      if (!parsed.success) return failure('POINTAGE_REQUEST_INVALID');
      const result = await consumer.recover({ ...input, ...parsed.data });
      return result.ok
        ? Response.json(pointageRecoverResponseSchema.parse(result.value), {
            headers,
          })
        : failure(result.code);
    }
    const parsed = pointageMutationInputSchema.safeParse(body);
    if (!parsed.success) return failure('POINTAGE_REQUEST_INVALID');
    const result = await consumer.mutate({
      ...input,
      ...parsed.data,
      kind: operation === 'clock-in' ? 'CLOCK_IN' : 'CLOCK_OUT',
    });
    return result.ok
      ? Response.json(pointageCommittedReceiptSchema.parse(result.value), {
          headers,
        })
      : failure(result.code);
  } catch {
    return failure('POINTAGE_UNAVAILABLE');
  }
}
