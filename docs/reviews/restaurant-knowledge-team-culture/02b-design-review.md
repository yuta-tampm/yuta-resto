Change: restaurant-knowledge-team-culture
Gate: 2b — Sensitive Design Review
Review status: APPROVED
Created: 2026-09-01T23:54:14.1557884+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — tenant-owned Restaurant Knowledge data, database migration, canonical ownership, authorization consumption, and tenant isolation
Revision: 2
Prior review outcome: CHANGES_REQUESTED
Change request source: explicit current-user instruction
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-02T00:00:18.2051496+02:00

# Gate 2b — Sensitive Design Review

## Revision summary

Gate 2b revision 1 was returned as `CHANGES_REQUESTED`. This fresh packet
incorporates exactly two authorized Design corrections:

1. dirty state now compares canonical-equivalent values, where `''` and
   `null` are the same empty value and every non-empty string remains
   unchanged without trimming;
2. server-action parsing now distinguishes raw FormData selection from strict
   parsing of the constructed three-value object and does not claim raw
   unexpected-key rejection.

Dedicated persistence, migration, repository, authorization, UI, cross-module,
QA, attribution and lifecycle decisions are otherwise unchanged. Proposal,
Analysis and Spec remain byte-identical.

## Approved earlier gates and artifact hashes

Gate 1 và Gate 2 remain approved through explicit current-user instructions.
All earlier artifact hashes were recomputed after the change request.

Hash command: `Get-FileHash -Algorithm SHA256 -LiteralPath <path>`;
hexadecimal output normalized to lowercase.

| Repository-relative path                                                                             | SHA-256                                                            |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/restaurant-knowledge-team-culture/01-analysis-review.md`                               | `9bbe1d2fd1bfb4dbb12fce77d2fec893e70a4831898b95bb6a535f3ec8869994` |
| `docs/reviews/restaurant-knowledge-team-culture/02-specs-review.md`                                  | `b1e0c9aa253e9c2e3fa0c4ee66758ee7d2f04dae1b6edf8ce6a5e7ba3c0b0496` |
| `openspec/changes/restaurant-knowledge-team-culture/analysis.md`                                     | `7c0372d810a33b6828ad1014976d0685b35e112de6af8fedd7fdf016cf92ec95` |
| `openspec/changes/restaurant-knowledge-team-culture/proposal.md`                                     | `1538e96384b77c3cbc37a119dff4251b797744ab338175bb4d5e1c8cc8dc83d0` |
| `openspec/changes/restaurant-knowledge-team-culture/specs/restaurant-knowledge/team-culture/spec.md` | `0e7aa521a264b03cde23eefab5034d2b69019537809dd5a34f9b2b584d5b4d44` |

Gate 1 packet status: `APPROVED`.

Gate 2 packet status: `APPROVED`.

## Revised Design artifact hash

| Repository-relative path                                       | SHA-256                                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/restaurant-knowledge-team-culture/design.md` | `fe99db86abcbafa624da5a7c2a272f31d1f5a85b38ccd125202afff3a872d76d` |

Previous Design SHA-256:
`2cffc9a2e6a63e52909f6bb6332e31a383537598165dcccbfcbda41b36775c20`.

## Exact changed Design sections

### Decision 5 — Server action parsing

Revised to state that the action:

- reads exactly `valuesAndMindset`, `workingTogether` and
  `transmissionAndIntegration` from raw FormData;
- constructs a Team Culture input object only from those values;
- applies strict Zod parsing to that constructed object;
- does not treat browser organization/establishment/role/permission or
  unrelated raw entries as authority;
- does not forward unrelated raw entries to repository;
- does not add a Product requirement to reject unrelated raw FormData keys;
- does not add a generic parser, whitelist or shared contract.

### Decision 6 — Canonical dirty state

Added `canonicalTeamCultureValue` comparison semantics:

- `''` canonicalizes to `null` for comparison;
- `null` remains `null`;
- every non-empty value remains unchanged, including whitespace-only strings;
- no trim, formatting, limit or Product validation;
- dirty comparison canonicalizes both draft and server values;
- stable React key/revalidation remains a refresh mechanism but is not the sole
  correctness mechanism.

Required focused cases:

- initial `null` + draft `''` → not dirty;
- initial `'abc'` + draft `''` → dirty;
- initial `null` + draft `'abc'` → dirty;
- successful empty-to-null save → not dirty even without key change.

