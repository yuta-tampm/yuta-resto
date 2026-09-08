## 1. Foundation / Data

### Planning authority and status

Change: `formalites-legal-template-foundation`. Schema: `yuta-spec-driven`. Classification: `CROSS_MODULE / DATA_OWNERSHIP_SENSITIVE / LEGAL_PRIVACY_SENSITIVE`. Gate 1 / Gate 2 / Gate 2b: APPROVED; Tasks / Implementation Plan / embedded Technical Implementation Contracts: **AWAITING_HUMAN_REVIEW**. Apply: **NOT AUTHORIZED**. Tất cả checkboxes dưới đây là future implementation, chưa execute hoặc complete.

Current-user request tại `C:/Users/Tam/.codex/attachments/f28d3568-59a1-414f-b311-d4b13401dff7/pasted-text.txt` chỉ authorize planning. [Design D1–D10](design.md) và [delta 14 requirements / 42 scenarios](specs/formalites/legal-template-foundation/spec.md) giữ exact bytes. Implementation Plan và ba Contracts nằm trong file này, không new artifact type hoặc premature Gate 3 packet.

`UI_AFFECTING: NO`; `BROWSER_QA_REQUIRED: NO`. UI / Components: `NOT_APPLICABLE`; Interaction / browser states: `NOT_APPLICABLE`. **Non-browser QA: REQUIRED**, tuyệt đối không `NOT_APPLICABLE`; current execution chưa được authorize. Nếu không có verified disposable PostgreSQL database khi thực hiện required QA: `QA: BLOCKED_BY_ENVIRONMENT`, Gate 3 blocked.

### Repository and dependency decision

