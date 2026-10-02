Change: restaurant-knowledge-cuisine-know-how
Gate: 2b — Design Review
Review status: APPROVED
Created: 2026-08-31T12:25:44.7589157+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — tenant-owned Restaurant Knowledge data, database migration, canonical ownership, authorization consumption, and tenant isolation
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-08-31T12:44:26.8046813+02:00

# Gate 2b — Design Review

## Approved earlier gates and artifact hashes

Gate 1 and Gate 2 were approved through explicit current-user instructions.
All earlier reviewed artifact hashes were recomputed before Design and matched
their approved packets.

Hash command: `Get-FileHash -Algorithm SHA256 -LiteralPath <path>`; hexadecimal
output normalized to lowercase.

| Repository-relative path                                                                                     | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/restaurant-knowledge-cuisine-know-how/01-analysis-review.md`                                   | `5f374035d75a06069ccf7ddda63d1eaf9fbad212eb79019803476fa6b857a45f` |
| `docs/reviews/restaurant-knowledge-cuisine-know-how/02-specs-review.md`                                      | `400c035da135e2be5e5962d96269b5b2eb40e7a784b2169112c78f618f641c8a` |
| `openspec/changes/restaurant-knowledge-cuisine-know-how/analysis.md`                                         | `fbf4fabcc6ef28420c33b42db89608dacfa6a9accb52ef39cde183628c9fe6a7` |
| `openspec/changes/restaurant-knowledge-cuisine-know-how/proposal.md`                                         | `48a1c22588d7785520cd0fbc99aaf1845029bafbf84675888fc3e2a8b96d4b1d` |
| `openspec/changes/restaurant-knowledge-cuisine-know-how/specs/restaurant-knowledge/cuisine-know-how/spec.md` | `5b923da9db3095d1e216301875cb4d3d247763fb4ba5f0b6bb3c291f1b1444e7` |

Gate 1 packet status: `APPROVED`.

Gate 2 packet status: `APPROVED`.

## Design artifact hash

| Repository-relative path                                           | SHA-256                                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `openspec/changes/restaurant-knowledge-cuisine-know-how/design.md` | `ecc8eb49d983ce2fb71b7e66590bd37e18c3b0f2515a676b2d0b04511d8e25c6` |

## Design summary

- Add one dedicated Restaurant Knowledge cloud table containing the composite
  organization/establishment scope plus exactly three nullable descriptive
  values.
- Keep whole-slice read/upsert in the existing Restaurant Knowledge repository
  boundary; missing persistence maps to the valid three-empty state.
- Use a page-local loader and server action. READ gates load/view; MANAGE gates
  edit/save; browser scope values are never authority.
- Render a distinct route-local form with three independent browser drafts and
  one explicit submit. Field changes never persist.
- Do not add a shared contract, API, permission, taxonomy, Profile inheritance,
  menu/POS dependency, provider, or cross-runtime path.
- Use Concept/Histoire only for accepted invariants and UI patterns, not as a
  generic table/form contract or mechanical copy source.

## Security, data, and runtime implications

- Data remains owned by Restaurant Knowledge in `@yuta/db-cloud`, semantically
  scoped to an establishment with Organization as tenancy/access envelope.
- Composite primary/foreign scope and repository predicates use both
  `organizationId` and `establishmentId`; resource-ID-only access is not added.
- Existing server-derived tenant/session/membership enforcement is preserved.
  No browser organization, establishment, role, permission, or membership
  input is accepted as authority.
- Existing `restaurant-knowledge.read` and
  `restaurant-knowledge.manage` operations are consumed unchanged. OWNER and
  MANAGER retain both; STAFF retains no Restaurant Knowledge access by default.
- Establishment Profile data, repository and permissions remain independent.
- `Carte & menus`, POS, local DB, public apps and external providers receive no
  import, query, foreign key, link, sync, canonical copy or runtime behavior.

## Migration and rollback

The migration is additive: one new cloud table, three nullable descriptive
columns and composite tenant constraints. No deployed migration is edited and
no existing table/data is transformed.

Deployment order is migration then application wiring, with schema/journal,
architecture, disposable-database migration, tenant-isolation and page tests.
An old application version ignores the additive table.

Application rollback returns to the prior version while preserving the new
table and any entered data. The workflow does not auto-drop the table. A
schema removal, if ever required before production use, needs a separately
reviewed corrective forward migration after confirming or backing up data.

## Unresolved choices and stop-condition review

No unresolved choice affects Specs, approach or task breakdown. Generated
migration filename is tooling-owned and does not affect Design.

The Design does not require a shared contract, new permission, changed tenancy
boundary, changed canonical ownership, `Carte & menus` dependency or
cross-runtime behavior. Therefore no stop condition was triggered.

## Exact Design content

```markdown
## Context

