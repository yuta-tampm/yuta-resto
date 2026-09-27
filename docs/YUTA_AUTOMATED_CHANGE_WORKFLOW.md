# YUTA Automated Change Workflow v3

Status: APPROVED

Visibility: Engineering

Owner: YUTA product and engineering

Workflow routing: Start with [`YUTA_WORKFLOW_V3.md`](YUTA_WORKFLOW_V3.md), the
canonical human-readable YUTA Workflow v3 operating guide. This document is the
detailed supporting automation/workflow protocol.

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
  -> DESIGN                                         when applicable
  -> SENSITIVE DESIGN GATE                           conditional
  -> TASKS + PHASED IMPLEMENTATION PLAN
  -> APPLY
  -> VERIFY
  -> QA
  -> GATE 3 — FINAL INDEPENDENT REVIEW
  -> HUMAN APPROVAL + EXPLICIT SYNC/ARCHIVE AUTHORIZATION
  -> $yuta-finish-change                             existing orchestrator
  -> SYNC NORMATIVE SPECS OR VALID NO-SPEC FINALIZATION
  -> VALIDATE MAIN SPECS                             when applicable
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

For a new change, record one concise `REQUIREMENT_BASELINE` in the existing
Proposal/Analysis and expose it at Gate 1: sourced, authority-reconciled
`AUTHORITATIVE_USER_REQUIREMENT`, `HARD_CONSTRAINTS`, `OUT_OF_SCOPE`, and
observable `SUCCESS_OUTCOMES`. Use `NONE` with a reason for a genuinely empty
constraint or exclusion; do not invent one. This adds no artifact or gate.
Later Design/Tasks approval cannot silently amend the baseline. A material
change needs an explicit current-user decision at the owning gate and normal
path/hash re-review. Preserve already approved history without backfilling a
baseline into its old bytes.

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

The only prospective exception is for the **new post-Apply development
checkpoints** below. Their adoption event is successful human-authorized
finalization and archive of `development-usability-and-iteration-control` after
its canonical workflow edits have been applied and successfully verified. Do
not infer adoption from a calendar date, file timestamp, partial edit, or
planning approval. This governance change itself remains on the pre-adoption
workflow through its own archive and does not recursively require its new
checkpoints or iteration ledger.

At that event, DONE/archived and completed no-spec work is grandfathered with
immutable historical evidence. Active changes not yet in Apply must use the
new checkpoints when applicable. Active changes already in Apply/VERIFY/QA do
not automatically rewind; an explicit human opt-in for the named change/scope
is required. New changes after the event use the new checkpoints when they
reach post-Apply. Record the event or opt-in reference in Tasks only when the
new checkpoints are required or explicitly opted in; do not backfill a
grandfathered change. If the target's phase at the event cannot be established
from existing evidence, stop
`NEEDS_REVIEW` instead of reconstructing history. All earlier-gate and hash
integrity rules continue unchanged.

## Conditional Design and persisted omission

Evaluate Design against its current schema instruction and approved scope:
architecture/cross-cutting impact, data/runtime ownership, security/authorization,
migration/destructive data, significant dependency/provider,
significant performance/operational complexity, and unresolved technical
decisions. If applicable, create/use meaningful Design normally. Sensitive
Design Gate applicability is a separate human-review classification; omission
must never bypass a required sensitive gate. Preserve pre-existing Design.

When none apply, the approved YUTA controlled adapter exception permits Tasks
only when Design is the sole deliberately omitted dependency and every other
prerequisite and earlier human gate is satisfied. Retrieve current Tasks
instructions even if raw status is blocked. Do not use Continue as an implicit
bypass, run Propose across unapproved gates, or create a placeholder Design.

Persist this bounded evidence in the existing `tasks.md` before Apply:

```text
DESIGN APPLICABILITY
Status: NOT_APPLICABLE
Reason: <bounded rationale for this approved scope>
Applicability criteria checked:
- architecture / cross-cutting impact: <finding>
- data/runtime ownership: <finding>
- security/authorization: <finding>
- migration/destructive data: <finding>
- significant dependency/provider: <finding>
- significant performance/operational complexity: <finding>
- unresolved technical decision: <finding>
Authority / evidence: <exact sources and approved scope/spec references>
Expected artifact state: design.md intentionally absent
```

Use actual findings, not unchecked labels or unresolved assumptions. This block
is planning evidence, not an implementation checkbox, new artifact, or approval.
At Gate 3, expose its rationale, source, exact Tasks path/SHA-256, and resolved
expected-absent Design path. Before Gate 3, preserve the omission block and its
scope; normal task progress is not permission to revise that evidence.

