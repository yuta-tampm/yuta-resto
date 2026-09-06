import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const packageRoot = fileURLToPath(new URL('..', import.meta.url));
const sourceRoot = join(packageRoot, 'src');
const repositoryRoot = fileURLToPath(new URL('../../..', import.meta.url));

const sourceFiles = listTypeScriptFiles(sourceRoot);
const sourceByRelativePath = new Map(
  sourceFiles.map((path) => [
    relative(packageRoot, path).replaceAll('\\', '/'),
    read(path),
  ]),
);

describe('Reputation review social-links static inventory', () => {
  it('keeps the new operation as the only runtime writer for the three link columns', () => {
    const runtimeWriters = [...sourceByRelativePath]
      .filter(([, content]) => content.includes('.update(reputationSettings)'))
      .map(([path]) => path)
      .sort();

    expect(runtimeWriters).toEqual([
      'src/reputation-review-social-links.ts',
      'src/seed.ts',
    ]);
    const runtimeInserters = [...sourceByRelativePath]
      .filter(([, content]) => content.includes('.insert(reputationSettings)'))
      .map(([path]) => path)
      .sort();
    expect(runtimeInserters).toEqual(['src/seed.ts']);
    const seed = sourceByRelativePath.get('src/seed.ts') ?? '';
    expect(seed).not.toMatch(/googleReviewUrl|facebookReviewUrl|instagramUrl/u);
  });

  it('has no supported runtime update, delete, truncate, or purge for Reputation audit events', () => {
    const runtimeSource = [...sourceByRelativePath.values()].join('\n');

    expect(runtimeSource).not.toMatch(/\.update\(reputationAuditEvents\)/u);
    expect(runtimeSource).not.toMatch(/\.delete\(reputationAuditEvents\)/u);
    expect(runtimeSource).not.toMatch(
      /(?:truncate|purge)[\s\S]{0,80}reputation_audit_events/iu,
    );
  });

  it('keeps GBP connector operations independent from googleReviewUrl', () => {
    const repository =
      sourceByRelativePath.get('src/reputation-repository.ts') ?? '';
    const connectorSection = repository.slice(
      repository.indexOf('export async function findGoogleReputationConnector'),
      repository.indexOf('export async function updateFeedback'),
    );

    expect(connectorSection).not.toContain('googleReviewUrl');
    expect(connectorSection).not.toContain('facebookReviewUrl');
    expect(connectorSection).not.toContain('instagramUrl');
  });

  it('uses the contracts policy for public projection without a second provider allowlist', () => {
    const repository =
      sourceByRelativePath.get('src/reputation-repository.ts') ?? '';
    const operation =
      sourceByRelativePath.get('src/reputation-review-social-links.ts') ?? '';
    const contract = read(
      join(repositoryRoot, 'packages/contracts/src/reputation/index.ts'),
    );

    expect(repository).toContain('projectPublicReputationReviewSocialLinks');
    expect(operation).toContain('validateReputationReviewSocialLink');
    expect(contract.match(/reputationReviewSocialLinkPolicies/gu)).toHaveLength(
      2,
    );
    for (const host of ['g.page', 'facebook.com', 'instagram.com']) {
      expect(repository).not.toContain(`'${host}'`);
      expect(operation).not.toContain(`'${host}'`);
    }
  });

  it('does not encode this capability in schema or migrations', () => {
    const schema = read(join(sourceRoot, 'schema/reputation.ts'));
    const migrations = readdirSync(join(packageRoot, 'drizzle'))
      .filter((name) => name.endsWith('.sql'))
      .map((name) => read(join(packageRoot, 'drizzle', name)))
      .join('\n');

    expect(schema).not.toContain('settings.review-social-links.updated.v1');
    expect(migrations).not.toContain('settings.review-social-links.updated.v1');
  });
});

function listTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory)
    .map((name) => join(directory, name))
    .flatMap((path) =>
      statSync(path).isDirectory() ? listTypeScriptFiles(path) : [path],
    )
    .filter((path) => path.endsWith('.ts'));
}

function read(path: string): string {
  return readFileSync(path, 'utf8');
}
