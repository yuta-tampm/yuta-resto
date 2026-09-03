# Tasks / Implementation Plan

Change: `restaurant-knowledge-validated-knowledge`

```text
UI_AFFECTING: YES
BROWSER_QA_REQUIRED: YES
SENSITIVE_CHANGE: YES
SENSITIVE_DESIGN_GATE: APPROVED
APPLY_AUTHORIZATION: GRANTED
STOP_BEFORE_APPLY: NO
```

`tasks.md` là repository-supported Tasks / Implementation Plan artifact duy
nhất cho change này; current OpenSpec schema không yêu cầu một Implementation
Plan file riêng.

Năm phase đều cần thiết theo approved Design:

1. Foundation / Data;
2. Service / Domain;
3. UI / Components;
4. Interaction / States;
5. Integration / Regression.

Lifecycle giữ nguyên: Product Decision `APPROVED`, Implementation là current
repository-authoritative state, Environment `NOT_ENABLED`, Production Readiness
`NOT_ASSESSED`, External Dependency `NOT_ASSESSED`.

Không phase nào được thêm dependency với Establishment Profile, Carte & menus,
Personnel/Salariés, Planning, Pointage, Reservations, Stock, Suppliers,
Tasks/Today, AI, Reviews, Marketing, YUTA Assistant, website answers, staff
assistant, POS, Site Agent, Display hoặc external providers. Không thêm shared
contract, API, cross-module lookup, event, job, consumer hook, sync path hoặc
cross-runtime persistence. Nếu dependency, permission, tenancy hoặc owner như
vậy trở thành technically required, dừng với `CROSS_MODULE / NEEDS REVIEW`.

## 1. Foundation / Data

### TECHNICAL IMPLEMENTATION CONTRACT — Foundation / Data

**Purpose:** tạo deterministic pre-Apply attribution trước mọi implementation
edit, sau đó bổ sung exact dedicated collection table và additive migration
trong canonical cloud persistence boundary.

**Boundary / canonical owner:** Restaurant Knowledge sở hữu capability;
semantic scope là establishment; Organization chỉ là tenancy/access envelope;
`@yuta/db-cloud` sở hữu schema và persistence.

**Authorities:** root `AGENTS.md`, `packages/db-cloud/AGENTS.md`,
`docs/architecture/DATABASE_BOUNDARIES.md`, `docs/architecture/TENANCY.md`,
approved Proposal/Analysis/Spec/Design, current Drizzle config, migration SQL,
snapshot inventory và `_journal.json`.

**Exact intended repository paths:** shared write allowlist gồm đúng 14 paths:

