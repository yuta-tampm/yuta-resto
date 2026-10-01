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
