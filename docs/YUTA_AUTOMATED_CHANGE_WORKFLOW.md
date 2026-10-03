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
consolidation. Approval remains mandatory at Product/authority, requirements,
sensitive-design, final-review, and conditional knowledge-review boundaries.
Its source follows the selected task collaboration mode below.

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
  -> MODE-DEFINED APPROVAL + BOUNDED SYNC/ARCHIVE AUTHORIZATION
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

`$yuta-run-change` starts or resumes an active change and reaches each review
boundary in order. It owns conditional Discovery/Shaping, planning artifacts,
Gates 1 and 2, the conditional Design Gate, phased Tasks/Apply, VERIFY, QA, and
Gate 3. It never syncs or archives normative specs.

`$yuta-finish-change` requires exact Gate 3 approval plus bounded sync and
archive authorization under the selected mode. It rechecks reviewed hashes, syncs selected deltas,
validates main specs, archives synchronously, and performs Knowledge
Consolidation. It also resumes an approved Knowledge Review for an already
archived change without recreating an active change.

Reviewers remain independent. Delegated review cannot invent Product Intent,
resolve authority conflicts by assumption, infer permission, or promote
lifecycle/readiness.

## Task collaboration and delegated review

This section implements [ADR-008](decisions/ADR-008-task-collaboration-and-delegated-review.md)
as the canonical operating policy for the current user's
2026-10-01 decision: each new task asks for Codex alone, Codex with the user,
Codex with an optional CT through Bridge, or Codex with both the user and CT.
The user also requested a separate per-task choice to commit after completion.
The user explicitly delegated
routine gate progression in the assigned scope to Codex with independent review,
asking for Human input only for scope/authority changes or actions requiring
separate confirmation. This delegation changes review routing, not gate order,
acceptance criteria, evidence, protected boundaries or historical truth.

Before task execution, ask for exactly one mode unless the request already
selects it. No timeout or preselected UI option is a submitted choice. Bounded
read-only intake may prepare the choice; do not create a change, mutate sources,
run an evaluator or contact CT before the choice. A clarification, continuation,
new stage or resume of the same task retains its mode. A new independent goal
asks again. A change of mode requires an explicit current-user instruction.

| Choice                                    | Recorded mode         | Coordination and review                                                                                                                                                           |
| ----------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Codex alone                               | `CODEX_ONLY`          | Codex coordinates and progresses routine gates after separate independent review; no CT contact or routine Human review request.                                                  |
| Codex with the user                       | `HUMAN_COLLABORATION` | Codex coordinates; the user participates in shaping and explicitly approves the applicable gates.                                                                                 |
| Codex with CT through Bridge              | `CT_BRIDGE`           | Codex coordinates with the exact user-selected CT; routine gate review uses the same delegation as Codex alone. CT advice and bridge commands are not approvals.                  |
| Codex with the user and CT through Bridge | `HUMAN_CT_BRIDGE`     | Codex coordinates with the user and exact selected CT; the user participates in shaping and explicitly approves applicable gates. CT provides advice through the verified Bridge. |

Human collaboration modes are `HUMAN_COLLABORATION` and `HUMAN_CT_BRIDGE`;
CT-enabled modes are `CT_BRIDGE` and `HUMAN_CT_BRIDGE`. The delegated modes
remain only `CODEX_ONLY` and `CT_BRIDGE`; adding Human and CT together does not
delegate the Human's gate decision to CT or the author.

Ask the separate commit question in the same intake: commit after this task
(`YES`) or leave its changes uncommitted (`NO`), unless already explicitly
answered. Record `COMMIT_AFTER_TASK: YES | NO | NOT_SELECTED` and the actual
`COMMIT_SELECTION_SOURCE`. Silence or a preselected option remains
`NOT_SELECTED`; it grants no Git mutation. Authorized task work may proceed
while this independent preference is pending, but staging/commit may not.

Record `COLLABORATION_MODE`, the actual `MODE_SELECTION_SOURCE`, task goal,
bounded scope/phase, hard constraints and exclusions in the existing task
context. Carry that record into Proposal/Analysis, Tasks and review packets
as they are normally created; do not add a mandatory artifact. Child/reviewer
work inherits this task selection and does not ask the mode question again.
Commit choice and its source also persist across follow-ups, gates and resume;
child/reviewer work inherits them without another question. A change to either
choice requires an explicit current-user instruction. Existing tasks do not
gain commit authorization from adoption of this policy.
Mode selection delegates decisions only needed for the requested outcome:
a read-only, planning-only or phase-bounded request stays so bounded. Normal
spec sync, archive and Knowledge Consolidation are included only when the
user's task requests complete repository delivery of the named change.

