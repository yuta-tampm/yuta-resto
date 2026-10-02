import 'server-only';

import { execFile } from 'node:child_process';
import { constants } from 'node:fs';
import {
  access,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

const execFileAsync = promisify(execFile);
const storageKeySchema = z.string().uuid();

export interface PersonnelDocumentStorage {
  putQuarantinedObject(content: Uint8Array): Promise<string>;
  readQuarantinedObject(storageKey: string): Promise<Uint8Array>;
  promoteVerifiedObject(storageKey: string): Promise<void>;
  openAvailableObject(storageKey: string): Promise<Uint8Array>;
  removeObject(storageKey: string): Promise<void>;
}

export interface PersonnelDocumentScanner {
  inspectQuarantinedObject(content: Uint8Array): Promise<void>;
}

export class PersonnelDocumentScannerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PersonnelDocumentScannerError';
  }
}

class LocalPrivatePersonnelDocumentStorage implements PersonnelDocumentStorage {
  constructor(private readonly root: string) {}

  async putQuarantinedObject(content: Uint8Array): Promise<string> {
    const storageKey = randomUUID();
    const path = this.pathFor('quarantine', storageKey);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content, { flag: 'wx', mode: 0o600 });
    return storageKey;
  }

  async readQuarantinedObject(storageKey: string): Promise<Uint8Array> {
    return readFile(this.pathFor('quarantine', storageKey));
  }

  async promoteVerifiedObject(storageKey: string): Promise<void> {
    const source = this.pathFor('quarantine', storageKey);
    const target = this.pathFor('available', storageKey);
    await mkdir(dirname(target), { recursive: true });
    await rename(source, target);
  }

  async openAvailableObject(storageKey: string): Promise<Uint8Array> {
    return readFile(this.pathFor('available', storageKey));
  }

  async removeObject(storageKey: string): Promise<void> {
    const key = storageKeySchema.parse(storageKey);
    await Promise.all([
      rm(this.pathFor('quarantine', key), { force: true }),
      rm(this.pathFor('available', key), { force: true }),
    ]);
  }

  private pathFor(state: 'quarantine' | 'available', storageKey: string) {
    const key = storageKeySchema.parse(storageKey);
    return join(this.root, state, `${key}.pdf`);
  }
}

class WindowsDefenderPersonnelDocumentScanner implements PersonnelDocumentScanner {
  constructor(private readonly executable: string) {}

  async inspectQuarantinedObject(content: Uint8Array): Promise<void> {
    const temporaryPath = join(
      tmpdir(),
      `yuta-personnel-document-${randomUUID()}.pdf`,
    );
    await writeFile(temporaryPath, content, { flag: 'wx', mode: 0o600 });
    try {
      await execFileAsync(
        this.executable,
        [
          '-Scan',
          '-ScanType',
          '3',
          '-File',
          temporaryPath,
          '-DisableRemediation',
        ],
        { timeout: 60_000, windowsHide: true },
      );
    } catch {
      throw new PersonnelDocumentScannerError(
        'The local security scanner rejected the file or was unavailable.',
      );
    } finally {
      await rm(temporaryPath, { force: true });
    }
  }
}

let cachedRuntime:
  | {
      storage: PersonnelDocumentStorage;
      scanner: PersonnelDocumentScanner;
    }
  | undefined;

export async function getPersonnelDocumentRuntime(): Promise<{
  storage: PersonnelDocumentStorage;
  scanner: PersonnelDocumentScanner;
}> {
  if (cachedRuntime) return cachedRuntime;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Personnel document storage is local-only until production providers are approved.',
    );
  }

  const configuredRoot = process.env.PERSONNEL_DOCUMENT_STORAGE_ROOT?.trim();
  const storageRoot = configuredRoot
    ? isAbsolute(configuredRoot)
      ? configuredRoot
      : resolve(/* turbopackIgnore: true */ process.cwd(), configuredRoot)
    : resolve(
        /* turbopackIgnore: true */ process.cwd(),
        '.private',
        'personnel-documents',
      );
  const defenderExecutable = await resolveWindowsDefenderExecutable();
  cachedRuntime = {
    storage: new LocalPrivatePersonnelDocumentStorage(storageRoot),
    scanner: new WindowsDefenderPersonnelDocumentScanner(defenderExecutable),
  };
  return cachedRuntime;
}

async function resolveWindowsDefenderExecutable(): Promise<string> {
  const configured =
    process.env.PERSONNEL_DOCUMENT_WINDOWS_DEFENDER_EXECUTABLE?.trim();
  if (configured) {
    const executable = isAbsolute(configured)
      ? configured
      : resolve(/* turbopackIgnore: true */ process.cwd(), configured);
    await access(executable, constants.X_OK);
    return executable;
  }
  if (process.platform !== 'win32') {
    throw new PersonnelDocumentScannerError(
      'No approved local personnel document scanner is configured.',
    );
  }
  const programData = process.env.ProgramData ?? 'C:\\ProgramData';
  const platformRoot = join(
    programData,
    'Microsoft',
    'Windows Defender',
    'Platform',
  );
  const versions = (await readdir(platformRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) =>
      right.localeCompare(left, undefined, { numeric: true }),
    );
  for (const version of versions) {
    const candidate = join(platformRoot, version, 'MpCmdRun.exe');
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Continue to an older installed Defender platform version.
    }
  }
  throw new PersonnelDocumentScannerError(
    'Microsoft Defender command-line scanner is unavailable.',
  );
}
