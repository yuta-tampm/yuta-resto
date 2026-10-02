# Phase 4 — Technical Compliance and VERIFY evidence

Change: `reputation-review-social-links-configuration`

Created: `2026-09-06` (Europe/Paris)

Provenance HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`

TECHNICAL IMPLEMENTATION COMPLIANCE: `PASS`

VERIFY: `PASS`

QA: `PASS` — separate evidence in [`qa/QA_REPORT.md`](qa/QA_REPORT.md)

Production: `NOT_AUTHORIZED`

## Authority and frozen baseline

The approved Proposal, Analysis, Spec, and Design remained byte-identical:

| Artifact      | SHA-256                                                            | Result                                  |
| ------------- | ------------------------------------------------------------------ | --------------------------------------- |
| `proposal.md` | `12f138ad7de17186a313e14a08cb26f4f06333be2a03f8fc2445a63f8338ad61` | MATCH                                   |
| `analysis.md` | `02c0213d17c754b3617738da4c4ef04aca4566e3ec42d669192cbe086b2a1f4d` | MATCH                                   |
| delta Spec    | `ba36028f4d8461ca8f8742eff00d81ad14e45ee14ffbabc0b4787749679dad07` | MATCH — 15 Requirements / 103 Scenarios |
| `design.md`   | `3ab0ee2c9c84df1ef58157b3e026fab551cc973d88dd77448c0caa2a774f8582` | MATCH                                   |

The final pre-QA protected implementation/page-pack set was rechecked before
and after real-route QA. All approved hashes in the Phase 1, Phase 2, Phase 3A,
Phase 3B, and Phase 3C review packets matched. Browser QA changed only
disposable test data and new review evidence.

## Exact implementation inventory

The implementation aggregate contains exactly 14 paths. The complete attributed
diff is [`03-implementation.diff`](03-implementation.diff), SHA-256
`0faa1b118f6b7104f1463c83c9279a99cbf138b31eea13c4aea51d1cb75f327f`,
117125 bytes, 14 `diff --git` sections.

| Path                                                                                                                      | Current SHA-256                                                    |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_components/review-social-links-settings.tsx` | `16710b1bedbd94ccca7932a2a2b83b475a7325c962eca7adcb4ee90d68487dbe` |
| `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_lib/review-social-links-state.ts`            | `78a05f1eead39c13919ab0b45dd66f00a1009f3bcf0d7ffa3d25d23bb3cc3d74` |
| `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/actions.ts`                                   | `b23d7d00da9e700b91d35fdead8ab235abe70a524e32c2bf57157171805fabe1` |
| `apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx`                                     | `b8caf1028cb0f579d9facb9274bdd80a404a890ce2f8ef8b7aa242c8440c44d2` |
| `apps/backoffice/test/reputation-review-social-links-actions.test.ts`                                                     | `3eb692b5e351e8e6f053b95fdd6a99bd289f91dc68744188b5483028b35cc9ee` |
| `apps/backoffice/test/reputation-review-social-links-component.test.tsx`                                                  | `5d26a9b3f5892cb0b05e823d659b855e3b3ee6e6ff3c158c514c91ff15ef553a` |
| `apps/feedback-web/src/app/[tenantSlug]/_components/feedback-form.tsx`                                                    | `4a017f3b31a7a86f47813cedbc24423c4a5b79bca7f00bf732d4df5b007ad32a` |
| `packages/contracts/src/reputation/index.ts`                                                                              | `d0b67b273b94dfb9f262de9a133bdcbc69d65c86880d1fc6adf6a4447a0df752` |
| `packages/contracts/test/reputation.test.ts`                                                                              | `d7143b5bb4d61e55330a56414d37216253a448c83e776d760429f2778046f394` |
| `packages/db-cloud/src/index.ts`                                                                                          | `65e889949678d1b379d634b98cd2b61e92d3e0602e1933db36255a5dc1f8a3d3` |
| `packages/db-cloud/src/reputation-repository.ts`                                                                          | `1bdbad6e2f9b6d964b83ced0a8f2549805a8d3a57bbe5f9c77ff5d3464d047c2` |
| `packages/db-cloud/src/reputation-review-social-links.ts`                                                                 | `7c92e70b9635717f8249f5bf7eed447c464f95a64aee31ff8c92793e241921a4` |
| `packages/db-cloud/test/reputation-review-social-links-inventory.test.ts`                                                 | `1596fef51c8b2b7590ca6439530dc7abd28d0edb0ab0155611fbd7c80fe973ed` |
| `packages/db-cloud/test/reputation-review-social-links.integration.test.ts`                                               | `dea7284075aef73c48d41f9cdd3c46aa6b4cb5525ce0cee559997728c39d7464` |

The `packages/db-cloud/src/index.ts` section contains only the attributable
`reputation-review-social-links` export. Existing unrelated dirty work is not
absorbed. No schema, migration, journal, grant map, navigation, shared UI
primitive, provider connector, or production configuration path is present.

## Technical Compliance Matrix

Every child Scenario of each Requirement is covered by its parent row below;
the scenario count is explicit so all 103 scenarios are mapped, not sampled.

