# Implementation Plan — Platform Admin Formalités Template Authority Foundation

Change: platform-admin-formalites-template-authority-foundation

Schema: yuta-spec-driven

Plan review status: APPROVED

Apply authorization: GRANTED_BOUNDED

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-06T22:25:50.1711847+02:00

Approved pre-Apply tasks SHA-256:
`3725abb4d5a294573d151d24cfe7265d9c16b0eedae8a9ba5463ea8ac98e2b78`.

Gate 2b đã được current user approve. Lượt này chỉ tạo Tasks, Implementation
Plan và các embedded Technical Implementation Contracts; chưa authorize Apply,
không sửa implementation và không tạo Gate 3.

## Approved prerequisites

[Gate 1](../../../docs/reviews/platform-admin-formalites-template-authority-foundation/01-analysis-review.md),
[Gate 2](../../../docs/reviews/platform-admin-formalites-template-authority-foundation/02-specs-review.md)
và [Gate 2b](../../../docs/reviews/platform-admin-formalites-template-authority-foundation/02b-design-review.md)
đều `APPROVED`. Exact reviewed artifact path-set và SHA-256 đã được recompute
trước khi tạo plan:

| Artifact                                                                        | Approved SHA-256                                                   |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `proposal.md`                                                                   | `ef4ce308839aa02bf15f89254bce366a65fe115c35eeec04da367ffcfc7efa91` |
| `analysis.md`                                                                   | `6f39ed1cb07ccc2b1db66c7cad920d97c01e4183d23bcbad5783c419dc3ec73b` |
| `design.md`                                                                     | `c165a8ae8b21f78dd33dbd12d634bf52e9cf6acd65d4385e36ce5656981fd07d` |
| `specs/authorization/platform-admin-formalites-template-administration/spec.md` | `c2ff7c618b2d050f0fa259f2e01d226870446638c1138a9cf2a7cd0a6bb45dfb` |

Gate 2b packet sau approval có SHA-256
`b18dd0e7e9423d906950beed2a25e3b3839b57304e0084c9f753d065e1c36c25`.
Design applicability là `REQUIRED`; Sensitive Design đã được approve và không
có unresolved Open Question làm thay đổi build scope.

## Execution boundary and pre-Apply baseline

Repository: `D:\working\yuta\yuta-resto`.

Planning HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.

Chỉ ba phases cần thiết: `Foundation / Data`, `Service / Domain`, rồi
`Integration / Regression`. `Foundation / Data` ở đây chỉ là portable auth
foundation; không có database, schema, migration hoặc persistence work. Không
có UI / Components hoặc Interaction / States phase.

Intended implementation path-set:

| Path                                                                  | Planning baseline / allowed change                                                                                         |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `packages/auth/src/formalites-template-system-authorization.ts`       | `ABSENT`; tạo capability-specific closed operation/context/grant module theo D1–D2/D4.                                     |
| `packages/auth/src/session.ts`                                        | Clean; SHA-256 `b071a6ef4e568c8c9e2e3328443a667f1c2b122908395fc5acc99af39c1f2392`; chỉ D3/D5 service composition/refactor. |
| `packages/auth/src/index.ts`                                          | Clean; SHA-256 `e190bdcbab32bf61f485f5665d6f6f3007e3cd3e0b09bb9e7b8d74ba16ddb82f`; chỉ bounded named exports.              |
| `packages/auth/test/formalites-template-system-authorization.test.ts` | `ABSENT`; tạo focused executable evidence theo D6.                                                                         |
| `packages/auth/test/session.test.ts`                                  | Clean; SHA-256 `457fb52af3c72cb79b8b1f0367b4164cc14bca25b026de59d1ad63c30cecc867`; regression source, read-only mặc định.  |

Không đổi `packages/auth/package.json`, dependencies, `@yuta/contracts`,
`@yuta/tenant`, `@yuta/db-cloud`, Backoffice, `apps/platform-admin`, schema,
API, UI hoặc runtime. Nếu implementation cần path khác ngoài change-local
review/verification evidence, phải chứng minh path đó vẫn nằm trong approved
Design; nếu tạo capability/runtime/authority mới thì STOP.

Ngay trước Apply phải recheck Git status, HEAD và hashes của intended existing
files. Nếu có overlapping user work không thể cô lập an toàn thì STOP; không
overwrite, restore, format hoặc stage phần việc đó.

