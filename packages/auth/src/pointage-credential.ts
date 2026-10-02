import {
  createHmac,
  hkdfSync,
  randomBytes,
  randomInt,
  scrypt,
  timingSafeEqual,
} from 'node:crypto';

export const POINTAGE_CREDENTIAL_FORMAT_VERSION = 1 as const;
export const POINTAGE_CREDENTIAL_ALGORITHM_VERSION = 'scrypt-v1' as const;
export const POINTAGE_CREDENTIAL_KEY_VERSION = 1 as const;
export const POINTAGE_CREDENTIAL_PATTERN = /^[0-9]{8}$/;

export const POINTAGE_SCRYPT_PARAMETERS = Object.freeze({
  N: 32_768,
  r: 8,
  p: 1,
  keyLength: 32,
  saltLength: 16,
  maxmem: 64 * 1024 * 1024,
});

export type PointageCredentialScope = Readonly<{
  organizationId: string;
  establishmentId: string;
}>;

export type PointageCredentialKeys = Readonly<{
  lookup: Buffer;
  verifierPepper: Buffer;
  rateLimit: Buffer;
  dummyVerification: Buffer;
}>;

export type PointageCredentialVerifier = Readonly<{
  algorithmVersion: typeof POINTAGE_CREDENTIAL_ALGORITHM_VERSION;
  keyVersion: typeof POINTAGE_CREDENTIAL_KEY_VERSION;
  salt: string;
  verifier: string;
}>;

const KEY_LABELS = {
  lookup: 'yuta/pointage/v1/lookup',
  verifierPepper: 'yuta/pointage/v1/verifier-pepper',
  rateLimit: 'yuta/pointage/v1/rate-limit',
  dummyVerification: 'yuta/pointage/v1/dummy-verification',
} as const;

const HKDF_SALT = Buffer.from('yuta/pointage/auth/v1', 'utf8');

export function normalizePointageCredential(value: string): string | null {
  return POINTAGE_CREDENTIAL_PATTERN.test(value) ? value : null;
}

export function generatePointageCredential(): string {
  return randomInt(0, 100_000_000).toString().padStart(8, '0');
}

export function decodePointageAuthSecret(encodedSecret: string): Buffer {
  const unpadded = encodedSecret.replace(/=+$/u, '');
  if (!/^[A-Za-z0-9_-]+$/u.test(unpadded)) {
    throw new Error('POINTAGE_AUTH_SECRET must be canonical base64url.');
  }

  const decoded = Buffer.from(unpadded, 'base64url');
  if (decoded.length < 32 || decoded.toString('base64url') !== unpadded) {
    throw new Error('POINTAGE_AUTH_SECRET must decode to at least 32 bytes.');
  }

  return decoded;
}

export function derivePointageCredentialKeys(
  secret: Uint8Array,
): PointageCredentialKeys {
  if (secret.byteLength < 32) {
    throw new Error(
      'Pointage authentication secret must contain at least 32 bytes.',
    );
  }

  const derive = (label: string) =>
    Buffer.from(hkdfSync('sha256', secret, HKDF_SALT, label, 32));

  return Object.freeze({
    lookup: derive(KEY_LABELS.lookup),
    verifierPepper: derive(KEY_LABELS.verifierPepper),
    rateLimit: derive(KEY_LABELS.rateLimit),
    dummyVerification: derive(KEY_LABELS.dummyVerification),
  });
}

function scopedMaterial(scope: PointageCredentialScope, value: string): string {
  return `v1\0${scope.organizationId}\0${scope.establishmentId}\0${value}`;
}

function hmacHex(key: Uint8Array, material: string): string {
  return createHmac('sha256', key).update(material, 'utf8').digest('hex');
}

export function createPointageLookupDigest(
  keys: Pick<PointageCredentialKeys, 'lookup'>,
  scope: PointageCredentialScope,
  credential: string,
): string {
  const normalized = normalizePointageCredential(credential);
  if (normalized === null) {
    throw new Error(
      'Pointage credential must contain exactly eight ASCII digits.',
    );
  }
  return hmacHex(keys.lookup, scopedMaterial(scope, normalized));
}

