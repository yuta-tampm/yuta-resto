import {
  vfixAuthority,
  loadVfixAuthority,
  validateVfixHistorical,
  verifyVfixObligation,
  compareVfixOutputs,
  classifyVfixExit,
  aggregateVfixGeneration,
  verifyVfixGenerationIdentity,
  vfixGenerationIdentity,
  validateVfixCurrentGeneration,
  runVfixModelB,
} from './check.mjs';

test('V-FIX generation result cannot be injected into generic artifact aggregation', () => {
  const f = coverageFixture();
  const audit = aggregateCoverage(f.text(), f.artifacts, f.observations, [
    claimedVfixResult(),
  ]);
  assert.equal(audit.aggregate, 'FAIL');
});
test('V-FIX actual historical and source drift fail before renderer execution', async () => {
  const a = loadVfixAuthority(process.cwd()),
    base = realpathSync(tmpdir());
  const dir = mkdtempSync(join(base, 'yuta-vfix-negative-'));
  const source =
    'apps/backoffice/scripts/generate-personnel-contract-evaluation-corpus.py';
  const paths = [
    vfixAuthority.tasks,
    ...a.approval.authorityLocators.map((x) => x.path),
    ...a.admission.members.map((x) => x.path),
    source,
    ...['Dockerfile', 'environment.json', 'requirements.lock', 'run.py'].map(
      (x) => 'scripts/format-policy/vfix-renderer/' + x,
    ),
  ];
  try {
    for (const path of paths) {
      mkdirSync(dirname(join(dir, path)), { recursive: true });
      writeFileSync(join(dir, path), readFileSync(path));
    }
    assert.equal(validateVfixHistorical(dir).results.length, 122);
    const pdf = a.admission.members.find((x) => x.type === 'PDF').path;
    const saved = readFileSync(join(dir, pdf));
    rmSync(join(dir, pdf));
    assert.throws(() => validateVfixHistorical(dir));
    writeFileSync(join(dir, pdf), saved);
    writeFileSync(join(dir, pdf), Buffer.concat([saved, Buffer.from('drift')]));
    assert.throws(() => validateVfixHistorical(dir), /HISTORICAL_HASH_DRIFT/);
    writeFileSync(join(dir, pdf), saved);
    const extra = join(
      dir,
      'apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/extra.pdf',
    );
    writeFileSync(extra, saved);
    assert.throws(
      () => validateVfixHistorical(dir),
      /HISTORICAL_ADMISSION_INVALID/,
    );
    rmSync(extra);
    writeFileSync(
      join(dir, source),
      Buffer.concat([readFileSync(source), Buffer.from('\n# drift')]),
    );
    await assert.rejects(
      () => validateVfixCurrentGeneration(dir),
      /CURRENT_SOURCE_DRIFT/,
    );
  } finally {
    assert.equal(dirname(realpathSync(dir)), base);
    assert.equal(lstatSync(dir).isSymbolicLink(), false);
    rmSync(dir, { recursive: true });
  }
});

test('V-FIX actual cold/repeated Model-B closure and supervised proof tamper rejection', async () => {
  const a = loadVfixAuthority(process.cwd()),
    r = await runVfixModelB(process.cwd());
  assert.equal(r.aggregate, 'PASS', JSON.stringify(r.failureCodes));
  assert.equal(r.historical.results.length, 122);
  assert.equal(r.generation.aggregate, 'PASS');
  const proof = r.evidence;
  assert.equal(proof.runs.length, 2);
  for (const run of proof.runs) {
    assert.equal(run.processExit, 1);
    assert.equal(run.historicalResult, 'FAIL');
    assert.equal(run.modelBResult, 'PASS');
    assert.equal(run.outputCount, 122);
    assert.equal(run.outputSetSha256, vfixAuthority.output);
  }
  assert.deepEqual(proof.runs[0].outputs, proof.runs[1].outputs);
  const result = r.generation.generations[0];
  for (const mutate of [
    (p) => (p.runs[1].outputSetSha256 = '0'.repeat(64)),
    (p) => (p.runs[1].outputs[0].sha256 = '0'.repeat(64)),
    (p) => (p.runs[1].origin.copiedHistoricalInputs = 0),
    (p) => p.runs[1].terminal.rows[0].generatedSize++,
  ]) {
    const forged = structuredClone(proof);
    mutate(forged);
    const forgedResult = {
      ...result,
      reproductionEvidenceSha256: unitSha256(forged),
    };
    assert.equal(
      aggregateVfixGeneration(
        true,
        a.envelope,
        a.generationApproval,
        [forgedResult],
        [forged],
      ).aggregate,
      'FAIL',
    );
  }
  console.log(
    'VFIX_CURRENT_RUN_SUMMARY ' +
      JSON.stringify({
        aggregate: r.aggregate,
        evidenceSha256: result.reproductionEvidenceSha256,
        runs: proof.runs.map(
          ({
            mode,
            processExit,
            executionValidity,
            historicalResult,
            modelBResult,
            outputCount,
            missing,
            extra,
            generationIdentity,
            outputSetSha256,
            stdoutSha256,
            stderrSha256,
            stdoutBytes,
            stderrBytes,
            scratch,
            protectedBefore,
            protectedAfter,
            imageIdentity,
            origin,
          }) => ({
            mode,
            processExit,
            executionValidity,
            historicalResult,
            modelBResult,
            outputCount,
            missing,
            extra,
            generationIdentity,
            outputSetSha256,
            stdoutSha256,
            stderrSha256,
            stdoutBytes,
            stderrBytes,
            scratch,
            protectedBefore,
            protectedAfter,
            imageIdentity,
            origin,
          }),
        ),
      }),
  );
});

function vfixFixture() {
  const authority = loadVfixAuthority(process.cwd());
  const terminal = {
    expectedCount: 122,
    generatedCount: 122,
    missing: [],
    extra: [],
    exactMatchCount: 91,
    mismatchCount: 31,
    outputSetSha256: vfixAuthority.output,
    status: 'FAIL',
    rows: authority.outputs.map((output) => {
      const historical = authority.admission.members.find(
        (x) => x.path === output.path,
      );
      const same = historical.rawSha256 === output.sha256;
      return {
        path: output.path,
        type: output.type,
        expectedSha256: historical.rawSha256,
        generatedSha256: output.sha256,
        expectedSize: historical.bytes,
        generatedSize: output.bytes,
        rawByteMatch: same,
        taxonomy: same ? null : 'UNKNOWN',
      };
    }),
  };
  return { authority, terminal };
}
test('V-FIX approved historical preservation reads 122 members and 120 references without generation', () => {
  const { authority } = vfixFixture(),
    r = validateVfixHistorical(process.cwd(), authority);
  assert.equal(r.results.length, 122);
  assert.equal(r.evidence.references, 120);
  assert.equal(r.evidence.meaning, 'PRESERVATION_ONLY');
  for (const row of r.results) {
    assert.deepEqual(Object.keys(row).sort(), [
      'failureCode',
      'path',
      'result',
      'sha256',
      'validator',
      'version',
    ]);
    assert.equal(row.sha256, rawSha256(readFileSync(row.path)));
  }
});
for (const [name, change] of [
  ['missing member', (a) => a.admission.members.pop()],
  ['member hash', (a) => (a.admission.members[0].rawSha256 = '0'.repeat(64))],
  ['member type', (a) => (a.admission.members[0].type = 'PDF')],
  ['member size', (a) => a.admission.members[0].bytes++],
  [
    'reference',
    (a) => (a.admission.referenceBindings[0].targetDigest = '0'.repeat(64)),
  ],
  ['closure', (a) => (a.approval.historicalClosureSha256 = '0'.repeat(64))],
  ['owner', (a) => (a.admission.owner = 'unapproved')],
  ['role', (a) => (a.approval.historicalRole = 'unapproved')],
  ['approval', (a) => (a.approval.status = 'APPROVED_BY_CONTROL_TOWER')],
  ['admission', (a) => (a.admission.extra = true)],
  ['routing', (a) => (a.admission.validatorRouting = 'generated-repro-v1')],
  [
    'current approval cannot replace historical',
    (a) => (a.approval = a.generationApproval),
  ],
])
  test('V-FIX historical denial: ' + name, () => {
    const { authority } = vfixFixture();
    change(authority);
    assert.throws(
      () => validateVfixHistorical(process.cwd(), authority),
      /HISTORICAL_ADMISSION_INVALID/,
    );
  });
