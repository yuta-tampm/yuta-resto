# Claude execution tooling verification

Change: claude-task-execution-tooling

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS
VERIFY: PASS
QA: PASS (runtime/capture capability scope)

Exact source manifest: exports/final-implementation-attribution.json, SHA256 7862e8dc130374567c675cc3057d533cdf987856d56bdd8764a41e79b003fd95. Scoped implementation SHA256: 5d98cb5a1d9a24760894dc81c8c2ea6bcc87135f80fd7c793fd477ac6d712ae1. VERIFY input manifest: exports/final-verification-inputs.json, SHA256 f16785337315629fc82ac6c9f3cc6b48bdaba276d9c667cc411180e77d1b9388. Hash algorithm is Node createHash('sha256') on exact file bytes; implementation compound algorithm/classification is retained in attribution payload and remains reproducible after staging/commit. Every original source path is included, whether tracked or untracked.

## Approved scope and actors

Existing ADR010 implementation only, MODE CODEX_ONLY, COMMIT_AFTER_TASK YES from the actual same-task user. Codex planned/coordinated; Claude Code implemented seven source paths in session6807896b-64ad-42aa-8cef-4606b8e95077. Native Claude config Writes were denied; Codex materialized its exact authored .claude/settings.json and reviewer payload after that session ended (retained integration receipt). Codex then fixed demonstrated contract defects in settings/runner/tests and updated manual-skill guidance/docs accordingly. This integration review is distinct from fresh independent Gate3 review. Current-user separate authorization opened native subscription login; final probes use Max, with no model/provider/API/billing override. No remote delivery/deployment or real env/DB rights.

## Technical compliance matrix

| Phase / technical rule                                                                            | Authority                                | Implementation                                                        | Check/evidence                                                                                                               | Result |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------ |
| Service: exact inherited choices, actors, TIC, write/QA/check rights and placeholders fail closed | AGENTS.md, ADR010, approved Design/Tasks | strict Zod handoff and template                                       | validation/unsourced/self-review/template refusal tests                                                                      | PASS   |
| Service: one writer, isolated branch/worktree; frozen references and checkout                     | ADR010, Development Workflow             | prepare and Git ownership/ref guards                                  | tiny Git prepare/ref/link/candidate-drift tests; actual worker receipt                                                       | PASS   |
| Service: keep protected bytes and credentials out of worker access                                | Design/Tasks, AGENTS.md                  | protected write denials, broad environment Read denials, guard        | 67 raw protected hashes/3344 outside allowlist unchanged; actual3 denied Reads                                               | PASS   |
| Service: exact shell commands and exact source write paths                                        | Design sensitive boundary                | PreToolUse immutable guard; executable/command validation             | route-group/spaced/bracketed positive Write; exact check Bash; actual out-of-list Bash deny; Git case/native-extension tests | PASS   |
| Service: safely discover/authenticate native subscription CLI; no provider bypass                 | Design/Tasks                             | bounded versioned Desktop discovery and sanitized auth                | CLI2.1.286; native Max worker/probe startup; auth/discovery tests                                                            | PASS   |
| Service: manual skills, actual Codex identities retained                                          | ADR010, CLAUDE.md                        | direct SKILL.md reading, Bridge/finalization ownership                | no slash registration/junction/global identity substitution; actual startup/tool pools                                       | PASS   |
| Service: physically constrained fresh reviewer                                                    | ADR010, approved Design                  | Read/Grep/Glob only, model inherit, dontAsk, no hooks/shell/Agent/MCP | actual custom reviewer session and positive/negative Reads; settings tests                                                   | PASS   |
| Service: evidence/result parsing and failures do not become success                               | Design/Tasks                             | immutable receipts/diffs/new-files/snapshots/index/session identity   | missing/error/timeout/scope violation/index drift tests; retained quota reviewer FAIL despite result subtype success         | PASS   |
| Service: coordinate shared resources and retain dirty/evidence/commits during cleanup             | Design/Tasks                             | common Git-dir locks; lifecycle/owned cleanup guards                  | conflict/live-state/linked-root/dirty/unknownignored refusal tests                                                           | PASS   |
| Service: aliases/example/current documentation stay coherent                                      | AGENTS.md, Development Workflow          | package aliases, example JSON, existing docs                          | docs/architecture/formatter checks; real bounded native invocation                                                           | PASS   |
| Integration: all candidate source and prior gate identities attributed                            | automated workflow hash integrity        | 9-path manifest + original tracked diff +6 new-file hashes            | raw-baseline audit; earlier Gate1/2b identity checks unchanged                                                               | PASS   |
| Integration: actual dated-page PNGs/provenance and no DB/env/data writes                          | QA Protocol, approved QA contract        | reviewed bounded GET/contact capture command                          | actual Claude/browser session,2PNG hashes, Codex view/hash, build/request/stop receipts                                      | PASS   |
| Integration: mandatory checks and usability distinct from approval                                | AGENTS.md, post-Apply feedback           | separate DEV_USABLE/MANUAL_TEST_READY record in Tasks                 | 25 tests/no skips, mandatory checks, human-usable handoff and actual flow                                                    | PASS   |
| Integration: historical failures, limits and independent gate remain truthful                     | automated workflow, ADR008/010           | Tasks ledger, QA_REPORT, pending Gate3                                | original quota/permission/runtime/format/race FAIL kept; fresh reviewer required                                             | PASS   |

