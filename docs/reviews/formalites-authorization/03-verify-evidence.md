# Technical VERIFY — formalites-authorization

Assessment source: this file, approved Proposal/Analysis/Spec/Design/Tasks,
current four-file implementation, [command results](03-command-results.md),
[baseline](phase-1-baseline.json) and [full scoped diff](03-implementation.diff).

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

VERIFY: PASS

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

## Completeness / correctness / coherence

8 requirements / 27 scenarios covered below; Design D1–D7 preserved. Phase 1
accepted by current user, Phase 2 evidence complete. Final Tasks has 8/8 completed
checkboxes; original planning prose remains untouched. No code/test edits were
needed in Phase 2. No Product or durable-boundary deviation.

Proposal: exactly two independent Formalités operations, cloud Backoffice only,
no durable draft consumer. Analysis: READY_FOR_SPECS assumptions still hold;
known broader Identity/Access documentation drift is not normalized here.
Spec: every scenario mapped. Design: separate private grant map, existing
TenantError semantics, small composition helper, no session refactor. Tasks:
both embedded contracts assessed independently below; no unused UI/data phase.

## Exact location key

Locations below are repository-relative; line numbers refer to reviewed bytes.

- P = `apps/backoffice/src/server/auth/permissions.ts`:6 (type), :8 (map),
  :16 (boolean), :28 (throwing); legacy blocks start :42.
- F = `apps/backoffice/src/server/auth/formalites.ts`:10 (request composition).
- S = `apps/backoffice/src/server/auth/session.ts`:59 (session requirement),
  :71 (trusted resolution), :99 (scope recovery), unchanged.
- T = `packages/tenant/src/index.ts`: `resolveAuthenticatedTenant` and
  `requireEstablishment`, unchanged; exact baseline file hash retained.
- U = `apps/backoffice/test/formalites-permissions.test.ts`:52 (operation suite),
  :99 (literal/Personnel isolation suite).
- C = `apps/backoffice/test/formalites-authorization-context.test.ts`:101 (OWNER),
  :134 (missing cookie), :142 (invalid session), :150 (invalid metadata),
  :157 (membership matrix), :174 (scope 400), :192 (roles), :204 (system roles),
  :225 (browser claims), :270 (forwarding), :299 (Personnel independence),
  :315 (safe return), :322 (failure propagation).
- REG = seven explicitly executed regression suites in 03-command-results.md;
  26/26 PASS, plus full Backoffice 436 PASS and Tenant 11 PASS.
- DIFF = 03-implementation.diff, reverse-check PASS; baseline comparison
  preserves 499/500 files and every legacy permission block byte.

## Technical Compliance Matrix — every Spec scenario

R1–R8 refer to the eight requirements in
`openspec/changes/formalites-authorization/specs/authorization/formalites/spec.md`,
in document order. Spec line identifies the exact scenario, not a new requirement.

