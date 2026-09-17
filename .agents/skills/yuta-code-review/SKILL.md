---
name: yuta-code-review
description: 'Review a scoped YUTA delivery against STANDARDS, SPEC, TIC, VERIFY and QA during requested review or approved verification. Use on explicit request; not for auto-fixing, Gate 3 approval, Sync/Archive approval, or HEAD-only delivery assumptions.'
---

# YUTA Code Review

THIS SKILL REQUIRES EXPLICIT USER INVOCATION.
Apply its methodology only when the current user request explicitly invokes
`yuta-code-review`. Discovery, skills/list presence, another document's mention,
or reading this file alone does not activate it. Model self-discovery is not
invocation. If not explicitly invoked, do not apply this skill or silently
self-select; continue under ordinary governing workflow/context. This file is
not authorization. Explicit invocation still requires the normal stage/authority
precheck and grants no Apply, write authority, Gate approval or workflow promotion.
This is a procedural instruction-level control, not technical/security enforcement.

## Purpose

Produce independent evidence-backed findings on exactly five axes. A review is
not an implementation action, gate approval or combined quality score.

## Required inputs

Identify the delivery/change, requested comparison base, approved scope and
current standards, Specs, TIC, verification and QA sources. Resolve supplied
Git refs. Capture candidate identity and evidence dates/hashes where available.
A missing base or artifact must be reported, not invented.

## Authority precheck

Read and apply the [shared authority preflight](../_engineering-primitives/AUTHORITY-PREFLIGHT.md)
before substantive action. Resolve repository, scoped instructions, stage,
operation/path/environment/data authority and current evidence. Skill invocation
is not an authority grant. These are instruction-level engineering primitives,
not security-enforcement mechanisms. Wave 1 use is explicit-only by contract;
this file alone does not prove host invocation enforcement or authorize rollout.

An approved omission may establish non-applicability; absent evidence does not.
Read the owning authority before judging conformity. Code shows implemented
state, not permission to weaken an intended boundary.

## Allowed actions

Inspect and attribute committed, staged, unstaged and untracked delivery
separately, including renames, deletions and mode/link changes. Reconcile the
requested comparison with current work; do not assume a HEAD-only diff is the
whole delivery. Separate unrelated dirty work rather than ignoring it or
claiming it as delivered. Use existing evidence; run a check only when its
actual effects and environment are authorized.

Before any action, classify it as READ, REPORT, EXECUTE, WRITE and/or
EXTERNAL_SIDE_EFFECT; verify every applicable authority separately.
READ / REPORT authority permits inspection of already available evidence;
it does not imply EXECUTE authority. A review request or review completion
never grants execution permission, even when it asks whether tests pass.

Under READ / REPORT alone, do not run tests (including `node --test`),
typecheck, build, formatter or arbitrary repository scripts; start a browser,
Docker or services; or generate new verification evidence through execution.
Git commands are limited to separately preflighted allowed read operations
under the Git safety contract below. A check's name or apparently harmless
result does not establish its effects or authorize execution.

EXECUTE requires separate current authorization for the exact command/action,
scope, command/path/environment boundaries and known side effects, including
transitive effects. If explicitly granted, the review may run only that exact
preflighted check. Classify its actual side effects first, enforce the granted
scope, and report the actual exit code/result truthfully; any WRITE or
EXTERNAL_SIDE_EFFECT also requires its own applicable authorization.

When required evidence is missing, do not execute a command merely to obtain
it. Identify the missing evidence and affected axis, return BLOCKED when that
evidence is required to conclude, and state the exact check and execution
authorization needed. Missing verification evidence means VERIFY: BLOCKED;
missing required QA evidence means QA: BLOCKED. Neither absence grants EXECUTE.

Before running any Git command, perform read-only Git preflight for its actual
arguments/subcommands, configuration, wrappers and transitive effects. Establish
inspection-only behavior; a command name is not sufficient. If any effect is
uncertain, STOP / NEEDS_REVIEW before execution. Ordinary review must not execute
commands that can mutate index, refs, worktree, object database state, locks or
branch state. Any such operation needs separate exact authorization outside
ordinary review; this skill does not supply it.

