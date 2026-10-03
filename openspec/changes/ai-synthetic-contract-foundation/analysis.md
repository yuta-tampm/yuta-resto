# Change Analysis

## Scope and Change Type

Planning-only cho Slice 1 trong [Proposal](proposal.md#requirement_baseline). Change dự kiến thêm behavioral boundary cho `ai/synthetic-personnel-contract-extraction`: eligibility trước provider effect, selection không vượt eligible set và API typed theo capability.

Impact: `CROSS_MODULE` ở mức domain Personnel và AI foundation bên trong một app cloud; không thêm consumer hoặc runtime. Đây là thay đổi security/Personnel/provider-sensitive nên cần sensitive Design Gate. Không database hoặc UI change. Tác vụ hiện tại chỉ tạo change artifacts và review packets, không Apply.

COLLABORATION_MODE: CODEX_ONLY

MODE_SELECTION_SOURCE: current-user intake reply ngày 2026-10-03: `Codex một mình (CODEX_ONLY)`.

COMMIT_AFTER_TASK: YES

COMMIT_SELECTION_SOURCE: current-user intake reply ngày 2026-10-03: `YES` cho local commit phần planning đã hoàn tất.

## Sources Consulted

- [Root AGENTS](../../../AGENTS.md), [Backoffice AGENTS](../../../apps/backoffice/AGENTS.md), [docs index](../../../docs/README.md), [current-state routing](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md) và [workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md).
- [Personnel Product Knowledge](../../../docs/features/personnel/README.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [lifecycle vocabulary](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Architecture](../../../docs/architecture/OVERVIEW.md), [tenancy](../../../docs/architecture/TENANCY.md), [database/runtime separation](../../../docs/architecture/DATABASE_BOUNDARIES.md), [accepted ADR-009 exposure](../../../docs/decisions/ADR-009-release-a-customer-exposure.md).
- [Production readiness](../../../docs/operations/PRODUCTION_READINESS.md), [OpenAI eligibility planning/evaluation history](../../../docs/operations/OPENAI_PROVIDER_ELIGIBILITY.md).
- [Personnel request/result schemas](../../../packages/contracts/src/personnel/index.ts), [service](../../../apps/backoffice/src/server/personnel-contract-extraction/service.ts), [runtime](../../../apps/backoffice/src/server/personnel-contract-extraction/runtime.ts), [upload loader](../../../apps/backoffice/src/server/personnel-contract-extraction/synthetic-upload.ts), [extraction actions](../../../apps/backoffice/src/app/%28authenticated%29/equipe/salaries/contract-extraction-actions.ts), [service tests](../../../apps/backoffice/test/personnel-contract-extraction-service.test.ts), [runtime tests](../../../apps/backoffice/test/personnel-contract-extraction-runtime.test.ts), và package manifests.

## Authority and Product Decision

Yêu cầu hiện tại đã giới hạn planning cho capability synthetic ở Proposal. Existing Personnel scope chỉ cho phép synthetic/development extraction; không có authority cho gửi real personnel files. Accepted runtime/tenancy/exposure boundaries tiếp tục kiểm soát change. Không cần quyết định provider mới để viết Slice 1 requirements.

Artifact review theo delegated mode là approval của exact planning candidate, không thay thế legal/privacy/provider/production approval. Change specs chưa normative; chỉ sync đã được cho phép riêng và validated mới có thể tạo main-spec authority. Không có sync trong tác vụ này.

## Current Implemented State

- Service parse request, gọi `authorizeAndResolve`, đối chiếu document/version và employee revision, consume rate limit rồi mới load/prepare PDF và invoke adapter. Result được strict-validate và đối chiếu request/page count.
- Runtime từ chối khi `NODE_ENV` khác `development`; deterministic synthetic là mặc định. Nhánh explicit `openai-synthetic` dùng adapter hiện có với Luna/v4; các scenario khác `complete` ở lại deterministic.
- Extraction actions sở hữu exposure/session/permissions, scoped repositories, requested/completed audit, review store và Human apply. Stored source có fixture allowlist và provider-once QA gate riêng. Không được bỏ những gate này khi tích hợp capability.
- Upload loader yêu cầu attestation `fictional-only`, giới hạn PDF và trì hoãn `arrayBuffer()` tới sau authorization. **Attestation không chứng minh nội dung đã anonymized hoặc thực sự không có dữ liệu thật.** Slice 1 không mở rộng loại nguồn được phép; chỉ server domain mới tạo classification sau các guard hiện có, browser không được truyền classification/purpose/deployment có authority.
- Chưa có capability registry typed, eligibility set hoặc selection invariant riêng. Existing tests xác lập nhiều guard nhưng chưa chứng minh các boundary mới.
- Tests chỉ được đọc ở giai đoạn discovery; chưa chạy regression hoặc provider trong tác vụ này. Repo evidence không chứng minh deployment hay qualification hiện hành.

## Affected Boundaries

- Runtime owner: Backoffice server; provider/config/secrets server-only.
- Data owner: Personnel tiếp tục sở hữu metadata, structured facts, authorization và Human apply; AI không mở DB/repository hoặc ghi domain state.
- Tenancy: validated session và active membership; organization + establishment predicates và document/employee revision không thay đổi. AI policy không thể cấp thêm Personnel permission.
- Exposure: ADR-009 giữ Personnel unavailable trong profile `release-a`; capability không được mở direct bypass.
- Provider: adapter hiện có chỉ trong synthetic development branch; planning/test offline không tạo provider request. Không suy ra retention/region/DPA từ model name hoặc `store:false`.
- POS/Site Agent/Display, canonical storage, migrations và transport/UI contract: không thay đổi.

## Lifecycle Baseline

Theo Personnel Home/Registry, employee dossier bounded có Product `APPROVED`, Implementation `IMPLEMENTED`, Environment `UNVERIFIED`, Production Readiness/External Dependency `BLOCKED`. Personnel Documents có implementation development-only nhưng dedicated Product/Registry decision chưa được xác lập (`NEEDS REVIEW`). Extraction hiện chỉ có local/synthetic evidence, không một production AI qualification.

Baseline này không chặn planning trong existing synthetic boundary. Foundation mới chưa implementation; không gán lifecycle chính thức hoặc nâng bất kỳ dimension nào. `VEND-01`, `AI-01`–`AI-04` và HR storage/scanning/readiness tiếp tục là governance authority cho các slice tương lai, không phải task checkbox của Slice 1.

## Requirement Readiness

`READY_FOR_SPECS`. Có thể viết precise scenarios cho typed capability, denial, eligibility/selection invariant, observation và bảo toàn review/apply bằng offline mocks. Đây là behavioral change dự kiến, không dùng `skip_specs: true`; planning-only delivery không biến behavioral target thành docs-only/no-spec target.

REQUIREMENT_BASELINE được giữ nguyên trong [Proposal](proposal.md#requirement_baseline); Specs/Design/Tasks không được tự mở rộng nó.

## UI / UX Applicability

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

Không đổi UI, routes, public action payload/result/error mapping hoặc interaction. Server denial mới được ánh xạ về safe failure/unavailable có sẵn. Nếu implementation cần đổi một observable UI contract, phải quay lại review scope trước khi sửa.

## Conflicts and Unknowns

- Không có requirement-level `CONFLICT` hoặc `NEEDS REVIEW` cho planning Slice 1. Đề xuất broader AI/Storage đã thống nhất không tạo quyền triển khai Storage, real-data qualification hoặc production.
- Provider qualification/live deployment chưa xác minh: cố ý ngoài scope và không cần để planning/offline acceptance. Không biến unknown thành approval.
- Synthetic-upload attestation là giới hạn trust hiện tại, không automated content classification. Giữ guard và operational fictional-data obligation; không tuyên bố khả năng phát hiện mọi file thật bị gắn nhãn sai.
- Dirty checkout đang có Formalités changes không liên quan; chỉ planning/review path allowlist của change mới được ghi và commit. Before Apply phải kiểm tra lại implementation path status.

## Analysis Conclusion

`READY_FOR_SPECS`

Bounded scope xác định; một new capability `ai/synthetic-personnel-contract-extraction` có thể đi tiếp sau Gate 1 độc lập. Không có requirement blocker. `skip_specs: false`. Sensitive Design bắt buộc trước Tasks. Kết thúc tác vụ ở planning-ready; Apply, sync/archive và production vẫn chưa được cho phép.
