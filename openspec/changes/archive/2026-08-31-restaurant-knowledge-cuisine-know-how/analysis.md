# Change Analysis

## Scope and Change Type

Change này bổ sung một behavioral capability mới,
`restaurant-knowledge/cuisine-know-how`, vào page composed
`/etablissement/informations-generales`. Scope chỉ gồm ba khối
`Description de la cuisine`, `Savoir-faire & particularités` và `Fait maison`:
xem, nhập/chỉnh sửa thủ công, optional độc lập, valid empty state, một explicit
save cho toàn bộ slice và không autosave.

Đây là change ảnh hưởng UI và tenant-owned Restaurant Knowledge data, nên nhạy
cảm về canonical ownership, persistence boundary, authorization và tenant
isolation. Đây không phải change của Establishment Profile, `Carte & menus`,
POS/local runtime, shared contract, external provider hoặc cross-runtime
behavior.

## Sources Consulted

### Product Intent và governance

- [Authority Model](../../../docs/AUTHORITY_MODEL.md)
- [Establishment Product Knowledge](../../../docs/features/establishment/README.md)
- [Informations générales Page Product Knowledge](../../../docs/features/establishment/general-information/README.md)
- [ADR-007 — Composed General Information and Restaurant Knowledge](../../../docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md)
- [Module Registry](../../../docs/MODULE_REGISTRY.md)
- [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md)
- [OpenSpec normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md)
- [Restaurant Knowledge authorization normative spec](../../specs/authorization/restaurant-knowledge/spec.md)
- [Concept & histoire normative spec](../../specs/restaurant-knowledge/concept-history/spec.md)

### Architecture, security và page authority

- [Tenancy](../../../docs/architecture/TENANCY.md)
- [Authentication](../../../docs/architecture/AUTHENTICATION.md)
- [Database boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md)
- [Identity / Access Product Knowledge](../../../docs/features/identity-access/README.md)
- [General-information page pack](../../../docs/ui/pages/establishment-general-information/README.md)
- [Page Product Scope](../../../docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md)
- [Page Data and Interaction Specification](../../../docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md)
- [Page UI Specification](../../../docs/ui/pages/establishment-general-information/UI_SPEC.md)

### Implemented State evidence

- [Restaurant Knowledge authorization guards](../../../apps/backoffice/src/server/auth/permissions.ts)
- [General-information page composition](<../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx>)
- [Concept/Histoire loader](<../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts>)
- [Current page-local actions](<../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts>)
- [Concept/Histoire form](<../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/concept-history-form.tsx>)
- [Restaurant Knowledge schema](../../../packages/db-cloud/src/schema/restaurant-knowledge.ts)
- [Restaurant Knowledge repository](../../../packages/db-cloud/src/restaurant-knowledge-repository.ts)
- [Restaurant Knowledge repository isolation tests](../../../packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts)
- [Restaurant Knowledge permission tests](../../../apps/backoffice/test/restaurant-knowledge-permissions.test.ts)
- [Restaurant Knowledge loader tests](../../../apps/backoffice/test/restaurant-knowledge-loader.test.ts)
- [Concept/Histoire action tests](../../../apps/backoffice/test/concept-history-action.test.ts)
- [`Carte & menus` placeholder route](<../../../apps/backoffice/src/app/(authenticated)/etablissement/carte-menus/page.tsx>)

## Authority and Product Decision

Approved Product decision cho page-local change này quyết định đúng ba khối và
behavior nêu tại Scope. Product Knowledge hiện tại đã đặt `Cuisine &
savoir-faire` trong các knowledge family của Restaurant Knowledge, còn ADR-007
và page Product Knowledge xác lập page composed cùng ranh giới riêng giữa
Restaurant Knowledge và Establishment Profile. Không có repository authority
nào mâu thuẫn với bounded Product decision này.

Các boundary đã được quyết định và phải được giữ nguyên:

- Restaurant Knowledge là canonical owner của ba giá trị mô tả và
  persistence/domain boundary của chúng; Establishment Profile và Carte & menus
  không sở hữu các giá trị này.