| Spec requirement / scenario line             | Approved Design | Exact implementation                                | Exact executable test / evidence                                                                                                     | Result |
| -------------------------------------------- | --------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| R1 :17 requested operation                   | D1–D3, D7       | P:6/8/16, F:10                                      | U exact two operations/separate map; C:270 forwards each operation without reusing another result                                    | PASS   |
| R2 :29 OWNER READ                            | D2–D4           | P:16/28, F:10                                       | U formalites.read allows OWNER independently; C:101 read composition                                                                 | PASS   |
| R2 :34 OWNER MANAGE                          | D2–D4           | P:16/28, F:10                                       | U formalites.manage allows OWNER independently; C:101 manage composition                                                             | PASS   |
| R2 :39 MANAGER denial                        | D2–D4           | P:8/16, F:10                                        | U denies MANAGER with exact error; C:192 valid MANAGER denied, both operations                                                       | PASS   |
| R2 :44 STAFF denial                          | D2–D4           | P:8/16, F:10                                        | U denies STAFF with exact error; C:192 valid STAFF denied, both operations                                                           | PASS   |
| R3 :59 no authenticated user                 | D4–D5           | S:59/71 → F:10                                      | C:134 missing cookie and :142 null upstream session → exact login redirect                                                           | PASS   |
| R3 :64 missing membership                    | D4–D5           | S:71 → T resolver                                   | C:157 missing case → exact recovery redirect; no permission evaluation                                                               | PASS   |
| R3 :69 inactive membership                   | D4–D5           | S:71 → T resolver                                   | C:157 inactive case, real status validation                                                                                          | PASS   |
| R3 :74 wrong user                            | D4–D5           | S:71 → T resolver                                   | C:157 wrong-user case, real matching validation                                                                                      | PASS   |
| R3 :79 missing establishment                 | D3–D5           | F:15, P:32 → T guard                                | U null/empty false + exact 400; C:174 org-only malformed upstream rejected                                                           | PASS   |
| R3 :84 wrong organization                    | D4–D5           | S:71 → T resolver                                   | C:157 wrong-organization case denied before authorization                                                                            | PASS   |
| R3 :89 wrong establishment                   | D4–D5           | S:71 → T resolver                                   | C:157 wrong-establishment case denied before authorization                                                                           | PASS   |
| R3 :94 inactive user/org/establishment       | D4–D5, D7       | S:59/71 existing repository boundaries              | C:142 null-session and :150 null-metadata outcomes; actual SQL active-status implementation unchanged, no database integration claim | PASS   |
| R3 :99 browser authority claims              | D4–D5           | F:10 signature, S:71 lookups                        | C:225 hostile cookie/header/query claims ignored; identifiers from validated session; STAFF cannot elevate                           | PASS   |
| R4 :111 public actor                         | D2–D3           | P:16/28                                             | U public each operation false/403 with exact message/code/status                                                                     | PASS   |
| R4 :116 service actor                        | D2–D3           | P:16/28                                             | U service each operation false/403 with exact message/code/status                                                                    | PASS   |
| R4 :121 system role lacks membership         | D4–D5           | S:71 → T resolver                                   | C:204 YUTA_ADMIN/YUTA_SUPPORT missing membership recovery                                                                            | PASS   |
| R4 :126 system role cannot raise grant       | D2–D5           | P:16, F:10                                          | U does not elevate each system role; C:204 MANAGER/STAFF both operations denied                                                      | PASS   |
| R5 :139 Personnel allow is not proof         | D1–D2, D6       | P:16, F:10                                          | C:299 Personnel allow spies unused, STAFF remains denied; U source isolation                                                         | PASS   |
| R5 :145 MANAGE does not use Personnel        | D1–D2, D6       | P:8/16, F:10                                        | U forbids delegation and denies Personnel literal; C:299 manage denial                                                               | PASS   |
| R6 :159 Personnel unchanged                  | D2, D6–D7       | P:67 onward legacy map/guards unchanged             | REG personnel-permissions 2/2; DIFF exact legacy byte equality                                                                       | PASS   |
| R6 :164 Restaurant Knowledge unchanged       | D2, D6–D7       | P:63 and :187 legacy map/guards unchanged           | REG restaurant-knowledge-permissions 8/8; DIFF                                                                                       | PASS   |
| R6 :169 session/membership/scope unchanged   | D4–D7           | S/T unchanged                                       | Tenant 11/11, C real resolver tests, 499 protected hashes preserved                                                                  | PASS   |
| R7 :182 generic prototype unchanged          | D6–D7           | existing generic route/components unchanged         | REG formalites-cdi-prototype 5/5; DIFF/no imports, no extra development gate                                                         | PASS   |
| R7 :187 connected/source/dev gates unchanged | D6–D7           | existing connected route and runtime gate unchanged | REG connected-read 2/2 + runtime gate 1/1; six-fact projection/source-read preserved; DIFF                                           | PASS   |
| R8 :203 no workflow side effect              | D5–D7           | F:1–20 only auth composition                        | U source/import allowlist; C mocked adapters perform existing auth reads only; four-file DIFF has no data/provider/API code          | PASS   |
| R8 :209 no extra roles/production            | D2, D6–D7       | P:8 map, F unconnected                              | U/C deny MANAGER/STAFF, DIFF no wiring/env/schema/production changes                                                                 | PASS   |

