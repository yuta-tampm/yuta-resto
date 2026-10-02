# QA_REPORT — final non-browser tooling/runtime acceptance

Change: next-generated-types-bootstrap

QA: PASS

QA status: PASS

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

Browser QA: NOT_APPLICABLE

## Scope and setup

Non-browser local tooling/runtime QA; không thay Browser UX, production readiness hoặc deployment evidence. Không có screenshot requirement vì không đổi UI. Routes/roles/viewports/accessibility: NOT_APPLICABLE.

Accepted Windows/Linux tests dùng Node24.17.0, pinned pnpm11.8.0, Next16.2.9, installed TypeScript; exact-byte candidate snapshots bao gồm approved uncommitted source. Không copy env/node_modules/.next/incremental cache. Frozen install từng required fixture trước injection. Actual real Next cases không dùng fake CLI.

Raw evidence: [E2](../03-phase3-remediation-evidence.json), [E3](../03-phase3-completion-evidence.json); snapshots `0314828cb3ef26331f457bd772129f240726ac1b` (2215paths) và `880ed17ddd6adb47b1d585e82233820708202631` (2219paths). Implementation bytes của cả hai match current; chỉ review/progress thêm giữa các snapshot. [Closure](../03-phase3-closure-evidence.json) xác nhận 2221/2221 raw paths MATCH trước reporting; không acceptance rerun.

Linux thực chạy same supported CI conjunction trong isolated Docker `node:24.17.0-bookworm`, digest `sha256:733e1c06ada118ed9f6133a31aa1290be6929664026fb28821500437c61f2c6f`, kernel Linux6.6.87.2-microsoft-standard-WSL2 x86_64. Không claim hosted GitHub job. Container đã dừng. POS dùng script guard/disposable Docker DB, không production data.

## Actual N1–N9 — 31/31 per platform

62 accepted cases; full commands, cwd, exit, before-injection/invocation and after raw-source qualification, Formalités4/18/17 và process/filesystem trace ở E3 `matrixSummary`, trỏ E2/E3 raw record. F2 và R1 invalid fixtures không trong accepted62.

| Case               | Exact outcome / downstream assertion                             | Windows | Linux |
| ------------------ | ---------------------------------------------------------------- | ------- | ----- |
| async              | 1; no later generator / no recursive                             | PASS    | PASS  |
| cli-resolution     | 1; no later generator / no recursive                             | PASS    | PASS  |
| concurrent         | Owner0 / contender1; zero contender generators/unlinks/recursive | PASS    | PASS  |
| config-1           | 1; no later generator / no recursive                             | PASS    | PASS  |
| config-2           | 1; no later generator / no recursive                             | PASS    | PASS  |
| config-3           | 1; no later generator / no recursive                             | PASS    | PASS  |
| config-4           | 1; no later generator / no recursive                             | PASS    | PASS  |
| config-5           | 1; no later generator / no recursive                             | PASS    | PASS  |
| config-6           | 1; no later generator / no recursive                             | PASS    | PASS  |
| dev-lock           | 1; no later generator / no recursive                             | PASS    | PASS  |
| early              | 1; no later generator / no recursive                             | PASS    | PASS  |
| empty              | 1; no later generator / no recursive                             | PASS    | PASS  |
| foreign-lock       | 1; no later generator / no recursive                             | PASS    | PASS  |
| hard-link          | 1; no later generator / no recursive                             | PASS    | PASS  |
| linked-file        | 1; no later generator / no recursive                             | PASS    | PASS  |
| linked-parent      | 1; no later generator / no recursive                             | PASS    | PASS  |
| malformed          | 1; no later generator / no recursive                             | PASS    | PASS  |
| mismatched-package | 1; no later generator / no recursive                             | PASS    | PASS  |
| missing            | 1; no later generator / no recursive                             | PASS    | PASS  |
| missing-package    | 1; no later generator / no recursive                             | PASS    | PASS  |
| next-lock          | 1; no later generator / no recursive                             | PASS    | PASS  |
| nonregular         | 1; no later generator / no recursive                             | PASS    | PASS  |
| signal             | 1; no later generator / no recursive                             | PASS    | PASS  |
| spawn-error        | 1; no later generator / no recursive                             | PASS    | PASS  |
| success            | 0; six generators then recursive0                                | PASS    | PASS  |
| timeout            | 1; no later generator / no recursive                             | PASS    | PASS  |
| tracked-output     | 1; no later generator / no recursive                             | PASS    | PASS  |
| ts-resolution      | 1; no later generator / no recursive                             | PASS    | PASS  |
| version            | 1; no later generator / no recursive                             | PASS    | PASS  |
| write-failure      | 1; no later generator / no recursive                             | PASS    | PASS  |
| wrong-reference    | 1; no later generator / no recursive                             | PASS    | PASS  |

