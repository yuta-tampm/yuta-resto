# YUTA UI Page-Pack Tooling Specification

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-08-10

Protocol revision: 4

## Purpose

This document specifies repository tooling that turns the UI page-pack
convention into an enforceable workflow. It defines a generator and validator
for `docs/ui/pages/<page-slug>/` packages.

The tooling is not a replacement for `PAGE_PACK_PROTOCOL.md`. The protocol is
the authority; the tooling automates its mechanical requirements.

## Current implementation

The root package exposes:

```bash
pnpm ui:pack:new --app <application> --slug <page-slug> --target <route-or-id> [--type <target-type>]
pnpm ui:pack:check [<page-slug>]
pnpm test:ui-pack
```

The implementation is owned by:

```text
scripts/create-ui-pack.mjs
scripts/check-ui-pack.mjs
scripts/ui-pack-tooling.mjs
scripts/ui-pack-tooling.test.mjs
```

The validator currently accepts legacy stable packages structurally and emits a
lifecycle warning until they are next actively migrated.

Newly generated packs use the approved `GENERATED_SNAPSHOTS` topology. The
canonical prompt set has deterministic revision metadata in
`docs/ui/templates/page/prompt-template.json`; each generated pack receives a
strictly parseable `prompt-provenance.json`. JSON is used because exact hashes,
duplicate phase detection, and cross-platform source paths are safer to parse
than a Markdown table. This file is tooling metadata, not Product Knowledge.

## Generator: `scripts/create-ui-pack.mjs`

### Goal

Create a new package from the canonical template without requiring manual file
copying and without creating wrapper directories.

### Required inputs

- `--app`: target frontend application directory name such as `yuta-pos`, or
  canonical path such as `apps/yuta-pos`; tooling stores the canonical
  `apps/<name>` value;
- `--slug`: stable repository-wide package slug;
- `--target`: route, screen identifier, surface, or flow identifier.

Optional inputs may be added only when they are deterministic and useful, such
as target type. Do not require product or architecture facts that should come
from repository analysis.

### Required behavior

The generator must:

1. reject an invalid or unknown frontend application;
2. reject a slug that violates `PAGE_PACK_PROTOCOL.md`;
3. reject creation when `docs/ui/pages/<page-slug>/` already exists;
4. resolve and verify every destination remains inside `docs/ui/pages/` and
   reject path traversal or unsafe symlink targets;
5. stage creation on the same filesystem and rename atomically so failures do
   not leave a partial package;
6. read the deterministic canonical prompt-template revision;
7. copy the canonical page template;
8. hash each canonical prompt and each final local copy;
9. write `prompt-provenance.json` for all six sealed snapshots, using a Git
   generation commit when available or an ISO timestamp fallback;
10. exclude template-only `prompt-template.json` from the generated pack;
11. create `references/` with a reference metadata README;
12. create `DESIGN_HANDOFF.md` with unresolved shared-context, baseline, and
    prompt states;
13. populate only safe mechanical metadata such as application, target, slug,
    initial package status, and unresolved implementation classification;
14. leave repository-derived fields as explicit placeholders for Phase 0;
15. never create API, contract, permission, schema, database, or application
    code;
16. never rename or migrate existing packages automatically;
17. print the created tree, state that `docs/ui/pages/README.md` must be reviewed
    when the package becomes current, and print the next required step:
    repository analysis.

Generation is the sealing point: after the six final local hashes and
provenance are written, the atomic rename completes the pack. The generator
never opens or overwrites an existing stable pack. Canonical-template changes
therefore affect only later generations.

### Initial metadata

A new generated package should start with values equivalent to:

```text
Application: <app>
Protocol revision: 4
Target type: <PAGE | SCREEN | SURFACE | FLOW or unresolved>
Route / entry point: <target>
Page classification: UNKNOWN
Implementation class: UNKNOWN
Package status: design
Scope status: DRAFT
Reference status: DRAFT or NONE
Inventory status: PENDING
Baseline status: PENDING
Design prompt status: PENDING
Shared context status: PENDING
Prompt snapshot topology: GENERATED_SNAPSHOTS
Prompt provenance: prompt-provenance.json
No-image reference reason: <required after approval when status is NONE>
```

`NEW_PAGE` or `EXISTING_PAGE` must be proven by Phase 0, not guessed by the
generator.

### Prompt provenance format

`docs/ui/templates/page/prompt-template.json` owns the deterministic canonical
set revision, initially `prompt-template-v1`. Change prompt content and increment
that revision together for future generations; a date alone is not a revision.

The generator writes `prompt-provenance.json` at the generated pack root. Its
minimal shape is:

```json
{
  "schemaVersion": 1,
  "topology": "GENERATED_SNAPSHOTS",
  "sealed": true,
  "templateRevision": "prompt-template-v1",
  "generation": { "commit": "<git-object-id>" },
  "prompts": [
    {
      "filename": "00_REPOSITORY_ANALYSIS.md",
      "templateSource": "docs/ui/templates/page/prompts/00_REPOSITORY_ANALYSIS.md",
      "templateRevision": "prompt-template-v1",
      "templateSha256": "<64-lowercase-hex>",
      "snapshotSha256": "<64-lowercase-hex>",
      "localModificationState": "NONE",
      "provenanceStatus": "PROVEN"
    }
  ]
}
```

The actual array contains all six unique phase prompts. `generation` contains
exactly one valid `commit`, or an ISO `timestamp` fallback when Git metadata is
unavailable. `localModificationState` is `NONE` for direct generated copies and
may be `PRE_SEAL` only for a future approved pre-seal customization workflow.
Provenance status is `PROVEN`, `PARTIAL`, or `NEEDS_REVIEW`; the latter two are
primarily for the separately approved legacy migration and never authorize a
guessed origin.

Normal generator output uses one non-null root template-set revision and the
same revision for all six `PROVEN` prompt entries. A historical mixed pack may
use `null` for the root revision and preserve different proven per-prompt
revisions. A per-prompt revision may also be `null` only with `PARTIAL` or
`NEEDS_REVIEW`. This represents missing evidence explicitly instead of falsely
normalizing historical cohorts.

## Validator: `scripts/check-ui-pack.mjs`

### Goal

Fail fast when a page package is structurally invalid or not ready for the
lifecycle state it claims.

### Structural checks

For every checked package, verify:

- stable lowercase hyphenated slug;
- no `v2`, `v3`, `new`, `final`, or `latest` package naming pattern;
- required Markdown files exist;
- `PRODUCT_SCOPE.md` exists, or README contains the protocol-approved omission
  reason;
- `references/` exists;
- `prompts/` contains the six required phase files;
- a provenance-enabled pack contains `prompt-provenance.json` with exactly six
  unique phase entries;
- prompt filenames match the required phase set; a newly generated `PROVEN`
  source matches the available canonical path, while historical incomplete
  sources are `null` or repository-relative forward-slash paths;
- template revision, template SHA-256, snapshot SHA-256, generation evidence,
  local-modification state, and provenance status are valid;
- every recorded snapshot SHA-256 matches the local sealed file;
- no single `CODEX_PROMPT.md` replaces the phase prompts;
- page documents link to shared/application rules rather than copying the shared
  component/token catalog;
- application metadata resolves to a real frontend app;
- application-specific UI rules are referenced when such rules exist.

### Lifecycle checks

Validate allowed package states:

```text
design
approved
implementation-ready
implemented
```

Validate reference states:

```text
NONE
DRAFT
REVIEWED
APPROVED
```

Validate scope states:

```text
DRAFT
REVIEWED
APPROVED
```

Validate inventory states:

```text
PENDING
COMPLETE
```

Validate shared-context states:

```text
PENDING
RESOLVED
BLOCKED
```

Rules:

- `design` may use `DRAFT`, `REVIEWED`, `APPROVED`, or `NONE` references;
- `approved` requires `Scope status: APPROVED` and either `APPROVED` visual
  reference or an explicit declaration that no image reference is required,
  plus `Shared context status: RESOLVED`;
- `implementation-ready` requires completed Phase 0 inventory, resolved
  `NEW_PAGE`/`EXISTING_PAGE`, resolved implementation class, protected
  invariants, resolved shared UI context and shell/navigation decision, change
  impact, exact verification commands, and approved/no-image reference
  declaration;
- `implemented` additionally requires delivery evidence and as-built sync.

The validator should not attempt to prove subjective visual parity. It checks
that required evidence/declarations are present.

Document `Status:` and `Package status:` are separate. Lifecycle validation
reads the exact `Package status` field.

### Legacy package compatibility

Existing stable packages without `Package status` remain valid during
incremental adoption. The validator performs structural checks and emits a
warning that lifecycle metadata will be required when the package is next
actively modified. It must not invent or silently write metadata.

Once a package declares `Package status`, all lifecycle rules apply. This keeps
the no-argument validator usable before a dedicated mechanical migration of
existing packages.

Existing packs without `prompt-provenance.json` also remain valid in prompt
compatibility mode. They receive `missing-prompt-provenance`, not a structural
failure. A pack that declares `GENERATED_SNAPSHOTS` or references
`prompt-provenance.json` is provenance-enabled and must contain complete valid
metadata.

The validator never auto-repairs provenance or copies the latest canonical
prompt over a local file. A sealed snapshot/hash mismatch is an error. A
different current canonical-template hash is not an error for an older pack;
only the recorded provenance and sealed local content are validated. Historical
provenance that cannot be established remains `NEEDS_REVIEW` until a separately
approved migration.

