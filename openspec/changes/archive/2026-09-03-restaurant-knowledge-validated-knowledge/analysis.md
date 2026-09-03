# Change Analysis

## Scope and Change Type

Change này bổ sung `Restaurant Knowledge → Connaissances validées` như một
slice mới trên existing page `/etablissement/informations-generales`.
Capability chỉ bao gồm các item được tạo/xác nhận thủ công, mỗi item là một
phát biểu ngữ nghĩa độc lập ở scope establishment, với empty/list/create/view/
edit/remove, explicit save và no autosave.

Phân loại:

- behavioral change: `YES`;
- UI-affecting: `YES`;
- Browser QA bắt buộc trước Gate 3: `YES`;
- data-affecting: `YES`, vì current repository chưa có flexible validated-item
  representation;
- authorization-sensitive: `YES`, dù chỉ reuse READ/MANAGE hiện có;
- external/provider-sensitive: `NO`;
- cross-runtime: `NO`;
- kết quả second-line cross-module check: `PAGE_LOCAL`.

Analysis không chọn save granularity, schema, identifier, repository shape hay
delete mechanics.

## Sources Consulted

### Product Intent và lifecycle

- [`docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md`](../../../docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md)
- [`docs/features/establishment/README.md`](../../../docs/features/establishment/README.md)
- [`docs/features/establishment/general-information/README.md`](../../../docs/features/establishment/general-information/README.md)
- [`docs/PRODUCT_KNOWLEDGE.md`](../../../docs/PRODUCT_KNOWLEDGE.md)
- [`docs/MODULE_REGISTRY.md`](../../../docs/MODULE_REGISTRY.md)
- [`docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md)
- [`docs/LIFECYCLE_STATUS_MODEL.md`](../../../docs/LIFECYCLE_STATUS_MODEL.md)
- current Control Tower Product Decision trong bounded request của change này.

### Authority, workflow, architecture và security

- [`AGENTS.md`](../../../AGENTS.md)
- [`apps/backoffice/AGENTS.md`](../../../apps/backoffice/AGENTS.md)
- [`packages/db-cloud/AGENTS.md`](../../../packages/db-cloud/AGENTS.md)
- [`docs/AUTHORITY_MODEL.md`](../../../docs/AUTHORITY_MODEL.md)
- [`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md)
- [`docs/OPENSPEC_YUTA_NORMATIVITY_ACTIVATION_REPORT.md`](../../../docs/OPENSPEC_YUTA_NORMATIVITY_ACTIVATION_REPORT.md)
- [`docs/architecture/DATABASE_BOUNDARIES.md`](../../../docs/architecture/DATABASE_BOUNDARIES.md)
- [`docs/architecture/TENANCY.md`](../../../docs/architecture/TENANCY.md)
- [`docs/architecture/AUTHENTICATION.md`](../../../docs/architecture/AUTHENTICATION.md)

### Normative Restaurant Knowledge behavior

- [`openspec/specs/authorization/restaurant-knowledge/spec.md`](../../../openspec/specs/authorization/restaurant-knowledge/spec.md)
- [`openspec/specs/restaurant-knowledge/concept-history/spec.md`](../../../openspec/specs/restaurant-knowledge/concept-history/spec.md)
- [`openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md`](../../../openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md)
- [`openspec/specs/restaurant-knowledge/customer-experience/spec.md`](../../../openspec/specs/restaurant-knowledge/customer-experience/spec.md)
- [`openspec/specs/restaurant-knowledge/team-culture/spec.md`](../../../openspec/specs/restaurant-knowledge/team-culture/spec.md)
- [`openspec/specs/restaurant-knowledge/communication-identity/spec.md`](../../../openspec/specs/restaurant-knowledge/communication-identity/spec.md)

### Implemented State và UI evidence