N1 six real config failures bao phủ đúng positions1–6; earlier generators được phép đã thành công, nhưng không later generator sau điểm lỗi. N2 strict async rejection không swallowed. N3 actual exit0/stale priming bị reject vì four outputs đã invalidated. N4 four separate result errors; N5 write/path/link/nonregular/tracked safety; N6 actual spawn/signal/120000ms timeout, owned child termination awaited. N7 actual overlapping owner/contender, no contender unlink/generation/check; lock token preserved, owner completes and releases. N8 five preflight cases mỗi platform. N9 normal6+recursive.

**N8 protocol exception chỉ ở fixture invocation:** `node scripts/generate-next-types.mjs` sau frozen install và declared metadata injection, 10/10 exit1/no generator/no recursive. User explicitly approved to prevent package-manager pre-run side effect. Canonical source và supported command không đổi; lockfile remains `bebba4709d2f5fc893921c475a6149788f25f5ffcb439e4a62257a73bf78bbdb`. Không coi một outer-pnpm mutation run là accepted negative proof.

## Clean successful flow and typechecks

- `pnpm install --frozen-lockfile`: accepted fresh install exit0; all six next-env/.next absent before generation.
- `pnpm typegen:next`: six actual strict generators,4fresh validated outputs/app,exit0.
- `pnpm typegen:next && pnpm -r --if-present typecheck`: actual Windows và Linux success exit0, recursive chỉ sau validated generation.
- `pnpm --filter @yuta/backoffice typecheck`, `@yuta/web`, `@yuta/booking-web`, `@yuta/feedback-web`, `@yuta/pos`, `@yuta/display`: six commands independently exit0. Exact full invocations trong E3 `completion-post-dev-checks.json`.
- `node --test scripts/next-generated-types-bootstrap.test.mjs`: **50/50 PASS**, zero fail/skip/cancel,exit0; serial exclusive checkout. R2 earlier overlapping run remains diagnostic, not accepted.

## Six actual builds

E2 `normalCommands.buildsAndDirectTypechecks`; all post-remediation accepted, no closure rerun.

| Exact command                          | Exit | Duration ms | Result |
| -------------------------------------- | ---- | ----------- | ------ |
| pnpm --filter @yuta/backoffice build   | 0    | 75066       | PASS   |
| pnpm --filter @yuta/web build          | 0    | 46647       | PASS   |
| pnpm --filter @yuta/booking-web build  | 0    | 50784       | PASS   |
| pnpm --filter @yuta/feedback-web build | 0    | 35916       | PASS   |
| pnpm --filter @yuta/pos build          | 0    | 64391       | PASS   |
| pnpm --filter @yuta/display build      | 0    | 38160       | PASS   |

All tracked sources stable; synthetic/app-scoped local setup. Retain raw build warnings in E2 (including Display tracing warnings); không sửa business code hoặc claim deployment.

## Six actual dev smoke runs

E3 `runs/dev-smoke-complete.json`. Startup criterion is Ready **AND** dev routes declaration plus dev import in next-env; Ready log alone không đủ.

