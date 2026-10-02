```text
Change: release-a-customer-exposure-foundation
Gate: 1 — Proposal / Analysis
Review status: APPROVED
Created: 2026-10-01
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES
Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW
Mode selection source: actual current-user CODEX_ONLY for bounded customer-instance A/internal build/test, no activation
Independent reviewer: /root/gate1_exposure_review_v3 (fresh read-only context)
Independent review evidence: APPROVED candidate 3; exact seven identities rechecked; permits Specs only
Approval recorded by: Codex workflow
Approved: 2026-10-01T12:14:07.7113748Z
```

## Current candidate 3 and delegation

Actual current user selects CODEX_ONLY for this named task, accepts server-selected customer-instance A and separate internal mode, build/test only without staging/production activation. RR-01–RR-03 remain the bounded Product baseline. COMMIT_AFTER_TASK: NOT_SELECTED; unanswered current-task intake, prior roadmap YES does not apply. Baseline clean main HEAD 2dd5a02ba076a65928e2a80afe0b36d0d10284fd. No runtime/Design/Tasks edits.

Gate 2 candidate 1 CHANGES_REQUESTED found two narrowly omitted hosted observable contracts inside authorization/formalites and authorization/pointage. Current Proposal/Analysis add both to the declared compatibility dispositions. Independent grants/credential evaluation, domain semantics and unconditional clearing/reset/invalidation protections remain unchanged. Four Product homes and the accepted customer scope do not change. Existing ten deltas are preserved. Candidate 2 Gate 1 approval is INVALIDATED_BY_ARTIFACT_CHANGE for current Proposal/Analysis; its exact historical evidence is retained below.

UI_AFFECTING: YES; BROWSER_QA_REQUIRED: YES. UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE remains the reviewed functional/current-pattern classification. Sensitive Design still mandatory. This review decides readiness for the corrected Specs only; no Apply or material scope authority requested.

## Convergence assessment within this gate

Two planning reconciliations have occurred for the same exposure objective: Product-home/compatibility reconciliation and the newly evidenced authorization-consumer omission. There is no new Product decision to invent. Proceed toward the already authorized smallest implementation after the existing mandatory reviews; avoid further speculative spec expansion. The current review can resolve the two exact main-spec compatibility findings; the next strict validation will execute against the twelve-file candidate, and approved implementation can produce actual denial/query/browser evidence. No evaluator recovery budget is reset by this reconciliation.

## Current exact artifact/source identities

Command: Get-FileHash -LiteralPath <path> -Algorithm SHA256; raw bytes, lowercase, sorted paths.

| Path | SHA-256 |
| ---- | ------- |

| docs/features/establishment/general-information/README.md | 518abd83927e7ec7dd61bde5675268646ca92de96ee5c14f7e794a50cbefc01d |
| docs/features/identity-access/README.md | 5d519e120cead785ea27f89d2990c5db5ae50398127eba3db730c6aa9265772e |
| docs/features/reputation/README.md | 2e2d14e33698bb667d1ea6f140930c1a593d65ee927ce7c4470b7187cd6f303c |
| docs/features/today/README.md | 666315bc75371625bee357f94fc9a4fc5eb35af30e57b735615c79f88d4f8cd3 |
| openspec/changes/release-a-customer-exposure-foundation/analysis.md | 8876b435196b052652467bbe8d51404d55fd9a0c5b39f4ff335939e0dc219403 |
| openspec/changes/release-a-customer-exposure-foundation/proposal.md | bd29ab84194077951f25e1e672bccc805229bf4f2379d14b3572b0ace57f3541 |

## Current exact proposal — candidate 3

## Why

RR-01–RR-03 đã chốt phạm vi Foundation/Release A, nhưng Backoffice hiện vẫn mở các module và dữ liệu ngoài A qua menu, deep link, API và Server Actions. Cần một profile khách hàng A do server chọn cho instance, độc lập với quyền truy cập, để năm bề mặt đã chốt có phạm vi nhất quán. Đây là nền tảng exposure, chưa phải toàn bộ Release A đã sẵn sàng.

## What Changes

- Thêm policy availability phía server cho profile `release-a` và chế độ `internal` riêng; browser không chọn hoặc mở rộng profile. Giữ các kiểm tra session, membership, permission, entitlement và record scope hiện có.
- Profile A chỉ mở Aujourd'hui, Google Avis, profile cơ bản, OWNER Google Integrations và Users & Access theo quyền hiện có. Chặn page/API/action ngoài A và cung cấp recovery phù hợp; bảo vệ cả các thao tác Knowledge nằm chung route profile.
- Google Avis chỉ đọc/chỉnh sửa bản ghi Google được phép, kể cả selected detail và gọi action trực tiếp. Today chỉ có Google: `new = NEW`; queue `NEW/TO_PROCESS/DRAFTED/FOLLOW_UP`; count, preview và linked list cùng source/status/actor scope.
- Profile cơ bản không đọc/serialize các section Restaurant Knowledge trong A. Menu, subsection, liên kết, return-to và trạng thái setup/empty dùng cùng phạm vi; không suy diễn import đã chạy hoặc provider reply từ dữ liệu local.
- Reconcile quyết định A trong các Product homes hiện có, bổ sung denial/regression tests và Browser QA cho candidate local với dữ liệu tổng hợp. Giữ chế độ nội bộ và các nguồn sự thật hiện có.

## Capabilities

### New Capabilities

- `backoffice/release-a-customer-exposure`: policy availability cho instance khách hàng A, các slice dữ liệu/thao tác và recovery nhất quán của năm bề mặt đã chốt.

### Modified Capabilities

- `restaurant-knowledge/concept-history`
- `restaurant-knowledge/cuisine-know-how`
- `restaurant-knowledge/customer-experience`
- `restaurant-knowledge/team-culture`
- `restaurant-knowledge/communication-identity`
- `restaurant-knowledge/validated-knowledge`
- `pointage/raw-clocking`
- `formalites/persistent-draft-foundation`
- `reputation/review-social-links-configuration`
- `authorization/formalites`
- `authorization/pointage`

Các capability trên nhận tiền điều kiện availability rõ ràng cho entry/UI/action/API do Backoffice host. Trong A các entry này không khả dụng; internal giữ requirements hiện có. Không đổi grants, data/domain semantics, public Feedback consumer hoặc independent employee authority. Chỉ tạo delta specs sau review, không sửa main specs trực tiếp.

## Impact

Ảnh hưởng `apps/backoffice` và query Google/queue có scope trong `packages/db-cloud`, tests và current docs liên quan. UI_AFFECTING: YES; BROWSER_QA_REQUIRED: YES. Sensitive: authorization-adjacent, dữ liệu cloud và boundary giữa module. Không thay đổi database shape, package/dependency, runtime ownership hoặc permission grants. Các owning Product homes được reconcile trước Specs; chưa có runtime edits.