Codex reads canonical repository sources, maps owners/consumers and runtime/data
boundaries, classifies `PAGE_LOCAL | CROSS_MODULE | UNCERTAIN`, and proposes one
coordinated change or bounded dependent changes. Cross-module impact requires
this analysis, not a mandatory CT chat. Unresolved Product direction, missing
authority, conflicts, a material scope/permission/ownership/durable-boundary
change, a budget exception, or a separately confirmed action still requires the
current user's decision. Do not create a speculative answer or broaden scope
because a mode was selected. Local commit requires its separately selected
`COMMIT_AFTER_TASK: YES` and the procedure below. Push/PR/merge, deployment/release,
production enablement, destructive operations and live Project settings remain
outside routine repository delegation and need their own authorization.

### Independent gate approval

For `CODEX_ONLY` or `CT_BRIDGE`, prepare the same exact review packet, hashes,
criteria and evidence that the applicable gate requires. Use
`Review status: AWAITING_INDEPENDENT_REVIEW`, then request a separate read-only
reviewer agent with a fresh context (`fork_turns: "none"` when using
`spawn_agent`) containing the sourced requirement,
delegation/scope, canonical authorities, exact candidate paths/hashes and
evidence. Do not supply the author's reasoning as the review conclusion. The
reviewer must inspect the candidate independently and return `APPROVED`,
`CHANGES_REQUESTED` or `BLOCKED`, with findings and exact reviewed identities.
Review is not implementation or permission to write. The author may never
replace a missing reviewer with self-review. If the reviewer is unavailable,
report the blocker and ask for a bounded alternative.

After an `APPROVED` verdict, recheck every reviewed path/hash before recording:

```text
Review status: APPROVED
Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW
Mode selection source: <actual current-user instruction and bounded task>
Independent reviewer: <actual agent/context identity>
Independent review evidence: <verdict, findings and exact path/hash references>
Approval recorded by: Codex workflow
Approved: <actual timestamp>
```

This is delegated approval, never a fabricated Human verdict. Human-only
examples and stop/resume instructions in the supporting workflows apply to
`HUMAN_COLLABORATION`, `HUMAN_CT_BRIDGE` and preserved historical records. In delegated modes,
the corresponding routine gate awaits independent review instead of a Human
reply, then continues only after the procedure above. Required evidence and
earlier-gate/hash checks remain unchanged. A changed candidate invalidates its
review and needs a fresh independent verdict; an unresolved authority decision
cannot be bypassed by reviewer approval. Reviewer-requested corrections inside
scope may be implemented and re-reviewed under the existing iteration limits.

Gate 3 needs an independent verdict on the exact completed candidate. When
full repository completion is within the recorded task scope, it must also
identify the exact deltas/main-spec paths or valid no-spec branch and record
`Sync authorization: AUTHORIZED_BY_USER_DELEGATION`. Only then may the
orchestrator call `$yuta-finish-change`; run-change itself still performs no
sync/archive. Knowledge Review separately needs its exact proposed diff,
target hashes and an independent verdict under that same bounded task. Prior
Gate 3 approval alone never authorizes an unrelated knowledge update.

`HUMAN_COLLABORATION` and `HUMAN_CT_BRIDGE` retain explicit current-user approvals and the existing
`AWAITING_HUMAN_REVIEW`/`AUTHORIZED_BY_CURRENT_USER` records. In every mode,
actual Human/Product/external decisions remain attributable to their real
source. CT cannot approve on the user's behalf.

### Manual Product feedback and adoption

`DEV_USABLE` and `MANUAL_TEST_READY` remain applicable evidence assertions in
every mode. In `CODEX_ONLY` and `CT_BRIDGE`, optional manual Product feedback
is recorded `HUMAN_PRODUCT_VALIDATION: NOT_REQUESTED` with mode, candidate and
reason unless the user requests it or approved acceptance requires a Human
observation. `NOT_REQUESTED` is an unassessed participation marker, not an
`ACCEPTED` verdict, QA status, PASS or waiver. A mandatory Human/provider/legal
observation still blocks until obtained. Both Human collaboration modes retain the
candidate-bound manual feedback path. Any actual Human feedback in any mode
follows the existing local-correction/scope-change and retest rules.

