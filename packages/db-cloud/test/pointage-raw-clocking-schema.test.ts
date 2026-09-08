import { getTableConfig } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import {
  pointageContinuations,
  pointageRawCommandReceipts,
  pointageRawEvents,
} from '../src/schema/pointage-raw-clocking';
import { pointageEmployeeCredentials } from '../src/schema/pointage';
import { readFileSync } from 'node:fs';

describe('Pointage raw clocking F2 schema', () => {
  it('F5: continuation is scoped technical metadata with full credential-version binding', () => {
    const config = getTableConfig(pointageContinuations);
    expect(config.columns.map((column) => column.name)).toEqual([
      'id',
      'organization_id',
      'establishment_id',
      'personnel_dossier_id',
      'token_digest',
      'credential_id',
      'credential_version',
      'issued_at',
      'absolute_expires_at',
      'idle_expires_at',
      'ended_at',
    ]);
    expect(
      config.columns
        .filter((column) => !column.notNull)
        .map((column) => column.name),
    ).toEqual(['ended_at']);
    expect(
      config.uniqueConstraints[0]?.columns.map((column) => column.name),
    ).toEqual(['organization_id', 'establishment_id', 'token_digest']);
    const binding = config.foreignKeys.find(
      (key) => key.getName() === 'pointage_continuations_credential_fk',
    )!;
    expect(binding.reference().foreignTable).toBe(pointageEmployeeCredentials);
    expect(binding.reference().columns.map((column) => column.name)).toEqual([
      'organization_id',
      'establishment_id',
      'personnel_dossier_id',
      'credential_id',
      'credential_version',
    ]);
    expect(
      binding.reference().foreignColumns.map((column) => column.name),
    ).toEqual([
      'organization_id',
      'establishment_id',
      'personnel_dossier_id',
      'id',
      'credential_version',
    ]);
    expect(binding.onDelete).toBe('restrict');
    expect(config.checks.map((check) => check.name)).toEqual([
      'pointage_continuations_digest',
      'pointage_continuations_credential_version',
      'pointage_continuations_absolute',
      'pointage_continuations_idle',
    ]);
  });

  it('F5: repository exposes bounded idle/end writes, not binding or caller deadline patches', () => {
    const source = readFileSync(
      new URL('../src/pointage-raw-clocking-repository.ts', import.meta.url),
      'utf8',
    );
    expect(source).toMatch(
      /async touchContinuationIdle\(\s*id: string,?\s*\)/u,
    );
    expect(source).toMatch(/async endOwnContinuation\(\s*id: string,?\s*\)/u);
    expect(
      source.match(/\.update\(pointageContinuations\)\s*\.set\(/g),
    ).toHaveLength(2);
    expect(source).not.toMatch(
      /updateContinuation|Partial<|\.delete\(|\.onConflictDoUpdate\(/,
    );
    expect(source).toContain("interval '60 seconds'");
    expect(source).toContain("interval '120 seconds'");
    expect(source).toContain("isolationLevel: 'read committed'");
  });

  it('D4a: delegates source locks before invoker reads and continuation locking', () => {
    const source = readFileSync(
      new URL('../src/pointage-raw-clocking-repository.ts', import.meta.url),
      'utf8',
    );
    const transaction = source.slice(
      source.indexOf('return repositoryDb.transaction('),
    );
    const helper = transaction.indexOf(
      'select public.pointage_raw_lock_dossier(',
    );
    expect(helper).toBeGreaterThan(0);
    for (const field of [
      'organizationId',
      'establishmentId',
      'personnelDossierId',
    ]) {
      expect(transaction).toContain('${scope.' + field + '}::pg_catalog.uuid');
    }
    expect(helper).toBeLessThan(transaction.indexOf('.from(organizations)'));
    expect(helper).toBeLessThan(transaction.indexOf('.from(establishments)'));
    expect(helper).toBeLessThan(
      transaction.indexOf('.from(personnelEmployeeDossiers)'),
    );
    expect(transaction).not.toMatch(/\.for\(['"](?:share|update)['"]\)/);
    expect(transaction).not.toMatch(/sql`[^`]*(?:savepoint|rollback\s+to)/i);
    expect(transaction).not.toMatch(/\.catch\(|catch\s*\(/);
    expect(source.match(/\.for\('update'\)/g)).toHaveLength(1);
    expect(source).toContain("set local lock_timeout = '2s'");
    expect(source).toContain("set local statement_timeout = '5s'");
  });
  it('D4a: migration leaves active literals typed by the existing status enum', () => {
    const migration = readFileSync(
      new URL('../drizzle/0021_abandoned_black_queen.sql', import.meta.url),
      'utf8',
    );
    const helper = migration.split('AS $lock$')[1]?.split('$lock$;')[0];
    expect(helper).toBeDefined();
    // PostgreSQL cannot resolve enum = text. This source regression does not
    // replace the mandatory restricted-writer execution proof on PostgreSQL.
    expect(
      helper?.match(/status OPERATOR\(pg_catalog\.=\) 'active' FOR SHARE/g),
    ).toHaveLength(2);
    expect(helper).not.toContain("'active'::pg_catalog.text");
  });

  it('R3/R7: persists only canonical event facts with lossless time and scoped ordering', () => {
    const config = getTableConfig(pointageRawEvents);
    expect(config.name).toBe('pointage_raw_events');
    expect(config.columns.map((c) => c.name)).toEqual([
      'id',
      'organization_id',
      'establishment_id',
      'personnel_dossier_id',
      'ordinal',
      'kind',
      'accepted_at',
      'timezone_name',
      'utc_offset_seconds',
      'business_date',
    ]);
    expect(config.columns.every((c) => c.notNull)).toBe(true);
    expect(pointageRawEvents.acceptedAt.getSQLType()).toBe(
      'timestamp(6) with time zone',
    );
    expect(
      pointageRawEvents.ordinal.mapFromDriverValue('9007199254740993'),
    ).toBe(9007199254740993n);
    expect(
      config.uniqueConstraints.map((c) => c.columns.map((col) => col.name)),
    ).toEqual([
      ['organization_id', 'establishment_id', 'personnel_dossier_id', 'id'],
      [
        'organization_id',
        'establishment_id',
        'personnel_dossier_id',
        'ordinal',
      ],
    ]);
  });

  it('R1/R3: binds raw data to the complete establishment and Personnel scope', () => {
    const foreign = getTableConfig(pointageRawEvents).foreignKeys;
    expect(
      foreign.map((f) => f.reference().columns.map((c) => c.name)),
    ).toEqual([
      ['organization_id', 'establishment_id'],
      ['organization_id', 'establishment_id', 'personnel_dossier_id'],
    ]);
    expect(
      foreign.map((f) => f.reference().foreignColumns.map((c) => c.name)),
    ).toEqual([
      ['organization_id', 'id'],
      ['organization_id', 'establishment_id', 'id'],
    ]);
    expect(foreign.every((f) => f.onDelete === 'restrict')).toBe(true);
  });

  it('R3/R5: receipt stores scoped request association, not duplicated attendance or identity', () => {
    const config = getTableConfig(pointageRawCommandReceipts);
    expect(config.columns.map((c) => c.name)).toEqual([
      'organization_id',
      'establishment_id',
      'personnel_dossier_id',
      'request_id',
      'event_id',
      'intent_version',
      'intent_fingerprint',
    ]);
    expect(config.primaryKeys[0]?.columns.map((c) => c.name)).toEqual([
      'organization_id',
      'establishment_id',
      'personnel_dossier_id',
      'request_id',
    ]);
    expect(config.uniqueConstraints[0]?.columns.map((c) => c.name)).toEqual([
      'organization_id',
      'establishment_id',
      'personnel_dossier_id',
      'event_id',
    ]);
    const foreign = config.foreignKeys[0]!;
    expect(foreign.onDelete).toBe('no action');
    expect(foreign.reference().foreignTable).toBe(pointageRawEvents);
    expect(foreign.reference().columns.map((c) => c.name)).toEqual([
      'organization_id',
      'establishment_id',
      'personnel_dossier_id',
      'event_id',
    ]);
    expect(foreign.reference().foreignColumns.map((c) => c.name)).toEqual([
      'organization_id',
      'establishment_id',
      'personnel_dossier_id',
      'id',
    ]);
  });
});