- [`apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`](<../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx>)
- [`apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`](<../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts>)
- [`apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`](<../../../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts>)
- [`apps/backoffice/src/server/auth/permissions.ts`](../../../apps/backoffice/src/server/auth/permissions.ts)
- [`packages/db-cloud/src/schema/restaurant-knowledge.ts`](../../../packages/db-cloud/src/schema/restaurant-knowledge.ts)
- [`packages/db-cloud/src/restaurant-knowledge-repository.ts`](../../../packages/db-cloud/src/restaurant-knowledge-repository.ts)
- current Restaurant Knowledge authorization/action/loader/repository tests;
- [`docs/ui/pages/establishment-general-information/README.md`](../../../docs/ui/pages/establishment-general-information/README.md)
- [`docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`](../../../docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md)
- [`docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`](../../../docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md)
- [`docs/INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_REVIEW.md`](../../../docs/INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_REVIEW.md)
  như historical analysis context, không phải current decision cho scope mới.

## Authority and Product Decision

ADR-007 đã phê duyệt validated restaurant knowledge như một family của
Restaurant Knowledge, đồng thời giữ invariant một datum có một canonical owner
và không copy Booking, Personnel, menu/POS, Reputation hay source-module data.
Bounded Control Tower decision hiện tại quyết định V1 là manual-only flexible
validated Restaurant Knowledge và giải quyết chi tiết behavior cần cho change.

Restaurant Knowledge chỉ canonically own một item khi đồng thời thỏa bốn điều
kiện:

1. item là descriptive establishment-level knowledge;
2. không có capability YUTA hiện hữu nào đã canonically own cùng semantic
   information;
3. việc lưu item không tạo competing source of truth; và
4. item được một authorized restaurant human tạo/xác nhận thủ công.

Semantic meaning, không phải storage format, quyết định ownership. V1 không
được dùng slice này để duplicate Establishment Profile, Carte & menus,
Personnel/Salariés, Planning, Pointage, Reservations, Stock, Suppliers,
Tasks/Today hoặc canonical owner khác.

“Validated” chỉ có nghĩa authorized restaurant human đã chủ động chấp nhận
item là Restaurant Knowledge. Nó không phải objective truth guarantee,
verification/certification bởi YUTA, legal/regulatory certification hay
external-source verification.

Candidate/suggested/inferred knowledge không thuộc change. Không có automatic
promotion; mọi future origin khác manual input cần một change và human-review
flow riêng trước khi có thể đạt cùng authority level.

## Current Implemented State

Current repository triển khai năm Restaurant Knowledge slice cố định:

1. Concept & histoire;
2. Cuisine & savoir-faire;
3. Expérience client;
4. Équipe & culture; và
5. Identité de communication.

Mỗi slice có dedicated cloud table, tenant-scoped repository operations,
page-local loader/action/form và focused tests. Page composition giữ
Establishment Profile độc lập. Authorization code và normative spec biểu diễn
đúng hai operations `restaurant-knowledge.read` và
`restaurant-knowledge.manage`; OWNER/MANAGER có cả hai, STAFF bị deny theo
default policy.

Repository-wide search không tìm thấy:

- generic/flexible Restaurant Knowledge item model;
- validated-knowledge list repository hoặc contract;
- candidate/suggestion state;
- Restaurant Knowledge provenance/source/origin abstraction;
- Restaurant Knowledge audit/revision/history model; hoặc
- runtime consumer cho validated knowledge.

Các occurrence của provenance/audit ở UI tooling, Personnel, Booking hoặc
module khác không phải reusable Restaurant Knowledge abstraction và không cấp
authority để reuse.

`Connaissances validées` hiện chưa được triển khai. Code/schema/tests chỉ là
Implemented State evidence; không chứng minh deployment, Environment hay
Production Readiness.

## Affected Boundaries

### Runtime, owner và tenancy

- Runtime ban đầu: Cloud / `apps/backoffice` only.
- Canonical owner: Restaurant Knowledge.
- Semantic scope: establishment.
- Organization: tenancy/access envelope only.
- Cloud persistence owner có thể bị ảnh hưởng sau approval: `packages/db-cloud`;
  technical representation thuộc Design.
- Trusted authenticated user, organization, establishment, active membership,
  role và permission tiếp tục được server derive; browser input không có
  authorization authority.