| Exact command                                                                    | Observed                              | Final process exit           | Result |
| -------------------------------------------------------------------------------- | ------------------------------------- | ---------------------------- | ------ |
| pnpm --filter @yuta/backoffice exec next dev --hostname 127.0.0.1 --port 52188   | Ready + dev declarations; port closed | 1 after owned taskkill /T /F | PASS   |
| pnpm --filter @yuta/web exec next dev --hostname 127.0.0.1 --port 50461          | Ready + dev declarations; port closed | 1 after owned taskkill /T /F | PASS   |
| pnpm --filter @yuta/booking-web exec next dev --hostname 127.0.0.1 --port 63558  | Ready + dev declarations; port closed | 1 after owned taskkill /T /F | PASS   |
| pnpm --filter @yuta/feedback-web exec next dev --hostname 127.0.0.1 --port 63565 | Ready + dev declarations; port closed | 1 after owned taskkill /T /F | PASS   |
| pnpm --filter @yuta/pos exec next dev --hostname 127.0.0.1 --port 63574          | Ready + dev declarations; port closed | 1 after owned taskkill /T /F | PASS   |
| pnpm --filter @yuta/display exec next dev --hostname 127.0.0.1 --port 63582      | Ready + dev declarations; port closed | 1 after owned taskkill /T /F | PASS   |

Shutdown dùng explicit owned PID tree termination, không claim graceful-signal coverage. After shutdown six ports closed, no .next/dev/lock or .next/lock, source hashes stable. Không mutate browser/API/data.

## Generated state and source integrity

- Typegen/build/dev được phép regenerate local next-env; exact six paths untracked/ignored, không source drift.
- Current `git ls-files -- <six paths>` empty; `git check-ignore -v` đúng .gitignore lines3–8 exact root rules. Six staged index deletions là expected transition, không new drift. No other declaration/source ignored.
- README negative control: harmless disposable-only mutation; `git diff --exit-code -- README.md` exit1; `git check-ignore --no-index README.md` exit1 (not ignored); status chỉ README.
- Raw SHA before `5404c00ca3032a34137096edd34a6b4997e2c460d02ded3a63b8f224b9a74ef8`; after `8efa353c80116da8acc4107a32465bf171c5b1f54c073ba64d51af98c9481e5c`. Strict full-candidate comparator rejects at exit1 **before** `node --version`; exact raw-byte comparison, no normalization.
- User manually removed the disposable fixture. Current read-only check confirms absent directory and worktree registration, no bootstrap/Next locks, process or owned listener. Historical disposal block is resolved, not carried forward as BLOCKED_BY_ENVIRONMENT.
- Formalités4/4 implementation +18/18 integrity +17/17 supplemental before/after accepted stages and current closure all MATCH.

## Full POS offline regression

E2 `normalCommands.posOffline`:

| Initial POS next-env state | Exact command         | Exit | Duration ms | Result |
| -------------------------- | --------------------- | ---- | ----------- | ------ |
| Absent                     | pnpm test:pos:offline | 0    | 83373       | PASS   |
| Already generated          | pnpm test:pos:offline | 0    | 104476      | PASS   |

Full script assertions executed, not syntax-only substitute; disposable container/seed/migration setup isolated, no production operation. Housekeeping removal remains bounded; existing business/auth/order/report/cleanup assertions unchanged. Task3.6 historical completion remains intact.

## Checks, diagnostics and limitations

Docs/architecture/strict OpenSpec/scoped formatting PASS. Full `pnpm format:check` **FAIL exit1 — exactly62 pre-existing unrelated files**, raw bytes still match original Phase1. Exact list/hashes and accepted disposition in closure evidence. Không repair/no broad ignore/no false full-format PASS.

Historical findings preserved: F1 led approved D1/D2 remediation; F2 diagnostic-only nonexact fixture; R1 invalid package-manager pre-run fixture; R2 agent scheduling overlap. All required replacement evidence accepted. Initial dev observation ended too early at Ready; valid six-app rerun above replaces it. Wrong-root comparator probe ran no command and is not acceptance. Historical reports and raw evidence remain; prior QA/VERIFY text preserved in closure JSON.

No unresolved required QA issue. No UI/browser/screenshots, external provider, real personnel files, production DB, deployment, lifecycle promotion or Formalités operation claimed. Closure reuses accepted tests by explicit instruction after unchanged-byte check; no costly test rerun merely for review-doc changes.

## Conclusion

QA: PASS — applicable Windows/Linux, bootstrap, failure/success, build/dev, POS and source-integrity/disposal dimensions complete. Technical VERIFY remains a separate [report](../03-verify.md). Gate3 human review required; Sync authorization: PENDING.
