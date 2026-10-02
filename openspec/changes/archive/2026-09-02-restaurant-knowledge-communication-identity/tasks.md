# Tasks / Implementation Plan

Change: `restaurant-knowledge-communication-identity`

```text
UI_AFFECTING: YES
BROWSER_QA_REQUIRED: YES
SENSITIVE_CHANGE: YES
SENSITIVE_DESIGN_GATE: APPROVED
APPLY_AUTHORIZATION: GRANTED
STOP_BEFORE_APPLY: NO
```

`tasks.md` là repository-supported Tasks / Implementation Plan artifact cho
change này; OpenSpec không chỉ định một Implementation Plan file riêng.

Năm phase đều cần thiết theo approved Design:

1. Foundation / Data;
2. Service / Domain;
3. UI / Components;
4. Interaction / States;
5. Integration / Regression.

Lifecycle giữ nguyên trong planning và future implementation: Product Decision
`APPROVED`, Implementation `PARTIAL`, Environment `NOT_ENABLED`, Production
Readiness `NOT_ASSESSED`, External Dependency `NOT_ASSESSED`.

Không phase nào được thêm required dependency với Establishment Profile
data/repository, Marketing/Content, Reviews/Reputation, AI/inference/automatic
learning, Social/public publishing, external provider, CRM/customer data,
personalization/segmentation, legal/compliance/moderation, POS, Site Agent hoặc
Display. Không thêm FK, import, repository call, API/shared contract, event,
job, consumer hook hoặc sync path tới các boundary đó. Nếu dependency như vậy
trở thành technically required, dừng với `CROSS_MODULE / NEEDS REVIEW`.

## 1. Foundation / Data

### TECHNICAL IMPLEMENTATION CONTRACT — Foundation / Data

**Purpose:** tạo deterministic pre-Apply attribution trước mọi implementation
edit, sau đó bổ sung exact dedicated Restaurant Knowledge table và additive
generated migration mà không chạm canonical owner khác.

**Boundary / canonical owner:** cloud persistence trong `@yuta/db-cloud`;
Restaurant Knowledge sở hữu slice; semantic scope là establishment;
Organization chỉ là tenancy/access envelope.

**Authorities:** root `AGENTS.md`, `packages/db-cloud/AGENTS.md`,
`docs/architecture/DATABASE_BOUNDARIES.md`, `docs/architecture/TENANCY.md`,
approved Spec/Design, current Drizzle config, SQL/snapshot inventory và journal.

**Exact intended repository paths:** shared write allowlist gồm đúng 14 paths:

1. `packages/db-cloud/src/schema/restaurant-knowledge.ts`;
2. `packages/db-cloud/src/restaurant-knowledge-repository.ts`;
3. `packages/db-cloud/test/schema.test.ts`;
4. `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`;
5. `packages/db-cloud/drizzle/meta/_journal.json`;
6. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`;
7. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`;
8. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`;
9. `apps/backoffice/test/restaurant-knowledge-loader.test.ts`;
10. `docs/ui/pages/establishment-general-information/README.md`;
11. `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`;
12. `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`;
13. `docs/ui/pages/establishment-general-information/UI_SPEC.md`;
14. `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`.

**Shared existing files for this phase:** paths 1–5 của allowlist. Paths 2 và 4
cũng thuộc Service/Domain; mỗi shared file chỉ có một saved pre-Apply byte
baseline dùng xuyên phases.

**Intended new files:** bảy non-migration implementation/test paths phải được
record `MISSING` trước Apply:

- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/communication-identity-model.ts`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-fields.tsx`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-form.tsx`;
- `apps/backoffice/test/communication-identity-action.test.ts`;
- `apps/backoffice/test/communication-identity-model.test.ts`;
- `apps/backoffice/test/communication-identity-fields.test.tsx`;
- `apps/backoffice/test/communication-identity-form.test.tsx`.

New migration SQL/snapshot remain conditional. Nếu immediate pre-Apply journal
vẫn kết thúc ở `0014_restaurant_knowledge_team_culture`, expected `MISSING`
paths là:

- `packages/db-cloud/drizzle/0015_restaurant_knowledge_communication_identity.sql`;
- `packages/db-cloud/drizzle/meta/0015_snapshot.json`.

