# Implementation Plan — Pointage Authority and Access Foundation

Change: pointage-authority-and-access-foundation

Schema: yuta-spec-driven

Plan review status: APPROVED

Apply authorization: GRANTED

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

## Approved prerequisites

[Gate 1](../../../docs/reviews/pointage-authority-and-access-foundation/01-analysis-review.md),
[Gate 2](../../../docs/reviews/pointage-authority-and-access-foundation/02-specs-review.md)
và [Gate 2b](../../../docs/reviews/pointage-authority-and-access-foundation/02b-design-review.md)
đã được current user duyệt. Exact path sets và hashes được recompute trước khi
tạo plan này.

| Artifact                                      | Approved SHA-256                                                   |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `analysis.md`                                 | `fe06a094fb0b3772cbcd2b1ca8b222055ad96f2f00e54c06451e1b7adb40f0ed` |
| `design.md`                                   | `27537f0287bfec6c5ad6d211e143fdbec6a11ccb0e60fff04ae7dd9c32371dfa` |
| `proposal.md`                                 | `900e2c99c7f88d655a02ddc4b58d2dc5a61c140b1dea29319546d84458627494` |
| `specs/authorization/pointage/spec.md`        | `55b550bb449d2fd2c342bb91d328b82c8cc5658252fa460c02de39fcddfd4058` |
| `specs/pointage/authority-foundation/spec.md` | `3d5dce5f6ed6149655cd29f2fc046b39801e2e3a86376b57abf78cee942cb613` |
| Gate 1 approval packet                        | `0bd04c07e4f1f3967e2155b7b7ed0c0a45194f7f85127f2b31b4c4fd55ebd548` |
| Gate 2 approval packet                        | `6a983e23c34f945389b66550c39e892918ea0a2ea61a870e90dbd65236abe32c` |
| Gate 2b approval packet                       | `f92ec7ea482c33633770f7986898b426e59dbf114870267740296bc4a5c4fddd` |

Design applicability: `REQUIRED` và approved. Ba phase dưới đây là minimum
coherent set từ repository reality: Foundation / Data sở hữu crypto và durable
state; Service / Domain sở hữu trusted Backoffice composition; Integration /
Regression chứng minh các boundary kết hợp. Không có UI / Components hoặc
Interaction / States vì foundation không tạo visible UI, route handler hoặc
browser transport.

## Execution boundary and pre-Apply recheck

Repository: `D:\working\yuta\yuta-resto`.

Planning HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.

Apply được current user cấp lúc `2026-09-06T23:48:25+02:00` cho đúng ba phase và
22 task trong plan có SHA-256 trước Apply
`f0bd02c4ad4dd6e57935ec5204d5879acf71948bb447bcd597e3669252323022`.
Pre-Apply đã recompute toàn bộ approved hashes, lấy fresh scoped Git status và
xác nhận mọi intended file sạch hoặc có thể cô lập chính xác.
`packages/auth/src/index.ts` hiện dirty do unrelated Formalités export, SHA-256
`f435cc08b5151437621b6cd5fda61715b0760451631bff3d1b8fd39316cb5ce7`;
không được overwrite, revert hoặc hấp thụ thay đổi đó. Nếu không thể thêm bounded
Pointage export mà giữ nguyên hunk hiện hữu, STOP trước Apply.

Primary planned implementation paths:

- `packages/auth/src/pointage-credential.ts`, bounded export in
  `packages/auth/src/index.ts`, và `packages/auth/test/pointage-credential.test.ts`;
- `packages/db-cloud/src/schema/pointage.ts`, bounded exports in schema/root
  indexes, `packages/db-cloud/src/pointage-repository.ts`, focused unit/integration
  tests, next generated `packages/db-cloud/drizzle/0019_*.sql`, matching snapshot
  và journal entry;
- new server-only modules under `apps/backoffice/src/server/pointage/` và focused
  tests under `apps/backoffice/test/`;
- a bounded current-architecture update in
  `docs/architecture/AUTHENTICATION.md` only if implementation evidence exists.

Không sửa Pointage placeholder UI, navigation, browser contracts, Personnel
schema/permissions, POS/Site Agent/db-pos, Planning, Today hoặc lifecycle records.
Không tạo raw clock-event table, usable clocking transport, seed/backfill,
production provider hoặc production enablement.

