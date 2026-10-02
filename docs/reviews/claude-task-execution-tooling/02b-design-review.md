Change: claude-task-execution-tooling

Gate: 02b-design-review

Review status: APPROVED

Created: 2026-10-02T14:45:55.189Z

Schema: yuta-spec-driven

Analysis conclusion: NO_SPEC_BEHAVIOR_CHANGE

Sensitive change: YES

MODE: CODEX_ONLY

COMMIT_AFTER_TASK: YES

Mode selection source: Current user selected CODEX_ONLY and COMMIT_AFTER_TASK: YES in this same Claude collaboration task; latest continuation: “ok, làm tiếp các phần còn lại”. Full repository tooling delivery only; no remote delivery, real env, DB mutation or deployment.

Executor: Codex workflow (planning and orchestration); Claude Code (assigned implementation).

## Candidate identities

Hashes: Node createHash('sha256') over exact file bytes; command: node exports/gate-packet.mjs 02b-design-review docs/reviews/claude-task-execution-tooling/01-analysis-review.md openspec/changes/claude-task-execution-tooling/.openspec.yaml openspec/changes/claude-task-execution-tooling/analysis.md openspec/changes/claude-task-execution-tooling/design.md openspec/changes/claude-task-execution-tooling/proposal.md.

| Path                                                             | SHA-256                                                          |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/reviews/claude-task-execution-tooling/01-analysis-review.md | dfd008a4ee8bde6381c585f563095bf4e8ef3ea5a83d428997a41c7c77fd0016 |
| openspec/changes/claude-task-execution-tooling/.openspec.yaml    | ad33088d4956725f9f4e226d6cad3535b374c378491c23bae1d475d6899c841a |
| openspec/changes/claude-task-execution-tooling/analysis.md       | a9de81f7028c33887511c38193f89e57a3f552057383642831520f8c318ab826 |
| openspec/changes/claude-task-execution-tooling/design.md         | 30ae0b3639821f8359e29b21827e5fb8a751f907e26667c830cf318c5df186c1 |
| openspec/changes/claude-task-execution-tooling/proposal.md       | 1fd5c1076140e0f89a27ad38e7960f274bd01a8b6e7b436b856e0e3f90486710 |

## Exact candidate: docs/reviews/claude-task-execution-tooling/01-analysis-review.md

````text
Change: claude-task-execution-tooling

Gate: 01-analysis-review

Review status: APPROVED

Created: 2026-10-02T14:42:48.942Z

Schema: yuta-spec-driven

Analysis conclusion: NO_SPEC_BEHAVIOR_CHANGE

Sensitive change: YES

MODE: CODEX_ONLY

COMMIT_AFTER_TASK: YES

Mode selection source: Current user selected CODEX_ONLY and COMMIT_AFTER_TASK: YES in this same Claude collaboration task; latest continuation: “ok, làm tiếp các phần còn lại”. Full repository tooling delivery only; no remote delivery, real env, DB mutation or deployment.

Executor: Codex workflow (planning and orchestration); Claude Code (assigned implementation).

## Candidate identities

Hashes: Node createHash('sha256') over exact file bytes; command: node exports/gate-packet.mjs 01-analysis-review openspec/changes/claude-task-execution-tooling/.openspec.yaml openspec/changes/claude-task-execution-tooling/analysis.md openspec/changes/claude-task-execution-tooling/proposal.md.

| Path                                                          | SHA-256                                                          |
| ------------------------------------------------------------- | ---------------------------------------------------------------- |
| openspec/changes/claude-task-execution-tooling/.openspec.yaml | ad33088d4956725f9f4e226d6cad3535b374c378491c23bae1d475d6899c841a |
| openspec/changes/claude-task-execution-tooling/analysis.md    | a9de81f7028c33887511c38193f89e57a3f552057383642831520f8c318ab826 |
| openspec/changes/claude-task-execution-tooling/proposal.md    | 1fd5c1076140e0f89a27ad38e7960f274bd01a8b6e7b436b856e0e3f90486710 |

