# ADR-010: Delegate bounded implementation to Claude Code under Codex coordination

Status: Accepted

Date: 2026-10-02

Decision owners: YUTA

Decision type: Project governance

Decision source: The current user's request on 2026-10-02 to let Claude Code
update the agreed documentation package and have Codex review it, with the task
selections `CODEX_ONLY` and `COMMIT_AFTER_TASK: YES`. This decision records that
direction and was adopted through `USER_DELEGATION_WITH_INDEPENDENT_REVIEW`
after the independent completion review by `/root/claude_corrected_review`
on 2026-10-02, recorded by Codex workflow. It claims no approval of a Product
change, tool capability, deployment or readiness state.

## Context

[ADR-008](ADR-008-task-collaboration-and-delegated-review.md) made Codex the
coordinator in every collaboration mode and routed routine gates to independent
review. It did not define how Codex assigns implementation to another agent.
Without a defined handoff, a delegated worker would have to guess scope,
inherited task choices, actor identity, QA rights and review ownership.

## Decision

Codex remains the task orchestrator: it discovers the repository, defines
requirements and approved planning, coordinates workers, reviews integration,
verifies findings and integrates the task. Claude Code may implement assigned
code/documentation and accompanying tests in its designated checkout and fix
in-scope findings.

Claude is an implementation role, not a new collaboration mode, approval source
or global replacement for Codex identity or runtime. The four ADR-008 modes,
their genuine selection sources and their approval rules stay unchanged. Gate
approval still requires an uninvolved independent reviewer or, in Human modes,
actual Human approval; Codex's integration review does not replace it.

A same-task handoff inherits the recorded mode, commit choice and their actual
sources. Each simultaneous task uses one primary writer, branch and worktree.
Ordinary delegation does not broaden runtime, tenant, security, Product,
deployment or operational authority.

The canonical procedure, handoff fields, return evidence and exclusions are in
[the Automated Workflow](../YUTA_AUTOMATED_CHANGE_WORKFLOW.md#claude-code-implementation-delegation);
checkout and shared-resource rules are in
[the Development Workflow](../DEVELOPMENT_WORKFLOW.md#parallel-tasks-and-worktrees).
This ADR adds no second protocol, task artifact or gate.

## Alternatives considered

- Codex implements every task itself: keeps one actor but forgoes parallel,
  separately owned implementation.
- Add Claude as a fifth collaboration mode: conflates implementation ownership
  with approval routing and changes the existing mode meanings.
- Let Claude replace Codex globally: would relabel Codex-specific skills,
  Bridge and activation evidence without registration or evidence.

## Consequences

### Positive

- A future Claude assignment is executable from its handoff without guessing
  actors, authority, task choices or environment.
- Implementation, integration review and independent gate review stay
  attributable to their actual executors.

### Negative

- Codex must prepare a complete handoff and review integration for each
  delegated phase.
- Parallel tasks need separate worktrees, dependency installations and
  coordination of shared ports, databases and locks.

## Follow-up

Claude configuration files, installation, login/billing, reviewer
configuration, runners and capability probes are separately scoped tasks.

## Supersedes

None. Applies prospectively after adoption; historical approvals, failures and
blockers remain unchanged.

## Superseded by

None.