Root: `D:/working/yuta/yuta-resto`; nearest local OpenSpec root, không external store. HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`. Fresh pre-planning baseline: `2026-09-08T06:40:57.909Z`, 2531 existing tracked/non-ignored untracked files. `git status --short` cho thấy dirty worktree; không nhận unrelated work là delivery của change này.

Đã inspect actual workspace manifest graph, kể cả dependencies/devDependencies/peerDependencies/optionalDependencies, và current imports:

- `packages/db-cloud/package.json` đã có `@yuta/auth: workspace:*`, cùng `@yuta/booking`, `@yuta/contracts`, `@yuta/tenant`.
- `packages/auth/package.json` chỉ có workspace edge tới `@yuta/contracts`; contracts không có edge tới db-cloud. Graph traversal từ auth không có path trở lại db-cloud, không dependency cycle trên proposed composition.
- `packages/db-cloud/src/auth-repository.ts` đã import auth; `packages/auth/AGENTS.md` cấm reverse persistence import; `scripts/check-import-boundaries.mjs` cloud-package rule không cấm auth. Architecture check được ghi trong planning validation bên dưới, không suy ra authority chỉ từ manifest.
- Giữ D1: compose existing `AuthService`, mỗi facade method tự gọi exact capability guard **trước resource DB lookup/mutation**. Không thêm package edge, new injected policy abstraction, role/context request input hoặc generic `requireSystemRole` fallback. Trusted auth adapter/internal-user lookup có thể thực hiện identity resolution của chính auth; đó không là template resource lookup trước guard.
- User-provided fallback cho trường hợp db-cloud chưa depend auth **không áp dụng** ở current graph. Nếu graph/architecture drift trước Apply, STOP để review, không silently chuyển composition hoặc sửa approved Design.

### Implementation order and current path baseline

Dependency order: Phase 1 preflight/schema/constraints/migration review → Phase 2 source/applicability/authorized persistence → Phase 3 real DB migration/concurrency/regression/VERIFY/non-browser QA. Các pure checks chạy sớm theo task; end-to-end durable claims phải chờ Phase 3. Không mark phase contract PASS khi còn required integration evidence chưa chạy.

Shared D8 targets đã dirty trước planning; đây là baseline cần preserve, không permission overwrite:

| Path                                           | Pre-Apply planning baseline SHA-256                                | Current status                    |
| ---------------------------------------------- | ------------------------------------------------------------------ | --------------------------------- |
| `packages/db-cloud/src/index.ts`               | `78dfaea8430d150923eaad931a9e034c5fa9eb8e27664f3b2a356fdc1c0057e1` | Pre-existing tracked modification |
| `packages/db-cloud/src/schema/index.ts`        | `934314b0cc16f81e050447869259554ff50366eefb5fe3c5d86be03113966264` | Pre-existing tracked modification |
| `packages/db-cloud/drizzle/meta/_journal.json` | `855d5ace75fac337d0fe701f130565b5673c31b84c5a47a25b6f19315e77f665` | Pre-existing tracked modification |

New D8 source/test paths listed in the Contracts are currently absent. Current journal tip is `0019_pointage_authority_foundation`; next index **chưa reserve**. Task 1.1 must re-inventory and resolve index immediately before generation, including any newer SQL/snapshot/concurrent work. Never infer clean scope from Git HEAD alone when approved current state contains uncommitted Pointage migration/source.

Before Apply, compare all prior gate hashes and exact artifact path-sets; capture all db-cloud schema/index/journal/SQL/snapshot raw hashes, full status and intended new paths. Initial inherited mechanism-source hashes are pre-Apply baselines: later explicitly authorized D8 mutations must be attributable to reviewed tasks/exact implementation diff, not hidden by rewriting historical gate hashes. Auth, tenant sources, Proposal/Analysis/Specs/Design, canonical Knowledge and main specs remain protected unchanged. Unknown or unexplained drift stops work.

### TECHNICAL IMPLEMENTATION CONTRACT — Foundation / Data

Boundary: dedicated GLOBAL cloud persistence; Formalités semantic owner, `@yuta/db-cloud` persistence owner. No tenant ownership or runtime/app enablement.

Authorities consulted: root [AGENTS](../../../AGENTS.md), nearest [db-cloud AGENTS](../../../packages/db-cloud/AGENTS.md), [ADR-003](../../../docs/decisions/ADR-003-database-ownership-boundaries.md), [DATABASE_BOUNDARIES](../../../docs/architecture/DATABASE_BOUNDARIES.md), [TENANCY](../../../docs/architecture/TENANCY.md), [Personnel Home](../../../docs/features/personnel/README.md), [LOCAL_DEVELOPMENT integration guard](../../../docs/operations/LOCAL_DEVELOPMENT.md), approved Design D2–D5/D8–D10 and R1/R3–R9/R11–R14. No nearer docs/OpenSpec instructions were found.

Intended paths: `packages/db-cloud/src/schema/formalites-legal-templates.ts`, minimal additive `packages/db-cloud/src/schema/index.ts`; only next `packages/db-cloud/drizzle/<next>_formalites_legal_template_foundation.sql`, corresponding new snapshot and additive journal entry. Schema/constraint assertions use planned `packages/db-cloud/test/formalites-legal-template-repository.test.ts`; actual DB evidence uses planned integration file in Phase 3. No new package/manifest/lockfile dependency change.

| ID  | Contract constraint                                                                                                                                    | Completion evidence / owning tasks                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| F1  | Exactly three D2 global tables; no org/establishment/TenantContext owner or nullable tenant-global fallback                                            | Schema and generated SQL inventory, zero tenant-owner columns/imports; 1.2,1.4,3.1      |
| F2  | UUIDv7 stable identity/version IDs; draft not Version; identity permits 0..N versions; no purpose-repurpose method, ordinal or actor-audit persistence | Schema assertions + service absence checks + durable reads; 1.2,2.3,2.7,3.4             |
| F3  | Scoped bytea mapping preserves exact Buffer/UTF-8 bytes; no text substitute/extra dependency                                                           | Typecheck/codec assertions then actual current-driver roundtrip including NUL; 1.2,3.4  |
| F4  | Durable partial unique active-draft index; positive revision; parent containment FKs; unique exact sourceDraftId/sourceDraftRevision freeze locator    | Metadata/SQL assertions and direct database constraint denial; 1.3,3.1,3.3              |
| F5  | Complete version NOT NULL binding, identified sha256/64 lowercase hex shape; restrictive FKs, no checksum dedup uniqueness                             | Schema/SQL inspection, same-checksum distinct-version test; 1.3,3.4                     |
| F6  | Additive migration only; old migrations/snapshots unchanged, next index collision/concurrent drift detection; no unrelated generated Drizzle changes   | Exact pre/post hashes, reviewed SQL/journal/snapshot diff; 1.1,1.4,3.1                  |
| F7  | No seed actual legal content, private evidence, reviewer, publication/retirement records or other tables                                               | No seed/script/API/app additions; changed-path and schema inventory; 1.2,1.4,3.5        |
| F8  | Disposable-only migration validation; old data preserved; code rollback retains additive tables/data, no destructive down/reset                        | Clean/incremental logs, before/after row snapshots, compatibility evidence; 3.1,3.5–3.6 |

- [x] 1.1 Revalidate approved planning/gate/protected hashes và capture fresh exact source/path/status baseline; resolve current schema/index/journal/migration tip and new-path absence before generation. Isolate pre-existing shared edits; verify cleanly attributable additive patch scope, otherwise STOP without modifying unrelated files. Completion evidence: recorded baseline, exact intended migration index and explicit isolation assessment in change-local task/final evidence, not a claim that dirty paths were initially clean.
- [x] 1.2 Implement exactly three D2 global table definitions, stable UUIDv7 identities, draft/version separation và scoped bytea mapping; add only schema export. Verify db-cloud typecheck and schema/codec assertions in planned test path; actual persisted byte equivalence remains mandatory under 3.4 before F3 PASS. No table/schema/seed outside D2.
- [x] 1.3 Implement D2 constraints/indexes: one active draft per template, positive revision, contained draft/version FKs, unique exact freeze locator, complete version binding/checksum shape and restrictive deletes; verify schema/SQL assertions including absence of checksum uniqueness, ordinal, actor/evidence/lifecycle columns; committed database constraint/race verification under 3.1/3.3 remains required.
- [x] 1.4 Generate only the next additive cloud migration with existing repository command after 1.1; review exact SQL/snapshot/journal diff and raw prior-file hashes. Verify only the three approved global tables and their own constraints/indexes are introduced, no unrelated schema reconciliation/backfill/seed or old migration rewrite. STOP if concurrent work or generated unrelated changes cannot be isolated; do not apply SQL to an unverified database.

## 2. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT — Service / Domain

Boundary: server-only global template source/declared applicability and authorized repository; Formalités domain owner inside db-cloud, existing auth retains identity/operation authority. No transport or tenant policy ownership transfer.

Authorities consulted: root/db-cloud [AGENTS](../../../packages/db-cloud/AGENTS.md), nearest [auth AGENTS](../../../packages/auth/AGENTS.md) for unchanged reuse, [IDENTITY_AND_MEMBERSHIP](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md), [TENANCY](../../../docs/architecture/TENANCY.md), [system authorization main spec](../../specs/authorization/platform-admin-formalites-template-administration/spec.md), [legal-review governance main spec](../../specs/formalites/template-legal-review-governance/spec.md), current `packages/auth/src/session.ts`, `formalites-template-system-authorization.ts`, auth compatibility tests, approved Design D1–D8 and exact delta. Strict named exports/Zod boundaries follow root/package instructions; no `any`, framework/environment/transport leakage into auth.

Intended paths: `packages/db-cloud/src/formalites-legal-template-domain.ts`, `packages/db-cloud/src/formalites-legal-template-repository.ts`, minimal named facade/value export additions in `packages/db-cloud/src/index.ts`, `packages/db-cloud/test/formalites-legal-template-domain.test.ts`, `packages/db-cloud/test/formalites-legal-template-repository.test.ts`; DB tests in the sole new integration file. Existing auth/tenant source/tests are unchanged compatibility inputs, not delivery targets. No extra source path or package boundary without review.

| ID  | Contract constraint                                                                                                                                              | Completion evidence / owning tasks                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| S1  | Guard first, template resource DB second; fixed exact method-operation mapping, fresh guard on replay                                                            | Ordered guard/query spy tests + actual AuthService compatibility and real DB denials; 2.3,2.6,3.2                                |
| S2  | Five existing operations unchanged; no role/context/policy request input, generic role guard, implication, wildcard, prefix/hierarchy or tenant fallback         | Existing auth tuple/grant tests, strict input tests, protected source hashes; 2.3,3.2,3.5                                        |
| S3  | Stable purpose identity, mutable draft only; no version/purpose metadata bypass                                                                                  | Create/read/draft tests and absence of purpose/version patch; 2.3–2.4,2.7,3.4                                                    |
| S4  | D3 READ COMMITTED transaction, identity→draft lock order, expected revision compare, exact affected-row requirement, no stale merge/overflow                     | Unit branch assertions then independent-connection stale/edit/freeze races; 2.4,3.3                                              |
| S5  | Freeze loads one exact revision, same source/applicability snapshot; server hash, complete insert/read-back verify/atomic draft close; success only after commit | Durable tuple equality and injected failure before close rolls back all effects; 2.5,3.3–3.4                                     |
| S6  | Same locator returns same Version; fresh authorization, no checksum dedup, no uncertain-commit success or latest-revision retry                                  | Concurrent freeze, response loss, old-draft replay after new active draft, different-draft same-hash tests; 2.6,3.3–3.4          |
| S7  | Profile `formalites.legal-source.utf8-lf.v1`: fatal UTF-8 decode, BOM reject, CRLF/lone CR→LF only before freeze                                                 | Malformed/truncated/overlong/BOM cases; canonical draft and frozen raw-byte reads; 2.1,3.4                                       |
| S8  | No Unicode normalization, whitespace trim, final-newline injection or post-freeze formatter/recanonicalization                                                   | Composed/decomposed Unicode, spaces/tabs/blank lines/NUL/embedded U+FEFF tests, unknown-profile negative; 2.1,2.7,3.4            |
| S9  | Server `sha256` over exact canonical bytes; full-version/replay verification; no caller checksum authority, rendering/JSON/content-equivalence substitution      | Independent digest from reread bytes; wrong bytes/digest/profile/algorithm rejects consistent read/freeze claim; 2.1,2.5–2.7,3.4 |
| S10 | All nine D6 dimensions; unknown/assertions/reference distinction; empty canonical-reference allowlist; no authoritative enums/automatic matching                 | Strict Zod tests, missing→explicit unknown, unsupported-owner rejection, structured snapshot roundtrip, no evaluator; 2.2,3.4    |
| S11 | Frozen binding insert/read-only through normal paths; copied values; no update/upsert/delete/reopen; same content + changed envelope creates distinct Version    | Normal-path mutation denial/absence and reread unchanged tuple; no hash uniqueness; 2.6–2.7,3.4                                  |
| S12 | No ordinal, actor-audit persistence, reviewer/evidence/qualification/publication/retirement fields or methods                                                    | Exact schema/export/input inventory and no excluded writes; conditional scenario absence evidence; 2.2–2.3,2.7,3.4–3.5           |
| S13 | No app/session/transport/provider wiring, sixth operation, principal, tenant merge or dependency cycle                                                           | Actual graph/import check, unchanged manifest/lockfile/auth/tenant/app hashes and scoped source diff; 2.3,3.2,3.5                |

Exact execution mapping:

| Domain action                              | Required operation                                                                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Identity/draft/exact-version/history read  | `formalites.template.read`                                                                                                         |
| Identity create, working-draft create/edit | `formalites.template.draft.manage`                                                                                                 |
| Exact revision freeze / replay             | `formalites.template.review.submit`                                                                                                |
| Publication / retirement domain execution  | No method; `formalites.template.publish` / `formalites.template.retire` grants remain unchanged and do not create domain execution |

- [x] 2.1 Implement D5 byte canonicalizer/validator/profile identifier and server SHA-256 helper in pure internal domain module; verify focused tests for strict UTF-8, BOM rejection, CRLF/lone CR→LF, embedded U+FEFF/NUL, Unicode distinction, spaces/tabs/blank lines/final newline preservation, defensive copy and unknown-profile rejection. Freeze validation must not transform persisted revision bytes; no caller checksum authority or render/formatter input.
- [x] 2.2 Implement strict D6 applicability validation for all nine dimensions, explicit unknown/assertions/owner-qualified-reference representation with empty initial reference allowlist; verify assertion strings/array order preserved, missing dimension becomes unknown not unrestricted, unsupported references/evidence/extra fields denied, no invented legal enums or executable conditions/selection. No owner resolver or private evidence processing capability.
- [x] 2.3 Implement authorized server facade composition with existing AuthService and CloudDatabaseClient, stable identity create/read and contained draft/version/history reads; fixed exact guard first per public method and no unguarded exported alternate. Verify ordered guard-before-resource-query tests, exact operation mapping, admin/support/restaurant-only/unauthenticated/missing/disabled-user cases with existing real AuthService and controlled test adapters, no purpose update or publish/retire methods; no app composition or package edge added.
- [x] 2.4 Implement working-draft create/edit under D3 parent→draft locking, active-draft rule, expected revision and affected-row compare; successful edit updates content/applicability together and increments once. Verify allowed edit, conflict, stale/frozen/not-found/overflow paths and no transient caller mutation; real competing connections/races in 3.3 are mandatory, not replaced by unit mocks.
- [x] 2.5 Implement D4 first freeze of exact draft revision: single transaction snapshot, server hash, complete immutable version insert/read-back verification and guarded draft close; report success only after commit. Verify no replacement freeze payload, no mixed revision, wrong state fails closed, no publication/review/qualification effect; 3.3 must inject failure after insert before close and prove no partial committed version/close.
- [x] 2.6 Implement same-locator durable replay and concurrent/response-loss recovery exactly as D4; verify same stable Version returned with fresh authorization, old frozen draft replay remains independent of new active draft, different draft/revision never dedup by checksum. Unknown commit result must not claim success/rollback or silently retry latest; inconsistent replay binding fails closed. Real concurrent/result-loss evidence is required in 3.3.
- [x] 2.7 Enforce D7 normal-path immutable identity/version behavior and D5 full-version integrity reads, copied return values, no ordinal or actor-audit persistence. Verify no generic version/purpose patch/upsert/delete/reopen path, full binding unchanged after attempted normal mutations, digest/profile/byte corruption denied on full read/replay, history order never means applicable/latest, and no reviewer/evidence/lifecycle state; durable evidence under 3.4.

## 3. Integration / Regression

### TECHNICAL IMPLEMENTATION CONTRACT — Integration / Regression

Boundary: disposable cloud database verification plus existing portable auth/tenant and tenant Formalités/Personnel regressions. Owner: Formalités foundation for new behavior; existing owners retain authority over their compatibility targets. No browser/runtime app implementation.

Authorities consulted: root/db-cloud/auth instructions; nearest [tenant AGENTS](../../../packages/tenant/AGENTS.md); [QA protocol](../../../docs/YUTA_QA_PROTOCOL.md); [LOCAL_DEVELOPMENT integration guard](../../../docs/operations/LOCAL_DEVELOPMENT.md); [DATABASE_BOUNDARIES](../../../docs/architecture/DATABASE_BOUNDARIES.md); existing tenant [Formalités authorization](../../specs/authorization/formalites/spec.md) and [persistent draft](../../specs/formalites/persistent-draft-foundation/spec.md); Design D9–D10/Migration Plan; package manifests and existing guarded integration files. Environment use must follow current operations authority, not historical setup claims.

Intended new test path: `packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts`; reuse planned unit test files. Existing tests are run unchanged. Completion evidence stays in tasks.md and, when workflow legitimately reaches final review, `docs/reviews/formalites-legal-template-foundation/03-final-review.md` with separate Technical Compliance Matrix / TECHNICAL VERIFY / QA. No standalone evaluator/report/script, UI page pack or screenshot artifact is needed for this non-browser plan.

| ID  | Contract constraint                                                                                                                                 | Completion evidence / owning tasks                                                                                                                   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| I1  | Verified disposable PostgreSQL target before any destructive/setup/migration/test action; matching cloud URL and explicit guard, no secrets in logs | Dated sanitized host/port/database/role/ownership/isolation evidence; safe setup authorization; 3.1                                                  |
| I2  | Clean chain and incremental immediately-preceding-schema migration; no unrelated SQL, old data/hash preservation                                    | Exact journal/SQL/snapshot hashes, before/after current_database/schema and synthetic existing-row snapshots, exit codes; 1.4,3.1                    |
| I3  | Real independent database connections and controlled race ordering; not mocked concurrency or merely two promises on one connection                 | Distinct PostgreSQL backend/connection evidence, barriers/winner ordering and committed invariant assertions; 3.3                                    |
| I4  | Actual bytea roundtrip, exact SHA-256, immutable binding, corruption failures and changed applicability distinct version                            | Raw byte/digest comparisons from independent rereads and full version tuple evidence; 3.4                                                            |
| I5  | Global authority does not supply tenant access; exact operations/roles unchanged, existing Formalités/Personnel behavior/data unaffected            | Auth/tenant compatibility, wrong-org/establishment tests, tenant regression suites and pre/post data evidence; 3.2,3.4                               |
| I6  | Truthful repository checks, zero skipped required DB evidence presented as PASS, scoped source attribution including untracked paths                | Exact commands/exits/counts/skips; inherited baseline failure attribution; protected/source diff hashes; 3.5                                         |
| I7  | Required non-browser QA on real DB; no QA NOT_APPLICABLE, no mock-based QA PASS; environment blocker blocks Gate 3                                  | Separate runtime journey/QA rows below with actual outcomes and environment evidence; 3.6                                                            |
| I8  | Complete 14/42 and F1–F8/S1–S13/I1–I8 traceability; separate VERIFY, QA, human Gate 3; no Knowledge/lifecycle/production promotion                  | Final matrix/test references, artifact and implementation hashes, exact task completion count and ready Gate 3 only when all conditions met; 3.5–3.6 |

- [x] 3.1 Obtain separately authorized verified disposable PostgreSQL setup; record sanitized target/ownership/role, inspect effective DB target without printing credentials, then apply reviewed SQL using existing cloud migration command. Execute both clean-chain and incremental migration from immediately preceding schema; verify exact constraints/journal and preservation of pre-existing synthetic tenant rows. Do not use customer/shared/production DB or broad reset helper. If safe disposable setup is unavailable, record environment blocker; no migration/QA PASS.
- [x] 3.2 Run existing auth/tenant tests and targeted facade authorization compatibility; verify exact five operations and per-method guards, YUTA_SUPPORT/restaurant-only denial, no TenantContext/import/context fallback or auth→db dependency cycle. Run unchanged tenant Formalités/Personnel regression suites on verified disposable DB; prove wrong org/establishment remain denied and global grant cannot authorize tenant resource access.
- [x] 3.3 Add/run real PostgreSQL independent-connection tests for concurrent draft creation, stale edit, edit-wins and freeze-wins races, same-revision concurrent freeze, response-loss replay, retry after new active draft, and injected failure after insert before close. Verify distinct connection evidence, controlled ordering, at most one active draft/version per exact locator, no stale overwrite/mixed snapshot and rollback of partial writes. Test-only synchronization/failure injection stays inside approved test machinery, not exported production hooks or generic coordinator service.
- [x] 3.4 Execute actual driver roundtrip and durable source/applicability/history rereads via authorized facade, independent digest recomputation, same-checksum/different-applicability distinct versions, full binding immutability through normal paths and corruption detection. Verify canonical byte edge cases, unknown/reference/assertion distinction, no ordinal/actor/evidence/publication/qualification/retirement side effects, and unchanged existing tenant state. Deliberate corruption SQL is test-only on exact disposable rows; do not add a production repair API.
- [x] 3.5 Run the required command matrix below, exact 14/42 mapping and Technical Compliance Matrix F1–F8/S1–S13/I1–I8 with test/path/outcome references; verify implementation matches unchanged approved artifacts and narrowly authorized source diff, including new/untracked migration/tests. Record every command, exit code, test/skip count, protected hash and unrelated baseline failure. Record `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` / `VERIFY: PASS` only when all applicable implementation/contract evidence passes; otherwise record failure/blocker without weakening tests/specs.
- [x] 3.6 Perform required non-browser QA acceptance journey below on the verified disposable DB, separately report QA result and evidence from technical VERIFY; do not mark NOT_APPLICABLE. Only when required evidence and I1–I8 pass, finalize 17/17 task evidence and create Gate 3 review with exact planning/source/diff/evidence hashes, separate TECHNICAL VERIFY and QA sections, and `Sync authorization: PENDING`; STOP for human Gate 3. If QA is FAIL/BLOCKED_BY_ENVIRONMENT, retain truthful non-ready evidence and block Gate 3; no ready approval packet or implicit Sync/Archive/Knowledge/deployment.

### Required future command matrix

Commands below are a **plan**, not execution evidence from this planning turn. Run from repository root unless package command scopes otherwise. All DB-backed suites require verified disposable cloud setup; capture actual test counts/skips and effective sanitized target. Environment guard presence alone does not prove disposable ownership. Clear integration guard after test work; never print full connection URL or alter tracked env files. Do not use `db:push`, repository reset/seed commands, production operations or container deletion as a workaround.

| ID  | Command / scope                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Required evidence                                                                                                                                                 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-domain.test.ts test/formalites-legal-template-repository.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Pure/guard/schema/normal-path tests; not actual DB concurrency QA                                                                                                 |
| C2  | `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-repository.integration.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | New suite actually executes on verified disposable DB, not skipped; all race/roundtrip/rollback cases                                                             |
| C3  | `pnpm --filter @yuta/db-cloud test:integration`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Existing `test/schema.integration.test.ts`; does NOT cover C2 implicitly                                                                                          |
| C4  | `pnpm --filter @yuta/auth test` and `pnpm --filter @yuta/tenant test`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Existing compatibility suites and unchanged grants/tenant guards                                                                                                  |
| C5  | `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-personnel-draft-domain.test.ts test/formalites-personnel-draft-schema.integration.test.ts test/formalites-personnel-draft-repository.integration.test.ts test/personnel-repository.integration.test.ts test/personnel-document-repository.integration.test.ts test/personnel-register-repository.integration.test.ts test/personnel-contract-amendment-repository.integration.test.ts test/personnel-action-overview-repository.integration.test.ts test/personnel-history-domain.test.ts test/personnel-history-cutover.test.ts test/personnel-history-cutover.integration.test.ts` | Existing Formalités/Personnel/history/Documents/Register regression behavior; no edits to those tests to force PASS                                               |
| C6  | `pnpm db:cloud:generate` then, only after SQL/target review, `pnpm db:cloud:migrate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Generation isolated to approved diff; migration separately on clean and incremental disposable targets; both exact exits and state evidence                       |
| C7  | `pnpm --filter @yuta/db-cloud typecheck`, `pnpm --filter @yuta/auth typecheck`, `pnpm --filter @yuta/tenant typecheck`, `pnpm -r --if-present typecheck`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Shared package/API export compatibility; if Next generated types absent, existing `pnpm typegen:next` bootstrap first, no tracked generated source changes        |
| C8  | `pnpm docs:check`, `pnpm architecture:check`, `pnpm exec openspec validate formalites-legal-template-foundation --strict --json`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Docs/ownership/import/migration baseline and strict artifact validity                                                                                             |
| C9  | `pnpm test:cloud` and `pnpm build:cloud`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Broader shared cloud export/regression/build compatibility; build is not deploy. Record actual environment or unrelated baseline failures, never claim unrun PASS |
| C10 | Scoped `pnpm exec prettier --check` on exact implementation/delivery files; scoped `git diff --check`; `pnpm format:check`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Include untracked files via explicit inventory/raw hashes; global failures compared to fresh baseline, no repository-wide formatter write                         |

`pnpm test:local`: not required for this cloud-only change with untouched local packages; state NOT RUN and rationale. db-cloud has no build/lint script; do not invent one. If broader check fails on unrelated baseline, attribute exact paths/output and leave reviewable evidence; introduced failure must be fixed within scope or returned to Control Tower. No green aggregate claim hiding failed/skipped commands.

### Required non-browser QA acceptance evidence

Current QA execution: **NOT RUN — planning only**. The following acceptance cases are mandatory for future QA PASS, using the new integration harness/authorized facade and actual independent DB connections. Same real execution may support technical VERIFY and QA, but the final packet must distinguish assertions about implementation conformance from the persisted runtime journey; no duplicated mock results relabelled as real QA.

| QA ID | Required acceptance evidence                                                                                                                                                                                       |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Q1    | Verified disposable PostgreSQL target, clean chain and incremental upgrade both succeed; existing tenant records preserved; sanitized effective DB identity recorded                                               |
| Q2    | Active internal admin without restaurant membership creates identity, saves/edits/reopens draft, freezes and independently reopens stable exact Version; draft no longer mutable; new draft does not alter history |
| Q3    | Independent connections compete to create draft: at most one active draft; stale edit cannot overwrite current revision                                                                                            |
| Q4    | Deterministically observe both edit-wins→stale freeze and freeze-wins→edit denial; canonical source/applicability never mixed across revisions                                                                     |
| Q5    | Independent concurrent freeze and response-loss retry return one same Version; old-draft replay after new active draft remains same; no duplicate by exact locator                                                 |
| Q6    | Inject failure after version insert and before draft close, then reread from independent connection: no partial durable Version and draft remains active at original revision                                      |
| Q7    | Actual bytea driver preserves exact canonical bytes including NUL/Unicode/whitespace; server and independent SHA-256 agree; invalid UTF-8/BOM/unknown profile fail closed                                          |
| Q8    | Normal-path frozen mutation attempts leave entire tuple unchanged; disposable-only corrupted bytes/digest/profile detected; no privileged-tamper-proof claim                                                       |
| Q9    | Same checksum plus changed applicability creates distinct immutable Version; unknown/assertions/reference declaration never becomes automatic applicable/qualified selection                                       |
| Q10   | Support/restaurant-only/invalid identities denied before template lookup; global grant does not authorize tenant data; existing wrong-tenant denial and Formalités/Personnel behavior unaffected                   |
| Q11   | No actor-audit/ordinal/evidence/publication/qualification/retirement write or provider/app side effect; tenant data before/after journey unchanged except explicitly scoped existing-regression test fixtures      |

Missing verified disposable DB: `QA: BLOCKED_BY_ENVIRONMENT`; failed acceptance: `QA: FAIL`. Only actual complete acceptance: `QA: PASS`. `QA: NOT_APPLICABLE` is forbidden for this change by current-user decision. No DB provision, test run or production permission is inferred from this planning artifact.

## Exact requirement / scenario traceability

R/S IDs below follow document order of the unchanged approved delta. Each row is a **planned** mapping, not a claim of tests passed. Exact titles must remain mapped through Apply; final matrix adds actual source/test location, execution and result. Conditional scenarios S35/S37 are preserved with explicit absence evidence, not dropped or used to introduce ordinal/actor persistence.

| Requirement ID / exact title                                                     | Design       | Tasks               | Contract rows    |
| -------------------------------------------------------------------------------- | ------------ | ------------------- | ---------------- |
| R1 — Global template foundation giữ dedicated ownership boundary                 | D1–D2        | 1.2,2.3,3.2         | F1,S1–S2,I5      |
| R2 — Foundation sử dụng exact existing system operations và fail closed          | D1           | 2.3,2.6,3.2         | S1–S2,S13,I5     |
| R3 — Stable Template Identity không bị repurpose qua version                     | D2,D7        | 1.2,2.3,2.7,3.4     | F2,S3,S11        |
| R4 — Một active mutable Working Draft không phải canonical version               | D2–D3        | 1.3,2.4,3.3–3.4     | F4,S3–S4,I3      |
| R5 — Freeze tạo exact durable immutable version binding                          | D3–D4        | 2.5,3.3–3.4         | S5,I3–I4         |
| R6 — Frozen content profile và applicability không thể sửa tại chỗ               | D5,D7        | 2.1,2.7,3.4         | S8–S9,S11,I4     |
| R7 — Canonical Legal Source Profile V1 giữ exact textual byte rules              | D5           | 1.2,2.1,3.4         | F3,S7–S8,I4      |
| R8 — SHA-256 được tính trên exact canonical bytes                                | D4–D5        | 2.1,2.5–2.7,3.4     | S9,I4            |
| R9 — Applicability change tạo Version khác dù content checksum giống nhau        | D4,D6        | 2.2,2.6,3.4         | F5,S6,S10–S11    |
| R10 — Applicability assertions không tạo canonical truth hoặc automatic matching | D6           | 2.2,3.4             | S10,I4           |
| R11 — Repeated freeze cùng draft revision không tạo duplicate Versions           | D3–D4        | 1.3,2.6,3.3         | F4,S6,I3         |
| R12 — Version ordinal không phải applicability selector                          | D2           | 1.2,2.7,3.4         | F2,S12           |
| R13 — Bounded internal traceability không lưu private legal evidence             | D6–D7        | 2.2,2.7,3.4–3.5     | F7,S12,I8        |
| R14 — Freeze và foundation completion không triển khai excluded capabilities     | D1,D4,D7–D10 | 2.3,2.5,2.7,3.5–3.6 | F7,S12–S13,I6–I8 |

| Scenario ID / exact title                                                | Requirement | Tasks       | Planned checks / QA | Expected evidence                                                                                                               |
| ------------------------------------------------------------------------ | ----------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| S1 — Global identity không cần restaurant owner                          | R1          | 2.3,3.2     | C2,C4 / Q2,Q10      | Admin không membership có global access; owner fields absent                                                                    |
| S2 — Tenant fallback không tạo global access                             | R1          | 2.3,3.2     | C1,C2,C4 / Q10      | Tenant input/missing scope/fake organization không cấp authority                                                                |
| S3 — Exact read và draft operations của trusted admin                    | R2          | 2.3,3.2     | C1,C2,C4 / Q10      | Mỗi read/manage method gọi đúng literal op trước query                                                                          |
| S4 — Freeze cần exact submission operation                               | R2          | 2.3,2.5,3.2 | C1,C2,C4 / Q10      | Freeze không nhận read/manage context; guard exact review.submit                                                                |
| S5 — Support và restaurant-only actors bị denied                         | R2          | 2.3,3.2     | C1,C2,C4 / Q10      | Support và restaurant-only roles denied, zero template lookup                                                                   |
| S6 — Untrusted hoặc unsupported authority fail closed                    | R2          | 2.3,3.2     | C1,C2,C4 / Q10      | Anonymous/missing/disabled, unknown/wildcard/prefix/policy input denied                                                         |
| S7 — System allow không cấp tenant resource access                       | R2          | 3.2,3.4     | C2,C4,C5 / Q10      | Global allow không cấp tenant access; existing denial unchanged                                                                 |
| S8 — Nhiều revisions cùng legal purpose                                  | R3          | 2.3,2.4,3.4 | C2 / Q2             | Same purpose identity cho new drafts/versions, different version IDs                                                            |
| S9 — Fundamental legal purpose thay đổi                                  | R3          | 2.3,2.7,3.4 | C1,C2 / Q2,Q8       | Purpose không có update path; fundamental purpose mới dùng new identity                                                         |
| S10 — Metadata không được dùng làm version bypass                        | R3          | 2.7,3.4     | C1,C2 / Q8          | Presentation label không mở metadata/version-binding patch                                                                      |
| S11 — Identity chưa có immutable version                                 | R4          | 1.2,2.3,3.4 | C1,C2 / Q2          | Identity zero versions; draft được đọc riêng, không canonical Version                                                           |
| S12 — Active draft thứ hai bị ngăn                                       | R4          | 1.3,2.4,3.3 | C2,C3 / Q3          | Independent competing create: maximum one active row                                                                            |
| S13 — Edit mutable working draft                                         | R4          | 2.4,3.4     | C2 / Q2,Q3          | Edit active revision persists content/envelope; no Version created                                                              |
| S14 — Continuation sau freeze giữ historical candidates                  | R4          | 2.4,2.6,3.4 | C2 / Q2,Q5          | After freeze new draft, retained historical candidates unchanged                                                                |
| S15 — Freeze exact candidate                                             | R5          | 2.5,3.4     | C2 / Q2,Q7          | Exact template/version/profile/bytes/hash/applicability binding from one revision                                               |
| S16 — Competing edit không tạo mixed snapshot                            | R5          | 2.4,2.5,3.3 | C2 / Q4,Q6          | Both winner orderings; no mixed snapshot or partial durable binding                                                             |
| S17 — Reopen durable foundation state                                    | R5          | 2.3,2.7,3.4 | C2 / Q2             | Independent client reread stable identity/draft/version                                                                         |
| S18 — Frozen content hoặc applicability bị edit                          | R6          | 2.7,3.4     | C1,C2 / Q8          | Frozen content/applicability edits absent/denied; exact tuple unchanged                                                         |
| S19 — Formatting được coi là minor change                                | R6          | 2.1,2.7,3.4 | C1,C2 / Q7,Q8       | No post-freeze trim/Unicode normalization/format cleanup                                                                        |
| S20 — Content profile tiến hóa                                           | R6          | 2.1,2.7,3.4 | C1,C2 / Q8          | Unknown profile rejected; historical V1 kept, not recanonicalized                                                               |
| S21 — Canonical source không BOM và dùng LF                              | R7          | 2.1,3.4     | C1,C2 / Q7          | CRLF/CR canonicalize before freeze; strict UTF-8/LF persisted, leading BOM rejected                                             |
| S22 — Invalid UTF-8 không được âm thầm sửa thành reviewed content        | R7          | 2.1,3.4     | C1,C2 / Q7          | Malformed/truncated/overlong UTF-8 rejected, no silent replacement                                                              |
| S23 — Unicode sequence không bị normalize                                | R7          | 2.1,3.4     | C1,C2 / Q7          | Composed/decomposed Unicode exact sequences stay distinct                                                                       |
| S24 — Meaningful whitespace được giữ                                     | R7          | 2.1,3.4     | C1,C2 / Q7          | Leading/trailing spaces, tabs, blank lines and final-newline presence preserved                                                 |
| S25 — Independent checksum recomputation                                 | R8          | 2.1,2.7,3.4 | C1,C2 / Q7          | Independent SHA-256 from actual reread bytea bytes matches                                                                      |
| S26 — Checksum không khớp bytes                                          | R8          | 2.5,2.7,3.4 | C1,C2 / Q8          | Caller checksum input not authority; corrupt digest/bytes fail closed                                                           |
| S27 — Checksum không phải legal evidence                                 | R8          | 2.7,3.4     | C1,C2 / Q11         | Matching digest yields content identity only, no legal-proof fields/effect                                                      |
| S28 — Envelope đổi nhưng content giữ nguyên                              | R9          | 2.2,2.6,3.4 | C2 / Q9             | Same bytes/hash with changed applicability produces distinct Version                                                            |
| S29 — Same checksum không cho qualification inheritance                  | R9          | 2.6,3.4     | C1,C2 / Q9          | Checksum equality cannot merge candidates or inherit qualification                                                              |
| S30 — Approved owner reference và assertion được phân biệt               | R10         | 2.2,3.4     | C1,C2 / Q9          | Reference representation distinct; no currently approved binding, empty allowlist denies claims; assertions not canonical truth |
| S31 — Unsupported hoặc unknown applicability                             | R10         | 2.2,3.4     | C1,C2 / Q9          | Missing/unknown/unmapped never defaults to unrestricted/matched                                                                 |
| S32 — Asserted conditions không được thực thi như engine                 | R10         | 2.2,3.4     | C1,C2 / Q9          | Conditions/dates/exclusions preserved as declarations, no evaluator                                                             |
| S33 — Retry freeze sau response loss                                     | R11         | 2.6,3.3     | C2 / Q5             | Lost response then exact retry returns same stable Version, count=1                                                             |
| S34 — Concurrent freeze của cùng revision                                | R11         | 1.3,2.6,3.3 | C2 / Q5             | Independent concurrent exact-revision freeze commits at most one Version                                                        |
| S35 — Optional ordinal unique trong template                             | R12         | 1.2,2.7,3.4 | C1,C2 / Q11         | Conditional premise absent: no ordinal field/parameter/export; stable IDs remain                                                |
| S36 — Highest Version chưa phải applicable Version                       | R12         | 2.7,3.4     | C1,C2 / Q9          | History ordering never implies applicable/reviewed/qualified selection                                                          |
| S37 — Minimal internal mutation attribution                              | R13         | 1.2,2.7,3.4 | C1,C2 / Q11         | Conditional premise absent: no actor persistence; verify no actor/email/name/contact columns                                    |
| S38 — Private evidence không được nhét vào foundation                    | R13         | 2.2,2.7,3.4 | C1,C2 / Q11         | Strict extra/evidence-field denial; no evidence CRUD/storage or reviewer principal                                              |
| S39 — Security allow không là completed mutation hoặc retention approval | R13         | 2.5,3.3,3.4 | C2 / Q6,Q11         | Auth allow + failed transaction is not freeze completion or privacy/retention approval                                          |
| S40 — Freeze không gửi review và không qualify                           | R14         | 2.5,3.4     | C2 / Q2,Q11         | Freeze only immutable candidate, no review receipt/evidence/qualification                                                       |
| S41 — Publish hoặc retire authority không tạo domain execution           | R14         | 2.3,2.7,3.4 | C1,C2,C4 / Q11      | Publish/retire grants unchanged; domain methods absent, no fallback execution                                                   |
| S42 — Specs hoặc foundation được hoàn tất                                | R14         | 3.5,3.6     | C7–C10 / Q10,Q11    | Exact source path/hash scope; no app/provider/content/Knowledge/lifecycle/production promotion                                  |

## Planning integrity and review handoff

Approved Design hash: `d6db50dc5db2a64e29e8b8a5148011bda1b4bb46127101fdf188e3b7a3526cf5`. Exact delta hash: `b68b3581d46d7a12d029303a1e83f24b3943f19e707edde8b2f6ef577bfc9418`. Gate 2b pre-approval packet hash: `f7d503776ab0afe0e1be937151428cb89717d09c92e82b593611204c71748216`; approved metadata-only packet hash: `917a344589e25531208cb56c60439a8f1cab73700c506cc8ef6693b605cea93e`. Gate 1 and Gate 2 hashes remain respectively `bf141feb65b3a6a0253148088c15bee639d16b83c5367e0700b135fa21a869d1` and `791f79b393b4bbd746a40952baf0f06d706339d61eb72f26ef11e200ddab2ff2`.

Resume validated Gate 1 26/26, Gate 2 29/29, Gate 2b 44/44 path/hash rows and exact selected artifact set before planning. No Design/Specs/Proposal/Analysis byte edits permitted. Approval metadata is the only Gate 2b packet change; historical evidence remains intact. Current validation results and final tasks hash are recorded at handoff, without storing a circular hash of tasks.md inside itself.

Future final Technical Compliance Matrix has 29 items (F1–F8, S1–S13, I1–I8), and exact 14/42 conformance rows above. Final evidence records completed tasks.md SHA-256 and final `03-final-review.md` SHA-256 outside self-referential blocks; the workflow's canonical verify-evidence block is embedded in that existing final packet, not a new standalone artifact.

No canonical Product Knowledge/CURRENT_STATE/MODULE_REGISTRY/architecture/lifecycle edits during Apply/Verify. No main-spec edits or new main-spec links before authorized Sync/validation. Reconciliation stays Gate 3 → finish-change → Sync → Validate Main Specs → Archive → reviewed Knowledge Consolidation; no automatic promotion.

Planning must STOP here for Control Tower review. Apply requires explicit approval of the exact current tasks.md hash plus separate Apply authorization. No schema/code/migration/runtime/QA execution, Sync, Archive, Knowledge Consolidation or production action occurs in this planning turn.

### Actual planning validation — not implementation evidence

Executed from `D:/working/yuta/yuta-resto` on 2026-09-08. Các results dưới đây chỉ kiểm chứng planning artifact/current repository compatibility, không complete bất kỳ implementation checkbox nào.

| Actual command/check                                                                                                                                               | Exit / result                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm exec openspec status --change formalites-legal-template-foundation --json`                                                                                   | 0; effective `yuta-spec-driven`; before Tasks absent/ready, after planning 5/5 artifacts complete                                                                                   |
| `pnpm exec openspec instructions tasks --change formalites-legal-template-foundation --json`                                                                       | 0; exact local tasks output, Specs/Design dependencies reread; no Apply instructions invoked                                                                                        |
| `pnpm exec openspec validate formalites-legal-template-foundation --strict --json`                                                                                 | 0; 1/1 change valid, 0 issues                                                                                                                                                       |
| `pnpm docs:check`                                                                                                                                                  | 0; 36 current documents passed                                                                                                                                                      |
| `pnpm architecture:check`                                                                                                                                          | 0; runtime imports, database URLs, client boundaries and migration baselines valid                                                                                                  |
| `pnpm -r --if-present typecheck`                                                                                                                                   | 0; all invoked typechecks completed, scope 15 of 16 workspace projects                                                                                                              |
| `pnpm exec prettier --write openspec/changes/formalites-legal-template-foundation/tasks.md`                                                                        | 0; only newly created Tasks formatted, no approved semantic artifact formatted                                                                                                      |
| `pnpm exec prettier --check openspec/changes/formalites-legal-template-foundation/tasks.md docs/reviews/formalites-legal-template-foundation/02b-design-review.md` | 0; all matched files use Prettier code style                                                                                                                                        |
| `git diff --check -- openspec/changes/formalites-legal-template-foundation docs/reviews/formalites-legal-template-foundation`                                      | 0; untracked Tasks additionally checked by scoped formatter and full path/hash comparison                                                                                           |
| `pnpm format:check`                                                                                                                                                | 1; 67 failing files outside this change, all byte-identical to fresh pre-turn baseline; no global formatter write/remediation                                                       |
| Raw-byte earlier-gate verifier                                                                                                                                     | Gate 1 26/26, Gate 2 29/29, Gate 2b 44/44 matched; no protected drift                                                                                                               |
| Gate 2b approval-only reconstruction                                                                                                                               | Restoring first review status/removing only approval block reproduces exact prior packet hash `f7d503776ab0afe0e1be937151428cb89717d09c92e82b593611204c71748216`                    |
| Exact title mapping/count verifier                                                                                                                                 | 14/14 requirement titles and 42/42 scenario titles match delta; 17 unchecked tasks, 0 checked, 3 embedded Contracts; no unresolved placeholder                                      |
| Whole-tree scoped integrity                                                                                                                                        | Snapshot `2026-09-08T06:48:30.151Z`: only new tasks.md plus Gate 2b approval metadata differ from fresh 2531-file baseline; all other tracked/non-ignored untracked files unchanged |