### Decision 9 — Later verification

Removed the raw “strict rejection of unexpected fields” claim. Verification now
requires:

- exact selection of the three approved FormData entries;
- strict parsing of the constructed three-value object;
- no forwarding of browser authority or unrelated raw fields;
- no raw-extra-key rejection Product requirement;
- pure model tests for canonical normalization/comparison;
- focused form tests for dirty/submit/reset behavior without relying only on
  remount.

No other Design section changed semantically.

## Preserved persistence and migration decisions

The Design still selects dedicated
`restaurant_knowledge_team_culture` with:

- composite PK `(organization_id, establishment_id)`;
- composite FK to `establishments(organization_id, id)`;
- `ON DELETE RESTRICT`;
- exact nullable text columns `values_and_mindset`,
  `working_together`, `transmission_and_integration`;
- no resource/employee/module IDs, taxonomy, timestamps or history;
- missing row/all-null observable equivalence;
- additive expected `0014` migration if journal baseline remains unchanged;
- no backfill or destructive rollback.

## Preserved repository, authorization, and tenant enforcement

- Trusted `TenantContext` supplies both organization and establishment.
- Repository read uses both predicates and missing projects to three nulls.
- Save is one-statement whole-slice composite-key upsert.
- READ is checked before repository access.
- MANAGE is checked before parsing/persistence.
- OWNER/MANAGER keep READ + MANAGE; STAFF default denial.
- Profile permissions do not substitute.
- Browser authority fields are ignored as authority and never forwarded.
- No new permission, API or shared contract.

## Preserved UI/state architecture

- Independent page-local section after Expérience client.
- Exactly three French-labeled textareas.
- READ-only and editable MANAGE states.
- Local draft, canonical dirty comparison, one submit.
- Pending/success/error/recovery and route revalidation.
- No autosave or change/blur/effect/timer/background persistence.
- Existing Profile and three Restaurant Knowledge slices remain independent.
- No fixtures, HR/training/employee/operational controls.

## Preserved cross-module/runtime/provider boundary

No FK, import, repository call, event, job, contract, API, consumer hook or sync
path with Personnel/Salariés, Planning, Pointage, Today, Tâches du jour,
Formalités, onboarding/training, POS, Site Agent, Display, Marketing/social or
external provider.

Any required dependency discovered later stops as
`CROSS_MODULE` / `NEEDS REVIEW`.

## Verification and Browser QA strategy

Later VERIFY retains schema/migration, state round-trip, whole-slice overwrite,
tenant isolation, auth ordering/grants, regression and zero-dependency evidence,
with the corrected parsing and canonical dirty-state tests above.

Browser QA remains mandatory on the real route at page-pack widths 1440, 1024,
768 and 390 px, with actual role/state coverage, accessibility, responsive
behavior, screenshot manifest and SHA-256 evidence. Unsupported environment or
role states must be reported truthfully; no fabricated principal or QA.

## Dirty-worktree attribution strategy

Unchanged: future pre-Apply work must snapshot status/HEAD and exact bytes/hashes
for every shared intended file, mark new files `MISSING`, keep unrelated dirty
files byte-identical, and compute Gate 3 shared-file diffs from baseline bytes
rather than HEAD. No baseline is created at Design stage.

## Remaining CONFLICT

Non-blocking broad Product Knowledge documentation drift from Gate 1 remains.
No Design-level or requirement-level `CONFLICT`.

## Remaining NEEDS REVIEW

No unresolved choice affects Specs, selected approach or task breakdown.
Prohibited future dependency/authority expansion still triggers a stop and
return to review.

## Deviations from Proposal, Analysis, or Spec

None. The revision corrects technical Design semantics without changing Product
behavior or the approved delta Spec.

## Lifecycle checkpoint

Restaurant Knowledge remains:

- Product Decision: `APPROVED`;
- Implementation: `PARTIAL`;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NOT_ASSESSED`;
- External Dependency: `NOT_ASSESSED`.

## Exact revised Design content

````markdown
## Context

Xem [`proposal.md`](./proposal.md) cho động cơ Product và delta spec
[`restaurant-knowledge/team-culture`](./specs/restaurant-knowledge/team-culture/spec.md)
cho behavioral contract. Đây là sensitive change vì bổ sung tenant-owned cloud
data trong capability có canonical ownership, authorization và tenant isolation
đã được chấp nhận.

Page `/etablissement/informations-generales` hiện compose Establishment Profile
với ba slice Restaurant Knowledge độc lập: Concept/Histoire,
Cuisine/savoir-faire và Expérience client. Runtime `apps/backoffice` đã có
trusted tenant context, hai operation `restaurant-knowledge.read` và
`restaurant-knowledge.manage`, page-local loaders/actions fail closed, cùng
repository `@yuta/db-cloud` sử dụng cả `organizationId` và `establishmentId`.
Thiết kế mới phải phù hợp các boundary hiện tại nhưng không coi technical shape
của một slice trước là template bắt buộc.

Ba value mới là descriptive establishment knowledge. Organization vẫn chỉ là
tenancy/access envelope; browser không được chọn tenant scope, role hoặc
permission. Personnel, Planning, Pointage, Today, Tâches du jour, Formalités,
onboarding/training, POS, Site Agent, Display, Marketing/social và external
provider không tham gia luồng đọc, ghi hoặc consume.

Worktree có pre-existing dirty Restaurant Knowledge work, bao gồm shared schema,
repository, page, loader, actions, tests, migration journal và page-pack files.
Apply sau Gate 2b phải snapshot exact bytes của mọi shared file dự kiến sửa và
tính attribution từ baseline đó, không nhận ownership bằng diff so với `HEAD`.

## Goals / Non-Goals

**Goals:**

- Chọn persistence representation nhỏ nhất giữ Restaurant Knowledge ownership
  cho đúng ba technical values `valuesAndMindset`, `workingTogether` và
  `transmissionAndIntegration`.
- Giữ một row theo organization + establishment scope, missing/all-empty
  projection hợp lệ và một atomic upsert cho toàn bộ slice.
- Enforce READ trước repository read và MANAGE trước persistence trong trusted
  server boundary hiện tại.
- Compose một section độc lập với local draft, dirty state, một explicit submit
  và không autosave.
- Tạo later verification/QA evidence cho tenant isolation, authorization,
  state combinations, whole-slice behavior, regression và zero prohibited
  dependency.
- Giữ change-scoped attribution chính xác trong dirty worktree.

**Non-Goals:**

- Không thay đổi permission, role, principal, tenant semantics, canonical
  ownership hoặc runtime topology.
- Không tạo shared transport contract, API route, cross-runtime contract,
  event, sync path hoặc dependency tới module khác.
- Không thêm Product validation, required content, length/format rule, enum,
  taxonomy, checklist/task/SOP, scoring, analytics, competency, employee state
  hoặc onboarding/training state.
- Không thiết kế AI/inference, provenance/history, Marketing/social,
  provider, embeddings/vector DB hoặc Restaurant Knowledge family khác.
- Không tạo Tasks, implementation baseline, schema/migration, code, tests hoặc
  QA trong Design stage.
- Không promote bất kỳ lifecycle dimension nào.

## Decisions

### 1. Dùng một dedicated Restaurant Knowledge table cho slice

`@yuta/db-cloud` sẽ sở hữu table
`restaurant_knowledge_team_culture`, có đúng các columns:

| Column                         | Type   | Nullability | Meaning                                             |
| ------------------------------ | ------ | ----------- | --------------------------------------------------- |
| `organization_id`              | `uuid` | `NOT NULL`  | Tenancy/access envelope lấy từ trusted context      |
| `establishment_id`             | `uuid` | `NOT NULL`  | Semantic establishment scope lấy từ trusted context |
| `values_and_mindset`           | `text` | nullable    | `Valeurs & état d’esprit`                           |
| `working_together`             | `text` | nullable    | `Façon de travailler ensemble`                      |
| `transmission_and_integration` | `text` | nullable    | `Transmission & intégration`                        |

Table dùng composite primary key
`(organization_id, establishment_id)` với tên
`restaurant_knowledge_team_culture_scope_pk`. Composite foreign key cùng hai
columns tham chiếu
`establishments(organization_id, id)`, tên
`restaurant_knowledge_team_culture_establishment_scope_fk`, và dùng
`ON DELETE RESTRICT`. Không có resource ID riêng, employee ID, module ID,
taxonomy key, timestamps hoặc provenance/history column.

Không có row và row có cả ba value `NULL` cùng project thành valid all-empty
state. Boundary input chỉ normalize empty string `''` thành `null`; không trim,
giới hạn độ dài, format hoặc phân loại nội dung. Whole-slice save với cả ba
`null` vẫn là một valid upsert, không tạo khác biệt observable với missing row.

**Lý do:** requirement cần một typed, atomic, one-row-per-establishment slice
với đúng ba values và independent lifecycle. Dedicated table giữ canonical
ownership ở Restaurant Knowledge, làm composite tenant constraint executable
và giới hạn migration surface. Quyết định không dựa đơn thuần vào việc các
slice trước dùng table riêng; nó dựa trên exact typed shape, whole-slice
atomicity và không có approved generalized knowledge model.

**Alternatives considered:**

- Thêm columns vào Establishment Profile bị loại vì sai canonical owner và
  permission boundary.
- Thêm columns vào table của Concept/Histoire, Cuisine/savoir-faire hoặc
  Expérience client bị loại vì trộn independent slices và làm một row sở hữu
  nhiều capability lifecycle.
- Generic key/value hoặc taxonomy table bị loại vì mở data model rộng hơn đúng
  ba values và ngầm tạo enum/taxonomy.
- JSON column/store bị loại vì làm yếu exact-field schema evidence, mở shape
  ngoài scope và không đem lại lợi ích cho ba stable values.
- Personnel/Formalités hoặc operational table bị loại vì sai ownership và tạo
  prohibited dependency.

### 2. Migration additive tiếp theo, không backfill và rollback không phá dữ liệu

Nếu journal vẫn kết thúc ở `0013_restaurant_knowledge_customer_experience` tại
pre-Apply baseline, Drizzle migration kế tiếp dự kiến là
`0014_restaurant_knowledge_team_culture.sql`, kèm journal entry và
`0014_snapshot.json` do tooling tạo. Nếu journal hoặc baseline đã drift, Apply
phải dừng và reassess thay vì ghi đè hoặc tự chọn migration number khác.

Migration chỉ `CREATE TABLE` và thêm composite FK nêu trên. Không alter hoặc
backfill Profile, Personnel, các Restaurant Knowledge table hiện hữu hay dữ
liệu module khác. Existing establishments không có row mới và tự project thành
all-empty khi application đọc.

Migration phải chạy trước application version phụ thuộc table và được thử trên
disposable PostgreSQL từ full current migration chain. Migration failure phải
fail closed trước application dependency.

Rollback ưu tiên application rollback: code cũ bỏ qua additive table trong khi
table/data được giữ dormant để tránh mất nội dung. Change này không tạo
destructive down migration hay automatic drop. Drop/export/delete, nếu từng
cần, là change riêng với explicit data decision. Trong local/disposable
environment chưa có user data, một verified manual cleanup có thể drop table
chỉ như test recovery, không phải production rollback contract.

### 3. Repository boundary dùng trusted scope và một whole-slice upsert

`@yuta/db-cloud` sẽ bổ sung internal package type:

```text
RestaurantKnowledgeTeamCultureInput
  valuesAndMindset: string | null
  workingTogether: string | null
  transmissionAndIntegration: string | null