- Knowledge có semantic scope theo establishment; Organization chỉ là
  tenancy/access envelope theo hierarchy hiện có.
- Mỗi giá trị optional và độc lập; cả ba cùng empty là hợp lệ. Không có Product
  rule về requiredness, length, format, enum, checklist, taxonomy hoặc
  structured dish/product relationship.
- Người dùng nhập/chỉnh sửa thủ công; một explicit save lưu toàn bộ slice; không
  autosave.
- View dùng `restaurant-knowledge.read`; edit/save dùng
  `restaurant-knowledge.manage`. Hai operation độc lập, cùng grant cho `OWNER`
  và `MANAGER`; `STAFF` bị deny mặc định. Không reuse
  `establishment.profile.read/manage`.
- Không có relationship, copy, link hoặc sync với dishes, products, prices,
  ingredients, recipes, availability, menu configuration, suppliers hay dữ
  liệu vận hành thuộc `Carte & menus`/POS.

## Current Implemented State

Repository hiện đã implement lát cắt `Concept & histoire`, không phải `Cuisine
& savoir-faire`:

- Page `Informations générales` compose form Establishment Profile với một
  section Restaurant Knowledge riêng.
- Concept/Histoire có dedicated Restaurant Knowledge schema/repository trong
  cloud boundary, page-local loader/action, manual draft, một explicit save và
  không autosave.
- Repository queries dùng trusted `organizationId` và `establishmentId`; tests
  mô tả valid empty state, giá trị độc lập và cross-organization/
  cross-establishment isolation.
- Authorization code và tests triển khai hai operation READ/MANAGE riêng:
  `OWNER`/`MANAGER` được grant, `STAFF`, public/service actor và system-role
  bypass bị deny. Profile permission không thay thế Restaurant Knowledge
  permission.

Chưa có schema field/table, repository operation, loader/action, UI block hoặc
test cho ba giá trị `Cuisine & savoir-faire`. Route cloud `Carte & menus` hiện
chỉ là planned placeholder và không cung cấp data contract để change này dùng.
POS menu/catalog là local operational data trong boundary riêng và không được
sync sang cloud.

Implementation hiện tại chứng minh repository có compatible cloud,
authorization và page-composition boundaries. Nó không quyết định rằng lát cắt
mới phải sao chép table shape, repository representation hoặc action structure
của Concept/Histoire. Repository evidence cũng không chứng minh capability đã
được deploy hoặc enabled trong môi trường nào.

## Affected Boundaries

- **Runtime owner:** `apps/backoffice` tiếp tục sở hữu authenticated page flow.
  Không ảnh hưởng `apps/yuta-pos`, `apps/site-agent`, `apps/yuta-display` hoặc
  public app.
- **Semantic/data owner:** Restaurant Knowledge sở hữu ba giá trị và
  persistence/domain boundary. Technical schema, repository/table và storage
  representation được để lại cho Design; không chuyển ownership sang
  `establishments` profile row hoặc `Carte & menus`.
- **Tenancy:** giữ nguyên trusted server-derived active user, organization,
  establishment và matching active membership. Tenant-owned reads/writes phải
  giữ organization + establishment scope và fail closed; browser IDs không có
  authority.
- **Authorization:** consume normative `restaurant-knowledge.read` cho view và
  `restaurant-knowledge.manage` cho edit/save. Không thêm permission, role,
  principal, tier, section-level authorization hoặc system-role bypass.
- **Establishment Profile:** không đổi data, permission, repository hoặc
  behavior. Page composition không tạo permission/data inheritance.
- **`Carte & menus`:** không có dependency. Change không đọc, ghi, link, sync
  hoặc duplicate operational menu data. Nếu Apply/Design cần dữ liệu hoặc
  contract của capability này thì change phải dừng với `CROSS_MODULE` /
  `NEEDS REVIEW`.
- **Shared/API contracts:** không có requirement hiện tại cần contract dùng
  chung hoặc API route. Nếu Design phát hiện cần một shared contract, phải dừng
  để review thay vì mở rộng scope.
