import { createHash } from 'node:crypto';
import { z } from 'zod';
import { execFileSync, execFile } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute } from 'node:path';
import { lstatSync, realpathSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import * as prettier from 'prettier';
import { createRequire } from 'node:module';

// Imports are inert. Repository reads occur only on explicit inventory/run calls.
export const classes = Object.freeze([
  'MUTABLE_FORMATTED',
  'GENERATED_EXTERNAL_OR_DERIVED',
  'HISTORICAL_HASH_BOUND',
  'ARCHIVED_PRESERVED',
  'ACTIVE_CHANGE_OWNED',
  'NORMATIVE_REVIEW_REQUIRED',
]);
export const subclasses = Object.freeze([
  'REPRODUCIBLE_GENERATED_ARTIFACT',
  'TOOL_OWNED_NONDETERMINISTIC_LIVE_METADATA',
]);
const validators = [
  'mutable-prettier-v1',
  'generated-repro-v1',
  'live-metadata-v1',
  'historical-preserve-v1',
  'archive-preserve-v1',
  'active-owner-v1',
  'normative-v1',
];
const sha = z.string().regex(/^[a-f0-9]{64}$/);
const label = z
  .string()
  .min(1)
  .max(512)
  .refine((s) => s.trim() === s && !/[\x00-\x1f\x7f]/u.test(s));
export const exactPathSchema = z
  .string()
  .min(1)
  .max(4096)
  .refine(
    (s) =>
      // Square brackets are literal filename bytes, never a matching rule.
      !/[\\:*?{}<>|"\x00-\x1f\x7f]/u.test(s) &&
      s
        .split('/')
        .every(
          (p) =>
            p &&
            p !== '.' &&
            p !== '..' &&
            !/[. ]$/.test(p) &&
            !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p),
        ),
    'UNSAFE_PATH',
  );
const ref = z
  .object({ path: exactPathSchema, unit: label, sha256: sha })
  .strict();
const owner = z.object({ id: label, authority: ref }).strict();
const lifecycle = z
  .object({
    changeId: label,
    path: exactPathSchema,
    status: label,
    completed: z.number().int().nonnegative(),
    total: z.number().int().positive(),
    reviewRef: ref,
    normative: z.boolean(),
  })
  .strict()
  .refine((v) => v.completed <= v.total);

function obligations(entry) {
  switch (entry.class) {
    case 'MUTABLE_FORMATTED':
      return ['mutable-prettier-v1'];
    case 'GENERATED_EXTERNAL_OR_DERIVED':
      return [
        entry.subclass === subclasses[0]
          ? 'generated-repro-v1'
          : 'live-metadata-v1',
      ];
    case 'HISTORICAL_HASH_BOUND':
      return ['historical-preserve-v1'];
    case 'ARCHIVED_PRESERVED':
      return ['archive-preserve-v1'];
    case 'ACTIVE_CHANGE_OWNED':
      return [
        'active-owner-v1',
        'mutable-prettier-v1',
        ...(entry.lifecycleBinding?.normative ? ['normative-v1'] : []),
      ];
    case 'NORMATIVE_REVIEW_REQUIRED':
      return ['mutable-prettier-v1', 'normative-v1'];
    default:
      return [];
  }
}
const entrySchema = z
  .object({
    path: exactPathSchema,
    class: z.enum(classes),
    subclass: z.enum(subclasses).optional(),
    owner,
    rationale: label,
    admissionRef: ref,
    validators: z.array(z.enum(validators)).min(1),
    identity: z.object({ rawSha256: sha.optional() }).strict(),
    lifecycleBinding: lifecycle.optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    const issue = (message) => ctx.addIssue({ code: 'custom', message });
    if ((v.class === classes[1]) !== (v.subclass !== undefined))
      issue('GENERATED_SUBCLASS_INVALID');
    if (v.class !== classes[0] && !v.identity.rawSha256)
      issue('IDENTITY_REQUIRED');
    if (v.class === classes[4] && !v.lifecycleBinding)
      issue('OWNER_BINDING_REQUIRED');
    if (v.class !== classes[4] && v.lifecycleBinding)
      issue('OWNER_BINDING_INVALID');
    const expected = obligations(v).sort();
    if (JSON.stringify([...v.validators].sort()) !== JSON.stringify(expected))
      issue('VALIDATION_COVERAGE_GAP');
  });
const tool = z
  .object({
    package: label,
    version: label,
    sourceSha256: sha,
    adapterVersion: z.literal(1),
  })
  .strict();
export const legacyPolicySchema = z
  .object({
    schemaVersion: z.literal(1),
    policyRevision: z.number().int().positive().safe(),
    validatorContractVersion: z.literal(1),
    toolBindings: z
      .object({
        tools: z.array(tool).min(1),
        formatterSha256: sha,
        configSha256: sha,
        ignoreSha256: sha,
      })
      .strict(),
    entries: z.array(entrySchema),
    preservationSha256: sha,
    migrationSha256: sha,
    approvalRef: ref,
  })
  .strict()
  .superRefine((v, ctx) => {
    const paths = new Set();
    for (const e of v.entries) {
      const key = e.path.toLowerCase();
      if (paths.has(key))
        ctx.addIssue({ code: 'custom', message: 'DUPLICATE_CLASSIFICATION' });
      paths.add(key);
    }
    const tools = v.toolBindings.tools.map((t) => t.package);
    if (new Set(tools).size !== tools.length)
      ctx.addIssue({ code: 'custom', message: 'POLICY_INVALID' });
  });

export class PolicyError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

const domainAdmissionSchema = z
  .object({
    path: exactPathSchema,
    owner,
    typeEvidence: z
      .object({
        kind: z.enum(['UNSUPPORTED_TEXT', 'BINARY']),
        reason: label,
        evidenceRef: ref,
      })
      .strict(),
    expectedSha256: sha,
    approvalRef: ref,
  })
  .strict();
const ignoreMembershipSchema = z
  .object({
    sourcePath: z.literal('.prettierignore'),
    sourceSha256: sha,
    expansionAlgorithm: z.literal('prettier-tracked-file-info-v1'),
    expansionVersion: z.literal(1),
    formatterSha256: sha,
    configSha256: sha,
    paths: z.array(exactPathSchema),
    membershipSha256: sha,
    approvalRef: ref,
  })
  .strict();
export const policySchema = legacyPolicySchema
  .innerType()
  .extend({
    schemaVersion: z.literal(2),
    validatorContractVersion: z.literal(2),
    domainAdmissions: z.array(domainAdmissionSchema),
    ignoreMembership: ignoreMembershipSchema,
  })
  .strict()
  .superRefine((v, ctx) => {
    const unique = (paths, code) => {
      if (new Set(paths.map((p) => p.toLowerCase())).size !== paths.length)
        ctx.addIssue({ code: 'custom', message: code });
    };
    unique(
      [...v.entries, ...v.domainAdmissions].map((e) => e.path),
      'DUPLICATE_CLASSIFICATION',
    );
    unique(v.ignoreMembership.paths, 'DUPLICATE_CLASSIFICATION');
    unique(
      v.toolBindings.tools.map((t) => t.package),
      'POLICY_INVALID',
    );
  });

// Lexical duplicate-key protection before JSON.parse loses that information.
// Structural and semantic policy validation remains exclusively in Zod.
export function parseJson(input) {
  const text = z.string().max(8_000_000).parse(input);
  let i = 0;
  const fail = () => {
    throw new PolicyError('POLICY_INVALID');
  };
  const space = () => {
    while (/[\t\r\n ]/.test(text[i] ?? '') && i < text.length) i++;
  };
  function string() {
    const start = i++;
    while (i < text.length) {
      if (text[i] === '\\') {
        i += 2;
        continue;
      }
      if (text[i++] === '"') return JSON.parse(text.slice(start, i));
    }
    fail();
  }
  function value(depth) {
    if (depth > 64) fail();
    space();
    if (text[i] === '"') {
      string();
      return;
    }
    if (text[i] === '{' || text[i] === '[') {
      const object = text[i++] === '{',
        end = object ? '}' : ']';
      const keys = new Set();
      space();
      if (text[i] === end) {
        i++;
        return;
      }
      while (i < text.length) {
        space();
        if (object) {
          if (text[i] !== '"') fail();
          const key = string();
          if (keys.has(key)) throw new PolicyError('DUPLICATE_JSON_KEY');
          keys.add(key);
          space();
          if (text[i++] !== ':') fail();
        }
        value(depth + 1);
        space();
        if (text[i] === end) {
          i++;
          return;
        }
        if (text[i++] !== ',') fail();
      }
      fail();
    }
    const token =
      /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(
        text.slice(i),
      );
    if (!token) fail();
    i += token[0].length;
  }
  try {
    value(0);
    space();
    if (i !== text.length) fail();
    return JSON.parse(text);
  } catch (e) {
    if (e instanceof PolicyError) throw e;
    fail();
  }
}

const jsonPrimitive = z.union([
  z.null(),
  z.boolean(),
  z.string(),
  z.number().int().safe(),
]);
export function canonicalJson(input) {
  // Identity traverses original own JSON data, never a schema-transformed copy.
  const ancestors = new Set();
  const encode = (x, depth = 0) => {
    if (depth > 64) throw new PolicyError('POLICY_INVALID');
    if (x === null || typeof x !== 'object')
      return JSON.stringify(jsonPrimitive.parse(x));
    if (ancestors.has(x)) throw new PolicyError('POLICY_INVALID');
    ancestors.add(x);
    const ownValue = (key) => {
      const descriptor = Object.getOwnPropertyDescriptor(x, key);
      if (!descriptor || !Object.hasOwn(descriptor, 'value'))
        throw new PolicyError('POLICY_INVALID');
      return encode(descriptor.value, depth + 1);
    };
    const result = Array.isArray(x)
      ? '[' +
        Array.from({ length: x.length }, (_, i) => ownValue(String(i))).join(
          ',',
        ) +
        ']'
      : '{' +
        Object.keys(x)
          .sort()
          .map((k) => JSON.stringify(k) + ':' + ownValue(k))
          .join(',') +
        '}';
    ancestors.delete(x);
    return result;
  };
  return encode(input);
}
export function rawSha256(bytes) {
  return createHash('sha256')
    .update(z.instanceof(Uint8Array).parse(bytes))
    .digest('hex');
}
export function unitSha256(value) {
  return rawSha256(Buffer.from(canonicalJson(value), 'utf8'));
}

export function parsePolicy(text) {
  const input = parseJson(text);
  if (input?.schemaVersion === 1 && input?.validatorContractVersion === 1) {
    if (!legacyPolicySchema.safeParse(input).success)
      throw new PolicyError('POLICY_INVALID');
    throw new PolicyError('LEGACY_POLICY_VERSION_REQUIRES_MIGRATION');
  }
  if (
    (input?.schemaVersion === 1 && input?.validatorContractVersion === 2) ||
    (input?.schemaVersion === 2 && input?.validatorContractVersion === 1)
  )
    throw new PolicyError('POLICY_VERSION_PAIR_MISMATCH');
  if (input?.schemaVersion !== 2 || input?.validatorContractVersion !== 2)
    throw new PolicyError('POLICY_VERSION_MISMATCH');
  const result = policySchema.safeParse(input);
  if (!result.success) {
    const messages = result.error.issues.map((e) => e.message);
    throw new PolicyError(
      messages.includes('DUPLICATE_CLASSIFICATION')
        ? 'DUPLICATE_CLASSIFICATION'
        : 'POLICY_INVALID',
    );
  }
  return result.data;
}

// The caller supplies independently observed evidence, never metadata claims.
// Authentic human approval and safe filesystem unit extraction remain workflow trust boundaries.
const observedSchema = z
  .object({ path: exactPathSchema, unit: label, text: z.string() })
  .strict();
export function verifyUnit(reference, observations) {
  const r = ref.parse(reference),
    rows = z.array(observedSchema).parse(observations);
  const matches = rows.filter((x) => x.path === r.path && x.unit === r.unit);
  if (matches.length !== 1) throw new PolicyError('AUTHORITY_UNIT_CARDINALITY');
  const value = parseJson(matches[0].text);
  if (unitSha256(value) !== r.sha256)
    throw new PolicyError('AUTHORITY_UNIT_DRIFT');
  return value;
}

export function admitEntry(policyText, path, observations) {
  const representation = parseJson(policyText);
  const policy = parsePolicy(policyText),
    exact = exactPathSchema.parse(path);
  const entry = policy.entries.find((e) => e.path === exact);
  if (!entry) throw new PolicyError('UNCLASSIFIED');
  const approval = z
    .object({ decision: z.literal('APPROVED'), policySha256: sha })
    .strict()
    .parse(verifyUnit(policy.approvalRef, observations));
  // Exclude only the external reference, avoiding circular approval hashes.
  const { approvalRef, ...body } = representation;
  if (approval.policySha256 !== unitSha256(body))
    throw new PolicyError('CLASSIFICATION_STALE');
  const authority = z
    .object({ ownerId: label, status: z.literal('CURRENT') })
    .strict()
    .parse(verifyUnit(entry.owner.authority, observations));
  if (authority.ownerId !== entry.owner.id)
    throw new PolicyError('OWNER_BINDING_STALE');
  const admission = z
    .object({ decision: z.literal('APPROVED'), entrySha256: sha })
    .strict()
    .parse(verifyUnit(entry.admissionRef, observations));
  const rawEntry = representation.entries.find((e) => e.path === exact);
  const { admissionRef, ...entryBody } = rawEntry;
  if (admission.entrySha256 !== unitSha256(entryBody))
    throw new PolicyError('CLASSIFICATION_STALE');
  if (entry.lifecycleBinding) {
    const { reviewRef, ...state } = rawEntry.lifecycleBinding;
    const review = z
      .object({ decision: z.literal('APPROVED'), stateSha256: sha })
      .strict()
      .parse(verifyUnit(reviewRef, observations));
    if (review.stateSha256 !== unitSha256(state))
      throw new PolicyError('OWNER_BINDING_STALE');
  }
  return {
    entry,
    requiredValidators: obligations(entry),
    policyRevision: policy.policyRevision,
  };
}

// Phase 2 owns routing, not alternate domain semantics. No injectable handlers.

function approvedPolicy(policyText, observations) {
  const raw = parseJson(policyText),
    model = parsePolicy(policyText);
  const unit = z
    .object({ decision: z.literal('APPROVED'), policySha256: sha })
    .strict()
    .parse(verifyUnit(model.approvalRef, observations));
  const { approvalRef, ...body } = raw;
  if (unit.policySha256 !== unitSha256(body))
    throw new PolicyError('CLASSIFICATION_STALE');
  return { raw, model };
}
export function membershipIdentity(value) {
  const raw = value;
  const { approvalRef, membershipSha256, ...payload } = raw;
  const parsed = ignoreMembershipSchema.parse(raw);
  if (
    new Set(parsed.paths.map((p) => p.toLowerCase())).size !==
    parsed.paths.length
  )
    throw new PolicyError('DUPLICATE_CLASSIFICATION');
  payload.paths = [...raw.paths].sort();
  return unitSha256(payload);
}
export function resolveDomain(policyText, file, observations, expected = []) {
  const { raw, model } = approvedPolicy(policyText, observations);
  if (file.failureCode) throw new PolicyError(file.failureCode);
  const admission = raw.domainAdmissions.find((a) => a.path === file.path);
  if (
    file.parser ||
    model.entries.some((e) => e.path === file.path) ||
    expected.includes(file.path)
  ) {
    if (admission) throw new PolicyError('DOMAIN_ADMISSION_CONFLICT');
    return 'IN_FORMATTING_UNIVERSE';
  }
  if (!admission) throw new PolicyError('UNCLASSIFIED');
  const authority = z
    .object({ ownerId: label, status: z.literal('CURRENT') })
    .strict()
    .parse(verifyUnit(admission.owner.authority, observations));
  if (authority.ownerId !== admission.owner.id)
    throw new PolicyError('OWNER_BINDING_STALE');
  if (file.sha256 !== admission.expectedSha256)
    throw new PolicyError('CLASSIFICATION_STALE');
  const type = z
    .object({
      schemaVersion: z.literal(2),
      validatorContractVersion: z.literal(2),
      path: exactPathSchema,
      expectedSha256: sha,
      kind: z.enum(['BINARY', 'UNSUPPORTED_TEXT']),
      reason: label,
      formatterSha256: sha,
      configSha256: sha,
    })
    .strict()
    .parse(verifyUnit(admission.typeEvidence.evidenceRef, observations));
  if (
    type.path !== file.path ||
    type.expectedSha256 !== file.sha256 ||
    type.kind !== admission.typeEvidence.kind ||
    type.reason !== admission.typeEvidence.reason ||
    type.formatterSha256 !== model.toolBindings.formatterSha256 ||
    type.configSha256 !== model.toolBindings.configSha256
  )
    throw new PolicyError('CLASSIFICATION_STALE');
  const approval = z
    .object({
      decision: z.literal('APPROVED'),
      schemaVersion: z.literal(2),
      validatorContractVersion: z.literal(2),
      policyRevision: z.number().int().positive(),
      domainAdmissionSha256: sha,
    })
    .strict()
    .parse(verifyUnit(admission.approvalRef, observations));
  const { approvalRef, ...body } = admission;
  if (
    approval.policyRevision !== model.policyRevision ||
    approval.domainAdmissionSha256 !== unitSha256(body)
  )
    throw new PolicyError('CLASSIFICATION_STALE');
  return 'OUTSIDE_FORMATTING_UNIVERSE_BY_APPROVED_ADMISSION';
}
export function verifyIgnoreMembership(
  policyText,
  actualPaths,
  sourceSha256,
  observations,
) {
  const { raw, model } = approvedPolicy(policyText, observations),
    binding = raw.ignoreMembership;
  if (
    binding.sourceSha256 !== sourceSha256 ||
    binding.sourceSha256 !== model.toolBindings.ignoreSha256 ||
    binding.formatterSha256 !== model.toolBindings.formatterSha256 ||
    binding.configSha256 !== model.toolBindings.configSha256
  )
    throw new PolicyError('IGNORE_BINDING_STALE');
  if (membershipIdentity(binding) !== binding.membershipSha256)
    throw new PolicyError('IGNORE_SCOPE_DRIFT');
  const paths = z.array(exactPathSchema).parse(actualPaths);
  if (
    new Set(paths.map((p) => p.toLowerCase())).size !== paths.length ||
    canonicalJson([...paths].sort()) !==
      canonicalJson([...binding.paths].sort())
  )
    throw new PolicyError('IGNORE_SCOPE_DRIFT');
  const approval = z
    .object({
      decision: z.literal('APPROVED'),
      schemaVersion: z.literal(2),
      validatorContractVersion: z.literal(2),
      policyRevision: z.number().int().positive(),
      ignoreMembershipSha256: sha,
    })
    .strict()
    .parse(verifyUnit(binding.approvalRef, observations));
  const { approvalRef, ...body } = binding;
  if (
    approval.policyRevision !== model.policyRevision ||
    approval.ignoreMembershipSha256 !== unitSha256(body)
  )
    throw new PolicyError('CLASSIFICATION_STALE');
  return true;
}

const vfixTasks =
  'openspec/changes/repository-format-policy-and-baseline-remediation/tasks.md';
const vfixPrefix =
  'apps/backoffice/test/fixtures/personnel-contract-evaluation/';
export const vfixAuthority = Object.freeze({
  tasks: vfixTasks,
  historicalApproval:
    'fd4dc3456991880492e3b039877ee1ec67d157f6ebd1d67fad0a55e4742aef20',
  admission: '7804707fe8be50e94e82eed8a3b79768e8cdae2e45d704af8bed5e4fc05d8a00',
  closure: 'a075ef0e47cfa288a93316c99d28bb1b74bab6362e081ded4b18e17a62f40560',
  generation:
    '134bfd72045dc037b9ceb064679b6ec6f8150b52447077bc1d0fbeff3f91f7c8',
  output: '52e6383b45c89c09b84d52c11c51c57cec1f0856cea2ee637cd2d1366693326a',
  obligation:
    'bee17f175d24068e77b17f30cbf5afc3dd0dc4a14abffa672e8fc25fd867cf0e',
  approval: '7826714523d63ccc2edeaf718b9e4542c9c7644dded42dbfa3474758f8cb08be',
  image:
    'sha256:d95dddbb31a8f313f32c64b4885d40e3518400b4be41882e688ea366f6ab303b',
});
function requireVfix(condition, code) {
  if (!condition) throw new PolicyError(code);
}
function markedJson(text, marker) {
  const start = '<!-- ' + marker + '_BEGIN -->';
  const end = '<!-- ' + marker + '_END -->';
  const parts = text.split(start);
  requireVfix(
    parts.length === 2 && text.split(end).length === 2,
    'HISTORICAL_REFERENCE_DRIFT',
  );
  const section = parts[1].split(end)[0];
  const blocks = [...section.matchAll(/`{3}json\r?\n([\s\S]*?)\r?\n`{3}/g)];
  requireVfix(blocks.length === 1, 'HISTORICAL_REFERENCE_DRIFT');
  return parseJson(blocks[0][1]);
}
export function loadVfixAuthority(root) {
  const text = readExactFile(root, vfixTasks).bytes.toString('utf8');
  const approval = markedJson(
    text,
    'CURRENT_HISTORICAL_PRESERVATION_APPROVAL_CANDIDATE',
  );
  requireVfix(
    unitSha256(approval) === vfixAuthority.historicalApproval,
    'HISTORICAL_ADMISSION_INVALID',
  );
  // Exact external approval pins the pending candidate bytes, not a mutable status label.
  const blocks = [
    ...text.matchAll(/`{3}json\r?\n([\s\S]*?)\r?\n`{3}/g),
  ].flatMap((m) => {
    try {
      return [parseJson(m[1])];
    } catch {
      return [];
    }
  });
  const originals = blocks.filter((x) => x?.members && x?.admissionApprovalRef);
  requireVfix(originals.length === 1, 'HISTORICAL_ADMISSION_INVALID');
  const patches = blocks.filter((x) => x?.ownerAuthority && !x?.members);
  requireVfix(patches.length === 1, 'HISTORICAL_ADMISSION_INVALID');
  const admission = { ...originals[0], ...patches[0] };
  requireVfix(
    unitSha256(admission) === vfixAuthority.admission,
    'HISTORICAL_ADMISSION_INVALID',
  );
  const envelope = markedJson(
    text,
    'CURRENT_VFIX_GENERATION_OBLIGATION_ENVELOPE',
  );
  const generationApproval = markedJson(
    text,
    'GENERATION_SCOPED_OBLIGATION_APPROVAL',
  );
  verifyVfixObligation(envelope, generationApproval);
  const begin = text.indexOf(
    '| Path ',
    text.indexOf('COLD_OUTPUT_SET_SHA256:'),
  );
  requireVfix(begin >= 0, 'CURRENT_GENERATION_IDENTITY_MISSING');
  const outputs = [];
  for (const line of text.slice(begin).split(/\r?\n/)) {
    if (!line.startsWith('|')) break;
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((x) => x.trim().replaceAll('`', ''));
    if (cells[0].startsWith(vfixPrefix))
      outputs.push({
        path: cells[0],
        type: cells[1],
        sha256: cells[3],
        bytes: Number(cells[5]),
      });
  }
  requireVfix(
    outputs.length === 122 && new Set(outputs.map((x) => x.path)).size === 122,
    'CURRENT_OUTPUT_MISSING',
  );
  outputs.sort((a, b) => order(a.path, b.path));
  requireVfix(
    rawSha256(Buffer.from(JSON.stringify(outputs))) === vfixAuthority.output,
    'CURRENT_OUTPUT_DRIFT',
  );
  return { admission, approval, envelope, generationApproval, outputs };
}
export function verifyVfixObligation(envelope, approval) {
  requireVfix(envelope != null, 'GENERATION_OBLIGATION_MISSING');
  requireVfix(
    canonicalJson(Object.keys(envelope).sort()) ===
      canonicalJson(['approvalRef', 'body', 'obligationSha256']),
    'GENERATION_RESULT_MALFORMED',
  );
  requireVfix(
    unitSha256(envelope.body) === vfixAuthority.obligation &&
      envelope.obligationSha256 === vfixAuthority.obligation,
    'GENERATION_IDENTITY_MISMATCH',
  );
  requireVfix(
    unitSha256(approval) === vfixAuthority.approval &&
      approval.obligationSha256 === envelope.obligationSha256,
    'GENERATION_OBLIGATION_MISSING',
  );
  requireVfix(
    canonicalJson(envelope.approvalRef) ===
      canonicalJson({
        path: vfixTasks,
        locator: 'GENERATION_SCOPED_OBLIGATION_APPROVAL',
        unitSha256: vfixAuthority.approval,
      }),
    'GENERATION_OBLIGATION_MISSING',
  );
  return true;
}
export function validateVfixHistorical(
  root,
  authority = loadVfixAuthority(root),
) {
  const { admission, approval } = authority;
  requireVfix(
    unitSha256(admission) === vfixAuthority.admission &&
      unitSha256(approval) === vfixAuthority.historicalApproval,
    'HISTORICAL_ADMISSION_INVALID',
  );
  for (const target of approval.authorityLocators)
    requireVfix(
      readExactFile(root, target.path).sha256 === target.rawSha256,
      'HISTORICAL_REFERENCE_DRIFT',
    );
  requireVfix(
    admission.members.length === 122 &&
      admission.referenceBindings.length === 120,
    'HISTORICAL_ADMISSION_INVALID',
  );
  const results = [],
    map = {};
  const observedPaths = ['v1', 'v2']
    .flatMap((version) =>
      readdirSync(join(root, vfixPrefix, version)).map(
        (name) => vfixPrefix + version + '/' + name,
      ),
    )
    .sort(order);
  requireVfix(
    canonicalJson(observedPaths) ===
      canonicalJson(admission.members.map((x) => x.path).sort(order)),
    'HISTORICAL_ADMISSION_INVALID',
  );
  for (const member of admission.members) {
    let file;
    try {
      file = readExactFile(root, member.path);
    } catch {
      throw new PolicyError('HISTORICAL_ARTIFACT_MISSING');
    }
    requireVfix(
      file.sha256 === member.rawSha256 && file.bytes.length === member.bytes,
      'HISTORICAL_HASH_DRIFT',
    );
    requireVfix(
      member.type === (member.path.endsWith('.pdf') ? 'PDF' : 'MANIFEST'),
      'HISTORICAL_ADMISSION_INVALID',
    );
    map[member.path] = file.sha256;
    results.push({
      path: member.path,
      validator: 'historical-preserve-v1',
      version: 1,
      sha256: file.sha256,
      result: 'PASS',
      failureCode: null,
    });
  }
  requireVfix(
    unitSha256(map) === vfixAuthority.closure,
    'HISTORICAL_HASH_DRIFT',
  );
  for (const reference of admission.referenceBindings) {
    const source = parseJson(
      readExactFile(root, reference.sourcePath).bytes.toString('utf8'),
    );
    const unit = reference.sourceUnitLocator
      .split('/')
      .slice(1)
      .reduce((value, key) => value?.[key], source);
    requireVfix(
      unitSha256(unit) === reference.sourceUnitDigest &&
        readExactFile(root, reference.targetPath).sha256 ===
          reference.targetDigest,
      'HISTORICAL_REFERENCE_DRIFT',
    );
  }
  return {
    results,
    evidence: {
      closureSha256: vfixAuthority.closure,
      members: 122,
      references: 120,
      d5: 'PASS',
      meaning: 'PRESERVATION_ONLY',
    },
  };
}
const generationResultSchema = z
  .object({
    obligationSha256: sha,
    validator: z.literal('vfix-current-generation-v1'),
    version: z.literal(1),
    result: z.enum(['PASS', 'FAIL']),
    failureCode: z
      .string()
      .regex(/^[A-Z_]+$/)
      .nullable(),
    observedGenerationIdentitySha256: sha.nullable(),
    observedOutputSetSha256: sha.nullable(),
    reproductionEvidenceSha256: sha.nullable(),
    reproductionEvidenceStatus: z.enum([
      'COMPLETE',
      'PARTIAL',
      'MISSING',
      'SKIPPED',
    ]),
  })
  .strict();
const vfixOutputSchema = z
  .object({
    path: exactPathSchema,
    type: z.enum(['PDF', 'MANIFEST']),
    sha256: sha,
    bytes: z.number().int().nonnegative().safe(),
  })
  .strict();
export function compareVfixOutputs(expected, actual) {
  requireVfix(
    z.array(vfixOutputSchema).safeParse(actual).success,
    'CURRENT_OUTPUT_DRIFT',
  );
  const expectedPaths = expected.map((x) => x.path).sort(order),
    paths = actual.map((x) => x.path).sort(order);
  requireVfix(new Set(paths).size === paths.length, 'CURRENT_OUTPUT_EXTRA');
  requireVfix(
    !paths.some((p) => !expectedPaths.includes(p)),
    'CURRENT_OUTPUT_EXTRA',
  );
  requireVfix(
    !expectedPaths.some((p) => !paths.includes(p)),
    'CURRENT_OUTPUT_MISSING',
  );
  requireVfix(
    canonicalJson([...actual].sort((a, b) => order(a.path, b.path))) ===
      canonicalJson(expected),
    'CURRENT_OUTPUT_DRIFT',
  );
  return true;
}
export function classifyVfixExit(
  exit,
  terminal,
  expected,
  historical,
  generationIdentity,
) {
  requireVfix(
    generationIdentity === vfixAuthority.generation,
    'GENERATION_IDENTITY_MISMATCH',
  );
  const terminalSchema = z
    .object({
      expectedCount: z.literal(122),
      generatedCount: z.literal(122),
      missing: z.array(z.string()).length(0),
      extra: z.array(z.string()).length(0),
      exactMatchCount: z.literal(91),
      mismatchCount: z.literal(31),
      outputSetSha256: z.literal(vfixAuthority.output),
      status: z.literal('FAIL'),
      rows: z
        .array(
          z
            .object({
              path: exactPathSchema,
              type: z.enum(['PDF', 'MANIFEST']),
              expectedSha256: sha,
              generatedSha256: sha,
              expectedSize: z.number().int().nonnegative(),
              generatedSize: z.number().int().nonnegative(),
              rawByteMatch: z.boolean(),
              taxonomy: z.literal('UNKNOWN').nullable(),
            })
            .strict(),
        )
        .length(122),
    })
    .strict();
  requireVfix(
    exit === 1 && terminalSchema.safeParse(terminal).success,
    'CURRENT_REPRODUCTION_NOT_PROVEN',
  );
  compareVfixOutputs(
    expected,
    terminal.rows.map((x) => ({
      path: x.path,
      type: x.type,
      sha256: x.generatedSha256,
      bytes: x.generatedSize,
    })),
  );
  let matches = 0;
  for (const row of terminal.rows) {
    const old = historical.find((x) => x.path === row.path);
    requireVfix(
      old &&
        row.expectedSha256 === old.rawSha256 &&
        row.expectedSize === old.bytes,
      'HISTORICAL_REFERENCE_DRIFT',
    );
    const same = row.expectedSha256 === row.generatedSha256;
    requireVfix(
      row.rawByteMatch === same && row.taxonomy === (same ? null : 'UNKNOWN'),
      'CURRENT_REPRODUCTION_NOT_PROVEN',
    );
    if (same) matches++;
  }
  requireVfix(matches === 91, 'CURRENT_REPRODUCTION_NOT_PROVEN');
  return 'LEGACY_HISTORICAL_COMPARISON_FAIL';
}
// Artifact aggregation remains separately callable. This function cannot manufacture
// a generation PASS from artifact rows or a missing/duplicate evidence record.
export function aggregateVfixGeneration(
  required,
  envelope,
  approval,
  results,
  evidence,
) {
  const failures = [];
  if (!required)
    return {
      aggregate: results.length ? 'FAIL' : 'PASS',
      failureCodes: results.length ? ['GENERATION_RESULT_EXTRA'] : [],
      generations: results,
    };
  try {
    verifyVfixObligation(envelope, approval);
  } catch (e) {
    failures.push(safeCode(e));
  }
  if (results.length === 0) failures.push('GENERATION_RESULT_MISSING');
  if (results.length > 1)
    failures.push(
      new Set(results.map((x) => x.obligationSha256)).size < results.length
        ? 'GENERATION_RESULT_DUPLICATE'
        : 'GENERATION_RESULT_EXTRA',
    );
  for (const result of results) {
    if (!generationResultSchema.safeParse(result).success) {
      failures.push('GENERATION_RESULT_MALFORMED');
      continue;
    }
    if (result.obligationSha256 !== vfixAuthority.obligation)
      failures.push('GENERATION_RESULT_EXTRA');
    if (result.observedGenerationIdentitySha256 !== vfixAuthority.generation)
      failures.push('GENERATION_IDENTITY_MISMATCH');
    if (result.observedOutputSetSha256 !== vfixAuthority.output)
      failures.push('GENERATION_OUTPUT_SET_MISMATCH');
    if (result.reproductionEvidenceStatus !== 'COMPLETE')
      failures.push(
        result.reproductionEvidenceStatus === 'SKIPPED'
          ? 'GENERATION_VALIDATION_SKIPPED'
          : 'GENERATION_PARTIAL_RESULT',
      );
    const proof = evidence?.find(
      (x) => unitSha256(x) === result.reproductionEvidenceSha256,
    );
    if (
      !proof ||
      supervisedVfixEvidence.get(proof) !== unitSha256(proof) ||
      proof.result !== 'PASS' ||
      proof.obligationSha256 !== vfixAuthority.obligation ||
      proof.runs?.length !== 2 ||
      proof.runs.some(
        (x) =>
          x.generationIdentity !== vfixAuthority.generation ||
          x.outputSetSha256 !== vfixAuthority.output ||
          x.executionValidity !== 'PASS' ||
          x.legacy !== 'LEGACY_HISTORICAL_COMPARISON_FAIL' ||
          x.processExit !== 1 ||
          x.outputCount !== 122,
      )
    )
      failures.push('GENERATION_REPRODUCTION_NOT_PROVEN');
    if (result.result !== 'PASS' || result.failureCode !== null)
      failures.push(result.failureCode ?? 'GENERATION_RESULT_MALFORMED');
  }
  return {
    aggregate: failures.length ? 'FAIL' : 'PASS',
    failureCodes: [...new Set(failures)].sort(order),
    generations: results,
  };
}

const vfixGeneration = {
  artifacts: [
    {
      filename: 'charset_normalizer-3.4.4-py3-none-any.whl',
      sha256:
        '7a32c560861a02ff789ad905a2fe94e3f840803362c84fecf1851cb4cf3dc37f',
      version: '3.4.4',
    },
    {
      filename:
        'pillow-12.3.0-cp312-cp312-manylinux_2_27_x86_64.manylinux_2_28_x86_64.whl',
      sha256:
        '78cb2c6865a35ab8ff8b75fd122f6033b92a62c82801110e48ddd6c936a45d91',
      version: '12.3.0',
    },
    {
      filename: 'reportlab-4.4.9-py3-none-any.whl',
      sha256:
        '68e2d103ae8041a37714e8896ec9b79a1c1e911d68c3bd2ea17546568cf17bfd',
      version: '4.4.9',
    },
  ],
  baseImageDigest:
    'sha256:9c47360a2a0355e2da18516d0b1c2126ec22c195d2185e97347c9d98398c5bef',
  buildContextSha256:
    'fad7237bbe9453d9f1a853159ab58917bf942657417df85e4ab1396f35a9ca39',
  builtImage: {
    configDigest:
      'sha256:2b835645f823a9ecc0049704ca7ec2b0a644a78a53944c6da01a5f6df0a9fdd5',
    indexDigest:
      'sha256:d95dddbb31a8f313f32c64b4885d40e3518400b4be41882e688ea366f6ab303b',
    platformManifestDigest:
      'sha256:285bbd26bad6ff54b56ff0908a7c733c5bc9e541ac996ac91b46f22d226ccb87',
  },
  corpusInputClosure:
    '35e3ff1fd1cef6d6f336b155d5b6bec7bee679ea6e12666e838f6cc78c46b9d5',
  currentOutputSet: {
    copiedHistoricalInputCount: 58,
    count: 122,
    derivedManifestCount: 2,
    freshRenderCount: 62,
    serialization:
      'path-sorted rows; insertion keys path,type,sha256,bytes; compact UTF-8 JSON; no BOM or final newline',
    sha256: '52e6383b45c89c09b84d52c11c51c57cec1f0856cea2ee637cd2d1366693326a',
  },
  environmentControls: {
    cwd: '/work',
    digitalFonts: ['Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique'],
    encoding: 'UTF-8',
    fontSizes: [28, 34, 20],
    jpegOptimize: false,
    jpegProgressive: false,
    jpegQuality: [48, 88],
    locale: 'C',
    output: '/work/output',
    pageCompression: 1,
    pdfInvariant: 1,
    pythonHashSeed: '0',
    source: '/input',
    temp: '/work/tmp',
    timezone: 'UTC',
  },
  font: {
    licensePath: 'reportlab/fonts/bitstream-vera-license.txt',
    licenseSha256:
      '3361d054759a2fc686a2c058be82deaf9c2e6fe549be9004d7935a6c1736315d',
    path: 'reportlab/fonts/Vera.ttf',
    role: 'scan-roman',
    sha256: 'c4c45690b345435b2cba52ecabe275f05e49b389b39fe68ad03afbb551288d3d',
  },
  generatorSourceClosure:
    '088e372d9ac8f4dc4031e026095af0684461ff1d06eb1e582b3e111af758aaed',
  nativeRuntimeClosureSha256:
    '33f50ae481b89ce204cc804170b760c9920af0aa2ad27c1a90d63732a82f07ad',
  platform: 'linux/amd64',
  python: {
    executableSha256:
      '4dbf3143240288fb2170257ffaa7bd030cdda5d2703d1f5f30b627042267e2e3',
    libpythonSha256:
      'a3176871637b456567c80b853fcbb28f102308079f7c68e22b3c6f038d257627',
    version: '3.12.14',
  },
  rendererSourceClosure:
    'ea948546e092270f25f093caf311a11bef9599d9e80078dc4f966164bbc35cdd',
  repertoireSha256:
    '94d6992b2a1965bab3800b7800993d832364b25cff1ccf3dbbb09021b3018d51',
  reportlabInspectionClosureSha256:
    '41a07ed33619ab99c97d5bd5356b98774228114a79db38e966b04a7eee2047eb',
  supplyClosureSha256:
    '792ec71e06951cc94fa317c9753530b778c727d75df457f184215a8b0bb6e9d3',
};
const vfixTooling = Object.freeze({
  Dockerfile:
    '109e856d622952d68a10ede18709de108c9a658542769a357b23268d56333d7e',
  'environment.json':
    'b509b938ca0ed7674a422981b14f7948944d8484fcd62649de3c6f2c61762f46',
  'requirements.lock':
    '5a3da8a1505168c2bf07db22182db2a573fbedc1ac01249f6c268a4287322887',
  'run.py': 'b63f56fd936207ffc1b0079ccf6a24aeb804ab050efd6b0bea0205181f9ff162',
});
const supervisedVfixEvidence = new WeakMap();
export function verifyVfixGenerationIdentity(identity) {
  requireVfix(
    unitSha256(identity) === vfixAuthority.generation,
    'CURRENT_GENERATION_IDENTITY_MISSING',
  );
  return true;
}
export function vfixGenerationIdentity() {
  return structuredClone(vfixGeneration);
}
function verifyVfixInputs(root, authority) {
  verifyVfixGenerationIdentity(vfixGeneration);
  const tooling = Object.entries(vfixTooling)
    .map(([name, expected]) => {
      const path = 'scripts/format-policy/vfix-renderer/' + name,
        file = readExactFile(root, path);
      requireVfix(file.sha256 === expected, 'CURRENT_SOURCE_DRIFT');
      return {
        path,
        type: 'file',
        bytes: file.bytes.length,
        sha256: file.sha256,
      };
    })
    .sort((a, b) => order(a.path, b.path));
  requireVfix(
    unitSha256(tooling) === vfixGeneration.rendererSourceClosure,
    'CURRENT_SOURCE_DRIFT',
  );
  const source =
    'apps/backoffice/scripts/generate-personnel-contract-evaluation-corpus.py';
  requireVfix(
    unitSha256({ [source]: readExactFile(root, source).sha256 }) ===
      vfixGeneration.generatorSourceClosure,
    'CURRENT_SOURCE_DRIFT',
  );
  const inputs = authority.admission.members.filter(
    (x) =>
      x.path.includes('/v1/') &&
      !x.path.endsWith('wg2-adversarial-05.pdf') &&
      !x.path.endsWith('wg2-adversarial-09.pdf'),
  );
  requireVfix(
    inputs.length === 59 &&
      unitSha256(
        Object.fromEntries(
          inputs.map((x) => [x.path, readExactFile(root, x.path).sha256]),
        ),
      ) === vfixGeneration.corpusInputClosure,
    'CURRENT_INPUT_DRIFT',
  );
  return unitSha256({
    tooling,
    source: readExactFile(root, source).sha256,
    historical: validateVfixHistorical(root, authority).results,
  });
}
async function vfixDocker(args, timeoutMs = 30000) {
  return new Promise((accept) => {
    execFile(
      'docker',
      args,
      {
        timeout: timeoutMs,
        maxBuffer: 8 * 1024 * 1024,
        encoding: 'buffer',
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        accept({
          exit: error?.code ?? 0,
          killed: !!error?.killed,
          stdout: Buffer.from(stdout ?? []),
          stderr: Buffer.from(stderr ?? []),
        });
      },
    );
  });
}
async function inspectVfixImage() {
  const result = await vfixDocker(['image', 'inspect', vfixAuthority.image]);
  requireVfix(result.exit === 0 && !result.killed, 'CURRENT_RUNTIME_DRIFT');
  const images = parseJson(result.stdout.toString('utf8'));
  requireVfix(images.length === 1, 'CURRENT_RUNTIME_DRIFT');
  const image = images[0];
  requireVfix(
    image.Id === vfixAuthority.image &&
      image.Descriptor?.digest === vfixAuthority.image &&
      image.Os === 'linux' &&
      image.Architecture === 'amd64' &&
      image.Config.User === '65534:65534' &&
      image.Config.WorkingDir === '/work' &&
      canonicalJson(image.Config.Entrypoint) ===
        canonicalJson(['python', '-B', '-s', '/opt/vfix/run.py']),
    'CURRENT_RUNTIME_DRIFT',
  );
  return unitSha256({
    id: image.Id,
    descriptor: image.Descriptor,
    config: image.Config,
    layers: image.RootFS,
  });
}
function observeVfixOutput(scratch, authority) {
  const output = join(scratch, 'output'),
    actual = [];
  const walk = (dir, prefix = '') => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name),
        st = lstatSync(path);
      requireVfix(
        !st.isSymbolicLink() && realpathSync(path) === path,
        'CURRENT_OUTPUT_DRIFT',
      );
      if (st.isDirectory()) walk(path, prefix + name + '/');
      else {
        const key = prefix + name,
          read = readExactFile(output, key);
        actual.push({
          path: vfixPrefix + key,
          type: key.endsWith('.pdf') ? 'PDF' : 'MANIFEST',
          sha256: read.sha256,
          bytes: read.bytes.length,
        });
      }
    }
  };
  walk(output);
  actual.sort((a, b) => order(a.path, b.path));
  compareVfixOutputs(authority.outputs, actual);
  for (const version of ['v1', 'v2']) {
    const manifest = parseJson(
      readExactFile(output, version + '/manifest.json').bytes.toString('utf8'),
    );
    requireVfix(
      Array.isArray(manifest.fixtures) && manifest.fixtures.length === 60,
      'CURRENT_OUTPUT_DRIFT',
    );
    for (const fixture of manifest.fixtures)
      requireVfix(
        readExactFile(output, version + '/' + fixture.file).sha256 ===
          fixture.sha256,
        'CURRENT_OUTPUT_DRIFT',
      );
  }
  return actual;
}
export async function validateVfixCurrentGeneration(
  root,
  authority = loadVfixAuthority(root),
) {
  verifyVfixObligation(authority.envelope, authority.generationApproval);
  const sourceIdentity = orchestratorIdentity();
  const before = verifyVfixInputs(root, authority),
    image = await inspectVfixImage();
  const base = realpathSync(tmpdir()),
    repo = realpathSync(root),
    rel = relative(repo, base);
  requireVfix(rel.startsWith('..') || isAbsolute(rel), 'UNSAFE_PATH');
  requireVfix(!repo.includes(',') && !base.includes(','), 'UNSAFE_PATH');
  const runs = [];
  // Each run uses a fresh isolated container/work directory; retained reviewed
  // cold/warm evidence is never overwritten or accepted as current execution.
  for (const mode of ['COLD', 'REPEATED']) {
    const scratch = mkdtempSync(join(base, 'yuta-vfix-repro-'));
    requireVfix(dirname(realpathSync(scratch)) === base, 'UNSAFE_PATH');
    const name = 'yuta-vfix-' + scratch.split(/[\\/]/).at(-1).toLowerCase();
    let processResult;
    try {
      processResult = await vfixDocker(
        [
          'run',
          '--rm',
          '--pull=never',
          '--name',
          name,
          '--platform',
          'linux/amd64',
          '--network=none',
          '--read-only',
          '--cap-drop=ALL',
          '--security-opt=no-new-privileges',
          '--pids-limit=128',
          '--memory=1g',
          '--cpus=2',
          '--user=65534:65534',
          '--mount',
          'type=bind,source=' + repo + ',target=/input,readonly',
          '--mount',
          'type=bind,source=' + scratch + ',target=/work',
          vfixAuthority.image,
        ],
        120000,
      );
    } finally {
      // Exact uniquely owned container only; timeout must not leave a generator alive.
      await vfixDocker(['rm', '--force', name]);
    }
    requireVfix(!processResult.killed, 'GENERATION_TIMEOUT');
    requireVfix(
      processResult.stderr.length === 0,
      'CURRENT_REPRODUCTION_NOT_PROVEN',
    );
    const terminal = parseJson(processResult.stdout.toString('utf8'));
    const legacy = classifyVfixExit(
      processResult.exit,
      terminal,
      authority.outputs,
      authority.admission.members,
      vfixAuthority.generation,
    );
    const actual = observeVfixOutput(scratch, authority);
    const post = verifyVfixInputs(root, loadVfixAuthority(root));
    requireVfix(
      orchestratorIdentity() === sourceIdentity,
      'CURRENT_SOURCE_DRIFT',
    );
    requireVfix(
      before === post && image === (await inspectVfixImage()),
      'CURRENT_RUNTIME_DRIFT',
    );
    runs.push({
      mode,
      processExit: processResult.exit,
      executionValidity: 'PASS',
      legacy,
      historicalResult: 'FAIL',
      modelBResult: 'PASS',
      outputCount: actual.length,
      missing: [],
      extra: [],
      generationIdentity: vfixAuthority.generation,
      outputSetSha256: rawSha256(Buffer.from(JSON.stringify(actual))),
      stdoutSha256: rawSha256(processResult.stdout),
      stderrSha256: rawSha256(processResult.stderr),
      stdoutBytes: processResult.stdout.length,
      stderrBytes: processResult.stderr.length,
      terminal,
      outputs: actual,
      scratch,
      protectedBefore: before,
      protectedAfter: post,
      imageIdentity: image,
      origin: {
        freshRender: 62,
        copiedHistoricalInputs: 58,
        derivedManifests: 2,
      },
    });
  }
  requireVfix(
    canonicalJson(runs[0].outputs) === canonicalJson(runs[1].outputs),
    'CURRENT_REPRODUCTION_NOT_PROVEN',
  );
  const evidence = {
    obligationSha256: vfixAuthority.obligation,
    generationIdentity: vfixAuthority.generation,
    outputSetSha256: vfixAuthority.output,
    result: 'PASS',
    runs,
  };
  const digest = unitSha256(evidence);
  supervisedVfixEvidence.set(evidence, digest);
  return {
    result: {
      obligationSha256: vfixAuthority.obligation,
      validator: 'vfix-current-generation-v1',
      version: 1,
      result: 'PASS',
      failureCode: null,
      observedGenerationIdentitySha256: vfixAuthority.generation,
      observedOutputSetSha256: vfixAuthority.output,
      reproductionEvidenceSha256: digest,
      reproductionEvidenceStatus: 'COMPLETE',
    },
    evidence,
  };
}
export async function runVfixModelB(root) {
  try {
    const authority = loadVfixAuthority(root),
      historical = validateVfixHistorical(root, authority);
    const current = await generationValidatorRegistry[
      authority.envelope.body.validator
    ].validate(root, authority);
    const generation = aggregateVfixGeneration(
      true,
      authority.envelope,
      authority.generationApproval,
      [current.result],
      [current.evidence],
    );
    return {
      aggregate: generation.aggregate,
      exitCode: generation.aggregate === 'PASS' ? 0 : 1,
      historical,
      generation,
      evidence: current.evidence,
      failureCodes: generation.failureCodes,
    };
  } catch (e) {
    return {
      aggregate: 'FAIL',
      exitCode: 1,
      failureCodes: [
        e instanceof PolicyError ? e.code : 'CURRENT_REPRODUCTION_NOT_PROVEN',
      ],
    };
  }
}