### Mandatory stop conditions

- Approval/hash/path-set drift hoặc thiếu explicit Apply authorization.
- Cần production default client-address provider, direct forwarded-header trust,
  `unknown-client`/candidate-only fallback hoặc một deployment authority chưa
  được separately reviewed.
- Cần standalone credential revoke/suspend/invalidate, upcoming issuance rule,
  historical employee self-service, global employee identity hoặc authority alias.
- Cần raw evidence workflow/table, destructive data mutation, new runtime/app,
  browser API/UI, local/offline/sync hoặc cross-runtime dependency.
- Cần đổi sáu-operation catalog, approved crypto/rate policy, Personnel lifecycle
  semantics, tenancy owner hoặc repository boundary.
- Generated migration khác approved additive three-table design, sửa deployed
  migration, hoặc disposable target không được xác minh an toàn.
- Intended dirty path không thể tách khỏi unrelated work. Không cleanup, restore,
  stage hoặc normalize user work để tiếp tục.

## 1. Foundation / Data

### TECHNICAL IMPLEMENTATION CONTRACT

Boundary: portable Pointage credential cryptography và additive cloud persistence.
Canonical owners: `@yuta/auth` cho crypto primitives; `@yuta/db-cloud` cho schema,
migration, repositories, transactions, distributed limiter và audit writes.

Instructions và authorities đã consult:
[root AGENTS](../../../AGENTS.md),
[auth AGENTS](../../../packages/auth/AGENTS.md),
[db-cloud AGENTS](../../../packages/db-cloud/AGENTS.md),
[Authority Model](../../../docs/AUTHORITY_MODEL.md),
[Authentication](../../../docs/architecture/AUTHENTICATION.md),
[Tenancy](../../../docs/architecture/TENANCY.md),
[Database Boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md),
[Local Development](../../../docs/operations/LOCAL_DEVELOPMENT.md),
[Personnel](../../../docs/features/personnel/README.md),
[approved Design](design.md) và hai approved delta Specs.

Applicable contract:

- F1 — `@yuta/auth` remains environment/persistence/framework neutral; exact
  eight ASCII digits generated by Node CSPRNG, no caller-selected secret.
- F2 — A valid minimum-32-byte `POINTAGE_AUTH_SECRET` derives versioned lookup,
  verifier-pepper, rate-limit and dummy keys with HKDF-SHA-256 label separation;
  no fallback to `AUTH_SECRET`, POS secret or unkeyed hashing.
- F3 — Lookup uses scoped HMAC-SHA-256; verifier uses random 16-byte salt,
  peppered scrypt `N=32768,r=8,p=1,maxmem=64 MiB`, 32-byte output and
  constant-time comparison; exactly one real or dummy scrypt path per candidate.
- F4 — Plaintext, keys, pepper, verifier input/material, lookup/client digests and
  raw address never enter logs, audit, repository reads or durable plaintext.
- F5 — `@yuta/db-cloud` owns exactly three additive tables from D4, with composite
  organization/establishment/dossier constraints, historical digest uniqueness,
  one active credential, positive versions and consistent supersede fields.
- F6 — Every repository query carries trusted organization + establishment and,
  where applicable, dossier scope; resource-ID-only lookup and row-as-transport
  exports are forbidden.
- F7 — Issue/reset, supersede and required success audit are transactional;
  distributed candidate/client counters are atomic. No raw-evidence schema,
  cleanup/retention job, standalone invalidation or seed/backfill.
- F8 — Migration is generated and journaled after schema changes, reviewed as
  SQL and applied only to a verified disposable database for this phase.

Intended files: auth Pointage module/export/test; db-cloud Pointage schema,
repository, bounded indexes, unit/integration tests, generated `0019` migration,
snapshot and journal. No contracts package or browser/server framework import in
auth/db-cloud layers.

Required targeted checks: auth tests/typecheck; db-cloud schema/repository tests
and typecheck; generated SQL review; guarded integration suite with
`YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true` and a loopback explicitly named
disposable `CLOUD_DATABASE_URL`; clean-database `db:migrate`; architecture check.