## Phase Technical Implementation Contract matrix

| Phase / rule                                | Authority                                         | Implementation / evidence                                                                                                      | Result |
| ------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 1 — exact allowlist, baseline isolation     | Tasks 1 contract; root/Backoffice AGENTS          | phase-1-baseline.json, four-file diff and 499 protected files; no Phase 2 implementation edits                                 | PASS   |
| 1 — canonical ownership/runtime             | approved Proposal/Analysis, Design D1/D4/D5       | server-only Backoffice helper, no package/runtime changes                                                                      | PASS   |
| 1 — typed independent operations/grants     | Spec R1/R2; Design D1–D3                          | P + U + C:270; only OWNER                                                                                                      | PASS   |
| 1 — scope/denial semantics                  | Spec R3/R4; Design D3–D5                          | P/F + real S/T; U exact false/400/403 and C denial matrix                                                                      | PASS   |
| 1 — trusted input, system roles             | tenancy/authentication architecture; Design D4/D5 | C:134–225, no browser TenantContext parameter                                                                                  | PASS   |
| 1 — Personnel/RK isolation                  | Spec R5/R6; Design D2/D6                          | U/C isolation, exact legacy bytes, regression suites                                                                           | PASS   |
| 1 — no consumer/UI change                   | Spec R7; Design D6                                | source inventory only two auth modules; prototype/gate suites and baseline hashes                                              | PASS   |
| 1 — tests/typecheck/evidence limitations    | Design D7; Tasks 1.4                              | 59/59 executable tests, typecheck PASS; mocks explicitly bounded                                                               | PASS   |
| 1 — no persistence/provider/excluded scope  | Spec R8; Tasks exclusions                         | four-file diff contains only auth declarations/helper/tests                                                                    | PASS   |
| 2 — full regressions                        | Tasks 2.1; Design D7                              | Backoffice 436 PASS, Tenant 11 PASS, explicit regression 26 PASS; one external OpenAI smoke file skipped as designed           | PASS   |
| 2 — repository checks                       | Tasks 2.2; current-user formatting allowance      | typecheck/build/docs/architecture/strict PASS; scoped format PASS; full format FAIL on 62 unrelated files disclosed, no repair | PASS   |
| 2 — scoped diff, stable earlier authority   | Tasks 2.3; integrity protocol                     | exact 4-file manifest, reverse diff check, 12 approved hash refs MATCH                                                         | PASS   |
| 2 — separate technical assessment           | Tasks 2.3/2.4; VERIFY skill                       | this 27-scenario + phase-rule matrix, completeness/correctness/coherence assessment                                            | PASS   |
| 2 — non-browser authorization QA            | Tasks 2.4; QA protocol                            | qa/QA_REPORT.md: 59/59, no database/browser/deployment claim                                                                   | PASS   |
| 2 — rollback/exclusions/canonical knowledge | Design Migration Plan, Tasks 2 contract           | no consumer exists, no destructive rollback, no canonical edits or lifecycle promotions                                        | PASS   |
| 2 — Gate 3 boundary                         | run-change State 8; current user                  | packet pending human review and sync authorization; no sync/archive/deploy                                                     | PASS   |

## Commands and exact results

Full output and exact commands are in 03-command-results.md. Summary:

- `pnpm --filter @yuta/backoffice test`: exit 0, 85 passed files + 1 skipped,
  436 tests passed. Skipped `personnel-contract-openai-smoke.test.ts` selects no
  fixtures without explicit `YUTA_OPENAI_EVALUATION_RUN`; no external call enabled.
