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