Completion evidence: exact source/migration diff, migration journal/snapshot,
clean disposable apply result, crypto vectors/negative tests, schema constraint
assertions, scoped repository results and F1–F8 rows in the later Technical
Compliance Matrix.

### Implementation tasks

- [x] 1.1 Implement the `@yuta/auth` Pointage module for strict eight-ASCII-digit normalization and zero-padded `crypto.randomInt(0, 100_000_000)` generation; verify deterministic boundary tests reject Unicode/separators/caller values and generated samples always match the exact format.
- [x] 1.2 Implement validated secret decoding, four versioned HKDF-SHA-256 derivations, scoped lookup/rate HMACs, salted+peppered scrypt and constant-time real/dummy verification; verify auth tests cover key separation, scope separation, exact parameters, unsupported versions, wrong credentials, dummy parity and absence of plaintext/derived secret output.
- [x] 1.3 Add exactly the three approved Pointage tables and composite constraints/indexes in `@yuta/db-cloud`; verify schema tests cover parent/dossier isolation, historical digest uniqueness, single-active and dossier/version uniqueness, supersede consistency, rate key kind and audit minimization with no raw-evidence table.
- [x] 1.4 Generate the next Drizzle migration and matching journal/snapshot from the reviewed schema, without editing existing migrations; verify SQL diff contains only the three Pointage tables and approved constraints/indexes, with no seed, backfill, destructive production down operation or unrelated schema change.
- [x] 1.5 Implement the typed Pointage repository surface for active slug scope resolution, scoped candidate lookup, atomic limiter evaluation/update, append-only minimized audit and transaction ports; verify unit/integration tests deny wrong organization/establishment/dossier and resource-ID-only access and never return repository rows as transport contracts.
- [x] 1.6 Implement transactional issue/reset persistence with locked current-dossier decision, unique-constraint collision retry support, monotonic versions and atomic old-row supersede/audit effects; verify concurrent repository tests allow at most one current credential, rollback all partial effects and never expose plaintext from repository reads.
- [x] 1.7 Apply migrations `0000` through the new migration to a verified clean disposable PostgreSQL target and run guarded schema/repository integration tests without skips; verify clean apply, constraints, rollback-on-failure, exact target safety and no mutation of persistent development/production data.

## 2. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT

Boundary: server-only Pointage authority, credential lifecycle and validation
composition inside the existing Backoffice cloud application. Canonical owner:
`apps/backoffice/src/server/pointage`; it consumes `@yuta/auth`,
`@yuta/db-cloud` and trusted existing session/tenant primitives without creating
a browser route, API or new runtime.

Instructions và authorities đã consult:
[root AGENTS](../../../AGENTS.md),
[Backoffice AGENTS](../../../apps/backoffice/AGENTS.md),
[auth AGENTS](../../../packages/auth/AGENTS.md),
[db-cloud AGENTS](../../../packages/db-cloud/AGENTS.md),
[Authority Model](../../../docs/AUTHORITY_MODEL.md),
[Authentication](../../../docs/architecture/AUTHENTICATION.md),
[Tenancy](../../../docs/architecture/TENANCY.md),
[Personnel](../../../docs/features/personnel/README.md),
[Production Readiness](../../../docs/operations/PRODUCTION_READINESS.md),
[approved Design](design.md) và approved delta Specs.

Applicable contract:

- S1 — The operation catalog is closed to exactly three employee and three
  manager operations from D9; unknown/wildcard operations fail closed.
- S2 — `VerifiedPointageCredential` is identity proof only and remains distinct
  from immutable single-operation `PointageEmployeeContext`; manager context is
  built only from a validated active matching tenant membership.
- S3 — OWNER/MANAGER receive only the three dedicated establishment Pointage
  grants; STAFF receives none. Personnel permissions, POS PIN and cloud-user
  authentication never alias or union with Pointage authority.
- S4 — Public slug is an untrusted locator; the server resolves active
  organization + establishment scope on every request and browser IDs/headers
  cannot override it.