export const generationValidatorRegistry = Object.freeze({
  'vfix-current-generation-v1': Object.freeze({
    version: 1,
    obligationSha256: vfixAuthority.obligation,
    validate: validateVfixCurrentGeneration,
  }),
});

export const validatorRegistry = Object.freeze(
  Object.fromEntries(
    validators.map((id) => [
      id,
      Object.freeze({
        id,
        version: 1,
        route: id === 'mutable-prettier-v1' ? 'mutable' : 'alternate',
        implemented:
          id === 'mutable-prettier-v1' ||
          id === 'generated-repro-v1' ||
          id === 'historical-preserve-v1',
        ...(id === 'generated-repro-v1'
          ? {
              artifactClass: 'GENERATED_EXTERNAL_OR_DERIVED',
              subclass: 'REPRODUCIBLE_GENERATED_ARTIFACT',
              validate: validateGeneratedArtifacts,
            }
          : id === 'historical-preserve-v1'
            ? {
                artifactClass: 'HISTORICAL_HASH_BOUND',
                validate: validateVfixHistorical,
              }
            : {}),
      }),
    ]),
  ),
);
const order = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const git = (root, args) =>
  execFileSync('git', ['-C', root, ...args], {
    encoding: 'utf8',
    timeout: 10000,
    maxBuffer: 32 * 1024 * 1024,
    windowsHide: true,
  });