Xem [proposal.md](proposal.md) cho động cơ và
[delta Spec](specs/restaurant-knowledge/cuisine-know-how/spec.md) cho behavioral
contract.

Page `/etablissement/informations-generales` hiện compose Establishment Profile
với slice Restaurant Knowledge `Concept & histoire`. Slice hiện có chứng minh
các repository invariants có thể tái sử dụng: cloud persistence thuộc
`@yuta/db-cloud`, trusted organization + establishment scope, dedicated
Restaurant Knowledge permission checks, page-local server boundary, browser
draft và explicit save. Tuy nhiên table, repository operations và UI form hiện
có chỉ sở hữu Concept/Histoire; chúng không phải generic contract cho mọi
knowledge family.

`Cuisine & savoir-faire` là một slice độc lập gồm đúng ba giá trị mô tả. Design
phải chọn technical persistence representation mà không chuyển ownership sang
Establishment Profile, không gắn với `Carte & menus`/POS và không thêm Product
validation hoặc taxonomy.

## Goals / Non-Goals

**Goals:**

- tạo một Restaurant Knowledge persistence slice riêng cho đúng ba giá trị đã
  phê duyệt;
- giữ read/write tenant isolation bằng cả `organizationId` và
  `establishmentId` lấy từ trusted server context;
- dùng READ cho load/view và MANAGE cho edit/save mà không sửa grant matrix;
- giữ ba browser drafts độc lập, một whole-slice explicit save và no autosave;
- tích hợp section mới vào page composed hiện tại mà không trộn form, action,
  repository hoặc canonical ownership với Establishment Profile hay
  Concept/Histoire;
- cung cấp verification cho empty/single-value states, tenant isolation,
  authorization, one-save/no-autosave và menu/POS separation.

**Non-Goals:**

- shared transport contract, API route hoặc reusable cross-runtime adapter;
- permission, role, principal, section-level grant hoặc tenancy semantic mới;
- quan hệ, foreign key, import, query, link hoặc sync tới dish/product/menu/POS
  operational data;
- validation về requiredness, length, format, taxonomy, enum, checklist hoặc
  structured product relationship;
- AI, automatic learning, reviews/corrections ingestion, provenance/history,
  Marketing/social, provider hoặc vector infrastructure;
- refactor tổng quát các Restaurant Knowledge slices thành framework mới.

## Decisions

### 1. Một dedicated cloud table cho riêng Cuisine & savoir-faire

Tạo table `restaurant_knowledge_cuisine_know_how` trong Restaurant Knowledge
schema boundary với đúng năm columns kỹ thuật:

- `organization_id` UUID, not null;
- `establishment_id` UUID, not null;
- `cuisine_description` nullable text;
- `know_how_particularities` nullable text;
- `homemade` nullable text.

`organization_id + establishment_id` là composite primary key và composite
foreign key tới canonical establishment scope. Foreign key dùng existing
restrict behavior. Không có menu/product reference, generic JSON payload,
classification field, timestamps, provenance hoặc audit columns.

Ba nullable text columns là storage representation cho manual descriptive
input, không phải Product validation hay taxonomy. Missing row và row có cả ba
columns null đều project thành valid empty slice. Empty form strings được
normalize thành null tại server boundary; whitespace/content khác không bị áp
thêm length, trim hoặc format rule.

**Alternatives considered:**

- Thêm columns vào `restaurant_knowledge_concept_history`: loại bỏ vì coupling
  hai slices có save lifecycle độc lập và làm table ownership/name không còn
  trung thực.