- S5 — `TrustedPointageClientAddressProvider` is a required injected boundary.
  No production default exists; missing/null/untrusted provenance fails before
  credential normalization/lookup. Direct `Forwarded`, `X-Forwarded-For` and
  `X-Real-IP` reads, shared unknown-client bucket and candidate-only fallback are
  forbidden. Tests may inject a deterministic provider only.
- S6 — Validation preserves D6 order, generic/non-enumerating public outcomes,
  exactly one real/dummy scrypt and both distributed limiter policies: candidate
  5/15m then 15m block; verified client/scope 30/15m then 15m block.
- S7 — Personnel eligibility runs after credential proof and before context for
  identify, state.read and operation.create using trusted establishment date;
  entry/final day inclusive, upcoming/former fail closed, no historical self-service.
- S8 — Issue/reset require exact manager grants and scoped dossier existence but
  do not invent upcoming issuance policy; collision retries stop at ten, commit
  precedes one-time plaintext result, reset atomically supersedes old credential.
- S9 — Audit uses only the D11 allowlisted events/reasons and minimized fields;
  failures produce no partial authority, plaintext, local acceptance or replay.

Intended files: new named-export modules under
`apps/backoffice/src/server/pointage/` plus focused Backoffice tests. Existing
Pointage page, navigation, actions, route handlers, contracts and UI files remain
untouched.

Required targeted checks: focused Backoffice Pointage unit/service tests,
Backoffice typecheck/test/build, auth and db-cloud focused tests, architecture
check and no-forbidden-import/header/static inventory checks.

Completion evidence: exact six-operation/grant matrix tests, immutable context
tests, public scope and provider fail-closed tests, lifecycle/collision/audit
transaction results, eligibility date matrix and S1–S9 rows in the later
Technical Compliance Matrix.

### Implementation tasks

- [x] 2.1 Add the exact six-operation catalog, typed dedicated grants and immutable single-operation employee/manager context factories; verify unknown operations and context reuse fail closed, STAFF has no grant, and OWNER/MANAGER scope cannot authorize another establishment.
- [x] 2.2 Compose manager authority from the existing validated Backoffice session and active matching `TenantContext` only; verify suspended/missing/wrong-scope membership, browser role/scope claims, Personnel permission, POS identity and system/cloud-user role aliases cannot create Pointage manager authority.
- [x] 2.3 Compose `PointageEntryScope` from normalized establishment slug through active organization/establishment repository resolution on every credential request; verify unknown/inactive/mismatched parent returns one generic result and submitted organization/establishment IDs cannot override trusted scope.
- [x] 2.4 Define and require `TrustedPointageClientAddressProvider` at Pointage validator composition with no production default; verify missing, null or untrusted provenance refuses composition before credential processing, forwarded headers are never read directly, and only deterministic test injection can reach validation tests.
- [x] 2.5 Implement non-enumerating credential validation in the approved order with client and candidate distributed limits, exactly one real/dummy verification and generic invalid/try-later outcomes; verify unknown, wrong-scope, malformed, unsupported, superseded and throttled candidates do not reveal existence or produce employee context.
- [x] 2.6 Implement manager issue and reset/regeneration commands with exact grants, ten-attempt collision bound and one-time plaintext result only after successful repository commit; verify reset never becomes issue, old credential is rejected, audit/supersede is atomic, failure returns no plaintext and no retrieve/revoke/suspend operation exists.
- [x] 2.7 Implement the Personnel employment-period guard for identify, state.read and operation.create before employee-context creation; verify upcoming, entry day, active, final departure day and former cases for all three operations, trusted timezone/date derivation, no browser backdate and no eligibility check in issue/reset.
- [x] 2.8 Implement minimized audit attribution and generic cloud/database/secret failure mapping without logs containing credential or derived material; verify the exact event/reason allowlists, unknown-candidate non-attribution, no audit reader/visibility endpoint and no accepted local/offline/replay state.

## 3. Integration / Regression

### TECHNICAL IMPLEMENTATION CONTRACT

Boundary: cross-package proof that the approved security, tenancy, Personnel and
cloud-only foundation behaves coherently without becoming a usable Pointage
product. Canonical owners remain auth, db-cloud and Backoffice; this phase owns
integration/regression tests, current documentation and Apply-completion
evidence, not formal VERIFY, QA, Gate 3 review evidence or new runtime behavior.