Hash method actually used via `node -e`: `crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')`, over exact raw bytes, not formatted text. Inventory from `git ls-files --cached --others --exclude-standard -z`; deduplicate/sort and compare complete before/after maps. Gate-table verifier compares every literal recorded path/hash pair. Requirement/scenario verifier compares each numbered mapping row's title to the corresponding exact delta heading and verifies unique ID cardinality.

Implementation/unit/DB tests, clean/incremental migrations, non-browser QA, `pnpm test:cloud`, `pnpm test:local` and `pnpm build:cloud`: **NOT RUN** in planning-only turn. Disposable DB availability/ownership has not been established; no environment or QA PASS is claimed. Broad format failure is baseline-only, not a new Tasks failure. Existing Gate 2b packet lists that baseline's paths; new run independently compared all 67 reported failing paths with this turn's fresh hashes.

Sau khi thêm validation table, một intermediate scoped Prettier run trả exit 1 trên new tasks.md. Warning chỉ thuộc formatting của evidence table chưa format; xử lý bằng formatter scoped vào tasks.md và recheck trước handoff, không sửa bất kỳ approved artifact/canonical file nào.

`RAW OPENSPEC STATUS`: planning artifacts complete, 5/5; not implementation completion.
`YUTA OPERATIONAL READINESS`: **STOP — AWAITING_HUMAN_REVIEW** at Tasks / Implementation Plan review.
Gate packet: `docs/reviews/formalites-legal-template-foundation/02b-design-review.md`, APPROVED; no `03-final-review.md` created.
Apply: **NOT AUTHORIZED**. Production: **NOT AUTHORIZED**.

