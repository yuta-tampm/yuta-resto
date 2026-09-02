# YUTA Automated Change Workflow v3

Status: Proposed

Visibility: Engineering

Owner: YUTA product and engineering

## Purpose

Workflow v3 automates bounded discovery, OpenSpec planning, phased
implementation, technical verification, QA evidence, review-packet assembly,
approved normative promotion, archive, and post-archive knowledge
consolidation. Human approval remains mandatory at Product/authority,
requirements, sensitive-design, final-review, and conditional knowledge-review
boundaries.

It does not merge release, deployment, environment enablement, or Production
Readiness into repository implementation closure.

## End-to-end workflow

```text
IDEA
  -> DISCOVERY / SHAPING                              conditional
  -> PROPOSAL
  -> ANALYSIS
  -> GATE 1 — PRODUCT / AUTHORITY REVIEW
  -> SPECS
  -> GATE 2 — REQUIREMENTS REVIEW
  -> DESIGN
  -> SENSITIVE DESIGN GATE                           conditional
  -> TASKS + PHASED IMPLEMENTATION PLAN
  -> APPLY
  -> VERIFY
  -> QA
  -> GATE 3 — FINAL INDEPENDENT REVIEW
  -> APPROVAL + EXPLICIT SYNC AUTHORIZATION
  -> SYNC NORMATIVE SPECS
  -> VALIDATE MAIN SPECS
  -> ARCHIVE
  -> KNOWLEDGE CONSOLIDATION
       -> NO_UPDATE_REQUIRED -> DONE
       -> UPDATE_REQUIRED -> KNOWLEDGE REVIEW
          -> APPLY APPROVED KNOWLEDGE UPDATE -> DONE

RELEASE / DEPLOY / POST-DEPLOY VERIFY
  = separate conditional operational lane
```

A valid `skip_specs: true` change omits Gate 2 and normative promotion. A
sensitive change adds `02b-design-review.md` before Tasks/Apply.

## Workflow responsibilities

`$yuta-run-change` starts or resumes an active change and runs only through the
next review stop. It owns conditional Discovery/Shaping, planning artifacts,
Gates 1 and 2, the conditional Design Gate, phased Tasks/Apply, VERIFY, QA, and
Gate 3. It never syncs or archives normative specs.

`$yuta-finish-change` requires explicit Gate 3 approval plus explicit sync and
archive authorization. It rechecks reviewed hashes, syncs selected deltas,
validates main specs, archives synchronously, and performs Knowledge
Consolidation. It also resumes an approved Knowledge Review for an already
archived change without recreating an active change.

Reviewers remain independent. Automation cannot approve Product Intent, resolve
authority conflicts, infer permission, or promote lifecycle/readiness.

## Conditional Discovery / Shaping

Before a new change, classify whether current Product Knowledge can safely bound
the request. Use read-only Discovery/Shaping for unclear ownership,
cross-module behavior, external-provider behavior, major workflow redesign, or
unfamiliar runtime/data boundaries.

Discovery is not a mandatory OpenSpec artifact. It may produce a question, a
bounded request, or no change. Small, well-bounded requests skip it.

## Gates and adoption

### Gate 1 — Product / authority review

Reviews exact Proposal and Analysis bytes. Requirement-level conflicts return to
Analysis. Valid conclusions remain `READY_FOR_SPECS`,
`BLOCKED_NEEDS_REVIEW`, and `NO_SPEC_BEHAVIOR_CHANGE`.

### Gate 2 — Requirements review

Reviews every exact delta spec and strict validation evidence. It is omitted
only for an approved `skip_specs: true` path.

### Conditional sensitive Design Gate

Authorization/security, runtime/data ownership, database/destructive migration,
payment/fiscal, Personnel/legal/privacy, provider, POS transaction,
irreversible, or cross-module durable-boundary work requires
`02b-design-review.md` approval before Tasks/Apply.

### Adoption

An existing in-flight change always resumes at its earliest missing,
unapproved, invalidated, or changes-requested gate. Later artifacts never bypass
an earlier gate and are preserved byte-for-byte unless an approved revision
explicitly authorizes edits.

## Tasks and phased implementation

