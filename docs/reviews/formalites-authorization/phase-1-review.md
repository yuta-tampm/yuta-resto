# Phase 1 — Service / Domain

Change: formalites-authorization

Schema: yuta-spec-driven

Review status: APPROVED

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-03T23:02:14.6708282+02:00

Approval scope: Phase 1 accepted; proceed with Phase 2 only.

Phase 1 Technical Implementation Contract: PASS

Scope: tasks 1.1–1.4 only. Phase 2 chưa bắt đầu. Không phải Gate 3,
không claim toàn change VERIFY/QA PASS. UI_AFFECTING: NO.

## Approval and baseline

Current user duyệt Tasks + Implementation Plan và chỉ cho Apply Phase 1.
Gate 1, Gate 2 và Sensitive Design Gate đã APPROVED. Trước Apply, 12 embedded
hash references (2 + 4 + 6) đều MATCH; selected delta vẫn chỉ
`authorization/formalites/spec.md`. Proposal/Analysis/Spec/Design không sửa.

[Baseline](phase-1-baseline.json) được capture trước implementation bằng
`git rev-parse HEAD`, `git status --short`, scoped `git status --short -- <four allowed paths>`,
`git ls-files -- apps/backoffice/src apps/backoffice/test packages/tenant`,
`Get-FileHash -Algorithm SHA256` và `[IO.File]::ReadAllBytes`.

- HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.
- Capture: `2026-09-03T22:50:21.4336104+02:00`.
- Scoped status: empty; permissions.ts sạch, ba target mới chưa tồn tại.
- 500 tracked-file byte hashes; permissions.ts có thêm base64 exact original bytes.
- Full dirty-status inventory gồm unrelated F07/workflow work và untracked paths;
  không quy các thay đổi đó cho prerequisite này.
- Approved Tasks SHA-256 trước checkbox progress:
  `51fc898a0f961f769f17cf30235868aa060a49e4915123949a02a8f197afbdb0`.

## Exact changed files

| File                                                            | Change / SHA-256                                                                                         |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `apps/backoffice/src/server/auth/permissions.ts`                | Additive Formalités union/map/guards; `e3a21cf5b8456a859762d8603500669ead764e3bd43a8ba06a2ad17620014353` |
| `apps/backoffice/src/server/auth/formalites.ts`                 | New scoped helper; `60b1c5369ef3b28af7377c6e8920707e8643f13269a82d192125c009b9333626`                    |
| `apps/backoffice/test/formalites-permissions.test.ts`           | New focused tests; `9e9888461c4154df90802f3d9021956dba3731cd34a9d27aa110d08ba9bc42e6`                    |
| `apps/backoffice/test/formalites-authorization-context.test.ts` | New real-composition tests; `af3a2bd48565cec5afb559602626b16c563f21ca3ec660b7943e4e49327f4537`           |
| `openspec/changes/formalites-authorization/tasks.md`            | Checkboxes 1.1–1.4 only                                                                                  |
| `docs/reviews/formalites-authorization/phase-1-baseline.json`   | Pre-Apply provenance/hash inventory                                                                      |
| `docs/reviews/formalites-authorization/phase-1-review.md`       | This scoped evidence                                                                                     |

## Focused evidence / contract assessment