- Generic key/value hoặc JSON knowledge table: loại bỏ vì sẽ tạo taxonomy và
  generic storage contract chưa được Product/architecture phê duyệt.
- Lưu trên `establishments`: loại bỏ vì vi phạm canonical ownership.
- Derive hoặc link từ `Carte & menus`/POS: loại bỏ vì vi phạm explicit module và
  runtime boundary.

Thiết kế dùng cùng tenant-key invariant với Concept/Histoire vì đó là accepted
cloud rule, nhưng không copy table hoặc giả định hai slices có chung lifecycle.

### 2. Repository API sở hữu whole-slice read/upsert

Mở rộng Restaurant Knowledge repository hiện có bằng một input/projection gồm
đúng ba nullable values và hai operations bounded:

- get slice theo trusted `TenantContext`;
- save toàn bộ slice bằng một upsert theo composite scope.

Cả hai operations gọi establishment guard và dùng đồng thời organization và
establishment predicates. Read thiếu row trả về ba null. Save nhận toàn bộ
slice và trả canonical saved projection. Không có lookup theo resource ID,
partial-field mutation hoặc generic repository abstraction.

**Alternative considered:** ba field-level mutations bị loại bỏ vì trái với
one-explicit-save contract và làm tăng nguy cơ partial persistence.

### 3. Page-local server loader/action, không shared contract hoặc API

Thêm một Cuisine/know-how loader trong route-owned Restaurant Knowledge server
logic:

- nếu thiếu `restaurant-knowledge.read`, trả về không có section và không query
  repository;
- nếu có READ, load slice và derive `canManage` bằng đúng
  `restaurant-knowledge.manage`.

Thêm một page-local server action cho save:

1. re-derive authenticated tenant context;
2. require establishment context;
3. require `restaurant-knowledge.manage` trước persistence;
4. parse đúng ba form values với route-local Zod schema, chỉ bảo đảm boundary
   type và normalize empty string thành null;
5. gọi repository whole-slice save đúng một lần;
6. revalidate `/etablissement/informations-generales` sau success.

Action không nhận organization/establishment/membership/role/permission từ
browser và không gọi Establishment Profile hoặc menu/POS code. Không thêm
contract vào `@yuta/contracts` vì không có consumer ngoài page/runtime hiện
tại.

Page tiếp tục giữ current profile page guard cho composed route, nhưng section
visibility và mutation được quyết định độc lập bằng Restaurant Knowledge READ
và MANAGE. Profile permission không được truyền hoặc dùng như substitute cho
knowledge authorization.

**Alternatives considered:** API route/shared DTO bị loại bỏ vì không có shared
consumer; reuse profile action bị loại bỏ vì sẽ trộn authorization và
canonical ownership.

### 4. Một route-local form riêng với ba controlled drafts

Render một Restaurant Knowledge card riêng cho `Cuisine & savoir-faire` sau
section `Concept & histoire`, không nhập nó vào numbered Establishment Profile
sections. Form có đúng ba labeled controls:

- `Description de la cuisine`;
- `Savoir-faire & particularités`;
- `Fait maison`.

Mỗi control giữ browser-local draft riêng. Dirty state là phép so sánh ba draft
values với canonical loaded values. Khi không có MANAGE, controls ở read-only/
disabled presentation và không render save action. Khi có MANAGE, form render
đúng một submit control cho toàn slice, disabled khi pristine hoặc pending theo
existing application pattern.

Không có `onBlur` save, timer, effect, background request hoặc call từ field
change handlers. Submit failure giữ draft để người dùng retry; success dùng
route revalidation và canonical props để reset form state theo pattern hiện có.

Concept/Histoire UI được dùng làm evidence cho interaction/accessibility
patterns, nhưng implementation mới có model, field group và form ownership
riêng. Chỉ route-local presentation primitive thực sự trung lập mới được share;
không tạo generic Restaurant Knowledge form framework trong change này.

### 5. Verification phân lớp theo boundary

- Schema tests xác nhận exact table columns, nullable descriptive values,
  composite primary key/foreign key và absence khỏi `establishments` profile
  columns.
- Repository integration tests xác nhận missing-row empty state, mỗi single-
  value state, all-empty save, whole-slice round trip, wrong organization,
  wrong establishment và mismatched composite-scope denial.
