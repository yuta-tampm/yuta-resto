import { createHash, randomUUID } from 'node:crypto';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { describe, expect, it } from 'vitest';
import { createPointageRepository } from '../src/pointage-repository';
import * as schema from '../src/schema';
import {
  exactPointageTestDatabaseName,
  openPointageTestDatabase,
  requirePointageTestConfiguration,
  requirePointageTestDatabaseIdentity,
} from './helpers/pointage-raw-clocking-test-database';

const configuration = {
  NODE_ENV: 'test',
  YUTA_POINTAGE_SYNTHETIC_TEST_MODE: 'true',
  POINTAGE_TEST_ORIGIN: 'http://127.0.0.1:3001',
};
const sampleUrl =
  'postgres://test:test@127.0.0.1:56541/yuta_pointage_raw_clocking_test_guard';

describe('F6 exact disposable configuration boundary', () => {
  it('requires a completed exact identity probe with no aliases or normalization', () => {
    const expected = 'yuta_pointage_raw_clocking_test_guard';
    expect(() =>
      requirePointageTestDatabaseIdentity(expected, expected),
    ).not.toThrow();
    for (const actual of [
      undefined,
      null,
      '',
      'yuta_cloud',
      expected + '\n',
      expected + ' ',
      expected.toUpperCase(),
      'yuta_pointage_raw_clocking_test_other',
    ]) {
      expect(() =>
        requirePointageTestDatabaseIdentity(expected, actual),
      ).toThrow();
    }
    expect(() =>
      requirePointageTestDatabaseIdentity('yuta_cloud', 'yuta_cloud'),
    ).toThrow();
  });
  it('accepts only complete case-sensitive database names', () => {
    expect(
      exactPointageTestDatabaseName('yuta_pointage_raw_clocking_test'),
    ).toBe(true);
    expect(
      requirePointageTestConfiguration(configuration, sampleUrl).name,
    ).toBe('yuta_pointage_raw_clocking_test_guard');
    for (const name of [
      'yuta_cloud',
      'yuta_resto',
      'yuta_pointage_raw_clocking_test_',
      'yuta_pointage_raw_clocking_test_A',
      'yuta_pointage_raw_clocking_test\n',
      ' yuta_pointage_raw_clocking_test',
      'yuta_pointage_raw_clocking_test ',
      'prefix_yuta_pointage_raw_clocking_test',
      'yuta_pointage_raw_clocking_test_bad-name',
      'yuta_pointage_raw_clocking_test%0a',
    ])
      expect(exactPointageTestDatabaseName(name)).toBe(false);
  });

  it('rejects unsafe environment, aliases and URL overrides before connection', () => {
    for (const patch of [
      { NODE_ENV: 'production' },
      { NODE_ENV: undefined },
      { VERCEL: '1' },
      { VERCEL: '' },
      { YUTA_POINTAGE_SYNTHETIC_TEST_MODE: 'false' },
      { POINTAGE_TEST_ORIGIN: 'https://example.test' },
      { POINTAGE_TEST_ORIGIN: 'http://127.1:3001' },
    ])
      expect(() =>
        requirePointageTestConfiguration(
          { ...configuration, ...patch },
          sampleUrl,
        ),
      ).toThrow();
    for (const value of [
      sampleUrl + '?dbname=yuta_cloud',
      sampleUrl + '#override',
      sampleUrl + '\n',
      sampleUrl.replace('127.0.0.1', 'example.test'),
      sampleUrl.replace('127.0.0.1', '127.1'),
      sampleUrl.replace('127.0.0.1', '%31%32%37.0.0.1'),
      sampleUrl.replace('_guard', '%5fguard'),
    ])
      expect(() =>
        requirePointageTestConfiguration(configuration, value),
      ).toThrow();
  });
});

const integration =
  process.env.YUTA_POINTAGE_SYNTHETIC_TEST_MODE === 'true'
    ? describe
    : describe.skip;