## Mandatory scope and knowledge stop conditions

- Chỉ năm exact operations trong approved Spec; không wildcard, prefix grant,
  implication, inheritance, caller-provided policy hoặc blanket
  `YUTA_ADMIN = all`.
- `YUTA_SUPPORT`, null system role và restaurant membership roles không nhận
  operation nào; không thêm principal/system role/permission family.
- Không dùng, extend, import hoặc fabricate `TenantContext`; không merge/fallback
  system authority với tenant authority và không sửa Backoffice session.
- Không tạo `apps/platform-admin` runtime/UI, template resource, persistence,
  schema, repository, API, lifecycle side effect hoặc legal-review evidence.
- Không generation, PDF/DOCX/HTML, signature, Documents handoff, provider,
  production configuration, deployment hoặc enablement.
- Apply/Verify chỉ được cập nhật change-local artifacts/review evidence. Không
  sửa hoặc promote canonical Product Knowledge, `docs/CURRENT_STATE.md`,
  `docs/MODULE_REGISTRY.md`, lifecycle hoặc current architecture summaries.
  Canonical reconciliation chỉ xảy ra sau Gate 3 → finish → authorized Sync →
  strict Main Spec validation → Archive, qua reviewed Knowledge Consolidation.
- Nếu cần thay approved operation identifiers, grant semantics, actor model,
  audit contract, runtime owner hoặc Design D1–D7 thì STOP và return Control
  Tower; không sửa Specs/Design để làm implementation thuận tiện.

## 1. Foundation / Data

### TECHNICAL IMPLEMENTATION CONTRACT

Boundary: portable, capability-specific system authorization primitives; không
có data/persistence boundary. Canonical technical owner: `@yuta/auth`.
Formalités giữ semantic ownership của template operations.

Instructions và authorities đã consult:
[root AGENTS](../../../AGENTS.md),
[auth AGENTS](../../../packages/auth/AGENTS.md),
[Authority Model](../../../docs/AUTHORITY_MODEL.md),
[Authentication](../../../docs/architecture/AUTHENTICATION.md),
[Identity and Membership](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md),
[Tenancy](../../../docs/architecture/TENANCY.md),
[Database Boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md),
[approved Design](design.md) và
[approved delta Spec](specs/authorization/platform-admin-formalites-template-administration/spec.md).

Applicable contract:

- F1 — Define đúng năm literals: `formalites.template.read`,
  `formalites.template.draft.manage`, `formalites.template.review.submit`,
  `formalites.template.publish`, `formalites.template.retire`; không extra,
  wildcard, prefix matching hoặc implication. Spec + D2.
- F2 — Exhaustive explicit grant map dùng existing `SystemRole` keys:
  `YUTA_ADMIN` có đúng năm operations; `YUTA_SUPPORT` là empty readonly array.
  Không generic policy factory hoặc runtime-configurable grants. D2.
- F3 — Pure validation/grant helpers deny unsupported runtime input; không
  fallback sang role-only check, tenant permission hoặc caller-provided grant.
  Spec fail-closed requirements + D2.
- F4 — Immutable minimized context có đúng `actorUserId`, exact
  `systemRole: YUTA_ADMIN`, exact operation và
  `resourceScope: GLOBAL_YUTA_FORMALITES_TEMPLATES`; không tenant/resource data.
  D4.
- F5 — TypeScript strict, named exports, no `any`; module không import
  persistence, framework, HTTP/UI, provider adapter, environment hoặc
  `@yuta/tenant`. Root/auth instructions.
- F6 — Không schema, migration, database object, template content/version,
  legal evidence hoặc lifecycle side effect. Approved scope + D1/D4.

Intended file: `packages/auth/src/formalites-template-system-authorization.ts`.

Targeted checks: `pnpm --filter @yuta/auth typecheck`, focused auth tests ở
phase 3 và source/import review.

Completion evidence: exact scoped diff/hash, operation/grant/context tests và
F1–F6 rows trong later Technical Compliance Matrix. File existence một mình
không hoàn thành contract.

### Implementation tasks

