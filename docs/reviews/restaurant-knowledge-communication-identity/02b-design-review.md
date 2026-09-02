# Sensitive Design Gate Review

Change: restaurant-knowledge-communication-identity  
Gate: SENSITIVE DESIGN GATE  
Review status: APPROVED  
Created: 2026-09-02T18:36:54.3152587+02:00  
Schema: yuta-spec-driven  
Analysis conclusion: READY_FOR_SPECS  
Sensitive change: YES

UI_AFFECTING: YES  
BROWSER_QA_REQUIRED_BEFORE_GATE_3: YES

Approval source: explicit current-user instruction  
Approval recorded by: Codex workflow  
Approved: 2026-09-02T19:10:05.9216148+02:00

## Approved Planning Integrity

Gate 1 and Gate 2 were approved by explicit current-user instructions for this
named change. Recomputed hashes before Design matched their reviewed bytes.

| Artifact               | Repository-relative path                                                                                               | SHA-256                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Proposal               | openspec/changes/restaurant-knowledge-communication-identity/proposal.md                                               | a58e71eef2dbce764191dc0250cc812e00123fcb31fc2b7c98b5016db0e2d6c4 |
| Analysis               | openspec/changes/restaurant-knowledge-communication-identity/analysis.md                                               | 6203a25f11b83f80af89ec5f20cfa4d98df23659ff1b82f9c8c86a17f4fa35fb |
| Delta spec             | openspec/changes/restaurant-knowledge-communication-identity/specs/restaurant-knowledge/communication-identity/spec.md | a6b0d54a741ad8ac17c668c0fe3f8f8b8927fc9e7e1747e760e91b1131db408f |
| Approved Gate 1 packet | docs/reviews/restaurant-knowledge-communication-identity/01-analysis-review.md                                         | c5f134ea2904d639595a4eafea31ec2a1c087e93be4238bea62e7417b5d56b96 |
| Approved Gate 2 packet | docs/reviews/restaurant-knowledge-communication-identity/02-specs-review.md                                            | 5e86c03b56e03dd63628d0ff4a1483a2f6e822c61563e2a2515ff4005fa013ea |

Hash command: Get-FileHash -Algorithm SHA256 -LiteralPath path

## Design Artifact

Path:
openspec/changes/restaurant-knowledge-communication-identity/design.md

SHA-256:
2d10088d01fd4102a1e16e4eb81e33f024d921601691574b0dc59c5a85626169

## Exact Design Content

````markdown
## Context

Xem [`proposal.md`](./proposal.md) cho động cơ Product và delta spec
[`restaurant-knowledge/communication-identity`](./specs/restaurant-knowledge/communication-identity/spec.md)
cho behavioral contract. Đây là sensitive change vì future implementation bổ
sung tenant-owned cloud data, consume authorization boundary hiện có và cần
migration được kiểm chứng.

Route `/etablissement/informations-generales` hiện compose Establishment
Profile với bốn independent Restaurant Knowledge slices: Concept/Histoire,
Cuisine/savoir-faire, Expérience client và Équipe & culture. Runtime
`apps/backoffice` đã có trusted tenant context, hai operation
`restaurant-knowledge.read` và `restaurant-knowledge.manage`, page-local
loaders/actions fail closed, cùng `@yuta/db-cloud` repository luôn dùng cả
`organizationId` và `establishmentId`. Design phải tương thích các boundary đó
nhưng không coi technical representation của adjacent slices là template bắt
buộc.

Ba value mới là descriptive establishment knowledge. Restaurant Knowledge là
canonical owner; Organization chỉ là tenancy/access envelope. Browser không
được chọn tenant scope, role hoặc permission. Establishment Profile,
Marketing/Content, Reviews/Reputation, AI, Social, public website, external
provider, CRM/customer data, legal/compliance enforcement, POS, Site Agent và
Display không tham gia read/write flow.

Current migration journal được quan sát tại Design time kết thúc ở
`0014_restaurant_knowledge_team_culture`, nhưng worktree đang heavily dirty và
state này không được giả định còn đúng ở Apply. Shared schema, repository,
page, loader, actions, tests, journal và page-pack files đều đã có pre-existing
changes. Future Apply phải snapshot exact current bytes và attribution theo
baseline đó, không nhận ownership toàn bộ `git diff HEAD`.

## Goals / Non-Goals

**Goals:**

- Chọn persistence representation nhỏ nhất cho đúng ba technical values
  `toneAndCommunicationStyle`, `customerAddressing` và
  `languageElementsAndThingsToAvoid`.
- Giữ one-row-per-establishment scope, missing/all-empty equivalence và một
  atomic whole-slice save.