1. `packages/db-cloud/src/schema/restaurant-knowledge.ts`;
2. `packages/db-cloud/src/restaurant-knowledge-repository.ts`;
3. `packages/db-cloud/test/schema.test.ts`;
4. `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`;
5. `packages/db-cloud/drizzle/meta/_journal.json`;
6. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`;
7. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`;
8. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`;
9. `apps/backoffice/test/restaurant-knowledge-loader.test.ts`;
10. `docs/ui/pages/establishment-general-information/README.md`;
11. `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`;
12. `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`;
13. `docs/ui/pages/establishment-general-information/UI_SPEC.md`;
14. `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`.

**Shared existing files for this phase:** paths 1–5 của allowlist. Paths 2 và 4
cũng thuộc Service/Domain; mọi shared file dùng một saved pre-Apply byte
baseline xuyên suốt các phase.

**Intended new non-migration files:** năm paths phải được record `MISSING` trước
Apply:

- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/validated-knowledge-model.ts`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/validated-knowledge-section.tsx`;
- `apps/backoffice/test/validated-knowledge-action.test.ts`;
- `apps/backoffice/test/validated-knowledge-model.test.ts`;
- `apps/backoffice/test/validated-knowledge-section.test.tsx`.

New migration SQL/snapshot chỉ được xác định sau immediate pre-Apply journal
recheck. Nếu terminal journal vẫn là
`0015_restaurant_knowledge_communication_identity`, expected `MISSING` paths
là:

- `packages/db-cloud/drizzle/0016_restaurant_knowledge_validated_items.sql`;
- `packages/db-cloud/drizzle/meta/0016_snapshot.json`.

Nếu terminal journal/inventory khác, dừng và reconcile exact migration paths
trước edit. Future evidence paths dưới
`docs/reviews/restaurant-knowledge-validated-knowledge/` cũng phải được record
`MISSING` trước khi tạo, nhưng không thuộc five new implementation/test paths.

**Allowed dependencies:** current Drizzle/PostgreSQL tooling, db-cloud schema
primitives, `establishments` composite scope, `uuid` UUIDv7 helper và guarded
disposable PostgreSQL test infrastructure.

**Prohibited dependencies:** generic JSON/key-value store; semantic/text
uniqueness; category/tag/order/score/confidence/status/source/validated-by/
version/timestamp/history/provenance columns; cross-module FK; database
whitespace CHECK; cross-runtime database access; new API/shared contract; mọi
global prohibited dependency.

**Authorization / tenant invariants:** scope columns chỉ đến từ trusted
`TenantContext`; composite organization + establishment boundary được giữ;
browser organization/establishment/membership/role/permission/ownership không
bao giờ là authority.

**Data / state invariants:** table
`restaurant_knowledge_validated_items` có đúng bốn columns:
`organization_id UUID NOT NULL`, `establishment_id UUID NOT NULL`,
`id UUID NOT NULL`, `statement TEXT NOT NULL`; composite PK
`(organization_id, establishment_id, id)`; composite FK
`(organization_id, establishment_id) -> establishments(organization_id, id)`
với `ON DELETE RESTRICT`; không backfill và không alter/delete existing
Restaurant Knowledge data.

**Required tests / checks:** baseline manifest integrity; exact schema unit
assertions; generated SQL/snapshot/journal review; full blank-to-current
migration chain trên guarded disposable PostgreSQL; db-cloud typecheck/tests;
`pnpm architecture:check`.

**Stop conditions:** Apply chưa được explicit authorize; implementation edit
xảy ra trước baseline; intended shared path thiếu baseline; new path không được
record `MISSING`; unexpected status/hash drift; protected unrelated path đổi;
journal không còn terminal 0015 nhưng vẫn generate 0016; migration alter,
backfill hoặc drop existing data; schema có extra column/constraint/FK/owner.

**Completion evidence:** pre-Apply manifest ghi exact HEAD, sorted status, 14
shared paths, exact baseline bytes/lowercase SHA-256, five new non-migration
paths và intended evidence paths là `MISSING`, current journal/migration
inventory và hashes của mọi unrelated dirty path (bao gồm
`apps/yuta-pos/next-env.d.ts` nếu vẫn present); reviewed migration; passing
schema/full-chain evidence; out-of-allowlist files byte-identical.

- [x] 1.1 Ngay sau explicit Apply approval và trước mọi implementation edit, capture exact HEAD, sorted `git status --short`, final 14-path shared allowlist, exact baseline bytes + lowercase SHA-256, five new implementation/test paths và intended evidence paths là `MISSING`, current migration inventory, cùng hashes của mọi dirty path ngoài allowlist; verify manifest tái tạo được mọi saved baseline byte và stop on drift.
- [x] 1.2 Re-read current Drizzle journal/SQL/snapshot inventory; chỉ nếu terminal vẫn là `0015_restaurant_knowledge_communication_identity` mới chọn conditional 0016 paths, nếu không stop/reconcile exact next migration paths trước edit.
- [x] 1.3 Bổ sung exact four-column `restaurant_knowledge_validated_items` schema với approved composite PK/FK và `ON DELETE RESTRICT`; verify focused schema tests chứng minh types/nullability/constraints và absence của mọi prohibited column, uniqueness, whitespace CHECK hoặc cross-module FK.
- [x] 1.4 Generate additive migration bằng repository Drizzle tooling, rồi review SQL/snapshot/journal để verify chỉ create approved table/constraints, không backfill, alter/drop existing data hoặc destructive rollback.
- [x] 1.5 Chạy complete blank-to-current migration chain trên guarded disposable PostgreSQL và verify table/PK/FK/delete restriction tồn tại trong khi mọi earlier migrations/tables vẫn intact; record exact command, environment guard và result.

## 2. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT — Service / Domain

**Purpose:** cung cấp item-scoped tenant-safe list/create/update/remove,
server-authoritative non-blank validation và READ/MANAGE ordering mà không tạo
whole-list mutation hoặc authorization mới.

**Boundary / canonical owner:** `@yuta/db-cloud` sở hữu repository persistence;
Backoffice route sở hữu loader/actions; existing auth/session/tenant helpers
giữ authority; Restaurant Knowledge giữ canonical ownership.

**Authorities:** root và nested AGENTS, `docs/architecture/TENANCY.md`,
`docs/architecture/AUTHENTICATION.md`,
`docs/architecture/IDENTITY_AND_MEMBERSHIP.md`, normative Restaurant Knowledge
authorization spec, approved Spec và Design Decisions 2–9.

**Exact intended repository paths:**

- shared: `packages/db-cloud/src/restaurant-knowledge-repository.ts`;
- shared: `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`;
- shared: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`;
- shared: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`;
- shared: `apps/backoffice/test/restaurant-knowledge-loader.test.ts`;
- new: `apps/backoffice/test/validated-knowledge-action.test.ts`.

**Shared existing files:** năm shared paths trên, dùng exact baseline từ task
1.1.

**Intended new files:** chỉ
`apps/backoffice/test/validated-knowledge-action.test.ts` trong phase này.

**Allowed dependencies:** trusted `TenantContext`, `requireEstablishment`,
current Restaurant Knowledge permission helpers, page-local server actions,
route-local Zod schemas, `@yuta/db-cloud`, server-side UUIDv7 generation và
Next route revalidation.

**Prohibited dependencies:** browser scope/role/permission authority;
item-ID-only lookup/mutation; whole-list replace/upsert; client-generated
canonical ID; Profile permission substitution; generic form parser/shared
contract; trim; database-only or UI-only validation; cross-module lookup;
global prohibited dependencies.

**Authorization / tenant invariants:** READ phải pass trước list repository
call; no READ cho zero validated-knowledge reads. Create/update/remove re-derive
trusted context, require active establishment và MANAGE trước parse/persistence.
OWNER và MANAGER success; STAFF denied; Profile permission không substitute;
denied/invalid paths có zero persistence và zero success revalidation. Không
claim hoặc invent một production READ-without-MANAGE principal.

**Data / state invariants:** canonical item là `{ id, statement }`; `id` là
opaque server-generated UUIDv7. List order ascending UUIDv7 `id` chỉ là
technical deterministic order. Mọi get/update/delete predicate dùng
organization + establishment + item ID. Create verifies scoped establishment,
generates ID server-side và inserts one item. Update/delete zero-match trả
not-found và không upsert/recreate. Delete là physical scoped delete.

Create/update chỉ accept statement có ít nhất một non-whitespace character.
Exact empty, spaces-only và newline/tab/space-only đều invalid. Accepted
`"abc"`, `" abc "`, `"  a  "` được giữ exact bytes/chars, không trim. Blank
không bao giờ thành null/remove/delete/cancel/no-op success.

**Required tests / checks:** guarded repository integration cho zero/one/many,
deterministic list, server UUIDv7, create/update/delete/not-found, tenant and ID
isolation, unrelated-item concurrency, stale edit-after-delete và same-item
last-successful-write-wins; loader ordering/non-call tests; action tests cho
OWNER/MANAGER/STAFF, Profile non-substitution, MANAGE-before-parse, exact
non-blank cases, client-validation bypass, zero mutation/revalidation on
failure và content-safe errors.

**Stop conditions:** permission/role/principal mới; browser authority lọt vào
repository; missing tenant predicate; READ/MANAGE check sau repository/parse;
whole-list save; upsert on update; trim/extra Product validation; blank maps to
delete/null/success; shared contract/API hoặc prohibited dependency.

**Completion evidence:** passing focused repository/loader/action tests;
mock call-order/non-call assertions; disposable tenant-isolation and concurrency
results; source-to-Spec mapping; unchanged production permission/grant matrix;
no descriptive statement in logs/errors.

- [x] 2.1 Bổ sung internal validated-item projection và list operation trong `@yuta/db-cloud`; verify `requireEstablishment`, both tenant predicates, zero/one/multiple results và ascending UUIDv7 technical order bằng guarded integration tests.
- [x] 2.2 Bổ sung create operation generate opaque UUIDv7 server-side và insert exactly one scoped item; verify returned canonical item, accepted exact surrounding whitespace, no browser draft key/ID authority và no unrelated-row mutation.
- [x] 2.3 Bổ sung scoped update operation dùng organization + establishment + item ID, không upsert; verify canonical response, exact text preservation, same-item last-successful-write-wins và zero-match/cross-scope IDs return not-found without recreation.
- [x] 2.4 Bổ sung physical scoped remove dùng đủ three-part identity; verify exact matched row only, unrelated items survive, stale update after remove fails, blank edit không gọi remove và `ON DELETE RESTRICT` vẫn giữ establishment boundary.
- [x] 2.5 Bổ sung repository isolation/concurrency coverage cho wrong organization, wrong establishment, mismatched pair, foreign item ID, concurrent create C/edit A/remove B và deterministic reread; verify no leak, no whole-list replacement và no unrelated lost update.
- [x] 2.6 Bổ sung page loader enforce Restaurant Knowledge READ before repository list và derive MANAGE independently; verify OWNER/MANAGER load, STAFF denial with zero reads và Establishment Profile permission không substitute.
- [x] 2.7 Bổ sung separate create/update/remove page-local actions: re-derive tenant, require establishment và MANAGE before parsing; validate server-side non-whitespace create/update before repository; verify exact empty, spaces-only và newline/tab/space-only rejection, accepted surrounding whitespace unchanged, blank edit preserves canonical row, denied/invalid paths call zero repository mutations and no success revalidation, remove remains explicit, and fake scope/role/permission fields are ignored as authority.

## 3. UI / Components

### TECHNICAL IMPLEMENTATION CONTRACT — UI / Components

**Purpose:** thêm independent `Connaissances validées` section sau năm current
Restaurant Knowledge slices, hiển thị zero/one/multiple items và chỉ expose
item-scoped controls khi MANAGE.

**Boundary / canonical owner:** route-local Backoffice presentation; canonical
items vẫn thuộc Restaurant Knowledge; `@yuta/ui` chỉ cung cấp reusable
domain-neutral primitives.

**Authorities:** root và `apps/backoffice/AGENTS.md`,
`docs/ui/YUTA_FRONTEND_RULES.md`, `docs/ui/BACKOFFICE_FRONTEND_RULES.md`, current
`docs/ui/pages/establishment-general-information/` page pack, approved Spec và
Design Decision 10.

**Exact intended repository paths:**

- shared: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`;
- new: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/validated-knowledge-model.ts`;
- new: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/validated-knowledge-section.tsx`;
- new: `apps/backoffice/test/validated-knowledge-model.test.ts`;
- new: `apps/backoffice/test/validated-knowledge-section.test.tsx`.