## Exact candidate: openspec/changes/claude-task-execution-tooling/.openspec.yaml

```text
schema: yuta-spec-driven
created: 2026-10-02
skip_specs: true

````

## Exact candidate: openspec/changes/claude-task-execution-tooling/analysis.md

```text
# Change Analysis

## Scope and Change Type

Engineering tooling implementing the accepted ADR-010. The REQUIREMENT_BASELINE in proposal.md is the single bounded requirement record. The same task inherits actual user selections CODEX_ONLY and COMMIT_AFTER_TASK: YES, continued by “ok, làm tiếp các phần còn lại”. Current work has local completion authority, with no remote-delivery authority.

## Sources Consulted

- AGENTS.md, docs/README.md, docs/CURRENT_STATE.md, docs/AUTHORITY_MODEL.md.
- Current OpenSpec activation/normativity policies, config and yuta-spec-driven instructions.
- docs/decisions/ADR-008-task-collaboration-and-delegated-review.md and ADR-010-claude-code-implementation-delegation.md.
- docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md, docs/DEVELOPMENT_WORKFLOW.md, docs/YUTA_QA_PROTOCOL.md and docs/operations/DEPLOYMENT.md.
- package.json, .gitignore, scripts/check-format-preservation.mjs; Web AGENTS, existing contact route/layout/config/build.
- Installed Claude Code 2.1.286 help; official cli-reference, sub-agents, permissions and settings at code.claude.com.

## Authority and Product Decision

ADR-010 controls actors, inherited choices, isolated writers and handoff obligations; this change adds implementation tooling only. Codex integration review and Claude self-check do not replace an independent gate verdict. No new Product decision or durable authority change is needed.

Language conflict: OpenSpec config requests Vietnamese artifacts, while the current user supplied root AGENTS requiring English technical documentation. Follow that current-user instruction for authored technical artifacts; record this conflict without changing config or protected skill bytes. User-facing conversation stays Vietnamese.

## Current Implemented State

Governance and real Claude implementation pilots exist; startup settings, explicit reviewer config and task runner are absent. Native Desktop Claude Code 2.1.286 is available and authenticated through claude.ai Pro; live restriction/PNG probes have not yet run for this candidate. Existing Playwright 1.51.1 and installed Chrome are available. Web has a 2026-09-27 static contact build, suitable only to prove capture capability.

Owned worktree: branch codex/claude-task-tooling, base 597d197045988fac9a9f340d4c40f58224136dce. Frozen dependency installation passed. Git Windows CRLF checkout initially failed 58 protected raw-byte bindings; initialization copied only immutable Git blobs already accepted by the guard and refreshed same-blob index entries. Guard now passes 67/67, staged diff is empty, and initial FAIL/recovery evidence is retained under ignored exports. No tracked content or guard binding changed.

## Affected Boundaries

Local files/checkouts, subprocess permissions, shared QA resources and safe owned cleanup need sensitive Design review. Cloud/POS/Display ownership, tenant/auth, app data and real credentials are excluded. Strict read-only means reviewer has no shell/write tools; authors supply check results. Authorized test commands may write caches and are not an OS sandbox.

## Lifecycle Baseline

No Product, module, environment, external dependency or production-readiness promotion. Configured restrictions require separate actual observation; existing build identity must accompany screenshot evidence.

## Requirement Readiness

The proposal baseline supplies constraints, exclusions and observable outcomes. Required tools and a safe anonymous page are available. No unresolved authority or Product decision prevents bounded implementation; tool-version compatibility is tested before making claims.

## UI / UX Applicability

UI_AFFECTING: NO. Browser evidence tests PNG capture on existing GET /contact only, anonymous, DB NONE and env NONE. Do not execute old E2E scripts that seed/write data. No screenshot-only UI change.

## Conflicts and Unknowns

Probe installed CLI restrictions and exact permission syntax. allowed-tools preapproves calls; it does not define the tool pool. Direct skill reading does not register slash commands or waive permissions. Bridge/federation/app-server/finish-change remain Codex responsibilities. Capture limits are distinct from Product QA.