export function createPointageCandidateRateLimitDigest(
  keys: Pick<PointageCredentialKeys, 'rateLimit'>,
  scope: PointageCredentialScope,
  credential: string,
): string {
  return hmacHex(
    keys.rateLimit,
    `candidate\0${scopedMaterial(scope, credential)}`,
  );
}

export function createPointageClientRateLimitDigest(
  keys: Pick<PointageCredentialKeys, 'rateLimit'>,
  scope: PointageCredentialScope,
  trustedClientAddress: string,
): string {
  if (trustedClientAddress.length === 0) {
    throw new Error('Trusted Pointage client address must not be empty.');
  }
  return hmacHex(
    keys.rateLimit,
    `client\0${scopedMaterial(scope, trustedClientAddress)}`,
  );
}

function scryptAsync(
  input: Buffer,
  salt: Buffer,
  pepper: Buffer,
): Promise<Buffer> {
  const password = Buffer.concat([input, Buffer.from([0]), pepper]);
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      POINTAGE_SCRYPT_PARAMETERS.keyLength,
      {
        N: POINTAGE_SCRYPT_PARAMETERS.N,
        r: POINTAGE_SCRYPT_PARAMETERS.r,
        p: POINTAGE_SCRYPT_PARAMETERS.p,
        maxmem: POINTAGE_SCRYPT_PARAMETERS.maxmem,
      },
      (error, derivedKey) => {
        password.fill(0);
        if (error) {
          reject(error);
          return;
        }
        resolve(derivedKey);
      },
    );
  });
}

export async function createPointageCredentialVerifier(
  keys: Pick<PointageCredentialKeys, 'verifierPepper'>,
  credential: string,
): Promise<PointageCredentialVerifier> {
  const normalized = normalizePointageCredential(credential);
  if (normalized === null) {
    throw new Error(
      'Pointage credential must contain exactly eight ASCII digits.',
    );
  }

  const salt = randomBytes(POINTAGE_SCRYPT_PARAMETERS.saltLength);
  const verifier = await scryptAsync(
    Buffer.from(normalized, 'ascii'),
    salt,
    keys.verifierPepper,
  );
  return Object.freeze({
    algorithmVersion: POINTAGE_CREDENTIAL_ALGORITHM_VERSION,
    keyVersion: POINTAGE_CREDENTIAL_KEY_VERSION,
    salt: salt.toString('base64'),
    verifier: verifier.toString('base64'),
  });
}

export async function verifyPointageCredential(
  keys: Pick<PointageCredentialKeys, 'verifierPepper'>,
  credential: string,
  stored: PointageCredentialVerifier,
): Promise<boolean> {
  const normalized = normalizePointageCredential(credential);
  if (
    normalized === null ||
    stored.algorithmVersion !== POINTAGE_CREDENTIAL_ALGORITHM_VERSION ||
    stored.keyVersion !== POINTAGE_CREDENTIAL_KEY_VERSION
  ) {
    return false;
  }

  const expected = Buffer.from(stored.verifier, 'base64');
  const actual = await scryptAsync(
    Buffer.from(normalized, 'ascii'),
    Buffer.from(stored.salt, 'base64'),
    keys.verifierPepper,
  );
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function runPointageDummyVerification(
  keys: Pick<PointageCredentialKeys, 'dummyVerification'>,
  scope: PointageCredentialScope,
  candidateMaterial: string,
): Promise<boolean> {
  const material = scopedMaterial(scope, candidateMaterial);
  const salt = createHmac('sha256', keys.dummyVerification)
    .update(`salt\0${material}`, 'utf8')
    .digest()
    .subarray(0, POINTAGE_SCRYPT_PARAMETERS.saltLength);
  const expected = createHmac('sha256', keys.dummyVerification)
    .update(`verifier\0${material}`, 'utf8')
    .digest();
  const actual = await scryptAsync(
    Buffer.from(candidateMaterial, 'utf8'),
    salt,
    keys.dummyVerification,
  );
  return timingSafeEqual(expected, actual);
}