## REQUIREMENT_BASELINE

1. **Authoritative user requirement:** tiếp `release-a-customer-exposure-foundation`; RR-01–RR-03 trong `docs/PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions`; câu trả lời hiện tại: “Chốt profile A cho instance khách hàng; giữ chế độ nội bộ riêng”. Task xây dựng/kiểm chứng, chưa bật staging/production.
2. **Hard constraints:** CODEX_ONLY, gate qua reviewer read-only độc lập với fresh context; trusted server context và tenant/role/record boundaries giữ nguyên; French UI, reuse UI hiện có. COMMIT_AFTER_TASK: NOT_SELECTED; COMMIT_SELECTION_SOURCE: câu hỏi task hiện tại chưa được trả lời; không kế thừa YES từ task roadmap. Baseline clean `main`, HEAD `2dd5a02ba076a65928e2a80afe0b36d0d10284fd` trước khi tạo change.
3. **Out of scope:** importer/manual review sync/publisher Google, AI/Booking/Direct Feedback customer exposure, schema/migration, signup/wizard/email, sửa UI Users & Access ngoài tác động exposure, provider/compliance approval, deployment/activation, lifecycle/version promotion hoặc remote Git.
4. **Observable success outcomes:** A menu và direct entry chỉ cho phép slice đã chốt; deferred/API/action và DIRECT detail/mutation bị từ chối an toàn; Today count/preview/list đồng nhất kể cả STAFF assigned-only; A profile không tải Knowledge; setup/empty/recovery trung thực; internal regression giữ nguyên; required checks và Browser QA có evidence thật, không tuyên bố toàn bộ Foundation/customer readiness.

## Current exact analysis — candidate 3

# Change Analysis

## Scope and Change Type

Change hành vi, UI-affecting và sensitive do availability chạy cùng authorization và dữ liệu cloud trên nhiều module. Phạm vi là exposure foundation của năm bề mặt A trong một instance Backoffice khách hàng, với chế độ nội bộ riêng. Không triển khai cả chuỗi Google của Release A. Mode: CODEX_ONLY, sourced từ câu trả lời intake hiện tại; COMMIT_AFTER_TASK: NOT_SELECTED, chưa có câu trả lời cho task này. Không kế thừa lựa chọn commit của task roadmap.

## Sources Consulted