test('V-FIX obligation has independent exact approval and no self-reference', () => {
  const { authority: a } = vfixFixture();
  assert.equal(verifyVfixObligation(a.envelope, a.generationApproval), true);
  assert.equal(unitSha256(a.envelope.body), vfixAuthority.obligation);
  assert.equal(a.envelope.approvalRef.unitSha256, vfixAuthority.approval);
});
for (const [name, change] of [
  ['missing', (a) => (a.envelope = null)],
  ['identity', (a) => (a.envelope.body.version = 2)],
  ['approval', (a) => (a.generationApproval.status = 'NOT_APPROVED')],
  ['unknown validator', (a) => (a.envelope.body.validator = 'unknown')],
  ['missing validator', (a) => delete a.envelope.body.validator],
  [
    'historical approval inheritance',
    (a) => (a.generationApproval = a.approval),
  ],
  [
    'absolute locator',
    (a) => (a.envelope.approvalRef.path = 'C:/authority.json'),
  ],
  ['extra envelope field', (a) => (a.envelope.fallback = true)],
])
  test('V-FIX obligation denial: ' + name, () => {
    const { authority: a } = vfixFixture();
    change(a);
    assert.throws(() => verifyVfixObligation(a.envelope, a.generationApproval));
  });
for (const key of [
  'rendererSourceClosure',
  'generatorSourceClosure',
  'corpusInputClosure',
  'nativeRuntimeClosureSha256',
  'supplyClosureSha256',
  'font',
  'repertoireSha256',
  'buildContextSha256',
  'builtImage',
  'python',
  'environmentControls',
  'reportlabInspectionClosureSha256',
])
  test('V-FIX generation identity denial: ' + key, () => {
    const identity = vfixGenerationIdentity();
    identity[key] = 'changed';
    assert.throws(
      () => verifyVfixGenerationIdentity(identity),
      /CURRENT_GENERATION_IDENTITY_MISSING/,
    );
  });
test('V-FIX license drift is bound independently inside exact generation identity', () => {
  const identity = vfixGenerationIdentity();
  identity.font.licenseSha256 = '0'.repeat(64);
  assert.throws(() => verifyVfixGenerationIdentity(identity));
});
for (const [name, change] of [
  ['missing', (rows) => rows.pop()],
  ['extra', (rows) => rows.push({ ...rows[0], path: 'extra.pdf' })],
  ['duplicate', (rows) => rows.push({ ...rows[0] })],
  ['hash', (rows) => (rows[0].sha256 = '0'.repeat(64))],
  ['size', (rows) => rows[0].bytes++],
  ['type', (rows) => (rows[0].type = 'PDF')],
  ['origin field injection', (rows) => (rows[0].origin = 'fresh')],
  [
    'manifest hash',
    (rows) => (rows.find((x) => x.type === 'MANIFEST').sha256 = '0'.repeat(64)),
  ],
])
  test('V-FIX output denial: ' + name, () => {
    const { authority: a } = vfixFixture(),
      actual = structuredClone(a.outputs);
    change(actual);
    assert.throws(() => compareVfixOutputs(a.outputs, actual));
  });
test('V-FIX legacy exact signature is FAIL historically, never generic exit success', () => {
  const { authority: a, terminal } = vfixFixture();
  assert.equal(
    classifyVfixExit(
      1,
      terminal,
      a.outputs,
      a.admission.members,
      vfixAuthority.generation,
    ),
    'LEGACY_HISTORICAL_COMPARISON_FAIL',
  );
  for (const exit of [0, 2, 127])
    assert.throws(() =>
      classifyVfixExit(
        exit,
        terminal,
        a.outputs,
        a.admission.members,
        vfixAuthority.generation,
      ),
    );
});
for (const [name, change] of [
  ['incomplete', (t) => (t.generatedCount = 121)],
  ['wrong output', (t) => (t.outputSetSha256 = '0'.repeat(64))],
  ['wrong historical signature', (t) => (t.exactMatchCount = 92)],
  ['runtime failure', (t) => (t.code = 'RUNTIME_FAILED')],
  ['malformed', (t) => delete t.rows],
  [
    'wrong mismatch membership',
    (t) => (t.rows[0].rawByteMatch = !t.rows[0].rawByteMatch),
  ],
  ['extra output', (t) => (t.extra = ['extra.pdf'])],
  ['partial capture', (t) => t.rows.pop()],
])
  test('V-FIX exit-1 denial: ' + name, () => {
    const { authority: a, terminal } = vfixFixture();
    change(terminal);
    assert.throws(() =>
      classifyVfixExit(
        1,
        terminal,
        a.outputs,
        a.admission.members,
        vfixAuthority.generation,
      ),
    );
  });
test('V-FIX exit-1 cannot hide wrong generation identity', () => {
  const { authority: a, terminal } = vfixFixture();
  assert.throws(() =>
    classifyVfixExit(
      1,
      terminal,
      a.outputs,
      a.admission.members,
      '0'.repeat(64),
    ),
  );
});
function claimedVfixResult() {
  return {
    obligationSha256: vfixAuthority.obligation,
    validator: 'vfix-current-generation-v1',
    version: 1,
    result: 'PASS',
    failureCode: null,
    observedGenerationIdentitySha256: vfixAuthority.generation,
    observedOutputSetSha256: vfixAuthority.output,
    reproductionEvidenceSha256: '0'.repeat(64),
    reproductionEvidenceStatus: 'COMPLETE',
  };
}
for (const [name, change, code] of [
  ['missing', () => [], 'GENERATION_RESULT_MISSING'],
  ['duplicate', (r) => [r, r], 'GENERATION_RESULT_DUPLICATE'],
  [
    'unknown',
    (r) => [{ ...r, obligationSha256: '0'.repeat(64) }],
    'GENERATION_RESULT_EXTRA',
  ],
  [
    'malformed',
    (r) => [{ ...r, path: 'fake.pdf' }],
    'GENERATION_RESULT_MALFORMED',
  ],
  [
    'partial',
    (r) => [{ ...r, reproductionEvidenceStatus: 'PARTIAL' }],
    'GENERATION_PARTIAL_RESULT',
  ],
  [
    'skipped',
    (r) => [{ ...r, reproductionEvidenceStatus: 'SKIPPED' }],
    'GENERATION_VALIDATION_SKIPPED',
  ],
  [
    'timeout',
    (r) => [{ ...r, result: 'FAIL', failureCode: 'GENERATION_TIMEOUT' }],
    'GENERATION_TIMEOUT',
  ],
  [
    'identity',
    (r) => [{ ...r, observedGenerationIdentitySha256: '0'.repeat(64) }],
    'GENERATION_IDENTITY_MISMATCH',
  ],
  [
    'output',
    (r) => [{ ...r, observedOutputSetSha256: '0'.repeat(64) }],
    'GENERATION_OUTPUT_SET_MISMATCH',
  ],
  ['proof missing', (r) => [r], 'GENERATION_REPRODUCTION_NOT_PROVEN'],
])
  test('V-FIX generation aggregation denial: ' + name, () => {
    const { authority: a } = vfixFixture(),
      audit = aggregateVfixGeneration(
        true,
        a.envelope,
        a.generationApproval,
        change(claimedVfixResult()),
        [],
      );
    assert.equal(audit.aggregate, 'FAIL');
    assert.ok(audit.failureCodes.includes(code), JSON.stringify(audit));
  });
test('V-FIX complete-looking fabricated proof is not supervised reproduction', () => {
  const { authority: a } = vfixFixture(),
    r = claimedVfixResult();
  const proof = {
    obligationSha256: vfixAuthority.obligation,
    result: 'PASS',
    runs: [0, 1].map(() => ({
      generationIdentity: vfixAuthority.generation,
      outputSetSha256: vfixAuthority.output,
      executionValidity: 'PASS',
      legacy: 'LEGACY_HISTORICAL_COMPARISON_FAIL',
      processExit: 1,
      outputCount: 122,
    })),
  };
  r.reproductionEvidenceSha256 = unitSha256(proof);
  assert.equal(
    aggregateVfixGeneration(
      true,
      a.envelope,
      a.generationApproval,
      [r],
      [proof],
    ).aggregate,
    'FAIL',
  );
});
test('V-FIX no lane fallback and artifact result cannot satisfy generation lane', () => {
  const { authority: a } = vfixFixture(),
    hist = validateVfixHistorical(process.cwd(), a);
  assert.equal(
    aggregateVfixGeneration(
      true,
      a.envelope,
      a.generationApproval,
      hist.results,
      [],
    ).aggregate,
    'FAIL',
  );
  assert.equal(
    aggregateVfixGeneration(true, null, a.generationApproval, [], []).aggregate,
    'FAIL',
  );
  assert.equal(
    aggregateVfixGeneration(false, null, null, [claimedVfixResult()], [])
      .aggregate,
    'FAIL',
  );
  assert.equal(
    aggregateVfixGeneration(false, null, null, [], []).aggregate,
    'PASS',
  );
});

