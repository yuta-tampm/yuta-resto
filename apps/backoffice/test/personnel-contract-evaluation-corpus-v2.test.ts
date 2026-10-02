import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { PDFDocument } from 'pdf-lib';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { contractEvaluationCorpusManifestSchema } from '../src/server/personnel-contract-extraction/evaluation';
import rawV1Manifest from './fixtures/personnel-contract-evaluation/v1/manifest.json';
import rawV2Manifest from './fixtures/personnel-contract-evaluation/v2/manifest.json';

const v1 = contractEvaluationCorpusManifestSchema.parse(rawV1Manifest);
const v2 = contractEvaluationCorpusManifestSchema.parse(rawV2Manifest);
const v2Directory = path.join(
  process.cwd(),
  'test',
  'fixtures',
  'personnel-contract-evaluation',
  'v2',
);
const correctedFixtureIds = [
  'wg2-adversarial-05',
  'wg2-adversarial-09',
] as const;

describe('Wave G personnel contract evaluation corpus v2', () => {
  it('retains the sixty-fixture class distribution', () => {
    expect(v2.fixtures).toHaveLength(60);
    expect(countClasses()).toEqual({
      digital_text: 20,
      clear_scan: 15,
      degraded_scan: 15,
      adversarial: 10,
    });
  });

  it('changes only the two approved PDF hashes and no expected answer', () => {
    const changedIds: string[] = [];

    for (const oldFixture of v1.fixtures) {
      const newFixture = findV2Fixture(oldFixture.id);
      expect(newFixture.expected).toEqual(oldFixture.expected);
      if (newFixture.sha256 !== oldFixture.sha256) {
        changedIds.push(oldFixture.id);
      }
    }

    expect(changedIds).toEqual(correctedFixtureIds);
  });

  it('keeps every v2 fixture hash, PDF signature, and page count stable', async () => {
    for (const fixture of v2.fixtures) {
      const bytes = await readFile(path.join(v2Directory, fixture.file));
      expect(bytes.subarray(0, 4).toString('ascii')).toBe('%PDF');
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(
        fixture.sha256,
      );
      const document = await PDFDocument.load(bytes);
      expect(document.getPageCount()).toBe(fixture.pageCount);
    }
  });
});

function countClasses() {
  return Object.fromEntries(
    ['digital_text', 'clear_scan', 'degraded_scan', 'adversarial'].map(
      (fixtureClass) => [
        fixtureClass,
        v2.fixtures.filter((fixture) => fixture.class === fixtureClass).length,
      ],
    ),
  );
}

function findV2Fixture(fixtureId: string) {
  const fixture = v2.fixtures.find((candidate) => candidate.id === fixtureId);
  if (!fixture) throw new Error(`V2 fixture ${fixtureId} is missing.`);
  return fixture;
}