## Analysis Conclusion

NO_SPEC_BEHAVIOR_CHANGE: approved-schema pure tooling path implementing current governance. Request independent Gate 1 on these exact corrected bytes, then sensitive Design review before Apply; no Gate 2 or normative spec is needed.

```

## Exact candidate: openspec/changes/claude-task-execution-tooling/proposal.md

```text
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

```

## Approval record

Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW

Independent reviewer: /root/claude_tooling_gate1_corrected

Independent review evidence: APPROVED; no blocking findings; source transcript retained by Codex; exact identities unchanged. First attempt CHANGES_REQUESTED remains in exports/01-analysis-review-attempt1.md.

Approval recorded by: Codex workflow

Approved: 2026-10-02T14:45:51.772Z

Exact candidate hashes rechecked with Node SHA-256 against the identities table before recording approval.

````

## Exact candidate: openspec/changes/claude-task-execution-tooling/.openspec.yaml

```text
schema: yuta-spec-driven
created: 2026-10-02
skip_specs: true

````

## Exact candidate: openspec/changes/claude-task-execution-tooling/analysis.md

```text
# Change Analysis

## Scope and Change Type

Engineering tooling implementing the accepted ADR-010. The REQUIREMENT_BASELINE in proposal.md is the single bounded requirement record. The same task inherits actual user selections CODEX_ONLY and COMMIT_AFTER_TASK: YES, continued by “ok, làm tiếp các phần còn lại”. Current work has local completion authority, with no remote-delivery authority.

## Sources Consulted

- AGENTS.md, docs/README.md, docs/CURRENT_STATE.md, docs/AUTHORITY_MODEL.md.
- Current OpenSpec activation/normativity policies, config and yuta-spec-driven instructions.
- docs/decisions/ADR-008-task-collaboration-and-delegated-review.md and ADR-010-claude-code-implementation-delegation.md.
- docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md, docs/DEVELOPMENT_WORKFLOW.md, docs/YUTA_QA_PROTOCOL.md and docs/operations/DEPLOYMENT.md.
- package.json, .gitignore, scripts/check-format-preservation.mjs; Web AGENTS, existing contact route/layout/config/build.
- Installed Claude Code 2.1.286 help; official cli-reference, sub-agents, permissions and settings at code.claude.com.

## Authority and Product Decision

ADR-010 controls actors, inherited choices, isolated writers and handoff obligations; this change adds implementation tooling only. Codex integration review and Claude self-check do not replace an independent gate verdict. No new Product decision or durable authority change is needed.

Language conflict: OpenSpec config requests Vietnamese artifacts, while the current user supplied root AGENTS requiring English technical documentation. Follow that current-user instruction for authored technical artifacts; record this conflict without changing config or protected skill bytes. User-facing conversation stays Vietnamese.

## Current Implemented State

Governance and real Claude implementation pilots exist; startup settings, explicit reviewer config and task runner are absent. Native Desktop Claude Code 2.1.286 is available and authenticated through claude.ai Pro; live restriction/PNG probes have not yet run for this candidate. Existing Playwright 1.51.1 and installed Chrome are available. Web has a 2026-09-27 static contact build, suitable only to prove capture capability.

Owned worktree: branch codex/claude-task-tooling, base 597d197045988fac9a9f340d4c40f58224136dce. Frozen dependency installation passed. Git Windows CRLF checkout initially failed 58 protected raw-byte bindings; initialization copied only immutable Git blobs already accepted by the guard and refreshed same-blob index entries. Guard now passes 67/67, staged diff is empty, and initial FAIL/recovery evidence is retained under ignored exports. No tracked content or guard binding changed.

## Affected Boundaries

Local files/checkouts, subprocess permissions, shared QA resources and safe owned cleanup need sensitive Design review. Cloud/POS/Display ownership, tenant/auth, app data and real credentials are excluded. Strict read-only means reviewer has no shell/write tools; authors supply check results. Authorized test commands may write caches and are not an OS sandbox.

## Lifecycle Baseline

No Product, module, environment, external dependency or production-readiness promotion. Configured restrictions require separate actual observation; existing build identity must accompany screenshot evidence.

## Requirement Readiness

The proposal baseline supplies constraints, exclusions and observable outcomes. Required tools and a safe anonymous page are available. No unresolved authority or Product decision prevents bounded implementation; tool-version compatibility is tested before making claims.

## UI / UX Applicability

UI_AFFECTING: NO. Browser evidence tests PNG capture on existing GET /contact only, anonymous, DB NONE and env NONE. Do not execute old E2E scripts that seed/write data. No screenshot-only UI change.

## Conflicts and Unknowns

Probe installed CLI restrictions and exact permission syntax. allowed-tools preapproves calls; it does not define the tool pool. Direct skill reading does not register slash commands or waive permissions. Bridge/federation/app-server/finish-change remain Codex responsibilities. Capture limits are distinct from Product QA.

## Analysis Conclusion

NO_SPEC_BEHAVIOR_CHANGE: approved-schema pure tooling path implementing current governance. Request independent Gate 1 on these exact corrected bytes, then sensitive Design review before Apply; no Gate 2 or normative spec is needed.

```

