# YUTA Automated Change Workflow

Status: Proposed

Visibility: Engineering

Owner: YUTA product and engineering

## Purpose

This workflow automates OpenSpec planning, implementation, verification, review-packet assembly, and approved mechanical promotion while preserving explicit human review gates.

```text
$yuta-run-change
  -> Proposal + Analysis
  -> Gate 1: 01-analysis-review.md
  -> human review and explicit approval
$yuta-run-change <change> continue
  -> Delta specs + strict validation
  -> Gate 2: 02-specs-review.md
  -> human review and explicit approval
$yuta-run-change <change> continue
  -> Design + Tasks + Apply + Verify
  -> Gate 3: 03-final-review.md
  -> human review and explicit sync authorization
$yuta-finish-change <change>
  -> Sync + validate main specs + archive
```

A valid `skip_specs: true` change omits Gate 2. A sensitive change adds `02b-design-review.md` before apply.

## Responsibilities

`$yuta-run-change` starts or resumes a change and runs autonomously only until the next human gate. It creates the packet for that gate and stops. It never syncs normative specs or archives a change.

It can also adopt an in-flight change that already has planning artifacts but no YUTA packets. Adoption always starts at the earliest missing or unapproved gate and preserves every existing artifact byte-for-byte unless the user explicitly requests changes after review:

- existing Proposal + Analysis with no Gate 1 packet → read/validate, hash, create `01-analysis-review.md`, and stop;
- after Gate 1 approval, existing delta specs with no Gate 2 packet → strict-validate without editing, hash, create `02-specs-review.md`, and stop;
- after Gate 2 approval, existing design → use it as-is rather than regenerate it.

Later specs, design, tasks, or implementation can never bypass an earlier unapproved gate. A missing packet is missing review evidence, not a reason to rewrite its artifacts.

`$yuta-finish-change` runs only after Gate 3 receives explicit current-user final approval plus explicit authorization to sync and archive. It revalidates the reviewed state, promotes applicable deltas, validates main specs, and archives only after success.

ChatGPT or another external reviewer remains an independent review layer. Automation removes repetitive prompt handoff and packet assembly; it does not automate Product, authority, architecture, security, legal, privacy, or sync-authorization decisions.

## Review gates

### Gate 1 — Analysis

Reviews the exact proposal and authority/evidence analysis. Specs cannot begin until the bounded behavior is ready and the packet is explicitly approved. Requirement-level conflicts return to analysis instead of being guessed through.

Valid YUTA analysis conclusions are exactly:

- `READY_FOR_SPECS`
- `BLOCKED_NEEDS_REVIEW`
- `NO_SPEC_BEHAVIOR_CHANGE`

`CONFLICT` is recorded in the conflict section, not used as an analysis conclusion. When a conflict affects requirement readiness, the conclusion is `BLOCKED_NEEDS_REVIEW`.

### Gate 2 — Specs

Reviews exact delta specs and strict validation evidence. Design or implementation cannot begin until the behavioral contract is explicitly approved. This gate is absent only for a valid no-spec change.

### Conditional Design Gate

Sensitive authorization, ownership, migration, payment/fiscal, Personnel/legal/privacy, provider, POS transaction, destructive, or cross-module boundary work receives a separate design review before apply.

### Gate 3 — Final

Reviews planning hashes, implementation diff, test and verification evidence, deviations, and unresolved issues. Its initial sync authorization is `PENDING`. Only explicit current-user approval and sync authorization permit `$yuta-finish-change` to act.

## Integrity and invalidation

Each packet records SHA-256 hashes of the exact artifacts or implementation diff reviewed. Resume and finish operations recompute the recorded path sets and hashes. Any added, removed, renamed, or changed reviewed content invalidates approval and stops the workflow for re-review.

Approval is never inferred from passing checks, OpenSpec state, file existence, commits, pull requests, or prior assistant messages. Approval records use:

```text
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
```

No universal approver identity is invented.

## Normativity and lifecycle

OpenSpec change artifacts and review packets are non-normative. On a behavior-changing path, only an explicitly authorized, successful sync followed by main-spec validation promotes the reviewed behavior into `openspec/specs/**`. Archive closes history; it does not create authority.

No workflow step automatically promotes Product Decision, Implementation, Environment, Production Readiness, External Dependency, or any other lifecycle value.

## Failure behavior

The workflow stops on missing/ambiguous approval, hash drift, unresolved authority decisions, sensitive design awaiting approval, non-isolatable implementation diffs, spec/design conflicts, failed sync, unexpected main-spec diff, or failed main-spec validation.

Technical implementation defects inside an approved contract may be fixed and re-verified. Product or durable-boundary decisions always return to the applicable human gate.
