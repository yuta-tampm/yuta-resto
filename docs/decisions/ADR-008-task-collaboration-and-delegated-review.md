# ADR-008: Select task collaboration and delegate routine gate review

Status: Accepted

Date: 2026-10-01

Decision owners: YUTA

Decision type: Project governance

Decision source: The current user's explicit instructions in the repository
governance conversation on 2026-10-01. The user selected optional CT and Human
participation and explicitly authorized Codex to progress gates within assigned
scope through independent review, asking only for scope/authority changes or
actions requiring confirmation. The user's follow-up added collaboration with
both Human and CT and a separate per-task commit choice. This records those
decisions; it does not claim
approval of a Product change, live Bridge, deployment or readiness state.

## Context

Approved knowledge is being consolidated into owning repository sources with
scope-bound authority cutovers. Requiring a separate CT conversation and Human
approval at every routine gate adds coordination overhead even when the task
is already bounded by the user's request and current repository authority.

## Decision

For each new task, ask the user to select Codex alone (`CODEX_ONLY`), Codex with
the user (`HUMAN_COLLABORATION`), Codex with a selected CT through Bridge
(`CT_BRIDGE`), or Codex with both the user and selected CT
(`HUMAN_CT_BRIDGE`), unless the request already selects a mode. Ask separately
whether to commit after the task (`COMMIT_AFTER_TASK: YES | NO`), unless already
specified. The same task keeps both choices, their actual sources and its scope
across follow-ups, gates and resume. An unanswered commit choice grants no
staging/commit permission.

Codex owns repository discovery, shaping, impact classification and coordination
in every mode. CT participation is optional; impact classification does not
require a chat handoff. Preserve recorded knowledge authority and exact-scope
cutovers; missing Product authority still requires a real owning decision.

In `CODEX_ONLY` and `CT_BRIDGE`, the user's bounded task delegates routine gates to
separate read-only reviewers with fresh context and exact candidate evidence.
The author cannot self-approve. Both `HUMAN_COLLABORATION` and `HUMAN_CT_BRIDGE`
retain actual Human gate decisions; the latter adds CT advice through Bridge.
Scope/permission changes and separately confirmed actions need the current user
in every mode. Keep required evidence, independent review, history, iteration
limits and the separate operational lane.

An explicit per-task commit choice of `YES` authorizes a local commit of safely
isolated task changes after its completion obligations are met, without another
permission question. `NO` or an unanswered choice leaves them uncommitted.
Push, PR, merge, history rewriting and deployment retain separate authority.

The canonical procedure, authorization limits and prospective adoption rules
remain in
[the Automated Workflow](../YUTA_AUTOMATED_CHANGE_WORKFLOW.md#task-collaboration-and-delegated-review).
This ADR does not introduce a second protocol, task artifact or gate.

## Alternatives considered

- Require CT and Human participation for every task: retains the coordination
  overhead the user asked to remove.
- Let the implementation author approve its own work: lacks independent review.

## Consequences

Tasks can progress without routine Human or CT interaction while preserving
review and evidence. A missing independent reviewer blocks dependent work.
Optional Human feedback is not acceptance or QA evidence. A task's mode never
expands its phase/scope, and existing changes require explicit opt-in rather
than retrospective approval replacement.

## Supersedes

Prospectively supersedes mandatory CT routing and universal routine Human gate
approval in project workflow instructions for tasks adopting this decision.
Existing accepted Product, architecture, security, runtime/data, operational and
external authority boundaries and historical approvals remain in force.