**Shared existing files:** `page.tsx`, patched only from task 1.1 baseline.

**Intended new files:** model, section và two focused test files listed above;
model/state behavior continues in Interaction/States.

**Allowed dependencies:** current React/Next route patterns, `@yuta/ui`,
`lucide-react`, page-local actions/model, server canonical items và
authorization-derived `canManage`.

**Prohibited dependencies:** fixture replacement; client authorization as
enforcement; new UI/state/validation framework; business logic in `@yuta/ui`;
giant catch-all textarea; category/tag/reorder/priority; candidate/source/
confidence/history/provenance; AI/suggestion; downstream consumer controls;
global prohibited dependencies.

**Authorization / tenant invariants:** no READ means loader returns no section
projection and page renders no section. `canManage=false` renders only current
items/valid empty state with no add/edit/remove/save. MANAGE renders exact
item-scoped controls. UI false-state là presentation test, không phải evidence
của một invented production READ-only principal.

**Data / state invariants:** title exact `Connaissances validées`; statement là
single independently addressable text value per item; zero-item state valid;
one add draft maximum per explicit add action; each saved item has independent
edit/remove/save state; no whole-list save, bulk edit/delete, reorder hoặc
autosave. Section follows Identité de communication; Profile và all five
existing knowledge sections keep independent data/forms/actions.