- [Root instructions](../../../AGENTS.md), [Backoffice instructions](../../../apps/backoffice/AGENTS.md), [documentation index](../../../docs/README.md), [Current State](../../../docs/CURRENT_STATE.md).
- [Authority Model](../../../docs/AUTHORITY_MODEL.md), [automated workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md#task-collaboration-and-delegated-review), [activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md).
- [Accepted RR-01–RR-03](../../../docs/PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions) và [sourced shaping handoff](../../../docs/reviews/release-roadmap-foundation/discovery-handoff.md#current-foundationa-shaping-continuation--2026-10-01).
- [Reputation](../../../docs/features/reputation/README.md), [Today](../../../docs/features/today/README.md), [basic profile](../../../docs/features/establishment/general-information/README.md), [Identity / Access](../../../docs/features/identity-access/README.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [lifecycle model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [ADR-005](../../../docs/decisions/ADR-005-today-operational-steering.md), [ADR-006](../../../docs/decisions/ADR-006-cloud-establishment-profile-context.md), [ADR-007](../../../docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md); [Establishment Profile main spec](../../specs/establishment-profile/spec.md), [Product Release identity main spec](../../specs/product-release/identity/spec.md), current Restaurant Knowledge authorization and pending-draft main specs.
- [UI governance](../../../docs/ui/README.md), [Backoffice frontend rules](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md), [Today page pack](../../../docs/ui/pages/today/README.md), [external design policy](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- Current authenticated layout/navigation, auth session/permissions, Today loader/components, Avis loader/actions, general-information loader/actions, Integrations/OAuth routes, user administration, deferred Booking/Personnel/Pointage routes/actions; [reputation repository](../../../packages/db-cloud/src/reputation-repository.ts), contracts and executable reputation schema.
- [Historical Users & Access QA failure](../../../docs/reviews/preserve-establishment-owner-invariant/qa/QA_REPORT.md#visualresponsive-findings), package manifests và pinned change metadata. Read-only inventory của hai agent là discovery evidence, không phải approval.

## Authority and Product Decision

RR-01–RR-03 là Product intent đã được Human chốt cho Foundation/A, không thay thế Product Truth toàn capability. User hiện tại yêu cầu tiếp task exposure và chọn CODEX_ONLY. Câu trả lời bổ sung: “Chốt profile A cho instance khách hàng; giữ chế độ nội bộ riêng”, cho đề xuất một profile A server-selected cho instance Backoffice; chỉ xây dựng/kiểm chứng, chưa bật staging/production. Không còn câu hỏi applicability của A.

Availability giới hạn chức năng được cung cấp; không cấp permission, không thay entitlement/membership và không thay Product Release identity. Các user chỉ vào slice được permission hiện hành cho phép. A gồm Today, Google Avis, profile cơ bản, OWNER Integrations, Users & Access cho actor được phép. Knowledge composition vẫn có owner/permissions riêng theo ADR-007; A chỉ expose profile slice, không bãi bỏ capability Knowledge trong internal.

Đã reconcile intent tại bốn Product homes hiện có trước Specs: Reputation `Accepted Foundation / Release A exception`, Today `Accepted Release A projection`, General Information `Accepted Release A exposure`, Identity / Access `Accepted Foundation / Release A access boundary`. Attribution liên kết roadmap và current-user instance choice trong Gate 1 request record. Giữ broader Avis/Today questions, lịch sử và lifecycle; không tạo roadmap cạnh tranh. Durable availability decision cần được ghi trong nguồn kiến trúc thích hợp khi Design xác định boundary, không tự đổi owner.

## Current Implemented State

Baseline clean `main`, HEAD `2dd5a02ba076a65928e2a80afe0b36d0d10284fd`; chỉ có planning/review files và bốn Product-home reconciliation thuộc task, chưa có runtime edits. Metadata và CLI `schemaName` đều `yuta-spec-driven`. CLI `planningHome.defaultSchema` hiển thị `spec-driven`, nhưng configured và pinned schema và artifact graph đều custom schema đúng; không sửa config hoặc dùng built-in artifacts.

Menu chỉ lọc permissions/entitlements; không có release availability policy. Authenticated layout không chặn deferred direct pages, và API/Server Actions có boundary riêng. `safeReturnTo` hiện chỉ kiểm tra local URL shape, chưa biết profile. Integrations có route hoạt động nhưng chưa có sidebar entry.

Today đọc Booking và cả Google/DIRECT, dùng unanswered counter và preview predicate khác RR-03. Avis nhận source query và selected detail độc lập; note/status actions có thể áp dụng DIRECT. Repository đã enforce organization/establishment và STAFF assigned-only; Google draft đã từ chối source khác. Counters không luôn áp dụng cùng status/search filter như list.

General Information tải/serialize cả sáu Knowledge sections và export nhiều Knowledge actions bên cạnh basic save; ẩn section UI đơn thuần chưa đủ. OAuth start/callback là setup/reconnect có checks riêng, cần giữ role/scope/provider state. Deferred Personnel export APIs và public Pointage routes nằm ngoài authenticated layout; Pointage có test-only independent employee boundary phải giữ trong internal.

Chưa có importer, review refresh, approve/publish operation hay import-run evidence. Connector binding hoặc inbox rỗng không chứng minh import thành công với zero reviews. Persisted Google rows cho phép usable local inbox; không chứng minh Google import provenance, remote unanswered hoặc provider publication. Chưa kiểm chứng deployed runtime, external provider hay candidate Browser QA.

## Affected Boundaries

- Runtime owner vẫn `apps/backoffice`; cloud persistence vẫn `packages/db-cloud`, organization/establishment predicates và trusted active membership bắt buộc.
- Availability server-selected là điều kiện thêm, độc lập authorization. DIRECT resource ID/source/query/action replay không được mở slice ngoài A. Deferred calls phải bị từ chối trước khi đọc/mutate payload; denial không tiết lộ resource.
- Today chỉ presentation/projection; source records, handling status và mutations vẫn thuộc Reputation. Queue không tạo workflow/state mới.
- Basic profile và Knowledge giữ data owner/grants riêng; A không đọc/serialize Knowledge hoặc gọi Knowledge mutation.
- Google setup giữ hiện có; task không gọi provider bằng dữ liệu thật, không import/publish hay cấp provider/compliance approval.
- POS, Site Agent, Display, public Booking/Feedback và Platform Admin không bị thay đổi. Backoffice-hosted deferred entry phải bị chặn trong A, không shutdown các app độc lập.
- Không schema/migration, new package, framework hoặc browser-trusted config. Profile configuration/recovery contract, fallback và rollout/rollback mechanics thuộc Design trong các boundary trên.

## Lifecycle Baseline

Đối với bounded exposure policy: Product intent đã chốt từ Human; implementation chưa có; environment chưa được bật/kiểm chứng; production readiness chưa được đánh giá bằng task này. Đây là analysis evidence, không ghi/promote registry values.

Module Registry hiện ghi Reputation inbox IMPLEMENTED/UNVERIFIED/BLOCKED; Google connector foundation IMPLEMENTED với provider/configuration BLOCKED; end-to-end import/publication NOT_STARTED. Broader V1 questions vẫn tồn tại ngoài exception A. Today presentation và basic profile có code hiện hành, không chứng minh customer readiness. Auth/access foundations không có automated invitation/reset email. Preserve tất cả lifecycle values, Google approval/privacy prerequisites, support/credential delivery prerequisites và historical Users & Access responsive QA FAIL. Không suy ra readiness từ gates/checks.

## Requirement Readiness

READY_FOR_SPECS. Có thể đặc tả profile availability, Google-only resource access, accepted queue, basic-only profile và recovery mà không thiết kế importer/publisher. Không sửa main specs trực tiếp. Proposal khai báo delta cho các normative entry bị ảnh hưởng, thay vì suy ra việc giữ grants đã đủ chứng minh compatibility. `skip_specs: true` không phù hợp.

### Exact main-spec compatibility disposition

Availability là tiền điều kiện cho hosted entry; các requirements hiện hành về hiển thị/read/save chỉ chạy khi entry đó khả dụng. Trong internal, tiền điều kiện thỏa và existing requirements vẫn áp dụng đầy đủ. Trong A, entry ngoài scope bị từ chối trước capability operation; grant evaluation và pure/persistence semantics không bị đổi. Vì existing observable scenarios chưa nêu tiền điều kiện này, các capability entry sau cần delta ADDED requirement rõ ràng áp dụng cho toàn bộ hosted UI/read/mutation scenarios, không chỉ prose suy luận:

| Existing main capability                       | Affected observable requirements / disposition                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `restaurant-knowledge/concept-history`         | `View sử dụng Restaurant Knowledge READ`, `Edit và explicit save sử dụng Restaurant Knowledge MANAGE`, empty/view/manual save scenarios: bổ sung hosted availability prerequisite; A không expose/read/save, internal giữ behavior.                                                                                                               |
| `restaurant-knowledge/cuisine-know-how`        | Các READ/MANAGE/view/empty/manual save requirements tương ứng: cùng prerequisite; không đổi ba values hoặc menus boundary.                                                                                                                                                                                                                        |
| `restaurant-knowledge/customer-experience`     | Các READ/MANAGE/view/empty/manual save requirements tương ứng: cùng prerequisite; không đổi descriptive values hoặc customer-data exclusions.                                                                                                                                                                                                     |
| `restaurant-knowledge/team-culture`            | Các READ/MANAGE/view/empty/manual save requirements tương ứng: cùng prerequisite; không đổi Personnel/Pointage/Formalités exclusions.                                                                                                                                                                                                             |
| `restaurant-knowledge/communication-identity`  | Các READ/MANAGE/view/empty/manual save requirements tương ứng: cùng prerequisite; không tạo Marketing/AI consumer.                                                                                                                                                                                                                                |
| `restaurant-knowledge/validated-knowledge`     | `READ và MANAGE là các operation độc lập`, `Current active list hỗ trợ trạng thái không có item` và manual create/edit/remove/save: hosted prerequisite bổ sung; canonical item/content/save semantics giữ nguyên.                                                                                                                                |
| `pointage/raw-clocking`                        | `Raw clocking sử dụng trusted cloud scope và online acceptance`, `Shared-device UI bảo toàn isolation và trung thực về operation state`: Backoffice employee page và bảy APIs unavailable trong A, kể cả có valid independent employee authority; internal vẫn cần tất cả runtime/provenance/credential guards. Không sửa raw domain transitions. |
| `formalites/persistent-draft-foundation`       | Hosted draft load/create/save/reopen/reconciliation và `Employee-connected capability được mở rộng mà không phá prototype hiện tại`: unavailable trong A cho cả employee-connected/prototype entry; internal giữ existing draft workflow và legal/Personnel scope.                                                                                |
| `reputation/review-social-links-configuration` | Backoffice Satisfaction settings section visibility/read/management và explicit save unavailable trong A; public feedback destinations vẫn hoạt động tại app độc lập, không đổi URL validation/persistence/grants.                                                                                                                                |

`authorization/formalites` cũng cần delta cho hosted generic-prototype access/navigation/UI trong `Existing Formalités prototype không đổi`; independent authorization evaluation và employee-connected grant semantics giữ nguyên. `authorization/pointage` cần delta cho usable hosted continuation/consumer và authorized committed receipt replay; availability là prerequisite trước hosted protected outcome, không đổi independent grant/credential evaluation. Clearing, expiry, reset/invalidation và non-enumeration protections tiếp tục áp dụng vô điều kiện. Gate 2 candidate 1 phát hiện hai exemption quá rộng này; sửa declaration và xin fresh Gate 1 trước tiếp Gate 2, không mở rộng Product scope.

Các main specs khác không cần delta cho task này: `authorization/restaurant-knowledge` giữ independent grant contract; `pointage/authority-foundation` giữ raw evidence/data ownership; `personnel/reconstructable-value-history` giữ repository history semantics; Formalités template/legal/platform-admin authorization foundations không có entry được mở bởi A và không đổi domain requirements. `establishment-profile` và `reputation/reply-draft-pending-feedback` vẫn áp dụng nguyên trạng cho allowed A slices; `product-release/identity` không là policy input. Deferred Booking/Personnel pages/actions/APIs chưa có normative availability contract; được cover bởi capability mới mà không đổi source domain. Không requirement nào được xóa hoặc weaken để fit implementation.

## UI / UX Applicability

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

Áp dụng current shell/components/French UI và Today page pack; không visual redesign hoặc rewrite sealed historical packs. Browser QA phải chạy route thật trên local/dev với synthetic/disposable data và OWNER/MANAGER/STAFF identities, desktop 1366x768, mobile 390x844, thêm viewport theo page-pack/breakpoint liên quan. QA cần coverage navigation, direct denial, allowed role states, Google count/list, basic-only sections, setup/empty/recovery, keyboard/overflow và internal regression. Screenshots có hash/manifest; server-only denials/query scoping cần tests riêng. Provider QA không được giả lập thành provider readiness.

UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE

Reason: functional exposure/data-boundary change, reuse existing approved UI patterns; không có câu hỏi visual design cần external advisory search.

Scope: Backoffice A shell, Today/Avis/profile/settings exposure và recovery.

Decision source: bounded user request/RR-03, current YUTA UI rules và Gate 1 review của record này.

## Conflicts and Unknowns

- Broad Product homes đã được qualify bằng sourced A-only RR exception trước Specs. Broader AVIS questions và lifecycle không đổi. Gate 1 candidate 1 CHANGES_REQUESTED được giữ trong packet; candidate sửa cần fresh independent verdict.
- NEEDS REVIEW ở Design: exact server configuration/default/invalid-config handling, route/action coverage và recovery. Không được thiết kế browser override hoặc implicit grant.
- Import state không có persisted evidence: exposure task phải diễn đạt chưa có import operation/provenance hoặc unavailable/unknown; không chế tạo successful-zero/import-failure state. Future importer sở hữu run states.
- Historical Users & Access mobile QA FAIL là Foundation dependency. Task không được sửa pre-existing layout ngoài exposure; nếu candidate required QA tái hiện FAIL thì giữ FAIL, dừng affected completion và xin bounded Human scope decision. Không self-waive QA.
- Chưa kiểm chứng disposable DB/browser setup. Missing setup cho flow thực là environment blocker, không NOT_APPLICABLE. Commit vẫn pending; không chặn authoring nhưng không cho stage/commit.
- Không có requirement-level CONFLICT/NEEDS REVIEW còn chặn specs; future provider/privacy/production acceptance nằm ngoài task.

## REQUIREMENT_BASELINE

1. **Authoritative user requirement:** tiếp task exposure, RR-01–RR-03 đã chốt và instance-customer A/internal decision hiện tại; build/test only, không activation.
2. **Hard constraints:** CODEX_ONLY với fresh independent reviewer mỗi routine gate; trusted tenant/permission/entitlement/record constraints; French UI/reuse; preserve unrelated HEAD work; COMMIT_AFTER_TASK NOT_SELECTED, nguồn là unanswered intake task hiện tại.
3. **Out of scope:** importer/manual sync/publisher, AI/Booking/DIRECT customer flow, schema/migration/signup/wizard/email, unrelated access UI repair, provider/compliance/deployment/lifecycle/version/remote Git.
4. **Observable success outcomes:** server-only A selection; menu/page/API/action slice đồng nhất; DIRECT/deferred denial; Google local queue count/preview/list cùng actor scope; basic-only no Knowledge load/mutation; truthful recovery/setup/empty; internal regression preserved; real checks and Browser QA with truthful limitations.

## Analysis Conclusion

READY_FOR_SPECS. Bounded `backoffice/release-a-customer-exposure` và mười một capability compatibility deltas được khai báo có thể viết sau Gate 1 independent approval. Sensitive Design gate bắt buộc trước Tasks/Apply; current analysis chưa chọn kiến trúc, không cấp apply/deploy hay production authority. Không dùng skip_specs.

## Historical candidate 2 packet — superseded approval

Historical approved packet SHA-256: f4efcd9589bb46f46108bcad96f51651dd836ff8183d8cc46e1aea34fa65be9f. Current Proposal/Analysis changes invalidate this approval; it does not authorize current Specs or later work.

```text
Change: release-a-customer-exposure-foundation
Gate: 1 — Proposal / Analysis
Review status: APPROVED
Created: 2026-10-01
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES
Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW
Mode selection source: current user CODEX_ONLY for release-a-customer-exposure-foundation, server-selected customer-instance A/internal, build/test only
Independent reviewer: /root/gate1_exposure_review_v2 (fresh read-only context)
Independent review evidence: APPROVED candidate 2; all seven identities reverified; permits Specs only
Approval recorded by: Codex workflow
Approved: 2026-10-01T11:52:56.3484906Z
```

## Request and delegation

Current user requests continuation of `release-a-customer-exposure-foundation`, selects `CODEX_ONLY — Codex tiến qua gate với reviewer độc lập`, and accepts `Chốt profile A cho instance khách hàng; giữ chế độ nội bộ riêng` for server-selected whole-instance A/customer versus internal modes, build/test only without staging/production activation. RR-01–RR-03 remain the bounded Product baseline. These are actual current-user directions, not reviewer-inferred authority.

COMMIT_AFTER_TASK: NOT_SELECTED
COMMIT_SELECTION_SOURCE: unanswered commit intake for this task; prior roadmap-task YES does not apply.

Baseline: clean main at 2dd5a02ba076a65928e2a80afe0b36d0d10284fd before creation. Only this change, review packet and four in-scope Product-home reconciliations are changed. No runtime edits.

## Requirement baseline and reviewed scope

Authoritative requirement, hard constraints, exclusions and observable outcomes are recorded verbatim in both artifacts below. The new availability capability and nine declared compatibility deltas must preserve all existing trusted context, authorization, record and data/runtime boundaries. Google importer/refresh/publisher and external/production readiness are excluded. Independent review must assess readiness for Specs only; no apply approval is requested at this gate.

## Authorities, conflicts and unknowns

The exact Analysis Sources Consulted, Authority and Product Decision, Conflicts and Unknowns below contain the canonical sources and sourced decisions. Broad Google V1 prose now has an attributable A-only reconciliation before Specs; broader questions remain. Configuration/default and route/action coverage belong to sensitive Design. Missing import-run evidence cannot support successful-zero or failure claims. Historical mobile Users & Access QA FAIL remains a dependency and cannot be waived or repaired outside scope. No requirement-level question remains unanswered; the reviewer must independently confirm this.

UI_AFFECTING: YES
BROWSER_QA_REQUIRED: YES
UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE
Reason: functional exposure/data-boundary change using existing approved UI patterns, without a visual design question.
Scope: Backoffice A shell, Today/Avis/profile/settings exposure and recovery.
Decision source: bounded user request/RR-03, current YUTA UI rules, proposed for acceptance at this gate.

## Artifact identity — candidate 2

SHA-256 over exact raw file bytes: `Get-FileHash -LiteralPath <path> -Algorithm SHA256`, lowercase results, sorted repository-relative paths.

| Path                                                                  | SHA-256                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/release-a-customer-exposure-foundation/analysis.md` | `bb779ddb2bd45ea4615f78212b4dd7cd8eba04ea2039a642e352e3d6b75beac8` |
| `openspec/changes/release-a-customer-exposure-foundation/proposal.md` | `0c2a47a71d84073b28e5ed465c25238553a22c021dd63cb9383b51a318be5ac7` |

## Product-home reconciliation evidence

Current source bytes reviewed for the accepted A-only exception. No lifecycle or main-spec edits. The nine compatibility deltas explicitly qualify hosted behavior before capability operations; existing grants and domain/persistence semantics remain. See the exact Analysis disposition table.

| Path                                                        | SHA-256                                                            |
| ----------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/features/establishment/general-information/README.md` | `518abd83927e7ec7dd61bde5675268646ca92de96ee5c14f7e794a50cbefc01d` |
| `docs/features/identity-access/README.md`                   | `5d519e120cead785ea27f89d2990c5db5ae50398127eba3db730c6aa9265772e` |
| `docs/features/reputation/README.md`                        | `2e2d14e33698bb667d1ea6f140930c1a593d65ee927ce7c4470b7187cd6f303c` |
| `docs/features/today/README.md`                             | `666315bc75371625bee357f94fc9a4fc5eb35af30e57b735615c79f88d4f8cd3` |

## Exact proposal content — candidate 2

## Why

RR-01–RR-03 đã chốt phạm vi Foundation/Release A, nhưng Backoffice hiện vẫn mở các module và dữ liệu ngoài A qua menu, deep link, API và Server Actions. Cần một profile khách hàng A do server chọn cho instance, độc lập với quyền truy cập, để năm bề mặt đã chốt có phạm vi nhất quán. Đây là nền tảng exposure, chưa phải toàn bộ Release A đã sẵn sàng.

## What Changes

- Thêm policy availability phía server cho profile `release-a` và chế độ `internal` riêng; browser không chọn hoặc mở rộng profile. Giữ các kiểm tra session, membership, permission, entitlement và record scope hiện có.
- Profile A chỉ mở Aujourd'hui, Google Avis, profile cơ bản, OWNER Google Integrations và Users & Access theo quyền hiện có. Chặn page/API/action ngoài A và cung cấp recovery phù hợp; bảo vệ cả các thao tác Knowledge nằm chung route profile.
- Google Avis chỉ đọc/chỉnh sửa bản ghi Google được phép, kể cả selected detail và gọi action trực tiếp. Today chỉ có Google: `new = NEW`; queue `NEW/TO_PROCESS/DRAFTED/FOLLOW_UP`; count, preview và linked list cùng source/status/actor scope.
- Profile cơ bản không đọc/serialize các section Restaurant Knowledge trong A. Menu, subsection, liên kết, return-to và trạng thái setup/empty dùng cùng phạm vi; không suy diễn import đã chạy hoặc provider reply từ dữ liệu local.
- Reconcile quyết định A trong các Product homes hiện có, bổ sung denial/regression tests và Browser QA cho candidate local với dữ liệu tổng hợp. Giữ chế độ nội bộ và các nguồn sự thật hiện có.

## Capabilities

### New Capabilities

- `backoffice/release-a-customer-exposure`: policy availability cho instance khách hàng A, các slice dữ liệu/thao tác và recovery nhất quán của năm bề mặt đã chốt.

### Modified Capabilities

- `restaurant-knowledge/concept-history`
- `restaurant-knowledge/cuisine-know-how`
- `restaurant-knowledge/customer-experience`
- `restaurant-knowledge/team-culture`
- `restaurant-knowledge/communication-identity`
- `restaurant-knowledge/validated-knowledge`
- `pointage/raw-clocking`
- `formalites/persistent-draft-foundation`
- `reputation/review-social-links-configuration`

Các capability trên nhận tiền điều kiện availability rõ ràng cho entry/UI/action/API do Backoffice host. Trong A các entry này không khả dụng; internal giữ requirements hiện có. Không đổi grants, data/domain semantics, public Feedback consumer hoặc independent employee authority. Chỉ tạo delta specs sau review, không sửa main specs trực tiếp.

## Impact

Ảnh hưởng `apps/backoffice` và query Google/queue có scope trong `packages/db-cloud`, tests và current docs liên quan. UI_AFFECTING: YES; BROWSER_QA_REQUIRED: YES. Sensitive: authorization-adjacent, dữ liệu cloud và boundary giữa module. Không thay đổi database shape, package/dependency, runtime ownership hoặc permission grants. Các owning Product homes được reconcile trước Specs; chưa có runtime edits.

## REQUIREMENT_BASELINE

1. **Authoritative user requirement:** tiếp `release-a-customer-exposure-foundation`; RR-01–RR-03 trong `docs/PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions`; câu trả lời hiện tại: “Chốt profile A cho instance khách hàng; giữ chế độ nội bộ riêng”. Task xây dựng/kiểm chứng, chưa bật staging/production.
2. **Hard constraints:** CODEX_ONLY, gate qua reviewer read-only độc lập với fresh context; trusted server context và tenant/role/record boundaries giữ nguyên; French UI, reuse UI hiện có. COMMIT_AFTER_TASK: NOT_SELECTED; COMMIT_SELECTION_SOURCE: câu hỏi task hiện tại chưa được trả lời; không kế thừa YES từ task roadmap. Baseline clean `main`, HEAD `2dd5a02ba076a65928e2a80afe0b36d0d10284fd` trước khi tạo change.
3. **Out of scope:** importer/manual review sync/publisher Google, AI/Booking/Direct Feedback customer exposure, schema/migration, signup/wizard/email, sửa UI Users & Access ngoài tác động exposure, provider/compliance approval, deployment/activation, lifecycle/version promotion hoặc remote Git.
4. **Observable success outcomes:** A menu và direct entry chỉ cho phép slice đã chốt; deferred/API/action và DIRECT detail/mutation bị từ chối an toàn; Today count/preview/list đồng nhất kể cả STAFF assigned-only; A profile không tải Knowledge; setup/empty/recovery trung thực; internal regression giữ nguyên; required checks và Browser QA có evidence thật, không tuyên bố toàn bộ Foundation/customer readiness.

## Exact analysis content — candidate 2

# Change Analysis

## Scope and Change Type

Change hành vi, UI-affecting và sensitive do availability chạy cùng authorization và dữ liệu cloud trên nhiều module. Phạm vi là exposure foundation của năm bề mặt A trong một instance Backoffice khách hàng, với chế độ nội bộ riêng. Không triển khai cả chuỗi Google của Release A. Mode: CODEX_ONLY, sourced từ câu trả lời intake hiện tại; COMMIT_AFTER_TASK: NOT_SELECTED, chưa có câu trả lời cho task này. Không kế thừa lựa chọn commit của task roadmap.

## Sources Consulted

- [Root instructions](../../../AGENTS.md), [Backoffice instructions](../../../apps/backoffice/AGENTS.md), [documentation index](../../../docs/README.md), [Current State](../../../docs/CURRENT_STATE.md).
- [Authority Model](../../../docs/AUTHORITY_MODEL.md), [automated workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md#task-collaboration-and-delegated-review), [activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md).
- [Accepted RR-01–RR-03](../../../docs/PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions) và [sourced shaping handoff](../../../docs/reviews/release-roadmap-foundation/discovery-handoff.md#current-foundationa-shaping-continuation--2026-10-01).
- [Reputation](../../../docs/features/reputation/README.md), [Today](../../../docs/features/today/README.md), [basic profile](../../../docs/features/establishment/general-information/README.md), [Identity / Access](../../../docs/features/identity-access/README.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [lifecycle model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [ADR-005](../../../docs/decisions/ADR-005-today-operational-steering.md), [ADR-006](../../../docs/decisions/ADR-006-cloud-establishment-profile-context.md), [ADR-007](../../../docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md); [Establishment Profile main spec](../../specs/establishment-profile/spec.md), [Product Release identity main spec](../../specs/product-release/identity/spec.md), current Restaurant Knowledge authorization and pending-draft main specs.
- [UI governance](../../../docs/ui/README.md), [Backoffice frontend rules](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md), [Today page pack](../../../docs/ui/pages/today/README.md), [external design policy](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- Current authenticated layout/navigation, auth session/permissions, Today loader/components, Avis loader/actions, general-information loader/actions, Integrations/OAuth routes, user administration, deferred Booking/Personnel/Pointage routes/actions; [reputation repository](../../../packages/db-cloud/src/reputation-repository.ts), contracts and executable reputation schema.
- [Historical Users & Access QA failure](../../../docs/reviews/preserve-establishment-owner-invariant/qa/QA_REPORT.md#visualresponsive-findings), package manifests và pinned change metadata. Read-only inventory của hai agent là discovery evidence, không phải approval.

## Authority and Product Decision

RR-01–RR-03 là Product intent đã được Human chốt cho Foundation/A, không thay thế Product Truth toàn capability. User hiện tại yêu cầu tiếp task exposure và chọn CODEX_ONLY. Câu trả lời bổ sung: “Chốt profile A cho instance khách hàng; giữ chế độ nội bộ riêng”, cho đề xuất một profile A server-selected cho instance Backoffice; chỉ xây dựng/kiểm chứng, chưa bật staging/production. Không còn câu hỏi applicability của A.

Availability giới hạn chức năng được cung cấp; không cấp permission, không thay entitlement/membership và không thay Product Release identity. Các user chỉ vào slice được permission hiện hành cho phép. A gồm Today, Google Avis, profile cơ bản, OWNER Integrations, Users & Access cho actor được phép. Knowledge composition vẫn có owner/permissions riêng theo ADR-007; A chỉ expose profile slice, không bãi bỏ capability Knowledge trong internal.

Đã reconcile intent tại bốn Product homes hiện có trước Specs: Reputation `Accepted Foundation / Release A exception`, Today `Accepted Release A projection`, General Information `Accepted Release A exposure`, Identity / Access `Accepted Foundation / Release A access boundary`. Attribution liên kết roadmap và current-user instance choice trong Gate 1 request record. Giữ broader Avis/Today questions, lịch sử và lifecycle; không tạo roadmap cạnh tranh. Durable availability decision cần được ghi trong nguồn kiến trúc thích hợp khi Design xác định boundary, không tự đổi owner.

## Current Implemented State

Baseline clean `main`, HEAD `2dd5a02ba076a65928e2a80afe0b36d0d10284fd`; chỉ có planning/review files và bốn Product-home reconciliation thuộc task, chưa có runtime edits. Metadata và CLI `schemaName` đều `yuta-spec-driven`. CLI `planningHome.defaultSchema` hiển thị `spec-driven`, nhưng configured và pinned schema và artifact graph đều custom schema đúng; không sửa config hoặc dùng built-in artifacts.

Menu chỉ lọc permissions/entitlements; không có release availability policy. Authenticated layout không chặn deferred direct pages, và API/Server Actions có boundary riêng. `safeReturnTo` hiện chỉ kiểm tra local URL shape, chưa biết profile. Integrations có route hoạt động nhưng chưa có sidebar entry.

Today đọc Booking và cả Google/DIRECT, dùng unanswered counter và preview predicate khác RR-03. Avis nhận source query và selected detail độc lập; note/status actions có thể áp dụng DIRECT. Repository đã enforce organization/establishment và STAFF assigned-only; Google draft đã từ chối source khác. Counters không luôn áp dụng cùng status/search filter như list.

General Information tải/serialize cả sáu Knowledge sections và export nhiều Knowledge actions bên cạnh basic save; ẩn section UI đơn thuần chưa đủ. OAuth start/callback là setup/reconnect có checks riêng, cần giữ role/scope/provider state. Deferred Personnel export APIs và public Pointage routes nằm ngoài authenticated layout; Pointage có test-only independent employee boundary phải giữ trong internal.

Chưa có importer, review refresh, approve/publish operation hay import-run evidence. Connector binding hoặc inbox rỗng không chứng minh import thành công với zero reviews. Persisted Google rows cho phép usable local inbox; không chứng minh Google import provenance, remote unanswered hoặc provider publication. Chưa kiểm chứng deployed runtime, external provider hay candidate Browser QA.

## Affected Boundaries

- Runtime owner vẫn `apps/backoffice`; cloud persistence vẫn `packages/db-cloud`, organization/establishment predicates và trusted active membership bắt buộc.
- Availability server-selected là điều kiện thêm, độc lập authorization. DIRECT resource ID/source/query/action replay không được mở slice ngoài A. Deferred calls phải bị từ chối trước khi đọc/mutate payload; denial không tiết lộ resource.
- Today chỉ presentation/projection; source records, handling status và mutations vẫn thuộc Reputation. Queue không tạo workflow/state mới.
- Basic profile và Knowledge giữ data owner/grants riêng; A không đọc/serialize Knowledge hoặc gọi Knowledge mutation.
- Google setup giữ hiện có; task không gọi provider bằng dữ liệu thật, không import/publish hay cấp provider/compliance approval.
- POS, Site Agent, Display, public Booking/Feedback và Platform Admin không bị thay đổi. Backoffice-hosted deferred entry phải bị chặn trong A, không shutdown các app độc lập.
- Không schema/migration, new package, framework hoặc browser-trusted config. Profile configuration/recovery contract, fallback và rollout/rollback mechanics thuộc Design trong các boundary trên.

## Lifecycle Baseline

Đối với bounded exposure policy: Product intent đã chốt từ Human; implementation chưa có; environment chưa được bật/kiểm chứng; production readiness chưa được đánh giá bằng task này. Đây là analysis evidence, không ghi/promote registry values.

Module Registry hiện ghi Reputation inbox IMPLEMENTED/UNVERIFIED/BLOCKED; Google connector foundation IMPLEMENTED với provider/configuration BLOCKED; end-to-end import/publication NOT_STARTED. Broader V1 questions vẫn tồn tại ngoài exception A. Today presentation và basic profile có code hiện hành, không chứng minh customer readiness. Auth/access foundations không có automated invitation/reset email. Preserve tất cả lifecycle values, Google approval/privacy prerequisites, support/credential delivery prerequisites và historical Users & Access responsive QA FAIL. Không suy ra readiness từ gates/checks.

## Requirement Readiness

READY_FOR_SPECS. Có thể đặc tả profile availability, Google-only resource access, accepted queue, basic-only profile và recovery mà không thiết kế importer/publisher. Không sửa main specs trực tiếp. Proposal khai báo delta cho các normative entry bị ảnh hưởng, thay vì suy ra việc giữ grants đã đủ chứng minh compatibility. `skip_specs: true` không phù hợp.

### Exact main-spec compatibility disposition

Availability là tiền điều kiện cho hosted entry; các requirements hiện hành về hiển thị/read/save chỉ chạy khi entry đó khả dụng. Trong internal, tiền điều kiện thỏa và existing requirements vẫn áp dụng đầy đủ. Trong A, entry ngoài scope bị từ chối trước capability operation; grant evaluation và pure/persistence semantics không bị đổi. Vì existing observable scenarios chưa nêu tiền điều kiện này, các capability entry sau cần delta ADDED requirement rõ ràng áp dụng cho toàn bộ hosted UI/read/mutation scenarios, không chỉ prose suy luận:

| Existing main capability                       | Affected observable requirements / disposition                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `restaurant-knowledge/concept-history`         | `View sử dụng Restaurant Knowledge READ`, `Edit và explicit save sử dụng Restaurant Knowledge MANAGE`, empty/view/manual save scenarios: bổ sung hosted availability prerequisite; A không expose/read/save, internal giữ behavior.                                                                                                               |
| `restaurant-knowledge/cuisine-know-how`        | Các READ/MANAGE/view/empty/manual save requirements tương ứng: cùng prerequisite; không đổi ba values hoặc menus boundary.                                                                                                                                                                                                                        |
| `restaurant-knowledge/customer-experience`     | Các READ/MANAGE/view/empty/manual save requirements tương ứng: cùng prerequisite; không đổi descriptive values hoặc customer-data exclusions.                                                                                                                                                                                                     |
| `restaurant-knowledge/team-culture`            | Các READ/MANAGE/view/empty/manual save requirements tương ứng: cùng prerequisite; không đổi Personnel/Pointage/Formalités exclusions.                                                                                                                                                                                                             |
| `restaurant-knowledge/communication-identity`  | Các READ/MANAGE/view/empty/manual save requirements tương ứng: cùng prerequisite; không tạo Marketing/AI consumer.                                                                                                                                                                                                                                |
| `restaurant-knowledge/validated-knowledge`     | `READ và MANAGE là các operation độc lập`, `Current active list hỗ trợ trạng thái không có item` và manual create/edit/remove/save: hosted prerequisite bổ sung; canonical item/content/save semantics giữ nguyên.                                                                                                                                |
| `pointage/raw-clocking`                        | `Raw clocking sử dụng trusted cloud scope và online acceptance`, `Shared-device UI bảo toàn isolation và trung thực về operation state`: Backoffice employee page và bảy APIs unavailable trong A, kể cả có valid independent employee authority; internal vẫn cần tất cả runtime/provenance/credential guards. Không sửa raw domain transitions. |
| `formalites/persistent-draft-foundation`       | Hosted draft load/create/save/reopen/reconciliation và `Employee-connected capability được mở rộng mà không phá prototype hiện tại`: unavailable trong A cho cả employee-connected/prototype entry; internal giữ existing draft workflow và legal/Personnel scope.                                                                                |
| `reputation/review-social-links-configuration` | Backoffice Satisfaction settings section visibility/read/management và explicit save unavailable trong A; public feedback destinations vẫn hoạt động tại app độc lập, không đổi URL validation/persistence/grants.                                                                                                                                |

Các main specs khác không cần delta cho task này: `authorization/restaurant-knowledge`, `authorization/formalites`, `authorization/pointage` giữ independent grant/credential contracts; `pointage/authority-foundation` giữ raw evidence/data ownership; `personnel/reconstructable-value-history` giữ repository history semantics; Formalités template/legal/platform-admin authorization foundations không có entry được mở bởi A và không đổi domain requirements. `establishment-profile` và `reputation/reply-draft-pending-feedback` vẫn áp dụng nguyên trạng cho allowed A slices; `product-release/identity` không là policy input. Deferred Booking/Personnel pages/actions/APIs chưa có normative availability contract; được cover bởi capability mới mà không đổi source domain. Không requirement nào được xóa hoặc weaken để fit implementation.

## UI / UX Applicability

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

Áp dụng current shell/components/French UI và Today page pack; không visual redesign hoặc rewrite sealed historical packs. Browser QA phải chạy route thật trên local/dev với synthetic/disposable data và OWNER/MANAGER/STAFF identities, desktop 1366x768, mobile 390x844, thêm viewport theo page-pack/breakpoint liên quan. QA cần coverage navigation, direct denial, allowed role states, Google count/list, basic-only sections, setup/empty/recovery, keyboard/overflow và internal regression. Screenshots có hash/manifest; server-only denials/query scoping cần tests riêng. Provider QA không được giả lập thành provider readiness.

UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE

Reason: functional exposure/data-boundary change, reuse existing approved UI patterns; không có câu hỏi visual design cần external advisory search.

Scope: Backoffice A shell, Today/Avis/profile/settings exposure và recovery.

Decision source: bounded user request/RR-03, current YUTA UI rules và Gate 1 review của record này.

## Conflicts and Unknowns

- Broad Product homes đã được qualify bằng sourced A-only RR exception trước Specs. Broader AVIS questions và lifecycle không đổi. Gate 1 candidate 1 CHANGES_REQUESTED được giữ trong packet; candidate sửa cần fresh independent verdict.
- NEEDS REVIEW ở Design: exact server configuration/default/invalid-config handling, route/action coverage và recovery. Không được thiết kế browser override hoặc implicit grant.
- Import state không có persisted evidence: exposure task phải diễn đạt chưa có import operation/provenance hoặc unavailable/unknown; không chế tạo successful-zero/import-failure state. Future importer sở hữu run states.
- Historical Users & Access mobile QA FAIL là Foundation dependency. Task không được sửa pre-existing layout ngoài exposure; nếu candidate required QA tái hiện FAIL thì giữ FAIL, dừng affected completion và xin bounded Human scope decision. Không self-waive QA.
- Chưa kiểm chứng disposable DB/browser setup. Missing setup cho flow thực là environment blocker, không NOT_APPLICABLE. Commit vẫn pending; không chặn authoring nhưng không cho stage/commit.
- Không có requirement-level CONFLICT/NEEDS REVIEW còn chặn specs; future provider/privacy/production acceptance nằm ngoài task.

## REQUIREMENT_BASELINE

1. **Authoritative user requirement:** tiếp task exposure, RR-01–RR-03 đã chốt và instance-customer A/internal decision hiện tại; build/test only, không activation.
2. **Hard constraints:** CODEX_ONLY với fresh independent reviewer mỗi routine gate; trusted tenant/permission/entitlement/record constraints; French UI/reuse; preserve unrelated HEAD work; COMMIT_AFTER_TASK NOT_SELECTED, nguồn là unanswered intake task hiện tại.
3. **Out of scope:** importer/manual sync/publisher, AI/Booking/DIRECT customer flow, schema/migration/signup/wizard/email, unrelated access UI repair, provider/compliance/deployment/lifecycle/version/remote Git.
4. **Observable success outcomes:** server-only A selection; menu/page/API/action slice đồng nhất; DIRECT/deferred denial; Google local queue count/preview/list cùng actor scope; basic-only no Knowledge load/mutation; truthful recovery/setup/empty; internal regression preserved; real checks and Browser QA with truthful limitations.

## Analysis Conclusion

READY_FOR_SPECS. Bounded `backoffice/release-a-customer-exposure` và chín capability compatibility deltas được khai báo có thể viết sau Gate 1 independent approval. Sensitive Design gate bắt buộc trước Tasks/Apply; current analysis chưa chọn kiến trúc, không cấp apply/deploy hay production authority. Không dùng skip_specs.

## Independent review — candidate 1

Reviewer: `/root/gate1_exposure_review`, fresh read-only context.
Verdict: CHANGES_REQUESTED. All three reviewed hashes matched.

1. Reconcile the four existing Product homes with the already accepted A-only
   decisions before dependent Specs, rather than deferring this to delivery.
2. Replace blanket main-spec compatibility with an exact disposition for six
   Knowledge content specs and deferred normative entry points, including
   Pointage. Make the availability precondition explicit or declare modified
   capabilities; do not edit main specs directly.

The reviewer accepted the other bounded baseline, UI/QA, sensitive Design and
external-design classification. No Product decision or broader implementation
authority was granted. Refresh exact artifacts and obtain a fresh independent
verdict after corrections. No runtime changes or checks ran in this review.

### Candidate 1 identities and correction scope

Proposal: 5edae0fad9d04a60ce36048f83b56b204e242a5a77b53e8ab15cd24dae574ec6; Analysis: 6f524488d368375bb211512139736aaf94eebfd469a1fb6fdb364e0345254674; packet at review: 6c3280e3c2a2efc35f32df66a8c9e5efd83e22fa681084b6358a07fce48dc586. In-scope corrections implement the two findings: four Product homes reconciled and exact normative compatibility disposition with nine declared delta capabilities. No new Product decision, runtime edit, check or gate approval.

## Recommendation

Obtain a fresh independent Gate 1 verdict on candidate 2 before Specs. Prior CHANGES_REQUESTED is preserved and grants no approval.

## Candidate 2 independent approval evidence

Reviewer /root/gate1_exposure_review_v2 returned APPROVED on exact candidate 2. No blocking Product, authority or requirement-readiness finding. Actual Specs must explicitly qualify every affected hosted UI/read/mutation scenario, including Pointage protected-state/replay/recovery APIs and Formalités recovery/reconciliation; ADDED syntax alone is insufficient. Authorization grants and data/domain semantics remain unchanged. Sensitive Design and real Browser QA remain mandatory; NOT_APPLICABLE external design accepted. All six artifact/source hashes above plus pre-approval packet 54af8c4b5786e832d65f7ee096ef4ad4f6e125b54b24ec4e240340e08da3cb42 matched again before approval recording. No evaluator/test/build/server/browser action ran in review. Next authorized action: Specs only.

```

```

## Candidate 3 independent approval evidence

Fresh reviewer `/root/gate1_exposure_review_v3` returned APPROVED for pre-approval packet `42091e6e1c1fc41de3f220c4d0efb21e06e925ea8c12646a724905957bfc516b`. All seven exact identities matched before recording. Two hosted authorization compatibility dispositions are sufficient while independent grant/credential/domain results and unconditional protections remain. Current Product baseline, scope and convergence assessment have no blocker. Current exact Proposal/Analysis embeddings match. Specs only; no approval of newly drafted deltas, Design, Tasks or Apply. Review performed no evaluator/runtime actions.