## Authorized Apply checkpoint — 2026-09-08

Phần planning phía trên giữ historical approval context; checkpoint này ghi current-user Apply authorization từ `C:/Users/Tam/.codex/attachments/c9a150e4-f6bd-445d-8fd8-82d60fccb200/pasted-text.txt`. Apply đã được cấp cho đúng 17 tasks, không production. Before-write Tasks SHA-256 khớp `f044288dfacf994f1ca197ca7e4c0fff1c084d52e4b31235294116a2f53d03f1`; Proposal/Analysis/Design/delta và Gate 1 26/26, Gate 2 29/29, Gate 2b 44/44 path/hash rows đều khớp. Không rewrite historical gate baselines.

### Exact preflight and isolation evidence

Fresh inventory: `2026-09-08T07:37:10.692Z`, HEAD `defbc50eba3952fa2e7b1c016637daf083b18c65`, 2543 tracked/non-ignored untracked existing files. Inventory dùng `git ls-files --cached --others --exclude-standard`, raw bytes SHA-256 qua Node `crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')`. Full path/hash map được capture trước writes; ba shared index/journal raw-byte preimages cũng được capture. Shared hashes khớp ba baseline rows phía trên, không xem dirty files là clean.

Current graph inspection: db-cloud đã depend auth/booking/contracts/tenant; auth chỉ depend contracts; traversal từ auth không quay lại db-cloud. Không manifest/lockfile change của Apply này. Sáu new source/test paths dự kiến và final packet chưa tồn tại trước writes; integration test vẫn chưa tạo ở checkpoint này.

Current journal có 20 entries, tip `0019_pointage_authority_foundation`, SQL/snapshot `0020` chưa tồn tại. Read-only installed Drizzle API comparison (`generateDrizzleJson` + `generateMigration` trong memory, không DB/file write) cho 55 current tables khớp snapshot 0019, **0 statements**. Vì vậy new schema additions isolate được khỏi Pointage. Sau generation: 58 tables; snapshot comparison cho đúng ba new global tables, 0 changed existing tables, 0 other changed snapshot sections (ngoài generated IDs/table additions). Trong 52 existing migration/schema files, chỉ schema index và journal đổi theo approved D8; toàn bộ prior SQL/snapshot và unrelated schema giữ bytes.

### Completed bounded outcomes

Tasks **7/17** complete: 1.1–1.4 và 2.1–2.3. Schema/constraint/codec assertions là in-process checks, **không** DB constraint/bytea-roundtrip evidence. F3/F4/F8 và whole Foundation Contract chưa PASS vì required real DB evidence còn thiếu.

| Tasks   | Source / evidence                                                                                                                                        | Result                                                                                                                                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1     | Fresh whole-tree raw hashes, earlier-gate verifier, dependency traversal, journal/SQL/snapshot inventory, read-only Drizzle comparison                   | PASS for preflight/isolation                                                                                                                                                                                  |
| 1.2–1.3 | `packages/db-cloud/src/schema/formalites-legal-templates.ts`; first three tests in `packages/db-cloud/test/formalites-legal-template-repository.test.ts` | Exactly three tables, complete fields, bytea codec copies, active unique index, contained FK/exact locator/checks; no ordinal/actor/tenant/lifecycle fields                                                   |
| 1.4     | `packages/db-cloud/drizzle/0020_formalites_legal_template_foundation.sql`, matching snapshot, additive journal entry                                     | Generation/review PASS; database application NOT RUN                                                                                                                                                          |
| 2.1–2.2 | `packages/db-cloud/src/formalites-legal-template-domain.ts` and domain test file                                                                         | Strict UTF-8/BOM/LF, byte/hash preservation, nine non-executable dimensions, empty canonical-reference allowlist, strict freeze locator                                                                       |
| 2.3     | `packages/db-cloud/src/formalites-legal-template-repository.ts` and repository unit test file                                                            | Real AuthService with controlled adapters; all eight facade methods use fixed exact guard first; support/restaurant-only/anonymous/missing/disabled denied before any resource DB access; no excluded methods |

Tasks 2.4–2.7 source authoring exists in the facade but remains **unchecked**: real transactions, concurrency, full persisted binding, rollback and replay have not been executed. Unit sentinel failures prove guard/query ordering and error propagation only; they do not prove actual commit uncertainty, response-loss recovery or database concurrency. No pure or mocked result is relabelled as runtime QA. Tasks 3.1–3.6 remain pending, and the 14/42 and F1–F8/S1–S13/I1–I8 tables remain planned traceability, not a final PASS matrix.

### Actual command evidence so far