## Commands and observed results

- Frozen pnpm install --frozen-lockfile: baseline PASS, reused existing store, no dependency/lock changes.
- pnpm test:claude-task: final25 PASS,0 FAIL,0 skipped. Covers strict handoff/template/authority/private refs, common locks, linked path/ref/root refusal, Windows permission paths, exact hooks, sanitized CLI discovery/auth, actual subprocess outcomes/drift/index and safe cleanup.
- pnpm docs:check: PASS.
- pnpm typegen:next: PASS,24/24 fresh outputs, then pnpm -r --if-present typecheck: PASS.
- pnpm architecture:check: PASS after type generation. Earlier concurrent run FAIL ENOENT on transient next-env replacement is retained separately; no source repair.
- node scripts/check-format-preservation.mjs: PASS,67 exact paths.
- pnpm format:check in raw managed checkout: historical FAIL2178 files from system core.autocrlf=true. Original failure is not relabeled PASS. Same existing disposable view2 refreshed from Git-object LF base and21 byte-identical current candidate overlays: actual pnpm format:check PASS, all67 protected paths checked. Earlier archive attempt inherited autocrlf and failed; corrected Git archive explicitly used core.autocrlf=false. No normalization of3344 existing source files. Final generated review artifacts are checked narrowly; no source changed after the final full canonical check.
- git diff --check: PASS.
- pnpm exec openspec validate claude-task-execution-tooling --strict: PASS; approved skip_specs true, no deltas or normative promotion.
- Real runner worker session3e4e421f-2182-4ec9-8638-501c66292828: SUCCEEDED/exit0/no violations, actual exact Write/check Bash; native Max, default Opus5.5.
- Final fresh reviewer session 5df90266-5965-47a3-b3eb-dc6bf6713c68: actual public positive Read and three attempted environment-name Reads DENIED; unchanged source/guard/fixture. Bash-only session eb991836-9b64-492d-8fd5-732576b152e6: actual safe unauthorized git status --short DENIED by current guard. No retry, exit0. Permission observations bind runner382665e0b3baae1bcdf9ba08bcfb54d069a7d96a9822a3a4cb2baa27a334d176.

Expected checks not run: test:cloud, test:local and build:cloud (no application/dependency/runtime/schema/transport behavior changed; dedicated tooling tests and recursive typecheck cover this task). No real DB/env/provider/production test, role/form submission or current-source Product UI regression. External UI advisory NOT_APPLICABLE to engineering tooling; no UI/framework/package installed.

## QA and retained limitations

Read qa/QA_REPORT.md, qa/screenshot-manifest.md and qa/capability-binding.json independently. UI_AFFECTING NO; BROWSER_QA_REQUIRED NO for product UI. Actual dated-build file capture is required capability evidence, and applicable tooling runtime QA is PASS. Requests, console-prefetch blocks, actual browser version limits, source provenance, owned stop and separate Codex inspection are explicit. Runtime permission hooks are not an OS sandbox for authorized commands; common locks do not govern outside DB/server writers. Native own-config writes required Codex integration. Evidence generation neither grants a gate nor produces current-source Product/release acceptance.

## Finish boundary

Tasks/phase contracts are implemented, development assertions YES with actual source identity. Gate3 remains AWAITING_INDEPENDENT_REVIEW. No sync/archive/commit has happened yet. Requested full local delivery after independent approval permits the named no-spec finish and local commit; no push/PR/merge/deploy. Knowledge scan is performed after archive under its separate protocol. Original dirty primary checkout is preserved.