```

Repository có đúng hai slice operations:

- get projection theo trusted `TenantContext`;
- save toàn bộ projection theo cùng trusted `TenantContext`.

Cả hai gọi `requireEstablishment(context)` trước query. Read select đúng ba
columns với predicates đồng thời:

```text
organization_id = context.organizationId
AND establishment_id = context.establishmentId
```

Read không nhận resource ID hoặc scope từ browser và trả object có cả ba value
`null` khi không có row. Save nhận một object chứa cả ba values, insert trusted
scope và dùng one-statement upsert target vào composite primary key; update set
cả ba columns và return whole projection. Một statement giữ whole-slice
atomicity; không có per-field repository mutation.

Composite FK bảo đảm organization + establishment pair tồn tại. Wrong-scope
read không leak row; wrong organization/establishment pair không được dùng để
ghi row hợp lệ. Focused tests phải chứng minh isolation thay vì dựa vào FK như
bằng chứng duy nhất.

**Alternatives considered:** per-field mutations bị loại vì phá one-save
atomicity; lookup bằng establishment ID riêng bị loại vì tenant bypass; hidden
scope fields bị loại vì browser không phải authority; reuse Profile/Personnel
repository bị loại vì sai canonical boundary.

### 4. Loader enforce READ trước repository và derive MANAGE riêng

Page-local `restaurant-knowledge-loader.ts` sẽ có loader riêng cho Team Culture.
Thứ tự bắt buộc:

1. kiểm tra `restaurant-knowledge.read` trên trusted tenant;
2. nếu không có READ, trả `null` và không gọi repository;
3. nếu có READ, gọi repository get;
4. derive `canManage` riêng bằng `restaurant-knowledge.manage`;
5. trả projection + `canManage` cho page.

Page chỉ render section khi loader trả non-null. Existing route-level Profile
READ guard được giữ để không regress route, nhưng không được coi là Restaurant
Knowledge READ. OWNER/MANAGER current grants cho phép load và manage; STAFF
default denial khiến loader không đọc repository và section không render.

Không introduce new permission, role, principal, admin/support bypass hoặc
section-specific authorization. Nếu future grant matrix tạo READ-without-MANAGE
principal, cùng loader đã hỗ trợ read-only state mà không đổi design.

### 5. Server action tái derive tenant và require MANAGE trước persistence

Một page-local server action riêng sẽ:

1. gọi `requireAuthenticatedTenant('/etablissement/informations-generales')`;
2. gọi `requireEstablishment(tenant)`;
3. gọi `requireRestaurantKnowledgePermission(tenant,
'restaurant-knowledge.manage')` trước parse/repository access;
4. đọc đúng ba raw FormData entries `valuesAndMindset`, `workingTogether` và
   `transmissionAndIntegration`, rồi construct Team Culture input object chỉ từ
   ba entries đó;
5. parse constructed object bằng strict Zod schema với ba `string | null`
   properties;
6. normalize chỉ empty string thành `null` tại technical boundary;
7. gọi đúng một whole-slice repository save với parsed three-value object;
8. chỉ sau save success mới revalidate current route và trả success state;
9. trả error state không chứa sensitive data nếu parse hoặc persistence fail.

Browser-supplied organization, establishment, role, permission và mọi unrelated
raw FormData entry không phải authority, không được đưa vào constructed Team
Culture input object và không được forward tới repository. Zod strictness áp
dụng cho constructed object, không phải toàn bộ raw FormData. Change này không
tạo Product requirement phải reject unrelated raw FormData keys và không tạo
generic form parser/whitelist hoặc shared contract mới. Profile permissions
không được gọi hoặc dùng thay MANAGE. Zod parsing chỉ bảo vệ approved input
shape và không thêm Product validation. Error logging chỉ ghi safe error
name/context, không ghi descriptive content.

**Alternatives considered:** API route/shared contract mới không cần thiết;
client persistence và Profile action/permission reuse vi phạm trusted boundary;
parse rồi cho phép unauthorized repository call bị loại vì MANAGE phải gate
persistence.

### 6. Page-local section giữ draft, dirty state và một submit

Route-local model sẽ có `TeamCultureDraft` với đúng ba `string | null` values,
pure update functions và một canonical comparison normalization nhỏ:

```text
canonicalTeamCultureValue(value)
  value === '' -> null
  otherwise -> value unchanged