Instructions và authorities: all phase 1/2 sources plus
[QA Protocol](../../../docs/YUTA_QA_PROTOCOL.md),
[Automated Change Workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md),
[review protocol](../../../docs/reviews/README.md) và repository validation
commands in root AGENTS.

Applicable contract:

- R1 — Focused and guarded integration tests use a verified disposable cloud DB,
  real schema/repository transactions, independent clients and synthetic scoped
  fixtures; skipped suites are not PASS.
- R2 — Cross-organization, cross-establishment and cross-dossier attempts fail
  closed for scope resolution, credential lookup, lifecycle, employee operations,
  manager reads and audits.
- R3 — Controlled concurrency proves collision handling, simultaneous issue/reset,
  one current version, atomic supersede/audit and old-credential rejection; no
  sleep/stress-only proof or unsafe production hook.
- R4 — Security regression covers both distributed limits, generic responses,
  dummy/real path, secret/log minimization and trusted-address fail-closed before
  credential processing.
- R5 — Inventory/diff tests prove no raw-evidence table/workflow, transport/UI,
  Personnel/POS authorization alias, `@yuta/db-pos`, Site Agent, offline cache,
  sync or local replay dependency.
- R6 — Production readiness stays blocked by retention, deletion/anonymization,
  legal hold, backup-retention, employee notice, detailed audit visibility and
  trusted production client-address provenance. Tests and migration do not
  promote lifecycle, environment, deployment or readiness.
- R7 — `UI_AFFECTING: NO`, `BROWSER_QA_REQUIRED: NO`; because no visible UI,
  browser transport or usable runtime consumer is created. Phase 3 does not
  evaluate or record QA status; applicability is inspected separately only after
  formal VERIFY.

Intended files: focused auth/db-cloud/Backoffice tests, bounded current
`AUTHENTICATION.md` update and Apply-completion evidence only. No formal VERIFY,
QA/Gate 3 artifact, screenshots, page pack, QA UI artifact or runtime endpoint.

Required targeted commands after explicit Apply authorization:

- `pnpm --filter @yuta/auth test` and `pnpm --filter @yuta/auth typecheck`;
- `pnpm --filter @yuta/db-cloud test`, `pnpm --filter @yuta/db-cloud typecheck`
  and focused guarded Pointage integration tests against the disposable target;
- `pnpm --filter @yuta/backoffice test`,
  `pnpm --filter @yuta/backoffice typecheck` and
  `pnpm --filter @yuta/backoffice build`;
- `pnpm test:cloud`, `pnpm build:cloud`, `pnpm docs:check`,
  `pnpm architecture:check`, `pnpm -r --if-present typecheck`, scoped Prettier,
  `git diff --check` and strict OpenSpec validation;
- deterministic forbidden-file/import/header/operation inventory and exact
  scoped diff/hash checks. `pnpm test:local` is out of scope for this cloud-only
  foundation unless an unexpected local dependency appears, which is a STOP.

Apply-completion evidence: preliminary scenario-to-code/test mapping, exact
commands/exits, generated-migration/disposable-DB proof and exact scoped
changed-file list/diff inputs for subsequent formal VERIFY. Phase completion
MUST NOT declare `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`, `VERIFY: PASS`, a
QA status or Gate 3 readiness.

### Implementation and integration/regression tasks

