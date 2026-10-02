## Why

ADR-010 and real implementation pilots established Claude delegation, but the repository still lacks startup configuration, a restricted reviewer and a repeatable handoff runner. The user requested completion of these remaining parts.

## REQUIREMENT_BASELINE

AUTHORITATIVE_USER_REQUIREMENT: Complete the remaining Codex–Claude setup discussed in this same task, sourced from the current user's “ok, làm tiếp các phần còn lại”: configuration, explicit reviewer tools, parallel task execution and actual screenshot capability evidence.

HARD_CONSTRAINTS: Inherited actual user selections CODEX_ONLY and COMMIT_AFTER_TASK: YES; Codex coordinates/integrates, Claude implements assigned work, uninvolved fresh reviewers decide routine gates. One primary writer/branch/worktree per task. Read skills directly by exact path, preserve protected bytes, use the existing Pro login, grant QA rights per task and retain truthful evidence. Follow the current-user-supplied root AGENTS English technical-documentation instruction.

OUT_OF_SCOPE: New dependency, login/billing/API-key change, real env/credential reading or copying, application/database/schema/UI changes, shared DB writes, Bridge/federation/app-server relabeling, skill registration, protected-file edits, automatic commit by Claude, push/PR/merge/deployment and cleanup of unrelated worktrees/caches.

SUCCESS_OUTCOMES: CLAUDE.md and modest project settings exist; a fresh Claude reviewer demonstrably has only Read/Grep/Glob; a small runner validates sourced handoffs, prepares isolated task worktrees/dependencies, dispatches Claude, retains exact return evidence and rejects resource conflicts/unsafe cleanup; Claude saves actual desktop/mobile PNGs and SHA-256 manifest from an existing public page without DB/real env; applicable checks and independent review pass, a local commit is created, and only owned temporary resources are cleaned after evidence preservation.

## What Changes

- Add CLAUDE.md, project permissions and a Read/Grep/Glob reviewer definition.
- Add a small Node runner, bounded Git fixture tests and an example handoff implementing the already accepted delegation procedure.
- Verify actual CLI tool restrictions and PNG evidence on existing public /contact.
- Document usage in Development Workflow and retain exact candidate/check/review evidence.

## Capabilities

### New Capabilities

None at the Product/normative contract level. Pure engineering tooling implements existing ADR-010; use skip_specs: true.

### Modified Capabilities

None. Existing modes, approval, tenant/runtime/data ownership and normative requirements remain authoritative.

## Impact

Claude configuration, Node scripts/tests, package aliases, local ignore rules, Development Workflow and change/review evidence only. UI_AFFECTING: NO. The public-page screenshot is a capability probe of a dated build, not current-source Product QA.
