# Gate 1 — Product / Authority Review

Change: `restaurant-knowledge-validated-knowledge`

Gate: `GATE 1 — PRODUCT / AUTHORITY REVIEW`

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-02T22:22:00+02:00`

Created: `2026-09-02T21:51:15.3331463+02:00`

Schema: `yuta-spec-driven`

Analysis conclusion: `READY_FOR_SPECS`

Sensitive change: `YES`

## Request and bounded-change summary

Control Tower classified the change as `PAGE_LOCAL` after Discovery / Shaping.
The requested initial capability is manual-only flexible validated Restaurant
Knowledge on `/etablissement/informations-generales`. It supports a valid
no-item state, list, manual create/view/edit/remove, explicit save and no
autosave. One item is one independently understandable semantic statement.

Restaurant Knowledge may own an item only when it is descriptive
establishment-level knowledge, no existing capability already owns the same
semantic information, storage does not create a competing source of truth, and
an authorized restaurant human manually creates or validates it.

The request explicitly excludes cross-module enforcement, AI/inference,
candidate/suggestion flows, automatic promotion, generic catch-all text,
taxonomy, semantic duplicate detection, detailed provenance/history,
downstream consumers, providers and cross-runtime behavior.

This Gate reviews only Proposal and Analysis. It creates no Specs, Design,
Tasks, implementation, schema, migration, UI, tests, QA, sync, archive or
Knowledge Consolidation.

## Provenance and artifact inventory

- repository HEAD before creation:
  `abf6ab6516d3fff151761851561c46db00497f52`;
- initial `git status --short`: empty;
- change did not exist before `openspec new change`;
- OpenSpec root: repository-local
  `D:\working\yuta\yuta-resto`;
- schema selected by the configured default: `yuta-spec-driven`;
- pre-existing artifacts for this change: none;
- created artifacts: `.openspec.yaml`, `proposal.md`, `analysis.md` and this
  Gate 1 packet only.

## Reviewed artifact hashes

SHA-256 was computed over exact file bytes with PowerShell
`Get-FileHash -Algorithm SHA256`; hexadecimal output was normalized to
lowercase.

| Repository-relative path                                                | SHA-256                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/restaurant-knowledge-validated-knowledge/analysis.md` | `adfc226bc6cf2804833a099c1317bcad7f6e9939262accbe1da5bb23188d01e6` |
| `openspec/changes/restaurant-knowledge-validated-knowledge/proposal.md` | `dc874fbeb79d43ef31e9d109360033a46aea5c8f97beebb73abd538e300764e8` |

Exact reviewed path count: `2`.

## Authorities consulted

- root, Backoffice and db-cloud `AGENTS.md`;
- Authority Model, automated workflow, OpenSpec activation/normativity
  evidence and active schema configuration;
- ADR-007, Establishment and Informations générales Product Knowledge,
  Product Knowledge router, Module Registry, Current State and lifecycle model;
- cloud database, tenancy and authentication boundaries;
- all six current normative Restaurant Knowledge authorization/slice specs;
- current page, loaders, actions, permissions, db-cloud schema/repository,
  focused tests and current page pack;
- historical Informations générales integration analysis only as prior
  context, not as authority overriding the current Control Tower decision.

## Gate findings

### Repository and capability state

- Five fixed Restaurant Knowledge slices are implemented.
- No generic/flexible Restaurant Knowledge item model, validated-item
  repository/contract, candidate state or Restaurant Knowledge
  provenance/history abstraction exists.
- Validated knowledge remains unimplemented in current Product Knowledge and
  the Module Registry; that current documentation is internally consistent.
- Existing READ/MANAGE authorization already supplies the accepted OWNER,
  MANAGER and STAFF behavior required by this change.

### Ownership, tenancy and authorization