- [x] 3.1 Build the guarded disposable-DB Pointage fixture and focused integration suite with synthetic organizations, establishments, Personnel dossiers, OWNER/MANAGER/STAFF actors and independent clients; verify target safety, migrations, cleanup and that no suite is skipped.
- [x] 3.2 Cover full tenant isolation and authorization composition across issue, reset, candidate lookup, all three employee operations, establishment read and audit writes; verify wrong organization/establishment/dossier, STAFF, missing/suspended membership and browser authority claims always fail closed.
- [x] 3.3 Add controlled collision and concurrency coverage for issue–issue, issue–reset and reset–reset plus transaction/audit fault injection; verify at most one current credential, monotonic version, exact rollback, old credential rejection and no plaintext before commit or after failed delivery.
- [x] 3.4 Add security regression for eight-digit/HKDF/scrypt behavior, candidate and verified-client limits, successful candidate reset semantics, dummy path, generic responses, missing provider/secret and forbidden forwarded-header fallback; verify persisted counters/audits are minimized and raw credential/address material is absent.
- [x] 3.5 Add lifecycle matrix tests for identify, state.read and operation.create on pre-entry, entry, active, final-day and post-departure dates, plus issue/reset independence; verify credential proof alone never creates authority and no historical/upcoming policy is invented.
- [x] 3.6 Add negative inventory/regression assertions and bounded architecture documentation for the implemented foundation; verify no raw event, UI/API/transport, Planning/HS-HC/absence/holiday/benefit/payroll/PDF, POS/Site Agent/offline/sync, production provider/default or lifecycle/readiness promotion is introduced.
- [x] 3.7 Run the focused and broader implementation-completion commands listed in this phase, review generated SQL and exact scoped diff, and collect preliminary scenario/code/test, migration/disposable-DB, command/result, deviation and F1–F8/S1–S9/R1–R7 evidence inputs; verify every included Apply task has concrete completion evidence while making no formal Technical Implementation Compliance, VERIFY, QA or Gate 3 declaration.

### Scenario traceability

| Approved requirement / Design boundary                                     | Primary planned tasks          |
| -------------------------------------------------------------------------- | ------------------------------ |
| Dedicated protected credential and lifecycle                               | 1.1–1.2, 1.6, 2.5–2.6, 3.3–3.4 |
| Additive scoped persistence, limiter and minimized audit                   | 1.3–1.7, 2.8, 3.1–3.4          |
| Trusted establishment and dossier isolation                                | 1.5–1.6, 2.2–2.3, 3.1–3.2      |
| Employee self-only contexts and Personnel lifecycle eligibility            | 2.1, 2.5, 2.7, 3.2, 3.5        |
| Exact manager grants and STAFF/no-alias denial                             | 2.1–2.2, 2.6, 3.2              |
| Trusted client-address provenance and two distributed limits               | 1.5, 2.4–2.5, 3.4              |
| Cloud/online-only and explicit non-scope                                   | 2.8, 3.6–3.7                   |
| Legal/Privacy and trusted-provenance production blockers remain unresolved | 3.6–3.7                        |

### Preserved production blockers

Implementation and technical tests MUST NOT clear or weaken:

- exact retention duration;
- deletion/anonymization execution;
- legal hold;
- backup-retention interaction;
- employee notice wording;
- detailed audit visibility; và
- trusted production client-address provenance and its separately reviewed
  platform/proxy contract.

Without approved trusted production address provenance, Pointage credential
validation remains impossible to instantiate/enable in production by design.
The additive foundation may be implemented and verified while Production
Readiness remains blocked.

## POST-APPLY VERIFY PLAN

Section này là plan cho formal VERIFY sau khi toàn bộ Apply tasks hoàn tất; nó
không phải Apply checkbox và không pre-record kết quả. Formal VERIFY phải dùng
current generated `openspec-verify-change` workflow cùng repository checks và
tạo evidence riêng trước QA.

Formal VERIFY MUST:

1. Xây Technical Compliance Matrix cho từng rule F1–F8, S1–S9 và R1–R7 theo
   format `constraint -> authoritative source -> affected implementation ->
test/check/evidence -> PASS | FAIL`; không có empty hoặc assumed-PASS row.
2. Map mọi approved Spec requirement/scenario và Design decision applicable tới
   exact code path và test/evidence; báo thiếu coverage hoặc behavior deviation
   thay vì suy completion từ checkbox.
3. Recompute approved planning hashes/path sets, build exact change-scoped diff
   gồm tracked và untracked implementation files, review attribution/forbidden
   scope và hash exact diff bytes.
4. Verify generated migration/journal/snapshot, reviewed SQL, clean disposable-DB
   migration apply, schema/repository isolation, concurrency, rollback và no-skip
   integration results.
5. Record exact focused và broader commands, environment guards, exit results,
   skipped/failed checks và limits; planning or Apply command results không được
   relabel thành formal VERIFY evidence.
6. Record every deviation from approved Specs/Design/contracts, unresolved issue
   và blocker, including dirty-file attribution and production-readiness gates.