- Enforce Restaurant Knowledge READ trước repository read và MANAGE trước
  parsing/persistence trong trusted server boundary.
- Compose một page-local section với browser-local draft, canonical dirty
  comparison, đúng một explicit submit, visible success/recoverable error và
  không autosave.
- Xác định later technical verification, real Browser QA và deterministic
  dirty-worktree attribution trước khi Tasks/Apply được phép bắt đầu.

**Non-Goals:**

- Không thay đổi Product behavior, permission, role, principal, grant matrix,
  tenant semantics, canonical owner hoặc runtime topology.
- Không tạo shared contract, API route, event, job, sync path hoặc consumer hook.
- Không thêm campaign, publishing, scheduling, template, channel configuration,
  Reviews automation, CRM/customer linkage, legal/moderation enforcement,
  AI/provider/prompt, embeddings/vector storage hoặc cross-runtime behavior.
- Không thêm Product validation, required content, length/format rule, enum,
  taxonomy, tone preset, scoring, brand/sentiment rating hoặc automatic
  classification.
- Không tạo Tasks, implementation baseline, schema/migration, code, tests hoặc
  QA trong Design stage.
- Không sửa Product Knowledge/Module Registry hoặc promote lifecycle value.

## Decisions

### 1. Dùng một dedicated Restaurant Knowledge table cho slice

`@yuta/db-cloud` sẽ sở hữu table
`restaurant_knowledge_communication_identity`, có đúng hai scope columns và ba
nullable descriptive text columns:

| Column                                  | Type   | Nullability | Meaning                                         |
| --------------------------------------- | ------ | ----------- | ----------------------------------------------- |
| `organization_id`                       | `uuid` | `NOT NULL`  | Tenancy/access envelope từ trusted context      |
| `establishment_id`                      | `uuid` | `NOT NULL`  | Semantic establishment scope từ trusted context |
| `tone_and_communication_style`          | `text` | nullable    | `Ton & style de communication`                  |
| `customer_addressing`                   | `text` | nullable    | `Façon de s’adresser aux clients`               |
| `language_elements_and_things_to_avoid` | `text` | nullable    | `Éléments de langage & choses à éviter`         |

Table dùng composite primary key `(organization_id, establishment_id)` với tên
`restaurant_knowledge_communication_identity_scope_pk`. Composite foreign key
cùng hai columns tham chiếu
`establishments(organization_id, id)`, dùng tên
`restaurant_knowledge_communication_identity_establishment_fk` và
`ON DELETE RESTRICT`. Tên FK được chọn dưới PostgreSQL identifier limit để
không bị truncate ngầm.

Không thêm resource ID, customer ID, Marketing/channel/provider/taxonomy ID,
timestamps, revision, history hoặc provenance. PostgreSQL `text` giữ content
không có Product length/format constraint. Missing row và row có cả ba value
`NULL` project thành cùng valid all-empty state. Một all-null save vẫn là valid
whole-slice upsert và không tạo khác biệt observable so với missing row.

**Lý do:** shape là ba stable typed values, cùng canonical owner và cùng
whole-slice lifecycle. Dedicated table giữ exact field evidence, one-row
atomicity và executable composite tenant constraint trong một bounded migration
surface. Quyết định đến từ approved shape/ownership/isolation needs, không từ
việc adjacent slices đã chọn table riêng.

**Alternatives considered:**

- Thêm columns vào `establishments` bị loại vì chuyển canonical ownership cho
  Establishment Profile và làm mờ permission boundary.
- Thêm columns vào table của slice khác bị loại vì trộn independent slice
  lifecycle và whole-slice save.
- Generic JSON store bị loại vì cho phép shape/key ngoài đúng ba values, làm yếu
  schema/isolation evidence và không đem lại lợi ích cho stable typed shape.
- Generic key/value hoặc taxonomy store bị loại vì ngầm tạo key taxonomy,
  generalized knowledge model và partial per-key mutation ngoài Product scope.
- Marketing, Reviews, CRM/customer hoặc provider-owned storage bị loại vì sai
  canonical owner và tạo prohibited dependency.

### 2. Migration additive, không backfill và rollback bảo toàn dữ liệu

Apply phải re-read exact SQL/snapshot/journal inventory ngay trước khi generate.
Nếu journal vẫn kết thúc ở index/tag `0014_restaurant_knowledge_team_culture`,
tooling output dự kiến dùng next index `0015` và descriptive tag
`restaurant_knowledge_communication_identity`. Đây chỉ là conditional
expectation; nếu journal, SQL inventory hoặc snapshots drift, Apply phải dừng,
recompute baseline và không tự ghi đè/chọn số dựa trên Design-time state.