const safeCode = (e) => (e instanceof PolicyError ? e.code : 'POLICY_INVALID');
const require = createRequire(import.meta.url);
// Control Tower approved bounded local source closure, not npm provenance.
const generatedMembers = Object.freeze({
  'dist/core/command-generation/invocation.js':
    'ce76ceb766584214fc78604b20fdbd3ae8217b22cdf997475e8716d9cc400d9c',
  'dist/core/shared/allowed-tools.js':
    'b9245be6517c3242adb6b32d776da9c32976e9ed3fea4de7445c190ca3acc29e',
  'dist/core/shared/skill-generation.js':
    '2f6e20c45cba7ab0e8c852b03aa00340c8d7509d4f33dbee321d90f5e8cc7f22',
  'dist/core/templates/skill-templates.js':
    '1189318c279cdf0bfd2e83848137cbebd196070a36707c0dfa5ca5dfd70b263d',
  'dist/core/templates/workflows/apply-change.js':
    '0c0cc4221319e8912dd6acec8f225ce6c9098500289184e4d87090dbafab8d58',
  'dist/core/templates/workflows/archive-change.js':
    '99cb998cbc9b6f04da6b65fe8164bed9b03e85fa35d36e1e92b0c0cc44d07bee',
  'dist/core/templates/workflows/bulk-archive-change.js':
    'fab8f3df2ea65f81af14688c7acdaa6b0dc56dd8878e855bbbde4c516c1c4923',
  'dist/core/templates/workflows/continue-change.js':
    'ff13e5ce8f304551f681e7b234b02e48153376b0bdd691a49fc5eff213b13a29',
  'dist/core/templates/workflows/explore.js':
    '014f28313ca4de0a13bd6f6a8d9c039f40e1640eec5577f8715b549dc14e248a',
  'dist/core/templates/workflows/feedback.js':
    '65d9749076130465c02b93a1a7c759bffa9dbd82322159bd4fb9d78ceac98ad8',
  'dist/core/templates/workflows/ff-change.js':
    'e90d5b7d7fcee5b7c3ce3ecb04d410774aaf6eb24af02d2b9b48242387df326c',
  'dist/core/templates/workflows/new-change.js':
    '9ca9fc1ad787ffdb10aa2bc95e2116be753a5fc07823d524e7d4be36bf4f5546',
  'dist/core/templates/workflows/onboard.js':
    '68e70f64f286030b748e2b17175c04d8fb74bb7232082e6a81ed9c7d431e40ac',
  'dist/core/templates/workflows/propose.js':
    '55155d4477359270326772852aaf0305c7a1637186739d3d5739296756374917',
  'dist/core/templates/workflows/store-selection.js':
    '5ffe7021b0428287fcf805ac89afee8b6ba04ad3898c269c3878dfe8335b8f22',
  'dist/core/templates/workflows/sync-specs.js':
    'd69d1ef7067dc3b0f740e377483d38fa1701d702802582bc128a9990df1236f5',
  'dist/core/templates/workflows/update-change.js':
    '49f42fb3c45fc8243b45803b6cf6d00b27f3868361adfeca8ddc8606c4505fb9',
  'dist/core/templates/workflows/verify-change.js':
    'f26e13efaf58219cc69b3a21e64c78fda0fee614cea0a604e62df425ad261fdc',
  'dist/utils/command-references.js':
    'd7bbe01a257773a1a4a4d9401b5d6c238bc5edd5a887e71b6b3611d568a1bcb6',
  'package.json':
    '6c170954bb57400a0644477666b8f26d376a725e51c1434f6781cdee63618f50',
});
const generatedTargets = Object.freeze({
  '.agents/skills/openspec-apply-change/SKILL.md':
    '7c79315715da88639e60f05268206ba72939ef9bf298c6f3195152d09d20b3fe',
  '.agents/skills/openspec-archive-change/SKILL.md':
    'e0ffaacdb982e7440e97979422a91178cc93220a5805bd07cbdaef82c33284ac',
  '.agents/skills/openspec-continue-change/SKILL.md':
    '0176d962032c6c36011db0ef30c1cd6130ef6c34ebf359d64cdb21c958949972',
  '.agents/skills/openspec-explore/SKILL.md':
    '95ed31936b538cbf44b5e3f7f81da50defd256d96048ee370d82b36e8ff5c486',
  '.agents/skills/openspec-new-change/SKILL.md':
    '84374cb8ab0c6e076933126f688bc7f59abdfa7aced7bb710743dd3bf72e3383',
  '.agents/skills/openspec-propose/SKILL.md':
    '0c95777dd8cc28f52dc4d6e2a51beeb1917a6638bed51baa710735721784d731',
  '.agents/skills/openspec-sync-specs/SKILL.md':
    'da0ae40869be60ceff6cd231c75976487875675a7eca390b61a932b081aa91d4',
  '.agents/skills/openspec-update-change/SKILL.md':
    '23bd9d7d95cc34caee693f7f3671ec8d49f8eca436483d3e29bea43e511b87d5',
  '.agents/skills/openspec-verify-change/SKILL.md':
    'a049b171b9728a684d901f5e0d6f523bdcd768bc083277a1f6bb9b556cd24b9c',
});
export const generatedBinding = Object.freeze({
  sourceClosureSha256:
    '945dadf7ff9c1746c2dacd0e47e94b11c044f931704a9ffeb913d9fc57f42e19',
  package: '@fission-ai/openspec',
  version: '1.11.0',
  transformerSha256:
    '3d480425270b994c30c51aa084c87b69ef298565aed6197175e9551fc8b2573f',
  members: generatedMembers,
  targets: generatedTargets,
});
export function verifyGeneratedSource(bytes) {
  if (
    canonicalJson(Object.keys(bytes).sort()) !==
    canonicalJson(Object.keys(generatedMembers).sort())
  )
    throw new PolicyError('GENERATOR_IDENTITY_DRIFT');
  const hashes = {};
  for (const path of Object.keys(generatedMembers)) {
    hashes[path] = rawSha256(bytes[path]);
    if (hashes[path] !== generatedMembers[path])
      throw new PolicyError('GENERATOR_IDENTITY_DRIFT');
  }
  if (unitSha256(hashes) !== generatedBinding.sourceClosureSha256)
    throw new PolicyError('GENERATOR_IDENTITY_DRIFT');
  const pkg = parseJson(Buffer.from(bytes['package.json']).toString('utf8'));
  if (
    pkg.name !== generatedBinding.package ||
    pkg.version !== generatedBinding.version
  )
    throw new PolicyError('GENERATOR_IDENTITY_DRIFT');
  return hashes;
}
function generatedSource(root) {
  const bytes = Object.fromEntries(
    Object.keys(generatedMembers).map((path) => [
      path,
      readExactFile(root, path).bytes,
    ]),
  );
  verifyGeneratedSource(bytes);
  return bytes;
}
export function resolveGeneratedSourceRoot() {
  try {
    return dirname(require.resolve('@fission-ai/openspec/package.json'));
  } catch {
    // Location is not authority: every source byte must still match.
    if (process.platform === 'win32' && process.env.APPDATA)
      return join(process.env.APPDATA, 'npm/node_modules/@fission-ai/openspec');
    throw new PolicyError('GENERATION_UNAVAILABLE');
  }
}
const generatedWorker =
  "\nimport { pathToFileURL } from 'node:url';\nconst root = process.argv[1];\nconst { getSkillTemplates, generateSkillContent } = await import(pathToFileURL(root+'/dist/core/shared/skill-generation.js'));\nconst { getTransformerForTool } = await import(pathToFileURL(root+'/dist/utils/command-references.js'));\nconst transformer=getTransformerForTool('codex','skills','skills-invocable',undefined);\nconst generate=()=>getSkillTemplates(['apply','archive','continue','explore','new','propose','sync','update','verify'])\n.map(({template,dirName})=>({path:'.agents/skills/'+dirName+'/SKILL.md',content:generateSkillContent(template,'1.11.0',transformer)}))\n.sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);\nprocess.stdout.write(JSON.stringify({cold:generate(),warm:generate()}));\n";