- [x] 1.1 Tạo closed operation catalog và operation type với đúng năm identifiers; verify catalog test chứng minh exact length/content, uniqueness và unknown/prefix/wildcard values không được công nhận.
- [x] 1.2 Tạo exhaustive readonly `SystemRole` grant map và pure exact-operation authorization helpers; verify parameterized tests chứng minh `YUTA_ADMIN` chỉ có năm grants, `YUTA_SUPPORT` có zero grants và không operation inheritance.
- [x] 1.3 Tạo immutable minimized GLOBAL YUTA Formalités authorization context contract; verify type/runtime assertions cho đúng bốn authority fields, không tenant/membership/resource payload và auth typecheck PASS.

## 2. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT

Boundary: trusted internal-user resolution và exact system-operation decision
trong existing provider-neutral `createAuthService`. Canonical owner:
`@yuta/auth`; không tạo app/runtime/session owner mới.

Instructions/authorities: root/auth AGENTS và authorization/runtime sources ở
phase 1; thêm current `packages/auth/src/session.ts`, existing
`packages/auth/test/session.test.ts`, approved Design D3–D5 và all fail-closed,
tenant-isolation, audit requirements trong delta Spec.

Applicable contract:

- S1 — Reuse injected `AuthAdapter` và `InternalUserLookupPort`; resolve trusted
  identity/stored role/status, không nhận prebuilt user, browser role/grant,
  session cookie, organization, establishment, membership hoặc entitlement.
- S2 — Private discriminated resolution giữ exact existing behavior:
  `getCurrentUser`, `requireUser`, `requireSystemRole` return/error and event
  semantics không regress. D3.
- S3 — Capability-specific method đánh giá theo thứ tự trusted active user →
  closed operation → explicit grant → minimized context/deny; mọi prerequisite
  thiếu đều không trả partial context. Spec + D3.
- S4 — `AuthSecurityLogger.warn` chỉ được mở rộng bằng optional normalized
  operation metadata tương thích callers; every denial phát stable bounded
  event/reason attribution theo D5, không log arbitrary object/payload.
- S5 — Audit signal không chứa credentials, email, token, tenant data, template
  content hoặc legal evidence; success chỉ return attribution context, không
  persistent success event hoặc lifecycle action. Auth instructions + D5.
- S6 — Existing `requireSystemRole` không bị biến thành blanket Platform Admin
  grant. System context không implement/extend `TenantContext`, không bypass
  tenant guards và không sửa Backoffice authentication/session architecture.
- S7 — Public exports chỉ là capability-specific named API cần thiết; không
  generic platform-admin framework, new contract package hoặc breaking export.

Intended files: `packages/auth/src/session.ts` và `packages/auth/src/index.ts`.

Targeted checks: auth focused/full tests, auth typecheck, public-export review và
architecture check.

Completion evidence: existing session regression results, exact denial/audit
assertions, scoped source diff/hash và S1–S7 Technical Compliance Matrix rows.

### Implementation tasks

- [x] 2.1 Refactor internal active-user resolution thành private discriminated result dùng chung mà không đổi public behavior; verify existing `session.test.ts` và focused absent/not-found/disabled/active cases PASS với exact errors/events.
- [x] 2.2 Mở rộng logger metadata tương thích và thêm capability-specific `requireFormalitesTemplateSystemOperation(rawOperation)` theo exact resolution/validation/grant order; verify every denial reason, safe operation normalization, actor attribution và no partial context bằng focused tests.
- [x] 2.3 Return đúng minimized context cho mỗi allowed `YUTA_ADMIN` operation và export chỉ bounded named API; verify no template/resource side effect, no tenant/framework/persistence import, auth typecheck và public-export inspection PASS.

## 3. Integration / Regression

### TECHNICAL IMPLEMENTATION CONTRACT

Boundary: executable contract/regression evidence cho portable auth package và
repository architecture; không có browser, database hoặc live runtime QA.
Canonical owners: `@yuta/auth` cho tests, change review path cho verification
evidence.

Instructions/authorities: all phase 1–2 sources; thêm
[YUTA automated workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md),
[QA protocol](../../../docs/YUTA_QA_PROTOCOL.md),
[OpenSpec activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md)
và [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md).

Applicable contract:

- R1 — Tests use real `createAuthService` with in-memory adapter/lookup ports;
  không database, browser, Next.js, fabricated `TenantContext`, mock tenant
  grant hoặc production hook. D6.
- R2 — Cover exact catalog, all five admin allows, all five support denials,
  operation independence, null role, missing identity, unknown user, disabled
  admin, malformed/unknown operation, context minimization và audit metadata.