Nếu terminal journal/inventory khác, dừng và reconcile exact paths trước edit.
Future attribution evidence files dưới
`docs/reviews/restaurant-knowledge-communication-identity/` cũng phải được
record `MISSING` trước khi tạo, nhưng không phải implementation/test path count
bảy nêu trên.

**Allowed dependencies:** current Drizzle/PostgreSQL tooling, db-cloud schema
primitives, `establishments` composite scope và guarded disposable PostgreSQL
test infrastructure.

**Prohibited dependencies:** generic JSON/key-value/taxonomy store; Profile,
Marketing, Reviews, CRM/customer hoặc provider storage; resource/customer/
channel/provider/taxonomy ID; timestamp/history/provenance; cross-runtime
database access; new API/shared contract; mọi global prohibited dependency.

**Authorization / tenant invariants:** scope columns chỉ lấy từ trusted
`TenantContext`; composite organization + establishment boundary phải được giữ;
browser scope không bao giờ là authority.

**Data / state invariants:** table
`restaurant_knowledge_communication_identity` có đúng năm columns:
`organization_id`, `establishment_id`, `tone_and_communication_style`,
`customer_addressing`, `language_elements_and_things_to_avoid`; ba business
columns là nullable text; composite PK; composite FK tới
`establishments(organization_id, id)` với `ON DELETE RESTRICT`; không backfill;
missing và all-null observable tương đương; không destructive rollback.

**Required tests / checks:** baseline manifest integrity; exact schema unit
test; generated SQL/snapshot/journal review; full blank-to-current migration
chain trên guarded disposable PostgreSQL; db-cloud typecheck/tests;
`pnpm architecture:check`.

**Stop conditions:** Apply authorization chưa có; bất kỳ implementation edit
xảy ra trước baseline; allowlisted file không được snapshot; unexpected
path/hash/status drift; journal không còn terminal 0014 nhưng vẫn generate
0015; generated migration alter/backfill/drop existing data; schema có extra
column/constraint hoặc cần another owner/runtime.

**Completion evidence:** pre-Apply manifest ghi exact HEAD, sorted status, 14
shared paths, exact bytes/lowercase hashes, seven `MISSING` paths, conditional
migration inventory và protected dirty-file hashes; reviewed generated
migration; passing exact schema/full-chain evidence; out-of-allowlist files
byte-identical.

- [x] 1.1 Trước mọi implementation edit, capture exact HEAD và sorted `git status --short`, verify final 14-path shared allowlist, save exact bytes + lowercase SHA-256 cho mỗi shared file, record seven new implementation/test paths và mọi intended evidence path là `MISSING`, hash mọi existing dirty file ngoài allowlist như protected state, rồi verify manifest tái tạo được baseline bytes.
- [x] 1.2 Inspect exact current journal cùng SQL/snapshot inventory; chỉ khi terminal vẫn là `0014_restaurant_knowledge_team_culture` mới bổ sung approved five-column schema và generate conditional 0015 SQL/snapshot bằng repository Drizzle tooling; nếu khác thì stop/reconcile trước edit.
- [x] 1.3 Review generated schema/SQL/snapshot/journal và thêm focused schema assertions cho exact table, five columns, nullable text fields, composite PK/FK và `ON DELETE RESTRICT`; verify không extra ID/timestamp/history/provenance, backfill, existing-table alteration hoặc destructive rollback.
- [x] 1.4 Chạy full migration chain trên guarded disposable PostgreSQL từ blank database và verify new table/constraints tồn tại trong khi toàn bộ earlier migrations/tables vẫn intact; record exact command, environment guard và result.
- [x] 1.5 Recompute protected-file hashes sau Foundation/Data và stop nếu bất kỳ out-of-allowlist byte/status nào drift; attach exact schema/migration commands và results làm phase completion evidence.

## 2. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT — Service / Domain

**Purpose:** cung cấp trusted three-value read projection và one-statement
whole-slice save, với READ/MANAGE enforced đúng thứ tự và FormData không trở
thành authority.

**Boundary / canonical owner:** `@yuta/db-cloud` sở hữu repository persistence;
Backoffice route sở hữu loader/action; existing auth/session/tenant helpers giữ
authority; Restaurant Knowledge giữ canonical ownership.