**Required tests / checks:** exact heading/field/accessibility; zero/one/many
render; READ-only presentation; MANAGE add/edit/pending-remove/undo/save;
item-scoped controls; page order/composition; Backoffice typecheck/build.

**Stop conditions:** extra Product field/control; section merges/replaces an
existing form; Profile permission/data required; fixture/client auth path;
whole-list control; new shared abstraction/framework; cross-section mutation
hoặc prohibited dependency.

**Completion evidence:** passing model/section/page tests; accessible labels
and names; source review proving route-local boundary, exact ordering and
unchanged real page auth/data/mutations.

- [x] 3.1 Tạo page-local model exposing only canonical `{ id, statement }`, local item draft/baseline/pending state và browser-only draft key shape; verify no category/tag/order/score/confidence/status/source/provenance/history/consumer fields.
- [x] 3.2 Tạo `Connaissances validées` section với valid no-item state và zero/one/multiple canonical item rendering; verify exact heading, accessible statement label/name, keyboard reachability, visible-focus-compatible controls và no horizontal-overflow-inducing layout.
- [x] 3.3 Implement MANAGE presentation cho explicit add, independent edit, pending remove, undo và exact item-scoped save controls; verify no whole-list save, bulk operation, autosave, reorder, AI/provenance control hoặc second canonical identity source.
- [x] 3.4 Implement non-MANAGE presentation chỉ render current list/empty state và no add/edit/remove/save controls; verify component behavior without claiming a new production READ-only role/principal.
- [x] 3.5 Compose READ-gated section after Identité de communication from real loader data; verify Establishment Profile, Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture và Identité de communication retain existing independent props/actions/order and no fixture replaces authenticated persisted data.