- R3 — Prove tenant non-bypass structurally and behaviorally: no auth-to-tenant
  dependency/context shape, restaurant membership cannot create global grant,
  global context cannot satisfy tenant authority. Không sửa tenant package.
- R4 — Prove authorization has no template lifecycle, persistence, file,
  provider, legal evidence hoặc success-side-effect behavior through source
  dependency review and focused assertions.
- R5 — Preserve all existing auth tests and typecheck; architecture check must
  pass. Broader failures must be reported with exact attribution, not fixed
  outside scope.
- R6 — `UI_AFFECTING: NO`, `BROWSER_QA_REQUIRED: NO`; QA may be
  `NOT_APPLICABLE` only after confirming no runtime/user-facing dimension was
  introduced. VERIFY must not claim UI, deployment or Production Readiness.
- R7 — Verification records exact commands/results, scenario mapping, scoped
  implementation diff including untracked files, and F1–F6/S1–S7/R1–R7
  Technical Compliance Matrix. Gate 3 only when compliance and VERIFY PASS.
- R8 — During Apply/Verify, canonical Product Knowledge, CURRENT_STATE,
  MODULE_REGISTRY, lifecycle and architecture summaries remain unchanged;
  change-local evidence cannot claim readiness or lifecycle completion.

Intended test file:
`packages/auth/test/formalites-template-system-authorization.test.ts`.
`packages/auth/test/session.test.ts` is regression evidence and remains
read-only unless an approved-behavior regression cannot be expressed in the
focused file; any proposed edit must be clean and remain strictly within D3/D6.

Required commands after explicit Apply authorization:

- `pnpm --filter @yuta/auth test`;
- `pnpm --filter @yuta/auth typecheck`;
- `pnpm docs:check`;
- `pnpm architecture:check`;
- `pnpm -r --if-present typecheck`;
- `pnpm format:check` plus scoped Prettier/diff checks when unrelated findings
  prevent a repository-wide PASS;
- `pnpm exec openspec validate "platform-admin-formalites-template-authority-foundation" --strict --json`.

No build command is defined or required for `@yuta/auth`; không invent build.
`pnpm test:cloud` được đánh giá theo risk sau focused PASS và phải report nếu
không chạy. Local/POS tests và Browser QA không áp dụng cho portable auth-only
change này.

Completion evidence: focused/full auth results, repository check exits, exact
scenario-to-test mapping, scoped diff/path-set/hash, Technical Compliance
Matrix và truthful QA classification.

### Implementation and verification tasks

- [x] 3.1 Tạo focused test suite bằng real auth service/in-memory ports cho operation catalog, grant matrix, all allow/deny prerequisites, safe audit attribution và exact minimized context; verify every approved Spec scenario có explicit test mapping hoặc structural evidence.
- [x] 3.2 Chạy auth regression suite/typecheck và inspect dependency/export graph; verify existing public auth behavior giữ nguyên, không tenant/database/framework import, no lifecycle side effect và no general Platform Admin surface.
- [x] 3.3 Chạy strict OpenSpec, docs, architecture, recursive typecheck và formatting/scoped diff checks; record exact PASS/FAIL/skipped/unrelated outcomes, không sửa canonical Knowledge hoặc unrelated checkout findings.
- [x] 3.4 Lập requirement/scenario mapping và Technical Compliance Matrix F1–F6/S1–S7/R1–R8 từ exact implementation/test/check evidence; mark `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` và `VERIFY: PASS` chỉ khi mọi applicable row pass, không unresolved critical issue.
- [x] 3.5 Confirm `UI_AFFECTING: NO`, `BROWSER_QA_REQUIRED: NO` và no runtime/user-facing QA dimension; record truthful `QA: NOT_APPLICABLE` without UI/deployment/readiness claim, hoặc STOP nếu implementation tạo runtime/QA need ngoài Design.
- [x] 3.6 Chỉ sau compliance/VERIFY PASS và valid QA classification, tạo `03-final-review.md` với current planning hashes, completed task count, scenario mapping, implementation/verify evidence hashes, exact scoped diff và `Sync authorization: PENDING`; verify packet ready rồi STOP tại Gate 3, không sync/archive/deploy.

### Apply and VERIFY checkpoint — 2026-09-06