**Authorities:** root, `packages/db-cloud/AGENTS.md`,
`apps/backoffice/AGENTS.md`, `docs/architecture/TENANCY.md`,
`docs/architecture/AUTHENTICATION.md`,
`docs/architecture/IDENTITY_AND_MEMBERSHIP.md`, Restaurant Knowledge
authorization spec và approved Design Decisions 3–5.

**Exact intended repository paths:**

- shared: `packages/db-cloud/src/restaurant-knowledge-repository.ts`;
- shared: `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`;
- shared: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`;
- shared: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`;
- shared: `apps/backoffice/test/restaurant-knowledge-loader.test.ts`;
- new: `apps/backoffice/test/communication-identity-action.test.ts`.

**Shared existing files:** năm shared paths trên, dùng exact saved baseline từ
task 1.1.

**Intended new files:** chỉ
`apps/backoffice/test/communication-identity-action.test.ts` trong phase này.

**Allowed dependencies:** trusted `TenantContext`, `requireEstablishment`,
current Restaurant Knowledge permission helpers, page-local server action,
route-local Zod parsing, `@yuta/db-cloud` và Next route revalidation.

**Prohibited dependencies:** browser organization/establishment/role/permission
authority; resource-ID-only lookup; Profile/Marketing permission hoặc
repository substitution; generic FormData parser/whitelist; raw-extra-key
Product rejection; per-field mutation; global prohibited modules/providers/
runtimes/contracts.

**Authorization / tenant invariants:** READ trước repository read; no READ bằng
zero repository call; MANAGE derived riêng; save re-derive authenticated tenant,
require active establishment và MANAGE trước parse/persistence; OWNER/MANAGER
success; STAFF default denial; denied paths có zero persistence/revalidation;
every repository predicate dùng organization + establishment.

**Data / state invariants:** projection/input chứa đúng
`toneAndCommunicationStyle`, `customerAddressing` và
`languageElementsAndThingsToAvoid` dưới dạng `string | null`; missing row trả ba
null; save dùng một statement upsert cả ba properties; exact `''` thành `null`,
whitespace/non-empty giữ nguyên; unrelated raw fields không forward.

**Required tests / checks:** guarded repository integration cho missing,
all-null, từng single-value, full round-trip, overwrite và three isolation
cases; loader ordering/non-call tests; action tests cho OWNER, MANAGER, STAFF,
Profile non-substitution, independent MANAGE boundary, exact fields,
unrelated-field non-forwarding, success-only revalidation và content-safe
failure.

Marketing-permission và READ-without-MANAGE authorization-path tests chỉ được
thêm nếu existing test infrastructure biểu diễn logical state đó mà không đổi
production grants/permissions/roles/principals. `canManage=false` UI test không
phải production authorization evidence. Không invent authorization để test.

**Stop conditions:** cần permission/role/principal mới; browser scope lọt vào
repository input; missing organization/establishment predicate; permission
check sau parse/persistence; Profile/Marketing substitution; per-field write;
shared API/contract hoặc prohibited dependency; trim/Product validation.

**Completion evidence:** source-to-Spec mapping; passing repository/loader/
action tests; mock call-order/non-call evidence; disposable tenant-isolation
results; unchanged permission/grant definitions; no invented production auth.

- [x] 2.1 Bổ sung exact internal Communication Identity input/projection và scoped get operation trong `@yuta/db-cloud`; verify `requireEstablishment`, cả hai tenant predicates và missing-row-to-three-null behavior bằng focused integration tests.
- [x] 2.2 Bổ sung one-statement composite-key whole-slice upsert cập nhật cả ba values, không per-field mutation; verify saved all-null, từng single-value, full round-trip, overwrite và canonical returned projection.
- [x] 2.3 Bổ sung wrong-organization, wrong-establishment và mismatched organization/establishment integration cases; verify không read leak hoặc accepted cross-tenant write.
- [x] 2.4 Bổ sung page-local loader kiểm tra Restaurant Knowledge READ trước repository và derive MANAGE độc lập; verify OWNER/MANAGER behavior, STAFF denial và zero Communication Identity repository calls without READ.
- [x] 2.5 Bổ sung page-local action re-derive tenant, require active establishment và MANAGE trước parsing/persistence, construct/strict-parse đúng ba FormData entries, normalize chỉ exact empty string, gọi một repository save và revalidate route chỉ sau success; verify fake scope/role/permission và unrelated raw fields không forward.
- [x] 2.6 Bổ sung action/authorization tests chứng minh OWNER success, MANAGER success, STAFF denial trước persistence, Profile permission non-substitution, MANAGE enforced independently, zero persistence/revalidation trên denied paths và safe recoverable error không log descriptive content; chỉ thêm Marketing-permission hoặc READ-without-MANAGE logical case khi current test infrastructure làm được mà không invent production authority.