### Authorization

- View/list: `restaurant-knowledge.read`.
- Create/edit/remove/save: `restaurant-knowledge.manage`.
- OWNER và MANAGER: READ + MANAGE.
- STAFF: không có Restaurant Knowledge access theo default policy.
- READ và MANAGE vẫn là logical operations độc lập.
- Profile permission không substitute Restaurant Knowledge permission.
- Không cần permission, role, principal, item-level grant, section-specific
  authorization hay admin/support bypass mới.

### Anti-duplication và provenance

Anti-duplication có thể giữ hoàn toàn là Product/manual boundary trong V1.
Implementation không cần query, read, write, compare hay synchronize module
khác và không cần automatic owner/duplicate detection. Đây là giới hạn Product
của nội dung được authorized human tạo, không phải machine-enforced semantic
classifier.

Initial manual-validation semantics không yêu cầu stored provenance field:
mọi đường tạo item được phê duyệt trong V1 đều là manual và MANAGE-gated, không
có origin khác cần phân biệt. Điều này không cho phép future AI, review,
document, usage hay inferred origin silently collapse vào cùng authority;
future origin/provenance/history cần Product review riêng.

### Cross-module và runtime check

| v3 dimension                                   | Kết quả repository Analysis                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1. Read/write capability-owned data khác       | `NO`; V1 không cần và không được làm vậy.                                                              |
| 2. Canonical ownership đổi hoặc bị blur        | `NO`; Restaurant Knowledge chỉ own item thỏa bốn điều kiện, source owners giữ nguyên.                  |
| 3. Module khác phải consume/react/update       | `NO`; zero downstream consumer.                                                                        |
| 4. Shared permission/security/tenancy impact   | `NO`; reuse exact READ/MANAGE và trusted context hiện có.                                              |
| 5. Multiple runtime impact                     | `NO`; Cloud/Backoffice only.                                                                           |
| 6. Legal/privacy/provider/external integration | `NO`; validated không phải legal certification và không có provider.                                   |
| 7. ADR/architecture/data/runtime boundary đổi  | `NO`; capability nằm trong ADR-007 và current cloud boundary; representation mới thuộc approved owner. |
| 8. Coordinated Product decisions               | `NO`; non-relationships giữ nguyên, không quyết định behavior của module khác.                         |
| 9. Coordinated rollout/shared contract         | `NO`; page-local capability, không cần shared cross-module contract.                                   |
| 10. Multi-page coordinated UI/QA               | `NO`; một existing page; Browser QA vẫn bắt buộc cho page đó.                                          |

Kết quả: `PAGE_LOCAL`. Nếu Design/Apply phát hiện cần cross-module owner lookup,
new shared contract, permission, tenancy change, AI/provider hoặc cross-runtime
behavior, change phải dừng với `CROSS_MODULE / NEEDS REVIEW`.

### Explicit non-relationships

- Establishment Profile: không phải source, owner, permission substitute hay
  required consumer.
- Carte & menus: giữ menu/catalog/price canonical data ngoài slice; không read,
  write, copy hoặc synchronize.
- Personnel/Salariés, Planning, Pointage: không source/consumer và không tạo
  employee, schedule hoặc time-tracking state.
- Reservations: Booking vẫn own reservation/settings/availability data.
- Stock và Suppliers: không source/consumer, inventory/supplier records không
  trở thành knowledge item.
- Tasks/Today: không tạo task, card, alert, handover hay Today integration.
- AI, Reviews và Marketing: không suggestion, inference, ingestion, publishing
  hoặc downstream consumption.
- POS, Site Agent và Display: không dependency, adapter, synchronization hoặc
  shared persistence.

## Lifecycle Baseline

Module Registry hiện ghi Restaurant Knowledge tổng thể:

- Product Decision: `APPROVED`;
- Implementation: `PARTIAL`;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NOT_ASSESSED`;
- External Dependency: `NOT_ASSESSED`.

Riêng validated-knowledge slice hiện là approved bounded Product Intent nhưng
repository implementation là `NOT_STARTED`/unimplemented. Change này không
promote bất kỳ lifecycle dimension nào.

## Requirement Readiness

### Item granularity

One item = one independently understandable and reusable semantic statement
phù hợp với current cloud/tenant architecture. Current Restaurant Knowledge
chưa có item-list representation, nhưng đó là technical design gap, không phải
Product ambiguity. Specs có thể cấm một large multi-topic `Autres informations`
textarea và không cần taxonomy/category để làm rõ granularity.

### Explicit save

Behavioral Specs có thể được viết mà không chọn whole-list, per-item hoặc batch
save:

- create/edit/remove chỉ là pending change trước explicit save;
- không pending change nào trở thành canonical active knowledge do blur,
  timer, effect hay background request;
- sau successful explicit save, current active knowledge phản ánh các pending
  changes đã được save.

Các invariant này observable và testable nhưng không đặt số lượng save control
hoặc transaction/persistence shape. Save granularity vẫn là Product/UI decision
nếu Design cần chọn một behavior cụ thể ngoài các invariant trên.

### Remove/delete

Behavioral Specs có thể định nghĩa remove mà không chọn hard delete,
tombstone/archive hoặc restore:

- pending remove không thay đổi canonical active knowledge trước explicit
  save;
- sau successful explicit save, removed item không còn được list/view như
  current active validated knowledge.

Storage retention và physical deletion không quan sát được trong bounded V1 và
thuộc Design/authority review sau này nếu representation làm chúng observable.
Không có restore workflow trong scope.

### Documentation state

Current Product Knowledge, Module Registry và page pack mô tả chính xác năm
slice đã triển khai và validated knowledge là future/unimplemented. Không có
current documentation conflict. Nếu implementation hoàn tất và được archive,
post-archive Knowledge Consolidation mới quyết định update các nguồn current.

Kết luận requirement readiness: `READY_FOR_SPECS` cho đúng capability
`restaurant-knowledge/validated-knowledge`.

## UI / UX Applicability

`UI_AFFECTING: YES` và `BROWSER_QA_REQUIRED: YES` vì existing page sẽ có một
slice list/create/view/edit/remove với explicit-save states. Specs không được
chọn component architecture, visual layout hay save-control cardinality.

Current page pack là UI authority thứ cấp và phải được bảo vệ cho Establishment
Profile cùng năm slice Restaurant Knowledge hiện có. Page pack hiện chưa
authorize validated-knowledge UI; sau Gate 2/Design, chỉ approved behavior mới
được bổ sung. Real Browser QA trước Gate 3 phải bảo vệ current route, real data,
authorization states, responsive layout, keyboard/accessibility và các slice
hiện có.

## Conflicts and Unknowns

### CONFLICT

`NONE`.

### NEEDS REVIEW

`NONE` ở requirement level cho Specs.

Các lựa chọn sau được defer vì không cần để viết observable Specs và không được
quyết định trong Analysis:

- whole-list, per-item hay batch save presentation;
- database table/row shape và item identifier;
- hard delete, tombstone hoặc archive mechanics;
- ordering representation;
- detailed provenance/history representation.

Nếu một lựa chọn sau này làm thay đổi observable Product behavior hoặc yêu cầu
cross-module/runtime/permission boundary mới, nó phải quay lại Product/authority
review thay vì được tự quyết trong Design.

## Analysis Conclusion

`READY_FOR_SPECS`

Bounded scope được xác nhận là `PAGE_LOCAL`. Specs có thể định nghĩa manual-only
validated Restaurant Knowledge với establishment scope, READ/MANAGE hiện có,
empty/list/create/view/edit/remove, explicit persistence boundary, no autosave,
one-item semantic granularity và các explicit non-relationships mà không chọn
technical representation hoặc cross-module enforcement.

Change không dùng `skip_specs: true`. Chỉ capability mới
`restaurant-knowledge/validated-knowledge` được phép tiến tới delta Specs sau
explicit human Gate 1 approval. Sensitive Design Gate sẽ bắt buộc sau Gate 2 vì
change ảnh hưởng data representation và authorization-enforced mutation
boundary.