Migration được tạo bằng repository-approved `@yuta/db-cloud` Drizzle generate
tooling và chỉ thêm table/constraints ở Decision 1. Generated artifacts gồm SQL,
snapshot mới và journal update. Không hand-edit deployed migrations, không
alter/backfill Profile hay existing Restaurant Knowledge data, và không tạo
destructive down migration.

Existing establishments không cần backfill: missing row project thành all-empty.
Migration phải chạy trước application version phụ thuộc table và full current
migration chain phải PASS trên guarded disposable PostgreSQL. Migration failure
phải fail closed trước application dependency.

Rollback ưu tiên application rollback: reviewed code cũ ngừng reference
additive table trong khi table/data được giữ dormant. Automatic drop hoặc data
deletion không thuộc change; một future destructive cleanup cần explicit data
decision riêng.

### 3. Repository boundary dùng trusted TenantContext và một atomic upsert

`@yuta/db-cloud` sẽ bổ sung internal input/projection type:

```text
RestaurantKnowledgeCommunicationIdentityInput
  toneAndCommunicationStyle: string | null
  customerAddressing: string | null
  languageElementsAndThingsToAvoid: string | null
```

Repository có hai operations riêng:

- get projection theo trusted `TenantContext`;
- save toàn bộ projection theo cùng trusted `TenantContext`.

Cả hai gọi `requireEstablishment(context)` trước query. Read select đúng ba
descriptive columns với đồng thời hai predicates:

```text
organization_id = context.organizationId
AND establishment_id = context.establishmentId
```

Read không nhận resource ID hoặc scope từ browser và trả object có cả ba value
`null` khi không có row. Save nhận object chứa đủ ba properties, insert scope từ
trusted context và dùng one-statement upsert target composite primary key; update
set cả ba columns và return canonical whole projection. Không có per-field
repository mutation hoặc cross-slice write.

Composite FK xác nhận organization + establishment pair hợp lệ, nhưng focused
repository tests vẫn phải chứng minh wrong-organization, wrong-establishment và
mismatched-pair isolation. Lookup theo establishment ID riêng, hidden browser
scope fields và Profile/Marketing/Reviews/CRM/provider repository reuse đều bị
loại.

### 4. Loader enforce READ trước repository và derive MANAGE độc lập

Page-local `restaurant-knowledge-loader.ts` sẽ có loader riêng cho Communication
Identity với thứ tự bắt buộc:

1. kiểm tra `restaurant-knowledge.read` trên trusted tenant context;
2. nếu không có READ, trả `null` và không gọi Communication Identity repository;
3. nếu có READ, gọi repository get theo trusted context;
4. derive `canManage` độc lập bằng `restaurant-knowledge.manage`;
5. trả projection + `canManage` cho page.

Page chỉ render section khi loader trả non-null. Existing route-level Profile
READ guard vẫn được giữ để không regress route, nhưng không được coi là
Restaurant Knowledge READ. Với current grants, OWNER/MANAGER load được và có
MANAGE; STAFF có Profile READ nhưng bị Restaurant Knowledge default denial nên
không gây repository call và không thấy section.

Không thêm permission, role, principal, section-specific authorization hoặc
admin/support bypass. READ-without-MANAGE vẫn là logical authorization state mà
UI/loader architecture hỗ trợ, nhưng Design không invent production grant chỉ
để tạo test principal.

### 5. Server action re-derive tenant và require MANAGE trước parsing/persistence

Một page-local action riêng sẽ:

1. gọi `requireAuthenticatedTenant('/etablissement/informations-generales')`;
2. gọi `requireEstablishment(tenant)`;
3. gọi `requireRestaurantKnowledgePermission(tenant,
'restaurant-knowledge.manage')` trước parsing hoặc repository access;
4. đọc đúng ba raw FormData entries `toneAndCommunicationStyle`,
   `customerAddressing` và `languageElementsAndThingsToAvoid`;
5. construct Communication Identity input object chỉ từ ba entries đó;
6. strict-parse constructed object bằng page-local Zod object với đúng ba
   `string | null` properties;
7. normalize chỉ exact empty string `''` thành `null`;
8. gọi đúng một whole-slice repository save và nhận canonical saved projection;
9. chỉ sau persistence success mới revalidate current route và trả success state
   kèm canonical saved projection;
10. trả content-safe recoverable error state, không revalidate khi parsing hoặc
    persistence fail.

Browser-supplied organization, establishment, role, permission, resource scope
hoặc unrelated raw FormData entry không phải authority, không được đưa vào
constructed input và không được forward tới repository. Zod strictness áp dụng
cho constructed Communication Identity object, không tự động áp dụng cho toàn bộ
raw FormData. Change không tạo Product requirement reject unrelated raw keys và
không tạo generic parser/whitelist hoặc shared contract.