import {
  generatedBinding,
  verifyGeneratedSource,
  compareGeneratedOutput,
  validateGeneratedArtifacts,
  resolveGeneratedSourceRoot,
  validatorRegistry,
} from './check.mjs';

function generatedFixtureBytes() {
  return Object.fromEntries(
    Object.keys(generatedBinding.targets).map((path) => [
      path,
      readFileSync(path),
    ]),
  );
}
function generatedFixtureOutput(bytes) {
  const rows = Object.entries(bytes).map(([path, content]) => ({
    path,
    content: content.toString('utf8'),
  }));
  return { cold: rows, warm: structuredClone(rows) };
}
function removeGeneratedScratch(dir) {
  const base = resolve(tmpdir());
  assert.equal(resolve(dir), dir);
  assert.equal(relative(base, dir).startsWith('yuta-generated-test-'), true);
  assert.equal(lstatSync(dir).isSymbolicLink(), false);
  rmSync(dir, { recursive: true });
}
function copiedGeneratedFixture() {
  const dir = mkdtempSync(join(resolve(tmpdir()), 'yuta-generated-test-'));
  for (const [path, bytes] of Object.entries(generatedFixtureBytes())) {
    mkdirSync(join(dir, path, '..'), { recursive: true });
    writeFileSync(join(dir, path), bytes);
  }
  return dir;
}

test('generated adapter current nine process-cold and repeated output are exact and read-only', async () => {
  const before = generatedFixtureBytes(),
    root = resolveGeneratedSourceRoot();
  const first = await validateGeneratedArtifacts(process.cwd(), root);
  assert.equal(first.failureCode, null, JSON.stringify(first));
  assert.equal(first.results.length, 9);
  assert.equal(
    first.results.every((x) => x.result === 'PASS'),
    true,
  );
  assert.equal(
    first.evidence.sourceClosureSha256,
    generatedBinding.sourceClosureSha256,
  );
  assert.equal(first.evidence.coldScope, 'PROCESS_COLD_ONLY');
  assert.equal(first.evidence.npmSupplyChainProvenance, 'NOT_ESTABLISHED');
  const again = await validateGeneratedArtifacts(process.cwd(), root);
  assert.equal(canonicalJson(first), canonicalJson(again));
  assert.deepEqual(generatedFixtureBytes(), before);
  for (const result of first.results) {
    assert.deepEqual(Object.keys(result).sort(), [
      'failureCode',
      'path',
      'result',
      'sha256',
      'validator',
      'version',
    ]);
    assert.equal(result.sha256, rawSha256(before[result.path]));
  }
  assert.equal(validatorRegistry['generated-repro-v1'].implemented, true);
  assert.equal(validatorRegistry['live-metadata-v1'].implemented, false);
});

test('generated source closure member set and independent composite match', () => {
  const root = resolveGeneratedSourceRoot();
  const bytes = Object.fromEntries(
    Object.keys(generatedBinding.members).map((path) => [
      path,
      readFileSync(join(root, path)),
    ]),
  );
  assert.equal(Object.keys(bytes).length, 20);
  assert.equal(
    unitSha256(verifyGeneratedSource(bytes)),
    generatedBinding.sourceClosureSha256,
  );
  for (const path of [
    'dist/core/shared/skill-generation.js',
    'dist/utils/command-references.js',
    'package.json',
  ]) {
    const mutated = { ...bytes, [path]: Buffer.from(bytes[path]) };
    mutated[path][0] ^= 1;
    assert.throws(
      () => verifyGeneratedSource(mutated),
      /GENERATOR_IDENTITY_DRIFT/,
    );
  }
  const changed = JSON.parse(bytes['package.json']);
  changed.version = '1.11.1';
  assert.throws(
    () =>
      verifyGeneratedSource({
        ...bytes,
        'package.json': Buffer.from(JSON.stringify(changed)),
      }),
    /GENERATOR_IDENTITY_DRIFT/,
  );
  const missing = { ...bytes };
  delete missing['package.json'];
  assert.throws(
    () => verifyGeneratedSource(missing),
    /GENERATOR_IDENTITY_DRIFT/,
  );
  assert.throws(
    () => verifyGeneratedSource({ ...bytes, 'extra.js': Buffer.from('') }),
    /GENERATOR_IDENTITY_DRIFT/,
  );
});

test('generated partial duplicate extra and nondeterministic output fail closed', () => {
  const bytes = generatedFixtureBytes(),
    good = generatedFixtureOutput(bytes);
  assert.equal(
    compareGeneratedOutput(good, bytes).every((x) => x.result === 'PASS'),
    true,
  );
  for (const modify of [
    (x) => x.cold.pop(),
    (x) => x.warm.pop(),
    (x) => x.cold.push({ ...x.cold[0] }),
    (x) => x.cold.push({ path: 'extra.md', content: '' }),
  ]) {
    const value = structuredClone(good);
    modify(value);
    assert.throws(
      () => compareGeneratedOutput(value, bytes),
      /GENERATED_INVENTORY_DRIFT/,
    );
  }
  assert.throws(
    () => compareGeneratedOutput({ cold: good.cold }, bytes),
    /REPRODUCIBILITY_UNPROVEN/,
  );
  const warm = structuredClone(good);
  warm.warm[0].content += ' ';
  assert.equal(
    compareGeneratedOutput(warm, bytes)[0].failureCode,
    'REPRODUCIBILITY_UNPROVEN',
  );
  const manual = structuredClone(good);
  manual.cold[0].content += ' ';
  manual.warm[0].content += ' ';
  assert.equal(
    compareGeneratedOutput(manual, bytes)[0].failureCode,
    'GENERATED_BYTE_DRIFT',
  );
  const missing = { ...bytes };
  delete missing[Object.keys(bytes)[0]];
  assert.throws(
    () => compareGeneratedOutput(good, missing),
    /GENERATED_INVENTORY_DRIFT/,
  );
});

test('generated copied targets byte drift missing extra and timeout fail without real target writes', async () => {
  const before = generatedFixtureBytes(),
    dir = copiedGeneratedFixture(),
    source = resolveGeneratedSourceRoot();
  try {
    const path = Object.keys(before)[0];
    writeFileSync(
      join(dir, path),
      Buffer.concat([before[path], Buffer.from(' ')]),
    );
    const drift = await validateGeneratedArtifacts(dir, source);
    const result = drift.results.find((x) => x.path === path);
    assert.equal(result.result, 'FAIL');
    assert.equal(result.failureCode, 'GENERATED_BYTE_DRIFT');
    assert.equal(result.sha256, rawSha256(readFileSync(join(dir, path))));
    writeFileSync(join(dir, path), before[path]);
    const timeout = await validateGeneratedArtifacts(dir, source, undefined, 1);
    assert.equal(timeout.failureCode, 'VALIDATOR_TIMEOUT');
    const extra = '.agents/skills/openspec-extra/SKILL.md';
    mkdirSync(join(dir, '.agents/skills/openspec-extra'));
    writeFileSync(join(dir, extra), 'extra');
    assert.equal(
      (await validateGeneratedArtifacts(dir, source)).failureCode,
      'GENERATED_INVENTORY_DRIFT',
    );
    unlinkSync(join(dir, extra));
    // Supply the exact inventory to isolate the missing-file case from the leftover empty directory.
    const inventory = Object.entries(before).map(([path, bytes]) => ({
      path,
      sha256: rawSha256(bytes),
    }));
    unlinkSync(join(dir, path));
    assert.equal(
      (await validateGeneratedArtifacts(dir, source, inventory)).failureCode,
      'ARTIFACT_MISSING',
    );
    assert.deepEqual(generatedFixtureBytes(), before);
  } finally {
    removeGeneratedScratch(dir);
  }
});

test('generated missing source fails as a generic failure, never an unstructured exception', async () => {
  const value = await validateGeneratedArtifacts(
    process.cwd(),
    join(resolve(tmpdir()), 'absent-generated-source'),
  );
  assert.notEqual(value.failureCode, null);
  assert.equal(
    value.results.every((x) => x.result === 'FAIL'),
    true,
  );
});