| Command                                                                                                                                        | Exit / actual result                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm exec openspec status --change formalites-legal-template-foundation --json`                                                               | 0; effective schema yuta-spec-driven; planning complete only                                                                                                                                                |
| `pnpm exec openspec instructions apply --change formalites-legal-template-foundation --json`                                                   | 0; exact selected context, 17 initially unchecked tasks                                                                                                                                                     |
| `pnpm db:cloud:generate --name formalites_legal_template_foundation`                                                                           | 0; generated isolated 0020 SQL/snapshot/journal, no DB execution                                                                                                                                            |
| `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-repository.test.ts`                                               | 0; initial schema/codec checks 3/3                                                                                                                                                                          |
| `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-domain.test.ts test/formalites-legal-template-repository.test.ts` | 0; initial 29/29, then expanded 87/87 tests in 2 files, no skips                                                                                                                                            |
| `pnpm --filter @yuta/db-cloud typecheck`                                                                                                       | 0 after schema, domain and facade/unit additions                                                                                                                                                            |
| `pnpm --filter @yuta/auth test`                                                                                                                | 0; 45/45 tests, 5 files                                                                                                                                                                                     |
| `pnpm --filter @yuta/tenant test`                                                                                                              | 0; 11/11 tests, 2 files                                                                                                                                                                                     |
| `pnpm -r --if-present typecheck`                                                                                                               | 0; all invoked tasks completed, scope 15 of 16 projects                                                                                                                                                     |
| `pnpm docs:check`                                                                                                                              | 0; 36 current documents                                                                                                                                                                                     |
| `pnpm architecture:check`                                                                                                                      | 0; runtime imports, database URLs, client boundaries and migration baselines valid                                                                                                                          |
| `pnpm exec openspec validate formalites-legal-template-foundation --strict --json`                                                             | 0; valid, 0 issues                                                                                                                                                                                          |
| Scoped Prettier on new TS files                                                                                                                | Initial writes/checks performed only on attributed files; one later repository.ts formatting warning corrected by another scoped formatter pass, then check exit 0                                          |
| `pnpm format:check`                                                                                                                            | 1; first run 68 warnings = 67 inherited paths plus new repository.ts formatting warning; do not label this first result baseline-only. New warning corrected separately; final rerun evidence follows below |

`pnpm db:cloud:migrate`, C2/C3/C5 DB suites, clean/incremental migrations, real-connection race/rollback/corruption/roundtrip tests, Q1–Q11: **NOT RUN**. `pnpm test:cloud` / `pnpm build:cloud`: **NOT RUN**, retained as required pending checks after verified test environment; no broad compatibility/build PASS. Separate auth/tenant typecheck commands have not run; their typechecks did execute under recursive C7. `pnpm test:local`: NOT RUN, cloud-only scope with local packages unchanged. No new command/script or standalone evidence artifact.

### Database safety gate — STOP

Read-only `docker ps --format` found existing cloud development PostgreSQL at host port 56431, plus POS at 55932 and Display at 55433. Scoped `docker inspect yuta-cloud-db-dev` confirms project `yuta-cloud-dev`, image `postgres:17-alpine`, and persistent named volume `yuta-cloud-db-dev-data` mounted at `/var/lib/postgresql/data`. This is **not proof of disposable ownership**. No existing database, volume or container was mutated or deleted, and no seed/reset/migration was run. Active connection/database identity has not been queried; no claim of safe DB execution authorization from the environment URL or integration flag.

Requested explicit approval for a separate temporary PostgreSQL container with synthetic-only data, no existing volumes/databases. Until safe setup and actual target identity are positively verified, no DB execution or QA pass is permitted. No connection string or credential is recorded.

`TECHNICAL IMPLEMENTATION COMPLIANCE: BLOCKED — required database evidence pending`.
`VERIFY: BLOCKED — partial implementation verification only`.
`QA: BLOCKED_BY_ENVIRONMENT`.
`YUTA OPERATIONAL READINESS: STOP at database safety gate; Gate 3 NOT READY`.
`03-final-review.md`: NOT CREATED. No Sync/Archive/Knowledge Consolidation. Production: **NOT AUTHORIZED**.

### Final checkpoint validation and preserved attribution

- Final targeted tests rerun: exit 0, **87/87**, 2 files, no skips. Scoped Prettier over the nine formatter-supported source/test/index/JSON files plus Tasks: exit 0. Generated SQL is reviewed/hashed and diff-checked, not passed to an undefined SQL formatter.
- Global `pnpm format:check` rerun: exit 1, **67 inherited warnings only**. All 67 paths exist in the reviewed Gate 2b baseline, existed before this Apply and remain byte-identical to the fresh raw baseline. No remaining introduced formatter warning; no global formatter write.
- `git diff --check` on three tracked shared editable files: exit 0. Git emitted line-ending conversion notices, not whitespace errors. Root index preserves its exact pre-Apply byte prefix; removing only the added schema export restores the exact schema-index preimage. Journal preserves all 20 prior entries exactly as values and appends only index 20.
- Earlier-gate recheck after authoring: Gate 1 26/26 unchanged; Gate 2 29/29 unchanged; Gate 2b 41/44 unchanged, with exactly three intentionally changed D8 mechanism paths (two indexes and journal). All three review packet hashes themselves remain unchanged. These authorized implementation deltas do not rewrite prior approval evidence. Protected auth/tenant/canonical/main-spec/Proposal/Analysis/Specs/Design bytes remain unchanged.
- Whole-tree comparison found the four intended modified paths (Tasks plus three shared D8 paths) and seven new implementation paths below, **plus one separate concurrent review-packet edit not made by this Apply**. Therefore this checkpoint does not claim the entire workspace changed only within Formalités.

Separate un-attributed concurrent path: `docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md`. Fresh baseline SHA-256 `9ba2b59a1d0075155570b72965b1107dc992a21e5c198fe466a0807d222a036a`; observed checkpoint SHA-256 `e204c0eb412b32f134f662d5c8552eeba6c30c81939bab647278df5075551f50`. Preserve it unchanged by this workflow, do not include it in Formalités delivery, and recheck attribution/current bytes on resume. No source/schema migration drift outside the approved Formalités path-set was observed.

Sanitized configured db-cloud target inspection: `.env.local` points to `localhost:55431`, database `yuta_cloud`, role `yuta_cloud`; current process integration guard is UNSET. This differs from the running cloud container's published port 56431. Neither the configuration nor container name proves disposable safety. Active connection identity remains UNVERIFIED; no connection/migration/test was attempted. Do not silently repair env configuration or redirect tests to the existing persistent volume.

| Implementation path                                                       | Checkpoint SHA-256                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `packages/db-cloud/src/schema/formalites-legal-templates.ts`              | `27a235157b543dca2723a6ce27e796939b88f451ba8d927e2c6d2a9a441709ab` |
| `packages/db-cloud/src/schema/index.ts`                                   | `1f71e967a4bd17d07c4fb09c777a979ce4b9646dbdc1d8c79d15815001d5ee15` |
| `packages/db-cloud/src/formalites-legal-template-domain.ts`               | `985b91cd04b41559185b7462ccfd67b7e738bba0ab6efae951c4ab83c9528ccd` |
| `packages/db-cloud/src/formalites-legal-template-repository.ts`           | `4ad3349d11a38ebf5da67787bbe00a3a1500005c07278869306ecd087cd5a6e6` |
| `packages/db-cloud/src/index.ts`                                          | `7242c6e54fd7f1856e5077ea34a26e8f35c8e4ae16485e7d94f8aac7d0dd4bb0` |
| `packages/db-cloud/test/formalites-legal-template-domain.test.ts`         | `6442d51a9b53e17bcf2ce2dae98dc4057feb1ba77566b6a3638703398c39f8db` |
| `packages/db-cloud/test/formalites-legal-template-repository.test.ts`     | `5a186b21d57a2175707f4639c32bc9460987e6ba5856fb2289cfa923f51f5c15` |
| `packages/db-cloud/drizzle/0020_formalites_legal_template_foundation.sql` | `690c94cbaac1d6cec863a9f8a86ad46efe0507f9a7a6286fae8cd3c9a5680e1b` |
| `packages/db-cloud/drizzle/meta/0020_snapshot.json`                       | `b3dd7afa4aa1a4e8a590aeda90b667b292b4a93f43e1df7e917c1a81705cfac8` |
| `packages/db-cloud/drizzle/meta/_journal.json`                            | `64220d2f34a139073a378cf90ad088a950005cd008497afc57f5d5b6a0b23997` |

Final Tasks hash belongs in the external handoff, not inside this self-referential file. This is a partial Apply checkpoint, not final implementation evidence or Gate 3 preparation. Resume requires safe disposable setup authorization/verification and refreshed protected/implementation hashes before completing pending database-backed work.

Final new-file whitespace inspection used `git -c core.autocrlf=false diff --no-index --check -- /dev/null <path>` for all seven new implementation files and untracked Tasks. Aggregate exit was **1**, with no whitespace-error diagnostics; no-index reports new-file differences. This is not recorded as an exit-0 command. Explicit scoped Prettier and raw hashes additionally cover these untracked files (SQL uses review/hash inspection, no undefined formatter). Final Tasks scoped formatting and strict OpenSpec revalidation both exited 0.

## Disposable PostgreSQL continuation checkpoint — 2026-09-08

This section supersedes the earlier environment-blocked checkpoint for current execution status, without rewriting its historical evidence. Current-user authorization: `C:/Users/Tam/.codex/attachments/94c76418-9779-4894-ae07-91fe56ec1c90/pasted-text.txt`. The exact resume Tasks hash was `0ee125edc4bb4261d745629387e2126c14097fc6b15573725c1cff7028ed2d40`; all ten earlier implementation checkpoint hashes matched before writes.

**Current completion: 14/17.** Tasks 2.4–2.7, 3.1, 3.3 and 3.4 now have real PostgreSQL evidence and are complete. Tasks **3.2, 3.5 and 3.6 remain unchecked** because the required Personnel regression and broad cloud command are not green and no Control Tower acceptance/remediation decision exists for these newly observed baseline/environment failures. This is a resumable checkpoint, not a ready Gate 3 packet.

- `TECHNICAL IMPLEMENTATION COMPLIANCE: FAIL` — acceptance incomplete for I5/I7/I8, not a detected template implementation defect.
- `VERIFY: FAIL` — required regression acceptance unresolved; no whole-change PASS.
- `QA: FAIL` — Q10 includes existing Formalités/Personnel regression behavior; its required matrix has one failing assertion. Other runtime cases below actually executed and passed; QA is neither skipped nor NOT_APPLICABLE.
- `UI_AFFECTING: NO`; `BROWSER_QA_REQUIRED: NO`.
- `YUTA OPERATIONAL READINESS: STOP — return to Control Tower before Gate 3`.
- `03-final-review.md`: NOT CREATED; `Sync authorization: PENDING`.
- No Sync, Archive, Knowledge Consolidation, lifecycle promotion, deployment or production operation.

### Authorized environment and positive identity verification

Before creation, inspected all Docker container names, published ports, existing volumes and host listeners. Name `yuta-formalites-template-qa-20260908` and loopback port `56541` were unoccupied. Used a newly created container with no volume mount/reuse:

| Identity field             | Verified value                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------- |
| Container                  | `yuta-formalites-template-qa-20260908`                                             |
| Exact container ID         | `28c1e1c627ae33c585a7330350d60bee56a9c3a10b400e2169b04f7a99573f25`                 |
| Created                    | `2026-09-08T08:11:38.324485788Z`                                                   |
| Image / actual server      | `postgres:17-alpine` / PostgreSQL `17.10`                                          |
| Image ID                   | `sha256:dc17045ccfd343b49600570ea734b9c4991cf1c3f3302e67df51e3b402dd55c4`          |
| Host binding / server port | `127.0.0.1:56541 -> 5432`                                                          |
| Role                       | `formalites_qa`                                                                    |
| New databases              | `formalites_template_clean`, `formalites_template_incremental`                     |
| Mount identity             | `Mounts=[]`; `HostConfig.Tmpfs={"/var/lib/postgresql/data":"rw"}`; no named volume |
| Labels                     | `yuta.qa.change=formalites-legal-template-foundation`; `yuta.qa.disposable=true`   |
| Data                       | Synthetic only; no copy from an existing database                                  |

Before migration/test writes, direct host TCP read-only queries verified `current_database()`, `current_user`, server version, port and backend identity. Clean and incremental both initially had **0 public tables**, with backend PIDs 77 and 78 respectively. An additional read-only container-local connection reported PID 69. These identity checks followed container ownership verification; a name/guard alone was not considered safety proof.

Effective command environment used only the verified loopback target, `CLOUD_DATABASE_SSL=false` and process-scoped `YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true`. Every wrapper rechecked the full container ID; credentials were read into process memory without printing a password or full URL. Its `finally` removed the three temporary variables. No `.env` or `.env.local` was edited. Existing development configuration mismatch was preserved.

Pre-existing resources remained excluded: `yuta-cloud-db-dev` (56431), `yuta-pos-db-dev` (55932), `yuta-display-db-dev` (55433), `resto_postgres` (5432), `yuta-owner-responsive-qa-20260906`, `yuta-next-phase3completion-linux-20260904`, `yuta-next-phase3r-linux-20260904`, and all their volumes. No operation in this workflow targets their data.

### Clean and incremental migration evidence — PASS

Clean: `pnpm db:cloud:migrate`, exit **0**, applied the full current 21-entry chain through `0020_formalites_legal_template_foundation`. Final public table count: **58**. Existing PostgreSQL long-identifier truncation notices, including two generated new FK names, were notices rather than migration errors.

Incremental preceding-state preparation used the **installed existing Drizzle migration machinery**, not a new repository command/file:

```js
const { readMigrationFiles } = require('drizzle-orm/migrator');
const migrations = readMigrationFiles({ migrationsFolder: './drizzle' });
await db.dialect.migrate(migrations.slice(0, 20), db.session, {
  migrationsFolder: './drizzle',
});
```

Preparation ran through `node --import tsx -e` from `packages/db-cloud`, using `createCloudDatabaseClient(process.env)`, and exited **0**. Verified journal tip 0019 and 55 tables. Inserted one synthetic organization, establishment, internal user and Personnel employee; created one existing tenant Formalités draft and receipt through the unchanged existing repository operation with synthetic scoped OWNER context. No customer or actual legal content was used.

The first verbose before/after tool output was truncated and unsuitable as exact snapshot evidence. It was discarded. Only the newly created incremental database was dropped/recreated after rechecking the exact new container identity and empty mount set; read-only verification again found 0 public tables. The preceding-state setup and synthetic preservation exercise were then rerun with compact complete hashes. **Only this second, complete capture is authoritative below.**

Incremental upgrade: `pnpm db:cloud:migrate`, exit **0**, journal **20 -> 21**, public tables **55 -> 58**. All first 20 journal entries stayed identical; only 0020 was appended. New tables were exactly `formalites_template_identities`, `formalites_template_working_drafts`, `formalites_template_versions`.

Snapshot method: for every public table, select `to_jsonb(t)` ordered by `to_jsonb(t)::text`, capture row count and SHA-256 of `JSON.stringify(rows)`. Existing column definitions are ordered by table/ordinal position; constraints/indexes by table/name. Hash UTF-8 serialized query results using Node crypto. Compare before migration, after migration and after the real global journey on the incremental database.

| Snapshot                                                                          | Exact SHA-256 / result                                                               |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Complete 55-table pre-existing count/hash map, unchanged at all three checkpoints | `7028f21cfb6588fe4233c5d995e4a3fa8ebd838dec07c21b88115d0bdfcecbf4`                   |
| 616 pre-existing column definitions, unchanged                                    | `baf78a54f3e1f2206f11af6de56311dce6dde5f8831364553d4add891fbb7590`                   |
| Pre-existing constraints, unchanged                                               | `2c2f756ed3b0dd00666de31ca09bb68dba4f76040070a17ee2771b8a8e164743`                   |
| Pre-existing indexes, unchanged                                                   | `b5b42dfe3f0231966487fd4108f071a6468ed9b503e1da63ba6d3c413ce0c620`                   |
| 20-entry pre-migration journal serialization                                      | `0398e7f7de3c9d40ed5961edc905d77d7445d5ed2b2150cda15b0e4771269ff4`                   |
| 21-entry post-migration journal serialization                                     | `9027f09f16978e6e32390bb771414447ccf5d56a60fa7fd5c2df114d3ee5c236`                   |
| Appended SQL journal hash / timestamp                                             | `690c94cbaac1d6cec863a9f8a86ad46efe0507f9a7a6286fae8cd3c9a5680e1b` / `1788853104815` |

Populated pre-existing tables below each contained exactly one row, unchanged after upgrade and QA:

| Table                                         | Before = after = post-journey row SHA-256                          |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `establishments`                              | `906eed7d4bf24f46d960cd692e475a1a4a518813a0c060f08fd8b09f236d47cc` |
| `formalites_personnel_draft_command_receipts` | `8c0c4fcc9c76a665d6800f214bbfc5e02b080e020dde1ebdb89456e299b1f29e` |
| `formalites_personnel_drafts`                 | `a40ce640bde1d12a658f93891289ac6ffa2b5cd8db4d7ca9b0f8e1b03d954f79` |
| `organizations`                               | `792487cb631bb7d6e4c8eafe58ff26fa9781a852dd44033100b1a4c6b5eb4e13` |
| `personnel_employee_dossiers`                 | `5e9faf115938737395d989a8b79e4674e3c813a0d7381fb284e0a4da57e71261` |
| `users`                                       | `2ae48cafcb890b436d452b3a6bcd4907734d723c1ff3786eaba3f9871108a73c` |

The other 49 pre-existing tables each had count 0 and row serialization SHA-256 `4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945`, unchanged at all checkpoints:

```text
auth_audit_events
auth_login_attempts
auth_selection_tickets
auth_sessions
booking_audit_events
booking_exceptions
booking_notification_deliveries
booking_public_attempts
booking_service_periods
booking_settings
direct_customer_feedback
feedback_internal_notes
feedback_items
feedback_replies
password_reset_tokens
personnel_command_receipts
personnel_contract_amendment_command_receipts
personnel_contract_amendment_versions
personnel_contract_amendments
personnel_document_command_receipts
personnel_document_versions
personnel_documents
personnel_employee_audit_events
personnel_employee_history_events
personnel_employee_history_group_changes
personnel_history_cutovers
personnel_register_audit_events
personnel_register_command_receipts
personnel_register_corrections
personnel_register_counters
personnel_register_entries
pointage_credential_rate_limits
pointage_employee_credentials
pointage_security_audit_events
reputation_audit_events
reputation_connectors
reputation_settings
reservation_internal_notes
reservation_status_history
reservations
restaurant_knowledge_communication_identity
restaurant_knowledge_concept_history
restaurant_knowledge_cuisine_know_how
restaurant_knowledge_customer_experience
restaurant_knowledge_team_culture
restaurant_knowledge_validated_items
tenant_domains
tenant_entitlements
tenant_memberships
```

Final incremental inspection: **0 existing row changes**, no existing column/constraint/index changes, journal 21, 58 tables. The three new tables had zero rows after the suite's exact-owned-ID cleanup. Only transient synthetic test rows had been added/removed in these new tables. No destructive down migration was introduced; code rollback retains the additive tables/data.

### Real PostgreSQL acceptance / QA

Implementation test: `packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts`. Final exact source hash: `0cd6a24069fb8e9ca85a12babdd4cf4c037e53206a89eafad0cf9a0476ef4682`.

Final clean execution: **16/16 PASS, 0 skipped**, PostgreSQL 17.10, role `formalites_qa`, independent backend PIDs **233, 234, 235, 236**. Final incremental execution: **16/16 PASS, 0 skipped**, same version/role, independent PIDs **242, 243, 244, 245**. Sanitized identities were emitted by the harness; beforeAll independently asserted four distinct PIDs.

Connections A/B each have their own PostgreSQL client with `max: 1`; coordinator and observer are two additional clients. The coordinator holds the real identity row lock. Observer queries `pg_stat_activity` and `pg_blocking_pids` to establish A queued before B, then releases the barrier. These are real lock waits/commits, not two promises on one connection. Failure/response-loss injection exists only in test composition around real transactions, never in exported production hooks.

| Case | Actual evidence                                                                                                                                                                                                                             | Result                          |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Q1   | Verified clean + incremental migrations; 22 exact global columns, 3 restrictive FKs, 5 checks, partial active unique index and 21 journal entries; all 55 existing tables preserved                                                         | PASS                            |
| Q2   | Trusted active admin without membership creates identity, edits revision 1 -> 2, freezes, independently rereads the exact Version, starts new draft and retains history                                                                     | PASS                            |
| Q3   | Controlled competing create: one success/one ACTIVE_DRAFT_EXISTS; stale edit rejected; durable duplicate/revision/containment constraints reject writes                                                                                     | PASS                            |
| Q4   | Both deterministic winner orderings executed: edit -> STALE_DRAFT_REVISION freeze, freeze -> DRAFT_FROZEN edit; source/applicability remain one complete revision                                                                           | PASS                            |
| Q5   | Concurrent same-revision freeze yields same stable Version; real committed result followed by synthetic response-loss error; exact retry and old-draft retry after new active draft both replay one Version                                 | PASS                            |
| Q6   | Test observes inserted Version inside transaction, injects error before draft close; independent post-rollback reads find zero Version and original active revision                                                                         | PASS                            |
| Q7   | Actual bytea NUL/Unicode/embedded FEFF/whitespace/LF roundtrip; independent SHA-256; malformed UTF-8, BOM and unknown profile rejected; unit edge cases supplement real bytes                                                               | PASS                            |
| Q8   | Normal frozen edit denied; copied return mutation does not change persisted tuple; isolated corruption of bytes/checksum/profile/applicability and draft replay binding fails closed                                                        | PASS                            |
| Q9   | Same canonical bytes/hash with changed applicability creates different immutable Version; assertions/unknown retained, unapproved canonical references rejected; no matching engine                                                         | PASS                            |
| Q10  | New real-DB support/restaurant-only/tenant-context confusion cases pass; 87 guard/domain/schema unit cases and existing auth 45/tenant 11 pass. Required C5 Personnel regression has 1 failure; compatibility acceptance remains unresolved | FAIL — required regression gate |
| Q11  | Exact schema/facade inventory excludes actor/ordinal/reviewer/evidence/publication/qualification/retirement; incremental existing tenant rows unchanged after full journey; no app/provider wiring                                          | PASS                            |

The Q5 failure models loss **after a confirmed real commit** at the test adapter boundary. It is not a claim that a network fault was injected inside PostgreSQL COMMIT. Production propagates unknown transaction errors without asserting success or rollback; caller retries exact locator only. Corruption checks prove normal-path integrity validation, not protection against a privileged actor rewriting all consistent database values.

### Exact executed command matrix

All commands ran from `D:/working/yuta/yuta-resto` unless the inline preceding-state preparation explicitly scopes to db-cloud. C2/C3/C5/test:cloud used the verified clean target; C2 also ran on incremental. DB commands were guarded as described above. No guard was bypassed.

| ID              | Actual command / execution                                                                                                                     | Exit and actual result                                                                                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1              | `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-domain.test.ts test/formalites-legal-template-repository.test.ts` | 0; 87/87, 2 files, 0 skips                                                                                                                                                                  |
| C2              | `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-repository.integration.test.ts`                                   | 0 on clean and incremental; each 16/16, 1 file, 0 skips. Initial runs and diagnostic `--silent=false` rerun also exited 0; final sanitized-output runs cited above                          |
| C3              | `pnpm --filter @yuta/db-cloud test:integration`                                                                                                | 0; 3/3, 1 file, 0 skips                                                                                                                                                                     |
| C4              | `pnpm --filter @yuta/auth test`; `pnpm --filter @yuta/tenant test` executed by test:cloud                                                      | Each 0; 45/45 in 5 files and 11/11 in 2 files, 0 skips                                                                                                                                      |
| C5              | Exact eleven-file `pnpm --filter @yuta/db-cloud exec vitest run ...` invocation from the approved C5 row above, unchanged                      | 1; 76 passed, 1 failed, 0 skipped; 10 files passed, 1 failed                                                                                                                                |
| C6              | `pnpm db:cloud:generate`                                                                                                                       | 0; 58 tables, "No schema changes, nothing to migrate"; no additional migration created                                                                                                      |
| C6              | `pnpm db:cloud:migrate` clean; same command incremental                                                                                        | Each 0; full 21 chain and isolated 0019 -> 0020 upgrade respectively                                                                                                                        |
| C7              | `pnpm --filter @yuta/db-cloud typecheck`; `pnpm --filter @yuta/auth typecheck`; `pnpm --filter @yuta/tenant typecheck`                         | Each 0                                                                                                                                                                                      |
| C7              | `pnpm -r --if-present typecheck`                                                                                                               | 0; all invoked typechecks complete, scope 15 of 16 projects                                                                                                                                 |
| C8              | `pnpm docs:check`                                                                                                                              | 0; 36 current documents                                                                                                                                                                     |
| C8              | `pnpm architecture:check`                                                                                                                      | 0; imports, URLs, client boundaries and migration baselines valid                                                                                                                           |
| C8              | `pnpm exec openspec validate formalites-legal-template-foundation --strict --json`                                                             | 0; 1/1 valid, 0 issues                                                                                                                                                                      |
| C9              | `pnpm test:cloud`                                                                                                                              | 1; auth 45/core 9/contracts 98/booking 3/booking-web 7/tenant 11 passed; db-cloud 254 passed, 1 failed, 37 skipped, 3 failed files / 29 passed / 1 skipped. Chain stopped before Backoffice |
| C9 supplement   | `pnpm --filter @yuta/backoffice test` separately, because aggregate stopped earlier                                                            | 0; 541 passed, 97 passed files / 1 skipped file. Provider smoke suite conditional on approved fixture IDs was not fabricated/enabled                                                        |
| C9              | `pnpm build:cloud`                                                                                                                             | 0; web, Backoffice, booking-web, feedback-web all compiled, typechecked and generated their build output. This is a local build, not deployment                                             |
| C10             | `pnpm exec prettier --check packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts`                                   | 0 on final test source                                                                                                                                                                      |
| C10             | `pnpm format:check`                                                                                                                            | 1; exactly 67 inherited warnings, all matched Gate 2b baseline and byte-identical to fresh resume baseline; no new warning                                                                  |
| Scope exclusion | `pnpm test:local`                                                                                                                              | NOT RUN; NOT REQUIRED, unchanged local packages                                                                                                                                             |

No db-cloud lint/build command was invented. No existing test or guard was edited to turn a failure into PASS.

### Regression failures requiring Control Tower decision

**B1 — Personnel newest-50 fixture is date-sensitive.** C5 fails at `packages/db-cloud/test/personnel-repository.integration.test.ts:1704`, test `preserves a stable newest-50 window and truncation`. It creates a current-time employee event, inserts 51 audit events from fixed `2026-09-04T12:00:00.000Z` plus 0..50 ms, then expects the fixed-date last event first. Observed expected `2026-09-04T12:00:00.050Z`, actual `2026-09-08T08:22:30.822Z`. The aggregate rerun independently reproduced actual `2026-09-08T08:23:43.927Z`. Code inspection explains the current creation event sorting newer than the fixed fixture. Source/test bytes predate this Apply and are unchanged. This is an attributed existing-test failure observed now, **not a claimed successful pre-change replay**; no pre-0020 regression test execution was performed.

**B2 — Broad cloud suite has mutually incompatible disposable-name guards.** Existing `test/pointage-repository.integration.test.ts:63` accepts only `/yuta_pointage_foundation_test(?:_[a-z0-9]+)?/` database names; existing `test/tenant-user-repository.integration.test.ts:98` accepts only `/yuta_owner_preservation_test(?:_[a-z0-9]+)?/`. Neither accepts the approved Formalités clean database, and their accepted sets do not intersect. Both beforeAll hooks fail closed. Pointage 8 and owner-preservation 27 tests are consequently skipped, not passed. The aggregate db-cloud output additionally reports 2 skipped tests in its other guarded suite, for 37 total; none is reported as new Formalités QA. No guard rename/bypass or redirect to an existing database was attempted.

| Unchanged implicated path                                           | Exact current / resume SHA-256                                     |
| ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `packages/db-cloud/test/personnel-repository.integration.test.ts`   | `cdfa71ef0c39c4ace3015848c3a4168d547a203e005b7bc18bebc97e15c129eb` |
| `packages/db-cloud/src/personnel-repository.ts`                     | `28cbb0fb44b28bec110c32486ca99d6c64215918d9e8114e2d340b63e2e499c0` |
| `packages/db-cloud/test/pointage-repository.integration.test.ts`    | `4761848b92e1ebb4f2db81d15e596f654f02b480c34bd290a339755302a6c1f1` |
| `packages/db-cloud/test/tenant-user-repository.integration.test.ts` | `e7784767b6600b9110d72798a7949e29193a19965a3db507908fc3ddad795724` |

B1/B2 are outside approved implementation paths. Required next decision: authorize bounded remediation in their owning changes, or explicitly accept the attributed regression/environment failures for this change and define the remaining separate-suite acceptance scope. **No such acceptance is inferred here.** Do not claim 17/17 or create a ready Gate 3 until that decision and required reruns are complete.

### Technical Compliance Matrix — checkpoint assessment

Source aliases: **Schema** = `packages/db-cloud/src/schema/formalites-legal-templates.ts`; **Domain** = `packages/db-cloud/src/formalites-legal-template-domain.ts`; **Facade** = `packages/db-cloud/src/formalites-legal-template-repository.ts`; **DB QA** = new integration test above; **Units** = C1 two files. Authorities are the unchanged Design D1–D10 and exact embedded Foundation/Service/Integration Contracts above, with their referenced current owner documents. PASS below is row-specific evidence, not whole-change approval.

| ID  | Rule / authority -> implementation -> actual evidence                                                                                                 | Result                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| F1  | D1–D2 global ownership -> Schema/0020 -> Q1 exact 3 tables, no tenant columns/imports                                                                 | PASS                         |
| F2  | D2/D7 identity separation -> Schema/Facade -> UUIDv7, zero/two-version history, no repurpose/ordinal/actor method/field, Q2/Q11                       | PASS                         |
| F3  | D2/D5 exact bytea -> Schema/Domain -> real Q7 NUL/Unicode roundtrip plus copied codec tests                                                           | PASS                         |
| F4  | D2–D4 durable constraints -> Schema/0020/Facade -> Q1/Q3/Q4/Q5 direct constraint/race denials                                                         | PASS                         |
| F5  | D2 full binding/restrictive references -> Schema -> 22 columns, NOT NULL/check/FK inventory and same-hash distinct versions Q9                        | PASS                         |
| F6  | D8 additive migration -> SQL/snapshot/journal -> 55 old tables unchanged, 0019 retained, re-generation no-op, protected hashes                        | PASS                         |
| F7  | D2/D7 exclusions -> exact path/schema/facade inventory -> Q11, no legal seed/evidence/lifecycle/app addition                                          | PASS                         |
| F8  | D9–D10 safe additive migration/rollback -> exact new disposable container -> clean/incremental preservation, no down/reset of existing resources      | PASS                         |
| S1  | D1 fixed guard/fresh replay authorization -> Facade -> all 8 method operation-order tests + real Q10 denials                                          | PASS                         |
| S2  | D1 closed operations -> unchanged auth + strict inputs -> C1/C4, protected hashes, no caller policy/context                                           | PASS                         |
| S3  | D2/D7 stable purpose/mutable draft -> Facade -> Q2 retained purpose, frozen edit denied, excluded methods absent                                      | PASS                         |
| S4  | D3 lock/revision contract -> Facade -> READ COMMITTED parent then draft, Q3/Q4 and overflow/containment denials                                       | PASS                         |
| S5  | D4 atomic snapshot/freeze -> Facade -> Q2/Q4 full tuple, Q6 real inserted-row rollback before close                                                   | PASS                         |
| S6  | D4 exact locator replay -> Facade -> Q5 independent concurrent freeze/response loss/new draft retry, no checksum dedup                                | PASS                         |
| S7  | D5 strict profile -> Domain -> C1 malformed/BOM cases + Q7 persisted LF and invalid input rejection                                                   | PASS                         |
| S8  | D5 no source rewriting -> Domain/Facade -> C1 Unicode/whitespace edge cases, Q7 independent frozen bytes                                              | PASS                         |
| S9  | D4–D5 exact SHA-256 -> Domain/Facade -> independent digest and Q8 corrupt bytes/digest/profile failures, caller hash rejected                         | PASS                         |
| S10 | D6 non-executable declaration -> Domain -> all nine unknown dimensions, copied assertions, empty reference allowlist, Q9                              | PASS                         |
| S11 | D7 normal-path immutable binding -> Facade -> no patch/upsert/delete/reopen; Q2/Q8/Q9 independent reads and changed-envelope Version                  | PASS                         |
| S12 | D2/D6–D7 exclusions -> Schema/Facade -> exact field/method inventory, Q11; ordinal/actor conditional premises absent                                  | PASS                         |
| S13 | D1/D8 runtime/auth separation -> scoped exports/import graph -> unchanged auth/tenant/apps/manifests, architecture check 0                            | PASS                         |
| I1  | D9/operations disposable verification -> new tmpfs container -> sanitized identity before writes, no existing resource reuse                          | PASS                         |
| I2  | D9 clean/incremental migration -> 0020 -> both command exits 0 and exact three-point row/schema/index/constraint hashes                               | PASS                         |
| I3  | D3/D4 independent races -> DB QA -> four distinct real backends, observed lock waits and controlled winner ordering                                   | PASS                         |
| I4  | D5–D7 durable binding -> DB QA -> Q7/Q8/Q9 raw bytes/digest/corruption/changed-applicability outcomes                                                 | PASS                         |
| I5  | D1/D9 existing tenant compatibility -> unchanged auth/tenant/C5 -> new isolation tests pass but required C5 has one unaccepted existing-test failure  | FAIL — acceptance incomplete |
| I6  | Workflow exact execution/attribution -> command table and raw full-tree inventory -> actual failures/skips recorded; no protected/source edits hidden | PASS                         |
| I7  | Required Q1–Q11 real acceptance -> DB QA plus regression -> Q10 total acceptance not PASS; QA not relabelled NOT_APPLICABLE                           | FAIL — Q10 regression        |
| I8  | Workflow complete delivery/readiness -> preserved 14/42 mapping below -> 14/17, no final ready Gate 3; final acceptance blocked                       | FAIL — incomplete            |

### 14/42 conformance coverage — not an aggregate acceptance claim

All **14 requirement titles and 42 scenario titles** in the planning mapping remain unchanged and mapped. Existing numbered mapping is still the exact title authority; actual results below supplement it. No scenario is dropped or interpreted as permission to add an ordinal/actor/runtime capability.

| Requirement / scenarios | Implementation and actual evidence                                                                                                  | Checkpoint finding                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| R1 / S1–S2              | Schema + Facade; C1 guards, DB Q2/Q10 global admin without membership and tenant denial                                             | New foundation assertions PASS                                         |
| R2 / S3–S7              | Facade fixed operations; C1/C4 + DB Q10; C5 existing isolation cases passed except unrelated newest-50 assertion                    | New authorization assertions PASS; broader compatibility pending B1/B2 |
| R3 / S8–S10             | Identity legalPurpose immutable through exposed methods; C1 absence tests, DB Q2 stable identity/history                            | PASS                                                                   |
| R4 / S11–S14            | Partial unique index and expected revision; DB Q2/Q3/Q4/Q5                                                                          | PASS                                                                   |
| R5 / S15–S17            | Single transaction exact snapshot and read-back; DB Q2/Q4/Q6/Q7                                                                     | PASS                                                                   |
| R6 / S18–S20            | Domain profile + read verification; C1 canonical cases, DB Q7/Q8 mutation/corruption                                                | PASS                                                                   |
| R7 / S21–S24            | Domain canonicalizer; C1 invalid UTF-8/Unicode/whitespace plus DB Q7 exact bytes                                                    | PASS                                                                   |
| R8 / S25–S27            | Server SHA-256, no caller checksum/legal evidence; C1 and DB Q7/Q8/Q11                                                              | PASS                                                                   |
| R9 / S28–S29            | No checksum unique/dedup; DB Q9 same bytes changed envelope yields distinct Version without qualification                           | PASS                                                                   |
| R10 / S30–S32           | Domain strict declaration; C1 nine dimensions and DB Q9 assertions/unknown/reference denial, no evaluator                           | PASS                                                                   |
| R11 / S33–S34           | Exact source draft/revision uniqueness and replay; DB Q5 actual concurrency/committed response loss                                 | PASS                                                                   |
| R12 / S35–S36           | No ordinal field/parameter/export (S35 conditional premise absent); deterministic history has no selector                           | PASS — explicit absence evidence                                       |
| R13 / S37–S39           | No actor persistence (S37 conditional premise absent), strict private-field rejection, Q6 allow plus rollback and Q11               | PASS — explicit absence evidence                                       |
| R14 / S40–S42           | No lifecycle/provider/app methods; fixed scope and protected hashes, Q11; completion remains blocked rather than lifecycle-promoted | Exclusions PASS; no whole-workflow completion claim                    |

### Refreshed attribution and integrity

Resume inventory `2026-09-08T08:11:46.967Z`: 2550 existing tracked/non-ignored untracked files. Before checkpoint documentation writes, refreshed `2026-09-08T08:26:57.939Z` full-tree comparison found only the new approved integration test in this turn's implementation scope, plus separately edited Pointage review packet below. All previous ten implementation paths retained their checkpoint bytes. Earlier gates: Gate 1 **26/26** unchanged, Gate 2 **29/29** unchanged, Gate 2b **41/44** unchanged with exactly the already-authorized two indexes and journal differing from pre-Apply; no unexplained protected drift. The three gate packets, Proposal/Analysis/Specs/Design, main specs, canonical Knowledge, auth/tenant/runtime and existing migration files remain unchanged by this workflow.

Concurrent unrelated path `docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md`: resume hash `e204c0eb412b32f134f662d5c8552eeba6c30c81939bab647278df5075551f50`, current observed hash `a80a45fdc7889a1f68b15a9af9da95ef6695684b085ad6b394dbae53f12b0977`. It is preserved, neither reverted nor attributed/rebaselined as Formalités source. Original pre-Apply hash stays in the earlier checkpoint.

| Attributed implementation path                                                    | Current exact SHA-256                                              |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `packages/db-cloud/drizzle/0020_formalites_legal_template_foundation.sql`         | `690c94cbaac1d6cec863a9f8a86ad46efe0507f9a7a6286fae8cd3c9a5680e1b` |
| `packages/db-cloud/drizzle/meta/0020_snapshot.json`                               | `b3dd7afa4aa1a4e8a590aeda90b667b292b4a93f43e1df7e917c1a81705cfac8` |
| `packages/db-cloud/drizzle/meta/_journal.json`                                    | `64220d2f34a139073a378cf90ad088a950005cd008497afc57f5d5b6a0b23997` |
| `packages/db-cloud/src/formalites-legal-template-domain.ts`                       | `985b91cd04b41559185b7462ccfd67b7e738bba0ab6efae951c4ab83c9528ccd` |
| `packages/db-cloud/src/formalites-legal-template-repository.ts`                   | `4ad3349d11a38ebf5da67787bbe00a3a1500005c07278869306ecd087cd5a6e6` |
| `packages/db-cloud/src/index.ts`                                                  | `7242c6e54fd7f1856e5077ea34a26e8f35c8e4ae16485e7d94f8aac7d0dd4bb0` |
| `packages/db-cloud/src/schema/formalites-legal-templates.ts`                      | `27a235157b543dca2723a6ce27e796939b88f451ba8d927e2c6d2a9a441709ab` |
| `packages/db-cloud/src/schema/index.ts`                                           | `1f71e967a4bd17d07c4fb09c777a979ce4b9646dbdc1d8c79d15815001d5ee15` |
| `packages/db-cloud/test/formalites-legal-template-domain.test.ts`                 | `6442d51a9b53e17bcf2ce2dae98dc4057feb1ba77566b6a3638703398c39f8db` |
| `packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts` | `0cd6a24069fb8e9ca85a12babdd4cf4c037e53206a89eafad0cf9a0476ef4682` |
| `packages/db-cloud/test/formalites-legal-template-repository.test.ts`             | `5a186b21d57a2175707f4639c32bc9460987e6ba5856fb2289cfa923f51f5c15` |

All 67 global formatter-warning paths exactly match the earlier Gate 2b list and remain byte-identical to the fresh resume map. This does not authorize formatting any of them. Only approved delivery files receive scoped checks. No sixth canonical target or canonical Knowledge edit exists.

The current tasks.md hash is recorded externally after final checkpoint formatting, not inside itself. Final Technical Compliance Matrix/Gate 3 evidence will be regenerated only after required regression acceptance is resolved. No standalone report, fixture, script or premature `03-final-review.md` is created.

### Final checkpoint validation and disposable cleanup

After checkpoint authoring, scoped Prettier checked all ten formatter-supported implementation files plus Tasks: exit 0. Only Tasks received a scoped formatter write in this final documentation pass; no canonical document was formatted. db-cloud typecheck, docs:check (36), architecture:check and strict change validation (1/1, 0 issues) reran and each exited 0. Generated SQL was not sent to an undefined SQL formatter.

`git diff --check` over the three tracked shared targets exited 0, with only line-ending conversion notices. For each of the eight new implementation files and untracked Tasks, `git -c core.autocrlf=false diff --no-index --check -- /dev/null <exact-path>` exited 1 because each is a new-file difference; stdout/stderr contained no whitespace diagnostics. Do not call these no-index invocations exit-0 checks.

Exact title/count verification: requirement headings 14, mapped requirement titles 14, exact order/content equality; scenario headings 42, mapped scenario titles 42, exact order/content equality. CLI status and Apply instructions reran with exit 0: schema `yuta-spec-driven`, planning 5/5 complete, implementation **14 complete / 3 remaining / 17 total**. Raw CLI `isComplete` describes planning, not accepted implementation or workflow readiness. `03-final-review.md` absence was verified.

After all database evidence was captured, re-inspected the full disposable container ID, exact creation timestamp, both QA labels, `Mounts=[]` and the dedicated tmpfs. Then `docker stop 28c1e1c627ae33c585a7330350d60bee56a9c3a10b400e2169b04f7a99573f25` and `docker rm 28c1e1c627ae33c585a7330350d60bee56a9c3a10b400e2169b04f7a99573f25` both exited 0. No volume deletion command was used because no QA named volume had been created. Both temporary synthetic databases were discarded with their tmpfs and are not recoverable; their captured evidence remains here. No pre-existing container or volume was targeted. Post-cleanup inventory still contains the seven pre-existing containers and all pre-existing named volumes. The new QA container is absent. Further DB reruns require a fresh positively verified disposable setup, not reuse of any existing YUTA DB.

Final process environment inspection: CLOUD_DATABASE_URL absent, CLOUD_DATABASE_SSL absent, YUTA_ALLOW_DATABASE_INTEGRATION_TESTS absent. No environment-file edits or persistent redirection were performed. Production remains **NOT AUTHORIZED**.

## Integrity invalidation on regression continuation — 2026-09-08

Current-user request: `C:/Users/Tam/.codex/attachments/b7eb0b59-9741-49d7-9b43-cbafbe3a3412/pasted-text.txt`. Fresh pre-write inventory: `2026-09-08T09:07:21.420Z`, HEAD `defbc50eba3952fa2e7b1c016637daf083b18c65`. Requested Tasks preimage matched exactly `969b5d7177d11eb8a6577eca8e6094c1b0c7906787db06ae825809dfdcfe21c1`. Earlier packet bytes matched their recorded checkpoint hashes before this metadata update.

**STOP: protected source context changed after the reviewed checkpoint.** This is a review-integrity invalidation, not a rewrite or rejection of approved Design semantics. Gate 1 26/26 and Gate 2 29/29 remain intact; exact Proposal, Analysis, Design and the one delta spec remain unchanged. Of 44 original Gate 2b rows, 40 match their original values, two retain only previously authorized D8 implementation deltas (root db-cloud index/journal), and two have new drift: auth index and db-cloud schema index. The latter is additional to its already approved Formalités export.

| Path                                                     | Last reviewed Apply checkpoint SHA-256                             | Observed current SHA-256                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `packages/auth/src/index.ts`                             | `b5a8cb1f5bf9c87db3974a08948a8cd98418e42f3761ae228df6fd5e1642c634` | `464739729900d884af3ab82159151d7df5de6a0f8ee0a3a23feed7bc285a1c2a` |
| `packages/db-cloud/src/schema/index.ts`                  | `1f71e967a4bd17d07c4fb09c777a979ce4b9646dbdc1d8c79d15815001d5ee15` | `eb2629b220bcee856e8caaf24c9d16d88848c992231e031a46fe5f41ec6f9944` |
| `packages/db-cloud/src/schema/pointage.ts`               | `19ee38a3153883067eac3fd62fcfe5668968e60f5c43cef71c29f993972429e6` | `8f4f12cf76773dfca6f99ba59e37e5ee7d0a18ef13827f78caebddd51400de29` |
| `openspec/changes/pointage-usable-raw-clocking/tasks.md` | `8cb14531f9c230f025e460ea7f0a8b2208cee4904c789a353e12718240c6f1db` | `50135e23a7b02a509833a3a63bfaca5339281fae191ba9700deec54bf377600a` |

The auth index adds exactly `export * from './pointage-continuation';`. Removing that line in memory reproduces `b5a8cb1f5bf9c87db3974a08948a8cd98418e42f3761ae228df6fd5e1642c634`. The schema index adds exactly `export * from './pointage-raw-clocking';`; removing that line in memory reproduces checkpoint `1f71e967a4bd17d07c4fb09c777a979ce4b9646dbdc1d8c79d15815001d5ee15`. No actual source file was reverted. The original pre-Apply schema-index hash `934314b0cc16f81e050447869259554ff50366eefb5fe3c5d86be03113966264` remains historical authority, not a replacement current baseline.

Also observed new non-Formalités source/test paths, preserved outside delivery:

- `packages/auth/src/pointage-continuation.ts` — SHA-256 `f2c829c33030ae3550350ff4b5eac3d5dce774e5bd4774a5e46a0dd621465172`
- `packages/auth/test/pointage-continuation.test.ts` — SHA-256 `6d9e78b745c47a96e4d59e256e67090ede1258860b140e28b6210fca57b07b4a`
- `packages/db-cloud/src/pointage-raw-clocking-repository.ts` — SHA-256 `2fef65f53b3c5aa80e8abe1ee3a2364fcc852b8232ce6b67d22038484607afcb`
- `packages/db-cloud/src/schema/pointage-raw-clocking.ts` — SHA-256 `d19c5c84c9b3352437aa839d97b54e800211bc956d28e70445e6b1247c5e4754`
- `packages/db-cloud/test/pointage-raw-clocking-schema.test.ts` — SHA-256 `4848078f7194173cdab9a1a74f1f0c8b8553513fb2f44aa574ec78ff98724158`

Current `packages/db-cloud/src/schema/pointage.ts` includes the new `pointage_credentials_continuation_binding_unique` declaration. This is executable schema-context drift, not merely the previously acknowledged concurrent review-packet edit. It is not attributed to this Formalités change, and its authority or migration readiness is not inferred from file presence.

All eight dedicated Formalités source/schema/test/SQL/snapshot files retain their checkpoint hashes; the db-cloud root index and migration journal also remain at their authorized implementation hashes. The only one of the eleven attributed implementation paths with new bytes is the shared schema index above. Prior Formalités runtime evidence is preserved as historical exact-hash evidence, not rerun or promoted into current whole-repository acceptance while shared integrity is unresolved.

Control Tower B1 decision is recorded and retained: **ACCEPTED ATTRIBUTED PRE-EXISTING TEST FAILURE**, non-blocking for this change; C5 stays exit 1, 76 passed / 1 failed, never PASS. B2 acceptance remains conditional on actual separate Pointage and Owner-preservation suite PASS. Those suites were **NOT RUN on this continuation**, because this earlier integrity gate stopped execution before database setup. No new container/database/volume was created; no migration, source/test edit, guard bypass, production operation or environment-file change was performed.

Required next action: Control Tower review of exact concurrent source drift and explicit integrity-only rebaseline/scope decision, including whether new Pointage source/schema must first stabilize in its owning change. Do not modify Product/Specs/Design or silently adopt these hashes. Once integrity is explicitly restored, resume the authorized separately named disposable suites; preserve all original B1/B2 command results and follow-up candidates. Do not implement the Personnel fixture or test-orchestration follow-ups here.

Current tasks: **14/17**. Gate 3: **NOT READY**. Review status: **INVALIDATED_BY_ARTIFACT_CHANGE** for Gate 2b integrity only. No `03-final-review.md`. Sync authorization: PENDING. Production: NOT AUTHORIZED.

Validation of this integrity-only status update: `pnpm docs:check` exit 0 (36 documents); `pnpm architecture:check` exit 0; `pnpm -r --if-present typecheck` exit 0; scoped Prettier exit 0; strict OpenSpec validation exit 0 (1/1 valid, 0 issues). Earlier Gate 2b content was reconstructed and compared unchanged apart from the explicit review-status/integrity metadata and appended incident section. A fresh full-tree comparison found only Tasks and this Gate 2b packet changed by this continuation, with no new file. Database suites, builds and global format:check were not rerun after the protected-integrity stop; previous results are not relabelled as fresh runs.

## Approved B2 completion and integrity rebaseline — 2026-09-08

This is the current assessment; earlier checkpoint failures and the intervening integrity invalidation above remain historical evidence, not current readiness. No earlier command exit/result has been rewritten. Current-user INTEGRITY-ONLY REBASELINE APPROVAL restores only the two exact shared baselines below; Proposal, Analysis, Specs, Design and their semantic approvals remain unchanged.

Fresh pre-write path/hash/status inventory: 2026-09-08T09:17:33.983Z; HEAD `defbc50eba3952fa2e7b1c016637daf083b18c65`. Tasks preimage: `5762fc3cd98d449d614db92f4441dd3c5fe25ade04d504bbf4767c4036320456`. Gate 1 protected rows 26/26 and Gate 2 rows 29/29 match. Of the original 44 Gate 2b rows, 40 match original bytes; root db-cloud index/journal retain approved D8 deltas, and the two shared index rows match the explicit rebaseline. Later Pointage-only context rows are attribution, not Formalités authority.

| Approved protected resume path          | Current SHA-256                                                    |
| --------------------------------------- | ------------------------------------------------------------------ |
| `packages/auth/src/index.ts`            | `464739729900d884af3ab82159151d7df5de6a0f8ee0a3a23feed7bc285a1c2a` |
| `packages/db-cloud/src/schema/index.ts` | `eb2629b220bcee856e8caaf24c9d16d88848c992231e031a46fe5f41ec6f9944` |

Removing only the respective Pointage exports in memory reconstructs prior approved checkpoint hashes stated above; no actual source was reverted. All eight dedicated Formalités source/schema/test/SQL/snapshot files, root db-cloud index and journal retain their approved implementation hashes. No `db:cloud:generate`, SQL/snapshot/journal rewrite, Pointage schema edit or source/test modification occurred in this continuation. Existing exact-hash clean/incremental Formalités Q1–Q11 execution is retained rather than falsely presented as a fresh run.

### B2 isolated execution

New tmpfs PostgreSQL container `yuta-formalites-b2-qa-20260908`, full ID `89afc75b6d08ebf9b2bac877bb4e5f2c3ea5b6408f596562667e181c5efef2dd`, created `2026-09-08T09:19:03.13046882Z`, PostgreSQL 17.10, loopback `127.0.0.1:56542`, role `formalites_b2_qa`. `Mounts=[]`; `/var/lib/postgresql/data` is tmpfs; no existing volume or database reused. Ownership labels, exact container ID, endpoint availability, database/role/version and zero pre-migration public tables were verified before writes. No credentials or full connection URL are recorded.

Each command used only a process-scoped verified `CLOUD_DATABASE_URL`, `CLOUD_DATABASE_SSL=false` and `YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true`. No environment file changed, no production NODE_ENV or DB-name guard bypass. The two approved shared hashes and every migration file hash were rechecked before migrations/tests.

| Target                                       | Preparation / exact command                                                                    | Exit / actual result                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `yuta_owner_preservation_test_formalitesb2`  | `pnpm db:cloud:migrate`                                                                        | 0; current unchanged full 21-migration chain                          |
| Same owner target                            | `pnpm --filter @yuta/db-cloud exec vitest run test/tenant-user-repository.integration.test.ts` | 0; 27/27 tests, 1 file, 0 skips; start 11:20:05 local, duration 7.03s |
| `yuta_pointage_foundation_test_formalitesb2` | `pnpm db:cloud:migrate`                                                                        | 0; current unchanged full 21-migration chain                          |
| Same Pointage target                         | `pnpm --filter @yuta/db-cloud exec vitest run test/pointage-repository.integration.test.ts`    | 0; 8/8 tests, 1 file, 0 skips; start 11:20:06 local, duration 1.82s   |

Owner suite guard: `/^\\/yuta_owner_preservation_test(?:_[a-z0-9]+)?$/`. Pointage guard: `/^\\/yuta_pointage_foundation_test(?:_[a-z0-9]+)?$/u`. Both exact accepted names matched, suites executed rather than skipped. Unchanged owner test SHA-256 `e7784767b6600b9110d72798a7949e29193a19965a3db507908fc3ddad795724`; Pointage test `4761848b92e1ebb4f2db81d15e596f654f02b480c34bd290a339755302a6c1f1`.

Pointage inspection found that the existing suite uses the prior credential/rate/audit repository/schema supplied by migration 0019, plus existing tenant/user/personnel state. It does not require the concurrent raw-clocking repository, raw-clocking tables or continuation queries. Execution against the current unchanged migration chain actually passed. This is existing-suite compatibility evidence, not authority/readiness approval of concurrent Pointage work.

Post-test read-only identity checks: each target has 58 public tables, 21 recorded migrations, role `formalites_b2_qa`, PostgreSQL 17.10; observation PIDs 100/101 respectively. Both tips are SQL hash `690c94cbaac1d6cec863a9f8a86ad46efe0507f9a7a6286fae8cd3c9a5680e1b`, timestamp `1788853104815`. Pre-write host TCP identity checks had distinct PIDs 83/84 and zero public tables.

Cleanup revalidated the exact full ID/name/disposable labels/no-volume/tmpfs boundary, stopped and removed only this newly created container: both commands exit 0. Its two disposable databases and synthetic test data are destroyed and not recoverable; all seven pre-existing containers remain. No named volume removed. Guard/URL variables were cleared after each process. No customer/shared/production resource was touched.

### Accepted external / baseline failures

- **B1 / C5: ACCEPTED_ATTRIBUTED_BASELINE_FAILURE**, non-blocking by explicit Control Tower decision. Original command remains exit 1, **76 PASS / 1 FAIL**, 0 skipped. The newest-50 Personnel assertion compares a fixed September 4 fixture cutoff with September 8 creation timestamps. Personnel source/test and fixture remain unchanged; never relabel C5 PASS.
- **B2 / `pnpm test:cloud`: FAIL — ACCEPTED_TEST_ORCHESTRATION_LIMITATION**. The historical aggregate still exits 1: db-cloud 254 passed / 1 failed / 37 skipped; Pointage and owner beforeAll database-name guards reject its single shared target. The unchanged targeted suites now actually pass on their separately guarded databases, satisfying Control Tower's conditional B2 acceptance. The aggregate was not rerun or relabelled PASS. The separately executed Backoffice supplement retains 541 passes and one provider-conditional skipped file; no external provider fixture was fabricated.
- `pnpm format:check` freshly exits 1 with the same 67 inherited warnings. All 67 warning paths are byte-identical to this continuation's baseline; no new warning. No global formatter write occurred.
- Follow-up candidates only: deterministic Personnel newest-50 fixture; separate guarded database orchestration for integration suites. Neither is implemented, assigned readiness, opened as a change or folded into Formalités.

### Fresh compatibility / repository evidence

| Exact command                                                                                                                                  | Exit / actual result                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/auth test`                                                                                                                | 0; 64/64, 6 files, 0 skips; includes concurrent Pointage tests without promoting their authority                                                                                              |
| `pnpm --filter @yuta/tenant test`                                                                                                              | 0; 11/11, 2 files, 0 skips                                                                                                                                                                    |
| `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-domain.test.ts test/formalites-legal-template-repository.test.ts` | 0; 87/87, 2 files, 0 skips                                                                                                                                                                    |
| `pnpm docs:check`                                                                                                                              | 0; 36 current documents                                                                                                                                                                       |
| `pnpm architecture:check`                                                                                                                      | 0; imports, URLs, client boundaries and migration baselines                                                                                                                                   |
| `pnpm -r --if-present typecheck`                                                                                                               | 0; all invoked projects, scope 15 of 16                                                                                                                                                       |
| `pnpm exec openspec validate formalites-legal-template-foundation --strict --json`                                                             | 0; 1/1 valid, zero issues                                                                                                                                                                     |
| `pnpm build:cloud`                                                                                                                             | 0; web, Backoffice, booking-web, feedback-web built on current rebaseline; local build only                                                                                                   |
| Scoped `pnpm exec prettier --check`                                                                                                            | 0 on matched Formalités TypeScript, Tasks and Gate 2b packet; Drizzle metadata ignored by existing repository rule, SQL checked by exact bytes/diff/migrations, not a claimed Prettier parser |
| `pnpm format:check`                                                                                                                            | 1; same 67 inherited warnings                                                                                                                                                                 |
| Attributed implementation `git apply --reverse --check --whitespace=nowarn -`                                                                  | 0; exact 11-file patch, 11699 insertions, no deletions                                                                                                                                        |