Tasks include only the phases the approved change needs, in dependency order:

- `Foundation / Data`;
- `Service / Domain`;
- `UI / Components`;
- `Interaction / States`;
- `Integration / Regression`.

These are planning labels, not mandatory stages. Each included phase contains
verifiable checkbox outcomes. APPLY executes them in order, runs targeted checks
where practical between phases, and marks a task complete only when its stated
outcome exists. Product or durable-boundary discoveries return to the
appropriate earlier gate rather than weakening Specs/Design.

Each included phase embeds a `TECHNICAL IMPLEMENTATION CONTRACT` in the
existing Tasks / Implementation Plan. It is not a new OpenSpec artifact. The
phase records:

- affected runtime/data/domain/security/presentation boundary and canonical
  owner;
- root and nearest scoped `AGENTS.md` plus the applicable current technical
  authorities;
- only the constraints relevant to the phase;
- intended files/packages;
- required targeted checks;
- completion evidence.

Reference and resolve repository/scoped authorities instead of duplicating
their rules in the workflow. The selected phase determines the applicable
concerns: data ownership/schema/migration/isolation, service/domain trusted
boundaries and validation, UI component/client ownership, interaction/state
and accessibility behavior, or integration/regression evidence.

APPLY cannot start while a required owner, boundary, authority, or constraint
is unresolved. A phase completes only when both its implementation outcome and
its contract evidence exist. Any need to change a permission, contract, API,
canonical owner, cross-runtime behavior, or durable boundary returns to the
applicable Design/Product/authority gate.

## VERIFY

VERIFY asks: does repository implementation match the approved Specs and
Design?

Applicable evidence includes requirement/scenario mapping, targeted and broader
tests, typecheck, build, strict OpenSpec validation, architecture/security,
migration/schema evidence, scoped diff review, and deviations/blockers.

VERIFY includes a `TECHNICAL COMPLIANCE MATRIX` for every contract item in each
phase actually used:

```text
technical rule/constraint
-> authoritative source
-> affected implementation
-> test/check/evidence
-> PASS | FAIL
```

Do not add ceremonial rows for unused phases. VERIFY records
`TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` only when every applicable row
passes. `VERIFY: PASS` additionally requires implementation to match approved
Specs/Design with no unresolved critical issue. VERIFY never claims browser
UX, visual/responsive correctness, deployment, environment enablement, or
Production Readiness.

## QA

QA is independent of VERIFY and follows
[`YUTA_QA_PROTOCOL.md`](YUTA_QA_PROTOCOL.md). Before Gate 3, classify:

```text
UI_AFFECTING: YES | NO
BROWSER_QA_REQUIRED: YES | NO
```

QA status is exactly `PASS`, `FAIL`, `BLOCKED_BY_ENVIRONMENT`, or
`NOT_APPLICABLE`.

Visible UI, interaction, responsive layout, UI role/edit/read-only states,
loading/error/success presentation, or visual component behavior makes Browser
QA mandatory. Required evidence lives under:

```text
docs/reviews/<change-name>/qa/
├── QA_REPORT.md
├── screenshot-manifest.md
└── *.png
```

UI Browser QA uses the real/local route, page-pack viewport rules when present,
and actual hashed screenshots. Without page-specific rules, test at least
`1366x768` and `390x844`, adding an intermediate/tablet viewport when the
layout or target requires it.

## Gate 3 — Final independent review

Gate 3 contains separate `TECHNICAL VERIFY` and `QA` sections plus the
existing planning hashes, implementation attribution, scoped diff, tests,
deviations, and lifecycle truth.

A UI-affecting change is Gate 3-ready only when:

```text
TECHNICAL IMPLEMENTATION COMPLIANCE: PASS
VERIFY: PASS
QA: PASS
```

A non-UI change requires Technical Implementation Compliance PASS, VERIFY PASS,
and either applicable QA PASS or truthful `NOT_APPLICABLE`. Backend/database
correctness belongs to VERIFY through the applicable contract, migration,
schema, repository, tenant-isolation, authorization, and integration evidence;
it does not require meaningless Browser QA. `FAIL`, `BLOCKED_BY_ENVIRONMENT`,
missing responsive coverage, or missing hashed screenshot evidence cannot
produce a ready Gate 3.