async function reproduceGenerated(bytes, repositoryRoot, timeoutMs) {
  const base = realpathSync(tmpdir());
  const baseRelation = relative(realpathSync(repositoryRoot), base);
  if (!baseRelation.startsWith('..') && !isAbsolute(baseRelation))
    throw new PolicyError('UNSAFE_PATH');
  const scratch = mkdtempSync(join(base, 'yuta-generated-repro-'));
  const actual = realpathSync(scratch);
  const relation = relative(realpathSync(repositoryRoot), actual);
  if (
    actual !== scratch ||
    (!relation.startsWith('..') && !isAbsolute(relation))
  )
    throw new PolicyError('UNSAFE_PATH');
  try {
    for (const [path, content] of Object.entries(bytes)) {
      const target = join(scratch, path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content, { flag: 'wx' });
    }
    generatedSource(scratch);
    const output = await new Promise((accept, reject) => {
      execFile(
        process.execPath,
        ['--input-type=module', '-e', generatedWorker, scratch],
        {
          cwd: scratch,
          timeout: timeoutMs,
          maxBuffer: 2 * 1024 * 1024,
          encoding: 'utf8',
          windowsHide: true,
          env:
            process.platform === 'win32'
              ? { SystemRoot: process.env.SystemRoot }
              : {},
        },
        (error, stdout, stderr) => {
          if (error || stderr)
            reject(
              new PolicyError(
                error?.killed ? 'VALIDATOR_TIMEOUT' : 'GENERATION_UNAVAILABLE',
              ),
            );
          else accept(stdout);
        },
      );
    });
    return parseJson(output);
  } finally {
    if (
      dirname(scratch) !== base ||
      realpathSync(scratch) !== actual ||
      lstatSync(scratch).isSymbolicLink()
    )
      throw new PolicyError('UNSAFE_PATH');
    rmSync(scratch, { recursive: true });
  }
}
export function compareGeneratedOutput(output, observed) {
  const parsed = z
    .object({
      cold: z.array(
        z.object({ path: exactPathSchema, content: z.string() }).strict(),
      ),
      warm: z.array(
        z.object({ path: exactPathSchema, content: z.string() }).strict(),
      ),
    })
    .strict()
    .safeParse(output);
  if (!parsed.success) throw new PolicyError('REPRODUCIBILITY_UNPROVEN');
  const paths = Object.keys(generatedTargets).sort();
  for (const run of [parsed.data.cold, parsed.data.warm])
    if (canonicalJson(run.map((x) => x.path).sort()) !== canonicalJson(paths))
      throw new PolicyError('GENERATED_INVENTORY_DRIFT');
  if (canonicalJson(Object.keys(observed).sort()) !== canonicalJson(paths))
    throw new PolicyError('GENERATED_INVENTORY_DRIFT');
  return paths.map((path) => {
    const cold = Buffer.from(
      parsed.data.cold.find((x) => x.path === path).content,
      'utf8',
    );
    const warm = Buffer.from(
      parsed.data.warm.find((x) => x.path === path).content,
      'utf8',
    );
    const current = z.instanceof(Uint8Array).parse(observed[path]);
    const reproducedSha256 = rawSha256(cold),
      observedSha256 = rawSha256(current);
    const failureCode = !cold.equals(warm)
      ? 'REPRODUCIBILITY_UNPROVEN'
      : !cold.equals(current) || reproducedSha256 !== generatedTargets[path]
        ? 'GENERATED_BYTE_DRIFT'
        : null;
    return {
      path,
      expectedSha256: generatedTargets[path],
      observedSha256,
      reproducedSha256,
      result: failureCode ? 'FAIL' : 'PASS',
      failureCode,
    };
  });
}
// Evidence is separate from generic results; admission stays in runCoverage.
export async function validateGeneratedArtifacts(
  root,
  sourceRoot,
  artifacts,
  timeoutMs = 30000,
) {
  const rows = [];
  try {
    z.number().int().positive().max(30000).parse(timeoutMs);
    if (!artifacts) {
      artifacts = readdirSync(join(root, '.agents/skills'))
        .filter((name) => name.startsWith('openspec-'))
        .map((name) => {
          const path = '.agents/skills/' + name + '/SKILL.md';
          return { path, sha256: readExactFile(root, path).sha256 };
        });
    }
    for (const path of Object.keys(generatedTargets).sort())
      rows.push({ path, ...readExactFile(root, path) });
    if (artifacts) {
      const relevant = artifacts.filter(
        (x) =>
          Object.hasOwn(generatedTargets, x.path) ||
          /^\.agents\/skills\/openspec-[^/]+\/SKILL\.md$/.test(x.path),
      );
      if (
        canonicalJson(relevant.map((x) => x.path).sort()) !==
        canonicalJson(Object.keys(generatedTargets).sort())
      )
        throw new PolicyError('GENERATED_INVENTORY_DRIFT');
      for (const row of rows)
        if (relevant.find((x) => x.path === row.path)?.sha256 !== row.sha256)
          throw new PolicyError('CONCURRENT_DRIFT');
    }
    const bytes = generatedSource(sourceRoot);
    const output = await reproduceGenerated(bytes, root, timeoutMs);
    const evidence = compareGeneratedOutput(
      output,
      Object.fromEntries(rows.map((x) => [x.path, x.bytes])),
    );
    const after = generatedSource(sourceRoot);
    for (const path of Object.keys(bytes))
      if (!bytes[path].equals(after[path]))
        throw new PolicyError('CONCURRENT_DRIFT');
    for (const row of rows) {
      const final = readExactFile(root, row.path);
      if (
        final.sha256 !== row.sha256 ||
        final.nativeIdentity !== row.nativeIdentity
      )
        throw new PolicyError('CONCURRENT_DRIFT');
    }
    return {
      results: evidence.map((x) => ({
        path: x.path,
        validator: 'generated-repro-v1',
        version: 1,
        sha256: x.observedSha256,
        result: x.result,
        failureCode: x.failureCode,
      })),
      evidence: {
        sourceClosureSha256: generatedBinding.sourceClosureSha256,
        openspecVersion: generatedBinding.version,
        transformerIdentity: generatedBinding.transformerSha256,
        npmSupplyChainProvenance: 'NOT_ESTABLISHED',
        coldScope: 'PROCESS_COLD_ONLY',
        artifacts: evidence,
      },
      failureCode: null,
    };
  } catch (error) {
    const code =
      error instanceof PolicyError ? error.code : 'GENERATION_UNAVAILABLE';
    return {
      results: rows.map((x) => ({
        path: x.path,
        validator: 'generated-repro-v1',
        version: 1,
        sha256: x.sha256,
        result: 'FAIL',
        failureCode: code,
      })),
      evidence: { artifacts: [], failureCode: code },
      failureCode: code,
    };
  }
}

