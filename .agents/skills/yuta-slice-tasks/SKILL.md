---
name: yuta-slice-tasks
description: 'Prepare bounded YUTA Tasks, Implementation Plan and TIC after applicable planning gates on explicit request. Map approved requirements to reviewable work; not for implementing, tracker publication, ready-for-agent status, or granting Apply.'
---

# YUTA Slice Tasks

THIS SKILL REQUIRES EXPLICIT USER INVOCATION.
Apply its methodology only when the current user request explicitly invokes
`yuta-slice-tasks`. Discovery, skills/list presence, another document's mention,
or reading this file alone does not activate it. Model self-discovery is not
invocation. If not explicitly invoked, do not apply this skill or silently
self-select; continue under ordinary governing workflow/context. This file is
not authorization. Explicit invocation still requires the normal stage/authority
precheck and grants no Apply, write authority, Gate approval or workflow promotion.
This is a procedural instruction-level control, not technical/security enforcement.

## Purpose

Translate approved behavior into independently reviewable work with explicit
dependencies, exact paths and verification. Dependency-ready !=
execution-authorized.

## Required inputs

Identify approved requirements/scenarios, Design, applicable planning-gate
decisions, non-goals, owners/modules and delivery constraints. Inspect current
repository interfaces and relevant existing tests where authorized. Record
missing or stale inputs rather than silently filling them with Product choices.

## Authority precheck

Read and apply the [shared authority preflight](../_engineering-primitives/AUTHORITY-PREFLIGHT.md)
before substantive action. Resolve repository, scoped instructions, stage,
operation/path/environment/data authority and current evidence. Skill invocation
is not an authority grant. These are instruction-level engineering primitives,
not security-enforcement mechanisms. Wave 1 use is explicit-only by contract;
this file alone does not prove host invocation enforcement or authorize rollout.

Use only the Tasks / Implementation Plan / TIC stage after applicable planning
gates. Confirm approved behavior and scope before proposing work. Approval of
a task breakdown does not authorize its execution or publication.

## Allowed actions

Choose VERTICAL_SLICE when one bounded behavior can be independently verified
across only the layers it actually needs. Choose EXPAND_MIGRATE_CONTRACT when a
compatibility transition requires old/new forms to coexist: expansion, bounded
caller migration, then removal after dependent callers are verified.
Explain the choice and real dependencies; do not invent migration for ordinary
instruction/document changes.

Map every approved requirement/scenario to tasks, and every task back to
authority. Identify owner/module, exact paths, prerequisite evidence and test
seams. Plan verification commands only from inspected repository capabilities;
classify their side effects and distinguish planned from executed checks.
Return the plan in the conversation unless an exact artifact write is separately
authorized.

## Forbidden actions

Do not create ready-for-agent state, grant Apply, mark tasks complete, publish
tracker issues or automatically execute an unblocked task. Do not hide dependencies,
force DB/API/UI layers, or add default prefactoring without an approved need.
No installation, auto-routing, stage/commit, workflow promotion or canonical
Knowledge update. A new requirement must return for approval, not enter a task
as an implementation detail.

## Stop conditions

STOP/NEEDS_REVIEW for missing planning approval, stale/conflicting behavior,
unresolved ownership, unknown dependency, or work beyond the approved boundary.
If verification needs unauthorized environments or effects, mark that dependency
BLOCKED. Do not declare planning complete while a required mapping is missing.

## Output contract

For each task provide task ID/title, approved requirement/scenario, bounded
behavior/purpose, owner/module, exact write paths (or NONE), read dependencies,
input authority, blockers, expected output, TIC obligations, verification and
stop conditions. Keep every task unchecked.

Provide requirement/scenario-to-task traceability, ordered phases, and for each
phase its preconditions, expected mutations and review point. Each TIC item
identifies its obligation, applicable tasks, implementation evidence,
verification evidence and failure disposition. State which checks are planned,
which phases are not applicable with reasons, and which authorizations remain
absent. Include no Apply-grant or ready-for-agent field.

## Evidence

Cite the specific approved source behind each task and distinguish repository
facts, inference and unresolved gaps. Do not claim a command ran or a behavior
passed because it appears in the plan. Missing test/QA evidence remains an
execution obligation. Planning completion does not imply workflow DONE,
runtime enablement or production readiness.

## Dirty work

Default to no repository mutation. Include staged, unstaged and untracked work
in scope attribution without assuming ownership. For a separately authorized
report/artifact write, use the shared preflight: HEAD/index and path inventory,
exact allowlist, preimage hashes or EXPECTED_ABSENT, immediate recheck and scoped
postcheck. Collision or unexplained drift requires STOP, not overwrite.
Preimage checks reduce risk but are not atomic filesystem transactions.
The integration files remain PROTECTED_BY_CONTRACT; ordinary use cannot edit them.

Plan writes against actual ownership and preimages, not an assumed clean checkout.
Separate concurrent work from the proposed delivery. Do not rebaseline conflicts
or stage files to manufacture a complete task inventory.

## Related authority pointers

- [Shared preflight](../_engineering-primitives/AUTHORITY-PREFLIGHT.md): action authorization and dirty-work procedure.
- [Provenance](../_engineering-primitives/PROVENANCE.md): pinned conceptual inspiration, excluded upstream behaviors and notices.
- [Authority Model](../../../docs/AUTHORITY_MODEL.md): route each concern to its owning authority.
- [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md): sequencing and human gates, not duplicated here.