| Requirement and included Scenarios                                      | Design          | Implementation                                          | Executable evidence                                                                         | Result |
| ----------------------------------------------------------------------- | --------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------ |
| 1. Trusted Reputation ownership/scope — all 8 Scenarios                 | D1, D3, D5, D10 | db-cloud operation, Backoffice page/action              | PostgreSQL scoped read/missing/cross-scope tests; action auth tests; missing-row Browser QA | PASS   |
| 2. Existing Reputation authority, OWNER-only settings — all 5 Scenarios | D1, D9, D11     | Backoffice page/action; existing permission map reused  | 27 focused Backoffice tests; OWNER/MANAGER/STAFF Browser QA                                 | PASS   |
| 3. Exactly three nullable values — all 3 Scenarios                      | D2, D9          | contracts and route-local form model                    | 54 focused contract tests; empty/populated Browser QA                                       | PASS   |
| 4. One explicit Save — all 8 Scenarios                                  | D5, D11         | form/state/action and locked repository Save            | component tests; PostgreSQL mutation matrix; real OWNER Save                                | PASS   |
| 5. Multi-field all-or-nothing — all 3 Scenarios                         | D5, D8          | one locked transaction and mutation-level audit         | invalid/update-fault/audit-fault rollback on disposable PostgreSQL                          | PASS   |
| 6. Normalized no-op and authoritative success — all 3 Scenarios         | D5, D6, D9      | shared normalization, D2 branch, response model         | contract and PostgreSQL no-op tests; real Save/reload                                       | PASS   |
| 7. Conflict and response-loss replay — all 6 Scenarios                  | D4–D7, D9       | state token, marker parser, decision table, UI recovery | PostgreSQL stale/D1/D2/ABA tests; two-tab conflict/reload Browser QA                        | PASS   |
| 8. Common URL safety — all 12 Scenarios                                 | D2              | single pure contracts policy                            | exhaustive 54-test provider matrix                                                          | PASS   |
| 9. Google exact hosts/paths — all 17 Scenarios                          | D2              | contracts provider allowlist                            | accepted/rejected Google host/path matrix                                                   | PASS   |
| 10. Facebook bounded hosts — all 8 Scenarios                            | D2              | same contracts provider policy                          | accepted/rejected Facebook matrix                                                           | PASS   |
| 11. Instagram bounded hosts — all 6 Scenarios                           | D2              | same contracts provider policy                          | accepted/rejected Instagram matrix                                                          | PASS   |
| 12. Manual Google URL and GBP independence — all 5 Scenarios            | D15             | inventory guard; no connector consumer/writer           | five inventory tests and scoped diff review                                                 | PASS   |
| 13. Safe public projection — all 7 Scenarios                            | D10, D13        | db-cloud safe projection and feedback success CTAs      | 7 render tests; all/mixed/null Browser QA; exact target/rel DOM inspection                  | PASS   |
| 14. Atomic SETTINGS audit — all 8 Scenarios                             | D5, D8, D14     | locked transaction and strict qualified audit           | 10 PostgreSQL integration tests including faults/concurrency/actor nullification            | PASS   |
| 15. No provider/production expansion — all 4 Scenarios                  | D1, D15, D16    | bounded 14-path implementation                          | inventory guard, architecture/docs checks, diff review                                      | PASS   |

## Phase Technical Implementation Contracts

| Phase                           | Scope/invariants                                         | Required evidence                                                                                   | Stop condition status                             | Result |
| ------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------ |
| 1 — Contracts/provider policy   | One strict shared policy and typed outcomes only         | 54 focused / 98 full contract tests; typecheck                                                      | No wildcard/network/schema/new dependency         | PASS   |
| 2 — Trusted db-cloud operation  | Scoped read, locked atomic Save, D1/D2/ABA, strict audit | 15/15 real PostgreSQL tests, zero skipped; typecheck; inventory guard                               | No schema/migration/permission/provisioning/purge | PASS   |
| 3 — Page pack/Backoffice/public | Existing route, one OWNER form, safe public CTAs         | human-approved page pack; 27 Backoffice tests; 7 public render tests; typechecks                    | No route/navigation/shared UI/auth change         | PASS   |
| 4 — Integration/VERIFY/QA       | Cross-boundary regression and real-route Browser QA      | builds, recursive typecheck, strict docs/architecture/OpenSpec/UI-pack checks, 16 final screenshots | No required scoped evidence blocked               | PASS   |

TECHNICAL IMPLEMENTATION COMPLIANCE: `PASS` — every applicable matrix row
passes and no approved-scope deviation remains.

## Commands and exact outcomes