test('generated source-owned registry does not widen V2 entries or generic results', () => {
  const f = coverageFixture(classes[1], subclasses[0]);
  const extra = JSON.parse(f.text());
  extra.entries[0].sourceClosureSha256 = generatedBinding.sourceClosureSha256;
  assert.throws(() => parsePolicy(JSON.stringify(extra)), /POLICY_INVALID/);
  assert.equal(
    aggregateCoverage(
      f.text(),
      f.artifacts,
      f.observations,
      f.results.map((x) => ({
        ...x,
        sourceClosureSha256: generatedBinding.sourceClosureSha256,
      })),
    ).aggregate,
    'FAIL',
  );
});

import test from 'node:test';
import { z } from 'zod';
import * as prettier from 'prettier';
import {
  deadline,
  dispatchBounded,
  assertStableSnapshot,
  readExactFile,
} from './check.mjs';
import {
  legacyPolicySchema,
  membershipIdentity,
  resolveDomain,
  verifyIgnoreMembership,
} from './check.mjs';
import {
  inventoryRepository,
  aggregateCoverage,
  runCoverage,
  formatterIdentity,
  orchestratorIdentity,
} from './check.mjs';
import {
  writeFileSync,
  renameSync,
  unlinkSync,
  mkdirSync,
  symlinkSync,
} from 'node:fs';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  lstatSync,
  realpathSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, relative, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  classes,
  subclasses,
  parsePolicy,
  parseJson,
  canonicalJson,
  rawSha256,
  unitSha256,
  admitEntry,
  exactPathSchema,
} from './check.mjs';

const hash = 'a'.repeat(64);

test('partial malformed mixed stale and unexpected results cannot aggregate PASS', async () => {
  const f = coverageFixture();
  for (const results of [
    [...f.results, { ...f.results[0], sha256: 'b'.repeat(64) }],
    [{}],
    [...f.results, { ...f.results[0], path: 'other.md' }],
  ])
    assert.equal(
      aggregateCoverage(f.text(), f.artifacts, f.observations, results)
        .aggregate,
      'FAIL',
    );
  await assert.rejects(
    dispatchBounded([
      async () => {
        throw new Error('terminated');
      },
      async () => true,
    ]),
    /terminated/,
  );
});

test('actual V2 runner reconciles full audit and rejects new ignored tracked member', async () => {
  const base = resolve(tmpdir()),
    dir = mkdtempSync(join(base, 'yuta-format-v2-'));
  try {
    assert.equal(spawnSync('git', ['init', '--quiet', dir]).status, 0);
    mkdirSync(join(dir, '.github/workflows'), { recursive: true });
    const config = {
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
    };
    const files = {
      '.prettierrc.json': JSON.stringify(config),
      '.prettierignore': 'ignored/**\n',
      'package.json': JSON.stringify({
        scripts: {
          format: 'prettier --write .',
          'format:check': 'prettier --check .',
        },
      }),
      '.github/workflows/ci.yml': 'steps:\n  - run: pnpm format:check\n',
      'example.md': '# example\n',
    };
    for (const [path, text] of Object.entries(files)) {
      const info = await prettier.getFileInfo(join(dir, path), {
        resolveConfig: false,
      });
      writeFileSync(
        join(dir, path),
        info.inferredParser
          ? await prettier.format(text, { ...config, filepath: path })
          : text,
      );
    }
    assert.equal(spawnSync('git', ['-C', dir, 'add', '.']).status, 0);
    const f = fixture(),
      fmt = formatterIdentity(),
      own = f.policy.entries[0].owner;
    f.policy.entries = [];
    f.policy.toolBindings.tools = [
      {
        package: 'prettier',
        version: fmt.version,
        sourceSha256: fmt.sha256,
        adapterVersion: 1,
      },
      {
        package: 'format-policy',
        version: '1',
        sourceSha256: orchestratorIdentity(),
        adapterVersion: 1,
      },
    ];
    f.policy.toolBindings.formatterSha256 = fmt.sha256;
    f.policy.toolBindings.configSha256 = rawSha256(
      readFileSync(join(dir, '.prettierrc.json')),
    );
    f.policy.toolBindings.ignoreSha256 = rawSha256(
      readFileSync(join(dir, '.prettierignore')),
    );
    const inventory = await inventoryRepository(dir);
    for (const file of inventory.artifacts) {
      if (file.parser) {
        const entry = {
          path: file.path,
          class: classes[0],
          owner: own,
          rationale: 'Synthetic reviewed source',
          validators: ['mutable-prettier-v1'],
          identity: {},
        };
        entry.admissionRef = addUnit(f, 'entry:' + file.path, {
          decision: 'APPROVED',
          entrySha256: unitSha256(entry),
        });
        f.policy.entries.push(entry);
      } else {
        const type = {
          schemaVersion: 2,
          validatorContractVersion: 2,
          path: file.path,
          expectedSha256: file.sha256,
          kind: 'UNSUPPORTED_TEXT',
          reason: 'Synthetic reviewed configuration text',
          formatterSha256: fmt.sha256,
          configSha256: f.policy.toolBindings.configSha256,
        };
        const a = {
          path: file.path,
          owner: own,
          expectedSha256: file.sha256,
          typeEvidence: {
            kind: type.kind,
            reason: type.reason,
            evidenceRef: addUnit(f, 'type:' + file.path, type),
          },
        };
        a.approvalRef = addUnit(f, 'domain:' + file.path, {
          decision: 'APPROVED',
          schemaVersion: 2,
          validatorContractVersion: 2,
          policyRevision: 1,
          domainAdmissionSha256: unitSha256(a),
        });
        f.policy.domainAdmissions.push(a);
      }
    }
    const b = f.policy.ignoreMembership;
    b.sourceSha256 = f.policy.toolBindings.ignoreSha256;
    b.formatterSha256 = fmt.sha256;
    b.configSha256 = f.policy.toolBindings.configSha256;
    b.membershipSha256 = membershipIdentity(b);
    const { approvalRef, ...body } = b;
    b.approvalRef = addUnit(f, 'actual-ignore', {
      decision: 'APPROVED',
      schemaVersion: 2,
      validatorContractVersion: 2,
      policyRevision: 1,
      ignoreMembershipSha256: unitSha256(body),
    });
    resign(f);
    const first = await runCoverage(dir, f.text(), f.observations);
    assert.equal(first.aggregate, 'PASS', JSON.stringify(first.failureCodes));
    const second = await runCoverage(dir, f.text(), f.observations);
    assert.equal(canonicalJson(first), canonicalJson(second));
    assert.equal(first.counts.total, first.counts.pass + first.counts.fail);
    assert.equal(
      first.counts.total,
      first.counts.inDomain + first.counts.outside + first.counts.unresolved,
    );
    assert.equal(first.artifacts.length, inventory.artifacts.length);
    // Task 3.1: exercise the concrete adapter through actual V2 orchestration.
    const copied = generatedFixtureBytes();
    for (const [path, bytes] of Object.entries(copied)) {
      mkdirSync(join(dir, path, '..'), { recursive: true });
      writeFileSync(join(dir, path), bytes);
      const entry = {
        path,
        class: classes[1],
        subclass: subclasses[0],
        owner: own,
        rationale: 'Synthetic generated admission',
        validators: ['generated-repro-v1'],
        identity: { rawSha256: rawSha256(bytes) },
      };
      entry.admissionRef = addUnit(f, 'generated:' + path, {
        decision: 'APPROVED',
        entrySha256: unitSha256(entry),
      });
      f.policy.entries.push(entry);
    }
    const generatorTool = {
      package: generatedBinding.package,
      version: generatedBinding.version,
      sourceSha256: generatedBinding.sourceClosureSha256,
      adapterVersion: 1,
    };
    f.policy.toolBindings.tools.push(generatorTool);
    resign(f);
    const generated = await runCoverage(dir, f.text(), f.observations);
    assert.equal(generated.aggregate, 'PASS', JSON.stringify(generated));
    assert.equal(
      generated.artifacts.filter((x) =>
        x.routes.some(
          (r) => r.validator === 'generated-repro-v1' && r.result === 'PASS',
        ),
      ).length,
      9,
    );
    for (const [key, value] of [
      ['sourceSha256', hash],
      ['version', '1.11.1'],
    ]) {
      const old = generatorTool[key];
      generatorTool[key] = value;
      resign(f);
      const failed = await runCoverage(dir, f.text(), f.observations);
      assert.equal(failed.aggregate, 'FAIL');
      assert.equal(
        failed.artifacts.filter((x) =>
          x.failureCodes.includes('GENERATOR_IDENTITY_DRIFT'),
        ).length,
        9,
      );
      generatorTool[key] = old;
    }
    f.policy.toolBindings.tools.pop();
    resign(f);
    assert.equal(
      (await runCoverage(dir, f.text(), f.observations)).aggregate,
      'FAIL',
    );
    f.policy.toolBindings.tools.push(generatorTool);
    resign(f);
    mkdirSync(join(dir, 'ignored'));
    writeFileSync(join(dir, 'ignored/new.md'), '# new\n');
    assert.equal(spawnSync('git', ['-C', dir, 'add', '.']).status, 0);
    const changed = await runCoverage(dir, f.text(), f.observations);
    assert.equal(changed.aggregate, 'FAIL');
    assert.ok(changed.failureCodes.includes('IGNORE_SCOPE_DRIFT'));
    assert.ok(
      changed.artifacts.find((a) => a.path === 'ignored/new.md').ignored,
    );
  } finally {
    assert.ok(relative(base, dir).startsWith('yuta-format-v2-'));
    assert.equal(lstatSync(dir).isSymbolicLink(), false);
    rmSync(dir, { recursive: true });
  }
});