Normalization không trim. Whitespace-only và mọi non-empty string được giữ
nguyên, không length/format/content validation. Profile hoặc Marketing
permission/helper không được dùng thay MANAGE. Safe error logging chỉ ghi error
name/context, không ghi descriptive content.

**Alternatives considered:** parse toàn bộ raw FormData với invented generic
whitelist bị loại vì không có Product requirement và không cần cho authority;
API/shared contract bị loại vì route-local server action đủ boundary; client
persistence và Profile action/permission reuse vi phạm trusted ownership.

### 6. Page-local UI section giữ ownership và exact labels

Implementation sẽ thêm ba route-local units:

- `communication-identity-model.ts` cho draft/canonical comparison;
- `_components/communication-identity-fields.tsx` cho đúng ba labeled textareas;
- `_components/communication-identity-form.tsx` cho action state, local draft và
  one-slice submit.

French labels phải chính xác:

1. `Ton & style de communication`;
2. `Façon de s’adresser aux clients`;
3. `Éléments de langage & choses à éviter`.

Section được compose độc lập sau `Équipe & culture` trong existing page stack.
Nó không merge vào `GeneralInformationForm` hoặc form/model của slice khác.
Fields dùng domain-neutral `@yuta/ui` primitives và current page spacing/grid;
không thêm selector, preset, channel/social/campaign/AI/review/CRM/moderation/
legal/scoring/taxonomy control.

Presentation theo authorization:

- no READ: không repository-load và không render section;
- READ nhưng no MANAGE: render three-value read-only/disabled presentation, có
  visible info message và không render save control;
- MANAGE: render editable textareas và đúng một Communication Identity submit
  control.

Page load bổ sung loader vào current parallel load nhưng giữ Profile load và bốn
existing slice loaders/actions/forms độc lập. Real data/mutations được giữ;
không fixture replacement hoặc client fetch path.

### 7. Canonical dirty state không phụ thuộc React key/remount

Route-local draft có đúng ba `string | null` properties. Pure canonical
comparison normalization là:

```text
canonicalCommunicationIdentityValue(value)
  value === '' -> null
  otherwise -> value unchanged
```

Dirty state so sánh từng canonicalized draft value với canonicalized accepted
baseline. Empty string và `null` cùng là canonical empty; mọi non-empty string,
kể cả whitespace-only, giữ nguyên.

Action success trả canonical saved projection. Form dùng projection đó làm
accepted baseline ngay trong current mounted component, nên các case bắt buộc là:

- initial `null` + draft `''` → not dirty;
- initial `'abc'` + draft `''` → dirty;
- initial `null` + draft `'abc'` → dirty;
- successful save canonicalize `''` thành `null` → not dirty, kể cả khi server
  value/key không đổi và component không remount.

Page có thể dùng stable key derived từ ba canonical server values để refresh
component khi revalidation nhận server state mới. Key chỉ là refresh mechanism;
dirty correctness sau local successful save dựa trên canonical saved baseline,
không dựa duy nhất vào key change. Không cần effect/timer/background write để
reset correctness.

### 8. State behavior dùng một submit và không autosave

Form state machine:

- **Initial/pristine:** draft khởi tạo từ server projection; canonical equality
  disable submit.
- **Dirty:** manual field change chỉ cập nhật browser-local draft; same submit
  enabled khi canonical draft khác accepted baseline.
- **Pending:** `useFormStatus` khóa/hiển thị loading trên chính submit control;
  không tạo submit thứ hai.
- **Success:** hiển thị French success message với status semantics; canonical
  returned projection trở thành accepted baseline và route revalidation refresh
  server projection.
- **Error:** hiển thị generic French recoverable error với alert semantics;
  giữ draft để retry; không giả vờ persist hoặc thay canonical baseline.
- **All-empty:** ba null/empty values render hợp lệ; nếu accepted baseline đã
  all-empty thì form pristine, còn khi người dùng clear một previously non-empty
  baseline thì draft all-empty là dirty và có thể whole-slice save.

Không có onChange/onBlur persistence, `useEffect` persistence, timer, optimistic
canonical write, background request hoặc autosave. Field changes không gọi
action. Exactly one form submission gọi exactly one repository whole-slice save.
Success/error use accessible `role="status"`/`role="alert"` consistent với
current YUTA UI; labels, focus order và visible focus được giữ.

### 9. Không tạo cross-module, provider hoặc cross-runtime dependency

Allowed runtime dependencies giới hạn ở route-local Backoffice code, existing
auth/tenant/session infrastructure, `@yuta/db-cloud`, Zod/Next conventions đã có
và domain-neutral `@yuta/ui` primitives.

