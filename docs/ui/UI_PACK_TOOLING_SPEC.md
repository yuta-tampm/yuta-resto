# YUTA UI Page-Pack Tooling Specification

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-08-09

Protocol revision: 3

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
6. copy the canonical page template;
7. create `references/` with a reference metadata README;
8. create `DESIGN_HANDOFF.md` with unresolved baseline and prompt states;
9. populate only safe mechanical metadata such as application, target, slug,
   initial package status, and unresolved implementation classification;
10. leave repository-derived fields as explicit placeholders for Phase 0;
11. never create API, contract, permission, schema, database, or application
    code;
12. never rename or migrate existing packages automatically;
13. print the created tree, state that `docs/ui/pages/README.md` must be reviewed
    when the package becomes current, and print the next required step:
    repository analysis.

### Initial metadata

A new generated package should start with values equivalent to:

```text
Application: <app>
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
No-image reference reason: <required after approval when status is NONE>
```

`NEW_PAGE` or `EXISTING_PAGE` must be proven by Phase 0, not guessed by the
generator.

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

Rules:

- `design` may use `DRAFT`, `REVIEWED`, `APPROVED`, or `NONE` references;
- `approved` requires `Scope status: APPROVED` and either `APPROVED` visual
  reference or an explicit declaration that no image reference is required;
- `implementation-ready` requires completed Phase 0 inventory, resolved
  `NEW_PAGE`/`EXISTING_PAGE`, resolved implementation class, protected
  invariants, change impact, exact verification commands, and approved/no-image
  reference declaration;
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
  `NOT_APPLICABLE` for a new page) and a ready design-generation prompt.

`UNKNOWN`, unresolved placeholders, missing `Inventory status: COMPLETE`, a
blocked/pending required baseline, or a pending design prompt are errors for
`implementation-ready` and `implemented` packages.

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
- An `implementation-ready` claim fails until Phase 0, invariants, change
  impact, verification commands, and approved reference metadata are complete.
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
- lifecycle state transitions and unresolved placeholders;
- legacy package warning behavior;
- non-existent verification command detection;
- implemented-package delivery/as-built evidence requirements.