## 4. Interaction / States

### TECHNICAL IMPLEMENTATION CONTRACT — Interaction / States

**Purpose:** implement independent browser drafts, explicit item-scoped
create/update/remove, canonical reconciliation và recoverable operation-local
states without autosave or remount-only correctness.

**Boundary / canonical owner:** drafts/pending removal are browser-local until
MANAGE-gated server success; accepted canonical items remain server-owned
Restaurant Knowledge state.

**Authorities:** approved Design Decisions 4–10, Backoffice frontend rules,
page-pack interaction/accessibility requirements và approved delta Spec.

**Exact intended repository paths:**

- shared: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`;
- shared: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx` only when server refresh composition requires it;
- new: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/validated-knowledge-model.ts`;
- new: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/validated-knowledge-section.tsx`;
- new: `apps/backoffice/test/validated-knowledge-action.test.ts`;
- new: `apps/backoffice/test/validated-knowledge-model.test.ts`;
- new: `apps/backoffice/test/validated-knowledge-section.test.tsx`.

**Shared existing files:** `actions.ts` và conditional page composition from
task 1.1 baseline.

**Intended new files:** model/section/action/model/section test paths listed
above.

**Allowed dependencies:** pure route-local state helpers, React local state,
current action-state/form-status patterns, page-local actions, canonical
server responses, `@yuta/ui` status/alert primitives và `lucide-react`.

**Prohibited dependencies:** local draft key as server ID; key/remount-only
reconciliation; whole-list compare/save; optimistic canonical persistence;
change/blur/effect/timer/background persistence; trim; extra length/format/
language/duplicate/taxonomy validation; blank-to-remove conversion; global
prohibited dependencies.

**Authorization / tenant invariants:** only MANAGE presentation can invoke
mutations; server remains final authority; UI state carries no trusted tenant,
role, permission or ownership fact.