Không thêm FK, repository call, import, shared contract, API, event, job, sync
path hoặc consumer hook tới:

- Establishment Profile data/repository;
- Marketing / Content;
- Reviews / Reputation;
- AI / automatic learning / inference;
- Facebook, Instagram, Google Business, TikTok hoặc Social;
- public website publishing;
- external provider;
- CRM/customer profiles, segmentation hoặc personalization;
- legal/compliance/moderation enforcement;
- POS;
- Site Agent;
- Display.

Source/dependency scan và scoped diff review phải chứng minh zero prohibited
relationship. Nếu implementation discovery làm một dependency trên trở thành
required, workflow phải dừng và return `CROSS_MODULE` / `NEEDS REVIEW`; Design
không cho phép giải quyết bằng hidden coupling.

### 10. Existing page và current capability behavior không đổi

Apply chỉ thêm independent Communication Identity composition. Không thay
semantics của:

- Establishment Profile authorization, loader, form, action, mutations hoặc
  repository;
- Restaurant Knowledge permission types/grants/guards;
- Concept/Histoire loader/action/model/form/repository;
- Cuisine/savoir-faire loader/action/model/form/repository;
- Expérience client loader/action/model/form/repository;
- Équipe & culture loader/action/model/form/repository;
- trusted session/tenant resolution, page shell hoặc current route behavior.

Existing tests phải tiếp tục pass. New regression evidence phải xác nhận tất cả
existing sections vẫn visible/layout-correct theo quyền hiện tại và không share
save action, draft hoặc repository mutation với slice mới.

### 11. Later VERIFY phải chứng minh schema, boundary và behavior

Sau Sensitive Design Gate approval, Tasks/Apply và VERIFY phải tạo evidence ít
nhất cho:

- exact table name, five columns, types/nullability, composite PK/FK và
  `ON DELETE RESTRICT`;
- generated migration SQL, snapshot và journal consistency;
- full migration chain từ blank guarded disposable PostgreSQL;
- missing row/all-null projection, mỗi single-value state, full three-value
  round-trip và whole-slice overwrite;
- wrong organization, wrong establishment và mismatched tenant-pair isolation;
- loader READ check trước repository access và zero call khi denied;
- MANAGE check trước parsing/persistence, OWNER success, MANAGER success, STAFF
  denial và zero persistence/revalidation trên denied path;
- Establishment Profile permission non-substitution;
- Marketing permission non-substitution bằng current source/guard evidence và,
  chỉ khi existing test infrastructure model được logical state mà không thêm
  production permission/role/principal/grant, focused authorization test;
- READ-without-MANAGE logical server path chỉ khi same safe test infrastructure
  model được; `canManage=false` component test là presentation evidence, không
  chứng minh real production principal;
- exact three-field action construction/forwarding và unrelated raw fields,
  gồm fake organization/establishment/role/permission, không được forward;
- exact-empty-to-null và whitespace preservation;
- bốn canonical dirty cases, gồm post-success not-dirty không phụ thuộc remount;
- one submit, same control pending, success/status, recoverable error/retained
  draft và no autosave/change/blur/effect/timer write;
- regression của Profile và bốn existing Restaurant Knowledge sections;
- source/dependency proof cho zero prohibited relationship.

Later VERIFY phải tạo `TECHNICAL COMPLIANCE MATRIX` trace từng Technical
Implementation Contract tới authority, affected implementation và test/check.
Browser QA không thay thế server/database/migration evidence. Nếu guarded
disposable PostgreSQL không khả dụng, VERIFY không được tuyên bố migration hoặc
tenant isolation PASS.

### 12. Real Browser QA trước Gate 3 là bắt buộc

QA dùng authenticated real route
`/etablissement/informations-generales` và real persisted data, không fixture.
Mandatory real coverage gồm:

- OWNER editable state;
- MANAGER editable state;
- populated state và valid all-empty state;
- dirty draft, successful explicit save và reload/persisted round-trip;
- đúng một visible Communication Identity save control khi MANAGE;
- không autosave observable;
- widths `1440`, `1024`, `768` và `390` theo current page pack;
- keyboard navigation, logical focus order, visible focus và accessible
  labels/names;
- success/error alert semantics khi state quan sát được;
- không horizontal overflow/clipping;
- regression visibility/layout của Establishment Profile, Concept/Histoire,
  Cuisine/savoir-faire, Expérience client, Équipe & culture và new section.

QA phải kiểm tra availability của existing safe STAFF/no-access principal. Nếu
có, section-absent behavior là required real-browser coverage. Nếu environment
không có principal đó mà không thể tạo an toàn, report chính xác
`NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT` và dùng focused automated
READ-denial evidence; không fabricate grant/principal.