## 3. UI / Components

### TECHNICAL IMPLEMENTATION CONTRACT — UI / Components

**Purpose:** thêm một independent Communication Identity section sau Équipe &
culture trên existing real-data page với đúng ba French-labelled textareas và
authorization-derived visibility/editability.

**Boundary / canonical owner:** route-local Backoffice presentation; canonical
data vẫn thuộc Restaurant Knowledge; `@yuta/ui` chỉ cung cấp domain-neutral
primitives.

**Authorities:** root và `apps/backoffice/AGENTS.md`,
`docs/ui/YUTA_FRONTEND_RULES.md`, `docs/ui/BACKOFFICE_FRONTEND_RULES.md`, current
`docs/ui/pages/establishment-general-information/` page pack, approved Spec và
Design Decisions 6–8.

**Exact intended repository paths:**

- shared: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`;
- new: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/communication-identity-model.ts`;
- new: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-fields.tsx`;
- new: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-form.tsx`;
- new: `apps/backoffice/test/communication-identity-fields.test.tsx`;
- new: `apps/backoffice/test/communication-identity-form.test.tsx`.

**Shared existing files:** `page.tsx`, patched only from task 1.1 baseline.

**Intended new files:** model, fields/form components và fields/form tests listed
above; model behavior is completed under Interaction/States.

**Allowed dependencies:** current React/Next route patterns, `@yuta/ui`,
`lucide-react`, page-local action/model và server projection/`canManage`.

**Prohibited dependencies:** fixture replacement; client authorization as
enforcement; new UI/state/validation framework; business logic in `@yuta/ui`;
tone/channel/social/campaign/AI/review/CRM/moderation/legal/scoring/taxonomy
controls; all global prohibited dependencies.

**Authorization / tenant invariants:** no READ means loader returns null and
page does not render section; `canManage=false` renders read-only/disabled
presentation with no save control; MANAGE renders editable fields and exactly
one save control. Component false-state is presentation evidence only.

**Data / state invariants:** exactly three labeled values in approved order;
section follows Équipe & culture; Profile, Concept/Histoire,
Cuisine/savoir-faire, Expérience client và Équipe & culture keep independent
props/actions/state; no fixture replaces actual auth/data/mutations.

**Required tests / checks:** exact field/name/label and accessible association;
disabled/read-only state; exactly one MANAGE save control; section ordering and
existing-page composition; focused render tests; Backoffice typecheck/build.

**Stop conditions:** extra field/control; section merges/replaces another form;
Profile/Marketing permission/data becomes required; fixture/client auth path;
new shared domain abstraction/framework; cross-section mutation or prohibited
dependency.

**Completion evidence:** passing model shape/fields/form/page tests, accessible
labels, source review showing independent boundaries và unchanged real page
data/auth/mutations.

- [x] 3.1 Tạo page-local Communication Identity model shape và verify object exposes exactly the three approved `string | null` properties, không extra validation/taxonomy/customer/channel/provider fields.
- [x] 3.2 Tạo fields component với chính xác labels `Ton & style de communication`, `Façon de s’adresser aux clients`, `Éléments de langage & choses à éviter`; verify matching field names, optional presentation, accessible label associations và disabled read-only state.
- [x] 3.3 Tạo independent form bằng current card/alert/button patterns; verify `canManage=false` có no save control và MANAGE có exactly one Communication Identity submit, không coi component false-state là real READ-only principal evidence.
- [x] 3.4 Compose READ-gated section sau Équipe & culture từ real loader data; verify Establishment Profile, Concept/Histoire, Cuisine/savoir-faire, Expérience client và Équipe & culture vẫn dùng independent existing props/actions và đúng page order.
- [x] 3.5 Chạy focused fields/form/page tests cùng Backoffice typecheck/build; verify no fixture replacement, client authorization enforcement, extra control hoặc cross-section mutation.