```

Normalization này chỉ phục vụ canonical equality: empty string và `null` compare
như cùng empty value; mọi non-empty string, kể cả whitespace-only string, giữ
nguyên. Nó không trim, format, limit hoặc thêm Product validation. Dirty state
so sánh từng canonicalized draft value với canonicalized server value, thay vì
raw exact `string | null` representation.

Focused canonical behavior:

- initial `null` + draft `''` → not dirty;
- initial `'abc'` + draft `''` → dirty;
- initial `null` + draft `'abc'` → dirty;
- sau successful save normalize `''` thành `null` → not dirty.

UI gồm hai route-local components:

- fields component render đúng ba labeled `Textarea` với French labels;
- form component sở hữu local draft, action state và one-slice submit.

Section được compose sau `Expérience client` trong existing page stack, không
merge vào `GeneralInformationForm` hoặc form của slice khác. Page load thêm
Team Culture loader vào existing parallel load và có thể tạo stable key từ ba
server values để revalidation refresh initial/draft state. Stable key là refresh
mechanism, không phải correctness condition của dirty state: nếu canonical
server value không đổi và component không remount, canonical comparison vẫn
phải báo trạng thái tương đương là not dirty.

State architecture:

- **READ-only:** section chỉ tồn tại khi READ; nếu `canManage=false`, textareas
  disabled/read-only presentation, info message hiển thị và không render save
  control.
- **Editable:** nếu MANAGE, ba textareas update local draft độc lập.
- **Dirty:** canonical-equivalent comparison enable một submit control chỉ khi
  ít nhất một canonical value khác server projection; `null` và `''` không tạo
  false dirty state.
- **Pending:** `useFormStatus` khóa/hiển thị loading trên cùng submit, không tạo
  submit thứ hai.
- **Success:** action trả French success message; route revalidation lấy lại
  canonical server projection. Dirty correctness sau success không phụ thuộc
  riêng vào stable key/remount.
- **Error:** action trả visible recoverable error; draft vẫn ở client để người
  dùng retry, không giả vờ persist.
- **All-empty:** ba null render thành ba empty textareas hợp lệ.
- **Loading:** initial data vẫn theo existing Server Component route behavior;
  không thêm fixture, client fetch hoặc synthetic loading state riêng.

Không có `useEffect` persistence, on-change/on-blur action, timer, optimistic
write, background request hoặc autosave. Không có employee selector, training
status, HR control, checklist, task, score, taxonomy, onboarding progress hoặc
operational workflow.

### 7. Existing page và capability boundaries được giữ nguyên

Apply chỉ thêm Team Culture composition. Nó không thay đổi semantics của:

- Establishment Profile loader, READ/MANAGE guards, form, action hoặc
  repository;
- Restaurant Knowledge authorization helpers/grants;
- Concept/Histoire loader, action, form/model hoặc repository;
- Cuisine/savoir-faire loader, action, form/model hoặc repository;
- Expérience client loader, action, form/model hoặc repository;
- trusted session/tenant resolution hoặc route shell.

Không thay real data bằng fixtures. Existing focused tests phải tiếp tục pass;
new regression assertions sẽ kiểm tra bốn Restaurant Knowledge sections cùng
compose mà không share mutations hoặc permission substitutes.

### 8. Không tạo cross-module, cross-runtime hoặc provider dependency

Allowed implementation dependencies giới hạn ở page-local Backoffice code,
existing auth/tenant infrastructure, `@yuta/db-cloud`, Zod/Next conventions đã
có và reusable domain-neutral `@yuta/ui` primitives.

Không thêm FK, repository call, import, event, job, shared contract, API,
consumer hook, sync path hoặc required consumer đối với:

- Personnel / Salariés;
- Planning;
- Pointage;
- Today;
- Tâches du jour;
- Formalités;
- onboarding/training workflows;
- POS;
- Site Agent;
- Display;
- Marketing, Facebook, Instagram hoặc social channels;
- external provider.

Source/dependency scan và scoped diff review phải chứng minh zero prohibited
relationship. Nếu implementation discovery làm một dependency trong danh sách
trở thành required, Apply không được bắt đầu/tiếp tục: return
`CROSS_MODULE` / `NEEDS REVIEW` về authority gate.

### 9. Later verification phải trace requirement tới technical evidence

Sau Gate 2b approval và Apply, VERIFY phải có ít nhất:

- **Schema exactness:** table/column names, three nullable text columns,
  composite PK/FK, restrict delete và absence của extra employee/module fields.
- **Migration:** full chain chạy trên guarded disposable PostgreSQL; schema
  inspection và migration journal/snapshot review.
- **Repository states:** missing/all-empty, từng single-value state, full
  three-value round-trip và whole-slice overwrite.
- **Tenant isolation:** wrong organization, wrong establishment và mismatched
  organization/establishment pair không read/write/leak.
- **Read boundary:** no READ trả null và repository mock không được gọi; OWNER
  và MANAGER read; STAFF denied; Profile permission không substitute.
- **Write boundary:** MANAGE được check trước persistence; OWNER/MANAGER save;
  STAFF, READ-only và Profile-MANAGE-only paths không gọi repository save.
- **Parsing:** action đọc đúng ba approved FormData entries, construct và strict
  parse đúng three-value object, empty-to-null, không forward browser authority
  hoặc unrelated raw fields, và không thêm raw-extra-key rejection Product
  requirement hay length/format/content rule.
- **Interaction:** all-empty, từng single value, full draft, independent edits,
  canonical-equivalent dirty state, one submit, one action invocation,
  pending/success/error và không action trên change/blur.
- **Canonical dirty cases:** initial `null` + draft `''` not dirty; initial
  `'abc'` + draft `''` dirty; initial `null` + draft `'abc'` dirty; successful
  empty-to-null save not dirty even when stable key does not change. Pure model
  tests cover normalization/comparison, and focused form tests cover submit
  enablement/reset behavior without relying only on remount.
- **Regression:** Profile và ba existing knowledge slices giữ loader/action,
  form và tests; page render không merge data boundaries.
- **Dependency evidence:** no prohibited module/runtime/provider import, FK,
  event, contract, API, sync path hoặc consumer.
- **Required checks:** targeted Backoffice/db-cloud tests, guarded migration
  suite, typechecks/builds và repository docs/architecture checks phù hợp, với
  exact command/exit result.

Technical Compliance Matrix sau Apply phải map từng rule Design trên tới source,
implementation và test/check evidence. Browser QA không được dùng thay server,
repository hoặc migration verification.

### 10. Later Browser QA dùng real route và page-pack viewports

Vì `UI_AFFECTING: YES`, Browser QA là mandatory trước Gate 3 và phải dùng real
authenticated `/etablissement/informations-generales` với persisted data gần
thực tế nhất, không fixture replacement. Page pack yêu cầu captures tại widths:

- 1440 px desktop;
- 1024 px tablet;
- 768 px narrow tablet;
- 390 px mobile.

Ghi rõ viewport height trong manifest. QA phải cover, khi repository/environment
hỗ trợ thật:

- OWNER populated và all-empty states;
- MANAGER editable state;
- STAFF/no Restaurant Knowledge access và absence của repository-backed
  section behavior;
- READ-only state chỉ khi có principal/grant được repository hỗ trợ mà không
  đổi permission contract; nếu không có, report limitation và dùng focused
  component/server tests thay vì fabricate browser principal;
- dirty draft trước save;
- pending/success/error/recovery;
- successful save và reload/round-trip khi database khả dụng;
- exactly one submit, no autosave và existing section regression;
- keyboard tab order, visible focus, accessible labels/names, disabled state,
  alert semantics và basic screen-reader structure;
- responsive reflow, long French copy, no horizontal overflow/clipping và
  existing page shell/forms.

Mỗi screenshot phải là actual browser evidence, có repository-relative path,
viewport, role/state, scenario và lowercase SHA-256 trong manifest, đồng thời
được link từ QA report. Không claim QA trong Design. Nếu environment, database
hoặc role state không khả dụng sau safe recovery, report
`BLOCKED_BY_ENVIRONMENT`; không simulate và không phát Gate 3 ready packet.

### 11. Pre-Apply dirty-worktree attribution là bắt buộc nhưng chưa tạo ở Design

Ngay trước future Apply, workflow phải:

1. capture sorted `git status --short` và current `HEAD`;
2. xác định exact intended shared-file allowlist từ Tasks/Technical Contracts;
3. lưu exact bytes và lowercase SHA-256 của từng shared file dự kiến sửa, gồm
   tối thiểu current schema, repository, migration journal/latest snapshot,
   page, loader, actions, affected shared tests và page-pack docs;
4. lưu trạng thái `MISSING` cho intended new files trước khi tạo;
5. verify mọi unrelated dirty file byte-identical trong Apply;
6. tính shared-file Gate 3 diff từ saved pre-Apply bytes tới post-Apply bytes,
   không từ `HEAD` đơn thuần;
7. include untracked/new files trực tiếp trong scoped diff và hash;
8. stop nếu path, bytes hoặc status drift ngoài edits do change này.

Expected directly attributable new files có thể gồm Team Culture model,
fields/form components, focused tests, migration SQL và new snapshot. Shared
files không được coi toàn bộ là thuộc change chỉ vì Apply thêm hunk vào chúng.

Design stage không tạo baseline directory/manifest vì Tasks chưa xác định final
intended allowlist và user chỉ authorize Design. Gate 2b packet chỉ ghi strategy
và chứng minh chưa có implementation baseline/artifact nào được tạo.

## Risks / Trade-offs

- **[Risk] Missing row và saved all-null row có cùng observable projection** →
  Đây là intentional Product-compatible behavior; repository tests cover cả
  hai và whole-slice save vẫn atomic.
- **[Risk] Shared files đã dirty từ adjacent slices** → Pre-Apply byte snapshot,
  explicit allowlist và baseline-to-post diff; unexpected drift dừng Apply.
- **[Risk] Additive table tạo migration surface** → Generated next migration,
  full disposable-DB chain, schema exactness review và migration-before-app
  ordering.
- **[Risk] Route tổng thể vẫn yêu cầu Profile READ** → Giữ existing route
  contract để tránh regression, nhưng enforce Restaurant Knowledge READ trước
  Team Culture repository access và không dùng Profile permission thay thế.
- **[Risk] Disabled textareas có thể làm read-only state khó phân biệt** → Giữ
  visible info message, labels và tests/accessibility QA; không tạo permission
  hoặc alternate data path mới.
- **[Risk] User text có thể mô tả cá nhân hoặc workflow dù model không support**
  → Store only unclassified text, không entity relation/inference/consumer;
  Product content moderation/validation không được invent trong change này.
- **[Trade-off] Dedicated table lặp composite scope columns** → Chấp nhận sự
  lặp nhỏ để có typed isolation, exact ownership và atomic save thay vì generic
  abstraction ngoài scope.
- **[Trade-off] Không timestamps/history** → Phù hợp approved initial behavior;
  provenance/audit/history cần Product decision riêng nếu sau này cần.

## Migration Plan

1. Sau Gate 2b approval, tạo Tasks/Technical Contracts trước và dừng nếu owner,
   boundary hoặc intended file scope chưa rõ.
2. Ngay trước Apply, tạo exact pre-Apply attribution snapshot theo Decision 11.
3. Bổ sung schema definition và generate additive migration/snapshot kế tiếp
   journal baseline; không hand-edit deployed migrations.
4. Chạy full migration chain trên guarded disposable PostgreSQL và kiểm tra
   exact table/constraints trước repository work.
5. Bổ sung repository read/whole-slice save, loader, server action, model,
   fields/form và page composition theo dependency order.
6. Bổ sung focused schema/repository/auth/action/model/form/regression tests và
   current documentation/page-pack updates trong approved implementation scope.
7. Run VERIFY và Technical Compliance Matrix, sau đó real Browser QA theo page
   pack; không conflating technical PASS với QA.
8. Chỉ tạo Gate 3 khi compliance + VERIFY PASS và required QA PASS; không sync
   hoặc archive trong `yuta-run-change`.

Application rollback bỏ reference tới additive table trong một reviewed change
và giữ data dormant. Không destructive down migration/drop. Migration failure
hoặc unexpected journal drift dừng release/Apply trước khi app phụ thuộc table.

## Open Questions

Không có open question ảnh hưởng Specs, selected approach hoặc future task
breakdown. Exact generated snapshot checksum và migration timestamp là tooling
output tại Apply; chúng không thay đổi table shape hoặc Design. Availability
của một real READ-without-MANAGE browser principal là environment capability
cần report truthfully trong QA, không phải permission decision của change này.

## Lifecycle Checkpoint

Design giữ nguyên Restaurant Knowledge lifecycle:

- Product Decision: `APPROVED`;
- Implementation: `PARTIAL`;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NOT_ASSESSED`;
- External Dependency: `NOT_ASSESSED`.

Design, strict validation hoặc Gate 2b review không promote bất kỳ value nào.
````

## Validation

Strict OpenSpec command:

```text
pnpm exec openspec validate restaurant-knowledge-team-culture --strict
```

Exact result:

```text
Change 'restaurant-knowledge-team-culture' is valid
```

Exit code: `0`.

Re-run Design-stage repository checks:

```text
pnpm docs:check
Documentation consistency check passed (36 current documents).

pnpm architecture:check
Architecture check passed: runtime imports, database URLs, client boundaries, and migration baselines are valid.

pnpm -r --if-present typecheck
Scope: 15 of 16 workspace projects
All 15 participating workspace projects completed typecheck successfully.
```

Each command exited with code `0`.

## Scope checkpoint

Only `design.md` and this Gate 2b packet were revised for the two authorized
corrections. Proposal, Analysis, Spec and earlier approved packets were
unchanged. No Tasks, Implementation Plan, Technical Implementation Contract,
pre-Apply baseline, schema, migration, implementation code, tests, QA, sync or
archive artifact was created.

## Recommendation and required human action

Recommendation: re-review the canonical dirty-state and constructed-object
parsing corrections together with the preserved Design.

Required approval phrase: `APPROVE Gate 2b`.