**Data / state invariants:** explicit add creates a local draft only. Successful
create replaces browser draft key with server `{ id, statement }`; successful
update replaces only that item's accepted baseline; successful remove drops
only that item. Failed operations preserve current draft/pending-removal state
and canonical baseline. Revalidation may refresh data but correctness does not
depend solely on remount/key change. Same-item successful writes follow last
successful write; unrelated items never change.

Client validation may disable invalid create/update and show
`Saisissez une connaissance contenant au moins un caractère autre qu’un espace.`
but server enforcement is mandatory. Invalid draft remains visible/editable;
blank edit does not toggle remove. Success uses semantic status, error uses
semantic alert, pending is visually and accessibly observable when capturable.

**Required tests / checks:** pure non-whitespace predicate cases; local draft
key isolation; create/update/remove reconciliation without remount; exact
surrounding whitespace; rejected draft/canonical separation; pending/success/
error/retry; distinct item independence; no mutation from render/change/blur/
effect/timer/background; accessible validation association.

**Stop conditions:** trim/transformation; blank becomes delete/null/no-op;
failed draft lost; canonical baseline changes on failure; local key sent as ID;
unrelated item changes; reconciliation needs remount; whole-list submit;
autosave/optimistic persistence; inaccessible feedback; additional Product
validation.

**Completion evidence:** passing model/section/action state tests for every
approved blank/non-blank scenario, reconciliation and separate remove; source
scan for forbidden persistence triggers; accessible pending/status/alert and
recovery evidence.

- [x] 4.1 Implement a pure contains-non-whitespace predicate without trim; verify `''`, spaces-only and newline/tab/space-only are invalid while `"abc"`, `" abc "` and `"  a  "` are valid and preserved exactly.
- [x] 4.2 Implement explicit add as browser-only draft with a local key never forwarded as canonical ID; verify no repository/action invocation occurs on add, render, typing, blur, effect, timer or background activity.
- [x] 4.3 Implement create success/failure reconciliation; verify success replaces only the local draft with returned server item without remount dependence, while invalid/server failure preserves editable draft and creates no accepted item.
- [x] 4.4 Implement independent existing-item edit baselines; verify update success replaces only that item's canonical baseline, exact surrounding whitespace survives, blank rejection leaves previous canonical statement unchanged and pending draft visible, and unrelated items remain byte-identical in client state.
- [x] 4.5 Implement pending remove plus undo and separate explicit remove save; verify marking blank never enters remove, undo performs zero mutation, success removes only matched item, and failure/not-found retains recoverable pending state without recreating the item.
- [x] 4.6 Implement operation-local pending/success/error/retry and field-associated French validation; verify observable semantic status/alert, accessible names/focus behavior, item controls disabled only as appropriate, client bypass still receives server rejection, and no successful revalidation occurs on denied/invalid/failed paths.

## 5. Integration / Regression

### TECHNICAL IMPLEMENTATION CONTRACT — Integration / Regression

**Purpose:** giữ page-pack implementation documentation chính xác, chạy
technical VERIFY/regressions, produce Technical Compliance Matrix và
deterministic attribution, thực hiện mandatory real Browser QA, rồi chỉ tạo
Gate 3 packet khi mọi required dimension PASS.

**Boundary / canonical owner:** integration/evidence only; không tạo runtime,
owner, permission, shared contract hoặc downstream consumer mới. Technical
VERIFY và Browser QA là separate evidence dimensions.

**Authorities:** root instructions, `docs/AUTHORITY_MODEL.md`, current Product
Knowledge/Module Registry read-only context, `docs/YUTA_QA_PROTOCOL.md`,
OpenSpec apply/verify workflow, current page pack, approved planning artifacts
và review packets.

**Exact intended repository paths:** implementation-facing page-pack write
targets chỉ gồm, và chỉ khi cần để mô tả exact implemented page behavior:

- `docs/ui/pages/establishment-general-information/README.md`;
- `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`;
- `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`;
- `docs/ui/pages/establishment-general-information/UI_SPEC.md`;
- `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`.

Read-only during Apply/VERIFY:

- `docs/PRODUCT_KNOWLEDGE.md`;
- `docs/MODULE_REGISTRY.md`;
- `docs/features/establishment/README.md`;
- `docs/features/establishment/general-information/README.md`;
- `docs/reviews/README.md`.