Only a ready packet may recommend:

```text
APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY
```

That text is a recommendation, not approval or sync authorization.

## Hash integrity and invalidation

Every review approval is bounded to exact paths and SHA-256 hashes. Resume and
finish operations recompute all earlier reviewed path sets, planning artifacts,
implementation diffs, VERIFY evidence, and applicable QA/screenshot evidence.
The finish workflow also rechecks the reviewed Technical Compliance Matrix
source/hash and phase-contract completion.

Any reviewed addition, removal, rename, or byte change sets the affected packet
to `INVALIDATED_BY_ARTIFACT_CHANGE` and stops for re-review. Passing commands,
Git/PR state, packet existence, or prior assistant text never substitutes for
current-user approval.

## Sync, validation, and archive

After explicit Gate 3 approval and sync/archive authorization,
`$yuta-finish-change`:

1. rechecks Gate 3 readiness and every reviewed hash;
2. selects deltas only from `artifactPaths.specs.existingOutputPaths`;
3. captures pre-sync normative bytes;
4. performs the generated intelligent sync inline;
5. reviews the exact main-spec diff;
6. strictly validates main specs;
7. archives only after successful sync/validation and complete Tasks.

Sync is mechanical promotion after approval. Archive closes history; neither
promotes lifecycle, deployment, environment, provider, or readiness state.

### Finish-change branch isolation

Active-change finalization and archived Knowledge Review resume are distinct
branches with non-interchangeable preconditions and integrity checks.

- **Active-change finalization** requires an existing active change, Gate 3
  `AWAITING_HUMAN_REVIEW`, and explicit current-user final approval plus
  sync/archive authorization. It recomputes reviewed planning-artifact,
  implementation-diff, VERIFY-evidence, Technical Compliance, and applicable
  earlier-gate hashes before sync, validation, and archive.
- **Archived Knowledge Review resume** requires Gate 3 already `APPROVED`, a
  successfully recorded finish/archive and `Workflow status:
AWAITING_KNOWLEDGE_REVIEW`, no active change, the recorded archive, and an
  `AWAITING_HUMAN_REVIEW` Knowledge Review packet. It validates only the
  packet's target path set, target hashes, proposed-diff hash, and explicit
  current-user Knowledge Review approval before applying that exact
  documentation diff and closing `DONE`.

The archived-resume branch never requires Gate 3 to be awaiting review, never
reruns active-change planning/implementation/VERIFY integrity approval checks,
and never repeats sync or archive.

## Knowledge Consolidation

After archive, follow
[`YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`](YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md).

- `NO_UPDATE_REQUIRED`: record reason and inspected sources, classify release
  follow-up, and close `DONE`.
- `UPDATE_REQUIRED`: create
  `docs/reviews/<change>/04-knowledge-consolidation-review.md` with exact
  proposed diff and target/diff hashes, then stop without editing canonical
  knowledge.
- After explicit Knowledge Review approval, recheck hashes, apply only the
  approved documentation diff, run documentation/architecture validation, and
  close `DONE`.

Knowledge Consolidation cannot approve Product Decisions, change durable
boundaries, ownership or permissions, promote lifecycle/readiness, rewrite
normative specs, or resolve `NEEDS REVIEW` by assumption.

## Release/deploy lane

After `DONE`, classify `RELEASE_FOLLOW_UP` as `NOT_REQUIRED`, `REQUIRED`,
or `UNKNOWN`. If required, report runtime/environment, deployment/readiness
evidence, and post-deploy verification needs.

The repository workflow never deploys automatically:

```text
IMPLEMENTED != PRODUCTION_ENABLED
```

## Failure behavior

Stop on ambiguous approval, hash drift, unresolved authority, missing sensitive
Design approval, non-isolatable diffs, VERIFY failure, required QA failure or
environment block, failed/partial sync, unexpected main-spec diff, failed
validation/archive, or pending Knowledge Review.

Technical defects inside approved behavior may be fixed and VERIFY/QA rerun.
Product or durable-boundary decisions always return to human review.