- Loader tests xác nhận OWNER/MANAGER load; STAFF không load hoặc trigger DB
  read; `canManage` dùng MANAGE operation.
- Action tests xác nhận OWNER/MANAGER gọi whole-slice save một lần; empty values
  normalize thành null; STAFF bị deny trước persistence; profile/menu
  repositories không được gọi.
- Model/component tests xác nhận ba drafts độc lập, đúng một submit, pristine
  behavior, read-only presentation, pending/failure behavior và không có
  persistence từ field changes.
- Existing authorization, Concept/Histoire và Establishment Profile tests tiếp
  tục là regression suite. Không sửa permission mapping.

### 6. Documentation cập nhật current truth nhưng không promote lifecycle ngoài evidence

Apply cập nhật page Product Knowledge, Establishment Product Knowledge, Module
Registry và general-information page pack để mô tả slice mới, exact ownership,
permissions, persistence boundary và exclusions. Đồng thời sửa stale
Concept/Histoire Implemented State statements đã ghi trong Analysis.

Restaurant Knowledge tổng thể vẫn `PARTIAL` vì các knowledge families khác
chưa implemented. Environment và Production Readiness không được promote.

## Risks / Trade-offs

- **[Risk] Dedicated table tạo thêm schema surface** → Giữ table đúng một row
  mỗi organization/establishment và đúng ba nullable values; không thêm generic
  abstraction hoặc metadata.
- **[Risk] Composite tenant predicate bị bỏ sót ở một code path** → Repository
  là data-access boundary duy nhất và integration tests cover cross-
  organization, cross-establishment cùng mismatched composite scope.
- **[Risk] Một field change vô tình persist riêng** → Chỉ expose whole-slice
  repository save/action; component tests chứng minh field handlers chỉ đổi
  local draft.
- **[Risk] Form mới bị copy cứng từ Concept/Histoire và drift** → Reuse semantic
  UI primitives/patterns, nhưng giữ slice-specific model và tests; không copy
  field names, data object hoặc action.
- **[Risk] “Fait maison” bị diễn giải thành boolean/taxonomy** → Persist và render
  nó như optional manual descriptive content, không checkbox, enum hay derived
  menu claim.
- **[Risk] Page composition bị hiểu là Profile permission inheritance** → Loader
  và action luôn check Restaurant Knowledge operations riêng; regression tests
  giữ Profile and Knowledge boundaries độc lập.
- **[Risk] Migration đã apply nhưng application rollback** → Additive table
  không ảnh hưởng Concept/Histoire/Profile. Old application ignores table; data
  được giữ cho forward recovery.

## Migration Plan

1. Thêm schema definition và một new forward-only cloud migration tạo dedicated
   table/composite constraints; không sửa migration đã deploy.
2. Chạy schema, architecture và migration-journal checks trước repository/UI
   wiring.
3. Deploy migration trước hoặc cùng application version. Vì table mới additive
   và không có read/write từ old version, mixed-version window không thay đổi
   behavior hiện có.
4. Deploy repository, loader/action, UI và documentation/tests.
5. Verify migration apply trên disposable/test cloud database, tenant-isolation
   integration tests và page-level authorization/interaction tests.

Rollback application bằng cách quay lại version trước; table mới không được old
code sử dụng. Không drop table tự động để tránh mất dữ liệu đã nhập. Nếu schema
rollback thực sự bắt buộc trước production use, tạo một reviewed corrective
forward migration chỉ sau khi đã xác nhận/backup data; không edit migration cũ.

## Open Questions

Không có open question ảnh hưởng Specs, approach hoặc task breakdown. Exact
migration filename được generated tooling quyết định khi Apply và không thay
đổi design.
```

## Validation

Command:

```text
openspec validate restaurant-knowledge-cuisine-know-how --strict
```

Exact result:

```text
Change 'restaurant-knowledge-cuisine-know-how' is valid
```

Exit code: `0`.

## Recommendation

Approve Gate 2b for the exact Design above. After approval, Tasks/Apply may
proceed only within this Design and must stop if implementation discovers a
need for any guarded expansion.