test('snapshot identity detects bytes policy inventory and classification changes', () => {
  const baseline = {
    policy: fixture().text(),
    inventory: [{ path: 'a/[x]', sha256: hash }],
    classification: ['a/[x]'],
  };
  assert.doesNotThrow(() =>
    assertStableSnapshot(baseline, parseJson(JSON.stringify(baseline))),
  );
  for (const mutate of [
    (s) => (s.policy += ' '),
    (s) => (s.inventory[0].sha256 = 'b'.repeat(64)),
    (s) => s.inventory.push({ path: 'new', sha256: hash }),
    (s) => (s.classification = []),
  ]) {
    const changed = parseJson(JSON.stringify(baseline));
    mutate(changed);
    assert.throws(
      () => assertStableSnapshot(baseline, changed),
      /CONCURRENT_DRIFT/,
    );
  }
});

test('exact file reader rejects real reparse traversal before reading target', () => {
  const base = resolve(tmpdir()),
    dir = mkdtempSync(join(base, 'yuta-format-reparse-'));
  try {
    mkdirSync(join(dir, 'target'));
    writeFileSync(join(dir, 'target/file.md'), '# test\n');
    symlinkSync(join(dir, 'target'), join(dir, 'alias'), 'junction');
    assert.throws(() => readExactFile(dir, 'alias/file.md'), /UNSAFE_PATH/);
    assert.equal(
      readExactFile(dir, 'target/file.md').bytes.toString(),
      '# test\n',
    );
  } finally {
    assert.ok(relative(base, dir).startsWith('yuta-format-reparse-'));
    assert.equal(lstatSync(dir).isSymbolicLink(), false);
    rmSync(dir, { recursive: true });
  }
});

test('required timeout propagates a real nonzero command exit without private output', () => {
  const child = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      "import {deadline} from './scripts/format-policy/check.mjs';try{await deadline(()=>new Promise(()=>{}),5);process.exitCode=0}catch(e){console.log(e.code);process.exitCode=1}",
    ],
    { encoding: 'utf8' },
  );
  assert.equal(child.status, 1);
  assert.equal(child.stdout.trim(), 'VALIDATOR_TIMEOUT');
  assert.equal(child.stderr, '');
});

test('bounded dispatch preserves ordering and failure despite completion order', async () => {
  let active = 0,
    peak = 0;
  const outputs = await dispatchBounded(
    Array.from({ length: 9 }, (_, i) => async () => {
      active++;
      peak = Math.max(peak, active);
      await new Promise((r) => setTimeout(r, (9 - i) * 2));
      active--;
      return { index: i, result: i === 4 ? 'FAIL' : 'PASS' };
    }),
  );
  assert.equal(peak, 4);
  assert.deepEqual(
    outputs.map((r) => r.index),
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
  );
  assert.equal(outputs[4].result, 'FAIL');
});
test('timeout is explicit and late completion cannot replace its failure audit', async () => {
  assert.equal(await deadline(async () => true, 20), true);
  let finish;
  const pending = new Promise((r) => {
    finish = r;
  });
  let code;
  try {
    await deadline(() => pending, 5);
  } catch (e) {
    code = e.code;
  }
  assert.equal(code, 'VALIDATOR_TIMEOUT');
  const f = coverageFixture();
  f.results[0] = { ...f.results[0], result: 'FAIL', failureCode: code };
  const audit = aggregateCoverage(
    f.text(),
    f.artifacts,
    f.observations,
    f.results,
  );
  const before = canonicalJson(audit);
  finish(true);
  await Promise.resolve();
  assert.equal(audit.aggregate, 'FAIL');
  assert.ok(audit.artifacts[0].failureCodes.includes('VALIDATOR_TIMEOUT'));
  assert.equal(canonicalJson(audit), before);
});

function resign(f) {
  const { approvalRef, ...body } = f.policy;
  const approval = { decision: 'APPROVED', policySha256: unitSha256(body) };
  f.observations.find((r) => r.unit === 'policy').text =
    JSON.stringify(approval);
  f.policy.approvalRef.sha256 = unitSha256(approval);
}
function addUnit(f, unit, value) {
  f.observations.push({
    path: 'reviews/approved.md',
    unit,
    text: JSON.stringify(value),
  });
  return { path: 'reviews/approved.md', unit, sha256: unitSha256(value) };
}
function domainFixture() {
  const f = fixture();
  const type = {
    schemaVersion: 2,
    validatorContractVersion: 2,
    path: 'data/example.bin',
    expectedSha256: hash,
    kind: 'BINARY',
    reason: 'Synthetic reviewed binary type',
    formatterSha256: hash,
    configSha256: hash,
  };
  const admission = {
    path: type.path,
    owner: f.policy.entries[0].owner,
    expectedSha256: hash,
    typeEvidence: {
      kind: type.kind,
      reason: type.reason,
      evidenceRef: addUnit(f, 'type', type),
    },
  };
  admission.approvalRef = addUnit(f, 'domain', {
    decision: 'APPROVED',
    schemaVersion: 2,
    validatorContractVersion: 2,
    policyRevision: 1,
    domainAdmissionSha256: unitSha256(admission),
  });
  f.policy.domainAdmissions.push(admission);
  resign(f);
  return {
    ...f,
    file: { path: type.path, parser: null, sha256: hash, failureCode: null },
  };
}
test('V2 version dispatch never upgrades historical V1', () => {
  const f = fixture(),
    v2 = f.text();
  const { domainAdmissions, ignoreMembership, ...old } = f.policy;
  old.schemaVersion = 1;
  old.validatorContractVersion = 1;
  assert.ok(legacyPolicySchema.safeParse(old).success);
  assert.throws(
    () => parsePolicy(JSON.stringify(old)),
    /LEGACY_POLICY_VERSION_REQUIRES_MIGRATION/,
  );
  assert.equal(old.schemaVersion, 1);
  assert.throws(
    () => parsePolicy(JSON.stringify({ ...old, domainAdmissions })),
    /POLICY_INVALID/,
  );
  for (const pair of [
    [1, 2],
    [2, 1],
  ])
    assert.throws(
      () =>
        parsePolicy(
          JSON.stringify({
            ...f.policy,
            schemaVersion: pair[0],
            validatorContractVersion: pair[1],
          }),
        ),
      /POLICY_VERSION_PAIR_MISMATCH/,
    );
  for (const value of [undefined, 3, '2', null])
    assert.throws(
      () => parsePolicy(JSON.stringify({ ...f.policy, schemaVersion: value })),
      /POLICY_VERSION_MISMATCH/,
    );
  assert.notEqual(unitSha256(old), unitSha256(parseJson(v2)));
  assert.equal(parsePolicy(v2).schemaVersion, 2);
});
test('domain evidence is independent approval, never parser-null or ignored status', () => {
  const f = domainFixture();
  assert.equal(
    resolveDomain(f.text(), f.file, f.observations),
    'OUTSIDE_FORMATTING_UNIVERSE_BY_APPROVED_ADMISSION',
  );
  assert.equal(
    resolveDomain(f.text(), { ...f.file, ignored: true }, f.observations),
    'OUTSIDE_FORMATTING_UNIVERSE_BY_APPROVED_ADMISSION',
  );
  assert.throws(
    () =>
      resolveDomain(
        f.text(),
        { ...f.file, parser: 'markdown' },
        f.observations,
      ),
    /DOMAIN_ADMISSION_CONFLICT/,
  );
  assert.throws(() => resolveDomain(f.text(), f.file, []));
  assert.throws(
    () =>
      resolveDomain(
        f.text(),
        { ...f.file, sha256: 'b'.repeat(64) },
        f.observations,
      ),
    /CLASSIFICATION_STALE/,
  );
  assert.throws(
    () => resolveDomain(f.text(), f.file, f.observations, [f.file.path]),
    /DOMAIN_ADMISSION_CONFLICT/,
  );
  f.policy.domainAdmissions = [];
  resign(f);
  assert.throws(
    () => resolveDomain(f.text(), f.file, f.observations),
    /UNCLASSIFIED/,
  );
});
test('malformed missing self-declared and stale domain approvals fail', () => {
  for (const mutate of [
    (a) => delete a.owner,
    (a) => delete a.approvalRef,
    (a) => (a.approved = true),
    (a) => (a.path = 'data/*'),
    (a) => (a.typeEvidence.kind = 'unknown'),
    (a) => (a.approvalRef.sha256 = 'b'.repeat(64)),
    (a) => (a.typeEvidence.reason = 'changed'),
  ]) {
    const f = domainFixture();
    mutate(f.policy.domainAdmissions[0]);
    resign(f);
    assert.throws(() => resolveDomain(f.text(), f.file, f.observations));
  }
});
function ignoreFixture(paths = ['a.md', 'b.md']) {
  const f = fixture(),
    binding = f.policy.ignoreMembership;
  binding.paths = paths;
  binding.membershipSha256 = membershipIdentity(binding);
  const { approvalRef, ...body } = binding;
  binding.approvalRef = addUnit(f, 'ignore', {
    decision: 'APPROVED',
    schemaVersion: 2,
    validatorContractVersion: 2,
    policyRevision: 1,
    ignoreMembershipSha256: unitSha256(body),
  });
  resign(f);
  return f;
}
test('ignore membership identity is a duplicate-free exact set, not authority', () => {
  const f = ignoreFixture();
  assert.equal(
    membershipIdentity(f.policy.ignoreMembership),
    membershipIdentity({
      ...f.policy.ignoreMembership,
      paths: ['b.md', 'a.md'],
    }),
  );
  assert.equal(
    verifyIgnoreMembership(f.text(), ['b.md', 'a.md'], hash, f.observations),
    true,
  );
  for (const paths of [['a.md'], ['a.md', 'b.md', 'new.md'], ['a.md', 'a.md']])
    assert.throws(
      () => verifyIgnoreMembership(f.text(), paths, hash, f.observations),
      /IGNORE_SCOPE_DRIFT/,
    );
  assert.throws(
    () =>
      verifyIgnoreMembership(
        f.text(),
        ['a.md', 'b.md'],
        'b'.repeat(64),
        f.observations,
      ),
    /IGNORE_BINDING_STALE/,
  );
  assert.throws(
    () =>
      membershipIdentity({
        ...f.policy.ignoreMembership,
        paths: ['a.md', 'A.md'],
      }),
    /DUPLICATE_CLASSIFICATION/,
  );
  assert.throws(
    () =>
      resolveDomain(
        f.text(),
        { path: 'a.md', parser: null, sha256: hash },
        f.observations,
      ),
    /UNCLASSIFIED/,
  );
  assert.throws(() =>
    verifyIgnoreMembership(f.text(), ['a.md', 'b.md'], hash, []),
  );
});

