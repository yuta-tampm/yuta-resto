import 'server-only';

import { createHash } from 'node:crypto';
import { getPersonnelDocumentRuntime } from './runtime';

const maxSignedPdfBytes = 10 * 1024 * 1024;

export type SignedPdfFileCheck =
  | { status: 'valid'; file: File; content: Uint8Array }
  | { status: 'missing' }
  | { status: 'too_large' }
  | { status: 'invalid' };

export async function checkSignedPdfFile(
  value: FormDataEntryValue | null,
): Promise<SignedPdfFileCheck> {
  if (!(value instanceof File) || value.size === 0) {
    return { status: 'missing' };
  }
  if (value.size > maxSignedPdfBytes) return { status: 'too_large' };
  const content = new Uint8Array(await value.arrayBuffer());
  if (
    value.type !== 'application/pdf' ||
    new TextDecoder('ascii').decode(content.slice(0, 5)) !== '%PDF-'
  ) {
    return { status: 'invalid' };
  }
  return { status: 'valid', file: value, content };
}

export function signedPdfChecksum(content: Uint8Array): string {
  return createHash('sha256').update(content).digest('hex');
}

export async function quarantineSignedPdf(
  content: Uint8Array,
): Promise<string> {
  const { storage } = await getPersonnelDocumentRuntime();
  return storage.putQuarantinedObject(content);
}

export async function scanAndPromoteSignedPdf(
  storageKey: string,
): Promise<void> {
  const { storage, scanner } = await getPersonnelDocumentRuntime();
  const quarantined = await storage.readQuarantinedObject(storageKey);
  await scanner.inspectQuarantinedObject(quarantined);
  await storage.promoteVerifiedObject(storageKey);
}

export async function removeSignedPdf(storageKey: string): Promise<void> {
  const { storage } = await getPersonnelDocumentRuntime();
  await storage.removeObject(storageKey);
}

export async function discardSignedPdf(
  storageKey: string | null,
  failureLogMessage: string,
): Promise<void> {
  if (!storageKey) return;
  try {
    await removeSignedPdf(storageKey);
  } catch {
    console.error(failureLogMessage);
  }
}