## 4. Interaction / States

### TECHNICAL IMPLEMENTATION CONTRACT — Interaction / States

**Purpose:** implement canonical-equivalent dirty state, browser-local draft,
accepted post-save baseline, một explicit whole-slice submit và recoverable
states mà không autosave.

**Boundary / canonical owner:** draft là browser-local cho tới MANAGE-gated
server success; canonical persistence vẫn thuộc Restaurant Knowledge server
boundary.

**Authorities:** approved Design Decisions 5, 7 và 8; Backoffice frontend rules;
page-pack interaction/accessibility requirements; approved delta Spec.

**Exact intended repository paths:**

- shared: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`;
- shared: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx` chỉ cho server refresh key/composition nếu cần;
- new: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/communication-identity-model.ts`;
- new: `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-form.tsx`;
- new: `apps/backoffice/test/communication-identity-model.test.ts`;
- new: `apps/backoffice/test/communication-identity-form.test.tsx`;
- new: `apps/backoffice/test/communication-identity-action.test.ts`.

**Shared existing files:** `actions.ts` và `page.tsx`, both from task 1.1
baseline.

**Intended new files:** model, form, model/form/action tests listed above.

**Allowed dependencies:** pure route-local normalization/comparison, React
local state, `useActionState`, `useFormStatus`, page-local server action,
server-returned canonical projection và current UI primitives.

**Prohibited dependencies:** trim/content/length/format validation; reliance
solely on key/remount; multiple/per-field submits; autosave; change/blur/effect/
timer/background persistence; optimistic canonical write; global prohibited
dependencies.

**Authorization / tenant invariants:** only MANAGE presentation may submit;
server action remains final authorization; UI state cannot substitute server
guard; error/success state contains no browser scope authority.

**Data / state invariants:** `canonicalCommunicationIdentityValue` maps only
`'' -> null`; `null -> null`; all non-empty including whitespace unchanged;
dirty compares canonical draft and accepted baseline; action success canonical
projection becomes baseline without remount; pristine disabled, dirty enabled,
pending same control, success `role=status`, error `role=alert`, failure retains
draft; no autosave.

**Required tests / checks:** pure canonical null/empty/text/whitespace tests;
four required dirty cases; accepted-baseline update without key change; one
submit/action call with all values; pending/success/error/retry; source/test
proof of no persistence on render/change/blur/effect/timer/background.

**Stop conditions:** whitespace trim/transformation; false dirty after
canonical-equivalent save; correctness requires remount; failed draft lost;
second submit; any autosave/optimistic persistence; inaccessible status/error;
Product validation or prohibited control.

**Completion evidence:** passing model/form/action state tests including exact
four canonical cases; source scan for forbidden persistence triggers; accessible
pending/success/error/recovery evidence.

- [x] 4.1 Implement `canonicalCommunicationIdentityValue` để chỉ `''` compare như `null` và mọi non-empty string, kể cả whitespace-only, giữ nguyên; verify null/empty/text/whitespace unit cases.
- [x] 4.2 Implement dirty comparison trên canonical draft và accepted baseline; verify initial null + draft `''` là NOT DIRTY, initial `'abc'` + draft `''` là DIRTY, và initial null + draft `'abc'` là DIRTY.
- [x] 4.3 Dùng canonical saved projection từ action success làm accepted baseline trong mounted form; verify successful `'' -> null` save trở thành NOT DIRTY ngay cả khi React key không đổi và test không dựa vào remount.
- [x] 4.4 Implement one explicit whole-slice submit với pristine disabled, dirty enabled và pending trên same control; verify exactly one action invocation mang cả ba current draft values.
- [x] 4.5 Implement visible success, recoverable error và retry với failed draft retained; verify `role=status`/`role=alert` và no persistence on render/change/blur/effect/timer/background, no autosave, no optimistic canonical write.

## 5. Integration / Regression

### TECHNICAL IMPLEMENTATION CONTRACT — Integration / Regression

**Purpose:** giữ page-pack implementation documentation chính xác, chạy
technical VERIFY và regressions, tạo Technical Compliance Matrix, thực hiện
separate real Browser QA và chỉ tạo Gate 3 khi mọi required dimension PASS.

**Boundary / canonical owner:** evidence/integration only; không tạo runtime,
data owner, permission hoặc consumer relationship mới. Technical VERIFY và QA
remain separate.

**Authorities:** root instructions, `docs/AUTHORITY_MODEL.md`, current Product
Knowledge/Module Registry read-only context, `docs/YUTA_QA_PROTOCOL.md`,
OpenSpec apply/verify workflow, current page pack, approved planning artifacts
và review packets.

**Exact intended repository paths:** implementation-facing page-pack write
targets chỉ gồm:

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

**Shared existing files:** năm page-pack write targets above, from task 1.1
baseline. All Product Knowledge/Module Registry/review-index paths remain
protected, not shared write targets.

**Intended new files:** future evidence under
`docs/reviews/restaurant-knowledge-communication-identity/`:

- `03-pre-apply-manifest.md` và exact baseline copies created immediately before
  Apply;
- `03-verify-evidence.md`;
- `03-implementation.diff`;
- `03-migration.diff`;
- `qa/QA_REPORT.md`;
- `qa/screenshot-manifest.md`;
- actual browser screenshots;
- `03-final-review.md` only after compliance, VERIFY và required QA PASS.

**Allowed dependencies:** repository-supported test/build/typecheck/docs/
architecture/format tools, generated OpenSpec apply/verify workflows, guarded
disposable PostgreSQL, real authenticated local Backoffice environment và
approved Browser QA tooling.

**Prohibited dependencies:** Product Knowledge/Module Registry Apply writes;
fixtures replacing real route/persisted data; fabricated grants/principals/
failures/screenshots; invented lint command; sync/archive/deploy; lifecycle
promotion; every global prohibited dependency.

**Authorization / tenant invariants:** Foundation–Interaction invariants remain
intact; real QA never replaces server denial/isolation evidence; no production
grant matrix change to manufacture a state.

**Data / state invariants:** page-pack changes describe only actually
implemented behavior without new Product Decision/owner/permission/durable
boundary/lifecycle; deterministic implementation/migration evidence includes
all attributable shared/new files; out-of-scope dirty files stay byte-identical.

**Required tests / checks:** focused and regression suites; full migration
chain; schema exactness; strict OpenSpec validation; `pnpm docs:check`,
`pnpm architecture:check`, recursive typecheck, relevant Backoffice/db-cloud
tests/builds, scoped formatter; deterministic dependency scan; generated VERIFY
workflow; Technical Compliance Matrix; separate real Browser QA; deterministic
diff/hash/apply/reverse integrity.

Mandatory Browser QA dùng authenticated
`/etablissement/informations-generales` với real persisted data và covers OWNER
editable, MANAGER editable, populated, all-empty, dirty, successful explicit
save, reload/round-trip, exactly one visible Communication Identity save,
no-autosave observation, widths 1440/1024/768/390, keyboard, visible focus,
accessible labels/names, observable status/error semantics, no overflow/clipping
và visibility/layout của cả sáu sections. Nếu safe existing STAFF/no-access
principal có sẵn, real browser phải verify section absent; nếu không, report
`NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT` và dùng focused server tests.
READ-without-MANAGE, persistence error/recovery và stable pending capture là
conditional real states; không fabricate. Unavailable conditional state riêng
không làm QA blocked.

**Stop conditions:** contract/matrix row FAIL; VERIFY không PASS; migration/
tenant evidence không complete; prohibited dependency/drift; mandatory QA FAIL
hoặc `BLOCKED_BY_ENVIRONMENT`; missing responsive/screenshot evidence;
non-reproducible diff; lifecycle promotion; attempt sync/archive/deploy.

**Completion evidence:** `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`,
`VERIFY: PASS`, truthful `QA: PASS`, exact commands/results, matrix traceability,
hashed implementation/migration diffs, screenshot manifest và ready Gate 3
packet có `Sync authorization: PENDING`.

- [x] 5.1 Update only the five legitimate implementation-facing page-pack files as needed to match actual Communication Identity behavior; keep Product Knowledge, Module Registry, Establishment feature knowledge and `docs/reviews/README.md` read-only, run `pnpm docs:check`, and record any knowledge drift solely as post-archive Knowledge Consolidation input.
- [x] 5.2 Run deterministic source/import/FK/API/contract/event/job/sync/consumer scans over attributable implementation and verify zero prohibited Profile-data, Marketing, Reviews, AI, Social/public publishing, provider, CRM/customer, legal/moderation, POS, Site Agent hoặc Display dependency.
- [x] 5.3 Run focused schema/repository/loader/action/model/fields/form tests plus Restaurant Knowledge, Profile and composed-page regressions; record exact commands/exits and fix only defects within approved Spec/Design.
- [x] 5.4 Run full guarded migration checks, strict OpenSpec validation, `pnpm docs:check`, `pnpm architecture:check`, recursive typecheck, relevant Backoffice/db-cloud tests/builds and scoped formatting; do not claim or invent lint, and record every result/skipped environmental limitation truthfully.
- [x] 5.5 Execute repository-generated OpenSpec VERIFY workflow and create a `TECHNICAL COMPLIANCE MATRIX` mapping every contract to authority, source implementation, tests, schema/migration, authorization, tenant isolation, parsing, state, regression, dependency scan and exact command result; require `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` and `VERIFY: PASS` before QA/Gate 3 readiness.
- [x] 5.6 Build separate deterministic implementation and migration diffs from saved baseline/current bytes: shared files use baseline-to-current, every new implementation/test/SQL/snapshot file uses proper `/dev/null -> current`, and journal uses baseline-to-current; enumerate exact sorted path inventories, assert declared counts equal actual `diff --git` section counts, run appropriate apply/reverse integrity checks accounting for new files, hash exact bytes lowercase, and verify all protected dirty files remain unchanged.
- [x] 5.7 Sau technical VERIFY PASS, chạy separate real Browser QA trên authenticated route với real persisted data. Cover mọi mandatory role/state/save/reload/responsive/accessibility/overflow/six-section regression scenario, save actual screenshots cùng lowercase SHA-256 manifest; test safe existing STAFF/no-access khi available, report `NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT` khi unavailable và dùng server evidence; chỉ test READ-without-MANAGE, error/recovery, pending khi environment tạo được an toàn; không fabricate, và chỉ dùng `QA = BLOCKED_BY_ENVIRONMENT` khi mandatory scenario bị environment ngăn cản.
- [x] 5.8 Chỉ tạo Gate 3 evidence khi Technical Implementation Compliance, VERIFY và required QA đều PASS; include exact planning/task hashes, requirement-to-code/test mapping, matrix/evidence hashes, exact implementation/migration diff inventories/counts/integrity, screenshot manifest, lifecycle preservation và `Sync authorization: PENDING`, rồi stop trước sync/archive.

### Post-archive Knowledge Consolidation reservation

Đây là later workflow planning, không phải Apply task. Không tạo
`04-knowledge-consolidation-review.md` trong planning, Apply, VERIFY, QA hoặc
Gate 3. Sau successful Gate 3 approval, finish, normative spec sync, strict main
spec validation và archive:

- chạy repository Knowledge Consolidation scan;
- nếu `NO_UPDATE_REQUIRED`, record bounded reason/evidence rồi workflow có thể
  thành `DONE`;
- nếu `UPDATE_REQUIRED`, chỉ tạo
  `docs/reviews/restaurant-knowledge-communication-identity/04-knowledge-consolidation-review.md`,
  stop cho human review và chỉ apply exact approved knowledge diff;
- nếu scan ảnh hưởng cross-module/durable authority, route sang Control Tower.

## Planning Checkpoint — Stop Before Apply

Tasks planned: `29`, completed: `29`. Technical Implementation Contracts: `5`.

Pre-Apply attribution, implementation, technical VERIFY, deterministic diffs,
real Browser QA và Gate 3 evidence đã hoàn tất. `APPLY_AUTHORIZATION` là
`GRANTED` từ explicit current-user instruction. Gate 3 review status là
`AWAITING_HUMAN_REVIEW`; sync authorization là `PENDING`. Sync, archive, deploy,
lifecycle promotion và Knowledge Consolidation vẫn không được ủy quyền.