## Exact candidate: openspec/changes/claude-task-execution-tooling/design.md

```text
## Context

See the approved Proposal REQUIREMENT_BASELINE and Analysis. This implements existing ADR-010 with built-in Node APIs and existing root Zod only. Sensitive Design applies because the tool dispatches an external agent and creates/removes owned checkouts. Gate 2 is omitted on the approved no-spec path.

## Goals / Non-Goals

Deliver an understandable local CLI and ordinary project configuration. Account authentication remains native Claude Pro. No service, scheduler, new permission mode, OS sandbox, provider abstraction, automatic gate approval or remote Git operation is introduced.

## Decisions

### Project configuration and actual tools

CLAUDE.md imports @AGENTS.md and references canonical docs rather than copying governance. Startup reads docs/README.md and docs/CURRENT_STATE.md; manual skill reading uses the exact SKILL.md. Protected byte, multiline-search and executor/runtime caveats stay explicit. Project settings preapprove only routine inspection, deny private env/credential paths and protected edits, and ignore local settings in Git.

The reviewer definition and direct CLI invocation both restrict tools to Read/Grep/Glob, with dontAsk, a new session, no resume/continue, no MCP or Chrome integration. Reviewer outputs are findings, not gate authority. Workers receive Read/Grep/Glob/Edit/Write/Bash, exact Edit(path) rules (which also cover Write on installed CLI) and exact authorized Bash commands. allowedTools preapproves; tools defines the pool. Do not use bypassPermissions, acceptEdits or skip-permission flags. Project-only setting sources exclude unrelated personal allow rules. Runtime version/auth checks retain only sanitized login method/provider/subscription metadata and reject API-key/provider overrides for this subscription flow.

### Structured task handoff and isolated execution

Use scripts/claude-task.mjs with prepare/run/review/status/cleanup and a strict versioned JSON handoff. Required fields cover task/phase/goal, approved path/hash references and TIC, scope/exclusions, exact write/protected paths, mode and genuine selection source, commit choice/source, actors, base SHA and branch, required reading/checks, preparation commands/effects, QA app/env/ports/DB/data rights, shared resources and return requirements. NONE/empty authority grants nothing. Reject missing choices, traversal, absolute or wildcard write paths, unsafe command permission syntax and inconsistent declarations before mutation. A handoff records authorization but does not create it; Codex verifies its source.

prepare creates one runner-owned checkout under the invoking repo's ignored exports/claude-tasks/<id>/checkout on the repo drive. Git uses per-command core.autocrlf=false at initial worktree creation; no global config or raw-byte normalization. Require exact existing base identity, unused branch/path and a clean resulting checkout. Snapshot approved reference bytes/hashes from the coordinator's checkout into evidence and supply them in the prompt, so uncommitted planning need not be copied as source. Dependency prep is only pnpm install --frozen-lockfile when explicitly authorized; no env generation/copying. CLI discovery uses an explicit local override, PATH or bounded Desktop runtime directories, with no personal hashed path in committed files.

run/review freeze and hash the handoff, verify checkout identity and earlier reference hashes, acquire atomic task/resource locks, and start a bounded subprocess with argument arrays and stdin (not string-built shell commands). Shared resource names include ports/DB/locks; conflicts stop rather than kill another process. Locks coordinate runner clients only; unrelated processes and externally started servers still need the handoff's explicit coordination. Authorized child commands must finish their owned servers before returning; persistent runtime management remains Codex's responsibility.

Before/after raw-byte snapshots cover all tracked files plus nonignored new files. Record out-of-allowlist/protected drift as failure, retaining evidence without reverting. Return complete tracked binary diff, every new file's bytes/hash, actual subprocess/tool/result logs, CLI/session identities and limitations. Worker run begins from a clean task checkout; review inspects its exact frozen candidate. Do not treat exit zero without a successful Claude result as success. Serialize evidence operations for each task; manifest drift or another in-flight run blocks dependent actions.

cleanup accepts only the recorded owned path in the same Git repository, inactive locks and no dirty/untracked candidate. Retain evidence and branch commits. Refuse ignored files other than known dependency/build/cache outputs; never force-remove dirty work, delete branches, or follow directory links. Verify resolved paths/repository ownership before native Git worktree removal. Dirty/uncommitted work stays available for Codex integration. status makes no mutation.

### Validation and live probes

Node tests use disposable tiny Git repositories and fake CLI subprocesses to cover validation, isolation, conflicts, failure/timeout, candidate drift/evidence and refusal of unsafe cleanup. They use no app DB, credentials or network. Then run one real bounded Claude task and a fresh reviewer using the configured tool pool; capture actual startup/tool-use/denial observations. No model/tool capability is inferred solely from config.

For PNG capability, copy the existing Web production build/public assets into one owned ignored runtime directory without any env file; link existing dependencies only for that runtime. Bind 127.0.0.1:3187 after checking it is free. A reviewed Node script using existing Playwright and installed Chrome is executed by Claude with one exact Bash command. A fresh browser context allows only loopback GET /contact and its static assets, denies /api and non-GET/external requests, requires HTTP 200 and expected heading, and writes 1366x768/390x844 PNGs and SHA-256 manifest. Codex independently views and rehashes images. Retain actual dated BUILD_ID, page hash, browser/version/session/request logs and scope limits. This is capture capability only, not current-source Product QA. Stop owned processes and unlink dependencies before bounded removal of temporary runtime files.

## Risks / Trade-offs

- Permission rules are Claude-runtime controls, not an OS sandbox for authorized arbitrary test programs; bounded task commands and post-run byte attribution remain necessary.
- Shared DB/port conflicts outside runner locks are not automatically prevented; inspect ports and serialize external QA.
- CLI changes can invalidate permission behavior; retain version and rerun bounded probes before claiming compatibility.
- Logs may include task content; no secrets in prompts/commands or committed evidence. Keep large raw logs under ignored exports, preserve them before managed worktree archive.
- Existing build provenance limits the PNG assertion; no Product/release readiness is inferred.

## Migration Plan

No application or database migration. Rollback removes the task's added configuration/tooling and documentation changes. Completion preserves branch commit and evidence before archiving only this managed worktree. Codex owns optional local commit after verified completion; push/PR/merge remain outside this continuation's authority.

```

## Exact candidate: openspec/changes/claude-task-execution-tooling/proposal.md

```text
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

```

## Approval record

Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW

Independent reviewer: /root/claude_tooling_design_review

Independent review evidence: APPROVED; no material design blockers; exact hashes rechecked; implementation and live capability evidence remain pending.

Approval recorded by: Codex workflow

Approved: 2026-10-02T14:50:08.479Z

Exact candidate hashes rechecked with Node SHA-256 against the identities table before recording approval.