Conditional real-browser states là READ-without-MANAGE, induced persistence
error/recovery và visually capturable pending state. Chỉ capture khi current
real auth/environment tạo được an toàn mà không đổi accepted production grants
hoặc cố ý làm hỏng environment. Nếu unavailable, report
`NOT_AVAILABLE_IN_CURRENT_AUTH_OR_ENVIRONMENT` và dùng approved focused
automated evidence. Unavailable conditional state riêng không làm toàn QA
`BLOCKED_BY_ENVIRONMENT`; status đó chỉ dùng khi environment ngăn hoàn thành một
mandatory scenario.

QA artifacts phải có report, screenshots thực và manifest ghi relative path,
viewport, role/state, scenario cùng lowercase SHA-256. Không fabricate
screenshots, failure hoặc pending state.

### 13. Future Apply dùng exact dirty-worktree attribution

Ngay trước Apply, workflow phải:

1. capture exact HEAD;
2. capture sorted `git status --short`;
3. record exact shared write allowlist dưới đây;
4. save exact bytes + lowercase SHA-256 cho mỗi existing allowlisted shared file;
5. record mỗi intended new file là `MISSING` trước khi tạo;
6. hash mọi existing dirty file ngoài allowlist như protected state;
7. tạo shared attribution từ saved baseline bytes tới post-Apply bytes;
8. represent attributable new implementation/test files bằng proper
   `/dev/null -> current file` diffs;
9. represent new migration SQL/snapshot tương tự và journal bằng
   baseline-to-current diff;
10. stop trên mọi unexplained path/hash/status drift.

Exact anticipated shared write allowlist:

- `packages/db-cloud/src/schema/restaurant-knowledge.ts`;
- `packages/db-cloud/src/restaurant-knowledge-repository.ts`;
- `packages/db-cloud/test/schema.test.ts`;
- `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`;
- `packages/db-cloud/drizzle/meta/_journal.json`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`;
- `apps/backoffice/test/restaurant-knowledge-loader.test.ts`;
- `docs/ui/pages/establishment-general-information/README.md`;
- `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`;
- `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`;
- `docs/ui/pages/establishment-general-information/UI_SPEC.md`;
- `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`.

Exact anticipated new non-migration files, recorded `MISSING` before Apply:

- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/communication-identity-model.ts`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-fields.tsx`;
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-form.tsx`;
- `apps/backoffice/test/communication-identity-action.test.ts`;
- `apps/backoffice/test/communication-identity-model.test.ts`;
- `apps/backoffice/test/communication-identity-fields.test.tsx`;
- `apps/backoffice/test/communication-identity-form.test.tsx`.

Expected new migration paths chỉ được xác định sau journal recheck. Nếu baseline
vẫn ở `0014`, chúng dự kiến là
`packages/db-cloud/drizzle/0015_restaurant_knowledge_communication_identity.sql`
và `packages/db-cloud/drizzle/meta/0015_snapshot.json`, cả hai phải được record
`MISSING`. Nếu tên/index khác, stop và reconcile intended allowlist trước edits.

Gate 3 phải tạo deterministic implementation diff và migration diff riêng từ
saved baseline/current bytes. Mỗi evidence phải enumerate exact sorted path
inventory; declared attributable path count phải bằng actual `diff --git`
section count. Apply/reverse integrity check phải account new files đúng cách.
Raw `git diff HEAD` không đủ và không được dùng làm sole attribution evidence.

Product Knowledge, Module Registry, feature Product Knowledge và
`docs/reviews/README.md` không thuộc Apply write allowlist; chúng là protected
read-only context. Page-pack files nêu trên chỉ được sửa để mô tả exact
implemented page behavior, không tạo Product Decision hoặc lifecycle promotion.
Post-archive Knowledge Consolidation vẫn là lane review riêng.

### 14. Lifecycle và documentation authority không được promote

Design, Tasks, Apply, VERIFY hoặc Browser QA không tự thay đổi lifecycle.
Product Knowledge và Module Registry là authority/current-state context nhưng
không được rewrite trong implementation phase của Design này. Review packets và
QA evidence là workflow evidence, không phải normative Product Knowledge.

## Risks / Trade-offs

- **[Risk] Missing row và saved all-null row có cùng observable projection** →
  Đây là intentional Spec-compatible behavior; repository tests cover cả hai và
  whole-slice save vẫn atomic.
- **[Risk] Shared implementation/docs files đã dirty từ adjacent work** → Exact
  pre-Apply byte snapshot, protected-file hashes, fixed allowlist và
  baseline-to-post diffs; unexplained drift dừng Apply.