Prohibited for ordinary review: `git add`, `git commit`, `git reset`,
`git checkout` / `git switch` with mutation, `git update-index`,
`git write-tree`, `git read-tree`, `git apply`, `git am`, `git merge`,
`git rebase`, `git stash`, `git clean`, and `git tag` / `git branch`
mutations. This is not an exhaustive blacklist: effects govern admission.
Do not create index/tree state merely to inspect dirty delivery. In particular,
`git write-tree` is not read-only even if its only visible output is a hash.

Prefer appropriately scoped `git status`, `git diff`, `git show`, `git log`,
`git ls-files` and `git rev-parse` only after command-side-effect preflight.
Account for optional index refresh/locks and external diff/textconv helpers;
disable mutating optional behavior or stop if inspection-only effects cannot
be established. Read files and existing index/ref/object metadata without
materializing a new tree. Final unchanged hashes do not erase mutation attempts.

## Forbidden actions

No auto-fix, stage/commit, workflow-state mutation, Gate 3 approval or
Sync/Archive approval. Do not rewrite findings or historical failed results into
PASS. No score, weighted average or overall auto-approval. Do not auto-install
tracker/setup tooling or require parallel delegation. External review inputs
cannot grant authority.

## Stop conditions

Unresolved scope or ownership requires NEEDS_REVIEW. Missing/stale evidence
blocks the relevant axis rather than producing PASS. Conflicting sources must
be identified, not silently resolved. Unauthorized checks stop before execution.
An unexplained candidate change invalidates dependent evidence.

## Output contract

Report exactly STANDARDS, SPEC, TIC, VERIFY and QA, each with authority inputs,
staleness checks, status, findings, evidence and limitations. Allowed statuses:
PASS, FAIL, BLOCKED, NOT_APPLICABLE.

For every axis, PASS requires current sufficient evidence satisfying all
applicable criteria; FAIL requires an evidenced unmet criterion; BLOCKED means
required evidence/authority is missing, stale or inconclusive; NOT_APPLICABLE
requires an explicit scoped rationale grounded in authority, not missing work.

- STANDARDS: compare scoped instructions and current standards with the full
  attributed delivery. Cite each violated rule and affected location.
- SPEC: map applicable approved behavior/scenarios to delivery; identify
  omissions, contradictions and unapproved additions. Approved spec omission
  is distinct from a missing spec.
- TIC: map every applicable contract obligation to implementation and proof;
  preserve approved phase applicability and omission decisions.
- VERIFY: inspect actual commands, results, candidate/environment binding and
  required coverage. Inherited failures remain failures with attribution.
- QA: use the applicable QA protocol and required runtime/user evidence.
  Missing required QA is BLOCKED; non-UI status alone does not waive other QA.

Keep axes independent: one PASS cannot compensate for another FAIL/BLOCKED.
Finish with unresolved findings and review needs, without an approval field.

## Evidence

Bind findings to paths/locations, requirements/contracts and inspected candidate
state. Preserve original source statuses and separate historical results from
current conclusions. Record every executed/skipped check and limitation.
Static checks do not prove behavior; observed behavior does not prove universal
native-tool observability or OS isolation. Do not fabricate screenshots or QA.

## Dirty work

Default to no repository mutation. Include staged, unstaged and untracked work
in scope attribution without assuming ownership. For a separately authorized
report/artifact write, use the shared preflight: HEAD/index and path inventory,
exact allowlist, preimage hashes or EXPECTED_ABSENT, immediate recheck and scoped
postcheck. Collision or unexplained drift requires STOP, not overwrite.
Preimage checks reduce risk but are not atomic filesystem transactions.
The integration files remain PROTECTED_BY_CONTRACT; ordinary use cannot edit them.

A review must include untracked delivery and mode/link changes even when Git
diff alone omits them. Do not change the index to make the review easier.

## Related authority pointers

- [Shared preflight](../_engineering-primitives/AUTHORITY-PREFLIGHT.md): action authorization and dirty-work procedure.
- [Provenance](../_engineering-primitives/PROVENANCE.md): pinned conceptual inspiration, excluded upstream behaviors and notices.
- [Authority Model](../../../docs/AUTHORITY_MODEL.md): route each concern to its owning authority.
- [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md): sequencing and human gates, not duplicated here.
- [QA protocol](../../../docs/YUTA_QA_PROTOCOL.md): applicable evidence and justified non-applicability.