### Current acceptance and final delivery

Task 3.2: complete after actual B2 passes, current auth/tenant and foundation compatibility, plus accepted B1 attribution. No existing failing test weakened. Task 3.5: complete with exact 14/42 mapping and all 29 contract rows in Gate 3; failures remain explicitly attributed, not hidden. Task 3.6: complete with required real-database non-browser QA, not NOT_APPLICABLE.

F1–F8: 8/8 PASS. S1–S13: 13/13 PASS. I1–I8: 8/8 PASS. In particular I5 now combines retained real isolation/tenant preservation, fresh unchanged-suite B2 passes and the explicit B1 decision; I7/Q10 now have complete accepted regression evidence; I8 has full 17/17 delivery and separate human Gate 3. R1–R14 / S1–S42: 14/14 requirements and 42/42 scenarios conform, with optional ordinal S35 and actor-persistence S37 premises explicitly absent, not implemented. Exact names/mapping above remain unchanged and are carried into the final packet with actual evidence.

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS
VERIFY: PASS
QA: PASS
UI_AFFECTING: NO
BROWSER_QA_REQUIRED: NO

Q1–Q9 and Q11 retain exact-hash real clean/incremental PASS evidence above. Q10 is PASS under the accepted regression decisions plus new actual B2 runs. No legal-review engine, publication, qualification, runtime/UI, production migration or deployment is claimed.

Current tasks: **17/17**. Gate 3: ready for human review only. Current final evidence: `docs/reviews/formalites-legal-template-foundation/03-final-review.md`; this source contains the final matrix, requirement/scenario map, canonical verify-evidence block, exact attributed diff and hashes. No standalone verify artifact created. Historical 14/17 and FAIL checkpoints remain chronological records and are superseded only by this explicitly approved completion assessment.

Changes in this continuation are limited to Tasks, Gate 2b integrity/status evidence and the new Gate 3 packet. Concurrent Pointage-only design/review edits were observed and remain outside delivery; their current hashes are recorded in Gate 3. The two protected shared indexes and dedicated Formalités implementation remain unchanged.

Review status: AWAITING_HUMAN_REVIEW
Sync authorization: PENDING
Production: NOT AUTHORIZED

STOP at Gate 3. No Sync, Archive, Knowledge Consolidation or release/deployment action.