- **[Risk] React key không đổi sau canonical-equivalent save** → Action trả
  canonical saved projection làm accepted local baseline; key chỉ refresh
  external server-state changes.
- **[Risk] Route tổng thể vẫn yêu cầu Profile READ** → Giữ existing route
  contract, đồng thời enforce Restaurant Knowledge READ trước new repository
  access; Profile permission không substitute.
- **[Risk] Additive table/migration tăng release surface** → Generated migration,
  exact SQL/snapshot/journal review và full disposable-DB migration chain.
- **[Risk] User có thể nhập claims hoặc customer-specific text** → Data model chỉ
  lưu unclassified descriptive text, không relation/inference/consumer hoặc
  enforcement; không invent content moderation.
- **[Trade-off] Dedicated table lặp composite scope columns** → Chấp nhận lặp nhỏ
  để giữ typed ownership, atomicity và executable tenant isolation thay vì
  generalized store ngoài scope.
- **[Trade-off] Không timestamps/history** → Phù hợp approved initial behavior;
  audit/provenance/history cần Product decision riêng nếu sau này cần.

## Migration Plan

1. Sau Sensitive Design Gate approval, tạo Tasks và Technical Implementation
   Contracts; không bắt đầu Apply nếu boundary/allowlist chưa hoàn chỉnh.
2. Ngay trước Apply, recheck journal/migration inventory và tạo exact attribution
   baseline theo Decision 13.
3. Bổ sung schema definition rồi dùng repository-approved Drizzle tooling để
   generate additive SQL/snapshot/journal change; review exact output trước code
   phụ thuộc table.
4. Chạy full migration chain trên guarded disposable PostgreSQL và kiểm tra
   exact schema/constraints.
5. Bổ sung repository, loader, server action, model, fields/form và page
   composition theo dependency order, rồi focused tests/regression/page-pack
   updates trong allowlist.
6. Run strict OpenSpec validation, repository checks, Technical Compliance
   Matrix và deterministic scoped diff integrity.
7. Chỉ sau technical VERIFY PASS mới chạy real Browser QA. Gate 3 chỉ được tạo
   khi required QA PASS; `yuta-run-change` không sync/archive.

Application rollback loại bỏ reference tới additive table trong một reviewed
change và giữ table/data dormant. Không destructive down migration/drop hoặc
automatic data deletion. Unexpected journal drift, migration failure hoặc
tenant-isolation failure dừng Apply/VERIFY.

## Open Questions

Không có open question ảnh hưởng Spec, selected approach hoặc future task
breakdown. Exact generated migration index/timestamp/checksum chỉ được xác định
sau pre-Apply journal recheck. Availability của safe STAFF hoặc
READ-without-MANAGE browser principal là environment fact phải report trung
thực, không phải permission decision của change.

## Lifecycle Checkpoint

Design giữ nguyên repository-authoritative Restaurant Knowledge lifecycle:

- Product Decision: `APPROVED`;
- Implementation: `PARTIAL`;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NOT_ASSESSED`;
- External Dependency: `NOT_ASSESSED`.

Design, strict validation và Sensitive Design Gate không promote bất kỳ value
nào.
````

## Selected Persistence Representation

Selected: one dedicated @yuta/db-cloud table named
restaurant_knowledge_communication_identity.

It has composite organization + establishment PK, composite FK to the same
establishment pair with ON DELETE RESTRICT, and exactly three nullable text
values: tone_and_communication_style, customer_addressing, and
language_elements_and_things_to_avoid.

No resource/customer/Marketing/channel/provider/taxonomy ID, timestamp, history
or provenance is added. Dedicated typed storage was selected because the
approved shape is stable and exact, Restaurant Knowledge is canonical owner,
one row gives atomic whole-slice save, and the composite constraint provides
executable tenant-isolation evidence. Generic JSON/key-value/taxonomy storage
was rejected because it expands shape/key space beyond the three approved
values and weakens exact schema evidence.

## Migration and Rollback

- Migration is additive and generated by repository-approved Drizzle tooling.
- Design-time journal ends at 0014_restaurant_knowledge_team_culture; Apply must
  recheck SQL/snapshot/journal before choosing the next index.
- If unchanged, 0015 SQL/snapshot are conditional expected outputs, not assumed
  facts.
- No backfill, destructive down migration or automatic drop.
- Full blank-to-current migration chain on guarded disposable PostgreSQL is
  required during later VERIFY.
- Application rollback removes code dependency while retaining additive
  table/data dormant.

## Authorization, Tenant, and Parsing

Loader checks Restaurant Knowledge READ before repository access; no READ means
no call and no render. MANAGE is derived independently. Save re-derives tenant,
requires active establishment and checks Restaurant Knowledge MANAGE before
parsing/persistence. Repository calls requireEstablishment and predicate both
trusted organization and establishment IDs.

The action reads exactly the three approved technical FormData entries,
constructs a three-property object and strict-parses that object. Unrelated raw
keys are not authority and are not forwarded; strictness does not imply raw
FormData rejection. Only exact empty string becomes null; whitespace is not
trimmed. OWNER/MANAGER grants and STAFF denial remain unchanged; Profile or
Marketing permissions never substitute.

## UI, State, and Canonical Dirty Semantics

The independent page-local section follows Équipe & culture and renders exactly
the three French-labelled textareas. No READ means absent; READ without MANAGE
is read-only with no save; MANAGE gets one whole-slice submit.

Canonical comparison maps only empty string to null. Action success returns the
canonical saved projection as accepted baseline, so post-save NOT DIRTY does not
depend on React key/remount. Pending uses the same control; success/status and
recoverable error/alert retain accessible semantics; failure retains draft.
There is no change/blur/effect/timer/background persistence, optimistic
canonical write or autosave.

## Cross-Module and Runtime Proof

No FK, repository call, import, shared contract, API, event, job, sync or
consumer hook is permitted with Establishment Profile data, Marketing/Content,
Reviews/Reputation, AI/inference, Social/public publishing, providers,
CRM/customer data, legal/moderation enforcement, POS, Site Agent or Display.
Any required dependency returns CROSS_MODULE / NEEDS REVIEW.

## Verification and Browser QA

Later VERIFY covers exact schema/migration artifacts, full disposable migration
chain, missing/all-null and single/full states, whole-slice overwrite, tenant
isolation, READ-before-repository, MANAGE-before-persistence, OWNER/MANAGER,
STAFF denial, permission non-substitution, exact field forwarding, canonical
dirty cases, one submit/no autosave, regression and zero prohibited dependency.
It must include a TECHNICAL COMPLIANCE MATRIX.

Real Browser QA is mandatory on the authenticated persisted route, including
OWNER/MANAGER, populated/all-empty, dirty/save/reload, exactly one save control,
1440/1024/768/390 widths, keyboard/focus/accessibility, observable alerts,
overflow and all existing-section regressions. Safe unavailable auth/error/
pending states are reported truthfully and never fabricated. Screenshots require
a lowercase SHA-256 manifest.

## Dirty-Worktree Attribution

Before Apply: capture HEAD/sorted status; hash exact shared allowlist bytes; mark
new paths MISSING; hash protected dirty files; build baseline-to-current and
proper /dev/null-to-current diffs; stop on unexplained drift.

The Design defines 14 exact shared paths, seven anticipated new non-migration
paths and conditional migration paths after journal recheck. Gate 3 must prove
declared path counts equal actual diff --git section counts and run correct
apply/reverse integrity checks. Raw git diff HEAD alone is not sufficient.
Product Knowledge, Module Registry, feature Product Knowledge and
docs/reviews/README.md remain protected read-only during Apply.

## Validation and Design-Stage Checks

- pnpm exec openspec validate restaurant-knowledge-communication-identity
  --strict: PASS; result: Change 'restaurant-knowledge-communication-identity'
  is valid.
- pnpm docs:check: PASS.
- pnpm architecture:check: PASS.
- pnpm -r --if-present typecheck: PASS.
- Scoped Prettier check for Design: PASS.

## Conflicts, Review Items, and Deviations

- Remaining CONFLICT: NONE.
- Remaining NEEDS REVIEW: NONE.
- Deviations from Proposal: NONE.
- Deviations from Analysis: NONE.
- Deviations from delta Spec: NONE.
- Open questions affecting approach/tasks: NONE.
- Lifecycle promotion: NONE.

## Repository Provenance and Stage Boundary

HEAD observed: 01e6ca74186f5cda389f5ca8c0700274b29d18d0.

The worktree remains heavily dirty with pre-existing work. No pre-Apply
baseline/manifest was created because Tasks are not authorized. No schema,
migration, repository, application, test, QA or Product Knowledge
implementation file was modified by Design.

## Recommendation and Stop State

Recommendation: APPROVE_SENSITIVE_DESIGN_FOR_TASKS_IF_READY.

Current stop state:
SENSITIVE DESIGN GATE — AWAITING_HUMAN_REVIEW.

No Tasks, Implementation Plan, schema/migration, implementation, tests, QA or
Apply artifacts were created. Explicit current-user Sensitive Design Gate
approval is required before Tasks may be created. Design approval alone does
not authorize Apply.