function coverageFixture(kind = classes[0], subtype) {
  const f = fixture(kind, subtype);
  const artifacts = [
    {
      path: 'fixtures/example.md',
      parser: 'markdown',
      sha256: hash,
      failureCode: null,
    },
  ];
  const results = f.policy.entries[0].validators.map((validator) => ({
    path: artifacts[0].path,
    validator,
    version: 1,
    sha256: hash,
    result: 'PASS',
    failureCode: null,
  }));
  return { ...f, artifacts, results };
}
test('complete mutable and alternate result routing, deterministic audit', () => {
  for (const [kind, subtype] of [
    [classes[0]],
    [classes[1], subclasses[0]],
    [classes[1], subclasses[1]],
  ]) {
    const f = coverageFixture(kind, subtype);
    const result = aggregateCoverage(
      f.text(),
      f.artifacts,
      f.observations,
      f.results,
    );
    assert.equal(result.aggregate, 'PASS');
    assert.equal(result.exitCode, 0);
    assert.equal(
      result.artifacts[0].routes[0].route,
      kind === classes[0] ? 'mutable' : 'alternate',
    );
    assert.equal(
      canonicalJson(result),
      canonicalJson(
        aggregateCoverage(
          f.text(),
          [...f.artifacts].reverse(),
          f.observations,
          [...f.results].reverse(),
        ),
      ),
    );
  }
});
test('missing skipped unavailable unknown duplicate and stale results fail', () => {
  const f = coverageFixture(classes[1], subclasses[0]);
  for (const results of [
    [],
    [{ ...f.results[0], result: 'SKIPPED' }],
    [{ ...f.results[0], result: 'UNAVAILABLE' }],
    [{ ...f.results[0], validator: 'unknown' }],
    [...f.results, ...f.results],
    [{ ...f.results[0], sha256: 'b'.repeat(64) }],
  ]) {
    assert.equal(
      aggregateCoverage(f.text(), f.artifacts, f.observations, results)
        .aggregate,
      'FAIL',
    );
  }
});
test('missing, new, renamed and stale artifact coverage fails', () => {
  const f = coverageFixture(classes[2]);
  for (const artifacts of [
    [],
    [...f.artifacts, { ...f.artifacts[0], path: 'new.md' }],
    [{ ...f.artifacts[0], path: 'renamed.md' }],
    [{ ...f.artifacts[0], sha256: 'b'.repeat(64) }],
    [...f.artifacts, ...f.artifacts],
  ]) {
    assert.equal(
      aggregateCoverage(f.text(), artifacts, f.observations, f.results)
        .aggregate,
      'FAIL',
    );
  }
});
test('coverage retains policy version and admission failure', () => {
  const f = coverageFixture();
  assert.equal(
    aggregateCoverage(f.text(), f.artifacts, [], f.results).aggregate,
    'FAIL',
  );
  f.policy.schemaVersion = 3;
  assert.throws(
    () => aggregateCoverage(f.text(), f.artifacts, f.observations, f.results),
    /POLICY_VERSION_MISMATCH/,
  );
});
test('real Git inventory ignores neither tracked ignores nor missing/renamed paths', async () => {
  const base = resolve(tmpdir()),
    dir = mkdtempSync(join(base, 'yuta-format-inventory-'));
  try {
    assert.equal(spawnSync('git', ['init', '--quiet', dir]).status, 0);
    mkdirSync(join(dir, 'fixtures'));
    mkdirSync(join(dir, '.github/workflows'), { recursive: true });
    writeFileSync(
      join(dir, '.github/workflows/ci.yml'),
      'steps:\n  - run: pnpm format:check\n',
    );
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({
        scripts: {
          format: 'prettier --write .',
          'format:check': 'prettier --check .',
        },
      }),
    );
    writeFileSync(join(dir, 'fixtures/example.md'), '# example\n');
    writeFileSync(join(dir, '.prettierignore'), 'fixtures/**\n');
    writeFileSync(
      join(dir, '.prettierrc.json'),
      JSON.stringify({
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
      }),
    );
    assert.equal(spawnSync('git', ['-C', dir, 'add', '.']).status, 0);
    const first = await inventoryRepository(dir);
    assert.equal(
      first.artifacts.find((a) => a.path === 'fixtures/example.md').parser,
      'markdown',
    );
    writeFileSync(join(dir, '.prettierignore'), '**\n');
    const second = await inventoryRepository(dir);
    assert.deepEqual(
      first.artifacts.map((a) => a.path),
      second.artifacts.map((a) => a.path),
    );
    const f = coverageFixture();
    assert.equal(
      (await runCoverage(dir, f.text(), f.observations)).aggregate,
      'FAIL',
    );
    const fmt = formatterIdentity();
    f.policy.toolBindings.tools[0] = {
      package: 'prettier',
      version: fmt.version,
      sourceSha256: fmt.sha256,
      adapterVersion: 1,
    };
    f.policy.toolBindings.tools.push({
      package: 'format-policy',
      version: '1',
      sourceSha256: orchestratorIdentity(),
      adapterVersion: 1,
    });
    f.policy.toolBindings.formatterSha256 = fmt.sha256;
    f.policy.toolBindings.configSha256 = rawSha256(
      readFileSync(join(dir, '.prettierrc.json')),
    );
    f.policy.toolBindings.ignoreSha256 = rawSha256(
      readFileSync(join(dir, '.prettierignore')),
    );
    const { approvalRef, ...body } = f.policy;
    const unit = f.observations.find((r) => r.unit === 'policy');
    const approval = { decision: 'APPROVED', policySha256: unitSha256(body) };
    unit.text = JSON.stringify(approval);
    f.policy.approvalRef.sha256 = unitSha256(approval);
    const actual = await runCoverage(dir, f.text(), f.observations);
    assert.equal(
      actual.artifacts.find((a) => a.path === 'fixtures/example.md').routes[0]
        .result,
      'PASS',
    );
    assert.ok(actual.ignoredPaths.includes('fixtures/example.md'));
    writeFileSync(join(dir, 'fixtures/example.md'), '#   bad    \n');
    const bad = await runCoverage(dir, f.text(), f.observations);
    assert.equal(
      bad.artifacts.find((a) => a.path === 'fixtures/example.md').result,
      'FAIL',
    );
    writeFileSync(join(dir, '.prettierignore'), '*\n');
    assert.deepEqual(
      (await runCoverage(dir, f.text(), f.observations)).failureCodes,
      ['CLASSIFICATION_STALE'],
    );
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({ scripts: { 'format:check': 'exit 0' } }),
    );
    assert.deepEqual(
      (await runCoverage(dir, f.text(), f.observations)).failureCodes,
      ['ROUTE_BINDING_MISMATCH'],
    );
    renameSync(
      join(dir, 'fixtures/example.md'),
      join(dir, 'fixtures/renamed.md'),
    );
    const third = await inventoryRepository(dir);
    assert.equal(
      third.artifacts.find((a) => a.path === 'fixtures/example.md').failureCode,
      'ARTIFACT_MISSING',
    );
    assert.ok(third.artifacts.some((a) => a.path === 'fixtures/renamed.md'));
    writeFileSync(join(dir, '.gitignore'), 'fixtures/renamed.md\n');
    // Expected registered paths remain present even when untracked and ignored.
    const fourth = await inventoryRepository(dir, ['fixtures/renamed.md']);
    assert.ok(fourth.artifacts.some((a) => a.path === 'fixtures/renamed.md'));
  } finally {
    assert.ok(relative(base, dir).startsWith('yuta-format-inventory-'));
    assert.equal(lstatSync(dir).isSymbolicLink(), false);
    rmSync(dir, { recursive: true });
  }
});
test('canonical representation preserves root and nested prototype-like data keys', () => {
  for (const key of ['__proto__', 'constructor', 'prototype']) {
    const value = JSON.parse(`{"${key}":{"x":1},"a":2}`);
    assert.notEqual(canonicalJson(value), canonicalJson({ a: 2 }));
    assert.notEqual(unitSha256(value), unitSha256({ a: 2 }));
    assert.notEqual(
      unitSha256({ nested: value }),
      unitSha256({ nested: { a: 2 } }),
    );
    assert.deepEqual(JSON.parse(canonicalJson(value)), value);
  }
});
test('canonical ordering equivalence and array difference', () => {
  assert.equal(
    canonicalJson(JSON.parse('{"__proto__":1,"b":2}')),
    canonicalJson(JSON.parse('{"b":2,"__proto__":1}')),
  );
  assert.notEqual(unitSha256([1, 2]), unitSha256([2, 1]));
  for (const value of [null, false, true, 0, 42, '42', ''])
    assert.equal(canonicalJson(value), JSON.stringify(value));
  assert.notEqual(unitSha256(42), unitSha256('42'));
});
test('canonical traversal uses own data only and never mutates prototypes', () => {
  const parent = { inherited: true };
  const value = Object.create(parent);
  Object.defineProperty(value, '__proto__', {
    value: { polluted: true },
    enumerable: true,
  });
  const before = Object.getOwnPropertyDescriptors(Object.prototype);
  assert.equal(canonicalJson(value), '{"__proto__":{"polluted":true}}');
  assert.equal(Object.getPrototypeOf(value), parent);
  assert.deepEqual(Object.getOwnPropertyDescriptors(Object.prototype), before);
  assert.equal({}.polluted, undefined);
  Object.defineProperty(value, 'getter', {
    enumerable: true,
    get() {
      throw new Error('must not execute');
    },
  });
  assert.throws(() => canonicalJson(value), /POLICY_INVALID/);
});
test('representation identity is independent of Zod key stripping', () => {
  const parsed = JSON.parse('{"__proto__":{"x":1},"a":2}');
  const model = z.object({ a: z.number() }).parse(parsed);
  assert.notEqual(unitSha256(parsed), unitSha256(model));
  const f = fixture();
  assert.equal(parsePolicy(f.text()).schemaVersion, 2);
  f.policy.entries[0].class = 'INVALID';
  assert.throws(() => parsePolicy(f.text()));
});
function fixture(kind = classes[0], subtype) {
  const observations = [];
  const reference = (unit, value) => {
    observations.push({
      path: 'reviews/approved.md',
      unit,
      text: JSON.stringify(value),
    });
    return { path: 'reviews/approved.md', unit, sha256: unitSha256(value) };
  };
  const rules = {
    MUTABLE_FORMATTED: ['mutable-prettier-v1'],
    GENERATED_EXTERNAL_OR_DERIVED: [
      subtype === subclasses[1] ? 'live-metadata-v1' : 'generated-repro-v1',
    ],
    HISTORICAL_HASH_BOUND: ['historical-preserve-v1'],
    ARCHIVED_PRESERVED: ['archive-preserve-v1'],
    ACTIVE_CHANGE_OWNED: ['active-owner-v1', 'mutable-prettier-v1'],
    NORMATIVE_REVIEW_REQUIRED: ['mutable-prettier-v1', 'normative-v1'],
  };
  const entry = {
    path: 'fixtures/example.md',
    class: kind,
    owner: {
      id: 'tooling',
      authority: reference('owner', { ownerId: 'tooling', status: 'CURRENT' }),
    },
    rationale: 'Explicit synthetic admission',
    validators: rules[kind],
    identity: kind === classes[0] ? {} : { rawSha256: hash },
  };
  if (subtype) entry.subclass = subtype;
  if (kind === classes[4]) {
    const state = {
      changeId: 'example',
      path: 'changes/example',
      status: 'ACTIVE',
      completed: 0,
      total: 1,
      normative: false,
    };
    entry.lifecycleBinding = {
      ...state,
      reviewRef: reference('lifecycle', {
        decision: 'APPROVED',
        stateSha256: unitSha256(state),
      }),
    };
  }
  entry.admissionRef = reference('admission', {
    decision: 'APPROVED',
    entrySha256: unitSha256(entry),
  });
  const body = {
    schemaVersion: 2,
    policyRevision: 1,
    validatorContractVersion: 2,
    toolBindings: {
      tools: [
        {
          package: 'prettier',
          version: '3.8.4',
          sourceSha256: hash,
          adapterVersion: 1,
        },
      ],
      formatterSha256: hash,
      configSha256: hash,
      ignoreSha256: hash,
    },
    entries: [entry],
    domainAdmissions: [],
    ignoreMembership: {
      sourcePath: '.prettierignore',
      sourceSha256: hash,
      expansionAlgorithm: 'prettier-tracked-file-info-v1',
      expansionVersion: 1,
      formatterSha256: hash,
      configSha256: hash,
      paths: [],
      membershipSha256: hash,
      approvalRef: {
        path: 'reviews/approved.md',
        unit: 'ignore',
        sha256: hash,
      },
    },
    preservationSha256: hash,
    migrationSha256: hash,
  };
  const policy = {
    ...body,
    approvalRef: reference('policy', {
      decision: 'APPROVED',
      policySha256: unitSha256(body),
    }),
  };
  return { policy, observations, text: () => JSON.stringify(policy) };
}

