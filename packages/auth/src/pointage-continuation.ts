import {
  createHash,
  createHmac,
  hkdfSync,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import { z } from 'zod';

export const POINTAGE_CONTINUATION_PREFIX = 'ptc1_' as const;
export const POINTAGE_STATE_GUARD_KEY_LABEL =
  'yuta/pointage/raw-state-guard/v1' as const;

const digestPattern = /^[0-9a-f]{64}$/u;
const uuid = z
  .string()
  .uuid()
  .transform((value) => value.toLowerCase());
const headSchema = z
  .object({
    organizationId: uuid,
    establishmentId: uuid,
    personnelDossierId: uuid,
    headEventId: uuid.nullable(),
  })
  .strict();

export type PointageRawHead = Readonly<z.input<typeof headSchema>>;

function decodeCanonical32(value: string): Buffer | null {
  if (value.length !== 43 || !/^[A-Za-z0-9_-]{43}$/u.test(value)) return null;
  const bytes = Buffer.from(value, 'base64url');
  return bytes.length === 32 && bytes.toString('base64url') === value
    ? bytes
    : null;
}

function continuationBytes(value: string): Buffer | null {
  if (value.length !== 48 || !value.startsWith(POINTAGE_CONTINUATION_PREFIX))
    return null;
  return decodeCanonical32(value.slice(POINTAGE_CONTINUATION_PREFIX.length));
}

export function generatePointageContinuation(): string {
  return POINTAGE_CONTINUATION_PREFIX + randomBytes(32).toString('base64url');
}

export function digestPointageContinuation(value: string): string | null {
  const bytes = continuationBytes(value);
  if (bytes === null) return null;
  try {
    return createHash('sha256').update(bytes).digest('hex');
  } finally {
    bytes.fill(0);
  }
}

export function verifyPointageContinuation(
  value: string,
  expectedDigest: string,
): boolean {
  if (expectedDigest.length !== 64 || !digestPattern.test(expectedDigest))
    return false;
  const actual = digestPointageContinuation(value);
  return (
    actual !== null &&
    timingSafeEqual(
      Buffer.from(actual, 'hex'),
      Buffer.from(expectedDigest, 'hex'),
    )
  );
}

export function derivePointageStateGuardKey(secret: Uint8Array): Buffer {
  if (secret.byteLength < 32) throw new Error('Invalid Pointage key material.');
  return Buffer.from(
    hkdfSync(
      'sha256',
      secret,
      Buffer.from('yuta/pointage/auth/v1', 'utf8'),
      POINTAGE_STATE_GUARD_KEY_LABEL,
      32,
    ),
  );
}

function encodeHead(input: PointageRawHead): Buffer {
  const parsed = headSchema.safeParse(input);
  if (!parsed.success) throw new Error('Invalid Pointage state binding.');
  const head = parsed.data;
  const fields = [
    'pointage-raw-state-v1',
    head.organizationId,
    head.establishmentId,
    head.personnelDossierId,
    head.headEventId ?? 'START',
  ];
  return Buffer.concat(
    fields.flatMap((field) => {
      const bytes = Buffer.from(field, 'utf8');
      const size = Buffer.alloc(4);
      size.writeUInt32BE(bytes.length);
      return [size, bytes];
    }),
  );
}

export function createPointageStateGuard(
  key: Uint8Array,
  head: PointageRawHead,
): string {
  if (key.byteLength !== 32) throw new Error('Invalid Pointage state key.');
  return createHmac('sha256', key).update(encodeHead(head)).digest('base64url');
}

export function verifyPointageStateGuard(
  key: Uint8Array,
  head: PointageRawHead,
  candidate: string,
): boolean {
  const bytes = decodeCanonical32(candidate);
  if (bytes === null) return false;
  const expected = Buffer.from(
    createPointageStateGuard(key, head),
    'base64url',
  );
  return timingSafeEqual(bytes, expected);
}