- Canonical owner: Restaurant Knowledge.
- Semantic scope: establishment.
- Organization: tenancy/access envelope only.
- View/list requires `restaurant-knowledge.read`.
- Create/edit/remove/save requires `restaurant-knowledge.manage`.
- OWNER and MANAGER retain READ + MANAGE; STAFF remains denied by default.
- Profile permissions do not substitute Restaurant Knowledge permissions.
- Browser-provided organization, establishment, membership, role or permission
  is not authority.

### Cross-module second-line check

All 10 v3 dimensions remain `PAGE_LOCAL`: no other capability must be read or
written, canonical ownership does not move, no downstream consumer is required,
no shared permission/tenancy change is required, only Cloud/Backoffice is
affected, no provider/legal integration is introduced, accepted durable
boundaries remain intact, no coordinated Product decision or rollout contract
is needed, and QA remains limited to the owning existing page.

Anti-duplication can remain a manual Product boundary in V1. The system is not
required to inspect other modules, infer semantic ownership or detect
duplicates. If later Design/Apply requires that behavior, the change must stop
as `CROSS_MODULE / NEEDS REVIEW`.

### Save and remove readiness

Specs can state observable invariants without choosing unapproved mechanics:

- pending create/edit/remove changes do not alter canonical active knowledge
  before an explicit save;
- a successful explicit save makes the saved pending changes observable;
- a successfully saved removal means the item is no longer listed/viewable as
  current active validated knowledge;
- no autosave occurs.

These requirements do not decide whole-list/per-item/batch presentation or hard
delete/tombstone/archive/restore representation. Those choices stay outside
Gate 1 unless they later change observable behavior.

### Provenance and validation meaning

Because V1 has only manual MANAGE-gated creation, a stored source enum or
provenance/history model is not required for initial semantics. Future
suggested, inferred, review-derived, document-derived or usage-derived origins
must not silently acquire validated authority and require a separate Product
change.

“Validated” means accepted by an authorized restaurant human as Restaurant
Knowledge. It does not mean factual guarantee, verification or certification
by YUTA, legal/regulatory certification or external-source verification.

## CONFLICT

`NONE`.

## NEEDS REVIEW

`NONE` at requirement level.

Deferred technical/design choices are save presentation/granularity,
identifier/schema/repository representation, delete mechanics, ordering
representation and detailed future provenance/history. None is required to
write the bounded behavioral Specs. Any later observable or cross-boundary
effect returns to Product/authority review.

## UI and sensitive-change routing

- `UI_AFFECTING: YES`
- `BROWSER_QA_REQUIRED: YES`
- real Browser QA is mandatory before Gate 3;
- sensitive change: `YES`, because later implementation will affect a cloud
  data representation and an authorization-enforced mutation boundary;
- after Gate 2 approval, Design must stop at the Sensitive Design Gate before
  Tasks or Apply.

## Checks

| Check                                                                      | Result                                                                |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `openspec status --change restaurant-knowledge-validated-knowledge --json` | `PASS`: proposal and analysis done; specs ready; design/tasks blocked |
| Targeted Prettier for Proposal and Analysis                                | `PASS`                                                                |
| `pnpm docs:check`                                                          | `PASS`: 36 current documents                                          |
| `pnpm architecture:check`                                                  | `PASS`                                                                |
| `pnpm -r --if-present typecheck`                                           | `PASS`: all 15 participating projects                                 |

Strict change validation is not run at Gate 1 because no delta spec may be
created before explicit human approval.

## Exact proposal.md content

Path:
`openspec/changes/restaurant-knowledge-validated-knowledge/proposal.md`

SHA-256:
`dc874fbeb79d43ef31e9d109360033a46aea5c8f97beebb73abd538e300764e8`

<!-- BEGIN EXACT proposal.md -->

