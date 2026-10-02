## 1. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT

Owner: Codex orchestrates/integrates; Claude Code implements assigned tooling. Boundaries: isolated local Git checkout, external-agent subprocess/tool permissions, same-task authority provenance and retained evidence. Authorities: root AGENTS.md (no nested instructions for scripts/.claude), docs/README.md, docs/CURRENT_STATE.md, ADR-008, ADR-010, docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md, docs/DEVELOPMENT_WORKFLOW.md and approved Proposal/Analysis/Design with exact Gate 1/2b hashes. No schema/runtime/tenant/DB/Product authority change. Use built-in Node and existing Zod, named exports, exact argument arrays, constrained paths, frozen handoffs and safe owned cleanup. No credentials or env reads, permission bypass, writer commits, remote Git, skill registration or protected-byte edits.

Intended implementation paths: CLAUDE.md, .claude/settings.json, .claude/agents/yuta-readonly-reviewer.md, .gitignore, scripts/claude-task.mjs, scripts/claude-task.test.mjs, scripts/claude-task/example-handoff.json, package.json and docs/DEVELOPMENT_WORKFLOW.md. Required checks: pnpm test:claude-task, docs:check, architecture:check, typegen:next followed by recursive typecheck, format:check and git diff --check. Completion evidence: sourced handoff, actual Claude session, scoped raw-byte candidate/diff/new-file manifests and exact check results.

- [x] 1.1 Add startup/manual-skill guidance, modest settings and explicit reviewer tool definition; inspect actual CLI startup and file-denial evidence.
- [x] 1.2 Implement validated handoff prepare/run/review/status/cleanup, isolation, locks, auth/version handling, evidence and refusal paths; verify disposable Git/fake-CLI tests.
- [x] 1.3 Add package aliases, example handoff and usage in existing Development Workflow; verify docs/path/format checks and a real bounded task invocation.

## 2. Integration / Regression

### TECHNICAL IMPLEMENTATION CONTRACT

Owner: Codex verification/integration, fresh uninvolved reviewer for Gate 3. Authorities: preceding contract, approved Design, docs/YUTA_QA_PROTOCOL.md and apps/web/AGENTS.md for the existing public-page probe only. No app source edits, real environment, DB, provider action, browser profile reuse or third-party installation. Exact QA: existing 2026-09-27 Web build, anonymous GET /contact on loopback port 3187, desktop 1366x768/mobile 390x844, DB NONE, env NONE, owned temporary runtime and fresh Chrome profile, existing Playwright only. Claude executes the reviewed capture command; Codex inspects/re-hashes actual PNG evidence. Logs/PNG/build/session identities must disclose capability scope and limits. Tests create/delete only their own inert fixtures; resource conflicts must fail safely and cleanup must retain evidence/commits.

- [x] 2.1 Verify actual fresh Claude reviewer tool pool/denial and bounded worker execution, preserving session/result/tool traces.
- [x] 2.2 Execute the reviewed public-page PNG probe through Claude; independently view PNGs and rehash manifest, retain build/request provenance and stop owned runtime.
- [x] 2.3 Complete mandatory and targeted checks, byte-scope audit and Technical Compliance Matrix; independent Gate 3 review must match exact candidate/evidence.

Post-review delivery obligation: after valid Gate 3, Codex finalizes the approved no-spec change, records knowledge disposition, creates the authorized local commit, preserves ignored evidence and archives only owned temporary resources. These workflow actions are not implementation checkboxes or pre-Gate-3 claims.

## Task authority and applicability

COLLABORATION_MODE: CODEX_ONLY. MODE_SELECTION_SOURCE: current user's same-task explicit selection. COMMIT_AFTER_TASK: YES. COMMIT_SELECTION_SOURCE: current user's same-task explicit selection; Codex is commit executor. Scope continuation: “ok, làm tiếp các phần còn lại”. Worker commits/push/PR/merge/deployment are not assigned. Implementation handoff is retained under ignored exports and bound to these current planning/TIC hashes.

UI_AFFECTING: NO. BROWSER_QA_REQUIRED: NO for unchanged application UI; actual capture capability probe is nevertheless a required task outcome. Non-browser runner/runtime QA applies. Design applicability: APPLICABLE, sensitive Gate 2b approved; no-spec path does not omit Design.

## POST_APPLY_DEVELOPMENT_FEEDBACK

Adoption: REQUIRED. Evidence: development-usability-and-iteration-control archived 2026-09-24; its 03-final-review records Finish outcome COMPLETED and Workflow status DONE. New tooling change created after that event.

