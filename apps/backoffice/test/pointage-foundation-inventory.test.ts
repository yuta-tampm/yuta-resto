import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(import.meta.dirname, '../../..');
const implementationFiles = [
  'packages/auth/src/pointage-credential.ts',
  'packages/db-cloud/src/schema/pointage.ts',
  'packages/db-cloud/src/pointage-repository.ts',
  'apps/backoffice/src/server/pointage/authorization.ts',
  'apps/backoffice/src/server/pointage/service.ts',
];

describe('Pointage foundation negative inventory', () => {
  it('has no local, POS, browser-storage, transport, or forwarded-header dependency', () => {
    const source = implementationFiles
      .map((file) => readFileSync(resolve(repositoryRoot, file), 'utf8'))
      .join('\n');
    for (const forbidden of [
      '@yuta/db-pos',
      'site-agent',
      'localStorage',
      'indexedDB',
      'X-Forwarded-For',
      'X-Real-IP',
      'headers()',
      'NextRequest',
      'NextResponse',
      'console.',
      'logger.',
      'raw_clock',
      'clock_event',
    ]) {
      expect(source).not.toContain(forbidden);
    }
  });

  it('generated migration creates only the three reviewed Pointage tables', () => {
    const migrationDirectory = resolve(
      repositoryRoot,
      'packages/db-cloud/drizzle',
    );
    const migrationName = readdirSync(migrationDirectory).find((name) =>
      name.startsWith('0019_pointage_authority_foundation'),
    );
    expect(migrationName).toBeDefined();
    const sql = readFileSync(
      resolve(migrationDirectory, migrationName!),
      'utf8',
    );
    expect(
      [...sql.matchAll(/CREATE TABLE "([^"]+)"/gu)].map((match) => match[1]),
    ).toEqual([
      'pointage_credential_rate_limits',
      'pointage_employee_credentials',
      'pointage_security_audit_events',
    ]);
    expect(sql).not.toMatch(/^(?:DROP|INSERT|UPDATE|DELETE|TRUNCATE)\b/imu);
    expect(sql).not.toMatch(/raw.*(?:event|evidence)|clock.*event/iu);
  });
});