```markdown
## Why

Restaurant Knowledge đã có năm slice mô tả cố định nhưng chưa có khả năng lưu
những phát biểu ngữ nghĩa khác đã được một người có thẩm quyền của nhà hàng chủ
động xác nhận. Change này bổ sung một phạm vi linh hoạt nhưng có ranh giới rõ,
để lưu kiến thức mô tả cấp establishment mà không biến trang thành một ô
`Autres informations` không kiểm soát hoặc tạo nguồn sự thật cạnh tranh.

## What Changes

- Bổ sung slice `Connaissances validées` trên trang
  `/etablissement/informations-generales` cho Restaurant Knowledge.
- Cho phép trạng thái không có item, liệt kê item hiện hành, tạo thủ công, xem,
  sửa và remove item khỏi current active validated knowledge.
- Mỗi item biểu diễn một phát biểu ngữ nghĩa có thể hiểu và tái sử dụng độc lập,
  được một người có Restaurant Knowledge MANAGE chủ động chấp nhận là
  Restaurant Knowledge.
- Mọi thay đổi chỉ có hiệu lực sau một hành động save rõ ràng; không autosave.
  Proposal không quyết định whole-list, per-item hay batch save, và không quyết
  định hard delete, tombstone, archive hay restore.
- Giữ Restaurant Knowledge là canonical owner chỉ khi nội dung là descriptive
  establishment knowledge, chưa thuộc canonical ownership của capability khác,
  không tạo competing source of truth và được tạo/xác nhận thủ công.
- Giữ anti-duplication là Product/manual boundary trong V1; không đọc, ghi,
  đồng bộ hay tự động phân loại dữ liệu của capability khác.
- Reuse `restaurant-knowledge.read` để xem và
  `restaurant-knowledge.manage` để tạo, sửa, remove và save; giữ nguyên grant
  hiện tại cho OWNER/MANAGER và default denial cho STAFF.
- Giữ implementation ban đầu manual-only, Cloud/Backoffice-only và không có
  downstream consumer.
- Không bổ sung candidate/suggestion flow, AI/inference, automatic promotion,
  semantic duplicate detection, taxonomy, scoring, detailed provenance/history,
  provider, publishing hay cross-module/cross-runtime integration.

## Capabilities

### New Capabilities

- `restaurant-knowledge/validated-knowledge`: Hành vi quan sát được cho danh
  sách các phát biểu Restaurant Knowledge đã được người có thẩm quyền xác nhận
  thủ công ở scope establishment, gồm empty/list/create/view/edit/remove,
  explicit save, authorization và các ranh giới non-relationship.

### Modified Capabilities

Không có. Change reuse nguyên trạng normative authorization contract hiện có
cho Restaurant Knowledge READ/MANAGE.

## Impact

- Trang Backoffice hiện có:
  `/etablissement/informations-generales`.
- Restaurant Knowledge domain/persistence trong cloud có thể cần một biểu diễn
  item linh hoạt mới; lựa chọn schema, repository, save granularity và delete
  mechanics thuộc Design sau khi Specs được duyệt.
- Authorization, trusted organization/establishment tenancy và route shell hiện
  có được giữ nguyên.
- Không thêm API, shared contract, permission, role, principal, provider,
  cross-module read/write, POS, Site Agent hoặc Display dependency.
- UI-affecting: `YES`; real Browser QA sẽ bắt buộc trước Gate 3.
```

<!-- END EXACT proposal.md -->

## Exact analysis.md content

Path:
`openspec/changes/restaurant-knowledge-validated-knowledge/analysis.md`

SHA-256:
`adfc226bc6cf2804833a099c1317bcad7f6e9939262accbe1da5bb23188d01e6`

<!-- BEGIN EXACT analysis.md -->

```markdown
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
```

<!-- END EXACT analysis.md -->

## Recommendation and required human decision

Recommendation:
`APPROVE_GATE_1_FOR_SPECS_IF_PRODUCT_AND_AUTHORITY_BOUNDARIES_ARE_ACCEPTED`.

Required next instruction must explicitly approve Gate 1 for this exact change
and authorize Specs only. Without that current-user approval, do not create a
delta spec or proceed to Design, Tasks or Apply.