12/12 tasks complete trong exact approved three-phase scope. Source
implementation chỉ gồm bốn intended auth paths; `session.test.ts` và mọi path
ngoài allowlist giữ nguyên. Focused/full auth tests đạt 40/40; `test:cloud`, auth
typecheck, recursive typecheck, docs, architecture, strict OpenSpec và scoped
format/diff checks PASS.

[VERIFY evidence and complete F1–F6/S1–S7/R1–R8 matrix](../../../docs/reviews/platform-admin-formalites-template-authority-foundation/verify-evidence.md)
ghi `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`, `VERIFY: PASS`,
`UI_AFFECTING: NO`, `BROWSER_QA_REQUIRED: NO`, `QA: NOT_APPLICABLE`.
Canonical scoped implementation diff nằm tại
[03-implementation.diff](../../../docs/reviews/platform-admin-formalites-template-authority-foundation/03-implementation.diff).

Global `pnpm format:check` vẫn exit 1 với đúng 70 pre-existing/out-of-scope
findings; không finding nào thuộc implementation/change paths và không global
format write nào chạy. Không sửa canonical Knowledge/architecture/lifecycle,
không build vì `@yuta/auth` không có build script, không database/browser/
deployment/production operation. Gate 3 packet được tạo ngay sau khi hash exact
current Tasks/evidence; `Sync authorization` giữ `PENDING`.

## Plan review checkpoint

Plan scope: 12 unchecked tasks, ba implementation phases, mỗi phase có embedded
Technical Implementation Contract. Không task nào được đánh dấu complete trong
lượt planning này.

Review requested: exact `tasks.md`, phase order, intended path-set, F/S/R
contracts, verification commands, non-browser QA classification và mandatory
STOP conditions. Gate 2b approval không tự cấp Apply authorization.

Không tạo standalone Implementation Plan/TIC artifact, implementation file,
QA placeholder hoặc Gate 3 packet. Apply chỉ được bắt đầu sau current-user
instruction phê duyệt exact plan và authorize bounded implementation/Verify.

## Planning verification record

Các checks dưới đây chỉ validate planning artifacts và current repository
baseline; chúng không phải implementation VERIFY:

| Command / check                                                                                                                                                                | Result                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `openspec instructions tasks --change "platform-admin-formalites-template-authority-foundation" --json`                                                                        | Exit 0; output path/dependencies/template được resolve từ schema hiện tại trước khi tạo Tasks.                                            |
| `openspec status --change "platform-admin-formalites-template-authority-foundation" --json`                                                                                    | Exit 0; 5/5 planning artifacts `done`, `isPlanningComplete: true`; raw status không cấp Apply authorization.                              |
| `pnpm exec openspec validate "platform-admin-formalites-template-authority-foundation" --strict --json`                                                                        | Exit 0; 1 change passed, 0 failed, 0 issues.                                                                                              |
| `pnpm exec prettier --check "openspec/changes/platform-admin-formalites-template-authority-foundation" "docs/reviews/platform-admin-formalites-template-authority-foundation"` | Exit 0; all scoped planning/review files use Prettier style.                                                                              |
| `pnpm docs:check`                                                                                                                                                              | Exit 0; documentation consistency passed for 36 current documents.                                                                        |
| `pnpm architecture:check`                                                                                                                                                      | Exit 0; runtime imports, database URLs, client boundaries and migration baselines valid.                                                  |
| `pnpm -r --if-present typecheck`                                                                                                                                               | Exit 0; all 15 participating workspace projects passed.                                                                                   |
| `pnpm format:check`                                                                                                                                                            | Exit 1; 70 pre-existing/out-of-scope files reported, including canonical Knowledge and unrelated review/archive files; none were changed. |
| SHA-256/path-set/checkbox inspection                                                                                                                                           | PASS; Proposal/Analysis/Specs/Design intact, Gate 1/2/2b approved, intended auth paths clean, 0/12 tasks complete, 3 embedded TICs.       |

Không chạy auth tests/build/Browser QA vì chưa có implementation và Apply chưa
được authorize. `@yuta/auth` không có build script. Không sửa canonical
Knowledge để xử lý global formatting findings.

Tracked working-tree diff fingerprint trước/sau planning giữ
`cd7113ba5ba5279a05e12f49a22063ae1b62c8fa`; staged fingerprint giữ
`e69de29bb2d1d6434b8b29ae775ad8c2e48c5391`. Hai fingerprint này không bao
phủ untracked change artifacts; các artifact được kiểm bằng exact SHA-256 và
scoped formatting riêng.