On resume with Tasks already present, never infer omission from missing Design.
Require the persisted block, re-evaluate against current approved scope/specs,
and check all applicable reviewed hashes and expected absence. Missing, drifted,
invalidated, or newly inapplicable omission evidence stops at the appropriate
planning/review point; revise only with authorization. Design addition or any
reviewed rationale, applicability, or Tasks-evidence change invokes normal
review invalidation. On first arrival at Design with no Tasks yet, record the
fresh justified omission while creating Tasks; this is not retrospective repair
of an adopted/resumed change.

Report `RAW OPENSPEC STATUS` separately from `YUTA OPERATIONAL READINESS`.
The graph still requires Design: before Tasks exists it may report Tasks
blocked; afterward Tasks may be done while Design remains ready and
`isPlanningComplete: false`. This is not native conditional skip support.
Branch A may recognize only that exact reviewed omission as the known
incomplete-planning/archive-warning exception, after integrity and scope checks.
Record any warning and its bounded acceptance in Gate 3; unrelated incomplete
work still blocks finalization. Historical warning acceptance is not reusable
authorization. Branch B's archived Knowledge Review checks remain isolated.

`skip_specs: true` does not skip Design. Evaluate independently: no-spec plus
applicable Design proceeds through Design; no-spec plus justified omission
proceeds to Tasks. Only Gate 2 and normative promotion are omitted because of
`skip_specs`; all other applicable gates, verification, and QA remain.

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

Before proposing a new subsystem, major dependency, or replacement for a
Codex/platform capability, compare it with the reviewed requirement baseline
and the smallest approved acceptance path. Platform transport, repository and
terminal access are available capabilities, not automatic proof of YUTA
authorization, observation or QA. A conflicting or material scope expansion
stops for the exact owning Human decision; bounded read-only diagnosis may
establish necessity, but does not authorize the new implementation.

After the applicable planning and Apply scope are approved, implement rather
than repeat broad planning. Classify a FAIL against the approved requirement,
Design, contract and observed evidence. Correct an implementation defect within
approved scope and run affected checks. Reopen Design only when evidence shows
that approved acceptance cannot be met, scope/authority must change, or a
named material safety invariant is violated; record why local correction is
insufficient. Ordinary deterministic mechanics do not create a new Human Gate.
Prioritize the smallest usable product path that meets approved outcomes and
mandatory safety/evidence. Do not repair Windows, Linux, platform internals,
third-party libraries or speculative cross-platform behavior as part of a
product task unless evidence shows a direct blocker. Diagnose briefly; if the
repair changes scope or authority, stop for the owning Human decision. Record
nonblocking limitations and deferred hardening separately.
Report the requested observable outcomes with actual evidence separately from
task counts and from Technical Compliance, VERIFY and QA. Preserve historical
FAIL/BLOCKED records until a new, attributable reassessment exists.

### Conditional post-Apply development feedback

Within the existing Apply path, before formal Technical Implementation
Compliance/VERIFY/QA, assess `DEV_USABLE` and `MANUAL_TEST_READY` separately.
They are assertions, not stages, gate approvals or QA statuses. A change to
which the prospective policy applies keeps the durable
`POST_APPLY_DEVELOPMENT_FEEDBACK` section in its existing `tasks.md`; no
database, new OpenSpec artifact or review gate is created. Gate 3 hashes the
current Tasks as a planning artifact under the existing integrity rule, but
manual Product feedback is not Gate 3 evidence or a substitute for Technical
Compliance, VERIFY or QA.

The section records `Adoption: REQUIRED | GRANDFATHERED | OPTED_IN` and its
event/opt-in evidence, the exact current candidate and scoped diff/revision
reference, and for **each** assertion: `applicability: YES | NO`,
`result: PENDING | YES | NO | NOT_APPLICABLE`, tested scope/entry point,
local/dev environment/runtime, observation or N/A reason, and blocker reference
when `NO`. `PENDING` is the operational pre-assessment marker, never a fourth
assessed value. `applicability: NO` pairs with `NOT_APPLICABLE` and a bounded
reason; a real flow blocked by absent setup gets `NO`, not N/A. Evidence must
identify the candidate and actual observation; do not invent a reviewer or
approval timestamp. Keep old candidate/decision history when updating the
record, and mark changed candidate assessments stale/pending until reassessed.