**Shared existing files:** five conditional page-pack write targets above, from
task 1.1 baseline. Product Knowledge, Module Registry, feature authority docs
và review index remain protected read-only paths.

**Intended new files:** future evidence dưới
`docs/reviews/restaurant-knowledge-validated-knowledge/`:

- pre-Apply manifest và exact baseline copies created only after explicit Apply approval;
- `03-verify-evidence.md`;
- `03-implementation.diff`;
- `03-migration.diff`;
- `qa/QA_REPORT.md`;
- `qa/screenshot-manifest.md`;
- actual real-browser screenshots;
- `03-final-review.md` only after compliance, VERIFY và mandatory QA PASS.

**Allowed dependencies:** repository-supported test/build/typecheck/docs/
architecture/format tools, OpenSpec apply/verify workflows, guarded disposable
PostgreSQL, real authenticated local Backoffice environment và approved browser
QA tooling.

**Prohibited dependencies:** Product Knowledge/Module Registry/feature authority
or review-index Apply writes; fixture/fake persistence replacing real route;
fabricated grants/principals/errors/screenshots; deliberate environment damage;
deployment/environment/readiness promotion; raw HEAD attribution; global
prohibited dependencies.

**Authorization / tenant invariants:** automated evidence must cover
OWNER/MANAGER success, STAFF READ denial with zero repository access and no
Profile substitution. OWNER and MANAGER real-browser scenarios are mandatory.
Real Browser QA must check whether an existing safe STAFF or other actual
Restaurant-Knowledge-no-access principal is available without changing the
accepted production grants, roles or permissions. If available, authenticate
as that principal, identify it truthfully and verify the section plus mutation
controls are absent. If unavailable, record
`NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT` and cite focused loader/
authorization evidence for READ denial and zero repository access. Never
fabricate or relabel a principal; `canManage=false` remains component-only
presentation evidence.

**Data / state invariants:** VERIFY maps all Spec requirements/scenarios and
five contracts to exact code/tests. Gate 3 implementation diff comes from saved
baseline to current bytes, includes every changed shared path plus every new
non-migration file as `/dev/null -> current`, excludes migration and unrelated
dirty files, declares exact path list/count equal to actual `diff --git`
sections and passes apply/reverse integrity. Migration diff contains exact new
SQL, new snapshot and baseline-to-current journal with the same count/integrity
rules.

**Required tests / checks:** focused db-cloud/backoffice tests; guarded
integration/migration chain; relevant cloud suite; `pnpm docs:check`;
`pnpm architecture:check`; `pnpm -r --if-present typecheck`; relevant
Backoffice build; scoped formatting check; strict OpenSpec validation;
prohibited-dependency scans; protected-file recomputation; VERIFY report,
Technical Compliance Matrix and mandatory Browser QA.

Browser QA uses authenticated real route
`/etablissement/informations-generales` and real persisted data. Mandatory
coverage: OWNER editable, MANAGER editable, no-item/one-item/multiple-item,
pending create/edit/remove and undo,
successful explicit item-scoped create/update/remove, reload round-trip, exact
surrounding whitespace preservation, rejected blank/whitespace create/edit with
pending draft and previous canonical value preserved, no autosave, section
order/regression, widths 1440/1024/768/390, keyboard, visible focus, accessible
labels/names, observable status/alert semantics, no overflow/clipping, real
screenshots and lowercase SHA-256 manifest. QA must perform the safe existing
no-access-principal availability check described above. Its unavailability
alone does not block QA: record
`NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT` and use the approved focused
server-side evidence. A persistence-failure state is also conditional when it
can be produced safely and uses the same truthful unavailable classification.
`QA_BLOCKED_BY_ENVIRONMENT` applies only when the environment prevents another
mandatory real-browser scenario from completing under this availability rule;
no authorization, principal, failure or screenshot may be fabricated.

**Stop conditions:** required test/check/contract row not PASS; Spec/Design
deviation; mandatory Browser QA incomplete except a truthfully unavailable
no-access-principal scenario handled by the approved availability rule; diff
path count/integrity mismatch; new file/migration omitted;
protected/out-of-allowlist drift; Product Knowledge write; cross-module issue;
lifecycle promotion; any remaining `CONFLICT` or `NEEDS REVIEW`.