- `pnpm --filter @yuta/tenant test`: exit 0, 2 files, 11 tests passed.
- Explicit seven-suite regression: exit 0, 7 files, 26 tests, no skips/failures.
  Initial path with `(authenticated)` failed in the Windows pnpm launcher before
  Vitest ran (exit 1); retry uses the unique runtime-test basename, same script.
- `pnpm --filter @yuta/backoffice typecheck`: tsc completed without errors.
- `pnpm -r --if-present typecheck`: all applicable projects Done.
- `pnpm --filter @yuta/backoffice build`: exit 0, compiled/static generation
  complete, existing Formalités generic and connected routes remain dynamic.
- `pnpm docs:check`: passed 36 documents; `pnpm architecture:check`: passed.
- `openspec validate formalites-authorization --strict`: valid.
- `pnpm format:check`: exit 1, 62 unrelated files, no attributed-file warnings.
  Current user explicitly permits reporting this debt without fixing it.
- Scoped Prettier checks cover all four files plus current change/review artifacts;
  exact final command/result is recorded with Gate 3 integrity evidence.

No failure is hidden behind a focused PASS. Full repository formatting is NOT
PASS. That disclosed, authorized unrelated debt is not an approved-scope defect.

## Scoped diff and integrity

Sorted implementation inventory (all and only these four paths):

1. `apps/backoffice/src/server/auth/formalites.ts` — new.
2. `apps/backoffice/src/server/auth/permissions.ts` — additive tracked change.
3. `apps/backoffice/test/formalites-authorization-context.test.ts` — new.
4. `apps/backoffice/test/formalites-permissions.test.ts` — new.

Aggregate implementation/change hash is SHA-256 of exact **full scoped diff**
bytes, per run-change State 8 implementation-diff protocol, not a newly invented
concatenation of file hashes. Deterministic generation: paths ordinally sorted;
tracked section from `git -c core.quotepath=false diff --no-ext-diff --no-color --binary HEAD -- "<path>"`;
new sections from `git -c core.quotepath=false diff --no-index --no-ext-diff --no-color --binary -- /dev/null "<path>"`
(exit 1 means differences, expected); join stdout diff sections in that order,
normalize CRLF to LF, UTF-8 without BOM, final LF. Warnings before `diff --git`
are excluded. Baseline permissions.ts was clean against HEAD before Apply.

`git apply --reverse --check docs/reviews/formalites-authorization/03-implementation.diff`
exit 0. `git apply --stat` reports 4 files changed, 527 insertions, 0 deletions.
The three new files are explicitly included, not omitted by tracked-only diff.
`Get-FileHash -Algorithm SHA256` over exact artifact bytes supplies packet hashes.

Phase 1 reviewed implementation hashes still match. Comparing 500 baseline
tracked hashes yields only permissions.ts changed, 499 unchanged, including
session, tenant package, existing auth tests, prototype/gate/navigation/UI.
Legacy permissions suffix beginning `export type ReputationPermission` equals
the original bytes exactly. New-symbol rg inventory returns only P and F.
No attributable schema/migration/database/domain writes/provider/production code.
Unrelated dirty F07/workflow files remain outside this diff.

## Issues / limitations

CRITICAL: NONE. Approved-boundary deviation: NONE. Missing scenario: NONE.
WARNING: full repository format debt (62 unrelated files), expressly disclosed.
No database integration was run. Null repository outcomes test upstream contract
composition, not live SQL expiry/active checks. No browser rendering, real HTTP
route access, provider, production migration or deploy was executed. Browser QA
is NOT_APPLICABLE, but non-browser authorization QA is required and separate.

As-built scope is documented here; no canonical Product Knowledge or lifecycle
promotion. No durable draft behavior follows from these logical permissions.