integration('F7 clean and foundation upgrade migration evidence', () => {
  it('preserves every exact ledger hash and a no-op rerun on the clean target', async () => {
    const db = await openPointageTestDatabase(
      process.env,
      process.env.CLOUD_DATABASE_URL!,
    );
    try {
      const journal = JSON.parse(
        await readFile('drizzle/meta/_journal.json', 'utf8'),
      ) as {
        entries: { tag: string; when: number }[];
      };
      const before =
        await db`select hash, created_at from drizzle.__drizzle_migrations order by created_at`;
      expect(before).toHaveLength(journal.entries.length);
      for (let i = 0; i < journal.entries.length; i++) {
        const entry = journal.entries[i]!;
        const digest = createHash('sha256')
          .update(await readFile(`drizzle/${entry.tag}.sql`))
          .digest('hex');
        expect(before[i]).toMatchObject({
          hash: digest,
          created_at: String(entry.when),
        });
      }
      await migrate(drizzle(db), { migrationsFolder: 'drizzle' });
      expect(
        await db`select hash, created_at from drizzle.__drizzle_migrations order by created_at`,
      ).toEqual(before);
    } finally {
      await db.end();
    }
  });

  it('upgrades a separately identity-verified empty target through 0020 then corrected 0021', async () => {
    const target = new URL(process.env.CLOUD_DATABASE_URL!);
    target.pathname = '/yuta_pointage_raw_clocking_test_upgrade20260908b';
    const db = await openPointageTestDatabase(process.env, target.toString());
    let fixtureDirectory: string | undefined;
    try {
      expect(
        await db`select tablename from pg_tables where schemaname not in ('pg_catalog','information_schema')`,
      ).toHaveLength(0);
      const journal = JSON.parse(
        await readFile('drizzle/meta/_journal.json', 'utf8'),
      ) as {
        entries: { tag: string; when: number }[];
      };
      expect(journal.entries.at(-1)?.tag).toBe('0021_abandoned_black_queen');
      const prefix = { ...journal, entries: journal.entries.slice(0, -1) };
      expect(prefix.entries.at(-1)?.tag).toBe(
        '0020_formalites_legal_template_foundation',
      );
      // Ephemeral test input for the same official migrator; repository SQL,
      // snapshots and the authoritative journal are never edited or rewritten.
      fixtureDirectory = await mkdtemp(
        join(tmpdir(), 'yuta-pointage-migration-'),
      );
      await mkdir(join(fixtureDirectory, 'meta'));
      await writeFile(
        join(fixtureDirectory, 'meta', '_journal.json'),
        JSON.stringify(prefix),
      );
      for (const entry of prefix.entries) {
        await copyFile(
          resolve('drizzle', `${entry.tag}.sql`),
          join(fixtureDirectory, `${entry.tag}.sql`),
        );
      }
      await migrate(drizzle(db), { migrationsFolder: fixtureDirectory });
      const baseline =
        await db`select hash, created_at from drizzle.__drizzle_migrations order by created_at`;
      expect(baseline).toHaveLength(21);
      expect(
        await db`select to_regclass('public.pointage_raw_events') as raw`,
      ).toEqual([{ raw: null }]);
      const organization = randomUUID();
      const establishment = randomUUID();
      const dossier = randomUUID();
      const manager = randomUUID();
      await db.begin(async (tx) => {
        await tx`insert into public.organizations(id,name,slug) values(${organization},'Synthetic upgrade foundation',${'upgrade-' + organization})`;
        await tx`insert into public.establishments(id,organization_id,name,slug) values(${establishment},${organization},'Synthetic upgrade foundation',${'upgrade-' + establishment})`;
        await tx`insert into public.personnel_employee_dossiers(id,organization_id,establishment_id,given_names,family_name,position,qualification,employment_term_type,work_time_category,entry_date) values(${dossier},${organization},${establishment},'Synthetic','Upgrade foundation','Test','Test','indefinite','full_time','2020-01-01')`;
        await tx`insert into public.users(id,auth_provider_id,email) values(${manager},${'synthetic-upgrade-' + manager},${manager + '@example.test'})`;
      });
      await createPointageRepository(drizzle(db, { schema })).issueCredential({
        scope: { organizationId: organization, establishmentId: establishment },
        personnelDossierId: dossier,
        managerUserId: manager,
        now: new Date(),
        createMaterial: async () => ({
          lookupDigest: createHash('sha256').update(randomUUID()).digest('hex'),
          credentialFormatVersion: 1,
          credentialVersion: 1,
          algorithmVersion: 'scrypt-v1',
          keyVersion: 1,
          salt: Buffer.alloc(16, 1).toString('base64'),
          verifier: Buffer.alloc(32, 2).toString('base64'),
        }),
      });
      const foundationRows = async () => ({
        organization:
          await db`select to_jsonb(t) as row from public.organizations t where id=${organization}`,
        establishment:
          await db`select to_jsonb(t) as row from public.establishments t where organization_id=${organization} and id=${establishment}`,
        dossier:
          await db`select to_jsonb(t) as row from public.personnel_employee_dossiers t where organization_id=${organization} and establishment_id=${establishment} and id=${dossier}`,
        credential:
          await db`select to_jsonb(t) as row from public.pointage_employee_credentials t where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${dossier}`,
        audit:
          await db`select to_jsonb(t) as row from public.pointage_security_audit_events t where organization_id=${organization} and establishment_id=${establishment} order by id`,
      });
      const foundationBefore = await foundationRows();
      expect(foundationBefore.credential).toHaveLength(1);
      expect(foundationBefore.audit.length).toBeGreaterThan(0);
      await migrate(drizzle(db), { migrationsFolder: 'drizzle' });
      const upgraded =
        await db`select hash, created_at from drizzle.__drizzle_migrations order by created_at`;
      expect(upgraded).toHaveLength(22);
      expect(upgraded.slice(0, -1)).toEqual(baseline);
      expect(upgraded.at(-1)?.hash).toBe(
        createHash('sha256')
          .update(await readFile('drizzle/0021_abandoned_black_queen.sql'))
          .digest('hex'),
      );
      expect(
        await db`select count(*)::int as count from public.pointage_raw_events`,
      ).toEqual([{ count: 0 }]);
      expect(await foundationRows()).toEqual(foundationBefore);
      await migrate(drizzle(db), { migrationsFolder: 'drizzle' });
      expect(await foundationRows()).toEqual(foundationBefore);
      expect(
        await db`select hash,created_at from drizzle.__drizzle_migrations order by created_at`,
      ).toEqual(upgraded);
    } finally {
      await db.end();
      if (fixtureDirectory) {
        const directory = resolve(fixtureDirectory);
        const root = resolve(tmpdir());
        if (
          !directory.startsWith(root + '\\') &&
          !directory.startsWith(root + '/')
        ) {
          throw new Error(
            'Unexpected temporary fixture path; cleanup refused.',
          );
        }
        await rm(directory, { recursive: true });
      }
    }
  });
});