`DEV_USABLE = YES` requires that an applicable feature can actually be used
safely through its intended real local/dev boundaries with appropriate
dev/test data and identity. A build or typecheck alone cannot establish it.
`MANUAL_TEST_READY = YES` requires a human-usable handoff with command/runtime,
route/entry point, safe dev/test data, test identity or credential reference
when needed (never store a secret), expected basic flow, reset/retry steps and
known dev-only limitations. Missing required setup is a `NO` blocker. This
handoff prepares Product/manual testing; it is not Browser QA evidence,
Technical Compliance, VERIFY, Gate 3 evidence or production authorization.
An applicable `PENDING` or `NO` leaves post-Apply work open; do not advance by
assigning a false N/A. Record the separate reason for each genuine N/A.

Determine applicability from approved scope and the real as-built flow, not
from `UI_AFFECTING` alone:

| As-built change                                           | Development assertions                                                                          | Human Product validation                                         |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Interactive UI                                            | Both apply on the real local/dev route.                                                         | Applies to the candidate/flow.                                   |
| Interactive non-UI service, CLI or endpoint               | Apply when a real manual dev flow exists; no browser UI is not N/A.                             | Applies when Product/operator behavior requires human judgement. |
| Pure deterministic library without an operable flow       | Both may be `NOT_APPLICABLE` with distinct reasons.                                             | Not applicable; technical tests/VERIFY remain.                   |
| Docs/governance only without an interactable runtime flow | Both may be `NOT_APPLICABLE` with distinct reasons.                                             | Not applicable; semantic review/VERIFY remain.                   |
| Infrastructure only                                       | Assess actual local/dev setup or probe: applicable when human-operable, otherwise reasoned N/A. | Applies only for interactive Product/operator behavior.          |

The two assertion results may differ; record independent scope/reason for each.
Missing provider, environment, data or permission cannot convert an existing
flow into N/A. Reassess applicability if approved scope materially changes.

For an applicable interactive Product flow, record
`HUMAN_PRODUCT_VALIDATION` with candidate/scope, handoff reference, actual human
decision source/time, feedback, disposition and whether another human look is
required. Before human action use `AWAITING_RESPONSE`, not a fourth verdict.
The only verdicts are `ACCEPTED | CHANGES_REQUESTED | BLOCKED`. `ACCEPTED` is
not QA PASS, VERIFY PASS, Gate 3 approval or Production Readiness. A changed
candidate retains its prior verdict as history and awaits a fresh human look
where the affected flow changed.
`AWAITING_RESPONSE`, `CHANGES_REQUESTED` and `BLOCKED` leave the current
candidate's Product feedback unresolved; continue only after the relevant
disposition and required human relook. Formal VERIFY and QA remain independent.

Classify `CHANGES_REQUESTED` against the approved Proposal/Analysis, Specs when
present, Design, Tasks/TIC and owning Product/authority source. A
`LOCAL_CORRECTION` may change implementation only while preserving approved
requirements, Product scope, authorization/role/permission, schema,
API/contract, data ownership, business semantics, sensitive durable boundaries
and acceptance criteria. Copy, layout, focus, loading or labels are not
automatically local. Record the classification and exact candidate/diff; make
the bounded correction, run targeted checks, update affected assertions,
request affected human retest and wait for the new verdict. If any approved
boundary must change or authority is unclear, record
`SCOPE_CHANGE_REQUIRES_REVIEW` and stop at the owning Product/authority/Design
gate. Repeated failure of the same blocker follows the iteration ledger below;
the feedback loop supplies no unlimited retry budget.

`DEV_USABLE != PRODUCTION_READY`. Local/dev usability may be `YES` while
production remains blocked. Release, Deploy, legal/staging and Production
Readiness stay with their existing operations authority; no
`PRODUCTION_READY` development stage or lifecycle value is introduced.

### Iteration accounting and stop handoff

The existing [Control Tower anti-loop/evidence-stop rule](chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md)
owns the decision. This section defines the workflow record and counting
mechanics; Page Chat/handoff carry facts, and the run skill will execute them
after adoption. `ITERATION_STOP_CONTROL` is conditional inside the affected
gate, not Gate 4, a stage, QA status or a parallel anti-loop authority.

Keep an `ITERATION_STOP_CONTROL` ledger in the same Tasks section when a
blocker/retry exists; otherwise record `NONE` with reason. One stable lineage
ID denotes `(affected claim, blocker class, evidenced causal root cause)`.
Stage and evaluator purpose describe each occurrence, not automatic new
identity. Unknown cause is `PROVISIONAL` with evidence; reconcile occurrences
when cause becomes known, retaining counts/history. Wording, wrapper rename,
or orchestration restart cannot reset a lineage. A newly proven Product or
implementation defect is a separate evidenced finding/remediation, not a
renaming device for an exhausted blocker.