| Contract item                          | Evidence                                                                                                                                                               | Result |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1.1 baseline and isolation             | 4 target paths clean; 500-file hash baseline, full status inventory                                                                                                    | PASS   |
| Exact independent operations           | FormalitesPermission is exactly read/manage; distinct private OWNER arrays; permission-indexed evaluator; compile-time exact-union assertion and source assertion      | PASS   |
| OWNER READ / MANAGE                    | Separate operation cases exercise real boolean + throwing guards and real trusted composition                                                                          | PASS   |
| MANAGER / STAFF                        | Both operations false/403; also rejected after actual membership resolution                                                                                            | PASS   |
| Public / service                       | Both operations false/403; exact TenantError class, code, statusCode, message                                                                                          | PASS   |
| System-role no bypass                  | YUTA_ADMIN/YUTA_SUPPORT cannot elevate MANAGER/STAFF; missing membership still redirects                                                                               | PASS   |
| Missing scope                          | null/empty establishment false; throwing path ESTABLISHMENT_REQUIRED/400/An establishment is required.; composition rejects malformed org-only upstream fixture        | PASS   |
| Denied operation / unknown key         | CROSS_TENANT_ACCESS_DENIED/403/Permission denied.; unknown, Personnel literal, inherited object keys all fail closed                                                   | PASS   |
| Actual context composition             | Actual session.ts, actual tenant resolver, actual guards; mocked cookies/DB factories/redirect transport; no mocked requireAuthenticatedTenant                         | PASS   |
| Missing/inactive/mismatched membership | Null, suspended, wrong user, wrong org, wrong establishment all hit exact existing recovery redirect before permission evaluation                                      | PASS   |
| Missing/invalid upstream               | Missing cookie avoids session lookup; null session avoids metadata; null metadata avoids membership; exact login/recovery destinations preserved                       | PASS   |
| Browser claims ignored                 | Cookie/header/query claims cannot replace trusted session identifiers; only session cookie read, headers unused; STAFF remains denied despite OWNER claim              | PASS   |
| Independent operation forwarding       | Controlled evaluator allows READ/denies MANAGE; wrapper forwards each exact operation without substituting/caching grant                                               | PASS   |
| Personnel independence                 | Mock Personnel allow is never invoked and cannot turn Formalités denial into allow; source checks forbid delegation                                                    | PASS   |
| Legacy Personnel/RK preservation       | Entire permissions.ts suffix from ReputationPermission through EOF byte-identical to baseline; includes all legacy types/maps/helpers                                  | PASS   |
| Prototype/session/tenant preservation  | 499/500 baseline files byte-identical; sole changed tracked source is permissions.ts. New symbols appear only in two allowed auth modules, no existing consumer wiring | PASS   |
| Small server-only boundary             | Helper only imports existing tenant guard, permissions and session; no domain writes/provider imports/API/client exports                                               | PASS   |
| 1.4 focused checks                     | 59/59 tests and Backoffice typecheck PASS                                                                                                                              | PASS   |

New tests: permission suite 25 cases, context suite 34 cases, total 59; no skips.
Context mocks only infrastructure boundaries, React cache is passthrough between
synthetic requests. Null session/metadata simulate existing repository outcomes:
this does NOT prove database expiry/active-status SQL integration. No database,
live browser, provider or production authorization evidence is claimed.

## Commands actually executed and results