| Command                                                                                                                                                                        | Result                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/contracts exec vitest run test/reputation.test.ts --reporter=dot`                                                                                         | PASS — 1 file, 54 tests                                                                                        |
| `pnpm --filter @yuta/contracts test`                                                                                                                                           | PASS — 4 files, 98 tests                                                                                       |
| `pnpm --filter @yuta/contracts typecheck`                                                                                                                                      | PASS — exit 0                                                                                                  |
| guarded focused db-cloud Reputation integration + inventory on `yuta_reputation_qa`                                                                                            | PASS — 2 files, 15 tests, zero skipped                                                                         |
| `pnpm --filter @yuta/db-cloud test` without integration opt-in                                                                                                                 | PASS — 9 files / 47 tests; 19 files / 131 integration tests truthfully skipped by their guards                 |
| `pnpm --filter @yuta/db-cloud typecheck`                                                                                                                                       | PASS — exit 0                                                                                                  |
| `pnpm --filter @yuta/backoffice exec vitest run test/reputation-review-social-links-actions.test.ts test/reputation-review-social-links-component.test.tsx --reporter=verbose` | PASS — 2 files, 27 tests                                                                                       |
| `pnpm --filter @yuta/backoffice test`                                                                                                                                          | PASS — 92 files passed, 1 skipped; 511 tests                                                                   |
| `pnpm --filter @yuta/backoffice typecheck`                                                                                                                                     | PASS — exit 0                                                                                                  |
| `pnpm --filter @yuta/backoffice build`                                                                                                                                         | PASS — Next 16.2.9 production build                                                                            |
| `pnpm --filter @yuta/backoffice exec vitest --root ../.. run docs/reviews/reputation-review-social-links-configuration/evidence/phase-3c-feedback-cta.test.tsx --reporter=dot` | PASS — 1 file, 7 tests                                                                                         |
| `pnpm --filter @yuta/feedback-web typecheck`                                                                                                                                   | PASS — exit 0                                                                                                  |
| `pnpm --filter @yuta/feedback-web build`                                                                                                                                       | PASS — Next 16.2.9 production build                                                                            |
| `pnpm typegen:next`                                                                                                                                                            | PASS — all six Next applications, four generated artifacts validated per app                                   |
| `pnpm -r --if-present typecheck`                                                                                                                                               | PASS — 15 of 16 workspace projects; all declared typechecks completed                                          |
| `pnpm ui:pack:check backoffice-visibilite-reputation-satisfaction`                                                                                                             | PASS — 1 package, 0 warnings                                                                                   |
| `pnpm docs:check`                                                                                                                                                              | PASS — 36 current documents                                                                                    |
| `pnpm architecture:check`                                                                                                                                                      | PASS                                                                                                           |
| `pnpm exec openspec validate reputation-review-social-links-configuration --strict`                                                                                            | PASS                                                                                                           |
| `git diff --check`                                                                                                                                                             | PASS; line-ending advisories only                                                                              |
| scoped Prettier for attributable source, page-pack, review, and OpenSpec files                                                                                                 | PASS                                                                                                           |
| `pnpm format:check`                                                                                                                                                            | FAIL outside scope — exactly 67 pre-existing unrelated files; no attributable Phase 4 file remains unformatted |

## Real PostgreSQL evidence

The required feature matrix ran on a disposable PostgreSQL 17 database reached
only through `127.0.0.1:56061`, with
`YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true`. It passed 15/15 tests with no
skip: scoped read/missing/cross-scope, public safe projection, single and
multi-provider mutation, ordered one-audit behavior, invalid/no-op, D1/D2,
stale conflict, ABA, concurrent writers, malformed/ambiguous evidence, nullable
actor FK behavior, subsequent authorized mutation, inventory boundaries, and
settings/audit failure rollback.

A broad all-integration db-cloud invocation was also attempted sequentially on
a fresh disposable database. It reported 25 passed files, 1 skipped, 148 passed
tests, 29 skipped, and two unrelated failures:

1. `tenant-user-repository.integration.test.ts` requires a database name matching
   `yuta_owner_preservation_test*`; rerunning it on a correctly named disposable
   database passed 27/27 tests.
2. `personnel-repository.integration.test.ts` newest-50 assertion uses fixed
   `2026-09-04` timestamps while the created employee event is dated
   `2026-09-06`, so the newer setup event is correctly first. This time-sensitive
   pre-existing Personnel test is outside the 14-path change scope.

Neither failure affects or replaces the zero-skip, real-PostgreSQL Reputation
matrix. No production database was accessed.

## Security, scope, and regression review

- Authorization is performed before Save payload parsing.
- Trusted organization plus establishment scope is required for every private
  read/write; browser role/scope fields cannot create authority.
- Missing row fails closed and does not create a row or unrelated Reputation
  values.
- There is no second provider allowlist, wildcard hostname, redirect/network
  lookup, Google connector writer, qualified-audit purge, or public unsafe
  fallback.
- A real mutation and one ordered `SETTINGS` audit commit or roll back together.
- No credential, IP, user-agent, or raw request metadata is stored in the audit.
- No schema, migration, permission, navigation, shared UI, provider, or
  production behavior was added.

## VERIFY conclusion

The implementation matches the approved Proposal, Analysis, all 15
Requirements/103 Scenarios, Design D1–D16, SD-R1/SD-R2, accepted page pack, and
all four phase contracts. The exact 14-path implementation diff contains no
approved Product/Design deviation and no unexplained source drift.

VERIFY: `PASS`