**Completion evidence:** exact commands/results; requirement/scenario mapping;
five-row Technical Compliance Matrix with intended and actual paths,
dependencies, tenant/auth/data/state invariants, tests and PASS/FAIL; exact
diff path lists/counts/lowercase hashes and apply/reverse results; protected
hash recomputation; QA report/screenshots/manifest; Gate 3 packet only after all
mandatory dimensions PASS.

- [x] 5.1 Update only legitimate implementation-facing page-pack files required to describe the actually implemented `Connaissances validées` page behavior, without new Product Decisions, permission/owner/durable-boundary/lifecycle changes; keep Product Knowledge, Module Registry, feature authority docs and `docs/reviews/README.md` read-only, run `pnpm docs:check`, and record any knowledge drift solely as post-archive Knowledge Consolidation input.
- [x] 5.2 Run focused schema/repository/loader/action/model/section tests plus guarded DB integration and complete migration chain; verify exact table, UUIDv7/item semantics, tenant isolation, auth ordering, all non-blank scenarios, concurrency/removal behavior, no autosave and regressions for Profile plus all five existing Restaurant Knowledge sections.
- [x] 5.3 Run repository-required broader checks: `pnpm docs:check`, `pnpm architecture:check`, `pnpm -r --if-present typecheck`, relevant cloud tests and Backoffice build, scoped formatting check, `pnpm exec openspec validate restaurant-knowledge-validated-knowledge --strict`, plus source/dependency scans; record exact PASS/FAIL and every skipped/unavailable check without inventing a lint command.
- [x] 5.4 Produce `03-verify-evidence.md` mapping every Spec requirement/scenario and each task/contract invariant to code/tests/results, including a five-row Technical Compliance Matrix; verify no missing row, no current failure, no prohibited dependency and no lifecycle/readiness promotion.
- [x] 5.5 Generate deterministic `03-implementation.diff` and `03-migration.diff` from saved pre-Apply baselines to current bytes, enumerate exact paths, assert declared counts equal actual `diff --git` sections, represent each new file as `/dev/null -> current`, verify forward/apply and reverse integrity, compute lowercase SHA-256, recompute every protected path and stop on unrelated drift.
- [x] 5.6 Run mandatory real Browser QA on authenticated `/etablissement/informations-generales` with real persisted data for OWNER and MANAGER plus all required states/saves/reloads/non-blank cases/regressions/responsive/accessibility/overflow scenarios, create a truthful report with real screenshots/lowercase manifest, and check whether an existing safe STAFF or other actual Restaurant-Knowledge-no-access principal is available. If available, authenticate as and truthfully identify that principal, then verify the Validated Knowledge section and mutation controls are absent. If unavailable without changing accepted authorization, record `NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT`, cite focused loader/authorization evidence proving READ denial and zero repository access, and do not fabricate or relabel a principal. Treat safe persistence failure as conditional, and use `QA_BLOCKED_BY_ENVIRONMENT` only when another mandatory real-browser scenario cannot be completed under this availability rule.
- [x] 5.7 Create `03-final-review.md` and stop at `GATE 3 — AWAITING_HUMAN_REVIEW` only when Technical Compliance, VERIFY, deterministic attribution and mandatory Browser QA all PASS with `CONFLICT: NONE` and `NEEDS REVIEW: NONE`; do not sync, archive, deploy, enable Environment, promote Production Readiness or perform Knowledge Consolidation.

After explicit future Gate 3 approval, finish, sync, strict main-spec validation
and archive, run repository Knowledge Consolidation scan. If
`NO_UPDATE_REQUIRED`, workflow may finish. If `UPDATE_REQUIRED`, create only
`04-knowledge-consolidation-review.md`, wait for human approval, apply only the
exact approved knowledge diff, and route any cross-module/durable-authority
change to Control Tower. Đây chỉ là later workflow reservation; không tạo
knowledge review trong Tasks planning.