for (const [kind, subtype] of [
  ...classes.map((k) => [k, k === classes[1] ? subclasses[0] : undefined]),
  [classes[1], subclasses[1]],
]) {
  test(`admit ${kind} ${subtype ?? ''}`, () => {
    const f = fixture(kind, subtype);
    assert.equal(
      admitEntry(f.text(), 'fixtures/example.md', f.observations).entry.class,
      kind,
    );
  });
}
const mutations = [
  ['unknown class', (p) => (p.entries[0].class = 'UNKNOWN')],
  ['missing owner', (p) => delete p.entries[0].owner],
  ['missing validator', (p) => delete p.entries[0].validators],
  ['missing authority', (p) => delete p.entries[0].owner.authority],
  ['missing rationale', (p) => delete p.entries[0].rationale],
  ['unknown field/ignore shortcut', (p) => (p.entries[0].ignored = true)],
  ['malformed identity', (p) => (p.entries[0].identity.rawSha256 = 'bad')],
  ['future schema', (p) => (p.schemaVersion = 3)],
  ['missing version', (p) => delete p.schemaVersion],
  ['contract mismatch', (p) => (p.validatorContractVersion = 1)],
  ['revision coercion', (p) => (p.policyRevision = '1')],
  ['invalid subtype', (p) => (p.entries[0].subclass = 'OTHER')],
  ['subtype on mutable', (p) => (p.entries[0].subclass = subclasses[0])],
  ['unknown validator', (p) => (p.entries[0].validators = ['skip'])],
  [
    'duplicate validator',
    (p) => p.entries[0].validators.push('mutable-prettier-v1'),
  ],
  ['duplicate path', (p) => p.entries.push(structuredClone(p.entries[0]))],
  [
    'case alias',
    (p) =>
      p.entries.push({
        ...structuredClone(p.entries[0]),
        path: 'Fixtures/example.md',
      }),
  ],
  [
    'conflicting class',
    (p) =>
      p.entries.push({
        ...structuredClone(p.entries[0]),
        class: classes[5],
        validators: ['mutable-prettier-v1', 'normative-v1'],
        identity: { rawSha256: hash },
      }),
  ],
];
for (const [name, mutate] of mutations)
  test(`reject ${name}`, () => {
    const f = fixture();
    mutate(f.policy);
    assert.throws(() => parsePolicy(f.text()));
  });
