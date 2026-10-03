# ADR-011: Bind task writes and commits to isolated checkouts

Status: Accepted

Date: 2026-10-03

Decision owners: YUTA

Decision type: Project governance and development tooling

Decision source: The current user's request on 2026-10-03 to implement checkout
guards first and validation optimization second, sequentially in separate
worktrees and branches; CODEX_ONLY selected for both. The refined guard design
was independently approved by /root/isolation_design_review with fresh context.
Commit selection is a separate task decision; this ADR grants no commit,
push, merge, deployment or Product authority.

## Context

The isolation rule existed, but the orchestrator authored AI/Storage
documentation in a shared primary checkout. File/hash and content review did
not check writer isolation. A new promise or content-only review cannot prevent
the same coordination error.

The existing Claude runner restricts commands and write paths, but checked
checkout identity only at run startup. Codex provides pre-tool hooks, with
source trust and runtime coverage limitations.

## Decision

Use the guarded task procedure in
[Development Workflow](../DEVELOPMENT_WORKFLOW.md#guarded-task-writes-and-commits)
for attributed source writes and local commits. Bind one primary writer and
unique task ID to one linked worktree, branch, exact base/HEAD and exact
allowlist, and revalidate before guarded effects. Share the identity checker
with Claude's per-tool hook.

A commit requires the actual task's sourced YES choice and a separate review
of the complete candidate, including staged/untracked files, bytes, types and
modes. Validate checkout isolation in independent review, and retain uncertain
commit outcomes for inspection rather than replay.

Codex hook configuration supplements the guarded CLI. Trust/reload and a real
denial observation remain activation obligations. Repository implementation
does not claim that all existing chats/tools are automatically intercepted or
that local permission hooks form an OS sandbox.

## Alternatives considered

- Manual identity checks: preserve an avoidable omission in the write path.
- Git commit hooks alone: protect only the commit stage.
- Globally modify user settings or deploy an OS sandbox: exceeds this bounded
  repository task and requires separate host administration.

## Consequences

### Positive

Wrong checkout, branch, writer, scope and stale review are rejected at guarded
entry points. Task identity also supports attribution of reusable test evidence.

### Negative

Each author needs a prepared worktree and binding. Local hook trust and supported
runtime coverage must be observed. Session and review fields require honest
orchestrator attribution; they are not cryptographic identity.

## Follow-up

Evaluate check necessity and repetition as the separate second task. Preserve
required evidence and authorization. Any stronger host-wide enforcement is
separately scoped.

## Supersedes

None. Historical approvals and the original isolation violation remain recorded.

## Superseded by

None.