Candidate: nine source paths bound in final review/attribution; corrected runner SHA256 382665e0b3baae1bcdf9ba08bcfb54d069a7d96a9822a3a4cb2baa27a334d176. DEV_USABLE applicability: YES; result: YES; actual current native Max worker 3e4e421f-2182-4ec9-8638-501c66292828, strict reviewer 5df90266-5965-47a3-b3eb-dc6bf6713c68 and exact-command negative probe eb991836-9b64-492d-8fd5-732576b152e6. Entry point: scripts/claude-task.mjs prepare/run/review/status/cleanup, public inert Git fixtures only. MANUAL_TEST_READY applicability: YES; result: YES; human-usable handoff: scripts/claude-task/example-handoff.json plus docs/DEVELOPMENT_WORKFLOW.md commands/choices/TIC/write paths/QA rights, safe expected flow and reset/cleanup/refusal/limits. Template placeholders intentionally cannot execute; provide real scoped references/isolated checkout before running. No real DB/env. These assertions are not Product/gate/production approval.

HUMAN_PRODUCT_VALIDATION: NOT_REQUESTED (CODEX_ONLY engineering tooling; no acceptance criterion requires Human Product judgement). This is not QA or approval.

ITERATION_STOP_CONTROL: first Gate 1 CHANGES_REQUESTED (missing baseline/language conflict), corrected and fresh review APPROVED; no remaining blocker. Preserve that history and initial protected-checkout FAIL/recovery under ignored evidence. Default recovery/generation limits apply if a new blocker occurs.

## Retained iteration and actor evidence

- Quota lineage: old Pro account caused implementation launches1/2 and reviewer generation1 to fail; source never inferred from success labels. Implementation quota bucket used2 actual generations; reviewer quota bucket used1. Waiting for the stated reset and the separately current-user-authorized CLI account switch were bounded recoveries; no retries while known closed. New Max auth metadata is sanitized. Historical rate_limit/429 logs remain unchanged.
- Exact file-matcher lineage: implementation launch3 used an incorrect absolute-style matcher and yielded only denied drafts; the proven matcher correction was verified on public fixtures, then launch4 delivered seven assigned files (two native config Writes remained denied). This defect bucket used2 actual author generations, one correction. Codex integrated the exact two Claude-authored config payloads after Claude ended, then made attributed contract fixes and behavioral tests. No Claude permission bypass was used.
- Integration findings: prior uninvolved source reviewer found environment-pattern omissions, linked evidence-root writes and Git option/executable variants. Codex corrected these demonstrated defects in assigned paths; final25 tests and actual final negative probes bind the new candidate.
- PNG-runtime dependency lineage: first runtime preflight/capture-generation failed with500 due relative dependency junctions; one additive corrected generation succeeded, actual Claude capture executed once. Both generations retained. Old owned-junction unlink was rejected by automatic approval review (reason: blocked by policy); no alternate deletion bypass was attempted.
- Formatting lineage: raw managed checkout/global format failed2178 files because system core.autocrlf=true; first Git archive view inherited the same conversion and failed. One corrected view with git -c core.autocrlf=false archive plus exact candidate overlays passed; final refresh uses that same view, not another full copy. All3344 tracked files outside implementation allowlist and67 protected paths preserve baseline bytes.
- Validation race: architecture check overlapped typegen's temporary next-env replacement and observed ENOENT; original FAIL retained and sequential check after completed generation passed. No source repair or broadened scope.

Gate3 approval is still a separate fresh independent decision; checked implementation tasks do not self-approve it. Finish/archive/Knowledge/local commit remain post-review obligations. UI Product QA NOT_APPLICABLE; runtime/capture capability QA scope is explicit.

## Gate3 correction lineage

First fresh independent Gate3 verdict CHANGES_REQUESTED, source382 is the correction candidate, not a relabeling of priorPASS. Attempt1 source665f28ce... and exact24-entry packet bb5fc497... are retained at exports/gate3-attempt1-candidate; actual reviewer evidence exports/gate3-attempt1-review.md reports STANDARDS/SPEC/QA PASS but TIC/VERIFY FAIL for one proven single-tab direct-Git command-validation bypass. Codex rejected all non-ASCII-space whitespace and control characters, added Git/GitHub TAB/NBSP/NUL regressions, and reran25 tests/no skips. This new proven validator-defect lineage has one corrective action and one corrected verification generation; fresh Gate3 approval is still pending. Final actual positive worker purpose has3 generations total (001/003/004; reviewer002 is a separate purpose). Final strict Read-denial and exact Bash-denial purposes each used2 generations, old source retained and corrected-source observations newly bound. No further materially equivalent retries are authorized or needed. Historical FAIL/old native sessions are not rewritten.
