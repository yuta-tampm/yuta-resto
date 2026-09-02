# YUTA Workflow v3 Update Report

Status: APPROVED

Visibility: Engineering

Owner: YUTA product and engineering

Date: 2026-09-01

## Scope and provenance

This infrastructure-only update implements
`docs/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md`. It changes only the two
project-owned YUTA skills and the workflow/review protocol documents authorized
by that task. It creates no OpenSpec change and does not modify product code,
generated `openspec-*` skills, OpenSpec schema/config, normative specs, or any
active/archived product change.

The approved follow-up correction adds phase-level technical compliance to
APPLY/VERIFY without creating a new OpenSpec artifact or copying repository
rules into workflow text.

This final branching correction changes only `yuta-finish-change` and its two
workflow/report descriptions. `yuta-run-change` remains byte-for-byte
unchanged by this correction.

Provenance HEAD: `01e6ca74186f5cda389f5ca8c0700274b29d18d0`.

## 1. Exact skill changes

### `.agents/skills/yuta-run-change/SKILL.md`

- preserves Gate 1, Gate 2, conditional sensitive Design Gate, Gate 3,
  adoption, approval, and SHA-256 invalidation behavior;
- adds conditional pre-change Discovery / Shaping without inventing a mandatory
  OpenSpec artifact;
- requires change-specific phased Tasks and dependency-ordered Apply;
- embeds a Technical Implementation Contract in each phase actually used;
- resolves applicable repository/scoped technical authorities rather than
  duplicating them;
- separates technical VERIFY from QA;
- records `UI_AFFECTING` and `BROWSER_QA_REQUIRED`;
- requires responsive Browser QA and hashed screenshot evidence for UI changes;
- prevents a ready Gate 3 unless VERIFY and applicable QA satisfy v3.

### `.agents/skills/yuta-finish-change/SKILL.md`

- preserves explicit Gate 3 approval plus sync/archive authorization;
- preserves integrity recheck, selected-delta sync, strict main-spec validation,
  and synchronous archive;
- requires Gate 3 Technical Implementation Compliance and its reviewed matrix
  evidence to remain `PASS` before finalization;
- adds post-archive Knowledge Consolidation;
- closes `NO_UPDATE_REQUIRED` as `DONE`;
- creates and stops at a conditional Knowledge Review for `UPDATE_REQUIRED`;
- supports approved Knowledge Review resume against an archive without
  recreating an active change;
- isolates active-change finalization from archived Knowledge Review resume so
  their preconditions and integrity checks cannot leak across branches;
- keeps release/deploy outside repository closure.

## 2. Phased implementation behavior

Tasks use only the phases needed by the approved change:

- `Foundation / Data`;
- `Service / Domain`;
- `UI / Components`;
- `Interaction / States`;
- `Integration / Regression`.

They are planning labels rather than mandatory stages. Every included phase has
verifiable checkbox outcomes, runs in dependency order, and remains behind the
existing sensitive Design Gate when durable boundaries are involved.

Each selected phase now embeds a `TECHNICAL IMPLEMENTATION CONTRACT` inside the
existing Tasks / Implementation Plan. It records affected boundary and owner,
applicable authority paths, resolved constraints, intended files/packages,
targeted checks, and completion evidence. It is not a new OpenSpec artifact.
Unused phases receive no ceremonial contract.

APPLY cannot begin through an unresolved technical owner, boundary, authority,
or constraint. A phase completes only when implementation and contract evidence
both exist. A required permission, contract, API, ownership, cross-runtime, or
durable-boundary change returns to its applicable review gate.

## 3. VERIFY and QA separation

VERIFY now assesses repository conformance to approved Specs/Design through
requirements mapping, tests, typecheck/build, strict OpenSpec validation,
architecture/security, migration/schema evidence, and scoped diff review. It
does not claim browser, visual, responsive, deployment, environment, or
readiness results.

VERIFY now also produces a `TECHNICAL COMPLIANCE MATRIX` mapping every
applicable phase constraint to its authoritative source, affected
implementation, check/evidence, and `PASS`/`FAIL`. VERIFY can pass only when the
matrix yields `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` and implementation
matches approved Specs/Design.

QA independently records runtime/user-facing evidence with the exact status
enum `PASS`, `FAIL`, `BLOCKED_BY_ENVIRONMENT`, or `NOT_APPLICABLE`.

## 4. UI Browser QA rule

Visible UI, interactions, responsive layout, UI role/edit/read-only state,
loading/error/success presentation, or visual component behavior sets
`UI_AFFECTING: YES` and makes Browser QA mandatory. Environment blocks remain
visible and prevent a ready Gate 3.

## 5. Screenshot evidence protocol

UI evidence lives under `docs/reviews/<change>/qa/` with `QA_REPORT.md`,
`screenshot-manifest.md`, and actual browser screenshots. The manifest records
path, viewport, role/state, scenario, and exact SHA-256. Page-pack viewports
take precedence; otherwise desktop `1366x768` and mobile `390x844` are the
minimum, with tablet/intermediate coverage when meaningful.