Each `PARTIAL` prompt emits `partial-prompt-provenance`; each `NEEDS_REVIEW`
prompt emits `unresolved-prompt-provenance`. These warnings do not fail an
otherwise valid migrated pack, but unresolved provenance never disappears into
a clean result. A historical source path does not need to exist at its current
repository location when the entry is explicitly incomplete. Its sealed local
snapshot hash is still mandatory and enforced.

### Implementation-ready checks

When status is `implementation-ready`, also require:

- target application and target type;
- real route/screen/entry point;
- `NEW_PAGE` or `EXISTING_PAGE` classification;
- implementation class;
- current implementation summary;
- protected invariants section;
- expected change impact section;
- stop conditions;
- current authoritative documentation references;
- exact repository verification commands;
- approved visual reference metadata or explicit no-image statement;
- `DESIGN_HANDOFF.md` with a captured existing-page baseline (or
  `NOT_APPLICABLE` for a new page), resolved shared-context bundle and
  shell/navigation decision, and a ready design-generation prompt.

`UNKNOWN`, unresolved placeholders, missing `Inventory status: COMPLETE`, a
blocked/pending required baseline, or a pending design prompt are errors for
`implementation-ready` and `implemented` packages. A present but unresolved
`Shared context status` is also an error for `approved` or later states. Older
packages without the revision-4 field receive a compatibility warning until
they are actively migrated.

### Implemented checks

When status is `implemented`, additionally require evidence that the package was
synchronized with the delivered implementation:

- files changed or final implementation location;
- verification commands and results;
- functional/regression QA result;
- visual/browser/device evidence when UI changed;
- intentional deviations;
- deferred proposals/risks;
- as-built documentation status.

Do not make the validator trust free-form claims that a non-existent command ran.
Where practical, command names should be validated against current root/app
package scripts.

Root commands written as `pnpm <script>` must resolve to a current root script.
Filtered commands may be accepted only when the target workspace and package
script both exist. Free-form prose is not command evidence.

## Exit behavior

Suggested behavior:

- exit `0` when all checked packages satisfy their declared lifecycle state;
- exit non-zero when required structure or lifecycle evidence is missing;
- print errors with package path, failed rule, and required correction;
- print warnings separately for non-blocking recommendations.

Do not silently repair existing packages during validation.

## Repository integration

Current repository integration:

1. the root generator, validator, and test scripts are available;
2. `docs/ui/README.md` and `PAGE_PACK_PROTOCOL.md` document them;
3. add `ui:pack:check` to repository documentation validation or CI
   only after the validator is stable on current packages;
4. do not bulk-rename existing stable Backoffice packages;
5. update existing packages incrementally when they are next touched, unless a
   dedicated migration is explicitly approved.

The generator does not edit `docs/ui/pages/README.md` automatically. It prints
the required review reminder so index changes remain explicit and reviewable.

## Safety and scope

The generator/validator owns package mechanics only. It must never:

- infer product scope;
- classify a real route without repository inspection;
- invent protected invariants;
- modify application code;
- create API routes, schema, contracts, permissions, migrations, or device
  capabilities;
- generate visual references;
- report test/build/lint results.

## Acceptance criteria for tooling implementation

- A valid package can be generated at the repository root with no wrapper
  directory.
- A generated package cannot overwrite an existing stable package.
- Invalid slugs and unknown applications fail clearly.
- Missing required files/prompts fail validation.
- Generated packs contain six sealed local prompt snapshots plus complete
  per-phase provenance using deterministic template revision metadata.
- Sealed snapshot changes fail validation without being repaired.
- Updating a canonical prompt after generation does not invalidate or rewrite
  an older valid snapshot.
- Legacy packs without provenance remain valid with compatibility warnings.
- An `implementation-ready` claim fails until Phase 0, shared context,
  shell/navigation decision, invariants, change impact, verification commands,
  and approved reference metadata are complete.
- An `implemented` claim fails until delivery/QA/as-built evidence is present.
- Existing stable page-package paths remain unchanged.
- Existing root command names are reported truthfully; no lint command is
  invented.

## Automated test requirements

Use Node's built-in test runner and disposable temporary repository fixtures.
Cover at least:

- canonical app normalization and unknown apps;
- invalid slugs, path traversal, and forbidden version-like names;
- duplicate destinations and atomic cleanup after failure;
- generated tree and safe metadata substitution;
- missing required files/prompts/references;
- generated per-phase provenance, template revision, template and snapshot
  hashes, and cross-platform source paths;
- historical mixed per-phase revisions and nullable unknown set revision;
- visible `PARTIAL` and `NEEDS_REVIEW` warnings;
- unavailable historical template sources with preserved sealed integrity;
- missing, duplicate, malformed, or incomplete provenance entries;
- sealed snapshot mismatch without auto-repair;
- canonical-template evolution after pack generation;
- legacy missing-provenance warning behavior;
- lifecycle state transitions and unresolved placeholders;
- legacy package warning behavior;
- non-existent verification command detection;
- implemented-package delivery/as-built evidence requirements.