7. Evaluate and record `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` only when all
   applicable F/S/R matrix rows pass; otherwise record the honest FAIL/blocker.
8. Evaluate and record `VERIFY: PASS` only when approved Specs/Design match the
   current implementation, Technical Implementation Compliance is PASS and no
   unresolved critical issue remains; otherwise stop before QA.

Expected formal VERIFY inputs include auth/db-cloud/Backoffice focused results,
`pnpm test:cloud`, `pnpm build:cloud`, docs/architecture/recursive typecheck,
strict OpenSpec validation, scoped formatting/diff checks, migration proof and
the exact Apply-completion evidence collected by task 3.7. These are planned
inputs only until Apply completes and current bytes are inspected.

## QA PLAN

Current expected applicability:

```text
UI_AFFECTING: NO
BROWSER_QA_REQUIRED: NO
Expected QA status: NOT_APPLICABLE only if the final implemented diff still has no visible/browser/runtime-consumer QA dimension.
```

QA occurs only after formal VERIFY completes honestly. Do not pre-record
`QA: NOT_APPLICABLE` as PASS. After VERIFY, inspect the final implementation diff
against `docs/YUTA_QA_PROTOCOL.md` and record one honest QA status. If visible UI,
browser transport or another runtime-consumer QA dimension appears, the expected
classification is invalid: STOP and return to the applicable planning/review
boundary rather than waive QA or manufacture evidence.

## GATE 3 CREATION BOUNDARY

`03-final-review.md` may be created only after all four conditions are true:

1. Apply is complete;
2. Technical Implementation Compliance has been formally evaluated;
3. formal VERIFY is complete; và
4. QA has been evaluated separately with an honest final status.

Gate 3 then follows the workflow packet protocol and may claim readiness only
when its required Technical Compliance, VERIFY and QA conditions are satisfied.
No Apply checkbox creates, prepares or approves Gate 3. No deploy, production
enablement, sync/archive or lifecycle promotion is authorized by this plan.

### Historical plan review checkpoint

Tại planning review, plan có 22 unchecked Apply tasks trong đúng ba phase, mỗi
phase có embedded Technical Implementation Contract. Đoạn này là historical
record trước approval; trạng thái Apply hiện tại được ghi riêng bên dưới.

Post-Apply formal VERIFY, QA and Gate 3 creation are separate sequential plans,
not Implementation / Apply tasks.

Review request: approve the exact phase set, intended paths, contracts, commands,
evidence and STOP conditions, then grant Apply separately if desired. Gate 2b
approval and CLI readiness do not authorize implementation.

### Planning verification record

Các checks này chỉ xác nhận planning artifacts và current repository baseline;
chúng không phải implementation, migration proof, technical VERIFY hoặc QA.

| Command / check                                                                                                                     | Result                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `openspec status --change pointage-authority-and-access-foundation --json`                                                          | Exit 0 trước Tasks; schema `yuta-spec-driven`, `tasks` là artifact duy nhất còn thiếu.                                             |
| `openspec instructions tasks --change pointage-authority-and-access-foundation --json`                                              | Exit 0; approved Specs và Design là completed dependencies; output path là exact `tasks.md`.                                       |
| `openspec validate pointage-authority-and-access-foundation --type change --strict --json --no-interactive`                         | Exit 0; one change passed, zero failed, zero issues.                                                                               |
| `pnpm docs:check`                                                                                                                   | Exit 0; 36 current documents consistent.                                                                                           |
| `pnpm architecture:check`                                                                                                           | Exit 0; runtime imports, database URLs, client boundaries and migration baselines valid.                                           |
| `pnpm -r --if-present typecheck`                                                                                                    | Exit 0; all 15 participating workspace projects passed.                                                                            |
| `pnpm format:check`                                                                                                                 | Exit 1; 67 pre-existing/out-of-scope files reported, không sửa hoặc absorb vào change.                                             |
| Scoped Prettier, SHA-256/path-set, exact embedded Design, checkbox/phase/TIC inventory, relative-link and `git diff --check` checks | Phải PASS ở final planning check; current Gate hashes phải giữ nguyên và plan phải có 22 unchecked Apply tasks / 3 phase / 3 TICs. |