Screenshots remain QA evidence and never become Product, permission, schema,
persistence, ownership, or lifecycle authority.

## 6. Gate 3 readiness

Gate 3 now contains separate `TECHNICAL IMPLEMENTATION COMPLIANCE`,
`TECHNICAL VERIFY`, and `QA` sections. Every change requires Technical
Implementation Compliance PASS and VERIFY PASS. UI-affecting changes also
require QA PASS, responsive coverage, and intact screenshot hashes before the
workflow may recommend:

```text
APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY
```

The recommendation is not approval or sync authorization.

Backend/database changes do not receive meaningless Browser QA. Their technical
correctness is established in VERIFY through the selected phase contracts and
applicable schema, migration, repository, tenant-isolation, authorization, and
integration evidence.

## 7. Knowledge Consolidation

After archive, the workflow inspects only current knowledge sources materially
affected by completed evidence and classifies exactly `NO_UPDATE_REQUIRED` or
`UPDATE_REQUIRED`. The scan does not assume every change needs documentation
edits and cannot promote Product Decisions, durable boundaries, ownership,
permissions, lifecycle/readiness, or normative specs.

## 8. Conditional Knowledge Review Gate

`UPDATE_REQUIRED` creates
`docs/reviews/<change>/04-knowledge-consolidation-review.md` with exact evidence,
targets, authority classification, proposed diff/replacement text, target
hashes, and proposed-diff hash. Canonical knowledge is untouched until explicit
approval. Drift invalidates approval; only the exact approved diff may be
applied before `DONE`.

## 9. Branch-specific finalization integrity

Active-change finalization requires Gate 3 `AWAITING_HUMAN_REVIEW`, explicit
current-user final approval plus sync/archive authorization, and recomputation
of the reviewed planning, implementation-diff, VERIFY, Technical Compliance,
and applicable earlier-gate hashes before sync, validation, and archive.

Archived Knowledge Review resume instead requires Gate 3 already `APPROVED`, a
successfully recorded finish/archive, `AWAITING_KNOWLEDGE_REVIEW`, no active
change, the recorded archive, and an awaiting Knowledge Review packet. It does
not rerun active-change integrity approval checks. It validates only the
Knowledge Review target path set, target hashes, proposed-diff hash, and
explicit current-user approval before applying the exact approved documentation
diff, validating documentation/architecture, and recording `DONE`.

## 10. Release/deploy separation

Repository closure classifies `RELEASE_FOLLOW_UP` as `NOT_REQUIRED`, `REQUIRED`,
or `UNKNOWN`. Deployment and post-deploy verification remain separate
authorized operational work:

```text
IMPLEMENTED != PRODUCTION_ENABLED
```

## 11. Protected files unchanged

Pre/post SHA-256 aggregate comparisons are exact:

| Protected scope                          | File count | Aggregate SHA-256                                                  |
| ---------------------------------------- | ---------: | ------------------------------------------------------------------ |
| `openspec/config.yaml`                   |          1 | `d8d2b2aefd4b52e48d3e419b94234460a158820ab3aeb3325ced92d9d4965d8a` |
| `openspec/schemas/**`                    |          6 | `c1e85e74c8675d586c5542a618b567a102650ce036a0e564e570832db4ccdc3a` |
| `.agents/skills/openspec-*/**`           |          9 | `c2a8d3568e75654309e01e3f694454309339ae12c90d65c788b8e0befbb9f970` |
| `openspec/specs/**`                      |          5 | `de609e281dee06418ced94a466802be1d0cc45d0b74968e8987b968797649330` |
| `openspec/changes/**`                    |         30 | `124bea08ddebc449342b2f7402d83b4689d150d69c73457684653138d1833e4d` |
| `apps/**` and `packages/**` product code |      1,132 | `27d40d5a2c300fadcbddccb1852092976d5cc722ce0c1a06b73bb8bda6e2f4a8` |

No active or archived product change was created, resumed, or modified.

## Validation

- both YUTA skill frontmatter/name/description/TODO/discoverability checks:
  PASS;
- the bundled `quick_validate.py` was attempted but its host Python lacks
  `PyYAML`; no repository dependency was installed to bypass the scope;
- workflow-v3 invariant audit: PASS after correcting one stale state heading;
- finish-change branch-isolation invariant audit: PASS for separate active
  finalization and archived Knowledge Review resume preconditions, hash scopes,
  authorization, and mutation boundaries;
- Technical Implementation Contract and Compliance Matrix invariant audit:
  PASS;
- `pnpm docs:check`: PASS, 36 current documents;
- `pnpm architecture:check`: PASS;
- `pnpm -r --if-present typecheck`: PASS across 15 participating workspaces;
- targeted Prettier for every changed/created v3 file: PASS;
- `git diff --check`: PASS, with line-ending notices only;
- repository-wide `pnpm format:check`: FAIL on 56 pre-existing/out-of-scope
  files, including generated skills, archived/task documents, schema templates,
  the user-supplied v3 task, and an existing normative spec. None was rewritten.

## 12. Recommendation

```text
READY_TO_USE_WORKFLOW_V3
```

Status: APPROVED