Each occurrence records stage, evaluator purpose and material equivalence,
action/preflight, actual execution, observation/evidence, resulting blocker,
last material outcome, cumulative recovery count for its lineage and execution
generation count for its `(lineage, stage, materially same evaluator purpose)`
bucket. A material change of stage/purpose may open a new generation bucket
with its rationale, while prior lineage and recovery history remain visible.
The defaults are `MAX_RECOVERY_ATTEMPTS = 2` per causal lineage and
`MAX_EXECUTION_GENERATIONS = 3` per bucket; generation 1 is the first actual
execution. No agent may self-authorize extra budget.

| Event                                                         | Recovery attempt                                                                                 | Execution generation                                                                        |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| First actual evaluator/browser/runtime/evidence run           | No increment                                                                                     | Increment to 1, whether success or failure.                                                 |
| Later actual successful or failed equivalent run              | Increment only if it follows an actual corrective action **and** the same causal blocker remains | Increment once for the run.                                                                 |
| Read-only diagnosis                                           | No increment                                                                                     | No increment unless it actually executes the equivalent evaluator process for the claim.    |
| Rejected preflight before evaluator execution                 | No increment                                                                                     | No increment.                                                                               |
| Corrective action resolves blocker on subsequent observation  | No increment                                                                                     | Count the observation run if the evaluator actually executes.                               |
| Corrective action followed by observation of the same blocker | Increment once for the action/observation pair                                                   | Count the actual observation run once.                                                      |
| Proven new defect                                             | Preserve old lineage count                                                                       | Preserve old bucket count; establish a separate evidenced finding.                          |
| Stage/purpose transition or wording-only change               | Never reset lineage count                                                                        | New bucket only for materially different stage/purpose; mere renaming keeps the old bucket. |

Stop before another default retry when either applicable budget is exhausted;
also stop earlier if retry is unsafe or evidence shows no useful progress.
Before another materially equivalent planning/review or evaluator round, state
what changed, what new executable evidence the round can produce, and which
decision it can affect. Two consecutive planning reconciliations for the same
objective without new executable evidence trigger one convergence assessment
inside the affected existing gate: proceed with the already authorized smallest
implementation, or stop with the exact missing decision. This is an early-stop
signal, not a new gate, counter, automatic Apply authorization, or replacement
for the lineage budgets above. Stop work when the requested outcomes and
mandatory evidence are met; defer speculative hardening separately.
Record lineage/claim/class/cause confidence, current stage/purpose/bucket,
chronological actions and executions, counts, affected acceptance/evidence
obligation, last outcome, mandatory-evidence status and a bounded handoff with
`human decision: PENDING`. The human decision must be exactly `FIX`,
`ACCEPT_LIMITATION`, `SPLIT_CHANGE` or `DEFER_OR_CLOSE`, with source and scope.
`FIX` requires an established Product/implementation defect and bounded
remediation; `SPLIT_CHANGE` requires a genuinely independent workstream and
cannot erase a still-mandatory dependency; `DEFER_OR_CLOSE` retains truthful
incomplete history. An exception to either budget needs an
explicit human instruction with extra bounded count, purpose and stop
condition; do not alter prior counters.

`ACCEPT_LIMITATION` may record `KNOWN_EVIDENCE_LIMITATION` only when approved
acceptance criteria permit a bounded limitation for the affected claim. Record
the criterion, actual missing/partial evidence, residual risk and human
disposition separately from observed results. It creates no PASS, cannot turn
FAIL/BLOCKED/`BLOCKED_BY_ENVIRONMENT` into PASS, waive mandatory Browser
QA/security/legal/payment/fiscal evidence, rewrite history or weaken criteria.
When current gate criteria still require missing evidence, that gate remains
blocked. Formal QA vocabulary, Technical Compliance, VERIFY and Gate 3
readiness remain independent.

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

## External advisory evidence routing

Apply [External Design Intelligence](ui/EXTERNAL_DESIGN_INTELLIGENCE.md) to the
existing Analysis/Tasks usage record and TECHNICAL VERIFY evidence block.
Keep classification errors, required-tool blockers, exact provenance and finding
dispositions explicit; do not change phase/gate order or approved artifact bytes.

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