- **External/cross-runtime:** không bị ảnh hưởng; AI, automatic learning,
  reviews, Marketing/social, provider, provenance, embeddings/vector DB và mọi
  Restaurant Knowledge section khác đều excluded.

## Lifecycle Baseline

Module Registry đang ghi Restaurant Knowledge tổng thể là:

| Dimension            | Current value                                   |
| -------------------- | ----------------------------------------------- |
| Product Decision     | `APPROVED`                                      |
| Implementation       | `PARTIAL` — chỉ Concept/Histoire đã implemented |
| Environment          | `NOT_ENABLED`                                   |
| Production Readiness | `NOT_ASSESSED`                                  |
| External Dependency  | `NOT_ASSESSED`                                  |

Đối với riêng slice `Cuisine & savoir-faire`, Product Decision là `APPROVED`
theo current page-level Product decision nhưng repository Implementation là
`NOT_STARTED`. Change workflow này không promote Environment hoặc Production
Readiness.

## Requirement Readiness

`READY_FOR_SPECS`.

Có đủ authority để viết precise delta specs cho:

- đúng ba giá trị với tên Product đã phê duyệt;
- view/manual edit độc lập, optionality và valid empty state;
- một explicit whole-slice save và no autosave;
- READ cho view, MANAGE cho edit/save theo normative authorization contract;
- Restaurant Knowledge ownership, establishment semantic scope và Organization
  tenancy/access envelope;
- không kế thừa Establishment Profile và không liên hệ/duplicate operational
  data của Carte & menus.

Specs không cần và không được đoán data type/storage shape, API, validation,
taxonomy hoặc technical persistence representation.

## UI / UX Applicability

UI bị ảnh hưởng trên route hiện có
`/etablissement/informations-generales`. Page pack hiện bảo vệ composed-page
ownership, permission separation, explicit-save/no-autosave pattern và real
tenant data. Khi change qua các gate sau, page pack phải được cập nhật đúng cho
slice mới; trạng thái hiện tại ghi “other Restaurant Knowledge sections” là out
of-scope của implementation đã review trước đó, không phải Product rejection
của change mới này.

Không có screenshot hoặc visual reference nào được dùng làm Product authority.
Gate 1 không quyết định layout, component structure, copy bổ sung hoặc technical
interaction implementation ngoài behavior đã phê duyệt.

## Conflicts and Unknowns

- **CONFLICT — documentation Implemented State drift, không phải requirement
  conflict:** [Establishment Product Knowledge](../../../docs/features/establishment/README.md)
  có các dòng cũ nói chưa có normative Establishment spec và chưa chọn concrete
  Concept/Histoire schema/repository, trong khi cùng tài liệu, normative specs,
  Module Registry và tracked implementation đều ghi Concept/Histoire đã được
  sync/implemented. Drift này cần được sửa trong documentation scope của Apply,
  nhưng không làm mơ hồ Product requirements của `Cuisine & savoir-faire`.
- **NEEDS REVIEW — deferrable to Design:** technical persistence/data shape cho
  ba giá trị chưa được Product quyết định. Design có thể chọn representation
  chỉ trong accepted Restaurant Knowledge cloud/domain boundary; không được
  suy ra từ Concept/Histoire hoặc tạo Product semantics mới.
- Không có requirement-level ambiguity, cross-module dependency hoặc conflict
  buộc phải dừng trước Specs.

## Analysis Conclusion

Bounded scope được xác nhận cho new capability
`restaurant-knowledge/cuisine-know-how`. Change có thể tiến tới delta Specs sau
Gate 1 approval, với canonical ownership, tenant enforcement, READ/MANAGE và
menu-data exclusion nêu trên.

Không có blocker cần Product/architecture/security review trước Specs. Nếu về
sau technical work cần shared contract, additional permission, changed tenancy
boundary, changed canonical ownership, `Carte & menus` dependency hoặc
cross-runtime behavior, change phải dừng và trả về review.

Change có behavioral requirements mới nên không được dùng `skip_specs: true`.