for (const path of [
  '/root',
  '../x',
  'a/../b',
  'a//b',
  'a/./b',
  'C:/x',
  'a\\b',
  'a/*',
  'a/**',
  'a/?',
  'a/{x,y}',
  'a/{x}',
  'a:stream',
  'a/CON.txt',
  'a/x.',
  'a/x ',
  'a/\u0000x',
]) {
  test(`unsafe path ${JSON.stringify(path)}`, () =>
    assert.equal(exactPathSchema.safeParse(path).success, false));
}
for (const path of [
  'a/[x]',
  'apps/backoffice/src/app/equipe/[employeeId]/page.tsx',
  'apps/feedback-web/src/app/[tenantSlug]/page.tsx',
  'apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/page.tsx',
]) {
  test(`literal bracket path ${path}`, () => {
    assert.equal(exactPathSchema.parse(path), path);
    const f = fixture();
    f.policy.entries[0].path = path;
    assert.equal(parsePolicy(f.text()).entries[0].path, path);
    assert.notEqual(
      unitSha256({ path }),
      unitSha256({ path: path.replace(/[\[\]]/g, '') }),
    );
  });
}

test('literal bracket classification never matches bracket contents as a pattern', () => {
  const f = fixture();
  f.policy.entries[0].path = 'a/[x]';
  assert.throws(
    () => admitEntry(f.text(), 'a/x', f.observations),
    /UNCLASSIFIED/,
  );
  f.policy.entries.push({ ...f.policy.entries[0] });
  assert.throws(() => parsePolicy(f.text()), /DUPLICATE_CLASSIFICATION/);
  f.policy.entries[1].path = 'a/[X]';
  assert.throws(() => parsePolicy(f.text()), /DUPLICATE_CLASSIFICATION/);
});

test('generated subtype and preserved identity required', () => {
  const f = fixture(classes[1], subclasses[0]);
  delete f.policy.entries[0].subclass;
  assert.throws(() => parsePolicy(f.text()));
  const h = fixture(classes[2]);
  delete h.policy.entries[0].identity.rawSha256;
  assert.throws(() => parsePolicy(h.text()));
});
test('live contract cannot substitute reproducibility', () => {
  const f = fixture(classes[1], subclasses[0]);
  f.policy.entries[0].validators = ['live-metadata-v1'];
  assert.throws(() => parsePolicy(f.text()));
});
test('ignored path without classification is UNCLASSIFIED', () => {
  const f = fixture();
  assert.throws(
    () => admitEntry(f.text(), 'ignored/example.md', f.observations),
    /UNCLASSIFIED/,
  );
});
test('JSON syntax and escaped duplicate keys fail before Zod', () => {
  for (const input of [
    '{',
    'null',
    '[]',
    '{"schemaVersion":1,"schemaVersion":1}',
    '{"a":1,"\\u0061":2}',
    '{"x":{"a":1,"a":2}}',
    '{"x":1,}',
    '\ufeff{}',
  ])
    assert.throws(() => parsePolicy(input));
  assert.deepEqual(parseJson('{"a":[true,null,"escaped\\\"value",1]}'), {
    a: [true, null, 'escaped"value', 1],
  });
});
test('canonical vectors preserve arrays Unicode and raw distinction', () => {
  assert.equal(
    canonicalJson({ z: 1, 10: 2, 2: 3, a: [2, 1] }),
    '{"10":2,"2":3,"a":[2,1],"z":1}',
  );
  assert.notEqual(unitSha256('é'), unitSha256('e\u0301'));
  assert.notEqual(rawSha256(Buffer.from('{ "a":1 }')), unitSha256({ a: 1 }));
  assert.equal(unitSha256({ b: 2, a: 1 }), unitSha256({ a: 1, b: 2 }));
  for (const n of [NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1])
    assert.throws(() => canonicalJson(n));
});
test('policy tool binding change cannot reuse approval', () => {
  const f = fixture();
  f.policy.toolBindings.tools[0].version = 'future';
  assert.throws(
    () => admitEntry(f.text(), 'fixtures/example.md', f.observations),
    /CLASSIFICATION_STALE/,
  );
});
test('missing duplicate and changed evidence units fail closed', () => {
  const f = fixture();
  assert.throws(() => admitEntry(f.text(), 'fixtures/example.md', []));
  assert.throws(() =>
    admitEntry(f.text(), 'fixtures/example.md', [
      ...f.observations,
      f.observations.at(-1),
    ]),
  );
  f.observations.at(-1).text = '{}';
  assert.throws(
    () => admitEntry(f.text(), 'fixtures/example.md', f.observations),
    /AUTHORITY_UNIT_DRIFT/,
  );
});
test('changed owner identity or lifecycle cannot use previous approval', () => {
  for (const change of [
    (e) => (e.owner.id = 'other'),
    (e) => (e.lifecycleBinding.completed = 1),
    (e) => (e.identity.rawSha256 = 'b'.repeat(64)),
  ]) {
    const f = fixture(classes[4]);
    change(f.policy.entries[0]);
    assert.throws(() =>
      admitEntry(f.text(), 'fixtures/example.md', f.observations),
    );
  }
});
test('bounded scratch subprocess import is inert and preserves Git tree', () => {
  const base = resolve(tmpdir());
  const dir = mkdtempSync(join(base, 'yuta-format-foundation-'));
  const snapshot = (root) =>
    readdirSync(root, { recursive: true })
      .sort()
      .map((p) => {
        const full = join(root, p);
        return [
          p,
          lstatSync(full).isFile()
            ? rawSha256(readFileSync(full))
            : 'directory',
        ];
      });
  try {
    const init = spawnSync('git', ['init', '--quiet', dir], {
      encoding: 'utf8',
      timeout: 10000,
    });
    assert.equal(init.status, 0);
    const before = snapshot(dir);
    const url = new URL('./check.mjs', import.meta.url).href;
    const child = spawnSync(
      process.execPath,
      [
        '--permission',
        '--allow-fs-read=*',
        '--input-type=module',
        '-e',
        `
      import assert from 'node:assert/strict';
      import { writeFileSync } from 'node:fs';
      import { spawnSync } from 'node:child_process';
      assert.throws(() => writeFileSync('forbidden', 'x'), { code: 'ERR_ACCESS_DENIED' });
      assert.throws(() => spawnSync(process.execPath, ['--version']), { code: 'ERR_ACCESS_DENIED' });
      await import(${JSON.stringify(url)});
    `,
      ],
      { cwd: dir, encoding: 'utf8', timeout: 10000 },
    );
    assert.equal(child.status, 0);
    assert.equal(child.stdout, '');
    assert.equal(child.stderr, '');
    assert.deepEqual(snapshot(dir), before);
  } finally {
    assert.equal(
      relative(base, dir).startsWith('yuta-format-foundation-'),
      true,
    );
    assert.equal(lstatSync(dir).isSymbolicLink(), false);
    rmSync(dir, { recursive: true });
  }
});