This policy applies prospectively to new tasks after the authorized policy
edit is applied and verified. Preserve existing task mode, approvals, FAIL/
BLOCKED, counters and archived evidence. An active pre-transition change needs
an explicit current-user mode selection/opt-in before delegated progression;
do not rewrite earlier Human approvals or retroactively manufacture reviews.
The current governance-edit conversation continues its already authorized
Human collaboration; this edit does not start or approve another change.

### Claude Code implementation delegation

This subsection is the canonical procedure for
[ADR-010](decisions/ADR-010-claude-code-implementation-delegation.md). Within a
task's selected mode, Codex may assign bounded implementation to Claude Code.
Claude is an implementation role, not a fifth collaboration mode, an approval
source or a global replacement for Codex identity, runtime or skill markers.

| Actor                               | Responsibility                                                                                                                                                                |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Codex (task orchestrator)           | Discovers the repository, defines requirements and approved planning, prepares handoffs, coordinates workers, reviews integration, verifies findings and integrates the task. |
| Claude Code (implementation author) | Implements the assigned code/documentation and accompanying tests in its designated checkout, runs the assigned checks and fixes in-scope findings.                           |
| Independent reviewer                | An uninvolved reviewer with fresh context inspects the exact candidate and returns an actual verdict under [Independent gate approval](#independent-gate-approval).           |
| Current user / Human approver       | Keeps the existing mode-defined approvals; `HUMAN_COLLABORATION` and `HUMAN_CT_BRIDGE` gate approvals remain actual Human approvals.                                          |

Codex's planning or integration review, and Claude's self-check, never replace
the mode-defined gate decision: the independent reviewer's verdict in
`CODEX_ONLY` and `CT_BRIDGE`, or the actual Human decision in
`HUMAN_COLLABORATION` and `HUMAN_CT_BRIDGE`. The four existing modes, their
genuine selection sources and their Human/CT approval rules keep their meanings.

A handoff for the same task inherits its recorded mode, commit choice and their
actual sources; Claude does not ask the intake questions again. A new
independent task requires its own intake. `COMMIT_AFTER_TASK: YES` does not
authorize push, merge, deployment, lifecycle promotion or unrelated changes,
and it authorizes Claude to stage or commit only when the handoff explicitly
assigns commit delivery to Claude.

Codex writes each handoff in the existing task context or change artifacts,
not in a new governance document. Every handoff states:

```text
Task / change and phase: <task goal; change name or NONE; assigned phase>
Approved references and TIC: <exact approved artifacts/paths/hashes; phase contract>
Scope and exclusions: <bounded outcome; excluded writes and actions>
Write allowlist: <exact paths>
Protected paths: <paths whose exact bytes must be preserved>
COLLABORATION_MODE / MODE_SELECTION_SOURCE: <inherited actual value and source>
COMMIT_AFTER_TASK / COMMIT_SELECTION_SOURCE: <inherited actual value and source>
Actors: <orchestrator; implementation author; integration reviewer;
  independent reviewer or NOT_ASSIGNED; commit executor or NONE>
Checkout: <absolute worktree path; branch; base commit; dirty-state baseline>
Required reading: <AGENTS chain, owning sources, exact SKILL.md paths if needed>
Required checks: <exact commands, order and prerequisites>
QA environment: <local/dev environment and env files used, or NONE>
Authorized preparation/env/runtime/QA commands: <exact commands or NONE>
QA authority: <target app or NONE; ports or NONE; DB or NONE;
  test-data create/delete rights or NONE; other runtime/data effects>
Shared-resource conflicts: <ports, databases, locks, env files or NONE>
Return requirements: <evidence below; optional log path under ignored exports/>
```

QA rights are task-specific: Claude may prepare dependencies or env files,
start runtimes, use ports, touch databases or create/delete test data only
through the exact authorized commands and with the effects the handoff records.
Listing a required check does not authorize preparation, env or runtime
commands. An empty or `NONE` field grants nothing. Checkout preparation and shared-resource rules follow
[Development Workflow](DEVELOPMENT_WORKFLOW.md#parallel-tasks-and-worktrees).

Claude returns evidence to Codex, not an approval:

- the exact candidate: branch, base commit and changed paths;
- the complete tracked diff and the full content and SHA-256 of every new file;
- commands actually run, with exit codes and results, including skipped or
  blocked commands and their reasons;
- requirement-to-source mapping, deviations, pre-existing failures and
  unverified limitations;
- a commit SHA only when commit delivery was explicitly assigned to Claude.

A reviewer inspects without writing sources or artifacts by default. A handoff
that lets a reviewer rerun checks lists the bounded commands and their effects;
caches and generated files make that different from strictly read-only
inspection. These boundaries are instructions, not a claim of enforced tool
restriction.

Claude uses the direct skill reading described in the Development Workflow. Do
not map `$skill` markers to `/skill` commands without actual registration,
globally replace Codex markers or treat `allowed-tools` metadata as an enforced
restriction. Preserve the bytes of protected skills.

Codex retains assigned `$yuta-finish-change`/lifecycle orchestration and its
existing Bridge, live federation, app-server evidence and activation
responsibilities. Record evidence under its actual executor; do not relabel
Claude evidence as Codex evidence. Actor metadata distinguishes executors,
reviewers and approval recorders, for example:

```text
Implemented by: Claude Code (<actual session/run reference>)
Integration review: Codex (<reference>); not an independent gate verdict
Independent reviewer: <actual separate agent/context identity>
Approval recorded by: Codex workflow
```

`Approval recorded by: Codex workflow` is accurate only when Codex actually
records a valid approval; a sample or template is not an approval.

Ordinary implementation delegation does not broaden runtime, tenant, security,
Product, deployment or operational authority. Claude configuration files,
installation, login/billing, reviewer configuration, runners and capability
probes are separately scoped tasks; no Claude tool capability is asserted here.
This procedure applies prospectively to handoffs after its adoption and
preserves historical approvals, failures and blockers.

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
Design Gate applicability is a separate mode-defined review classification; omission
must never bypass a required sensitive gate. Preserve pre-existing Design.

When none apply, the approved YUTA controlled adapter exception permits Tasks
only when Design is the sole deliberately omitted dependency and every other
prerequisite and earlier mode-defined gate is satisfied. Retrieve current Tasks
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

The table identifies flows that can receive Human feedback, not a requirement
to involve the user in every mode. Apply the selected mode's manual-feedback
rule above: delegated optional feedback may be `NOT_REQUESTED` with mode,
candidate and reason; mandatory Human observation remains blocking.

The two assertion results may differ; record independent scope/reason for each.
Missing provider, environment, data or permission cannot convert an existing
flow into N/A. Reassess applicability if approved scope materially changes.

When Human feedback is requested or required for an interactive Product flow, record
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

### Anti-loop and iteration stop control

This workflow owns the anti-loop/evidence-stop rule and its accounting in every
collaboration mode. CT/Page Chat/handoffs carry facts and reference this owner;
they define no separate budget or decision authority. Bound attribution,
correction and revalidation to the approved question, evidence obligation and
stop condition. Established failure may justify authorized correction; without
established failure, retain an evidence limitation only when approved criteria
permit it. Do not build generic evidence infrastructure to manufacture PASS.
`ITERATION_STOP_CONTROL` is conditional inside the affected gate, not Gate 4,
a stage, QA status or a parallel anti-loop authority.

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

Carry a bounded stop packet in the existing Tasks/review context:

```text
Current gate/stage and evaluator purpose: <exact context>
Affected claim and criterion: <exact obligation>
Lineage ID, blocker class, evidenced cause/confidence: <facts or provisional>
Recovery attempts used/max: <count / 2, or Human-authorized bound>
Execution generations used/max: <bucket and count / 3, or authorized bound>
Actions, executions and last material outcome: <chronological evidence>
Product defect proven / implementation defect proven: YES | NO, with evidence
Evidence/environment limitation and historical FAIL/BLOCKED: <unchanged facts>
Remaining mandatory evidence and safe options: <exact obligations/options>
Recommended bounded context: <reason, not approval>
Human decision: PENDING -> FIX | ACCEPT_LIMITATION | SPLIT_CHANGE | DEFER_OR_CLOSE
Decision source, scope and effect on current gate: <actual instruction>
```

## VERIFY

VERIFY asks: does repository implementation match the approved Specs and
Design?

Applicable evidence includes requirement/scenario mapping, targeted and broader
tests, typecheck, build, strict OpenSpec validation, architecture/security,
migration/schema evidence, scoped diff review, and deviations/blockers.

Check selection and rerun/reuse attribution follow the canonical
[Development Workflow](DEVELOPMENT_WORKFLOW.md#check-applicability-and-repeat-decisions).
Record expected checks and skipped/blocked obligations in existing Tasks/review
evidence. A grouped CI plan never replaces owner-specific contracts or QA;
reuse never renews approval, fabricates an execution, or waives missing required
evidence. Refresh affected results and candidate review after input changes.

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
actual mode-defined approval evidence.

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

- **Active-change finalization** requires an existing active change. In Human
  mode, require Gate 3 `AWAITING_HUMAN_REVIEW` and explicit current-user final
  approval plus sync/archive authorization. In a delegated mode, require valid
  independently `APPROVED` Gate 3 and bounded full-completion sync/archive
  authorization under the collaboration policy. It recomputes reviewed planning-artifact,
  implementation-diff, VERIFY-evidence, Technical Compliance, and applicable
  earlier-gate hashes before sync, validation, and archive.
- **Archived Knowledge Review resume** requires Gate 3 already `APPROVED`, a
  successfully recorded finish/archive and `Workflow status:
AWAITING_KNOWLEDGE_REVIEW`, no active change, the recorded archive, and an
  mode-defined pending Knowledge Review packet (or independently `APPROVED`
  exact packet in a delegated mode). It validates only the
  packet's target path set, target hashes, proposed-diff hash, and actual
  mode-defined Knowledge Review approval before applying that exact
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
  proposed diff and target/diff hashes; obtain the mode-defined review before
  editing canonical knowledge.
- After valid Knowledge Review approval, recheck hashes, apply only the
  approved documentation diff, run documentation/architecture validation, and
  close `DONE`.

Knowledge Consolidation cannot approve Product Decisions, change durable
boundaries, ownership or permissions, promote lifecycle/readiness, rewrite
normative specs, or resolve `NEEDS REVIEW` by assumption.

## Optional post-task local commit

This is a Git delivery preference, not a workflow stage, gate, approval source
or lifecycle promotion. `COMMIT_AFTER_TASK: YES` from the actual current user
authorizes safely staging and locally committing this task's attributed changes
after its requested scope and applicable completion/review/evidence obligations
are satisfied. Do not ask for that same permission again. For full repository
delivery, finish applicable finalization and Knowledge Consolidation first;
a phase-bounded task commits only its completed authorized phase and does not
finalize the whole change. Preserve any review still pending outside task scope.

Use the [guarded task write/commit procedure](DEVELOPMENT_WORKFLOW.md#guarded-task-writes-and-commits). Independent review includes the isolated checkout identity and full candidate bytes/types/modes. Guarded staging requires the actual sourced commit choice and unchanged independent review receipt.

Before staging, recheck the branch/HEAD, index, working-tree and untracked state
against the task's captured baseline. Inspect the exact candidate paths and
hunks, exclude secrets and unrelated work, and ensure the commit preserves
reviewed bytes and reproducible evidence. If evidence uses a Git diff, retain
its recorded base and attribution so committing cannot silently erase or
invalidate that comparison. Inspect the staged diff before committing. When
mixed changes or unrelated staged work cannot be isolated safely, stop the
commit and report the specific blocker; keep the completed task work intact.
Do not use blanket staging, amend/rewrite history, reset unrelated changes or
include them to make a commit possible.

Create a local commit with an English message, verify its actual paths/content
and the remaining worktree/index, then report its SHA in chat/task context.
Do not edit committed files merely to insert that SHA and create another commit
loop. `NO` or `NOT_SELECTED` means no staging/commit; report the choice and
remaining changes. An already recorded successful commit is not repeated on
resume. Uncertain commit outcome requires read-only inspection, not a replay.

This choice grants no push, PR, merge, deployment, release, destructive operation
or live Project permission. It does not approve a gate, waive checks, replace
sync/archive authorization or change the selected collaboration mode.

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