export function formatterIdentity() {
  return {
    version: prettier.version,
    sha256: rawSha256(readFileSync(require.resolve('prettier'))),
  };
}
export function orchestratorIdentity() {
  return rawSha256(readFileSync(new URL(import.meta.url)));
}
export async function deadline(operation, timeoutMs = 30000) {
  z.number().int().positive().max(30000).parse(timeoutMs);
  let timer;
  try {
    return await Promise.race([
      operation(),
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new PolicyError('VALIDATOR_TIMEOUT')),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

// Source-owned dispatch; policy data never supplies executable handlers.
export async function dispatchBounded(jobs) {
  const outputs = new Array(jobs.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(4, jobs.length) }, async () => {
      while (next < jobs.length) {
        const index = next++;
        outputs[index] = await jobs[index]();
      }
    }),
  );
  return outputs;
}

export function assertStableSnapshot(before, after) {
  if (canonicalJson(before) !== canonicalJson(after))
    throw new PolicyError('CONCURRENT_DRIFT');
}

export function readExactFile(root, path) {
  if (!exactPathSchema.safeParse(path).success)
    throw new PolicyError('UNSAFE_PATH');
  const base = realpathSync(root);
  let current = base;
  for (const part of path.split('/')) {
    // Check spelling, not just case-insensitive Windows resolution.
    if (!readdirSync(current).includes(part))
      throw new PolicyError('ARTIFACT_MISSING');
    current = join(current, part);
    const stat = lstatSync(current);
    if (stat.isSymbolicLink() || realpathSync(current) !== current)
      throw new PolicyError('UNSAFE_PATH');
  }
  const rel = relative(base, current);
  if (rel.startsWith('..') || resolve(base, rel) !== current)
    throw new PolicyError('UNSAFE_PATH');
  const before = lstatSync(current);
  if (!before.isFile()) throw new PolicyError('UNSAFE_PATH');
  const bytes = readFileSync(current);
  const after = lstatSync(current);
  if (
    before.ino !== after.ino ||
    before.dev !== after.dev ||
    before.size !== after.size ||
    before.mtimeMs !== after.mtimeMs
  )
    throw new PolicyError('CONCURRENT_DRIFT');
  return {
    bytes,
    sha256: rawSha256(bytes),
    nativeIdentity: `${after.dev}:${after.ino}:${after.size}:${after.mtimeMs}`,
  };
}

export async function inventoryRepository(directory, expected = []) {
  const root = realpathSync(
    git(resolve(directory), ['rev-parse', '--show-toplevel']).trim(),
  );
  const expectedPaths = z.array(exactPathSchema).parse(expected);
  const tracked = git(root, ['ls-files', '-z', '--cached'])
    .split('\0')
    .filter(Boolean);
  const others = git(root, ['ls-files', '-z', '--others', '--exclude-standard'])
    .split('\0')
    .filter(Boolean);
  const paths = [...new Set([...tracked, ...others, ...expectedPaths])].sort(
    order,
  );
  const aliases = new Map();
  const artifacts = [];
  for (const path of paths) {
    const key = path.toLowerCase();
    if (aliases.has(key) && aliases.get(key) !== path)
      throw new PolicyError('UNSAFE_PATH');
    aliases.set(key, path);
    try {
      const file = readExactFile(root, path);
      const info = await prettier.getFileInfo(join(root, path), {
        resolveConfig: false,
        withNodeModules: false,
      });
      // Parser-null is not permission to exempt text or binary data. Domain
      // admissions belong to reviewed migration; retain unresolved members.
      artifacts.push({
        path,
        tracked: tracked.includes(path),
        parser: info.inferredParser,
        sha256: file.sha256,
        nativeIdentity: file.nativeIdentity,
        failureCode: null,
      });
    } catch (e) {
      artifacts.push({
        path,
        tracked: tracked.includes(path),
        parser: null,
        sha256: null,
        nativeIdentity: null,
        failureCode:
          e instanceof PolicyError ? e.code : 'INVENTORY_UNAVAILABLE',
      });
    }
  }
  return { root, artifacts };
}

const resultSchema = z
  .object({
    path: exactPathSchema,
    validator: z.enum(validators),
    version: z.literal(1),
    sha256: sha,
    result: z.enum(['PASS', 'FAIL', 'SKIPPED', 'UNAVAILABLE']),
    failureCode: z
      .string()
      .regex(/^[A-Z_]+$/)
      .nullable(),
  })
  .strict();

// Pure aggregation accepts result records, not executable policy handlers.
// runCoverage is the source-owned producer used for actual repository checks.
export function aggregateCoverage(
  policyText,
  artifacts,
  observations,
  results,
) {
  const policy = parsePolicy(policyText);
  const parsedResults = z.array(resultSchema).safeParse(results);
  const rows = [];
  const seen = new Set();
  for (const file of [...artifacts].sort((a, b) => order(a.path, b.path))) {
    const row = {
      path: file.path,
      class: null,
      subclass: null,
      owner: null,
      sha256: file.sha256,
      routes: [],
      result: 'FAIL',
      failureCodes: [],
      domainStatus: file.parser ? 'IN_FORMATTING_UNIVERSE' : 'UNRESOLVED',
      policyRevision: policy.policyRevision,
      parser: file.parser,
      expectedSha256: null,
      approvalRef: null,
    };
    rows.push(row);
    if (seen.has(file.path)) {
      row.failureCodes.push('DUPLICATE_CLASSIFICATION');
      continue;
    }
    seen.add(file.path);
    if (file.failureCode) {
      row.domainStatus = 'ERROR';
      row.failureCodes.push(file.failureCode);
      continue;
    }
    try {
      row.domainStatus = resolveDomain(policyText, file, observations);
      if (
        row.domainStatus === 'OUTSIDE_FORMATTING_UNIVERSE_BY_APPROVED_ADMISSION'
      ) {
        row.owner = policy.domainAdmissions.find(
          (a) => a.path === file.path,
        ).owner.id;
        row.expectedSha256 = policy.domainAdmissions.find(
          (a) => a.path === file.path,
        ).expectedSha256;
        row.approvalRef = policy.domainAdmissions.find(
          (a) => a.path === file.path,
        ).approvalRef;
        row.result = 'PASS';
        continue;
      }
      const { entry, requiredValidators } = admitEntry(
        policyText,
        file.path,
        observations,
      );
      row.class = entry.class;
      row.subclass = entry.subclass ?? null;
      row.owner = entry.owner.id;
      row.expectedSha256 = entry.identity.rawSha256 ?? null;
      row.approvalRef = entry.admissionRef;
      if (!file.parser) row.failureCodes.push('UNCLASSIFIED');
      if (entry.identity.rawSha256 && entry.identity.rawSha256 !== file.sha256)
        row.failureCodes.push('CLASSIFICATION_STALE');
      for (const id of requiredValidators) {
        const matches = parsedResults.success
          ? parsedResults.data.filter(
              (r) =>
                r.path === file.path &&
                r.validator === id &&
                r.sha256 === file.sha256,
            )
          : [];
        const valid =
          matches.length === 1 &&
          matches[0].result === 'PASS' &&
          matches[0].failureCode === null;
        row.routes.push({
          validator: id,
          version: 1,
          route: validatorRegistry[id].route,
          result: valid ? 'PASS' : 'FAIL',
        });
        if (!valid)
          row.failureCodes.push(
            matches.length === 1 && matches[0].failureCode
              ? matches[0].failureCode
              : 'VALIDATION_COVERAGE_GAP',
          );
      }
      row.failureCodes = [...new Set(row.failureCodes)].sort(order);
      row.result = row.failureCodes.length ? 'FAIL' : 'PASS';
    } catch (e) {
      row.failureCodes.push(safeCode(e));
    }
  }
  for (const entry of [...policy.entries, ...policy.domainAdmissions])
    if (!seen.has(entry.path))
      rows.push({
        path: entry.path,
        class: entry.class,
        subclass: entry.subclass ?? null,
        owner: entry.owner.id,
        sha256: null,
        routes: [],
        result: 'FAIL',
        failureCodes: ['ARTIFACT_MISSING'],
        domainStatus: 'ERROR',
        policyRevision: policy.policyRevision,
        parser: null,
        expectedSha256:
          entry.expectedSha256 ?? entry.identity?.rawSha256 ?? null,
        approvalRef: entry.approvalRef ?? entry.admissionRef,
      });
  const extra =
    !parsedResults.success ||
    parsedResults.data.some(
      (r) =>
        !rows.some(
          (a) =>
            a.path === r.path &&
            a.sha256 === r.sha256 &&
            a.routes.some((route) => route.validator === r.validator),
        ),
    );
  const pass =
    rows.length > 0 && !extra && rows.every((r) => r.result === 'PASS');
  return {
    evidenceSchemaVersion: 1,
    policyRevision: policy.policyRevision,
    rawPolicySha256: rawSha256(Buffer.from(policyText)),
    validatorContractVersion: policy.validatorContractVersion,
    toolBindings: policy.toolBindings,
    artifacts: rows.sort((a, b) => order(a.path, b.path)),
    aggregate: pass ? 'PASS' : 'FAIL',
    exitCode: pass ? 0 : 1,
    failureCodes: extra ? ['VALIDATION_COVERAGE_GAP'] : [],
  };
}

// No policy/admission data is fabricated for a diagnostic-only inventory.
export async function diagnoseRepository(directory) {
  const inventory = await inventoryRepository(directory);
  const artifacts = [];
  for (const file of inventory.artifacts) {
    let ignored = false;
    if (!file.failureCode && file.tracked) {
      const info = await prettier.getFileInfo(join(inventory.root, file.path), {
        resolveConfig: false,
        ignorePath: join(inventory.root, '.prettierignore'),
      });
      ignored = info.ignored;
    }
    artifacts.push({
      path: file.path,
      domainStatus: file.failureCode
        ? 'ERROR'
        : file.parser
          ? 'IN_FORMATTING_UNIVERSE'
          : 'UNRESOLVED',
      parser: file.parser,
      sha256: file.sha256,
      ignored,
      failureCode: file.failureCode ?? 'UNCLASSIFIED',
    });
  }
  return {
    aggregate: 'BLOCKED',
    artifacts,
    counts: {
      total: artifacts.length,
      formatUniverse: artifacts.filter(
        (a) => a.domainStatus === 'IN_FORMATTING_UNIVERSE',
      ).length,
      outsideUniverse: 0,
      unresolvedUniverse: artifacts.filter(
        (a) => a.domainStatus !== 'IN_FORMATTING_UNIVERSE',
      ).length,
      classified: 0,
      unclassified: artifacts.filter(
        (a) => a.domainStatus === 'IN_FORMATTING_UNIVERSE',
      ).length,
      missingValidators: null,
      ignoreMembership: artifacts.filter((a) => a.ignored).length,
    },
    failureCodes: ['POLICY_DATA_NOT_SUPPLIED', 'UNCLASSIFIED'],
    missingValidatorCountReason:
      'Cannot derive obligations without reviewed classifications',
  };
}

export async function runCoverage(directory, policyText, observations) {
  try {
    // Capture caller evidence once; later caller mutation cannot alter a run.
    observations = parseJson(JSON.stringify(observations));
    const policy = parsePolicy(policyText);
    const formatter = formatterIdentity();
    const binding = policy.toolBindings.tools.find(
      (t) => t.package === 'prettier',
    );
    if (
      !binding ||
      binding.version !== formatter.version ||
      binding.sourceSha256 !== formatter.sha256 ||
      policy.toolBindings.formatterSha256 !== formatter.sha256
    )
      throw new PolicyError('POLICY_VERSION_MISMATCH');
    const sourceBinding = policy.toolBindings.tools.find(
      (t) => t.package === 'format-policy',
    );
    if (
      !sourceBinding ||
      sourceBinding.sourceSha256 !== orchestratorIdentity() ||
      sourceBinding.version !== '1'
    )
      throw new PolicyError('POLICY_VERSION_MISMATCH');
    const expected = [...policy.entries, ...policy.domainAdmissions].map(
      (e) => e.path,
    );
    const before = await inventoryRepository(directory, expected);
    const jobs = [];
    const config = readExactFile(before.root, '.prettierrc.json');
    const ignore = readExactFile(before.root, '.prettierignore');
    const manifest = parseJson(
      readExactFile(before.root, 'package.json').bytes.toString('utf8'),
    );
    const ci = readExactFile(
      before.root,
      '.github/workflows/ci.yml',
    ).bytes.toString('utf8');
    // Phase 6 alone may switch these routes; no old-OR-new acceptance.
    if (
      manifest?.scripts?.['format:check'] !== 'prettier --check .' ||
      manifest?.scripts?.format !== 'prettier --write .' ||
      !/^\s*(?:- )?run: pnpm format:check\s*$/m.test(ci)
    )
      throw new PolicyError('ROUTE_BINDING_MISMATCH');
    if (
      config.sha256 !== policy.toolBindings.configSha256 ||
      ignore.sha256 !== policy.toolBindings.ignoreSha256
    )
      throw new PolicyError('CLASSIFICATION_STALE');
    const options = parseJson(config.bytes.toString('utf8'));
    // Never load arbitrary plugins or executable configuration from policy data.
    const formatOptions = z
      .object({
        semi: z.boolean(),
        singleQuote: z.boolean(),
        tabWidth: z.number().int().positive(),
        trailingComma: z.enum(['all', 'es5', 'none']),
      })
      .strict()
      .parse(options);
    const ignoredPaths = [];
    for (const file of before.artifacts) {
      if (file.failureCode) continue;
      const info = await prettier.getFileInfo(join(before.root, file.path), {
        resolveConfig: false,
        ignorePath: join(before.root, '.prettierignore'),
      });
      if (info.ignored && file.tracked) {
        let outside = false;
        try {
          outside =
            resolveDomain(policyText, file, observations) ===
            'OUTSIDE_FORMATTING_UNIVERSE_BY_APPROVED_ADMISSION';
        } catch {
          /* Retain unresolved tracked members. */
        }
        if (!outside) ignoredPaths.push(file.path);
      }
    }
    let historicalBatch;
    const historicalRun = () => {
      historicalBatch ??= validatorRegistry['historical-preserve-v1'].validate(
        before.root,
      );
      return historicalBatch;
    };
    let generatedBatch;
    const generatedRun = () => {
      const tool = policy.toolBindings.tools.find(
        (t) => t.package === generatedBinding.package,
      );
      if (
        !tool ||
        tool.version !== generatedBinding.version ||
        tool.sourceSha256 !== generatedBinding.sourceClosureSha256 ||
        tool.adapterVersion !== 1
      )
        throw new PolicyError('GENERATOR_IDENTITY_DRIFT');
      generatedBatch ??= validatorRegistry['generated-repro-v1'].validate(
        before.root,
        resolveGeneratedSourceRoot(),
        before.artifacts,
      );
      return generatedBatch;
    };
    for (const file of before.artifacts) {
      if (file.failureCode) continue;
      let admission;
      try {
        admission = admitEntry(policyText, file.path, observations);
      } catch {
        continue;
      }
      for (const id of admission.requiredValidators) {
        jobs.push(async () => {
          let result = 'UNAVAILABLE',
            failureCode = 'VALIDATION_COVERAGE_GAP';
          if (id === 'historical-preserve-v1') {
            try {
              const match = historicalRun().results.find(
                (x) => x.path === file.path,
              );
              return (
                match ?? {
                  path: file.path,
                  validator: id,
                  version: 1,
                  sha256: file.sha256,
                  result: 'FAIL',
                  failureCode: 'HISTORICAL_ADMISSION_INVALID',
                }
              );
            } catch (error) {
              return {
                path: file.path,
                validator: id,
                version: 1,
                sha256: file.sha256,
                result: 'FAIL',
                failureCode:
                  error instanceof PolicyError
                    ? error.code
                    : 'HISTORICAL_ADMISSION_INVALID',
              };
            }
          }
          if (id === 'generated-repro-v1') {
            try {
              const batch = await generatedRun();
              const match = batch.results.find((x) => x.path === file.path);
              return (
                match ?? {
                  path: file.path,
                  validator: id,
                  version: 1,
                  sha256: file.sha256,
                  result: 'FAIL',
                  failureCode: batch.failureCode ?? 'GENERATED_INVENTORY_DRIFT',
                }
              );
            } catch (error) {
              return {
                path: file.path,
                validator: id,
                version: 1,
                sha256: file.sha256,
                result: 'FAIL',
                failureCode:
                  error instanceof PolicyError
                    ? error.code
                    : 'GENERATION_UNAVAILABLE',
              };
            }
          }
          if (id === 'mutable-prettier-v1' && file.parser) {
            const current = readExactFile(before.root, file.path);
            if (current.sha256 !== file.sha256)
              throw new PolicyError('CONCURRENT_DRIFT');
            try {
              const valid = await deadline(() =>
                prettier.check(
                  new TextDecoder('utf-8', { fatal: true }).decode(
                    current.bytes,
                  ),
                  {
                    ...formatOptions,
                    filepath: join(before.root, file.path),
                    parser: file.parser,
                  },
                ),
              );
              result = valid ? 'PASS' : 'FAIL';
              failureCode = valid ? null : 'MUTABLE_FORMAT_FAILED';
            } catch (e) {
              result = 'FAIL';
              failureCode =
                e instanceof PolicyError ? e.code : 'VALIDATION_COVERAGE_GAP';
            }
          }
          return {
            path: file.path,
            validator: id,
            version: 1,
            sha256: file.sha256,
            result,
            failureCode,
          };
        });
      }
    }
    const results = await dispatchBounded(jobs);
    let ignoreFailure = null;
    try {
      verifyIgnoreMembership(
        policyText,
        ignoredPaths,
        ignore.sha256,
        observations,
      );
    } catch (e) {
      ignoreFailure = safeCode(e);
    }
    const after = await inventoryRepository(directory, expected);
    assertStableSnapshot(before, after);
    if (sourceBinding.sourceSha256 !== orchestratorIdentity())
      throw new PolicyError('CONCURRENT_DRIFT');
    const aggregate = aggregateCoverage(
      policyText,
      before.artifacts,
      observations,
      results,
    );
    if (ignoreFailure) {
      aggregate.aggregate = 'FAIL';
      aggregate.exitCode = 1;
      aggregate.failureCodes.push(ignoreFailure);
    }
    for (const row of aggregate.artifacts) {
      row.ignored = ignoredPaths.includes(row.path);
      row.ignoreEvidence = {
        sourcePath: policy.ignoreMembership.sourcePath,
        sourceSha256: ignore.sha256,
        expansionAlgorithm: policy.ignoreMembership.expansionAlgorithm,
        expansionVersion: policy.ignoreMembership.expansionVersion,
        membershipSha256: membershipIdentity(policy.ignoreMembership),
        approvalRef: policy.ignoreMembership.approvalRef,
      };
      if (row.ignored && (row.class === 'MUTABLE_FORMATTED' || !row.class)) {
        row.failureCodes.push('IGNORE_POLICY_MISMATCH');
        row.result = 'FAIL';
        aggregate.aggregate = 'FAIL';
        aggregate.exitCode = 1;
      }
      row.failureCodes = [...new Set(row.failureCodes)].sort();
      row.reason = row.failureCodes.join(',') || 'VALIDATED';
    }
    // The applicable admitted V-FIX set has an independent required generation
    // obligation. Its absence cannot be inferred from an empty caller result list.
    // This never creates or replaces a repository classification.
    let generationAudit = {
      aggregate: 'PASS',
      generations: [],
      failureCodes: [],
    };
    if (before.artifacts.some((file) => file.path.startsWith(vfixPrefix))) {
      const modelB = await runVfixModelB(before.root);
      generationAudit = modelB.generation ?? {
        aggregate: 'FAIL',
        generations: [],
        failureCodes: modelB.failureCodes,
      };
      if (modelB.aggregate !== 'PASS') {
        aggregate.aggregate = 'FAIL';
        aggregate.exitCode = 1;
        aggregate.failureCodes.push(...modelB.failureCodes);
      }
      assertStableSnapshot(
        before,
        await inventoryRepository(directory, expected),
      );
    }
    return {
      ...aggregate,
      generationAudit,
      ignoreSha256: ignore.sha256,
      ignoredPaths: ignoredPaths.sort(order),
      scopeInventorySha256: unitSha256(
        before.artifacts.map(({ nativeIdentity, ...logical }) => logical),
      ),
      counts: {
        total: aggregate.artifacts.length,
        inDomain: aggregate.artifacts.filter(
          (r) => r.domainStatus === 'IN_FORMATTING_UNIVERSE',
        ).length,
        outside: aggregate.artifacts.filter(
          (r) =>
            r.domainStatus ===
            'OUTSIDE_FORMATTING_UNIVERSE_BY_APPROVED_ADMISSION',
        ).length,
        unresolved: aggregate.artifacts.filter(
          (r) =>
            ![
              'IN_FORMATTING_UNIVERSE',
              'OUTSIDE_FORMATTING_UNIVERSE_BY_APPROVED_ADMISSION',
            ].includes(r.domainStatus),
        ).length,
        pass: aggregate.artifacts.filter((r) => r.result === 'PASS').length,
        fail: aggregate.artifacts.filter((r) => r.result !== 'PASS').length,
      },
      formatterVersion: prettier.version,
    };
  } catch (e) {
    return {
      aggregate: 'FAIL',
      exitCode: e instanceof PolicyError ? 1 : 2,
      failureCodes: [
        e instanceof PolicyError ? e.code : 'EXECUTION_UNAVAILABLE',
      ],
      artifacts: [],
    };
  }
}