Không chạy package tests/builds, migration generation/apply, database/container,
runtime mutation, Browser QA, deploy, production enablement, sync hoặc archive trong
lượt planning này.

Exact approval and separate Apply authorization needed next:

```text
$yuta-run-change pointage-authority-and-access-foundation
Tasks and implementation plan approved. Apply the three approved phases, then Verify and perform the planned non-browser QA applicability assessment. Do not deploy, enable production, sync or archive.
```

### Apply completion record

Current user đã cấp bounded Apply. Cả 22/22 tasks trong đúng ba approved phase đã
hoàn tất. Record này chỉ là Apply-completion evidence; chưa phải formal Technical
Implementation Compliance, VERIFY, QA hoặc Gate 3 decision.

| Apply evidence                                     | Result                                                                                                                                                                                                                                                                          |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@yuta/auth` focused/full tests và typecheck       | Exit 0; 5 files / 45 tests full, focused Pointage 5 tests; exact 8-digit, HKDF/HMAC/scrypt/dummy boundaries covered.                                                                                                                                                            |
| `@yuta/db-cloud` focused schema tests và typecheck | Exit 0; 3 focused schema tests; package typecheck passed.                                                                                                                                                                                                                       |
| Guarded Pointage disposable-DB integration         | Exit 0, 8/8 tests, no skip, against loopback database `yuta_pointage_foundation_test_apply` in isolated PostgreSQL 17 tmpfs container; migrations `0000` through generated `0019` cleanly applied; container stopped and tmpfs discarded afterward.                             |
| `@yuta/backoffice` full tests và typecheck         | Exit 0; 97 files passed, 1 unrelated guarded suite skipped, 538 tests passed; typecheck passed.                                                                                                                                                                                 |
| `pnpm test:cloud`                                  | Exit 0 across auth/core/contracts/booking/booking-web/tenant/db-cloud/backoffice. Guarded repo-wide integration suites remained skipped by their normal opt-in; Pointage no-skip result is recorded separately above.                                                           |
| `pnpm build:cloud`                                 | Exit 0 for web, backoffice, booking-web and feedback-web. Existing `/equipe/pointage` placeholder remained unchanged; no new Pointage route/transport was created.                                                                                                              |
| `pnpm docs:check` / `pnpm architecture:check`      | Exit 0; 36 current documents consistent; runtime/database/client/migration boundaries passed.                                                                                                                                                                                   |
| `pnpm -r --if-present typecheck`                   | Exit 0; all 15 participating workspace projects passed.                                                                                                                                                                                                                         |
| Strict OpenSpec validation                         | Exit 0; change valid.                                                                                                                                                                                                                                                           |
| Scoped Prettier / `git diff --check`               | Scoped Prettier passed; repository tracked diff check exited 0. Global `pnpm format:check` still exits 1 on the same 67 pre-existing/out-of-scope files listed in the planning baseline; none were reformatted or absorbed.                                                     |
| Generated migration review                         | `0019_pointage_authority_foundation.sql` contains exactly three `CREATE TABLE` statements for credential versions, distributed rate limits and minimized audit plus approved additive constraints/indexes; no seed, backfill, DML, raw-evidence table or destructive statement. |
| Dirty-file isolation                               | Existing Formalités export in `packages/auth/src/index.ts` remains byte-for-byte present; Apply adds only the independent Pointage export. No unrelated dirty file was restored, staged, normalized or edited.                                                                  |

During disposable migration proof, the first generated `0019` exposed ordering of
a self-scope FK before its supporting unique index. Trước khi có successful clean
apply, source schema was corrected to express the same approved scope uniqueness
as an inline unique constraint; only the newly generated, uncommitted `0019`
artifact was regenerated. Two subsequent clean disposable applies and focused
integration runs passed. Đây là resolved implementation deviation, không đổi
approved behavior hoặc migration number, và phải được re-evaluate independently
trong formal VERIFY.

Apply giữ nguyên toàn bộ production blockers: retention,
deletion/anonymization, legal hold, backup-retention interaction, employee notice,
detailed audit visibility và trusted production client-address provenance. Không
deploy, production enablement, sync, archive hoặc lifecycle promotion đã xảy ra.
