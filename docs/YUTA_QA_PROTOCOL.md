# YUTA QA Protocol

Status: Proposed

Visibility: Engineering

Owner: YUTA product and engineering

## Purpose

QA validates user-facing and runtime behavior after technical VERIFY. It does
not replace Specs/Design verification, Product authority, deployment evidence,
or Production Readiness.

```text
VERIFY: repository implementation matches approved Specs/Design
QA: applicable behavior works in the target user/runtime context
```

## Classification

Before Gate 3, record:

```text
UI_AFFECTING: YES | NO
BROWSER_QA_REQUIRED: YES | NO
```

Set both to `YES` when a change affects visible UI, user interaction,
responsive layout, UI role/edit/read-only state, loading/error/success
presentation, or visual component behavior. Backend/data-only work may use a
non-browser QA plan or truthful `NOT_APPLICABLE` when it has no distinct
user-facing/runtime QA dimension. Do not require meaningless Browser QA for
backend/database correctness; schema, migration, repository, tenant-isolation,
authorization, and integration evidence belongs to technical VERIFY and the
phase Technical Implementation Contract.

QA status is exactly one of:

- `PASS` — all required checks and evidence are complete;
- `FAIL` — an applicable behavior, visual, responsive, or accessibility issue
  was observed;
- `BLOCKED_BY_ENVIRONMENT` — required QA cannot run after safe bounded recovery
  attempts because an environment/dependency is unavailable;
- `NOT_APPLICABLE` — no user-facing/runtime QA dimension applies. This is
  invalid when `UI_AFFECTING: YES`.

## Browser QA for UI changes

Use the real/local route with the closest safe realistic data. Preserve real
authorization, tenancy, persistence, and runtime boundaries; do not replace an
integrated page with fixtures to make QA pass.

Check applicable cases:

- primary happy path and meaningful before/after state;
- editable and read-only/permission states;
- loading, error, saving, success, and recovery presentation;
- keyboard operation and basic accessibility;
- no unexpected overflow or clipping;
- responsive behavior and changed-section regression.

Use the current page pack's viewport rules when present. Otherwise test at
least:

```text
Desktop: 1366x768
Mobile: 390x844
```

Add tablet/intermediate coverage, commonly `768x1024`, when the page pack,
target device, or meaningful breakpoint requires it. Do not create duplicate
screenshots that prove no distinct layout or state.

Use an existing visual-regression convention when available. Do not introduce
a visual-testing dependency for one change unless the approved Design permits
it.

## Evidence

For UI-affecting changes create:

```text
docs/reviews/<change-name>/qa/
├── QA_REPORT.md
├── screenshot-manifest.md
└── *.png
```

`QA_REPORT.md` contains:

```text
Change:
UI_AFFECTING:
BROWSER_QA_REQUIRED:
QA status:
Route(s):
Data/test setup:
Roles/states:
Viewport(s):
Scenarios tested:
Accessibility checks:
Visual/responsive findings:
Regression findings:
Known limitations:
Screenshot evidence:
```

Every screenshot must come from the actual Browser QA session and be recorded
in `screenshot-manifest.md` with:

- repository-relative path;
- viewport;
- role/state;
- scenario;
- lowercase SHA-256 of exact file bytes.

Gate 3 links and hashes the report, manifest, and screenshots. Screenshots are
QA evidence only; they never define Product behavior, permission, schema,
persistence, ownership, or lifecycle.

## Failure and environment handling

For `FAIL`, fix only implementation defects inside approved behavior, then
rerun technical VERIFY and QA. Product or durable-boundary changes return to
the applicable earlier gate.

For `BLOCKED_BY_ENVIRONMENT`, first attempt only safe recovery documented by
the repository, record exact commands and failures, then stop with the required
environment action. Never convert blocked QA into PASS or hide it in Gate 3.

## Gate 3 integration

Gate 3 has separate `TECHNICAL VERIFY` and `QA` sections. UI-affecting changes
require:

```text
TECHNICAL IMPLEMENTATION COMPLIANCE: PASS
VERIFY: PASS
QA: PASS
```

Missing responsive coverage, screenshot hashes, or an applicable role/state
check prevents a ready Gate 3. Non-UI changes require VERIFY PASS and either an
applicable QA PASS or truthful `NOT_APPLICABLE`.