| Exact command                                                                                                                                                                                                                               | Result                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openspec status --change formalites-authorization --json`                                                                                                                                                                                  | Exit 0; resolved yuta-spec-driven; planning complete, Apply progress separate                                                                                                       |
| `openspec instructions apply --change formalites-authorization --json`                                                                                                                                                                      | Exit 0; ready, 0/8 at start                                                                                                                                                         |
| `pnpm --filter @yuta/backoffice test test/formalites-permissions.test.ts test/formalites-authorization-context.test.ts`                                                                                                                     | Three runs exit 0, each 2 files / 59 tests passed; latest 22:53:45, duration 549ms                                                                                                  |
| `pnpm --filter @yuta/backoffice typecheck`                                                                                                                                                                                                  | First exit 2: TS2352 in system-role synthetic test fixture. Removed unnecessary cast without changing behavior. Rerun exit 0                                                        |
| `pnpm docs:check`                                                                                                                                                                                                                           | Exit 0, 36 current documents passed                                                                                                                                                 |
| `pnpm architecture:check`                                                                                                                                                                                                                   | Exit 0, runtime imports/database URLs/client boundaries/migration baselines valid                                                                                                   |
| `pnpm -r --if-present typecheck`                                                                                                                                                                                                            | Exit 0, 15 of 16 workspace projects; all applicable typechecks done                                                                                                                 |
| `pnpm exec prettier --write apps/backoffice/src/server/auth/formalites.ts apps/backoffice/test/formalites-permissions.test.ts apps/backoffice/test/formalites-authorization-context.test.ts`                                                | Exit 0; scoped formatting only                                                                                                                                                      |
| `pnpm exec prettier --check apps/backoffice/src/server/auth/permissions.ts apps/backoffice/src/server/auth/formalites.ts apps/backoffice/test/formalites-permissions.test.ts apps/backoffice/test/formalites-authorization-context.test.ts` | First exit 1 for context-test formatting; after formatting that file again, exit 0, all matched files pass                                                                          |
| `pnpm exec prettier --write apps/backoffice/test/formalites-authorization-context.test.ts`                                                                                                                                                  | Exit 0; scoped format correction                                                                                                                                                    |
| `pnpm format:check`                                                                                                                                                                                                                         | Exit 1, 63 warnings at execution: 62 already reported outside scope in planning + context-test formatting since corrected. Full repository formatting is NOT PASS; no unrelated fix |
| `git diff -- apps/backoffice/src/server/auth/permissions.ts`                                                                                                                                                                                | Exit 0, one additive hunk, 37 inserted lines; Git reports LF-to-CRLF warning, no legacy byte drift in working file                                                                  |

Exact source inventory command (exit 0, only permissions.ts and formalites.ts):

```powershell
rg -l "formalites\.(read|manage)|requireFormalitesTenant|requireFormalitesPermission|hasFormalitesPermission" apps/backoffice/src
```

Read-only discovery also attempted `Get-Content apps/backoffice/vitest.config.ts`:
path absent, no config was created. Existing package script `vitest run` was used.
Full Backoffice/Tenant regression tests and build are Phase 2, NOT RUN here.
No browser QA, database integration, migration, persistence, production operation,
sync or archive. Repository-wide mandatory checks do not mark Phase 2 tasks done.

## Scoped comparison method

For each file in baseline.files compare current `Get-FileHash` against sha256.
Observed changed list: only `apps/backoffice/src/server/auth/permissions.ts`;
499 preserved. Decode permissionsBytes with `[Convert]::FromBase64String`, read
current text using `[IO.File]::ReadAllText`, select each suffix starting at
`export type ReputationPermission`, compare UTF-8 bytes: TRUE. This preserves
every existing union/map/function byte, not just grants. Current new-symbol
source inventory finds only the two allowed modules, so generic/connected
prototypes, development gates, source-read, navigation and consumers are untouched.

## Deviations and next gate

Final artifact checks: `openspec validate formalites-authorization --strict`
exit 0 (valid); `pnpm docs:check` rerun exit 0 (36 documents).
`pnpm exec prettier --write docs/reviews/formalites-authorization/phase-1-review.md docs/reviews/formalites-authorization/phase-1-baseline.json`
exit 0; corresponding `pnpm exec prettier --check` on those two paths plus
`openspec/changes/formalites-authorization/tasks.md` exit 0.
Final `openspec instructions apply --change formalites-authorization --json`
exit 0: 4/8 complete, exactly 1.1–1.4; Phase 2 unchecked.

Tasks integrity diagnostic initially failed because a PowerShell replacement
string used double quotes around `$1` (shell interpolation), not because the
artifact changed. Correct single-quoted replacement
`$tasks -replace '(?m)^- \[x\] (1\.[1234] )', '- [ ] $1'`
restores approved Tasks SHA-256 exactly; only four checkboxes differ. Final gate
hash recomputation MATCH for all three packets; 499 protected file hashes still
match baseline. This diagnostic error caused no file edits.

Approved scope/design deviation: NONE. Required Phase 1 evidence blocked: NONE.
Global formatting remains a disclosed repository-level failure outside this
phase after the in-scope formatting correction. No claim of full repository PASS.
No lifecycle, canonical ownership, permission beyond two literals, runtime or
tenant boundary changed.

Phase 1 Technical Implementation Contract: PASS.

STOP for human Phase 1 review. Phase 2, final VERIFY/QA and Gate 3 remain pending.
